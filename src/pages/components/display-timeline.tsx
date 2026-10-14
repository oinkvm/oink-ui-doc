import { Card, Code, Icon, Timeline } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/timeline', title: 'Timeline 时间线', group: '数据展示', order: 120, subtitle: 'Timeline', en: { title: 'Timeline' } };

const CODE_BASIC = {
  zh: `
<Card>
  <Timeline
    aria-label="订单跟踪"
    items={[
      { title: '已签收', time: '今天 10:24', dateTime: '2024-08-17T10:24', description: '本人签收，感谢使用。' },
      { title: '派送中', time: '今天 08:10', dateTime: '2024-08-17T08:10', description: '快递员周师傅正在派送。' },
      { title: '到达上海转运中心', time: '昨天 21:36', dateTime: '2024-08-16T21:36' },
      { title: '已发货', time: '8 月 15 日', dateTime: '2024-08-15' },
    ]}
  />
</Card>`,
  en: `
<Card>
  <Timeline
    aria-label="Order tracking"
    items={[
      { title: 'Delivered', time: 'Today 10:24', dateTime: '2024-08-17T10:24', description: 'Signed for by the recipient. Thanks for your order.' },
      { title: 'Out for delivery', time: 'Today 08:10', dateTime: '2024-08-17T08:10', description: 'Your courier, Mike, is on the way.' },
      { title: 'Arrived at the Chicago sorting center', time: 'Yesterday 21:36', dateTime: '2024-08-16T21:36' },
      { title: 'Shipped', time: 'Aug 15', dateTime: '2024-08-15' },
    ]}
  />
</Card>`,
};

const CODE_TONES = {
  zh: `
<Card>
  <Timeline
    aria-label="部署记录"
    items={[
      { title: '部署成功', time: '14:02', tone: 'success', icon: <Icon name="check" />, description: 'v2.4.0 已上线，耗时 3 分 12 秒。' },
      { title: '构建告警', time: '13:58', tone: 'warning', icon: <Icon name="alert" />, description: '包体积比上一版大了 12%。' },
      { title: '测试失败', time: '13:41', tone: 'danger', icon: <Icon name="x" />, description: '2 个用例未通过，已自动重试。' },
      { title: '周屿 推送了 3 个提交', time: '13:40', tone: 'accent' },
      { title: '创建了发布分支', time: '13:22', tone: 'info' },
      { title: '计划发布', time: '昨天' },
    ]}
  />
</Card>`,
  en: `
<Card>
  <Timeline
    aria-label="Deployment log"
    items={[
      { title: 'Deployed', time: '14:02', tone: 'success', icon: <Icon name="check" />, description: 'v2.4.0 is live, took 3 min 12 s.' },
      { title: 'Build warning', time: '13:58', tone: 'warning', icon: <Icon name="alert" />, description: 'The bundle is 12% larger than the last release.' },
      { title: 'Tests failed', time: '13:41', tone: 'danger', icon: <Icon name="x" />, description: '2 test cases failed and were retried automatically.' },
      { title: 'Owen Hart pushed 3 commits', time: '13:40', tone: 'accent' },
      { title: 'Created a release branch', time: '13:22', tone: 'info' },
      { title: 'Release scheduled', time: 'Yesterday' },
    ]}
  />
</Card>`,
};

export default function TimelinePage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('按时间先后排列的一串事件：订单跟踪、操作记录、发布历史。表示“流程走到哪一步”请用 Steps。', 'A series of events in time order: order tracking, activity logs, release history. To show how far along a process is, use Steps.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('每个条目有标题、可选的时间和说明。节点之间用一条细线连起来。', 'Each entry has a title, plus an optional time and description. A thin line connects the nodes.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Card>
            <Timeline
              aria-label={t('订单跟踪', 'Order tracking')}
              items={t([
                { title: '已签收', time: '今天 10:24', dateTime: '2024-08-17T10:24', description: '本人签收，感谢使用。' },
                { title: '派送中', time: '今天 08:10', dateTime: '2024-08-17T08:10', description: '快递员周师傅正在派送。' },
                { title: '到达上海转运中心', time: '昨天 21:36', dateTime: '2024-08-16T21:36' },
                { title: '已发货', time: '8 月 15 日', dateTime: '2024-08-15' },
              ], [
                { title: 'Delivered', time: 'Today 10:24', dateTime: '2024-08-17T10:24', description: 'Signed for by the recipient. Thanks for your order.' },
                { title: 'Out for delivery', time: 'Today 08:10', dateTime: '2024-08-17T08:10', description: 'Your courier, Mike, is on the way.' },
                { title: 'Arrived at the Chicago sorting center', time: 'Yesterday 21:36', dateTime: '2024-08-16T21:36' },
                { title: 'Shipped', time: 'Aug 15', dateTime: '2024-08-15' },
              ])}
            />
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('颜色与图标', 'Colors and icons')} description={t('tone 给节点上色，icon 把圆点换成图标。颜色之外，标题文字本身要说清发生了什么。', 'tone colors the node, and icon swaps the dot for an icon. Beyond color, the title text itself has to say what happened.')}>
        <Demo layout="block" code={t(CODE_TONES.zh, CODE_TONES.en)}>
          <Card>
            <Timeline
              aria-label={t('部署记录', 'Deployment log')}
              items={[
                { title: t('部署成功', 'Deployed'), time: '14:02', tone: 'success', icon: <Icon name="check" />, description: t('v2.4.0 已上线，耗时 3 分 12 秒。', 'v2.4.0 is live, took 3 min 12 s.') },
                { title: t('构建告警', 'Build warning'), time: '13:58', tone: 'warning', icon: <Icon name="alert" />, description: t('包体积比上一版大了 12%。', 'The bundle is 12% larger than the last release.') },
                { title: t('测试失败', 'Tests failed'), time: '13:41', tone: 'danger', icon: <Icon name="x" />, description: t('2 个用例未通过，已自动重试。', '2 test cases failed and were retried automatically.') },
                { title: t('周屿 推送了 3 个提交', 'Owen Hart pushed 3 commits'), time: '13:40', tone: 'accent' },
                { title: t('创建了发布分支', 'Created a release branch'), time: '13:22', tone: 'info' },
                { title: t('计划发布', 'Release scheduled'), time: t('昨天', 'Yesterday') },
              ]}
            />
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Timeline" rows={[
          { name: 'items', type: 'TimelineEntry[]', required: true, description: t('事件列表，按显示顺序。', 'The events, in display order.') },
          { name: '...rest', type: 'HTMLAttributes<HTMLOListElement>', description: t(<>其余原生属性透传到 <Code>ol</Code>，建议给 <Code>aria-label</Code>。</>, <>Other native attributes are passed to the <Code>ol</Code>; an <Code>aria-label</Code> is recommended.</>) },
        ]} />
        <PropsTable title="TimelineEntry" rows={[
          { name: 'title', type: 'ReactNode', required: true, description: t('事件标题。', 'Event title.') },
          { name: 'description', type: 'ReactNode', description: t('标题下的说明。', 'Description under the title.') },
          { name: 'time', type: 'ReactNode', description: t('时间文字。', 'Time text.') },
          { name: 'dateTime', type: 'string', description: t(<>机器可读的时间，写进 <Code>time</Code> 元素的 <Code>dateTime</Code>。</>, <>Machine-readable time, written to the <Code>time</Code> element’s <Code>dateTime</Code>.</>) },
          { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: t('节点颜色。', 'Node color.') },
          { name: 'icon', type: 'ReactNode', description: t('替换圆点的图标。', 'Icon that replaces the dot.') },
          { name: 'key', type: 'string', description: t('列表会增删时给一个稳定的 key。', 'A stable key, for when entries are added or removed.') },
        ]} />
        <A11yNotes items={t([
          <>渲染成有序列表 <Code>ol</Code>，读屏会报出“列表，共 N 项”和每项的序号。</>,
          <>时间用 <Code>time</Code> 元素；写的是“今天”“昨天”这类相对时间时，请同时给 <Code>dateTime</Code>。</>,
          '节点（圆点、图标、连线）都是装饰，对读屏隐藏；所以标题不能省略状态（写“测试失败”而不是只靠红色）。',
          '不可聚焦，没有键盘操作；说明里的链接、按钮按文档顺序 Tab 到。',
        ], [
          <>Renders an ordered list <Code>ol</Code>, so screen readers announce “list, N items” and each item’s position.</>,
          <>Times use the <Code>time</Code> element; when you write relative times like “Today” or “Yesterday”, also provide <Code>dateTime</Code>.</>,
          'Nodes (dots, icons, connecting lines) are decorative and hidden from screen readers, so titles must state the status (write “Tests failed” rather than relying on red).',
          'Not focusable, no keyboard interaction; links and buttons in descriptions are reached by Tab in document order.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
