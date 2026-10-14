import { useState } from 'react';
import { Badge, Box, Code, Icon, Nav, NavGroup, NavItem, Stack, Switch } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { href } from '../../router';
import { restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/nav', title: 'Nav 导航', group: '布局', order: 11, subtitle: 'Nav · NavGroup · NavItem', en: { title: 'Nav', subtitle: 'Nav · NavGroup · NavItem' } };

const NAV_CODE = {
  zh: `import { useState } from 'react';
import { Badge, Box, Icon, Nav, NavGroup, NavItem, Stack, Switch } from 'oink-ui';

function Sidebar() {
  const [current, setCurrent] = useState('inbox');
  const [collapsed, setCollapsed] = useState(false);
  const bind = (key: string) => ({ current: current === key, onClick: () => setCurrent(key) });
  return (
    <Stack gap={4} align="center">
      <Switch checked={collapsed} onChange={setCollapsed}>折叠成图标</Switch>
      <Box surface="surface" border highlight radius={5} padding={5} style={{ width: collapsed ? 'auto' : 'min(260px, 100%)' }}>
        <Nav aria-label="示例导航" collapsed={collapsed}>
          <NavGroup label="工作区">
            <NavItem icon={<Icon name="mail" />} badge={<Badge tone="accent">12</Badge>} {...bind('inbox')}>收件箱</NavItem>
            <NavItem icon={<Icon name="edit" />} {...bind('drafts')}>草稿</NavItem>
            <NavItem sub {...bind('drafts-shared')}>与我共享</NavItem>
            <NavItem sub {...bind('drafts-mine')}>我创建的</NavItem>
            <NavItem icon={<Icon name="bell" />} {...bind('alerts')}>提醒</NavItem>
          </NavGroup>
          <NavGroup label="管理">
            <NavItem icon={<Icon name="sliders" />} {...bind('settings')}>设置</NavItem>
            <NavItem icon={<Icon name="trash" />} disabled>回收站（已停用）</NavItem>
          </NavGroup>
        </Nav>
      </Box>
    </Stack>
  );
}`,
  en: `import { useState } from 'react';
import { Badge, Box, Icon, Nav, NavGroup, NavItem, Stack, Switch } from 'oink-ui';

function Sidebar() {
  const [current, setCurrent] = useState('inbox');
  const [collapsed, setCollapsed] = useState(false);
  const bind = (key: string) => ({ current: current === key, onClick: () => setCurrent(key) });
  return (
    <Stack gap={4} align="center">
      <Switch checked={collapsed} onChange={setCollapsed}>Collapse to icons</Switch>
      <Box surface="surface" border highlight radius={5} padding={5} style={{ width: collapsed ? 'auto' : 'min(260px, 100%)' }}>
        <Nav aria-label="Example navigation" collapsed={collapsed}>
          <NavGroup label="Workspace">
            <NavItem icon={<Icon name="mail" />} badge={<Badge tone="accent">12</Badge>} {...bind('inbox')}>Inbox</NavItem>
            <NavItem icon={<Icon name="edit" />} {...bind('drafts')}>Drafts</NavItem>
            <NavItem sub {...bind('drafts-shared')}>Shared with me</NavItem>
            <NavItem sub {...bind('drafts-mine')}>Created by me</NavItem>
            <NavItem icon={<Icon name="bell" />} {...bind('alerts')}>Reminders</NavItem>
          </NavGroup>
          <NavGroup label="Admin">
            <NavItem icon={<Icon name="sliders" />} {...bind('settings')}>Settings</NavItem>
            <NavItem icon={<Icon name="trash" />} disabled>Trash (disabled)</NavItem>
          </NavGroup>
        </Nav>
      </Box>
    </Stack>
  );
}`,
};

const LINK_CODE = {
  zh: `import { Icon, Nav, NavItem } from 'oink-ui';

{/* 有 href 渲染成 <a>；current 加上 aria-current="page" */}
<Nav aria-label="文档">
  <NavItem href="/components/nav" current icon={<Icon name="info" />}>Nav</NavItem>
  <NavItem href="/components/app-shell" icon={<Icon name="monitor" />}>AppShell</NavItem>
  <NavItem href="/components/tab-bar" icon={<Icon name="more" />}>TabBar</NavItem>
</Nav>

{/* 路由库的 Link：用 as 传进去，其余属性原样透传 */}
{/* <NavItem as={RouterLink} to="/settings" current={pathname === '/settings'}>设置</NavItem> */}`,
  en: `import { Icon, Nav, NavItem } from 'oink-ui';

{/* With href it renders an <a>; current adds aria-current="page" */}
<Nav aria-label="Docs">
  <NavItem href="/components/nav" current icon={<Icon name="info" />}>Nav</NavItem>
  <NavItem href="/components/app-shell" icon={<Icon name="monitor" />}>AppShell</NavItem>
  <NavItem href="/components/tab-bar" icon={<Icon name="more" />}>TabBar</NavItem>
</Nav>

{/* A router’s Link: pass it through as; other props are forwarded unchanged */}
{/* <NavItem as={RouterLink} to="/settings" current={pathname === '/settings'}>Settings</NavItem> */}`,
};

function Sidebar() {
  const t = useT();
  const [current, setCurrent] = useState('inbox');
  const [collapsed, setCollapsed] = useState(false);
  const bind = (key: string) => ({ current: current === key, onClick: () => setCurrent(key) });
  return (
    <Stack gap={4} align="center" className="g-fill">
      <Switch checked={collapsed} onChange={setCollapsed}>{t('折叠成图标', 'Collapse to icons')}</Switch>
      <Box surface="surface" border highlight radius={5} padding={5} style={{ width: collapsed ? 'auto' : 'min(260px, 100%)' }}>
        <Nav aria-label={t('示例导航', 'Example navigation')} collapsed={collapsed}>
          <NavGroup label={t('工作区', 'Workspace')}>
            <NavItem icon={<Icon name="mail" />} badge={<Badge tone="accent">12</Badge>} {...bind('inbox')}>{t('收件箱', 'Inbox')}</NavItem>
            <NavItem icon={<Icon name="edit" />} {...bind('drafts')}>{t('草稿', 'Drafts')}</NavItem>
            <NavItem sub {...bind('drafts-shared')}>{t('与我共享', 'Shared with me')}</NavItem>
            <NavItem sub {...bind('drafts-mine')}>{t('我创建的', 'Created by me')}</NavItem>
            <NavItem icon={<Icon name="bell" />} {...bind('alerts')}>{t('提醒', 'Reminders')}</NavItem>
          </NavGroup>
          <NavGroup label={t('管理', 'Admin')}>
            <NavItem icon={<Icon name="sliders" />} {...bind('settings')}>{t('设置', 'Settings')}</NavItem>
            <NavItem icon={<Icon name="trash" />} disabled>{t('回收站（已停用）', 'Trash (disabled)')}</NavItem>
          </NavGroup>
        </Nav>
      </Box>
    </Stack>
  );
}

export default function NavPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('纵向的导航列表，通常放在 AppShell 的侧栏里。当前项下面有一块中性色的指示块，切换时滑到新的一项。选中用中性色，不用强调色。', 'A vertical navigation list, usually placed in an AppShell sidebar. A neutral indicator sits under the current item and slides to the new one when it changes. Selection uses a neutral color, not the accent color.')}>
      <DocSection title={t('示例', 'Examples')}>
        <Demo title={t('分组、图标、徽标、二级项', 'Groups, icons, badges and sub-items')} description={t('点任意一项，指示块会滑过去。打开开关看折叠后的样子：只剩图标，分组标题收成一条细线，徽标缩成小圆点。', 'Click any item and the indicator slides over. Turn on the switch to see the collapsed form: icons only, group titles shrink to a thin line, and badges become small dots.')} code={t(NAV_CODE.zh, NAV_CODE.en)} layout="block">
          <Sidebar />
        </Demo>
        <Demo title={t('链接', 'Links')} description={t('导航到别的页面用 href（或路由库的 Link）；只是切换视图用 onClick，渲染成按钮。', 'Use href (or a router’s Link) to navigate to another page; use onClick to just switch views, which renders a button.')} code={t(LINK_CODE.zh, LINK_CODE.en)}>
          <div style={{ width: 'min(260px, 100%)' }}>
            <Nav aria-label={t('文档', 'Docs')}>
              <NavItem href={href('/components/nav')} current icon={<Icon name="info" />}>Nav</NavItem>
              <NavItem href={href('/components/app-shell')} icon={<Icon name="monitor" />}>AppShell</NavItem>
              <NavItem href={href('/components/tab-bar')} icon={<Icon name="more" />}>TabBar</NavItem>
            </Nav>
          </div>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title={t('Nav 属性', 'Nav props')}
          rows={[
            { name: 'collapsed', type: 'boolean', description: t('折叠：只显示图标。不传时跟随所在的 AppShell.Sidebar（收成图标窄条时自动折叠）。', 'Collapsed: icons only. When omitted it follows the enclosing AppShell.Sidebar (collapsing automatically when that shrinks to an icon rail).') },
            { name: 'aria-label', type: 'string', description: t('导航的名字。页面上有多个导航时用来区分。', 'Name of the navigation, to tell several navigations on a page apart.') },
            restRow(t),
          ]}
        />
        <PropsTable
          title={t('NavGroup 属性', 'NavGroup props')}
          rows={[
            { name: 'label', type: 'ReactNode', description: t('分组标题；折叠时收成一条细线，但仍然是这组的无障碍名称。', 'Group title; shrinks to a thin line when collapsed but remains the group’s accessible name.') },
            restRow(t),
          ]}
        />
        <PropsTable
          title={t('NavItem 属性', 'NavItem props')}
          rows={[
            { name: 'href', type: 'string', description: t('有 href 渲染成 <a>，否则是 <button>。', 'With href it renders an <a>, otherwise a <button>.') },
            { name: 'as', type: 'ElementType', description: t('自定义渲染的元素 / 组件，比如路由库的 Link。', 'A custom element / component to render, such as a router’s Link.') },
            { name: 'current', type: 'boolean', default: 'false', description: t('当前页：加 aria-current="page"，指示块滑到这一项。', 'Current page: adds aria-current="page" and the indicator slides to this item.') },
            { name: 'icon', type: 'ReactNode', description: t('前面的图标。要支持折叠就必须给。', 'Leading icon. Required if the nav can collapse.') },
            { name: 'badge', type: 'ReactNode', description: t('后面的徽标位（数量、状态点）；折叠时缩成一个小圆点。', 'Trailing badge slot (counts, status dots); becomes a small dot when collapsed.') },
            { name: 'sub', type: 'boolean', default: 'false', description: t('二级项：缩进、矮一档。', 'Sub-item: indented and one step shorter.') },
            { name: 'label', type: 'string', description: t('折叠时的 title / aria-label。children 是纯文字时可以不传。', 'title / aria-label when collapsed. Optional when children is plain text.') },
            { name: 'disabled', type: 'boolean', default: 'false', description: t('禁用：不响应点击，链接去掉 href。', 'Disabled: ignores clicks, and links drop their href.') },
            restRow(t),
          ]}
        />
        <A11yNotes
          items={t([
            <>根节点是 <Code>{'<nav>'}</Code>（navigation 地标），请给 <Code>aria-label</Code>。分组是 <Code>role="group"</Code>，用分组标题命名。</>,
            <>当前项带 <Code>aria-current="page"</Code>，读屏会念出“当前页”。指示块只是装饰。</>,
            <>每一项都是普通的链接或按钮，按 Tab 顺序逐个到达，Enter（按钮还有 Space）触发。这是导航而不是菜单，所以不用方向键。</>,
            <>折叠后文字从视觉上隐藏，名字改由 <Code>aria-label</Code> 和 <Code>title</Code> 提供：children 不是纯文字时记得传 <Code>label</Code>。</>,
            <>禁用项带 <Code>aria-disabled</Code>；只靠徽标颜色表达的信息要有文字（比如未读数）。</>,
          ], [
            <>The root is a <Code>{'<nav>'}</Code> (navigation landmark); give it an <Code>aria-label</Code>. Groups are <Code>role="group"</Code>, named by their titles.</>,
            <>The current item carries <Code>aria-current="page"</Code>, which screen readers announce as “current page”. The indicator is purely decorative.</>,
            <>Every item is a plain link or button, reached one by one in Tab order and activated with Enter (and Space for buttons). This is navigation, not a menu, so arrow keys aren’t used.</>,
            <>When collapsed the text is visually hidden and the name comes from <Code>aria-label</Code> and <Code>title</Code>: pass <Code>label</Code> when children isn’t plain text.</>,
            <>Disabled items carry <Code>aria-disabled</Code>; anything conveyed only by badge color needs text too (an unread count, for example).</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
