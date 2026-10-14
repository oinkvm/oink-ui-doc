import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Button, Card, Code, CodeBlock, Grid, Inline, Stack, Text, isCustomAccent, useOink } from 'oink-ui';
import type { AccentPreset, TextVariant } from 'oink-ui';
import { Demo, DocPage, DocSection } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import { useThemeVersion, useTokenPx } from '../../foundations/lib';
import '../../foundations/foundations.css';
import './guide.css';

export const meta: PageMeta = { path: '/guide/typography', title: '字体', group: '开始', order: 4, subtitle: 'Typography', en: { title: 'Typography' } };

const ACCENT_NAME: { zh: Record<AccentPreset, string>; en: Record<AccentPreset, string> } = {
  zh: { pink: '粉', orange: '橙', amber: '黄', blue: '蓝', violet: '紫' },
  en: { pink: 'pink', orange: 'orange', amber: 'amber', blue: 'blue', violet: 'violet' },
};

/* ------------------------------------------------------------------ 三套字体 */

const FAMILIES: Array<{ token: string; title: { zh: string; en: string }; sample: { zh: string; en: string }; weight: number }> = [
  { token: 'font-display', title: { zh: 'Display · 标题', en: 'Display · Headings' }, sample: { zh: 'Oink 哼', en: 'Oink!' }, weight: 700 },
  { token: 'font', title: { zh: 'UI · 正文与控件', en: 'UI · Body and controls' }, sample: { zh: 'Aa 界面', en: 'Aa Text' }, weight: 500 },
  { token: 'font-mono', title: { zh: 'Mono · 代码与数值', en: 'Mono · Code and numbers' }, sample: { zh: '⌘K 240', en: '⌘K 240' }, weight: 500 },
];

/** 字体栈直接从 :root 上的令牌读 */
function useFontStacks() {
  const v = useThemeVersion();
  const [stacks, setStacks] = useState<Record<string, string>>({});
  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    setStacks(Object.fromEntries(FAMILIES.map((f) => [f.token, cs.getPropertyValue(`--ok-${f.token}`).trim().replace(/\s+/g, ' ')])));
  }, [v]);
  return stacks;
}

function Families() {
  const t = useT();
  const stacks = useFontStacks();
  return (
    <Grid minItemWidth={220} gap={3}>
      {FAMILIES.map((f) => (
        <Card key={f.token} className="f-font">
          <span className="f-font__sample" style={{ fontFamily: `var(--ok-${f.token})`, fontWeight: f.weight }} aria-hidden="true">{t(f.sample.zh, f.sample.en)}</span>
          <Text as="h3" variant="label" className="f-font__title">{t(f.title.zh, f.title.en)}</Text>
          <code className="f-font__token">--ok-{f.token}</code>
          <Text as="p" variant="caption" tone="neutral" className="f-font__stack" title={stacks[f.token]}>{stacks[f.token] || '…'}</Text>
        </Card>
      ))}
    </Grid>
  );
}

/* ------------------------------------------------------------------ 字阶 */

interface Level { name: string; cls: string; variant?: TextVariant; weight: number; lh: string; fs?: string; px?: number; note?: string; sample: string }

function useLevels(): Level[] {
  const t = useT();
  const { accent } = useOink();
  const word = isCustomAccent(accent) ? t('彩', 'colored') : t(ACCENT_NAME.zh, ACCENT_NAME.en)[accent];
  const rounded = t('圆体', 'rounded');
  return [
    { name: 'Display', cls: 'ok-t-display', variant: 'display', weight: 700, lh: '1.06', fs: 'fs-display', note: rounded, sample: t(`墨色方块，${word}色鼻子`, `Ink square, ${word} snout`) },
    { name: 'H1', cls: 'ok-t-h1', variant: 'h1', weight: 700, lh: '1.15', fs: 'fs-h1', note: rounded, sample: t('安静而利落的界面', 'A quiet, crisp interface') },
    { name: 'H2', cls: 'ok-t-h2', variant: 'h2', weight: 700, lh: '1.25', fs: 'fs-h2', note: rounded, sample: t('动效用来解释因果', 'Motion explains cause and effect') },
    { name: 'H3', cls: 'ok-t-h3', variant: 'h3', weight: 600, lh: '1.35', fs: 'fs-h3', sample: t('窗口模式与主题色', 'Window mode and theme color') },
    { name: 'H4', cls: 'ok-t-h4', weight: 600, lh: '1.4', fs: 'fs-h4', sample: t('通知与提醒', 'Notifications and reminders') },
    { name: 'Body L', cls: 'ok-t-body-l', variant: 'body-l', weight: 450, lh: '1.6', px: 17, sample: t('一块利落的方块，压着一只会拱的鼻子。', 'A crisp square block with a snout that likes to nudge.') },
    { name: 'Body', cls: 'ok-t-body', variant: 'body', weight: 450, lh: '1.6', px: 15, sample: t('更改会同步到你的所有设备，随时可以撤销。', 'Changes sync to all your devices and can be undone at any time.') },
    { name: 'Label', cls: 'ok-t-label', variant: 'label', weight: 600, lh: '1.3', px: 15, sample: t('保存更改 Save changes', 'Save changes') },
    { name: 'Caption', cls: 'ok-t-caption', variant: 'caption', weight: 500, lh: '1.4', px: 13, sample: t('上次同步：今天 14:02', 'Last synced: today at 14:02') },
    { name: 'Micro', cls: 'ok-t-micro', variant: 'micro', weight: 700, lh: '1.3', px: 11, note: t('大写', 'uppercase'), sample: 'New · Beta · Pro' },
    { name: 'Mono', cls: 'ok-t-mono', variant: 'mono', weight: 500, lh: '1.5', px: 13, note: t('等宽', 'monospace'), sample: '⌘K  240ms  --ok-r-4' },
  ];
}

const FS_TOKENS = ['fs-display', 'fs-h1', 'fs-h2', 'fs-h3', 'fs-h4'];

function TypeScale() {
  const levels = useLevels();
  const px = useTokenPx(FS_TOKENS, 'width');
  return (
    <div className="f-type">
      {levels.map((l) => (
        <div key={l.name} className="f-type__row">
          {l.variant
            ? <Text variant={l.variant} className="f-type__sample">{l.sample}</Text>
            : <span className={`ok-text ${l.cls} f-type__sample`}>{l.sample}</span>}
          <span className="f-type__meta">
            <b>{l.name}</b>
            <code>{l.fs ? `${px[l.fs] ?? '…'}` : l.px}/{l.lh} · {l.weight}{l.note ? ` · ${l.note}` : ''}</code>
            <code>{l.fs ? `--ok-${l.fs}` : `.${l.cls}`}</code>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 字重 */

const WEIGHTS: Array<[number, { zh: string; en: string }]> = [
  [450, { zh: '正文', en: 'Body text' }],
  [500, { zh: '说明、菜单项、等宽', en: 'Captions, menu items, mono' }],
  [600, { zh: '小标题、标签、按钮', en: 'Subheadings, labels, buttons' }],
  [700, { zh: '大标题、Micro', en: 'Large headings, Micro' }],
];

/* ------------------------------------------------------------------ 等宽数字 */

function TabularDemo() {
  const t = useT();
  const [n, setN] = useState(1088);
  const [running, setRunning] = useState(false);
  const timer = useRef<number>();
  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    timer.current = window.setInterval(() => {
      setN((x) => x + 7 + Math.floor(Math.random() * 13));
      if (performance.now() - start > 4000) setRunning(false);
    }, 90);
    return () => clearInterval(timer.current);
  }, [running]);
  const text = `${(n / 100).toFixed(2)}% · ${n.toLocaleString('en-US')}${t(' 次', ' runs')}`;
  return (
    <Stack gap={4} align="center" className="g-fill">
      <div className="f-tabular">
        <span><Text variant="caption" tone="neutral">{t('默认（比例数字）', 'Default (proportional)')}</Text><b style={{ fontVariantNumeric: 'proportional-nums' } as CSSProperties}>{text}</b></span>
        <span><Text variant="caption" tone="neutral">tabular-nums</Text><b style={{ fontVariantNumeric: 'tabular-nums' }}>{text}</b></span>
      </div>
      <Button onClick={() => setRunning((r) => !r)} aria-pressed={running}>{running ? t('停下', 'Stop') : t('让数字跑起来', 'Start the numbers')}</Button>
    </Stack>
  );
}

const USAGE = {
  zh: `import { Heading, Text } from 'oink-ui';

<Heading level={2}>区块标题</Heading>            {/* 默认 h2 字阶；variant 可以和语义层级分开 */}
<Heading level={3} variant="h4">小标题</Heading>
<Text variant="caption" tone="neutral">上次同步：今天 14:02</Text>

/* 不用组件时：直接加类名，或者引用令牌 */
<p className="ok-t-body-l">导语</p>
.my-title { font: 700 var(--ok-fs-h2)/1.25 var(--ok-font-display); }`,
  en: `import { Heading, Text } from 'oink-ui';

<Heading level={2}>Section title</Heading>       {/* h2 size by default; variant can differ from the semantic level */}
<Heading level={3} variant="h4">Subheading</Heading>
<Text variant="caption" tone="neutral">Last synced: today at 14:02</Text>

/* Without components: add the class directly, or reference the tokens */
<p className="ok-t-body-l">Lead paragraph</p>
.my-title { font: 700 var(--ok-fs-h2)/1.25 var(--ok-font-display); }`,
};

export default function TypographyPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '不引入网络字体。标题走系统圆体，呼应标志的圆角轮廓；正文和控件走系统无衬线，保证中西文混排清晰；代码和数值走等宽。三组字体栈都是令牌。',
        'No web fonts. Headings use the system rounded face, echoing the rounded outline of the logo; body text and controls use the system sans-serif so mixed Chinese and Latin text stays clear; code and numbers use monospace. All three font stacks are tokens.',
      )}
    >
      <DocSection title={t('三套字体', 'Three font stacks')} description={t('下面的字体栈是从 :root 上的令牌读出来的。在你的系统上实际用到哪一款，取决于装了哪些字体：以苹果设备为例（没装 Inter 时）：标题是 SF Pro Rounded，正文是 SF Pro 配苹方，等宽是 SF Mono。', 'The stacks below are read from the tokens on :root. Which face your system actually uses depends on the fonts installed. On Apple devices (without Inter installed), for example, headings use SF Pro Rounded, body text uses SF Pro with PingFang, and monospace uses SF Mono.')}>
        <Families />
      </DocSection>

      <DocSection title={t('字阶', 'Type scale')} description={t('十一级。标题五档的字号是令牌 --ok-fs-display / -h1 / -h2 / -h3 / -h4：桌面 56 / 40 / 28 / 20 / 17，视口窄于 520px 时收到 38 / 30 / 24 / 18 / 16；正文以下各档字号固定。右侧标注的是当前视口下的实际字号，把窗口拉窄到 520 以下可以看到标题档变化。', 'Eleven steps. The five heading sizes are the tokens --ok-fs-display / -h1 / -h2 / -h3 / -h4: 56 / 40 / 28 / 20 / 17 on desktop, shrinking to 38 / 30 / 24 / 18 / 16 when the viewport is narrower than 520px; body sizes and below are fixed. The labels on the right show the actual size at the current viewport; narrow the window below 520 to watch the heading steps change.')}>
        <Demo layout="block"><TypeScale /></Demo>
      </DocSection>

      <DocSection title={t('字重', 'Font weight')} description={t('只用 450 / 500 / 600 / 700 四档。按钮、分段、选择器上的文字统一 600；菜单项 500，选中的那一项加粗到 600。', 'Only four weights: 450 / 500 / 600 / 700. Text on buttons, segmented controls and selects is always 600; menu items are 500, with the selected item bolded to 600.')}>
        <Demo layout="block">
          <div className="f-weights">
            {WEIGHTS.map(([w, use]) => (
              <span key={w}><b style={{ fontWeight: w }}>{t('字重', 'Weight')} {w} Aa</b><Text variant="caption" tone="neutral">{t(use.zh, use.en)}</Text></span>
            ))}
          </div>
        </Demo>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>悬停不改文字。</strong>悬停只换底色或线色，不改字号、字重，带文字的元素也不位移；否则周围的内容会被挤动。</li>
              <li><strong>选中加粗但不变宽。</strong>菜单打开前按“全部加粗”量一次宽度，切换选中项时菜单不会跟着变宽。自己做类似的列表时，也要先给加粗后的宽度留位置。</li>
            </ul>,
            <ul>
              <li><strong>Hover never changes text.</strong> Hover only changes the fill or line color, never the size or weight, and elements with text don’t move; otherwise the surrounding content would get pushed around.</li>
              <li><strong>Selected items get bolder but not wider.</strong> Before a menu opens it is measured as if every item were bold, so switching the selection never widens the menu. If you build a similar list, reserve room for the bold width up front.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('排版规矩', 'Typesetting rules')}>
        <Demo title={t('会变化的数字用等宽', 'Changing numbers use tabular figures')} description={t('计数、百分比、时间这类会跳动的数值开启 tabular-nums，数字宽度一致，旁边的内容不会跟着抖。库里的计数、进度、步进器、滑块、分页、表格等组件已经开了。', 'Values that tick, such as counts, percentages and times, turn on tabular-nums so every digit has the same width and nearby content doesn’t jitter. The library’s count, progress, stepper, slider, pagination, table and similar components already do this.')} layout="block">
          <TabularDemo />
        </Demo>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>中西混排。</strong>中文与西文、数字之间留一个半角空格；中文旁边的标点用全角。</li>
              <li><strong>行长。</strong>正文每行 28–38 个汉字为宜；说明文字不超过两行。</li>
              <li><strong>三级文字色只做装饰。</strong><Code>--ok-text-3</Code> 的对比度不足 4.5:1，正文和必须读到的信息用 <Code>--ok-text</Code> 或 <Code>--ok-text-2</Code>，见 <Link to="/guide/color" className="g-link ok-focusable">色彩</Link>。</li>
            </ul>,
            <ul>
              <li><strong>Mixing Chinese and Latin text.</strong> Put a half-width space between Chinese characters and Latin words or digits; punctuation next to Chinese text is full-width.</li>
              <li><strong>Line length.</strong> Body text reads best at 28–38 Chinese characters per line; descriptions stay within two lines.</li>
              <li><strong>The third text color is decorative only.</strong> <Code>--ok-text-3</Code> falls short of 4.5:1 contrast, so body text and anything that must be read uses <Code>--ok-text</Code> or <Code>--ok-text-2</Code>; see <Link to="/guide/color" className="g-link ok-focusable">Color</Link>.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('在代码里用', 'Using it in code')} description={t('用 Text 和 Heading 组件，或者直接加 .ok-t-* 类名；自己写样式时引用字号和字体令牌。', 'Use the Text and Heading components, or add the .ok-t-* classes directly; in your own styles, reference the size and font tokens.')}>
        <CodeBlock code={t(USAGE.zh, USAGE.en)} language="tsx" />
        <Inline gap={2}>
          <Text variant="caption" tone="neutral">
            {t(
              <>组件的属性见 <Link to="/components/text" className="g-link ok-focusable">Text / Heading 文字</Link>。</>,
              <>For component props, see <Link to="/components/text" className="g-link ok-focusable">Text / Heading</Link>.</>,
            )}
          </Text>
        </Inline>
      </DocSection>
    </DocPage>
  );
}
