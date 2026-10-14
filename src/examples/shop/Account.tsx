import { ACCENTS, Avatar, Button, Card, DescriptionList, EmptyState, Grid, Heading, Inline, Section, Segmented, Stack, Text, useOink } from 'oink-ui';
import type { Accent, ThemeMode, AccentPreset } from 'oink-ui';
import { useT } from '../../i18n';
import { HeartIcon, ProductArt } from './art';
import { plural, useShop } from './data';
import type { CategoryId, Order } from './data';
import { ProductCard } from './ProductCard';

const ACCENT_NAMES = {
  zh: { pink: '粉', orange: '橙', amber: '琥珀', blue: '蓝', violet: '紫' },
  en: { pink: 'Pink', orange: 'Orange', amber: 'Amber', blue: 'Blue', violet: 'Violet' },
} satisfies Record<'zh' | 'en', Record<AccentPreset, string>>;

export interface AccountProps {
  favorites: ReadonlySet<string>;
  onFavorite: (id: string, on: boolean) => void;
  onOpen: (id: string) => void;
  onHome: () => void;
  lastOrder: Order | null;
}

/** 我的：收藏、最近订单、外观 */
export function Account({ favorites, onFavorite, onOpen, onHome, lastOrder }: AccountProps) {
  const t = useT();
  const { PRODUCTS, money } = useShop();
  const { theme, setTheme, accent, setAccent } = useOink();
  const favs = PRODUCTS.filter((p) => favorites.has(p.id));
  const accentNames = t(ACCENT_NAMES.zh, ACCENT_NAMES.en);
  return (
    <Stack gap={{ base: 6, md: 8 }}>
      <Inline gap={4} wrap={false}>
        <Avatar name={t('访客', 'Guest')} size="lg" />
        <Stack gap={1}>
          <Heading level={1} variant="h2">{t('我的', 'Account')}</Heading>
          <Text tone="subtle">{t('访客模式 · 收藏和购物车只保存在这次浏览里', 'Guest mode · favorites and cart are kept for this visit only')}</Text>
        </Stack>
      </Inline>

      <Section title={t(`我的收藏（${favs.length}）`, `Favorites (${favs.length})`)} gap={4}>
        {favs.length === 0 ? (
          <Card>
            <EmptyState
              icon={<HeartIcon />} title={t('还没有收藏', 'No favorites yet')} titleAs="h3"
              description={t('在商品卡片上点一下心形，就会出现在这里。', 'Tap the heart on any product card and it’ll show up here.')}
              actions={<Button onClick={onHome}>{t('去逛逛', 'Start shopping')}</Button>}
            />
          </Card>
        ) : (
          <Grid as="ul" minItemWidth="var(--shop-card-min)" gap={{ base: 3, md: 4 }} className="shop-grid">
            {favs.map((p) => <li key={p.id}><ProductCard product={p} favorite onFavorite={onFavorite} onOpen={onOpen} /></li>)}
          </Grid>
        )}
      </Section>

      <Section title={t('最近订单', 'Recent orders')} gap={4}>
        <Card>
          {lastOrder ? (
            <DescriptionList
              items={[
                { term: t('订单号', 'Order number'), description: lastOrder.id },
                { term: t('商品', 'Items'), description: t(`${lastOrder.totals.count} 件`, plural(lastOrder.totals.count, 'item')) },
                { term: t('实付', 'Paid'), description: money(lastOrder.totals.total) },
                { term: t('状态', 'Status'), description: t('待发货', 'Awaiting shipment') },
              ]}
            />
          ) : <Text tone="subtle">{t('还没有订单。', 'No orders yet.')}</Text>}
        </Card>
      </Section>

      <Section title={t('外观', 'Appearance')} gap={4}>
        <Card>
          <Stack gap={5}>
            <Stack gap={2}>
              <Text variant="label" id="shop-theme">{t('主题', 'Theme')}</Text>
              <Segmented<ThemeMode>
                aria-labelledby="shop-theme" block value={theme} onChange={(v) => setTheme(v)}
                options={[{ value: 'light', label: t('浅色', 'Light') }, { value: 'dark', label: t('深色', 'Dark') }, { value: 'system', label: t('跟随系统', 'System') }]}
              />
            </Stack>
            <Stack gap={2}>
              <Text variant="label" id="shop-accent">{t('强调色', 'Accent color')}</Text>
              <Segmented<Accent>
                aria-labelledby="shop-accent" block value={accent} onChange={setAccent}
                options={ACCENTS.map((a) => ({ value: a, label: accentNames[a] }))}
              />
            </Stack>
          </Stack>
        </Card>
      </Section>
    </Stack>
  );
}

/** 分类：手机底部标签栏的第二项 */
export function Categories({ onPick }: { onPick: (id: CategoryId) => void }) {
  const t = useT();
  const { CATEGORIES, PRODUCTS } = useShop();
  return (
    <Stack gap={5}>
      <Stack gap={1}>
        <Heading level={1} variant="h2">{t('分类', 'Categories')}</Heading>
        <Text tone="subtle">{t('五个货架，二十来样东西。', 'Five shelves, twenty-odd things.')}</Text>
      </Stack>
      <Grid as="ul" columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 3, md: 4 }} className="shop-grid">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <Card interactive chevron size="sm" onClick={() => onPick(c.id)} className="shop-cat">
              <span className="shop-cat__row">
                <span className="shop-cat__art"><ProductArt kind={c.art} color={c.color} /></span>
                <span className="shop-cat__text">
                  <Text variant="label">{c.label}</Text>
                  <Text variant="caption" tone="subtle">{c.blurb} · {t(`${PRODUCTS.filter((p) => p.category === c.id).length} 件`, plural(PRODUCTS.filter((p) => p.category === c.id).length, 'item'))}</Text>
                </span>
              </span>
            </Card>
          </li>
        ))}
      </Grid>
    </Stack>
  );
}
