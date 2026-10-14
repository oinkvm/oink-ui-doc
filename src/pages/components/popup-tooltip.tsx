import { useState } from 'react';
import { Button, ButtonGroup, Icon, Kbd, Stack, Switch, Tooltip } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/tooltip', title: 'Tooltip 文字提示', group: '浮层', order: 20, subtitle: 'Tooltip', en: { title: 'Tooltip' } };

function ControlledDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={4} align="center">
      <Tooltip content={t('由外部状态控制', 'Controlled by outside state')} open={open} onOpenChange={setOpen}>
        <Button>{t('悬停或用开关控制', 'Hover, or use the switch')}</Button>
      </Tooltip>
      <Switch checked={open} onChange={setOpen}>{t('显示提示', 'Show tooltip')}</Switch>
    </Stack>
  );
}

const CODE_BASIC = {
  zh: `
<ButtonGroup aria-label="编辑操作">
  <Tooltip content="复制">
    <Button iconOnly variant="ghost" aria-label="复制"><Icon name="copy" /></Button>
  </Tooltip>
  <Tooltip content="分享">
    <Button iconOnly variant="ghost" aria-label="分享"><Icon name="share" /></Button>
  </Tooltip>
  <Tooltip content="下载">
    <Button iconOnly variant="ghost" aria-label="下载"><Icon name="download" /></Button>
  </Tooltip>
  <Tooltip content="删除后 30 天内可以恢复">
    <Button iconOnly variant="ghost" aria-label="删除"><Icon name="trash" /></Button>
  </Tooltip>
</ButtonGroup>
`,
  en: `
<ButtonGroup aria-label="Edit actions">
  <Tooltip content="Copy">
    <Button iconOnly variant="ghost" aria-label="Copy"><Icon name="copy" /></Button>
  </Tooltip>
  <Tooltip content="Share">
    <Button iconOnly variant="ghost" aria-label="Share"><Icon name="share" /></Button>
  </Tooltip>
  <Tooltip content="Download">
    <Button iconOnly variant="ghost" aria-label="Download"><Icon name="download" /></Button>
  </Tooltip>
  <Tooltip content="Can be restored within 30 days of deletion">
    <Button iconOnly variant="ghost" aria-label="Delete"><Icon name="trash" /></Button>
  </Tooltip>
</ButtonGroup>
`,
};

const CODE_SHORTCUT = {
  zh: `
<Tooltip content="保存" shortcut="⌘S">
  <Button>保存</Button>
</Tooltip>
<Tooltip content="搜索|⌘K">
  <Button leading={<Icon name="search" />}>搜索</Button>
</Tooltip>
<Tooltip content="发送" shortcut={<><Kbd k="Meta" size="sm" /> <Kbd k="Enter" size="sm" /></>}>
  <Button variant="primary">发送</Button>
</Tooltip>
`,
  en: `
<Tooltip content="Save" shortcut="⌘S">
  <Button>Save</Button>
</Tooltip>
<Tooltip content="Search|⌘K">
  <Button leading={<Icon name="search" />}>Search</Button>
</Tooltip>
<Tooltip content="Send" shortcut={<><Kbd k="Meta" size="sm" /> <Kbd k="Enter" size="sm" /></>}>
  <Button variant="primary">Send</Button>
</Tooltip>
`,
};

const CODE_PLACEMENT = {
  zh: `
<Tooltip content="上方（默认）" placement="top"><Button>top</Button></Tooltip>
<Tooltip content="下方" placement="bottom"><Button>bottom</Button></Tooltip>
<Tooltip content="左侧" placement="left"><Button>left</Button></Tooltip>
<Tooltip content="右侧" placement="right"><Button>right</Button></Tooltip>
<Tooltip content="没有延迟" delay={0}><Button variant="outline">立即出现</Button></Tooltip>
<Tooltip content="离开后多停留一会儿" hideDelay={800}><Button variant="outline">慢慢收起</Button></Tooltip>
`,
  en: `
<Tooltip content="Above (default)" placement="top"><Button>top</Button></Tooltip>
<Tooltip content="Below" placement="bottom"><Button>bottom</Button></Tooltip>
<Tooltip content="Left" placement="left"><Button>left</Button></Tooltip>
<Tooltip content="Right" placement="right"><Button>right</Button></Tooltip>
<Tooltip content="No delay" delay={0}><Button variant="outline">Instant</Button></Tooltip>
<Tooltip content="Lingers a little after you leave" hideDelay={800}><Button variant="outline">Slow to hide</Button></Tooltip>
`,
};

const CODE_DISABLED = {
  zh: `
<Tooltip content="需要管理员权限">
  <Button aria-disabled="true">删除团队</Button>
</Tooltip>
<Tooltip content="这条提示被关掉了" disabled>
  <Button>不显示提示</Button>
</Tooltip>
`,
  en: `
<Tooltip content="Requires admin permissions">
  <Button aria-disabled="true">Delete team</Button>
</Tooltip>
<Tooltip content="This tooltip is turned off" disabled>
  <Button>No tooltip</Button>
</Tooltip>
`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={4} align="center">
      <Tooltip content="由外部状态控制" open={open} onOpenChange={setOpen}>
        <Button>悬停或用开关控制</Button>
      </Tooltip>
      <Switch checked={open} onChange={setOpen}>显示提示</Switch>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={4} align="center">
      <Tooltip content="Controlled by outside state" open={open} onOpenChange={setOpen}>
        <Button>Hover, or use the switch</Button>
      </Tooltip>
      <Switch checked={open} onChange={setOpen}>Show tooltip</Switch>
    </Stack>
  );
}
`,
};

export default function TooltipPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={meta.subtitle}
      lead={t(
        '悬停或键盘聚焦时，给一个控件补一句简短说明，最常见的是给图标按钮配上名字和快捷键。触屏上不显示，所以不要把必要信息只放在提示里；需要可点击的内容用 Popover。',
        'A short note attached to a control on hover or keyboard focus, most often the name and shortcut of an icon button. Tooltips don’t appear on touch screens, so never put essential information only in a tooltip; for clickable content, use Popover.',
      )}
    >
      <DocSection
        title={t('基本用法', 'Basic usage')}
        description={t(
          '把被提示的元素作为 children 传入。首次出现有 380ms 延迟；一个提示刚收起后马上移到相邻的目标，新提示会立即出现并滑过去。',
          'Pass the target element as children. The first tooltip appears after a 380ms delay; move to a neighboring target right after one hides and the new tooltip appears immediately, sliding over.',
        )}
      >
        <Demo
          minHeight={140}
          style={{ alignContent: 'center' }}
          code={t(CODE_BASIC.zh, CODE_BASIC.en)}
        >
          <ButtonGroup aria-label={t('编辑操作', 'Edit actions')}>
            <Tooltip content={t('复制', 'Copy')}>
              <Button iconOnly variant="ghost" aria-label={t('复制', 'Copy')}><Icon name="copy" /></Button>
            </Tooltip>
            <Tooltip content={t('分享', 'Share')}>
              <Button iconOnly variant="ghost" aria-label={t('分享', 'Share')}><Icon name="share" /></Button>
            </Tooltip>
            <Tooltip content={t('下载', 'Download')}>
              <Button iconOnly variant="ghost" aria-label={t('下载', 'Download')}><Icon name="download" /></Button>
            </Tooltip>
            <Tooltip content={t('删除后 30 天内可以恢复', 'Can be restored within 30 days of deletion')}>
              <Button iconOnly variant="ghost" aria-label={t('删除', 'Delete')}><Icon name="trash" /></Button>
            </Tooltip>
          </ButtonGroup>
        </Demo>
      </DocSection>

      <DocSection
        title={t('快捷键', 'Shortcuts')}
        description={t(
          '用 shortcut 在文字后面显示快捷键；内容是字符串时也可以写成“文字|快捷键”。',
          'Use shortcut to show a key combination after the text; when content is a string you can also write it as “text|shortcut”.',
        )}
      >
        <Demo
          minHeight={140}
          style={{ alignContent: 'center' }}
          code={t(CODE_SHORTCUT.zh, CODE_SHORTCUT.en)}
        >
          <Tooltip content={t('保存', 'Save')} shortcut="⌘S">
            <Button>{t('保存', 'Save')}</Button>
          </Tooltip>
          <Tooltip content={t('搜索|⌘K', 'Search|⌘K')}>
            <Button leading={<Icon name="search" />}>{t('搜索', 'Search')}</Button>
          </Tooltip>
          <Tooltip content={t('发送', 'Send')} shortcut={<><Kbd k="Meta" size="sm" /> <Kbd k="Enter" size="sm" /></>}>
            <Button variant="primary">{t('发送', 'Send')}</Button>
          </Tooltip>
        </Demo>
      </DocSection>

      <DocSection title={t('位置与延迟', 'Placement and delay')}>
        <Demo
          minHeight={180}
          style={{ alignContent: 'center' }}
          code={t(CODE_PLACEMENT.zh, CODE_PLACEMENT.en)}
        >
          <Tooltip content={t('上方（默认）', 'Above (default)')} placement="top"><Button>top</Button></Tooltip>
          <Tooltip content={t('下方', 'Below')} placement="bottom"><Button>bottom</Button></Tooltip>
          <Tooltip content={t('左侧', 'Left')} placement="left"><Button>left</Button></Tooltip>
          <Tooltip content={t('右侧', 'Right')} placement="right"><Button>right</Button></Tooltip>
          <Tooltip content={t('没有延迟', 'No delay')} delay={0}><Button variant="outline">{t('立即出现', 'Instant')}</Button></Tooltip>
          <Tooltip content={t('离开后多停留一会儿', 'Lingers a little after you leave')} hideDelay={800}><Button variant="outline">{t('慢慢收起', 'Slow to hide')}</Button></Tooltip>
        </Demo>
      </DocSection>

      <DocSection
        title={t('禁用的目标', 'Disabled targets')}
        description={t(
          '原生 disabled 的按钮不触发指针和焦点事件，提示出不来。想解释“为什么不可用”，给按钮用 aria-disabled：它仍可聚焦，点击会被拦下。Tooltip 自己的 disabled 则是暂时不显示提示。',
          'A natively disabled button fires no pointer or focus events, so its tooltip never shows. To explain why something is unavailable, use aria-disabled on the button instead: it stays focusable and clicks are blocked. Tooltip’s own disabled prop simply hides the tooltip for now.',
        )}
      >
        <Demo
          minHeight={140}
          style={{ alignContent: 'center' }}
          code={t(CODE_DISABLED.zh, CODE_DISABLED.en)}
        >
          <Tooltip content={t('需要管理员权限', 'Requires admin permissions')}>
            <Button aria-disabled="true">{t('删除团队', 'Delete team')}</Button>
          </Tooltip>
          <Tooltip content={t('这条提示被关掉了', 'This tooltip is turned off')} disabled>
            <Button>{t('不显示提示', 'No tooltip')}</Button>
          </Tooltip>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')}>
        <Demo
          minHeight={180}
          style={{ alignContent: 'center' }}
          code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}
        >
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t<Array<[string, string]>>(
            [
              ['延迟', '首次 380ms · 320ms 内再次悬停立即出现'],
              ['进场', '上移 6px + scale .86 → 1 · 弹簧'],
              ['热切换', 'left / top · spring-snappy'],
              ['可停留', '提示与目标之间无缝衔接 · 离开 160ms 后收起'],
              ['可选中', '文字可选中复制'],
            ],
            [
              ['Delay', '380ms the first time · instant when hovering again within 320ms'],
              ['Enter', 'Move up 6px + scale .86 → 1 · spring'],
              ['Handoff', 'left / top · spring-snappy'],
              ['Hoverable', 'No gap between tooltip and target · hides 160ms after leaving'],
              ['Selectable', 'Text can be selected and copied'],
            ],
          )}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'content', type: 'ReactNode', required: true, description: t('提示文字。字符串可以写成“文字|快捷键”。', 'Tooltip text. A string can be written as “text|shortcut”.') },
            { name: 'shortcut', type: 'ReactNode', description: t('快捷键提示位。', 'Slot for a shortcut hint.') },
            { name: 'children', type: 'ReactElement', required: true, description: t('被提示的元素：要能接收 ref 和事件。', 'Target element; it must accept a ref and event handlers.') },
            { name: 'placement', type: 'Placement', default: "'top'", description: t('位置，放不下时自动翻面。', 'Position; flips automatically when it doesn’t fit.') },
            { name: 'offset', type: 'number', default: '8', description: t('与目标的间距（px）。', 'Gap from the target (px).') },
            { name: 'delay', type: 'number', default: '380', description: t('首次出现前的等待（ms）。键盘聚焦不等待。', 'Wait before the first appearance (ms). Keyboard focus shows it without waiting.') },
            { name: 'skipDelayWithin', type: 'number', default: '320', description: t('上一个提示收起后多久之内再次悬停可以跳过等待（ms）。', 'Window after the previous tooltip hides in which hovering skips the wait (ms).') },
            { name: 'hideDelay', type: 'number', default: '160', description: t('指针离开后多久收起（ms），期间可以把指针移到提示上。', 'How long after the pointer leaves before hiding (ms); the pointer can move onto the tooltip in the meantime.') },
            { name: 'disabled', type: 'boolean', description: t('不显示提示。', 'Hides the tooltip.') },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: t('受控与非受控的显示状态。', 'Visibility, controlled or uncontrolled.') },
            { name: 'className', type: 'string', description: t('提示气泡的类名。', 'Class name for the tooltip bubble.') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>气泡是 <code>role="tooltip"</code>，显示时通过 <code>aria-describedby</code> 关联到目标——它是“描述”，不是名称。图标按钮仍然要有自己的 <code>aria-label</code>。</>,
              <>键盘聚焦目标时显示，失焦收起；<kbd>Esc</kbd> 立即收起（不影响外层浮层的焦点）。</>,
              <>指针可以移到提示上停留，文字可以选中复制（满足 WCAG 1.4.13：可悬停、可关闭、不自动消失）。</>,
              <>触屏上不显示：触屏没有悬停，长按留给系统菜单。必要的信息请直接写在界面上。</>,
              <>同一时间只显示一个提示。</>,
            ],
            [
              <>The bubble is <code>role="tooltip"</code> and, while shown, is linked to the target via <code>aria-describedby</code>: it is a description, not a name. Icon buttons still need their own <code>aria-label</code>.</>,
              <>It shows when the target gets keyboard focus and hides on blur; <kbd>Esc</kbd> hides it immediately (without affecting focus in an enclosing popup).</>,
              <>The pointer can rest on the tooltip, and its text can be selected and copied (meeting WCAG 1.4.13: hoverable, dismissible, persistent).</>,
              <>It doesn’t appear on touch screens: there is no hover, and long-press belongs to the system menu. Put essential information directly in the interface.</>,
              <>Only one tooltip is shown at a time.</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
