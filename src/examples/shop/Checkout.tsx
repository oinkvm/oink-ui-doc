import { useEffect, useRef, useState } from 'react';
import {
  Alert, Button, Card, Combobox, DescriptionList, EmptyState, Field, Fieldset, Form, FormActions, Grid, GridItem, Heading, Icon, Input,
  OptionCard, OptionCardGroup, Radio, RadioGroup, Stack, Steps, Sticky, Text, Textarea,
} from 'oink-ui';
import type { Translate } from '../../i18n';
import { useT } from '../../i18n';
import { BackIcon } from './art';
import { LineRow, TotalsList } from './Cart';
import { useShop } from './data';
import type { Address, CartLine, Order, PaymentId, ShippingId, Totals } from './data';

type Errors = Partial<Record<keyof Address, string>>;

function validate(a: Address, phoneOk: (phone: string) => boolean, t: Translate): Errors {
  const e: Errors = {};
  if (a.name.trim().length < 2) e.name = t('请填写收货人姓名（至少两个字）', 'Enter the recipient’s name (at least 2 characters)');
  if (!phoneOk(a.phone)) e.phone = t('请填写 11 位手机号', 'Enter a 10-digit phone number');
  if (!a.region) e.region = t('请选择所在城市', 'Choose a city');
  if (a.detail.trim().length < 5) e.detail = t('请填写详细地址（街道、门牌号）', 'Enter the street address (street and number)');
  return e;
}

const STEPS = {
  zh: [{ title: '收货地址' }, { title: '配送与支付' }, { title: '确认订单' }],
  en: [{ title: 'Shipping address' }, { title: 'Delivery & payment' }, { title: 'Review order' }],
};

export interface CheckoutProps {
  lines: CartLine[];
  coupon: string | null;
  totals: Totals;
  shipping: ShippingId;
  onShipping: (id: ShippingId) => void;
  onBack: () => void;
  onPlace: (order: Order) => void;
}

export function Checkout({ lines, coupon, totals, shipping, onShipping, onBack, onPlace }: CheckoutProps) {
  const t = useT();
  const { money, PAYMENTS, REGIONS, SHIPPING, phoneOk } = useShop();
  const steps = t(STEPS.zh, STEPS.en);
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<Address>({ name: '', phone: '', region: null, detail: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [payment, setPayment] = useState<PaymentId>('wechat');
  const [placing, setPlacing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<number>();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const patch = (p: Partial<Address>) => {
    setAddress((a) => ({ ...a, ...p }));
    // 改了哪个字段就清掉哪个字段的错误
    setErrors((e) => { const next = { ...e }; (Object.keys(p) as Array<keyof Address>).forEach((k) => delete next[k]); return next; });
  };

  // 换步骤后把焦点交给这一步的标题，读屏会读出新内容；校验失败则落到第一个出错的控件
  const pendingFocus = useRef<'title' | 'invalid' | null>(null);
  useEffect(() => {
    const what = pendingFocus.current;
    pendingFocus.current = null;
    if (what === 'title') headRef.current?.focus();
    else if (what === 'invalid') formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });

  const go = (n: number) => {
    pendingFocus.current = 'title';
    setStep(n);
    window.scrollTo(0, 0);
  };

  const submitAddress = () => {
    const e = validate(address, phoneOk, t);
    setErrors(e);
    if (Object.keys(e).length) { pendingFocus.current = 'invalid'; return; }
    go(1);
  };

  const place = () => {
    setPlacing(true);
    timer.current = window.setTimeout(() => {
      onPlace({ id: 'QM' + String(Date.now()).slice(-8), lines, totals, address, shipping, payment });
    }, 1400);
  };

  const ship = SHIPPING.find((s) => s.id === shipping)!;
  const pay = PAYMENTS.find((p) => p.id === payment)!;

  return (
    <Stack gap={{ base: 5, md: 6 }}>
      <Stack gap={3} align="start">
        <Button variant="ghost" size="sm" leading={<BackIcon />} onClick={onBack} disabled={placing}>{t('继续购物', 'Continue shopping')}</Button>
        <Heading level={1} variant="h1">{t('结算', 'Checkout')}</Heading>
      </Stack>
      <Steps items={steps} current={step} label={t('结算步骤', 'Checkout steps')} />

      <Grid columns={{ base: 1, lg: 3 }} gap={{ base: 5, lg: 8 }} align="start">
        <GridItem span={{ base: 'full', lg: 2 }}>
          <Card>
            <Stack gap={5}>
              <Heading level={2} variant="h3" ref={headRef} tabIndex={-1} className="shop-step-title">
                {steps[step].title}
                <Text variant="caption" tone="subtle" className="shop-step-title__n">{t(`第 ${step + 1} 步，共 3 步`, `Step ${step + 1} of 3`)}</Text>
              </Heading>

              {step === 0 && (
                <Form ref={formRef} onSubmit={submitAddress} noValidate>
                  <Grid columns={{ base: 1, sm: 2 }} gap={4} align="start">
                    <Field label={t('收货人', 'Recipient')} required error={errors.name}>
                      <Input value={address.name} onChange={(name) => patch({ name })} autoComplete="name" placeholder={t('姓名', 'Full name')} />
                    </Field>
                    <Field label={t('手机号', 'Phone')} required error={errors.phone} hint={t('只用于配送联系', 'Only used for delivery updates')}>
                      <Input value={address.phone} onChange={(phone) => patch({ phone })} type="tel" inputMode="numeric" autoComplete="tel" placeholder={t('11 位手机号', '10-digit phone number')} />
                    </Field>
                  </Grid>
                  <Field label={t('所在城市', 'City')} required error={errors.region}>
                    {(c) => (
                      <Combobox
                        id={c.id} aria-describedby={c['aria-describedby']} aria-required="true" invalid={!!errors.region}
                        options={REGIONS} value={address.region} onChange={(region) => patch({ region })} placeholder={t('输入或选择城市', 'Type or choose a city')} clearable
                      />
                    )}
                  </Field>
                  <Field label={t('详细地址', 'Street address')} required error={errors.detail}>
                    <Textarea value={address.detail} onChange={(detail) => patch({ detail })} autoComplete="street-address" placeholder={t('街道、小区、门牌号', 'Street, building, apartment')} minRows={3} />
                  </Field>
                  <FormActions align="end">
                    <Button type="submit" variant="primary" size="lg">{t('下一步', 'Next')}</Button>
                  </FormActions>
                </Form>
              )}

              {step === 1 && (
                <Stack gap={6}>
                  <Fieldset legend={t('配送方式', 'Delivery method')}>
                    <OptionCardGroup aria-label={t('配送方式', 'Delivery method')} value={shipping} onChange={(v) => onShipping(v as ShippingId)} minItemWidth={180}>
                      {SHIPPING.map((s) => (
                        <OptionCard key={s.id} value={s.id} description={s.description}>
                          {s.label} · {s.fee === 0 ? t('免费', 'Free') : money(s.fee)}
                        </OptionCard>
                      ))}
                    </OptionCardGroup>
                  </Fieldset>
                  <Fieldset legend={t('支付方式', 'Payment method')} hint={t('示例应用：不会发起真实支付，也不需要填写任何账户信息。', 'Demo app: no real payment is made, and no account details are needed.')}>
                    <RadioGroup aria-label={t('支付方式', 'Payment method')} value={payment} onChange={(v) => setPayment(v as PaymentId)}>
                      {PAYMENTS.map((p) => <Radio key={p.id} value={p.id} description={p.description}>{p.label}</Radio>)}
                    </RadioGroup>
                  </Fieldset>
                  <FormActions align="between">
                    <Button size="lg" onClick={() => go(0)}>{t('上一步', 'Back')}</Button>
                    <Button size="lg" variant="primary" onClick={() => go(2)}>{t('下一步', 'Next')}</Button>
                  </FormActions>
                </Stack>
              )}

              {step === 2 && (
                <Stack gap={5}>
                  <DescriptionList
                    divided
                    items={[
                      { term: t('收货人', 'Recipient'), description: t(`${address.name}　${address.phone}`, `${address.name} · ${address.phone}`) },
                      { term: t('收货地址', 'Address'), description: t(`${address.region ?? ''} ${address.detail}`, `${address.detail}, ${address.region ?? ''}`) },
                      { term: t('配送方式', 'Delivery'), description: t(`${ship.label}（${ship.description}）`, `${ship.label} (${ship.description})`) },
                      { term: t('支付方式', 'Payment'), description: pay.label },
                      { term: t('应付金额', 'Amount due'), description: <strong>{money(totals.total)}</strong> },
                    ]}
                  />
                  <Alert tone="info" title={t('这是一个示例', 'This is a demo')}>{t('提交后不会产生真实订单，也不会扣款。', 'Placing the order won’t create a real order or charge anything.')}</Alert>
                  <FormActions align="between">
                    <Button size="lg" onClick={() => go(1)} disabled={placing}>{t('上一步', 'Back')}</Button>
                    <Button size="lg" variant="accent" loading={placing} onClick={place}>{t('提交订单', 'Place order')} · {money(totals.total)}</Button>
                  </FormActions>
                </Stack>
              )}
            </Stack>
          </Card>
        </GridItem>

        <Sticky as="aside" style={{ top: 'calc(var(--shop-top-h) + var(--ok-s-4))' }} className="shop-summary" aria-labelledby="shop-summary-title">
          <Card>
            <Stack gap={4}>
              <Heading level={2} variant="h4" id="shop-summary-title">{t('订单摘要', 'Order summary')}</Heading>
              <ul className="shop-lines" aria-label={t('订单里的商品', 'Items in this order')}>
                {lines.map((l) => <LineRow key={l.key} line={l} />)}
              </ul>
              <TotalsList totals={totals} coupon={coupon} shippingLabel={t(`运费（${ship.label}）`, `Shipping (${ship.label})`)} />
            </Stack>
          </Card>
        </Sticky>
      </Grid>
    </Stack>
  );
}

/** 订单完成 */
export function OrderDone({ order, onHome }: { order: Order; onHome: () => void }) {
  const t = useT();
  const { PAYMENTS, SHIPPING } = useShop();
  const ship = SHIPPING.find((s) => s.id === order.shipping)!;
  const pay = PAYMENTS.find((p) => p.id === order.payment)!;
  const headRef = useRef<HTMLDivElement>(null);
  useEffect(() => { headRef.current?.focus(); }, []);
  return (
    <Stack gap={5} className="shop-done">
      <div ref={headRef} tabIndex={-1} className="shop-done__head">
        <h1 className="ok-sr">{t('订单完成', 'Order complete')}</h1>
        <EmptyState
          size="lg" titleAs="h2"
          icon={<Icon name="check" />}
          title={t('订单已提交', 'Order placed')}
          description={t(`谢谢你，${order.address.name}。我们会在发货时通过短信通知你。`, `Thanks, ${order.address.name}. We’ll text you when it ships.`)}
          actions={<Button variant="primary" size="lg" onClick={onHome}>{t('继续逛逛', 'Keep shopping')}</Button>}
        />
      </div>
      <Alert tone="success" title={t('示例订单', 'Demo order')}>{t('没有产生真实交易；购物车已清空。', 'No real transaction took place, and your cart has been emptied.')}</Alert>
      <Card>
        <Stack gap={4}>
          <Heading level={2} variant="h4">{t('订单摘要', 'Order summary')}</Heading>
          <DescriptionList
            divided
            items={[
              { term: t('订单号', 'Order number'), description: order.id },
              {
                term: t('收货', 'Ship to'),
                description: t(
                  `${order.address.name}　${order.address.phone}　${order.address.region ?? ''} ${order.address.detail}`,
                  `${order.address.name} · ${order.address.phone} · ${order.address.detail}, ${order.address.region ?? ''}`,
                ),
              },
              { term: t('配送', 'Delivery'), description: ship.label },
              { term: t('支付方式', 'Payment'), description: pay.label },
            ]}
          />
          <ul className="shop-lines" aria-label={t('订单里的商品', 'Items in this order')}>
            {order.lines.map((l) => <LineRow key={l.key} line={l} />)}
          </ul>
          <TotalsList totals={order.totals} coupon={null} shippingLabel={t(`运费（${ship.label}）`, `Shipping (${ship.label})`)} />
        </Stack>
      </Card>
    </Stack>
  );
}
