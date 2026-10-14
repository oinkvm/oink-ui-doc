import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button, Container, Count, Hide, Icon, Inline, SearchInput, Show, Sticky, TabBar, TabBarItem, VisuallyHidden, toast, useBreakpoint,
} from 'oink-ui';
import { useT } from '../../i18n';
import type { ExampleMeta } from '../../registry';
import { Account, Categories } from './Account';
import { BrandMark, CartIcon, GridIcon, HeartIcon, HomeIcon, UserIcon } from './art';
import { Cart } from './Cart';
import { Catalog, DEFAULT_FILTERS } from './Catalog';
import type { Filters } from './Catalog';
import { Checkout, OrderDone } from './Checkout';
import { lineKey, plural, useShop } from './data';
import type { CartLine, Order, ShippingId } from './data';
import { Detail } from './Detail';
import './shop.css';

export const meta: ExampleMeta = {
  slug: 'shop',
  title: '栖木文具',
  domain: '电商零售',
  description: '移动优先的店铺前台：商品列表与筛选、商品详情、购物车抽屉、三步结算。',
  en: {
    title: 'Perch Stationery',
    domain: 'E-commerce',
    description: 'A mobile-first storefront: product listing with filters, product details, a cart drawer and a three-step checkout.',
  },
  order: 4,
};

type View =
  | { name: 'home' }
  | { name: 'categories' }
  | { name: 'me' }
  | { name: 'detail'; id: string }
  | { name: 'checkout' }
  | { name: 'done'; order: Order };

export default function Shop() {
  const t = useT();
  const { computeTotals, productById } = useShop();
  const wide = useBreakpoint('md');
  const [view, setView] = useState<View>({ name: 'home' });
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(() => new Set(['p03']));
  const [coupon, setCoupon] = useState<string | null>(null);
  const [shipping, setShipping] = useState<ShippingId>('standard');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [announce, setAnnounce] = useState('');
  const mainRef = useRef<HTMLElement>(null);

  // 窄屏强制触屏高度（44px 点按区）。浮层渲染在 body 下，所以标在根元素上；离开时还原
  useEffect(() => {
    const root = document.documentElement;
    if (wide || root.hasAttribute('data-touch')) return;
    root.setAttribute('data-touch', '');
    return () => root.removeAttribute('data-touch');
  }, [wide]);

  const go = useCallback((next: View) => {
    setView(next);
    setSearchOpen(false);
    window.scrollTo(0, 0);
  }, []);
  const goHome = useCallback(() => go({ name: 'home' }), [go]);
  const openProduct = useCallback((id: string) => go({ name: 'detail', id }), [go]);

  const patchFilters = useCallback((patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch })), []);
  const resetFilters = useCallback(() => setFilters((f) => ({ ...DEFAULT_FILTERS, category: f.category })), []);

  const toggleFavorite = useCallback((id: string, on: boolean) => {
    setFavorites((prev) => { const next = new Set(prev); if (on) next.add(id); else next.delete(id); return next; });
  }, []);

  const totals = useMemo(() => computeTotals(lines, coupon, view.name === 'checkout' ? shipping : 'standard'), [computeTotals, lines, coupon, shipping, view.name]);

  // 购物车数量变化：给读屏播报一次（首屏不播）
  const lastCount = useRef(totals.count);
  useEffect(() => {
    if (lastCount.current === totals.count) return;
    lastCount.current = totals.count;
    setAnnounce(totals.count === 0 ? t('购物车已清空', 'Your cart is empty') : t(`购物车现在有 ${totals.count} 件商品`, `Your cart now has ${plural(totals.count, 'item')}`));
  }, [t, totals.count]);

  const addLine = useCallback((input: Omit<CartLine, 'key'>) => {
    const key = lineKey(input);
    const max = Math.min(productById(input.productId)?.stock ?? 99, 99);
    setLines((prev) => (prev.some((l) => l.key === key)
      ? prev.map((l) => (l.key === key ? { ...l, qty: Math.min(max, l.qty + input.qty) } : l))
      : [...prev, { ...input, key }]));
  }, [productById]);
  const setQty = useCallback((key: string, qty: number) => setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty } : l))), []);
  const linesRef = useRef(lines);
  linesRef.current = lines;
  const removeLine = useCallback((key: string) => {
    const index = linesRef.current.findIndex((l) => l.key === key);
    if (index < 0) return;
    const removed = linesRef.current[index];
    setLines((prev) => prev.filter((l) => l.key !== key));
    toast({
      title: t('已从购物车移除', 'Removed from cart'),
      description: productById(removed.productId)?.name,
      action: {
        label: t('撤销', 'Undo'),
        onClick: () => setLines((cur) => (cur.some((l) => l.key === removed.key) ? cur : [...cur.slice(0, index), removed, ...cur.slice(index)])),
      },
    });
  }, [t, productById]);

  const checkout = () => { setCartOpen(false); go({ name: 'checkout' }); };
  const placeOrder = (order: Order) => {
    setLastOrder(order);
    setLines([]);
    setCoupon(null);
    setShipping('standard');
    go({ name: 'done', order });
  };

  const onSearch = (query: string) => {
    patchFilters({ query });
    if (view.name !== 'home') go({ name: 'home' });
  };

  const product = view.name === 'detail' ? productById(view.id) : undefined;
  const tab = view.name === 'categories' || view.name === 'me' ? view.name : 'home';
  const pushed = view.name === 'detail' || view.name === 'checkout' || view.name === 'done';
  const showTabBar = !wide && !pushed;
  const search = (id: string, autoFocus?: boolean) => (
    <SearchInput
      id={id} pill clearable aria-label={t('搜索商品', 'Search products')} placeholder={t('搜索笔、本子、台灯…', 'Search pens, notebooks, lamps…')} autoFocus={autoFocus}
      value={filters.query} onChange={onSearch} onSearch={() => { setSearchOpen(false); mainRef.current?.focus(); }}
    />
  );

  return (
    <div className="shop" data-dock={showTabBar ? 'tabs' : !wide && view.name === 'detail' ? 'buy' : undefined}>
      <a href="#shop-main" className="shop-skip ok-btn ok-btn--sm ok-focusable" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>{t('跳到主要内容', 'Skip to main content')}</a>

      <Sticky as="header" className="shop-top">
        <Container size="xl">
          <Inline wrap={false} justify="between" gap={3} className="shop-top__row">
            <button type="button" className="shop-brand ok-focusable" onClick={goHome} aria-label={t('栖木文具，回到首页', 'Perch Stationery, home')}>
              <BrandMark />
              <span className="shop-brand__name">{t('栖木文具', 'Perch Stationery')}</span>
            </button>
            {wide && <div className="shop-top__search" role="search">{search('shop-search')}</div>}
            <Inline gap={2} wrap={false}>
              <Show below="md">
                <Button iconOnly variant="ghost" aria-label={t('搜索商品', 'Search products')} aria-expanded={searchOpen} aria-controls="shop-search-row" onClick={() => setSearchOpen((v) => !v)}>
                  <Icon name={searchOpen ? 'x' : 'search'} />
                </Button>
              </Show>
              <Hide below="md">
                <Button variant="ghost" leading={<HeartIcon />} aria-current={view.name === 'me' ? 'page' : undefined} onClick={() => go({ name: 'me' })}>
                  {t('收藏', 'Favorites')}<Count value={favorites.size} tone="neutral" label={t(`${favorites.size} 件收藏`, plural(favorites.size, 'favorite'))} className="shop-btn-count" />
                </Button>
              </Hide>
              {wide ? (
                <Button leading={<CartIcon />} aria-haspopup="dialog" aria-label={t(`购物车，${totals.count} 件商品`, `Cart, ${plural(totals.count, 'item')}`)} onClick={() => setCartOpen(true)}>
                  {t('购物车', 'Cart')}<Count value={totals.count} aria-hidden="true" className="shop-btn-count" />
                </Button>
              ) : (
                <Button variant="ghost" iconOnly aria-haspopup="dialog" aria-label={t(`购物车，${totals.count} 件商品`, `Cart, ${plural(totals.count, 'item')}`)} onClick={() => setCartOpen(true)} className="shop-cartbtn">
                  <CartIcon />
                  <Count value={totals.count} aria-hidden="true" className="shop-dot" />
                </Button>
              )}
            </Inline>
          </Inline>
          {!wide && searchOpen && <div id="shop-search-row" role="search" className="shop-top__mobile-search">{search('shop-search-m', true)}</div>}
        </Container>
      </Sticky>

      <Container as="main" size="xl" id="shop-main" ref={mainRef} tabIndex={-1} className="shop-main">
        {view.name === 'home' && (
          <Catalog filters={filters} onFilters={patchFilters} onReset={resetFilters} favorites={favorites} onFavorite={toggleFavorite} onOpen={openProduct} />
        )}
        {view.name === 'categories' && <Categories onPick={(category) => { patchFilters({ category }); goHome(); }} />}
        {view.name === 'me' && <Account favorites={favorites} onFavorite={toggleFavorite} onOpen={openProduct} onHome={goHome} lastOrder={lastOrder} />}
        {product && (
          <Detail
            key={product.id} product={product} cartCount={totals.count} favorites={favorites} onFavorite={toggleFavorite} onOpen={openProduct}
            onHome={goHome} onCategory={(category) => { patchFilters({ category }); goHome(); }} onAdd={addLine} onOpenCart={() => setCartOpen(true)}
          />
        )}
        {view.name === 'checkout' && (
          <Checkout lines={lines} coupon={coupon} totals={totals} shipping={shipping} onShipping={setShipping} onBack={goHome} onPlace={placeOrder} />
        )}
        {view.name === 'done' && <Container size="md" gutter={false}><OrderDone order={view.order} onHome={goHome} /></Container>}
      </Container>

      {showTabBar && (
        <TabBar
          aria-label={t('主导航', 'Main navigation')} className="shop-dock" value={tab}
          onChange={(v) => { if (v === 'home') goHome(); else if (v === 'categories' || v === 'me') go({ name: v }); }}
        >
          <TabBarItem value="home" icon={<HomeIcon />}>{t('首页', 'Home')}</TabBarItem>
          <TabBarItem value="categories" icon={<GridIcon />}>{t('分类', 'Categories')}</TabBarItem>
          <TabBarItem
            value="cart" icon={<CartIcon />} aria-haspopup="dialog" badge={<Count value={totals.count} label={t(`${totals.count} 件商品`, plural(totals.count, 'item'))} />}
            onClick={(e) => { e.preventDefault(); setCartOpen(true); }}
          >
            {t('购物车', 'Cart')}
          </TabBarItem>
          <TabBarItem value="me" icon={<UserIcon />}>{t('我的', 'Account')}</TabBarItem>
        </TabBar>
      )}

      <Cart
        open={cartOpen} onOpenChange={setCartOpen} lines={lines} totals={totals} coupon={coupon} onCoupon={setCoupon}
        onQty={setQty} onRemove={removeLine} onCheckout={checkout} onBrowse={() => { setCartOpen(false); goHome(); }}
      />

      <VisuallyHidden role="status" aria-live="polite">{announce}</VisuallyHidden>
    </div>
  );
}
