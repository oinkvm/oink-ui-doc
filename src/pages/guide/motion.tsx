import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import {
  Badge, Button, Card, Chip, Code, CodeBlock, ColorSwatches, CommandPalette, Dialog, Icon, Inline, Rating, Slider, Spinner, Stack, Switch,
  Table, TAIL_PATH, Text, Tooltip, animate, cx, playFlip, presets, speed, spring, supportsLinear, toast, useOink, usePresence, useIsoLayoutEffect,
} from 'oink-ui';
import type { CommandItem, SpringPreset, TableColumn } from 'oink-ui';
import { Demo, DocPage, DocSection, useClientValue } from '../../doc';
import { useT } from '../../i18n';
import type { Translate } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import { copy, useThemeVersion } from '../../foundations/lib';
import '../../foundations/foundations.css';
import './guide.css';

export const meta: PageMeta = { path: '/guide/motion', title: '动效', group: '开始', order: 6, subtitle: 'Motion', en: { title: 'Motion' } };

const slide = (from: number, to: number) => [{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }];

/* ------------------------------------------------------------------ 原则 */

const RULES: Array<{ key: string; title: { zh: string; en: string }; text: { zh: ReactNode; en: ReactNode } }> = [
  { key: 'cause', title: { zh: '有因果', en: 'Cause and effect' }, text: { zh: '从触发点出发：菜单从按钮下方落下，对话框和命令面板从点按处放大，选中块滑向新位置。', en: 'Start from the trigger: menus drop from below their button, dialogs and the command palette scale up from where you tapped, and the selection slides to its new position.' } },
  { key: 'inout', title: { zh: '进场软，退场快', en: 'Soft in, quick out' }, text: { zh: '按下 90ms 立即响应。对话框、抽屉、底部弹层这些悬浮卡片共用一条进退场：303ms 无过冲地落位（spring-soft），160ms 加速离开；提示进场也用弹簧落位；菜单开合频繁，只做 150ms 的淡入下移。退场 90–170ms，比进场快。', en: 'Presses respond immediately, in 90ms. Floating cards such as dialogs, drawers and bottom sheets share one enter and exit: they settle in 303ms without overshoot (spring-soft) and accelerate away in 160ms. Tooltips also settle in on a spring; menus open and close often, so they only fade and drop in over 150ms. Exits take 90–170ms, faster than entrances.' } },
  { key: 'one', title: { zh: '一次只讲一件事', en: 'One thing at a time' }, text: { zh: '同屏只有一个主动效。浮层里的内容跟着容器一次出现，不逐条进场；确实需要错峰的成组元素，间隔不超过 45ms，整体不超过 400ms。', en: 'Only one primary motion on screen at a time. Content inside an overlay appears with its container in one go rather than item by item; when a group really needs to stagger, keep the interval under 45ms and the whole thing under 400ms.' } },
  { key: 'bounce', title: { zh: '回弹有度', en: 'Measured bounce' }, text: { zh: '常规过冲 3%（spring、snappy）；松手、勾选这类强调时刻 15%（bouncy）；33% 的大摆幅（wobbly）只留给品牌时刻，库里的组件目前都没有用它。', en: 'Regular overshoot is 3% (spring, snappy); moments of emphasis such as releasing or checking get 15% (bouncy); the big 33% swing (wobbly) is reserved for brand moments, and no library component uses it yet.' } },
  { key: 'interrupt', title: { zh: '随时可打断', en: 'Always interruptible' }, text: { zh: '位移和缩放只动 transform 与 opacity，颜色和描边用 150ms 的短过渡；全部可以中途打断，连点不排队。', en: 'Movement and scaling only touch transform and opacity; colors and strokes use short 150ms transitions. Everything can be interrupted midway, and rapid clicks never queue up.' } },
  { key: 'reduced', title: { zh: '尊重减弱动效', en: 'Respect reduced motion' }, text: { zh: '所有时长都乘了 --ok-ms。减弱动效时它是 0：状态直接到位，循环的加载动画停下或改成淡入淡出。', en: 'Every duration is multiplied by --ok-ms. Under reduced motion it is 0: states jump straight to their end, and looping loaders stop or switch to a fade.' } },
];

/* ------------------------------------------------------------------ 时长 */

const DURATIONS: Array<{ token: string; ms: number; use: { zh: string; en: string } }> = [
  { token: '--ok-dur-1', ms: 90, use: { zh: '按压反馈、高亮跟随、菜单退场', en: 'Press feedback, highlight following, menu exit' } },
  { token: '--ok-dur-2', ms: 150, use: { zh: '悬停、变色、淡入淡出、菜单进场', en: 'Hover, color changes, fades, menu enter' } },
  { token: '--ok-dur-3', ms: 240, use: { zh: '焦点环、描线、折叠内容的退场', en: 'Focus ring, stroke drawing, collapsing content exit' } },
  { token: '--ok-dur-4', ms: 360, use: { zh: '对勾描线、展开后的内容淡入', en: 'Checkmark drawing, expanded content fade-in' } },
  { token: '--ok-dur-5', ms: 520, use: { zh: '校验失败的抖动', en: 'Validation error shake' } },
  { token: '--ok-dur-6', ms: 800, use: { zh: '品牌时刻（点赞）', en: 'Brand moments (likes)' } },
];

/** 一行试播：点一下，小圆点从轨道一头走到另一头；再点走回来 */
function PlayRow({ name, detail, play }: { name: string; detail: string; play: (dot: HTMLElement, from: number, to: number) => void }) {
  const t = useT();
  const track = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const atEnd = useRef(false);
  const run = () => {
    if (!track.current || !dot.current) return;
    const max = track.current.clientWidth - 24;
    const from = atEnd.current ? max : 0;
    const to = atEnd.current ? 0 : max;
    atEnd.current = !atEnd.current;
    dot.current.style.transform = `translateX(${to}px)`;
    play(dot.current, from, to);
  };
  return (
    <button type="button" className="g-play ok-focusable" onClick={run} aria-label={t(`试播 ${name}，${detail}`, `Play ${name}, ${detail}`)}>
      <span className="g-play__meta"><b>{name}</b><span>{detail}</span></span>
      <span className="g-play__track" ref={track} aria-hidden="true"><span className="g-play__dot" ref={dot} /></span>
    </button>
  );
}

/* ------------------------------------------------------------------ 曲线 */

const BEZIERS: Array<[name: string, bezier: number[], zh: string, en: string]> = [
  ['ease-out', [0.22, 1, 0.36, 1], '进场、悬停、变色 · 默认', 'Enter, hover, color · default'],
  ['ease-in', [0.55, 0, 1, 0.45], '退场', 'Exit'],
  ['ease-in-out', [0.65, 0, 0.35, 1], '屏内往返、循环', 'On-screen back and forth, loops'],
  ['ease-standard', [0.2, 0, 0, 1], '通用的位移', 'General movement'],
];
const SPRINGS: Array<[name: string, preset: SpringPreset, zh: string, en: string]> = [
  ['spring-soft', 'soft', '高度展开、进度', 'Height expansion, progress'],
  ['spring', 'spring', '开关、分段、FLIP、悬浮卡片 · 默认', 'Switches, segmented, FLIP, floating cards · default'],
  ['spring-snappy', 'snappy', '文字提示热切换 · 更快', 'Tooltip hot-swap · faster'],
  ['spring-bouncy', 'bouncy', '松手回弹、勾选、计数', 'Release bounce, checks, counts'],
  ['spring-wobbly', 'wobbly', '品牌时刻 · 组件未用', 'Brand moments · unused by components'],
];

const cubic = (t: number, a: number, b: number) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
const curvePath = (pts: number[][], x0: number, w: number, y0: number, h: number) =>
  pts.map((p, i) => (i ? 'L' : 'M') + (x0 + p[0] * w).toFixed(1) + ' ' + (y0 - p[1] * h).toFixed(1)).join('');
const bezierPoints = (b: number[]) => Array.from({ length: 41 }, (_, i) => { const t = i / 40; return [cubic(t, b[0], b[2]), cubic(t, b[1], b[3])]; });
const springPoints = (sp: { at: (p: number) => number }, n: number) => Array.from({ length: n + 1 }, (_, i) => [i / n, i === n ? 1 : sp.at(i / n)]);

interface CurveCard { name: string; pts: number[][]; desc: string; dur: number; bezier?: string; preset?: SpringPreset }

function Curve({ c, register }: { c: CurveCard; register: (fn: () => void) => void }) {
  const t = useT();
  const track = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLElement>(null);
  const atEnd = useRef(false);
  const play = () => {
    if (!track.current || !dot.current) return;
    const max = track.current.clientWidth - 16;
    const from = atEnd.current ? max : 0;
    const to = atEnd.current ? 0 : max;
    atEnd.current = !atEnd.current;
    dot.current.style.transform = `translateX(${to}px)`;
    animate(dot.current, slide(from, to), c.preset ? { spring: c.preset } : { duration: c.dur, easing: c.bezier });
  };
  register(play);
  return (
    <button type="button" className={cx('f-curve ok-focusable', c.preset && 'f-curve--spring')} onClick={play} aria-label={t(`试播 --ok-${c.name}`, `Play --ok-${c.name}`)}>
      <svg viewBox="0 0 120 84" aria-hidden="true"><path className="axis" d="M10 62H110M10 22H110" /><path className="line" d={curvePath(c.pts, 10, 100, 62, 40)} /></svg>
      <span className="f-curve__track" ref={track} aria-hidden="true"><i ref={dot as RefObject<HTMLElement>} /></span>
      <span><b>--ok-{c.name}</b><span>{c.desc} · {c.dur}ms</span></span>
    </button>
  );
}

function Curves() {
  const t = useT();
  const players = useRef<Array<() => void>>([]);
  players.current = [];
  const cards: CurveCard[] = [
    ...BEZIERS.map(([name, b, zh, en]) => ({ name, pts: bezierPoints(b), desc: t(zh, en), dur: 520, bezier: `cubic-bezier(${b.join(',')})` })),
    ...SPRINGS.map(([name, key, zh, en]) => ({ name, pts: springPoints(presets[key], 60), desc: `${t(zh, en)} · ${t('过冲', 'overshoot')} ${Math.round(presets[key].overshoot * 100)}%`, dur: presets[key].duration, preset: key })),
  ];
  return (
    <Stack gap={4} className="g-fill">
      <Inline gap={3} justify="between" align="center">
        <Text variant="caption" tone="neutral">{t('贝塞尔曲线按 520ms 试播；弹簧用自己的时长。', 'Bézier curves play over 520ms; springs use their own durations.')}</Text>
        <Button size="sm" leading={<Icon name="play" />} onClick={() => players.current.forEach((p) => p())}>{t('全部播放', 'Play all')}</Button>
      </Inline>
      <div className="f-curves">
        {cards.map((c) => <Curve key={c.name} c={c} register={(fn) => players.current.push(fn)} />)}
      </div>
    </Stack>
  );
}

/* ------------------------------------------------------------------ 弹簧实验台 */

const PRESET_KEYS: SpringPreset[] = ['soft', 'spring', 'snappy', 'bouncy', 'wobbly'];

function Playground() {
  const t = useT();
  const [k, setK] = useState(260);
  const [c, setC] = useState(24);
  const [m, setM] = useState(1);
  const box = useRef<HTMLDivElement>(null);
  const side = useRef(false);
  const params = useRef({ k, c, m });
  params.current = { k, c, m };

  const sp = spring({ stiffness: k, damping: c, mass: m });
  const pts = springPoints(sp, 90).map((p) => [p[0], Math.max(-0.3, Math.min(1.5, p[1]))]);
  const line = curvePath(pts, 20, 280, 140, 90);
  const zeta = c / (2 * Math.sqrt(k * m));
  const code = `transition: transform ${sp.duration}ms ${sp.easing};`;

  const play = () => {
    const el = box.current;
    if (!el) return;
    const dist = (el.parentElement as HTMLElement).clientWidth - 44;
    const from = side.current ? dist : 0;
    const to = side.current ? 0 : dist;
    side.current = !side.current;
    el.style.transform = `translateX(${to}px)`;
    const p = params.current;
    animate(el, slide(from, to), { spring: { stiffness: p.k, damping: p.c, mass: p.m } });
  };
  const applyPreset = (key: SpringPreset) => {
    const p = presets[key];
    params.current = { k: p.stiffness, c: p.damping, m: 1 };
    setK(p.stiffness); setC(p.damping); setM(1);
    play();
  };

  return (
    <div className="f-pg">
      <div className="f-pg__controls">
        <div className="f-pg__chips" role="group" aria-label={t('弹簧预设', 'Spring presets')}>
          {PRESET_KEYS.map((key) => {
            const p = presets[key];
            return <Chip key={key} selected={p.stiffness === k && p.damping === c && m === 1} onChange={() => applyPreset(key)}>{key}</Chip>;
          })}
        </div>
        <div className="f-pg__field"><span>{t('刚度', 'Stiffness')} <em>stiffness</em></span><Slider aria-label={t('刚度', 'Stiffness')} min={40} max={800} step={10} value={k} onChange={setK} onChangeEnd={play} /></div>
        <div className="f-pg__field"><span>{t('阻尼', 'Damping')} <em>damping</em></span><Slider aria-label={t('阻尼', 'Damping')} min={4} max={60} step={1} value={c} onChange={setC} onChangeEnd={play} /></div>
        <div className="f-pg__field"><span>{t('质量', 'Mass')} <em>mass</em></span><Slider aria-label={t('质量', 'Mass')} min={0.5} max={3} step={0.1} digits={1} value={m} onChange={setM} onChangeEnd={play} /></div>
        <dl className="f-pg__stats">
          <div><dt>{t('时长', 'Duration')}</dt><dd>{sp.duration}<small>ms</small></dd></div>
          <div><dt>{t('过冲', 'Overshoot')}</dt><dd>{(sp.overshoot * 100).toFixed(1)}<small>%</small></dd></div>
          <div><dt>{t('阻尼比 ζ', 'Damping ratio ζ')}</dt><dd>{zeta.toFixed(2)}</dd></div>
        </dl>
      </div>
      <div className="f-pg__view">
        <svg className="f-pg__curve" viewBox="0 0 320 180" role="img" aria-label={t(`弹簧曲线：${sp.duration}ms，过冲 ${(sp.overshoot * 100).toFixed(1)}%`, `Spring curve: ${sp.duration}ms, ${(sp.overshoot * 100).toFixed(1)}% overshoot`)}>
          <path className="area" d={`${line}L300 140L20 140Z`} />
          <path className="axis" d="M20 140H300M20 50H300" />
          <text x="22" y="43">1.0</text><text x="22" y="156">0</text><text x="300" y="156" textAnchor="end">{sp.duration}ms</text>
          <path className="line" d={line} />
        </svg>
        <div className="f-pg__stage">
          <div className="f-pg__track"><div className="f-pg__box" ref={box} /></div>
          <Button variant="accent" size="sm" leading={<Icon name="play" />} onClick={play}>{t('播放', 'Play')}</Button>
        </div>
        <div className="f-pg__code">
          <pre>{code}</pre>
          <Tooltip content={t('复制', 'Copy')}>
            <Button size="sm" variant="ghost" iconOnly aria-label={t('复制这行 CSS', 'Copy this CSS line')} onClick={() => copy(code, t, t('代码已在剪贴板', 'The code is on your clipboard'))}><Icon name="copy" /></Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 六种基本动作 */

function Pattern({ title, desc, children }: { title: string; desc: ReactNode; children: ReactNode }) {
  return (
    <article className="f-pattern">
      <div className="f-pattern__stage">{children}</div>
      <Text as="h3" variant="label" className="f-pattern__title">{title}</Text>
      <Text as="p" variant="caption" tone="neutral" className="f-pattern__desc">{desc}</Text>
    </article>
  );
}

function EnterExit() {
  const t = useT();
  const [open, setOpen] = useState(true);
  const { mounted, state, ref } = usePresence(open, 400);
  return (
    <>
      <div className="f-pt-enter">
        {mounted && (
          <div ref={ref as RefObject<HTMLDivElement>} className="f-pt-enter__card" data-state={state}>
            <span className="f-pt-enter__avatar" /><span><i /><i /></span>
          </div>
        )}
      </div>
      <Button size="sm" className="f-pattern__btn" aria-pressed={open} onClick={() => setOpen((v) => !v)}>{open ? t('收起', 'Hide') : t('显示', 'Show')}</Button>
    </>
  );
}

function Dock() {
  const t = useT();
  const [on, setOn] = useState(0);
  const items: Array<['edit' | 'share' | 'download' | 'bell' | 'more', string]> = [
    ['edit', t('编辑', 'Edit')], ['share', t('分享', 'Share')], ['download', t('下载', 'Download')], ['bell', t('通知', 'Notifications')], ['more', t('更多', 'More')],
  ];
  return (
    <div className="f-pt-dock" style={{ '--x': `${on * 42}px` } as CSSProperties} role="toolbar" aria-label={t('示例工具条', 'Example toolbar')}>
      <span className="f-pt-dock__hl" aria-hidden="true" />
      {items.map(([icon, label], i) => (
        <button type="button" key={icon} aria-label={label} className={cx('ok-focusable', on === i && 'is-on')} onPointerEnter={() => setOn(i)} onFocus={() => setOn(i)} onClick={() => setOn(i)}>
          <Icon name={icon} />
        </button>
      ))}
    </div>
  );
}

function Stagger() {
  const t = useT();
  const host = useRef<HTMLDivElement>(null);
  const play = () => host.current?.querySelectorAll('i').forEach((n, i) =>
    animate(n, [{ opacity: 0, transform: 'translateY(16px) scale(.7)' }, { opacity: 1, transform: 'none' }], { spring: 'bouncy', delay: 26 * i }));
  return (
    <>
      <div className="f-pt-stagger" ref={host} aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</div>
      <Button size="sm" className="f-pattern__btn" leading={<Icon name="replay" />} onClick={play}>{t('播放', 'Play')}</Button>
    </>
  );
}

function shuffled<T>(list: T[]): T[] {
  const order = list.slice();
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  if (order.every((n, i) => n === list[i])) order.push(order.shift() as T);
  return order;
}

function Flip() {
  const t = useT();
  const host = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState([1, 2, 3, 4, 5, 6]);
  const first = useRef<Map<Element, DOMRect> | null>(null);
  useIsoLayoutEffect(() => {
    if (!first.current) return;
    const f = first.current;
    first.current = null;
    playFlip(f);
  }, [order]);
  return (
    <>
      <div className="f-pt-flip" ref={host} aria-label={t(`当前顺序 ${order.join('、')}`, `Current order ${order.join(', ')}`)}>
        {order.map((n) => <i key={n} className={n === 1 ? 'is-accent' : undefined}>{n}</i>)}
      </div>
      <Button
        size="sm" className="f-pattern__btn" leading={<Icon name="shuffle" />}
        onClick={() => {
          first.current = new Map(Array.from(host.current!.children).map((n) => [n, n.getBoundingClientRect()]));
          setOrder((o) => shuffled(o));
        }}
      >{t('打乱', 'Shuffle')}</Button>
    </>
  );
}

function Draw() {
  const t = useT();
  const [n, setN] = useState(0);
  return (
    <>
      <svg key={n} className={cx('f-pt-draw', n > 0 && 'is-playing')} viewBox="0 0 160 80" aria-hidden="true">
        <path pathLength={1} d="M14 44l14 14 30-34" />
        <g transform="translate(92 12) scale(1.15)"><path pathLength={1} className="is-accent" d={TAIL_PATH} /></g>
      </svg>
      <Button size="sm" className="f-pattern__btn" leading={<Icon name="replay" />} onClick={() => setN((x) => x + 1)}>{t('播放', 'Play')}</Button>
    </>
  );
}

/* ------------------------------------------------------------------ 从触发点进场 */

function TriggerOrigin() {
  const t = useT();
  const [dialog, setDialog] = useState(false);
  const [palette, setPalette] = useState(false);
  const items: CommandItem[] = [
    { id: 'new', label: t('新建文档', 'New document'), icon: <Icon name="file" />, onSelect: () => toast(t('这里只是演示', 'Just a demo')) },
    { id: 'search', label: t('搜索文件', 'Search files'), icon: <Icon name="search" />, onSelect: () => toast(t('这里只是演示', 'Just a demo')) },
    { id: 'share', label: t('分享链接', 'Share link'), icon: <Icon name="share" />, onSelect: () => toast(t('这里只是演示', 'Just a demo')) },
  ];
  return (
    <>
      <div className="f-origin">
        <Button onClick={() => setDialog(true)}>{t('从左边打开', 'Open from the left')}</Button>
        <Button variant="primary" leading={<Icon name="command" />} onClick={() => setPalette(true)}>{t('命令面板', 'Command palette')}</Button>
        <Button onClick={() => setDialog(true)}>{t('从右边打开', 'Open from the right')}</Button>
      </div>
      <Dialog
        open={dialog}
        onOpenChange={setDialog}
        icon={<Icon name="sparkle" />}
        title={t('从按钮处长出来', 'Grown from the button')}
        description={t('关掉它，会缩回同一个点。换一个按钮再打开试试；用键盘（Tab 到按钮再按回车）打开时，从按钮中心出来。', 'Close it and it shrinks back into the same point. Try opening it from the other button; when opened with the keyboard (Tab to the button, then Enter), it comes out of the button’s center.')}
        actions={<Button size="lg" variant="primary" onClick={() => setDialog(false)}>{t('知道了', 'Got it')}</Button>}
      />
      <CommandPalette open={palette} onOpenChange={setPalette} items={items} />
    </>
  );
}

/* ------------------------------------------------------------------ 减弱动效 */

function ReducedMotion() {
  const t = useT();
  const { motion, setMotion } = useOink();
  const v = useThemeVersion();
  const [ms, setMs] = useState(1);
  const ball = useRef<HTMLDivElement>(null);
  const atEnd = useRef(false);
  // data-motion 由 OinkProvider 在 effect 里写到 <html> 上；v 在它写完后才变，这时读 --ok-ms 才准
  useEffect(() => { setMs(speed()); }, [motion, v]);
  const play = () => {
    const el = ball.current;
    if (!el) return;
    const max = (el.parentElement as HTMLElement).clientWidth - 52;
    const from = atEnd.current ? max : 0;
    const to = atEnd.current ? 0 : max;
    atEnd.current = !atEnd.current;
    el.style.transform = `translateX(${to}px)`;
    animate(el, slide(from, to), { spring: 'bouncy' });
  };
  return (
    <Stack gap={4} className="g-fill">
      <Inline gap={4} align="center" justify="between">
        <Switch checked={motion === 'reduced'} onChange={(on) => setMotion(on ? 'reduced' : 'auto')}>{t('减弱动效', 'Reduced motion')}</Switch>
        <Inline gap={2} align="center">
          <Badge tone={ms === 0 ? 'warning' : 'success'}>--ok-ms = {ms}</Badge>
          <Badge>motion = {motion}</Badge>
        </Inline>
      </Inline>
      <div className="g-stage"><div className="g-ball" ref={ball} /></div>
      <Inline gap={4} align="center" justify="between">
        <Button variant="primary" leading={<Icon name="play" />} onClick={play}>{t('用 bouncy 弹簧移动', 'Move with the bouncy spring')}</Button>
        <Inline gap={3} align="center"><Spinner aria-label={t('加载中', 'Loading')} /><Text variant="caption" tone="neutral">{t('加载尾巴', 'Loading tail')}</Text></Inline>
      </Inline>
    </Stack>
  );
}

/* ------------------------------------------------------------------ 悬浮卡片 */

interface FRow { token: string; value: string; use: string }
const floatTokens = (t: Translate): FRow[] => [
  { token: '--ok-float-in-dur', value: '303ms', use: t('进场位移（放大或滑入）', 'Enter movement (scale up or slide in)') },
  { token: '--ok-float-in-ease', value: 'var(--ok-spring-soft)', use: t('进场位移的曲线（不过冲）；拖拽松手后的回弹也用它', 'Curve of the enter movement (no overshoot); also used for the snap back after a drag is released') },
  { token: '--ok-float-fade-dur', value: '100ms', use: t('进场淡入（配 ease-out）', 'Enter fade-in (with ease-out)') },
  { token: '--ok-float-out-dur', value: '160ms', use: t('退场的位移、透明度和遮罩；遮罩淡入也用这一档', 'Exit movement, opacity and scrim; the scrim fade-in uses it too') },
  { token: '--ok-float-out-ease', value: 'var(--ok-ease-in)', use: t('退场的曲线', 'Curve of the exit') },
];
const floatCols = (t: Translate): TableColumn<FRow>[] => [
  { key: 'token', header: t('令牌', 'Token'), render: (r) => <Code>{r.token}</Code> },
  { key: 'value', header: t('值', 'Value'), render: (r) => <Code>{r.value}</Code> },
  { key: 'use', header: t('用途', 'Use') },
];

/* ------------------------------------------------------------------ 对照表 */

interface MRow { id: string; scene: string; prop: string; dur: ReactNode; curve: ReactNode }
const motionRows = (t: Translate): MRow[] => [
  { id: 'press', scene: t('按下', 'Press'), prop: 'scale → .955', dur: <><Code>dur-1</Code> 90ms</>, curve: <Code>ease-out</Code> },
  { id: 'release', scene: t('松开回弹', 'Release bounce'), prop: 'scale → 1', dur: '542ms', curve: <Code>spring-bouncy</Code> },
  { id: 'hover', scene: t('悬停、变色', 'Hover, color change'), prop: t('background · color · 描边色', 'background · color · stroke color'), dur: <><Code>dur-2</Code> 150ms</>, curve: <Code>ease-out</Code> },
  { id: 'settle', scene: t('开关、分段、滑块落位', 'Switch, segmented, slider settling'), prop: 'translate', dur: '454ms', curve: <Code>spring</Code> },
  { id: 'menu-in', scene: t('菜单、下拉进场', 'Menu, dropdown enter'), prop: 'opacity + translateY 6px', dur: <><Code>dur-2</Code> 150ms</>, curve: <Code>ease-out</Code> },
  { id: 'menu-out', scene: t('菜单、下拉退场', 'Menu, dropdown exit'), prop: 'opacity + translateY 6px', dur: <><Code>dur-1</Code> 90ms</>, curve: <Code>ease-in</Code> },
  { id: 'menu-hl', scene: t('菜单高亮跟随', 'Menu highlight following'), prop: 'translate', dur: <><Code>dur-1</Code> 90ms</>, curve: <Code>ease-out</Code> },
  { id: 'tooltip', scene: t('文字提示进场 / 热切换', 'Tooltip enter / hot-swap'), prop: 'opacity + translate · scale', dur: '454ms / 325ms', curve: <><Code>spring</Code> / <Code>spring-snappy</Code></> },
  { id: 'float-in', scene: t('悬浮卡片进场（对话框、命令面板、抽屉、底部弹层、面板）', 'Floating card enter (dialog, command palette, drawer, bottom sheet, panel)'), prop: t('从触发点 scale .6 → 1，或贴边滑入 · 淡入 100ms', 'scale .6 → 1 from the trigger, or slide in from the edge · 100ms fade-in'), dur: <><Code>float-in-dur</Code> 303ms</>, curve: <><Code>float-in-ease</Code>{t('（= ', ' (= ')}<Code>spring-soft</Code>{t('）', ')')}</> },
  { id: 'float-out', scene: t('悬浮卡片退场', 'Floating card exit'), prop: t('transform · opacity · 遮罩一起', 'transform · opacity · scrim together'), dur: <><Code>float-out-dur</Code> 160ms</>, curve: <><Code>float-out-ease</Code>{t('（= ', ' (= ')}<Code>ease-in</Code>{t('）', ')')}</> },
  { id: 'height', scene: t('高度展开 / 折叠', 'Height expand / collapse'), prop: 'grid-template-rows', dur: t('587ms（折叠面板 391ms）', '587ms (accordion 391ms)'), curve: <><Code>spring-soft</Code>{t('（无过冲）', ' (no overshoot)')}</> },
  { id: 'layout', scene: t('布局位移', 'Layout shift'), prop: 'FLIP translate', dur: '454ms', curve: <Code>spring</Code> },
  { id: 'draw', scene: t('描线（对勾）', 'Stroke drawing (checkmark)'), prop: 'stroke-dashoffset', dur: <><Code>dur-3</Code> / <Code>dur-4</Code></>, curve: <Code>ease-out</Code> },
  { id: 'shake', scene: t('校验失败', 'Validation error'), prop: t('translateX 抖动', 'translateX shake'), dur: <><Code>dur-5</Code> 520ms</>, curve: <Code>ease-out</Code> },
  { id: 'theme', scene: t('深浅色切换', 'Light / dark switch'), prop: t('从点击处圆形揭开', 'Circular reveal from the click point'), dur: '520ms', curve: <Code>cubic-bezier(.4, 0, .2, 1)</Code> },
  { id: 'like', scene: t('点赞', 'Like'), prop: t('scale · rotate 关键帧', 'scale · rotate keyframes'), dur: <><Code>dur-6</Code> 800ms</>, curve: <Code>ease-out</Code> },
];
const motionCols = (t: Translate): TableColumn<MRow>[] => [
  { key: 'scene', header: t('场景', 'Scenario') },
  { key: 'prop', header: t('变化属性', 'Animated property') },
  { key: 'dur', header: t('时长', 'Duration'), render: (r) => r.dur },
  { key: 'curve', header: t('曲线', 'Curve'), render: (r) => r.curve },
];

const CODE = {
  zh: `/* 能用 CSS 过渡就用 CSS：时长和弹簧都是令牌，成对使用 */
.thing { transition: transform var(--ok-spring-dur) var(--ok-spring), opacity var(--ok-dur-2) var(--ok-ease-out); }

// 要量位置、或者由事件一次性触发的动画，才用脚本
import { animate, playFlip, usePresence } from 'oink-ui';
animate(node, [{ transform: 'scale(.6)' }, { transform: 'none' }], { spring: 'bouncy' });`,
  en: `/* Use CSS transitions whenever you can: durations and springs are tokens, used as pairs */
.thing { transition: transform var(--ok-spring-dur) var(--ok-spring), opacity var(--ok-dur-2) var(--ok-ease-out); }

// Reach for script only when you need to measure positions or play a one-off animation from an event
import { animate, playFlip, usePresence } from 'oink-ui';
animate(node, [{ transform: 'scale(.6)' }, { transform: 'none' }], { spring: 'bouncy' });`,
};

export default function MotionPage() {
  const t = useT();
  const linear = useClientValue(() => supportsLinear, false);
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '动效先求利落：高频操作 90–150ms，不回弹；位移落位用弹簧，起步快、落位软；明显的回弹只留给松手和少数强调时刻。所有时长都是令牌，并且乘了全局倍率 --ok-ms。',
        'Motion is crisp first: frequent actions take 90–150ms and never bounce; movement settles on springs that start fast and land softly; visible bounce is saved for releases and a few moments of emphasis. Every duration is a token, multiplied by the global multiplier --ok-ms.',
      )}
    >
      <DocSection title={t('原则', 'Principles')}>
        <ol className="f-motion-rules">
          {RULES.map((r) => <li key={r.key}><b>{t(r.title.zh, r.title.en)}</b><span>{t(r.text.zh, r.text.en)}</span></li>)}
        </ol>
      </DocSection>

      <DocSection title={t('时长', 'Durations')} description={t('六档。越小、越近、越频繁的变化用越短的档。点任意一行试播；用途一栏是库里组件实际的用法。', 'Six steps. The smaller, closer and more frequent the change, the shorter the step. Click any row to play it; the usage column reflects how the library’s components actually use it.')}>
        <Demo layout="block">
          {DURATIONS.map((d) => (
            <PlayRow key={d.token} name={d.token} detail={`${d.ms}ms · ${t(d.use.zh, d.use.en)}`} play={(el, from, to) => animate(el, slide(from, to), { duration: d.ms })} />
          ))}
        </Demo>
      </DocSection>

      <DocSection title={t('缓动与弹簧', 'Easings and springs')} description={t('四条贝塞尔负责颜色、淡入淡出和退场；五条弹簧负责位移与缩放。弹簧在 CSS 里是一个 linear() 缓动加一个配套的时长令牌（-dur），成对使用；不支持 linear() 的浏览器回退成一条近似的贝塞尔。点卡片试播。', 'Four Bézier curves handle color, fades and exits; five springs handle movement and scaling. In CSS a spring is a linear() easing plus a matching duration token (-dur), used as a pair; browsers without linear() fall back to an approximate Bézier. Click a card to play it.')}>
        <Demo layout="block"><Curves /></Demo>
        <div className="g-prose">
          {t(
            <p>CSS 里写 <Code>transition: transform var(--ok-spring-bouncy-dur) var(--ok-spring-bouncy)</Code>；脚本里写 <Code>{`animate(node, keyframes, { spring: 'bouncy' })`}</Code>。当前浏览器{linear ? '支持' : '不支持'} <Code>linear()</Code>。五个预设的刚度、阻尼和换算结果见 <Link to="/components/motion" className="g-link ok-focusable">动效工具</Link>。</p>,
            <p>In CSS, write <Code>transition: transform var(--ok-spring-bouncy-dur) var(--ok-spring-bouncy)</Code>; in script, write <Code>{`animate(node, keyframes, { spring: 'bouncy' })`}</Code>. This browser {linear ? 'supports' : 'does not support'} <Code>linear()</Code>. For the stiffness, damping and derived values of the five presets, see <Link to="/components/motion" className="g-link ok-focusable">Motion utilities</Link>.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('弹簧实验台', 'Spring playground')} description={t('调刚度、阻尼和质量，实时算出时长、过冲和可以直接粘贴的 linear() 缓动。上面一排是库的五个预设；松开滑块时播放一次。', 'Tune stiffness, damping and mass to get the duration, overshoot and a ready-to-paste linear() easing in real time. The row at the top holds the library’s five presets; releasing a slider plays it once.')}>
        <Demo layout="block"><Playground /></Demo>
      </DocSection>

      <DocSection title={t('六种基本动作', 'Six basic moves')} description={t('组件里的动效基本都是这六种动作的组合。每个都可以点。', 'Nearly every component animation is a combination of these six moves. Each one is clickable.')}>
        <div className="f-patterns">
          <Pattern title={t('① 按压回弹', '① Press and bounce')} desc={t('按下 90ms 缩到 .955；松开用 bouncy 弹簧弹回。按下时的回缩对带文字的控件也适用。', 'Pressing shrinks to .955 in 90ms; releasing springs back with the bouncy spring. The press shrink applies to controls with text too.')}>
            <Button variant="accent" size="lg">{t('按住我', 'Hold me')}</Button>
          </Pattern>
          <Pattern title={t('② 进场软，退场快', '② Soft in, quick out')} desc={t(<>进场用弹簧从 .8 放大、淡入；退场 150ms 加速离开。<Code>usePresence</Code> 等退场播完再卸载节点。</>, <>Enters by scaling up from .8 on a spring while fading in; exits by accelerating away in 150ms. <Code>usePresence</Code> waits for the exit to finish before unmounting the node.</>)}>
            <EnterExit />
          </Pattern>
          <Pattern title={t('③ 共享指示器', '③ Shared indicator')} desc={t('高亮块只有一个，在选项之间滑动，而不是各自淡入淡出。分段、标签页、导航、菜单的高亮都是这样。', 'There is only one highlight, sliding between options instead of each option fading in and out. Segmented controls, tabs, navigation and menu highlights all work this way.')}>
            <Dock />
          </Pattern>
          <Pattern title={t('④ 错峰', '④ Stagger')} desc={t(<>成组元素依次出现，间隔 26ms，顺序就是阅读顺序。用 <Code>animate()</Code> 的 delay。</>, <>Items in a group appear one after another, 26ms apart, in reading order. Use the delay option of <Code>animate()</Code>.</>)}>
            <Stagger />
          </Pattern>
          <Pattern title={t('⑤ 布局位移', '⑤ Layout shift')} desc={t(<>FLIP：元素从旧位置弹到新位置，看得见“它去哪了”。用 <Code>playFlip()</Code>。</>, <>FLIP: elements spring from their old position to the new one, so you can see where they went. Use <Code>playFlip()</Code>.</>)}>
            <Flip />
          </Pattern>
          <Pattern title={t('⑥ 描线', '⑥ Stroke drawing')} desc={t('对勾和加载尾巴都是画出来的：圆头描边沿路径生长。', 'Checkmarks and the loading tail are drawn: a round-capped stroke grows along the path.')}>
            <Draw />
          </Pattern>
        </div>
        <div className="g-prose">
          {t(
            <p>加载器和按钮加载状态里的那截尾巴（<Code>.ok-tail</Code>）可以整体换成别的图案：<Code>OinkProvider</Code> 的 <Code>tail</Code> 属性是全局替换，<Code>TailProvider</Code> 只换一块，见 <Link to="/guide/theming" className="g-link ok-focusable">主题 · 替换尾巴图案</Link>。</p>,
            <p>The tail in loaders and button loading states (<Code>.ok-tail</Code>) can be swapped for a different glyph: the <Code>tail</Code> prop on <Code>OinkProvider</Code> replaces it globally, and <Code>TailProvider</Code> replaces it for one block. See <Link to="/guide/theming" className="g-link ok-focusable">Theming · Replacing the tail glyph</Link>.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('悬浮卡片：一条进场，一条退场', 'Floating cards: one enter, one exit')} description={t('Dialog、confirm()、Drawer、Sheet、Panel、命令面板和 AppShell 的抽屉都是 FloatingCard。不管停在哪一侧、从触发点放大还是贴边滑入、宽屏还是手机，进退场都读同一组令牌，节奏完全一致。', 'Dialog, confirm(), Drawer, Sheet, Panel, the command palette and the AppShell drawer are all FloatingCards. Whichever side they dock to, whether they scale up from a trigger or slide in from an edge, on wide screens or phones, their enter and exit read the same tokens and share exactly the same rhythm.')}>
        <Table label={t('悬浮卡片的动效令牌', 'Floating card motion tokens')} columns={floatCols(t)} data={floatTokens(t)} rowKey="token" />
        <div className="g-prose">
          {t(
            <p>进场位移用 <Code>--ok-spring-soft</Code> 的曲线：没有过冲，贴边的抽屉、面板不会冲出边距再弹回来；时长 303ms（原来 454ms 的 2/3），起步更快。退场位移、透明度和遮罩一起在 160ms 内加速离开。手机宽度下只是滑入的距离缩短到三分之一，曲线和时长不变。脚本里同样的数值在 <Code>floatMotion</Code>（<Code>{'{ in: 303, fade: 100, out: 160 }'}</Code>），<Code>FloatingCard</Code> 用它算卸载的兜底时长。</p>,
            <p>The enter movement uses the <Code>--ok-spring-soft</Code> curve: no overshoot, so edge-docked drawers and panels never shoot past their margin and bounce back. It takes 303ms (2/3 of the previous 454ms) and starts faster. On exit, movement, opacity and the scrim accelerate away together within 160ms. At phone widths only the slide distance shrinks to a third; the curve and duration stay the same. The same values are available to scripts as <Code>floatMotion</Code> (<Code>{'{ in: 303, fade: 100, out: 160 }'}</Code>), which <Code>FloatingCard</Code> uses to compute its fallback unmount time.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('从触发点进场', 'Entering from the trigger')} description={t('居中的对话框、confirm() 和命令面板默认从打开它的地方放大出来（scale .6 → 1，spring-soft 曲线 303ms），关闭时缩回同一个点：用指针点开的从点按处，用键盘打开的从焦点所在元素的中心，用快捷键打开的从屏幕中心。', 'Centered dialogs, confirm() and the command palette scale up from wherever they were opened (scale .6 → 1, spring-soft curve, 303ms) and shrink back into the same point on close: from the tap point when opened with a pointer, from the center of the focused element when opened with the keyboard, and from the center of the screen when opened with a shortcut.')}>
        <Demo minHeight={140}><TriggerOrigin /></Demo>
        <div className="g-prose">
          {t(
            <p>传 <Code>origin="center"</Code> 或一个视口坐标可以改掉起点，见 <Link to="/components/dialog" className="g-link ok-focusable">Dialog</Link>。菜单、下拉这类锚定在按钮上的浮层不放大，只从按钮那一侧落下 6px 并淡入。</p>,
            <p>Pass <Code>origin="center"</Code> or a viewport coordinate to change the starting point; see <Link to="/components/dialog" className="g-link ok-focusable">Dialog</Link>. Overlays anchored to a button, such as menus and dropdowns, don’t scale; they just drop 6px from the button’s side and fade in.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('悬停与按压', 'Hover and press')} description={t('悬停只换颜色：底色、线色变深一档，不改字号、字重，带文字的元素也不位移。纯图形（色板、评分星星、滑块圆钮）可以轻微放大；按下时的回缩不受限制。', 'Hover only changes color: the fill or line darkens one step, size and weight stay the same, and elements with text don’t move. Pure graphics (swatches, rating stars, slider thumbs) may scale up slightly; the press shrink applies everywhere.')}>
        <Demo>
          <Button>{t('按钮', 'Button')}</Button>
          <Card interactive size="sm" className="f-hover-card">{t('可点击的卡片', 'Clickable card')}</Card>
          <ColorSwatches aria-label={t('示例色板', 'Example swatches')} defaultValue="a" colors={[{ value: 'a', color: 'var(--ok-accent)', label: t('强调色', 'Accent') }, { value: 'b', color: 'var(--ok-text)', label: t('墨', 'Ink') }, { value: 'c', color: 'var(--ok-success)', label: t('绿', 'Green') }]} />
          <Rating aria-label={t('示例评分', 'Example rating')} defaultValue={3} />
        </Demo>
        <div className="g-prose">
          {t(
            <p>悬停样式一律包在 <Code>@media (hover: hover)</Code> 里，触屏点按之后不会残留悬停态。</p>,
            <p>Hover styles are always wrapped in <Code>@media (hover: hover)</Code>, so no hover state lingers after a tap on a touch screen.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('减弱动效', 'Reduced motion')} description={t('系统开启“减弱动态效果”时，--ok-ms 变成 0：所有用时长令牌的过渡和 animate() 直接到位，循环的加载动画停下，打点加载改成淡入淡出。打开下面的开关就能看到效果（它改的是整站的设置，看完记得关掉）。', 'When the system’s “Reduce motion” setting is on, --ok-ms becomes 0: every transition that uses duration tokens, and every animate() call, jumps straight to the end; looping loaders stop, and dot loaders switch to a fade. Turn on the switch below to see it (it changes the setting for the whole site, so remember to turn it off afterwards).')}>
        <Demo layout="block"><ReducedMotion /></Demo>
        <div className="g-prose">
          {t(
            <p>组件和自己写的样式都不需要单独判断 <Code>prefers-reduced-motion</Code>：只要时长用令牌、脚本动画走 <Code>animate()</Code>，就会自动跟上。偏好有三种：<Code>auto</Code> 跟随系统、<Code>full</Code> 保留完整动效、<Code>reduced</Code> 强制减弱，由 <Code>OinkProvider</Code> 的 <Code>defaultMotion</Code> 和 <Code>useOink().setMotion</Code> 设置，见 <Link to="/guide/theming" className="g-link ok-focusable">主题 · 动效偏好</Link>。</p>,
            <p>Neither components nor your own styles need to check <Code>prefers-reduced-motion</Code>: as long as durations use tokens and scripted animations go through <Code>animate()</Code>, they follow automatically. There are three preferences: <Code>auto</Code> follows the system, <Code>full</Code> keeps full motion, <Code>reduced</Code> always reduces. Set them with <Code>defaultMotion</Code> on <Code>OinkProvider</Code> and <Code>useOink().setMotion</Code>; see <Link to="/guide/theming" className="g-link ok-focusable">Theming · Motion preference</Link>.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('动效对照表', 'Motion reference')} description={t('拿不准用哪条曲线时查这张表。数值取自库里组件的实际样式。', 'Check this table when you’re unsure which curve to use. Values come from the actual styles of the library’s components.')}>
        <Table label={t('动效对照表', 'Motion reference')} columns={motionCols(t)} data={motionRows(t)} rowKey="id" className="f-motion-table" />
      </DocSection>

      <DocSection title={t('在代码里用', 'Using it in code')} description={t('先用 CSS 过渡；需要量位置、或由事件一次性触发的动画再用脚本工具。', 'Start with CSS transitions; reach for the script utilities only when you need to measure positions or play a one-off animation from an event.')}>
        <CodeBlock code={t(CODE.zh, CODE.en)} language="tsx" />
        <div className="g-prose">
          {t(
            <p><Code>animate()</Code>、<Code>spring()</Code>、<Code>presets</Code>、<Code>playFlip()</Code> / <Code>flip()</Code>、<Code>usePresence</Code>、<Code>wait()</Code> 的用法和属性见 <Link to="/components/motion" className="g-link ok-focusable">动效工具</Link>。</p>,
            <p>For usage and options of <Code>animate()</Code>, <Code>spring()</Code>, <Code>presets</Code>, <Code>playFlip()</Code> / <Code>flip()</Code>, <Code>usePresence</Code> and <Code>wait()</Code>, see <Link to="/components/motion" className="g-link ok-focusable">Motion utilities</Link>.</p>,
          )}
        </div>
      </DocSection>
    </DocPage>
  );
}
