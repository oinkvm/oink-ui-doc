import { useState } from 'react';
import { Avatar, Badge, Code, Group, Icon, Row, Segmented, Slider, Surface, Switch, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/group', title: 'Group / Row 设置列表', group: '数据展示', order: 30, subtitle: 'Group · Row', en: { title: 'Group / Row', subtitle: 'Group · Row' } };

const CODE_BASIC = {
  zh: `
<Group>
  <Row label="消息通知" description="有人提到你或回复你时提醒">
    <Switch defaultChecked aria-label="消息通知" />
  </Row>
  <Row label="声音"><Switch aria-label="声音" /></Row>
  <Row label="当前套餐"><Badge tone="accent">专业版</Badge></Row>
</Group>`,
  en: `
<Group>
  <Row label="Notifications" description="Alert me when someone mentions or replies to me">
    <Switch defaultChecked aria-label="Notifications" />
  </Row>
  <Row label="Sound"><Switch aria-label="Sound" /></Row>
  <Row label="Current plan"><Badge tone="accent">Pro</Badge></Row>
</Group>`,
};

const CODE_INTERACTIVE = {
  zh: `
<Group>
  <Row label="个人资料" leading={<Avatar name="林小满" size="sm" />} href="/components/group" />
  <Row label="语言" leading={<Icon name="sliders" />} interactive onClick={() => toast('打开语言选择')}>简体中文</Row>
  <Row label="导出数据" leading={<Icon name="download" />} interactive disabled>暂不可用</Row>
</Group>`,
  en: `
<Group>
  <Row label="Profile" leading={<Avatar name="Ella Morgan" size="sm" />} href="/components/group" />
  <Row label="Language" leading={<Icon name="sliders" />} interactive onClick={() => toast('Language picker opened')}>English</Row>
  <Row label="Export data" leading={<Icon name="download" />} interactive disabled>Unavailable</Row>
</Group>`,
};

const CODE_STACK = {
  zh: `
<Group>
  <Row stack label="字号" description="影响正文和代码块">
    <Slider defaultValue={16} min={12} max={24} aria-label="字号" />
  </Row>
  <Row stack label="外观">
    <Segmented block aria-label="外观" options={[{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }, { value: 'system', label: '跟随系统' }]} />
  </Row>
</Group>`,
  en: `
<Group>
  <Row stack label="Font size" description="Applies to body text and code blocks">
    <Slider defaultValue={16} min={12} max={24} aria-label="Font size" />
  </Row>
  <Row stack label="Appearance">
    <Segmented block aria-label="Appearance" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }, { value: 'system', label: 'System' }]} />
  </Row>
</Group>`,
};

const CODE_COMPACT = {
  zh: `
function CompactDemo() {
  const [compact, setCompact] = useState(false);
  return (
    <Group compact={compact}>
      <Row label="紧凑模式" description="行高 56 → 48，内边距 20 → 16"><Switch checked={compact} onChange={setCompact} aria-label="紧凑模式" /></Row>
      <Row label="自动保存"><Switch defaultChecked aria-label="自动保存" /></Row>
      <Row label="拼写检查"><Switch aria-label="拼写检查" /></Row>
    </Group>
  );
}`,
  en: `
function CompactDemo() {
  const [compact, setCompact] = useState(false);
  return (
    <Group compact={compact}>
      <Row label="Compact mode" description="Row height 56 → 48, padding 20 → 16"><Switch checked={compact} onChange={setCompact} aria-label="Compact mode" /></Row>
      <Row label="Autosave"><Switch defaultChecked aria-label="Autosave" /></Row>
      <Row label="Spell check"><Switch aria-label="Spell check" /></Row>
    </Group>
  );
}`,
};

const CODE_SURFACE = {
  zh: `
<Surface>
  <Group as="ul" aria-label="账号">
    <Row as="li" label="邮箱">xiaoman@example.com</Row>
    <Row as="li" label="两步验证"><Badge tone="success">已开启</Badge></Row>
  </Group>
</Surface>`,
  en: `
<Surface>
  <Group as="ul" aria-label="Account">
    <Row as="li" label="Email">ella@example.com</Row>
    <Row as="li" label="Two-step verification"><Badge tone="success">On</Badge></Row>
  </Group>
</Surface>`,
};

function CompactDemo() {
  const t = useT();
  const [compact, setCompact] = useState(false);
  return (
    <Group compact={compact}>
      <Row label={t('紧凑模式', 'Compact mode')} description={t('行高 56 → 48，内边距 20 → 16', 'Row height 56 → 48, padding 20 → 16')}><Switch checked={compact} onChange={setCompact} aria-label={t('紧凑模式', 'Compact mode')} /></Row>
      <Row label={t('自动保存', 'Autosave')}><Switch defaultChecked aria-label={t('自动保存', 'Autosave')} /></Row>
      <Row label={t('拼写检查', 'Spell check')}><Switch aria-label={t('拼写检查', 'Spell check')} /></Row>
    </Group>
  );
}

export default function GroupPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('一行一个设置项：左边标签，右边控件或当前值。设置页、偏好面板、详情页里的操作列表都用它。', 'One setting per row: a label on the left, a control or the current value on the right. Use it for settings pages, preference panels and action lists on detail pages.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('Group 是带卡片底的容器，Row 之间自动加发丝线。首尾行的内容到上下边的距离被补足到 20，和左右一致。', 'Group is a container on a card background, with hairlines added between Rows automatically. The first and last rows are padded to 20 from the top and bottom edges, matching the sides.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Group>
            <Row label={t('消息通知', 'Notifications')} description={t('有人提到你或回复你时提醒', 'Alert me when someone mentions or replies to me')}>
              <Switch defaultChecked aria-label={t('消息通知', 'Notifications')} />
            </Row>
            <Row label={t('声音', 'Sound')}><Switch aria-label={t('声音', 'Sound')} /></Row>
            <Row label={t('当前套餐', 'Current plan')}><Badge tone="accent">{t('专业版', 'Pro')}</Badge></Row>
          </Group>
        </Demo>
      </DocSection>

      <DocSection title={t('可点击的行', 'Interactive rows')} description={t('传 href 渲染成链接，传 interactive 渲染成按钮；两者末尾都带箭头，children 变成箭头前的当前值（过长时省略）。', 'With href a row renders as a link, with interactive as a button; both get a trailing chevron, and children become the current value before it (truncated when too long).')}>
        <Demo layout="block" code={t(CODE_INTERACTIVE.zh, CODE_INTERACTIVE.en)}>
          <Group>
            <Row label={t('个人资料', 'Profile')} leading={<Avatar name={t('林小满', 'Ella Morgan')} size="sm" />} href="/components/group" />
            <Row label={t('语言', 'Language')} leading={<Icon name="sliders" />} interactive onClick={() => toast(t('打开语言选择', 'Language picker opened'))}>{t('简体中文', 'English')}</Row>
            <Row label={t('导出数据', 'Export data')} leading={<Icon name="download" />} interactive disabled>{t('暂不可用', 'Unavailable')}</Row>
          </Group>
        </Demo>
      </DocSection>

      <DocSection title={t('纵向堆叠', 'Stacked rows')} description={t('滑块、分段选择这类宽控件放不进右侧时，用 stack 把控件放到标签下面并撑满。', 'When a wide control such as a slider or segmented control won’t fit on the right, stack puts it under the label at full width.')}>
        <Demo layout="block" code={t(CODE_STACK.zh, CODE_STACK.en)}>
          <Group>
            <Row stack label={t('字号', 'Font size')} description={t('影响正文和代码块', 'Applies to body text and code blocks')}>
              <Slider defaultValue={16} min={12} max={24} aria-label={t('字号', 'Font size')} />
            </Row>
            <Row stack label={t('外观', 'Appearance')}>
              <Segmented block aria-label={t('外观', 'Appearance')} options={[{ value: 'light', label: t('浅色', 'Light') }, { value: 'dark', label: t('深色', 'Dark') }, { value: 'system', label: t('跟随系统', 'System') }]} />
            </Row>
          </Group>
        </Demo>
      </DocSection>

      <DocSection title={t('紧凑', 'Compact')} description={t('compact 把内边距收到 16、行高收到 48，切换时用 soft 弹簧过渡。信息密度高的侧栏和检查器里用。', 'compact tightens padding to 16 and row height to 48, transitioning on the soft spring. Use it in dense sidebars and inspectors.')}>
        <Demo layout="block" code={t(CODE_COMPACT.zh, CODE_COMPACT.en)}>
          <CompactDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('嵌在面板里', 'Inside a panel')} description={t('独立使用时分组圆角是 24；放进 Surface 后自动取同心值（44 − 16 = 28）。', 'On its own a group has a corner radius of 24; inside a Surface it takes the concentric value (44 − 16 = 28) automatically.')}>
        <Demo layout="block" code={t(CODE_SURFACE.zh, CODE_SURFACE.en)}>
          <Surface>
            <Group as="ul" aria-label={t('账号', 'Account')}>
              <Row as="li" label={t('邮箱', 'Email')}>{t('xiaoman@example.com', 'ella@example.com')}</Row>
              <Row as="li" label={t('两步验证', 'Two-step verification')}><Badge tone="success">{t('已开启', 'On')}</Badge></Row>
            </Group>
          </Surface>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('行', 'Row'), t('最小高 56（紧凑 48）= 32 高的控件 + 上下各 12', 'min height 56 (compact 48) = a 32-high control + 12 above and below')],
          [t('内边距', 'Padding'), t('内容到分组四边都是 20（紧凑 16）', '20 from content to every edge of the group (compact 16)')],
          [t('分隔', 'Dividers'), t('行间 1px 发丝线', '1px hairline between rows')],
          [t('圆角', 'Corner radius'), t('独立使用 24；嵌在面板里取同心值 28', '24 on its own; concentric 28 inside a panel')],
          [t('箭头', 'Chevron'), t('可点击行悬停时变深，不位移', 'darkens on hover for interactive rows, doesn’t move')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Group" rows={[
          { name: 'as', type: 'ElementType', default: "'div'", description: t(<>渲染成什么元素；想要列表语义时用 <Code>ul</Code> 配 <Code>Row as="li"</Code>。</>, <>Element to render; for list semantics use <Code>ul</Code> with <Code>Row as="li"</Code>.</>) },
          { name: 'compact', type: 'boolean', description: t('紧凑：内边距 16、行高 48。', 'Compact: padding 16, row height 48.') },
        ]} />
        <PropsTable title="Row" rows={[
          { name: 'label', type: 'ReactNode', description: t('左侧标题。', 'Label on the left.') },
          { name: 'description', type: 'ReactNode', description: t('标题下的说明。', 'Description under the label.') },
          { name: 'leading', type: 'ReactNode', description: t('标题前的图标或头像。', 'Icon or avatar before the label.') },
          { name: 'children', type: 'ReactNode', description: t('右侧内容：控件；可点击行里是箭头前的值。', 'Content on the right: a control, or the value before the chevron in an interactive row.') },
          { name: 'stack', type: 'boolean', description: t('纵向堆叠：控件放到标题下面并撑满。', 'Stacked: the control goes under the label at full width.') },
          { name: 'href', type: 'string', description: t(<>整行是链接，渲染成 <Code>a</Code>，末尾带箭头；可配合 <Code>target</Code>、<Code>rel</Code>。</>, <>Makes the whole row a link, rendered as <Code>a</Code> with a trailing chevron. Works with <Code>target</Code> and <Code>rel</Code>.</>) },
          { name: 'interactive', type: 'boolean', description: t(<>整行是按钮，渲染成 <Code>button type="button"</Code>，末尾带箭头。</>, <>Makes the whole row a button, rendered as <Code>button type="button"</Code> with a trailing chevron.</>) },
          { name: 'disabled', type: 'boolean', description: t('interactive 时禁用。', 'Disables an interactive row.') },
          { name: 'as', type: 'ElementType', default: "'div'", description: t('静态行渲染成什么元素。传了 href 或 interactive 时忽略。', 'Element for a static row. Ignored when href or interactive is set.') },
        ]} />
        <A11yNotes items={t([
          <>静态行只是排版，标签文字不会自动关联右侧控件：请给控件 <Code>aria-label</Code>，或用 Field / label 包起来。</>,
          '可点击行是原生链接或按钮：Tab 聚焦，Enter（按钮还有空格）触发；焦点环画在行内侧，不会被分组的圆角裁掉。',
          '可点击行的名字 = 标签 + 说明 + 当前值，读屏会一次读完；箭头是装饰，对读屏隐藏。',
          <>需要“列表，共 N 项”的播报时用 <Code>Group as="ul"</Code> 和 <Code>Row as="li"</Code>。</>,
        ], [
          <>A static row is layout only; its label isn’t associated with the control on the right. Give the control an <Code>aria-label</Code>, or wrap it in Field / label.</>,
          'Interactive rows are native links or buttons: Tab to focus, Enter (and Space for buttons) to activate. The focus ring is drawn inside the row so the group’s corner radius doesn’t clip it.',
          'An interactive row’s name is label + description + current value, read in one go; the chevron is decorative and hidden from screen readers.',
          <>When you want a “list, N items” announcement, use <Code>Group as="ul"</Code> with <Code>Row as="li"</Code>.</>,
        ])} />
      </DocSection>
    </DocPage>
  );
}
