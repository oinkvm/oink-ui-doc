import { useEffect, useState } from 'react';
import { Button, Icon, Segmented, VisuallyHidden } from 'oink-ui';
import { SiteBrand, SiteControls, SiteLinks, useScrolled } from '../chrome';
import { examples } from '../registry';
import { href } from '../router';
import { useLang, useT } from '../i18n';
import { Showcase } from './Showcase';
import './home.css';

/** 首页的分段标签：第一个是组件小样，其余四个嵌入整页示例应用 */
const TABS: Array<{ value: string; label: { zh: string; en: string }; slug?: string }> = [
  { value: 'components', label: { zh: '组件', en: 'Components' } },
  { value: 'tracker', label: { zh: '项目协作', en: 'Projects' }, slug: 'tracker' },
  { value: 'analytics', label: { zh: '数据分析', en: 'Analytics' }, slug: 'analytics' },
  { value: 'mail', label: { zh: '邮箱', en: 'Mail' }, slug: 'mail' },
  { value: 'shop', label: { zh: '电商', en: 'Shop' }, slug: 'shop' },
];

const PANEL_ID = 'home-panel';

function ExampleEmbed({ slug }: { slug: string }) {
  const t = useT();
  const ex = examples.find((e) => e.slug === slug);
  const title = ex ? t(ex.title, ex.en?.title ?? ex.title) : slug;
  // ?embed：示例页隐藏左下角的返回按钮（见 index.html 里的脚本）
  const src = `${href('/examples/' + slug)}?embed=1`;
  return (
    <div className="home-embed">
      <div className="home-embed__bar">
        <span className="home-embed__title">{title}</span>
        <Button size="sm" variant="ghost" href={href('/examples/' + slug)} target="_blank" trailing={<Icon name="external" />}>
          {t('在新窗口打开', 'Open in new window')}<VisuallyHidden>{t('：', ': ')}{title}</VisuallyHidden>
        </Button>
      </div>
      <iframe key={slug} className="home-embed__frame" title={t(`示例应用：${title}`, `Example app: ${title}`)} src={src} />
    </div>
  );
}

export function Home() {
  const [tab, setTab] = useState('components');
  const scrolled = useScrolled();
  const lang = useLang();
  const t = useT();
  useEffect(() => { document.title = lang === 'en' ? 'Oink UI · React component library' : 'Oink UI · React 组件库'; }, [lang]);

  const current = TABS.find((x) => x.value === tab) ?? TABS[0];
  const label = (x: (typeof TABS)[number]) => t(x.label.zh, x.label.en);

  return (
    <div className="home">
      <header className="site-sticky home-header" data-scrolled={scrolled || undefined}>
        <SiteBrand />
        <SiteLinks path="/" />
        <SiteControls />
      </header>

      <main className="home-main">
        <h1 className="ok-sr">{t('Oink UI 组件库', 'Oink UI component library')}</h1>
        <div className="home-bar">
          <Segmented
            className="home-tabs"
            aria-label={t('展示内容', 'Showcase')}
            options={TABS.map((x) => ({ value: x.value, label: label(x) }))}
            value={tab}
            onChange={setTab}
          />
        </div>

        <div
          id={PANEL_ID} role="region" aria-label={label(current)} tabIndex={current.slug ? undefined : -1}
          className="home-panel" data-kind={current.slug ? 'embed' : 'components'}
        >
          {current.slug ? <ExampleEmbed slug={current.slug} /> : <Showcase />}
        </div>

        <nav className="home-links" aria-label={t('继续阅读', 'Keep reading')}>
          <Button variant="primary" href={href('/components')} trailing={<Icon name="chevron-right" />}>{t('浏览组件', 'Browse components')}</Button>
          <Button href={href('/guide/getting-started')}>{t('阅读文档', 'Read the docs')}</Button>
        </nav>
      </main>
    </div>
  );
}
