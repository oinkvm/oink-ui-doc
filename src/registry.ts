import type { ComponentType } from 'react';

export interface PageMeta {
  /** 路由，如 /components/button */
  path: string;
  /** 中文标题。组件页是中英双语：英文名在前、中文在后（Button 按钮）；一页多个组件时英文可以省略、中文做概括 */
  title: string;
  /** 英文版的标题、副标题（只有英文）。不写时英文版沿用中文的 */
  en?: { title: string; subtitle?: string };
  /** 侧栏分组：开始 / 基础 / 布局 / 表单与操作 / 数据展示 / 导航 / 反馈 / 浮层 */
  group: string;
  /** 组内排序，小的在前 */
  order?: number;
  /** 英文名或一句话副标题 */
  subtitle?: string;
}
export interface ExampleMeta {
  slug: string;
  title: string;
  /** 领域，如“项目协作”“电商后台” */
  domain: string;
  description: string;
  /** 英文版 */
  en?: { title: string; domain: string; description: string };
  order?: number;
  /** false：不预渲染正文，只在浏览器里渲染。内容取决于访问时刻或时区（比如按当前时间排的收件时间）时用 */
  prerender?: boolean;
}

type Loader = () => Promise<{ default: ComponentType }>;

/*
 * 页面只把 meta 打进首屏包（?meta 由 vite.config 里的插件从源码里单独抽出来），
 * 页面本身按需加载，每页一个代码块。
 */
// 文档页：src/pages 下任何导出了 meta + default 的 tsx 都会自动进侧栏
const pageMetas = import.meta.glob<PageMeta | null>('./pages/**/*.tsx', { eager: true, query: '?meta', import: 'default' });
const pageLoaders = import.meta.glob<{ default: ComponentType }>('./pages/**/*.tsx');
// 示例应用：src/examples/<名字>/index.tsx
const exampleMetas = import.meta.glob<ExampleMeta | null>('./examples/*/index.tsx', { eager: true, query: '?meta', import: 'default' });
const exampleLoaders = import.meta.glob<{ default: ComponentType }>('./examples/*/index.tsx');

export const GROUP_ORDER = ['开始', '基础', '布局', '表单与操作', '数据展示', '导航', '反馈', '浮层'];
/** 分组在英文版里的名字（分组名本身是中文，做键用） */
export const GROUP_EN: Record<string, string> = {
  开始: 'Get started', 基础: 'Foundations', 布局: 'Layout', 表单与操作: 'Forms & actions',
  数据展示: 'Data display', 导航: 'Navigation', 反馈: 'Feedback', 浮层: 'Overlays',
};
export const groupLabel = (group: string, lang: 'zh' | 'en') => (lang === 'en' ? GROUP_EN[group] ?? group : group);
/** 页面在某种语言下的标题 / 副标题 */
export const pageTitle = (p: PageMeta, lang: 'zh' | 'en') => (lang === 'en' && p.en ? p.en.title : p.title);
/** 英文版没单独写副标题时沿用中文版的（组件页的副标题本来就是英文组件名），和标题重复就不显示 */
export const pageSubtitle = (p: PageMeta, lang: 'zh' | 'en') => {
  if (lang !== 'en' || !p.en) return p.subtitle;
  const sub = p.en.subtitle ?? p.subtitle;
  return sub && sub !== p.en.title ? sub : undefined;
};

/** file 是源码路径（相对 src），预渲染时用它去构建清单里找这一页的样式和代码块 */
export const pages = Object.entries(pageMetas)
  .filter((e): e is [string, PageMeta] => !!e[1])
  .map(([file, meta]) => ({ ...meta, file: file.slice(2), load: pageLoaders[file] as Loader }))
  .sort((a, b) => (a.order ?? 100) - (b.order ?? 100) || a.title.localeCompare(b.title, 'zh-CN'));

export const examples = Object.entries(exampleMetas)
  .filter((e): e is [string, ExampleMeta] => !!e[1])
  .map(([file, meta]) => ({ ...meta, file: file.slice(2), load: exampleLoaders[file] as Loader }))
  .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));

export const pageGroups = GROUP_ORDER
  .map((group) => ({ group, items: pages.filter((p) => p.group === group) }))
  .filter((g) => g.items.length);
