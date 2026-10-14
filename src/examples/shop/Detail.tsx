import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  Accordion, AspectRatio, Avatar, Badge, Breadcrumb, Button, ColorSwatches, Count, DescriptionList, Divider, Grid, Heading, Inline,
  NumberInput, OptionCard, OptionCardGroup, Section, Segmented, Stack, Tabs, Text, VisuallyHidden, toast, useBreakpoint,
} from 'oink-ui';
import { useT } from '../../i18n';
import { CartIcon, ProductArt } from './art';
import { useShop } from './data';
import type { CartLine, ColorId, PackId, Product } from './data';
import { Price, ProductCard, Stars, TAG_TONE } from './ProductCard';

/** 图集的三个取景：名称，以及读屏用的图片说明 */
const VIEW_NAMES = {
  zh: [['整体', '整体图'], ['细节特写', '细节特写图'], ['斜放', '斜放图']],
  en: [['Full view', 'full view'], ['Close-up', 'close-up'], ['Angled', 'angled view']],
} as const;

/** 图集：大图 + 缩略图。缩略图是一组单选按钮，← → / Home / End 切换 */
function Gallery({ product, color }: { product: Product; color: ColorId }) {
  const t = useT();
  const { COLORS } = useShop();
  const names = t<ReadonlyArray<readonly [string, string]>>(VIEW_NAMES.zh, VIEW_NAMES.en);
  const [view, setView] = useState<0 | 1 | 2>(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (view + 1) % 3
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (view + 2) % 3
      : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : null;
    if (next === null) return;
    e.preventDefault();
    setView(next as 0 | 1 | 2);
    refs.current[next]?.focus();
  };
  return (
    <Stack gap={3} className="shop-gallery">
      <AspectRatio ratio={1} className="shop-gallery__main">
        <ProductArt kind={product.art} color={color} view={view} label={t(`${product.name}，${COLORS[color].label}，${names[view][1]}`, `${product.name}, ${COLORS[color].label}, ${names[view][1]}`)} />
      </AspectRatio>
      <div role="radiogroup" aria-label={t('切换商品图片', 'Product images')} className="shop-gallery__thumbs" onKeyDown={onKeyDown}>
        {names.map(([name, imageLabel], i) => (
          <button
            key={name} ref={(n) => { refs.current[i] = n; }} type="button" role="radio" className="shop-thumb ok-focusable"
            aria-checked={view === i} aria-label={t(imageLabel, name)} tabIndex={view === i ? 0 : -1} onClick={() => setView(i as 0 | 1 | 2)}
          >
            <ProductArt kind={product.art} color={color} view={i as 0 | 1 | 2} />
          </button>
        ))}
      </div>
    </Stack>
  );
}

export interface DetailProps {
  product: Product;
  cartCount: number;
  favorites: ReadonlySet<string>;
  onFavorite: (id: string, on: boolean) => void;
  onOpen: (id: string) => void;
  onHome: () => void;
  onCategory: (id: Product['category']) => void;
  onAdd: (line: Omit<CartLine, 'key'>) => void;
  onOpenCart: () => void;
}

export function Detail({ product, cartCount, favorites, onFavorite, onOpen, onHome, onCategory, onAdd, onOpenCart }: DetailProps) {
  const t = useT();
  const { COLORS, FAQ, PACKS, PRODUCTS, REVIEWS, categoryLabel, money, packById, stockText, tagLabel } = useShop();
  const wide = useBreakpoint('md');
  const [color, setColor] = useState<ColorId>(product.colors[0]);
  const [option, setOption] = useState(product.options?.[0]);
  const [pack, setPack] = useState<PackId>('single');
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const soldOut = product.stock === 0;
  const stock = stockText(product.stock);
  const unit = product.price + packById(pack).extra;
  const fav = favorites.has(product.id);

  const add = () => {
    if (soldOut || state !== 'idle') return;
    setState('loading');
    timers.current.push(window.setTimeout(() => {
      onAdd({ productId: product.id, color, option, pack, qty });
      setState('success');
      toast.success({
        title: t('已加入购物车', 'Added to cart'),
        description: `${product.name} × ${qty}`,
        action: { label: t('去购物车', 'View cart'), onClick: onOpenCart },
      });
      timers.current.push(window.setTimeout(() => setState('idle'), 1400));
    }, 650));
  };

  const addButton = (
    <Button variant="accent" size="lg" block loading={state === 'loading'} success={state === 'success'} disabled={soldOut} onClick={add}>
      {soldOut ? t('已售罄', 'Sold out') : `${t('加入购物车', 'Add to cart')} · ${money(unit * qty)}`}
    </Button>
  );
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Stack gap={{ base: 6, md: 8 }}>
      <Breadcrumb
        label={t('当前位置', 'Breadcrumb')}
        items={[
          { label: t('首页', 'Home'), onClick: onHome },
          { label: categoryLabel(product.category), onClick: () => onCategory(product.category) },
          { label: product.name },
        ]}
      />

      <Grid columns={{ base: 1, md: 2 }} gap={{ base: 5, md: 8, lg: 12 }} align="start">
        <Gallery product={product} color={color} />

        <Stack gap={5}>
          <Stack gap={3}>
            <Inline gap={2}>
              {product.tag && <Badge tone={TAG_TONE[product.tag]}>{tagLabel[product.tag]}</Badge>}
              <Text variant="caption" tone="subtle">{categoryLabel(product.category)}</Text>
            </Inline>
            <Heading level={1} variant="h1">{product.name}</Heading>
            <Inline gap={2}>
              <Stars value={product.rating} size="md" />
              <Text variant="label"><VisuallyHidden>{t('评分 ', 'Rated ')}</VisuallyHidden>{product.rating.toFixed(1)}<VisuallyHidden>{t(' 分，共 5 分', ' out of 5')}</VisuallyHidden></Text>
              <Text variant="caption" tone="subtle">{t(`${product.reviews} 条评价`, `${product.reviews.toLocaleString('en-US')} reviews`)}</Text>
            </Inline>
            <Inline gap={3} align="baseline">
              <Price product={product} size="lg" />
              <Text variant="label" tone={stock.tone}>{stock.text}</Text>
            </Inline>
            <Text tone="subtle" as="p">{product.summary}</Text>
          </Stack>

          <Divider decorative />

          <Stack gap={2}>
            <Inline gap={2}>
              <Text variant="label" id="shop-d-color">{t('颜色', 'Color')}</Text>
              <Text variant="caption" tone="subtle" aria-live="polite">{COLORS[color].label}</Text>
            </Inline>
            <ColorSwatches
              className="shop-swatches" aria-labelledby="shop-d-color" size="lg" value={color} onChange={(v) => setColor(v as ColorId)}
              colors={product.colors.map((c) => ({ value: c, color: COLORS[c].color, label: COLORS[c].label }))}
            />
          </Stack>

          {product.options && (
            <Stack gap={2}>
              <Text variant="label" id="shop-d-option">{product.optionLabel}</Text>
              <Segmented
                aria-labelledby="shop-d-option" value={option} onChange={setOption} className="shop-detail__seg"
                options={product.options.map((o) => ({ value: o, label: o }))}
              />
            </Stack>
          )}

          <Stack gap={2}>
            <Text variant="label" id="shop-d-pack">{t('包装', 'Packaging')}</Text>
            <OptionCardGroup aria-labelledby="shop-d-pack" value={pack} onChange={(v) => setPack(v as PackId)} minItemWidth={96}>
              {PACKS.map((p) => <OptionCard key={p.id} value={p.id} description={p.description}>{p.label}</OptionCard>)}
            </OptionCardGroup>
          </Stack>

          <Inline gap={4} justify="between" wrap={false}>
            <label className="ok-t-label" htmlFor="shop-d-qty">{t('数量', 'Quantity')}</label>
            <NumberInput
              id="shop-d-qty" value={qty} onChange={setQty} min={1} max={Math.max(1, Math.min(product.stock, 99))} disabled={soldOut}
              decrementLabel={t('减少数量', 'Decrease quantity')} incrementLabel={t('增加数量', 'Increase quantity')} rootClassName="shop-qty"
            />
          </Inline>

          {wide && (
            <Inline gap={3} wrap={false}>
              <div className="shop-detail__add">{addButton}</div>
              <Button size="lg" variant={fav ? 'soft' : 'outline'} aria-pressed={fav} onClick={() => onFavorite(product.id, !fav)}>{fav ? t('已收藏', 'Saved') : t('收藏', 'Save')}</Button>
            </Inline>
          )}
          {!wide && (
            <Button size="lg" block variant={fav ? 'soft' : 'outline'} aria-pressed={fav} onClick={() => onFavorite(product.id, !fav)}>{fav ? t('已收藏', 'Saved') : t('加入收藏', 'Add to favorites')}</Button>
          )}
        </Stack>
      </Grid>

      <Tabs
        label={t('商品详情', 'Product details')} unmountInactive
        items={[
          {
            value: 'desc', label: t('描述', 'Description'),
            content: (
              <Stack gap={3} className="shop-prose">
                <Text as="p">{product.summary}</Text>
                <Text as="p" tone="subtle">
                  {t(
                    '我们只卖自己桌上也在用的东西。每一批到货都会抽检，包装尽量不用塑料；如果收到的东西有瑕疵，拍张照片给我们，直接补发，不用寄回。',
                    'We only sell things we use at our own desks. Every shipment gets spot-checked, and we keep plastic out of the packaging wherever we can. If something arrives damaged, send us a photo and we’ll ship a replacement; no need to send it back.',
                  )}
                </Text>
              </Stack>
            ),
          },
          { value: 'specs', label: t('参数', 'Specs'), content: <DescriptionList divided items={product.specs.map(([term, description]) => ({ term, description }))} /> },
          {
            value: 'reviews', label: t(`评价（${product.reviews}）`, `Reviews (${product.reviews.toLocaleString('en-US')})`),
            content: (
              <Stack gap={4} className="shop-reviews" divider>
                {REVIEWS.map((r) => (
                  <article key={r.name} aria-label={t(`${r.name} 的评价`, `Review by ${r.name}`)}>
                    <Inline gap={3} align="start" wrap={false}>
                      <Avatar name={r.name} color="auto" />
                      <Stack gap={1}>
                        <Inline gap={2}>
                          <Text variant="label">{r.name}</Text>
                          <Stars value={r.rating} />
                          <Text variant="caption" tone="subtle"><VisuallyHidden>{t(`打了 ${r.rating} 星，`, `Rated ${r.rating} stars, `)}</VisuallyHidden>{r.date}</Text>
                        </Inline>
                        <Text as="p" tone="subtle">{r.text}</Text>
                      </Stack>
                    </Inline>
                  </article>
                ))}
              </Stack>
            ),
          },
        ]}
      />

      <Section title={t('常见问题', 'FAQ')} gap={3}>
        <Accordion type="single" defaultValue={['ship']} items={FAQ} />
      </Section>

      {related.length > 0 && (
        <Section title={t('相关推荐', 'You might also like')} gap={4}>
          <Grid as="ul" minItemWidth="var(--shop-card-min)" gap={{ base: 3, md: 4 }} className="shop-grid">
            {related.map((p) => (
              <li key={p.id}><ProductCard product={p} favorite={favorites.has(p.id)} onFavorite={onFavorite} onOpen={onOpen} /></li>
            ))}
          </Grid>
        </Section>
      )}

      {!wide && (
        <div className="shop-dock shop-dock--buy" role="group" aria-label={t('购买', 'Buy')}>
          <Button size="lg" iconOnly aria-label={t(`打开购物车，${cartCount} 件商品`, `Open cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`)} onClick={onOpenCart} className="shop-dock__cart">
            <CartIcon />
            <Count value={cartCount} className="shop-dot" aria-hidden="true" />
          </Button>
          {addButton}
        </div>
      )}
    </Stack>
  );
}
