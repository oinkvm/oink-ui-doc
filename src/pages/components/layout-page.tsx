import { Badge, Box, Breadcrumb, Button, Code, Grid, Icon, Page, PageHeader, Section, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { href } from '../../router';
import { asRow, restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/page', title: 'Page 页面结构', group: '布局', order: 8, subtitle: 'Page · PageHeader · Section', en: { title: 'Page / PageHeader / Section' } };

const PAGE_CODE = {
  zh: `import { Badge, Box, Breadcrumb, Button, Grid, Icon, Page, PageHeader, Section, Text } from 'oink-ui';

{/* 这里嵌在文档页里，所以标题从 h3 起；真实页面里用默认的 h1 / h2 */}
<Page size="md" gap={6}>
  <PageHeader
    headingLevel={3}
    breadcrumb={<Breadcrumb items={[{ label: '项目', href: '/components/page' }, { label: '品牌手册' }]} />}
    title="品牌手册"
    description="标志、色彩、字体的使用规范。放不下时，右侧的操作会整块换到标题下面。"
    actions={
      <>
        <Button leading={<Icon name="share" />}>分享</Button>
        <Button variant="primary" leading={<Icon name="plus" />}>新建章节</Button>
      </>
    }
  />
  <Section headingLevel={4} title="概览" description="最近 7 天" actions={<Button size="sm" variant="ghost">查看全部</Button>}>
    <Grid minItemWidth={140} gap={3}>
      <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">浏览</Text><br /><Text variant="h3">1,284</Text></Box>
      <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">评论</Text><br /><Text variant="h3">36</Text></Box>
      <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">待审阅</Text><br /><Text variant="h3">3</Text></Box>
    </Grid>
  </Section>
  <Section headingLevel={4} title="章节" actions={<Badge>4</Badge>}>
    <Box surface="card" border radius={3} padding={4}><Text tone="neutral">区块内容放这里。</Text></Box>
  </Section>
</Page>`,
  en: `import { Badge, Box, Breadcrumb, Button, Grid, Icon, Page, PageHeader, Section, Text } from 'oink-ui';

{/* Embedded in a docs page here, so headings start at h3; on a real page use the default h1 / h2 */}
<Page size="md" gap={6}>
  <PageHeader
    headingLevel={3}
    breadcrumb={<Breadcrumb items={[{ label: 'Projects', href: '/components/page' }, { label: 'Brand guide' }]} />}
    title="Brand guide"
    description="Rules for using the logo, color and type. When space runs out, the actions on the right move below the title as a block."
    actions={
      <>
        <Button leading={<Icon name="share" />}>Share</Button>
        <Button variant="primary" leading={<Icon name="plus" />}>New chapter</Button>
      </>
    }
  />
  <Section headingLevel={4} title="Overview" description="Last 7 days" actions={<Button size="sm" variant="ghost">View all</Button>}>
    <Grid minItemWidth={140} gap={3}>
      <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">Views</Text><br /><Text variant="h3">1,284</Text></Box>
      <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">Comments</Text><br /><Text variant="h3">36</Text></Box>
      <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">Awaiting review</Text><br /><Text variant="h3">3</Text></Box>
    </Grid>
  </Section>
  <Section headingLevel={4} title="Chapters" actions={<Badge>4</Badge>}>
    <Box surface="card" border radius={3} padding={4}><Text tone="neutral">Section content goes here.</Text></Box>
  </Section>
</Page>`,
};

export default function PagePage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('搭一页内容的三件套。Page 是外框：限宽、左右留白、区块纵向排开；PageHeader 是页头：面包屑、标题、说明、操作；Section 是带标题的内容区。间距按规范取：区块间 32，区块内 16。', 'Three pieces for building a page of content. Page is the frame: capped width, side gutters, sections stacked vertically. PageHeader is the page header: breadcrumb, title, description and actions. Section is a titled content area. Spacing follows the spec: 32 between sections, 16 within one.')}>
      <DocSection title={t('示例', 'Example')} description={t('把窗口拉窄：页头的操作区按实际宽度换行，不依赖断点。', 'Narrow the window: the header actions wrap based on the actual width, not on breakpoints.')}>
        <Demo code={t(PAGE_CODE.zh, PAGE_CODE.en)} flush layout="block">
          <Page size="md" gap={6}>
            <PageHeader
              headingLevel={3}
              breadcrumb={<Breadcrumb items={[{ label: t('项目', 'Projects'), href: href('/components/page') }, { label: t('品牌手册', 'Brand guide') }]} />}
              title={t('品牌手册', 'Brand guide')}
              description={t('标志、色彩、字体的使用规范。放不下时，右侧的操作会整块换到标题下面。', 'Rules for using the logo, color and type. When space runs out, the actions on the right move below the title as a block.')}
              actions={
                <>
                  <Button leading={<Icon name="share" />}>{t('分享', 'Share')}</Button>
                  <Button variant="primary" leading={<Icon name="plus" />}>{t('新建章节', 'New chapter')}</Button>
                </>
              }
            />
            <Section headingLevel={4} title={t('概览', 'Overview')} description={t('最近 7 天', 'Last 7 days')} actions={<Button size="sm" variant="ghost">{t('查看全部', 'View all')}</Button>}>
              <Grid minItemWidth={140} gap={3}>
                <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">{t('浏览', 'Views')}</Text><br /><Text variant="h3">1,284</Text></Box>
                <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">{t('评论', 'Comments')}</Text><br /><Text variant="h3">36</Text></Box>
                <Box surface="card" border radius={3} padding={4}><Text variant="caption" tone="neutral">{t('待审阅', 'Awaiting review')}</Text><br /><Text variant="h3">3</Text></Box>
              </Grid>
            </Section>
            <Section headingLevel={4} title={t('章节', 'Chapters')} actions={<Badge>4</Badge>}>
              <Box surface="card" border radius={3} padding={4}><Text tone="neutral">{t('区块内容放这里。', 'Section content goes here.')}</Text></Box>
            </Section>
          </Page>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title={t('Page 属性', 'Page props')}
          rows={[
            asRow(t),
            { name: 'size', type: `'sm' | 'md' | 'lg' | 'xl' | 'full'`, default: `'lg'`, description: t('内容最大宽度档位，同 Container。', 'Max content width step, same as Container.') },
            { name: 'gap', type: 'Responsive<Space>', default: '8', description: t('各区块之间的间距。', 'Spacing between sections.') },
            { name: 'padded', type: 'boolean', default: 'true', description: t('上下留白（底部会避开安全区）。', 'Top and bottom padding (the bottom stays clear of the safe area).') },
            restRow(t),
          ]}
        />
        <PropsTable
          title={t('PageHeader 属性', 'PageHeader props')}
          rows={[
            { name: 'title', type: 'ReactNode', required: true, description: t('页面标题。', 'Page title.') },
            { name: 'description', type: 'ReactNode', description: t('标题下面的说明。', 'Description below the title.') },
            { name: 'breadcrumb', type: 'ReactNode', description: t('面包屑位：显示在标题上方。', 'Breadcrumb slot, shown above the title.') },
            { name: 'actions', type: 'ReactNode', description: t('操作区：宽屏在标题右侧，放不下时换到标题下面。', 'Actions: to the right of the title when there is room, moving below it when there isn’t.') },
            { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: t('标题的级别。', 'Heading level of the title.') },
            { name: 'titleId', type: 'string', description: t('标题节点的 id，给 aria-labelledby 用。', 'id of the title element, for aria-labelledby.') },
            { name: 'children', type: 'ReactNode', description: t('放在页头最下面：标签页、筛选条之类。', 'Placed at the bottom of the header: tabs, filter bars and the like.') },
            restRow(t),
          ]}
        />
        <PropsTable
          title={t('Section 属性', 'Section props')}
          rows={[
            { name: 'title', type: 'ReactNode', description: t('区块标题。', 'Section title.') },
            { name: 'description', type: 'ReactNode', description: t('标题下面的说明。', 'Description below the title.') },
            { name: 'actions', type: 'ReactNode', description: t('标题右侧的操作。', 'Actions to the right of the title.') },
            { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: t('标题的级别。', 'Heading level of the title.') },
            { name: 'gap', type: 'Responsive<Space>', default: '4', description: t('标题与内容、内容与内容之间的间距。', 'Spacing between the title and content, and between content blocks.') },
            restRow(t),
          ]}
        />
        <A11yNotes
          items={t([
            <>PageHeader 渲染成 <Code>{'<header>'}</Code>，标题默认是 <Code>h1</Code>：一页只放一个。</>,
            <>Section 渲染成 <Code>{'<section>'}</Code>；有标题时自动用标题命名（<Code>aria-labelledby</Code>），读屏的地标列表里能直接跳到它。没有标题又需要名字时传 <Code>aria-label</Code>。</>,
            <>嵌套时用 <Code>headingLevel</Code> 保持标题逐级递进，不要为了字号去改级别。</>,
            <>Page 本身没有语义；通常放在 <Code>AppShell.Main</Code> 或 <Code>{'<main>'}</Code> 里。</>,
          ], [
            <>PageHeader renders a <Code>{'<header>'}</Code> and its title is an <Code>h1</Code> by default: one per page.</>,
            <>Section renders a <Code>{'<section>'}</Code>; with a title it is named by it automatically (<Code>aria-labelledby</Code>), so screen reader users can jump to it from the landmarks list. Without a title, pass <Code>aria-label</Code> if it needs a name.</>,
            <>When nesting, use <Code>headingLevel</Code> to keep headings stepping down one level at a time; don’t change the level just for font size.</>,
            <>Page itself has no semantics; it usually lives inside <Code>AppShell.Main</Code> or a <Code>{'<main>'}</Code>.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
