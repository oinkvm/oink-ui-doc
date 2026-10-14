import type { CSSProperties, ReactNode } from 'react';
import { ACCENTS, Button, Code, ColorSwatches, Grid, Inline, Stack, Text, Tooltip, isCustomAccent, useOink } from 'oink-ui';
import type { Accent, AccentPreset } from 'oink-ui';
import { Demo, DocPage, DocSection } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import { OnlyTheme, contrast, copy, luminance, useAccentColors, useTokenColors } from '../../foundations/lib';
import '../../foundations/foundations.css';
import './guide.css';

export const meta: PageMeta = { path: '/guide/color', title: '色彩', group: '开始', order: 3, subtitle: 'Color', en: { title: 'Color' } };

const ACCENT_NAME: { zh: Record<AccentPreset, string>; en: Record<AccentPreset, string> } = {
  zh: { pink: '粉', orange: '橙', amber: '黄', blue: '蓝', violet: '紫' },
  en: { pink: 'Pink', orange: 'Orange', amber: 'Amber', blue: 'Blue', violet: 'Violet' },
};

/* ------------------------------------------------------------------ 品牌色 */

function BrandColors() {
  const t = useT();
  const hex = useTokenColors(['ink', 'paper', 'accent', 'inverse', 'inverse-hover']);
  const { accent, resolvedTheme } = useOink();
  const dark = resolvedTheme === 'dark';
  const tiles: Array<{ key: string; name: string; token: string; fg: string; role: ReactNode }> = [
    { key: 'ink', name: t('Ink 墨', 'Ink'), token: 'ink', fg: 'var(--ok-paper)', role: dark ? t('强调色和主按钮上的文字', 'Text on the accent color and primary buttons') : t('正文、主按钮', 'Body text, primary buttons') },
    { key: 'accent', name: isCustomAccent(accent) ? t(`自定义 ${accent}`, `Custom ${accent}`) : t(`${accent} ${ACCENT_NAME.zh[accent]}`, ACCENT_NAME.en[accent]), token: 'accent', fg: 'var(--ok-on-accent)', role: t('主操作、少数状态、焦点环', 'Primary actions, a few states, focus ring') },
    { key: 'paper', name: t('Paper 纸', 'Paper'), token: 'paper', fg: 'var(--ok-ink)', role: dark ? t('正文', 'Body text') : t('主按钮上的文字', 'Text on primary buttons') },
  ];
  return (
    <Stack gap={3}>
      <div className="f-brand">
        {tiles.map((tile) => (
          <button
            key={tile.key} type="button" className="f-brand__tile ok-focusable"
            style={{ '--c': `var(--ok-${tile.token})`, '--f': tile.fg } as CSSProperties}
            onClick={() => copy(hex[tile.token] ?? '', t)}
            aria-label={t(`${tile.name} ${hex[tile.token] ?? ''}，点击复制`, `${tile.name} ${hex[tile.token] ?? ''}, click to copy`)}
          >
            <b>{tile.name}</b><span>{hex[tile.token] ?? '…'}</span><em>{tile.role}</em>
          </button>
        ))}
      </div>
      <Text as="p" variant="caption" tone="neutral" style={{ margin: 0 }}>
        <OnlyTheme theme="light">{t('浅色主题下，墨色是正文和主按钮的底色，纸色是主按钮上的文字。', 'In the light theme, ink is the color of body text and the fill of primary buttons; paper is the text on primary buttons.')}</OnlyTheme>
        <OnlyTheme theme="dark">
          {t(
            <>深色主题下，纸色是正文；主按钮、滑块圆钮这些“白色元素”不直接用纸色，而是 {hex.inverse ?? '…'}（<Code>--ok-inverse</Code>、<Code>--ok-thumb</Code>），悬停 {hex['inverse-hover'] ?? '…'}；它们上面的文字回到墨色。</>,
            <>In the dark theme, paper is the body text color. “White” elements such as primary buttons and slider thumbs don’t use paper directly but {hex.inverse ?? '…'} (<Code>--ok-inverse</Code>, <Code>--ok-thumb</Code>), {hex['inverse-hover'] ?? '…'} on hover; the text on them goes back to ink.</>,
          )}
        </OnlyTheme>
      </Text>
    </Stack>
  );
}

/* ------------------------------------------------------------------ 色阶 */

type ScaleItem = [token: string, zh: string, en: string];

const NEUTRAL: ScaleItem[] = [
  ['raised', '浮起', 'Raised'], ['card', '卡片', 'Card'], ['pop', '浮层', 'Popover'], ['thumb', '圆钮', 'Thumb'], ['surface', '面板', 'Surface'], ['bg', '画布', 'Canvas'],
  ['well', '凹槽', 'Well'], ['fill', '填充', 'Fill'], ['well-2', '轨道', 'Track'], ['fill-hover', '填充悬停', 'Fill hover'],
  ['text-3', '辅助字', 'Tertiary text'], ['text-2', '次要字', 'Secondary text'], ['inverse', '主按钮', 'Primary button'], ['text', '正文', 'Body text'],
];
const ACCENT_SCALE: ScaleItem[] = [
  ['accent-soft', '柔和底', 'Soft fill'], ['accent-tint', '柔色', 'Tint'], ['accent-tint-2', '柔色 2', 'Tint 2'], ['accent-ring', '选区', 'Selection'],
  ['accent-fill', '填充', 'Fill'], ['accent-fill-hover', '填充悬停', 'Fill hover'], ['accent', '强调色', 'Accent'], ['accent-hover', '悬停', 'Hover'], ['accent-text', '文字', 'Text'],
];

/** 一条色阶：取值相同的令牌并成一块；浅色主题从浅排到深，深色主题反过来 */
function Scale({ tokens, label }: { tokens: ScaleItem[]; label: string }) {
  const t = useT();
  const hex = useTokenColors(tokens.map((x) => x[0]));
  const dark = useOink().resolvedTheme === 'dark';
  const tiles: Array<{ hex: string; names: string[]; labels: string[] }> = [];
  tokens.forEach(([name, zh, en]) => {
    const lab = t(zh, en);
    const h = hex[name];
    if (!h) return;
    const same = tiles.find((x) => x.hex === h);
    if (same) { same.names.push(name); same.labels.push(lab); } else tiles.push({ hex: h, names: [name], labels: [lab] });
  });
  tiles.sort((x, y) => (luminance(y.hex) - luminance(x.hex)) * (dark ? -1 : 1));
  return (
    <div className="f-scale" role="group" aria-label={label}>
      {tiles.map((tile) => (
        <Tooltip key={tile.names.join()} content={tile.names.map((n) => '--ok-' + n).join(' · ')}>
          <button
            type="button" className="ok-focusable"
            style={{ '--c': `var(--ok-${tile.names[0]})`, '--f': luminance(tile.hex) > 0.3 ? 'var(--ok-ink)' : 'var(--ok-paper)' } as CSSProperties}
            onClick={() => copy(tile.hex, t)}
            aria-label={t(`${tile.labels.join('、')} ${tile.hex}，点击复制`, `${tile.labels.join(', ')} ${tile.hex}, click to copy`)}
          >
            <b>{tile.labels.join(' · ')}</b><span>{tile.hex}</span>
          </button>
        </Tooltip>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 语义表面 */

function Surfaces() {
  const hex = useTokenColors(['bg', 'surface', 'card', 'well', 'raised', 'pop']);
  return (
    <div className="f-surfaces">
      <div className="f-surfaces__bg"><code>--ok-bg <i>{hex.bg}</i></code>
        <div className="f-surfaces__surface"><code>--ok-surface <i>{hex.surface}</i></code>
          <div className="f-surfaces__card"><code>--ok-card <i>{hex.card}</i></code>
            <div className="f-surfaces__row">
              <div className="f-surfaces__well"><code>--ok-well<i>{hex.well}</i></code></div>
              <div className="f-surfaces__raised"><code>--ok-raised<i>{hex.raised}</i></code></div>
              <div className="f-surfaces__pop"><code>--ok-pop<i>{hex.pop}</i></code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SurfaceRules() {
  const t = useT();
  const hex = useTokenColors(['accent', 'on-accent', 'card', 'accent-text']);
  const onWhite = (hex['on-accent'] ?? '').startsWith('#FFFFFF');
  return (
    <div className="g-prose">
      {t(
        <ul>
          <li><strong>6 : 3 : 1。</strong>中性表面占六成，墨色（文字、主按钮）三成，强调色至多一成。</li>
          <li><strong>强调色不写字。</strong>当前强调色压在卡片上只有 {contrast(hex.accent, hex.card)}:1，达不到正文需要的 4.5:1，只做填充和图形；文字用 <Code>--ok-accent-text</Code>（<OnlyTheme theme="light">浅色取每种强调色单独定的一档深色</OnlyTheme><OnlyTheme theme="dark">深色往白里提亮</OnlyTheme>，现在是 {hex['accent-text'] ?? '…'}，对比度 {contrast(hex['accent-text'], hex.card)}:1）。</li>
          <li><strong>强调色上用{onWhite ? '白' : '墨'}。</strong>强调色填充之上的文字和图标用 <Code>--ok-on-accent</Code>，当前对比度 {contrast(hex.accent, hex['on-accent'])}:1。按强调色的感知亮度自动选：比较暗的颜色上用白字（预设里只有蓝色），其余用墨色；自定义颜色也一样。</li>
          <li><strong>柔和底不透明。</strong><Code>--ok-*-soft</Code> 是用 <Code>color-mix()</Code> 混出来的固有色：<OnlyTheme theme="light">浅色主题把强调色或状态色按比例混进纯白（强调色 16%）</OnlyTheme><OnlyTheme theme="dark">深色主题混进卡片色 #2A2927（强调色 16%）；这是固定值，不跟页面底色走</OnlyTheme>。压在凹槽、灰底上时用更浓的 <Code>--ok-accent-tint</Code>。</li>
          <li><strong>不用阴影。</strong>层级靠表面色阶和发丝线区分，见 <Link to="/guide/shape" className="g-link ok-focusable">形状 · 间距 · 层级</Link>。</li>
        </ul>,
        <ul>
          <li><strong>6 : 3 : 1.</strong> Neutral surfaces take 60%, ink (text, primary buttons) 30%, and the accent color at most 10%.</li>
          <li><strong>No text in the accent color.</strong> The current accent color on a card reaches only {contrast(hex.accent, hex.card)}:1, short of the 4.5:1 body text needs, so it is used only for fills and graphics. Text uses <Code>--ok-accent-text</Code> (<OnlyTheme theme="light">in the light theme, a darker shade defined per accent color</OnlyTheme><OnlyTheme theme="dark">in the dark theme, lightened toward white</OnlyTheme>; currently {hex['accent-text'] ?? '…'}, contrast {contrast(hex['accent-text'], hex.card)}:1).</li>
          <li><strong>{onWhite ? 'White' : 'Ink'} on the accent color.</strong> Text and icons on accent fills use <Code>--ok-on-accent</Code>, currently at {contrast(hex.accent, hex['on-accent'])}:1. It is chosen automatically from the accent color’s perceived lightness: white on darker colors (only blue among the presets), ink on the rest; custom colors work the same way.</li>
          <li><strong>Soft fills are opaque.</strong> <Code>--ok-*-soft</Code> are solid colors mixed with <Code>color-mix()</Code>: <OnlyTheme theme="light">the light theme mixes the accent or status color into pure white (16% for the accent)</OnlyTheme><OnlyTheme theme="dark">the dark theme mixes it into the card color #2A2927 (16% for the accent); this is a fixed value and doesn’t follow the page background</OnlyTheme>. On wells or gray backgrounds, use the stronger <Code>--ok-accent-tint</Code>.</li>
          <li><strong>No shadows.</strong> Depth comes from the surface ladder and hairlines; see <Link to="/guide/shape" className="g-link ok-focusable">Shape · Spacing · Layers</Link>.</li>
        </ul>,
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ 强调色与状态色 */

function AccentCard() {
  const t = useT();
  const { accent, setAccent } = useOink();
  const colors = useAccentColors();
  const hex = useTokenColors(['accent']);
  const ready = ACCENTS.every((a) => colors[a]);
  const names = t(ACCENT_NAME.zh, ACCENT_NAME.en);
  return (
    <Stack gap={5} className="g-fill">
      <Inline gap={4} justify="between" align="center">
        {ready
          ? <ColorSwatches aria-label={t('强调色', 'Accent color')} colors={ACCENTS.map((a) => ({ value: a, color: colors[a]!, label: names[a] }))} value={accent} onChange={(v) => setAccent(v as Accent)} />
          : <span className="f-swatches-ph" aria-hidden="true" />}
        <code className="f-mono-note">{accent} · {hex.accent ?? '…'}</code>
      </Inline>
      <div className="f-derived">
        <span style={{ background: 'var(--ok-accent)', color: 'var(--ok-on-accent)' }}>accent</span>
        <span style={{ background: 'var(--ok-accent-fill)', color: 'var(--ok-on-accent)' }}>fill</span>
        <span style={{ background: 'var(--ok-accent-hover)', color: 'var(--ok-on-accent)' }}>hover</span>
        <span style={{ background: 'var(--ok-accent-tint)', color: 'var(--ok-text)' }}>tint</span>
        <span style={{ background: 'var(--ok-accent-soft)', color: 'var(--ok-accent-text)' }}>soft + text</span>
        <span className="f-derived__ring">{t('焦点环', 'Focus ring')}</span>
      </div>
      <Inline gap={3}>
        <Button variant="accent">{t('强调按钮', 'Accent')}</Button>
        <Button variant="primary">{t('主按钮', 'Primary')}</Button>
        <Button>{t('默认按钮', 'Default')}</Button>
      </Inline>
    </Stack>
  );
}

const STATUS: Array<[key: string, zh: string, en: string]> = [['success', '成功', 'Success'], ['warning', '警告', 'Warning'], ['danger', '危险', 'Danger'], ['info', '信息', 'Info']];

function StatusColors() {
  const t = useT();
  const hex = useTokenColors(STATUS.flatMap(([k]) => [k, `${k}-text`, `${k}-soft`]));
  return (
    <div className="f-status">
      {STATUS.map(([k, zh, en]) => {
        const name = t(zh, en);
        return (
          <button
            type="button" key={k} className="f-status__item ok-focusable" onClick={() => copy(hex[k] ?? '', t)}
            style={{ '--c': `var(--ok-${k})`, '--s': `var(--ok-${k}-soft)`, '--t': `var(--ok-${k}-text)` } as CSSProperties}
            aria-label={t(`${name} ${hex[k] ?? ''}，点击复制`, `${name} ${hex[k] ?? ''}, click to copy`)}
          >
            <i aria-hidden="true" />
            <b>{name} <code>{k}</code></b>
            <span>
              {t('主色', 'Base')} {hex[k] ?? '…'} · {t('文字', 'Text')} {hex[`${k}-text`] ?? '…'} · {t('柔和底', 'Soft')} {hex[`${k}-soft`] ?? '…'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ 半透明 */

function Translucency() {
  const t = useT();
  const hex = useTokenColors(['hover', 'line', 'line-2', 'hi', 'scrim']);
  return (
    <div className="f-alpha">
      <figure>
        <div className="f-alpha__stage"><Button disabled>{t('不可用', 'Unavailable')}</Button></div>
        <figcaption><b>{t('禁用态', 'Disabled')}</b><span>{t('整个控件降低不透明度（按钮是 .42），并显示禁止指针。', 'The whole control drops in opacity (.42 for buttons) and shows the not-allowed cursor.')}</span></figcaption>
      </figure>
      <figure>
        <div className="f-alpha__stage">
          <div className="f-alpha__list" aria-hidden="true"><span>{t('收件箱', 'Inbox')}</span><span className="is-hover">{t('已发送', 'Sent')}</span><span>{t('草稿', 'Drafts')}</span></div>
        </div>
        <figcaption><b>{t('悬停高亮', 'Hover highlight')}</b><span><code>--ok-hover</code> {hex.hover ?? '…'}{t('：列表行、菜单项、表格行悬停时叠一层。', ': layered over list rows, menu items and table rows on hover.')}</span></figcaption>
      </figure>
      <figure>
        <div className="f-alpha__stage"><div className="f-alpha__lines" aria-hidden="true"><i /><i /></div></div>
        <figcaption>
          <b>{t('发丝线', 'Hairlines')}</b>
          <span><code>--ok-line</code> {hex.line ?? '…'}{t('、', ', ')}<code>--ok-line-2</code> {hex['line-2'] ?? '…'}{t('，顶部高光 ', '; top highlight ')}<code>--ok-hi</code> {hex.hi ?? '…'}{t('。', '.')}</span>
        </figcaption>
      </figure>
      <figure>
        <div className="f-alpha__stage f-alpha__stage--scrim" aria-hidden="true"><span className="f-alpha__page" /><span className="f-alpha__scrim" /><span className="f-alpha__dialog" /></div>
        <figcaption><b>{t('模态遮罩', 'Modal scrim')}</b><span><code>--ok-scrim</code> {hex.scrim ?? '…'}{t('：对话框背后压暗页面，并把页面模糊 8px。', ': dims the page behind a dialog and blurs it by 8px.')}</span></figcaption>
      </figure>
    </div>
  );
}

/* ------------------------------------------------------------------ 全部色彩令牌 */

const ALL: Array<{ key: string; title: { zh: string; en: string }; note: { zh: string; en: string }; tokens: string[] }> = [
  { key: 'brand', title: { zh: '品牌', en: 'Brand' }, note: { zh: '三个品牌色，两套主题共用。', en: 'The three brand colors, shared by both themes.' }, tokens: ['ink', 'paper', 'pink'] },
  { key: 'surface', title: { zh: '表面', en: 'Surfaces' }, note: { zh: '从凹到凸：深凹槽 → 凹槽 → 画布 → 面板 → 卡片 → 浮起；浮层和滑块圆钮单列。', en: 'From recessed to raised: deep well → well → canvas → surface → card → raised; popovers and slider thumbs are listed separately.' }, tokens: ['well-2', 'well', 'well-hi', 'bg', 'surface', 'card', 'raised', 'pop', 'thumb', 'fill', 'fill-hover', 'scrollbar', 'scrollbar-hover'] },
  { key: 'alpha', title: { zh: '半透明', en: 'Translucent' }, note: { zh: '只有这五个令牌带透明度。', en: 'The only five tokens with alpha.' }, tokens: ['hover', 'line', 'line-2', 'hi', 'scrim'] },
  { key: 'text', title: { zh: '文字与反色', en: 'Text and inverse' }, note: { zh: '三级文字色对比度不足 4.5:1，只用于装饰性文字；反色是主按钮的底色和它上面的文字。', en: 'The third text color falls short of 4.5:1 and is for decorative text only; inverse is the fill of primary buttons and the text on it.' }, tokens: ['text', 'text-2', 'text-3', 'inverse', 'inverse-hover', 'on-inverse'] },
  { key: 'accent', title: { zh: '强调色', en: 'Accent' }, note: { zh: '除了 --ok-accent、--ok-accent-deep 和 --ok-on-accent，其余都是用 color-mix() 派生的。', en: 'Apart from --ok-accent, --ok-accent-deep and --ok-on-accent, all are derived with color-mix().' }, tokens: ['accent', 'accent-deep', 'accent-hover', 'accent-fill', 'accent-fill-hover', 'accent-tint', 'accent-tint-2', 'accent-soft', 'accent-ring', 'accent-text', 'on-accent'] },
  { key: 'status', title: { zh: '状态色', en: 'Status' }, note: { zh: '主色两套主题共用；-text 是能当文字用的一档，深色下提亮；-soft 是不透明的柔和底。', en: 'Base colors are shared by both themes; -text is the shade usable for text, lightened in dark mode; -soft is an opaque soft fill.' }, tokens: ['success', 'success-text', 'success-soft', 'warning', 'warning-text', 'warning-soft', 'danger', 'danger-text', 'danger-soft', 'danger-soft-2', 'info', 'info-text', 'info-soft'] },
];

function Swatches({ tokens }: { tokens: string[] }) {
  const values = useTokenColors(tokens);
  return (
    <div className="g-swatches">
      {tokens.map((tk) => (
        <div key={tk} className="g-swatch">
          <div className="g-swatch__chip" style={{ background: `var(--ok-${tk})` }} />
          <span className="g-swatch__name">--ok-{tk}</span>
          <span className="g-swatch__value">{values[tk] ?? '…'}</span>
        </div>
      ))}
    </div>
  );
}

export default function ColorPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '界面里的每个颜色都是一个语义令牌，深浅两套主题各有一组取值。本页的色块和色值都是从当前页面的 CSS 变量实时读出来的：用右上角切换深浅色或强调色，它们会跟着变。点击色块复制色值。',
        'Every color in the interface is a semantic token with one set of values for the light theme and one for the dark. The swatches and values on this page are read live from the page’s CSS variables: switch theme or accent color in the top-right corner and they follow. Click a swatch to copy its value.',
      )}
    >
      <DocSection title={t('品牌色', 'Brand colors')} description={t('墨、强调色、纸三个品牌色本身不随主题变化，变的是它们担任的角色。', 'The three brand colors, ink, accent and paper, don’t change with the theme; what changes is the role each one plays.')}>
        <BrandColors />
      </DocSection>

      <DocSection
        title={t('色阶', 'Color ladders')}
        description={t(
          <>
            每个色块是一个令牌在当前主题下的取值，取值相同的令牌并成一块，悬停可以看到令牌名。
            <OnlyTheme theme="light">浅色主题的中性色是带一点冷调、向墨色收敛的灰：浮起的控件、卡片、浮层用纯白，面板和页面底色依次略灰一点，再往下是凹槽和轨道。强调色往纯白里混出柔和底、柔色和填充，往墨色里压出悬停色。</OnlyTheme>
            <OnlyTheme theme="dark">深色主题换成略带暖调的深灰，不用死黑：凹槽最深，往上依次是画布、面板、卡片、浮层和浮起的控件。强调色的柔和底和柔色改成往卡片色里混，悬停色和文字色往白里提亮。</OnlyTheme>
          </>,
          <>
            Each swatch is one token’s value in the current theme; tokens with the same value share a swatch, and hovering shows the token names.{' '}
            <OnlyTheme theme="light">Light-theme neutrals are slightly cool grays that converge toward ink: raised controls, cards and popovers are pure white, the surface and page background get progressively grayer, and wells and tracks sit below them. The accent color is mixed into pure white for the soft fill, tint and fill, and pushed toward ink for hover.</OnlyTheme>
            <OnlyTheme theme="dark">The dark theme switches to slightly warm dark grays rather than pure black: wells are the deepest, followed upward by canvas, surface, card, popover and raised controls. The accent soft fill and tint are mixed into the card color instead, and hover and text colors are lightened toward white.</OnlyTheme>
          </>,
        )}
      >
        <Demo title={t('中性色', 'Neutrals')} layout="block"><Scale tokens={NEUTRAL} label={t('中性色', 'Neutrals')} /></Demo>
        <Demo title={t('强调色', 'Accent')} layout="block"><Scale tokens={ACCENT_SCALE} label={t('强调色', 'Accent')} /></Demo>
      </DocSection>

      <DocSection title={t('语义表面', 'Semantic surfaces')} description={t('界面由几层表面叠出来：画布 → 面板 → 卡片，再往里凹（凹槽）或往外浮（浮起的控件、浮层）。浅色下越往上越白；深色下越往上越亮，凹槽比画布更深。', 'The interface is built from stacked surfaces: canvas → surface → card, then either recessed inward (wells) or raised outward (raised controls, popovers). In the light theme each layer up is whiter; in the dark theme each layer up is lighter, and wells are deeper than the canvas.')}>
        <Demo layout="block"><Surfaces /></Demo>
        <SurfaceRules />
      </DocSection>

      <DocSection title={t('强调色与状态色', 'Accent and status colors')} description={t('五种预设强调色，默认是粉色（pink），也可以用任意颜色。柔和底、填充、悬停色、文字色都由 color-mix() 从一个颜色派生，深浅两套主题各有一组配比。这里切换强调色会改整站的设置。', 'Five preset accent colors, pink by default, or any color you like. The soft fill, fill, hover and text colors are all derived from that one color with color-mix(), with separate ratios for the light and dark themes. Switching the accent color here changes it for the whole site.')}>
        <Demo layout="block"><AccentCard /></Demo>
        <Demo title={t('状态色', 'Status colors')} description={t('成功、警告、危险、信息四种。主色两套主题共用，文字色在深色下提亮，柔和底按主题混白或混卡片色。', 'Four of them: success, warning, danger and info. Base colors are shared by both themes, text colors are lightened in dark mode, and soft fills are mixed with white or the card color depending on the theme.')} layout="block">
          <StatusColors />
        </Demo>
        <div className="g-prose">
          {t(
            <p>切换主题和强调色的接口（<Code>setTheme</Code>、<Code>setAccent</Code>），以及只给页面某一块换强调色的 <Code>data-accent</Code>，见 <Link to="/guide/theming" className="g-link ok-focusable">主题</Link>。</p>,
            <p>For the APIs that switch theme and accent color (<Code>setTheme</Code>, <Code>setAccent</Code>), and <Code>data-accent</Code> for changing the accent color of just one part of the page, see <Link to="/guide/theming" className="g-link ok-focusable">Theming</Link>.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('半透明只用在四处', 'Translucency in four places only')} description={t('除了下面四样，所有颜色都是不透明的固有色。浮层（菜单、下拉、通知）用不透明的 --ok-pop，不加背景模糊。', 'Apart from these four, every color is solid. Overlays (menus, dropdowns, toasts) use the opaque --ok-pop with no backdrop blur.')}>
        <Demo layout="block"><Translucency /></Demo>
      </DocSection>

      <DocSection title={t('全部色彩令牌', 'All color tokens')} description={t('按用途列出每个颜色令牌和它在当前主题下的值。写自己的样式时引用令牌，不要抄色值。', 'Every color token, grouped by purpose, with its value in the current theme. In your own styles, reference the tokens instead of copying values.')}>
        <Grid columns={1} gap={5}>
          {ALL.map((g) => (
            <Demo key={g.key} title={t(g.title.zh, g.title.en)} description={t(g.note.zh, g.note.en)} layout="block">
              <Swatches tokens={g.tokens} />
            </Demo>
          ))}
        </Grid>
      </DocSection>
    </DocPage>
  );
}
