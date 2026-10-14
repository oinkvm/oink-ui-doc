import { Button, Card, Code, EmptyState, Grid, Icon, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/empty-state', title: 'EmptyState 空状态', group: '反馈', order: 50, subtitle: 'EmptyState', en: { title: 'EmptyState' } };

const CODE_BASIC = {
  zh: `
<Card>
  <EmptyState
    icon={<Icon name="mail" />}
    title="收件箱是空的"
    description="新的消息会出现在这里。你也可以先给同事发一条。"
    actions={
      <>
        <Button variant="primary" onClick={() => toast('开始写消息')}>写消息</Button>
        <Button variant="ghost">了解更多</Button>
      </>
    }
  />
</Card>`,
  en: `
<Card>
  <EmptyState
    icon={<Icon name="mail" />}
    title="Your inbox is empty"
    description="New messages will show up here. Or start by sending one to a teammate."
    actions={
      <>
        <Button variant="primary" onClick={() => toast('New message')}>New message</Button>
        <Button variant="ghost">Learn more</Button>
      </>
    }
  />
</Card>`,
};

const CODE_SIZES = {
  zh: `
<Grid columns={{ base: 1, md: 3 }} align="start">
  <Card><EmptyState size="sm" icon={<Icon name="search" />} title="没有匹配的结果" description="换个关键词试试。" /></Card>
  <Card><EmptyState size="md" icon={<Icon name="bell" />} title="暂无通知" description="有新动态时会提醒你。" /></Card>
  <Card><EmptyState size="lg" icon={<Icon name="upload" />} title="还没有文件" description="把文件拖到这里上传。" /></Card>
</Grid>`,
  en: `
<Grid columns={{ base: 1, md: 3 }} align="start">
  <Card><EmptyState size="sm" icon={<Icon name="search" />} title="No matching results" description="Try a different keyword." /></Card>
  <Card><EmptyState size="md" icon={<Icon name="bell" />} title="No notifications" description="We’ll let you know when something happens." /></Card>
  <Card><EmptyState size="lg" icon={<Icon name="upload" />} title="No files yet" description="Drag files here to upload." /></Card>
</Grid>`,
};

const CODE_ART = {
  zh: `
<EmptyState
  titleAs="h4"
  icon={
    <svg width="96" height="64" viewBox="0 0 96 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="10" width="68" height="44" rx="10" />
      <path d="M14 26h68M26 38h20M26 46h32" />
    </svg>
  }
  title="还没有创建看板"
  description="看板能把任务按状态排成几列。"
  actions={<Button variant="primary" onClick={() => toast.success('已创建看板')}>创建看板</Button>}
>
  <Code>⌘ N</Code>
</EmptyState>`,
  en: `
<EmptyState
  titleAs="h4"
  icon={
    <svg width="96" height="64" viewBox="0 0 96 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="10" width="68" height="44" rx="10" />
      <path d="M14 26h68M26 38h20M26 46h32" />
    </svg>
  }
  title="No boards yet"
  description="A board arranges tasks into columns by status."
  actions={<Button variant="primary" onClick={() => toast.success('Board created')}>Create board</Button>}
>
  <Code>⌘ N</Code>
</EmptyState>`,
};

export default function EmptyStatePage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('该有内容的地方现在是空的：列表里还没有数据、搜索没有结果、筛选条件太严。说清为什么空，并给出下一步。', 'A place that should have content is empty: a list with no data yet, a search with no results, filters that are too strict. Explain why it’s empty and offer a next step.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('图示、标题、说明、操作，自上而下居中排列。只有 title 是必填的。', 'Illustration, title, description and actions, centered from top to bottom. Only title is required.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Card>
            <EmptyState
              icon={<Icon name="mail" />}
              title={t('收件箱是空的', 'Your inbox is empty')}
              description={t('新的消息会出现在这里。你也可以先给同事发一条。', 'New messages will show up here. Or start by sending one to a teammate.')}
              actions={
                <>
                  <Button variant="primary" onClick={() => toast(t('开始写消息', 'New message'))}>{t('写消息', 'New message')}</Button>
                  <Button variant="ghost">{t('了解更多', 'Learn more')}</Button>
                </>
              }
            />
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')} description={t('sm 用在表格、下拉、侧栏这类小区域里；lg 用在整页为空的时候。', 'Use sm in small areas such as tables, dropdowns and sidebars; lg when a whole page is empty.')}>
        <Demo layout="block" code={t(CODE_SIZES.zh, CODE_SIZES.en)}>
          <Grid columns={{ base: 1, md: 3 }} align="start">
            <Card><EmptyState size="sm" icon={<Icon name="search" />} title={t('没有匹配的结果', 'No matching results')} description={t('换个关键词试试。', 'Try a different keyword.')} /></Card>
            <Card><EmptyState size="md" icon={<Icon name="bell" />} title={t('暂无通知', 'No notifications')} description={t('有新动态时会提醒你。', 'We’ll let you know when something happens.')} /></Card>
            <Card><EmptyState size="lg" icon={<Icon name="upload" />} title={t('还没有文件', 'No files yet')} description={t('把文件拖到这里上传。', 'Drag files here to upload.')} /></Card>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('插画与额外内容', 'Illustrations and extra content')} description={t('icon 位置传图片或自己的 SVG 时不再套圆形底。children 插在说明和操作之间。', 'When you pass an image or your own SVG as icon, it isn’t wrapped in the round backdrop. children go between the description and the actions.')}>
        <Demo layout="block" code={t(CODE_ART.zh, CODE_ART.en)}>
          <EmptyState
            titleAs="h4"
            icon={
              <svg width="96" height="64" viewBox="0 0 96 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="14" y="10" width="68" height="44" rx="10" />
                <path d="M14 26h68M26 38h20M26 46h32" />
              </svg>
            }
            title={t('还没有创建看板', 'No boards yet')}
            description={t('看板能把任务按状态排成几列。', 'A board arranges tasks into columns by status.')}
            actions={<Button variant="primary" onClick={() => toast.success(t('已创建看板', 'Board created'))}>{t('创建看板', 'Create board')}</Button>}
          >
            <Code>⌘ N</Code>
          </EmptyState>
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'title', type: 'ReactNode', required: true, description: t('标题：一句话说清现在的状况。', 'Title: one sentence stating the situation.') },
          { name: 'icon', type: 'ReactNode', description: t('图示位：图标或插画。', 'Illustration slot: an icon or illustration.') },
          { name: 'description', type: 'ReactNode', description: t('说明：为什么空、接下来能做什么。', 'Description: why it’s empty and what to do next.') },
          { name: 'actions', type: 'ReactNode', description: t('操作按钮。', 'Action buttons.') },
          { name: 'titleAs', type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'", default: "'h3'", description: t('标题用什么元素。', 'Element for the title.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('图示、字号和留白的档位。', 'Scale of the illustration, type and spacing.') },
          { name: 'children', type: 'ReactNode', description: t('插在说明和操作之间的额外内容。', 'Extra content between the description and the actions.') },
        ]} />
        <A11yNotes items={t([
          <>标题默认是 <Code>h3</Code>，会出现在读屏的标题导航里；请用 <Code>titleAs</Code> 对齐页面层级，在很小的区域（下拉、表格单元格）里用 <Code>p</Code>。</>,
          '图示位整体对读屏隐藏，所以不要把关键信息只画在插画里。',
          <>空状态是搜索或筛选之后动态出现的时候，把它放进 <Code>role="status"</Code> 的容器，读屏才会知道“没有结果”。</>,
          '操作是普通按钮，按文档顺序 Tab 到；组件本身没有键盘操作。',
        ], [
          <>The title is an <Code>h3</Code> by default and shows up in screen reader heading navigation; use <Code>titleAs</Code> to match the page’s levels, and <Code>p</Code> in very small areas (dropdowns, table cells).</>,
          'The illustration slot is hidden from screen readers entirely, so never put key information only in the artwork.',
          <>When the empty state appears dynamically after a search or filter, put it in a <Code>role="status"</Code> container so screen readers learn there are “no results”.</>,
          'Actions are ordinary buttons reached by Tab in document order; the component itself has no keyboard interaction.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
