import { useState } from 'react';
import { Button, Field, Form, FormActions, Select, Stack, Text } from 'oink-ui';
import type { SelectOptions } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/select', title: 'Select 选择器', group: '浮层', order: 50, subtitle: 'Select', en: { title: 'Select' } };

const FRUITS: { zh: SelectOptions; en: SelectOptions } = {
  zh: [
    { value: 'apple', label: '苹果' },
    { value: 'banana', label: '香蕉' },
    { value: 'cherry', label: '樱桃' },
    { value: 'grape', label: '葡萄' },
  ],
  en: [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'grape', label: 'Grape' },
  ],
};

const CITIES: { zh: SelectOptions; en: SelectOptions } = {
  zh: [
    { label: '华东', options: [{ value: 'sh', label: '上海' }, { value: 'hz', label: '杭州' }, { value: 'nj', label: '南京' }] },
    { label: '华南', options: [{ value: 'gz', label: '广州' }, { value: 'sz', label: '深圳' }] },
    { label: '华北', options: [{ value: 'bj', label: '北京' }, { value: 'tj', label: '天津', disabled: true }] },
  ],
  en: [
    { label: 'East Coast', options: [{ value: 'nyc', label: 'New York' }, { value: 'bos', label: 'Boston' }, { value: 'phl', label: 'Philadelphia' }] },
    { label: 'West Coast', options: [{ value: 'sf', label: 'San Francisco' }, { value: 'sea', label: 'Seattle' }] },
    { label: 'Midwest', options: [{ value: 'chi', label: 'Chicago' }, { value: 'det', label: 'Detroit', disabled: true }] },
  ],
};

const STATUS: { zh: SelectOptions; en: SelectOptions } = {
  zh: [
    { value: 'todo', label: '待处理', icon: 'bell' },
    { value: 'doing', label: '进行中', icon: 'play', tone: 'info', meta: '3' },
    { value: 'done', label: '已完成', icon: 'check', tone: 'success', meta: '12' },
    { value: 'blocked', label: '已阻塞', icon: 'alert', tone: 'warning' },
    { value: 'dropped', label: '已放弃', icon: 'trash', tone: 'danger', disabled: true },
  ],
  en: [
    { value: 'todo', label: 'To do', icon: 'bell' },
    { value: 'doing', label: 'In progress', icon: 'play', tone: 'info', meta: '3' },
    { value: 'done', label: 'Done', icon: 'check', tone: 'success', meta: '12' },
    { value: 'blocked', label: 'Blocked', icon: 'alert', tone: 'warning' },
    { value: 'dropped', label: 'Dropped', icon: 'trash', tone: 'danger', disabled: true },
  ],
};

function ControlledDemo() {
  const t = useT();
  const [value, setValue] = useState<string | null>('banana');
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Select aria-label={t('水果', 'Fruit')} options={t(FRUITS.zh, FRUITS.en)} value={value} onChange={(v) => setValue(v)} open={open} onOpenChange={setOpen} />
      <Text tone="subtle" variant="caption">
        {t(<>value：{value ?? 'null'} · 列表{open ? '已展开' : '已收起'}</>, <>value: {value ?? 'null'} · List {open ? 'open' : 'closed'}</>)}
      </Text>
      <Button size="sm" variant="ghost" onClick={() => setValue(null)} disabled={value === null}>{t('清空', 'Clear')}</Button>
    </Stack>
  );
}

function FormDemo() {
  const t = useT();
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  return (
    <Form
      aria-label={t('配送城市', 'Delivery city')}
      style={{ width: '100%', maxWidth: 320 }}
      onSubmit={(data) => {
        const v = String(data.get('city') ?? '');
        setError(v ? '' : t('请选择城市', 'Please choose a city'));
        setSent(v ? t(`提交的表单数据：city=${v}`, `Submitted form data: city=${v}`) : '');
      }}
    >
      <Field label={t('配送城市', 'Delivery city')} required error={error}>
        {(control) => (
          <Select
            id={control.id}
            aria-describedby={control['aria-describedby']}
            invalid={!!error}
            name="city"
            options={t(CITIES.zh, CITIES.en)}
            value={city}
            onChange={(v) => { setCity(v); setError(''); }}
            placeholder={t('请选择城市', 'Choose a city')}
          />
        )}
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">{t('提交', 'Submit')}</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0 }}>{sent}</Text>
    </Form>
  );
}

const CODE_BASIC = {
  zh: `
const FRUITS: SelectOptions = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
  { value: 'grape', label: '葡萄' },
];

<Select aria-label="水果" options={FRUITS} defaultValue="apple" />
<Select aria-label="水果（未选）" options={FRUITS} placeholder="选一种水果" />
`,
  en: `
const FRUITS: SelectOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
];

<Select aria-label="Fruit" options={FRUITS} defaultValue="apple" />
<Select aria-label="Fruit (none selected)" options={FRUITS} placeholder="Pick a fruit" />
`,
};

const CODE_GROUPS = {
  zh: `
const CITIES: SelectOptions = [
  { label: '华东', options: [{ value: 'sh', label: '上海' }, { value: 'hz', label: '杭州' }, { value: 'nj', label: '南京' }] },
  { label: '华南', options: [{ value: 'gz', label: '广州' }, { value: 'sz', label: '深圳' }] },
  { label: '华北', options: [{ value: 'bj', label: '北京' }, { value: 'tj', label: '天津', disabled: true }] },
];

<Select aria-label="城市" options={CITIES} defaultValue="hz" />
`,
  en: `
const CITIES: SelectOptions = [
  { label: 'East Coast', options: [{ value: 'nyc', label: 'New York' }, { value: 'bos', label: 'Boston' }, { value: 'phl', label: 'Philadelphia' }] },
  { label: 'West Coast', options: [{ value: 'sf', label: 'San Francisco' }, { value: 'sea', label: 'Seattle' }] },
  { label: 'Midwest', options: [{ value: 'chi', label: 'Chicago' }, { value: 'det', label: 'Detroit', disabled: true }] },
];

<Select aria-label="City" options={CITIES} defaultValue="bos" />
`,
};

const CODE_STATUS = {
  zh: `
const STATUS: SelectOptions = [
  { value: 'todo', label: '待处理', icon: 'bell' },
  { value: 'doing', label: '进行中', icon: 'play', tone: 'info', meta: '3' },
  { value: 'done', label: '已完成', icon: 'check', tone: 'success', meta: '12' },
  { value: 'blocked', label: '已阻塞', icon: 'alert', tone: 'warning' },
  { value: 'dropped', label: '已放弃', icon: 'trash', tone: 'danger', disabled: true },
];

<Select aria-label="任务状态" options={STATUS} defaultValue="doing" />
`,
  en: `
const STATUS: SelectOptions = [
  { value: 'todo', label: 'To do', icon: 'bell' },
  { value: 'doing', label: 'In progress', icon: 'play', tone: 'info', meta: '3' },
  { value: 'done', label: 'Done', icon: 'check', tone: 'success', meta: '12' },
  { value: 'blocked', label: 'Blocked', icon: 'alert', tone: 'warning' },
  { value: 'dropped', label: 'Dropped', icon: 'trash', tone: 'danger', disabled: true },
];

<Select aria-label="Task status" options={STATUS} defaultValue="doing" />
`,
};

const CODE_SIZES = {
  zh: `
<Select size="sm" aria-label="小号" options={FRUITS} defaultValue="apple" />
<Select size="md" aria-label="中号" options={FRUITS} defaultValue="apple" />
<Select size="lg" aria-label="大号" options={FRUITS} defaultValue="apple" />
<Select disabled aria-label="禁用" options={FRUITS} defaultValue="cherry" />
<Select invalid aria-label="校验失败" options={FRUITS} placeholder="必选" />
`,
  en: `
<Select size="sm" aria-label="Small" options={FRUITS} defaultValue="apple" />
<Select size="md" aria-label="Medium" options={FRUITS} defaultValue="apple" />
<Select size="lg" aria-label="Large" options={FRUITS} defaultValue="apple" />
<Select disabled aria-label="Disabled" options={FRUITS} defaultValue="cherry" />
<Select invalid aria-label="Invalid" options={FRUITS} placeholder="Required" />
`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [value, setValue] = useState<string | null>('banana');
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Select aria-label="水果" options={FRUITS} value={value} onChange={(v) => setValue(v)} open={open} onOpenChange={setOpen} />
      <Text tone="subtle" variant="caption">value：{value ?? 'null'} · 列表{open ? '已展开' : '已收起'}</Text>
      <Button size="sm" variant="ghost" onClick={() => setValue(null)} disabled={value === null}>清空</Button>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [value, setValue] = useState<string | null>('banana');
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Select aria-label="Fruit" options={FRUITS} value={value} onChange={(v) => setValue(v)} open={open} onOpenChange={setOpen} />
      <Text tone="subtle" variant="caption">value: {value ?? 'null'} · List {open ? 'open' : 'closed'}</Text>
      <Button size="sm" variant="ghost" onClick={() => setValue(null)} disabled={value === null}>Clear</Button>
    </Stack>
  );
}
`,
};

const CODE_FORM = {
  zh: `
function FormDemo() {
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  return (
    <Form
      aria-label="配送城市"
      style={{ width: '100%', maxWidth: 320 }}
      onSubmit={(data) => {
        const v = String(data.get('city') ?? '');
        setError(v ? '' : '请选择城市');
        setSent(v ? \`提交的表单数据：city=\${v}\` : '');
      }}
    >
      <Field label="配送城市" required error={error}>
        {(control) => (
          <Select
            id={control.id}
            aria-describedby={control['aria-describedby']}
            invalid={!!error}
            name="city"
            options={CITIES}
            value={city}
            onChange={(v) => { setCity(v); setError(''); }}
            placeholder="请选择城市"
          />
        )}
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">提交</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0 }}>{sent}</Text>
    </Form>
  );
}
`,
  en: `
function FormDemo() {
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  return (
    <Form
      aria-label="Delivery city"
      style={{ width: '100%', maxWidth: 320 }}
      onSubmit={(data) => {
        const v = String(data.get('city') ?? '');
        setError(v ? '' : 'Please choose a city');
        setSent(v ? \`Submitted form data: city=\${v}\` : '');
      }}
    >
      <Field label="Delivery city" required error={error}>
        {(control) => (
          <Select
            id={control.id}
            aria-describedby={control['aria-describedby']}
            invalid={!!error}
            name="city"
            options={CITIES}
            value={city}
            onChange={(v) => { setCity(v); setError(''); }}
            placeholder="Choose a city"
          />
        )}
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">Submit</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0 }}>{sent}</Text>
    </Form>
  );
}
`,
};

export default function SelectPage() {
  const t = useT();
  const fruits = t(FRUITS.zh, FRUITS.en);
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={meta.subtitle}
      lead={t(
        '从一列选项里选一个，平时只占一行。选项在五个以内且都值得一眼看到时用 Radio 或 Segmented；选项很多、需要打字筛选时用 Combobox；要选多个用 MultiSelect。',
        'Pick one item from a list while taking up a single line. With five or fewer options that are all worth seeing at a glance, use Radio or Segmented; with many options that need filtering by typing, use Combobox; to pick several, use MultiSelect.',
      )}
    >
      <DocSection
        title={t('基本用法', 'Basic usage')}
        description={t(
          'options 是 { value, label } 的数组。点开后选中项加粗并带对勾，点下立即收起。没有可见标签时给 aria-label。',
          'options is an array of { value, label }. When open, the selected option is bold with a checkmark, and the list closes as soon as you click. Without a visible label, provide an aria-label.',
        )}
      >
        <Demo
          minHeight={280}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_BASIC.zh, CODE_BASIC.en)}
        >
          <Select aria-label={t('水果', 'Fruit')} options={fruits} defaultValue="apple" />
          <Select aria-label={t('水果（未选）', 'Fruit (none selected)')} options={fruits} placeholder={t('选一种水果', 'Pick a fruit')} />
        </Demo>
      </DocSection>

      <DocSection
        title={t('分组与禁用项', 'Groups and disabled options')}
        description={t(
          'options 里可以混入 { label, options } 分组。单个选项用 disabled 禁用，键盘会跳过它。',
          'options can mix in { label, options } groups. Disable a single option with disabled; the keyboard skips it.',
        )}
      >
        <Demo
          minHeight={420}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_GROUPS.zh, CODE_GROUPS.en)}
        >
          <Select aria-label={t('城市', 'City')} options={t(CITIES.zh, CITIES.en)} defaultValue={t('hz', 'bos')} />
        </Demo>
      </DocSection>

      <DocSection
        title={t('图标、状态色与辅助文字', 'Icons, tones and meta text')}
        description={t(
          '选项还可以带 icon、tone（状态色）和 meta（右侧的辅助文字）。label 不是字符串时请提供 textValue，供首字母跳转使用。',
          'Options can also carry an icon, a tone (status color) and meta (secondary text on the right). When label is not a string, provide textValue for type-ahead.',
        )}
      >
        <Demo
          minHeight={340}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_STATUS.zh, CODE_STATUS.en)}
        >
          <Select aria-label={t('任务状态', 'Task status')} options={t(STATUS.zh, STATUS.en)} defaultValue="doing" />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸与状态', 'Sizes and states')}>
        <Demo
          minHeight={120}
          style={{ alignContent: 'center' }}
          code={t(CODE_SIZES.zh, CODE_SIZES.en)}
        >
          <Select size="sm" aria-label={t('小号', 'Small')} options={fruits} defaultValue="apple" />
          <Select size="md" aria-label={t('中号', 'Medium')} options={fruits} defaultValue="apple" />
          <Select size="lg" aria-label={t('大号', 'Large')} options={fruits} defaultValue="apple" />
          <Select disabled aria-label={t('禁用', 'Disabled')} options={fruits} defaultValue="cherry" />
          <Select invalid aria-label={t('校验失败', 'Invalid')} options={fruits} placeholder={t('必选', 'Required')} />
        </Demo>
      </DocSection>

      <DocSection
        title={t('受控用法', 'Controlled usage')}
        description={t(
          'onChange 的第一个参数是新值，第二个是整个选项对象。value 传 null 表示没选。展开状态也可以用 open / onOpenChange 受控。',
          'onChange receives the new value first and the whole option object second. A null value means nothing is selected. Whether the list is open can also be controlled with open / onOpenChange.',
        )}
      >
        <Demo
          minHeight={320}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}
        >
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('表单提交', 'Form submission')}
        description={t(
          '传 name 会渲染一个隐藏 input，随表单一起提交。Select 放进 Field 会自动接上 id、aria-describedby、aria-invalid 和必填，并默认撑满宽度；标签点击和错误播报都是通的。下面的示例用函数子节点手动接线，两种写法等价。',
          'Passing name renders a hidden input that submits with the form. Inside a Field, Select is wired up automatically (id, aria-describedby, aria-invalid and required) and fills the width by default; clicking the label and announcing errors both work. The example below wires it up by hand with a function child; the two approaches are equivalent.',
        )}
      >
        <Demo
          minHeight={460}
          layout="col"
          align="start"
          code={t(CODE_FORM.zh, CODE_FORM.en)}
        >
          <FormDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t<Array<[string, string]>>(
            [
              ['进场', '淡入 + 下移 6px · 150ms ease-out，不缩放'],
              ['高亮块', '90ms ease-out · 紧跟指针，不回弹'],
              ['选中', '选中项加粗（600）+ 中性色对勾 · 点下立即收起，不等对勾画完'],
              ['宽度', '列表不窄于触发框；打开前按“全部加粗”量一次宽度并锁住'],
              ['退场', '90ms ease-in'],
            ],
            [
              ['Enter', 'Fade in + move down 6px · 150ms ease-out, no scaling'],
              ['Highlight', '90ms ease-out · follows the pointer closely, no overshoot'],
              ['Selected', 'Bold (600) + neutral checkmark · closes on click without waiting for the check to finish drawing'],
              ['Width', 'Never narrower than the trigger; measured once with every option in bold before opening, then locked'],
              ['Exit', '90ms ease-in'],
            ],
          )}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Select"
          rows={[
            { name: 'options', type: 'Array<SelectOption | { label: string; options: SelectOption[] }>', required: true, description: t('选项；可以混入分组。', 'Options, optionally mixed with groups.') },
            { name: 'value', type: 'string | null', description: t('选中的值（受控）；null 表示没选。', 'Selected value (controlled); null means nothing is selected.') },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: t('初始选中的值（非受控）。', 'Initially selected value (uncontrolled).') },
            { name: 'onChange', type: '(value: string, option: SelectOption) => void', description: t('选了另一项时触发；再点已选项不触发。', 'Called when a different option is picked; clicking the selected option again does not fire it.') },
            { name: 'placeholder', type: 'ReactNode', default: t("'请选择'", "'Select…'"), description: t('没选时显示的文字。', 'Text shown when nothing is selected. The default follows the OinkProvider locale.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'disabled', type: 'boolean', description: t('禁用。', 'Disabled.') },
            { name: 'invalid', type: 'boolean', description: t('标成校验未通过（aria-invalid + 描边）。', 'Marks it invalid (aria-invalid + outline).') },
            { name: 'name', type: 'string', description: t('配合表单：渲染隐藏 input 提交 name / value。', 'For forms: renders a hidden input that submits name / value.') },
            { name: 'form', type: 'string', description: t('隐藏 input 关联的表单 id。', 'id of the form the hidden input belongs to.') },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: t('列表的展开状态。', 'Whether the list is open.') },
            { name: 'placement', type: 'Placement', default: "'bottom-start'", description: t('列表相对触发框的位置。', 'Position of the list relative to the trigger.') },
            { name: 'id / aria-label / aria-labelledby / aria-describedby', type: 'string', description: t('落在触发框（按钮）上。其余属性、className、style 和 ref 落在外层 div 上。', 'Go on the trigger (button). Other attributes, className, style and ref go on the outer div.') },
          ]}
        />
        <PropsTable
          title="SelectOption"
          rows={[
            { name: 'value', type: 'string', required: true, description: t('选项的值。', 'The option’s value.') },
            { name: 'label', type: 'ReactNode', required: true, description: t('显示的内容。', 'What is displayed.') },
            { name: 'textValue', type: 'string', description: t('筛选和首字母跳转用的纯文字；label 不是字符串时请提供。', 'Plain text for filtering and type-ahead; provide it when label is not a string.') },
            { name: 'disabled', type: 'boolean', description: t('禁用这一项。', 'Disables this option.') },
            { name: 'icon', type: 'IconName | ReactNode', description: t('前置图标。', 'Leading icon.') },
            { name: 'tone', type: "'neutral' | 'success' | 'warning' | 'danger' | 'info'", description: t('状态色。', 'Status color.') },
            { name: 'meta', type: 'ReactNode', description: t('右侧的辅助文字。', 'Secondary text on the right.') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>触发框是 <code>&lt;button role="combobox" aria-haspopup="listbox"&gt;</code>，列表是 <code>role="listbox"</code>，选项是 <code>role="option"</code>。焦点始终留在触发框上，高亮项通过 <code>aria-activedescendant</code> 告诉读屏。</>,
              <>收起时：<kbd>Enter</kbd> / <kbd>Space</kbd> / <kbd>↓</kbd> / <kbd>↑</kbd> 展开（高亮当前选中项），直接打字母会展开并跳到匹配项。</>,
              <>展开时：<kbd>↑</kbd> <kbd>↓</kbd> 移动（跳过禁用项），<kbd>Home</kbd> / <kbd>End</kbd> 到两端，打字母跳转，<kbd>Enter</kbd> / <kbd>Space</kbd> 选中并收起，<kbd>Esc</kbd> 收起不改值，<kbd>Tab</kbd> 收起并移到下一个控件。</>,
              <>必须有可读名称：<code>aria-label</code>，或像上面的表单示例那样把 Field 给的 id 接上（标签的 for 会指向触发框）。</>,
              <>校验失败时设置 <code>aria-invalid</code>；错误文字用 <code>aria-describedby</code> 关联。</>,
            ],
            [
              <>The trigger is a <code>&lt;button role="combobox" aria-haspopup="listbox"&gt;</code>, the list is <code>role="listbox"</code> and options are <code>role="option"</code>. Focus always stays on the trigger, and the highlighted option is conveyed to screen readers via <code>aria-activedescendant</code>.</>,
              <>When closed: <kbd>Enter</kbd> / <kbd>Space</kbd> / <kbd>↓</kbd> / <kbd>↑</kbd> open the list (highlighting the current selection); typing a letter opens it and jumps to a match.</>,
              <>When open: <kbd>↑</kbd> <kbd>↓</kbd> move (skipping disabled options), <kbd>Home</kbd> / <kbd>End</kbd> go to either end, typing jumps, <kbd>Enter</kbd> / <kbd>Space</kbd> select and close, <kbd>Esc</kbd> closes without changing the value, and <kbd>Tab</kbd> closes and moves to the next control.</>,
              <>It needs an accessible name: <code>aria-label</code>, or wire up the id from Field as in the form example above (the label’s for then points at the trigger).</>,
              <>Set <code>aria-invalid</code> when validation fails, and associate the error text with <code>aria-describedby</code>.</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
