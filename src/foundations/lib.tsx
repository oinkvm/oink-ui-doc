import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ACCENTS, toast, useOink } from 'oink-ui';
import type { Accent } from 'oink-ui';
import type { Translate } from '../i18n';

/* 设计基础几页（色彩、字体、形状、动效）共用的小工具。色值一律在运行时从 --ok-* 令牌读出来，不写死 */

const hex2 = (n: number) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, '0').toUpperCase();

/** 把 getComputedStyle 给的颜色（rgb() / rgba() / color(srgb …)）写成 #RRGGBB；带透明度时另给 alpha */
export function parseColor(raw: string): { hex: string; alpha: number } {
  const nums = raw.match(/-?\d*\.?\d+(?:e-?\d+)?/g)?.map(Number) ?? [];
  if (nums.length < 3) return { hex: raw, alpha: 1 };
  const srgb = raw.startsWith('color(');
  const [r, g, b] = nums.slice(0, 3).map((v) => (srgb ? v * 255 : v));
  const alpha = nums.length > 3 ? nums[3] : 1;
  return { hex: '#' + hex2(r) + hex2(g) + hex2(b), alpha };
}
/** “#1B1C22” 或 “#1B1C22 · 7%” */
export const formatColor = (raw: string) => {
  const { hex, alpha } = parseColor(raw);
  return alpha < 1 ? `${hex} · ${Math.round(alpha * 100)}%` : hex;
};

let probe: HTMLElement | null = null;
/**
 * 令牌在当前主题下的计算值（#RRGGBB，半透明的附百分比）。
 * 用一个隐藏的探针元素读 background-color，color-mix() 之类的结果由浏览器算好；
 * 传 accent 时探针自己带 data-accent，读的就是那一种强调色
 */
export function tokenColor(name: string, accent?: Accent): string {
  if (typeof document === 'undefined') return '';
  if (!probe) {
    probe = document.createElement('i');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    document.body.appendChild(probe);
  }
  if (accent) probe.dataset.accent = accent; else delete probe.dataset.accent;
  probe.style.backgroundColor = `var(--ok-${name})`;
  return formatColor(getComputedStyle(probe).backgroundColor);
}

/**
 * <html> 的 data-theme / data-accent / data-motion 一变就加一：读计算值的地方拿它当依赖。
 * OinkProvider 在自己的 effect 里才写这些属性（晚于子组件的 effect），所以不能只依赖 useOink() 的值
 */
export function useThemeVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const mo = new MutationObserver(() => setV((n) => n + 1));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-accent', 'data-motion', 'style'] });
    return () => mo.disconnect();
  }, []);
  return v;
}

/** 一组颜色令牌的当前值：{ bg: '#F9F9FB', line: '#1B1C22 · 7%', … } */
export function useTokenColors(names: string[]): Record<string, string> {
  const v = useThemeVersion();
  const [map, setMap] = useState<Record<string, string>>({});
  const key = names.join(',');
  useEffect(() => {
    setMap(Object.fromEntries(names.map((n) => [n, tokenColor(n)])));
  }, [v, key]);   // eslint-disable-line react-hooks/exhaustive-deps
  return map;
}

/** 五种预设强调色各自的 --ok-accent（给 ColorSwatches 用） */
export function useAccentColors(): Partial<Record<Accent, string>> {
  const v = useThemeVersion();
  const [map, setMap] = useState<Partial<Record<Accent, string>>>({});
  useEffect(() => { setMap(Object.fromEntries(ACCENTS.map((a) => [a, tokenColor('accent', a)]))); }, [v]);
  return map;
}

/** 一组长度令牌在当前环境下的像素值（触屏、窄屏时会变） */
export function useTokenPx(names: string[], prop: 'height' | 'width' = 'height'): Record<string, number> {
  const v = useThemeVersion();
  const [map, setMap] = useState<Record<string, number>>({});
  const key = names.join(',');
  useEffect(() => {
    const read = () => {
      const el = document.createElement('div');
      el.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;width:0;height:0';
      document.body.appendChild(el);
      const out: Record<string, number> = {};
      names.forEach((n) => { el.style[prop] = `var(--ok-${n})`; out[n] = Math.round(el.getBoundingClientRect()[prop] * 10) / 10; });
      el.remove();
      setMap(out);
    };
    read();
    // 视口跨过手机宽度、指针类型变化时，控件高度、标题字号会跟着变
    const mqs = [matchMedia('(max-width: 519.98px)'), matchMedia('(pointer: coarse)')];
    mqs.forEach((m) => m.addEventListener('change', read));
    return () => mqs.forEach((m) => m.removeEventListener('change', read));
  }, [v, key, prop]);   // eslint-disable-line react-hooks/exhaustive-deps
  return map;
}

/* ---------------------------------------------------------------- 对比度 */
export function luminance(hex: string) {
  const n = parseInt(hex.slice(1, 7), 16);
  if (!Number.isFinite(n)) return 0;
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map((c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
export function contrast(a?: string, b?: string) {
  if (!a || !b) return '…';
  const x = luminance(a), y = luminance(b);
  return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(1);
}

/* ---------------------------------------------------------------- 复制 */
/** 复制到剪贴板并弹通知。t 由调用方的 useT() 传进来（这里在事件处理里跑，不能用 hook） */
export function copy(text: string, t: Translate, label?: string) {
  const done = () => toast.success({ title: t('已复制', 'Copied'), description: label || text, duration: 1800 });
  const fail = () => toast.danger({ title: t('复制失败', 'Couldn’t copy'), description: t('请手动选择文本复制。', 'Please select the text and copy it manually.') });
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fail);
  else fail();
}

/** 只在某套主题下出现的一段文字（按 useOink().resolvedTheme 选，不靠样式隐藏） */
export function OnlyTheme({ theme, children }: { theme: 'light' | 'dark'; children: ReactNode }) {
  return useOink().resolvedTheme === theme ? <>{children}</> : null;
}
