/* 基础与布局类的预览：布局原语用色块示意排列变化 */
import { Divider, Icon, ToggleButton, Toolbar } from 'oink-ui';
import type { IconName } from 'oink-ui';
import type { CSSProperties } from 'react';
import { useT } from '../i18n';
import { pick, useStep } from './loop';

const noop = () => {};
const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/* —— 基础 —— */

const ICONS: IconName[] = ['heart', 'star', 'bell', 'mail', 'calendar', 'folder', 'search', 'settings'];
/** Icon：一组描线图标，选中块在格子间移动 */
export function IconPreview() {
  const s = useStep(750, 2);
  const i = pick([0, 1, 2, 3, 7, 6, 5, 4], s);
  return (
    <div className="pv-icons" style={v({ '--x': i % 4, '--y': Math.floor(i / 4) })}>
      <span className="pv-icons__hl" />
      {ICONS.map((n, k) => <span key={n} className="pv-icons__cell" data-on={k === i || undefined}><Icon name={n} /></span>)}
    </div>
  );
}

const TYPE = [
  { label: 'H3 · 20', size: 'h3' },
  { label: 'H2 · 28', size: 'h2' },
  { label: 'H1 · 40', size: 'h1' },
] as const;
/** Text / Heading：同一行字在几档字号之间切换 */
export function TextPreview() {
  const t = useT();
  const s = useStep(1300, 2);
  const k = pick([0, 1, 2, 1], s);
  return (
    <div className="pv-type pv-w" data-size={TYPE[k].size}>
      <span className="pv-type__sample">{t('你好 Oink', 'Hello Oink')}</span>
      <span className="pv-type__label">{TYPE[k].label}</span>
      <i className="pv-bar" style={{ width: '92%' }} />
      <i className="pv-bar" style={{ width: '70%' }} />
    </div>
  );
}

/** 动效工具：三种弹簧在轨道上来回，过冲依次增大 */
export function MotionPreview() {
  const s = useStep(1500, 1);
  return (
    <div className="pv-springs pv-w" data-s={s % 2}>
      {(['soft', 'spring', 'bouncy'] as const).map((k) => (
        <div key={k} className="pv-springs__track" data-k={k}>
          <span className="pv-springs__name">{k}</span>
          <span className="pv-springs__rail"><span className="pv-springs__ball" /></span>
        </div>
      ))}
    </div>
  );
}


/* —— 布局 —— */

/** Box：内边距和圆角在几档之间变化（浅色区是内边距） */
export function BoxPreview() {
  const s = useStep(1200, 1);
  return (
    <div className="pv-box" data-s={pick([0, 1, 2, 1], s)}>
      <div className="pv-box__content"><i className="pv-bar" style={{ width: '70%' }} /><i className="pv-bar pv-bar--soft" style={{ width: '50%' }} /></div>
    </div>
  );
}

/** Stack / Inline：三块从纵向排列变成横向排列，再变回来 */
export function StackPreview() {
  const s = useStep(1500, 0);
  return (
    <div className="pv-flow" data-dir={s % 2 ? 'row' : 'col'}>
      {[0, 1, 2].map((i) => <span key={i} className="pv-block" data-i={i} />)}
    </div>
  );
}

/** Grid：六块在三列和两列之间重排 */
export function GridPreview() {
  const s = useStep(1600, 0);
  return (
    <div className="pv-gridpv" data-cols={s % 2 ? 2 : 3}>
      {[0, 1, 2, 3, 4, 5].map((i) => <span key={i} className="pv-block" data-i={i} />)}
    </div>
  );
}

/** Container / Center：视口变宽，内容列封顶后居中，两边空出来 */
export function ContainerPreview() {
  const s = useStep(1600, 1);
  return (
    <div className="pv-viewport" data-wide={s % 2 ? '' : undefined}>
      <div className="pv-container">
        <i className="pv-bar" style={{ width: '60%' }} />
        <span className="pv-container__block" />
        <i className="pv-bar pv-bar--soft" style={{ width: '80%' }} />
      </div>
    </div>
  );
}

const RATIOS = [{ r: '16 / 9', label: '16:9' }, { r: '1 / 1', label: '1:1' }, { r: '4 / 3', label: '4:3' }];
/** Divider / AspectRatio：方框在几种宽高比之间变化，下面一条带字的分隔线 */
export function DividerPreview() {
  const t = useT();
  const s = useStep(1300, 0);
  const r = pick(RATIOS, s);
  return (
    <div className="pv-col pv-center pv-w">
      <span className="pv-ratio" data-r={r.label}><span>{r.label}</span></span>
      <Divider className="pv-divider">{t('或', 'or')}</Divider>
    </div>
  );
}

/** ScrollArea / Sticky：列表在窗口里滚动，表头粘在顶部，右侧细滚动条跟着走 */
export function ScrollAreaPreview() {
  return (
    <div className="pv-scroll">
      <div className="pv-scroll__head"><i className="pv-bar" style={{ width: '40%' }} /></div>
      <div className="pv-scroll__body">
        <div className="pv-scroll__list a">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="pv-scroll__row"><i className="pv-dot" /><i className="pv-bar" style={{ width: `${[62, 48, 70, 54, 66, 44, 58, 72, 50][i]}%` }} /></div>
          ))}
        </div>
      </div>
      <span className="pv-scroll__thumb a" />
    </div>
  );
}

/** Show / Hide：视口变窄时侧栏藏起来、换成菜单按钮；变宽时侧栏回来 */
export function ShowPreview() {
  const s = useStep(1600, 0);
  return (
    <div className="pv-viewport pv-show" data-wide={s % 2 ? undefined : ''}>
      <div className="pv-show__bar"><span className="pv-show__menu"><Icon name="menu" /></span><i className="pv-bar" style={{ width: '30%' }} /></div>
      <div className="pv-show__body">
        <span className="pv-show__side" />
        <div className="pv-show__main"><i className="pv-bar" style={{ width: '80%' }} /><i className="pv-bar pv-bar--soft" style={{ width: '60%' }} /><span className="pv-container__block" /></div>
      </div>
    </div>
  );
}

/** Page / PageHeader / Section：页头和各小节依次落位 */
export function PagePreview() {
  return (
    <div className="pv-page">
      <div className="pv-page__head a"><span><i className="pv-bar pv-bar--strong" style={{ width: '58%' }} /><i className="pv-bar pv-bar--soft" style={{ width: '80%' }} /></span><span className="pv-pillbtn" /></div>
      {[0, 1].map((i) => (
        <div key={i} className="pv-page__section a" style={v({ '--d': `${0.25 + i * 0.2}s` })}>
          <i className="pv-bar" style={{ width: '32%' }} />
          <span className="pv-page__card" />
        </div>
      ))}
    </div>
  );
}

type Labeled = { icon: IconName; label: string; en: string };
const TOOLS: Labeled[] = [
  { icon: 'edit', label: '编辑', en: 'Edit' }, { icon: 'link', label: '链接', en: 'Link' }, { icon: 'image', label: '图片', en: 'Image' },
  { icon: 'list', label: '列表', en: 'List' }, { icon: 'grid', label: '网格', en: 'Grid' },
];
/** Toolbar：一排开关按钮，按下的那个依次移动 */
export function ToolbarPreview() {
  const t = useT();
  const s = useStep(900, 1);
  const on = pick([0, 1, 2, 3, 4, 3, 2, 1], s);
  return (
    <Toolbar aria-label={t('格式', 'Formatting')} className="pv-toolbar">
      {TOOLS.map((tool, i) => (
        <ToggleButton key={tool.icon} iconOnly aria-label={t(tool.label, tool.en)} size="sm" variant="ghost" pressed={i === on || (i === 4 && on !== 3)} onChange={noop}>
          <Icon name={tool.icon} />
        </ToggleButton>
      ))}
    </Toolbar>
  );
}

/** AppShell：缩略骨架，侧栏在展开和收成图标栏之间切换 */
export function AppShellPreview() {
  const s = useStep(1600, 0);
  return (
    <div className="pv-shell" data-collapsed={s % 2 ? '' : undefined}>
      <div className="pv-shell__head"><span className="pv-dot" /><i className="pv-bar" style={{ width: '24%' }} /></div>
      <div className="pv-shell__side">
        {[0, 1, 2, 3].map((i) => <span key={i} className="pv-shell__item" data-on={i === 1 || undefined}><i className="pv-dot" /><i className="pv-bar" /></span>)}
      </div>
      <div className="pv-shell__main"><i className="pv-bar" style={{ width: '50%' }} /><span className="pv-shell__card" /><span className="pv-shell__card" /></div>
    </div>
  );
}

const NAV: Labeled[] = [
  { icon: 'home', label: '首页', en: 'Home' }, { icon: 'inbox', label: '收件箱', en: 'Inbox' }, { icon: 'calendar', label: '日程', en: 'Calendar' },
  { icon: 'users', label: '成员', en: 'Members' }, { icon: 'settings', label: '设置', en: 'Settings' },
];
/** Nav：竖排导航，当前项的底色滑到下一项 */
export function NavPreview() {
  const t = useT();
  const s = useStep(1000, 1);
  const i = pick([0, 1, 2, 1, 4, 3], s);
  return (
    <div className="pv-nav pv-w" style={v({ '--i': i })}>
      <span className="pv-nav__hl" />
      {NAV.map((n, k) => <span key={n.icon} className="pv-nav__item" data-on={k === i || undefined}><Icon name={n.icon} />{t(n.label, n.en)}</span>)}
    </div>
  );
}

const TABBAR: Labeled[] = [
  { icon: 'home', label: '首页', en: 'Home' }, { icon: 'search', label: '发现', en: 'Explore' }, { icon: 'bell', label: '通知', en: 'Alerts' }, { icon: 'user', label: '我的', en: 'Me' },
];
/** TabBar：手机底部的标签栏，选中项依次切换 */
export function TabBarPreview() {
  const t = useT();
  const s = useStep(1100, 0);
  const i = pick([0, 1, 2, 3], s);
  return (
    <div className="pv-phone">
      <div className="pv-phone__screen"><i className="pv-bar pv-bar--strong" style={{ width: '45%' }} /><span className="pv-container__block" /><i className="pv-bar pv-bar--soft" style={{ width: '70%' }} /></div>
      <div className="pv-tabbar" style={v({ '--i': i })}>
        {TABBAR.map((tab, k) => <span key={tab.icon} className="pv-tabbar__item" data-on={k === i || undefined}><Icon name={tab.icon} /><span>{t(tab.label, tab.en)}</span></span>)}
      </div>
    </div>
  );
}

/** SplitPane：中间的分隔条左右拖动，两栏跟着变宽变窄 */
export function SplitPanePreview() {
  const s = useStep(1300, 0);
  return (
    <div className="pv-split" style={v({ '--w': `${pick([38, 62, 48, 30], s)}%` })}>
      <div className="pv-split__pane"><i className="pv-bar" style={{ width: '70%' }} /><i className="pv-bar pv-bar--soft" style={{ width: '50%' }} /><i className="pv-bar pv-bar--soft" style={{ width: '62%' }} /></div>
      <span className="pv-split__handle"><i /></span>
      <div className="pv-split__pane"><i className="pv-bar" style={{ width: '55%' }} /><span className="pv-container__block" /></div>
    </div>
  );
}
