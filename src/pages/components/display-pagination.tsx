import { useState } from 'react';
import { Code, Pagination, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/pagination', title: 'Pagination 分页', group: '导航', order: 40, subtitle: 'Pagination', en: { title: 'Pagination' } };

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [page, setPage] = useState(6);
  return (
    <Stack gap={3} align="center">
      <Pagination count={20} page={page} onChange={setPage} />
      <Text tone="neutral" variant="caption">正在显示第 {(page - 1) * 10 + 1}–{page * 10} 条，共 200 条</Text>
    </Stack>
  );
}`,
  en: `
function ControlledDemo() {
  const [page, setPage] = useState(6);
  return (
    <Stack gap={3} align="center">
      <Pagination count={20} page={page} onChange={setPage} />
      <Text tone="neutral" variant="caption">Showing {(page - 1) * 10 + 1}–{page * 10} of 200</Text>
    </Stack>
  );
}`,
};

const CODE_RANGE = {
  zh: `
<Stack gap={3} align="center">
  <Pagination label="分页：两侧各两个" count={50} defaultPage={25} siblings={2} />
  <Pagination label="分页：首尾各两个" count={50} defaultPage={25} boundaries={2} />
</Stack>`,
  en: `
<Stack gap={3} align="center">
  <Pagination label="Pagination: two siblings" count={50} defaultPage={25} siblings={2} />
  <Pagination label="Pagination: two boundaries" count={50} defaultPage={25} boundaries={2} />
</Stack>`,
};

const CODE_SIZES = {
  zh: `
<Stack gap={3} align="center">
  <Pagination label="分页：小号" size="sm" count={8} defaultPage={3} />
  <Pagination label="分页：禁用" count={8} defaultPage={3} disabled />
</Stack>`,
  en: `
<Stack gap={3} align="center">
  <Pagination label="Pagination: small" size="sm" count={8} defaultPage={3} />
  <Pagination label="Pagination: disabled" count={8} defaultPage={3} disabled />
</Stack>`,
};

function ControlledDemo() {
  const t = useT();
  const [page, setPage] = useState(6);
  const from = (page - 1) * 10 + 1;
  const to = page * 10;
  return (
    <Stack gap={3} align="center">
      <Pagination count={20} page={page} onChange={setPage} />
      <Text tone="neutral" variant="caption">{t(`正在显示第 ${from}–${to} 条，共 200 条`, `Showing ${from}–${to} of 200`)}</Text>
    </Stack>
  );
}

export default function PaginationPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('把很长的列表切成一页一页，并让人知道一共有多少、现在在哪。内容是连续阅读的信息流时，“加载更多”通常比分页合适。', 'Splits a long list into pages and tells people how many there are and where they are. For a feed meant to be read continuously, “Load more” is usually a better fit than pagination.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('count 是总页数。页数不多时全部列出。窄于 520px 时自动简化成“上一页 · 当前页 / 总页数 · 下一页”。', 'count is the total number of pages. With only a few, all are listed. Below 520px it simplifies to “Previous · current / total · Next”.')}>
        <Demo code={`<Pagination count={5} defaultPage={2} />`}>
          <Pagination count={5} defaultPage={2} />
        </Demo>
      </DocSection>

      <DocSection title={t('页数很多时', 'Many pages')} description={t('放不下的页码折成省略号：首尾各固定显示 boundaries 个，当前页两侧各显示 siblings 个。按钮总数保持不变，翻页时布局不会左右跳。', 'Page numbers that don’t fit collapse into ellipses: boundaries pages are always shown at each end, and siblings pages on each side of the current one. The number of buttons stays constant, so the layout doesn’t shift as you page.')}>
        <Demo code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}>
          <ControlledDemo />
        </Demo>
        <Demo title={t('siblings 与 boundaries', 'siblings and boundaries')} code={t(CODE_RANGE.zh, CODE_RANGE.en)}>
          <Stack gap={3} align="center">
            <Pagination label={t('分页：两侧各两个', 'Pagination: two siblings')} count={50} defaultPage={25} siblings={2} />
            <Pagination label={t('分页：首尾各两个', 'Pagination: two boundaries')} count={50} defaultPage={25} boundaries={2} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸与禁用', 'Sizes and disabled')} description={t('两档尺寸：md（默认）和 sm。disabled 让整个分页不可用（比如数据加载中）。', 'Two sizes: md (default) and sm. disabled turns off the whole pagination (while data is loading, say).')}>
        <Demo code={t(CODE_SIZES.zh, CODE_SIZES.en)}>
          <Stack gap={3} align="center">
            <Pagination label={t('分页：小号', 'Pagination: small')} size="sm" count={8} defaultPage={3} />
            <Pagination label={t('分页：禁用', 'Pagination: disabled')} count={8} defaultPage={3} disabled />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'count', type: 'number', required: true, description: t('总页数。', 'Total number of pages.') },
          { name: 'page / defaultPage', type: 'number', default: '1', description: t('当前页，从 1 开始；受控 / 非受控。超出范围会被夹到 1 和 count 之间。', 'Current page, starting at 1; controlled / uncontrolled. Out-of-range values are clamped between 1 and count.') },
          { name: 'onChange', type: '(page: number) => void', description: t('翻页时。', 'Called when the page changes.') },
          { name: 'siblings', type: 'number', default: '1', description: t('当前页两侧各显示几个页码。', 'Page numbers shown on each side of the current page.') },
          { name: 'boundaries', type: 'number', default: '1', description: t('首尾各固定显示几个页码。', 'Page numbers always shown at each end.') },
          { name: 'label', type: 'string', default: t("'分页'", "'Pagination'"), description: t('导航地标的名字。一页里有多个分页时要各不相同。', 'Name of the navigation landmark; must be unique when a page has several. The default follows the OinkProvider locale.') },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: t('尺寸。', 'Size.') },
          { name: 'disabled', type: 'boolean', description: t('整体禁用。', 'Disables the whole pagination.') },
        ]} />
        <Text as="p" tone="neutral">{t(
          <>另外导出了纯函数 <Code>paginationRange(count, page, siblings?, boundaries?)</Code>，返回页码数组（0 代表省略号），自己画分页时可以直接用。</>,
          <>There’s also a pure function, <Code>paginationRange(count, page, siblings?, boundaries?)</Code>, that returns the array of page numbers (0 stands for an ellipsis), handy when drawing your own pagination.</>,
        )}</Text>
        <A11yNotes items={t([
          <>外层是 <Code>nav</Code> 地标；每个页码是按钮，名字是“第 N 页”，当前页带 <Code>aria-current="page"</Code>。</>,
          '上一页 / 下一页是带名字的图标按钮，到头时用原生 disabled 禁用。',
          'Tab 在按钮间移动，Enter 或空格翻页。省略号是装饰，对读屏隐藏。',
          <>翻页后通过 <Code>role="status"</Code> 播报“第 N 页，共 M 页”；窄屏下可见的“N / M”对读屏隐藏，避免读两遍。</>,
          '翻页后请自己把焦点或滚动位置带回列表顶部，组件不替你决定。',
        ], [
          <>The outer element is a <Code>nav</Code> landmark; each page number is a button named “Page N”, and the current page has <Code>aria-current="page"</Code>.</>,
          'Previous / Next are named icon buttons, disabled with native disabled at either end.',
          'Tab moves between buttons; Enter or Space changes the page. Ellipses are decorative and hidden from screen readers.',
          <>After a page change, <Code>role="status"</Code> announces “Page N of M”; the visible “N / M” on narrow screens is hidden from screen readers so it isn’t read twice.</>,
          'After a page change, move focus or scroll back to the top of the list yourself; the component leaves that decision to you.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
