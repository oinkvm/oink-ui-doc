import { Card, Code, Grid, Icon, Stat } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/stat', title: 'Stat 指标', group: '数据展示', order: 110, subtitle: 'Stat', en: { title: 'Stat' } };

/** 示例里的文字 */
const W = {
  zh: { active: '本周活跃用户', latency: '平均响应时间', conversion: '转化率', vsLastWeek: '较上周', revenue: '收入', rev1: '¥86,200', rev2: '¥71,900', errors: '错误率', downloads: '下载量', subs: '订阅', newSubs: '本月新增 112', tickets: '未处理工单' },
  en: { active: 'Weekly active users', latency: 'Avg. response time', conversion: 'Conversion rate', vsLastWeek: 'vs. last week', revenue: 'Revenue', rev1: '$86,200', rev2: '$71,900', errors: 'Error rate', downloads: 'Downloads', subs: 'Subscribers', newSubs: '112 new this month', tickets: 'Open tickets' },
};
type Words = typeof W.zh;

const codeBasic = (w: Words) => `
<Grid minItemWidth={200}>
  <Stat label="${w.active}" value="12,480" delta="12.5%" trend="up" hint="${w.vsLastWeek}" />
  <Stat label="${w.latency}" value="238 ms" delta="18 ms" trend="down" positive="down" hint="${w.vsLastWeek}" />
  <Stat label="${w.conversion}" value="3.2%" delta="0.0%" trend="flat" hint="${w.vsLastWeek}" />
</Grid>`;

const codePositive = (w: Words) => `
<Grid columns={{ base: 1, sm: 2 }}>
  <Stat label="${w.revenue}" value="${w.rev1}" delta="8%" trend="up" />
  <Stat label="${w.revenue}" value="${w.rev2}" delta="9%" trend="down" />
  <Stat label="${w.errors}" value="1.8%" delta="0.6%" trend="up" positive="down" />
  <Stat label="${w.errors}" value="0.4%" delta="0.3%" trend="down" positive="down" />
</Grid>`;

const codePlain = (w: Words) => `
<Card>
  <Grid minItemWidth={160} gap={5}>
    <Stat variant="plain" icon={<Icon name="download" />} label="${w.downloads}" value="48,210" delta="320" trend="up" />
    <Stat variant="plain" icon={<Icon name="mail" />} label="${w.subs}" value="2,934" hint="${w.newSubs}" />
    <Stat variant="plain" icon={<Icon name="alert" />} label="${w.tickets}" value="7" />
  </Grid>
</Card>`;

export default function StatPage() {
  const t = useT();
  const w = t(W.zh, W.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('一个关键数字加它的涨跌：仪表盘顶部的那排指标卡。一张卡只讲一个数。', 'A key number and its change: the row of metric cards across the top of a dashboard. One number per card.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('label 是指标名，value 是数值；delta 配合 trend 显示涨跌，hint 补充对比的基准。', 'label is the metric name and value the number; delta with trend shows the change, and hint adds the baseline it’s compared against.')}>
        <Demo layout="block" code={codeBasic(w)}>
          <Grid minItemWidth={200}>
            <Stat label={w.active} value="12,480" delta="12.5%" trend="up" hint={w.vsLastWeek} />
            <Stat label={w.latency} value="238 ms" delta="18 ms" trend="down" positive="down" hint={w.vsLastWeek} />
            <Stat label={w.conversion} value="3.2%" delta="0.0%" trend="flat" hint={w.vsLastWeek} />
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('涨跌的好坏', 'Good or bad direction')} description={t('默认“涨是好事”：涨绿跌红。错误率、响应时间这类指标反过来，传 positive="down"。箭头方向始终跟着 trend，颜色跟着好坏。', 'By default “up is good”: green for up, red for down. For metrics like error rate or response time it’s the other way around, so pass positive="down". The arrow always follows trend; the color follows good or bad.')}>
        <Demo layout="block" code={codePositive(w)}>
          <Grid columns={{ base: 1, sm: 2 }}>
            <Stat label={w.revenue} value={w.rev1} delta="8%" trend="up" />
            <Stat label={w.revenue} value={w.rev2} delta="9%" trend="down" />
            <Stat label={w.errors} value="1.8%" delta="0.6%" trend="up" positive="down" />
            <Stat label={w.errors} value="0.4%" delta="0.3%" trend="down" positive="down" />
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('图标与无底变体', 'Icons and plain variant')} description={t('icon 放在指标名前面。variant="plain" 去掉卡片底，用来把几个指标并排放进同一张卡片。', 'icon goes before the metric name. variant="plain" drops the card background so several metrics can sit side by side in one card.')}>
        <Demo layout="block" code={codePlain(w)}>
          <Card>
            <Grid minItemWidth={160} gap={5}>
              <Stat variant="plain" icon={<Icon name="download" />} label={w.downloads} value="48,210" delta="320" trend="up" />
              <Stat variant="plain" icon={<Icon name="mail" />} label={w.subs} value="2,934" hint={w.newSubs} />
              <Stat variant="plain" icon={<Icon name="alert" />} label={w.tickets} value="7" />
            </Grid>
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'label', type: 'ReactNode', required: true, description: t('指标名。', 'Metric name.') },
          { name: 'value', type: 'ReactNode', required: true, description: t('数值。', 'The value.') },
          { name: 'delta', type: 'ReactNode', description: t('涨跌幅文字，如“12.5%”“+320”。只传 delta 不传 trend 时按持平显示。', 'Change text, such as “12.5%” or “+320”. With delta but no trend, it’s shown as unchanged.') },
          { name: 'trend', type: "'up' | 'down' | 'flat'", description: t('涨 / 跌 / 持平，决定箭头方向。', 'Up / down / flat; sets the arrow direction.') },
          { name: 'positive', type: "'up' | 'down'", default: "'up'", description: t('哪个方向是好事。up：涨绿跌红；down：涨红跌绿。', 'Which direction is good. up: green up, red down; down: red up, green down.') },
          { name: 'hint', type: 'ReactNode', description: t('补充说明，如“较上周”。', 'Extra note, such as “vs. last week”.') },
          { name: 'icon', type: 'ReactNode', description: t('标签旁的图标。', 'Icon next to the label.') },
          { name: 'variant', type: "'card' | 'plain'", default: "'card'", description: t('card：带卡片底；plain：没有底，放在别的容器里。', 'card: on a card background; plain: no background, for placing inside another container.') },
        ]} />
        <A11yNotes items={t([
          '涨跌不只靠红绿：箭头方向是第二种提示，读屏还会在数字前读出“上升 / 下降 / 持平”。',
          <>指标卡没有角色，按阅读顺序读出 指标名 → 数值 → 涨跌 → 说明。数值会实时刷新且需要播报时，在外层加 <Code>role="status"</Code>。</>,
          '图标是装饰，对读屏隐藏。不可聚焦，没有键盘操作。',
        ], [
          'Change isn’t conveyed by red and green alone: the arrow direction is a second cue, and screen readers hear “Up / Down / Unchanged” before the number.',
          <>The card has no role and reads in order: name → value → change → hint. If the value updates live and should be announced, add <Code>role="status"</Code> on a wrapper.</>,
          'The icon is decorative and hidden from screen readers. Not focusable, no keyboard interaction.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
