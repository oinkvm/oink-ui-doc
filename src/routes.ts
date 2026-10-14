import type { ComponentType } from 'react';
import { examples, pageTitle, pages } from './registry';
import { stripLang } from './router';
import type { Lang } from './router';

/**
 * 地址 → 要渲染的页面。每种页面一个代码块，跳转前先加载好（见 router 的 preload），
 * 渲染时同步从缓存里取，所以服务端渲染、注水、站内跳转都不需要 Suspense。
 */

export type RouteKind = 'home' | 'gallery' | 'doc' | 'example' | 'missing';
export interface Route {
  kind: RouteKind;
  /** 缓存键，也是源码路径（相对 src），预渲染时按它去构建清单里找样式和代码块 */
  file: string;
  title: string;
  description?: string;
  /** false：预渲染只出页面外壳（标题、样式、预载），正文在浏览器里渲染 */
  prerender?: boolean;
  load: () => Promise<{ default: ComponentType }>;
}

const SITE = 'Oink UI';
const TAGLINE = { zh: '柔和、平整、安静的 React 组件库。响应式、无障碍，深浅两套主题。', en: 'A soft, flat, quiet React component library. Responsive, accessible, with light and dark themes.' };

const loadHome = () => import('./home/Home').then((m) => ({ default: m.Home }));
const loadGallery = () => import('./gallery/Gallery').then((m) => ({ default: m.Gallery }));

export const exampleSlug = (path: string) => /^\/examples\/([^/?]+)/.exec(path)?.[1];

/** 逻辑路径（不带语言前缀）→ 路由；标题、描述按语言给 */
export function resolveRoute(path: string, lang: Lang = 'en'): Route {
  const en = lang === 'en';
  if (path === '/') {
    return { kind: 'home', file: 'home/Home.tsx', title: en ? `${SITE} · React component library` : `${SITE} · React 组件库`, description: TAGLINE[lang], load: loadHome };
  }
  if (path === '/components') {
    return {
      kind: 'gallery', file: 'gallery/Gallery.tsx', title: en ? `Components · ${SITE}` : `组件 · ${SITE}`,
      description: en ? 'Every component at a glance, grouped, with live previews.' : '全部组件一览，按分组排列，带实时预览。', load: loadGallery,
    };
  }
  const slug = exampleSlug(path);
  if (slug) {
    const ex = examples.find((e) => e.slug === slug);
    if (ex) {
      const title = en && ex.en ? ex.en.title : ex.title;
      return {
        kind: 'example', file: ex.file, title: en ? `${title} · ${SITE} example` : `${title} · ${SITE} 示例`,
        description: en && ex.en ? ex.en.description : ex.description, prerender: ex.prerender, load: ex.load,
      };
    }
  }
  const page = pages.find((p) => p.path === path);
  if (page) {
    const title = pageTitle(page, lang);
    return {
      kind: 'doc', file: page.file, title: `${title} · ${SITE}`,
      description: en ? `${title} · ${SITE} docs` : page.subtitle ? `${page.title}（${page.subtitle}）· ${SITE} 文档` : `${page.title} · ${SITE} 文档`,
      load: page.load,
    };
  }
  return { kind: 'missing', file: '', title: en ? `Page not found · ${SITE}` : `没有这个页面 · ${SITE}`, load: () => Promise.resolve({ default: () => null }) };
}

const cache = new Map<string, ComponentType>();

/** 预载某个地址的页面代码块（完整路径或逻辑路径都行） */
export function preloadRoute(path: string): Promise<ComponentType> {
  const route = resolveRoute(stripLang(path));
  const hit = cache.get(route.file);
  if (hit) return Promise.resolve(hit);
  return route.load().then((m) => { cache.set(route.file, m.default); return m.default; });
}

/** 已经加载好的页面组件；还没加载（只会在服务端忘了 preload 时发生）返回 undefined */
export function loadedRoute(path: string): ComponentType | undefined {
  return cache.get(resolveRoute(stripLang(path)).file);
}

/** 示例应用里自己的子页面，也预渲染 */
const EXAMPLE_SUBPATHS = ['/examples/analytics/customers'];

/** 所有要预渲染的逻辑地址（每种语言各一份） */
export function allPaths(): string[] {
  return ['/', '/components', ...pages.map((p) => p.path), ...examples.map((e) => `/examples/${e.slug}`), ...EXAMPLE_SUBPATHS];
}

export { SITE, TAGLINE };
