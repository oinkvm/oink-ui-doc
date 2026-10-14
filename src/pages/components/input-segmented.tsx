import { useState } from 'react';
import { Field, Icon, Segmented, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/segmented', title: 'Segmented 分段选择', group: '表单与操作', order: 110, subtitle: 'Segmented', en: { title: 'Segmented' } };

type View = 'day' | 'week' | 'month';

function ControlledDemo() {
  const t = useT();
  const [view, setView] = useState<View>('week');
  return (
    <Stack gap={3} align="center">
      <Segmented<View>
        aria-label={t('日历视图', 'Calendar view')}
        value={view}
        onChange={setView}
        options={[
          { value: 'day', label: t('日', 'Day') },
          { value: 'week', label: t('周', 'Week') },
          { value: 'month', label: t('月', 'Month') },
        ]}
      />
      <Text tone="subtle" variant="caption">{t('当前视图：', 'Current view: ')}{view}</Text>
    </Stack>
  );
}

const CONTROLLED_CODE = {
  zh: `
type View = 'day' | 'week' | 'month';

function ControlledDemo() {
  const [view, setView] = useState<View>('week');
  return (
    <Stack gap={3} align="center">
      <Segmented<View>
        aria-label="日历视图"
        value={view}
        onChange={setView}
        options={[
          { value: 'day', label: '日' },
          { value: 'week', label: '周' },
          { value: 'month', label: '月' },
        ]}
      />
      <Text tone="subtle" variant="caption">当前视图：{view}</Text>
    </Stack>
  );
}
`,
  en: `
type View = 'day' | 'week' | 'month';

function ControlledDemo() {
  const [view, setView] = useState<View>('week');
  return (
    <Stack gap={3} align="center">
      <Segmented<View>
        aria-label="Calendar view"
        value={view}
        onChange={setView}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />
      <Text tone="subtle" variant="caption">Current view: {view}</Text>
    </Stack>
  );
}
`,
};

export default function SegmentedPage() {
  const t = useT();
  const listBoard = [{ value: 'a', label: t('列表', 'List') }, { value: 'b', label: t('看板', 'Board') }];
  return (
    <DocPage
      title={t('Segmented 分段选择', 'Segmented')}
      subtitle="Segmented"
      lead={t(
        '在两到五个并列的短选项之间切换，通常用来换视图或筛选条件，切换后立即生效。选项多或文字长时用 Select 或 Radio；切换的是整块内容区时用 Tabs。',
        'Switches between two to five short, parallel options, usually to change a view or a filter, taking effect immediately. For many options or long labels use Select or Radio; to switch a whole content area use Tabs.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t('默认选中第一个可用项。共享的滑块会滑到选中项上。', 'The first enabled option is selected by default. A shared thumb slides over to the selected option.')}>
        <Demo
          code={t(`
<Segmented
  aria-label="排序方式"
  options={[
    { value: 'new', label: '最新' },
    { value: 'hot', label: '最热' },
    { value: 'top', label: '评分最高' },
  ]}
/>
`, `
<Segmented
  aria-label="Sort by"
  options={[
    { value: 'new', label: 'Newest' },
    { value: 'hot', label: 'Popular' },
    { value: 'top', label: 'Top rated' },
  ]}
/>
`)}
        >
          <Segmented
            aria-label={t('排序方式', 'Sort by')}
            options={[
              { value: 'new', label: t('最新', 'Newest') },
              { value: 'hot', label: t('最热', 'Popular') },
              { value: 'top', label: t('评分最高', 'Top rated') },
            ]}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸与撑满', 'Sizes and full width')}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={4} style={{ width: '100%', maxWidth: 420 }} align="start">
  <Segmented size="sm" aria-label="小号" options={[{ value: 'a', label: '列表' }, { value: 'b', label: '看板' }]} />
  <Segmented size="md" aria-label="中号" options={[{ value: 'a', label: '列表' }, { value: 'b', label: '看板' }]} />
  <Segmented size="lg" aria-label="大号" options={[{ value: 'a', label: '列表' }, { value: 'b', label: '看板' }]} />
  <Segmented block aria-label="撑满" style={{ alignSelf: 'stretch' }} options={[{ value: 'in', label: '收入' }, { value: 'out', label: '支出' }, { value: 'all', label: '全部' }]} />
</Stack>
`, `
<Stack gap={4} style={{ width: '100%', maxWidth: 420 }} align="start">
  <Segmented size="sm" aria-label="Small" options={[{ value: 'a', label: 'List' }, { value: 'b', label: 'Board' }]} />
  <Segmented size="md" aria-label="Medium" options={[{ value: 'a', label: 'List' }, { value: 'b', label: 'Board' }]} />
  <Segmented size="lg" aria-label="Large" options={[{ value: 'a', label: 'List' }, { value: 'b', label: 'Board' }]} />
  <Segmented block aria-label="Full width" style={{ alignSelf: 'stretch' }} options={[{ value: 'in', label: 'Income' }, { value: 'out', label: 'Expenses' }, { value: 'all', label: 'All' }]} />
</Stack>
`)}
        >
          <Stack gap={4} style={{ width: '100%', maxWidth: 420 }} align="start">
            <Segmented size="sm" aria-label={t('小号', 'Small')} options={listBoard} />
            <Segmented size="md" aria-label={t('中号', 'Medium')} options={listBoard} />
            <Segmented size="lg" aria-label={t('大号', 'Large')} options={listBoard} />
            <Segmented block aria-label={t('撑满', 'Full width')} style={{ alignSelf: 'stretch' }} options={[{ value: 'in', label: t('收入', 'Income') }, { value: 'out', label: t('支出', 'Expenses') }, { value: 'all', label: t('全部', 'All') }]} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('图标', 'Icons')} description={t('icon 放在文字前。只有图标时把 label 留空，并给这一项 aria-label。', 'icon goes before the label. For icon-only options, leave label empty and give the option an aria-label.')}>
        <Demo
          code={t(`
<Segmented
  aria-label="主题"
  defaultValue="system"
  options={[
    { value: 'light', label: '浅色', icon: <Icon name="sun" /> },
    { value: 'dark', label: '深色', icon: <Icon name="moon" /> },
    { value: 'system', label: '跟随系统', icon: <Icon name="monitor" /> },
  ]}
/>
<Segmented
  aria-label="主题（仅图标）"
  options={[
    { value: 'light', label: '', icon: <Icon name="sun" />, 'aria-label': '浅色' },
    { value: 'dark', label: '', icon: <Icon name="moon" />, 'aria-label': '深色' },
    { value: 'system', label: '', icon: <Icon name="monitor" />, 'aria-label': '跟随系统' },
  ]}
/>
`, `
<Segmented
  aria-label="Theme"
  defaultValue="system"
  options={[
    { value: 'light', label: 'Light', icon: <Icon name="sun" /> },
    { value: 'dark', label: 'Dark', icon: <Icon name="moon" /> },
    { value: 'system', label: 'System', icon: <Icon name="monitor" /> },
  ]}
/>
<Segmented
  aria-label="Theme (icons only)"
  options={[
    { value: 'light', label: '', icon: <Icon name="sun" />, 'aria-label': 'Light' },
    { value: 'dark', label: '', icon: <Icon name="moon" />, 'aria-label': 'Dark' },
    { value: 'system', label: '', icon: <Icon name="monitor" />, 'aria-label': 'System' },
  ]}
/>
`)}
        >
          <Segmented
            aria-label={t('主题', 'Theme')}
            defaultValue="system"
            options={[
              { value: 'light', label: t('浅色', 'Light'), icon: <Icon name="sun" /> },
              { value: 'dark', label: t('深色', 'Dark'), icon: <Icon name="moon" /> },
              { value: 'system', label: t('跟随系统', 'System'), icon: <Icon name="monitor" /> },
            ]}
          />
          <Segmented
            aria-label={t('主题（仅图标）', 'Theme (icons only)')}
            options={[
              { value: 'light', label: '', icon: <Icon name="sun" />, 'aria-label': t('浅色', 'Light') },
              { value: 'dark', label: '', icon: <Icon name="moon" />, 'aria-label': t('深色', 'Dark') },
              { value: 'system', label: '', icon: <Icon name="monitor" />, 'aria-label': t('跟随系统', 'System') },
            ]}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('禁用', 'Disabled')}>
        <Demo
          code={t(`
<Segmented
  aria-label="单项禁用"
  options={[
    { value: 'month', label: '按月' },
    { value: 'year', label: '按年' },
    { value: 'life', label: '终身', disabled: true },
  ]}
/>
<Segmented disabled aria-label="整体禁用" options={[{ value: 'on', label: '开' }, { value: 'off', label: '关' }]} />
`, `
<Segmented
  aria-label="One option disabled"
  options={[
    { value: 'month', label: 'Monthly' },
    { value: 'year', label: 'Yearly' },
    { value: 'life', label: 'Lifetime', disabled: true },
  ]}
/>
<Segmented disabled aria-label="All disabled" options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]} />
`)}
        >
          <Segmented
            aria-label={t('单项禁用', 'One option disabled')}
            options={[
              { value: 'month', label: t('按月', 'Monthly') },
              { value: 'year', label: t('按年', 'Yearly') },
              { value: 'life', label: t('终身', 'Lifetime'), disabled: true },
            ]}
          />
          <Segmented disabled aria-label={t('整体禁用', 'All disabled')} options={[{ value: 'on', label: t('开', 'On') }, { value: 'off', label: t('关', 'Off') }]} />
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        '组件是泛型的：把 value 的联合类型传进去，onChange 的参数类型也跟着收窄。放进 Field 可以得到可见的标签。',
        'The component is generic: pass in the union type of value and onChange’s parameter narrows to match. Put it in a Field for a visible label.',
      )}>
        <Demo code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
        <Demo
          title={t('配合 Field', 'With Field')}
          code={t(`
<Field label="计费周期" hint="按年付费省 20%">
  <Segmented options={[{ value: 'month', label: '按月' }, { value: 'year', label: '按年' }]} />
</Field>
`, `
<Field label="Billing cycle" hint="Save 20% with yearly billing">
  <Segmented options={[{ value: 'month', label: 'Monthly' }, { value: 'year', label: 'Yearly' }]} />
</Field>
`)}
        >
          <Field label={t('计费周期', 'Billing cycle')} hint={t('按年付费省 20%', 'Save 20% with yearly billing')}>
            <Segmented options={[{ value: 'month', label: t('按月', 'Monthly') }, { value: 'year', label: t('按年', 'Yearly') }]} />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['尺寸', '总高 40 / 32 · 轨道内边距 3'],
            ['选中块', 'translate + width · 弹簧'],
            ['途中', 'scale 1.05 × .86 压扁再复原'],
            ['键盘', '← → 切换'],
          ], [
            ['Size', 'Total height 40 / 32 · track padding 3'],
            ['Thumb', 'translate + width · spring'],
            ['In flight', 'Squashes to scale 1.05 × .86, then recovers'],
            ['Keyboard', '← → to switch'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Segmented"
          rows={[
            { name: 'options', type: 'SegmentedOption<T>[]', required: true, description: t('选项列表。', 'List of options.') },
            { name: 'value', type: 'T', description: t('选中项（受控）。', 'Selected option (controlled).') },
            { name: 'defaultValue', type: 'T', default: t('第一个可用项', 'first enabled option'), description: t('初始选中项（非受控）。', 'Initially selected option (uncontrolled).') },
            { name: 'onChange', type: '(value: T) => void', description: t('选中项变化时触发。', 'Fires when the selection changes.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'block', type: 'boolean', description: t('撑满一行，各项等宽。', 'Fill the row with equal-width options.') },
            { name: 'disabled', type: 'boolean', description: t('整体禁用。', 'Disable all options.') },
          ]}
        />
        <PropsTable
          title="SegmentedOption"
          rows={[
            { name: 'value', type: 'T extends string', required: true, description: t('这一项的值。', 'Value of this option.') },
            { name: 'label', type: 'ReactNode', required: true, description: t('文字；只有图标时传空字符串。', 'Label; pass an empty string for icon-only options.') },
            { name: 'icon', type: 'ReactNode', description: t('文字前的图标。', 'Icon before the label.') },
            { name: 'disabled', type: 'boolean', description: t('禁用这一项。', 'Disable this option.') },
            { name: 'aria-label', type: 'string', description: t('只有图标时的可读名称。', 'Accessible name for icon-only options.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>根节点是 <code>role="radiogroup"</code>，每一项是 <code>role="radio"</code> 的按钮，用 <code>aria-checked</code> 表达选中。</>,
            <>整组只有一个 Tab 停靠点（选中项）。<kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> 移动并同时选中，到头循环；<kbd>Home</kbd> / <kbd>End</kbd> 到两端；禁用项被跳过。</>,
            <>必须有可读名称：<code>aria-label</code>，或放进带 label 的 Field。</>,
            <>只有图标的项必须给 <code>aria-label</code>。</>,
            <>选中靠滑块的底色和位置表达，不依赖强调色。</>,
          ], [
            <>The root is <code>role="radiogroup"</code> and each option is a <code>role="radio"</code> button, with <code>aria-checked</code> marking the selection.</>,
            <>The group has a single Tab stop (the selected option). <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> move and select at the same time, wrapping at the ends; <kbd>Home</kbd> / <kbd>End</kbd> jump to either end; disabled options are skipped.</>,
            <>It must have an accessible name: an <code>aria-label</code>, or a labelled Field around it.</>,
            <>Icon-only options must have an <code>aria-label</code>.</>,
            <>Selection is shown by the thumb’s fill and position, not by the accent color.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
