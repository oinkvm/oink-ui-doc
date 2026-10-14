import { useState } from 'react';
import {
  Button, Drawer, EmptyState, Field, FloatingBody, FloatingFooter, FloatingHeader, Form, Icon, Inline, Input, NumberInput, Progress, Sheet, Stack, Tag, Text,
  useBreakpoint,
} from 'oink-ui';
import { useT } from '../../i18n';
import { CartIcon, ProductArt } from './art';
import { FREE_SHIPPING, plural, unitPrice, useShop } from './data';
import type { CartLine, Totals } from './data';

/** 金额明细：小计、优惠、运费、合计。购物车和结算页共用 */
export function TotalsList({ totals, coupon, shippingLabel }: { totals: Totals; coupon: string | null; shippingLabel?: string }) {
  const t = useT();
  const { money } = useShop();
  return (
    <dl className="shop-totals">
      <div><dt>{t(`商品小计（${totals.count} 件）`, `Subtotal (${plural(totals.count, 'item')})`)}</dt><dd>{money(totals.subtotal)}</dd></div>
      {totals.discount > 0 && <div><dt>{t('优惠', 'Discount')}{coupon ? t(`（${coupon}）`, ` (${coupon})`) : ''}</dt><dd>−{money(totals.discount)}</dd></div>}
      <div><dt>{shippingLabel ?? t('运费', 'Shipping')}</dt><dd>{totals.shipping === 0 ? t('免运费', 'Free') : money(totals.shipping)}</dd></div>
      <div className="shop-totals__sum"><dt>{t('合计', 'Total')}</dt><dd>{money(totals.total)}</dd></div>
    </dl>
  );
}

/** 一行商品：缩略图、名称规格、单价；可选的数量与删除 */
export function LineRow({ line, onQty, onRemove }: { line: CartLine; onQty?: (qty: number) => void; onRemove?: () => void }) {
  const t = useT();
  const { money, productById, lineVariant } = useShop();
  const p = productById(line.productId);
  if (!p) return null;
  return (
    <li className="shop-line">
      <div className="shop-line__art"><ProductArt kind={p.art} color={line.color} /></div>
      <div className="shop-line__text">
        <Text variant="label" truncate>{p.name}</Text>
        <Text variant="caption" tone="subtle">{lineVariant(line)}</Text>
        {!onQty && <Text variant="caption" tone="subtle">{t('数量', 'Qty')} {line.qty}</Text>}
      </div>
      <Text variant="label" className="shop-line__price">{money(unitPrice(line) * line.qty)}</Text>
      {onQty && (
        <Inline gap={2} wrap={false} className="shop-line__edit">
          <NumberInput
            size="sm" value={line.qty} onChange={onQty} min={1} max={Math.max(1, Math.min(p.stock, 99))}
            aria-label={t(`${p.name} 的数量`, `Quantity of ${p.name}`)} decrementLabel={t(`减少 ${p.name} 的数量`, `Decrease quantity of ${p.name}`)}
            incrementLabel={t(`增加 ${p.name} 的数量`, `Increase quantity of ${p.name}`)} rootClassName="shop-qty"
          />
          <Button size="sm" variant="ghost" iconOnly aria-label={t(`从购物车移除 ${p.name}`, `Remove ${p.name} from cart`)} onClick={onRemove}><Icon name="trash" /></Button>
        </Inline>
      )}
    </li>
  );
}

export interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines: CartLine[];
  totals: Totals;
  coupon: string | null;
  onCoupon: (code: string | null) => void;
  onQty: (key: string, qty: number) => void;
  onRemove: (key: string) => void;
  onCheckout: () => void;
  onBrowse: () => void;
}

/** 购物车：宽屏是右侧的悬浮抽屉，窄屏是底部弹层，里面是同一份内容 */
export function Cart({ open, onOpenChange, lines, totals, coupon, onCoupon, onQty, onRemove, onCheckout, onBrowse }: CartProps) {
  const t = useT();
  const { money, COUPONS, couponHint } = useShop();
  const wide = useBreakpoint('md');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  const applyCode = () => {
    const c = code.trim().toUpperCase();
    if (!c) { setCodeError(t('请输入优惠码', 'Enter a promo code')); return; }
    if (!COUPONS[c]) { setCodeError(t('这个优惠码无效，试试 OINK10', 'That code isn’t valid. Try OINK10.')); return; }
    setCodeError(null);
    setCode('');
    onCoupon(c);
  };

  const left = Math.max(0, FREE_SHIPPING - (totals.subtotal - totals.discount));
  const empty = lines.length === 0;

  const content = (
    <>
      <FloatingHeader title={t('购物车', 'Cart')} description={empty ? t('还没有商品', 'No items yet') : t(`共 ${totals.count} 件商品`, plural(totals.count, 'item'))} />
      <FloatingBody className="ok-scroll shop-cart__body">
        {empty ? (
          <EmptyState
            icon={<CartIcon />} title={t('购物车是空的', 'Your cart is empty')} titleAs="h3" description={t('去挑几样喜欢的东西吧。', 'Go pick out a few things you like.')}
            actions={<Button variant="primary" onClick={onBrowse}>{t('去逛逛', 'Start shopping')}</Button>}
          />
        ) : (
          <Stack gap={5}>
            <Stack gap={2}>
              <Text variant="caption" tone={left === 0 ? 'success' : 'subtle'}>
                {left === 0 ? t('已满足标准配送包邮', 'You’ve got free standard shipping') : t(`再买 ${money(left)} 即可包邮`, `Add ${money(left)} more for free shipping`)}
              </Text>
              <Progress size="sm" label={t('距离包邮的进度', 'Progress toward free shipping')} value={Math.min(FREE_SHIPPING, totals.subtotal - totals.discount)} max={FREE_SHIPPING} />
            </Stack>
            <ul className="shop-lines" aria-label={t('购物车里的商品', 'Items in your cart')}>
              {lines.map((l) => <LineRow key={l.key} line={l} onQty={(q) => onQty(l.key, q)} onRemove={() => onRemove(l.key)} />)}
            </ul>
            {coupon ? (
              <Inline gap={2}>
                <Text variant="label">{t('优惠码', 'Promo code')}</Text>
                <Tag tone="success" onRemove={() => onCoupon(null)} removeLabel={t(`移除优惠码 ${coupon}`, `Remove promo code ${coupon}`)}>{coupon} · {COUPONS[coupon].label}</Tag>
              </Inline>
            ) : (
              <Form onSubmit={applyCode} noValidate>
                <Field label={t('优惠码', 'Promo code')} error={codeError} hint={couponHint}>
                  {(c) => (
                    <Inline gap={2} wrap={false} align="start" className="shop-cart__code">
                      <Input {...c} value={code} onChange={(v) => { setCode(v); setCodeError(null); }} placeholder={t('输入优惠码', 'Enter code')} autoCapitalize="characters" autoComplete="off" invalid={!!codeError} />
                      <Button type="submit" className="shop-cart__apply">{t('使用', 'Apply')}</Button>
                    </Inline>
                  )}
                </Field>
              </Form>
            )}
          </Stack>
        )}
      </FloatingBody>
      {!empty && (
        <FloatingFooter align="stretch" className="shop-cart__foot">
          <TotalsList totals={totals} coupon={coupon} shippingLabel={t('运费（标准配送）', 'Shipping (standard)')} />
          <Button variant="accent" size="lg" block onClick={onCheckout}>{t('去结算', 'Check out')} · {money(totals.total)}</Button>
        </FloatingFooter>
      )}
    </>
  );

  return wide
    ? <Drawer open={open} onOpenChange={onOpenChange} placement="right" size={420}>{content}</Drawer>
    : <Sheet open={open} onOpenChange={onOpenChange} size={empty ? 'auto' : 'lg'}>{content}</Sheet>;
}
