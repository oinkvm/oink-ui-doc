import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar, Badge, Button, Checkbox, CheckboxGroup, Chip, ChipGroup, Count, DescriptionList, Drawer, EmptyState, Field,
  FloatingBody, FloatingFooter, FloatingHeader, Icon, Inline, Page, PageHeader, Pagination, Panel, Progress, SearchInput,
  Select, Stack, Stat, Table, Tabs, Tag, Timeline, ToggleButton, Toolbar, toast, useBreakpoint, useMediaQuery,
} from 'oink-ui';
import type { TableColumn, TableSort } from 'oink-ui';
import { useT } from '../../i18n';
import { PLAN_LIST, STATUS_LIST, fmtISO, useAnalytics } from './data';
import type { Customer, CustomerStatus, Invoice, OrderStatus } from './data';

/* ------------------------------------------------------------------ 共用的小件 */

const STATUS_TONE: Record<CustomerStatus, 'success' | 'info' | 'warning' | 'neutral'> = { active: 'success', trial: 'info', risk: 'warning', churned: 'neutral' };
export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const { L } = useAnalytics();
  return <Badge tone={STATUS_TONE[status]} dot>{L.customerStatus[status]}</Badge>;
}

const ORDER_TONE: Record<OrderStatus, 'success' | 'warning' | 'neutral' | 'danger'> = { paid: 'success', pending: 'warning', refunded: 'neutral', failed: 'danger' };
export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { L } = useAnalytics();
  return <Badge tone={ORDER_TONE[status]} dot>{L.orderStatus[status]}</Badge>;
}

/** 排序 + 分页都在表格外面做（表格只管显示当前这一页） */
export function sortRows<T>(rows: T[], sort: TableSort, get: Record<string, (row: T) => number | string>): T[] {
  if (!sort || !get[sort.key]) return rows;
  const sign = sort.direction === 'desc' ? -1 : 1;
  const f = get[sort.key];
  return [...rows].sort((a, b) => {
    const x = f(a), y = f(b);
    return sign * (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'zh-CN'));
  });
}

/* ------------------------------------------------------------------ 筛选 */

export interface CustomerFilters { plans: string[]; statuses: string[]; region: string }
export const EMPTY_FILTERS: CustomerFilters = { plans: [], statuses: [], region: 'all' };
const filterCount = (f: CustomerFilters) => f.plans.length + f.statuses.length + (f.region !== 'all' ? 1 : 0);

function FilterForm({ filters, onChange }: { filters: CustomerFilters; onChange: (f: CustomerFilters) => void }) {
  const t = useT();
  const { L, REGION_LIST } = useAnalytics();
  return (
    <div className="an-filter">
      <Field label={t('套餐', 'Plan')}>
        <CheckboxGroup value={filters.plans} onChange={(plans) => onChange({ ...filters, plans })}>
          {PLAN_LIST.map((p) => <Checkbox key={p} value={p}>{L.plan[p]}</Checkbox>)}
        </CheckboxGroup>
      </Field>
      <Field label={t('状态', 'Status')}>
        <ChipGroup value={filters.statuses} onChange={(statuses) => onChange({ ...filters, statuses })}>
          {STATUS_LIST.map((s) => <Chip key={s} value={s}>{L.customerStatus[s]}</Chip>)}
        </ChipGroup>
      </Field>
      <Field label={t('地区', 'Region')}>
        <Select
          value={filters.region}
          onChange={(region) => onChange({ ...filters, region })}
          options={[{ value: 'all', label: t('全部地区', 'All regions') }, ...REGION_LIST.map((r) => ({ value: r, label: r }))]}
        />
      </Field>
    </div>
  );
}

/* ------------------------------------------------------------------ 客户页 */

const PAGE_SIZE = 10;

export interface CustomersPageProps {
  filtersOpen: boolean;
  onFiltersOpenChange: (open: boolean) => void;
  onOpenCustomer: (id: string) => void;
}

export function CustomersPage({ filtersOpen, onFiltersOpenChange, onOpenCustomer }: CustomersPageProps) {
  const t = useT();
  const { L, CUSTOMERS, fmtDate, fmtMoney } = useAnalytics();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<CustomerFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<TableSort>({ key: 'mrr', direction: 'desc' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  // 宽屏：非模态面板停靠在右侧，页面让出位置；窄屏放不下，改成模态抽屉
  const docked = useBreakpoint('lg');
  const roomy = useMediaQuery('(min-width: 1440px)');
  // 平板宽度、或面板停靠后主区变窄时：先收起次要的列，而不是让表格横向滚动
  const stacked = !useBreakpoint('sm');   // 手机上表格变成卡片，放得下全部字段
  const compact = !stacked && !roomy && (!docked || filtersOpen);
  // 非模态面板不会自己拿走焦点；它在 DOM 里又排在页面最后，所以打开时把焦点送进去，键盘用户不用绕一整页
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!filtersOpen || !docked) return;
    // 面板要等进场的第一帧之后才挂载、才可聚焦，所以试几次
    let tries = 0;
    const timer = setInterval(() => {
      const panel = panelRef.current;
      const target = panel?.querySelector<HTMLElement>('input') ?? panel?.querySelector<HTMLElement>('button');
      target?.focus({ preventScroll: true });
      if ((panel && panel.contains(document.activeElement)) || ++tries > 10) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [filtersOpen, docked]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = CUSTOMERS.filter((c) =>
      (!q || c.name.toLowerCase().includes(q) || c.contact.toLowerCase().includes(q) || c.email.includes(q) || c.id.toLowerCase().includes(q))
      && (filters.plans.length === 0 || filters.plans.includes(c.plan))
      && (filters.statuses.length === 0 || filters.statuses.includes(c.status))
      && (filters.region === 'all' || c.region === filters.region));
    return sortRows(list, sort, { name: (c) => c.name, mrr: (c) => c.mrr, seats: (c) => c.seats, health: (c) => c.health, joined: (c) => c.joined.getTime() });
  }, [CUSTOMERS, query, filters, sort]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [query, filters, sort]);

  const active = filterCount(filters);
  const allColumns: TableColumn<Customer>[] = [
    {
      key: 'name', header: t('客户', 'Customer'), sortable: true, accessor: (c) => c.name,
      render: (c) => (
        <>
          <button type="button" className="an-link ok-focusable" onClick={() => onOpenCustomer(c.id)} aria-label={t(`查看 ${c.name} 的详情`, `View details for ${c.name}`)}>{c.name}</button>
          <span className="an-cell-2">{c.contact} · {c.region}</span>
        </>
      ),
    },
    { key: 'plan', header: t('套餐', 'Plan'), render: (c) => <Tag size="sm">{L.plan[c.plan]}</Tag> },
    { key: 'status', header: t('状态', 'Status'), render: (c) => <CustomerStatusBadge status={c.status} /> },
    { key: 'mrr', header: <abbr title={t('月经常性收入', 'Monthly recurring revenue')}>MRR</abbr>, label: t('月经常性收入（MRR）', 'Monthly recurring revenue (MRR)'), sortable: true, numeric: true, render: (c) => (c.mrr ? fmtMoney(c.mrr) : '—') },
    { key: 'seats', header: t('席位', 'Seats'), sortable: true, numeric: true },
    {
      key: 'health', header: t('健康分', 'Health'), sortable: true,
      render: (c) => (
        <span className="an-health">
          <Progress size="sm" value={c.health} noDoneState tone={c.health < 40 ? 'danger' : c.health < 60 ? 'warning' : 'success'} aria-hidden="true" />
          {c.health}
        </span>
      ),
    },
    { key: 'joined', header: t('加入时间', 'Joined'), sortable: true, render: (c) => fmtDate(c.joined) },
  ];

  const columns = compact ? allColumns.filter((c) => c.key !== 'seats' && c.key !== 'joined') : allColumns;

  const bulk = (what: string) => {
    toast.success({ title: t(`${what}：${selected.length} 位客户`, `${what}: ${selected.length} ${selected.length === 1 ? 'customer' : 'customers'}`), description: t('这是演示，没有真的执行。', 'This is a demo; nothing actually happened.') });
    setSelected([]);
  };
  const reset = () => setFilters(EMPTY_FILTERS);
  const filterBody = <FilterForm filters={filters} onChange={setFilters} />;
  const filterFooter = (
    <FloatingFooter align="between">
      <span className="an-muted" role="status">{t(`${rows.length} 位客户符合`, `${rows.length} matching ${rows.length === 1 ? 'customer' : 'customers'}`)}</span>
      <Button variant="ghost" onClick={reset} disabled={active === 0}>{t('重置', 'Reset')}</Button>
    </FloatingFooter>
  );

  return (
    <Page size="xl" gap={5} className="an-page">
      <PageHeader
        title={t('客户', 'Customers')}
        description={t(
          `共 ${CUSTOMERS.length} 位客户，其中 ${CUSTOMERS.filter((c) => c.status === 'risk').length} 位有流失风险。`,
          `${CUSTOMERS.length} customers, ${CUSTOMERS.filter((c) => c.status === 'risk').length} of them at risk of churning.`,
        )}
        actions={
          <>
            <SearchInput className="an-search" aria-label={t('搜索客户', 'Search customers')} placeholder={t('搜索名称、联系人、邮箱…', 'Search name, contact, email…')} value={query} onChange={setQuery} />
            <ToggleButton pressed={filtersOpen} onChange={onFiltersOpenChange} leading={<Icon name="sliders" />} aria-haspopup={docked ? undefined : 'dialog'}>
              {t('筛选', 'Filters')}{active > 0 && <Count value={active} tone="neutral" label={t(`已启用 ${active} 个筛选条件`, `${active} ${active === 1 ? 'filter' : 'filters'} applied`)} />}
            </ToggleButton>
          </>
        }
      >
        {active > 0 && (
          <Inline gap={2} role="group" aria-label={t('已启用的筛选条件', 'Active filters')}>
            {filters.plans.map((p) => <Tag key={p} onRemove={() => setFilters({ ...filters, plans: filters.plans.filter((x) => x !== p) })}>{L.plan[p as Customer['plan']]}</Tag>)}
            {filters.statuses.map((s) => <Tag key={s} onRemove={() => setFilters({ ...filters, statuses: filters.statuses.filter((x) => x !== s) })}>{L.customerStatus[s as CustomerStatus]}</Tag>)}
            {filters.region !== 'all' && <Tag onRemove={() => setFilters({ ...filters, region: 'all' })}>{filters.region}</Tag>}
            <Button size="sm" variant="ghost" onClick={reset}>{t('清除全部', 'Clear all')}</Button>
          </Inline>
        )}
      </PageHeader>

      <Stack gap={3}>
        {selected.length > 0 && (
          <div className="an-bulk">
            <span className="an-bulk__count" role="status">{t(`已选择 ${selected.length} 位客户`, `${selected.length} ${selected.length === 1 ? 'customer' : 'customers'} selected`)}</span>
            <Toolbar aria-label={t('批量操作', 'Bulk actions')}>
              <Button size="sm" leading={<Icon name="mail" />} onClick={() => bulk(t('已发送邮件', 'Email sent'))}>{t('发送邮件', 'Send email')}</Button>
              <Button size="sm" leading={<Icon name="download" />} onClick={() => bulk(t('已导出', 'Exported'))}>{t('导出', 'Export')}</Button>
              <Button size="sm" onClick={() => bulk(t('已加入回访名单', 'Added to follow-up list'))}>{t('加入回访名单', 'Add to follow-up list')}</Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected([])}>{t('取消选择', 'Clear selection')}</Button>
            </Toolbar>
          </div>
        )}
        <Table
          label={t('客户列表', 'Customer list')}
          columns={columns}
          data={pageRows}
          rowKey="id"
          sort={sort}
          onSortChange={setSort}
          manualSort
          selectable
          selectedKeys={selected}
          onSelectionChange={setSelected}
          getRowLabel={(c) => c.name}
          stackOnMobile
          empty={
            <EmptyState
              size="sm"
              icon={<Icon name="search" />}
              title={t('没有符合条件的客户', 'No matching customers')}
              description={t('换个关键词，或者放宽筛选条件。', 'Try a different keyword, or loosen the filters.')}
              actions={<Button size="sm" onClick={() => { setQuery(''); reset(); }}>{t('清除搜索和筛选', 'Clear search and filters')}</Button>}
            />
          }
        />
        <div className="an-table-foot">
          <span className="an-muted">
            {rows.length === 0
              ? t('共 0 位', 'No customers')
              : t(`第 ${(current - 1) * PAGE_SIZE + 1}–${Math.min(rows.length, current * PAGE_SIZE)} 位，共 ${rows.length} 位`, `${(current - 1) * PAGE_SIZE + 1}–${Math.min(rows.length, current * PAGE_SIZE)} of ${rows.length}`)}
          </span>
          <Pagination count={pages} page={current} onChange={setPage} label={t('客户列表分页', 'Customer list pages')} />
        </div>
      </Stack>

      {docked ? (
        <Panel ref={panelRef} open={filtersOpen} onOpenChange={onFiltersOpenChange} size={320}>
          <FloatingHeader title={t('筛选客户', 'Filter customers')} description={t('条件之间是“并且”的关系', 'Customers must match every condition')} />
          <FloatingBody>{filterBody}</FloatingBody>
          {filterFooter}
        </Panel>
      ) : (
        <Drawer open={filtersOpen} onOpenChange={onFiltersOpenChange} size={320}>
          <FloatingHeader title={t('筛选客户', 'Filter customers')} description={t('条件之间是“并且”的关系', 'Customers must match every condition')} />
          <FloatingBody>{filterBody}</FloatingBody>
          {filterFooter}
        </Drawer>
      )}
    </Page>
  );
}

/* ------------------------------------------------------------------ 客户详情抽屉 */

function CustomerDetail({ customer: c }: { customer: Customer }) {
  const t = useT();
  const { L, customerActivity, customerInvoices, fmtDate, fmtInt, fmtMoney } = useAnalytics();
  const activity = useMemo(() => customerActivity(c), [customerActivity, c]);
  const invoices = useMemo(() => customerInvoices(c), [customerInvoices, c]);
  const invoiceColumns: TableColumn<Invoice>[] = [
    { key: 'id', header: t('账单号', 'Invoice'), render: (v) => <span className="an-mono">{v.id}</span> },
    { key: 'date', header: t('日期', 'Date'), render: (v) => fmtDate(v.date) },
    { key: 'amount', header: t('金额', 'Amount'), numeric: true, render: (v) => fmtMoney(v.amount) },
    { key: 'status', header: t('状态', 'Status'), render: (v) => <OrderStatusBadge status={v.status} /> },
  ];
  return (
    <Tabs
      key={c.id}
      label={t(`${c.name} 的资料`, `${c.name} profile`)}
      items={[
        {
          value: 'profile', label: t('概况', 'Overview'),
          content: (
            <Stack gap={5}>
              <div className="an-drawer-stats">
                <Stat variant="plain" label={t('月经常性收入', 'MRR')} value={c.mrr ? fmtMoney(c.mrr) : '—'} />
                <Stat variant="plain" label={t('席位', 'Seats')} value={fmtInt(c.seats)} />
                <Stat variant="plain" label={t('健康分', 'Health score')} value={c.health} />
              </div>
              <DescriptionList
                divided
                items={[
                  { term: t('联系人', 'Contact'), description: c.contact },
                  { term: t('邮箱', 'Email'), description: c.email },
                  { term: t('套餐', 'Plan'), description: L.plan[c.plan] },
                  { term: t('地区', 'Region'), description: c.region },
                  { term: t('获客渠道', 'Acquisition channel'), description: c.channel },
                  { term: t('加入时间', 'Joined'), description: fmtDate(c.joined) },
                ]}
              />
            </Stack>
          ),
        },
        {
          value: 'activity', label: t('动态', 'Activity'),
          content: <Timeline aria-label={t('客户动态', 'Customer activity')} items={activity.map((a) => ({ key: a.key, title: a.title, description: a.description, time: fmtDate(a.date), dateTime: fmtISO(a.date), tone: a.tone }))} />,
        },
        {
          value: 'billing', label: t('账单', 'Billing'),
          content: invoices.length
            ? <Table label={t('最近账单', 'Recent invoices')} columns={invoiceColumns} data={invoices} rowKey="id" stackOnMobile />
            : <EmptyState size="sm" title={t('还没有账单', 'No invoices yet')} description={t('试用结束并选择套餐后，账单会出现在这里。', 'Invoices will show up here once the trial ends and a plan is chosen.')} titleAs="h3" />,
        },
      ]}
    />
  );
}

export function CustomerDrawer({ customerId, onClose }: { customerId: string | null; onClose: () => void }) {
  const t = useT();
  const { L, customerById } = useAnalytics();
  // 关闭后保留最后一位客户，退场动画期间内容不至于变空
  const [shown, setShown] = useState<string | null>(customerId);
  useEffect(() => { if (customerId) setShown(customerId); }, [customerId]);
  const c = customerById(customerId ?? shown ?? '');
  return (
    <Drawer open={customerId !== null} onOpenChange={(open) => { if (!open) onClose(); }} size="lg">
      {c && (
        <>
          <FloatingHeader
            icon={<Avatar name={c.name} color="auto" />}
            title={c.name}
            description={`${c.id} · ${L.plan[c.plan]} · ${c.region}`}
          />
          <FloatingBody>
            <Stack gap={4}>
              <Inline gap={2}>
                <CustomerStatusBadge status={c.status} />
                {c.health < 50 && <Badge tone="danger">{t('健康分偏低', 'Low health score')}</Badge>}
              </Inline>
              <CustomerDetail customer={c} />
            </Stack>
          </FloatingBody>
          <FloatingFooter>
            <Button variant="ghost" onClick={onClose}>{t('关闭', 'Close')}</Button>
            <Button variant="primary" leading={<Icon name="mail" />} onClick={() => toast.success({ title: t(`已给 ${c.contact} 起草邮件`, `Drafted an email to ${c.contact}`), description: t('这是演示，没有真的发送。', 'This is a demo; nothing was sent.') })}>{t('联系客户', 'Contact customer')}</Button>
          </FloatingFooter>
        </>
      )}
    </Drawer>
  );
}
