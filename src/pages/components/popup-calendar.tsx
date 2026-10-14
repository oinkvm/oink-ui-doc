import { useState } from 'react';
import { Button, Calendar, Inline, RangeCalendar, Stack, Text, formatISODate } from 'oink-ui';
import type { DateRange } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/calendar', title: 'Calendar 日历', group: '浮层', order: 80, subtitle: 'Calendar · RangeCalendar', en: { title: 'Calendar', subtitle: 'Calendar · RangeCalendar' } };

const TODAY = new Date(2026, 9, 13);
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

function ControlledDemo() {
  const t = useT();
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const jump = (d: Date) => { setDate(d); setMonth(d); };
  return (
    <Stack gap={3} align="center">
      <Calendar value={date} onChange={setDate} month={month} onMonthChange={setMonth} today={TODAY} />
      <Text tone="subtle" variant="caption">
        {t(
          <>已选：{date ? formatISODate(date) : '无'} · 显示月份：{month.getFullYear()} 年 {month.getMonth() + 1} 月</>,
          <>Selected: {date ? formatISODate(date) : 'none'} · Showing: {month.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</>,
        )}
      </Text>
      <Inline gap={2} justify="center">
        <Button size="sm" onClick={() => jump(TODAY)}>{t('回到今天', 'Back to today')}</Button>
        <Button size="sm" onClick={() => jump(new Date(2027, 0, 1))}>{t('跳到 2027 年元旦', 'Jump to Jan 1, 2027')}</Button>
      </Inline>
    </Stack>
  );
}

function RangeDemo() {
  const t = useT();
  const [range, setRange] = useState<DateRange>({ start: new Date(2026, 9, 12), end: new Date(2026, 9, 16) });
  const nights = range.start && range.end ? Math.round((range.end.getTime() - range.start.getTime()) / 86400000) : null;
  return (
    <Stack gap={3} align="center">
      <RangeCalendar value={range} onChange={setRange} defaultMonth={new Date(2026, 9, 1)} today={TODAY} />
      <Text tone="subtle" variant="caption">
        {range.start ? formatISODate(range.start) : '—'}{t(' 至 ', ' to ')}{range.end ? formatISODate(range.end) : t('（再点一天定终点）', '(pick an end date)')}
        {nights !== null && t(` · 共 ${nights} 晚`, ` · ${nights} ${nights === 1 ? 'night' : 'nights'}`)}
      </Text>
    </Stack>
  );
}

const CODE_LIMITS = {
  zh: `
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

<Calendar aria-label="只能选今天起两周内" defaultMonth={TODAY} today={TODAY} min={TODAY} max={new Date(2026, 9, 27)} />
<Calendar aria-label="周末不可选" defaultMonth={TODAY} today={TODAY} isDateDisabled={isWeekend} />
`,
  en: `
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

<Calendar aria-label="Within two weeks from today" defaultMonth={TODAY} today={TODAY} min={TODAY} max={new Date(2026, 9, 27)} />
<Calendar aria-label="Weekdays only" defaultMonth={TODAY} today={TODAY} isDateDisabled={isWeekend} />
`,
};

const CODE_LOCALE = {
  zh: `
<Calendar aria-label="周日开始" weekStartsOn={0} defaultValue={TODAY} today={TODAY} />
<Calendar locale="en-US" defaultValue={TODAY} today={TODAY} />
<Calendar aria-label="禁用" disabled defaultValue={TODAY} today={TODAY} />
`,
  en: `
<Calendar aria-label="Week starts on Sunday" weekStartsOn={0} defaultValue={TODAY} today={TODAY} />
<Calendar locale="zh-CN" defaultValue={TODAY} today={TODAY} />
<Calendar aria-label="Disabled" disabled defaultValue={TODAY} today={TODAY} />
`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const jump = (d: Date) => { setDate(d); setMonth(d); };
  return (
    <Stack gap={3} align="center">
      <Calendar value={date} onChange={setDate} month={month} onMonthChange={setMonth} today={TODAY} />
      <Text tone="subtle" variant="caption">已选：{date ? formatISODate(date) : '无'} · 显示月份：{month.getFullYear()} 年 {month.getMonth() + 1} 月</Text>
      <Inline gap={2} justify="center">
        <Button size="sm" onClick={() => jump(TODAY)}>回到今天</Button>
        <Button size="sm" onClick={() => jump(new Date(2027, 0, 1))}>跳到 2027 年元旦</Button>
      </Inline>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 20));
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const jump = (d: Date) => { setDate(d); setMonth(d); };
  return (
    <Stack gap={3} align="center">
      <Calendar value={date} onChange={setDate} month={month} onMonthChange={setMonth} today={TODAY} />
      <Text tone="subtle" variant="caption">
        Selected: {date ? formatISODate(date) : 'none'} · Showing: {month.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
      </Text>
      <Inline gap={2} justify="center">
        <Button size="sm" onClick={() => jump(TODAY)}>Back to today</Button>
        <Button size="sm" onClick={() => jump(new Date(2027, 0, 1))}>Jump to Jan 1, 2027</Button>
      </Inline>
    </Stack>
  );
}
`,
};

const CODE_RANGE = {
  zh: `
function RangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: new Date(2026, 9, 12), end: new Date(2026, 9, 16) });
  const nights = range.start && range.end ? Math.round((range.end.getTime() - range.start.getTime()) / 86400000) : null;
  return (
    <Stack gap={3} align="center">
      <RangeCalendar value={range} onChange={setRange} defaultMonth={new Date(2026, 9, 1)} today={TODAY} />
      <Text tone="subtle" variant="caption">
        {range.start ? formatISODate(range.start) : '—'} 至 {range.end ? formatISODate(range.end) : '（再点一天定终点）'}
        {nights !== null && \` · 共 \${nights} 晚\`}
      </Text>
    </Stack>
  );
}
`,
  en: `
function RangeDemo() {
  const [range, setRange] = useState<DateRange>({ start: new Date(2026, 9, 12), end: new Date(2026, 9, 16) });
  const nights = range.start && range.end ? Math.round((range.end.getTime() - range.start.getTime()) / 86400000) : null;
  return (
    <Stack gap={3} align="center">
      <RangeCalendar value={range} onChange={setRange} defaultMonth={new Date(2026, 9, 1)} today={TODAY} />
      <Text tone="subtle" variant="caption">
        {range.start ? formatISODate(range.start) : '—'} to {range.end ? formatISODate(range.end) : '(pick an end date)'}
        {nights !== null && \` · \${nights} \${nights === 1 ? 'night' : 'nights'}\`}
      </Text>
    </Stack>
  );
}
`,
};

const CODE_RANGE_UNCONTROLLED = {
  zh: `
<RangeCalendar
  aria-label="入住日期"
  defaultValue={{ start: new Date(2026, 9, 26), end: new Date(2026, 10, 3) }}
  today={TODAY}
  min={TODAY}
/>
`,
  en: `
<RangeCalendar
  aria-label="Stay dates"
  defaultValue={{ start: new Date(2026, 9, 26), end: new Date(2026, 10, 3) }}
  today={TODAY}
  min={TODAY}
/>
`,
};

export default function CalendarPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '直接摆在页面上的月历：选一天用 Calendar，选一段用 RangeCalendar。空间紧张、希望平时只占一行时，用包了一层浮层的 DatePicker / DateRangePicker。',
        'A month grid placed right on the page: Calendar picks a single day, RangeCalendar picks a span. When space is tight and you want it to take up one line until needed, use DatePicker / DateRangePicker, which wrap it in a popup.',
      )}
    >
      <DocSection
        title={t('基本用法', 'Basic usage')}
        description={t(
          '默认显示今天所在的月份，一周从周一开始。上下月的日期也显示出来并且可以点，点了会翻到那个月。示例里用 today 把“今天”固定在 2026-10-13，方便对照。',
          'Shows the month containing today, with weeks starting on Monday. Days from the adjacent months are shown and clickable; clicking one flips to that month. The examples pin “today” to 2026-10-13 with the today prop so they stay comparable.',
        )}
      >
        <Demo
          code={`
const TODAY = new Date(2026, 9, 13);

<Calendar defaultValue={new Date(2026, 9, 8)} today={TODAY} />
`}
        >
          <Calendar defaultValue={new Date(2026, 9, 8)} today={TODAY} />
        </Demo>
      </DocSection>

      <DocSection
        title={t('限制可选日期', 'Limiting selectable dates')}
        description={t(
          'min / max 限定范围（含两端），isDateDisabled 逐天判断。不可选的日期置灰，键盘可以经过但不能选中。',
          'min / max bound the range (inclusive); isDateDisabled decides day by day. Unavailable days are dimmed: the keyboard can move across them but not select them.',
        )}
      >
        <Demo code={t(CODE_LIMITS.zh, CODE_LIMITS.en)}>
          <Calendar aria-label={t('只能选今天起两周内', 'Within two weeks from today')} defaultMonth={TODAY} today={TODAY} min={TODAY} max={new Date(2026, 9, 27)} />
          <Calendar aria-label={t('周末不可选', 'Weekdays only')} defaultMonth={TODAY} today={TODAY} isDateDisabled={isWeekend} />
        </Demo>
      </DocSection>

      <DocSection
        title={t('周起始日、语言与禁用', 'Week start, locale and disabled')}
        description={t(
          'weekStartsOn 为 0 时从周日开始。locale 决定月份标题、星期名和读屏文字的语言。',
          'weekStartsOn={0} starts the week on Sunday. locale sets the language of the month title, weekday names and screen reader text; without it, the calendar follows the OinkProvider locale.',
        )}
      >
        <Demo code={t(CODE_LOCALE.zh, CODE_LOCALE.en)}>
          <Calendar aria-label={t('周日开始', 'Week starts on Sunday')} weekStartsOn={0} defaultValue={TODAY} today={TODAY} />
          <Calendar locale={t('en-US', 'zh-CN')} defaultValue={TODAY} today={TODAY} />
          <Calendar aria-label={t('禁用', 'Disabled')} disabled defaultValue={TODAY} today={TODAY} />
        </Demo>
      </DocSection>

      <DocSection
        title={t('受控用法', 'Controlled usage')}
        description={t(
          '选中的日期（value）和正在显示的月份（month）是两份独立的状态，都可以受控。从外部改 value 不会自动翻月，需要时一并设置 month。',
          'The selected date (value) and the visible month (month) are two independent pieces of state, and both can be controlled. Changing value from outside does not flip the month; set month as well when you need to.',
        )}
      >
        <Demo code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('范围日历', 'Range calendar')}
        description={t(
          'RangeCalendar 第一次点定起点，第二次点定终点（点在起点之前会自动对调）；只定了起点时，指针划过的日期会预览这一段。已有完整范围时再点，重新开始选。',
          'In RangeCalendar the first click sets the start and the second sets the end (clicking before the start swaps them). With only a start set, hovering previews the span. Clicking again once a full range exists starts a new selection.',
        )}
      >
        <Demo title={t('受控', 'Controlled')} code={t(CODE_RANGE.zh, CODE_RANGE.en)}>
          <RangeDemo />
        </Demo>
        <Demo title={t('非受控，带限制', 'Uncontrolled, with limits')} code={t(CODE_RANGE_UNCONTROLLED.zh, CODE_RANGE_UNCONTROLLED.en)}>
          <RangeCalendar
            aria-label={t('入住日期', 'Stay dates')}
            defaultValue={{ start: new Date(2026, 9, 26), end: new Date(2026, 10, 3) }}
            today={TODAY}
            min={TODAY}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Calendar"
          rows={[
            { name: 'value', type: 'Date | null', description: t('选中的日期（受控）。只按本地时区的“天”计算，不带时间。', 'Selected date (controlled). Compared by calendar day in the local time zone; the time part is ignored.') },
            { name: 'defaultValue', type: 'Date | null', default: 'null', description: t('初始选中的日期（非受控）。', 'Initially selected date (uncontrolled).') },
            { name: 'onChange', type: '(date: Date) => void', description: t('选了一天时触发。', 'Called when a day is picked.') },
            { name: 'month', type: 'Date', description: t('当前显示的月份（受控），取其中任意一天。', 'Visible month (controlled); any day within that month.') },
            { name: 'defaultMonth', type: 'Date', default: t('选中日期或今天所在的月', 'Month of the selected date, or of today'), description: t('初始显示的月份。', 'Initially visible month.') },
            { name: 'onMonthChange', type: '(month: Date) => void', description: t('翻月时触发。', 'Called when the month changes.') },
            { name: 'min / max', type: 'Date', description: t('可选的最早 / 最晚日期（含）。', 'Earliest / latest selectable date (inclusive).') },
            { name: 'isDateDisabled', type: '(date: Date) => boolean', description: t('返回 true 的日期不可选。', 'Days for which it returns true cannot be selected.') },
            { name: 'weekStartsOn', type: '0 | 1 | 2 | 3 | 4 | 5 | 6', default: '1', description: t('一周从星期几开始：0 = 周日，1 = 周一。', 'First day of the week: 0 = Sunday, 1 = Monday.') },
            { name: 'locale', type: 'string', default: t('跟随 OinkProvider', 'from OinkProvider'), description: t('月份标题、星期名和读屏文字的语言。不传时跟随 OinkProvider 的 locale（默认按浏览器语言）。', 'Language of the month title, weekday names and screen reader text. Follows the OinkProvider locale when omitted (by default, the browser language).') },
            { name: 'today', type: 'Date', default: t('系统日期', 'System date'), description: t('“今天”是哪天。', 'Which day counts as “today”.') },
            { name: 'autoFocus', type: 'boolean', description: t('挂载时把焦点放到当前日期上。', 'Moves focus to the current day on mount.') },
            { name: 'disabled', type: 'boolean', description: t('整体禁用。', 'Disables the whole calendar.') },
          ]}
        />
        <PropsTable
          title="RangeCalendar"
          rows={[
            { name: 'value', type: '{ start: Date | null; end: Date | null }', description: t('选中的范围（受控）。只定了起点时 end 为 null。', 'Selected range (controlled). end is null while only the start is set.') },
            { name: 'defaultValue', type: 'DateRange', default: '{ start: null, end: null }', description: t('初始范围（非受控）。', 'Initial range (uncontrolled).') },
            { name: 'onChange', type: '(range: DateRange) => void', description: t('每次点选都触发：先是只有起点，再是完整范围。', 'Called on every click: first with just the start, then with the full range.') },
            { name: t('其余', 'Others'), type: '—', description: t('同 Calendar。', 'Same as Calendar.') },
          ]}
        />
        <PropsTable
          title={t('工具函数', 'Utilities')}
          rows={[
            { name: 'formatISODate', type: '(date: Date) => string', description: t('格式化成 2026-10-13。', 'Formats as 2026-10-13.') },
            { name: 'parseISODate', type: '(text: string) => Date | null', description: t('解析 2026-10-13、2026/10/13、2026.10.13、2026年10月13日；不合法返回 null。', 'Parses 2026-10-13, 2026/10/13, 2026.10.13 and 2026年10月13日; returns null for anything invalid.') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>日期网格是 <code>role="grid"</code>，名称取月份标题（或 <code>aria-label</code>）；每一天是格子里的按钮，名称是完整日期（“2026年10月13日星期二，今天”），今天带 <code>aria-current="date"</code>。</>,
              <>整个网格只有一个 Tab 停靠点（选中的日期，否则是今天）。<kbd>←</kbd> <kbd>→</kbd> 前后一天，<kbd>↑</kbd> <kbd>↓</kbd> 前后一周，<kbd>Home</kbd> / <kbd>End</kbd> 到本周首尾，<kbd>PageUp</kbd> / <kbd>PageDown</kbd> 前后一个月，加 <kbd>Shift</kbd> 前后一年；跨月时自动翻页。<kbd>Enter</kbd> / <kbd>Space</kbd> 选中。</>,
              <>“上个月 / 下个月”是带名称的图标按钮；月份标题是 aria-live，翻月后会播报。</>,
              <>不可选的日期是 <code>aria-disabled</code>：键盘仍能经过（方便数日子），但不能选中。</>,
              <>今天用一个小圆点标记，选中用实心底色，范围用连续的底色，都不只靠颜色深浅。</>,
            ],
            [
              <>The day grid is <code>role="grid"</code>, named by the month title (or <code>aria-label</code>). Each day is a button in a cell whose name is the full date (“Tuesday, October 13, 2026, today”); today carries <code>aria-current="date"</code>.</>,
              <>The grid has a single Tab stop (the selected day, otherwise today). <kbd>←</kbd> <kbd>→</kbd> move by a day, <kbd>↑</kbd> <kbd>↓</kbd> by a week, <kbd>Home</kbd> / <kbd>End</kbd> to the start / end of the week, <kbd>PageUp</kbd> / <kbd>PageDown</kbd> by a month, and with <kbd>Shift</kbd> by a year; the view flips months automatically. <kbd>Enter</kbd> / <kbd>Space</kbd> select.</>,
              <>“Previous month / Next month” are labelled icon buttons; the month title is aria-live and is announced after flipping.</>,
              <>Unavailable days are <code>aria-disabled</code>: the keyboard still moves across them (handy for counting days), but they can’t be selected.</>,
              <>Today is marked with a small dot, the selection with a solid fill and a range with a continuous fill, so none of them relies on shade alone.</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
