import { useEffect, useId, useMemo, useState } from 'react';
import { Card, CardLink, EmptyState, Grid, Icon, SearchInput } from 'oink-ui';
import { SiteBrand, SiteControls, SiteLinks, useScrolled } from '../chrome';
import { GROUP_ORDER, groupLabel, pageSubtitle, pageTitle, pages } from '../registry';
import { useLang, useT } from '../i18n';
import type { Lang } from '../i18n';
import { href } from '../router';
import { PreviewFrame } from './loop';
import { FallbackPreview, PREVIEWS } from './previews';
import './gallery.css';

interface Item { path: string; slug: string; title: string; subtitle?: string; group: string; index: number }

/** 组件文档页：注册表里分组不是“开始”的页面，按侧栏的分组顺序排；不在 GROUP_ORDER 里的分组排在最后。
 *  标题、副标题取当前语言的（英文版只有英文名，中文版是中英双语） */
function useItems(lang: Lang) {
  return useMemo(() => {
    // Hooks 不是组件，不进总览
    const list = pages.filter((p) => p.group !== '开始' && p.path !== '/components/hooks');
    const groups = [...GROUP_ORDER.filter((g) => g !== '开始'), ...new Set(list.map((p) => p.group).filter((g) => !GROUP_ORDER.includes(g)))];
    let index = 0;
    return groups
      .map((group) => ({
        group,
        items: list.filter((p) => p.group === group).map((p): Item => ({
          path: p.path, slug: p.path.split('/').filter(Boolean).pop() ?? p.path, title: pageTitle(p, lang), subtitle: pageSubtitle(p, lang), group, index: index++,
        })),
      }))
      .filter((g) => g.items.length);
  }, [lang]);
}


const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

function GalleryCard({ item }: { item: Item }) {
  const id = useId();
  const Preview = PREVIEWS[item.slug];
  return (
    <li className="gal-item">
      {/* 卡片本身不是链接：预览里有（已 inert 的）按钮和输入框，不能嵌进 <a>。名称是覆盖链接，点击区域铺满整张卡 */}
      <Card className="gal-card">
        <PreviewFrame index={item.index}>{Preview ? <Preview /> : <FallbackPreview name={item.subtitle || item.title} />}</PreviewFrame>
        <span className="gal-card__name">
          <CardLink href={href(item.path)} id={`${id}-t`} className="gal-card__title">{item.title}</CardLink>
        </span>
      </Card>
    </li>
  );
}

export function Gallery() {
  const lang = useLang();
  const t = useT();
  const groups = useItems(lang);
  const scrolled = useScrolled();
  const [query, setQuery] = useState('');
  useEffect(() => { document.title = lang === 'en' ? 'Components · Oink UI' : '组件 · Oink UI'; }, [lang]);

  const q = norm(query);
  const shown = q
    ? groups.map((g) => ({ ...g, items: g.items.filter((it) => norm(`${it.title} ${it.subtitle ?? ''}`).includes(q)) })).filter((g) => g.items.length)
    : groups;
  const found = shown.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="gal">
      <header className="site-sticky gal-header" data-scrolled={scrolled || undefined}>
        <SiteBrand />
        <SiteLinks path="/components" />
        <SiteControls />
      </header>

      <main className="gal-main">
        <div className="gal-intro">
          <div className="gal-intro__text">
            <h1 className="gal-title">{t('组件', 'Components')}</h1>
          </div>
          <SearchInput
            className="gal-filter" aria-label={t('按名称筛选组件', 'Filter components by name')} placeholder={t('筛选组件', 'Filter components')} value={query} onChange={setQuery} clearable
          />
        </div>
        <p className="ok-sr" role="status">{q ? (found ? t(`找到 ${found} 个组件`, `${found} ${found === 1 ? 'component' : 'components'} found`) : t('没有找到组件', 'No components found')) : ''}</p>

        {shown.map((g) => {
          const hid = `gal-${g.group}`;
          return (
            <section key={g.group} className="gal-group" aria-labelledby={hid}>
              <h2 id={hid} className="gal-group__title">{groupLabel(g.group, lang)}<span className="gal-group__count"><span className="ok-sr">{t('，共 ', ', ')}</span>{g.items.length}<span className="ok-sr">{t(' 个', g.items.length === 1 ? ' component' : ' components')}</span></span></h2>
              <Grid as="ul" minItemWidth={248} gap={4} className="gal-grid">
                {g.items.map((it) => <GalleryCard key={it.path} item={it} />)}
              </Grid>
            </section>
          );
        })}

        {q && found === 0 && (
          <EmptyState
            className="gal-empty" icon={<Icon name="search" />} title={t('没有找到组件', 'No components found')}
            description={t(`没有名称里带“${query.trim()}”的组件，换个词试试。`, `Nothing matches “${query.trim()}”. Try another word.`)}
          />
        )}
      </main>
    </div>
  );
}
