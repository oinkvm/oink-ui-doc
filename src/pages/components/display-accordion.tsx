import { useState } from 'react';
import { Accordion, Card, Code, Stack, Text } from 'oink-ui';
import type { AccordionItem } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Keys, Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/accordion', title: 'Accordion 折叠面板', group: '导航', order: 20, subtitle: 'Accordion', en: { title: 'Accordion' } };

const FAQ: { zh: AccordionItem[]; en: AccordionItem[] } = {
  zh: [
    { value: 'refund', title: '可以退款吗？', content: '购买后 14 天内可以无理由全额退款，款项会在 3 到 5 个工作日内原路退回。' },
    { value: 'seats', title: '席位不够用了怎么办？', content: '在“账单”里随时加购席位，按当月剩余天数折算费用，立即生效。' },
    { value: 'export', title: '数据可以导出吗？', content: '可以。项目、任务和评论都能导出成 CSV 或 JSON，附件会打包成一个压缩文件。' },
    { value: 'sso', title: '支持单点登录吗？（企业版）', content: '仅企业版提供。', disabled: true },
  ],
  en: [
    { value: 'refund', title: 'Can I get a refund?', content: 'Full refunds are available within 14 days of purchase, no questions asked. The money is returned to your original payment method in 3 to 5 business days.' },
    { value: 'seats', title: 'What if I run out of seats?', content: 'Add seats any time under Billing. You’re charged pro rata for the rest of the month, and they take effect immediately.' },
    { value: 'export', title: 'Can I export my data?', content: 'Yes. Projects, tasks and comments export to CSV or JSON, and attachments are bundled into a single archive.' },
    { value: 'sso', title: 'Is single sign-on supported? (Enterprise)', content: 'Enterprise plan only.', disabled: true },
  ],
};

const CODE_BASIC = {
  zh: `
const faq: AccordionItem[] = [
  { value: 'refund', title: '可以退款吗？', content: '购买后 14 天内可以无理由全额退款，款项会在 3 到 5 个工作日内原路退回。' },
  { value: 'seats', title: '席位不够用了怎么办？', content: '在“账单”里随时加购席位，按当月剩余天数折算费用，立即生效。' },
  { value: 'export', title: '数据可以导出吗？', content: '可以。项目、任务和评论都能导出成 CSV 或 JSON，附件会打包成一个压缩文件。' },
  { value: 'sso', title: '支持单点登录吗？（企业版）', content: '仅企业版提供。', disabled: true },
];

<Accordion items={faq} defaultValue={['refund']} />`,
  en: `
const faq: AccordionItem[] = [
  { value: 'refund', title: 'Can I get a refund?', content: 'Full refunds are available within 14 days of purchase, no questions asked. The money is returned to your original payment method in 3 to 5 business days.' },
  { value: 'seats', title: 'What if I run out of seats?', content: 'Add seats any time under Billing. You’re charged pro rata for the rest of the month, and they take effect immediately.' },
  { value: 'export', title: 'Can I export my data?', content: 'Yes. Projects, tasks and comments export to CSV or JSON, and attachments are bundled into a single archive.' },
  { value: 'sso', title: 'Is single sign-on supported? (Enterprise)', content: 'Enterprise plan only.', disabled: true },
];

<Accordion items={faq} defaultValue={['refund']} />`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [open, setOpen] = useState<string[]>(['refund']);
  return (
    <Stack gap={3}>
      <Accordion items={faq} type="single" collapsible={false} value={open} onChange={setOpen} />
      <Text tone="neutral" variant="caption">展开的项：{open.join('、') || '无'}</Text>
    </Stack>
  );
}`,
  en: `
function ControlledDemo() {
  const [open, setOpen] = useState<string[]>(['refund']);
  return (
    <Stack gap={3}>
      <Accordion items={faq} type="single" collapsible={false} value={open} onChange={setOpen} />
      <Text tone="neutral" variant="caption">Expanded: {open.join(', ') || 'none'}</Text>
    </Stack>
  );
}`,
};

function ControlledDemo() {
  const t = useT();
  const [open, setOpen] = useState<string[]>(['refund']);
  return (
    <Stack gap={3}>
      <Accordion items={t(FAQ.zh, FAQ.en)} type="single" collapsible={false} value={open} onChange={setOpen} />
      <Text tone="neutral" variant="caption">{t('展开的项：', 'Expanded: ')}{open.join(t('、', ', ')) || t('无', 'none')}</Text>
    </Stack>
  );
}

export default function AccordionPage() {
  const t = useT();
  const faq = t(FAQ.zh, FAQ.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('把次要的内容收起来，只留标题，按需展开：常见问题、高级设置、长表单的分段。内容都很重要、需要一眼看全时不要折叠。', 'Tuck secondary content away behind its heading and expand it on demand: FAQs, advanced settings, sections of a long form. Don’t collapse content that all matters and needs to be seen at a glance.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('默认各项互不影响（multiple），可以同时展开多项。高度用无过冲的 soft 弹簧展开，箭头转 90°，内容稍后淡入。', 'By default items are independent (multiple), so several can be open at once. Height expands on the soft spring with no overshoot, the chevron turns 90°, and the content fades in just after.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Accordion items={faq} defaultValue={['refund']} />
        </Demo>
      </DocSection>

      <DocSection title={t('一次只展开一项', 'One item at a time')} description={t('type="single" 时展开一项会收起另一项。默认还可以把唯一展开的那项收起来。', 'With type="single", opening one item closes the other. By default the only open item can still be collapsed.')}>
        <Demo layout="block" code={`<Accordion items={faq} type="single" defaultValue={['seats']} />`}>
          <Accordion items={faq} type="single" defaultValue={['seats']} />
        </Demo>
      </DocSection>

      <DocSection title={t('受控，且总有一项展开', 'Controlled, always one open')} description={t('value / onChange 受控，值是展开项的数组。single 配合 collapsible={false} 时，已展开的那项不能再收起（它的标题会标成 aria-disabled）。', 'Control it with value / onChange; the value is an array of open items. With single and collapsible={false}, the open item can’t be collapsed (its heading is marked aria-disabled).')}>
        <Demo layout="block" code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('无底变体', 'Plain variant')} description={t('variant="plain" 去掉卡片底，用来嵌进已有的卡片或面板。', 'variant="plain" drops the card background so it can sit inside an existing card or panel.')}>
        <Demo
          layout="block"
          code={`
<Card>
  <Accordion variant="plain" headingLevel={4} items={faq.slice(0, 3)} />
</Card>`}
        >
          <Card>
            <Accordion variant="plain" headingLevel={4} items={faq.slice(0, 3)} />
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('高度', 'Height'), t('grid 0fr ⇄ 1fr · spring-soft 曲线 391ms', 'grid 0fr ⇄ 1fr · spring-soft curve 391ms')],
          [t('箭头', 'Chevron'), t('rotate 90° · bouncy · 展开后变正文色', 'rotate 90° · bouncy · turns body text color when open')],
          [t('内容', 'Content'), t('延迟 40ms 淡入 160ms + 下移 8px 240ms', '40ms delay, 160ms fade-in + 8px slide down over 240ms')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Accordion" rows={[
          { name: 'items', type: 'AccordionItem[]', required: true, description: t('各项的标题和内容。', 'Heading and content of each item.') },
          { name: 'type', type: "'single' | 'multiple'", default: "'multiple'", description: t('single：同时只展开一项。', 'single: only one item open at a time.') },
          { name: 'value / defaultValue', type: 'string[]', default: '[]', description: t('展开的项，受控 / 非受控；single 时最多一个。', 'Open items, controlled / uncontrolled; at most one with single.') },
          { name: 'onChange', type: '(value: string[]) => void', description: t('展开状态变化时。', 'Called when the open items change.') },
          { name: 'collapsible', type: 'boolean', default: 'true', description: t('single 时是否允许把唯一展开的一项收起。', 'With single, whether the only open item can be collapsed.') },
          { name: 'headingLevel', type: '2 | 3 | 4 | 5 | 6', default: '3', description: t('标题的层级，按所在页面的标题结构选。', 'Heading level; pick it to fit the page’s heading outline.') },
          { name: 'variant', type: "'group' | 'plain'", default: "'group'", description: t('group：带卡片底的分组；plain：没有底。', 'group: grouped on a card background; plain: no background.') },
        ]} />
        <PropsTable title="AccordionItem" rows={[
          { name: 'value', type: 'string', required: true, description: t('唯一标识。', 'Unique identifier.') },
          { name: 'title', type: 'ReactNode', required: true, description: t('标题。', 'Heading.') },
          { name: 'content', type: 'ReactNode', required: true, description: t('展开后的内容。', 'Content shown when expanded.') },
          { name: 'disabled', type: 'boolean', description: t('禁用，不能展开。', 'Disabled; can’t be expanded.') },
        ]} />
        <A11yNotes items={t([
          <>每一项的标题是标题元素（默认 <Code>h3</Code>）里的一个按钮，带 <Code>aria-expanded</Code> 和 <Code>aria-controls</Code>；内容区是 <Code>role="region"</Code>，用标题命名。</>,
          <><Keys k="Tab" /> 在标题之间移动，<Keys k="Enter" /> 或 <Keys k="Space" /> 展开 / 收起。</>,
          <><Keys k="↑ ↓" /> 在标题间循环移动，<Keys k="Home End" /> 到第一个 / 最后一个；禁用的项会被跳过。</>,
          '收起的内容不可见，里面的控件不在 Tab 顺序里，读屏也读不到。',
          '箭头是装饰；展开与否由 aria-expanded 告诉读屏。',
        ], [
          <>Each heading is a button inside a heading element (<Code>h3</Code> by default) with <Code>aria-expanded</Code> and <Code>aria-controls</Code>; the content is a <Code>role="region"</Code> labelled by its heading.</>,
          <><Keys k="Tab" /> moves between headings; <Keys k="Enter" /> or <Keys k="Space" /> expands / collapses.</>,
          <><Keys k="↑ ↓" /> cycle through the headings, <Keys k="Home End" /> jump to the first / last; disabled items are skipped.</>,
          'Collapsed content is hidden: its controls leave the Tab order and screen readers can’t reach it.',
          'The chevron is decorative; aria-expanded tells screen readers whether an item is open.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
