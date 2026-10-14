import { useMemo, useState } from 'react';
import { Badge, Button, Code, EmptyState, Icon, Inline, Stack, Table, Text } from 'oink-ui';
import type { TableColumn, TableSort } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useLang, useT } from '../../i18n';
import type { Translate } from '../../i18n';
import { Keys, Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/table', title: 'Table 表格', group: '数据展示', order: 60, subtitle: 'Table', en: { title: 'Table' } };

interface Member { id: string; name: string; role: string; city: string; commits: number; status: string }

const MEMBERS: { zh: Member[]; en: Member[] } = {
  zh: [
    { id: 'm1', name: '林小满', role: '设计', city: '上海', commits: 128, status: '在线' },
    { id: 'm2', name: '周屿', role: '前端', city: '杭州', commits: 342, status: '在线' },
    { id: 'm3', name: 'Ada Chen', role: '产品', city: '深圳', commits: 17, status: '离开' },
    { id: 'm4', name: '宋知远', role: '后端', city: '北京', commits: 276, status: '离线' },
    { id: 'm5', name: '何田田', role: '测试', city: '成都', commits: 64, status: '在线' },
  ],
  en: [
    { id: 'm1', name: 'Ella Morgan', role: 'Design', city: 'Seattle', commits: 128, status: 'Online' },
    { id: 'm2', name: 'Owen Hart', role: 'Front end', city: 'Austin', commits: 342, status: 'Online' },
    { id: 'm3', name: 'Ada Chen', role: 'Product', city: 'Toronto', commits: 17, status: 'Away' },
    { id: 'm4', name: 'Sam Turner', role: 'Back end', city: 'Boston', commits: 276, status: 'Offline' },
    { id: 'm5', name: 'Hannah Reed', role: 'QA', city: 'Denver', commits: 64, status: 'Online' },
  ],
};
const statusTone: Record<string, 'success' | 'warning' | 'neutral'> = {
  在线: 'success', 离开: 'warning', 离线: 'neutral',
  Online: 'success', Away: 'warning', Offline: 'neutral',
};

const makeColumns = (t: Translate): TableColumn<Member>[] => [
  { key: 'name', header: t('姓名', 'Name'), sortable: true },
  { key: 'role', header: t('角色', 'Role'), sortable: true },
  { key: 'city', header: t('城市', 'City') },
  { key: 'commits', header: t('提交', 'Commits'), numeric: true, sortable: true },
  { key: 'status', header: t('状态', 'Status'), render: (m) => <Badge tone={statusTone[m.status]} dot>{m.status}</Badge> },
];

const makeMany = (members: Member[]): Member[] =>
  Array.from({ length: 24 }, (_, i) => ({ ...members[i % members.length], id: 'r' + i, name: `${members[i % members.length].name} ${i + 1}`, commits: (i * 37) % 400 }));

/** 当前语言下的示例数据和列定义 */
function useTableData() {
  const t = useT();
  const lang = useLang();
  return useMemo(() => {
    const members = lang === 'en' ? MEMBERS.en : MEMBERS.zh;
    return { members, columns: makeColumns(t), many: makeMany(members) };
  }, [lang, t]);
}

const CODE_BASIC = {
  zh: `
interface Member { id: string; name: string; role: string; city: string; commits: number; status: '在线' | '离开' | '离线' }

const members: Member[] = [
  { id: 'm1', name: '林小满', role: '设计', city: '上海', commits: 128, status: '在线' },
  { id: 'm2', name: '周屿', role: '前端', city: '杭州', commits: 342, status: '在线' },
  { id: 'm3', name: 'Ada Chen', role: '产品', city: '深圳', commits: 17, status: '离开' },
  { id: 'm4', name: '宋知远', role: '后端', city: '北京', commits: 276, status: '离线' },
  { id: 'm5', name: '何田田', role: '测试', city: '成都', commits: 64, status: '在线' },
];
const statusTone = { 在线: 'success', 离开: 'warning', 离线: 'neutral' } as const;

const columns: TableColumn<Member>[] = [
  { key: 'name', header: '姓名', sortable: true },
  { key: 'role', header: '角色', sortable: true },
  { key: 'city', header: '城市' },
  { key: 'commits', header: '提交', numeric: true, sortable: true },
  { key: 'status', header: '状态', render: (m) => <Badge tone={statusTone[m.status]} dot>{m.status}</Badge> },
];

<Table caption="项目成员" columns={columns} data={members} rowKey="id" />`,
  en: `
interface Member { id: string; name: string; role: string; city: string; commits: number; status: 'Online' | 'Away' | 'Offline' }

const members: Member[] = [
  { id: 'm1', name: 'Ella Morgan', role: 'Design', city: 'Seattle', commits: 128, status: 'Online' },
  { id: 'm2', name: 'Owen Hart', role: 'Front end', city: 'Austin', commits: 342, status: 'Online' },
  { id: 'm3', name: 'Ada Chen', role: 'Product', city: 'Toronto', commits: 17, status: 'Away' },
  { id: 'm4', name: 'Sam Turner', role: 'Back end', city: 'Boston', commits: 276, status: 'Offline' },
  { id: 'm5', name: 'Hannah Reed', role: 'QA', city: 'Denver', commits: 64, status: 'Online' },
];
const statusTone = { Online: 'success', Away: 'warning', Offline: 'neutral' } as const;

const columns: TableColumn<Member>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'city', header: 'City' },
  { key: 'commits', header: 'Commits', numeric: true, sortable: true },
  { key: 'status', header: 'Status', render: (m) => <Badge tone={statusTone[m.status]} dot>{m.status}</Badge> },
];

<Table caption="Project members" columns={columns} data={members} rowKey="id" />`,
};

const CODE_SORT = {
  zh: `
function SortDemo() {
  const [sort, setSort] = useState<TableSort>({ key: 'commits', direction: 'desc' });
  return (
    <Stack gap={3}>
      <Table label="成员（受控排序）" columns={columns} data={members} rowKey="id" sort={sort} onSortChange={setSort} />
      <Text tone="neutral" variant="caption">当前排序：{sort ? \`\${sort.key} \${sort.direction === 'asc' ? '升序' : '降序'}\` : '无'}</Text>
    </Stack>
  );
}`,
  en: `
function SortDemo() {
  const [sort, setSort] = useState<TableSort>({ key: 'commits', direction: 'desc' });
  return (
    <Stack gap={3}>
      <Table label="Members (controlled sort)" columns={columns} data={members} rowKey="id" sort={sort} onSortChange={setSort} />
      <Text tone="neutral" variant="caption">Sorted by: {sort ? \`\${sort.key} \${sort.direction === 'asc' ? 'ascending' : 'descending'}\` : 'none'}</Text>
    </Stack>
  );
}`,
};

const CODE_SELECT = {
  zh: `
function SelectDemo() {
  const [keys, setKeys] = useState<string[]>(['m2']);
  return (
    <Stack gap={3}>
      <Inline gap={3} justify="between">
        <Text tone="neutral">已选 {keys.length} 人</Text>
        <Button size="sm" variant="ghost" disabled={keys.length === 0} onClick={() => setKeys([])}>清空选择</Button>
      </Inline>
      <Table label="成员（可选择）" columns={columns} data={members} rowKey="id" selectable selectedKeys={keys} onSelectionChange={setKeys} getRowLabel={(m) => m.name} />
    </Stack>
  );
}`,
  en: `
function SelectDemo() {
  const [keys, setKeys] = useState<string[]>(['m2']);
  return (
    <Stack gap={3}>
      <Inline gap={3} justify="between">
        <Text tone="neutral">{keys.length} selected</Text>
        <Button size="sm" variant="ghost" disabled={keys.length === 0} onClick={() => setKeys([])}>Clear selection</Button>
      </Inline>
      <Table label="Members (selectable)" columns={columns} data={members} rowKey="id" selectable selectedKeys={keys} onSelectionChange={setKeys} getRowLabel={(m) => m.name} />
    </Stack>
  );
}`,
};

const CODE_SCROLL = {
  zh: `
const many = Array.from({ length: 24 }, (_, i) => ({
  ...members[i % members.length],
  id: 'r' + i,
  name: \`\${members[i % members.length].name} \${i + 1}\`,
  commits: (i * 37) % 400,
}));

<Table label="成员（可滚动）" columns={columns} data={many} rowKey="id" scroll maxHeight={280} />`,
  en: `
const many = Array.from({ length: 24 }, (_, i) => ({
  ...members[i % members.length],
  id: 'r' + i,
  name: \`\${members[i % members.length].name} \${i + 1}\`,
  commits: (i * 37) % 400,
}));

<Table label="Members (scrollable)" columns={columns} data={many} rowKey="id" scroll maxHeight={280} />`,
};

const CODE_STACK = {
  zh: `<Table label="成员（窄屏卡片式）" columns={columns} data={members.slice(0, 3)} rowKey="id" stackOnMobile selectable />`,
  en: `<Table label="Members (cards on narrow screens)" columns={columns} data={members.slice(0, 3)} rowKey="id" stackOnMobile selectable />`,
};

const CODE_EMPTY = {
  zh: `
function EmptyDemo() {
  const [data, setData] = useState<Member[]>([]);
  return (
    <Stack gap={3}>
      <Table
        label="成员（空状态）"
        columns={columns}
        data={data}
        rowKey="id"
        empty={<EmptyState size="sm" icon={<Icon name="search" />} title="还没有成员" description="邀请同事加入后会出现在这里。" actions={<Button size="sm" variant="primary" onClick={() => setData(members.slice(0, 2))}>邀请成员</Button>} />}
      />
      {data.length > 0 && <Inline><Button size="sm" variant="ghost" onClick={() => setData([])}>清空数据</Button></Inline>}
    </Stack>
  );
}`,
  en: `
function EmptyDemo() {
  const [data, setData] = useState<Member[]>([]);
  return (
    <Stack gap={3}>
      <Table
        label="Members (empty state)"
        columns={columns}
        data={data}
        rowKey="id"
        empty={<EmptyState size="sm" icon={<Icon name="search" />} title="No members yet" description="Teammates show up here once you invite them." actions={<Button size="sm" variant="primary" onClick={() => setData(members.slice(0, 2))}>Invite members</Button>} />}
      />
      {data.length > 0 && <Inline><Button size="sm" variant="ghost" onClick={() => setData([])}>Clear data</Button></Inline>}
    </Stack>
  );
}`,
};

function SortDemo() {
  const t = useT();
  const { members, columns } = useTableData();
  const [sort, setSort] = useState<TableSort>({ key: 'commits', direction: 'desc' });
  return (
    <Stack gap={3}>
      <Table label={t('成员（受控排序）', 'Members (controlled sort)')} columns={columns} data={members} rowKey="id" sort={sort} onSortChange={setSort} />
      <Text tone="neutral" variant="caption">
        {t('当前排序：', 'Sorted by: ')}
        {sort ? `${sort.key} ${sort.direction === 'asc' ? t('升序', 'ascending') : t('降序', 'descending')}` : t('无', 'none')}
      </Text>
    </Stack>
  );
}

function SelectDemo() {
  const t = useT();
  const { members, columns } = useTableData();
  const [keys, setKeys] = useState<string[]>(['m2']);
  return (
    <Stack gap={3}>
      <Inline gap={3} justify="between">
        <Text tone="neutral">{t(`已选 ${keys.length} 人`, `${keys.length} selected`)}</Text>
        <Button size="sm" variant="ghost" disabled={keys.length === 0} onClick={() => setKeys([])}>{t('清空选择', 'Clear selection')}</Button>
      </Inline>
      <Table label={t('成员（可选择）', 'Members (selectable)')} columns={columns} data={members} rowKey="id" selectable selectedKeys={keys} onSelectionChange={setKeys} getRowLabel={(m) => m.name} />
    </Stack>
  );
}

function EmptyDemo() {
  const t = useT();
  const { members, columns } = useTableData();
  const [count, setCount] = useState(0);
  const data = members.slice(0, count);
  return (
    <Stack gap={3}>
      <Table
        label={t('成员（空状态）', 'Members (empty state)')}
        columns={columns}
        data={data}
        rowKey="id"
        empty={<EmptyState size="sm" icon={<Icon name="search" />} title={t('还没有成员', 'No members yet')} description={t('邀请同事加入后会出现在这里。', 'Teammates show up here once you invite them.')} actions={<Button size="sm" variant="primary" onClick={() => setCount(2)}>{t('邀请成员', 'Invite members')}</Button>} />}
      />
      {data.length > 0 && <Inline><Button size="sm" variant="ghost" onClick={() => setCount(0)}>{t('清空数据', 'Clear data')}</Button></Inline>}
    </Stack>
  );
}

export default function TablePage() {
  const t = useT();
  const { members, columns, many } = useTableData();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('成行成列的结构化数据：需要按列比较、排序或批量选择时用。只有两三个字段的条目用 List 更轻。', 'Structured data in rows and columns: use it when people need to compare by column, sort or select in bulk. For items with only two or three fields, List is lighter.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('传列定义和数据。第一列自动加粗作为行的主信息；numeric 的列右对齐并用等宽数字。指针移上去时，一块共享的浅灰底跟着在行之间滑动。', 'Pass column definitions and data. The first column is bolded automatically as the row’s primary information; numeric columns are right-aligned with tabular figures. On pointer hover, a single shared light-gray highlight slides between rows.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Table caption={t('项目成员', 'Project members')} columns={columns} data={members} rowKey="id" />
        </Demo>
      </DocSection>

      <DocSection title={t('排序', 'Sorting')} description={t('给列加 sortable 后表头变成按钮，点击在 升序 → 降序 → 不排序 之间循环。默认按 accessor（或 row[key]）的值比较，数字、日期、字符串各有合理的顺序；也可以传 compare 自定义。服务端排序时加 manualSort，组件只发事件不动数据。', 'Adding sortable to a column turns its header into a button that cycles ascending → descending → unsorted. Values from accessor (or row[key]) are compared by default, with sensible ordering for numbers, dates and strings; pass compare to customize. For server-side sorting, add manualSort and the component only fires the event without touching the data.')}>
        <Demo layout="block" code={t(CODE_SORT.zh, CODE_SORT.en)}>
          <SortDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('行选择', 'Row selection')} description={t('selectable 在首列加复选框，表头是全选（部分选中时显示半选）。选中的 key 可受控。', 'selectable adds a checkbox column first, with select-all in the header (indeterminate when partly selected). The selected keys can be controlled.')}>
        <Demo layout="block" code={t(CODE_SELECT.zh, CODE_SELECT.en)}>
          <SelectDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('吸顶滚动', 'Sticky header scrolling')} description={t('scroll 让表格限高（默认 320，可用 maxHeight 改）、表头固定在顶部。滚动完全是浏览器原生行为，只换了滚动条的外观；纵向滚动时悬停高亮直接对位，不做滑动动画。', 'scroll caps the table’s height (320 by default, adjustable with maxHeight) and pins the header to the top. Scrolling is entirely native browser behavior with only the scrollbar restyled; during vertical scrolling the hover highlight snaps into place without sliding.')}>
        <Demo layout="block" code={t(CODE_SCROLL.zh, CODE_SCROLL.en)}>
          <Table label={t('成员（可滚动）', 'Members (scrollable)')} columns={columns} data={many} rowKey="id" scroll maxHeight={280} />
        </Demo>
      </DocSection>

      <DocSection title={t('窄屏卡片式', 'Cards on narrow screens')} description={t('默认情况下表格在窄屏会在容器内横向滚动。加 stackOnMobile 后，视口窄于 520px 时每一行变成一张卡片，单元格变成“列名 —— 值”；可排序的列留在上方排成一行按钮。把浏览器调窄，或在手机上看这个示例。', 'By default a table scrolls horizontally inside its container on narrow screens. With stackOnMobile, below a 520px viewport each row becomes a card and each cell a “column — value” pair; sortable columns stay above as a row of buttons. Narrow your browser or view this example on a phone.')}>
        <Demo layout="block" code={t(CODE_STACK.zh, CODE_STACK.en)}>
          <Table label={t('成员（窄屏卡片式）', 'Members (cards on narrow screens)')} columns={columns} data={members.slice(0, 3)} rowKey="id" stackOnMobile selectable />
        </Demo>
      </DocSection>

      <DocSection title={t('空状态', 'Empty state')} description={t('没有数据时显示 empty（默认是“暂无数据”四个字），可以放一个 EmptyState。', 'With no data, empty is shown (“No data” by default, following the OinkProvider locale); you can put an EmptyState there.')}>
        <Demo layout="block" code={t(CODE_EMPTY.zh, CODE_EMPTY.en)}>
          <EmptyDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('单元格', 'Cells'), t('内边距 12 × 20 · 首尾行到上下边补足到 20 · 行间发丝线', 'padding 12 × 20 · first and last rows padded to 20 from the edges · hairlines between rows')],
          [t('表头', 'Header'), t('12px / 600 · 三级色', '12px / 600 · tertiary text color')],
          [t('悬停', 'Hover'), t('共享浅灰底跟随指针 · 90ms ease-out', 'shared light-gray highlight follows the pointer · 90ms ease-out')],
          [t('数字列', 'Numeric columns'), t('右对齐 · 等宽数字', 'right-aligned · tabular figures')],
          [t('窄屏', 'Narrow screens'), t('容器内横向滚动；stackOnMobile 时改成卡片', 'horizontal scroll inside the container; cards with stackOnMobile')],
          [t('可滚动', 'Scrollable'), t('限高 --ok-table-h · 表头固定 · 横纵双向', 'height capped by --ok-table-h · sticky header · scrolls both ways')],
          [t('滚动条', 'Scrollbar'), t('原生滚动条换肤 · 6px，指向时 8px · 指针移入时淡入', 'restyled native scrollbar · 6px, 8px on hover · fades in when the pointer enters')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Table" rows={[
          { name: 'columns', type: 'TableColumn<T>[]', required: true, description: t('列定义。', 'Column definitions.') },
          { name: 'data', type: 'T[]', required: true, description: t('行数据。', 'Row data.') },
          { name: 'rowKey', type: 'keyof T | ((row, index) => string)', description: t('行的唯一标识：字段名或函数。默认用下标。', 'Unique row identifier: a field name or a function. Defaults to the index.') },
          { name: 'label', type: 'string', description: t('表格的名字（aria-label）；可滚动时也是滚动区域的名字。', 'Name of the table (aria-label); also names the scroll region when scrollable.') },
          { name: 'caption', type: 'ReactNode', description: t(<>可见的表格标题，渲染成 <Code>caption</Code>。</>, <>Visible table title, rendered as <Code>caption</Code>.</>) },
          { name: 'sort / defaultSort', type: '{ key: string; direction: \'asc\' | \'desc\' } | null', default: 'null', description: t('排序，受控 / 非受控。null 表示不排序。', 'Sort, controlled / uncontrolled. null means unsorted.') },
          { name: 'onSortChange', type: '(sort: TableSort) => void', description: t('排序变化时。', 'Called when the sort changes.') },
          { name: 'manualSort', type: 'boolean', description: t('只发出排序事件、不在内部排序（服务端排序）。', 'Only fire sort events without sorting internally (server-side sorting).') },
          { name: 'selectable', type: 'boolean', description: t('行选择：首列出现复选框，表头是全选。', 'Row selection: a checkbox column first, with select-all in the header.') },
          { name: 'selectedKeys / defaultSelectedKeys', type: 'string[]', description: t('选中的行 key，受控 / 非受控。', 'Selected row keys, controlled / uncontrolled.') },
          { name: 'onSelectionChange', type: '(keys: string[]) => void', description: t('选择变化时。', 'Called when the selection changes.') },
          { name: 'getRowLabel', type: '(row, index) => string', description: t('行的名字，用在复选框的 aria-label 里。默认取第一列的文字。', 'Row name, used in the checkbox aria-label. Defaults to the first column’s text.') },
          { name: 'scroll', type: 'boolean', description: t('可滚动变体：限高、表头吸顶。', 'Scrollable variant: capped height, sticky header.') },
          { name: 'maxHeight', type: 'number | string', default: '320', description: t('可滚动变体的最大高度。', 'Maximum height of the scrollable variant.') },
          { name: 'stackOnMobile', type: 'boolean', description: t('窄屏（< 520px）把每一行变成卡片式的键值对。', 'On narrow screens (< 520px), turns each row into card-style key–value pairs.') },
          { name: 'empty', type: 'ReactNode', default: t("'暂无数据'", "'No data'"), description: t('没有数据时显示的内容。', 'Content shown when there’s no data. The default follows the OinkProvider locale.') },
          { name: 'noHighlight', type: 'boolean', description: t('关掉跟随指针的共享悬停高亮，退回普通的整行变色。', 'Turns off the shared pointer-following hover highlight and falls back to plain row tinting.') },
        ]} />
        <PropsTable title="TableColumn" rows={[
          { name: 'key', type: 'string', required: true, description: t('列标识；没有 accessor / render 时也用它从行数据里取值。', 'Column identifier; without accessor / render, it’s also used to read the value from the row.') },
          { name: 'header', type: 'ReactNode', required: true, description: t('表头内容。', 'Header content.') },
          { name: 'label', type: 'string', description: t('表头不是纯文字时，给读屏和卡片式布局用的文字标签。', 'Text label for screen readers and the card layout when the header isn’t plain text.') },
          { name: 'accessor', type: '(row: T) => unknown', description: t('取值，用于排序和默认渲染。', 'Reads the value, for sorting and default rendering.') },
          { name: 'render', type: '(row: T, index: number) => ReactNode', description: t('自定义单元格。', 'Custom cell.') },
          { name: 'sortable', type: 'boolean', description: t('可排序。', 'Sortable.') },
          { name: 'compare', type: '(a: T, b: T) => number', description: t('自定义比较（升序）；降序时自动取反。', 'Custom comparison (ascending); reversed automatically for descending.') },
          { name: 'numeric', type: 'boolean', description: t('数字列：右对齐、等宽数字。', 'Numeric column: right-aligned, tabular figures.') },
          { name: 'align', type: "'start' | 'center' | 'end'", description: t('对齐方式。', 'Alignment.') },
          { name: 'width', type: 'number | string', description: t('列宽。', 'Column width.') },
        ]} />
        <A11yNotes items={t([
          <>原生 <Code>table</Code>，表头是 <Code>th scope="col"</Code>；名字来自 <Code>caption</Code> 或 <Code>label</Code>，两者至少给一个。</>,
          <>可排序的表头里是真的按钮，Tab 聚焦、Enter / 空格切换；当前状态写在 <Code>aria-sort</Code>（ascending / descending / none）上。箭头只是视觉提示。</>,
          <>行选择用原生复选框，名字是“选择 + 行名”，表头是“选择全部”；用 <Keys k="Tab" /> 移动、<Keys k="Space" /> 切换。选中的行带 <Code>aria-selected</Code>，选中数量通过 <Code>role="status"</Code> 播报。</>,
          <>可滚动（或内容超宽）时容器成为 <Code>role="region"</Code> 且可聚焦，键盘用户用方向键、PageUp / PageDown 滚动。</>,
          'stackOnMobile 把表格元素改成块级后会丢语义，组件已显式写回 table / row / cell 等角色；每个值前面的列名来自表头文字。',
          '悬停高亮只是指针反馈，不影响键盘和读屏；触屏上不出现。',
        ], [
          <>A native <Code>table</Code> with <Code>th scope="col"</Code> headers; its name comes from <Code>caption</Code> or <Code>label</Code>, so provide at least one.</>,
          <>Sortable headers contain real buttons: Tab to focus, Enter / Space to toggle. The current state is set in <Code>aria-sort</Code> (ascending / descending / none); the arrow is only a visual cue.</>,
          <>Row selection uses native checkboxes named “Select + row name”, with “Select all” in the header; <Keys k="Tab" /> to move, <Keys k="Space" /> to toggle. Selected rows have <Code>aria-selected</Code>, and the selected count is announced through <Code>role="status"</Code>.</>,
          <>When scrollable (or wider than its container), the container becomes a focusable <Code>role="region"</Code>, so keyboard users can scroll with the arrow keys and PageUp / PageDown.</>,
          'stackOnMobile makes the table elements block-level, which drops their semantics, so the component explicitly restores the table / row / cell roles; the column name before each value comes from the header text.',
          'The hover highlight is pointer feedback only and doesn’t affect keyboard or screen reader use; it doesn’t appear on touch screens.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
