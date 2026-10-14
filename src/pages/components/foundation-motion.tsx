import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Button, Code, CodeBlock, Inline, ScrollArea, Segmented, Stack, Text, animate, playFlip, presets, usePresence, useIsoLayoutEffect } from 'oink-ui';
import type { SpringPreset } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/motion', title: 'Motion 动效工具', group: '基础', order: 3, subtitle: 'Motion', en: { title: 'Motion utilities' } };

/* ------------------------------------------------------------------ animate + 预设 */

const ANIMATE_CODE = {
  zh: `import { useRef, useState } from 'react';
import { Button, Inline, ScrollArea, Segmented, Stack, animate } from 'oink-ui';
import type { SpringPreset } from 'oink-ui';

function Ball() {
  const stage = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const atEnd = useRef(false);
  const [preset, setPreset] = useState<SpringPreset>('spring');

  const move = (options: Parameters<typeof animate>[2]) => {
    if (!stage.current || !ball.current) return;
    const max = stage.current.clientWidth - 64;
    const from = atEnd.current ? max : 0;
    const to = atEnd.current ? 0 : max;
    atEnd.current = !atEnd.current;
    ball.current.style.transform = \`translateX(\${to}px)\`;   // 终点写进样式，动画只负责过程
    animate(ball.current, [{ transform: \`translateX(\${from}px)\` }, { transform: \`translateX(\${to}px)\` }], options);
  };

  return (
    <Stack gap={4}>
      <div ref={stage} style={{ position: 'relative', height: 64, borderRadius: 999, background: 'var(--ok-well)' }}>
        <div ref={ball} style={{ position: 'absolute', top: 12, left: 12, width: 40, height: 40, borderRadius: '50%', background: 'var(--ok-accent)' }} />
      </div>
      <Inline gap={3} justify="center">
        {/* 五个选项在手机上放不下：包一层可以横向滚动的容器 */}
        <ScrollArea direction="horizontal" focusable={false}>
          <Segmented
            size="sm"
            aria-label="弹簧预设"
            value={preset}
            onChange={setPreset}
            options={[
              { value: 'soft', label: 'soft' },
              { value: 'spring', label: 'spring' },
              { value: 'snappy', label: 'snappy' },
              { value: 'bouncy', label: 'bouncy' },
              { value: 'wobbly', label: 'wobbly' },
            ]}
          />
        </ScrollArea>
        <Button variant="primary" onClick={() => move({ spring: preset })}>用弹簧</Button>
        <Button onClick={() => move({ duration: 240 })}>ease-out 240ms</Button>
      </Inline>
    </Stack>
  );
}`,
  en: `import { useRef, useState } from 'react';
import { Button, Inline, ScrollArea, Segmented, Stack, animate } from 'oink-ui';
import type { SpringPreset } from 'oink-ui';

function Ball() {
  const stage = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const atEnd = useRef(false);
  const [preset, setPreset] = useState<SpringPreset>('spring');

  const move = (options: Parameters<typeof animate>[2]) => {
    if (!stage.current || !ball.current) return;
    const max = stage.current.clientWidth - 64;
    const from = atEnd.current ? max : 0;
    const to = atEnd.current ? 0 : max;
    atEnd.current = !atEnd.current;
    ball.current.style.transform = \`translateX(\${to}px)\`;   // write the end state into the style; the animation only covers the journey
    animate(ball.current, [{ transform: \`translateX(\${from}px)\` }, { transform: \`translateX(\${to}px)\` }], options);
  };

  return (
    <Stack gap={4}>
      <div ref={stage} style={{ position: 'relative', height: 64, borderRadius: 999, background: 'var(--ok-well)' }}>
        <div ref={ball} style={{ position: 'absolute', top: 12, left: 12, width: 40, height: 40, borderRadius: '50%', background: 'var(--ok-accent)' }} />
      </div>
      <Inline gap={3} justify="center">
        {/* Five options don’t fit on a phone: wrap them in a horizontally scrolling container */}
        <ScrollArea direction="horizontal" focusable={false}>
          <Segmented
            size="sm"
            aria-label="Spring preset"
            value={preset}
            onChange={setPreset}
            options={[
              { value: 'soft', label: 'soft' },
              { value: 'spring', label: 'spring' },
              { value: 'snappy', label: 'snappy' },
              { value: 'bouncy', label: 'bouncy' },
              { value: 'wobbly', label: 'wobbly' },
            ]}
          />
        </ScrollArea>
        <Button variant="primary" onClick={() => move({ spring: preset })}>Use spring</Button>
        <Button onClick={() => move({ duration: 240 })}>ease-out 240ms</Button>
      </Inline>
    </Stack>
  );
}`,
};

function Ball() {
  const t = useT();
  const stage = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const atEnd = useRef(false);
  const [preset, setPreset] = useState<SpringPreset>('spring');

  const move = (options: Parameters<typeof animate>[2]) => {
    if (!stage.current || !ball.current) return;
    const max = stage.current.clientWidth - 64;
    const from = atEnd.current ? max : 0;
    const to = atEnd.current ? 0 : max;
    atEnd.current = !atEnd.current;
    ball.current.style.transform = `translateX(${to}px)`;
    animate(ball.current, [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }], options);
  };

  return (
    <Stack gap={4} className="g-fill">
      <div ref={stage} style={{ position: 'relative', height: 64, borderRadius: 999, background: 'var(--ok-well)' }}>
        <div ref={ball} style={{ position: 'absolute', top: 12, left: 12, width: 40, height: 40, borderRadius: '50%', background: 'var(--ok-accent)' }} />
      </div>
      <Inline gap={3} justify="center">
        {/* 五个选项在手机上放不下：包一层可以横向滚动的容器 */}
        <ScrollArea direction="horizontal" focusable={false}>
          <Segmented
            size="sm"
            aria-label={t('弹簧预设', 'Spring preset')}
            value={preset}
            onChange={setPreset}
            options={[
              { value: 'soft', label: 'soft' },
              { value: 'spring', label: 'spring' },
              { value: 'snappy', label: 'snappy' },
              { value: 'bouncy', label: 'bouncy' },
              { value: 'wobbly', label: 'wobbly' },
            ]}
          />
        </ScrollArea>
        <Button variant="primary" onClick={() => move({ spring: preset })}>{t('用弹簧', 'Use spring')}</Button>
        <Button onClick={() => move({ duration: 240 })}>ease-out 240ms</Button>
      </Inline>
    </Stack>
  );
}

/* ------------------------------------------------------------------ spring() */

const SPRING_CODE = {
  zh: `import { spring } from 'oink-ui';

const s = spring({ stiffness: 300, damping: 18 });
s.duration;    // 542（ms）
s.overshoot;   // 0.148
s.easing;      // 'linear(0, 0.028, 0.101, …, 1)'，可以直接写进 CSS

node.style.transition = \`transform \${s.duration}ms \${s.easing}\`;`,
  en: `import { spring } from 'oink-ui';

const s = spring({ stiffness: 300, damping: 18 });
s.duration;    // 542 (ms)
s.overshoot;   // 0.148
s.easing;      // 'linear(0, 0.028, 0.101, …, 1)', ready to drop into CSS

node.style.transition = \`transform \${s.duration}ms \${s.easing}\`;`,
};

/* ------------------------------------------------------------------ playFlip */

const FLIP_CODE = {
  zh: `import { useLayoutEffect, useRef, useState } from 'react';
import { Button, Stack, playFlip } from 'oink-ui';

function Shuffle() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const list = useRef<HTMLUListElement>(null);
  const first = useRef<Map<Element, DOMRect> | null>(null);

  const shuffle = () => {
    // 第一步：状态变更之前，记下每个节点现在的位置
    first.current = new Map(Array.from(list.current!.children).map((n): [Element, DOMRect] => [n, n.getBoundingClientRect()]));
    setItems((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  // 第二步：React 提交新布局之后、浏览器绘制之前，从旧位置弹到新位置
  useLayoutEffect(() => {
    if (first.current) playFlip(first.current);
    first.current = null;
  }, [items]);

  return (
    <Stack gap={4} align="center">
      <ul ref={list} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8, width: '100%', margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((n) => (
          <li key={n} style={{ display: 'grid', placeItems: 'center', height: 56, borderRadius: 12, background: 'var(--ok-card)', boxShadow: 'inset 0 0 0 1px var(--ok-line)' }}>
            {n}
          </li>
        ))}
      </ul>
      <Button onClick={shuffle}>打乱</Button>
    </Stack>
  );
}`,
  en: `import { useLayoutEffect, useRef, useState } from 'react';
import { Button, Stack, playFlip } from 'oink-ui';

function Shuffle() {
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const list = useRef<HTMLUListElement>(null);
  const first = useRef<Map<Element, DOMRect> | null>(null);

  const shuffle = () => {
    // Step 1: before the state changes, record where every node is now
    first.current = new Map(Array.from(list.current!.children).map((n): [Element, DOMRect] => [n, n.getBoundingClientRect()]));
    setItems((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  // Step 2: after React commits the new layout and before the browser paints, spring from the old position to the new one
  useLayoutEffect(() => {
    if (first.current) playFlip(first.current);
    first.current = null;
  }, [items]);

  return (
    <Stack gap={4} align="center">
      <ul ref={list} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8, width: '100%', margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((n) => (
          <li key={n} style={{ display: 'grid', placeItems: 'center', height: 56, borderRadius: 12, background: 'var(--ok-card)', boxShadow: 'inset 0 0 0 1px var(--ok-line)' }}>
            {n}
          </li>
        ))}
      </ul>
      <Button onClick={shuffle}>Shuffle</Button>
    </Stack>
  );
}`,
};

function Shuffle() {
  const t = useT();
  const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const list = useRef<HTMLUListElement>(null);
  const first = useRef<Map<Element, DOMRect> | null>(null);

  const shuffle = () => {
    first.current = new Map(Array.from(list.current!.children).map((n): [Element, DOMRect] => [n, n.getBoundingClientRect()]));
    setItems((prev) => {
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  };

  useIsoLayoutEffect(() => {
    if (first.current) playFlip(first.current);
    first.current = null;
  }, [items]);

  return (
    <Stack gap={4} align="center" className="g-fill">
      <ul ref={list} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 8, width: '100%', margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((n) => (
          <li key={n} style={{ display: 'grid', placeItems: 'center', height: 56, borderRadius: 12, background: 'var(--ok-card)', boxShadow: 'inset 0 0 0 1px var(--ok-line)' }}>
            {n}
          </li>
        ))}
      </ul>
      <Button onClick={shuffle}>{t('打乱', 'Shuffle')}</Button>
    </Stack>
  );
}

/* ------------------------------------------------------------------ usePresence */

const PRESENCE_CODE = {
  zh: `import { useState } from 'react';
import type { RefObject } from 'react';
import { Button, Stack, usePresence } from 'oink-ui';

/* 配套的样式：进场慢、退场快
.note { opacity: 0; transform: translateY(8px);
  transition: opacity var(--ok-dur-2) var(--ok-ease-in), transform var(--ok-dur-2) var(--ok-ease-in); }
.note[data-state="open"] { opacity: 1; transform: none;
  transition: opacity var(--ok-dur-2) var(--ok-ease-out), transform var(--ok-spring-dur) var(--ok-spring); }
*/

function Note() {
  const [open, setOpen] = useState(false);
  // open 变 false 后先切到 closed，等退场过渡结束（或 400ms 兜底）再卸载
  const { mounted, state, ref } = usePresence(open, 400);
  return (
    <Stack gap={4} align="center" style={{ minHeight: 120 }}>
      <Button aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '收起' : '显示'}</Button>
      {mounted && (
        <div ref={ref as RefObject<HTMLDivElement>} className="note" data-state={state}>
          我有进场，也有退场。
        </div>
      )}
    </Stack>
  );
}`,
  en: `import { useState } from 'react';
import type { RefObject } from 'react';
import { Button, Stack, usePresence } from 'oink-ui';

/* Matching styles: slow in, quick out
.note { opacity: 0; transform: translateY(8px);
  transition: opacity var(--ok-dur-2) var(--ok-ease-in), transform var(--ok-dur-2) var(--ok-ease-in); }
.note[data-state="open"] { opacity: 1; transform: none;
  transition: opacity var(--ok-dur-2) var(--ok-ease-out), transform var(--ok-spring-dur) var(--ok-spring); }
*/

function Note() {
  const [open, setOpen] = useState(false);
  // when open turns false, switch to closed first and unmount once the exit transition ends (or after a 400ms fallback)
  const { mounted, state, ref } = usePresence(open, 400);
  return (
    <Stack gap={4} align="center" style={{ minHeight: 120 }}>
      <Button aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>
      {mounted && (
        <div ref={ref as RefObject<HTMLDivElement>} className="note" data-state={state}>
          I have an entrance and an exit.
        </div>
      )}
    </Stack>
  );
}`,
};

function Note() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { mounted, state, ref } = usePresence(open, 400);
  return (
    <Stack gap={4} align="center" style={{ minHeight: 120 }}>
      <Button aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t('收起', 'Hide') : t('显示', 'Show')}</Button>
      {mounted && (
        <div ref={ref as RefObject<HTMLDivElement>} className="g-presence" data-state={state}>
          {t('我有进场，也有退场。', 'I have an entrance and an exit.')}
        </div>
      )}
      <Text variant="caption" tone="neutral" aria-live="polite">mounted = {String(mounted)}{t('，', ', ')}state = {state}</Text>
    </Stack>
  );
}

const CSS_CODE = {
  zh: `/* 能用 CSS 过渡解决的，优先用 CSS：时长和弹簧都是令牌 */
.thing { transition: transform var(--ok-spring-dur) var(--ok-spring), opacity var(--ok-dur-2) var(--ok-ease-out); }`,
  en: `/* If a CSS transition can do it, use CSS: durations and springs are both tokens */
.thing { transition: transform var(--ok-spring-dur) var(--ok-spring), opacity var(--ok-dur-2) var(--ok-ease-out); }`,
};

const PRESET_NOTES: Record<SpringPreset, { zh: string; en: string }> = {
  soft: { zh: '无过冲。高度展开、进度；悬浮卡片进场用它的曲线（时长压到 303ms）。', en: 'No overshoot. Height reveals, progress; floating cards enter on its curve (compressed to 303ms).' },
  spring: { zh: '默认。开关、分段、滑块落位。', en: 'The default. Switches, segmented controls, slider thumbs settling.' },
  snappy: { zh: '和默认一样的过冲，更快。小控件。', en: 'Same overshoot as the default, but faster. Small controls.' },
  bouncy: { zh: '明显回弹。松手回弹。', en: 'A visible bounce. Snap-back on release.' },
  wobbly: { zh: '大幅摆动，只用于品牌时刻（标志、点赞）。', en: 'Big wobble, reserved for brand moments (logo, likes).' },
};

export default function MotionPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('库内部用的动效内核也一并导出：把弹簧参数换算成 linear() 缓动的 spring()、五个预设、WAAPI 的薄封装 animate()、布局位移用的 FLIP，以及处理进退场卸载时机的 usePresence。它们都读全局倍率 --ok-ms，开了减弱动效会自动归零。', 'The motion core the library uses internally is exported too: spring(), which turns spring parameters into a linear() easing; five presets; animate(), a thin WAAPI wrapper; FLIP for layout shifts; and usePresence, which times unmounting around exit transitions. They all read the global multiplier --ok-ms, which drops to zero under reduced motion.')}>
      <DocSection title={t('先用 CSS', 'Start with CSS')} description={t('进退场、悬停、落位这类状态过渡，直接写 CSS 过渡并引用令牌。只有需要量位置、或者由事件一次性触发的动画才用脚本。', 'For state transitions like enter/exit, hover and settling, write a CSS transition that references the tokens. Reach for script only when you need to measure positions or fire a one-off animation from an event.')}>
        <CodeBlock code={t(CSS_CODE.zh, CSS_CODE.en)} language="css" />
      </DocSection>

      <DocSection title={t('animate 与弹簧预设', 'animate and spring presets')} description={t('animate(node, keyframes, options) 就是 element.animate()，多做三件事：时长乘以 --ok-ms；options.spring 传预设名或弹簧参数时自动换成对应的时长和 linear() 缓动；默认 240ms、ease-out。', 'animate(node, keyframes, options) is element.animate() with three extras: durations are multiplied by --ok-ms; passing a preset name or spring parameters as options.spring swaps in the matching duration and linear() easing; the default is 240ms ease-out.')}>
        <Demo code={t(ANIMATE_CODE.zh, ANIMATE_CODE.en)} layout="block">
          <Ball />
        </Demo>
        <PropsTable
          title={t('五个预设（presets）', 'The five presets')}
          rows={(Object.keys(presets) as SpringPreset[]).map((k) => ({
            name: k,
            type: `stiffness ${presets[k].stiffness} · damping ${presets[k].damping}`,
            default: `${presets[k].duration}ms`,
            description: t(PRESET_NOTES[k].zh + `过冲约 ${Math.round(presets[k].overshoot * 100)}%。`, `${PRESET_NOTES[k].en} About ${Math.round(presets[k].overshoot * 100)}% overshoot.`),
          }))}
        />
        <Text as="p" tone="neutral" style={{ margin: 0 }}>{t(<>上表“默认值”一栏是换算出的时长。CSS 里对应 <Code>--ok-spring-*</Code> 和 <Code>--ok-spring-*-dur</Code> 这组令牌。</>, <>The Default column above shows the computed duration. In CSS, the matching tokens are <Code>--ok-spring-*</Code> and <Code>--ok-spring-*-dur</Code>.</>)}</Text>
      </DocSection>

      <DocSection title={t('spring()：自己调一条', 'spring(): tune your own')} description={t('spring({ stiffness, damping, mass }) 返回 { duration, easing, overshoot, … }。easing 是可以直接贴进 CSS 的 linear(…)。', 'spring({ stiffness, damping, mass }) returns { duration, easing, overshoot, … }. easing is a linear(…) you can paste straight into CSS.')}>
        <CodeBlock code={t(SPRING_CODE.zh, SPRING_CODE.en)} language="ts" />
        <Text as="p" tone="neutral" style={{ margin: 0 }}>{t(<>想边调参数边看曲线和效果，用“动效”一章里的 <Link to="/guide/motion" className="g-link ok-focusable">弹簧实验台</Link>：拖动刚度、阻尼、质量，实时算出时长、过冲和 <Code>linear()</Code>，可以一键复制。</>, <>To watch the curve and the result while you tweak, use the <Link to="/guide/motion" className="g-link ok-focusable">spring playground</Link> in the Motion guide: drag stiffness, damping and mass to compute duration, overshoot and <Code>linear()</Code> live, then copy with one click.</>)}</Text>
      </DocSection>

      <DocSection title={t('playFlip：布局变了，元素滑过去', 'playFlip: elements glide when layout changes')} description={t('FLIP 分两步：变更之前记下每个节点的位置；变更之后调用 playFlip(first)，它量出新位置并把每个节点从旧位置弹到新位置。React 里第二步放在 useLayoutEffect 中。', 'FLIP takes two steps: record every node’s position before the change; after the change, call playFlip(first), which measures the new positions and springs each node from old to new. In React, the second step goes in useLayoutEffect.')}>
        <Demo code={t(FLIP_CODE.zh, FLIP_CODE.en)} layout="block">
          <Shuffle />
        </Demo>
        <Text as="p" tone="neutral" style={{ margin: 0 }}>{t(<>不在 React 的渲染流程里（直接改 DOM）时可以用一步到位的 <Code>flip(nodes, mutate, options?)</Code>。</>, <>Outside the React render cycle (mutating the DOM directly), use the all-in-one <Code>flip(nodes, mutate, options?)</Code>.</>)}</Text>
      </DocSection>

      <DocSection title={t('usePresence：等退场结束再卸载', 'usePresence: unmount after the exit')} description={t('条件渲染的元素一卸载就没了，来不及播退场。usePresence(open, exitMs) 让节点多活一会儿：state 用来写 [data-state] 过渡，mounted 决定是否渲染。', 'A conditionally rendered element vanishes the moment it unmounts, with no time for an exit. usePresence(open, exitMs) keeps the node alive a little longer: state drives [data-state] transitions, and mounted decides whether to render.')}>
        <Demo code={t(PRESENCE_CODE.zh, PRESENCE_CODE.en)}>
          <Note />
        </Demo>
        <Text as="p" tone="neutral" style={{ margin: 0 }}>{t(<>浮在页面上的容器不需要自己用它：<Code>FloatingCard</Code> 和各个弹出组件已经处理好了进退场。</>, <>Floating containers don’t need it themselves: <Code>FloatingCard</Code> and the popup components already handle enter and exit.</>)}</Text>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title={t('函数', 'Functions')}
          rows={[
            { name: 'animate', type: '(node, keyframes, options?) => Animation | null', description: t(<>WAAPI 封装。<Code>options</Code> 是 <Code>KeyframeAnimationOptions</Code> 加一个 <Code>spring</Code>（预设名或弹簧参数）。默认 <Code>duration: 240</Code>、<Code>easing: ease.out</Code>，不保留 fill；有 <Code>delay</Code> 时自动 <Code>fill: 'backwards'</Code>。</>, <>A WAAPI wrapper. <Code>options</Code> is <Code>KeyframeAnimationOptions</Code> plus <Code>spring</Code> (a preset name or spring parameters). Defaults to <Code>duration: 240</Code> and <Code>easing: ease.out</Code> with no fill kept; with a <Code>delay</Code> it sets <Code>fill: 'backwards'</Code> automatically.</>) },
            { name: 'spring', type: '(options?) => SpringResult', description: t(<>弹簧参数（<Code>stiffness</Code> 默认 260、<Code>damping</Code> 默认 24、<Code>mass</Code> 默认 1）换算成时长和 <Code>linear()</Code> 缓动。</>, <>Converts spring parameters (<Code>stiffness</Code> default 260, <Code>damping</Code> default 24, <Code>mass</Code> default 1) into a duration and a <Code>linear()</Code> easing.</>) },
            { name: 'presets', type: 'Record<SpringPreset, SpringResult>', description: t('五个预设的换算结果。', 'Computed results for the five presets.') },
            { name: 'ease', type: '{ out, in, inOut, standard }', description: t('四条贝塞尔曲线的字符串，和 --ok-ease-* 一致。', 'Four cubic-bezier strings, matching --ok-ease-*.') },
            { name: 'playFlip', type: '(first: Map<Element, DOMRect>, options?) => void', description: t('FLIP 的第二步：从记录的位置弹到当前位置。位移小于 0.5px 的节点跳过。默认用 spring 预设。', 'The second FLIP step: springs from the recorded positions to the current ones. Nodes that moved less than 0.5px are skipped. Uses the spring preset by default.') },
            { name: 'flip', type: '(nodes, mutate, options?) => void', description: t('一步到位的 FLIP：记录、执行 mutate、播放。', 'All-in-one FLIP: record, run mutate, play.') },
            { name: 'speed', type: '() => number', description: t('读当前的 --ok-ms（减弱动效时为 0）。', 'Reads the current --ok-ms (0 under reduced motion).') },
            { name: 'wait', type: '(ms: number) => Promise<void>', description: t('按 --ok-ms 缩放过的延时，用来串联几段动画。', 'A delay scaled by --ok-ms, for chaining several animations.') },
            { name: 'floatMotion', type: '{ in: 303, fade: 100, out: 160 }', description: t(<>悬浮卡片共用的进场位移、进场淡入、退场时长（ms，未乘 <Code>--ok-ms</Code>），和 <Code>--ok-float-in-dur</Code> / <Code>--ok-float-fade-dur</Code> / <Code>--ok-float-out-dur</Code> 一致。</>, <>Shared floating card durations for the entrance move, entrance fade and exit (ms, not multiplied by <Code>--ok-ms</Code>), matching <Code>--ok-float-in-dur</Code> / <Code>--ok-float-fade-dur</Code> / <Code>--ok-float-out-dur</Code>.</>) },
            { name: 'supportsLinear', type: 'boolean', description: t('浏览器是否支持 linear() 缓动；不支持时 animate 用预设里的贝塞尔回退。', 'Whether the browser supports linear() easing; if not, animate falls back to the preset’s bezier curve.') },
          ]}
        />
        <PropsTable
          title="usePresence(open, exitMs?)"
          rows={[
            { name: 'open', type: 'boolean', required: true, description: t('是否应该显示。', 'Whether it should be shown.') },
            { name: 'exitMs', type: 'number', default: '400', description: t('退场的兜底时长：过渡没有触发 transitionend 时，到点也会卸载。', 'Fallback exit duration: if the transition never fires transitionend, the node unmounts when time is up.') },
            { name: t('返回 mounted', 'Returns mounted'), type: 'boolean', description: t('是否渲染节点。', 'Whether to render the node.') },
            { name: t('返回 state', 'Returns state'), type: `'open' | 'closed'`, description: t('写到 data-state 上。进场时会先以 closed 渲染一帧，过渡才有起点。', 'Goes on data-state. On entry it renders one frame as closed first, so the transition has a starting point.') },
            { name: t('返回 ref', 'Returns ref'), type: 'MutableRefObject<HTMLElement | null>', description: t('接到做过渡的那个节点上，用来监听它的 transitionend。', 'Attach to the node that transitions, so its transitionend can be observed.') },
          ]}
        />
        <div className="g-prose">
          {t(
            <p><strong>减弱动效。</strong>不需要自己判断 <Code>prefers-reduced-motion</Code>：<Code>animate()</Code> 的时长会乘以 0，动画直接到位；CSS 里用时长令牌的过渡同理。不要用 <Code>setTimeout</Code> 写死毫秒数去等动画结束，用 <Code>animation.finished</Code> 或 <Code>wait()</Code>。</p>,
            <p><strong>Reduced motion.</strong> You don’t need to check <Code>prefers-reduced-motion</Code> yourself: <Code>animate()</Code> multiplies durations by 0 so animations jump straight to the end, and CSS transitions that use the duration tokens do the same. Don’t wait for an animation with a hard-coded <Code>setTimeout</Code>; use <Code>animation.finished</Code> or <Code>wait()</Code>.</p>,
          )}
        </div>
      </DocSection>
    </DocPage>
  );
}
