import { Breadcrumb, Code, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/breadcrumb', title: 'Breadcrumb 面包屑', group: '导航', order: 30, subtitle: 'Breadcrumb', en: { title: 'Breadcrumb' } };

const here = '/components/breadcrumb';

/** 示例里的文字 */
const W = {
  zh: { workspace: '工作台', projects: '项目', redesign: '导航改版', review: '设计评审', drive: '云盘', team: '团队文件', q3: '第三季度', designs: '设计稿', file: '导航改版 v3.fig', path: '文件路径', open: '打开' },
  en: { workspace: 'Workspace', projects: 'Projects', redesign: 'Nav redesign', review: 'Design review', drive: 'Drive', team: 'Team files', q3: 'Q3', designs: 'Designs', file: 'Nav redesign v3.fig', path: 'File path', open: 'Open' },
};
type Words = typeof W.zh;

const codeBasic = (w: Words) => `
const here = '/components/breadcrumb';

<Breadcrumb
  items={[
    { label: '${w.workspace}', href: here },
    { label: '${w.projects}', href: here },
    { label: '${w.redesign}', href: here },
    { label: '${w.review}' },
  ]}
/>`;

const codeMax = (w: Words) => `
<Breadcrumb
  maxItems={3}
  items={[
    { label: '${w.drive}', href: here },
    { label: '${w.team}', href: here },
    { label: '2024', href: here },
    { label: '${w.q3}', href: here },
    { label: '${w.designs}', href: here },
    { label: '${w.file}' },
  ]}
/>`;

const codeButtons = (w: Words) => `
<Breadcrumb
  label="${w.path}"
  separator="/"
  items={[
    { label: 'src', onClick: () => toast('${w.open} src') },
    { label: 'components', onClick: () => toast('${w.open} components') },
    { label: 'generated' },
    { label: 'Button.tsx' },
  ]}
/>`;

export default function BreadcrumbPage() {
  const t = useT();
  const w = t(W.zh, W.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('告诉人“我在哪”，并能一步回到上面的任何一级。层级有三层以上时才值得放；它是辅助导航，不代替主导航。', 'Shows people where they are and lets them jump back to any level above in one step. Only worth adding with three or more levels; it supplements the main navigation rather than replacing it.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('items 按从外到内的顺序给出路径，最后一项是当前页，不是链接。窄于 520px 时自动只留首尾，中间折成一个“…”按钮，点开后露出全部。', 'items lists the path from outermost to innermost; the last item is the current page and isn’t a link. Below 520px only the first and last items stay, and the middle folds into a “…” button that reveals everything when clicked.')}>
        <Demo layout="block" code={codeBasic(w)}>
          <Breadcrumb
            items={[
              { label: w.workspace, href: here },
              { label: w.projects, href: here },
              { label: w.redesign, href: here },
              { label: w.review },
            ]}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('总是折叠', 'Always collapsed')} description={t('路径很深时用 maxItems：项数超过它，任何宽度下都折叠中间项。点“…”展开后焦点会落到第一个露出来的中间项上。', 'For deep paths, use maxItems: past that count, the middle items collapse at any width. After expanding with “…”, focus lands on the first revealed item.')}>
        <Demo layout="block" code={codeMax(w)}>
          <Breadcrumb
            maxItems={3}
            items={[
              { label: w.drive, href: here },
              { label: w.team, href: here },
              { label: '2024', href: here },
              { label: w.q3, href: here },
              { label: w.designs, href: here },
              { label: w.file },
            ]}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('按钮项与自定义分隔符', 'Button items and custom separator')} description={t('条目只有 onClick 没有 href 时渲染成按钮（用于不改变地址的场合）；两者都没有就是纯文字。separator 换掉默认的箭头。', 'An item with onClick but no href renders as a button (for cases that don’t change the URL); with neither, it’s plain text. separator replaces the default chevron.')}>
        <Demo layout="block" code={codeButtons(w)}>
          <Breadcrumb
            label={w.path}
            separator="/"
            items={[
              { label: 'src', onClick: () => toast(`${w.open} src`) },
              { label: 'components', onClick: () => toast(`${w.open} components`) },
              { label: 'generated' },
              { label: 'Button.tsx' },
            ]}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Breadcrumb" rows={[
          { name: 'items', type: 'BreadcrumbItem[]', required: true, description: t('路径，最后一项是当前页。', 'The path; the last item is the current page.') },
          { name: 'label', type: 'string', default: t("'面包屑'", "'Breadcrumb'"), description: t('导航地标的名字。', 'Name of the navigation landmark. The default follows the OinkProvider locale.') },
          { name: 'maxItems', type: 'number', description: t('超过这个数量时任何宽度下都折叠中间项。默认只在窄屏（< 520px）折叠。', 'Past this count, the middle items collapse at any width. By default they only collapse on narrow screens (< 520px).') },
          { name: 'separator', type: 'ReactNode', description: t('分隔符，默认右箭头。', 'Separator; a right chevron by default.') },
        ]} />
        <PropsTable title="BreadcrumbItem" rows={[
          { name: 'label', type: 'ReactNode', required: true, description: t('文字。', 'Text.') },
          { name: 'href', type: 'string', description: t('链接地址。', 'Link URL.') },
          { name: 'onClick', type: '(e: MouseEvent) => void', description: t(<>点击时。没有 <Code>href</Code> 时条目渲染成按钮。</>, <>Called on click. Without <Code>href</Code>, the item renders as a button.</>) },
        ]} />
        <A11yNotes items={t([
          <>外层是 <Code>nav</Code> 地标（名字默认“面包屑”），里面是有序列表 <Code>ol</Code>；最后一项带 <Code>aria-current="page"</Code>。</>,
          '分隔符是装饰，对读屏隐藏，不会被读成“大于号”。',
          '各级是普通的链接或按钮：Tab 依次聚焦，Enter 触发（按钮还有空格）。',
          <>折叠按钮的名字是“显示中间的 N 级路径”，带 <Code>aria-expanded</Code>；展开后按钮消失，焦点自动移到第一个露出来的中间项，不会丢。</>,
          '被折叠的中间项对读屏和键盘同样隐藏，展开前不会 Tab 到。',
        ], [
          <>The outer element is a <Code>nav</Code> landmark (named “Breadcrumb” by default) containing an ordered list <Code>ol</Code>; the last item has <Code>aria-current="page"</Code>.</>,
          'Separators are decorative and hidden from screen readers, so they aren’t read out as “greater than”.',
          'Each level is a plain link or button: Tab moves through them, Enter activates (Space too, for buttons).',
          <>The collapse button is named “Show N hidden levels” and has <Code>aria-expanded</Code>; once expanded the button disappears and focus moves to the first revealed item, so it’s never lost.</>,
          'Collapsed items are hidden from both screen readers and the keyboard; Tab can’t reach them until expanded.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
