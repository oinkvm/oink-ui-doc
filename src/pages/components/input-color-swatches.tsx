import { useState } from 'react';
import { ColorSwatches, Field, Stack, Text } from 'oink-ui';
import type { ColorSwatch } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/color-swatches', title: 'ColorSwatches 色板', group: '表单与操作', order: 140, subtitle: 'ColorSwatches', en: { title: 'ColorSwatches' } };

const COLORS: { zh: ColorSwatch[]; en: ColorSwatch[] } = {
  zh: [
    { value: 'pink', color: '#FF6B8E', label: '粉' },
    { value: 'orange', color: '#FF7A2F', label: '橙' },
    { value: 'amber', color: '#FFBE3B', label: '黄' },
    { value: 'green', color: '#4CD787', label: '绿' },
    { value: 'blue', color: '#4C8DFF', label: '蓝' },
    { value: 'violet', color: '#B57BFF', label: '紫' },
  ],
  en: [
    { value: 'pink', color: '#FF6B8E', label: 'Pink' },
    { value: 'orange', color: '#FF7A2F', label: 'Orange' },
    { value: 'amber', color: '#FFBE3B', label: 'Amber' },
    { value: 'green', color: '#4CD787', label: 'Green' },
    { value: 'blue', color: '#4C8DFF', label: 'Blue' },
    { value: 'violet', color: '#B57BFF', label: 'Violet' },
  ],
};

function ControlledDemo() {
  const t = useT();
  const colors = t(COLORS.zh, COLORS.en);
  const [color, setColor] = useState<string | null>('green');
  const current = colors.find((c) => c.value === color);
  return (
    <Stack gap={3} align="center">
      <ColorSwatches aria-label={t('标签颜色', 'Label color')} colors={colors} value={color} onChange={setColor} />
      <Text tone="subtle" variant="caption">
        {t('当前：', 'Current: ')}
        {current ? t(`${current.label}（${current.color}）`, `${current.label} (${current.color})`) : t('未选择', 'none')}
      </Text>
    </Stack>
  );
}

const COLORS_CODE = {
  zh: `const COLORS: ColorSwatch[] = [
  { value: 'pink', color: '#FF6B8E', label: '粉' },
  { value: 'orange', color: '#FF7A2F', label: '橙' },
  { value: 'amber', color: '#FFBE3B', label: '黄' },
  { value: 'green', color: '#4CD787', label: '绿' },
  { value: 'blue', color: '#4C8DFF', label: '蓝' },
  { value: 'violet', color: '#B57BFF', label: '紫' },
];`,
  en: `const COLORS: ColorSwatch[] = [
  { value: 'pink', color: '#FF6B8E', label: 'Pink' },
  { value: 'orange', color: '#FF7A2F', label: 'Orange' },
  { value: 'amber', color: '#FFBE3B', label: 'Amber' },
  { value: 'green', color: '#4CD787', label: 'Green' },
  { value: 'blue', color: '#4C8DFF', label: 'Blue' },
  { value: 'violet', color: '#B57BFF', label: 'Violet' },
];`,
};

const CONTROLLED_CODE = {
  zh: `
function ControlledDemo() {
  const [color, setColor] = useState<string | null>('green');
  const current = COLORS.find((c) => c.value === color);
  return (
    <Stack gap={3} align="center">
      <ColorSwatches aria-label="标签颜色" colors={COLORS} value={color} onChange={setColor} />
      <Text tone="subtle" variant="caption">当前：{current ? \`\${current.label}（\${current.color}）\` : '未选择'}</Text>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [color, setColor] = useState<string | null>('green');
  const current = COLORS.find((c) => c.value === color);
  return (
    <Stack gap={3} align="center">
      <ColorSwatches aria-label="Label color" colors={COLORS} value={color} onChange={setColor} />
      <Text tone="subtle" variant="caption">Current: {current ? \`\${current.label} (\${current.color})\` : 'none'}</Text>
    </Stack>
  );
}
`,
};

export default function ColorSwatchesPage() {
  const t = useT();
  const colors = t(COLORS.zh, COLORS.en);
  return (
    <DocPage
      title={t('ColorSwatches 色板', 'ColorSwatches')}
      subtitle="ColorSwatches"
      lead={t(
        '从一小组预设颜色里选一个：主题色、标签色、日历分类色。需要任意取色时请用 ColorPicker。',
        'Choose one color from a small preset set: a theme color, a label color, a calendar category color. For arbitrary colors, use ColorPicker.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '每个颜色都必须有名字（label），读屏和悬停提示都靠它。选中的色块中心弹出白点。',
        'Every color needs a name (label); screen readers and hover tooltips rely on it. The selected swatch pops a white dot into its center.',
      )}>
        <Demo
          code={t(`
${COLORS_CODE.zh}

<ColorSwatches aria-label="主题色" colors={COLORS} defaultValue="pink" />
`, `
${COLORS_CODE.en}

<ColorSwatches aria-label="Theme color" colors={COLORS} defaultValue="pink" />
`)}
        >
          <ColorSwatches aria-label={t('主题色', 'Theme color')} colors={colors} defaultValue="pink" />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={4}>
  <ColorSwatches size="sm" aria-label="小号" colors={COLORS} defaultValue="blue" />
  <ColorSwatches size="md" aria-label="中号" colors={COLORS} defaultValue="blue" />
  <ColorSwatches size="lg" aria-label="大号" colors={COLORS} defaultValue="blue" />
</Stack>
`, `
<Stack gap={4}>
  <ColorSwatches size="sm" aria-label="Small" colors={COLORS} defaultValue="blue" />
  <ColorSwatches size="md" aria-label="Medium" colors={COLORS} defaultValue="blue" />
  <ColorSwatches size="lg" aria-label="Large" colors={COLORS} defaultValue="blue" />
</Stack>
`)}
        >
          <Stack gap={4}>
            <ColorSwatches size="sm" aria-label={t('小号', 'Small')} colors={colors} defaultValue="blue" />
            <ColorSwatches size="md" aria-label={t('中号', 'Medium')} colors={colors} defaultValue="blue" />
            <ColorSwatches size="lg" aria-label={t('大号', 'Large')} colors={colors} defaultValue="blue" />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('禁用与 Field', 'Disabled and Field')}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={5}>
  <Field label="分类颜色" hint="用于在日历里区分日程">
    <ColorSwatches colors={COLORS} />
  </Field>
  <Field label="单项禁用">
    <ColorSwatches colors={COLORS.map((c) => (c.value === 'amber' ? { ...c, disabled: true } : c))} defaultValue="pink" />
  </Field>
  <Field label="整体禁用">
    <ColorSwatches colors={COLORS} defaultValue="violet" disabled />
  </Field>
</Stack>
`, `
<Stack gap={5}>
  <Field label="Category color" hint="Tells events apart in the calendar">
    <ColorSwatches colors={COLORS} />
  </Field>
  <Field label="One swatch disabled">
    <ColorSwatches colors={COLORS.map((c) => (c.value === 'amber' ? { ...c, disabled: true } : c))} defaultValue="pink" />
  </Field>
  <Field label="All disabled">
    <ColorSwatches colors={COLORS} defaultValue="violet" disabled />
  </Field>
</Stack>
`)}
        >
          <Stack gap={5}>
            <Field label={t('分类颜色', 'Category color')} hint={t('用于在日历里区分日程', 'Tells events apart in the calendar')}>
              <ColorSwatches colors={colors} />
            </Field>
            <Field label={t('单项禁用', 'One swatch disabled')}>
              <ColorSwatches colors={colors.map((c) => (c.value === 'amber' ? { ...c, disabled: true } : c))} defaultValue="pink" />
            </Field>
            <Field label={t('整体禁用', 'All disabled')}>
              <ColorSwatches colors={colors} defaultValue="violet" disabled />
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t('onChange 的参数是选中色块的 value。', 'onChange is called with the value of the selected swatch.')}>
        <Demo code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={t([['色板', '悬停 1.14× · 选中时白点 bouncy 弹出']], [['Swatch', 'Hover 1.14× · white dot pops in with a bouncy spring when selected']])} />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="ColorSwatches"
          rows={[
            { name: 'colors', type: 'ColorSwatch[]', required: true, description: t('色块列表。', 'List of swatches.') },
            { name: 'value', type: 'string | null', description: t('选中的值（受控）。', 'Selected value (controlled).') },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: t('初始选中的值（非受控）。', 'Initially selected value (uncontrolled).') },
            { name: 'onChange', type: '(value: string) => void', description: t('选中项变化时触发。', 'Fires when the selection changes.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('色块直径 22 / 默认 / 38。', 'Swatch diameter 22 / default / 38.') },
            { name: 'disabled', type: 'boolean', description: t('整体禁用。', 'Disable all swatches.') },
          ]}
        />
        <PropsTable
          title="ColorSwatch"
          rows={[
            { name: 'value', type: 'string', required: true, description: t('选中后回传的值。', 'Value passed back when selected.') },
            { name: 'color', type: 'string', required: true, description: t('任意 CSS 颜色。', 'Any CSS color.') },
            { name: 'label', type: 'string', required: true, description: t('颜色的名字，用作 aria-label 和悬停提示。', 'Name of the color, used as the aria-label and hover tooltip.') },
            { name: 'disabled', type: 'boolean', description: t('禁用这一个。', 'Disable just this swatch.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>根节点是 <code>role="radiogroup"</code>，每个色块是 <code>role="radio"</code> 的按钮，名称取 label。不能只靠颜色区分，所以 label 是必填的。</>,
            <>整组一个 Tab 停靠点（选中项，没选则是第一个可用项）。方向键移动并同时选中，到头循环；<kbd>Home</kbd> / <kbd>End</kbd> 到两端；禁用项被跳过。</>,
            <>选中用中心白点表示，不依赖颜色本身。很浅的颜色上白点对比度不足，挑预设色时请避开。</>,
            <>请给组 <code>aria-label</code> 或放进带 label 的 Field。</>,
          ], [
            <>The root is <code>role="radiogroup"</code> and each swatch is a <code>role="radio"</code> button named by its label. Color alone can’t tell options apart, so label is required.</>,
            <>The group is a single Tab stop (the selected swatch, or the first enabled one if none is selected). Arrow keys move and select at the same time, wrapping at the ends; <kbd>Home</kbd> / <kbd>End</kbd> jump to either end; disabled swatches are skipped.</>,
            <>Selection is shown by the white center dot, not by the color itself. The dot lacks contrast on very light colors, so avoid those when picking presets.</>,
            <>Give the group an <code>aria-label</code> or put it in a labelled Field.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
