import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * `页面.tsx?meta`：只取出源码里 `export const meta = {...}` 那个对象字面量，不带页面本身和它的依赖。
 * 侧栏、搜索、路由表要知道全部页面，但首屏包里只该有这几行元数据，页面代码按需加载。
 * meta 必须是纯字面量（字符串、数字），不能引用别的变量。
 */
function pageMeta(): Plugin {
  return {
    name: 'oink-page-meta',
    enforce: 'pre',
    load(id) {
      const [file, query] = id.split('?');
      if (query !== 'meta') return;
      this.addWatchFile(file);
      const src = readFileSync(file, 'utf8');
      const head = /export const meta(?:\s*:\s*\w+)?\s*=\s*\{/.exec(src);
      if (!head) return 'export default null;';
      const start = head.index + head[0].length - 1;
      let depth = 0;
      let quote = '';
      for (let i = start; i < src.length; i++) {
        const c = src[i];
        if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
        if (c === '"' || c === "'" || c === '`') quote = c;
        else if (c === '{') depth++;
        else if (c === '}' && --depth === 0) return `export default ${src.slice(start, i + 1)};`;
      }
      this.error(`${file}: meta 对象没有闭合`);
    },
  };
}

/**
 * 库默认用 node_modules 里的 oink-ui 包。同时在改库的时候，设 OINK_UI_SRC 指向库的 src 目录
 * （npm run dev:src，默认 ../oink-ui/src），直接用源码、改组件不用先构建发布
 */
const librarySrc = process.env.OINK_UI_SRC ? resolve(process.env.OINK_UI_SRC) : null;

export default defineConfig({
  plugins: [pageMeta(), react()],
  base: '/',
  resolve: {
    alias: librarySrc
      ? [
          { find: /^oink-ui\/styles\.css$/, replacement: resolve(librarySrc, 'styles.css') },
          { find: /^oink-ui$/, replacement: resolve(librarySrc, 'index.ts') },
        ]
      : [],
  },
  build: {
    // 预渲染脚本按它找每一页要预载的样式和代码块
    manifest: true,
    target: 'es2020',
  },
  // 服务端渲染包里把库一起打进去：用源码别名时它不在 node_modules 里
  ssr: { noExternal: ['oink-ui'] },
  server: { host: '127.0.0.1' },
});
