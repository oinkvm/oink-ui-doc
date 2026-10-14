/* 数据展示、导航、反馈类的预览 */
import {
  Accordion, Alert, Avatar, AvatarGroup, Badge, Breadcrumb, CodeBlock, Count, DescriptionList, Dots, EmptyState, Group, Icon,
  List, ListItem, Pagination, Progress, ProgressRing, Reaction, Roll, Row, Skeleton, Spinner, Stat, Steps, Switch, Tabs, Tag,
  Timeline, Tree,
} from 'oink-ui';
import type { CSSProperties } from 'react';
import { useT } from '../i18n';
import { pick, useStep } from './loop';

const noop = () => {};
const d = (s: number) => ({ '--d': `${s}s` } as CSSProperties);

/* —— 数据展示 —— */

/** Surface：一块面板从画布上浮起，里面的卡片依次落位 */
export function SurfacePreview() {
  return (
    <div className="pv-surf a">
      <div className="pv-mini-card a" style={d(0.25)}><i className="pv-dot" /><i className="pv-bar" style={{ width: '55%' }} /></div>
      <div className="pv-mini-card a" style={d(0.4)}><i className="pv-dot" /><i className="pv-bar" style={{ width: '40%' }} /></div>
    </div>
  );
}

/** Card：两张卡片轮流被“按下”：描边加深、回缩一点 */
export function CardPreview() {
  return (
    <div className="pv-cards">
      {[0, 1].map((i) => (
        <div key={i} className="pv-card a" style={d(i * 1.6)}>
          <span className="pv-card__media" />
          <i className="pv-bar" style={{ width: '70%' }} />
          <i className="pv-bar pv-bar--soft" style={{ width: '45%' }} />
        </div>
      ))}
    </div>
  );
}

/** Image：先是微光占位，图片加载好后淡入 */
export function ImagePreview() {
  return (
    <div className="pv-image">
      <span className="pv-image__ph" />
      <svg className="pv-image__art a" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">
        <rect width="160" height="100" className="pv-art-sky" />
        <circle cx="116" cy="34" r="12" className="pv-art-sun" />
        <path d="M0 70C30 52 56 54 84 66S132 78 160 58V100H0Z" className="pv-art-hill1" />
        <path d="M0 86C40 74 80 76 112 84S144 92 160 86V100H0Z" className="pv-art-hill2" />
      </svg>
    </div>
  );
}

export function GroupPreview() {
  const t = useT();
  const s = useStep(1300, 1);
  return (
    <Group className="pv-w pv-group">
      <Row leading={<Icon name="bell" />} label={t('通知', 'Notifications')}><Switch checked={s % 2 === 1} onChange={noop} aria-label={t('通知', 'Notifications')} /></Row>
      <Row leading={<Icon name="moon" />} label={t('深色', 'Dark')}><Switch checked={s % 4 >= 2} onChange={noop} aria-label={t('深色', 'Dark')} /></Row>
    </Group>
  );
}

const PEOPLE = {
  zh: [
    { name: '林夏', text: '更新了首页设计稿' },
    { name: '周舟', text: '评论了你的任务' },
    { name: '陈默', text: '把任务标为已完成' },
  ],
  en: [
    { name: 'Lena Hart', text: 'Updated the homepage design' },
    { name: 'Owen Brooks', text: 'Commented on your task' },
    { name: 'Sam Reed', text: 'Marked a task as done' },
  ],
};
/** List：条目一条条出现，停一会儿后整体淡出重来 */
export function ListPreview() {
  const t = useT();
  return (
    <List divided size="sm" className="pv-w pv-list">
      {t(PEOPLE.zh, PEOPLE.en).map((p, i) => (
        <ListItem key={p.name} className="a" style={d(i * 0.22)} leading={<Avatar name={p.name} color="auto" size="sm" decorative />} title={p.name} description={p.text} />
      ))}
    </List>
  );
}

const ORDER_STATES = [
  { tone: 'warning', label: '待付款', en: 'Unpaid' },
  { tone: 'info', label: '已付款', en: 'Paid' },
  { tone: 'success', label: '已发货', en: 'Shipped' },
] as const;
export function DescriptionListPreview() {
  const t = useT();
  const s = useStep(1300, 2);
  const st = pick(ORDER_STATES, s);
  return (
    <DescriptionList
      layout="inline" divided className="pv-w pv-dl"
      items={[
        { term: t('订单号', 'Order'), description: 'OK-20481' },
        { term: t('金额', 'Amount'), description: <Roll value={pick(t(['¥128', '¥128', '¥96'], ['$128', '$128', '$96']), s)} /> },
        { term: t('状态', 'Status'), description: <Badge key={st.label} tone={st.tone} dot className="pv-once">{t<string>(st.label, st.en)}</Badge> },
      ]}
    />
  );
}

/** Table：表头 + 四行，悬停高亮在行间滑动 */
export function TablePreview() {
  const s = useStep(900, 1);
  const row = pick([0, 1, 2, 3, 2, 1], s);
  return (
    <div className="pv-table" style={{ '--row': row } as CSSProperties}>
      <div className="pv-table__head"><i className="pv-bar" /><i className="pv-bar" /><i className="pv-bar" /></div>
      <span className="pv-table__hl" />
      {[64, 48, 72, 56].map((w, i) => (
        <div key={i} className="pv-table__row" data-on={row === i || undefined}>
          <i className="pv-bar" style={{ width: `${w}%` }} /><i className="pv-bar pv-bar--soft" /><i className="pv-pill" data-tone={i % 3} />
        </div>
      ))}
    </div>
  );
}

const AV = {
  zh: ['林夏', '周舟', 'Mia Chen', '陈默', '许一帆', 'Leo Wang'],
  en: ['Lena Hart', 'Owen Brooks', 'Mia Chen', 'Sam Reed', 'Ivy Cole', 'Leo Wang'],
};
export function AvatarPreview() {
  const t = useT();
  const s = useStep([900, 420, 420, 420, 420, 1600], 5);
  const n = s + 1;
  return (
    <div className="pv-col pv-center">
      <AvatarGroup label={t('成员', 'Members')} max={5} total={n + 1}>
        {t(AV.zh, AV.en).slice(0, n).map((p) => <Avatar key={p} name={p} color="auto" className="pv-once" />)}
      </AvatarGroup>
      <div className="pv-row">
        <Avatar name={t('林夏', 'Lena Hart')} color="auto" status="online" size="lg" />
        <Avatar name="Leo Wang" color="auto" status={s % 2 ? 'busy' : 'away'} size="lg" />
      </div>
    </div>
  );
}

const BADGES = [
  { tone: 'neutral', label: '草稿', en: 'Draft', dot: false },
  { tone: 'warning', label: '审核中', en: 'In review', dot: true },
  { tone: 'success', label: '已发布', en: 'Published', dot: true },
] as const;
export function BadgePreview() {
  const t = useT();
  const s = useStep(1300, 2);
  const b = pick(BADGES, s);
  return (
    <div className="pv-col pv-center">
      <Badge tone="info" ping>{t('进行中', 'In progress')}</Badge>
      <Badge key={b.label} tone={b.tone} dot={b.dot} className="pv-once">{t<string>(b.label, b.en)}</Badge>
      <div className="pv-row"><Badge tone="accent" variant="solid">{t('新', 'New')}</Badge><Badge variant="ink">Beta</Badge></div>
    </div>
  );
}

const TAGS = [
  { label: '设计', en: 'Design', tone: 'neutral' },
  { label: '前端', en: 'Frontend', tone: 'info' },
  { label: '紧急', en: 'Urgent', tone: 'danger' },
  { label: '本周', en: 'This week', tone: 'success' },
] as const;
export function TagPreview() {
  const t = useT();
  const s = useStep([700, 500, 500, 500, 1500], 4);
  return (
    <div className="pv-row pv-wrap pv-w">
      {TAGS.slice(0, s).map((tag) => <Tag key={tag.label} tone={tag.tone} onRemove={noop} className="pv-once">{t<string>(tag.label, tag.en)}</Tag>)}
      {s === 0 && <span className="pv-ghost-tag" />}
    </div>
  );
}

export function CountPreview() {
  const s = useStep(1000, 2);
  return (
    <div className="pv-row pv-counts">
      <span className="pv-anchor"><Icon name="bell" /><Count value={pick([1, 3, 8, 12, 5], s)} /></span>
      <span className="pv-anchor"><Icon name="inbox" /><Count value={pick([24, 36, 99, 128, 64], s)} max={99} tone="neutral" /></span>
      <span className="pv-anchor"><Icon name="cart" /><Count value={pick([0, 1, 2, 2, 1], s)} tone="danger" /></span>
    </div>
  );
}

const STATS = [
  { value: '¥21,860', delta: '−2.3%', trend: 'down' },
  { value: '¥94,500', delta: '+12.4%', trend: 'up' },
  { value: '¥1.08M', delta: '+31%', trend: 'up' },
] as const;
export function StatPreview() {
  const t = useT();
  const s = useStep(1500, 1);
  const r = pick(STATS, s);
  return (
    <div className="pv-w">
      <Stat label={t('净收入', 'Net revenue')} value={<Roll value={t(r.value, r.value.replace('¥', '$'))} />} delta={r.delta} trend={r.trend} hint={pick(t(['近 7 天', '近 1 月', '近 1 年'], ['Last 7 days', 'Last 30 days', 'Last 12 months']), s)} />
    </div>
  );
}

const EVENTS = [
  { key: 'a', title: '已下单', en: 'Ordered', time: '09:12', tone: 'neutral' },
  { key: 'b', title: '已付款', en: 'Paid', time: '09:13', tone: 'info' },
  { key: 'c', title: '已发货', en: 'Shipped', time: '14:40', tone: 'success' },
] as const;
export function TimelinePreview() {
  const t = useT();
  const s = useStep([800, 650, 650, 1600], 3);
  return <Timeline className="pv-w pv-tl" items={EVENTS.slice(0, Math.max(1, s)).map(({ en, ...e }) => ({ ...e, title: t<string>(e.title, en) }))} />;
}

const TREE = [
  {
    id: 'src', label: 'src', icon: <Icon name="folder" />,
    children: [
      { id: 'cmp', label: 'components', icon: <Icon name="folder" />, children: [{ id: 'btn', label: 'Button.tsx', icon: <Icon name="file" /> }] },
      { id: 'main', label: 'main.tsx', icon: <Icon name="file" /> },
    ],
  },
  { id: 'pkg', label: 'package.json', icon: <Icon name="file" /> },
];
export function TreePreview() {
  const t = useT();
  const s = useStep([900, 900, 1600, 700], 2);
  const expanded = pick([[], ['src'], ['src', 'cmp'], ['src']], s);
  return <Tree className="pv-w pv-tree" label={t('文件', 'Files')} items={TREE} expanded={expanded} onExpandedChange={noop} selected={pick([null, 'main', 'btn', 'main'], s)} onSelect={noop} />;
}

const SNIPPET = {
  zh: "import { Switch } from 'oink-ui';\n\n<Switch defaultChecked>免打扰</Switch>",
  en: "import { Switch } from 'oink-ui';\n\n<Switch defaultChecked>Mute</Switch>",
};
export function CodePreview() {
  const t = useT();
  const chars = Array.from(t(SNIPPET.zh, SNIPPET.en));
  const steps = [600, ...chars.map(() => 45), 2000];
  const s = useStep(steps, steps.length - 1);
  return <CodeBlock className="pv-w pv-code" wrap code={chars.slice(0, Math.min(s, chars.length)).join('') || ' '} copyable={false} />;
}

export function ReactionPreview() {
  const t = useT();
  const s = useStep(1200, 1);
  return (
    <div className="pv-row">
      <Reaction pressed={s % 2 === 1} count={12} onChange={noop} noBurst />
      <Reaction pressed={s % 3 === 2} count={4} onChange={noop} noBurst icon={<Icon name="heart" />} label={t('喜欢', 'Like')} />
    </div>
  );
}

/* —— 导航 —— */

export function TabsPreview() {
  const t = useT();
  const s = useStep(1200, 1);
  return (
    <Tabs
      className="pv-w pv-tabs" label={t('视图', 'Views')} value={pick(['a', 'b', 'c', 'b'], s)} onChange={noop}
      items={[
        { value: 'a', label: t('概览', 'Overview'), content: <Lines widths={[80, 60, 70]} /> },
        { value: 'b', label: t('成员', 'Members'), content: <Lines widths={[55, 75, 40]} /> },
        { value: 'c', label: t('设置', 'Settings'), content: <Lines widths={[65, 45, 80]} /> },
      ]}
    />
  );
}
function Lines({ widths }: { widths: number[] }) {
  return <div className="pv-lines">{widths.map((w, i) => <i key={i} className="pv-bar" style={{ width: `${w}%` }} />)}</div>;
}

export function AccordionPreview() {
  const t = useT();
  const s = useStep(1500, 0);
  return (
    <Accordion
      className="pv-w pv-acc" type="single" collapsible value={pick([['a'], ['b'], []], s)} onChange={noop}
      items={[
        { value: 'a', title: t('可以退款吗？', 'Can I get a refund?'), content: <Lines widths={[90, 60]} /> },
        { value: 'b', title: t('怎么加席位？', 'How do I add seats?'), content: <Lines widths={[80, 50]} /> },
      ]}
    />
  );
}

const CRUMBS = { zh: ['首页', '项目', '设计', '改版'], en: ['Home', 'Projects', 'Design', 'v2'] };
export function BreadcrumbPreview() {
  const t = useT();
  const s = useStep([900, 700, 700, 1600], 3);
  return <Breadcrumb className="pv-crumbs" label={t('位置', 'Location')} items={t(CRUMBS.zh, CRUMBS.en).slice(0, s + 1).map((label) => ({ label }))} />;
}

export function PaginationPreview() {
  const t = useT();
  const s = useStep(900, 2);
  return <Pagination count={4} page={pick([1, 2, 3, 4, 3, 2], s)} onChange={noop} size="sm" label={t('分页', 'Pagination')} />;
}

export function StepsPreview() {
  const t = useT();
  const s = useStep([1100, 1100, 1100, 1500], 1);
  return <Steps className="pv-w" label={t('下单', 'Checkout')} current={s} items={[{ title: t('填写', 'Details') }, { title: t('支付', 'Payment') }, { title: t('完成', 'Done') }]} />;
}

/* —— 反馈 —— */

export function AlertPreview() {
  const t = useT();
  const s = useStep([1900, 500, 1900, 500], 0);
  return (
    <div className="pv-w pv-alerts">
      <Alert tone="info" title={t('新版本可用。', 'Update available.')} open={s === 0} onOpenChange={noop}>{t('刷新后生效。', 'Refresh to apply.')}</Alert>
      <Alert tone="success" title={t('已保存。', 'Saved.')} open={s === 2} onOpenChange={noop}>{t('改动已同步到云端。', 'Changes synced to the cloud.')}</Alert>
    </div>
  );
}

export function ProgressPreview() {
  const t = useT();
  const s = useStep([700, 700, 700, 1500], 2);
  const v = pick([8, 42, 76, 100], s);
  return (
    <div className="pv-col pv-w">
      <Progress value={v} label={t('上传进度', 'Upload progress')} noDoneState={false} />
      <div className="pv-row pv-center">
        <ProgressRing value={v} showValue label={t('完成度', 'Completion')} />
        <Progress value={null} label={t('处理中', 'Processing')} className="pv-grow" size="sm" />
      </div>
    </div>
  );
}

export function SkeletonPreview() {
  return (
    <div className="pv-w pv-skel">
      <Skeleton variant="circle" width={44} height={44} />
      <div className="pv-grow"><Skeleton lines={3} /></div>
    </div>
  );
}

export function SpinnerPreview() {
  const t = useT();
  return (
    <div className="pv-row pv-spinners">
      <Spinner size="lg" label={t('加载中', 'Loading')} />
      <Spinner variant="ring" size="md" label={t('加载中', 'Loading')} />
      <Dots label={t('正在输入', 'Typing')} />
    </div>
  );
}

export function EmptyStatePreview() {
  const t = useT();
  return (
    <EmptyState
      className="pv-empty" size="sm" titleAs="p"
      icon={<span className="pv-bob a"><Icon name="inbox" /></span>}
      title={t('还没有消息', 'No messages yet')} description={t('有新消息时会出现在这里。', 'New messages will show up here.')}
    />
  );
}

/** Toast：三条通知依次从底部滑入叠起，停一会儿后依次退场 */
export function ToastPreview() {
  return (
    <div className="pv-toasts">
      {[0, 1, 2].map((i) => (
        <div key={i} className="pv-toast a" data-i={i}>
          <span className="pv-toast__icon" data-tone={i} />
          <span className="pv-toast__text"><i className="pv-bar" style={{ width: `${[70, 55, 62][i]}%` }} /><i className="pv-bar pv-bar--soft" style={{ width: `${[45, 60, 38][i]}%` }} /></span>
        </div>
      ))}
    </div>
  );
}
