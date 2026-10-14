import { useState } from 'react';
import { Box, Button, Code, Icon, Kbd, ScrollArea, Stack, TabBar, TabBarItem, Text, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/tab-bar', title: 'TabBar 底部标签栏', group: '布局', order: 12, subtitle: 'TabBar', en: { title: 'TabBar' } };

const TABBAR_CODE = {
  zh: `import { useState } from 'react';
import { Box, Icon, ScrollArea, Stack, TabBar, TabBarItem, Text } from 'oink-ui';

const TITLES: Record<string, string> = { home: '首页', search: '发现', me: '我的' };

function Phone() {
  const [tab, setTab] = useState('home');
  return (
    // 手机尺寸的演示框：position: relative，标签栏用 position="absolute" 贴在它的底部
    <div style={{ position: 'relative', width: 340, maxWidth: '100%', height: 560, overflow: 'hidden', borderRadius: 'var(--ok-r-5)', background: 'var(--ok-bg)' }}>
      {/* 内容底部留出约 116px，别被标签栏挡住 */}
      <ScrollArea label={TITLES[tab]} style={{ height: '100%', padding: '20px 16px 116px' }}>
        <Stack gap={3}>
          <Text as="h3" variant="h2" style={{ margin: 0 }}>{TITLES[tab]}</Text>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Box key={n} surface="card" border radius={4} padding={5}>{TITLES[tab]} · 第 {n} 条</Box>
          ))}
        </Stack>
      </ScrollArea>

      <TabBar position="absolute" aria-label="主导航" value={tab} onChange={setTab}>
        <TabBarItem value="home" icon={<Icon name="sparkle" />}>首页</TabBarItem>
        <TabBarItem value="search" icon={<Icon name="search" />}>发现</TabBarItem>
        <TabBarItem value="me" icon={<Icon name="sliders" />}>我的</TabBarItem>
      </TabBar>
    </div>
  );
}`,
  en: `import { useState } from 'react';
import { Box, Icon, ScrollArea, Stack, TabBar, TabBarItem, Text } from 'oink-ui';

const TITLES: Record<string, string> = { home: 'Home', search: 'Discover', me: 'Me' };

function Phone() {
  const [tab, setTab] = useState('home');
  return (
    // A phone-sized demo frame: position: relative, with the tab bar pinned to its bottom via position="absolute"
    <div style={{ position: 'relative', width: 340, maxWidth: '100%', height: 560, overflow: 'hidden', borderRadius: 'var(--ok-r-5)', background: 'var(--ok-bg)' }}>
      {/* Leave about 116px at the bottom of the content so the tab bar doesn’t cover it */}
      <ScrollArea label={TITLES[tab]} style={{ height: '100%', padding: '20px 16px 116px' }}>
        <Stack gap={3}>
          <Text as="h3" variant="h2" style={{ margin: 0 }}>{TITLES[tab]}</Text>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Box key={n} surface="card" border radius={4} padding={5}>{TITLES[tab]} · item {n}</Box>
          ))}
        </Stack>
      </ScrollArea>

      <TabBar position="absolute" aria-label="Main navigation" value={tab} onChange={setTab}>
        <TabBarItem value="home" icon={<Icon name="sparkle" />}>Home</TabBarItem>
        <TabBarItem value="search" icon={<Icon name="search" />}>Discover</TabBarItem>
        <TabBarItem value="me" icon={<Icon name="sliders" />}>Me</TabBarItem>
      </TabBar>
    </div>
  );
}`,
};

const STATIC_CODE = {
  zh: `import { Button, Icon, TabBar, TabBarItem, toast } from 'oink-ui';

{/* position="static"：不定位，跟着文档流走。只有图标时用 label 起名字 */}
<TabBar
  position="static"
  aria-label="视图"
  defaultValue="list"
  style={{ width: 'min(340px, 100%)' }}
  action={<Button variant="primary" size="lg" iconOnly aria-label="新建" onClick={() => toast('新建')}><Icon name="plus" /></Button>}
>
  <TabBarItem value="list" icon={<Icon name="more" />} label="列表" />
  <TabBarItem value="inbox" icon={<Icon name="bell" />} label="消息，3 条未读" badge="3" />
  <TabBarItem value="share" icon={<Icon name="share" />} label="分享" />
  <TabBarItem value="off" icon={<Icon name="trash" />} label="回收站" disabled />
</TabBar>`,
  en: `import { Button, Icon, TabBar, TabBarItem, toast } from 'oink-ui';

{/* position="static": not positioned, follows the document flow. Icon-only items are named with label */}
<TabBar
  position="static"
  aria-label="Views"
  defaultValue="list"
  style={{ width: 'min(340px, 100%)' }}
  action={<Button variant="primary" size="lg" iconOnly aria-label="New" onClick={() => toast('New')}><Icon name="plus" /></Button>}
>
  <TabBarItem value="list" icon={<Icon name="more" />} label="List" />
  <TabBarItem value="inbox" icon={<Icon name="bell" />} label="Messages, 3 unread" badge="3" />
  <TabBarItem value="share" icon={<Icon name="share" />} label="Share" />
  <TabBarItem value="off" icon={<Icon name="trash" />} label="Trash" disabled />
</TabBar>`,
};

const TITLES = {
  zh: { home: '首页', search: '发现', me: '我的' } as Record<string, string>,
  en: { home: 'Home', search: 'Discover', me: 'Me' } as Record<string, string>,
};

function Phone() {
  const t = useT();
  const titles = t(TITLES.zh, TITLES.en);
  const [tab, setTab] = useState('home');
  return (
    <div className="g-phone" style={{ position: 'relative', width: 340, maxWidth: '100%', height: 560, overflow: 'hidden', borderRadius: 'var(--ok-r-5)', background: 'var(--ok-bg)' }}>
      <ScrollArea label={titles[tab]} style={{ height: '100%', padding: '20px 16px 116px' }}>
        <Stack gap={3}>
          <Text as="h3" variant="h2" style={{ margin: 0 }}>{titles[tab]}</Text>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Box key={n} surface="card" border radius={4} padding={5}>{t(`${titles[tab]} · 第 ${n} 条`, `${titles[tab]} · item ${n}`)}</Box>
          ))}
        </Stack>
      </ScrollArea>

      <TabBar position="absolute" aria-label={t('主导航', 'Main navigation')} value={tab} onChange={setTab}>
        <TabBarItem value="home" icon={<Icon name="sparkle" />}>{titles.home}</TabBarItem>
        <TabBarItem value="search" icon={<Icon name="search" />}>{titles.search}</TabBarItem>
        <TabBarItem value="me" icon={<Icon name="sliders" />}>{titles.me}</TabBarItem>
      </TabBar>
    </div>
  );
}

export default function TabBarPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('手机上的主导航：一个放大的分段选择，悬在页面底部，左右留缝并避开安全区。选中块在各项之间滑动；旁边可以带一个主操作按钮。只在窄屏用，宽屏换成 AppShell 的侧栏。', 'Primary navigation on phones: an enlarged segmented control floating at the bottom of the page, inset from the sides and clear of the safe area. The selection slides between items, and a primary action button can sit beside it. Use it on narrow screens only; on wide screens switch to the AppShell sidebar.')}>
      <DocSection title={t('示例', 'Examples')}>
        <Demo title={t('手机里的样子', 'On a phone')} description={t('默认 position="fixed" 贴着视口底部。这里为了放进演示框，用的是 position="absolute"。', 'By default position="fixed" pins it to the bottom of the viewport. To fit it in the demo frame, this one uses position="absolute".')} code={t(TABBAR_CODE.zh, TABBAR_CODE.en)}>
          <Phone />
        </Demo>
        <Demo
          title={t('只有图标、带主操作和徽标', 'Icon-only, with a primary action and a badge')}
          description={t(
            <>图标和文字是横排的，带文字时放 2–3 项；4 项以上改成只有图标。聚焦后按 <Kbd k="ArrowLeft" /> <Kbd k="ArrowRight" /> 在各项之间移动。</>,
            <>Icon and text sit side by side, so with text use 2–3 items; with 4 or more switch to icons only. Once focused, <Kbd k="ArrowLeft" /> <Kbd k="ArrowRight" /> move between items.</>,
          )}
          code={t(STATIC_CODE.zh, STATIC_CODE.en)}
        >
          <TabBar
            position="static"
            aria-label={t('视图', 'Views')}
            defaultValue="list"
            style={{ width: 'min(340px, 100%)' }}
            action={<Button variant="primary" size="lg" iconOnly aria-label={t('新建', 'New')} onClick={() => toast(t('新建', 'New'))}><Icon name="plus" /></Button>}
          >
            <TabBarItem value="list" icon={<Icon name="more" />} label={t('列表', 'List')} />
            <TabBarItem value="inbox" icon={<Icon name="bell" />} label={t('消息，3 条未读', 'Messages, 3 unread')} badge="3" />
            <TabBarItem value="share" icon={<Icon name="share" />} label={t('分享', 'Share')} />
            <TabBarItem value="off" icon={<Icon name="trash" />} label={t('回收站', 'Trash')} disabled />
          </TabBar>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title={t('TabBar 属性', 'TabBar props')}
          rows={[
            { name: 'value', type: 'string', description: t('当前项（受控）。', 'Current item (controlled).') },
            { name: 'defaultValue', type: 'string', description: t('初始项（非受控）。', 'Initial item (uncontrolled).') },
            { name: 'onChange', type: '(value: string) => void', description: t('切换时触发，参数是新值。', 'Called on change with the new value.') },
            { name: 'action', type: 'ReactNode', description: t('标签栏旁边的主操作位，比如“新建”按钮。', 'Primary action slot beside the tab bar, such as a “New” button.') },
            { name: 'position', type: `'fixed' | 'absolute' | 'static'`, default: `'fixed'`, description: t('fixed 贴视口底部；absolute 贴最近的定位祖先；static 不定位。', 'fixed pins to the bottom of the viewport; absolute to the nearest positioned ancestor; static is not positioned.') },
            { name: 'aria-label', type: 'string', description: t('导航的名字。', 'Name of the navigation.') },
            restRow(t),
          ]}
        />
        <PropsTable
          title={t('TabBarItem 属性（也可以写成 TabBar.Item）', 'TabBarItem props (also available as TabBar.Item)')}
          rows={[
            { name: 'value', type: 'string', required: true, description: t('这一项的值。', 'Value of this item.') },
            { name: 'icon', type: 'ReactNode', description: t('图标。', 'Icon.') },
            { name: 'children', type: 'ReactNode', description: t('文字。', 'Text.') },
            { name: 'label', type: 'string', description: t('只显示图标时的无障碍名称（没有 children 时必填）。', 'Accessible name when only the icon shows (required without children).') },
            { name: 'badge', type: 'ReactNode', description: t('徽标位（未读数之类）。', 'Badge slot (unread counts and the like).') },
            { name: 'href', type: 'string', description: t('有 href 渲染成 <a>，否则是 <button>。', 'With href it renders an <a>, otherwise a <button>.') },
            { name: 'as', type: 'ElementType', description: t('自定义渲染的元素 / 组件。', 'A custom element / component to render.') },
            { name: 'disabled', type: 'boolean', default: 'false', description: t('禁用。', 'Disabled.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>渲染成 <Code>{'<nav>'}</Code>，当前项带 <Code>aria-current="page"</Code>。它是导航，不是 <Code>tablist</Code>：切换的是页面而不是同一页里的面板。</>,
            <>每一项都能 Tab 到；另外 ← → / Home / End 可以在项之间移动焦点。Enter 或 Space 选中。</>,
            <>只有图标的项必须给 <Code>label</Code>；主操作按钮是图标按钮时同样要有 <Code>aria-label</Code>。</>,
            <>各项高度跟随 <Code>--ok-h-lg</Code>，触屏上自动加高。徽标只有数字时，建议在项的文字或 <Code>label</Code> 里把含义说全（“消息，3 条未读”）。</>,
            <>页面内容底部要留出位置（约 116px 加安全区），否则最后一条内容会被挡住、键盘聚焦到它时也看不见。</>,
          ], [
            <>Renders a <Code>{'<nav>'}</Code>, with <Code>aria-current="page"</Code> on the current item. It is navigation, not a <Code>tablist</Code>: it switches pages, not panels within one page.</>,
            <>Every item is reachable with Tab; ← → / Home / End also move focus between items. Enter or Space selects.</>,
            <>Icon-only items must have a <Code>label</Code>; an icon-button primary action likewise needs an <Code>aria-label</Code>.</>,
            <>Item height follows <Code>--ok-h-lg</Code> and grows automatically on touch screens. When a badge is just a number, spell out its meaning in the item text or <Code>label</Code> (“Messages, 3 unread”).</>,
            <>Leave room at the bottom of the page content (about 116px plus the safe area), or the last item gets covered and stays hidden even when it has keyboard focus.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
