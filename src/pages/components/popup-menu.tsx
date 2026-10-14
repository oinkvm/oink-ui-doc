import { useState } from 'react';
import {
  Button, DropdownMenu, Icon, Menu, MenuCheckboxItem, MenuItem, MenuLabel, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuSub, Stack, Text,
} from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/menu', title: 'Menu 菜单', group: '浮层', order: 30, subtitle: 'DropdownMenu · Menu', en: { title: 'Menu', subtitle: 'DropdownMenu · Menu' } };

function ActionsDemo() {
  const t = useT();
  const [last, setLast] = useState(t('还没有操作', 'Nothing yet'));
  return (
    <Stack gap={3} align="center">
      <DropdownMenu trigger={<Button trailing={<Icon name="chevron-down" />}>{t('文件', 'File')}</Button>}>
        <MenuItem icon="plus" shortcut="⌘N" onSelect={() => setLast(t('新建', 'New'))}>{t('新建', 'New')}</MenuItem>
        <MenuItem icon="copy" shortcut="⌘D" onSelect={() => setLast(t('创建副本', 'Duplicate'))}>{t('创建副本', 'Duplicate')}</MenuItem>
        <MenuItem icon="share" onSelect={() => setLast(t('分享', 'Share'))}>{t('分享…', 'Share…')}</MenuItem>
        <MenuItem icon="download" disabled>{t('导出（暂不可用）', 'Export (unavailable)')}</MenuItem>
        <MenuSeparator />
        <MenuItem icon="trash" tone="danger" shortcut="⌫" onSelect={() => setLast(t('删除', 'Delete'))}>{t('删除', 'Delete')}</MenuItem>
      </DropdownMenu>
      <Text tone="subtle" variant="caption" role="status">{t('上一次操作：', 'Last action: ')}{last}</Text>
    </Stack>
  );
}

function ViewDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [grid, setGrid] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [sort, setSort] = useState<string | null>('updated');
  return (
    <Stack gap={3} align="center">
      <DropdownMenu open={open} onOpenChange={setOpen} trigger={<Button leading={<Icon name="sliders" />}>{t('视图选项', 'View options')}</Button>}>
        <MenuLabel>{t('显示', 'Show')}</MenuLabel>
        <MenuCheckboxItem checked={grid} onCheckedChange={setGrid}>{t('显示网格线', 'Grid lines')}</MenuCheckboxItem>
        <MenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>{t('显示隐藏文件', 'Hidden files')}</MenuCheckboxItem>
        <MenuSeparator />
        <MenuLabel>{t('排序', 'Sort')}</MenuLabel>
        <MenuRadioGroup aria-label={t('排序', 'Sort')} value={sort} onChange={setSort}>
          <MenuRadioItem value="name">{t('按名称', 'By name')}</MenuRadioItem>
          <MenuRadioItem value="updated">{t('按修改时间', 'By date modified')}</MenuRadioItem>
          <MenuRadioItem value="size">{t('按大小', 'By size')}</MenuRadioItem>
        </MenuRadioGroup>
      </DropdownMenu>
      <Text tone="subtle" variant="caption">
        {t(
          <>菜单{open ? '已打开' : '已关闭'} · 网格线{grid ? '开' : '关'} · 隐藏文件{hidden ? '开' : '关'} · 排序 {sort}</>,
          <>Menu {open ? 'open' : 'closed'} · Grid lines {grid ? 'on' : 'off'} · Hidden files {hidden ? 'on' : 'off'} · Sort: {sort}</>,
        )}
      </Text>
    </Stack>
  );
}

const CODE_ACTIONS = {
  zh: `
function ActionsDemo() {
  const [last, setLast] = useState('还没有操作');
  return (
    <Stack gap={3} align="center">
      <DropdownMenu trigger={<Button trailing={<Icon name="chevron-down" />}>文件</Button>}>
        <MenuItem icon="plus" shortcut="⌘N" onSelect={() => setLast('新建')}>新建</MenuItem>
        <MenuItem icon="copy" shortcut="⌘D" onSelect={() => setLast('创建副本')}>创建副本</MenuItem>
        <MenuItem icon="share" onSelect={() => setLast('分享')}>分享…</MenuItem>
        <MenuItem icon="download" disabled>导出（暂不可用）</MenuItem>
        <MenuSeparator />
        <MenuItem icon="trash" tone="danger" shortcut="⌫" onSelect={() => setLast('删除')}>删除</MenuItem>
      </DropdownMenu>
      <Text tone="subtle" variant="caption" role="status">上一次操作：{last}</Text>
    </Stack>
  );
}
`,
  en: `
function ActionsDemo() {
  const [last, setLast] = useState('Nothing yet');
  return (
    <Stack gap={3} align="center">
      <DropdownMenu trigger={<Button trailing={<Icon name="chevron-down" />}>File</Button>}>
        <MenuItem icon="plus" shortcut="⌘N" onSelect={() => setLast('New')}>New</MenuItem>
        <MenuItem icon="copy" shortcut="⌘D" onSelect={() => setLast('Duplicate')}>Duplicate</MenuItem>
        <MenuItem icon="share" onSelect={() => setLast('Share')}>Share…</MenuItem>
        <MenuItem icon="download" disabled>Export (unavailable)</MenuItem>
        <MenuSeparator />
        <MenuItem icon="trash" tone="danger" shortcut="⌫" onSelect={() => setLast('Delete')}>Delete</MenuItem>
      </DropdownMenu>
      <Text tone="subtle" variant="caption" role="status">Last action: {last}</Text>
    </Stack>
  );
}
`,
};

const CODE_TONES = {
  zh: `
<DropdownMenu trigger={<Button>工单操作</Button>}>
  <MenuItem icon="check" tone="success">标记为已解决</MenuItem>
  <MenuItem icon="info" tone="info">请求更多信息</MenuItem>
  <MenuItem icon="alert" tone="warning">升级为紧急</MenuItem>
  <MenuSeparator />
  <MenuItem icon="trash" tone="danger">删除工单</MenuItem>
</DropdownMenu>
`,
  en: `
<DropdownMenu trigger={<Button>Ticket actions</Button>}>
  <MenuItem icon="check" tone="success">Mark as resolved</MenuItem>
  <MenuItem icon="info" tone="info">Request more info</MenuItem>
  <MenuItem icon="alert" tone="warning">Escalate to urgent</MenuItem>
  <MenuSeparator />
  <MenuItem icon="trash" tone="danger">Delete ticket</MenuItem>
</DropdownMenu>
`,
};

const CODE_VIEW = {
  zh: `
function ViewDemo() {
  const [open, setOpen] = useState(false);
  const [grid, setGrid] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [sort, setSort] = useState<string | null>('updated');
  return (
    <Stack gap={3} align="center">
      <DropdownMenu open={open} onOpenChange={setOpen} trigger={<Button leading={<Icon name="sliders" />}>视图选项</Button>}>
        <MenuLabel>显示</MenuLabel>
        <MenuCheckboxItem checked={grid} onCheckedChange={setGrid}>显示网格线</MenuCheckboxItem>
        <MenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>显示隐藏文件</MenuCheckboxItem>
        <MenuSeparator />
        <MenuLabel>排序</MenuLabel>
        <MenuRadioGroup aria-label="排序" value={sort} onChange={setSort}>
          <MenuRadioItem value="name">按名称</MenuRadioItem>
          <MenuRadioItem value="updated">按修改时间</MenuRadioItem>
          <MenuRadioItem value="size">按大小</MenuRadioItem>
        </MenuRadioGroup>
      </DropdownMenu>
      <Text tone="subtle" variant="caption">
        菜单{open ? '已打开' : '已关闭'} · 网格线{grid ? '开' : '关'} · 隐藏文件{hidden ? '开' : '关'} · 排序 {sort}
      </Text>
    </Stack>
  );
}
`,
  en: `
function ViewDemo() {
  const [open, setOpen] = useState(false);
  const [grid, setGrid] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [sort, setSort] = useState<string | null>('updated');
  return (
    <Stack gap={3} align="center">
      <DropdownMenu open={open} onOpenChange={setOpen} trigger={<Button leading={<Icon name="sliders" />}>View options</Button>}>
        <MenuLabel>Show</MenuLabel>
        <MenuCheckboxItem checked={grid} onCheckedChange={setGrid}>Grid lines</MenuCheckboxItem>
        <MenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>Hidden files</MenuCheckboxItem>
        <MenuSeparator />
        <MenuLabel>Sort</MenuLabel>
        <MenuRadioGroup aria-label="Sort" value={sort} onChange={setSort}>
          <MenuRadioItem value="name">By name</MenuRadioItem>
          <MenuRadioItem value="updated">By date modified</MenuRadioItem>
          <MenuRadioItem value="size">By size</MenuRadioItem>
        </MenuRadioGroup>
      </DropdownMenu>
      <Text tone="subtle" variant="caption">
        Menu {open ? 'open' : 'closed'} · Grid lines {grid ? 'on' : 'off'} · Hidden files {hidden ? 'on' : 'off'} · Sort: {sort}
      </Text>
    </Stack>
  );
}
`,
};

const CODE_SUB = {
  zh: `
<DropdownMenu trigger={<Button iconOnly aria-label="更多操作"><Icon name="more" /></Button>}>
  <MenuItem icon="edit">重命名</MenuItem>
  <MenuSub icon="share" label="分享到">
    <MenuItem icon="mail">邮件</MenuItem>
    <MenuItem icon="copy">复制链接</MenuItem>
    <MenuSub label="更多">
      <MenuItem>生成二维码</MenuItem>
      <MenuItem>嵌入代码</MenuItem>
    </MenuSub>
  </MenuSub>
  <MenuSub icon="download" label="导出为" disabled>
    <MenuItem>PDF</MenuItem>
  </MenuSub>
  <MenuSeparator />
  <MenuItem icon="trash" tone="danger">删除</MenuItem>
</DropdownMenu>
`,
  en: `
<DropdownMenu trigger={<Button iconOnly aria-label="More actions"><Icon name="more" /></Button>}>
  <MenuItem icon="edit">Rename</MenuItem>
  <MenuSub icon="share" label="Share to">
    <MenuItem icon="mail">Email</MenuItem>
    <MenuItem icon="copy">Copy link</MenuItem>
    <MenuSub label="More">
      <MenuItem>Generate QR code</MenuItem>
      <MenuItem>Embed code</MenuItem>
    </MenuSub>
  </MenuSub>
  <MenuSub icon="download" label="Export as" disabled>
    <MenuItem>PDF</MenuItem>
  </MenuSub>
  <MenuSeparator />
  <MenuItem icon="trash" tone="danger">Delete</MenuItem>
</DropdownMenu>
`,
};

const CODE_PLACEMENT = {
  zh: `
<DropdownMenu placement="bottom-end" trigger={<Button>右对齐</Button>}>
  <MenuItem>个人资料</MenuItem>
  <MenuItem>退出登录</MenuItem>
</DropdownMenu>
<DropdownMenu placement="top-start" trigger={<Button>向上弹出</Button>}>
  <MenuItem>选项一</MenuItem>
  <MenuItem>选项二</MenuItem>
</DropdownMenu>
<DropdownMenu matchTriggerWidth={false} trigger={<Button>一个很宽很宽的触发按钮</Button>}>
  <MenuItem>短</MenuItem>
  <MenuItem>项</MenuItem>
</DropdownMenu>
`,
  en: `
<DropdownMenu placement="bottom-end" trigger={<Button>Align right</Button>}>
  <MenuItem>Profile</MenuItem>
  <MenuItem>Sign out</MenuItem>
</DropdownMenu>
<DropdownMenu placement="top-start" trigger={<Button>Open upward</Button>}>
  <MenuItem>Option one</MenuItem>
  <MenuItem>Option two</MenuItem>
</DropdownMenu>
<DropdownMenu matchTriggerWidth={false} trigger={<Button>A very, very wide trigger button</Button>}>
  <MenuItem>Short</MenuItem>
  <MenuItem>Item</MenuItem>
</DropdownMenu>
`,
};

const CODE_STANDALONE = {
  zh: `
<div style={{ width: 220 }}>
  <Menu aria-label="快捷操作">
    <MenuItem icon="mail">发邮件</MenuItem>
    <MenuItem icon="bell">设置提醒</MenuItem>
    <MenuItem icon="sparkle" disabled>智能整理</MenuItem>
  </Menu>
</div>
`,
  en: `
<div style={{ width: 220 }}>
  <Menu aria-label="Quick actions">
    <MenuItem icon="mail">Send email</MenuItem>
    <MenuItem icon="bell">Set reminder</MenuItem>
    <MenuItem icon="sparkle" disabled>Smart tidy-up</MenuItem>
  </Menu>
</div>
`,
};

export default function MenuPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '点击一个按钮，弹出一列操作让用户挑一个执行。DropdownMenu 是带触发按钮的完整下拉菜单；右键触发见 ContextMenu；要从选项里选一个“值”而不是执行操作，用 Select。',
        'Click a button to open a list of actions and run one of them. DropdownMenu is a complete dropdown with its trigger button; for right-click menus see ContextMenu; to choose a value from options rather than run an action, use Select.',
      )}
    >
      <DocSection
        title={t('下拉菜单', 'Dropdown menu')}
        description={t(
          'trigger 通常是 Button。菜单项可以带图标、快捷键提示（只是文字，不负责绑定按键）和禁用状态。点选后默认收起整个菜单。',
          'trigger is usually a Button. Items can have an icon, a shortcut hint (just text; it does not bind the keys) and a disabled state. Picking an item closes the whole menu by default.',
        )}
      >
        <Demo
          minHeight={320}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_ACTIONS.zh, CODE_ACTIONS.en)}
        >
          <ActionsDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('状态色项', 'Tone items')}
        description={t(
          'tone 给菜单项上状态色：文字和图标用状态色，高亮换成同色的柔和底。危险操作（删除、退出）用 danger，并且放在最后、用分隔线隔开。',
          'tone gives an item a status color: text and icon take the color, and the highlight becomes a soft fill of the same hue. Destructive actions (delete, sign out) use danger and go last, set apart by a separator.',
        )}
      >
        <Demo
          minHeight={300}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_TONES.zh, CODE_TONES.en)}
        >
          <DropdownMenu trigger={<Button>{t('工单操作', 'Ticket actions')}</Button>}>
            <MenuItem icon="check" tone="success">{t('标记为已解决', 'Mark as resolved')}</MenuItem>
            <MenuItem icon="info" tone="info">{t('请求更多信息', 'Request more info')}</MenuItem>
            <MenuItem icon="alert" tone="warning">{t('升级为紧急', 'Escalate to urgent')}</MenuItem>
            <MenuSeparator />
            <MenuItem icon="trash" tone="danger">{t('删除工单', 'Delete ticket')}</MenuItem>
          </DropdownMenu>
        </Demo>
      </DocSection>

      <DocSection
        title={t('复选项、单选项与受控', 'Checkbox items, radio items and control')}
        description={t(
          'MenuCheckboxItem 和 MenuRadioItem 点选后默认不收起菜单，方便连续调整。MenuLabel 是分组小标题。DropdownMenu 的开关用 open / onOpenChange 受控。',
          'MenuCheckboxItem and MenuRadioItem keep the menu open after a click by default, so several adjustments can be made in a row. MenuLabel is a small group heading. Control whether DropdownMenu is open with open / onOpenChange.',
        )}
      >
        <Demo
          minHeight={380}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_VIEW.zh, CODE_VIEW.en)}
        >
          <ViewDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('子菜单', 'Submenus')}
        description={t(
          'MenuSub 的 label 是触发项上的文字，children 是子菜单里的项。悬停、点击或按 → 展开，← 或 Esc 收回。子菜单尽量只用一层。',
          'MenuSub’s label is the text on the parent item; children are the items in the submenu. Hover, click or press → to open it; ← or Esc to close. Keep submenus to a single level where possible.',
        )}
      >
        <Demo
          minHeight={320}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_SUB.zh, CODE_SUB.en)}
        >
          <DropdownMenu trigger={<Button iconOnly aria-label={t('更多操作', 'More actions')}><Icon name="more" /></Button>}>
            <MenuItem icon="edit">{t('重命名', 'Rename')}</MenuItem>
            <MenuSub icon="share" label={t('分享到', 'Share to')}>
              <MenuItem icon="mail">{t('邮件', 'Email')}</MenuItem>
              <MenuItem icon="copy">{t('复制链接', 'Copy link')}</MenuItem>
              <MenuSub label={t('更多', 'More')}>
                <MenuItem>{t('生成二维码', 'Generate QR code')}</MenuItem>
                <MenuItem>{t('嵌入代码', 'Embed code')}</MenuItem>
              </MenuSub>
            </MenuSub>
            <MenuSub icon="download" label={t('导出为', 'Export as')} disabled>
              <MenuItem>PDF</MenuItem>
            </MenuSub>
            <MenuSeparator />
            <MenuItem icon="trash" tone="danger">{t('删除', 'Delete')}</MenuItem>
          </DropdownMenu>
        </Demo>
      </DocSection>

      <DocSection title={t('位置与宽度', 'Placement and width')} description={t('默认在触发按钮下方、左对齐，并且不窄于触发按钮。', 'By default the menu opens below the trigger, left-aligned, and is never narrower than the trigger.')}>
        <Demo
          minHeight={220}
          style={{ alignContent: 'center' }}
          code={t(CODE_PLACEMENT.zh, CODE_PLACEMENT.en)}
        >
          <DropdownMenu placement="bottom-end" trigger={<Button>{t('右对齐', 'Align right')}</Button>}>
            <MenuItem>{t('个人资料', 'Profile')}</MenuItem>
            <MenuItem>{t('退出登录', 'Sign out')}</MenuItem>
          </DropdownMenu>
          <DropdownMenu placement="top-start" trigger={<Button>{t('向上弹出', 'Open upward')}</Button>}>
            <MenuItem>{t('选项一', 'Option one')}</MenuItem>
            <MenuItem>{t('选项二', 'Option two')}</MenuItem>
          </DropdownMenu>
          <DropdownMenu matchTriggerWidth={false} trigger={<Button>{t('一个很宽很宽的触发按钮', 'A very, very wide trigger button')}</Button>}>
            <MenuItem>{t('短', 'Short')}</MenuItem>
            <MenuItem>{t('项', 'Item')}</MenuItem>
          </DropdownMenu>
        </Demo>
      </DocSection>

      <DocSection
        title={t('单独使用 Menu', 'Standalone Menu')}
        description={t(
          'Menu 是 role="menu" 的列表本体，可以不带触发按钮直接放在页面里（比如放进你自己的浮层）。此时没有“收起”的概念，点选只触发 onSelect。',
          'Menu is the role="menu" list itself and can be placed on the page without a trigger (inside your own popup, for instance). There is no closing in that case: picking an item only calls onSelect.',
        )}
      >
        <Demo code={t(CODE_STANDALONE.zh, CODE_STANDALONE.en)}>
          <div style={{ width: 220 }}>
            <Menu aria-label={t('快捷操作', 'Quick actions')}>
              <MenuItem icon="mail">{t('发邮件', 'Send email')}</MenuItem>
              <MenuItem icon="bell">{t('设置提醒', 'Set reminder')}</MenuItem>
              <MenuItem icon="sparkle" disabled>{t('智能整理', 'Smart tidy-up')}</MenuItem>
            </Menu>
          </div>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t<Array<[string, string]>>(
            [
              ['进场', '淡入 + 下移 6px · 150ms ease-out，不缩放'],
              ['高亮块', '90ms ease-out · 紧跟指针，不回弹'],
              ['状态项', '成功 / 警告 / 危险：文字和图标用状态色，高亮换成同色柔和底'],
              ['选中', '中性色对勾，描线画出'],
              ['退场', '90ms ease-in'],
            ],
            [
              ['Enter', 'Fade in + move down 6px · 150ms ease-out, no scaling'],
              ['Highlight', '90ms ease-out · follows the pointer closely, no overshoot'],
              ['Tones', 'Success / warning / danger: text and icon take the status color; the highlight becomes a soft fill of the same hue'],
              ['Check', 'Neutral checkmark, drawn as a stroke'],
              ['Exit', '90ms ease-in'],
            ],
          )}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="DropdownMenu"
          rows={[
            { name: 'trigger', type: 'ReactElement', required: true, description: t('触发元素：要能接收 ref 和事件。', 'Trigger element; it must accept a ref and event handlers.') },
            { name: 'children', type: 'ReactNode', required: true, description: t('菜单项。', 'Menu items.') },
            { name: 'open / defaultOpen', type: 'boolean', default: 'false', description: t('是否打开（受控 / 非受控）。', 'Whether the menu is open (controlled / uncontrolled).') },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: t('开关状态变化时触发。', 'Called when the open state changes.') },
            { name: 'placement', type: 'Placement', default: "'bottom-start'", description: t('相对触发元素的位置。', 'Position relative to the trigger.') },
            { name: 'offset', type: 'number', default: '8', description: t('与触发元素的间距（px）。', 'Gap from the trigger (px).') },
            { name: 'matchTriggerWidth', type: 'boolean', default: 'true', description: t('菜单不窄于触发元素。', 'Keeps the menu at least as wide as the trigger.') },
          ]}
        />
        <PropsTable
          title="MenuItem"
          rows={[
            { name: 'icon', type: 'IconName | ReactNode', description: t('前置图标。', 'Leading icon.') },
            { name: 'shortcut', type: 'ReactNode', description: t('右侧的快捷键提示，只是文字。', 'Shortcut hint on the right; text only.') },
            { name: 'tone', type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: t('状态色。', 'Status color.') },
            { name: 'disabled', type: 'boolean', description: t('禁用：方向键会跳过，点击无效。', 'Disabled: arrow keys skip it and clicks do nothing.') },
            { name: 'onSelect', type: '() => void', description: t('被点选或用 Enter / Space 触发。', 'Called when clicked or activated with Enter / Space.') },
            { name: 'closeOnSelect', type: 'boolean', default: t('true（勾选 / 单选项为 false）', 'true (false for checkbox / radio items)'), description: t('触发后是否收起整个菜单。', 'Whether activating it closes the whole menu.') },
            { name: 'textValue', type: 'string', description: t('首字母跳转用的文字；默认取项里的文字内容。', 'Text used for type-ahead; defaults to the item’s text content.') },
          ]}
        />
        <PropsTable
          title="MenuCheckboxItem / MenuRadioGroup / MenuRadioItem / MenuSub"
          rows={[
            { name: 'MenuCheckboxItem · checked / defaultChecked', type: 'boolean', description: t('是否勾选（受控 / 非受控）。', 'Whether it is checked (controlled / uncontrolled).') },
            { name: 'MenuCheckboxItem · onCheckedChange', type: '(checked: boolean) => void', description: t('勾选状态变化时触发。', 'Called when the checked state changes.') },
            { name: 'MenuRadioGroup · value / defaultValue', type: 'string | null', description: t('选中项（受控 / 非受控）。', 'Selected item (controlled / uncontrolled).') },
            { name: 'MenuRadioGroup · onChange', type: '(value: string) => void', description: t('选中项变化时触发。', 'Called when the selection changes.') },
            { name: 'MenuRadioItem · value', type: 'string', required: true, description: t('这一项的值，必须放在 MenuRadioGroup 里。', 'Value of this item; must be inside a MenuRadioGroup.') },
            { name: 'MenuSub · label', type: 'ReactNode', required: true, description: t('触发项上的文字。', 'Text on the parent item.') },
            { name: 'MenuSub · children', type: 'ReactNode', required: true, description: t('子菜单里的项。', 'Items in the submenu.') },
            { name: 'MenuSub · icon / tone / disabled', type: '—', description: t('同 MenuItem。', 'Same as MenuItem.') },
          ]}
        />
        <PropsTable
          title="Menu"
          rows={[
            { name: 'focusOnOpen', type: "'first' | 'last' | 'menu' | null", description: t('挂载时把焦点放到哪；null 表示不动焦点。', 'Where to put focus on mount; null leaves focus alone.') },
            { name: 'bare', type: 'boolean', description: t('不带浮层表面（放在自己的浮层里时用）。', 'Renders without the popup surface (for use inside your own popup).') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>触发按钮带 <code>aria-haspopup="menu"</code> 和 <code>aria-expanded</code>；菜单是 <code>role="menu"</code>，各项是 <code>menuitem</code> / <code>menuitemcheckbox</code> / <code>menuitemradio</code>，分隔线是 <code>separator</code>。</>,
              <>在触发按钮上：<kbd>Enter</kbd> / <kbd>Space</kbd> / <kbd>↓</kbd> 打开并聚焦第一项，<kbd>↑</kbd> 打开并聚焦最后一项。鼠标点开时焦点在菜单本身，不预先高亮任何项。</>,
              <>在菜单里：<kbd>↑</kbd> <kbd>↓</kbd> 移动（循环），<kbd>Home</kbd> / <kbd>End</kbd> 到两端，<kbd>Enter</kbd> / <kbd>Space</kbd> 触发，打字母跳到以它开头的项。</>,
              <>子菜单：<kbd>→</kbd> 展开并进入，<kbd>←</kbd> 或 <kbd>Esc</kbd> 收回到父项。</>,
              <><kbd>Esc</kbd> 关闭并把焦点还给触发按钮；<kbd>Tab</kbd> 关闭菜单并移到触发按钮之后的下一个元素。</>,
              <>禁用项是 <code>aria-disabled</code>，方向键会跳过。状态色项除了颜色还应该有图标或明确的文字。</>,
            ],
            [
              <>The trigger carries <code>aria-haspopup="menu"</code> and <code>aria-expanded</code>; the menu is <code>role="menu"</code>, items are <code>menuitem</code> / <code>menuitemcheckbox</code> / <code>menuitemradio</code>, and separators are <code>separator</code>.</>,
              <>On the trigger: <kbd>Enter</kbd> / <kbd>Space</kbd> / <kbd>↓</kbd> open the menu and focus the first item; <kbd>↑</kbd> opens it and focuses the last. When opened with the mouse, focus is on the menu itself and no item is highlighted in advance.</>,
              <>In the menu: <kbd>↑</kbd> <kbd>↓</kbd> move (wrapping), <kbd>Home</kbd> / <kbd>End</kbd> go to either end, <kbd>Enter</kbd> / <kbd>Space</kbd> activate, and typing a letter jumps to the next item starting with it.</>,
              <>Submenus: <kbd>→</kbd> opens and enters, <kbd>←</kbd> or <kbd>Esc</kbd> returns to the parent item.</>,
              <><kbd>Esc</kbd> closes the menu and returns focus to the trigger; <kbd>Tab</kbd> closes it and moves to the element after the trigger.</>,
              <>Disabled items are <code>aria-disabled</code> and skipped by the arrow keys. Tone items should carry an icon or explicit wording, not just color.</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
