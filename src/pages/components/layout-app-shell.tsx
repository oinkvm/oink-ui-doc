import { useState } from 'react';
import { AppShell, Badge, Box, Code, Icon, Inline, Nav, NavGroup, NavItem, Segmented, Spacer, Stack, Switch, Text, useAppShell } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import { restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/app-shell', title: 'AppShell 应用骨架', group: '布局', order: 10, subtitle: 'AppShell', en: { title: 'AppShell' } };

const SHELL_CODE = {
  zh: `import { useState } from 'react';
import { AppShell, Badge, Box, Icon, Inline, Nav, NavGroup, NavItem, Segmented, Spacer, Stack, Switch, Text, useAppShell } from 'oink-ui';

const PAGES = { inbox: '收件箱', sent: '已发送', trash: '回收站', settings: '设置' };
type PageKey = keyof typeof PAGES;

// 在骨架里面的任何组件都能读到它的状态
function ShellState() {
  const { sidebarCollapsed, sidebarOpen, rail } = useAppShell();
  return (
    <Badge tone="info">
      {sidebarCollapsed ? \`抽屉形态 · \${sidebarOpen ? '已打开' : '已收起'}\` : rail ? '停靠 · 图标窄条' : '停靠 · 完整宽度'}
    </Badge>
  );
}

function ShellDemo() {
  const [mode, setMode] = useState<'auto' | 'docked' | 'drawer'>('auto');
  const [rail, setRail] = useState(false);
  const [page, setPage] = useState<PageKey>('inbox');
  const item = (key: PageKey, icon: 'mail' | 'share' | 'trash' | 'sliders', badge?: string) => (
    <NavItem icon={<Icon name={icon} />} badge={badge} current={page === key} onClick={() => setPage(key)}>{PAGES[key]}</NavItem>
  );
  return (
    <Stack gap={4}>
      <Inline gap={3} justify="center">
        <Segmented
          aria-label="侧栏形态"
          value={mode}
          onChange={setMode}
          options={[{ value: 'auto', label: '自动' }, { value: 'docked', label: '强制停靠' }, { value: 'drawer', label: '强制抽屉' }]}
        />
        <Switch checked={rail} onChange={setRail} disabled={mode === 'drawer'}>图标窄条</Switch>
      </Inline>

      {/* contained：放进一个固定高度的框里，按框的宽度判断形态，抽屉也只盖住这个框 */}
      <div style={{ height: 480 }}>
        <AppShell contained collapsed={mode === 'auto' ? 'auto' : mode === 'drawer'} rail={rail} onRailChange={setRail}>
          <AppShell.Header>
            <AppShell.Trigger />
            <Text variant="label">Oink 邮箱</Text>
            <Spacer />
            <AppShell.Trigger target="aside" label="打开详情"><Icon name="info" /></AppShell.Trigger>
          </AppShell.Header>

          <AppShell.Sidebar label="主导航" width={208}>
            <Nav aria-label="主导航">
              <NavGroup label="邮件">
                {item('inbox', 'mail', '12')}
                {item('sent', 'share')}
                {item('trash', 'trash')}
              </NavGroup>
              <NavGroup label="其它">
                {item('settings', 'sliders')}
              </NavGroup>
            </Nav>
          </AppShell.Sidebar>

          <AppShell.Main>
            <Stack gap={3} padding={2}>
              <Text as="h3" variant="h3" style={{ margin: 0 }}>{PAGES[page]}</Text>
              <ShellState />
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Box key={n} surface="card" border radius={3} padding={4}>{PAGES[page]}里的第 {n} 条</Box>
              ))}
            </Stack>
          </AppShell.Main>

          <AppShell.Aside label="详情" width={220}>
            <Stack gap={2}>
              <Text variant="label">详情</Text>
              <Text variant="caption" tone="neutral">辅助栏。框的宽度小于 lg（1024）时它收成从右侧滑入的抽屉，用顶栏右边的按钮打开。</Text>
            </Stack>
          </AppShell.Aside>

          <AppShell.Footer>已同步 · 刚刚</AppShell.Footer>
        </AppShell>
      </div>
    </Stack>
  );
}`,
  en: `import { useState } from 'react';
import { AppShell, Badge, Box, Icon, Inline, Nav, NavGroup, NavItem, Segmented, Spacer, Stack, Switch, Text, useAppShell } from 'oink-ui';

const PAGES = { inbox: 'Inbox', sent: 'Sent', trash: 'Trash', settings: 'Settings' };
type PageKey = keyof typeof PAGES;

// Any component inside the shell can read its state
function ShellState() {
  const { sidebarCollapsed, sidebarOpen, rail } = useAppShell();
  return (
    <Badge tone="info">
      {sidebarCollapsed ? \`Drawer · \${sidebarOpen ? 'open' : 'closed'}\` : rail ? 'Docked · icon rail' : 'Docked · full width'}
    </Badge>
  );
}

function ShellDemo() {
  const [mode, setMode] = useState<'auto' | 'docked' | 'drawer'>('auto');
  const [rail, setRail] = useState(false);
  const [page, setPage] = useState<PageKey>('inbox');
  const item = (key: PageKey, icon: 'mail' | 'share' | 'trash' | 'sliders', badge?: string) => (
    <NavItem icon={<Icon name={icon} />} badge={badge} current={page === key} onClick={() => setPage(key)}>{PAGES[key]}</NavItem>
  );
  return (
    <Stack gap={4}>
      <Inline gap={3} justify="center">
        <Segmented
          aria-label="Sidebar mode"
          value={mode}
          onChange={setMode}
          options={[{ value: 'auto', label: 'Auto' }, { value: 'docked', label: 'Always docked' }, { value: 'drawer', label: 'Always drawer' }]}
        />
        <Switch checked={rail} onChange={setRail} disabled={mode === 'drawer'}>Icon rail</Switch>
      </Inline>

      {/* contained: lives in a fixed-height box, picks its mode from the box width, and the drawer only covers the box */}
      <div style={{ height: 480 }}>
        <AppShell contained collapsed={mode === 'auto' ? 'auto' : mode === 'drawer'} rail={rail} onRailChange={setRail}>
          <AppShell.Header>
            <AppShell.Trigger />
            <Text variant="label">Oink Mail</Text>
            <Spacer />
            <AppShell.Trigger target="aside" label="Open details"><Icon name="info" /></AppShell.Trigger>
          </AppShell.Header>

          <AppShell.Sidebar label="Main navigation" width={208}>
            <Nav aria-label="Main navigation">
              <NavGroup label="Mail">
                {item('inbox', 'mail', '12')}
                {item('sent', 'share')}
                {item('trash', 'trash')}
              </NavGroup>
              <NavGroup label="Other">
                {item('settings', 'sliders')}
              </NavGroup>
            </Nav>
          </AppShell.Sidebar>

          <AppShell.Main>
            <Stack gap={3} padding={2}>
              <Text as="h3" variant="h3" style={{ margin: 0 }}>{PAGES[page]}</Text>
              <ShellState />
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Box key={n} surface="card" border radius={3} padding={4}>{PAGES[page]} item {n}</Box>
              ))}
            </Stack>
          </AppShell.Main>

          <AppShell.Aside label="Details" width={220}>
            <Stack gap={2}>
              <Text variant="label">Details</Text>
              <Text variant="caption" tone="neutral">The side panel. When the box is narrower than lg (1024) it becomes a drawer that slides in from the right, opened with the button at the right of the header.</Text>
            </Stack>
          </AppShell.Aside>

          <AppShell.Footer>Synced · just now</AppShell.Footer>
        </AppShell>
      </div>
    </Stack>
  );
}`,
};

const MINIMAL_CODE = {
  zh: `import type { ReactNode } from 'react';
import { AppShell, Nav, NavItem } from 'oink-ui';

// 真实应用里不加 contained：骨架占满一屏（100dvh），按视口宽度判断
export function Layout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <AppShell.Header>
        <AppShell.Trigger drawerOnly />
        我的应用
      </AppShell.Header>
      <AppShell.Sidebar label="主导航">
        <Nav aria-label="主导航">
          <NavItem href="/" current>首页</NavItem>
          <NavItem href="/settings">设置</NavItem>
        </Nav>
      </AppShell.Sidebar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}`,
  en: `import type { ReactNode } from 'react';
import { AppShell, Nav, NavItem } from 'oink-ui';

// In a real app, skip contained: the shell fills the screen (100dvh) and follows the viewport width
export function Layout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <AppShell.Header>
        <AppShell.Trigger drawerOnly />
        My app
      </AppShell.Header>
      <AppShell.Sidebar label="Main navigation">
        <Nav aria-label="Main navigation">
          <NavItem href="/" current>Home</NavItem>
          <NavItem href="/settings">Settings</NavItem>
        </Nav>
      </AppShell.Sidebar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}`,
};

const PAGES = {
  zh: { inbox: '收件箱', sent: '已发送', trash: '回收站', settings: '设置' },
  en: { inbox: 'Inbox', sent: 'Sent', trash: 'Trash', settings: 'Settings' },
};
type PageKey = keyof typeof PAGES.zh;

function ShellState() {
  const t = useT();
  const { sidebarCollapsed, sidebarOpen, rail } = useAppShell();
  return (
    <Badge tone="info">
      {sidebarCollapsed
        ? t(`抽屉形态 · ${sidebarOpen ? '已打开' : '已收起'}`, `Drawer · ${sidebarOpen ? 'open' : 'closed'}`)
        : rail ? t('停靠 · 图标窄条', 'Docked · icon rail') : t('停靠 · 完整宽度', 'Docked · full width')}
    </Badge>
  );
}

function ShellDemo() {
  const t = useT();
  const pages = t(PAGES.zh, PAGES.en);
  const [mode, setMode] = useState<'auto' | 'docked' | 'drawer'>('auto');
  const [rail, setRail] = useState(false);
  const [page, setPage] = useState<PageKey>('inbox');
  const item = (key: PageKey, icon: 'mail' | 'share' | 'trash' | 'sliders', badge?: string) => (
    <NavItem icon={<Icon name={icon} />} badge={badge} current={page === key} onClick={() => setPage(key)}>{pages[key]}</NavItem>
  );
  return (
    <Stack gap={4} className="g-fill">
      <Inline gap={3} justify="center">
        <Segmented
          aria-label={t('侧栏形态', 'Sidebar mode')}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'auto', label: t('自动', 'Auto') },
            { value: 'docked', label: t('强制停靠', 'Always docked') },
            { value: 'drawer', label: t('强制抽屉', 'Always drawer') },
          ]}
        />
        <Switch checked={rail} onChange={setRail} disabled={mode === 'drawer'}>{t('图标窄条', 'Icon rail')}</Switch>
      </Inline>

      <div className="g-frame" style={{ height: 480 }}>
        <AppShell contained collapsed={mode === 'auto' ? 'auto' : mode === 'drawer'} rail={rail} onRailChange={setRail}>
          <AppShell.Header>
            <AppShell.Trigger />
            <Text variant="label">{t('Oink 邮箱', 'Oink Mail')}</Text>
            <Spacer />
            <AppShell.Trigger target="aside" label={t('打开详情', 'Open details')}><Icon name="info" /></AppShell.Trigger>
          </AppShell.Header>

          <AppShell.Sidebar label={t('主导航', 'Main navigation')} width={208}>
            <Nav aria-label={t('主导航', 'Main navigation')}>
              <NavGroup label={t('邮件', 'Mail')}>
                {item('inbox', 'mail', '12')}
                {item('sent', 'share')}
                {item('trash', 'trash')}
              </NavGroup>
              <NavGroup label={t('其它', 'Other')}>
                {item('settings', 'sliders')}
              </NavGroup>
            </Nav>
          </AppShell.Sidebar>

          <AppShell.Main>
            <Stack gap={3} padding={2}>
              <Text as="h3" variant="h3" style={{ margin: 0 }}>{pages[page]}</Text>
              <ShellState />
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Box key={n} surface="card" border radius={3} padding={4}>{t(`${pages[page]}里的第 ${n} 条`, `${pages[page]} item ${n}`)}</Box>
              ))}
            </Stack>
          </AppShell.Main>

          <AppShell.Aside label={t('详情', 'Details')} width={220}>
            <Stack gap={2}>
              <Text variant="label">{t('详情', 'Details')}</Text>
              <Text variant="caption" tone="neutral">{t('辅助栏。框的宽度小于 lg（1024）时它收成从右侧滑入的抽屉，用顶栏右边的按钮打开。', 'The side panel. When the box is narrower than lg (1024) it becomes a drawer that slides in from the right, opened with the button at the right of the header.')}</Text>
            </Stack>
          </AppShell.Aside>

          <AppShell.Footer>{t('已同步 · 刚刚', 'Synced · just now')}</AppShell.Footer>
        </AppShell>
      </div>
    </Stack>
  );
}

export default function AppShellPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('整页的骨架：顶栏、侧栏、主区、辅助栏、底栏。整体占满一屏，各区各自滚动。侧栏和辅助栏是和边缘留缝的圆角卡片：宽屏停靠在两侧、占据布局空间；窄屏时同一份内容改由悬浮卡片从对应一侧滑入。你现在看的这个文档站，外壳就是它。', 'The skeleton of a whole page: header, sidebar, main area, side panel and footer. It fills the screen and each region scrolls on its own. The sidebar and side panel are rounded cards set in from the edges: on wide screens they dock to either side and take up layout space; on narrow screens the same content slides in from that side as a floating card. The docs site you are reading uses it as its shell.')}>
      <DocSection title={t('三种形态', 'Three modes')} description={t('侧栏有三种形态：停靠（完整宽度）、停靠（收成图标窄条）、抽屉。默认按宽度自动在停靠和抽屉之间切换；collapsed 可以强制。AppShell.Trigger 在抽屉形态下开关抽屉，停靠时在完整宽度和图标窄条之间切换。', 'The sidebar has three modes: docked at full width, docked as an icon rail, and drawer. By default it switches between docked and drawer based on width; collapsed can force one. AppShell.Trigger opens and closes the drawer in drawer mode, and toggles between full width and icon rail when docked.')}>
        <Demo code={t(SHELL_CODE.zh, SHELL_CODE.en)} layout="block">
          <ShellDemo />
        </Demo>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>contained。</strong>演示里的骨架嵌在一个 480px 高的框里：高度取 100% 而不是 100dvh，宽窄按自身宽度判断（<Code>@container</Code>），抽屉和遮罩也只盖住这个框。把浏览器拉窄到框不足 768px，“自动”会变成抽屉形态。</li>
              <li><strong>同一份 children。</strong>侧栏的内容只写一次。抽屉形态下它被渲染进 <Link to="/guide/floating-card" className="g-link ok-focusable">悬浮卡片</Link>（模态：圈焦点、Esc 关闭），点了里面的导航项后自动关上（<Code>closeOnNavigate</Code>）。</li>
              <li><strong>图标窄条。</strong>停靠的侧栏收窄后，里面的 <Code>Nav</Code> 自动折叠成只剩图标，文字改由 <Code>title</Code> / <Code>aria-label</Code> 提供。所以导航项要配图标。</li>
              <li><strong>各部件要作为 AppShell 的直接子节点</strong>，不要在中间包别的元素。</li>
            </ul>,
            <ul>
              <li><strong>contained.</strong> The shell in the demo sits in a 480px-tall box: its height is 100% instead of 100dvh, it judges wide versus narrow from its own width (<Code>@container</Code>), and the drawer and scrim only cover the box. Narrow the browser until the box is under 768px and Auto switches to drawer mode.</li>
              <li><strong>One set of children.</strong> The sidebar content is written once. In drawer mode it renders inside a <Link to="/guide/floating-card" className="g-link ok-focusable">floating card</Link> (modal: focus is trapped, Esc closes it) and closes itself after a nav item inside is clicked (<Code>closeOnNavigate</Code>).</li>
              <li><strong>Icon rail.</strong> When the docked sidebar narrows, the <Code>Nav</Code> inside collapses to icons only, with the text moving into <Code>title</Code> / <Code>aria-label</Code>. So give your nav items icons.</li>
              <li><strong>Each part must be a direct child of AppShell</strong>; don’t wrap them in other elements.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('最小用法', 'Minimal usage')}>
        <Demo code={t(MINIMAL_CODE.zh, MINIMAL_CODE.en)} layout="block">
          <Text as="p" tone="neutral" style={{ margin: 0 }}>
            {t(
              <>真实应用里的写法（不加 <Code>contained</Code>）没法在文档页里嵌一份，看代码，或者直接看<Link to="/examples" className="g-link ok-focusable">示例应用</Link>。<Code>drawerOnly</Code> 的开关按钮只在抽屉形态下出现。</>,
              <>The real-app setup (without <Code>contained</Code>) can’t be embedded in a docs page, so read the code or go straight to the <Link to="/examples" className="g-link ok-focusable">example apps</Link>. A <Code>drawerOnly</Code> trigger only appears in drawer mode.</>,
            )}
          </Text>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title={t('AppShell 属性', 'AppShell props')}
          rows={[
            { name: 'contained', type: 'boolean', default: 'false', description: t('嵌在固定高度的容器里：高度取 100%，按自身宽度判断形态，抽屉只盖住这个容器。', 'Embedded in a fixed-height container: height is 100%, the mode follows its own width, and drawers only cover that container.') },
            { name: 'collapsed', type: `'auto' | boolean`, default: `'auto'`, description: t('侧栏 / 辅助栏是否收成抽屉。auto 按断点判断；true / false 强制。', 'Whether the sidebar / side panel become drawers. auto decides by breakpoint; true / false force it.') },
            { name: 'collapseBelow', type: `'sm' | 'md' | 'lg' | 'xl'`, default: `'md'`, description: t('auto 时，宽度小于该断点侧栏变抽屉。', 'With auto, the sidebar becomes a drawer below this breakpoint.') },
            { name: 'asideCollapseBelow', type: `'sm' | 'md' | 'lg' | 'xl'`, default: `'lg'`, description: t('auto 时，宽度小于该断点辅助栏变抽屉。', 'With auto, the side panel becomes a drawer below this breakpoint.') },
            { name: 'sidebarOpen / defaultSidebarOpen / onSidebarOpenChange', type: 'boolean / boolean / (open) => void', description: t('侧栏抽屉的开关（受控 / 非受控）。', 'Whether the sidebar drawer is open (controlled / uncontrolled).') },
            { name: 'asideOpen / defaultAsideOpen / onAsideOpenChange', type: 'boolean / boolean / (open) => void', description: t('辅助栏的显示状态（受控 / 非受控）。停靠时控制是否显示（默认显示），抽屉形态下控制抽屉开合（默认关闭）。', 'Side panel visibility (controlled / uncontrolled). When docked it controls whether the panel shows (shown by default); in drawer mode it opens and closes the drawer (closed by default).') },
            { name: 'rail / defaultRail / onRailChange', type: 'boolean / boolean / (rail) => void', description: t('停靠的侧栏是否收成图标窄条（受控 / 非受控）。', 'Whether the docked sidebar shrinks to an icon rail (controlled / uncontrolled).') },
            { name: 'gap', type: 'Space', default: t('3（窄屏 2）', '3 (2 on phones)'), description: t('卡片之间、卡片到边缘的缝。', 'The gap between cards and between cards and the edges.') },
            { name: 'skipLinkLabel', type: 'string', default: t(`'跳到主要内容'`, `'Skip to main content'`), description: t('跳转链接的文字。', 'Text of the skip link. The default follows the OinkProvider locale.') },
            { name: 'mainId', type: 'string', description: t('<main> 的 id；不传自动生成。', 'id of the <main>; generated when omitted.') },
            restRow(t),
          ]}
        />
        <PropsTable
          title={t('AppShell.Sidebar / AppShell.Aside 属性', 'AppShell.Sidebar / AppShell.Aside props')}
          rows={[
            { name: 'label', type: 'string', default: t(`'侧栏' / '辅助栏'`, `'Sidebar' / 'Side panel'`), description: t('无障碍名称。', 'Accessible name. The default follows the OinkProvider locale.') },
            { name: 'width', type: 'number | string', default: '260 / 320', description: t('停靠时的宽度（数字按 px）。', 'Width when docked (numbers are px).') },
            { name: 'drawerWidth', type: 'number | string', default: '300 / 360', description: t('抽屉形态下的宽度，不会超过可用宽度。', 'Width in drawer mode, never wider than the available space.') },
            { name: 'padding', type: 'Space', default: '5', description: t('卡片内边距（20px：外圆角 32 − 导航项圆角 12）。', 'Card padding (20px: outer corner radius 32 − nav item corner radius 12).') },
            { name: 'closeOnNavigate', type: 'boolean', default: 'true / false', description: t('抽屉形态下，点了里面的导航项或链接后自动关上。', 'In drawer mode, closes automatically after a nav item or link inside is clicked.') },
          ]}
        />
        <PropsTable
          title={t('AppShell.Header / AppShell.Footer / AppShell.Trigger 属性', 'AppShell.Header / AppShell.Footer / AppShell.Trigger props')}
          rows={[
            { name: 'Header / Footer · variant', type: `'plain' | 'card'`, default: `'plain'`, description: t('plain 直接坐在画布上；card 和侧栏一样是一张卡片。', 'plain sits directly on the canvas; card is a card like the sidebar.') },
            { name: 'Trigger · target', type: `'sidebar' | 'aside'`, default: `'sidebar'`, description: t('控制哪一栏。辅助栏的开关在停靠和抽屉两种形态下都可用。', 'Which panel it controls. The side panel toggle works in both docked and drawer modes.') },
            { name: 'Trigger · label', type: 'string', default: t(`'切换导航' / '切换辅助栏'`, `'Toggle navigation' / 'Toggle side panel'`), description: t('按钮的无障碍名称。', 'Accessible name of the button. The default follows the OinkProvider locale.') },
            { name: 'Trigger · drawerOnly', type: 'boolean', default: 'false', description: t('只在抽屉形态下渲染（不需要图标窄条时用）。', 'Only renders in drawer mode (use it when you don’t need the icon rail).') },
            { name: 'Trigger · children', type: 'ReactNode', description: t('自定义图标，默认三条横线。', 'Custom icon; three horizontal lines by default.') },
          ]}
        />
        <PropsTable
          title={t('useAppShell() 的返回值', 'useAppShell() return value')}
          rows={[
            { name: 'sidebarCollapsed / asideCollapsed', type: 'boolean', description: t('当前是不是抽屉形态。', 'Whether it is currently in drawer mode.') },
            { name: 'sidebarOpen / setSidebarOpen / openSidebar / closeSidebar', type: t('boolean / 函数', 'boolean / functions'), description: t('侧栏抽屉的状态与控制。', 'State and controls of the sidebar drawer.') },
            { name: 'toggleSidebar', type: '() => void', description: t('抽屉形态：开关抽屉；停靠形态：展开 / 收成图标窄条。', 'Drawer mode: opens or closes the drawer; docked: expands or shrinks to the icon rail.') },
            { name: 'rail / setRail / toggleRail', type: t('boolean / 函数', 'boolean / functions'), description: t('图标窄条的状态与控制。', 'State and controls of the icon rail.') },
            { name: 'asideOpen / setAsideOpen / toggleAside', type: t('boolean / 函数', 'boolean / functions'), description: t('辅助栏的显示状态与控制，停靠和抽屉形态通用。', 'Visibility state and controls of the side panel, in both docked and drawer modes.') },
            { name: 'contained', type: 'boolean', description: t('是否嵌在容器里。', 'Whether it is embedded in a container.') },
            { name: 'mainId', type: 'string', description: t('<main> 的 id。', 'id of the <main>.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>地标齐全：Header 是 <Code>{'<header>'}</Code>，Sidebar / Aside 是带名字的 <Code>{'<aside>'}</Code>，Main 是 <Code>{'<main>'}</Code>，Footer 是 <Code>{'<footer>'}</Code>。</>,
            <>骨架的第一个可聚焦元素是“跳到主要内容”链接：平时看不见，Tab 聚焦时滑下来，回车后焦点直接进入主区。</>,
            <>抽屉形态下侧栏是模态对话框：打开时焦点移进去并圈住，Esc 或点遮罩关闭，关闭后焦点回到开关按钮。</>,
            <>开关按钮带 <Code>aria-expanded</Code>；抽屉形态下还有 <Code>aria-haspopup="dialog"</Code>。自定义图标时名字仍由 <Code>label</Code> 提供。</>,
            <>主区可以被聚焦（<Code>tabIndex=-1</Code>）并独立滚动；给 Sidebar、Aside 起能区分的 <Code>label</Code>。</>,
          ], [
            <>A full set of landmarks: Header is a <Code>{'<header>'}</Code>, Sidebar / Aside are named <Code>{'<aside>'}</Code> elements, Main is a <Code>{'<main>'}</Code>, and Footer is a <Code>{'<footer>'}</Code>.</>,
            <>The first focusable element in the shell is a “Skip to main content” link: invisible until Tab focuses it and it slides down; Enter moves focus straight into the main area.</>,
            <>In drawer mode the sidebar is a modal dialog: focus moves in and is trapped while open, Esc or clicking the scrim closes it, and focus returns to the trigger afterwards.</>,
            <>Triggers carry <Code>aria-expanded</Code>, plus <Code>aria-haspopup="dialog"</Code> in drawer mode. With a custom icon, the name still comes from <Code>label</Code>.</>,
            <>The main area is focusable (<Code>tabIndex=-1</Code>) and scrolls on its own; give Sidebar and Aside distinct <Code>label</Code>s.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
