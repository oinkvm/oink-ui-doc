import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import { langOf, setServerPath, stripLang, withLang } from './router';
import { allPaths, preloadRoute, resolveRoute } from './routes';

/** 构建时预渲染用（scripts/prerender.mjs）：把一个完整地址（可以带 /zh 前缀）渲染成 HTML 字符串 */
export async function render(path: string): Promise<string> {
  setServerPath(path);
  await preloadRoute(path);
  return renderToString(<StrictMode><App /></StrictMode>);
}

export { allPaths, langOf, resolveRoute, stripLang, withLang };
