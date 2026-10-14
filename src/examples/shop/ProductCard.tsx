import { AspectRatio, Badge, Card, CardLink, Inline, Rating, Reaction, Skeleton, Stack, Text, VisuallyHidden } from 'oink-ui';
import { useT } from '../../i18n';
import { HEART_24, ProductArt } from './art';
import { useShop } from './data';
import type { Product } from './data';

export const TAG_TONE = { new: 'info', hot: 'accent', sale: 'success' } as const;

/** 价格：划线价带“原价”的读屏说明 */
export function Price({ product, size = 'md' }: { product: Product; size?: 'md' | 'lg' }) {
  const t = useT();
  const { money } = useShop();
  return (
    <span className="shop-price" data-size={size}>
      <span className="shop-price__now">{money(product.price)}</span>
      {product.original !== undefined && (
        <s className="shop-price__was"><VisuallyHidden>{t('原价 ', 'Was ')}</VisuallyHidden>{money(product.original)}</s>
      )}
    </span>
  );
}

/** 只读星星：库的 Rating 只有整星，这里四舍五入后纯做装饰，准确的分数由旁边的文字给出 */
export function Stars({ value, size = 'sm' }: { value: number; size?: 'sm' | 'md' }) {
  return <span aria-hidden="true" className="shop-stars"><Rating readOnly size={size} value={Math.round(value)} /></span>;
}

export interface ProductCardProps {
  product: Product;
  favorite: boolean;
  onFavorite: (id: string, on: boolean) => void;
  onOpen: (id: string) => void;
  /** 标题层级，默认 h3 */
  headingLevel?: 3 | 4;
}

export function ProductCard({ product, favorite, onFavorite, onOpen, headingLevel = 3 }: ProductCardProps) {
  const t = useT();
  const { stockText, tagLabel } = useShop();
  const Title = `h${headingLevel}` as 'h3';
  const stock = stockText(product.stock);
  return (
    <Card as="article" size="sm" className="shop-card" data-soldout={product.stock === 0 ? '' : undefined}>
      <div className="shop-card__media">
        <AspectRatio ratio={1} className="shop-card__art">
          <ProductArt kind={product.art} color={product.colors[0]} />
        </AspectRatio>
        {product.tag && <Badge className="shop-card__badge" tone={TAG_TONE[product.tag]}>{tagLabel[product.tag]}</Badge>}
        <div className="shop-card__fav">
          <Reaction
            icon={HEART_24}
            label={t(`收藏 ${product.name}`, `Save ${product.name}`)}
            pressed={favorite}
            onChange={(on) => onFavorite(product.id, on)}
          />
        </div>
      </div>
      <Stack gap={1} className="shop-card__text">
        <Title className="shop-card__name">
          <CardLink onClick={() => onOpen(product.id)}>{product.name}</CardLink>
        </Title>
        <Price product={product} />
        <Inline gap={1} wrap={false} className="shop-card__meta">
          <Stars value={product.rating} />
          <Text variant="caption" tone="subtle"><VisuallyHidden>{t('评分 ', 'Rated ')}</VisuallyHidden>{product.rating.toFixed(1)}<VisuallyHidden>{t(' 分，共 5 分', ' out of 5')}</VisuallyHidden></Text>
        </Inline>
        <Text variant="caption" tone="subtle">
          {t(`${product.reviews} 条评价`, `${product.reviews.toLocaleString('en-US')} reviews`)} · <Text variant="caption" tone={stock.tone}>{stock.text}</Text>
        </Text>
      </Stack>
    </Card>
  );
}

/** 加载占位：和卡片同样的骨架 */
export function ProductCardSkeleton() {
  return (
    <Card size="sm" className="shop-card" aria-hidden="true">
      <AspectRatio ratio={1}><Skeleton variant="rect" width="100%" height="100%" /></AspectRatio>
      <Stack gap={2} className="shop-card__text">
        <Skeleton width="80%" />
        <Skeleton width="40%" />
        <Skeleton width="60%" />
      </Stack>
    </Card>
  );
}
