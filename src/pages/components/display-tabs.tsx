import { useState } from 'react';
import { Button, Code, Inline, Stack, Tabs, Text } from 'oink-ui';
import type { TabItem } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Keys, Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/tabs', title: 'Tabs 标签页', group: '导航', order: 10, subtitle: 'Tabs', en: { title: 'Tabs' } };

const ITEMS: { zh: TabItem[]; en: TabItem[] } = {
  zh: [
    { value: 'overview', label: '概览', content: <Text as="p" tone="neutral">项目的基本信息、最近的动态和关键指标都在这里。</Text> },
    { value: 'members', label: '成员', content: <Text as="p" tone="neutral">一共 12 位成员，其中 3 位是管理员。邀请链接七天内有效。</Text> },
    { value: 'settings', label: '设置', content: <Text as="p" tone="neutral">修改项目名称、可见范围和通知方式。危险操作在页面最下面。</Text> },
    { value: 'billing', label: '账单', disabled: true, content: null },
  ],
  en: [
    { value: 'overview', label: 'Overview', content: <Text as="p" tone="neutral">The project’s basics, recent activity and key metrics, all in one place.</Text> },
    { value: 'members', label: 'Members', content: <Text as="p" tone="neutral">12 members in total, 3 of them admins. Invite links are valid for seven days.</Text> },
    { value: 'settings', label: 'Settings', content: <Text as="p" tone="neutral">Change the project name, visibility and notifications. Destructive actions are at the bottom of the page.</Text> },
    { value: 'billing', label: 'Billing', disabled: true, content: null },
  ],
};

const manyTabs = (labels: string[], panel: (label: string) => string): TabItem[] => labels.map((label, i) => ({
  value: 't' + i,
  label,
  content: <Text as="p" tone="neutral">{panel(label)}</Text>,
}));
const MANY = {
  zh: manyTabs(['动态', '任务', '文件', '日历', '讨论', '成员', '统计', '设置'], (label) => `这里是“${label}”面板。`),
  en: manyTabs(['Activity', 'Tasks', 'Files', 'Calendar', 'Discussion', 'Members', 'Insights', 'Settings'], (label) => `This is the “${label}” panel.`),
};

const CODE_BASIC = {
  zh: `
const items: TabItem[] = [
  { value: 'overview', label: '概览', content: <Text as="p" tone="neutral">项目的基本信息、最近的动态和关键指标都在这里。</Text> },
  { value: 'members', label: '成员', content: <Text as="p" tone="neutral">一共 12 位成员，其中 3 位是管理员。邀请链接七天内有效。</Text> },
  { value: 'settings', label: '设置', content: <Text as="p" tone="neutral">修改项目名称、可见范围和通知方式。危险操作在页面最下面。</Text> },
  { value: 'billing', label: '账单', disabled: true, content: null },
];

<Tabs label="项目" items={items} />`,
  en: `
const items: TabItem[] = [
  { value: 'overview', label: 'Overview', content: <Text as="p" tone="neutral">The project’s basics, recent activity and key metrics, all in one place.</Text> },
  { value: 'members', label: 'Members', content: <Text as="p" tone="neutral">12 members in total, 3 of them admins. Invite links are valid for seven days.</Text> },
  { value: 'settings', label: 'Settings', content: <Text as="p" tone="neutral">Change the project name, visibility and notifications. Destructive actions are at the bottom of the page.</Text> },
  { value: 'billing', label: 'Billing', disabled: true, content: null },
];

<Tabs label="Project" items={items} />`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [value, setValue] = useState('members');
  return (
    <Stack gap={4}>
      <Inline>
        <Button size="sm" onClick={() => setValue('overview')}>跳到概览</Button>
        <Button size="sm" onClick={() => setValue('settings')}>跳到设置</Button>
        <Text tone="neutral" variant="caption">当前：{value}</Text>
      </Inline>
      <Tabs label="项目（受控）" items={items} value={value} onChange={setValue} />
    </Stack>
  );
}`,
  en: `
function ControlledDemo() {
  const [value, setValue] = useState('members');
  return (
    <Stack gap={4}>
      <Inline>
        <Button size="sm" onClick={() => setValue('overview')}>Go to Overview</Button>
        <Button size="sm" onClick={() => setValue('settings')}>Go to Settings</Button>
        <Text tone="neutral" variant="caption">Current: {value}</Text>
      </Inline>
      <Tabs label="Project (controlled)" items={items} value={value} onChange={setValue} />
    </Stack>
  );
}`,
};

const CODE_MANUAL = {
  zh: `<Tabs label="项目（手动激活）" items={items} activation="manual" defaultValue="settings" />`,
  en: `<Tabs label="Project (manual activation)" items={items} activation="manual" defaultValue="settings" />`,
};

const CODE_MANY = {
  zh: `
const many: TabItem[] = ['动态', '任务', '文件', '日历', '讨论', '成员', '统计', '设置'].map((label, i) => ({
  value: 't' + i,
  label,
  content: <Text as="p" tone="neutral">这里是“{label}”面板。</Text>,
}));

<div style={{ maxWidth: 360 }}>
  <Tabs label="工作区" items={many} />
</div>`,
  en: `
const many: TabItem[] = ['Activity', 'Tasks', 'Files', 'Calendar', 'Discussion', 'Members', 'Insights', 'Settings'].map((label, i) => ({
  value: 't' + i,
  label,
  content: <Text as="p" tone="neutral">This is the “{label}” panel.</Text>,
}));

<div style={{ maxWidth: 360 }}>
  <Tabs label="Workspace" items={many} />
</div>`,
};

function ControlledDemo() {
  const t = useT();
  const [value, setValue] = useState('members');
  return (
    <Stack gap={4}>
      <Inline>
        <Button size="sm" onClick={() => setValue('overview')}>{t('跳到概览', 'Go to Overview')}</Button>
        <Button size="sm" onClick={() => setValue('settings')}>{t('跳到设置', 'Go to Settings')}</Button>
        <Text tone="neutral" variant="caption">{t('当前：', 'Current: ')}{value}</Text>
      </Inline>
      <Tabs label={t('项目（受控）', 'Project (controlled)')} items={t(ITEMS.zh, ITEMS.en)} value={value} onChange={setValue} />
    </Stack>
  );
}

export default function TabsPage() {
  const t = useT();
  const items = t(ITEMS.zh, ITEMS.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('在同一块区域里切换几组平级的内容，一次只看一组。切换的是页面（地址会变）时请用导航，而不是标签页。', 'Switches between sibling groups of content in the same area, one at a time. When you’re switching pages (the URL changes), use navigation rather than tabs.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('items 里每一项是一个标签和它的面板。墨线先伸展覆盖新旧两个标签，再向新标签收拢；面板按切换方向滑入。默认只渲染当前面板，面板区的高度在切换时平滑过渡。', 'Each entry in items is a tab and its panel. The ink bar first stretches to cover both the old and new tabs, then contracts onto the new one; panels slide in from the direction of the switch. Only the current panel renders by default, and the panel area’s height transitions smoothly between tabs.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Tabs label={t('项目', 'Project')} items={items} />
        </Demo>
      </DocSection>

      <DocSection title={t('受控', 'Controlled')} description={t('value / onChange 受控；defaultValue 指定非受控时的初始标签（默认第一个可用的）。', 'Control it with value / onChange; defaultValue sets the initial tab when uncontrolled (the first enabled one by default).')}>
        <Demo layout="block" code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('手动激活', 'Manual activation')} description={t('默认方向键移动焦点的同时就切换（auto）。面板内容加载很重时改用 manual：方向键只移动焦点，按 Enter 或空格才切换。', 'By default, arrow keys switch tabs as they move focus (auto). When panels are heavy to load, use manual: arrow keys only move focus, and Enter or Space switches.')}>
        <Demo layout="block" code={t(CODE_MANUAL.zh, CODE_MANUAL.en)}>
          <Tabs label={t('项目（手动激活）', 'Project (manual activation)')} items={items} activation="manual" defaultValue="settings" />
        </Demo>
      </DocSection>

      <DocSection title={t('标签很多时', 'Many tabs')} description={t('标签列表放不下时在内部横向滚动（原生滚动），切换时会把新标签带进可视范围。需要保留各面板内部状态时传 keepMounted，所有面板都会渲染并叠放，高度取最高的那个。', 'When the tabs don’t fit, the list scrolls horizontally (native scrolling), bringing the new tab into view on switch. To preserve each panel’s internal state, pass keepMounted: all panels render stacked on top of each other, and the height follows the tallest.')}>
        <Demo layout="block" code={t(CODE_MANY.zh, CODE_MANY.en)}>
          <div style={{ maxWidth: 360 }}>
            <Tabs label={t('工作区', 'Workspace')} items={t(MANY.zh, MANY.en)} />
          </div>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('墨线', 'Ink bar'), t('高 3 · 420ms ease-in-out · 中途拉伸', 'height 3 · 420ms ease-in-out · stretches midway')],
          [t('旧面板', 'Old panel'), t('150ms 向反方向滑出 20px', 'slides 20px out the opposite way in 150ms')],
          [t('新面板', 'New panel'), t('延迟 110ms · spring 滑入 24px', '110ms delay · slides 24px in on a spring')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Tabs" rows={[
          { name: 'items', type: 'TabItem[]', required: true, description: t('标签和面板。', 'Tabs and their panels.') },
          { name: 'value / defaultValue', type: 'string', description: t('当前标签，受控 / 非受控。默认第一个可用的。', 'Current tab, controlled / uncontrolled. Defaults to the first enabled one.') },
          { name: 'onChange', type: '(value: string) => void', description: t('切换时。', 'Called on switch.') },
          { name: 'activation', type: "'auto' | 'manual'", default: "'auto'", description: t('auto：方向键移动焦点的同时切换；manual：Enter / 空格才切换。', 'auto: arrow keys switch as they move focus; manual: switch only on Enter / Space.') },
          { name: 'label', type: 'string', description: t('标签列表的名字（aria-label）。', 'Name of the tab list (aria-label).') },
          { name: 'keepMounted', type: 'boolean', default: 'false', description: t('所有面板都渲染并叠放，保留各自的内部状态；高度取最高的那个。默认只渲染当前面板。', 'Renders all panels stacked, preserving their internal state; the height follows the tallest. By default only the current panel renders.') },
        ]} />
        <PropsTable title="TabItem" rows={[
          { name: 'value', type: 'string', required: true, description: t('唯一标识。', 'Unique identifier.') },
          { name: 'label', type: 'ReactNode', required: true, description: t('标签文字。', 'Tab text.') },
          { name: 'content', type: 'ReactNode', description: t('面板内容。', 'Panel content.') },
          { name: 'disabled', type: 'boolean', description: t('禁用。', 'Disabled.') },
        ]} />
        <A11yNotes items={t([
          <><Code>tablist</Code> / <Code>tab</Code> / <Code>tabpanel</Code> 三件套，标签用 <Code>aria-selected</Code> 和 <Code>aria-controls</Code> 关联面板，面板用 <Code>aria-labelledby</Code> 指回标签。请用 <Code>label</Code> 给标签列表起名。</>,
          <>标签列表只有一个 Tab 停靠点。<Keys k="← →" /> 在标签间循环移动，<Keys k="Home End" /> 到首尾；禁用的标签会被跳过。</>,
          <>再按一次 <Keys k="Tab" /> 进入当前面板（面板本身可聚焦，方便读屏从头读内容）。</>,
          'keepMounted 时，叠放的非当前面板不可见、不可聚焦，也不会被读屏读到。',
          '减弱动效时墨线和面板直接到位。',
        ], [
          <>The full <Code>tablist</Code> / <Code>tab</Code> / <Code>tabpanel</Code> set: tabs use <Code>aria-selected</Code> and <Code>aria-controls</Code> to link to their panels, and panels point back with <Code>aria-labelledby</Code>. Name the tab list with <Code>label</Code>.</>,
          <>The tab list is a single Tab stop. <Keys k="← →" /> cycle through tabs, <Keys k="Home End" /> jump to the first / last; disabled tabs are skipped.</>,
          <>Press <Keys k="Tab" /> again to enter the current panel (the panel itself is focusable so screen readers can read from the top).</>,
          'With keepMounted, the stacked inactive panels are invisible, unfocusable and not read by screen readers.',
          'Under reduced motion, the ink bar and panels jump straight into place.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
