import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useMediaQuery, useOink } from 'oink-ui';

/*
 * 预览的播放控制：
 * · 只播放视口里的卡片（一个共用的 IntersectionObserver），离开视口暂停；页面不可见时全部暂停
 * · 减弱动效时（data-motion="reduced"，或系统设置且没有强制 full）停在每个预览自己指定的静止帧
 * · 计时器驱动：useStep 按每一步的时长推进，暂停时停在当前步；CSS 动画由 data-play 控制播放 / 暂停
 * · 各卡片按序号错开相位，不会整页一起动
 */

interface LoopState { playing: boolean; still: boolean; phase: number }
const LoopCtx = createContext<LoopState>({ playing: false, still: true, phase: 0 });

/* —— 页面可见性 —— */
const subscribeVisibility = (cb: () => void) => { document.addEventListener('visibilitychange', cb); return () => document.removeEventListener('visibilitychange', cb); };
const readVisibility = () => document.visibilityState === 'visible';
function usePageVisible(): boolean { return useSyncExternalStore(subscribeVisibility, readVisibility, () => false); }

/* —— 减弱动效：与 tokens.css 的规则一致 —— */
export function useStillMotion(): boolean {
  const { motion } = useOink();
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return motion === 'reduced' || (motion === 'auto' && prefersReduced);
}

/* —— 共用的视口观察器 —— */
type Listener = (inView: boolean, near: boolean) => void;
const listeners = new Map<Element, Listener>();
let inViewIO: IntersectionObserver | null = null;
let nearIO: IntersectionObserver | null = null;
const nearState = new WeakMap<Element, boolean>();
const viewState = new WeakMap<Element, boolean>();

function observe(el: Element, fn: Listener) {
  if (typeof IntersectionObserver === 'undefined') { fn(true, true); return () => {}; }
  // 视口内才播放；提前 400px 挂载内容，滚到时已经画好
  inViewIO ??= new IntersectionObserver((entries) => {
    for (const e of entries) { viewState.set(e.target, e.isIntersecting); listeners.get(e.target)?.(e.isIntersecting, nearState.get(e.target) ?? false); }
  });
  nearIO ??= new IntersectionObserver((entries) => {
    for (const e of entries) { nearState.set(e.target, e.isIntersecting); listeners.get(e.target)?.(viewState.get(e.target) ?? false, e.isIntersecting); }
  }, { rootMargin: '400px 0px' });
  listeners.set(el, fn);
  inViewIO.observe(el);
  nearIO.observe(el);
  return () => { listeners.delete(el); inViewIO?.unobserve(el); nearIO?.unobserve(el); };
}

/** 预览的外框：对读屏隐藏、不可聚焦、不响应指针；负责决定播不播 */
export function PreviewFrame({ index, children }: { index: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);
  const visible = usePageVisible();
  const still = useStillMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, (view, near) => { setInView(view); if (near || view) setMounted(true); });
  }, []);

  // 相位：按序号散开，避开整数倍，相邻卡片不会同时换帧
  const phase = (index * 613) % 2400;
  const playing = inView && visible && !still;
  const style = { '--phase': `${-phase}ms` } as CSSProperties;

  return (
    <div
      ref={ref}
      className="gal-pv"
      data-play={playing ? 'true' : 'false'}
      data-still={still ? 'true' : undefined}
      aria-hidden="true"
      // React 18 不认识 inert 布尔属性，用空字符串写成 HTML 属性
      {...({ inert: '' } as object)}
      style={style}
    >
      <LoopCtx.Provider value={{ playing, still, phase }}>{mounted ? children : null}</LoopCtx.Provider>
    </div>
  );
}

/**
 * 计时器驱动的步进：返回当前是第几步。
 * durations：每一步停留多久（毫秒）；传一个数字表示每步一样长。
 * still：减弱动效时停在哪一步（同时也是初始帧）。
 */
export function useStep(durations: number | number[], still = 0): number {
  const { playing, still: isStill, phase } = useContext(LoopCtx);
  const list = typeof durations === 'number' ? [durations] : durations;
  const count = typeof durations === 'number' ? Infinity : list.length;
  const key = list.join(',');
  const [step, setStep] = useState(still);
  const started = useRef(false);

  useEffect(() => {
    if (!playing) return;
    let timer = 0;
    let current = step;
    const wait = (s: number) => list[typeof durations === 'number' ? 0 : s % list.length];
    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        current = count === Infinity ? current + 1 : (current + 1) % count;
        setStep(current);
        schedule(wait(current));
      }, delay);
    };
    // 第一次开始时多等一个相位，错开各卡片
    schedule(wait(current) + (started.current ? 0 : phase));
    started.current = true;
    return () => window.clearTimeout(timer);
    // step 只取开始时的值；之后由计时器自己推进
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, key, phase, count]);

  return isStill ? still : step;
}

/** 在一串值里按步取值：cycle(['a','b'], step) */
export const pick = <T,>(list: readonly T[], step: number): T => list[((step % list.length) + list.length) % list.length];
