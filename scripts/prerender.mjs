/**
 * 构建时预渲染：把每个地址渲染成完整的 HTML，写进 dist。
 * 先跑 `vite build`（浏览器包 + 清单），再跑 `vite build --ssr`（渲染函数），最后跑这个脚本。
 *
 * 每页的 HTML 里有：渲染好的正文、这一页的标题和描述、这一页按需加载的样式（直接 <link>，避免闪无样式内容）
 * 和代码块（modulepreload，Cloudflare 会据此发 103 Early Hints）。
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'https://oink-ui.hachiwii.com';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const serverDir = resolve(root, 'dist-server');

const { render, allPaths, resolveRoute, langOf, stripLang, withLang } = await import(resolve(serverDir, 'entry-server.js'));
const template = await readFile(resolve(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(resolve(dist, '.vite/manifest.json'), 'utf8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** 一个源码模块连同它的静态依赖要用到的 js 和 css（不含动态 import 的） */
function collect(key, out = { js: new Set(), css: new Set() }, seen = new Set()) {
  if (seen.has(key)) return out;
  seen.add(key);
  const chunk = manifest[key];
  if (!chunk) return out;
  out.js.add(chunk.file);
  chunk.css?.forEach((c) => out.css.add(c));
  chunk.imports?.forEach((k) => collect(k, out, seen));
  return out;
}
// 入口已经在 index.html 里了，每页只补它没有的
const base = collect('index.html');

/** 标题、描述、预载代码块：放在 <!--head--> 处 */
function headFor(path, route) {
  const tags = [];
  const url = ORIGIN + (path === '/' ? '/' : path);
  if (route.description) tags.push(`<meta name="description" content="${esc(route.description)}">`);
  if (route.kind !== 'missing') {
    tags.push(`<link rel="canonical" href="${url}">`);
    // 两种语言互相指向；其它语言的访客默认看英文
    const logical = stripLang(path);
    const zh = ORIGIN + withLang(logical, 'zh'), en = ORIGIN + withLang(logical, 'en');
    tags.push(`<link rel="alternate" hreflang="zh-CN" href="${zh}">`, `<link rel="alternate" hreflang="en" href="${en}">`, `<link rel="alternate" hreflang="x-default" href="${en}">`);
  }
  tags.push(
    `<meta property="og:locale" content="${langOf(path) === 'en' ? 'en_US' : 'zh_CN'}">`,
    `<meta property="og:site_name" content="Oink UI">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(route.title)}">`,
  );
  if (route.description) tags.push(`<meta property="og:description" content="${esc(route.description)}">`);
  if (route.kind !== 'missing') tags.push(`<meta property="og:url" content="${url}">`);
  if (route.file) {
    for (const j of collect('src/' + route.file).js) if (!base.js.has(j)) tags.push(`<link rel="modulepreload" crossorigin href="/${j}">`);
  }
  return tags.join('\n  ');
}

/** 这一页自己的样式：放在 </head> 前，排在入口样式之后，层叠顺序和浏览器端按需加载时一致 */
function stylesFor(route) {
  if (!route.file) return '';
  return [...collect('src/' + route.file).css].filter((c) => !base.css.has(c))
    .map((c) => `  <link rel="stylesheet" crossorigin href="/${c}">\n`).join('');
}

/** path 是完整地址（带不带 /zh 前缀都行） */
async function page(path, outFile) {
  const lang = langOf(path);
  const route = resolveRoute(stripLang(path), lang);
  // 不预渲染正文的页面：根节点留空、不带 data-path，浏览器端直接渲染
  const body = route.prerender === false
    ? '<div id="root"></div>'
    : `<div id="root" data-path="${esc(path)}">${await render(path)}</div>`;
  const doc = template
    .replace('<html lang="en">', `<html lang="${lang === 'en' ? 'en' : 'zh-CN'}">`)
    .replace(/<title>.*?<\/title>/, `<title>${esc(route.title)}</title>`)
    .replace('<!--head-->', headFor(path, route))
    .replace('</head>', `${stylesFor(route)}</head>`)
    .replace('<div id="root"><!--app--></div>', body);
  const file = resolve(dist, outFile);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, doc);
  return { path, bytes: Buffer.byteLength(doc) };
}

// 每个逻辑地址各渲染英文、中文两份：/components/button 和 /zh/components/button
const paths = allPaths().flatMap((p) => [withLang(p, 'zh'), withLang(p, 'en')]);
const results = [];
for (const path of paths) {
  // /components → components.html、/zh → zh.html：Cloudflare Pages 用不带斜杠的干净地址提供它们
  results.push(await page(path, path === '/' ? 'index.html' : `${path.slice(1)}.html`));
}
// 找不到的地址：Pages 用离它最近的 404.html，中文前缀下的用中文的
results.push(await page('/404', '404.html'));
results.push(await page('/zh/404', 'zh/404.html'));

const today = new Date().toISOString().slice(0, 10);
await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${ORIGIN}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);

// 清单和服务端包只是构建中间产物，不上线
await rm(resolve(dist, '.vite'), { recursive: true, force: true });
await rm(serverDir, { recursive: true, force: true });

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log(`预渲染 ${results.length} 页，最大 ${kb(Math.max(...results.map((r) => r.bytes)))}`);
