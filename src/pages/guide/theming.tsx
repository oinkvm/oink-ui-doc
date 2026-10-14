import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { ACCENTS, Badge, Box, Button, Code, CodeBlock, ColorSwatches, Icon, Inline, Input, Segmented, Spinner, Stack, Switch, TailProvider, Text, speed, useOink } from 'oink-ui';
import type { ReactNode } from 'react';
import type { Accent, ThemeMode, AccentPreset } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable, useClientValue } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import './guide.css';

export const meta: PageMeta = { path: '/guide/theming', title: '主题', group: '开始', order: 7, subtitle: 'Theming', en: { title: 'Theming' } };

const ACCENT_LABEL: { zh: Record<AccentPreset, string>; en: Record<AccentPreset, string> } = {
  zh: { pink: '粉', orange: '橙', amber: '黄', blue: '蓝', violet: '紫' },
  en: { pink: 'Pink', orange: 'Orange', amber: 'Amber', blue: 'Blue', violet: 'Violet' },
};
const ACCENT_COLOR: Record<AccentPreset, string> = { pink: '#FF6B8E', orange: '#FF7A2F', amber: '#FFBE3B', blue: '#2E7BFF', violet: '#C77DFF' };

const THEME_CODE = {
  zh: `import type { MouseEvent } from 'react';
import { Button, Icon, Inline, useOink } from 'oink-ui';
import type { ThemeMode } from 'oink-ui';

function ThemeButtons() {
  const { theme, setTheme } = useOink();
  // 把点击位置传给 setTheme，新主题就从这一点以圆形揭开
  const pick = (next: ThemeMode) => (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  return (
    <Inline gap={2} role="group" aria-label="主题">
      <Button aria-pressed={theme === 'light'} leading={<Icon name="sun" />} onClick={pick('light')}>浅色</Button>
      <Button aria-pressed={theme === 'dark'} leading={<Icon name="moon" />} onClick={pick('dark')}>深色</Button>
      <Button aria-pressed={theme === 'system'} leading={<Icon name="monitor" />} onClick={pick('system')}>跟随系统</Button>
    </Inline>
  );
}`,
  en: `import type { MouseEvent } from 'react';
import { Button, Icon, Inline, useOink } from 'oink-ui';
import type { ThemeMode } from 'oink-ui';

function ThemeButtons() {
  const { theme, setTheme } = useOink();
  // Pass the click position to setTheme and the new theme is revealed in a circle from that point
  const pick = (next: ThemeMode) => (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  return (
    <Inline gap={2} role="group" aria-label="Theme">
      <Button aria-pressed={theme === 'light'} leading={<Icon name="sun" />} onClick={pick('light')}>Light</Button>
      <Button aria-pressed={theme === 'dark'} leading={<Icon name="moon" />} onClick={pick('dark')}>Dark</Button>
      <Button aria-pressed={theme === 'system'} leading={<Icon name="monitor" />} onClick={pick('system')}>System</Button>
    </Inline>
  );
}`,
};

const ACCENT_CODE = {
  zh: `import { ACCENTS, ColorSwatches, useOink } from 'oink-ui';
import type { Accent, AccentPreset } from 'oink-ui';

const LABEL: Record<AccentPreset, string> = { pink: '粉', orange: '橙', amber: '黄', blue: '蓝', violet: '紫' };
const COLOR: Record<AccentPreset, string> = { pink: '#FF6B8E', orange: '#FF7A2F', amber: '#FFBE3B', blue: '#2E7BFF', violet: '#C77DFF' };

function AccentPicker() {
  const { accent, setAccent } = useOink();
  return (
    <ColorSwatches
      aria-label="强调色"
      value={accent}
      onChange={(v) => setAccent(v as Accent)}
      colors={ACCENTS.map((a) => ({ value: a, color: COLOR[a], label: LABEL[a] }))}
    />
  );
}`,
  en: `import { ACCENTS, ColorSwatches, useOink } from 'oink-ui';
import type { Accent, AccentPreset } from 'oink-ui';

const LABEL: Record<AccentPreset, string> = { pink: 'Pink', orange: 'Orange', amber: 'Amber', blue: 'Blue', violet: 'Violet' };
const COLOR: Record<AccentPreset, string> = { pink: '#FF6B8E', orange: '#FF7A2F', amber: '#FFBE3B', blue: '#2E7BFF', violet: '#C77DFF' };

function AccentPicker() {
  const { accent, setAccent } = useOink();
  return (
    <ColorSwatches
      aria-label="Accent color"
      value={accent}
      onChange={(v) => setAccent(v as Accent)}
      colors={ACCENTS.map((a) => ({ value: a, color: COLOR[a], label: LABEL[a] }))}
    />
  );
}`,
};

const LOCAL_ACCENT_CODE = {
  zh: `import { Badge, Button, Inline } from 'oink-ui';

{/* data-accent 可以写在任何元素上：这一块里的强调色单独换掉 */}
<Inline gap={3} data-accent="blue">
  <Button variant="accent">蓝色区域里的强调按钮</Button>
  <Badge tone="accent">局部强调色</Badge>
</Inline>`,
  en: `import { Badge, Button, Inline } from 'oink-ui';

{/* data-accent works on any element: only this block gets a different accent color */}
<Inline gap={3} data-accent="blue">
  <Button variant="accent">Accent button in a blue region</Button>
  <Badge tone="accent">Local accent</Badge>
</Inline>`,
};

const MOTION_CODE = {
  zh: `import { Segmented, useOink } from 'oink-ui';

function MotionPicker() {
  const { motion, setMotion } = useOink();
  return (
    <Segmented
      aria-label="动效偏好"
      value={motion}
      onChange={setMotion}
      options={[
        { value: 'auto', label: '跟随系统' },
        { value: 'full', label: '完整' },
        { value: 'reduced', label: '减弱' },
      ]}
    />
  );
}`,
  en: `import { Segmented, useOink } from 'oink-ui';

function MotionPicker() {
  const { motion, setMotion } = useOink();
  return (
    <Segmented
      aria-label="Motion preference"
      value={motion}
      onChange={setMotion}
      options={[
        { value: 'auto', label: 'System' },
        { value: 'full', label: 'Full' },
        { value: 'reduced', label: 'Reduced' },
      ]}
    />
  );
}`,
};

const RADIUS_CODE = {
  zh: `/* 默认：支持 corner-shape 的浏览器自动用超椭圆，并把半径放大 1.45 倍来保持视觉大小 */
@supports (corner-shape: squircle) {
  :root { --ok-corner: superellipse(1.75); --ok-rk: 1.45; }
}

/* 想在所有浏览器里都用普通圆角：覆盖回去 */
:root { --ok-corner: round; --ok-rk: 1; }`,
  en: `/* Default: browsers that support corner-shape use a superellipse, with radii scaled up 1.45× to keep the same visual size */
@supports (corner-shape: squircle) {
  :root { --ok-corner: superellipse(1.75); --ok-rk: 1.45; }
}

/* To use plain rounded corners in every browser, override it back */
:root { --ok-corner: round; --ok-rk: 1; }`,
};

const TOUCH_CODE = {
  zh: `import { Button, Inline, Input } from 'oink-ui';

{/* 触屏设备（pointer: coarse）自动抬高；data-touch 用来在桌面上强制同样的效果 */}
<Inline gap={3} data-touch="">
  <Button size="sm">小 36</Button>
  <Button>中 44</Button>
  <Button size="lg">大 52</Button>
  <Input placeholder="输入框" aria-label="示例输入" block={false} />
</Inline>`,
  en: `import { Button, Inline, Input } from 'oink-ui';

{/* Touch screens (pointer: coarse) get taller controls automatically; data-touch forces the same on desktop */}
<Inline gap={3} data-touch="">
  <Button size="sm">Small 36</Button>
  <Button>Medium 44</Button>
  <Button size="lg">Large 52</Button>
  <Input placeholder="Input" aria-label="Example input" block={false} />
</Inline>`,
};

function ThemeButtons() {
  const t = useT();
  const { theme, resolvedTheme, setTheme } = useOink();
  const pick = (next: ThemeMode) => (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };
  return (
    <Stack gap={3} align="center">
      <Inline gap={2} role="group" aria-label={t('主题', 'Theme')} justify="center">
        <Button aria-pressed={theme === 'light'} leading={<Icon name="sun" />} onClick={pick('light')}>{t('浅色', 'Light')}</Button>
        <Button aria-pressed={theme === 'dark'} leading={<Icon name="moon" />} onClick={pick('dark')}>{t('深色', 'Dark')}</Button>
        <Button aria-pressed={theme === 'system'} leading={<Icon name="monitor" />} onClick={pick('system')}>{t('跟随系统', 'System')}</Button>
      </Inline>
      <Text variant="caption" tone="neutral" aria-live="polite">theme = {theme}{t('，', ', ')}resolvedTheme = {resolvedTheme}</Text>
    </Stack>
  );
}

function AccentPicker() {
  const t = useT();
  const { accent, setAccent } = useOink();
  const labels = t(ACCENT_LABEL.zh, ACCENT_LABEL.en);
  return (
    <Stack gap={4} align="center">
      <ColorSwatches
        aria-label={t('强调色', 'Accent color')}
        value={accent}
        onChange={(v) => setAccent(v as Accent)}
        colors={ACCENTS.map((a) => ({ value: a, color: ACCENT_COLOR[a], label: labels[a] }))}
      />
      <Inline gap={3} justify="center">
        <Button variant="accent">{t('强调按钮', 'Accent button')}</Button>
        <Badge tone="accent">accent = {accent}</Badge>
        <Switch defaultChecked aria-label={t('示例开关', 'Example switch')} />
      </Inline>
    </Stack>
  );
}

function MotionPicker() {
  const t = useT();
  const { motion, setMotion } = useOink();
  const [ms, setMs] = useState(1);
  // --ok-ms 是在 <html> 上算出来的，Provider 的副作用跑完之后再读
  useEffect(() => { const id = requestAnimationFrame(() => setMs(speed())); return () => cancelAnimationFrame(id); }, [motion]);
  return (
    <Stack gap={4} align="center">
      <Segmented
        aria-label={t('动效偏好', 'Motion preference')}
        value={motion}
        onChange={setMotion}
        options={[
          { value: 'auto', label: t('跟随系统', 'System') },
          { value: 'full', label: t('完整', 'Full') },
          { value: 'reduced', label: t('减弱', 'Reduced') },
        ]}
      />
      <Inline gap={3} justify="center">
        <Badge tone={ms === 0 ? 'warning' : 'success'}>--ok-ms = {ms}</Badge>
        <Switch defaultChecked aria-label={t('拨一下看动效', 'Flip to see the motion')}>{t('拨一下看动效', 'Flip to see the motion')}</Switch>
      </Inline>
    </Stack>
  );
}

type CornerMode = 'auto' | 'round' | 'squircle';

function CornerDemo() {
  const t = useT();
  const [mode, setMode] = useState<CornerMode>('auto');
  const supported = useClientValue(() => typeof CSS !== 'undefined' && !!CSS.supports?.('corner-shape', 'squircle'), false);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'auto') return;
    root.style.setProperty('--ok-corner', mode === 'round' ? 'round' : 'superellipse(1.75)');
    root.style.setProperty('--ok-rk', mode === 'round' ? '1' : '1.45');
    return () => { root.style.removeProperty('--ok-corner'); root.style.removeProperty('--ok-rk'); };
  }, [mode]);
  return (
    <Stack gap={4} align="center">
      <Segmented<CornerMode>
        aria-label={t('圆角曲线', 'Corner curve')}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'auto', label: t('默认', 'Default') },
          { value: 'round', label: t('普通圆角 ×1', 'Round ×1') },
          { value: 'squircle', label: t('超椭圆 ×1.45', 'Superellipse ×1.45') },
        ]}
      />
      <Inline gap={3} justify="center">
        {([2, 4, 5] as const).map((r) => (
          <Box key={r} surface="card" border="strong" radius={r} padding={5}>r-{r}</Box>
        ))}
      </Inline>
      <Text variant="caption" tone="neutral">
        {supported
          ? t('这个浏览器支持 corner-shape：默认就是超椭圆。', 'This browser supports corner-shape, so the default is a superellipse. ')
          : t('这个浏览器不支持 corner-shape：曲线回退为普通圆角，这里只能看到半径倍率的变化。', 'This browser doesn’t support corner-shape: the curve falls back to plain rounded corners, so you’ll only see the radius multiplier change. ')}
        {t('切换会临时改写整页的 --ok-corner / --ok-rk，离开本页后恢复。', 'Switching temporarily overrides --ok-corner / --ok-rk for the whole page; they’re restored when you leave.')}
      </Text>
    </Stack>
  );
}

function TouchDemo() {
  const t = useT();
  const [touch, setTouch] = useState(false);
  return (
    <Stack gap={4} align="center">
      <Switch checked={touch} onChange={setTouch}>{t('加上 data-touch', 'Add data-touch')}</Switch>
      <Inline gap={3} justify="center" data-touch={touch ? '' : undefined}>
        <Button size="sm">{t('小', 'Small')} {touch ? 36 : 32}</Button>
        <Button>{t('中', 'Medium')} {touch ? 44 : 40}</Button>
        <Button size="lg">{t('大', 'Large')} {touch ? 52 : 48}</Button>
        <Input placeholder={t('输入框', 'Input')} aria-label={t('示例输入', 'Example input')} block={false} />
      </Inline>
    </Stack>
  );
}

type TailKind = 'tail' | 'star' | 'heart' | 'ring';

/** 替换图案：48×48 viewBox，路径带 pathLength="1" 就会跟着描线 */
const TAILS: Record<Exclude<TailKind, 'tail'>, ReactNode> = {
  star: <svg viewBox="0 0 48 48"><path pathLength={1} d="M24 5.500l5.600 11.800 12.900 1.700-9.500 8.900 2.400 12.800L24 34.500l-11.400 6.200 2.400-12.800-9.500-8.900 12.900-1.700Z" /></svg>,
  heart: <svg viewBox="0 0 48 48"><path pathLength={1} d="M24 41S6 30.500 6 17.500C6 12 10 8 15 8c4 0 7 2.500 9 6 2-3.500 5-6 9-6 5 0 9 4 9 9.500C42 30.500 24 41 24 41Z" /></svg>,
  ring: <svg viewBox="0 0 48 48"><circle pathLength={1} cx="24" cy="24" r="16" /></svg>,
};

const TAIL_CODE = {
  zh: `import { Button, Spinner, TailProvider } from 'oink-ui';

const star = (
  <svg viewBox="0 0 48 48">
    {/* pathLength="1"：描线动效自动生效；没有它时只做整体摆动 */}
    <path pathLength={1} d="M24 5.5l5.6 11.8 12.9 1.7-9.5 8.9 2.4 12.8L24 34.5l-11.4 6.2 2.4-12.8-9.5-8.9 12.9-1.7Z" />
  </svg>
);

{/* 包住整个应用就是全局替换；包住一块就只换这一块 */}
<TailProvider tail={star}>
  <Spinner />
  <Button variant="primary" loading>保存中</Button>
</TailProvider>

{/* 也可以传函数，自己决定怎么用 className */}
<TailProvider tail={({ className }) => <MyGlyph className={className} />}>…</TailProvider>`,
  en: `import { Button, Spinner, TailProvider } from 'oink-ui';

const star = (
  <svg viewBox="0 0 48 48">
    {/* pathLength="1" turns on the stroke-drawing animation; without it the shape only sways */}
    <path pathLength={1} d="M24 5.5l5.6 11.8 12.9 1.7-9.5 8.9 2.4 12.8L24 34.5l-11.4 6.2 2.4-12.8-9.5-8.9 12.9-1.7Z" />
  </svg>
);

{/* Wrap the whole app to replace it globally; wrap a block to replace it only there */}
<TailProvider tail={star}>
  <Spinner />
  <Button variant="primary" loading>Saving</Button>
</TailProvider>

{/* You can also pass a function and decide how to use className yourself */}
<TailProvider tail={({ className }) => <MyGlyph className={className} />}>…</TailProvider>`,
};

function TailDemo() {
  const t = useT();
  const [kind, setKind] = useState<TailKind>('star');
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={5} align="center">
      <Segmented<TailKind>
        aria-label={t('尾巴图案', 'Tail glyph')}
        value={kind}
        onChange={setKind}
        options={[
          { value: 'tail', label: t('默认尾巴', 'Default tail') },
          { value: 'star', label: t('星星', 'Star') },
          { value: 'heart', label: t('心形', 'Heart') },
          { value: 'ring', label: t('圆环', 'Ring') },
        ]}
      />
      <TailProvider tail={kind === 'tail' ? undefined : TAILS[kind]}>
        <Inline gap={5} justify="center" align="center">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
          <Button variant="primary" loading={loading}>{t('保存', 'Save')}</Button>
          <Button variant="accent" loading={loading}>{t('提交订单', 'Place order')}</Button>
        </Inline>
      </TailProvider>
      <Inline gap={4} justify="center" align="center">
        <Switch checked={loading} onChange={setLoading}>{t('按钮加载中', 'Buttons loading')}</Switch>
        <Text variant="caption" tone="neutral">{t('只有上面这一块被 TailProvider 包住，页面别处的加载器不受影响。', 'Only the block above is wrapped in TailProvider; loaders elsewhere on the page are unaffected.')}</Text>
      </Inline>
    </Stack>
  );
}

export default function Theming() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '主题不是一份配置对象，而是 <html> 上的三个属性：data-theme、data-accent、data-motion。所有组件的样式都从它们派生；OinkProvider 负责读写，useOink() 负责在组件里拿到当前值和切换方法。',
        'A theme isn’t a config object; it’s three attributes on <html>: data-theme, data-accent and data-motion. Every component’s styles derive from them. OinkProvider reads and writes them, and useOink() gives components the current values and the setters.',
      )}
    >
      <DocSection title={t('深色与浅色', 'Dark and light')} description={t('setTheme 的第二个参数是视口坐标。传了它，新主题会从这一点以圆形揭开（用的是 View Transitions；浏览器不支持、或者开了减弱动效时直接切换）。', 'The second argument of setTheme is a viewport coordinate. Pass it and the new theme is revealed in a circle from that point (using View Transitions; without browser support, or under reduced motion, it switches instantly).')}>
        <Demo code={t(THEME_CODE.zh, THEME_CODE.en)}>
          <ThemeButtons />
        </Demo>
        <div className="g-prose">
          {t(
            <p><Code>theme</Code> 是用户选的（可以是 <Code>'system'</Code>），<Code>resolvedTheme</Code> 是实际生效的 <Code>'light'</Code> 或 <Code>'dark'</Code>。判断“现在是不是深色”用后者。</p>,
            <p><Code>theme</Code> is what the user picked (it can be <Code>'system'</Code>); <Code>resolvedTheme</Code> is the one actually in effect, <Code>'light'</Code> or <Code>'dark'</Code>. Use the latter to check whether the page is currently dark.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('强调色', 'Accent color')} description={t('五种预设：pink、orange、amber、blue、violet，也可以是任意颜色。柔和底、填充、悬停色、文字色都由 color-mix() 从这一个颜色派生，深浅两套主题各有一组配比。', 'Five presets (pink, orange, amber, blue, violet) or any color you like. The soft fill, fill, hover and text colors are all derived from that one color with color-mix(), with separate ratios for the light and dark themes.')}>
        <Demo code={t(ACCENT_CODE.zh, ACCENT_CODE.en)}>
          <AccentPicker />
        </Demo>
        <div className="g-prose">
          {t(
            <p><strong>自定义颜色。</strong><Code>{"setAccent('#3fa7c4')"}</Code> 或 <Code>{'defaultAccent="#3fa7c4"'}</Code>：<Code>&lt;html&gt;</Code> 上是 <Code>data-accent="custom"</Code>，颜色和几个派生变量写在它的行内样式上。强调色上的文字按颜色的感知亮度自动选墨色或白色；当文字用的深一档（浅色主题，对白底至少 4.5:1）和亮一档（深色主题）也自动算出来。工具函数 <Code>accentVars(hex)</Code>、<Code>onAccentColor(hex)</Code> 可以单独用。挑颜色可以用 <Link to="/components/color-picker" className="g-link ok-focusable">ColorPicker</Link>。</p>,
            <p><strong>Custom colors.</strong> With <Code>{"setAccent('#3fa7c4')"}</Code> or <Code>{'defaultAccent="#3fa7c4"'}</Code>, <Code>&lt;html&gt;</Code> gets <Code>data-accent="custom"</Code> and the color plus a few derived variables go into its inline style. Text on the accent color is automatically ink or white based on the color’s perceived lightness; the darker shade used for text (light theme, at least 4.5:1 against white) and the brighter one (dark theme) are computed too. The helpers <Code>accentVars(hex)</Code> and <Code>onAccentColor(hex)</Code> can be used on their own. To pick a color, try <Link to="/components/color-picker" className="g-link ok-focusable">ColorPicker</Link>.</p>,
          )}
        </div>
        <Demo title={t('局部换色', 'Local accent color')} description={t('派生色是在声明 data-accent 的那个元素上求值的，所以可以只给页面的一块换强调色。', 'Derived colors are computed on the element that declares data-accent, so you can change the accent color for just one part of the page.')} code={t(LOCAL_ACCENT_CODE.zh, LOCAL_ACCENT_CODE.en)}>
          <Inline gap={3} data-accent="blue">
            <Button variant="accent">{t('蓝色区域里的强调按钮', 'Accent button in a blue region')}</Button>
            <Badge tone="accent">{t('局部强调色', 'Local accent')}</Badge>
          </Inline>
        </Demo>
      </DocSection>

      <DocSection title={t('动效偏好与 --ok-ms', 'Motion preference and --ok-ms')} description={t('所有时长令牌都乘了全局倍率 --ok-ms。系统开了“减弱动态效果”，或者 data-motion 为 reduced 时，它变成 0：位移归零，只保留状态切换。', 'Every duration token is multiplied by the global multiplier --ok-ms. When the system’s “Reduce motion” setting is on, or data-motion is reduced, it becomes 0: movement drops to zero and only state changes remain.')}>
        <Demo code={t(MOTION_CODE.zh, MOTION_CODE.en)}>
          <MotionPicker />
        </Demo>
        <div className="g-prose">
          {t(
            <>
              <ul>
                <li><Code>auto</Code>：跟随系统设置（默认）。</li>
                <li><Code>full</Code>：即使系统要求减弱，也保留完整动效。只在用户自己明确选择时用。</li>
                <li><Code>reduced</Code>：强制减弱。</li>
              </ul>
              <p>自己写的过渡用 <Code>var(--ok-dur-*)</Code>，脚本动画用 <Code>animate()</Code>，就会自动跟着这个倍率走，不需要单独判断。减弱之后各种动效实际是什么样子，见 <Link to="/guide/motion" className="g-link ok-focusable">动效 · 减弱动效</Link>。也可以把 <Code>--ok-ms</Code> 设成别的数来整体放慢或加快，比如调试时设成 <Code>4</Code>。</p>
            </>,
            <>
              <ul>
                <li><Code>auto</Code>: follow the system setting (default).</li>
                <li><Code>full</Code>: keep full motion even when the system asks for less. Only use it when the user has explicitly chosen it.</li>
                <li><Code>reduced</Code>: always reduce.</li>
              </ul>
              <p>Use <Code>var(--ok-dur-*)</Code> for your own transitions and <Code>animate()</Code> for scripted animations, and they follow this multiplier automatically with no extra checks. To see what each kind of motion looks like when reduced, see <Link to="/guide/motion" className="g-link ok-focusable">Motion · Reduced motion</Link>. You can also set <Code>--ok-ms</Code> to another number to slow everything down or speed it up, for example <Code>4</Code> while debugging.</p>
            </>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('圆角系数', 'Corner radius multiplier')} description={t('容器的圆角用连续曲率的超椭圆曲线。同样的半径下超椭圆显得更方，所以配了一个半径倍率 --ok-rk 把视觉大小拉回来。', 'Container corners use a superellipse curve with continuous curvature. At the same radius a superellipse looks squarer, so a radius multiplier, --ok-rk, brings the visual size back.')}>
        <Demo>
          <CornerDemo />
        </Demo>
        <CodeBlock code={t(RADIUS_CODE.zh, RADIUS_CODE.en)} language="css" />
        <div className="g-prose">
          {t(
            <p><Code>--ok-r-1</Code> 到 <Code>--ok-r-6</Code> 是在 <Code>:root</Code> 上用 <Code>calc(Npx * var(--ok-rk))</Code> 算好的，所以要改倍率得在 <Code>:root</Code> 上改，写在子元素上不起作用。全圆（<Code>--ok-r-full</Code>）不受影响，始终是正圆。圆角刻度和同心圆角的规矩见 <Link to="/guide/shape" className="g-link ok-focusable">形状 · 间距 · 层级</Link>。</p>,
            <p><Code>--ok-r-1</Code> to <Code>--ok-r-6</Code> are computed on <Code>:root</Code> as <Code>calc(Npx * var(--ok-rk))</Code>, so the multiplier has to be changed on <Code>:root</Code>; setting it on a descendant has no effect. Fully rounded shapes (<Code>--ok-r-full</Code>) are unaffected and always stay perfectly round. For the radius scale and concentric corners, see <Link to="/guide/shape" className="g-link ok-focusable">Shape · Spacing · Layers</Link>.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('触屏高度', 'Touch heights')} description={t('控件高度只有三档：32 / 40 / 48。触屏设备（pointer: coarse）上自动抬到 36 / 44 / 52，保证点按区域不小于 44px，输入框字号同时变成 16px；列表项（--ok-h-item）也抬到 44。各档令牌见“形状 · 间距 · 层级”。', 'Controls come in just three heights: 32 / 40 / 48. On touch screens (pointer: coarse) they rise to 36 / 44 / 52 so tap targets are at least 44px, and input text becomes 16px; list items (--ok-h-item) rise to 44 as well. The tokens for each step are listed under “Shape · Spacing · Layers”.')}>
        <Demo code={t(TOUCH_CODE.zh, TOUCH_CODE.en)}>
          <TouchDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="OinkProvider"
          rows={[
            { name: 'defaultTheme', type: `'light' | 'dark' | 'system'`, default: `'system'`, description: t('初始主题。', 'Initial theme.') },
            { name: 'defaultAccent', type: `AccentPreset | '#rrggbb'`, default: `'pink'`, description: t('初始强调色：五种预设之一，或任意颜色。', 'Initial accent color: one of the five presets, or any color.') },
            { name: 'defaultMotion', type: `'auto' | 'full' | 'reduced'`, default: `'auto'`, description: t('初始动效偏好。', 'Initial motion preference.') },
            { name: 'storageKey', type: 'string', description: t('传了就把三项选择记到 localStorage 的这个键下。', 'When set, the three choices are saved under this localStorage key.') },
            { name: 'locale', type: `'auto' | 'zh-CN' | 'en-US'`, default: `'auto'`, description: t('组件自带文案的语言：aria-label、关闭 / 确认之类的按钮、日历的月份名、占位文字等。auto 跟随浏览器语言：中文用 zh-CN，其它用 en-US。', 'Language of the components’ built-in strings: aria-labels, buttons such as Close / Confirm, calendar month names, placeholders and so on. auto follows the browser language: Chinese → zh-CN, anything else → en-US.') },
            { name: 'tail', type: 'ReactNode | ((props: { className: string }) => ReactNode)', description: t('全局替换加载器和按钮加载状态里的尾巴图案，等于在最外层包一个 TailProvider。见下面“替换尾巴图案”。', 'Replaces the tail glyph in loaders and button loading states globally; the same as wrapping everything in a TailProvider. See “Replacing the tail glyph” below.') },
          ]}
        />
        <div className="g-prose">
          {t(
            <p><Code>locale</Code> 只管库组件自带的文案，默认 <Code>'auto'</Code>：跟随浏览器语言，中文用 zh-CN，其它语言都用 en-US。服务端渲染时服务端不知道访客的语言，第一帧和注水用 en-US、之后才换成浏览器的语言；这类应用最好按网址或 <Code>Accept-Language</Code> 显式传入（这个文档站就是按网址传的）。你自己写的文案仍由应用的国际化方案负责。</p>,
            <p><Code>locale</Code> only covers the library components’ built-in strings and defaults to <Code>'auto'</Code>: it follows the browser language — Chinese → zh-CN, any other language → en-US. With server rendering the server can’t know the visitor’s language, so the first frame and hydration use en-US and switch to the browser’s language right after; such apps should pass it explicitly from the URL or <Code>Accept-Language</Code> (this docs site passes it from the URL). Your own copy is still handled by your app’s i18n setup.</p>,
          )}
        </div>
        <PropsTable
          title={t('useOink() 的返回值', 'useOink() return value')}
          rows={[
            { name: 'theme', type: 'ThemeMode', description: t('用户选的主题，可能是 system。', 'The theme the user picked; may be system.') },
            { name: 'resolvedTheme', type: `'light' | 'dark'`, description: t('实际生效的主题。', 'The theme actually in effect.') },
            { name: 'accent', type: 'Accent', description: t('当前强调色。', 'Current accent color.') },
            { name: 'motion', type: 'MotionMode', description: t('当前动效偏好。', 'Current motion preference.') },
            { name: 'setTheme', type: '(theme, origin?: { x, y }) => void', description: t('切换主题；传 origin（视口坐标）时从该点圆形揭开。', 'Switches the theme; with origin (viewport coordinates) it is revealed in a circle from that point.') },
            { name: 'setAccent', type: '(accent: Accent) => void', description: t('切换强调色。', 'Switches the accent color.') },
            { name: 'setMotion', type: '(motion: MotionMode) => void', description: t('切换动效偏好。', 'Switches the motion preference.') },
          ]}
        />
      </DocSection>

      <DocSection title={t('替换尾巴图案', 'Replacing the tail glyph')} description={t('品牌尾巴是加载与提示里用的图形：Spinner 的 tail 变体、Button 的加载状态都画它。它是默认值，但可以整体换掉：给 OinkProvider 传 tail，或者用 TailProvider 包住应用，就是全局替换；TailProvider 包住一块就只换那一块，可以嵌套，内层优先。', 'The brand tail is the glyph used in loading and feedback: the Spinner’s tail variant and Button’s loading state both draw it. It’s the default, but you can replace it wholesale: pass tail to OinkProvider, or wrap the app in TailProvider, for a global swap. Wrapping one block in TailProvider swaps it only there; providers can nest, and the inner one wins.')}>
        <Demo code={t(TAIL_CODE.zh, TAIL_CODE.en)}>
          <TailDemo />
        </Demo>
        <div className="g-prose">
          {t(
            <>
              <p>替换图案约定是一个 <Code>viewBox="0 0 48 48"</Code> 的 svg。它会拿到和默认尾巴一样的类名 <Code>ok-tail</Code>，于是：</p>
              <ul>
                <li>整体的摆动 / 旋转、尺寸、颜色（<Code>currentColor</Code>）自动跟上；</li>
                <li>带 <Code>pathLength="1"</Code> 的路径或图形会做描线动效；没有的只做摆动；</li>
                <li>没写 <Code>fill</Code> / <Code>stroke</Code> 属性的图形默认按尾巴的笔触描线（圆头，线宽 5.5）；自己写了的保留。</li>
              </ul>
              <p>组件里需要画尾巴时用 <Code>{'<TailGlyph className="ok-tail" />'}</Code>，它会读到最近的 TailProvider；<Code>useTail()</Code> 返回当前生效的替换图案（默认时为 undefined）。</p>
            </>,
            <>
              <p>A replacement glyph is an svg with <Code>viewBox="0 0 48 48"</Code>. It receives the same class as the default tail, <Code>ok-tail</Code>, so:</p>
              <ul>
                <li>the overall sway / rotation, size and color (<Code>currentColor</Code>) follow automatically;</li>
                <li>paths or shapes with <Code>pathLength="1"</Code> get the stroke-drawing animation; others only sway;</li>
                <li>shapes without their own <Code>fill</Code> / <Code>stroke</Code> attributes are stroked like the tail (round caps, 5.5 stroke width); ones that set them keep their own.</li>
              </ul>
              <p>When a component needs to draw the tail, use <Code>{'<TailGlyph className="ok-tail" />'}</Code>, which reads the nearest TailProvider; <Code>useTail()</Code> returns the replacement glyph currently in effect (undefined for the default).</p>
            </>,
          )}
        </div>
        <PropsTable
          title="TailProvider"
          rows={[
            { name: 'tail', type: 'ReactNode | ((props: { className: string }) => ReactNode)', description: t('替换的图案。传节点时把 className 合并到它的根元素上并对读屏隐藏；传函数时自己处理。不传时沿用外层设置。', 'The replacement glyph. A node gets className merged onto its root element and is hidden from screen readers; a function handles that itself. When omitted, the outer setting applies.') },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
