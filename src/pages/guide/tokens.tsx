import type { ReactNode } from 'react';
import { Code, CodeBlock, Table } from 'oink-ui';
import type { TableColumn } from 'oink-ui';
import { DocPage, DocSection } from '../../doc';
import { useT } from '../../i18n';
import type { Translate } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import '../../foundations/foundations.css';
import './guide.css';

export const meta: PageMeta = { path: '/guide/tokens', title: '设计令牌', group: '开始', order: 8, subtitle: 'Tokens', en: { title: 'Design tokens' } };

/* 这一页只做索引：每类令牌的可视化、取值和用法写在对应的设计基础页里，这里列名字并链接过去，不重复 */

const go = (to: string, label: string) => <Link to={to} className="g-link ok-focusable">{label}</Link>;

/* rowKey 用 id（与语言无关），kind 是显示的类别名 */
interface Row { id: string; kind: string; tokens: ReactNode; note: ReactNode; page: ReactNode }

const rows = (t: Translate): Row[] => [
  { id: 'brand', kind: t('品牌色', 'Brand'), tokens: <><Code>--ok-ink</Code> <Code>--ok-paper</Code> <Code>--ok-pink</Code></>, note: t('两套主题共用。', 'Shared by both themes.'), page: go('/guide/color', t('色彩 · 品牌色', 'Color · Brand colors')) },
  { id: 'surface', kind: t('表面', 'Surfaces'), tokens: <><Code>--ok-well-2</Code> <Code>--ok-well</Code> <Code>--ok-bg</Code> <Code>--ok-surface</Code> <Code>--ok-card</Code> <Code>--ok-raised</Code> <Code>--ok-pop</Code> <Code>--ok-thumb</Code> <Code>--ok-fill</Code> <Code>--ok-fill-hover</Code> …</>, note: t('从凹到凸的表面色阶，浮层、填充。', 'The surface ladder from recessed to raised, overlays, fills.'), page: go('/guide/color', t('色彩 · 色阶、语义表面', 'Color · Ladder, semantic surfaces')) },
  { id: 'alpha', kind: t('半透明', 'Translucent'), tokens: <><Code>--ok-hover</Code> <Code>--ok-line</Code> <Code>--ok-line-2</Code> <Code>--ok-hi</Code> <Code>--ok-scrim</Code></>, note: t('只有这五个带透明度。', 'The only five tokens with alpha.'), page: go('/guide/color', t('色彩 · 半透明只用在四处', 'Color · Translucency in four places')) },
  { id: 'text', kind: t('文字', 'Text'), tokens: <><Code>--ok-text</Code> <Code>--ok-text-2</Code> <Code>--ok-text-3</Code> <Code>--ok-inverse</Code> <Code>--ok-on-inverse</Code> …</>, note: t('正文三级与反色。', 'Three text levels plus inverse.'), page: go('/guide/color', t('色彩 · 全部色彩令牌', 'Color · All color tokens')) },
  { id: 'accent', kind: t('强调色', 'Accent'), tokens: <><Code>--ok-accent</Code> <Code>--ok-accent-*</Code> <Code>--ok-on-accent</Code></>, note: t('随 data-accent 切换，其余由 color-mix() 派生。', 'Switches with data-accent; the rest is derived with color-mix().'), page: go('/guide/color', t('色彩 · 强调色与状态色', 'Color · Accent and status colors')) },
  { id: 'status', kind: t('状态色', 'Status'), tokens: <><Code>--ok-success</Code> <Code>--ok-warning</Code> <Code>--ok-danger</Code> <Code>--ok-info</Code>{t('，各带 ', ', each with ')}<Code>-text</Code> <Code>-soft</Code></>, note: t('主色共用，文字色深色下提亮。', 'Base colors are shared; text colors are lightened in dark mode.'), page: go('/guide/color', t('色彩 · 状态色', 'Color · Status colors')) },
  { id: 'font', kind: t('字体', 'Fonts'), tokens: <><Code>--ok-font</Code> <Code>--ok-font-display</Code> <Code>--ok-font-mono</Code></>, note: t('系统字体栈。', 'System font stacks.'), page: go('/guide/typography', t('字体 · 三套字体', 'Typography · Three font stacks')) },
  { id: 'fs', kind: t('标题字号', 'Heading sizes'), tokens: <><Code>--ok-fs-display</Code> <Code>--ok-fs-h1</Code> … <Code>--ok-fs-h4</Code></>, note: t('桌面 56 / 40 / 28 / 20 / 17，窄于 520px 时 38 / 30 / 24 / 18 / 16。', '56 / 40 / 28 / 20 / 17 on desktop; 38 / 30 / 24 / 18 / 16 below 520px.'), page: go('/guide/typography', t('字体 · 字阶', 'Typography · Type scale')) },
  { id: 'radius', kind: t('圆角', 'Corner radius'), tokens: <><Code>--ok-r-1</Code> … <Code>--ok-r-6</Code> <Code>--ok-r-full</Code> <Code>--ok-r-nested</Code></>, note: t('8 / 12 / 16 / 24 / 32 / 44 × --ok-rk；--ok-r-nested 由容器向下传。', '8 / 12 / 16 / 24 / 32 / 44 × --ok-rk; --ok-r-nested is passed down by containers.'), page: go('/guide/shape', t('形状 · 圆角、同心圆角', 'Shape · Radius, concentric corners')) },
  { id: 'space', kind: t('间距', 'Spacing'), tokens: <><Code>--ok-s-1</Code> … <Code>--ok-s-16</Code></>, note: t('4pt 栅格，数字 × 4 = 像素。', '4pt grid: number × 4 = pixels.'), page: go('/guide/shape', t('形状 · 间距', 'Shape · Spacing')) },
  { id: 'height', kind: t('控件高度', 'Control heights'), tokens: <><Code>--ok-h-sm</Code> <Code>--ok-h-md</Code> <Code>--ok-h-lg</Code> <Code>--ok-h-item</Code> <Code>--ok-h-item-sub</Code></>, note: t('32 / 40 / 48，列表项 36 / 30；触屏抬高。', '32 / 40 / 48, list items 36 / 30; taller on touch screens.'), page: go('/guide/shape', t('形状 · 控件高度', 'Shape · Control heights')) },
  { id: 'dur', kind: t('时长', 'Durations'), tokens: <><Code>--ok-dur-1</Code> … <Code>--ok-dur-6</Code></>, note: t('90 / 150 / 240 / 360 / 520 / 800ms，已乘 --ok-ms。', '90 / 150 / 240 / 360 / 520 / 800ms, already multiplied by --ok-ms.'), page: go('/guide/motion', t('动效 · 时长', 'Motion · Durations')) },
  { id: 'ease', kind: t('缓动与弹簧', 'Easings and springs'), tokens: <><Code>--ok-ease-*</Code> <Code>--ok-spring</Code> <Code>--ok-spring-soft / snappy / bouncy / wobbly</Code>{t('，各带 ', ', each with ')}<Code>-dur</Code></>, note: t('弹簧是 linear() 缓动加配套时长，成对使用。', 'A spring is a linear() easing plus its matching duration; use them as a pair.'), page: go('/guide/motion', t('动效 · 缓动与弹簧', 'Motion · Easings and springs')) },
  { id: 'float', kind: t('悬浮卡片进退场', 'Floating card enter / exit'), tokens: <><Code>--ok-float-in-dur</Code> <Code>--ok-float-in-ease</Code> <Code>--ok-float-fade-dur</Code> <Code>--ok-float-out-dur</Code> <Code>--ok-float-out-ease</Code></>, note: t('303 / 100 / 160ms，进场 spring-soft、退场 ease-in。所有悬浮卡片共用。', '303 / 100 / 160ms; spring-soft in, ease-in out. Shared by every floating card.'), page: go('/guide/motion', t('动效 · 悬浮卡片', 'Motion · Floating cards')) },
  { id: 'global', kind: t('全局开关', 'Global switches'), tokens: <><Code>--ok-ms</Code> <Code>--ok-rk</Code> <Code>--ok-corner</Code></>, note: t('动效倍率（减弱动效时为 0）、圆角倍率、圆角曲线。', 'Motion multiplier (0 under reduced motion), corner radius multiplier, corner curve.'), page: go('/guide/theming', t('主题', 'Theming')) },
];

const columns = (t: Translate): TableColumn<Row>[] => [
  { key: 'kind', header: t('类别', 'Category') },
  { key: 'tokens', header: t('令牌', 'Tokens'), render: (r) => <span className="f-token-list">{r.tokens}</span> },
  { key: 'note', header: t('说明', 'Notes'), render: (r) => <span className="f-token-note">{r.note}</span> },
  { key: 'page', header: t('详见', 'See'), render: (r) => r.page },
];

const USAGE = {
  zh: `.my-panel {
  padding: var(--ok-s-5);
  border-radius: var(--ok-r-4); corner-shape: var(--ok-corner);
  background: var(--ok-card); color: var(--ok-text);
  box-shadow: inset 0 0 0 1px var(--ok-line), inset 0 1.5px 0 var(--ok-hi);   /* 内描边 + 顶部高光，不是投影 */
  transition: transform var(--ok-spring-dur) var(--ok-spring), opacity var(--ok-dur-2) var(--ok-ease-out);
}
.my-title { font: 700 var(--ok-fs-h2)/1.25 var(--ok-font-display); }`,
  en: `.my-panel {
  padding: var(--ok-s-5);
  border-radius: var(--ok-r-4); corner-shape: var(--ok-corner);
  background: var(--ok-card); color: var(--ok-text);
  box-shadow: inset 0 0 0 1px var(--ok-line), inset 0 1.5px 0 var(--ok-hi);   /* inner stroke + top highlight, not a drop shadow */
  transition: transform var(--ok-spring-dur) var(--ok-spring), opacity var(--ok-dur-2) var(--ok-ease-out);
}
.my-title { font: 700 var(--ok-fs-h2)/1.25 var(--ok-font-display); }`,
};

export default function Tokens() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '所有令牌都是 :root 上的 CSS 变量，前缀 --ok-。组件样式只引用令牌，不写死色值和毫秒数；自己写样式时也一样，主题、强调色和动效偏好就会自动生效。',
        'Every token is a CSS variable on :root, prefixed --ok-. Component styles only reference tokens and never hard-code colors or milliseconds; do the same in your own styles and theme, accent color and motion preferences take effect automatically.',
      )}
    >
      <DocSection title={t('令牌一览', 'Token index')} description={t('每一类令牌的取值、可视化和使用规矩写在对应的设计基础页里，点右侧链接查看。颜色的值随主题和强调色变化，在色彩页里实时读出。', 'Values, visualizations and usage rules for each category live on the matching foundations page; follow the link on the right. Color values change with theme and accent color and are read live on the Color page.')}>
        <Table label={t('令牌一览', 'Token index')} columns={columns(t)} data={rows(t)} rowKey="id" stackOnMobile />
      </DocSection>

      <DocSection title={t('在自己的样式里用', 'Using tokens in your own styles')} description={t('引用令牌而不是抄数值：深浅色、强调色、触屏高度、窄屏字号和减弱动效都会自动跟上。', 'Reference tokens instead of copying values: light and dark themes, accent color, touch-screen heights, narrow-screen type sizes and reduced motion all follow along.')}>
        <CodeBlock code={t(USAGE.zh, USAGE.en)} language="css" />
        <div className="g-prose">
          {t(
            <p>圆角要配 <Code>corner-shape: var(--ok-corner)</Code>；全圆用 <Code>--ok-r-full</Code> 配 <Code>corner-shape: round</Code>。弹簧缓动和它的时长令牌成对使用。缺令牌的时候在自己的样式里用局部变量，不要改写库的 <Code>--ok-*</Code>（主题相关的几个全局开关除外，见 <Link to="/guide/theming" className="g-link ok-focusable">主题</Link>）。</p>,
            <p>Pair a corner radius with <Code>corner-shape: var(--ok-corner)</Code>; for fully rounded shapes use <Code>--ok-r-full</Code> with <Code>corner-shape: round</Code>. Use spring easings together with their duration tokens. When a token is missing, use a local variable in your own styles rather than overriding the library’s <Code>--ok-*</Code> (except for the few theme-related global switches; see <Link to="/guide/theming" className="g-link ok-focusable">Theming</Link>).</p>,
          )}
        </div>
      </DocSection>
    </DocPage>
  );
}
