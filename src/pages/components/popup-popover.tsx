import { useRef, useState } from 'react';
import { Button, Field, Heading, Icon, Inline, Input, Popover, Stack, Switch, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/popover', title: 'Popover 气泡卡片', group: '浮层', order: 10, subtitle: 'Popover', en: { title: 'Popover' } };

function RenameDemo() {
  const t = useT();
  const [name, setName] = useState(t('未命名项目', 'Untitled project'));
  const [draft, setDraft] = useState(name);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Popover
        aria-label={t('重命名', 'Rename')}
        open={open}
        onOpenChange={(next) => { setOpen(next); if (next) setDraft(name); }}
        trigger={<Button leading={<Icon name="edit" />}>{t('重命名', 'Rename')}</Button>}
      >
        {({ close }) => (
          <Stack gap={3} style={{ width: 260 }}>
            <Field label={t('项目名称', 'Project name')}>
              <Input value={draft} onChange={setDraft} data-autofocus />
            </Field>
            <Inline gap={2} justify="end">
              <Button size="sm" variant="ghost" onClick={close}>{t('取消', 'Cancel')}</Button>
              <Button size="sm" variant="primary" disabled={!draft.trim()} onClick={() => { setName(draft.trim()); close(); }}>{t('保存', 'Save')}</Button>
            </Inline>
          </Stack>
        )}
      </Popover>
      <Text tone="subtle" variant="caption">
        {t(<>当前名称：{name} · 浮层{open ? '已打开' : '已关闭'}</>, <>Current name: {name} · Popover {open ? 'open' : 'closed'}</>)}
      </Text>
    </Stack>
  );
}

function AnchorDemo() {
  const t = useT();
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <Inline gap={3} ref={anchor} style={{ padding: 8, borderRadius: 16, background: 'var(--ok-well)' }}>
      <Text variant="caption" tone="subtle">{t('浮层相对这一整条定位', 'The popover is positioned against this whole strip')}</Text>
      <Popover aria-label={t('说明', 'Note')} anchorRef={anchor} matchWidth placement="bottom" trigger={<Button size="sm">{t('打开', 'Open')}</Button>}>
        <Text>{t('和锚点等宽。', 'As wide as the anchor.')}</Text>
      </Popover>
    </Inline>
  );
}

const CODE_BASIC = {
  zh: `
<Popover aria-label="通知设置" trigger={<Button leading={<Icon name="sliders" />}>通知设置</Button>}>
  <Stack gap={3} style={{ width: 240 }}>
    <Heading level={4} variant="h4">通知设置</Heading>
    <Switch defaultChecked>评论与回复</Switch>
    <Switch>每周摘要</Switch>
    <Switch defaultChecked>安全提醒</Switch>
  </Stack>
</Popover>
`,
  en: `
<Popover aria-label="Notification settings" trigger={<Button leading={<Icon name="sliders" />}>Notifications</Button>}>
  <Stack gap={3} style={{ width: 240 }}>
    <Heading level={4} variant="h4">Notification settings</Heading>
    <Switch defaultChecked>Comments and replies</Switch>
    <Switch>Weekly digest</Switch>
    <Switch defaultChecked>Security alerts</Switch>
  </Stack>
</Popover>
`,
};

const CODE_PLACEMENT = {
  zh: `
<Popover aria-label="上方" placement="top" trigger={<Button>top</Button>}><Text>在上方，居中</Text></Popover>
<Popover aria-label="下方靠左" placement="bottom-start" trigger={<Button>bottom-start</Button>}><Text>在下方，左对齐</Text></Popover>
<Popover aria-label="下方靠右" placement="bottom-end" trigger={<Button>bottom-end</Button>}><Text>在下方，右对齐</Text></Popover>
<Popover aria-label="右侧" placement="right" offset={16} trigger={<Button>right · 间距 16</Button>}><Text>在右侧</Text></Popover>
`,
  en: `
<Popover aria-label="Above" placement="top" trigger={<Button>top</Button>}><Text>Above, centered</Text></Popover>
<Popover aria-label="Below, left" placement="bottom-start" trigger={<Button>bottom-start</Button>}><Text>Below, left-aligned</Text></Popover>
<Popover aria-label="Below, right" placement="bottom-end" trigger={<Button>bottom-end</Button>}><Text>Below, right-aligned</Text></Popover>
<Popover aria-label="Right" placement="right" offset={16} trigger={<Button>right · offset 16</Button>}><Text>To the right</Text></Popover>
`,
};

const CODE_RENAME = {
  zh: `
function RenameDemo() {
  const [name, setName] = useState('未命名项目');
  const [draft, setDraft] = useState(name);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Popover
        aria-label="重命名"
        open={open}
        onOpenChange={(next) => { setOpen(next); if (next) setDraft(name); }}
        trigger={<Button leading={<Icon name="edit" />}>重命名</Button>}
      >
        {({ close }) => (
          <Stack gap={3} style={{ width: 260 }}>
            <Field label="项目名称">
              <Input value={draft} onChange={setDraft} data-autofocus />
            </Field>
            <Inline gap={2} justify="end">
              <Button size="sm" variant="ghost" onClick={close}>取消</Button>
              <Button size="sm" variant="primary" disabled={!draft.trim()} onClick={() => { setName(draft.trim()); close(); }}>保存</Button>
            </Inline>
          </Stack>
        )}
      </Popover>
      <Text tone="subtle" variant="caption">当前名称：{name} · 浮层{open ? '已打开' : '已关闭'}</Text>
    </Stack>
  );
}
`,
  en: `
function RenameDemo() {
  const [name, setName] = useState('Untitled project');
  const [draft, setDraft] = useState(name);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Popover
        aria-label="Rename"
        open={open}
        onOpenChange={(next) => { setOpen(next); if (next) setDraft(name); }}
        trigger={<Button leading={<Icon name="edit" />}>Rename</Button>}
      >
        {({ close }) => (
          <Stack gap={3} style={{ width: 260 }}>
            <Field label="Project name">
              <Input value={draft} onChange={setDraft} data-autofocus />
            </Field>
            <Inline gap={2} justify="end">
              <Button size="sm" variant="ghost" onClick={close}>Cancel</Button>
              <Button size="sm" variant="primary" disabled={!draft.trim()} onClick={() => { setName(draft.trim()); close(); }}>Save</Button>
            </Inline>
          </Stack>
        )}
      </Popover>
      <Text tone="subtle" variant="caption">Current name: {name} · Popover {open ? 'open' : 'closed'}</Text>
    </Stack>
  );
}
`,
};

const CODE_CLOSE = {
  zh: `
<Popover aria-label="需要手动关闭" closeOnOutsidePress={false} closeOnEscape={false} trigger={<Button>只能用按钮关闭</Button>}>
  {({ close }) => (
    <Stack gap={3} style={{ width: 220 }}>
      <Text>点外面和按 Esc 都不会关闭。</Text>
      <Button size="sm" variant="primary" onClick={close}>知道了</Button>
    </Stack>
  )}
</Popover>
<Button disabled>禁用的触发按钮</Button>
`,
  en: `
<Popover aria-label="Close manually" closeOnOutsidePress={false} closeOnEscape={false} trigger={<Button>Button-only close</Button>}>
  {({ close }) => (
    <Stack gap={3} style={{ width: 220 }}>
      <Text>Clicking outside or pressing Esc won’t close this.</Text>
      <Button size="sm" variant="primary" onClick={close}>Got it</Button>
    </Stack>
  )}
</Popover>
<Button disabled>Disabled trigger</Button>
`,
};

const CODE_ANCHOR = {
  zh: `
function AnchorDemo() {
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <Inline gap={3} ref={anchor} style={{ padding: 8, borderRadius: 16, background: 'var(--ok-well)' }}>
      <Text variant="caption" tone="subtle">浮层相对这一整条定位</Text>
      <Popover aria-label="说明" anchorRef={anchor} matchWidth placement="bottom" trigger={<Button size="sm">打开</Button>}>
        <Text>和锚点等宽。</Text>
      </Popover>
    </Inline>
  );
}
`,
  en: `
function AnchorDemo() {
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <Inline gap={3} ref={anchor} style={{ padding: 8, borderRadius: 16, background: 'var(--ok-well)' }}>
      <Text variant="caption" tone="subtle">The popover is positioned against this whole strip</Text>
      <Popover aria-label="Note" anchorRef={anchor} matchWidth placement="bottom" trigger={<Button size="sm">Open</Button>}>
        <Text>As wide as the anchor.</Text>
      </Popover>
    </Inline>
  );
}
`,
};

export default function PopoverPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={meta.subtitle}
      lead={t(
        '点击一个按钮，在它旁边弹出一小块可以交互的内容：筛选条件、快速编辑、补充设置。它不打断页面（非模态）。只是一句说明用 Tooltip；一串操作用 Menu；需要用户必须处理完才能继续时用 Dialog。',
        'Click a button to open a small piece of interactive content next to it: filters, a quick edit, extra settings. It doesn’t interrupt the page (non-modal). For a single line of explanation use Tooltip; for a list of actions use Menu; when people must deal with something before continuing, use Dialog.',
      )}
    >
      <DocSection
        title={t('基本用法', 'Basic usage')}
        description={t(
          'trigger 是一个能接收 ref 和事件的元素，通常是 Button。打开时焦点移进浮层，Esc 或点外面关闭，关闭后焦点回到触发按钮。记得给浮层 aria-label。',
          'trigger is an element that accepts a ref and event handlers, usually a Button. Opening moves focus into the popover; Esc or clicking outside closes it, and focus returns to the trigger. Remember to give the popover an aria-label.',
        )}
      >
        <Demo
          minHeight={220}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_BASIC.zh, CODE_BASIC.en)}
        >
          <Popover aria-label={t('通知设置', 'Notification settings')} trigger={<Button leading={<Icon name="sliders" />}>{t('通知设置', 'Notifications')}</Button>}>
            <Stack gap={3} style={{ width: 240 }}>
              <Heading level={4} variant="h4">{t('通知设置', 'Notification settings')}</Heading>
              <Switch defaultChecked>{t('评论与回复', 'Comments and replies')}</Switch>
              <Switch>{t('每周摘要', 'Weekly digest')}</Switch>
              <Switch defaultChecked>{t('安全提醒', 'Security alerts')}</Switch>
            </Stack>
          </Popover>
        </Demo>
      </DocSection>

      <DocSection
        title={t('位置', 'Placement')}
        description={t(
          'placement 由“方向”和可选的“对齐”组成，默认 bottom（居中）。放不下时自动翻到对面，并沿边缘平移回视口内。',
          'placement combines a side with an optional alignment; the default is bottom (centered). When it doesn’t fit, it flips to the opposite side and shifts along the edge to stay in the viewport.',
        )}
      >
        <Demo
          minHeight={260}
          style={{ alignContent: 'center' }}
          code={t(CODE_PLACEMENT.zh, CODE_PLACEMENT.en)}
        >
          <Popover aria-label={t('上方', 'Above')} placement="top" trigger={<Button>top</Button>}><Text>{t('在上方，居中', 'Above, centered')}</Text></Popover>
          <Popover aria-label={t('下方靠左', 'Below, left')} placement="bottom-start" trigger={<Button>bottom-start</Button>}><Text>{t('在下方，左对齐', 'Below, left-aligned')}</Text></Popover>
          <Popover aria-label={t('下方靠右', 'Below, right')} placement="bottom-end" trigger={<Button>bottom-end</Button>}><Text>{t('在下方，右对齐', 'Below, right-aligned')}</Text></Popover>
          <Popover aria-label={t('右侧', 'Right')} placement="right" offset={16} trigger={<Button>{t('right · 间距 16', 'right · offset 16')}</Button>}><Text>{t('在右侧', 'To the right')}</Text></Popover>
        </Demo>
      </DocSection>

      <DocSection
        title={t('受控与关闭', 'Control and closing')}
        description={t(
          'children 传函数可以拿到 close（关闭并把焦点还给触发按钮）。用 open / onOpenChange 受控。想指定打开时聚焦谁，给那个元素加 data-autofocus，或传 initialFocus。',
          'Pass a function as children to get close (which closes and returns focus to the trigger). Control it with open / onOpenChange. To choose what gets focus on open, add data-autofocus to that element or pass initialFocus.',
        )}
      >
        <Demo
          minHeight={260}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_RENAME.zh, CODE_RENAME.en)}
        >
          <RenameDemo />
        </Demo>
        <Demo
          title={t('关闭方式', 'Ways to close')}
          description={t(
            'closeOnOutsidePress / closeOnEscape 可以分别关掉。两个都关时，浮层里必须有一个明确的关闭按钮。',
            'closeOnOutsidePress / closeOnEscape can each be turned off. With both off, the popover must contain an explicit close button.',
          )}
          minHeight={200}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_CLOSE.zh, CODE_CLOSE.en)}
        >
          <Popover aria-label={t('需要手动关闭', 'Close manually')} closeOnOutsidePress={false} closeOnEscape={false} trigger={<Button>{t('只能用按钮关闭', 'Button-only close')}</Button>}>
            {({ close }) => (
              <Stack gap={3} style={{ width: 220 }}>
                <Text>{t('点外面和按 Esc 都不会关闭。', 'Clicking outside or pressing Esc won’t close this.')}</Text>
                <Button size="sm" variant="primary" onClick={close}>{t('知道了', 'Got it')}</Button>
              </Stack>
            )}
          </Popover>
          <Button disabled>{t('禁用的触发按钮', 'Disabled trigger')}</Button>
        </Demo>
      </DocSection>

      <DocSection
        title={t('相对别的元素定位', 'Anchoring to another element')}
        description={t(
          "anchorRef 让浮层相对另一个元素定位（触发按钮仍然负责开关）。matchWidth 让浮层和锚点等宽，'min' 表示不窄于锚点。",
          "anchorRef positions the popover against another element (the trigger still opens and closes it). matchWidth makes it as wide as the anchor; 'min' keeps it at least as wide.",
        )}
      >
        <Demo
          minHeight={180}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_ANCHOR.zh, CODE_ANCHOR.en)}
        >
          <AnchorDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'trigger', type: 'ReactElement', required: true, description: t('触发元素：要能接收 ref 和事件。会被补上 aria-haspopup、aria-expanded、aria-controls 和 onClick。', 'Trigger element; it must accept a ref and event handlers. aria-haspopup, aria-expanded, aria-controls and onClick are added to it.') },
            { name: 'children', type: 'ReactNode | ({ close }) => ReactNode', required: true, description: t('内容；传函数可以拿到 close。', 'Content; pass a function to receive close.') },
            { name: 'open', type: 'boolean', description: t('是否打开（受控）。', 'Whether it is open (controlled).') },
            { name: 'defaultOpen', type: 'boolean', default: 'false', description: t('初始是否打开（非受控）。', 'Whether it starts open (uncontrolled).') },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: t('开关状态变化时触发。', 'Called when the open state changes.') },
            { name: 'placement', type: t("'top' | 'bottom' | 'left' | 'right' 及其 -start / -end", "'top' | 'bottom' | 'left' | 'right' and their -start / -end"), default: "'bottom'", description: t('相对锚点的位置。', 'Position relative to the anchor.') },
            { name: 'offset', type: 'number', default: '8', description: t('与锚点的间距（px）。', 'Gap from the anchor (px).') },
            { name: 'matchWidth', type: "boolean | 'min'", default: 'false', description: t("true：与锚点等宽；'min'：不窄于锚点。", "true: as wide as the anchor; 'min': at least as wide as the anchor.") },
            { name: 'anchorRef', type: 'RefObject<Element>', description: t('相对另一个元素定位，默认相对触发元素。', 'Position against another element; defaults to the trigger.') },
            { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: t('打开时聚焦的元素；不传则找 [data-autofocus]，再是第一个可聚焦元素，最后是浮层本身。', 'Element to focus on open; otherwise [data-autofocus], then the first focusable element, then the popover itself.') },
            { name: 'autoFocus', type: 'boolean', default: 'true', description: t('打开时是否把焦点移进去。', 'Whether to move focus inside on open.') },
            { name: 'closeOnOutsidePress', type: 'boolean', default: 'true', description: t('点外面关闭。', 'Close when clicking outside.') },
            { name: 'closeOnEscape', type: 'boolean', default: 'true', description: t('按 Esc 关闭。', 'Close on Esc.') },
            { name: 'role', type: 'string', default: "'dialog'", description: t('浮层的角色。', 'Role of the popover.') },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: t('其余属性（aria-label、className…）和 ref 落在浮层上。', 'Other attributes (aria-label, className…) and ref go on the popover.') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>浮层是 <code>role="dialog"</code>（非模态），请用 <code>aria-label</code> 或 <code>aria-labelledby</code> 给它起名。触发元素带 <code>aria-haspopup="dialog"</code> 和 <code>aria-expanded</code>。</>,
              <><kbd>Enter</kbd> / <kbd>Space</kbd> 在触发按钮上打开或关闭；打开后焦点移进浮层。</>,
              <><kbd>Esc</kbd> 关闭并把焦点还给触发按钮；点外面关闭时不抢焦点。</>,
              <>不困住焦点：<kbd>Tab</kbd> 走过最后一个元素（或 <kbd>Shift</kbd>+<kbd>Tab</kbd> 走过第一个）时浮层关闭，焦点从触发按钮继续往下（上）走。</>,
              <>浮层渲染在 body 末尾的 portal 里；嵌套的浮层（浮层里的 Select 等）点击时不算“点外面”。</>,
              <>不要用悬停触发 Popover——触屏和键盘用户用不了。</>,
            ],
            [
              <>The popover is <code>role="dialog"</code> (non-modal); name it with <code>aria-label</code> or <code>aria-labelledby</code>. The trigger carries <code>aria-haspopup="dialog"</code> and <code>aria-expanded</code>.</>,
              <><kbd>Enter</kbd> / <kbd>Space</kbd> on the trigger open or close it; once open, focus moves inside.</>,
              <><kbd>Esc</kbd> closes it and returns focus to the trigger; closing by clicking outside doesn’t steal focus.</>,
              <>Focus is not trapped: tabbing past the last element (or <kbd>Shift</kbd>+<kbd>Tab</kbd> past the first) closes the popover, and focus continues forward (or back) from the trigger.</>,
              <>The popover renders in a portal at the end of body; clicks in nested popups (a Select inside the popover, say) don’t count as clicking outside.</>,
              <>Don’t open a Popover on hover: touch screen and keyboard users can’t use it.</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
