import { useEffect, useMemo, useRef, useState } from 'react';
import { CommandPalette, Icon, Kbd } from 'oink-ui';
import type { CommandItem } from 'oink-ui';
import { navigate, useLang, usePath } from './router';
import { groupLabel, pageSubtitle, pageTitle, pages } from './registry';
import { useT } from './i18n';
import type { PageMeta } from './registry';

/**
 * 全站搜索的面板：文档页、组件页，以及每页里的小节标题。
 * 顶栏的放大镜和快捷键在 SiteSearch 里；这个模块第一次要用时才加载，不进首屏包。
 */

// 页面源码只在第一次打开搜索时才加载，用来提取小节标题，不进首屏包
const pageSources = import.meta.glob<string>('./pages/**/*.tsx', { query: '?raw', import: 'default' });

interface Entry { file: string; meta: PageMeta }
const entries: Entry[] = pages.map((p) => ({ file: './' + p.file, meta: p }));

/** 跳转后把指定小节滚到视野里并聚焦，读屏会从这里开始读 */
function revealHeading(text: string) {
  let tries = 0;
  const tick = () => {
    const main = document.querySelector('.ok-shell__main') ?? document;
    const h = Array.from(main.querySelectorAll<HTMLElement>('h2, h3')).find((n) => n.textContent?.trim() === text);
    if (h) {
      h.setAttribute('tabindex', '-1');
      h.scrollIntoView({ block: 'start' });
      h.focus({ preventScroll: true });
      return;
    }
    if (++tries < 20) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * 从页面源码里提取小节标题。约定写法是 title={t('中文', 'English')}（见 i18n.tsx）；
 * 老的 title="中文" 也认，英文版就用同一个
 */
const SECTION_RE = /<DocSection\s+title=(?:"([^"]+)"|\{t\('((?:[^'\\]|\\.)*)',\s*'((?:[^'\\]|\\.)*)'\)\})/g;
const unescape = (v: string) => v.replace(/\\(.)/g, '$1');

function useSections(enabled: boolean) {
  const [sections, setSections] = useState<Array<{ file: string; zh: string; en: string }>>([]);
  useEffect(() => {
    if (!enabled || sections.length) return;
    let alive = true;
    Promise.all(
      entries.map(async ({ file }) => {
        const load = pageSources[file];
        if (!load) return [];
        const src = await load();
        return Array.from(src.matchAll(SECTION_RE), (m) => (m[1] ? { file, zh: m[1], en: m[1] } : { file, zh: unescape(m[2]), en: unescape(m[3]) }));
      }),
    ).then((all) => { if (alive) setSections(all.flat()); }).catch(() => {});
    return () => { alive = false; };
  }, [enabled, sections.length]);
  return sections;
}

export interface SearchPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  origin: 'trigger' | 'center';
}

export default function SearchPalette({ open, onOpenChange, origin }: SearchPaletteProps) {
  const [query, setQuery] = useState('');
  const [loadSections, setLoadSections] = useState(false);
  // 选中了某个小节：面板关完（退场动画结束）再把焦点交给那个标题，并且不让面板把焦点还回原处
  const pendingHeading = useRef<string | null>(null);
  const [jumping, setJumping] = useState(false);
  const sections = useSections(loadSections);
  const path = usePath();
  const lang = useLang();
  const t = useT();

  useEffect(() => { if (open) setLoadSections(true); }, [open]);

  const items = useMemo<CommandItem[]>(() => {
    const pageItems: CommandItem[] = entries.map(({ file, meta }) => ({
      id: 'page:' + file,
      label: pageTitle(meta, lang),
      description: pageSubtitle(meta, lang),
      group: meta.group === '开始' ? t('文档', 'Docs') : t('组件 · ', 'Components · ') + groupLabel(meta.group, lang),
      icon: <Icon name={meta.group === '开始' ? 'file' : 'grid'} />,
      // 两种语言的名字都能搜到
      keywords: [meta.path, meta.title, meta.subtitle ?? '', meta.en?.title ?? '', meta.group, groupLabel(meta.group, 'en')].filter(Boolean),
      onSelect: () => navigate(meta.path),
    }));
    const byFile = new Map(entries.map((e) => [e.file, e.meta]));
    const secs: CommandItem[] = sections.flatMap(({ file, zh, en }, i) => {
      const meta = byFile.get(file);
      if (!meta) return [];
      const title = lang === 'en' ? en : zh;
      return [{
        id: `sec:${i}:${file}`,
        label: title,
        description: pageTitle(meta, lang),
        group: t('页面小节', 'Sections'),
        icon: <Icon name="list" />,
        keywords: [pageTitle(meta, lang), pageSubtitle(meta, lang) ?? ''],
        onSelect: () => {
          if (path !== meta.path) navigate(meta.path);
          pendingHeading.current = title;
          setJumping(true);
        },
      }];
    });
    return [...pageItems, ...secs];
  }, [sections, path, lang, t]);

  // 空查询只列页面；输入后连小节一起搜。多个词之间是“且”
  const filter = (item: CommandItem, q: string) => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return item.id.startsWith('page:');
    const hay = [item.label, item.description, item.group, ...(item.keywords ?? [])].join(' ').toLowerCase();
    return words.every((w) => hay.includes(w));
  };

  return (
    <CommandPalette
      open={open}
      onOpenChange={(o) => { onOpenChange(o); if (!o) setQuery(''); else { pendingHeading.current = null; setJumping(false); } }}
      restoreFocus={!jumping}
      onExited={() => {
        const title = pendingHeading.current;
        pendingHeading.current = null;
        setJumping(false);
        if (title) revealHeading(title);
      }}
      origin={origin}
      items={items}
      query={query}
      onQueryChange={setQuery}
      filter={filter}
      label={t('搜索文档和组件', 'Search docs and components')}
      placeholder={t('搜索组件、指南或小节…', 'Search components, guides, sections…')}
      emptyText={query ? t(`没有找到“${query}”相关的内容`, `Nothing found for “${query}”`) : t('没有内容', 'Nothing here')}
      footer={<span className="site-search__foot"><Kbd>↑</Kbd><Kbd>↓</Kbd> {t('选择', 'select')} <Kbd>↵</Kbd> {t('打开', 'open')} <Kbd>esc</Kbd> {t('关闭', 'close')}</span>}
    />
  );
}
