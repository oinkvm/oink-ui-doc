import { useState } from 'react';
import { Field, Rating, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/rating', title: 'Rating 评分', group: '表单与操作', order: 160, subtitle: 'Rating', en: { title: 'Rating' } };

const WORDS = {
  zh: ['还没有评分', '很差', '较差', '一般', '不错', '非常好'],
  en: ['Not rated yet', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'],
};

function ControlledDemo() {
  const t = useT();
  const words = t(WORDS.zh, WORDS.en);
  const [stars, setStars] = useState(4);
  return (
    <Stack gap={3} align="center">
      <Rating aria-label={t('服务评分', 'Service rating')} value={stars} onChange={setStars} />
      <Text tone="subtle" variant="caption" role="status">{words[stars]}</Text>
    </Stack>
  );
}

const CONTROLLED_CODE = {
  zh: `
const WORDS = ['还没有评分', '很差', '较差', '一般', '不错', '非常好'];

function ControlledDemo() {
  const [stars, setStars] = useState(4);
  return (
    <Stack gap={3} align="center">
      <Rating aria-label="服务评分" value={stars} onChange={setStars} />
      <Text tone="subtle" variant="caption" role="status">{WORDS[stars]}</Text>
    </Stack>
  );
}
`,
  en: `
const WORDS = ['Not rated yet', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];

function ControlledDemo() {
  const [stars, setStars] = useState(4);
  return (
    <Stack gap={3} align="center">
      <Rating aria-label="Service rating" value={stars} onChange={setStars} />
      <Text tone="subtle" variant="caption" role="status">{WORDS[stars]}</Text>
    </Stack>
  );
}
`,
};

export default function RatingPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Rating 评分', 'Rating')}
      subtitle="Rating"
      lead={t(
        '让用户打一个星级，或者只读地展示一个评分。只支持整星；要展示 4.6 这样的均分，请在旁边写出数字。',
        'Lets people give a star rating, or shows a rating read-only. Whole stars only; to show an average like 4.6, write the number next to it.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '点第几颗就是几星；再点一次当前的星可以清零（allowClear 默认开启）。',
        'Click the nth star for n stars; click the current star again to clear (allowClear is on by default).',
      )}>
        <Demo
          code={t(`
<Field label="给这次配送打分">
  <Rating defaultValue={3} name="rating" />
</Field>
`, `
<Field label="Rate this delivery">
  <Rating defaultValue={3} name="rating" />
</Field>
`)}
        >
          <Field label={t('给这次配送打分', 'Rate this delivery')}>
            <Rating defaultValue={3} name="rating" />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸与星数', 'Sizes and star count')}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={4}>
  <Rating size="sm" aria-label="小号" defaultValue={2} />
  <Rating size="md" aria-label="中号" defaultValue={3} />
  <Rating size="lg" aria-label="大号" defaultValue={4} />
  <Rating max={10} aria-label="十分制" defaultValue={7} starLabel={(n) => n + ' 分'} />
</Stack>
`, `
<Stack gap={4}>
  <Rating size="sm" aria-label="Small" defaultValue={2} />
  <Rating size="md" aria-label="Medium" defaultValue={3} />
  <Rating size="lg" aria-label="Large" defaultValue={4} />
  <Rating max={10} aria-label="Out of 10" defaultValue={7} starLabel={(n) => n + ' out of 10'} />
</Stack>
`)}
        >
          <Stack gap={4}>
            <Rating size="sm" aria-label={t('小号', 'Small')} defaultValue={2} />
            <Rating size="md" aria-label={t('中号', 'Medium')} defaultValue={3} />
            <Rating size="lg" aria-label={t('大号', 'Large')} defaultValue={4} />
            <Rating max={10} aria-label={t('十分制', 'Out of 10')} defaultValue={7} starLabel={(n) => n + t(' 分', ' out of 10')} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')}>
        <Demo
          layout="col"
          align="start"
          description={t(
            'readOnly 用来展示别人打的分：它不可聚焦，是一张带名称的图。disabled 是暂时不能操作的输入。',
            'readOnly shows a rating someone else gave: it isn’t focusable and acts as a named image. disabled is an input that’s temporarily unavailable.',
          )}
          code={t(`
<Stack gap={4}>
  <Rating readOnly aria-label="用户评分" value={4} />
  <Rating disabled aria-label="禁用" defaultValue={2} />
  <Rating allowClear={false} aria-label="不可清零" defaultValue={1} />
</Stack>
`, `
<Stack gap={4}>
  <Rating readOnly aria-label="User rating" value={4} />
  <Rating disabled aria-label="Disabled" defaultValue={2} />
  <Rating allowClear={false} aria-label="Can’t be cleared" defaultValue={1} />
</Stack>
`)}
        >
          <Stack gap={4}>
            <Rating readOnly aria-label={t('用户评分', 'User rating')} value={4} />
            <Rating disabled aria-label={t('禁用', 'Disabled')} defaultValue={2} />
            <Rating allowClear={false} aria-label={t('不可清零', 'Can’t be cleared')} defaultValue={1} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t('value 为 0 表示未评分。', 'A value of 0 means not rated.')}>
        <Demo code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'value', type: 'number', description: t('当前星数（受控），0 表示未评分。', 'Current number of stars (controlled); 0 means not rated.') },
            { name: 'defaultValue', type: 'number', default: '0', description: t('初始星数（非受控）。', 'Initial number of stars (uncontrolled).') },
            { name: 'onChange', type: '(value: number) => void', description: t('星数变化时触发。', 'Fires when the number of stars changes.') },
            { name: 'max', type: 'number', default: '5', description: t('总星数。', 'Total number of stars.') },
            { name: 'allowClear', type: 'boolean', default: 'true', description: t('再点一次当前的星可以清零。', 'Clicking the current star again clears the rating.') },
            { name: 'readOnly', type: 'boolean', description: t('只读：只展示，不可操作。', 'Read-only: display only, not interactive.') },
            { name: 'disabled', type: 'boolean', description: t('禁用。', 'Disabled.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'starLabel', type: '(n: number) => string', default: t('n => `${n} 星`', 'n => `${n} stars`'), description: t('每颗星的可读名称。', 'Accessible name of each star (“1 star”, “2 stars”…). The default follows the OinkProvider locale.') },
            { name: 'name', type: 'string', description: t('表单字段名：多渲染一个隐藏 input。', 'Form field name: renders an extra hidden input.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>可操作时是 <code>role="radiogroup"</code>，每颗星是 <code>role="radio"</code>，名称是“n 星”。整组一个 Tab 停靠点。</>,
            <><kbd>→</kbd> <kbd>↑</kbd> 加一星，<kbd>←</kbd> <kbd>↓</kbd> 减一星（到头循环）；<kbd>Home</kbd> / <kbd>End</kbd> 到一星 / 满星；<kbd>Space</kbd> / <kbd>Enter</kbd> 在当前星上再按一次可清零。</>,
            <>只读时是 <code>role="img"</code>，名称形如“用户评分：4 / 5”，不进入 Tab 顺序。</>,
            <>名称取 Field 的标签或 <code>aria-label</code>，都没有时默认叫“评分”。</>,
            <>星的填充靠实心 / 空心区分，不只靠颜色。</>,
          ], [
            <>When interactive it’s <code>role="radiogroup"</code> and each star is a <code>role="radio"</code> named “n stars”. The group is a single Tab stop.</>,
            <><kbd>→</kbd> <kbd>↑</kbd> add a star and <kbd>←</kbd> <kbd>↓</kbd> remove one (wrapping at the ends); <kbd>Home</kbd> / <kbd>End</kbd> go to one star / full marks; pressing <kbd>Space</kbd> / <kbd>Enter</kbd> again on the current star clears it.</>,
            <>Read-only, it’s <code>role="img"</code> with a name like “User rating: 4 of 5”, and stays out of the Tab order.</>,
            <>It’s named by the Field label or <code>aria-label</code>, or “Rating” by default.</>,
            <>Stars are told apart by filled / outlined shapes, not just color.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
