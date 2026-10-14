import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ACCENTS, ColorPicker, DropdownMenu, Icon, MenuRadioGroup, MenuRadioItem, OinkLogo, Popover, isCustomAccent, logoSnoutColors, normalizeAccent, useOink } from 'oink-ui';
import { SiteSearch } from './SiteSearch';
import type { Accent, ThemeMode, AccentPreset } from 'oink-ui';
import { Link, switchLang, useLang } from './router';
import type { Lang } from './router';
import { useT } from './i18n';

/* 站点外壳里首页和文档页共用的几块：品牌、顶栏链接、主题切换、强调色、主题同步 */

export const STORAGE_KEY = 'oink-site';

export const ACCENT_LABEL: Record<AccentPreset, string> = { pink: '粉色', orange: '橙色', amber: '琥珀色', blue: '蓝色', violet: '紫色' };
const ACCENT_LABEL_EN: Record<AccentPreset, string> = { pink: 'Pink', orange: 'Orange', amber: 'Amber', blue: 'Blue', violet: 'Violet' };
const presetLabel = (a: AccentPreset, lang: Lang) => (lang === 'en' ? ACCENT_LABEL_EN : ACCENT_LABEL)[a];
/** 预设色的色值（与 tokens.css 一致）：从预设切到自定义时，取色器从当前颜色开始 */
const PRESET_HEX: Record<AccentPreset, string> = { pink: '#ff6b8e', orange: '#ff7a2f', amber: '#ffbe3b', blue: '#2e7bff', violet: '#c77dff' };
export const accentLabel = (a: Accent, lang: Lang = 'zh') => (isCustomAccent(a) ? (lang === 'en' ? `Custom ${a}` : `自定义 ${a}`) : presetLabel(a, lang));
const accentHex = (a: Accent) => (isCustomAccent(a) ? a : PRESET_HEX[a]);

/** 字标在很窄的屏幕上由 CSS 隐藏（不用 JS 判断宽度：预渲染的 HTML 在注水前就该是对的） */
export function SiteBrand() {
  const t = useT();
  return (
    <Link to="/" className="site-brand ok-focusable" aria-label={t('Oink UI 首页', 'Oink UI home')}>
      <OinkLogo size={28} wordmark aria-hidden />
    </Link>
  );
}

export function SiteLinks({ path }: { path: string }) {
  const t = useT();
  return (
    <nav className="site-top" aria-label={t('站点', 'Site')}>
      <Link to="/components" className="ok-focusable" aria-current={path === '/components' ? 'page' : undefined}>{t('组件', 'Components')}</Link>
      <Link to="/guide/getting-started" className="ok-focusable" aria-current={path.startsWith('/guide') || path.startsWith('/components/') ? 'page' : undefined}>{t('文档', 'Docs')}</Link>
    </nav>
  );
}

/**
 * 一个按钮在浅色和深色之间切换，新主题从按钮中心圆形揭开。
 * 太阳和月亮两个图标都渲染，按 <html data-theme> 用 CSS 显示其中一个：预渲染的 HTML 在注水前图标就是对的
 */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useOink();
  const t = useT();
  const dark = resolvedTheme === 'dark';
  const label = dark ? t('切换到浅色', 'Switch to light') : t('切换到深色', 'Switch to dark');
  return (
    <button
      type="button"
      className="ok-btn ok-btn--ghost ok-btn--icon ok-focusable site-theme"
      aria-label={label}
      title={label}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <Icon name="sun" className="site-theme__sun" />
      <Icon name="moon" className="site-theme__moon" />
    </button>
  );
}

/** 强调色圆点：radiogroup，方向键在组内移动并选中，Tab 只停在选中的那一个 */
export function AccentPicker({ className }: { className?: string }) {
  const { accent, setAccent } = useOink();
  const lang = useLang();
  const t = useT();
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = (ACCENTS as Accent[]).indexOf(accent);
    const n = ACCENTS.length;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setAccent(ACCENTS[next]);
    e.currentTarget.querySelector<HTMLElement>(`[data-accent="${ACCENTS[next]}"]`)?.focus();
  };
  return (
    <div className={['site-accents', className].filter(Boolean).join(' ')} role="radiogroup" aria-label={t('强调色', 'Accent color')} onKeyDown={onKeyDown}>
      {ACCENTS.map((a) => (
        <button
          key={a} type="button" role="radio" aria-checked={a === accent} aria-label={presetLabel(a, lang)} title={presetLabel(a, lang)}
          // 当前是自定义颜色时没有选中的圆点，让第一个可以 Tab 到
          tabIndex={a === accent || (isCustomAccent(accent) && a === ACCENTS[0]) ? 0 : -1} data-accent={a} className="site-accent ok-focusable" onClick={() => setAccent(a)}
        />
      ))}
    </div>
  );
}

/**
 * 同源的其它文档（首页嵌的示例 iframe、别的标签页）改了主题或强调色时跟着变。
 * OinkProvider 把选择写进 localStorage；别的文档写入时这里会收到 storage 事件。
 * 值相同时 Provider 写回的字符串不变，浏览器不会再发事件，所以不会来回弹。
 */
export function ThemeSync() {
  const { theme, accent, motion, setTheme, setAccent, setMotion } = useOink();
  const current = useRef({ theme, accent, motion });
  current.current = { theme, accent, motion };
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      let next: { theme?: ThemeMode; accent?: Accent; motion?: 'auto' | 'full' | 'reduced' };
      try { next = JSON.parse(e.newValue) ?? {}; } catch { return; }
      const cur = current.current;
      if (next.theme && next.theme !== cur.theme && ['light', 'dark', 'system'].includes(next.theme)) setTheme(next.theme);
      const nextAccent = normalizeAccent(next.accent);
      if (nextAccent && nextAccent !== cur.accent) setAccent(nextAccent);
      if (next.motion && next.motion !== cur.motion && ['auto', 'full', 'reduced'].includes(next.motion)) setMotion(next.motion);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [setTheme, setAccent, setMotion]);
  return null;
}

/** 取色器：拖动时实时换整站的强调色 */
function CustomAccentPicker() {
  const { accent, setAccent } = useOink();
  const t = useT();
  return <ColorPicker aria-label={t('自定义强调色', 'Custom accent color')} value={accentHex(accent)} onChange={(hex) => setAccent(hex as Accent)} />;
}

/**
 * 自定义强调色按钮：彩色圆点，排在预设圆点最右边。选中自定义颜色时外圈和预设一样画选中圈，中间露出当前颜色。
 * 宽屏点开是一个浮层；窄屏本身已经在浮层里，就地展开取色器，不再套一层浮层
 */
function CustomAccentButton({ inline }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const t = useT();
  const label = t('自定义强调色', 'Custom accent color');
  const button = (props: { onClick?: () => void; 'aria-expanded'?: boolean }) => (
    <button
      type="button" className="site-accent site-accent--custom ok-focusable" aria-label={label} title={label}
      aria-haspopup={inline ? undefined : 'dialog'} {...props}
    />
  );
  if (inline) {
    return (
      <>
        {button({ onClick: () => setOpen((o) => !o), 'aria-expanded': open })}
        {open && <div className="site-accent-custom"><CustomAccentPicker /></div>}
      </>
    );
  }
  return (
    <Popover placement="bottom-end" aria-label={label} trigger={button({})}>
      <div className="site-accent-pop"><CustomAccentPicker /></div>
    </Popover>
  );
}

/**
 * 标签页图标跟着强调色换猪鼻子的颜色。方块跟着系统的深浅（图标里的媒体查询），鼻子和方块对比度不够时
 * 和页面上的标志一样换成白色（浅色）/ 墨色（深色），见 logoSnoutColors
 */
export function FaviconSync() {
  const { accent } = useOink();
  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) return;
    const snout = logoSnoutColors(accentHex(accent));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>.i{fill:#1B1C22}.s{fill:${snout.light}}@media (prefers-color-scheme:dark){.i{fill:#F4F4F6}.s{fill:${snout.dark}}}</style>`
      + `<g transform="rotate(-8 16 16)"><path class="i" d="M10 3H18A7 7 0 0 1 25 10V18A7 7 0 0 1 18 25H5A2 2 0 0 1 3 23V10A7 7 0 0 1 10 3Z"/>`
      + `<rect class="s" x="15.5" y="15" width="13.5" height="10" rx="5"/><ellipse class="i" cx="20" cy="20" rx="1.3" ry="1.9"/><ellipse class="i" cx="24.5" cy="20" rx="1.3" ry="1.9"/></g></svg>`;
    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [accent]);
  return null;
}

/**
 * 强调色：宽屏直接摆五个圆点和一个自定义按钮；窄屏收成一个按钮（显示当前颜色），点开在浮层里选。
 * 两种都渲染，用 CSS 媒体查询显示其中一种：预渲染的 HTML 在注水前就是对的
 */
export function AccentControl() {
  const { accent } = useOink();
  const lang = useLang();
  const t = useT();
  return (
    <>
      <div className="site-accent-row site-accents--wide">
        <AccentPicker />
        <CustomAccentButton />
      </div>
      <Popover
        placement="bottom-end"
        aria-label={t('强调色', 'Accent color')}
        trigger={
          <button type="button" className="ok-btn ok-btn--ghost ok-btn--icon ok-focusable site-accent-btn" aria-label={t(`强调色：${accentLabel(accent, lang)}`, `Accent color: ${accentLabel(accent, lang)}`)}>
            {/* 不带 data-accent：颜色继承 <html> 上的强调色，注水前也对 */}
            <span className="site-accent site-accent--swatch" aria-hidden="true" />
          </button>
        }
      >
        <div className="site-accent-pop">
          <div className="site-accent-row site-accent-row--wrap"><AccentPicker /><CustomAccentButton inline /></div>
        </div>
      </Popover>
    </>
  );
}

/**
 * 语言：中文 / English。换语言就是跳到同一页的另一种语言版本（中文是 /zh 前缀），并记住选择。
 * 语言名用它自己的文字写，不随界面语言翻译
 */
export function LangSwitch() {
  const lang = useLang();
  const t = useT();
  return (
    <DropdownMenu
      placement="bottom-end"
      matchTriggerWidth={false}
      aria-label={t('语言', 'Language')}
      trigger={
        <button type="button" className="ok-btn ok-btn--ghost ok-btn--icon ok-focusable site-lang" aria-label={t('语言：简体中文', 'Language: English')} title={t('语言', 'Language')}>
          <Icon name="globe" />
        </button>
      }
    >
      <MenuRadioGroup aria-label={t('语言', 'Language')} value={lang} onChange={(v) => { if (v !== lang) switchLang(v as Lang); }}>
        <MenuRadioItem value="zh" lang="zh-CN">简体中文</MenuRadioItem>
        <MenuRadioItem value="en" lang="en">English</MenuRadioItem>
      </MenuRadioGroup>
    </DropdownMenu>
  );
}

/** 顶栏右侧：强调色 + 搜索 + 主题。首页、组件页、文档页共用，保证三处一致 */
export function SiteControls() {
  return (
    <div className="site-controls">
      <AccentControl />
      {/* 搜索和深浅切换是两个同样的图标按钮，挨在一起成一组 */}
      <div className="site-actions">
        <SiteSearch />
        <LangSwitch />
        <ThemeSwitch />
        <GitHubLink />
      </div>
    </div>
  );
}

/** 页面滚动离开顶部后返回 true，吸顶标题栏据此显示底部发丝线 */
export function useScrolled(threshold = 4): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return scrolled;
}

export const REPO_URL = 'https://github.com/oinkvm/oink-ui';

/** 仓库链接：GitHub 标志（实心图形，16×16 视口），新窗口打开 */
export function GitHubLink() {
  const t = useT();
  return (
    <a
      href={REPO_URL} target="_blank" rel="noopener noreferrer"
      className="ok-btn ok-btn--ghost ok-btn--icon ok-focusable site-github"
      aria-label={t('GitHub 仓库（在新窗口打开）', 'GitHub repository (opens in a new window)')} title="GitHub"
    >
      <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    </a>
  );
}
