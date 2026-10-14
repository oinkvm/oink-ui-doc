/* 假数据：全部由确定性的伪随机函数生成。同样的日期范围和对比方式，永远得到同样的数字。
 * 中英文两份在模块加载时一起生成（ANALYTICS.zh / ANALYTICS.en），数字完全一样，只有文字和格式不同；组件里用 useAnalytics() 取当前语言那份。 */
import { useLang } from '../../i18n';
import type { Lang } from '../../i18n';

export type CompareMode = 'prev' | 'yoy' | 'none';
export interface Range { start: Date; end: Date }

/** 演示用的“今天”，固定下来保证数据可复现 */
export const TODAY = new Date(2026, 9, 13);
const EPOCH = new Date(2024, 0, 1);
const DAY = 86400000;

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const dayIndex = (d: Date) => Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(EPOCH.getFullYear(), EPOCH.getMonth(), EPOCH.getDate())) / DAY);
export const fromIndex = (i: number) => addDays(EPOCH, i);
export const rangeLength = (r: Range) => dayIndex(r.end) - dayIndex(r.start) + 1;
export const lastDays = (n: number): Range => ({ start: addDays(TODAY, -(n - 1)), end: TODAY });

/* —— 伪随机 —— */
/** 整数 → [0, 1) 的散列（mulberry32 的一步） */
export function hash(n: number): number {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rand = (a: number, b = 0) => hash(a * 7919 + b * 104729);
const pick = <T,>(list: readonly T[], r: number): T => list[Math.min(list.length - 1, Math.floor(r * list.length))];

/* —— 格式化 —— */
const pad = (n: number) => String(n).padStart(2, '0');
/** 机器可读的日期（<time dateTime>），两种语言一样 */
export const fmtISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface Format {
  fmtInt: (n: number) => string;
  fmtMoney: (n: number) => string;
  /** 紧凑金额：¥128.4 万 / $1.28M */
  fmtMoneyShort: (n: number) => string;
  /** 图表纵轴上的金额刻度 */
  fmtMoneyAxis: (n: number) => string;
  fmtPct: (n: number, digits?: number) => string;
  /** 百分点：0.12 个百分点 / 0.12 pts */
  fmtPts: (n: number) => string;
  fmtDay: (d: Date) => string;
  fmtDayShort: (d: Date) => string;
  fmtDate: (d: Date) => string;
  fmtRange: (r: Range) => string;
}

const fmtPct = (n: number, digits = 1) => n.toFixed(digits) + '%';
const fmtDayShort = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

function makeFormat(lang: Lang): Format {
  if (lang === 'en') {
    const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
    const fmtMoney = (n: number) => '$' + fmtInt(n);
    const fmtDate = (d: Date) => `${MONTHS_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
    return {
      fmtInt, fmtMoney, fmtPct, fmtDayShort, fmtDate,
      fmtMoneyShort: (n) => {
        const a = Math.abs(n);
        if (a >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
        if (a >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
        if (a >= 1e3) return '$' + (a >= 1e5 ? fmtInt(n / 1e3) : (n / 1e3).toFixed(1)) + 'K';
        return fmtMoney(n);
      },
      fmtMoneyAxis: (v) => (v === 0 ? '0' : '$' + compact.format(v)),
      fmtPts: (n) => `${n.toFixed(2)} pts`,
      fmtDay: (d) => `${MONTHS_EN[d.getMonth()]} ${d.getDate()}`,
      fmtRange: (r) => `${fmtDate(r.start)} – ${fmtDate(r.end)}`,
    };
  }
  const fmtInt = (n: number) => Math.round(n).toLocaleString('zh-CN');
  const fmtMoney = (n: number) => '¥' + fmtInt(n);
  const fmtMoneyShort = (n: number) => {
    if (Math.abs(n) >= 1e8) return '¥' + (n / 1e8).toFixed(2) + ' 亿';
    if (Math.abs(n) >= 1e4) return '¥' + (Math.abs(n) >= 1e6 ? fmtInt(n / 1e4) : (n / 1e4).toFixed(1)) + ' 万';
    return fmtMoney(n);
  };
  return {
    fmtInt, fmtMoney, fmtMoneyShort, fmtPct, fmtDayShort,
    fmtMoneyAxis: (v) => (v === 0 ? '0' : fmtMoneyShort(v).replace('.0 ', '').replace(' ', '')),
    fmtPts: (n) => `${n.toFixed(2)} 个百分点`,
    fmtDay: (d) => `${d.getMonth() + 1}月${d.getDate()}日`,
    fmtDate: fmtISO,
    fmtRange: (r) => `${fmtISO(r.start)} 至 ${fmtISO(r.end)}`,
  };
}

/* —— 每日基础序列：趋势 × 周内波动 × 噪声 —— */
const weekdayFactor = (i: number) => {
  const wd = fromIndex(i).getDay();
  return wd === 0 ? 0.74 : wd === 6 ? 0.8 : wd === 1 ? 1.06 : wd === 2 ? 1.1 : 1;
};
const wave = (i: number, period: number) => 1 + 0.06 * Math.sin((i / period) * Math.PI * 2);
const dailyRevenue = (i: number) => Math.round((41000 + 58 * i) * weekdayFactor(i) * wave(i, 46) * (0.9 + 0.2 * rand(i, 1)));
const dailyActive = (i: number) => Math.round((7600 + 8.4 * i) * (0.55 + 0.45 * weekdayFactor(i)) * wave(i, 61) * (0.95 + 0.1 * rand(i, 2)));
const dailyNewSubs = (i: number) => Math.round((34 + 0.034 * i) * weekdayFactor(i) * (0.7 + 0.6 * rand(i, 3)));
const dailyChurned = (i: number) => Math.round((7 + 0.006 * i) * (0.5 + 1 * rand(i, 4)));
const subscriberBase = (i: number) => 3600 + 27 * i;

const sum = (from: number, to: number, fn: (i: number) => number) => { let s = 0; for (let i = from; i <= to; i++) s += fn(i); return s; };

function compareOffset(r: Range, mode: CompareMode): number | null {
  if (mode === 'none') return null;
  return mode === 'yoy' ? 364 : rangeLength(r);   // 364 = 52 周，保持星期对齐
}
export function compareRange(r: Range, mode: CompareMode): Range | null {
  const off = compareOffset(r, mode);
  return off === null ? null : { start: addDays(r.start, -off), end: addDays(r.end, -off) };
}

/* —— 指标 —— */
export interface Kpi {
  key: 'revenue' | 'active' | 'subs' | 'churn';
  label: string;
  value: string;
  raw: number;
  /** 对比期的值；不对比时为 null */
  previous: number | null;
  /** 变化百分比（流失率是百分点） */
  change: number | null;
  /** 涨是好事还是坏事 */
  positive: 'up' | 'down';
  /** pct：百分比；pts：百分点 */
  unit: 'pct' | 'pts';
}

function kpisFor(a: number, b: number) {
  const len = b - a + 1;
  return {
    revenue: sum(a, b, dailyRevenue),
    active: sum(a, b, dailyActive) / len,
    subs: sum(a, b, dailyNewSubs),
    churn: (sum(a, b, dailyChurned) / subscriberBase(a)) * (30 / len) * 100,
  };
}

/* —— 趋势 —— */
export interface TrendPoint {
  /** 轴上的短标签 */
  label: string;
  /** 完整说明：10月3日 或 9月29日 – 10月5日 */
  full: string;
  value: number;
  compare: number | null;
  compareFull: string | null;
}

/* —— 渠道 —— */
export type ChannelKey = 'organic' | 'paid' | 'referral' | 'direct' | 'social' | 'email';
export interface ChannelRow { key: string; name: string; value: number; share: number; compare: number | null; change: number | null }
const CHANNELS: ReadonlyArray<{ key: ChannelKey; w: number }> = [
  { key: 'organic', w: 0.31 },
  { key: 'paid', w: 0.22 },
  { key: 'referral', w: 0.17 },
  { key: 'direct', w: 0.14 },
  { key: 'social', w: 0.09 },
  { key: 'email', w: 0.07 },
];
function channelShares(a: number, b: number): number[] {
  const seed = a * 31 + b;
  const raw = CHANNELS.map((c, i) => c.w * (0.8 + 0.4 * rand(seed, 10 + i)));
  const total = raw.reduce((s, v) => s + v, 0);
  return raw.map((v) => v / total);
}

/* —— 留存 —— */
export interface CohortRow { key: string; label: string; full: string; size: number; rates: Array<number | null> }
const RETENTION_CURVE = [100, 63, 49, 42, 38, 35];
export const RETENTION_WEEKS = RETENTION_CURVE.length;

/* —— 订单 / 客户 —— */
export type Plan = 'starter' | 'team' | 'enterprise';
export type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed';
export type CustomerStatus = 'active' | 'trial' | 'risk' | 'churned';
export type Cycle = 'monthly' | 'yearly';
export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  plan: Plan;
  status: CustomerStatus;
  mrr: number;
  seats: number;
  region: string;
  joined: Date;
  health: number;
  channel: string;
}
export interface Order {
  id: string;
  customerId: string;
  customer: string;
  plan: Plan;
  cycle: Cycle;
  amount: number;
  status: OrderStatus;
  date: Date;
}

export const PLAN_LIST: readonly Plan[] = ['starter', 'team', 'enterprise'];
export const STATUS_LIST: readonly CustomerStatus[] = ['active', 'trial', 'risk', 'churned'];
export const ORDER_STATUS_LIST: readonly OrderStatus[] = ['paid', 'pending', 'refunded', 'failed'];
const PLAN_PRICE: Record<Plan, number> = { starter: 99, team: 49, enterprise: 89 };

/* —— 两种语言的文字：名称、标签、动态说明 —— */
interface Text {
  plan: Record<Plan, string>;
  customerStatus: Record<CustomerStatus, string>;
  orderStatus: Record<OrderStatus, string>;
  cycle: Record<Cycle, string>;
  channel: Record<ChannelKey, string>;
  regions: readonly string[];
  companyA: readonly string[];
  companyB: readonly string[];
  company: (a: string, b: string) => string;
  surnames: readonly string[];
  given: readonly string[];
  person: (surname: string, given: string) => string;
  kpi: Record<Kpi['key'], string>;
  cohortFull: (day: string) => string;
  /** 对比期的标题（图例、表头）和句子里的说法 */
  compareLabel: (mode: 'prev' | 'yoy', len: number) => string;
  compareRef: (mode: 'prev' | 'yoy', len: number) => string;
  /** 同比时，对比期的日期带上年份 */
  withYear: (span: string, year: number) => string;
  quarter: (year: number, q: number) => string;
  activity: {
    churn: [string, string];
    risk: (health: number) => [string, string];
    trial: [string, string];
    pay: string;
    up: (plan: string, seats: number) => [string, string];
    ticket: [string, string];
    join: (channel: string) => [string, string];
  };
}

const TEXT: Record<Lang, Text> = {
  zh: {
    plan: { starter: '入门版', team: '团队版', enterprise: '企业版' },
    customerStatus: { active: '活跃', trial: '试用中', risk: '流失风险', churned: '已流失' },
    orderStatus: { paid: '已支付', pending: '待支付', refunded: '已退款', failed: '支付失败' },
    cycle: { monthly: '月付', yearly: '年付' },
    channel: { organic: '自然搜索', paid: '付费广告', referral: '客户推荐', direct: '直接访问', social: '社交媒体', email: '邮件营销' },
    regions: ['华东', '华北', '华南', '西南', '华中', '海外'],
    companyA: ['青禾', '北辰', '云杉', '松果', '知更', '星野', '白鹭', '栖木', '山岚', '流萤', '南枝', '砚池', '半夏', '鹿鸣', '听潮', '归雁', '拾光', '望舒', '初岚'],
    companyB: ['科技', '数据', '网络', '智能', '教育', '医疗', '物流', '传媒', '设计', '零售', '软件', '咨询'],
    company: (a, b) => a + b,
    surnames: ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '林', '何', '高'],
    given: ['思远', '晓雯', '子涵', '嘉怡', '一鸣', '雨桐', '浩然', '静怡', '梓轩', '欣妍', '明哲', '可馨', '俊杰', '诗琪', '文博'],
    person: (s, g) => s + g,
    kpi: { revenue: '收入', active: '日均活跃用户', subs: '新增订阅', churn: '月流失率' },
    cohortFull: (day) => `${day}当周注册`,
    compareLabel: (mode, len) => (mode === 'yoy' ? '去年同期' : `前 ${len} 天`),
    compareRef: (mode, len) => (mode === 'yoy' ? '去年同期' : `前 ${len} 天`),
    withYear: (span, year) => `${year}年${span}`,
    quarter: (year, q) => `${year} 年第 ${q} 季度`,
    activity: {
      churn: ['订阅已取消', '取消原因：预算调整'],
      risk: (h) => ['活跃度连续三周下降', `健康分降至 ${h}`],
      trial: ['试用进行中', '已邀请 3 位成员、创建 2 个看板'],
      pay: '续费成功',
      up: (plan, seats) => [`升级到${plan}`, `席位增加到 ${seats} 个`],
      ticket: ['提交了一个工单', '导出报表时偶发超时，已解决'],
      join: (channel) => ['注册账号', `来源：${channel}`],
    },
  },
  en: {
    plan: { starter: 'Starter', team: 'Team', enterprise: 'Enterprise' },
    customerStatus: { active: 'Active', trial: 'Trial', risk: 'At risk', churned: 'Churned' },
    orderStatus: { paid: 'Paid', pending: 'Pending', refunded: 'Refunded', failed: 'Failed' },
    cycle: { monthly: 'Monthly', yearly: 'Annual' },
    // 条形图左侧只留 76px 给名称，英文用短名
    channel: { organic: 'Organic', paid: 'Paid ads', referral: 'Referral', direct: 'Direct', social: 'Social', email: 'Email' },
    regions: ['Northeast', 'Midwest', 'South', 'Southwest', 'West', 'International'],
    companyA: ['Greenleaf', 'Polaris', 'Spruce', 'Pinecone', 'Robin', 'Starfield', 'Egret', 'Perch', 'Ridgemist', 'Firefly', 'Southbranch', 'Inkstone', 'Midsummer', 'Deerfield', 'Tidewater', 'Homeward', 'Gleam', 'Moonrise', 'Daybreak'],
    companyB: ['Tech', 'Data', 'Networks', 'AI', 'Learning', 'Health', 'Logistics', 'Media', 'Design', 'Retail', 'Software', 'Consulting'],
    company: (a, b) => `${a} ${b}`,
    surnames: ['Walker', 'Bennett', 'Carter', 'Hayes', 'Brooks', 'Reed', 'Foster', 'Hughes', 'Price', 'Ellis', 'Shaw', 'Palmer', 'Quinn', 'Morgan', 'Grant'],
    given: ['Ethan', 'Olivia', 'Noah', 'Emma', 'Liam', 'Ava', 'Lucas', 'Mia', 'Owen', 'Chloe', 'Henry', 'Grace', 'Leo', 'Zoe', 'Miles'],
    person: (s, g) => `${g} ${s}`,
    kpi: { revenue: 'Revenue', active: 'Avg. daily active users', subs: 'New subscriptions', churn: 'Monthly churn' },
    cohortFull: (day) => `Signed up the week of ${day}`,
    compareLabel: (mode, len) => (mode === 'yoy' ? 'Same period last year' : `Previous ${len} days`),
    compareRef: (mode, len) => (mode === 'yoy' ? 'the same period last year' : `the previous ${len} days`),
    withYear: (span, year) => `${span}, ${year}`,
    quarter: (year, q) => `Q${q} ${year}`,
    activity: {
      churn: ['Subscription canceled', 'Reason: budget cuts'],
      risk: (h) => ['Activity down three weeks in a row', `Health score dropped to ${h}`],
      trial: ['Trial in progress', 'Invited 3 members and created 2 dashboards'],
      pay: 'Renewal paid',
      up: (plan, seats) => [`Upgraded to ${plan}`, `Seats increased to ${seats}`],
      ticket: ['Opened a support ticket', 'Occasional timeouts when exporting reports; resolved'],
      join: (channel) => ['Signed up', `Source: ${channel}`],
    },
  },
};

/* —— 目标 —— */
export interface Goals {
  quarterLabel: string;
  quarterRevenue: number;
  quarterTarget: number;
  quarterElapsed: number;
  subs: number;
  subsTarget: number;
  activation: number;
  nps: number;
}

export interface Dashboard {
  range: Range;
  compare: Range | null;
  /** 对比期的标题：图例、表头里用 */
  compareLabel: string;
  /** 对比期在句子里的说法：“较{compareRef}” / “vs. {compareRef}” */
  compareRef: string;
  granularity: 'day' | 'week';
  kpis: Kpi[];
  trend: TrendPoint[];
  channels: ChannelRow[];
  cohorts: CohortRow[];
  orders: Order[];
  goals: Goals;
}

/* —— 客户详情：动态与账单（按客户确定性生成） —— */
export interface ActivityItem { key: string; title: string; description?: string; date: Date; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent' }
export interface Invoice { id: string; date: Date; amount: number; status: OrderStatus }

const pct = (now: number, before: number) => (before === 0 ? 0 : ((now - before) / before) * 100);

export interface AnalyticsData extends Format {
  /** 标签：套餐、状态、付费周期 */
  L: Pick<Text, 'plan' | 'customerStatus' | 'orderStatus' | 'cycle'>;
  CUSTOMERS: Customer[];
  REGION_LIST: readonly string[];
  customerById: (id: string) => Customer | undefined;
  buildDashboard: (range: Range, mode: CompareMode) => Dashboard;
  customerActivity: (c: Customer) => ActivityItem[];
  customerInvoices: (c: Customer) => Invoice[];
}

function build(lang: Lang): AnalyticsData {
  const T = TEXT[lang];
  const F = makeFormat(lang);
  const { fmtInt, fmtMoney, fmtMoneyShort, fmtPct: pctText, fmtDay } = F;

  const CUSTOMERS: Customer[] = Array.from({ length: 57 }, (_, i) => {
    const r = (k: number) => rand(i + 1, 20 + k);
    const name = T.company(T.companyA[i % T.companyA.length], T.companyB[(Math.floor(i / T.companyA.length) * 4 + (i % T.companyA.length)) % T.companyB.length]);
    const plan: Plan = r(1) < 0.36 ? 'starter' : r(1) < 0.8 ? 'team' : 'enterprise';
    const seats = plan === 'starter' ? 1 + Math.floor(r(2) * 4) : plan === 'team' ? 6 + Math.floor(r(2) * 40) : 60 + Math.floor(r(2) * 380);
    const s = r(3);
    const status: CustomerStatus = s < 0.62 ? 'active' : s < 0.77 ? 'trial' : s < 0.91 ? 'risk' : 'churned';
    const mrr = status === 'trial' || status === 'churned' ? 0 : PLAN_PRICE[plan] * seats;
    const health = status === 'churned' ? 8 + Math.floor(r(4) * 20) : status === 'risk' ? 28 + Math.floor(r(4) * 22) : status === 'trial' ? 50 + Math.floor(r(4) * 30) : 64 + Math.floor(r(4) * 36);
    return {
      id: 'C' + String(1001 + i),
      name,
      contact: T.person(pick(T.surnames, r(5)), pick(T.given, r(6))),
      email: `contact${i + 1}@example.com`,
      plan, status, mrr, seats,
      region: pick(T.regions, r(7)),
      joined: addDays(TODAY, -(status === 'trial' ? 2 + Math.floor(r(8) * 12) : 30 + Math.floor(r(8) * 900))),
      health,
      channel: T.channel[pick(CHANNELS, r(9)).key],
    };
  });

  function ordersFor(a: number, b: number): Order[] {
    const len = b - a + 1;
    const count = Math.min(72, Math.max(12, Math.round(len * 1.6)));
    const seed = a * 17 + b * 3;
    const list: Order[] = [];
    for (let k = 0; k < count; k++) {
      const r = (j: number) => rand(seed + k, 40 + j);
      const c = CUSTOMERS[Math.floor(r(1) * CUSTOMERS.length)];
      const cycle: Cycle = r(2) < 0.3 ? 'yearly' : 'monthly';
      const base = Math.max(99, PLAN_PRICE[c.plan] * c.seats);
      const s = r(3);
      list.push({
        id: 'SO-' + String(26000 + ((a * 13 + k * 37) % 9000)).padStart(5, '0') + String.fromCharCode(65 + (k % 26)),
        customerId: c.id,
        customer: c.name,
        plan: c.plan,
        cycle,
        amount: cycle === 'yearly' ? Math.round(base * 12 * 0.85) : base,
        status: s < 0.74 ? 'paid' : s < 0.87 ? 'pending' : s < 0.95 ? 'refunded' : 'failed',
        date: fromIndex(b - Math.floor(r(4) * r(4) * len)),
      });
    }
    return list.sort((x, y) => y.date.getTime() - x.date.getTime() || x.id.localeCompare(y.id));
  }

  function buildDashboard(range: Range, mode: CompareMode): Dashboard {
    const a = dayIndex(range.start);
    const b = dayIndex(range.end);
    const len = b - a + 1;
    const off = compareOffset(range, mode);
    const cmp = compareRange(range, mode);

    // 指标
    const now = kpisFor(a, b);
    const before = off === null ? null : kpisFor(a - off, b - off);
    const kpis: Kpi[] = [
      { key: 'revenue', label: T.kpi.revenue, value: fmtMoneyShort(now.revenue), raw: now.revenue, previous: before?.revenue ?? null, change: before ? pct(now.revenue, before.revenue) : null, positive: 'up', unit: 'pct' },
      { key: 'active', label: T.kpi.active, value: fmtInt(now.active), raw: now.active, previous: before?.active ?? null, change: before ? pct(now.active, before.active) : null, positive: 'up', unit: 'pct' },
      { key: 'subs', label: T.kpi.subs, value: fmtInt(now.subs), raw: now.subs, previous: before?.subs ?? null, change: before ? pct(now.subs, before.subs) : null, positive: 'up', unit: 'pct' },
      { key: 'churn', label: T.kpi.churn, value: pctText(now.churn, 2), raw: now.churn, previous: before?.churn ?? null, change: before ? now.churn - before.churn : null, positive: 'down', unit: 'pts' },
    ];

    // 趋势：超过 92 天按周聚合
    const weekly = len > 92;
    const step = weekly ? 7 : 1;
    const trend: TrendPoint[] = [];
    // 从终点往回切，保证最后一个桶是完整的（不完整的那一段落在最前面）
    for (let j = b - Math.floor((b - a) / step) * step; j <= b; j += step) {
      const i = Math.max(a, j - step + 1);
      const d0 = fromIndex(i), d1 = fromIndex(j);
      const full = weekly && j > i ? `${fmtDay(d0)} – ${fmtDay(d1)}` : fmtDay(d0);
      const c0 = off === null ? null : fromIndex(i - off);
      const c1 = off === null ? null : fromIndex(j - off);
      const cSpan = c0 && c1 ? (weekly && j > i ? `${fmtDay(c0)} – ${fmtDay(c1)}` : fmtDay(c0)) : null;
      trend.push({
        label: F.fmtDayShort(d0),
        full,
        value: sum(i, j, dailyRevenue),
        compare: off === null ? null : sum(i - off, j - off, dailyRevenue),
        compareFull: c0 && cSpan !== null ? (mode === 'yoy' ? T.withYear(cSpan, c0.getFullYear()) : cSpan) : null,
      });
    }

    // 渠道
    const shares = channelShares(a, b);
    const cmpShares = off === null ? null : channelShares(a - off, b - off);
    const channels: ChannelRow[] = CHANNELS.map((c, i) => {
      const value = now.revenue * shares[i];
      const compare = before && cmpShares ? before.revenue * cmpShares[i] : null;
      return { key: c.key, name: T.channel[c.key], value, share: shares[i] * 100, compare, change: compare === null ? null : pct(value, compare) };
    }).sort((x, y) => y.value - x.value);

    // 留存：以范围终点所在周为最新一批，往前共 6 批
    const endMonday = b - ((fromIndex(b).getDay() + 6) % 7);
    const cohorts: CohortRow[] = [];
    for (let k = RETENTION_WEEKS - 1; k >= 0; k--) {
      const w = endMonday - k * 7;
      const d = fromIndex(w);
      cohorts.push({
        key: String(w),
        label: F.fmtDayShort(d),
        full: T.cohortFull(fmtDay(d)),
        size: Math.round(sum(w, Math.min(w + 6, b), dailyNewSubs) * 3.4),
        rates: RETENTION_CURVE.map((base, n) => {
          if (n > k) return null;   // 这一批还没活到第 n 周
          if (n === 0) return 100;
          return Math.max(5, Math.min(99, Math.round((base + (rand(w, 60 + n) - 0.5) * 12 + (rand(w, 59) - 0.5) * 8) * 10) / 10));
        }),
      });
    }

    // 目标：按范围终点所在季度
    const end = range.end;
    const q = Math.floor(end.getMonth() / 3);
    const qStart = dayIndex(new Date(end.getFullYear(), q * 3, 1));
    const qEnd = dayIndex(new Date(end.getFullYear(), q * 3 + 3, 0));
    const qRevenue = sum(qStart, b, dailyRevenue);
    const qFull = sum(qStart, qEnd, (i) => (41000 + 58 * i) * 0.93);
    const goals: Goals = {
      quarterLabel: T.quarter(end.getFullYear(), q + 1),
      quarterRevenue: qRevenue,
      quarterTarget: Math.round((qFull * 1.04) / 10000) * 10000,
      quarterElapsed: ((b - qStart + 1) / (qEnd - qStart + 1)) * 100,
      subs: now.subs,
      subsTarget: Math.round((len * (34 + 0.034 * b) * 1.02) / 10) * 10,
      activation: 58 + rand(a + b, 70) * 22,
      nps: Math.round(38 + rand(a + b, 71) * 24),
    };

    return {
      range, compare: cmp,
      compareLabel: mode === 'none' ? '' : T.compareLabel(mode, len),
      compareRef: mode === 'none' ? '' : T.compareRef(mode, len),
      granularity: weekly ? 'week' : 'day', kpis, trend, channels, cohorts, orders: ordersFor(a, b), goals,
    };
  }

  function customerActivity(c: Customer): ActivityItem[] {
    const n = Number(c.id.slice(1));
    const age = dayIndex(TODAY) - dayIndex(c.joined);
    const at = (frac: number) => addDays(TODAY, -Math.max(0, Math.round(age * frac)));
    const A = T.activity;
    const item = (key: string, [title, description]: [string, string], date: Date, tone: ActivityItem['tone']): ActivityItem => ({ key, title, description, date, tone });
    const items: ActivityItem[] = [];
    if (c.status === 'churned') items.push(item('churn', A.churn, at(0.04), 'danger'));
    if (c.status === 'risk') items.push(item('risk', A.risk(c.health), at(0.03), 'warning'));
    if (c.status === 'trial') items.push(item('trial', A.trial, at(0.2), 'info'));
    if (c.mrr > 0) items.push(item('pay', [A.pay, `${fmtMoney(c.mrr)} · ${T.plan[c.plan]}`], at(0.08), 'success'));
    if (c.plan !== 'starter' && rand(n, 80) > 0.35) items.push(item('up', A.up(T.plan[c.plan], c.seats), at(0.35), 'accent'));
    if (rand(n, 81) > 0.4) items.push(item('ticket', A.ticket, at(0.55), 'neutral'));
    items.push(item('join', A.join(c.channel), c.joined, 'neutral'));
    return items.sort((x, y) => y.date.getTime() - x.date.getTime());
  }

  function customerInvoices(c: Customer): Invoice[] {
    if (c.status === 'trial') return [];
    const n = Number(c.id.slice(1));
    const months = Math.min(6, Math.max(1, Math.floor((dayIndex(TODAY) - dayIndex(c.joined)) / 30)));
    const price = Math.max(99, PLAN_PRICE[c.plan] * c.seats);
    return Array.from({ length: months }, (_, k) => ({
      id: `INV-${n}-${String(months - k).padStart(2, '0')}`,
      date: addDays(TODAY, -(k * 30 + (n % 9))),
      amount: price,
      status: (k === 0 && c.status === 'risk' ? 'pending' : rand(n, 90 + k) > 0.95 ? 'refunded' : 'paid') as OrderStatus,
    }));
  }

  return {
    ...F,
    L: { plan: T.plan, customerStatus: T.customerStatus, orderStatus: T.orderStatus, cycle: T.cycle },
    CUSTOMERS,
    REGION_LIST: T.regions,
    customerById: (id) => CUSTOMERS.find((c) => c.id === id),
    buildDashboard,
    customerActivity,
    customerInvoices,
  };
}

/** 两种语言的数据，模块加载时一起生成；数字完全相同 */
export const ANALYTICS: Record<Lang, AnalyticsData> = { zh: build('zh'), en: build('en') };
/** 当前语言的数据与格式化函数 */
export const useAnalytics = () => ANALYTICS[useLang()];
