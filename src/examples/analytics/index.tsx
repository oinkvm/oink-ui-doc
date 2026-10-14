import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import {
  ACCENTS, AppShell, Avatar, Badge, Button, Card, CardHeader, DateRangePicker, DropdownMenu, Grid, GridItem, Icon, MenuItem,
  MenuLabel, MenuRadioGroup, MenuRadioItem, MenuSeparator, Nav, NavGroup, NavItem, Page, PageHeader, Pagination, Progress,
  ProgressRing, Section, Segmented, Select, Skeleton, Stack, Stat, Table, Tag, Tooltip, toast, useAppShell, useOink,
} from 'oink-ui';
import type { Accent, DateRange, TableColumn, TableSort, AccentPreset } from 'oink-ui';
import { useT } from '../../i18n';
import type { ExampleMeta } from '../../registry';
import { href, usePath } from '../../router';
import { BarChart, ChartCard, HeatTable, Legend, LegendItem, LineChart } from './charts';
import { CustomerDrawer, CustomersPage, OrderStatusBadge, sortRows } from './customers';
import { ORDER_STATUS_LIST, RETENTION_WEEKS, TODAY, addDays, lastDays, rangeLength, useAnalytics } from './data';
import type { AnalyticsData } from './data';
import type { CompareMode, Dashboard, Kpi, Order, Range } from './data';
import './analytics.css';

export const meta: ExampleMeta = {
  slug: 'analytics',
  title: '订阅分析仪表盘',
  domain: '数据分析',
  description: '一家订阅制 SaaS 的运营后台：收入、活跃用户、留存、渠道，外加客户列表与详情。图表是手写的内联 SVG，带键盘操作和表格视图。',
  en: {
    title: 'Subscription analytics',
    domain: 'Analytics',
    description: 'The back office of a subscription SaaS: revenue, active users, retention and channels, plus a customer list with details. The charts are hand-written inline SVG with keyboard support and a table view.',
  },
  order: 2,
};

const BASE = '/examples/analytics';

/* ------------------------------------------------------------------ 图标（20×20 描线） */
const IconOverview = () => <Icon><rect x="3.5" y="3.5" width="5.5" height="5.5" rx="1.6" /><rect x="11" y="3.5" width="5.5" height="5.5" rx="1.6" /><rect x="3.5" y="11" width="5.5" height="5.5" rx="1.6" /><rect x="11" y="11" width="5.5" height="5.5" rx="1.6" /></Icon>;
const IconUsers = () => <Icon><circle cx="10" cy="7" r="3.2" /><path d="M3.8 16.5c.7-3 3.1-4.3 6.2-4.3s5.500 1.300 6.200 4.300" /></Icon>;
const IconPulse = () => <Icon><path d="M3 11h3l2-5.500 3.500 9.500 2.500-6 1 2h2" /></Icon>;
const IconCoin = () => <Icon><circle cx="10" cy="10" r="6.500" /><path d="M7.500 7l2.500 3 2.500-3M10 10v3.500M7.800 11h4.400" /></Icon>;
const IconSpark = () => <Icon name="sparkle" />;
const IconExit = () => <Icon><path d="M8 4H5.500A1.500 1.500 0 0 0 4 5.500v9A1.500 1.500 0 0 0 5.500 16H8M12.500 6.500L16 10l-3.500 3.500M16 10H8" /></Icon>;
const KPI_ICON: Record<Kpi['key'], ReactElement> = { revenue: <IconCoin />, active: <IconPulse />, subs: <IconSpark />, churn: <IconExit /> };

/* ------------------------------------------------------------------ 顶栏 */
const ACCENT_NAME = {
  zh: { pink: '粉', orange: '橙', amber: '琥珀', blue: '蓝', violet: '紫' },
  en: { pink: 'Pink', orange: 'Orange', amber: 'Amber', blue: 'Blue', violet: 'Violet' },
} satisfies Record<'zh' | 'en', Record<AccentPreset, string>>;

function HeaderControls() {
  const t = useT();
  const { resolvedTheme, setTheme, accent, setAccent } = useOink();
  const dark = resolvedTheme === 'dark';
  const accentName = t(ACCENT_NAME.zh, ACCENT_NAME.en);
  const themeLabel = dark ? t('切换到浅色', 'Switch to light mode') : t('切换到深色', 'Switch to dark mode');
  return (
    <div className="an-header-end">
      <Tooltip content={themeLabel}>
        <Button
          variant="ghost" iconOnly aria-label={themeLabel}
          onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setTheme(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 }); }}
        >
          <Icon name={dark ? 'sun' : 'moon'} />
        </Button>
      </Tooltip>
      <DropdownMenu
        placement="bottom-end"
        matchTriggerWidth={false}
        aria-label={t('账户与外观', 'Account and appearance')}
        trigger={<Button variant="ghost" iconOnly aria-label={t('账户与外观', 'Account and appearance')}><Avatar name={t('林知夏', 'Nora Hale')} size="sm" /></Button>}
      >
        <MenuLabel>{t('强调色', 'Accent color')}</MenuLabel>
        <MenuRadioGroup aria-label={t('强调色', 'Accent color')} value={accent} onChange={(v) => setAccent(v as Accent)}>
          {ACCENTS.map((a) => <MenuRadioItem key={a} value={a}>{accentName[a]}</MenuRadioItem>)}
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuItem icon="bell" onSelect={() => toast(t('没有新的通知', 'No new notifications'))}>{t('通知', 'Notifications')}</MenuItem>
        <MenuItem onSelect={() => toast(t('这是演示，没有真的退出。', 'This is a demo; you’re still signed in.'))}>{t('退出登录', 'Sign out')}</MenuItem>
      </DropdownMenu>
    </div>
  );
}

/* ------------------------------------------------------------------ 侧栏 */
function SideContent({ view }: { view: 'overview' | 'customers' }) {
  const t = useT();
  const { rail, sidebarCollapsed } = useAppShell();
  return (
    <div className="an-side" data-docked={sidebarCollapsed ? undefined : ''}>
      <Nav aria-label={t('主导航', 'Main navigation')}>
        <NavGroup label={t('分析', 'Analytics')}>
          <NavItem href={href(BASE)} current={view === 'overview'} icon={<IconOverview />}>{t('概览', 'Overview')}</NavItem>
          <NavItem href={href(BASE + '/customers')} current={view === 'customers'} icon={<IconUsers />}>{t('客户', 'Customers')}</NavItem>
        </NavGroup>
      </Nav>
      {/* 一直挂着：收成图标窄条时由样式淡出并被侧栏裁掉，展开时随侧栏变宽逐渐露出，不等过渡结束才出现 */}
      <div className="an-side__usage" data-hidden={rail && !sidebarCollapsed ? '' : undefined} aria-hidden={rail && !sidebarCollapsed ? true : undefined}>
        <div className="an-side__usage-row"><b>{t('本月事件量', 'Events this month')}</b><span>68%</span></div>
        <Progress size="sm" value={68} label={t('本月事件量已用', 'Monthly event quota used')} noDoneState />
        <span>{t('团队版 · 340 万 / 500 万', 'Team plan · 3.4M / 5M')}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 概览页 */

const PRESET_DAYS = [7, 30, 90, 180];
const presetOf = (r: Range) => (r.end.getTime() === TODAY.getTime() && PRESET_DAYS.includes(rangeLength(r)) ? String(rangeLength(r)) : 'custom');
const MIN_DATE = new Date(2025, 0, 1);
const ORDER_PAGE = 8;

interface OverviewProps {
  range: Range;
  compare: CompareMode;
  onRangeChange: (r: Range) => void;
  onCompareChange: (c: CompareMode) => void;
  onOpenCustomer: (id: string) => void;
}

function deltaProps(k: Kpi, { fmtPct, fmtPts }: AnalyticsData): { delta?: string; trend?: 'up' | 'down' | 'flat' } {
  if (k.change === null) return {};
  const abs = Math.abs(k.change);
  const text = k.unit === 'pct' ? fmtPct(abs) : fmtPts(abs);
  return { delta: text, trend: abs < 0.05 ? 'flat' : k.change > 0 ? 'up' : 'down' };
}

function Overview({ range, compare, onRangeChange, onCompareChange, onOpenCustomer }: OverviewProps) {
  const t = useT();
  const A = useAnalytics();
  const { L, buildDashboard, fmtDate, fmtInt, fmtMoney, fmtMoneyShort, fmtPct, fmtRange } = A;
  // 模拟一次请求：条件变了先显示骨架，稍后再换上新数据
  const [applied, setApplied] = useState({ range, compare });
  const loading = applied.range !== range || applied.compare !== compare;
  useEffect(() => {
    if (applied.range === range && applied.compare === compare) return;
    const timer = setTimeout(() => setApplied({ range, compare }), 520);
    return () => clearTimeout(timer);
  }, [range, compare, applied]);
  const data: Dashboard = useMemo(() => buildDashboard(applied.range, applied.compare), [buildDashboard, applied]);

  // 日期选择：选到一半（只有起点）时先放在草稿里
  const [draft, setDraft] = useState<DateRange>(range);
  useEffect(() => { setDraft(range); }, [range]);
  const onPick = (next: DateRange) => {
    setDraft(next);
    if (!next.start || !next.end) return;
    let { start } = next;
    if (rangeLength({ start, end: next.end }) > 366) {
      start = addDays(next.end, -365);
      toast.info({ title: t('范围最长一年', 'Ranges are limited to one year'), description: t(`已调整为 ${fmtDate(start)} 起。`, `Adjusted to start on ${fmtDate(start)}.`) });
    }
    onRangeChange({ start, end: next.end });
  };

  const hasCompare = data.compare !== null;
  const revenue = data.kpis[0];
  const top = data.channels[0];

  /* —— 订单表 —— */
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<TableSort>({ key: 'date', direction: 'desc' });
  const [page, setPage] = useState(1);
  const orders = useMemo(() => {
    const list = status === 'all' ? data.orders : data.orders.filter((o) => o.status === status);
    return sortRows(list, sort, { id: (o) => o.id, customer: (o) => o.customer, amount: (o) => o.amount, date: (o) => o.date.getTime() });
  }, [data.orders, status, sort]);
  useEffect(() => { setPage(1); }, [data.orders, status, sort]);
  const pages = Math.max(1, Math.ceil(orders.length / ORDER_PAGE));
  const current = Math.min(page, pages);
  const orderColumns: TableColumn<Order>[] = [
    {
      key: 'customer', header: t('客户 / 订单号', 'Customer / Order'), label: t('客户', 'Customer'), sortable: true,
      render: (o) => (
        <>
          <button type="button" className="an-link ok-focusable" onClick={() => onOpenCustomer(o.customerId)} aria-label={t(`查看 ${o.customer} 的详情`, `View details for ${o.customer}`)}>{o.customer}</button>
          <span className="an-cell-2 an-mono">{o.id}</span>
        </>
      ),
    },
    { key: 'plan', header: t('套餐', 'Plan'), render: (o) => <Tag size="sm">{L.plan[o.plan]} · {L.cycle[o.cycle]}</Tag> },
    { key: 'amount', header: t('金额', 'Amount'), sortable: true, numeric: true, render: (o) => fmtMoney(o.amount) },
    { key: 'status', header: t('状态', 'Status'), render: (o) => <OrderStatusBadge status={o.status} /> },
    { key: 'date', header: t('日期', 'Date'), sortable: true, render: (o) => fmtDate(o.date) },
  ];

  /* —— 摘要文字 —— */
  const peak = data.trend.reduce((a, b) => (b.value > a.value ? b : a), data.trend[0]);
  const trendSummary = t(
    `共 ${fmtMoneyShort(revenue.raw)}${revenue.change !== null ? `，较${data.compareRef}${revenue.change >= 0 ? '增长' : '下降'} ${fmtPct(Math.abs(revenue.change))}` : ''}；峰值在 ${peak.full}（${fmtMoneyShort(peak.value)}）。`,
    `${fmtMoneyShort(revenue.raw)} in total${revenue.change !== null ? `, ${revenue.change >= 0 ? 'up' : 'down'} ${fmtPct(Math.abs(revenue.change))} vs. ${data.compareRef}` : ''}; peak on ${peak.full} (${fmtMoneyShort(peak.value)}).`,
  );
  const top3 = fmtPct(data.channels.slice(0, 3).reduce((s, c) => s + c.share, 0));
  const channelSummary = t(
    `${top.name}贡献最多，占 ${fmtPct(top.share)}；前三个渠道合计 ${top3}。`,
    `${top.name} brings in the most, ${fmtPct(top.share)} of revenue; the top three channels make up ${top3}.`,
  );
  const full = data.cohorts.filter((c) => c.rates[4] != null);
  const w4 = full.length ? full.reduce((s, c) => s + (c.rates[4] ?? 0), 0) / full.length : null;
  const g = data.goals;
  const qPct = (g.quarterRevenue / g.quarterTarget) * 100;
  const ahead = qPct - g.quarterElapsed;
  const collected = data.orders.reduce((s, o) => s + (o.status === 'paid' ? o.amount : 0), 0);

  const exportAs = (what: string) => toast.success({
    title: t(`已开始导出 ${what}`, `Exporting ${what}`),
    description: t(`${fmtRange(data.range)} · 这是演示，不会真的生成文件。`, `${fmtRange(data.range)} · This is a demo; no file will be created.`),
  });
  const days = rangeLength(range);

  return (
    <Page size="xl" gap={{ base: 5, md: 6 }} className="an-page">
      <PageHeader
        title={t('概览', 'Overview')}
        description={t(
          <>{fmtRange(range)}，共 {days} 天{compare !== 'none' && <>；对比{compare === 'yoy' ? '去年同期' : `之前的 ${days} 天`}</>}。</>,
          <>{fmtRange(range)} · {days} days{compare !== 'none' && <>, compared with {compare === 'yoy' ? 'the same period last year' : `the previous ${days} days`}</>}.</>,
        )}
        actions={
          <div className="an-range an-header-actions">
            <Select
              className="an-range__preset"
              aria-label={t('快捷范围', 'Quick range')}
              value={presetOf(range)}
              onChange={(v) => { if (v !== 'custom') onRangeChange(lastDays(Number(v))); }}
              options={[
                ...PRESET_DAYS.map((n) => ({ value: String(n), label: t(`最近 ${n} 天`, `Last ${n} days`) })),
                { value: 'custom', label: t('自定义', 'Custom'), disabled: true },
              ]}
            />
            <DateRangePicker
              className="an-range__picker"
              aria-label={t('日期范围', 'Date range')}
              value={draft}
              onChange={onPick}
              onOpenChange={(open) => { if (!open) setDraft((d) => (d.start && d.end ? d : range)); }}
              min={MIN_DATE} max={TODAY} today={TODAY} weekStartsOn={1}
              placement="bottom-end"
            />
            <Segmented<CompareMode>
              className="an-compare-seg"
              aria-label={t('对比周期', 'Compare to')}
              value={compare}
              onChange={onCompareChange}
              options={[
                { value: 'prev', label: t('上一周期', 'Previous period') },
                { value: 'yoy', label: t('去年同期', 'Last year') },
                { value: 'none', label: t('不对比', 'No comparison') },
              ]}
            />
            <DropdownMenu placement="bottom-end" aria-label={t('导出', 'Export')} trigger={<Button leading={<Icon name="download" />} trailing={<Icon name="chevron-down" />}>{t('导出', 'Export')}</Button>}>
              <MenuItem icon="download" onSelect={() => exportAs('CSV')}>{t('导出 CSV', 'Export CSV')}</MenuItem>
              <MenuItem icon="download" onSelect={() => exportAs(t('PDF 报告', 'PDF report'))}>{t('导出 PDF 报告', 'Export PDF report')}</MenuItem>
              <MenuSeparator />
              <MenuItem icon="mail" onSelect={() => toast.success(t('已安排每周一发送邮件摘要', 'Email digest scheduled for every Monday'))}>{t('每周邮件摘要', 'Weekly email digest')}</MenuItem>
              <MenuItem icon="copy" onSelect={() => toast.success(t('链接已复制', 'Link copied'))}>{t('复制分享链接', 'Copy share link')}</MenuItem>
            </DropdownMenu>
          </div>
        }
      />
      <span className="ok-sr" role="status">{loading ? t('正在加载数据…', 'Loading data…') : t(`数据已更新：${fmtRange(data.range)}`, `Data updated: ${fmtRange(data.range)}`)}</span>

      <Section aria-label={t('关键指标', 'Key metrics')} aria-busy={loading || undefined}>
        <Grid columns={{ base: 2, lg: 4 }} gap={{ base: 3, md: 4 }}>
          {data.kpis.map((k) => (
            <Stat
              key={k.key}
              label={k.label}
              icon={KPI_ICON[k.key]}
              value={loading ? <Skeleton width="72%" height={28} /> : k.value}
              positive={k.positive}
              {...(loading ? {} : deltaProps(k, A))}
              hint={loading ? <Skeleton width={96} /> : hasCompare ? t(`较${data.compareRef}`, `vs. ${data.compareRef}`) : t(`共 ${rangeLength(data.range)} 天`, `${rangeLength(data.range)} days`)}
            />
          ))}
        </Grid>
      </Section>

      <Grid columns={{ base: 1, lg: 3 }} gap={{ base: 3, md: 4 }}>
        <GridItem span={{ base: 'full', lg: 2 }}>
          <ChartCard
            title={t('收入趋势', 'Revenue trend')}
            summary={trendSummary}
            loading={loading}
            skeletonHeight={272}
            legend={
              <Legend>
                <LegendItem kind="line">{t(`本期收入（按${data.granularity === 'week' ? '周' : '日'}）`, `Revenue (${data.granularity === 'week' ? 'weekly' : 'daily'})`)}</LegendItem>
                {hasCompare && <LegendItem kind="dash">{data.compareLabel}</LegendItem>}
              </Legend>
            }
            chart={(summaryId) => (
              <LineChart
                points={data.trend}
                label={t('收入趋势折线图', 'Revenue trend line chart')}
                describedBy={summaryId}
                seriesName={t('本期', 'This period')}
                compareName={hasCompare ? data.compareLabel : undefined}
                formatValue={fmtMoney}
                formatAxis={A.fmtMoneyAxis}
              />
            )}
            table={
              <Table
                label={t('收入趋势数据', 'Revenue trend data')}
                scroll
                maxHeight={300}
                rowKey="full"
                data={data.trend}
                columns={[
                  { key: 'full', header: data.granularity === 'week' ? t('周', 'Week') : t('日期', 'Date') },
                  { key: 'value', header: t('本期收入', 'Revenue'), numeric: true, render: (p) => fmtMoney(p.value) },
                  ...(hasCompare ? [
                    { key: 'compare', header: data.compareLabel, numeric: true, render: (p) => (p.compare === null ? '—' : fmtMoney(p.compare)) },
                    { key: 'change', header: t('变化', 'Change'), numeric: true, render: (p) => (p.compare ? `${p.value >= p.compare ? '+' : '−'}${fmtPct(Math.abs(((p.value - p.compare) / p.compare) * 100))}` : '—') },
                  ] as TableColumn<Dashboard['trend'][number]>[] : []),
                ]}
              />
            }
          />
        </GridItem>

        <Card as="section" aria-labelledby="an-goals-title" aria-busy={loading || undefined} className="an-card">
          <CardHeader titleAs="h2" title={<span id="an-goals-title">{t('目标进度', 'Goals')}</span>} description={g.quarterLabel} />
          {loading ? <Skeleton variant="rect" width="100%" height={236} /> : (
            <>
              <div className="an-goal-hero">
                <ProgressRing size="lg" value={qPct} label={t('季度收入目标完成度', 'Progress toward the quarterly revenue goal')} />
                <div className="an-goal-hero__text">
                  <span className="an-muted">{t('季度收入', 'Quarterly revenue')}</span>
                  <span className="an-goal-hero__value">{fmtMoneyShort(g.quarterRevenue)}</span>
                  <span className="an-muted">{t('目标', 'Goal')} {fmtMoneyShort(g.quarterTarget)}</span>
                </div>
              </div>
              <div>
                <Badge tone={ahead >= 0 ? 'success' : 'warning'} dot>
                  {t(
                    `${ahead >= 0 ? '领先' : '落后'}时间进度 ${Math.abs(ahead).toFixed(1)} 个百分点`,
                    `${Math.abs(ahead).toFixed(1)} pts ${ahead >= 0 ? 'ahead of' : 'behind'} schedule`,
                  )}
                </Badge>
              </div>
              <Stack gap={4}>
                <GoalRow label={t('新增订阅', 'New subscriptions')} value={`${fmtInt(g.subs)} / ${fmtInt(g.subsTarget)}`} percent={(g.subs / g.subsTarget) * 100} />
                <GoalRow label={t('新用户激活率', 'New user activation')} value={`${fmtPct(g.activation)} / 70%`} percent={(g.activation / 70) * 100} />
                <GoalRow label={t('净推荐值 NPS', 'Net Promoter Score')} value={`${g.nps} / 50`} percent={(g.nps / 50) * 100} />
              </Stack>
            </>
          )}
        </Card>
      </Grid>

      <Grid columns={{ base: 1, lg: 2 }} gap={{ base: 3, md: 4 }}>
        <ChartCard
          title={t('渠道收入占比', 'Revenue by channel')}
          summary={channelSummary}
          loading={loading}
          legend={
            <Legend>
              <LegendItem kind="bar">{t('本期收入', 'Revenue')}</LegendItem>
              {hasCompare && <LegendItem kind="tick">{data.compareLabel}</LegendItem>}
            </Legend>
          }
          chart={(summaryId) => (
            <BarChart
              rows={data.channels}
              label={t('各获客渠道收入条形图', 'Bar chart of revenue by acquisition channel')}
              describedBy={summaryId}
              seriesName={t('本期', 'This period')}
              compareName={hasCompare ? data.compareLabel : undefined}
              formatValue={fmtMoney}
            />
          )}
          table={
            <Table
              label={t('渠道收入数据', 'Revenue by channel data')}
              rowKey="key"
              data={data.channels}
              columns={[
                { key: 'name', header: t('渠道', 'Channel') },
                { key: 'value', header: t('本期收入', 'Revenue'), numeric: true, render: (c) => fmtMoney(c.value) },
                { key: 'share', header: t('占比', 'Share'), numeric: true, render: (c) => fmtPct(c.share) },
                ...(hasCompare ? [
                  { key: 'change', header: t(`较${data.compareRef}`, `vs. ${data.compareRef}`), numeric: true, render: (c) => (c.change === null ? '—' : `${c.change >= 0 ? '+' : '−'}${fmtPct(Math.abs(c.change))}`) },
                ] as TableColumn<Dashboard['channels'][number]>[] : []),
              ]}
            />
          }
        />

        <Card as="section" aria-labelledby="an-retention-title" aria-busy={loading || undefined} className="an-card">
          <CardHeader
            titleAs="h2"
            title={<span id="an-retention-title">{t('周留存', 'Weekly retention')}</span>}
            description={loading ? <Skeleton width="70%" /> : w4 === null
              ? t('按注册周分组，每格是该批用户在之后各周仍然活跃的比例。', 'Grouped by signup week. Each cell is the share of that cohort still active in later weeks.')
              : t(`按注册周分组。注册 4 周后平均还有 ${fmtPct(w4)} 的用户活跃。`, `Grouped by signup week. On average, ${fmtPct(w4)} of users are still active 4 weeks after signing up.`)}
          />
          {loading ? <Skeleton variant="rect" width="100%" height={240} /> : (
            <HeatTable rows={data.cohorts} weeks={RETENTION_WEEKS} caption={t('周留存：各注册周的用户在之后各周的留存率（%）', 'Weekly retention: share of each signup cohort still active in later weeks (%)')} />
          )}
        </Card>
      </Grid>

      <Section
        title={t('最近订单', 'Recent orders')}
        description={loading ? undefined : t(
          `${fmtRange(data.range)}内共 ${data.orders.length} 笔，合计 ${fmtMoney(collected)} 已入账。`,
          `${data.orders.length} orders from ${fmtRange(data.range)}, ${fmtMoney(collected)} collected.`,
        )}
        aria-busy={loading || undefined}
        actions={
          <Select
            aria-label={t('按状态筛选订单', 'Filter orders by status')}
            size="sm"
            value={status}
            onChange={setStatus}
            options={[{ value: 'all', label: t('全部状态', 'All statuses') }, ...ORDER_STATUS_LIST.map((s) => ({ value: s, label: L.orderStatus[s] }))]}
          />
        }
      >
        {loading ? (
          <div className="an-skel-table">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} width={`${92 - (i % 3) * 9}%`} />)}</div>
        ) : (
          <>
            <Table
              label={t('最近订单', 'Recent orders')}
              columns={orderColumns}
              data={orders.slice((current - 1) * ORDER_PAGE, current * ORDER_PAGE)}
              rowKey="id"
              sort={sort}
              onSortChange={setSort}
              manualSort
              stackOnMobile
              empty={t('这个状态下没有订单', 'No orders with this status')}
            />
            <div className="an-table-foot">
              <span className="an-muted">
                {orders.length === 0
                  ? t('共 0 笔', 'No orders')
                  : t(`第 ${(current - 1) * ORDER_PAGE + 1}–${Math.min(orders.length, current * ORDER_PAGE)} 笔，共 ${orders.length} 笔`, `${(current - 1) * ORDER_PAGE + 1}–${Math.min(orders.length, current * ORDER_PAGE)} of ${orders.length}`)}
              </span>
              <Pagination count={pages} page={current} onChange={setPage} label={t('订单分页', 'Order pages')} />
            </div>
          </>
        )}
      </Section>
    </Page>
  );
}

function GoalRow({ label, value, percent }: { label: string; value: string; percent: number }) {
  const t = useT();
  return (
    <div className="an-goal">
      <div className="an-goal__row"><span>{label}</span><b>{value}</b></div>
      <Progress size="sm" value={Math.min(100, percent)} label={t(`${label}完成度`, `${label} progress`)} />
    </div>
  );
}

/* ------------------------------------------------------------------ 应用 */

export default function AnalyticsExample() {
  const t = useT();
  const path = usePath();
  const view = path.replace(BASE, '').startsWith('/customers') ? 'customers' : 'overview';
  const [range, setRange] = useState<Range>(() => lastDays(30));
  const [compare, setCompare] = useState<CompareMode>('prev');
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  // 平板宽度（768–1023）下侧栏默认收成图标窄条，把宽度留给图表和表格；用户随时可以展开
  const [startAsRail] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);

  // 换页：筛选面板收起，主区回到顶部
  useEffect(() => {
    setFiltersOpen(false);
    mainRef.current?.scrollTo?.(0, 0);
  }, [view]);

  return (
    <>
      <AppShell className="an-shell" defaultRail={startAsRail} data-filters={view === 'customers' && filtersOpen ? '' : undefined}>
        <AppShell.Header>
          <AppShell.Trigger />
          <span className="an-brand">
            <span className="an-brand__mark" aria-hidden="true"><IconPulse /></span>
            {t('潮汐分析', 'Tide Analytics')}
          </span>
          <span className="an-workspace">{t('栖木科技 · 生产环境', 'Perch Tech · Production')}</span>
          <HeaderControls />
        </AppShell.Header>
        <AppShell.Sidebar label={t('侧栏', 'Sidebar')} width={224}>
          <SideContent view={view} />
        </AppShell.Sidebar>
        <AppShell.Main ref={mainRef}>
          {view === 'overview' ? (
            <Overview range={range} compare={compare} onRangeChange={setRange} onCompareChange={setCompare} onOpenCustomer={setCustomerId} />
          ) : (
            <CustomersPage filtersOpen={filtersOpen} onFiltersOpenChange={setFiltersOpen} onOpenCustomer={setCustomerId} />
          )}
        </AppShell.Main>
      </AppShell>
      <CustomerDrawer customerId={customerId} onClose={() => setCustomerId(null)} />
    </>
  );
}
