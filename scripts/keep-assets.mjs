/**
 * 部署前：把以前构建出的带哈希的资源也放进这次的 dist/assets。
 *
 * Cloudflare Pages 的每次部署只包含这次上传的文件。部署之前打开的标签页里还是旧代码，
 * 之后按需加载代码块（换页、第一次打开搜索）会去要旧文件名，旧文件不在了就是 404。
 * 文件名带内容哈希、内容永不变，所以把最近一段时间构建过的资源都留着一起上传：旧页面照常加载，
 * 新页面用不到它们。上传按内容去重，已经传过的文件不会重复传。
 *
 * 资源存档在 apps/site/.asset-archive（不进版本库），超过 KEEP_DAYS 天没再出现的文件会被清掉。
 */
import { copyFile, mkdir, readdir, stat, unlink, utimes } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEEP_DAYS = 30;
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const assets = resolve(root, 'dist/assets');
const archive = resolve(root, '.asset-archive');
await mkdir(archive, { recursive: true });

const now = new Date();
const current = new Set(await readdir(assets));
// 这次的资源存进存档，并刷新时间（还在用的文件不会过期）
for (const f of current) {
  await copyFile(join(assets, f), join(archive, f));
  await utimes(join(archive, f), now, now);
}
let restored = 0, pruned = 0;
for (const f of await readdir(archive)) {
  if (current.has(f)) continue;
  const p = join(archive, f);
  if ((now.getTime() - (await stat(p)).mtimeMs) / 86400000 > KEEP_DAYS) { await unlink(p); pruned++; continue; }
  await copyFile(p, join(assets, f));
  restored++;
}
console.log(`保留旧资源 ${restored} 个，清掉过期的 ${pruned} 个`);
