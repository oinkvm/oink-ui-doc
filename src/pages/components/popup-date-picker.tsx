import { useState } from 'react';
import { Button, DatePicker, DateRangePicker, Field, Form, FormActions, Stack, Text, formatISODate } from 'oink-ui';
import type { DateRange } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/date-picker', title: 'DatePicker 日期选择', group: '浮层', order: 90, subtitle: 'DatePicker · DateRangePicker', en: { title: 'DatePicker', subtitle: 'DatePicker · DateRangePicker' } };

const TODAY = new Date(2026, 9, 13);
const box = { width: '100%', maxWidth: 280 };
const cn = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' });
const us = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

function ControlledDemo() {
  const t = useT();
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <DatePicker aria-label={t('截止日期', 'Due date')} value={date} onChange={setDate} today={TODAY} />
      <Text tone="subtle" variant="caption">{t('value：', 'value: ')}{date ? formatISODate(date) : 'null'}</Text>
      <Button size="sm" variant="ghost" onClick={() => setDate(TODAY)} style={{ alignSelf: 'start' }}>{t('设为今天', 'Set to today')}</Button>
    </Stack>
  );
}

function RangeDemo() {
  const t = useT();
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <DateRangePicker aria-label={t('统计周期', 'Reporting period')} value={range} onChange={setRange} today={TODAY} />
      <Text tone="subtle" variant="caption">
        {range.start && range.end
          ? `${formatISODate(range.start)}${t(' 至 ', ' to ')}${formatISODate(range.end)}`
          : range.start ? t('已选起点，再点一天定终点', 'Start picked; click another day for the end') : t('还没有选择', 'Nothing selected yet')}
      </Text>
    </Stack>
  );
}

function FormDemo() {
  const t = useT();
  const [sent, setSent] = useState('');
  return (
    <Form
      aria-label={t('请假申请', 'Leave request')}
      style={{ width: '100%', maxWidth: 280 }}
      onSubmit={(data) => setSent(`birthday=${data.get('birthday')} · from=${data.get('from')} · to=${data.get('to')}`)}
    >
      <Field label={t('生日', 'Birthday')}>
        {(control) => <DatePicker id={control.id} name="birthday" defaultValue={new Date(1996, 4, 20)} max={TODAY} today={TODAY} />}
      </Field>
      <Field label={t('请假时间', 'Time off')}>
        {(control) => <DateRangePicker id={control.id} startName="from" endName="to" min={TODAY} today={TODAY} />}
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">{t('提交', 'Submit')}</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0, overflowWrap: 'anywhere' }}>{sent}</Text>
    </Form>
  );
}

const CODE_BASIC = {
  zh: `
const TODAY = new Date(2026, 9, 13);

<Field label="出发日期" hint="格式：年-月-日" style={{ width: '100%', maxWidth: 280 }}>
  {(control) => <DatePicker id={control.id} aria-describedby={control['aria-describedby']} defaultValue={new Date(2026, 9, 18)} today={TODAY} />}
</Field>
`,
  en: `
const TODAY = new Date(2026, 9, 13);

<Field label="Departure date" hint="Format: YYYY-MM-DD" style={{ width: '100%', maxWidth: 280 }}>
  {(control) => <DatePicker id={control.id} aria-describedby={control['aria-describedby']} defaultValue={new Date(2026, 9, 18)} today={TODAY} />}
</Field>
`,
};

const CODE_LIMITS = {
  zh: `
const cn = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric' });

<Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
  <DatePicker aria-label="只能选今天之后" min={TODAY} today={TODAY} placeholder="只能选今天之后" />
  <DatePicker aria-label="自定义格式" defaultValue={TODAY} today={TODAY} format={(d) => d.getFullYear() + '年' + cn.format(d)} />
  <DatePicker size="sm" aria-label="小号" today={TODAY} />
  <DatePicker size="lg" aria-label="大号" today={TODAY} />
</Stack>
`,
  en: `
const us = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

<Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
  <DatePicker aria-label="Today or later" min={TODAY} today={TODAY} placeholder="Today or later" />
  <DatePicker aria-label="Custom format" defaultValue={TODAY} today={TODAY} format={(d) => us.format(d) + ', ' + d.getFullYear()} />
  <DatePicker size="sm" aria-label="Small" today={TODAY} />
  <DatePicker size="lg" aria-label="Large" today={TODAY} />
</Stack>
`,
};

const CODE_STATES = {
  zh: `
<Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
  <DatePicker disabled aria-label="禁用" defaultValue={TODAY} />
  <DatePicker readOnly aria-label="只读" defaultValue={TODAY} />
  <DatePicker invalid aria-label="校验失败" defaultValue={new Date(2026, 9, 1)} />
  <DateRangePicker disabled aria-label="禁用的范围" />
  <DateRangePicker invalid aria-label="校验失败的范围" />
</Stack>
`,
  en: `
<Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
  <DatePicker disabled aria-label="Disabled" defaultValue={TODAY} />
  <DatePicker readOnly aria-label="Read-only" defaultValue={TODAY} />
  <DatePicker invalid aria-label="Invalid" defaultValue={new Date(2026, 9, 1)} />
  <DateRangePicker disabled aria-label="Disabled range" />
  <DateRangePicker invalid aria-label="Invalid range" />
</Stack>
`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <DatePicker aria-label="截止日期" value={date} onChange={setDate} today={TODAY} />
      <Text tone="subtle" variant="caption">value：{date ? formatISODate(date) : 'null'}</Text>
      <Button size="sm" variant="ghost" onClick={() => setDate(TODAY)} style={{ alignSelf: 'start' }}>设为今天</Button>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <DatePicker aria-label="Due date" value={date} onChange={setDate} today={TODAY} />
      <Text tone="subtle" variant="caption">value: {date ? formatISODate(date) : 'null'}</Text>
      <Button size="sm" variant="ghost" onClick={() => setDate(TODAY)} style={{ alignSelf: 'start' }}>Set to today</Button>
    </Stack>
  );
}
`,
};

const CODE_RANGE = {
  zh: `
function RangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <DateRangePicker aria-label="统计周期" value={range} onChange={setRange} today={TODAY} />
      <Text tone="subtle" variant="caption">
        {range.start && range.end ? \`\${formatISODate(range.start)} 至 \${formatISODate(range.end)}\` : range.start ? '已选起点，再点一天定终点' : '还没有选择'}
      </Text>
    </Stack>
  );
}
`,
  en: `
function RangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <DateRangePicker aria-label="Reporting period" value={range} onChange={setRange} today={TODAY} />
      <Text tone="subtle" variant="caption">
        {range.start && range.end
          ? \`\${formatISODate(range.start)} to \${formatISODate(range.end)}\`
          : range.start ? 'Start picked; click another day for the end' : 'Nothing selected yet'}
      </Text>
    </Stack>
  );
}
`,
};

const CODE_RANGE_UNCONTROLLED = {
  zh: `
<Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
  <DateRangePicker aria-label="行程" defaultValue={{ start: new Date(2026, 9, 26), end: new Date(2026, 10, 3) }} today={TODAY} />
  <DateRangePicker aria-label="活动时间" placeholder="选择活动时间" separator=" 至 " format={(d) => cn.format(d)} today={TODAY} />
  <DateRangePicker size="sm" aria-label="小号" today={TODAY} />
  <DateRangePicker size="lg" aria-label="大号" today={TODAY} />
</Stack>
`,
  en: `
<Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
  <DateRangePicker aria-label="Trip" defaultValue={{ start: new Date(2026, 9, 26), end: new Date(2026, 10, 3) }} today={TODAY} />
  <DateRangePicker aria-label="Event dates" placeholder="Choose event dates" separator=" to " format={(d) => us.format(d)} today={TODAY} />
  <DateRangePicker size="sm" aria-label="Small" today={TODAY} />
  <DateRangePicker size="lg" aria-label="Large" today={TODAY} />
</Stack>
`,
};

const CODE_FORM = {
  zh: `
function FormDemo() {
  const [sent, setSent] = useState('');
  return (
    <Form
      aria-label="请假申请"
      style={{ width: '100%', maxWidth: 280 }}
      onSubmit={(data) => setSent(\`birthday=\${data.get('birthday')} · from=\${data.get('from')} · to=\${data.get('to')}\`)}
    >
      <Field label="生日">
        {(control) => <DatePicker id={control.id} name="birthday" defaultValue={new Date(1996, 4, 20)} max={TODAY} today={TODAY} />}
      </Field>
      <Field label="请假时间">
        {(control) => <DateRangePicker id={control.id} startName="from" endName="to" min={TODAY} today={TODAY} />}
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">提交</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0, overflowWrap: 'anywhere' }}>{sent}</Text>
    </Form>
  );
}
`,
  en: `
function FormDemo() {
  const [sent, setSent] = useState('');
  return (
    <Form
      aria-label="Leave request"
      style={{ width: '100%', maxWidth: 280 }}
      onSubmit={(data) => setSent(\`birthday=\${data.get('birthday')} · from=\${data.get('from')} · to=\${data.get('to')}\`)}
    >
      <Field label="Birthday">
        {(control) => <DatePicker id={control.id} name="birthday" defaultValue={new Date(1996, 4, 20)} max={TODAY} today={TODAY} />}
      </Field>
      <Field label="Time off">
        {(control) => <DateRangePicker id={control.id} startName="from" endName="to" min={TODAY} today={TODAY} />}
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">Submit</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0, overflowWrap: 'anywhere' }}>{sent}</Text>
    </Form>
  );
}
`,
};

export default function DatePickerPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '在表单里选一个日期或一段日期，平时只占一行。DatePicker 可以直接打字，也可以点开日历；DateRangePicker 是一个按钮，点开后在日历上点两次。日期离今天很远（比如生日）时，打字比翻日历快。',
        'Pick a date or a date range in a form while taking up a single line. DatePicker accepts typing or a popup calendar; DateRangePicker is a button that opens a calendar where you click twice. For dates far from today (birthdays, say), typing beats paging through months.',
      )}
    >
      <DocSection
        title={t('基本用法', 'Basic usage')}
        description={t(
          '点输入框或右侧按钮都会打开日历。可以直接输入 2026-10-13、2026/10/13 或 2026.10.13，失焦或按 Enter 时生效；输入不合法或不可选的日期会退回原值。边打字日历边翻：只要已经能确定一个月份（比如打到 2026-11），日历就翻到那个月；打出完整、可选的日期时，日历里直接选中它，回车或失焦后才算选定。从日历里点选后自动收起。',
          'Clicking the input or the button on the right opens the calendar. You can type 2026-10-13, 2026/10/13 or 2026.10.13; it takes effect on blur or Enter, and an invalid or unavailable date reverts to the previous value. The calendar follows your typing: once a month can be determined (say, after 2026-11) it flips to that month, and a complete, available date is highlighted right away but only committed on Enter or blur. Picking a day in the calendar closes it.',
        )}
      >
        <Demo
          minHeight={460}
          layout="col"
          align="start"
          code={t(CODE_BASIC.zh, CODE_BASIC.en)}
        >
          <Field label={t('出发日期', 'Departure date')} hint={t('格式：年-月-日', 'Format: YYYY-MM-DD')} style={box}>
            {(control) => <DatePicker id={control.id} aria-describedby={control['aria-describedby']} defaultValue={new Date(2026, 9, 18)} today={TODAY} />}
          </Field>
        </Demo>
      </DocSection>

      <DocSection
        title={t('限制、格式与尺寸', 'Limits, format and sizes')}
        description={t(
          'min / max / isDateDisabled 同时约束日历和手动输入。format / parse 成对自定义显示和解析。',
          'min / max / isDateDisabled constrain both the calendar and typed input. format / parse customize display and parsing as a pair.',
        )}
      >
        <Demo
          minHeight={200}
          layout="col"
          code={t(CODE_LIMITS.zh, CODE_LIMITS.en)}
        >
          <Stack gap={3} style={box}>
            <DatePicker aria-label={t('只能选今天之后', 'Today or later')} min={TODAY} today={TODAY} placeholder={t('只能选今天之后', 'Today or later')} />
            <DatePicker
              aria-label={t('自定义格式', 'Custom format')}
              defaultValue={TODAY}
              today={TODAY}
              format={t((d: Date) => d.getFullYear() + '年' + cn.format(d), (d: Date) => us.format(d) + ', ' + d.getFullYear())}
            />
            <DatePicker size="sm" aria-label={t('小号', 'Small')} today={TODAY} />
            <DatePicker size="lg" aria-label={t('大号', 'Large')} today={TODAY} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')}>
        <Demo
          minHeight={200}
          layout="col"
          code={t(CODE_STATES.zh, CODE_STATES.en)}
        >
          <Stack gap={3} style={box}>
            <DatePicker disabled aria-label={t('禁用', 'Disabled')} defaultValue={TODAY} />
            <DatePicker readOnly aria-label={t('只读', 'Read-only')} defaultValue={TODAY} />
            <DatePicker invalid aria-label={t('校验失败', 'Invalid')} defaultValue={new Date(2026, 9, 1)} />
            <DateRangePicker disabled aria-label={t('禁用的范围', 'Disabled range')} />
            <DateRangePicker invalid aria-label={t('校验失败的范围', 'Invalid range')} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t('onChange 的参数是 Date，清空输入框时是 null。', 'onChange receives a Date, or null when the input is cleared.')}>
        <Demo
          minHeight={480}
          layout="col"
          align="start"
          code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}
        >
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('日期范围', 'Date ranges')}
        description={t(
          'DateRangePicker 是一个显示起止日期的按钮。第一次点定起点，第二次点定终点后自动收起。它不支持直接打字。',
          'DateRangePicker is a button showing the start and end dates. The first click sets the start; the second sets the end and closes the calendar. It does not accept typed input.',
        )}
      >
        <Demo
          title={t('受控', 'Controlled')}
          minHeight={480}
          layout="col"
          align="start"
          code={t(CODE_RANGE.zh, CODE_RANGE.en)}
        >
          <RangeDemo />
        </Demo>
        <Demo
          title={t('非受控与自定义文案', 'Uncontrolled, with custom text')}
          minHeight={160}
          layout="col"
          code={t(CODE_RANGE_UNCONTROLLED.zh, CODE_RANGE_UNCONTROLLED.en)}
        >
          <Stack gap={3} style={box}>
            <DateRangePicker aria-label={t('行程', 'Trip')} defaultValue={{ start: new Date(2026, 9, 26), end: new Date(2026, 10, 3) }} today={TODAY} />
            <DateRangePicker
              aria-label={t('活动时间', 'Event dates')}
              placeholder={t('选择活动时间', 'Choose event dates')}
              separator={t(' 至 ', ' to ')}
              format={t((d: Date) => cn.format(d), (d: Date) => us.format(d))}
              today={TODAY}
            />
            <DateRangePicker size="sm" aria-label={t('小号', 'Small')} today={TODAY} />
            <DateRangePicker size="lg" aria-label={t('大号', 'Large')} today={TODAY} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection
        title={t('表单提交', 'Form submission')}
        description={t(
          'DatePicker 的 name、DateRangePicker 的 startName / endName 都通过隐藏 input 以 yyyy-MM-dd 提交，和显示格式无关。',
          'DatePicker’s name and DateRangePicker’s startName / endName submit through hidden inputs as yyyy-MM-dd, regardless of the display format.',
        )}
      >
        <Demo
          minHeight={560}
          layout="col"
          align="start"
          code={t(CODE_FORM.zh, CODE_FORM.en)}
        >
          <FormDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="DatePicker"
          rows={[
            { name: 'value', type: 'Date | null', description: t('选中的日期（受控）。', 'Selected date (controlled).') },
            { name: 'defaultValue', type: 'Date | null', default: 'null', description: t('初始日期（非受控）。', 'Initial date (uncontrolled).') },
            { name: 'onChange', type: '(date: Date | null) => void', description: t('日期变化时触发；清空时为 null。', 'Called when the date changes; null when cleared.') },
            { name: 'format', type: '(date: Date) => string', default: 'formatISODate', description: t('日期 → 输入框里显示的文字。', 'Date → text shown in the input.') },
            { name: 'parse', type: '(text: string) => Date | null', default: 'parseISODate', description: t('输入的文字 → 日期；不合法返回 null。', 'Typed text → date; returns null when invalid.') },
            { name: 'min / max', type: 'Date', description: t('可选的最早 / 最晚日期（含）。', 'Earliest / latest selectable date (inclusive).') },
            { name: 'isDateDisabled', type: '(date: Date) => boolean', description: t('返回 true 的日期不可选。', 'Days for which it returns true cannot be selected.') },
            { name: 'weekStartsOn / locale / today', type: '—', description: t('传给里面的日历，见 Calendar。', 'Passed to the inner calendar; see Calendar.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'invalid', type: 'boolean', description: t('标成校验未通过。', 'Marks the field as invalid.') },
            { name: 'placeholder', type: 'string', default: t("'年-月-日'", "'YYYY-MM-DD'"), description: t('占位文字。', 'Placeholder text. The default follows the OinkProvider locale.') },
            { name: 'name / form', type: 'string', description: t('隐藏 input 的字段名，以 yyyy-MM-dd 提交。', 'Field name of the hidden input, submitted as yyyy-MM-dd.') },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: t('日历浮层的开关状态。', 'Whether the calendar popup is open.') },
            { name: 'placement', type: 'Placement', default: "'bottom-start'", description: t('日历相对输入框的位置。', 'Position of the calendar relative to the input.') },
            { name: '…rest', type: 'InputHTMLAttributes', description: t('ref、className、style 落在外框上，其余原生属性（id、disabled、readOnly、aria-*）落在 <input> 上。', 'ref, className and style go on the outer frame; other native attributes (id, disabled, readOnly, aria-*) go on the <input>.') },
          ]}
        />
        <PropsTable
          title="DateRangePicker"
          rows={[
            { name: 'value', type: '{ start: Date | null; end: Date | null }', description: t('选中的范围（受控）。', 'Selected range (controlled).') },
            { name: 'defaultValue', type: 'DateRange', default: '{ start: null, end: null }', description: t('初始范围（非受控）。', 'Initial range (uncontrolled).') },
            { name: 'onChange', type: '(range: DateRange) => void', description: t('每次点选都触发。', 'Called on every click.') },
            { name: 'placeholder', type: 'ReactNode', default: t("'开始日期 – 结束日期'", "'Start date – End date'"), description: t('没选时显示的文字。', 'Text shown when nothing is selected. The default follows the OinkProvider locale.') },
            { name: 'separator', type: 'string', default: "' – '", description: t('起止之间的连接符。', 'Separator between start and end.') },
            { name: 'startName / endName', type: 'string', description: t('起 / 止两个隐藏 input 的字段名。', 'Field names of the hidden start / end inputs.') },
            { name: 'format / min / max / isDateDisabled / size / invalid / open… / placement', type: '—', description: t('同 DatePicker。', 'Same as DatePicker.') },
            { name: '…rest', type: 'ButtonHTMLAttributes', description: t('ref 和其余原生属性落在触发按钮上。', 'ref and other native attributes go on the trigger button.') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>DatePicker 是一个普通文本框加一个名为“打开日历”的按钮；日历浮层是 <code>role="dialog"</code>，名称“选择日期”。不想用日历的用户可以全程打字。</>,
              <>在输入框里：<kbd>Enter</kbd> 或失焦提交输入的文字；<kbd>Alt</kbd>+<kbd>↓</kbd> 打开日历。<kbd>Tab</kbd> 到按钮后 <kbd>Enter</kbd> / <kbd>Space</kbd> 也能打开。</>,
              <>点按钮或按 <kbd>Alt</kbd> + <kbd>↓</kbd> 打开时，焦点落在日历的当前日期上，键盘操作同 Calendar；选中后收起，焦点回到按钮。<kbd>Esc</kbd> 不选直接收起。</>,
              <>点输入框打开时焦点留在输入框里，可以接着打字；按 <kbd>↓</kbd> 进入日历，选中后焦点回到输入框；<kbd>Esc</kbd> 只收起日历；焦点离开输入框和日历时自动收起。</>,
              <>DateRangePicker 的触发按钮带 <code>aria-haspopup="dialog"</code> 和 <code>aria-expanded</code>，按钮上的文字就是当前范围。注意：给按钮 <code>aria-label</code> 或用 label 关联后，读屏只读这个名称、不再读按钮上的日期，所以请把已选范围另外写在页面上（像上面的示例那样），或用 <code>aria-describedby</code> 指过去。</>,
              <>输入格式请写在提示文字里（如“格式：年-月-日”），不要只靠占位符——开始打字后占位符就看不到了。</>,
            ],
            [
              <>DatePicker is a plain text input plus a button named “Open calendar”; the calendar popup is <code>role="dialog"</code> named “Choose date”. People who would rather not use the calendar can type the whole way.</>,
              <>In the input: <kbd>Enter</kbd> or blur commits the typed text; <kbd>Alt</kbd>+<kbd>↓</kbd> opens the calendar. Tabbing to the button and pressing <kbd>Enter</kbd> / <kbd>Space</kbd> opens it too.</>,
              <>When opened from the button or with <kbd>Alt</kbd> + <kbd>↓</kbd>, focus lands on the current day in the calendar, with the same keyboard behavior as Calendar; picking a day closes it and returns focus to the button. <kbd>Esc</kbd> closes without picking.</>,
              <>When opened by clicking the input, focus stays in the input so you can keep typing; <kbd>↓</kbd> moves into the calendar and picking a day returns focus to the input; <kbd>Esc</kbd> only closes the calendar; it also closes when focus leaves both the input and the calendar.</>,
              <>DateRangePicker’s trigger carries <code>aria-haspopup="dialog"</code> and <code>aria-expanded</code>, and its text is the current range. Note: once the button has an <code>aria-label</code> or an associated label, screen readers announce only that name, not the dates on the button, so also show the selected range on the page (as in the example above) or point to it with <code>aria-describedby</code>.</>,
              <>Put the input format in the hint text (e.g. “Format: YYYY-MM-DD”) rather than relying on the placeholder, which disappears once typing starts.</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
