import { useState } from 'react';
import { ContextMenu, MenuCheckboxItem, MenuItem, MenuSeparator, MenuSub, Stack, Switch, Text } from 'oink-ui';
import type { CSSProperties } from 'react';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/context-menu', title: 'ContextMenu 右键菜单', group: '浮层', order: 40, subtitle: 'ContextMenu', en: { title: 'ContextMenu' } };

const area: CSSProperties = {
  display: 'grid', placeItems: 'center', width: '100%', maxWidth: 420, minHeight: 140, padding: 16, textAlign: 'center',
  borderRadius: 20, border: '1.5px dashed var(--ok-line-2)', color: 'var(--ok-text-2)',
};

function CanvasDemo() {
  const t = useT();
  const [last, setLast] = useState(t('还没有操作', 'Nothing yet'));
  const [locked, setLocked] = useState(false);
  return (
    <Stack gap={3} align="center" style={{ width: '100%' }}>
      <ContextMenu
        aria-label={t('画布操作', 'Canvas actions')}
        menu={
          <>
            <MenuItem icon="copy" shortcut="⌘C" onSelect={() => setLast(t('复制', 'Copy'))}>{t('复制', 'Copy')}</MenuItem>
            <MenuItem icon="edit" onSelect={() => setLast(t('重命名', 'Rename'))}>{t('重命名', 'Rename')}</MenuItem>
            <MenuSub icon="share" label={t('分享到', 'Share to')}>
              <MenuItem onSelect={() => setLast(t('分享到邮件', 'Share via email'))}>{t('邮件', 'Email')}</MenuItem>
              <MenuItem onSelect={() => setLast(t('复制链接', 'Copy link'))}>{t('复制链接', 'Copy link')}</MenuItem>
            </MenuSub>
            <MenuCheckboxItem checked={locked} onCheckedChange={setLocked}>{t('锁定图层', 'Lock layer')}</MenuCheckboxItem>
            <MenuSeparator />
            <MenuItem icon="trash" tone="danger" onSelect={() => setLast(t('删除', 'Delete'))}>{t('删除', 'Delete')}</MenuItem>
          </>
        }
      >
        <div tabIndex={0} className="ok-focusable" style={area}>{t('在这块区域里点右键（触屏长按；键盘聚焦后按 Shift + F10）', 'Right-click in this area (long-press on touch screens; with the keyboard, focus it and press Shift + F10)')}</div>
      </ContextMenu>
      <Text tone="subtle" variant="caption" role="status">{t('上一次操作：', 'Last action: ')}{last}{locked ? t(' · 图层已锁定', ' · Layer locked') : ''}</Text>
    </Stack>
  );
}

function DisabledDemo() {
  const t = useT();
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center" style={{ width: '100%' }}>
      <Switch checked={enabled} onChange={setEnabled}>{t('启用自定义右键菜单', 'Enable custom context menu')}</Switch>
      <ContextMenu
        aria-label={t('行操作', 'Row actions')}
        disabled={!enabled}
        open={open}
        onOpenChange={setOpen}
        menu={<><MenuItem>{t('打开', 'Open')}</MenuItem><MenuItem>{t('在新标签页打开', 'Open in new tab')}</MenuItem></>}
      >
        <div style={area}>{enabled ? t('现在右键会弹出自定义菜单', 'Right-clicking now opens the custom menu') : t('已禁用：右键是浏览器自带的菜单', 'Disabled: right-click shows the browser’s own menu')}</div>
      </ContextMenu>
      <Text tone="subtle" variant="caption">{open ? t('菜单已打开', 'Menu open') : t('菜单已关闭', 'Menu closed')}</Text>
    </Stack>
  );
}

const CODE_CANVAS = {
  zh: `
const area: CSSProperties = {
  display: 'grid', placeItems: 'center', width: '100%', maxWidth: 420, minHeight: 140, padding: 16, textAlign: 'center',
  borderRadius: 20, border: '1.5px dashed var(--ok-line-2)', color: 'var(--ok-text-2)',
};

function CanvasDemo() {
  const [last, setLast] = useState('还没有操作');
  const [locked, setLocked] = useState(false);
  return (
    <Stack gap={3} align="center" style={{ width: '100%' }}>
      <ContextMenu
        aria-label="画布操作"
        menu={
          <>
            <MenuItem icon="copy" shortcut="⌘C" onSelect={() => setLast('复制')}>复制</MenuItem>
            <MenuItem icon="edit" onSelect={() => setLast('重命名')}>重命名</MenuItem>
            <MenuSub icon="share" label="分享到">
              <MenuItem onSelect={() => setLast('分享到邮件')}>邮件</MenuItem>
              <MenuItem onSelect={() => setLast('复制链接')}>复制链接</MenuItem>
            </MenuSub>
            <MenuCheckboxItem checked={locked} onCheckedChange={setLocked}>锁定图层</MenuCheckboxItem>
            <MenuSeparator />
            <MenuItem icon="trash" tone="danger" onSelect={() => setLast('删除')}>删除</MenuItem>
          </>
        }
      >
        <div tabIndex={0} className="ok-focusable" style={area}>在这块区域里点右键（触屏长按；键盘聚焦后按 Shift + F10）</div>
      </ContextMenu>
      <Text tone="subtle" variant="caption" role="status">上一次操作：{last}{locked ? ' · 图层已锁定' : ''}</Text>
    </Stack>
  );
}
`,
  en: `
const area: CSSProperties = {
  display: 'grid', placeItems: 'center', width: '100%', maxWidth: 420, minHeight: 140, padding: 16, textAlign: 'center',
  borderRadius: 20, border: '1.5px dashed var(--ok-line-2)', color: 'var(--ok-text-2)',
};

function CanvasDemo() {
  const [last, setLast] = useState('Nothing yet');
  const [locked, setLocked] = useState(false);
  return (
    <Stack gap={3} align="center" style={{ width: '100%' }}>
      <ContextMenu
        aria-label="Canvas actions"
        menu={
          <>
            <MenuItem icon="copy" shortcut="⌘C" onSelect={() => setLast('Copy')}>Copy</MenuItem>
            <MenuItem icon="edit" onSelect={() => setLast('Rename')}>Rename</MenuItem>
            <MenuSub icon="share" label="Share to">
              <MenuItem onSelect={() => setLast('Share via email')}>Email</MenuItem>
              <MenuItem onSelect={() => setLast('Copy link')}>Copy link</MenuItem>
            </MenuSub>
            <MenuCheckboxItem checked={locked} onCheckedChange={setLocked}>Lock layer</MenuCheckboxItem>
            <MenuSeparator />
            <MenuItem icon="trash" tone="danger" onSelect={() => setLast('Delete')}>Delete</MenuItem>
          </>
        }
      >
        <div tabIndex={0} className="ok-focusable" style={area}>
          Right-click in this area (long-press on touch screens; with the keyboard, focus it and press Shift + F10)
        </div>
      </ContextMenu>
      <Text tone="subtle" variant="caption" role="status">Last action: {last}{locked ? ' · Layer locked' : ''}</Text>
    </Stack>
  );
}
`,
};

const CODE_DISABLED = {
  zh: `
function DisabledDemo() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center" style={{ width: '100%' }}>
      <Switch checked={enabled} onChange={setEnabled}>启用自定义右键菜单</Switch>
      <ContextMenu
        aria-label="行操作"
        disabled={!enabled}
        open={open}
        onOpenChange={setOpen}
        menu={<><MenuItem>打开</MenuItem><MenuItem>在新标签页打开</MenuItem></>}
      >
        <div style={area}>{enabled ? '现在右键会弹出自定义菜单' : '已禁用：右键是浏览器自带的菜单'}</div>
      </ContextMenu>
      <Text tone="subtle" variant="caption">菜单{open ? '已打开' : '已关闭'}</Text>
    </Stack>
  );
}
`,
  en: `
function DisabledDemo() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center" style={{ width: '100%' }}>
      <Switch checked={enabled} onChange={setEnabled}>Enable custom context menu</Switch>
      <ContextMenu
        aria-label="Row actions"
        disabled={!enabled}
        open={open}
        onOpenChange={setOpen}
        menu={<><MenuItem>Open</MenuItem><MenuItem>Open in new tab</MenuItem></>}
      >
        <div style={area}>{enabled ? 'Right-clicking now opens the custom menu' : 'Disabled: right-click shows the browser’s own menu'}</div>
      </ContextMenu>
      <Text tone="subtle" variant="caption">Menu {open ? 'open' : 'closed'}</Text>
    </Stack>
  );
}
`,
};

export default function ContextMenuPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={meta.subtitle}
      lead={t(
        '在某块区域上点右键（或触屏长按）时，在指针处弹出和这块内容相关的操作。它是捷径而不是唯一入口：右键菜单不容易被发现，里面的操作在界面上应该另有可见的入口。',
        'Right-clicking an area (or long-pressing on touch screens) opens actions for that content at the pointer. It is a shortcut, not the only way in: context menus are hard to discover, so every action in one should also be reachable from something visible in the interface.',
      )}
    >
      <DocSection
        title={t('基本用法', 'Basic usage')}
        description={t(
          'children 是响应右键的区域，menu 是菜单项，写法和 DropdownMenu 里完全一样（图标、状态色、复选项、子菜单都能用）。已经打开时再次右键会挪到新位置；页面滚动时自动收起。',
          'children is the area that responds to right-clicks; menu holds the items, written exactly as in DropdownMenu (icons, tones, checkbox items and submenus all work). Right-clicking again while open moves the menu to the new spot; scrolling the page closes it.',
        )}
      >
        <Demo
          minHeight={380}
          layout="col"
          align="start"
          code={t(CODE_CANVAS.zh, CODE_CANVAS.en)}
        >
          <CanvasDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('禁用与受控', 'Disabled and controlled')}
        description={t(
          'disabled 时不拦截右键，浏览器自带的菜单照常出现。open / onOpenChange 可以读到或控制开关状态（位置仍由最近一次右键决定）。',
          'When disabled, right-clicks are not intercepted and the browser’s own menu appears as usual. open / onOpenChange read or control whether it is open (the position still comes from the latest right-click).',
        )}
      >
        <Demo
          minHeight={320}
          layout="col"
          align="start"
          code={t(CODE_DISABLED.zh, CODE_DISABLED.en)}
        >
          <DisabledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactElement', required: true, description: t('响应右键 / 长按的区域：要能接收 ref 和事件。', 'The area that responds to right-click / long-press; it must accept a ref and event handlers.') },
            { name: 'menu', type: 'ReactNode', required: true, description: t('菜单项（MenuItem、MenuSeparator、MenuSub…）。', 'Menu items (MenuItem, MenuSeparator, MenuSub…).') },
            { name: 'open', type: 'boolean', description: t('是否打开（受控）。', 'Whether the menu is open (controlled).') },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: t('开关状态变化时触发。', 'Called when the open state changes.') },
            { name: 'disabled', type: 'boolean', description: t('禁用：不拦截右键，交还给浏览器。', 'Disabled: right-clicks are not intercepted and go to the browser.') },
            { name: 'longPressMs', type: 'number', default: '500', description: t('触屏长按多久弹出（ms）。按住期间手指移动超过容差会取消。', 'How long a touch press must last before the menu opens (ms). Moving the finger beyond a small tolerance cancels it.') },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: t('其余属性（aria-label 等）和 ref 落在 role="menu" 的菜单上。', 'Other attributes (aria-label etc.) and ref go on the role="menu" element.') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>菜单的角色和键盘操作与 Menu 相同：<kbd>↑</kbd> <kbd>↓</kbd> 移动，<kbd>Home</kbd> / <kbd>End</kbd>，<kbd>Enter</kbd> / <kbd>Space</kbd> 触发，<kbd>→</kbd> / <kbd>←</kbd> 进出子菜单，打字母跳转。</>,
              <>键盘触发：让区域可聚焦（<code>tabIndex=0</code>），聚焦后按菜单键或 <kbd>Shift</kbd>+<kbd>F10</kbd>，菜单出现在该元素的左下角。</>,
              <><kbd>Esc</kbd> 关闭并把焦点还给打开前的元素；点外面关闭。</>,
              <>打开时焦点在菜单本身，不预先高亮任何项，避免误触。</>,
              <>右键菜单对触屏和读屏用户都不容易发现，里面的每个操作都应该另有可见入口（比如行尾的“更多”按钮配 DropdownMenu）。</>,
            ],
            [
              <>Roles and keyboard behavior match Menu: <kbd>↑</kbd> <kbd>↓</kbd> move, <kbd>Home</kbd> / <kbd>End</kbd>, <kbd>Enter</kbd> / <kbd>Space</kbd> activate, <kbd>→</kbd> / <kbd>←</kbd> enter and leave submenus, typing a letter jumps.</>,
              <>From the keyboard: make the area focusable (<code>tabIndex=0</code>), then press the Menu key or <kbd>Shift</kbd>+<kbd>F10</kbd>; the menu appears at the element’s bottom-left corner.</>,
              <><kbd>Esc</kbd> closes it and returns focus to the element that had it before; clicking outside closes it too.</>,
              <>When it opens, focus is on the menu itself and no item is highlighted in advance, to avoid accidental activation.</>,
              <>Context menus are hard to discover for both touch and screen reader users, so every action in one should have another visible entry point (for example a “More” button at the end of the row with a DropdownMenu).</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
