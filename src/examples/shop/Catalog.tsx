import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AspectRatio, Button, Card, Chip, ChipGroup, ColorSwatches, Count, Divider, EmptyState, FloatingBody, FloatingFooter, FloatingHeader,
  Grid, Heading, Icon, Inline, RangeSlider, Rating, Select, Sheet, Stack, Sticky, Switch, Text, VisuallyHidden, useBreakpoint,
} from 'oink-ui';
import type { RangeValue } from 'oink-ui';
import { useT } from '../../i18n';
import { ProductArt } from './art';
import { COLOR_IDS, PRICE_MAX, plural, useShop } from './data';
import type { CategoryId, ColorId, Product } from './data';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

export type SortId = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'reviews';
export interface Filters {
  category: CategoryId | 'all';
  query: string;
  price: RangeValue;
  color: ColorId | null;
  minRating: number;
  inStock: boolean;
  sort: SortId;
}
export const DEFAULT_FILTERS: Filters = { category: 'all', query: '', price: [0, PRICE_MAX], color: null, minRating: 0, inStock: false, sort: 'featured' };

const SORTS: Record<'zh' | 'en', Array<{ value: SortId; label: string }>> = {
  zh: [
    { value: 'featured', label: '综合推荐' },
    { value: 'price-asc', label: '价格从低到高' },
    { value: 'price-desc', label: '价格从高到低' },
    { value: 'rating', label: '评分最高' },
    { value: 'reviews', label: '评价最多' },
  ],
  en: [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: low to high' },
    { value: 'price-desc', label: 'Price: high to low' },
    { value: 'rating', label: 'Top rated' },
    { value: 'reviews', label: 'Most reviewed' },
  ],
};
const PAGE = 8;

function applyFilters(PRODUCTS: Product[], f: Filters): Product[] {
  const q = f.query.trim().toLowerCase();
  const list = PRODUCTS.filter((p) =>
    (f.category === 'all' || p.category === f.category)
    && (!q || p.name.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q))
    && p.price >= f.price[0] && (f.price[1] >= PRICE_MAX || p.price <= f.price[1])
    && (!f.color || p.colors.includes(f.color))
    && p.rating >= f.minRating
    && (!f.inStock || p.stock > 0));
  const by: Record<SortId, (a: Product, b: Product) => number> = {
    featured: () => 0,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    reviews: (a, b) => b.reviews - a.reviews,
  };
  return f.sort === 'featured' ? list : [...list].sort(by[f.sort]);
}

/** 生效的筛选条数（不含分类、搜索、排序） */
const activeCount = (f: Filters) =>
  Number(f.price[0] > 0 || f.price[1] < PRICE_MAX) + Number(f.color !== null) + Number(f.minRating > 0) + Number(f.inStock);

interface FilterFormProps { filters: Filters; onChange: (patch: Partial<Filters>) => void; idPrefix: string }

/** 筛选项：宽屏的停靠卡片和窄屏的底部弹层用的是同一份 */
function FilterForm({ filters, onChange, idPrefix }: FilterFormProps) {
  const t = useT();
  const { COLORS, money } = useShop();
  const swatches = COLOR_IDS.map((c) => ({ value: c, color: COLORS[c].color, label: COLORS[c].label }));
  const id = (s: string) => `${idPrefix}-${s}`;
  const starsUp = (n: number) => t(`${n} 星及以上`, `${plural(n, 'star')} & up`);
  return (
    <Stack gap={5}>
      <Stack gap={2}>
        <Inline justify="between" wrap={false}>
          <Text variant="label" id={id('price')}>{t('价格', 'Price')}</Text>
          <Text variant="caption" tone="subtle">{money(filters.price[0])} – {filters.price[1] >= PRICE_MAX ? `${money(PRICE_MAX)}+` : money(filters.price[1])}</Text>
        </Inline>
        {/* 包一层：Slider 自带 flex: 1，直接放进纵向 Stack 会被压成 0 高 */}
        <div className="shop-range">
          <RangeSlider
            aria-labelledby={id('price')} min={0} max={PRICE_MAX} step={10} minDistance={20}
            value={filters.price} onChange={(price) => onChange({ price })}
            format={(v) => money(v)} thumbLabels={[t('最低价', 'Minimum price'), t('最高价', 'Maximum price')]}
          />
        </div>
      </Stack>
      <Stack gap={2}>
        <Inline justify="between" wrap={false} className="shop-filter__row">
          <Text variant="label" id={id('color')}>{t('颜色', 'Color')}</Text>
          {filters.color
            ? <Button size="sm" variant="ghost" onClick={() => onChange({ color: null })}>{COLORS[filters.color].label} · {t('清除', 'Clear')}</Button>
            : <Text variant="caption" tone="subtle">{t('不限', 'Any')}</Text>}
        </Inline>
        <ColorSwatches className="shop-swatches" aria-labelledby={id('color')} colors={swatches} value={filters.color} onChange={(v) => onChange({ color: v as ColorId })} />
      </Stack>
      <Stack gap={2}>
        <Inline justify="between" wrap={false}>
          <Text variant="label" id={id('rating')}>{t('最低评分', 'Minimum rating')}</Text>
          <Text variant="caption" tone="subtle">{filters.minRating ? starsUp(filters.minRating) : t('不限', 'Any')}</Text>
        </Inline>
        <Rating size="lg" className="shop-rate" aria-labelledby={id('rating')} value={filters.minRating} onChange={(minRating) => onChange({ minRating })} starLabel={starsUp} />
      </Stack>
      <Switch rootClassName="shop-filter__switch" checked={filters.inStock} onChange={(inStock) => onChange({ inStock })}>{t('只看有货', 'In stock only')}</Switch>
      <Stack gap={2}>
        <Text variant="label" id={id('sort')}>{t('排序', 'Sort by')}</Text>
        <Select aria-labelledby={id('sort')} options={t(SORTS.zh, SORTS.en)} value={filters.sort} onChange={(v) => onChange({ sort: v as SortId })} />
      </Stack>
    </Stack>
  );
}

export interface CatalogProps {
  filters: Filters;
  onFilters: (patch: Partial<Filters>) => void;
  onReset: () => void;
  favorites: ReadonlySet<string>;
  onFavorite: (id: string, on: boolean) => void;
  onOpen: (id: string) => void;
}

export function Catalog({ filters, onFilters, onReset, favorites, onFavorite, onOpen }: CatalogProps) {
  const t = useT();
  const { CATEGORIES, PRODUCTS } = useShop();
  const docked = useBreakpoint('lg');
  const [sheet, setSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const results = useMemo(() => applyFilters(PRODUCTS, filters), [PRODUCTS, filters]);
  const active = activeCount(filters);

  // 换分类 / 排序时装作去请求一次：骨架屏顶一下
  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 520);
    return () => window.clearTimeout(timer);
  }, [filters.category, filters.sort]);
  useEffect(() => { setShown(PAGE); }, [filters]);
  useEffect(() => { if (docked) setSheet(false); }, [docked]);

  const moreTimer = useRef<number>();
  useEffect(() => () => window.clearTimeout(moreTimer.current), []);
  const loadMore = () => {
    setMore(true);
    moreTimer.current = window.setTimeout(() => { setMore(false); setShown((n) => n + PAGE); }, 480);
  };

  const visible = results.slice(0, shown);
  const title = filters.category === 'all' ? t('全部商品', 'All products') : CATEGORIES.find((c) => c.id === filters.category)?.label;

  return (
    <Stack gap={{ base: 5, md: 6 }}>
      <section className="shop-hero" aria-labelledby="shop-hero-title">
        <Stack gap={2} className="shop-hero__text">
          <Text variant="caption" tone="subtle">{t('开学季 · 全场满 ¥99 包邮', 'Back to school · Free shipping on orders over $99')}</Text>
          <Heading level={1} variant="h1" id="shop-hero-title">{t('把桌面收拾成喜欢的样子', 'Make your desk a place you love')}</Heading>
          <Text tone="subtle">{t('栖木文具挑的都是能用很久的东西：好写的笔、不洇的纸、安静的灯。', 'Perch Stationery picks things that last: pens that write smoothly, paper that doesn’t bleed, light that stays easy on the eyes.')}</Text>
        </Stack>
        <div className="shop-hero__art" aria-hidden="true">
          <AspectRatio ratio={1}><ProductArt kind="lamp" color="amber" /></AspectRatio>
          <AspectRatio ratio={1}><ProductArt kind="notebook" color="blue" view={2} /></AspectRatio>
          <AspectRatio ratio={1}><ProductArt kind="cup" color="green" /></AspectRatio>
        </div>
      </section>

      <nav aria-label={t('商品分类', 'Product categories')} className="shop-cats ok-scroll">
        <ChipGroup
          multiple={false} aria-label={t('按分类筛选', 'Filter by category')} value={[filters.category]}
          onChange={(v) => { if (v[0]) onFilters({ category: v[0] as Filters['category'] }); }}
        >
          <Chip value="all">{t('全部', 'All')}</Chip>
          {CATEGORIES.map((c) => <Chip key={c.id} value={c.id}>{c.label}</Chip>)}
        </ChipGroup>
      </nav>

      <div className="shop-browse">
        {docked && (
          <Sticky as="aside" style={{ top: 'calc(var(--shop-top-h) + var(--ok-s-4))' }} className="shop-browse__side ok-scroll" aria-labelledby="shop-filter-title">
            <Card size="sm">
              <Stack gap={4}>
                <Inline justify="between" wrap={false}>
                  <Heading level={2} variant="h4" id="shop-filter-title">{t('筛选', 'Filters')}</Heading>
                  <Button size="sm" variant="ghost" disabled={active === 0 && filters.sort === 'featured' && !filters.query} onClick={onReset}>{t('重置', 'Reset')}</Button>
                </Inline>
                <Divider decorative />
                <FilterForm filters={filters} onChange={onFilters} idPrefix="shop-fd" />
              </Stack>
            </Card>
          </Sticky>
        )}

        <section aria-labelledby="shop-list-title" className="shop-browse__main">
          <Stack gap={4}>
            <Inline justify="between" wrap={false} gap={3}>
              <Stack gap={1}>
                <Heading level={2} variant="h3" id="shop-list-title">{title}</Heading>
                <Text variant="caption" tone="subtle" role="status">
                  {loading ? t('正在加载…', 'Loading…') : t(
                    `共 ${results.length} 件${filters.query.trim() ? `，搜索“${filters.query.trim()}”` : ''}`,
                    `${plural(results.length, 'item')}${filters.query.trim() ? ` matching “${filters.query.trim()}”` : ''}`,
                  )}
                </Text>
              </Stack>
              {!docked && (
                <Button leading={<Icon name="sliders" />} onClick={() => setSheet(true)} aria-haspopup="dialog">
                  {t('筛选', 'Filters')}{active > 0 && <Count value={active} tone="neutral" label={t(`已启用 ${active} 项`, `${active} active`)} className="shop-btn-count" />}
                </Button>
              )}
            </Inline>

            {loading ? (
              <Grid minItemWidth="var(--shop-card-min)" gap={{ base: 3, md: 4 }} aria-busy="true">
                <VisuallyHidden>{t('正在加载商品', 'Loading products')}</VisuallyHidden>
                {Array.from({ length: PAGE }, (_, i) => <ProductCardSkeleton key={i} />)}
              </Grid>
            ) : results.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<Icon name="search" />}
                  title={t('没有找到符合条件的商品', 'No products match')}
                  titleAs="h3"
                  description={t('换个关键词，或者放宽价格和颜色试试。', 'Try a different keyword, or widen the price and color filters.')}
                  actions={<Button onClick={onReset}>{t('清除全部条件', 'Clear all filters')}</Button>}
                />
              </Card>
            ) : (
              <>
                <Grid as="ul" minItemWidth="var(--shop-card-min)" gap={{ base: 3, md: 4 }} className="shop-grid">
                  {visible.map((p) => (
                    <li key={p.id}>
                      <ProductCard product={p} favorite={favorites.has(p.id)} onFavorite={onFavorite} onOpen={onOpen} />
                    </li>
                  ))}
                </Grid>
                <Stack gap={3} align="center">
                  <Text variant="caption" tone="subtle" role="status">{t(`已显示 ${visible.length} / ${results.length} 件`, `Showing ${visible.length} of ${results.length}`)}</Text>
                  {visible.length < results.length && <Button size="lg" loading={more} onClick={loadMore}>{t('加载更多', 'Load more')}</Button>}
                </Stack>
              </>
            )}
          </Stack>
        </section>
      </div>

      <Sheet open={sheet && !docked} onOpenChange={setSheet} size="lg">
        <FloatingHeader title={t('筛选', 'Filters')} description={t(`符合条件的商品共 ${results.length} 件`, `${plural(results.length, 'matching product')}`)} />
        <FloatingBody className="ok-scroll">
          <FilterForm filters={filters} onChange={onFilters} idPrefix="shop-fs" />
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button size="lg" onClick={onReset}>{t('重置', 'Reset')}</Button>
          <Button size="lg" variant="primary" onClick={() => setSheet(false)}>{t(`查看 ${results.length} 件`, `Show ${plural(results.length, 'item')}`)}</Button>
        </FloatingFooter>
      </Sheet>
    </Stack>
  );
}
