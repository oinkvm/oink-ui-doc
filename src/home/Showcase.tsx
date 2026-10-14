import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Accordion, Avatar, AvatarGroup, Badge, Button, Card, CardHeader, CardMedia, Checkbox, ColorSwatches, DatePicker, Dialog, Divider, Dots,
  Drawer, DropdownMenu, Field, FloatingBody, FloatingFooter, FloatingHeader, Hotkey, Icon, Image, Inline, Input, MenuItem, MenuSeparator,
  PinInput, Progress, ProgressRing, Radio, RadioGroup, Rating, Segmented, Select, Sheet, Slider, Spinner, Stack, Stat, Switch, Table, Tabs,
  Tag, Text, Textarea, ToggleButton, Tooltip, cx, toast, useOink,
} from 'oink-ui';
import type { TableColumn } from 'oink-ui';
import { ProductArt } from '../examples/shop/art';
import { useLang, useT } from '../i18n';
import type { Lang } from '../i18n';
import { ACCENT_NAME, ACCENT_NAME_EN, coverArt, notebookArt } from './art';

/** 一个小样：卡片 + 极简标题（h2），右上角可以放一个数值或操作 */
function Tile({ title, aside, className, children }: { title: string; aside?: ReactNode; className?: string; children: ReactNode }) {
  const id = useId();
  return (
    <Card as="section" size="sm" className={cx('home-tile', className)} aria-labelledby={id}>
      <div className="home-tile__head">
        <h2 id={id} className="home-tile__title">{title}</h2>
        {aside}
      </div>
      {children}
    </Card>
  );
}

/* —— 表单 —— */

function EmailTile() {
  const t = useT();
  return (
    <Tile title={t('输入框', 'Input')}>
      <Field label={t('邮箱', 'Email')} hint={t('只用来发送登录链接。', 'Only used to send sign-in links.')}>
        <Input type="email" icon="mail" placeholder="name@example.com" autoComplete="off" clearable />
      </Field>
    </Tile>
  );
}

const CITIES = {
  zh: ['北京', '上海', '广州', '深圳', '杭州', '成都'].map((c) => ({ value: c, label: c })),
  en: ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney'].map((c) => ({ value: c, label: c })),
};

function SelectTile() {
  const t = useT();
  return (
    <Tile title={t('下拉选择', 'Select')}>
      <Field label={t('所在城市', 'City')} required>
        <Select options={t(CITIES.zh, CITIES.en)} placeholder={t('请选择', 'Choose one')} />
      </Field>
    </Tile>
  );
}

function ChoiceTile() {
  const t = useT();
  return (
    <Tile title={t('选择控件', 'Selection controls')}>
      <Stack gap={3}>
        <Inline gap={5} rowGap={3}>
          <Checkbox defaultChecked>{t('订阅周报', 'Weekly digest')}</Checkbox>
          <Switch defaultChecked>{t('免打扰', 'Do not disturb')}</Switch>
        </Inline>
        <RadioGroup aria-label={t('付费周期', 'Billing period')} defaultValue="year" orientation="horizontal">
          <Radio value="month">{t('月付', 'Monthly')}</Radio>
          <Radio value="year">{t('年付', 'Yearly')}</Radio>
        </RadioGroup>
        <Inline gap={3} className="home-sync">
          <Spinner size="sm" label={t('同步中', 'Syncing')} />
          <Text as="span" variant="caption" tone="neutral">{t('同步中', 'Syncing')}</Text>
          <Dots label={t('对方正在输入', 'Someone is typing')} />
        </Inline>
      </Stack>
    </Tile>
  );
}

function SliderTile() {
  const t = useT();
  const [price, setPrice] = useState(680);
  // 英文版用美元符号，数值不变
  const cur = t('¥', '$');
  return (
    <Tile title={t('价格上限', 'Max price')} aside={<Text as="span" variant="label" className="home-num">{cur}{price}</Text>}>
      <Slider aria-label={t('价格上限', 'Max price')} min={0} max={2000} step={20} value={price} onChange={setPrice} format={(v) => `${cur}${v}`} />
      <div className="home-scale" aria-hidden="true"><span>{cur}0</span><span>{cur}2000</span></div>
    </Tile>
  );
}

type Range = '1d' | '7d' | '1m' | '1y' | 'all';
const REVENUE: Record<Range, { value: string; delta: string; trend: 'up' | 'down' }> = {
  '1d': { value: '¥3,240', delta: '+4.1%', trend: 'up' },
  '7d': { value: '¥21,860', delta: '−2.3%', trend: 'down' },
  '1m': { value: '¥94,500', delta: '+12.4%', trend: 'up' },
  '1y': { value: '¥1.08M', delta: '+31%', trend: 'up' },
  all: { value: '¥2.46M', delta: '+86%', trend: 'up' },
};

function RangeTile() {
  const t = useT();
  const [range, setRange] = useState<Range>('1m');
  const r = REVENUE[range];
  return (
    <Tile title={t('收入', 'Revenue')}>
      <Stack gap={4}>
        <Segmented<Range>
          aria-label={t('时间范围', 'Time range')} size="sm" block value={range} onChange={setRange}
          options={t(
            [{ value: '1d', label: '1天' }, { value: '7d', label: '7天' }, { value: '1m', label: '1月' }, { value: '1y', label: '1年' }, { value: 'all', label: '全部' }],
            [{ value: '1d', label: '1D' }, { value: '7d', label: '7D' }, { value: '1m', label: '1M' }, { value: '1y', label: '1Y' }, { value: 'all', label: 'All' }],
          )}
        />
        <Stat variant="plain" label={t('净收入', 'Net revenue')} value={t(r.value, r.value.replace('¥', '$'))} delta={r.delta} trend={r.trend} hint={t('与上一周期相比', 'vs. previous period')} />
      </Stack>
    </Tile>
  );
}

const PEOPLE = {
  zh: ['林夏', '周舟', 'Mia Chen', '陈默', '许一帆', 'Leo Wang'],
  en: ['Lena Hart', 'Owen Brooks', 'Mia Chen', 'Sam Reed', 'Ivy Cole', 'Leo Wang'],
};

function AvatarTile() {
  const t = useT();
  return (
    <Tile title={t('头像组', 'Avatar group')}>
      <Inline justify="between" gap={3}>
        <AvatarGroup label={t('项目成员', 'Project members')} max={4}>
          {t(PEOPLE.zh, PEOPLE.en).map((p) => <Avatar key={p} name={p} color="auto" />)}
        </AvatarGroup>
        <Button size="sm" leading={<Icon name="plus" />} onClick={() => toast(t('邀请链接已复制', 'Invite link copied'))}>{t('邀请', 'Invite')}</Button>
      </Inline>
    </Tile>
  );
}

function PinTile() {
  const t = useT();
  const [sent, setSent] = useState(0);
  return (
    <Tile title={t('验证码', 'Verification code')}>
      <Stack gap={3}>
        <Field label={t('验证账户', 'Verify your account')} hint={t('已发送到 138****6620', 'Sent to (415) ***-6620')}>
          <PinInput defaultValue="382" onComplete={() => toast.success(t('验证通过', 'Verified'))} />
        </Field>
        <Inline gap={1}>
          <Text as="span" variant="caption" tone="neutral">{t('没收到？', 'Didn’t get it?')}</Text>
          <Button size="sm" variant="ghost" onClick={() => { setSent(sent + 1); toast(t(`已重新发送（第 ${sent + 1} 次）`, `Code resent (${sent + 1})`)); }}>{t('重新发送', 'Resend')}</Button>
        </Inline>
      </Stack>
    </Tile>
  );
}

function ButtonsTile() {
  const t = useT();
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const save = () => {
    setState('loading');
    timer.current = window.setTimeout(() => {
      setState('done');
      timer.current = window.setTimeout(() => setState('idle'), 1400);
    }, 1400);
  };
  return (
    <Tile title={t('按钮', 'Buttons')}>
      <Inline gap={2} rowGap={2}>
        <Button variant="primary">{t('主要', 'Primary')}</Button>
        <Button variant="accent">{t('强调', 'Accent')}</Button>
        <Button>{t('柔和', 'Soft')}</Button>
        <Button variant="outline">{t('描边', 'Outline')}</Button>
        <Button variant="ghost">{t('文字', 'Ghost')}</Button>
        <Button variant="danger" leading={<Icon name="trash" />}>{t('删除', 'Delete')}</Button>
        <Button variant="primary" loading={state === 'loading'} success={state === 'done'} onClick={save}>{t('保存改动', 'Save changes')}</Button>
      </Inline>
    </Tile>
  );
}

/* —— 整张卡片 —— */

function SignupCard() {
  const t = useT();
  const id = useId();
  return (
    <Card as="section" size="sm" className="home-tile home-signup" aria-labelledby={id}>
      <Stack gap={4}>
        <span className="home-signup__icon" aria-hidden="true"><Icon name="user" /></span>
        <CardHeader titleAs="h2" titleId={id} title={t('创建账户', 'Create an account')} description={t('一个账户，所有设备同步。', 'One account, synced across all your devices.')} />
        <Button variant="primary" block onClick={() => toast.success(t('验证邮件已发送', 'Verification email sent'))}>{t('用邮箱注册', 'Sign up with email')}</Button>
        <Divider>{t('或', 'or')}</Divider>
        <Stack gap={2}>
          <Button block leading={<Icon name="phone" />}>{t('使用手机号', 'Use a phone number')}</Button>
          <Button block leading={<Icon name="lock" />}>{t('使用通行密钥', 'Use a passkey')}</Button>
        </Stack>
      </Stack>
    </Card>
  );
}

function ProfileCard() {
  const t = useT();
  const { resolvedTheme } = useOink();
  const [following, setFollowing] = useState(false);
  const id = useId();
  return (
    <Card as="section" size="sm" className="home-tile home-profile" aria-labelledby={id}>
      <CardMedia src={coverArt(resolvedTheme === 'dark')} alt="" ratio={3} />
      <div className="home-profile__avatar"><Avatar name={t('林夏', 'Lena Hart')} color="auto" size={64} status="online" /></div>
      <Stack gap={3}>
        <div>
          <h2 id={id} className="home-profile__name">{t('林夏', 'Lena Hart')}</h2>
          <Text as="p" variant="caption" tone="neutral" className="home-profile__handle">{t('@linxia · 产品设计师', '@lenahart · Product designer')}</Text>
        </div>
        <Inline gap={2}><Tag size="sm">{t('界面', 'UI')}</Tag><Tag size="sm">{t('插画', 'Illustration')}</Tag><Tag size="sm" tone="info">{t('上海', 'Seattle')}</Tag></Inline>
        <dl className="home-profile__stats">
          <div><dt>{t('作品', 'Shots')}</dt><dd>128</dd></div>
          <div><dt>{t('关注者', 'Followers')}</dt><dd>3.2k</dd></div>
          <div><dt>{t('获赞', 'Likes')}</dt><dd>18k</dd></div>
        </dl>
        <Inline gap={2}>
          <ToggleButton variant={following ? 'soft' : 'primary'} pressed={following} onChange={setFollowing} leading={following ? <Icon name="check" /> : <Icon name="plus" />} className="home-grow">
            {following ? t('已关注', 'Following') : t('关注', 'Follow')}
          </ToggleButton>
          <Button iconOnly aria-label={t('发私信', 'Send a message')}><Icon name="mail" /></Button>
        </Inline>
      </Stack>
    </Card>
  );
}

function ProductCard() {
  const t = useT();
  const { resolvedTheme, accent } = useOink();
  const [fav, setFav] = useState(false);
  const id = useId();
  const enName = ACCENT_NAME_EN[accent];
  return (
    <Card as="section" size="sm" className="home-tile home-product" aria-labelledby={id}>
      <CardMedia src={notebookArt(resolvedTheme === 'dark', accent)} alt={t(`${ACCENT_NAME[accent] ?? ''}布面点阵笔记本和一支钢笔`, enName ? `A ${enName} cloth-bound dot grid notebook and a fountain pen` : 'A cloth-bound dot grid notebook and a fountain pen')} ratio={4 / 3} />
      <Stack gap={3}>
        <CardHeader
          titleAs="h2" titleId={id} title={t('点阵笔记本 A5', 'Dot grid notebook A5')} description={t('布面精装 · 160 页', 'Cloth hardcover · 160 pages')}
          actions={<Badge tone="success">{t('新品', 'New')}</Badge>}
        />
        <Inline gap={2}>
          <Rating readOnly value={4.6} size="sm" />
          <Text as="span" variant="caption" tone="neutral">{t('4.6（128 条评价）', '4.6 (128 reviews)')}</Text>
        </Inline>
        <Inline justify="between" gap={2}>
          <Text as="span" className="home-price">{t('¥48', '$12')}</Text>
          <Inline gap={2}>
            {/* 收藏：按下后不换底色，心形用强调色填满（见 home.css 的 .home-fav） */}
            <ToggleButton iconOnly aria-label={t('收藏', 'Save to favorites')} pressed={fav} onChange={setFav} variant="ghost" className="home-fav"><Icon name="heart" filled={fav} /></ToggleButton>
            <Button variant="primary" leading={<Icon name="cart" />} onClick={() => toast.success({ title: t('已加入购物车', 'Added to cart'), description: t('点阵笔记本 A5 × 1', 'Dot grid notebook A5 × 1') })}>{t('加入购物车', 'Add to cart')}</Button>
          </Inline>
        </Inline>
      </Stack>
    </Card>
  );
}

/* —— 数据展示 —— */

function TabsTile() {
  const t = useT();
  return (
    <Tile title={t('标签页', 'Tabs')}>
      <Tabs
        label={t('项目视图', 'Project views')}
        items={[
          { value: 'overview', label: t('概览', 'Overview'), content: <Progress value={64} label={t('迭代进度', 'Sprint progress')} /> },
          { value: 'members', label: t('成员', 'Members'), content: <Inline gap={2}>{t(PEOPLE.zh, PEOPLE.en).slice(0, 3).map((p) => <Tag key={p} icon={<Avatar name={p} color="auto" size={18} decorative />}>{p}</Tag>)}</Inline> },
          { value: 'files', label: t('文件', 'Files'), content: <Inline gap={2}><Tag icon={<Icon name="file" />}>{t('需求.pdf', 'Requirements.pdf')}</Tag><Tag icon={<Icon name="image" />}>{t('封面.png', 'Cover.png')}</Tag></Inline> },
        ]}
      />
    </Tile>
  );
}

function AccordionTile() {
  const t = useT();
  return (
    <Tile title={t('折叠面板', 'Accordion')}>
      <Accordion
        headingLevel={3} collapsible defaultValue={['cancel']}
        items={[
          { value: 'cancel', title: t('可以随时取消吗？', 'Can I cancel anytime?'), content: t('可以，取消后当前周期结束前仍可使用。', 'Yes. You keep access until the end of the current billing period.') },
          { value: 'invoice', title: t('怎么开发票？', 'How do I get an invoice?'), content: t('在“账单”里选择对应的月份即可下载。', 'Open Billing and pick the month to download it.') },
          { value: 'team', title: t('支持多人协作吗？', 'Can my team use it?'), content: t('团队版最多 50 人，按席位计费。', 'The Team plan supports up to 50 people, billed per seat.') },
        ]}
      />
    </Tile>
  );
}

interface Task { id: string; title: string; owner: string; status: 'done' | 'doing' | 'todo' }
const TASKS: { zh: Task[]; en: Task[] } = {
  zh: [
    { id: 't1', title: '首页改版', owner: '林夏', status: 'doing' },
    { id: 't2', title: '暗色主题', owner: '周舟', status: 'done' },
    { id: 't3', title: '无障碍走查', owner: 'Mia Chen', status: 'todo' },
    { id: 't4', title: '发布 1.0', owner: '陈默', status: 'todo' },
  ],
  en: [
    { id: 't1', title: 'Homepage redesign', owner: 'Lena Hart', status: 'doing' },
    { id: 't2', title: 'Dark theme', owner: 'Owen Brooks', status: 'done' },
    { id: 't3', title: 'Accessibility review', owner: 'Mia Chen', status: 'todo' },
    { id: 't4', title: 'Ship 1.0', owner: 'Sam Reed', status: 'todo' },
  ],
};
const STATUS = {
  done: { label: { zh: '完成', en: 'Done' }, tone: 'success' },
  doing: { label: { zh: '进行中', en: 'In progress' }, tone: 'info' },
  todo: { label: { zh: '待办', en: 'To do' }, tone: 'neutral' },
} as const;
const taskColumns = (lang: Lang): TableColumn<Task>[] => {
  const en = lang === 'en';
  return [
    { key: 'title', header: en ? 'Task' : '任务', sortable: true, accessor: (t) => t.title },
    { key: 'owner', header: en ? 'Owner' : '负责人', sortable: true, accessor: (t) => t.owner, hideBelow: 'sm' },
    { key: 'status', header: en ? 'Status' : '状态', render: (t) => <Badge tone={STATUS[t.status].tone} dot>{STATUS[t.status].label[lang]}</Badge> },
  ];
};

function TableTile() {
  const t = useT();
  const lang = useLang();
  const columns = useMemo(() => taskColumns(lang), [lang]);
  return (
    <Tile title={t('表格', 'Table')} className="home-tile--flush">
      <Table label={t('本周任务', 'Tasks this week')} columns={columns} data={t(TASKS.zh, TASKS.en)} rowKey="id" />
    </Tile>
  );
}

/** 标签存键，换语言时已删掉的标签不会回来 */
const STATUS_TAGS = { design: { zh: '设计', en: 'Design' }, frontend: { zh: '前端', en: 'Frontend' }, docs: { zh: '文档', en: 'Docs' }, urgent: { zh: '紧急', en: 'Urgent' } };
type StatusTag = keyof typeof STATUS_TAGS;
const ALL_TAGS = Object.keys(STATUS_TAGS) as StatusTag[];

function StatusTile() {
  const t = useT();
  const [tags, setTags] = useState<StatusTag[]>(ALL_TAGS);
  return (
    <Tile title={t('徽标与标签', 'Badges & tags')}>
      <Stack gap={3}>
        <Inline gap={2} rowGap={2}>
          <Badge tone="success" dot>{t('已上线', 'Shipped')}</Badge>
          <Badge tone="warning">{t('审核中', 'In review')}</Badge>
          <Badge tone="danger" variant="solid">3</Badge>
          <Badge variant="ink">{t('新', 'New')}</Badge>
          <Badge tone="accent" ping dot>{t('直播', 'Live')}</Badge>
        </Inline>
        <Inline gap={2} rowGap={2}>
          {tags.map((k) => <Tag key={k} tone={k === 'urgent' ? 'danger' : 'neutral'} onRemove={() => setTags(tags.filter((x) => x !== k))}>{t(STATUS_TAGS[k].zh, STATUS_TAGS[k].en)}</Tag>)}
          {tags.length === 0 && <Button size="sm" variant="ghost" onClick={() => setTags(ALL_TAGS)}>{t('恢复标签', 'Restore tags')}</Button>}
        </Inline>
      </Stack>
    </Tile>
  );
}

function ProgressTile() {
  const t = useT();
  return (
    <Tile title={t('进度', 'Progress')}>
      <Inline gap={4} align="center" wrap={false}>
        <ProgressRing value={72} size="lg" showValue label={t('存储空间', 'Storage')} />
        <Stack gap={3} className="home-grow">
          <Stack gap={1}>
            <Text as="span" variant="caption" tone="neutral">{t('上传 4 / 6 个文件', 'Uploading 4 of 6 files')}</Text>
            <Progress value={64} label={t('上传进度', 'Upload progress')} />
          </Stack>
          <Stack gap={1}>
            <Text as="span" variant="caption" tone="neutral">{t('备份完成', 'Backup complete')}</Text>
            <Progress value={100} tone="success" label={t('备份进度', 'Backup progress')} />
          </Stack>
        </Stack>
      </Inline>
    </Tile>
  );
}

const MOODS = { zh: ['', '很差', '一般', '还行', '满意', '很满意'], en: ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'] };

function RatingTile() {
  const t = useT();
  const [stars, setStars] = useState(4);
  return (
    <Tile title={t('评分', 'Rating')} aside={<Text as="span" variant="caption" tone="neutral" aria-live="polite">{t(MOODS.zh, MOODS.en)[stars] || t('未评分', 'Not rated')}</Text>}>
      <Stack gap={3}>
        <Rating aria-label={t('这次服务', 'Rate this service')} value={stars} onChange={setStars} size="lg" />
        <Textarea aria-label={t('补充说明', 'Comments')} placeholder={t('说说哪里做得好（选填）', 'What went well? (optional)')} rows={2} />
      </Stack>
    </Tile>
  );
}

/* —— 浮层与反馈 —— */

function ToastTile() {
  const t = useT();
  return (
    <Tile title={t('通知', 'Toasts')}>
      <Inline gap={2} rowGap={2}>
        <Button onClick={() => toast.success({ title: t('已保存', 'Saved'), description: t('改动已同步到所有设备。', 'Changes synced to all your devices.') })}>{t('成功', 'Success')}</Button>
        <Button onClick={() => toast.warning(t('存储空间快满了', 'Storage is almost full'))}>{t('警告', 'Warning')}</Button>
        <Button onClick={() => toast({ title: t('已移到废纸篓', 'Moved to Trash'), action: { label: t('撤销', 'Undo'), onClick: () => toast(t('已恢复', 'Restored')) } })}>{t('可撤销', 'With undo')}</Button>
      </Inline>
    </Tile>
  );
}

function OverlaysTile() {
  const t = useT();
  const [dialog, setDialog] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [sheet, setSheet] = useState(false);
  return (
    <Tile title={t('悬浮卡片', 'Floating cards')}>
      <Inline gap={2} rowGap={2}>
        <Button leading={<Icon name="layout" />} onClick={() => setDialog(true)}>{t('对话框', 'Dialog')}</Button>
        <Button leading={<Icon name="sidebar" />} onClick={() => setDrawer(true)}>{t('抽屉', 'Drawer')}</Button>
        <Button leading={<Icon name="arrow-up" />} onClick={() => setSheet(true)}>{t('底部面板', 'Sheet')}</Button>
      </Inline>
      <Dialog
        open={dialog} onOpenChange={setDialog} icon={<Icon name="upload" />}
        title={t('发布这篇文章？', 'Publish this post?')} description={t('发布后关注者会收到通知，之后仍然可以修改。', 'Your followers will be notified. You can still edit it afterwards.')}
        actions={<>
          <Button size="lg" onClick={() => setDialog(false)}>{t('再想想', 'Not yet')}</Button>
          <Button size="lg" variant="primary" onClick={() => { setDialog(false); toast.success(t('已发布', 'Published')); }}>{t('发布', 'Publish')}</Button>
        </>}
      />
      <Drawer open={drawer} onOpenChange={setDrawer}>
        <FloatingHeader title={t('新建任务', 'New task')} description={t('带 * 的是必填项。', 'Fields marked * are required.')} />
        <FloatingBody>
          <Stack gap={4}>
            <Field label={t('标题', 'Title')} required><Input placeholder={t('一句话说清要做什么', 'What needs doing, in one line')} /></Field>
            <Field label={t('负责人', 'Owner')}><Select options={t(PEOPLE.zh, PEOPLE.en).map((p) => ({ value: p, label: p }))} placeholder={t('选择成员', 'Choose a member')} /></Field>
            <Field label={t('说明', 'Details')}><Textarea rows={4} placeholder={t('背景、验收标准…', 'Background, acceptance criteria…')} /></Field>
          </Stack>
        </FloatingBody>
        <FloatingFooter>
          <Button onClick={() => setDrawer(false)}>{t('取消', 'Cancel')}</Button>
          <Button variant="primary" onClick={() => { setDrawer(false); toast.success(t('任务已创建', 'Task created')); }}>{t('创建', 'Create')}</Button>
        </FloatingFooter>
      </Drawer>
      <Sheet open={sheet} onOpenChange={setSheet}>
        <FloatingHeader title={t('分享到', 'Share')} description={t('拿到链接的人都可以查看。', 'Anyone with the link can view.')} />
        <FloatingBody>
          <Stack gap={2}>
            <Button block leading={<Icon name="copy" />} onClick={() => { setSheet(false); toast.success(t('链接已复制', 'Link copied')); }}>{t('复制链接', 'Copy link')}</Button>
            <Button block leading={<Icon name="mail" />} onClick={() => { setSheet(false); toast(t('已打开邮件', 'Opened in Mail')); }}>{t('发邮件', 'Email')}</Button>
            <Button block leading={<Icon name="download" />} onClick={() => { setSheet(false); toast(t('开始下载', 'Download started')); }}>{t('下载为 PDF', 'Download as PDF')}</Button>
          </Stack>
        </FloatingBody>
      </Sheet>
    </Tile>
  );
}

/** 工具栏的几个动作：显示用的文字和点了之后右上角的反馈 */
const TOOL_TEXT = {
  link: { zh: '插入链接', en: 'Insert link' },
  image: { zh: '插入图片', en: 'Insert image' },
  attach: { zh: '添加附件', en: 'Add attachment' },
  comment: { zh: '评论', en: 'Comment' },
  duplicated: { zh: '已创建副本', en: 'Duplicated' },
  shared: { zh: '已分享', en: 'Shared' },
  archived: { zh: '已归档', en: 'Archived' },
  deleted: { zh: '已删除', en: 'Deleted' },
};
type ToolKey = keyof typeof TOOL_TEXT;

function ToolbarTile() {
  const t = useT();
  // 存键而不是文字：换语言后右上角的反馈跟着换
  const [last, setLast] = useState<ToolKey | ''>('');
  const tx = (k: ToolKey) => t(TOOL_TEXT[k].zh, TOOL_TEXT[k].en);
  return (
    <Tile title={t('提示与菜单', 'Tooltips & menus')} aside={last ? <Text as="span" variant="caption" tone="neutral" role="status">{tx(last)}</Text> : <span role="status" />}>
      <Inline gap={1} role="toolbar" aria-label={t('编辑工具', 'Editing tools')}>
        <Tooltip content={tx('link')} shortcut="⌘K"><Button iconOnly variant="ghost" aria-label={tx('link')} onClick={() => setLast('link')}><Icon name="link" /></Button></Tooltip>
        <Tooltip content={tx('image')}><Button iconOnly variant="ghost" aria-label={tx('image')} onClick={() => setLast('image')}><Icon name="image" /></Button></Tooltip>
        <Tooltip content={tx('attach')}><Button iconOnly variant="ghost" aria-label={tx('attach')} onClick={() => setLast('attach')}><Icon name="paperclip" /></Button></Tooltip>
        <Tooltip content={tx('comment')} shortcut="⌘⌥M"><Button iconOnly variant="ghost" aria-label={tx('comment')} onClick={() => setLast('comment')}><Icon name="reply" /></Button></Tooltip>
        <DropdownMenu matchTriggerWidth={false} placement="bottom-end" trigger={<Button iconOnly variant="ghost" aria-label={t('更多操作', 'More actions')}><Icon name="more" /></Button>}>
          <MenuItem icon="copy" shortcut="⌘D" onSelect={() => setLast('duplicated')}>{t('创建副本', 'Duplicate')}</MenuItem>
          <MenuItem icon="share" onSelect={() => setLast('shared')}>{t('分享…', 'Share…')}</MenuItem>
          <MenuItem icon="archive" onSelect={() => setLast('archived')}>{t('归档', 'Archive')}</MenuItem>
          <MenuSeparator />
          <MenuItem icon="trash" tone="danger" onSelect={() => setLast('deleted')}>{t('删除', 'Delete')}</MenuItem>
        </DropdownMenu>
      </Inline>
    </Tile>
  );
}

function DateTile() {
  const t = useT();
  return (
    <Tile title={t('日期选择', 'Date picker')}>
      <Field label={t('截止日期', 'Due date')} hint={t('周末不可选', 'Weekends are unavailable')}>
        <DatePicker isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} />
      </Field>
    </Tile>
  );
}

const LABEL_COLORS = {
  zh: [
    { value: 'red', color: 'var(--ok-danger)', label: '红' },
    { value: 'amber', color: 'var(--ok-warning)', label: '黄' },
    { value: 'green', color: 'var(--ok-success)', label: '绿' },
    { value: 'blue', color: 'var(--ok-info)', label: '蓝' },
    { value: 'accent', color: 'var(--ok-accent)', label: '强调色' },
    { value: 'gray', color: 'var(--ok-text-3)', label: '灰' },
  ],
  en: [
    { value: 'red', color: 'var(--ok-danger)', label: 'Red' },
    { value: 'amber', color: 'var(--ok-warning)', label: 'Yellow' },
    { value: 'green', color: 'var(--ok-success)', label: 'Green' },
    { value: 'blue', color: 'var(--ok-info)', label: 'Blue' },
    { value: 'accent', color: 'var(--ok-accent)', label: 'Accent' },
    { value: 'gray', color: 'var(--ok-text-3)', label: 'Gray' },
  ],
};

function SwatchTile() {
  const t = useT();
  const [color, setColor] = useState<string | null>('green');
  const colors = t(LABEL_COLORS.zh, LABEL_COLORS.en);
  const current = colors.find((c) => c.value === color);
  return (
    <Tile title={t('颜色', 'Color')} aside={<Text as="span" variant="caption" tone="neutral">{current?.label ?? t('未选择', 'None')}</Text>}>
      <ColorSwatches aria-label={t('标签颜色', 'Label color')} colors={colors} value={color} onChange={setColor} />
    </Tile>
  );
}

function HotkeyTile() {
  const t = useT();
  return (
    <Tile title={t('快捷键', 'Hotkey')}>
      <Field label={t('打开命令面板', 'Open command palette')} hint={t('点一下，然后按下新的组合键', 'Click, then press a new shortcut')}>
        <Hotkey defaultValue="Meta+K" />
      </Field>
    </Tile>
  );
}

function GalleryTile() {
  const t = useT();
  return (
    <Tile title={t('图片', 'Images')}>
      <div className="home-gallery">
        <Image alt={t('蓝色钢笔', 'Blue fountain pen')} ratio={1} radius={2}><ProductArt kind="pen" color="blue" view={2} /></Image>
        <Image alt={t('粉色便签', 'Pink sticky notes')} ratio={1} radius={2}><ProductArt kind="sticky" color="pink" /></Image>
        <Image alt={t('燕麦色台灯', 'Oat desk lamp')} ratio={1} radius={2}><ProductArt kind="lamp" color="oat" view={2} /></Image>
      </div>
    </Tile>
  );
}

/** 「组件」标签：多列错落排布。DOM 顺序就是读屏和 Tab 的顺序，按列从上到下 */
export function Showcase() {
  return (
    <div className="home-grid">
      <EmailTile />
      <SelectTile />
      <ChoiceTile />
      <SliderTile />
      <ProductCard />
      <ButtonsTile />
      <RangeTile />
      <AvatarTile />
      <PinTile />
      <SignupCard />
      <ToolbarTile />
      <TabsTile />
      <OverlaysTile />
      <ProfileCard />
      <StatusTile />
      <DateTile />
      <TableTile />
      <ProgressTile />
      <ToastTile />
      <RatingTile />
      <AccordionTile />
      <SwatchTile />
      <GalleryTile />
      <HotkeyTile />
    </div>
  );
}
