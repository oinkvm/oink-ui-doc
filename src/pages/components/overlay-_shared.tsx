import type { ReactNode } from 'react';
import { Badge, Code, Table } from 'oink-ui';
import type { TableColumn } from 'oink-ui';
import { DocSection } from '../../doc';
import type { PropRow } from '../../doc';
import { useT } from '../../i18n';
import type { Translate } from '../../i18n';

type Member = 'Dialog' | 'Drawer' | 'Sheet' | 'Panel';

interface FamilyRow { name: Member; placement: string; modal: string; use: string }

const rows: { zh: FamilyRow[]; en: FamilyRow[] } = {
  zh: [
    { name: 'Dialog', placement: '居中', modal: '模态', use: '确认、简短的表单' },
    { name: 'Drawer', placement: '贴着四边之一', modal: '模态', use: '详情、较长的表单、导航' },
    { name: 'Sheet', placement: '贴着底边', modal: '模态', use: '手机上代替对话框和抽屉' },
    { name: 'Panel', placement: '贴着四边之一', modal: '非模态', use: '检查器、筛选面板' },
  ],
  en: [
    { name: 'Dialog', placement: 'Centered', modal: 'Modal', use: 'Confirmations, short forms' },
    { name: 'Drawer', placement: 'Any edge', modal: 'Modal', use: 'Details, longer forms, navigation' },
    { name: 'Sheet', placement: 'Bottom edge', modal: 'Modal', use: 'Replaces dialogs and drawers on phones' },
    { name: 'Panel', placement: 'Any edge', modal: 'Non-modal', use: 'Inspectors, filter panels' },
  ],
};

/** Dialog / Drawer / Sheet / Panel 四页共用的开场：它们是同一张悬浮卡片 */
export function FloatingFamily({ current, children }: { current: Member; children: ReactNode }) {
  const t = useT();
  const columns: TableColumn<FamilyRow>[] = [
    { key: 'name', header: t('组件', 'Component'), render: (r) => (r.name === current ? <>{r.name} <Badge tone="accent">{t('本页', 'This page')}</Badge></> : r.name) },
    { key: 'placement', header: t('停靠位置', 'Placement') },
    { key: 'modal', header: t('模态', 'Modality') },
    { key: 'use', header: t('用在哪', 'Use for') },
  ];
  return (
    <DocSection
      title={t('同一张悬浮卡片', 'One floating card')}
      description={t(
        <>
          Dialog、Drawer、Sheet、Panel 不是四套东西，而是同一张悬浮卡片（<Code>FloatingCard</Code>）在不同位置、不同尺寸下的用法：一张圆角卡片，和视口四周留一圈缝，从停靠的那一侧滑入。没有阴影，模态时靠遮罩压暗背景，非模态时靠描边和页面分开。遮罩、焦点圈、滚动锁、Esc、进退场都在 FloatingCard 里，只此一份；卡片里面统一用 <Code>FloatingHeader</Code> / <Code>FloatingBody</Code> / <Code>FloatingFooter</Code> 三个结构件来搭。
        </>,
        <>
          Dialog, Drawer, Sheet and Panel aren’t four separate things — they’re the same floating card (<Code>FloatingCard</Code>) used at different positions and sizes: a rounded card, inset from the viewport edges by a small gap, sliding in from the side it docks to. There’s no shadow; when modal, a scrim dims the page behind it, and when non-modal, a hairline border sets it apart. The scrim, focus trap, scroll lock, Esc and enter/exit motion all live in FloatingCard, in one place. Inside, every card is built from the same three parts: <Code>FloatingHeader</Code> / <Code>FloatingBody</Code> / <Code>FloatingFooter</Code>.
        </>,
      )}
    >
      <Table label={t('悬浮卡片的四种用法', 'Four uses of the floating card')} columns={columns} data={t(rows.zh, rows.en)} rowKey="name" stackOnMobile noHighlight />
      {children}
    </DocSection>
  );
}

/** 三个结构件的属性表，四页共用 */
export const floatingPartsRows = (t: Translate): { header: PropRow[]; body: PropRow[]; footer: PropRow[] } => ({
  header: [
    { name: 'title', type: 'ReactNode', description: t('标题。自动成为卡片的 aria-labelledby。', 'The title. Automatically becomes the card’s aria-labelledby.') },
    { name: 'description', type: 'ReactNode', description: t('标题下面的一行说明。自动成为卡片的 aria-describedby。', 'A one-line description under the title. Automatically becomes the card’s aria-describedby.') },
    { name: 'icon', type: 'ReactNode', description: t('标题左边的图标位（40×40 的色块）。', 'Icon slot to the left of the title (a 40×40 tinted tile).') },
    { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: t('标题的层级。', 'Heading level of the title.') },
    { name: 'closable', type: 'boolean', description: t('是否带关闭按钮。默认跟随卡片的 dismissible。', 'Whether to show a close button. Defaults to the card’s dismissible.') },
    { name: 'closeLabel', type: 'string', default: t("'关闭'", "'Close'"), description: t('关闭按钮的读屏名称。', 'Screen reader label of the close button. The default follows the OinkProvider locale.') },
    { name: 'onClose', type: '() => void', description: t('点关闭按钮时；不传则请求卡片关闭。', 'Called when the close button is pressed; if omitted, the card is asked to close.') },
    { name: 'children', type: 'ReactNode', description: t('放在关闭按钮前面的额外操作。', 'Extra actions placed before the close button.') },
  ],
  body: [
    { name: 'padded', type: 'boolean', default: 'true', description: t('是否带内边距。内容自己通栏（列表、表格）时关掉。', 'Whether to add padding. Turn it off when the content runs edge to edge (lists, tables).') },
  ],
  footer: [
    { name: 'align', type: "'start' | 'end' | 'between' | 'stretch'", default: "'end'", description: t('按钮的排法：靠左、靠右、两端、等分撑满。', 'How buttons are laid out: start, end, space-between, or stretched to equal widths.') },
  ],
});

/** 所有悬浮卡片共有的属性（来自 FloatingCard） */
export const floatingCommonRows = (t: Translate): PropRow[] => [
  { name: 'open / defaultOpen', type: 'boolean', default: 'false', description: t('开合，受控 / 非受控。', 'Open state, controlled / uncontrolled.') },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: t('开合变化时（Esc、点遮罩、关闭按钮、拖拽关闭都会触发）。', 'Called when the open state changes (Esc, clicking the scrim, the close button and drag-to-dismiss all trigger it).') },
  { name: 'dismissible', type: 'boolean', default: 'true', description: t('允许 Esc 和点遮罩关闭。', 'Allow closing with Esc and by clicking the scrim.') },
  { name: 'gap', type: 'number', default: t('12（窄屏 8）', '12 (8 on narrow screens)'), description: t('卡片到视口边缘的间隙（px）。', 'Gap between the card and the viewport edges (px).') },
  { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: t('模态时打开后焦点落在哪。默认是卡片里带 data-autofocus 的元素，没有就落在卡片本身。', 'Where focus goes on open when modal. Defaults to the element with data-autofocus inside the card, or the card itself.') },
  { name: 'restoreFocus', type: 'boolean', default: 'true', description: t('关闭后把焦点还给打开前的元素。', 'Return focus to the previously focused element after closing.') },
  { name: 'container', type: 'HTMLElement | null', description: t('渲染到哪个容器，默认 body。', 'Container to render into. Defaults to body.') },
  { name: 'onExited', type: '() => void', description: t('退场动画结束、节点卸载后。', 'Called after the exit animation finishes and the node unmounts.') },
  { name: 'aria-label / aria-labelledby / aria-describedby', type: 'string', description: t('不传时自动接上 FloatingHeader 的标题和说明。', 'When omitted, wired up to the FloatingHeader title and description automatically.') },
];
