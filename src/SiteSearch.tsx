import { Suspense, lazy, useEffect, useState } from 'react';
import { Icon, Tooltip } from 'oink-ui';
import { useT } from './i18n';
import './site-search.css';

/**
 * 全站搜索：文档页、组件页，以及每页里的小节标题。
 * ⌘K / Ctrl+K 在任何地方打开；不在输入框里时按 / 也能打开。
 * 面板本身（命令面板、页面索引）不进首屏包：页面空闲时在后台预载，指针移到放大镜上、或聚焦它时也会预载
 */

// 同一个加载过程只发起一次：空闲预载、悬停预载、真正打开都共用它；失败了清掉，下次重试
let palette: Promise<typeof import('./SearchPalette')> | null = null;
const loadPalette = () => (palette ??= import('./SearchPalette').catch((e) => { palette = null; throw e; }));
// 加载失败（多半是刚部署过，旧页面引用的文件已经不在）：整页刷新拿最新代码，不让懒加载的报错弄垮整个页面
const SearchPalette = lazy(() => loadPalette().catch(() => {
  window.location.reload();
  return new Promise<never>(() => {});
}));

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export function SiteSearch() {
  const t = useT();
  const [open, setOpen] = useState(false);
  // 从哪里放大进场：点放大镜从图标处出来；快捷键打开时焦点可能还停在某个按钮上，明确要求从屏幕中心出来
  const [origin, setOrigin] = useState<'trigger' | 'center'>('trigger');
  // 第一次要打开时才挂载面板（同时加载它的代码）
  const [wanted, setWanted] = useState(false);
  const show = (from: 'trigger' | 'center') => { setOrigin(from); setWanted(true); setOpen(true); };

  // 页面空闲下来就在后台把面板的代码取好：第一次按 ⌘K 不用等网络
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const run = () => { loadPalette().catch(() => {}); };
    if (w.requestIdleCallback) { const id = w.requestIdleCallback(run, { timeout: 4000 }); return () => w.cancelIdleCallback?.(id); }
    const t = window.setTimeout(run, 2000);
    return () => window.clearTimeout(t);
  }, []);

  // 快捷键：⌘K / Ctrl+K 开关；/ 在非输入状态下打开
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOrigin('center');
        setWanted(true);
        setOpen((o) => !o);
      } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        show('center');
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Tooltip content={t('搜索', 'Search')} shortcut={isMac ? '⌘K' : 'Ctrl K'}>
        <button
          type="button"
          className="site-search ok-btn ok-btn--ghost ok-btn--icon ok-focusable"
          aria-haspopup="dialog"
          aria-label={t('搜索文档和组件', 'Search docs and components')}
          aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
          onPointerEnter={() => { void loadPalette(); }}
          onFocus={() => { void loadPalette(); }}
          onClick={() => show('trigger')}
        >
          <Icon name="search" />
        </button>
      </Tooltip>
      {wanted && (
        <Suspense fallback={null}>
          <SearchPalette open={open} onOpenChange={setOpen} origin={origin} />
        </Suspense>
      )}
    </>
  );
}
