import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { currentPath, startRouter } from './router';
import { preloadRoute } from './routes';

const el = document.getElementById('root')!;
startRouter(preloadRoute);
const app = <StrictMode><App /></StrictMode>;

const RELOAD_KEY = 'oink-reloaded';
const session = {
  get: () => { try { return sessionStorage.getItem(RELOAD_KEY); } catch { return null; } },
  set: (v: string | null) => { try { if (v) sessionStorage.setItem(RELOAD_KEY, v); else sessionStorage.removeItem(RELOAD_KEY); } catch { /* 隐私模式 */ } },
};

// 先把当前页的代码块加载好（预渲染的 HTML 里已经 modulepreload，通常已在缓存里），再注水
preloadRoute(currentPath()).then(() => {
  session.set(null);
  // 预渲染的就是这个地址：注水，接管现成的 DOM。否则（开发服务器、404 页、没有预渲染的地址）直接渲染
  if (el.dataset.path === currentPath() && el.firstElementChild) {
    (window as Window & { __hydrated?: string }).__hydrated = 'hydrate';
    hydrateRoot(el, app, {
      // 注水对不上时 React 会自己改用客户端渲染兜底；?debug 时记下来，排查用
      onRecoverableError: (err) => {
        if (!import.meta.env.DEV && !/[?&]debug/.test(location.search)) return;
        console.warn('[hydrate]', err);
        const w = window as Window & { __hydrateErrors?: string[] };
        (w.__hydrateErrors ??= []).push(String((err as Error)?.message ?? err));
      },
    });
  } else {
    (window as Window & { __hydrated?: string }).__hydrated = 'render';
    el.textContent = '';
    createRoot(el).render(app);
  }
}, () => {
  // 代码块没加载到（刚部署完的几秒里，或者网络断了）：不注水，预渲染的静态内容照常可读；
  // 同一个地址只自动重新加载一次，免得网络断着时来回刷新
  if (session.get() === currentPath()) return;
  session.set(currentPath());
  window.location.reload();
});
