/* 浮层类的预览：悬浮卡片用缩小的“示意屏幕”表现滑入滑出；弹出类画一个触发器加一张弹出卡片 */
import { Icon } from 'oink-ui';
import type { IconName } from 'oink-ui';
import type { CSSProperties, ReactNode } from 'react';
import { useT } from '../i18n';
import { pick, useStep } from './loop';

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

/** 缩小的页面：顶栏 + 几块内容，悬浮卡片盖在上面 */
function Screen({ open, scrim = true, kind, children }: { open: boolean; scrim?: boolean; kind: string; children: ReactNode }) {
  return (
    <div className="pv-screen" data-kind={kind} data-open={open ? '' : undefined}>
      <div className="pv-screen__page">
        <div className="pv-screen__bar"><i className="pv-dot" /><i className="pv-bar" style={{ width: '28%' }} /></div>
        <div className="pv-screen__grid"><span /><span /><span /><span /></div>
      </div>
      {scrim && <span className="pv-screen__scrim" />}
      {children}
    </div>
  );
}

function CardLines() {
  return (
    <>
      <i className="pv-bar pv-bar--strong" style={{ width: '55%' }} />
      <i className="pv-bar pv-bar--soft" style={{ width: '85%' }} />
      <i className="pv-bar pv-bar--soft" style={{ width: '68%' }} />
    </>
  );
}

export function DialogPreview() {
  const s = useStep([1000, 2200], 1);
  return (
    <Screen kind="dialog" open={s === 1}>
      <div className="pv-float pv-float--dialog">
        <CardLines />
        <span className="pv-float__actions"><span className="pv-pillbtn pv-pillbtn--soft" /><span className="pv-pillbtn" /></span>
      </div>
    </Screen>
  );
}

export function DrawerPreview() {
  const s = useStep([1000, 2200], 1);
  return (
    <Screen kind="drawer" open={s === 1}>
      <div className="pv-float pv-float--drawer">
        <CardLines />
        <span className="pv-float__block" />
        <span className="pv-float__actions"><span className="pv-pillbtn" /></span>
      </div>
    </Screen>
  );
}

export function SheetPreview() {
  const s = useStep([1000, 2200], 1);
  return (
    <Screen kind="sheet" open={s === 1}>
      <div className="pv-float pv-float--sheet">
        <span className="pv-float__grabber" />
        <CardLines />
      </div>
    </Screen>
  );
}

export function PanelPreview() {
  const s = useStep([1000, 2200], 1);
  return (
    <Screen kind="panel" open={s === 1} scrim={false}>
      <div className="pv-float pv-float--panel">
        <i className="pv-bar pv-bar--strong" style={{ width: '50%' }} />
        {[0, 1, 2].map((i) => <span key={i} className="pv-float__field"><i className="pv-bar pv-bar--soft" style={{ width: `${[40, 55, 35][i]}%` }} /></span>)}
      </div>
    </Screen>
  );
}

const COMMANDS: Array<{ icon: IconName; label: string; en: string }> = [
  { icon: 'file', label: '新建文档', en: 'New document' }, { icon: 'search', label: '搜索全部', en: 'Search everything' }, { icon: 'settings', label: '打开设置', en: 'Open settings' },
];
export function CommandPalettePreview() {
  const t = useT();
  // 关 → 开 → 高亮下移两次 → 关
  const s = useStep([900, 800, 700, 1200], 2);
  const hl = pick([0, 0, 1, 2], s);
  return (
    <Screen kind="palette" open={s > 0}>
      <div className="pv-float pv-float--palette">
        <span className="pv-palette__search"><Icon name="search" /><span className="pv-palette__q">{pick(t(['', '', '设', '设置'], ['', '', 'set', 'settings']), s)}</span></span>
        <span className="pv-menu-list" style={v({ '--i': hl })}>
          <span className="pv-menu-hl" />
          {COMMANDS.map((c, k) => <span key={c.icon} className="pv-menu-item" data-on={k === hl || undefined}><Icon name={c.icon} />{t(c.label, c.en)}</span>)}
        </span>
      </div>
    </Screen>
  );
}

/* —— 锚定弹出 —— */

/** 弹出卡片里的一列菜单项，高亮块在项之间滑动 */
function MenuList({ items, hl, check }: { items: Array<{ icon?: IconName; label: string; tone?: 'danger' }>; hl: number; check?: number[] }) {
  return (
    <span className="pv-menu-list" style={v({ '--i': Math.max(0, hl) })} data-none={hl < 0 || undefined}>
      <span className="pv-menu-hl" data-tone={items[hl]?.tone} />
      {items.map((it, k) => (
        <span key={it.label} className="pv-menu-item" data-on={k === hl || undefined} data-tone={it.tone}>
          {check ? <span className="pv-menu-check" data-on={check.includes(k) || undefined}><Icon name="check" /></span> : it.icon && <Icon name={it.icon} />}
          {it.label}
        </span>
      ))}
    </span>
  );
}

export function PopoverPreview() {
  const t = useT();
  const s = useStep([1100, 2200], 1);
  return (
    <div className="pv-anchor-stage" data-open={s === 1 ? '' : undefined}>
      <span className="pv-trigger pv-trigger--btn"><Icon name="share" />{t('分享', 'Share')}</span>
      <div className="pv-pop pv-pop--below pv-pop--card">
        <span className="pv-pop__row"><i className="pv-dot pv-dot--accent" /><i className="pv-bar pv-bar--strong" style={{ width: '50%' }} /></span>
        <i className="pv-bar pv-bar--soft" style={{ width: '90%' }} />
        <span className="pv-pop__link"><Icon name="link" /><i className="pv-bar pv-bar--soft" style={{ width: '60%' }} /></span>
      </div>
    </div>
  );
}

export function TooltipPreview() {
  const t = useT();
  const s = useStep([1200, 1800], 1);
  return (
    <div className="pv-anchor-stage pv-anchor-stage--center" data-open={s === 1 ? '' : undefined}>
      <span className="pv-tip">{t('复制链接', 'Copy link')}</span>
      <span className="pv-trigger pv-trigger--icon" data-hover={s === 1 || undefined}><Icon name="copy" /></span>
    </div>
  );
}

const MENU = {
  zh: [{ icon: 'edit', label: '重命名' }, { icon: 'copy', label: '复制' }, { icon: 'share', label: '分享' }, { icon: 'trash', label: '删除', tone: 'danger' }],
  en: [{ icon: 'edit', label: 'Rename' }, { icon: 'copy', label: 'Duplicate' }, { icon: 'share', label: 'Share' }, { icon: 'trash', label: 'Delete', tone: 'danger' }],
} satisfies Record<'zh' | 'en', Array<{ icon: IconName; label: string; tone?: 'danger' }>>;
export function MenuPreview() {
  const t = useT();
  const s = useStep([900, 600, 600, 600, 1000], 2);
  return (
    <div className="pv-anchor-stage" data-open={s > 0 ? '' : undefined}>
      <span className="pv-trigger pv-trigger--btn">{t('操作', 'Actions')}<Icon name="chevron-down" /></span>
      <div className="pv-pop pv-pop--below"><MenuList items={t(MENU.zh, MENU.en)} hl={Math.max(0, s - 1)} /></div>
    </div>
  );
}

export function ContextMenuPreview() {
  const t = useT();
  const s = useStep([900, 600, 600, 1100], 2);
  return (
    <div className="pv-ctx" data-open={s > 0 ? '' : undefined}>
      <span className="pv-ctx__area"><Icon name="image" /></span>
      <span className="pv-ctx__cursor" />
      <div className="pv-pop pv-pop--ctx"><MenuList items={[0, 1, 3].map((i) => t(MENU.zh, MENU.en)[i])} hl={Math.max(0, s - 1)} /></div>
    </div>
  );
}

const CITIES = { zh: ['北京', '上海', '广州', '深圳'], en: ['Tokyo', 'London', 'Paris', 'Berlin'] };
export function SelectPreview() {
  const t = useT();
  const cities = t(CITIES.zh, CITIES.en);
  // 关（北京）→ 开 → 高亮移到上海 → 移到深圳 → 关（深圳）→ …
  const s = useStep([1100, 600, 600, 700, 1300], 0);
  const value = s === 4 ? cities[3] : cities[0];
  const hl = pick([0, 0, 1, 3, 3], s);
  return (
    <div className="pv-anchor-stage" data-open={s > 0 && s < 4 ? '' : undefined}>
      <span className="pv-trigger pv-trigger--field"><span className="pv-select-value">{value}</span><Icon name="chevron-down" /></span>
      <div className="pv-pop pv-pop--below pv-pop--wide"><MenuList items={cities.map((label) => ({ label }))} hl={hl} check={[cities.indexOf(value)]} /></div>
    </div>
  );
}

// 英文用短词：三个小标签要挤在 172px 宽的框里
const TOPICS = { zh: ['设计', '前端', '产品', '运营'], en: ['UI', 'Web', 'Docs', 'Ops'] };
export function MultiSelectPreview() {
  const t = useT();
  const topics = t(TOPICS.zh, TOPICS.en);
  const s = useStep([900, 600, 600, 600, 1500], 3);
  const picked = pick([[], [0], [0, 2], [0, 2, 3], [0, 2, 3]], s);
  return (
    <div className="pv-anchor-stage" data-open={s > 0 && s < 4 ? '' : undefined}>
      <span className="pv-trigger pv-trigger--field pv-trigger--chips">
        {picked.length ? picked.map((i) => <span key={i} className="pv-chip-mini">{topics[i]}</span>) : <span className="pv-placeholder">{t('选择标签', 'Pick tags')}</span>}
        <Icon name="chevron-down" />
      </span>
      <div className="pv-pop pv-pop--below pv-pop--wide"><MenuList items={topics.map((label) => ({ label }))} hl={picked[picked.length - 1] ?? 0} check={picked} /></div>
    </div>
  );
}

const PLACES = {
  zh: { all: ['上海', '上饶', '深圳', '北京'], typed: '上' },
  en: { all: ['Seattle', 'Seoul', 'Boston', 'Denver'], typed: 'Se' },
};
export function ComboboxPreview() {
  const t = useT();
  const places = t(PLACES.zh, PLACES.en);
  // 空 → 输入“上” → 列表筛到两项 → 选中第一项
  const s = useStep([900, 900, 700, 1500], 3);
  const q = pick(['', places.typed, places.typed, places.all[0]], s);
  const list = q === '' ? places.all : places.all.filter((p) => p.startsWith(places.typed));
  return (
    <div className="pv-anchor-stage" data-open={s > 0 && s < 3 ? '' : undefined}>
      <span className="pv-trigger pv-trigger--field pv-trigger--input" data-focus={s > 0 && s < 3 ? '' : undefined}><Icon name="search" /><span className="pv-select-value">{q || <span className="pv-placeholder">{t('城市', 'City')}</span>}</span><span className="pv-caret" /></span>
      <div className="pv-pop pv-pop--below pv-pop--wide"><MenuList items={list.map((label) => ({ label }))} hl={s === 2 ? 0 : -1} /></div>
    </div>
  );
}

/** 一个缩小的月历：31 天，选中的圆点在日期间移动 */
function MiniMonth({ selected, range }: { selected: number; range?: [number, number] }) {
  const t = useT();
  const lead = 3; // 本月 1 号是周四（两种语言都从周一开始，与库里 Calendar 的默认 weekStartsOn 一致）
  return (
    <span className="pv-month">
      {t(['一', '二', '三', '四', '五', '六', '日'], ['M', 'T', 'W', 'T', 'F', 'S', 'S']).map((w, i) => <span key={i} className="pv-month__wd">{w}</span>)}
      {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
      {Array.from({ length: 31 }, (_, i) => {
        const day = i + 1;
        const inRange = range && day > range[0] && day < range[1];
        return <span key={day} className="pv-month__d" data-on={day === selected || (range && (day === range[0] || day === range[1])) || undefined} data-in={inRange || undefined}>{day}</span>;
      })}
    </span>
  );
}

export function CalendarPreview() {
  const t = useT();
  const s = useStep([900, 900, 900, 1400], 3);
  const day = pick([9, 14, 16, 22], s);
  return (
    <div className="pv-cal">
      <span className="pv-cal__head"><Icon name="chevron-left" /><span>{t('2026 年 10 月', 'October 2026')}</span><Icon name="chevron-right" /></span>
      <MiniMonth selected={day} />
    </div>
  );
}

export function DatePickerPreview() {
  // 关（10 月 9 日）→ 开 → 选到 16 日 → 关（10 月 16 日）
  const s = useStep([1000, 800, 900, 1400], 3);
  const day = s >= 2 ? 16 : 9;
  return (
    <div className="pv-anchor-stage" data-open={s === 1 || s === 2 ? '' : undefined}>
      <span className="pv-trigger pv-trigger--field"><Icon name="calendar" /><span className="pv-select-value">2026-10-{String(day).padStart(2, '0')}</span></span>
      <div className="pv-pop pv-pop--below pv-pop--cal"><MiniMonth selected={day} /></div>
    </div>
  );
}
