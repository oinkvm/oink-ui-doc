import { useSyncExternalStore } from 'react';
import type { AnchorHTMLAttributes } from 'react';

/**
 * 极简路径路由：/components/button。每个地址都有构建时预渲染好的 HTML，直接打开就有内容。
 * 站内跳转不整页刷新：先把目标页的代码块加载好，再切换地址、渲染新页面，中间不闪空白。
 *
 * 两种语言：英文在根路径下（/components/button），中文加 /zh 前缀（/zh/components/button）。
 * usePath() 给的是去掉语言前缀的“逻辑路径”，useLang() 给语言；href() / navigate() / <Link> 自动带上当前语言的前缀。
 */

export type Lang = 'zh' | 'en';
const ZH_PREFIX = /^\/zh(?=\/|$)/;
/** 完整路径属于哪种语言 */
export const langOf = (full: string): Lang => (ZH_PREFIX.test(full) ? 'zh' : 'en');
/** 去掉语言前缀 */
export const stripLang = (full: string) => full.replace(ZH_PREFIX, '') || '/';
/** 逻辑路径加上某种语言的前缀 */
export const withLang = (path: string, lang: Lang) => (lang === 'zh' ? (path === '/' ? '/zh' : '/zh' + path) : path);
/** 记住用户手动选的语言（index.html 里的脚本据此决定要不要跳到另一种语言） */
export const LANG_KEY = 'oink-lang';

type Preload = (path: string) => Promise<unknown>;

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';
const fromLocation = () => normalize(window.location.pathname);

/** 服务端渲染时由 entry-server 设置 */
let serverPath = '/';
export function setServerPath(path: string) { serverPath = normalize(path); }

let current = typeof window === 'undefined' ? '/' : fromLocation();
let preload: Preload = () => Promise.resolve();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const full = () => (typeof window === 'undefined' ? serverPath : current);
const readPath = () => stripLang(current);
const readPathServer = () => stripLang(full());
const readLang = () => langOf(current);
const readLangServer = () => langOf(full());

/** 当前完整路径（带语言前缀，浏览器端） */
export const currentPath = () => current;

/** 当前的逻辑路径（不带语言前缀） */
export function usePath(): string { return useSyncExternalStore(subscribe, readPath, readPathServer); }
/** 当前语言 */
export function useLang(): Lang { return useSyncExternalStore(subscribe, readLang, readLangServer); }
/** 逻辑路径 → 当前语言下的地址 */
export const href = (path: string) => withLang(path, langOf(full()));

/** 跳转序号：连点两个链接时，只有最后一次的页面加载完才生效 */
let seq = 0;
async function go(path: string, push: boolean, url = path) {
  const target = normalize(path);
  const mine = ++seq;
  try {
    await preload(target);
  } catch {
    // 代码块加载失败：多半是刚部署过，这个标签页里的旧代码引用的文件已经不在了（或者网络断了）。
    // 改成整页加载，拿到最新的 HTML 和代码；前进后退时地址已经变了，直接刷新
    if (mine !== seq) return;
    if (push) window.location.assign(url); else window.location.reload();
    return;
  }
  if (mine !== seq) return;
  if (push) window.history.pushState(null, '', url);
  const changed = target !== current;
  current = target;
  if (changed) emit();
  if (url.includes('#')) {
    const el = document.getElementById(decodeURIComponent(url.split('#')[1]));
    el?.scrollIntoView();
  }
}

/** 跳到逻辑路径（自动带上当前语言的前缀） */
export function navigate(path: string) { const url = href(path); void go(url.split(/[?#]/)[0], true, url); }

/** 换语言：同一页的另一种语言版本，并记住选择 */
export function switchLang(lang: Lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch { /* 隐私模式 */ }
  const url = withLang(stripLang(current), lang) + window.location.search + window.location.hash;
  void go(url.split(/[?#]/)[0], true, url);
}

/** 站内链接：同源、普通左键、没有新窗口和下载属性，拦下来走客户端跳转 */
function onClick(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = (e.target as Element | null)?.closest?.('a');
  if (!a || !a.hasAttribute('href') || a.hasAttribute('download')) return;
  if (a.target && a.target !== '_self') return;
  const raw = a.getAttribute('href') ?? '';
  if (raw.startsWith('#')) return;
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin || /\.[a-z0-9]+$/i.test(url.pathname)) return;
  // 同一页里的锚点：交给浏览器滚动
  if (normalize(url.pathname) === current && url.hash) return;
  e.preventDefault();
  void go(url.pathname, true, url.pathname + url.search + url.hash);
}

/** 浏览器端启动：接管链接点击和前进后退 */
export function startRouter(fn: Preload) {
  preload = fn;
  current = fromLocation();
  document.addEventListener('click', onClick);
  window.addEventListener('popstate', () => { void go(fromLocation(), false, window.location.pathname + window.location.search + window.location.hash); });
}

export function Link({ to, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={href(to)} {...rest} />;
}
