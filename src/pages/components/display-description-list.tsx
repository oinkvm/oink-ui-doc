import { Badge, Card, Code, DescriptionItem, DescriptionList, Grid } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/description-list', title: 'DescriptionList 描述列表', group: '数据展示', order: 50, subtitle: 'DescriptionList · DescriptionItem', en: { title: 'DescriptionList', subtitle: 'DescriptionList · DescriptionItem' } };

const CODE_BASIC = {
  zh: `
<Card>
  <DescriptionList
    items={[
      { term: '订单号', description: 'OK-2024-081537' },
      { term: '下单时间', description: '2024 年 8 月 15 日 14:32' },
      { term: '收货地址', description: '上海市徐汇区漕溪北路 88 号 12 层 1203 室' },
      { term: '状态', description: <Badge tone="success" dot>已发货</Badge> },
    ]}
  />
</Card>`,
  en: `
<Card>
  <DescriptionList
    items={[
      { term: 'Order number', description: 'OK-2024-081537' },
      { term: 'Placed', description: 'Aug 15, 2024, 14:32' },
      { term: 'Shipping address', description: 'Suite 1203, 88 Harbor Street, San Francisco, CA 94105' },
      { term: 'Status', description: <Badge tone="success" dot>Shipped</Badge> },
    ]}
  />
</Card>`,
};

const CODE_LAYOUT = {
  zh: `
<Grid columns={{ base: 1, md: 2 }} align="start">
  <Card>
    <DescriptionList layout="stacked" items={[{ term: '姓名', description: '林小满' }, { term: '邮箱', description: 'xiaoman@example.com' }]} />
  </Card>
  <Card>
    <DescriptionList layout="inline" items={[{ term: '姓名', description: '林小满' }, { term: '邮箱', description: 'xiaoman@example.com' }]} />
  </Card>
</Grid>`,
  en: `
<Grid columns={{ base: 1, md: 2 }} align="start">
  <Card>
    <DescriptionList layout="stacked" items={[{ term: 'Name', description: 'Ella Morgan' }, { term: 'Email', description: 'ella@example.com' }]} />
  </Card>
  <Card>
    <DescriptionList layout="inline" items={[{ term: 'Name', description: 'Ella Morgan' }, { term: 'Email', description: 'ella@example.com' }]} />
  </Card>
</Grid>`,
};

const CODE_DIVIDED = {
  zh: `
<Card>
  <DescriptionList divided>
    <DescriptionItem term="套餐">专业版</DescriptionItem>
    <DescriptionItem term="席位">12 / 20</DescriptionItem>
    <DescriptionItem term="下次扣费">2024 年 9 月 1 日</DescriptionItem>
  </DescriptionList>
</Card>`,
  en: `
<Card>
  <DescriptionList divided>
    <DescriptionItem term="Plan">Pro</DescriptionItem>
    <DescriptionItem term="Seats">12 / 20</DescriptionItem>
    <DescriptionItem term="Next charge">Sep 1, 2024</DescriptionItem>
  </DescriptionList>
</Card>`,
};

export default function DescriptionListPage() {
  const t = useT();
  const person = t(
    [{ term: '姓名', description: '林小满' }, { term: '邮箱', description: 'xiaoman@example.com' }],
    [{ term: 'Name', description: 'Ella Morgan' }, { term: 'Email', description: 'ella@example.com' }],
  );
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('成对的“名目 —— 取值”：订单详情、个人资料、元数据。只读；要编辑请用表单。', 'Pairs of “term — value”: order details, profiles, metadata. Read-only; for editing, use a form.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('用 items 传键值对。默认布局 auto：窄于 520px 时名目在上、取值在下，更宽时左右两列。', 'Pass the pairs through items. The default auto layout puts the term above the value below 520px, and in two columns when wider.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Card>
            <DescriptionList
              items={t([
                { term: '订单号', description: 'OK-2024-081537' },
                { term: '下单时间', description: '2024 年 8 月 15 日 14:32' },
                { term: '收货地址', description: '上海市徐汇区漕溪北路 88 号 12 层 1203 室' },
                { term: '状态', description: <Badge tone="success" dot>已发货</Badge> },
              ], [
                { term: 'Order number', description: 'OK-2024-081537' },
                { term: 'Placed', description: 'Aug 15, 2024, 14:32' },
                { term: 'Shipping address', description: 'Suite 1203, 88 Harbor Street, San Francisco, CA 94105' },
                { term: 'Status', description: <Badge tone="success" dot>Shipped</Badge> },
              ])}
            />
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('布局', 'Layout')} description={t('stacked 总是上下堆叠，适合窄栏；inline 总是左右两列，适合取值都很短的场合。', 'stacked always stacks term over value, good for narrow columns; inline always uses two columns, good when every value is short.')}>
        <Demo layout="block" code={t(CODE_LAYOUT.zh, CODE_LAYOUT.en)}>
          <Grid columns={{ base: 1, md: 2 }} align="start">
            <Card>
              <DescriptionList layout="stacked" items={person} />
            </Card>
            <Card>
              <DescriptionList layout="inline" items={person} />
            </Card>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('分隔线与自定义条目', 'Dividers and custom items')} description={t('divided 在条目之间加发丝线。不用 items 时可以直接写 DescriptionItem，方便给单个条目加属性。', 'divided adds hairlines between items. Instead of items, you can write DescriptionItem directly, which makes it easy to add props to a single item.')}>
        <Demo layout="block" code={t(CODE_DIVIDED.zh, CODE_DIVIDED.en)}>
          <Card>
            <DescriptionList divided>
              <DescriptionItem term={t('套餐', 'Plan')}>{t('专业版', 'Pro')}</DescriptionItem>
              <DescriptionItem term={t('席位', 'Seats')}>12 / 20</DescriptionItem>
              <DescriptionItem term={t('下次扣费', 'Next charge')}>{t('2024 年 9 月 1 日', 'Sep 1, 2024')}</DescriptionItem>
            </DescriptionList>
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="DescriptionList" rows={[
          { name: 'items', type: '{ key?: string; term: ReactNode; description: ReactNode }[]', description: t(<>键值对；也可以不传，直接在 children 里写 <Code>DescriptionItem</Code>。</>, <>The pairs; or leave it out and write <Code>DescriptionItem</Code> in children.</>) },
          { name: 'layout', type: "'auto' | 'stacked' | 'inline'", default: "'auto'", description: t('auto：窄屏堆叠，520px 起两列。', 'auto: stacked on narrow screens, two columns from 520px.') },
          { name: 'divided', type: 'boolean', description: t('条目之间加发丝线。', 'Adds hairlines between items.') },
        ]} />
        <PropsTable title="DescriptionItem" rows={[
          { name: 'term', type: 'ReactNode', required: true, description: t('名目（dt）。', 'The term (dt).') },
          { name: 'children', type: 'ReactNode', description: t('取值（dd）。', 'The value (dd).') },
        ]} />
        <A11yNotes items={t([
          <>渲染成原生的 <Code>dl</Code> / <Code>dt</Code> / <Code>dd</Code>，每一对包在一个 <Code>div</Code> 里（规范允许），读屏会把名目和取值成对读出。</>,
          '名目用次要色、取值用正文色，两者对比度都不低于 4.5:1。',
          '没有键盘操作；长的取值会自动换行，不会横向溢出。',
        ], [
          <>Renders native <Code>dl</Code> / <Code>dt</Code> / <Code>dd</Code>, with each pair wrapped in a <Code>div</Code> (allowed by the spec), so screen readers read terms and values as pairs.</>,
          'Terms use the secondary text color and values the body text color, both with contrast of at least 4.5:1.',
          'No keyboard interaction; long values wrap instead of overflowing horizontally.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
