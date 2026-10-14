import { formatISODate, parseISODate } from 'oink-ui';
import { useLang } from '../../i18n';
import type { Lang } from '../../i18n';

/* ------------------------------------------------------------------ 类型 */

export type Status = 'backlog' | 'todo' | 'doing' | 'review' | 'done';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type ViewMode = 'list' | 'board';

export interface Member { id: string; name: string; role: string }
export interface Project { id: string; name: string; prefix: string; tone: Tone; summary: string }
export interface TaskComment { id: string; authorId: string; text: string; at: string }
export interface TaskActivity { id: string; actorId: string; text: string; at: string; tone?: Tone }

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string | null;
  projectId: string;
  /** yyyy-MM-dd */
  due: string | null;
  /** 标签的显示名（当前语言） */
  labels: string[];
  comments: TaskComment[];
  activity: TaskActivity[];
  createdAt: string;
}

/** 侧栏选中的范围 */
export type Scope = { kind: 'all' } | { kind: 'mine' } | { kind: 'week' } | { kind: 'project'; id: string };

export interface Filters { query: string; statuses: string[]; assignees: string[]; priorities: string[] }
export const EMPTY_FILTERS: Filters = { query: '', statuses: [], assignees: [], priorities: [] };
export const hasFilters = (f: Filters) => f.query.trim() !== '' || f.statuses.length > 0 || f.assignees.length > 0 || f.priorities.length > 0;

/*
 * 文字分中英两份：[中文, English]。不带文字的部分（值、色调、排序、编号）只有一份。
 * 按语言组装好的整套字典见下面的 TrackerData，组件里用 useData() 取当前语言的那份。
 */
type L = [zh: string, en: string];
const tx = (lang: Lang, [zh, en]: L) => (lang === 'en' ? en : zh);

/* ------------------------------------------------------------------ 字典 */

const STATUS_DEFS: Array<{ value: Status; tone: Tone; label: L; hint: L }> = [
  { value: 'backlog', tone: 'neutral', label: ['待规划', 'Backlog'], hint: ['还没排进迭代', 'Not scheduled yet'] },
  { value: 'todo', tone: 'info', label: ['待开始', 'To do'], hint: ['已排期，等人接手', 'Scheduled, waiting for an owner'] },
  { value: 'doing', tone: 'accent', label: ['进行中', 'In progress'], hint: ['正在处理', 'Being worked on'] },
  { value: 'review', tone: 'warning', label: ['评审中', 'In review'], hint: ['等待评审或验收', 'Waiting for review or sign-off'] },
  { value: 'done', tone: 'success', label: ['已完成', 'Done'], hint: ['已经合入或上线', 'Merged or shipped'] },
];
export const STATUS_ORDER: Status[] = STATUS_DEFS.map((s) => s.value);

const PRIORITY_DEFS: Array<{ value: Priority; tone: Tone; rank: number; label: L }> = [
  { value: 'urgent', tone: 'danger', rank: 0, label: ['紧急', 'Urgent'] },
  { value: 'high', tone: 'warning', rank: 1, label: ['高', 'High'] },
  { value: 'medium', tone: 'info', rank: 2, label: ['中', 'Medium'] },
  { value: 'low', tone: 'neutral', rank: 3, label: ['低', 'Low'] },
];

export const ME = 'lin';
const MEMBER_DEFS: Array<{ id: string; name: L; role: L }> = [
  { id: 'lin', name: ['林知夏', 'Lena Hart'], role: ['产品经理', 'Product manager'] },
  { id: 'zhou', name: ['周屿', 'Owen Brooks'], role: ['前端工程师', 'Frontend engineer'] },
  { id: 'chen', name: ['陈墨', 'Marcus Reed'], role: ['后端工程师', 'Backend engineer'] },
  { id: 'su', name: ['苏晚晴', 'Sophie Lane'], role: ['设计师', 'Designer'] },
  { id: 'xu', name: ['许嘉树', 'Ethan Cole'], role: ['测试工程师', 'QA engineer'] },
  { id: 'gu', name: ['顾南乔', 'Grace Moore'], role: ['运营', 'Operations'] },
];
export const UNASSIGNED = 'none';

const PROJECT_DEFS: Array<{ id: string; prefix: string; tone: Tone; name: L; summary: L }> = [
  { id: 'app', prefix: 'APP', tone: 'accent', name: ['移动端 3.0', 'Mobile 3.0'], summary: ['新版首页、消息中心与离线能力', 'New home feed, message center and offline support'] },
  { id: 'web', prefix: 'WEB', tone: 'info', name: ['官网改版', 'Website redesign'], summary: ['品牌升级后的官网与定价页', 'The post-rebrand website and pricing page'] },
  { id: 'pay', prefix: 'PAY', tone: 'success', name: ['支付与结算', 'Payments & billing'], summary: ['对账、退款与发票链路', 'Reconciliation, refunds and invoicing'] },
  { id: 'ops', prefix: 'OPS', tone: 'warning', name: ['内部工具', 'Internal tools'], summary: ['运营后台和发布流程', 'The ops console and release pipeline'] },
];

type LabelKey = 'bug' | 'feature' | 'ux' | 'perf' | 'design' | 'docs' | 'debt' | 'feedback';
const LABEL_DEFS: Array<{ key: LabelKey; tone: Tone; name: L }> = [
  { key: 'bug', tone: 'danger', name: ['缺陷', 'Bug'] },
  { key: 'feature', tone: 'accent', name: ['功能', 'Feature'] },
  { key: 'ux', tone: 'info', name: ['体验优化', 'UX polish'] },
  { key: 'perf', tone: 'warning', name: ['性能', 'Performance'] },
  { key: 'design', tone: 'accent', name: ['设计', 'Design'] },
  { key: 'docs', tone: 'neutral', name: ['文档', 'Docs'] },
  { key: 'debt', tone: 'neutral', name: ['技术债', 'Tech debt'] },
  { key: 'feedback', tone: 'success', name: ['客户反馈', 'Customer feedback'] },
];

/* ------------------------------------------------------------------ 日期 */

const DAY = 86400000;
export const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
/** 相对今天的日期（yyyy-MM-dd） */
export const dayFromNow = (offset: number) => formatISODate(new Date(startOfToday().getTime() + offset * DAY));
/** 相对现在的时间戳（ISO），hours 为负表示过去 */
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** 不带年份的短日期：10月14日 / Oct 14 */
const shortDate = (lang: Lang, d: Date) => (lang === 'en' ? `${MONTHS_EN[d.getMonth()]} ${d.getDate()}` : `${d.getMonth() + 1}月${d.getDate()}日`);

export function isDueThisWeek(due: string | null) {
  if (!due) return false;
  const date = parseISODate(due);
  if (!date) return false;
  const diff = Math.round((date.getTime() - startOfToday().getTime()) / DAY);
  return diff <= 7;
}

/* ------------------------------------------------------------------ 假数据 */

let seq = 0;
export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${++seq}`;

type Seed = [
  id: string, title: L, status: Status, priority: Priority, assignee: string | null, due: number | null, labels: LabelKey[],
  description: L, comments?: Array<[author: string, text: L, hoursAgo: number]>,
];

const SEEDS: Seed[] = [
  ['APP-214', ['首页信息流改为瀑布流布局', 'Switch the home feed to a masonry layout'], 'doing', 'high', 'zhou', 2, ['feature', 'design'],
    ['新版首页用两列瀑布流替换现在的单列卡片。需要处理图片未加载时的占位高度，避免滚动时跳动；低端机上关掉入场动效。',
      'Replace the single-column cards on the new home screen with a two-column masonry grid. Reserve placeholder height while images load so the feed doesn’t jump on scroll, and turn off entrance animations on low-end devices.'],
    [['su', ['设计稿已经更新到 v4，卡片间距统一成 12，圆角 20。', 'Mocks are updated to v4: card gap is 12 everywhere, corner radius 20.'], 30],
      ['zhou', ['收到。占位高度我按接口里的宽高比算，没有的话先按 4:3。', 'Got it. I’ll size the placeholders from the aspect ratio in the API response and fall back to 4:3 when it’s missing.'], 26],
      ['lin', ['周四评审前能出一个可以点的包吗？', 'Can we get a build to click through before Thursday’s review?'], 5]]],
  ['APP-215', ['消息中心支持按类型筛选', 'Filter the message center by type'], 'todo', 'medium', 'zhou', 6, ['feature'],
    ['消息中心顶部加一排筛选：全部、互动、系统、订单。筛选状态在本次会话内保持，重新进入 App 后恢复为“全部”。',
      'Add a row of filters to the top of the message center: All, Mentions, System, Orders. The choice sticks for the session and resets to “All” the next time the app opens.']],
  ['APP-209', ['弱网下发送图片偶发重复上传', 'Images occasionally upload twice on a weak connection'], 'review', 'urgent', 'chen', 0, ['bug', 'feedback'],
    ['弱网环境下点一次发送，服务端偶尔收到两条相同的图片消息。初步判断是客户端超时重试没有带幂等键。',
      'On a poor network, tapping Send once sometimes delivers two identical image messages. Likely cause: the client retries on timeout without an idempotency key.'],
    [['xu', ['稳定复现路径：限速到 50kb/s，发一张 3MB 以上的图，大约五次能出一次。', 'Reliable repro: throttle to 50 kb/s and send an image over 3 MB. It happens about one time in five.'], 50],
      ['chen', ['已经加上幂等键，重试不会再落两条。PR 提了，麻烦看一下。', 'Added an idempotency key, so a retry no longer creates a second message. PR is up, please take a look.'], 8]]],
  ['APP-221', ['离线草稿箱：本地保存未发送的内容', 'Offline drafts: keep unsent content on the device'], 'backlog', 'medium', null, null, ['feature'],
    ['没有网络时写的内容先存在本地，恢复网络后提示用户继续发送。需要先和后端确认草稿是否要跨设备同步。',
      'Anything written while offline is saved locally, and the user is prompted to send it once the connection is back. Check with the backend team first whether drafts should sync across devices.']],
  ['APP-198', ['启动耗时优化：冷启动压到 1.2 秒以内', 'Startup time: get cold start under 1.2s'], 'doing', 'high', 'chen', 4, ['perf'],
    ['目前中端机冷启动约 1.9 秒。计划：延后非首屏 SDK 初始化、首页接口预取、启动图换成矢量。',
      'Cold start on mid-range phones is about 1.9s. Plan: defer SDK setup that isn’t needed for the first screen, prefetch the home API, and switch the splash image to a vector.'],
    [['chen', ['延后初始化之后降到 1.5 秒了，剩下的主要在首页接口。', 'Deferring the SDK setup got it down to 1.5s. Most of what’s left is the home API call.'], 20]]],
  ['APP-226', ['深色模式下部分图标对比度不够', 'Some icons lack contrast in dark mode'], 'todo', 'low', 'su', 9, ['ux', 'design'],
    ['设置页、订单详情里有几枚灰色图标在深色背景上几乎看不见，需要整体过一遍并换成语义色。',
      'A few gray icons in Settings and Order details are nearly invisible on a dark background. Audit them all and switch to semantic colors.']],
  ['APP-187', ['登录页接入一键登录', 'Add one-tap sign-in to the login screen'], 'done', 'high', 'zhou', -6, ['feature'],
    ['接入运营商一键登录，失败时回落到短信验证码。', 'Integrate carrier one-tap sign-in, falling back to an SMS code if it fails.'],
    [['xu', ['三大运营商都测过了，回落逻辑正常。', 'Tested on all three major carriers, and the fallback works.'], 150]]],
  ['APP-230', ['推送点击后跳转到错误的会话', 'Tapping a push notification opens the wrong conversation'], 'todo', 'urgent', 'zhou', 1, ['bug'],
    ['同时收到多条推送时，点击较早的一条会打开最新一条对应的会话。怀疑是通知 ID 被后来的覆盖了。',
      'When several notifications arrive together, tapping an older one opens the conversation for the newest. Suspect the notification ID gets overwritten by later ones.']],
  ['APP-233', ['个人主页增加“最近访问”模块', 'Add a “Recently viewed” section to the profile page'], 'backlog', 'low', null, null, ['feature', 'feedback'],
    ['多位用户反馈找不到刚看过的内容。先做最近 20 条，支持一键清空。',
      'Several users say they can’t find things they just looked at. Start with the last 20 items and a one-tap clear.']],

  ['WEB-88', ['定价页重新设计：突出团队版', 'Redesign the pricing page around the Team plan'], 'review', 'high', 'su', 1, ['design'],
    ['三档定价改为两档加“联系销售”，团队版放在中间并默认高亮。年付和月付的切换要有价格滚动动画。',
      'Go from three tiers to two plus “Contact sales”, with Team in the middle and highlighted by default. Switching between annual and monthly billing should roll the prices.'],
    [['lin', ['团队版的卖点顺序调一下：协作 > 权限 > 审计。', 'Reorder the Team selling points: collaboration > permissions > audit log.'], 28],
      ['su', ['改好了，另外补了窄屏的稿子。', 'Done, and I added mocks for narrow screens.'], 22]]],
  ['WEB-91', ['官网首屏加载时间超过 3 秒', 'Homepage hero takes over 3 seconds to load'], 'doing', 'urgent', 'zhou', -1, ['perf', 'bug'],
    ['首屏的主视觉视频没有做懒加载，移动网络下 LCP 超过 3 秒。先换成静态封面，点击后再加载视频。',
      'The hero video isn’t lazy-loaded, so LCP goes past 3 seconds on mobile networks. Show a static poster first and load the video on click.'],
    [['gu', ['投放那边反馈跳出率这周涨了不少，能不能优先处理？', 'The ads team says bounce rate jumped this week. Can we prioritize this?'], 40],
      ['zhou', ['今天先上静态封面的版本，视频懒加载明天补。', 'Shipping the static poster today; video lazy-loading follows tomorrow.'], 36]]],
  ['WEB-93', ['客户案例页接入内容管理后台', 'Move customer stories to the CMS'], 'todo', 'medium', 'chen', 8, ['feature'],
    ['案例内容目前写死在代码里，每次更新都要发版。改为从内容后台读取，并支持草稿预览。',
      'Case studies are hard-coded, so every edit needs a release. Load them from the CMS instead, with draft previews.']],
  ['WEB-95', ['补全英文版的隐私政策与服务条款', 'Publish the translated privacy policy and terms'], 'backlog', 'low', 'gu', 14, ['docs'],
    ['法务已经给出英文稿，需要排版、加锚点目录，并在页脚补上入口。',
      'Legal has delivered the translated text. It needs layout, an anchored table of contents, and links in the footer.']],
  ['WEB-84', ['博客文章支持代码高亮与目录', 'Code highlighting and a table of contents for blog posts'], 'done', 'medium', 'zhou', -9, ['feature', 'ux'],
    ['长文章右侧显示目录并随滚动高亮；代码块支持复制。',
      'Long posts get a table of contents on the right that highlights as you scroll; code blocks get a copy button.']],
  ['WEB-97', ['表单提交后没有成功反馈', 'No confirmation after submitting the form'], 'todo', 'high', 'zhou', 3, ['bug', 'ux'],
    ['“预约演示”表单提交成功后页面没有任何变化，用户会重复提交。需要加成功状态并禁用按钮。',
      'Nothing changes after the “Book a demo” form is submitted, so people submit again. Add a success state and disable the button.'],
    [['gu', ['昨天一个客户连着提交了四次……', 'One customer submitted it four times in a row yesterday…'], 12]]],
  ['WEB-99', ['品牌色更新后的全站走查', 'Site-wide audit after the brand color change'], 'backlog', 'medium', 'su', null, ['design', 'debt'],
    ['品牌色从橙色调整为琥珀色，需要走查全站的按钮、链接、插画，列出还在用旧色值的地方。',
      'The brand color moved from orange to amber. Go through buttons, links and illustrations across the site and list everything still using the old values.']],

  ['PAY-141', ['退款原路返回失败时的兜底流程', 'Fallback when a refund to the original payment method fails'], 'doing', 'urgent', 'chen', 2, ['feature'],
    ['原支付渠道退款失败（卡已注销、超过退款期限等）时，转人工并支持退到余额。需要财务确认记账口径。',
      'When the original channel rejects a refund (card closed, refund window passed, etc.), route it to support and allow refunding to account balance. Finance needs to confirm how it’s booked.'],
    [['lin', ['财务确认了：退到余额的部分单独记一个科目。', 'Finance confirmed: refunds to balance go to their own ledger account.'], 18],
      ['chen', ['好的，我把科目加到对账单里。', 'OK, I’ll add that account to the reconciliation statement.'], 16]]],
  ['PAY-144', ['对账单导出支持按商户筛选', 'Filter statement exports by merchant'], 'review', 'medium', 'chen', 3, ['feature', 'feedback'],
    ['导出对话框里增加商户多选，默认全选；数据量大时改为异步导出并邮件通知。',
      'Add a merchant multi-select to the export dialog, all selected by default. Large exports run in the background and send an email when ready.']],
  ['PAY-147', ['发票抬头校验规则过严', 'Invoice company name validation is too strict'], 'todo', 'medium', 'xu', 5, ['bug', 'feedback'],
    ['带括号的公司名被判为不合法。按税务系统的规则放宽：允许中英文括号、间隔号。',
      'Company names with parentheses are rejected. Relax the check to match the tax system: allow parentheses, ampersands and periods.']],
  ['PAY-139', ['支付结果页轮询改为长连接推送', 'Replace polling on the payment result page with push'], 'done', 'high', 'chen', -4, ['perf', 'debt'],
    ['轮询在高峰期给订单服务带来明显压力，改为推送并保留轮询作为降级方案。',
      'Polling puts noticeable load on the order service at peak times. Switch to push and keep polling as a fallback.'],
    [['xu', ['压测通过，高峰期订单服务的请求量降了六成。', 'Load test passed: peak requests to the order service dropped by 60%.'], 110]]],
  ['PAY-150', ['分账规则配置页', 'Revenue split settings page'], 'backlog', 'high', null, 20, ['feature'],
    ['平台、商户、渠道三方分账比例可配置，支持按生效时间排期，并保留修改记录。',
      'Make the split between platform, merchant and channel configurable, schedulable by effective date, with a change history.']],
  ['PAY-152', ['微信支付回调验签偶发失败', 'Payment webhook signature check fails intermittently'], 'doing', 'high', 'chen', 0, ['bug'],
    ['证书轮换期间旧证书的回调会验签失败。需要同时保留新旧两张证书一段时间。',
      'During certificate rotation, callbacks signed with the old certificate fail verification. Keep both certificates valid for a transition period.']],

  ['OPS-61', ['发布流程接入灰度开关', 'Add a canary switch to the release pipeline'], 'review', 'high', 'chen', 4, ['feature', 'debt'],
    ['每次发布默认 5% 灰度，观察 30 分钟核心指标无异常后自动放量，异常时一键回滚。',
      'Every release starts at 5%, ramps up automatically if core metrics look normal after 30 minutes, and rolls back in one click if they don’t.']],
  ['OPS-63', ['运营后台的用户搜索太慢', 'User search in the ops console is too slow'], 'todo', 'medium', 'chen', 7, ['perf'],
    ['按手机号搜索用户要等 4–5 秒。给手机号加索引，并把模糊匹配改为前缀匹配。',
      'Looking up a user by phone number takes 4–5 seconds. Index the phone column and switch fuzzy matching to prefix matching.'],
    [['gu', ['客服同学每天要搜上百次，拜托了。', 'Support runs this search hundreds of times a day. Please!'], 60]]],
  ['OPS-58', ['新人上手文档：本地环境搭建', 'Onboarding doc: setting up a local environment'], 'done', 'low', 'xu', -12, ['docs'],
    ['整理从拉代码到跑通全部服务的步骤，常见报错单独列一节。',
      'Write down every step from cloning the repo to running all services, with a separate section for common errors.']],
  ['OPS-66', ['每周数据周报自动生成', 'Generate the weekly metrics report automatically'], 'backlog', 'low', 'gu', null, ['feature'],
    ['周一早上自动汇总上周的新增、留存、营收，发到运营群，并附上环比变化。',
      'Every Monday morning, summarize last week’s signups, retention and revenue, post it to the ops channel, and include the week-over-week change.']],
  ['OPS-67', ['权限系统：按项目授予只读访问', 'Permissions: grant read-only access per project'], 'todo', 'high', 'lin', 5, ['feature'],
    ['外部协作方只能看到被授权的项目，且不能导出数据。需要梳理现有的角色并补一份权限矩阵。',
      'External collaborators should only see the projects they’re granted, and can’t export data. Review the existing roles and write up a permission matrix.'],
    [['lin', ['权限矩阵初稿放在共享盘了，大家有空看看。', 'The first draft of the permission matrix is on the shared drive. Have a look when you can.'], 9]]],
  ['OPS-69', ['清理三个月以上未使用的特性开关', 'Remove feature flags unused for three months or more'], 'backlog', 'medium', 'zhou', null, ['debt'],
    ['目前有四十多个特性开关，其中一半已经全量。列清单、确认负责人，分批删除。',
      'We have over forty feature flags and half of them are fully rolled out. List them, confirm owners, and delete in batches.']],
];

/* ------------------------------------------------------------------ 按语言组装 */

export interface TrackerData {
  lang: Lang;
  STATUSES: Array<{ value: Status; label: string; tone: Tone; hint: string }>;
  PRIORITIES: Array<{ value: Priority; label: string; tone: Tone; rank: number }>;
  MEMBERS: Member[];
  PROJECTS: Project[];
  /** 标签显示名，按固定顺序 */
  LABELS: string[];
  LABEL_TONE: Record<string, Tone>;
  statusOf: (v: Status) => TrackerData['STATUSES'][number];
  priorityOf: (v: Priority) => TrackerData['PRIORITIES'][number];
  memberOf: (id: string | null) => Member | null;
  projectOf: (id: string) => Project;
  /** “（我）”这样跟在名字后面的标注 */
  meName: (m: Member) => string;
  dueInfo: (due: string | null, status?: Status) => { text: string; tone: Tone; overdue: boolean };
  timeAgo: (iso: string) => string;
  scopeTitle: (scope: Scope) => { title: string; description: string };
  matchesFilters: (task: Task, f: Filters) => boolean;
  createSeedTasks: () => Task[];
  /** 活动记录里的话，前面会接上操作人的名字 */
  act: {
    created: string;
    commented: string;
    assigned: (name: string) => string;
    unassigned: string;
    status: (label: string) => string;
    priority: (label: string) => string;
    due: (date: string) => string;
    dueCleared: string;
    labels: (labels: string[]) => string;
    labelsCleared: string;
  };
}

function buildData(lang: Lang): TrackerData {
  const en = lang === 'en';
  const STATUSES = STATUS_DEFS.map((s) => ({ value: s.value, tone: s.tone, label: tx(lang, s.label), hint: tx(lang, s.hint) }));
  const PRIORITIES = PRIORITY_DEFS.map((p) => ({ value: p.value, tone: p.tone, rank: p.rank, label: tx(lang, p.label) }));
  const MEMBERS = MEMBER_DEFS.map((m) => ({ id: m.id, name: tx(lang, m.name), role: tx(lang, m.role) }));
  const PROJECTS = PROJECT_DEFS.map((p) => ({ id: p.id, prefix: p.prefix, tone: p.tone, name: tx(lang, p.name), summary: tx(lang, p.summary) }));
  const labelName = new Map(LABEL_DEFS.map((l) => [l.key, tx(lang, l.name)] as const));
  const LABELS = LABEL_DEFS.map((l) => tx(lang, l.name));
  const LABEL_TONE = Object.fromEntries(LABEL_DEFS.map((l) => [tx(lang, l.name), l.tone]));

  const statusOf = (v: Status) => STATUSES.find((s) => s.value === v)!;
  const priorityOf = (v: Priority) => PRIORITIES.find((p) => p.value === v)!;
  const memberOf = (id: string | null) => MEMBERS.find((m) => m.id === id) ?? null;
  const projectOf = (id: string) => PROJECTS.find((p) => p.id === id)!;

  const act: TrackerData['act'] = en
    ? {
      created: 'created the task',
      commented: 'left a comment',
      assigned: (name) => `assigned it to ${name}`,
      unassigned: 'removed the assignee',
      status: (label) => `set status to “${label}”`,
      priority: (label) => `set priority to “${label}”`,
      due: (date) => `set the due date to ${date}`,
      dueCleared: 'cleared the due date',
      labels: (labels) => `set labels to ${labels.join(', ')}`,
      labelsCleared: 'cleared the labels',
    }
    : {
      created: '创建了任务',
      commented: '发表了评论',
      assigned: (name) => `指派给 ${name}`,
      unassigned: '取消了指派',
      status: (label) => `将状态改为「${label}」`,
      priority: (label) => `将优先级改为「${label}」`,
      due: (date) => `将截止日期改为 ${date}`,
      dueCleared: '清除了截止日期',
      labels: (labels) => `将标签改为 ${labels.join('、')}`,
      labelsCleared: '清空了标签',
    };

  function dueInfo(due: string | null, status?: Status): { text: string; tone: Tone; overdue: boolean } {
    if (!due) return { text: en ? 'Not set' : '未设置', tone: 'neutral', overdue: false };
    const date = parseISODate(due);
    if (!date) return { text: due, tone: 'neutral', overdue: false };
    const diff = Math.round((date.getTime() - startOfToday().getTime()) / DAY);
    const short = shortDate(lang, date);
    if (status === 'done') return { text: short, tone: 'neutral', overdue: false };
    if (diff < 0) return { text: en ? `${-diff} ${-diff === 1 ? 'day' : 'days'} overdue` : `逾期 ${-diff} 天`, tone: 'danger', overdue: true };
    if (diff === 0) return { text: en ? 'Today' : '今天', tone: 'warning', overdue: false };
    if (diff === 1) return { text: en ? 'Tomorrow' : '明天', tone: 'warning', overdue: false };
    if (diff <= 6) return { text: en ? `In ${diff} days` : `${diff} 天后`, tone: 'neutral', overdue: false };
    return { text: short, tone: 'neutral', overdue: false };
  }

  function timeAgo(iso: string): string {
    const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (mins < 1) return en ? 'just now' : '刚刚';
    if (mins < 60) return en ? `${mins}m ago` : `${mins} 分钟前`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return en ? `${hours}h ago` : `${hours} 小时前`;
    const days = Math.round(hours / 24);
    if (days < 30) return en ? `${days}d ago` : `${days} 天前`;
    return shortDate(lang, new Date(iso));
  }

  function scopeTitle(scope: Scope): { title: string; description: string } {
    if (scope.kind === 'mine') return en ? { title: 'Assigned to me', description: 'Every task assigned to you' } : { title: '分配给我', description: '指派给你的全部任务' };
    if (scope.kind === 'week') return en ? { title: 'Due this week', description: 'Open tasks due within seven days, or already overdue' } : { title: '本周到期', description: '七天内到期或已经逾期、还没完成的任务' };
    if (scope.kind === 'project') { const p = projectOf(scope.id); return { title: p.name, description: p.summary }; }
    return en ? { title: 'All tasks', description: 'Tasks from every project in the workspace' } : { title: '全部任务', description: '工作区里所有项目的任务' };
  }

  function matchesFilters(task: Task, f: Filters): boolean {
    if (f.statuses.length && !f.statuses.includes(task.status)) return false;
    if (f.priorities.length && !f.priorities.includes(task.priority)) return false;
    if (f.assignees.length && !f.assignees.includes(task.assigneeId ?? UNASSIGNED)) return false;
    const q = f.query.trim().toLowerCase();
    if (q) {
      const hay = [task.id, task.title, task.description, memberOf(task.assigneeId)?.name, ...task.labels].filter(Boolean).join(' ').toLowerCase();
      if (!q.split(/\s+/).every((word) => hay.includes(word))) return false;
    }
    return true;
  }

  function createSeedTasks(): Task[] {
    return SEEDS.map(([id, title, status, priority, assigneeId, due, labels, description, comments = []], i) => {
      const prefix = id.split('-')[0];
      const project = PROJECTS.find((p) => p.prefix === prefix)!;
      const created = hoursAgo(24 * (20 - (i % 14)) + i * 3);
      const activity: TaskActivity[] = [{ id: `${id}-a0`, actorId: ME, text: act.created, at: created }];
      if (assigneeId) activity.push({ id: `${id}-a1`, actorId: ME, text: act.assigned(memberOf(assigneeId)!.name), at: created });
      if (status !== 'backlog') {
        activity.push({ id: `${id}-a2`, actorId: assigneeId ?? ME, text: act.status(statusOf(status).label), at: hoursAgo(6 + (i % 9) * 11), tone: statusOf(status).tone });
      }
      return {
        id, title: tx(lang, title), description: tx(lang, description), status, priority, assigneeId, projectId: project.id,
        due: due === null ? null : dayFromNow(due), labels: labels.map((k) => labelName.get(k)!),
        comments: comments.map(([authorId, text, h], ci) => ({ id: `${id}-c${ci}`, authorId, text: tx(lang, text), at: hoursAgo(h) })),
        activity, createdAt: created,
      };
    });
  }

  return {
    lang, STATUSES, PRIORITIES, MEMBERS, PROJECTS, LABELS, LABEL_TONE,
    statusOf, priorityOf, memberOf, projectOf,
    meName: (m) => (m.id === ME ? (en ? `${m.name} (me)` : `${m.name}（我）`) : m.name),
    dueInfo, timeAgo, scopeTitle, matchesFilters, createSeedTasks, act,
  };
}

const DATA: Record<Lang, TrackerData> = { zh: buildData('zh'), en: buildData('en') };
/** 当前语言的字典、假数据和格式化函数 */
export const useData = (): TrackerData => DATA[useLang()];

/* ------------------------------------------------------------------ 与语言无关的工具 */

/** 新任务的编号：取该项目现有最大编号 + 1 */
export function nextTaskId(tasks: Task[], projectId: string): string {
  const prefix = PROJECT_DEFS.find((p) => p.id === projectId)!.prefix;
  const max = tasks.reduce((m, t) => {
    const [p, n] = t.id.split('-');
    return p === prefix ? Math.max(m, Number(n) || 0) : m;
  }, 0);
  return `${prefix}-${max + 1}`;
}

export function inScope(task: Task, scope: Scope): boolean {
  if (scope.kind === 'mine') return task.assigneeId === ME;
  if (scope.kind === 'week') return task.status !== 'done' && isDueThisWeek(task.due);
  if (scope.kind === 'project') return task.projectId === scope.id;
  return true;
}
