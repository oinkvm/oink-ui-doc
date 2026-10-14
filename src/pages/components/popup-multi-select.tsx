import { useState } from 'react';
import { Button, Field, MultiSelect, Stack, Text } from 'oink-ui';
import type { SelectOptions } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/multi-select', title: 'MultiSelect 多选选择器', group: '浮层', order: 60, subtitle: 'MultiSelect', en: { title: 'MultiSelect' } };

const TAGS: { zh: SelectOptions; en: SelectOptions } = {
  zh: [
    { value: 'design', label: '设计' },
    { value: 'frontend', label: '前端' },
    { value: 'backend', label: '后端' },
    { value: 'a11y', label: '无障碍' },
    { value: 'motion', label: '动效' },
  ],
  en: [
    { value: 'design', label: 'Design' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'a11y', label: 'Accessibility' },
    { value: 'motion', label: 'Motion' },
  ],
};

const MEMBERS: { zh: SelectOptions; en: SelectOptions } = {
  zh: [
    { label: '设计组', options: [{ value: 'lin', label: '林夕' }, { value: 'zhou', label: '周舟' }] },
    { label: '工程组', options: [{ value: 'chen', label: '陈晨' }, { value: 'wang', label: '王望', disabled: true }, { value: 'li', label: '李力' }] },
  ],
  en: [
    { label: 'Design', options: [{ value: 'lin', label: 'Lena Hart' }, { value: 'zhou', label: 'Zoe Moss' }] },
    { label: 'Engineering', options: [{ value: 'chen', label: 'Chris Bell' }, { value: 'wang', label: 'Will Grant', disabled: true }, { value: 'li', label: 'Leo Park' }] },
  ],
};

function ControlledDemo() {
  const t = useT();
  const [value, setValue] = useState<string[]>(['design', 'a11y']);
  return (
    <Stack gap={3} align="center">
      <MultiSelect aria-label={t('标签', 'Tags')} options={t(TAGS.zh, TAGS.en)} value={value} onChange={setValue} />
      <Text tone="subtle" variant="caption">{t('value：', 'value: ')}[{value.join(', ')}]</Text>
      <Button size="sm" variant="ghost" onClick={() => setValue([])} disabled={!value.length}>{t('清空', 'Clear')}</Button>
    </Stack>
  );
}

const CODE_BASIC = {
  zh: `
const TAGS: SelectOptions = [
  { value: 'design', label: '设计' },
  { value: 'frontend', label: '前端' },
  { value: 'backend', label: '后端' },
  { value: 'a11y', label: '无障碍' },
  { value: 'motion', label: '动效' },
];

<MultiSelect aria-label="标签" options={TAGS} defaultValue={['design']} />
<MultiSelect aria-label="标签（未选）" options={TAGS} placeholder="添加标签" />
`,
  en: `
const TAGS: SelectOptions = [
  { value: 'design', label: 'Design' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'a11y', label: 'Accessibility' },
  { value: 'motion', label: 'Motion' },
];

<MultiSelect aria-label="Tags" options={TAGS} defaultValue={['design']} />
<MultiSelect aria-label="Tags (none selected)" options={TAGS} placeholder="Add tags" />
`,
};

const CODE_DISPLAY = {
  zh: `
<MultiSelect aria-label="小标签，最多 3 个" options={TAGS} defaultValue={['design', 'frontend', 'backend', 'a11y']} maxChips={3} />
<MultiSelect aria-label="计数" options={TAGS} defaultValue={['design', 'frontend', 'a11y']} display="count" />
<MultiSelect
  aria-label="自定义"
  options={TAGS}
  defaultValue={['motion', 'a11y']}
  renderValue={(selected) => selected.map((o) => o.label).join(' / ')}

/>
`,
  en: `
<MultiSelect aria-label="Chips, up to 3" options={TAGS} defaultValue={['design', 'frontend', 'backend', 'a11y']} maxChips={3} />
<MultiSelect aria-label="Count" options={TAGS} defaultValue={['design', 'frontend', 'a11y']} display="count" />
<MultiSelect
  aria-label="Custom"
  options={TAGS}
  defaultValue={['motion', 'a11y']}
  renderValue={(selected) => selected.map((o) => o.label).join(' / ')}
/>
`,
};

const CODE_GROUPS = {
  zh: `
const MEMBERS: SelectOptions = [
  { label: '设计组', options: [{ value: 'lin', label: '林夕' }, { value: 'zhou', label: '周舟' }] },
  { label: '工程组', options: [{ value: 'chen', label: '陈晨' }, { value: 'wang', label: '王望', disabled: true }, { value: 'li', label: '李力' }] },
];

<MultiSelect aria-label="成员（分组）" options={MEMBERS} defaultValue={['lin', 'chen']} />
<MultiSelect size="sm" aria-label="小号" options={TAGS} defaultValue={['design']} />
<MultiSelect size="lg" aria-label="大号" options={TAGS} defaultValue={['design']} />
<MultiSelect disabled aria-label="禁用" options={TAGS} defaultValue={['frontend']} />
<MultiSelect invalid aria-label="校验失败" options={TAGS} placeholder="至少选一个" />
`,
  en: `
const MEMBERS: SelectOptions = [
  { label: 'Design', options: [{ value: 'lin', label: 'Lena Hart' }, { value: 'zhou', label: 'Zoe Moss' }] },
  { label: 'Engineering', options: [{ value: 'chen', label: 'Chris Bell' }, { value: 'wang', label: 'Will Grant', disabled: true }, { value: 'li', label: 'Leo Park' }] },
];

<MultiSelect aria-label="Members (grouped)" options={MEMBERS} defaultValue={['lin', 'chen']} />
<MultiSelect size="sm" aria-label="Small" options={TAGS} defaultValue={['design']} />
<MultiSelect size="lg" aria-label="Large" options={TAGS} defaultValue={['design']} />
<MultiSelect disabled aria-label="Disabled" options={TAGS} defaultValue={['frontend']} />
<MultiSelect invalid aria-label="Invalid" options={TAGS} placeholder="Pick at least one" />
`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [value, setValue] = useState<string[]>(['design', 'a11y']);
  return (
    <Stack gap={3} align="center">
      <MultiSelect aria-label="标签" options={TAGS} value={value} onChange={setValue} />
      <Text tone="subtle" variant="caption">value：[{value.join(', ')}]</Text>
      <Button size="sm" variant="ghost" onClick={() => setValue([])} disabled={!value.length}>清空</Button>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [value, setValue] = useState<string[]>(['design', 'a11y']);
  return (
    <Stack gap={3} align="center">
      <MultiSelect aria-label="Tags" options={TAGS} value={value} onChange={setValue} />
      <Text tone="subtle" variant="caption">value: [{value.join(', ')}]</Text>
      <Button size="sm" variant="ghost" onClick={() => setValue([])} disabled={!value.length}>Clear</Button>
    </Stack>
  );
}
`,
};

const CODE_FIELD = {
  zh: `
<Field label="通知对象" hint="可以选多个" style={{ width: '100%', maxWidth: 320 }}>
  {(control) => (
    <MultiSelect id={control.id} aria-describedby={control['aria-describedby']} name="notify" options={MEMBERS} placeholder="选择成员" />
  )}
</Field>
`,
  en: `
<Field label="Notify" hint="You can pick several" style={{ width: '100%', maxWidth: 320 }}>
  {(control) => (
    <MultiSelect id={control.id} aria-describedby={control['aria-describedby']} name="notify" options={MEMBERS} placeholder="Choose members" />
  )}
</Field>
`,
};

export default function MultiSelectPage() {
  const t = useT();
  const tags = t(TAGS.zh, TAGS.en);
  const members = t(MEMBERS.zh, MEMBERS.en);
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={meta.subtitle}
      lead={t(
        '从一列选项里选多个，平时只占一行。选项不多且值得全部摆出来时用 CheckboxGroup 或可选中的 Chip。',
        'Pick several items from a list while taking up a single line. When there are only a few options and they are worth showing all at once, use CheckboxGroup or selectable Chips.',
      )}
    >
      <DocSection
        title={t('基本用法', 'Basic usage')}
        description={t(
          '和 Select 用同一种 options。点选后列表不收起，可以连续勾选；点外面、按 Esc 或 Tab 收起。触发框里默认把已选项显示成小标签，超过 2 个折成 +N。',
          'Uses the same options as Select. The list stays open after each click so you can check several in a row; clicking outside, Esc or Tab closes it. By default the trigger shows selected items as chips, collapsing anything beyond 2 into +N.',
        )}
      >
        <Demo
          minHeight={340}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_BASIC.zh, CODE_BASIC.en)}
        >
          <MultiSelect aria-label={t('标签', 'Tags')} options={tags} defaultValue={['design']} />
          <MultiSelect aria-label={t('标签（未选）', 'Tags (none selected)')} options={tags} placeholder={t('添加标签', 'Add tags')} />
        </Demo>
      </DocSection>

      <DocSection
        title={t('触发框里怎么显示', 'What the trigger shows')}
        description={t(
          'display="count" 只显示“已选 N 项”；maxChips 调整最多显示几个小标签；renderValue 完全自定义。',
          'display="count" shows only “N selected”; maxChips sets how many chips are shown at most; renderValue takes full control.',
        )}
      >
        <Demo
          minHeight={340}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_DISPLAY.zh, CODE_DISPLAY.en)}
        >
          <MultiSelect aria-label={t('小标签，最多 3 个', 'Chips, up to 3')} options={tags} defaultValue={['design', 'frontend', 'backend', 'a11y']} maxChips={3} />
          <MultiSelect aria-label={t('计数', 'Count')} options={tags} defaultValue={['design', 'frontend', 'a11y']} display="count" />
          <MultiSelect
            aria-label={t('自定义', 'Custom')}
            options={tags}
            defaultValue={['motion', 'a11y']}
            renderValue={(selected) => selected.map((o) => o.label).join(' / ')}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('分组、尺寸与状态', 'Groups, sizes and states')}>
        <Demo
          minHeight={360}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_GROUPS.zh, CODE_GROUPS.en)}
        >
          <MultiSelect aria-label={t('成员（分组）', 'Members (grouped)')} options={members} defaultValue={['lin', 'chen']} />
          <MultiSelect size="sm" aria-label={t('小号', 'Small')} options={tags} defaultValue={['design']} />
          <MultiSelect size="lg" aria-label={t('大号', 'Large')} options={tags} defaultValue={['design']} />
          <MultiSelect disabled aria-label={t('禁用', 'Disabled')} options={tags} defaultValue={['frontend']} />
          <MultiSelect invalid aria-label={t('校验失败', 'Invalid')} options={tags} placeholder={t('至少选一个', 'Pick at least one')} />
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t('value 是选中值的数组，顺序就是点选的顺序。', 'value is an array of selected values, in the order they were picked.')}>
        <Demo
          minHeight={380}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}
        >
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('配合 Field 与表单', 'With Field and forms')}
        description={t(
          '传 name 时每个选中值渲染一个同名的隐藏 input。接入 Field 的方式和 Select 相同。',
          'With name set, each selected value renders a hidden input of that name. It hooks into Field the same way Select does.',
        )}
      >
        <Demo
          minHeight={360}
          layout="col"
          align="start"
          code={t(CODE_FIELD.zh, CODE_FIELD.en)}
        >
          <Field label={t('通知对象', 'Notify')} hint={t('可以选多个', 'You can pick several')} style={{ width: '100%', maxWidth: 320 }}>
            {(control) => (
              <MultiSelect id={control.id} aria-describedby={control['aria-describedby']} name="notify" options={members} placeholder={t('选择成员', 'Choose members')} />
            )}
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'options', type: 'Array<SelectOption | { label: string; options: SelectOption[] }>', required: true, description: t('选项；可以混入分组。SelectOption 的字段见 Select。', 'Options, optionally mixed with groups. See Select for the SelectOption fields.') },
            { name: 'value', type: 'string[]', description: t('选中的值（受控）。', 'Selected values (controlled).') },
            { name: 'defaultValue', type: 'string[]', default: '[]', description: t('初始选中的值（非受控）。', 'Initially selected values (uncontrolled).') },
            { name: 'onChange', type: '(value: string[]) => void', description: t('选中项变化时触发。', 'Called when the selection changes.') },
            { name: 'display', type: "'chips' | 'count'", default: "'chips'", description: t('触发框里显示小标签，或“已选 N 项”。', 'Show chips in the trigger, or “N selected”.') },
            { name: 'maxChips', type: 'number', default: '2', description: t('chips 模式最多显示几个，其余折成 +N。', 'Maximum chips shown in chips mode; the rest collapse into +N.') },
            { name: 'renderValue', type: '(selected: SelectOption[]) => ReactNode', description: t('自定义触发框里的内容。', 'Custom content for the trigger.') },
            { name: 'placeholder', type: 'ReactNode', default: t("'请选择'", "'Select…'"), description: t('没选时显示的文字。', 'Text shown when nothing is selected. The default follows the OinkProvider locale.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'disabled / invalid', type: 'boolean', description: t('禁用 / 校验未通过。', 'Disabled / invalid.') },
            { name: 'name / form', type: 'string', description: t('配合表单：每个选中值一个同名隐藏 input。', 'For forms: one hidden input of that name per selected value.') },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: t('列表的展开状态。', 'Whether the list is open.') },
            { name: 'placement', type: 'Placement', default: "'bottom-start'", description: t('列表相对触发框的位置。', 'Position of the list relative to the trigger.') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>触发框是 <code>role="combobox"</code> 的按钮，列表是多选的 <code>role="listbox"</code>，选项用 <code>aria-selected</code> 表达勾选。</>,
              <>键盘和 Select 相同，区别是 <kbd>Enter</kbd> / <kbd>Space</kbd> 只切换高亮项的勾选，不收起列表；<kbd>Esc</kbd> 或 <kbd>Tab</kbd> 收起。</>,
              <>触发框里的小标签只是展示，不能单独聚焦或移除；要取消某一项，展开列表再点一次。</>,
              <>折叠成 +N 后看不到全部已选项，重要场景请在别处完整列出。</>,
              <>必须有可读名称：<code>aria-label</code>，或把 Field 给的 id 接到触发框上。</>,
            ],
            [
              <>The trigger is a button with <code>role="combobox"</code>; the list is a multi-select <code>role="listbox"</code>, and options convey their checked state with <code>aria-selected</code>.</>,
              <>The keyboard works as in Select, except that <kbd>Enter</kbd> / <kbd>Space</kbd> only toggle the highlighted option and keep the list open; <kbd>Esc</kbd> or <kbd>Tab</kbd> close it.</>,
              <>The chips in the trigger are display only; they cannot be focused or removed individually. To deselect an item, open the list and click it again.</>,
              <>Once collapsed into +N, not every selected item is visible; where it matters, list them in full elsewhere.</>,
              <>It needs an accessible name: <code>aria-label</code>, or wire the id from Field to the trigger.</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
