// 库的样式（令牌 + 全部组件）最先引入，站点自己的样式排在后面
import 'oink-ui/styles.css';
import { Fragment, useEffect } from 'react';
import type { ComponentType } from 'react';
import { AppShell, Confirmer, Icon, Nav, NavGroup, NavItem, OinkProvider, Toaster } from 'oink-ui';
import { Link, href, navigate, useLang, usePath } from './router';
import { groupLabel, pageGroups, pageTitle } from './registry';
import { localeOf, useT } from './i18n';
import { loadedRoute, resolveRoute } from './routes';
import { FaviconSync, STORAGE_KEY, SiteBrand, SiteControls, SiteLinks, ThemeSync } from './chrome';
import './site.css';

function DocsShell({ path, Body }: { path: string; Body?: ComponentType }) {
  const lang = useLang();
  const t = useT();
  return (
    <AppShell>
      <AppShell.Header>
        <AppShell.Trigger drawerOnly />
        <SiteBrand />
        <SiteLinks path={path} />
        <SiteControls />
      </AppShell.Header>
      <AppShell.Sidebar label={t('文档导航', 'Docs navigation')}>
        <Nav aria-label={t('文档导航', 'Docs navigation')}>
          {pageGroups.map((g) => (
            <NavGroup key={g.group} label={groupLabel(g.group, lang)}>
              {g.items.map((p) => <NavItem key={p.path} href={href(p.path)} current={p.path === path}>{pageTitle(p, lang)}</NavItem>)}
            </NavGroup>
          ))}
        </Nav>
      </AppShell.Sidebar>
      <AppShell.Main>
        <div className="site-main" key={path}>
          {Body ? <Body /> : <NotFound />}
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

function NotFound() {
  const t = useT();
  return <div className="site-404"><h1>{t('没有这个页面', 'Page not found')}</h1><p><Link to="/">{t('回到首页', 'Back to home')}</Link></p></div>;
}

/**
 * 示例应用整页。被首页 iframe 嵌入（?embed）时不显示左下角的返回按钮：
 * 预渲染的 HTML 嵌入与否是同一份，所以由 index.html 里的脚本给 <html> 打 data-embed，CSS 隐藏
 */
function ExampleFrame({ Body }: { Body: ComponentType }) {
  const t = useT();
  return (
    <>
      <Body />
      <Link to="/" className="site-back ok-btn ok-btn--sm ok-focusable" aria-label={t('返回 Oink UI 首页', 'Back to the Oink UI home page')}>
        <Icon name="chevron-left" />Oink UI
      </Link>
    </>
  );
}

export function App() {
  const path = usePath();
  const lang = useLang();
  const route = resolveRoute(path, lang);
  const Body = loadedRoute(path);
  useEffect(() => { document.title = route.title; }, [route.title]);
  useEffect(() => { document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'; }, [lang]);
  // 以前的示例列表页已经并进首页
  useEffect(() => { if (path === '/examples') navigate('/'); }, [path]);
  // 文档页实际滚动的是 AppShell 的主区，不是窗口
  useEffect(() => { window.scrollTo(0, 0); document.querySelector('.ok-shell__main')?.scrollTo(0, 0); }, [path]);
  let content;
  if (Body && route.kind === 'example') content = <ExampleFrame Body={Body} />;
  else if (Body && (route.kind === 'home' || route.kind === 'gallery')) content = <Body />;
  else content = <DocsShell path={path} Body={route.kind === 'doc' ? Body : undefined} />;
  return (
    <OinkProvider storageKey={STORAGE_KEY} locale={localeOf(lang)}>
      <ThemeSync />
      <FaviconSync />
      {/* 换语言时整页重新挂载：示例应用里的状态（按语言生成的数据）不会带着另一种语言留下来 */}
      <Fragment key={lang}>{content}</Fragment>
      <Toaster />
      <Confirmer />
    </OinkProvider>
  );
}
