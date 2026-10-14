import { useEffect, useRef, useState } from 'react';
import { Badge, Box, Button, Code, Inline, Stack, Text, useControllable, useEscape, useEvent, useMediaQuery, useOutsidePress } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/hooks', title: 'Hooks 一览', group: '基础', order: 4, subtitle: 'Hooks', en: { title: 'Hooks' } };

/* ------------------------------------------------------------------ useControllable */

const CONTROLLABLE_CODE = {
  zh: `import { useState } from 'react';
import { Badge, Button, Inline, Stack, useControllable } from 'oink-ui';

interface CounterProps { value?: number; defaultValue?: number; onChange?: (value: number) => void }

// 自己写取值类组件时，一行拿到“受控 / 非受控二合一”
function Counter({ value, defaultValue = 0, onChange }: CounterProps) {
  const [count, setCount] = useControllable(value, defaultValue, onChange);
  return (
    <Inline gap={2}>
      <Button size="sm" aria-label="减一" onClick={() => setCount(count - 1)}>−</Button>
      <Badge aria-live="polite">{count}</Badge>
      <Button size="sm" aria-label="加一" onClick={() => setCount((c) => c + 1)}>+</Button>
    </Inline>
  );
}

function Example() {
  const [value, setValue] = useState(10);
  return (
    <Stack gap={3}>
      <Inline gap={3}>非受控：<Counter defaultValue={3} /></Inline>
      <Inline gap={3}>受控（上限 12）：<Counter value={value} onChange={(v) => setValue(Math.min(12, v))} /></Inline>
    </Stack>
  );
}`,
  en: `import { useState } from 'react';
import { Badge, Button, Inline, Stack, useControllable } from 'oink-ui';

interface CounterProps { value?: number; defaultValue?: number; onChange?: (value: number) => void }

// When writing your own value component, one line gives you controlled + uncontrolled in one
function Counter({ value, defaultValue = 0, onChange }: CounterProps) {
  const [count, setCount] = useControllable(value, defaultValue, onChange);
  return (
    <Inline gap={2}>
      <Button size="sm" aria-label="Decrement" onClick={() => setCount(count - 1)}>−</Button>
      <Badge aria-live="polite">{count}</Badge>
      <Button size="sm" aria-label="Increment" onClick={() => setCount((c) => c + 1)}>+</Button>
    </Inline>
  );
}

function Example() {
  const [value, setValue] = useState(10);
  return (
    <Stack gap={3}>
      <Inline gap={3}>Uncontrolled: <Counter defaultValue={3} /></Inline>
      <Inline gap={3}>Controlled (max 12): <Counter value={value} onChange={(v) => setValue(Math.min(12, v))} /></Inline>
    </Stack>
  );
}`,
};

interface CounterProps { value?: number; defaultValue?: number; onChange?: (value: number) => void }

function Counter({ value, defaultValue = 0, onChange }: CounterProps) {
  const t = useT();
  const [count, setCount] = useControllable(value, defaultValue, onChange);
  return (
    <Inline gap={2}>
      <Button size="sm" aria-label={t('减一', 'Decrement')} onClick={() => setCount(count - 1)}>−</Button>
      <Badge aria-live="polite">{count}</Badge>
      <Button size="sm" aria-label={t('加一', 'Increment')} onClick={() => setCount((c) => c + 1)}>+</Button>
    </Inline>
  );
}

function ControllableExample() {
  const t = useT();
  const [value, setValue] = useState(10);
  return (
    <Stack gap={3}>
      <Inline gap={3}>{t('非受控：', 'Uncontrolled: ')}<Counter defaultValue={3} /></Inline>
      <Inline gap={3}>{t('受控（上限 12）：', 'Controlled (max 12): ')}<Counter value={value} onChange={(v) => setValue(Math.min(12, v))} /></Inline>
    </Stack>
  );
}

/* ------------------------------------------------------------------ useMediaQuery */

const MEDIA_CODE = {
  zh: `import { Badge, Inline, useMediaQuery } from 'oink-ui';

function Env() {
  const hover = useMediaQuery('(hover: hover)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const dark = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <Inline gap={2}>
      <Badge tone={hover ? 'success' : 'neutral'}>能悬停：{hover ? '是' : '否'}</Badge>
      <Badge tone={coarse ? 'success' : 'neutral'}>触屏：{coarse ? '是' : '否'}</Badge>
      <Badge tone={reduced ? 'success' : 'neutral'}>系统要求减弱动效：{reduced ? '是' : '否'}</Badge>
      <Badge tone={dark ? 'success' : 'neutral'}>系统深色：{dark ? '是' : '否'}</Badge>
    </Inline>
  );
}`,
  en: `import { Badge, Inline, useMediaQuery } from 'oink-ui';

function Env() {
  const hover = useMediaQuery('(hover: hover)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const dark = useMediaQuery('(prefers-color-scheme: dark)');
  return (
    <Inline gap={2}>
      <Badge tone={hover ? 'success' : 'neutral'}>Hover: {hover ? 'yes' : 'no'}</Badge>
      <Badge tone={coarse ? 'success' : 'neutral'}>Touch screen: {coarse ? 'yes' : 'no'}</Badge>
      <Badge tone={reduced ? 'success' : 'neutral'}>Reduced motion requested: {reduced ? 'yes' : 'no'}</Badge>
      <Badge tone={dark ? 'success' : 'neutral'}>System dark mode: {dark ? 'yes' : 'no'}</Badge>
    </Inline>
  );
}`,
};

function Env() {
  const t = useT();
  const hover = useMediaQuery('(hover: hover)');
  const coarse = useMediaQuery('(pointer: coarse)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const dark = useMediaQuery('(prefers-color-scheme: dark)');
  const yn = (v: boolean) => (v ? t('是', 'yes') : t('否', 'no'));
  return (
    <Inline gap={2}>
      <Badge tone={hover ? 'success' : 'neutral'}>{t('能悬停：', 'Hover: ')}{yn(hover)}</Badge>
      <Badge tone={coarse ? 'success' : 'neutral'}>{t('触屏：', 'Touch screen: ')}{yn(coarse)}</Badge>
      <Badge tone={reduced ? 'success' : 'neutral'}>{t('系统要求减弱动效：', 'Reduced motion requested: ')}{yn(reduced)}</Badge>
      <Badge tone={dark ? 'success' : 'neutral'}>{t('系统深色：', 'System dark mode: ')}{yn(dark)}</Badge>
    </Inline>
  );
}

/* ------------------------------------------------------------------ useEscape + useOutsidePress */

const DISMISS_CODE = {
  zh: `import { useRef, useState } from 'react';
import { Box, Button, Stack, Text, useEscape, useOutsidePress } from 'oink-ui';

function Dismissable() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLElement>(null);
  const close = () => { setOpen(false); trigger.current?.focus(); };

  useEscape(open, close);                                        // 只有最上层的浮层响应 Esc
  useOutsidePress(open, [box, trigger], () => setOpen(false));   // 点在这两个元素之外才触发

  return (
    <Stack gap={3} align="center" style={{ minHeight: 132 }}>
      <Button ref={trigger} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '收起' : '展开一块内容'}</Button>
      {open && (
        <Box ref={box} surface="raised" border="strong" radius={3} padding={4}>
          <Text>按 Esc，或者点这块之外的任何地方关闭。</Text>
        </Box>
      )}
    </Stack>
  );
}`,
  en: `import { useRef, useState } from 'react';
import { Box, Button, Stack, Text, useEscape, useOutsidePress } from 'oink-ui';

function Dismissable() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLElement>(null);
  const close = () => { setOpen(false); trigger.current?.focus(); };

  useEscape(open, close);                                        // only the topmost layer responds to Esc
  useOutsidePress(open, [box, trigger], () => setOpen(false));   // fires only for presses outside both elements

  return (
    <Stack gap={3} align="center" style={{ minHeight: 132 }}>
      <Button ref={trigger} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Collapse' : 'Reveal a panel'}</Button>
      {open && (
        <Box ref={box} surface="raised" border="strong" radius={3} padding={4}>
          <Text>Press Esc, or click anywhere outside this panel to close it.</Text>
        </Box>
      )}
    </Stack>
  );
}`,
};

function Dismissable() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLElement>(null);
  const close = () => { setOpen(false); trigger.current?.focus(); };

  useEscape(open, close);
  useOutsidePress(open, [box, trigger], () => setOpen(false));

  return (
    <Stack gap={3} align="center" style={{ minHeight: 132 }}>
      <Button ref={trigger} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t('收起', 'Collapse') : t('展开一块内容', 'Reveal a panel')}</Button>
      {open && (
        <Box ref={box} surface="raised" border="strong" radius={3} padding={4}>
          <Text>{t('按 Esc，或者点这块之外的任何地方关闭。', 'Press Esc, or click anywhere outside this panel to close it.')}</Text>
        </Box>
      )}
    </Stack>
  );
}

/* ------------------------------------------------------------------ useEvent */

const EVENT_CODE = {
  zh: `import { useEffect, useState } from 'react';
import { Badge, Button, Inline, useEvent } from 'oink-ui';

function Ticker() {
  const [step, setStep] = useState(1);
  const [total, setTotal] = useState(0);
  // tick 的引用恒定，但里面读到的 step 永远是最新的：定时器不用因为 step 变化而重建
  const tick = useEvent(() => setTotal((t) => t + step));
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
  return (
    <Inline gap={3}>
      <Badge>合计 {total}</Badge>
      <Button size="sm" onClick={() => setStep(step === 1 ? 10 : 1)}>每秒 +{step}，点击切换</Button>
    </Inline>
  );
}`,
  en: `import { useEffect, useState } from 'react';
import { Badge, Button, Inline, useEvent } from 'oink-ui';

function Ticker() {
  const [step, setStep] = useState(1);
  const [total, setTotal] = useState(0);
  // tick keeps the same identity but always reads the latest step, so the interval never has to be recreated
  const tick = useEvent(() => setTotal((t) => t + step));
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
  return (
    <Inline gap={3}>
      <Badge>Total {total}</Badge>
      <Button size="sm" onClick={() => setStep(step === 1 ? 10 : 1)}>+{step} per second, click to switch</Button>
    </Inline>
  );
}`,
};

function Ticker() {
  const t = useT();
  const [step, setStep] = useState(1);
  const [total, setTotal] = useState(0);
  const tick = useEvent(() => setTotal((n) => n + step));
  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);
  return (
    <Inline gap={3}>
      <Badge>{t('合计', 'Total')} {total}</Badge>
      <Button size="sm" onClick={() => setStep(step === 1 ? 10 : 1)}>{t(`每秒 +${step}，点击切换`, `+${step} per second, click to switch`)}</Button>
    </Inline>
  );
}

export default function HooksPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '库内部用到的通用 hooks 都从包的根导出，自己写组件时可以直接用。它们都能在服务端渲染（不在模块顶层访问 window / document）。',
        'The general-purpose hooks the library uses internally are all exported from the package root, ready for your own components. They are all safe to server-render (none touch window / document at module top level).',
      )}
    >
      <DocSection
        title={t('useControllable', 'useControllable')}
        description={t(
          '受控 / 非受控二合一：传了 value 就受控，否则用 defaultValue 自己管。setter 支持函数写法，值没变时不会触发 onChange。库里所有取值类组件都基于它。',
          'Controlled and uncontrolled in one: pass value and it is controlled, otherwise it manages itself from defaultValue. The setter accepts an updater function and skips onChange when the value does not change. Every value component in the library is built on it.',
        )}
      >
        <Demo code={t(CONTROLLABLE_CODE.zh, CONTROLLABLE_CODE.en)}>
          <ControllableExample />
        </Demo>
        <PropsTable
          title="useControllable(value, defaultValue, onChange?)"
          rows={[
            { name: 'value', type: 'T | undefined', required: true, description: t('受控值。undefined 表示非受控。', 'Controlled value. undefined means uncontrolled.') },
            { name: 'defaultValue', type: 'T', required: true, description: t('非受控时的初始值。', 'Initial value when uncontrolled.') },
            { name: 'onChange', type: '(value: T) => void', description: t('值变化时触发，第一个参数是新值。', 'Called when the value changes, with the new value as the first argument.') },
            { name: t('返回', 'Returns'), type: '[T, (next: T | ((prev: T) => T)) => void]', description: t('当前值和 setter。', 'The current value and a setter.') },
          ]}
        />
      </DocSection>

      <DocSection
        title={t('useMediaQuery / useBreakpoint', 'useMediaQuery / useBreakpoint')}
        description={t(
          '订阅一条媒体查询。useBreakpoint(bp) 是它针对四个断点的简写，见“响应式”页。',
          'Subscribes to a media query. useBreakpoint(bp) is its shorthand for the four breakpoints; see the Responsive page.',
        )}
      >
        <Demo code={t(MEDIA_CODE.zh, MEDIA_CODE.en)}>
          <Env />
        </Demo>
        <PropsTable
          title="useMediaQuery(query, fallback?)"
          rows={[
            { name: 'query', type: 'string', required: true, description: t('媒体查询字符串。', 'The media query string.') },
            { name: 'fallback', type: 'boolean', default: 'false', description: t('服务端渲染时返回的值。', 'Value returned during server rendering.') },
          ]}
        />
      </DocSection>

      <DocSection
        title={t('useEscape / useOutsidePress', 'useEscape / useOutsidePress')}
        description={t(
          '自己做可关闭的浮层时用。useEscape 内部维护一个栈：叠了几层时只有最上面那层响应。',
          'For building your own dismissable layers. useEscape keeps an internal stack: when layers are stacked, only the topmost one responds.',
        )}
      >
        <Demo code={t(DISMISS_CODE.zh, DISMISS_CODE.en)}>
          <Dismissable />
        </Demo>
        <PropsTable
          title={t('签名', 'Signatures')}
          rows={[
            { name: 'useEscape', type: '(active: boolean, onEscape: () => void) => void', description: t('active 为 true 期间监听 Esc。事件已经被 preventDefault 的不处理。', 'Listens for Esc while active is true. Events that were already preventDefault-ed are ignored.') },
            { name: 'useOutsidePress', type: '(active, refs: RefObject[], onOutside: (e: PointerEvent) => void) => void', description: t('pointerdown 落在所有 refs 之外时触发（捕获阶段）。', 'Fires when a pointerdown lands outside all refs (capture phase).') },
            { name: 'useScrollLock', type: '(active: boolean) => void', description: t('锁住页面滚动，并补上滚动条的宽度避免跳动。支持嵌套。', 'Locks page scrolling and pads for the scrollbar width so nothing jumps. Nestable.') },
          ]}
        />
        <Text as="p" tone="neutral" style={{ margin: 0 }}>
          {t(
            <>大多数情况下不需要直接用这三个：<Link to="/guide/floating-card" className="g-link ok-focusable">悬浮卡片</Link>和各种弹出组件已经处理了关闭、焦点和滚动锁。</>,
            <>Most of the time you will not need these three directly: <Link to="/guide/floating-card" className="g-link ok-focusable">floating cards</Link> and the various popup components already handle dismissal, focus and scroll locking.</>,
          )}
        </Text>
      </DocSection>

      <DocSection
        title={t('useEvent', 'useEvent')}
        description={t(
          '返回一个引用恒定、内部永远调用最新闭包的回调。适合交给定时器、事件监听、子组件的 effect 依赖。',
          'Returns a callback with a stable identity that always calls the latest closure. Good for timers, event listeners and effect dependencies in child components.',
        )}
      >
        <Demo code={t(EVENT_CODE.zh, EVENT_CODE.en)} description={t('切换步长：定时器没有重建，但加的数马上变了。', 'Switch the step: the interval is not recreated, yet the increment changes immediately.')}>
          <Ticker />
        </Demo>
      </DocSection>

      <DocSection title={t('全部导出', 'All exports')}>
        <PropsTable
          title={t('通用', 'General')}
          rows={[
            { name: 'useControllable', type: '(value, defaultValue, onChange?)', description: t('受控 / 非受控二合一。', 'Controlled and uncontrolled in one.') },
            { name: 'useEvent', type: '(fn) => fn', description: t('引用恒定的回调。', 'A callback with a stable identity.') },
            { name: 'useMediaQuery', type: '(query, fallback?) => boolean', description: t('媒体查询。', 'Media query.') },
            { name: 'useBreakpoint', type: '(bp, fallback?) => boolean', description: t('视口是否不小于某个断点。', 'Whether the viewport is at least a given breakpoint.') },
            { name: 'usePresence', type: '(open, exitMs?) => { mounted, state, ref }', description: t(<>进退场。见<Link to="/components/motion" className="g-link ok-focusable">动效工具</Link>。</>, <>Enter and exit transitions. See <Link to="/components/motion" className="g-link ok-focusable">Motion</Link>.</>) },
            { name: 'useEscape', type: '(active, onEscape)', description: t('Esc 关闭，只有最上层响应。', 'Close on Esc; only the topmost layer responds.') },
            { name: 'useOutsidePress', type: '(active, refs, onOutside)', description: t('点在若干元素之外。', 'Presses outside a set of elements.') },
            { name: 'useScrollLock', type: '(active)', description: t('锁页面滚动。', 'Locks page scrolling.') },
            { name: 'useIsoLayoutEffect', type: 'typeof useLayoutEffect', description: t('浏览器里是 useLayoutEffect，服务端是 useEffect（不报警告）。', 'useLayoutEffect in the browser, useEffect on the server (no warning).') },
            { name: 'mergeRefs', type: '(...refs) => RefCallback', description: t('不是 hook：把多个 ref 合成一个，转发 ref 的同时自己也要用时用它。', 'Not a hook: merges several refs into one, for when you forward a ref and also need it yourself.') },
          ]}
        />
        <PropsTable
          title={t('读取上下文', 'Reading context')}
          rows={[
            { name: 'useOink', type: '() => OinkContextValue', description: t(<>主题、强调色、动效偏好及切换方法。见<Link to="/guide/theming" className="g-link ok-focusable">主题</Link>。</>, <>Theme, accent color, motion preference and the setters to change them. See <Link to="/guide/theming" className="g-link ok-focusable">Theming</Link>.</>) },
            { name: 'useAppShell', type: '() => AppShellState', description: t(<>所在 AppShell 的侧栏状态与开关方法；必须在 AppShell 里面调用。见 <Link to="/components/app-shell" className="g-link ok-focusable">AppShell</Link>。</>, <>Sidebar state and toggles of the enclosing AppShell; must be called inside an AppShell. See <Link to="/components/app-shell" className="g-link ok-focusable">AppShell</Link>.</>) },
            { name: 'useFloatingCard', type: '() => FloatingCardContextValue | null', description: t('所在悬浮卡片的 close()、placement、modal 等；不在卡片里时返回 null。', 'close(), placement, modal and more from the enclosing floating card; null outside a card.') },
            { name: 'useFieldControl', type: '(own, labelable?) => FieldControlResult', description: t(<>自己写表单控件时，把所在 <Code>Field</Code> 的 id、禁用、必填、错误描述接过来。</>, <>For custom form controls: picks up the id, disabled, required and error description from the enclosing <Code>Field</Code>.</>) },
            { name: 'usePosition', type: '(options) => …', description: t('锚定定位：弹出层相对触发元素的位置计算，Popover、Menu 等都基于它。', 'Anchored positioning: computes where a popup sits relative to its trigger. Popover, Menu and others are built on it.') },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
