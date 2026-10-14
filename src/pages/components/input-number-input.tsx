import { useState } from 'react';
import { Field, NumberInput, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/number-input', title: 'NumberInput 数字输入', group: '表单与操作', order: 40, subtitle: 'NumberInput', en: { title: 'NumberInput' } };

function ControlledDemo() {
  const t = useT();
  const [qty, setQty] = useState(2);
  return (
    <Stack gap={3} align="center">
      <NumberInput aria-label={t('购买数量', 'Quantity')} value={qty} onChange={setQty} min={1} max={10} />
      <Text tone="subtle" variant="caption">{t(`小计：¥${(qty * 39).toFixed(2)}`, `Subtotal: $${(qty * 39).toFixed(2)}`)}</Text>
    </Stack>
  );
}

const CONTROLLED_CODE = {
  zh: `
function ControlledDemo() {
  const [qty, setQty] = useState(2);
  return (
    <Stack gap={3} align="center">
      <NumberInput aria-label="购买数量" value={qty} onChange={setQty} min={1} max={10} />
      <Text tone="subtle" variant="caption">小计：¥{(qty * 39).toFixed(2)}</Text>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [qty, setQty] = useState(2);
  return (
    <Stack gap={3} align="center">
      <NumberInput aria-label="Quantity" value={qty} onChange={setQty} min={1} max={10} />
      <Text tone="subtle" variant="caption">Subtotal: \${(qty * 39).toFixed(2)}</Text>
    </Stack>
  );
}
`,
};

export default function NumberInputPage() {
  const t = useT();
  return (
    <DocPage
      title={t('NumberInput 数字输入', 'NumberInput')}
      subtitle="NumberInput"
      lead={t(
        '输入一个可以加减的数字：数量、人数、间距。范围很大或者不需要逐步加减的数字（金额、电话）用 Input；要在一个范围里大致选个值用 Slider。',
        'Enter a number that can be stepped up and down: a quantity, a head count, a spacing. For numbers with a huge range or no need for stepping (amounts, phone numbers) use Input; to pick a rough value within a range use Slider.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '两侧按钮加减一步，按住连发；也可以直接输入，失焦或按 Enter 时落成数值。到达上下限时数字朝该方向轻推一下表示“不行”。',
        'The buttons on either side step by one, repeating while held; you can also type, and the text becomes a number on blur or Enter. At a limit, the number nudges in that direction to say “no further”.',
      )}>
        <Demo
          code={t(`
<NumberInput aria-label="数量" defaultValue={1} min={0} max={5} />
`, `
<NumberInput aria-label="Quantity" defaultValue={1} min={0} max={5} />
`)}
        >
          <NumberInput aria-label={t('数量', 'Quantity')} defaultValue={1} min={0} max={5} />
        </Demo>
      </DocSection>

      <DocSection title={t('步长、精度与格式', 'Step, precision and format')} description={t(
        'precision 默认取步长的小数位。format 只影响失焦时的显示，同时用作读屏的 aria-valuetext；聚焦后恢复成纯数字方便编辑。',
        'precision defaults to the step’s decimal places. format only affects the display when not focused and doubles as aria-valuetext for screen readers; on focus it goes back to a plain number for editing.',
      )}>
        <Demo
          code={t(`
<Field label="透明度" hint="步长 0.05">
  <NumberInput defaultValue={0.5} min={0} max={1} step={0.05} />
</Field>
<Field label="字号" hint="步长 2，PageUp 一次加 8">
  <NumberInput defaultValue={16} min={8} max={72} step={2} largeStep={8} format={(v) => v + ' px'} />
</Field>
<Field label="折扣">
  <NumberInput defaultValue={15} min={0} max={100} step={5} format={(v) => v + '%'} />
</Field>
`, `
<Field label="Opacity" hint="Step 0.05">
  <NumberInput defaultValue={0.5} min={0} max={1} step={0.05} />
</Field>
<Field label="Font size" hint="Step 2; PageUp adds 8">
  <NumberInput defaultValue={16} min={8} max={72} step={2} largeStep={8} format={(v) => v + ' px'} />
</Field>
<Field label="Discount">
  <NumberInput defaultValue={15} min={0} max={100} step={5} format={(v) => v + '%'} />
</Field>
`)}
        >
          <Field label={t('透明度', 'Opacity')} hint={t('步长 0.05', 'Step 0.05')}>
            <NumberInput defaultValue={0.5} min={0} max={1} step={0.05} />
          </Field>
          <Field label={t('字号', 'Font size')} hint={t('步长 2，PageUp 一次加 8', 'Step 2; PageUp adds 8')}>
            <NumberInput defaultValue={16} min={8} max={72} step={2} largeStep={8} format={(v) => v + ' px'} />
          </Field>
          <Field label={t('折扣', 'Discount')}>
            <NumberInput defaultValue={15} min={0} max={100} step={5} format={(v) => v + '%'} />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')}>
        <Demo
          code={t(`
<NumberInput size="sm" aria-label="小号" defaultValue={1} />
<NumberInput size="md" aria-label="中号" defaultValue={2} />
<NumberInput size="lg" aria-label="大号" defaultValue={3} />
`, `
<NumberInput size="sm" aria-label="Small" defaultValue={1} />
<NumberInput size="md" aria-label="Medium" defaultValue={2} />
<NumberInput size="lg" aria-label="Large" defaultValue={3} />
`)}
        >
          <NumberInput size="sm" aria-label={t('小号', 'Small')} defaultValue={1} />
          <NumberInput size="md" aria-label={t('中号', 'Medium')} defaultValue={2} />
          <NumberInput size="lg" aria-label={t('大号', 'Large')} defaultValue={3} />
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')}>
        <Demo
          code={t(`
<NumberInput disabled aria-label="禁用" defaultValue={4} />
<NumberInput readOnly aria-label="只读" defaultValue={4} />
<Field label="人数" error="最少 2 人成团">
  <NumberInput defaultValue={1} min={0} />
</Field>
`, `
<NumberInput disabled aria-label="Disabled" defaultValue={4} />
<NumberInput readOnly aria-label="Read-only" defaultValue={4} />
<Field label="Group size" error="Groups need at least 2 people">
  <NumberInput defaultValue={1} min={0} />
</Field>
`)}
        >
          <NumberInput disabled aria-label={t('禁用', 'Disabled')} defaultValue={4} />
          <NumberInput readOnly aria-label={t('只读', 'Read-only')} defaultValue={4} />
          <Field label={t('人数', 'Group size')} error={t('最少 2 人成团', 'Groups need at least 2 people')}>
            <NumberInput defaultValue={1} min={0} />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        'onChange 的参数是已经按精度取整、并限制在 min / max 之间的数值。',
        'onChange receives a number already rounded to the precision and clamped between min / max.',
      )}>
        <Demo code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['步进', '旧值滑出，新值 spring 滑入，方向随加减而定'],
            ['越界', '数值朝该方向轻推 6px 再弹回'],
            ['连发', '按住 400ms 后每 60ms 走一步，到头自动停'],
          ], [
            ['Step', 'Old value slides out, new value springs in, direction set by up / down'],
            ['Limit', 'Number nudges 6px in that direction and springs back'],
            ['Repeat', 'After holding 400ms, one step every 60ms; stops at the limit'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'value', type: 'number', description: t('当前值（受控）。', 'Current value (controlled).') },
            { name: 'defaultValue', type: 'number', default: '0', description: t('初始值（非受控），会先限制到范围内。', 'Initial value (uncontrolled), clamped to the range first.') },
            { name: 'onChange', type: '(value: number) => void', description: t('值变化时触发，参数是新值。', 'Fires with the new value when it changes.') },
            { name: 'min', type: 'number', default: '-Infinity', description: t('下限。', 'Lower limit.') },
            { name: 'max', type: 'number', default: 'Infinity', description: t('上限。', 'Upper limit.') },
            { name: 'step', type: 'number', default: '1', description: t('步长。', 'Step.') },
            { name: 'largeStep', type: 'number', default: 'step × 10', description: t('PageUp / PageDown 的步长。', 'Step for PageUp / PageDown.') },
            { name: 'precision', type: 'number', default: t('步长的小数位', 'decimals of step'), description: t('保留的小数位。', 'Decimal places to keep.') },
            { name: 'format', type: '(value: number) => string', description: t('失焦时的显示格式，同时用作 aria-valuetext。', 'Display format when not focused; also used as aria-valuetext.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'invalid', type: 'boolean', description: t('校验失败。在 Field 里默认跟随 Field。', 'Failed validation. Inside a Field it follows the Field by default.') },
            { name: 'decrementLabel', type: 'string', default: t("'减少'", "'Decrease'"), description: t('减号按钮的可读名称。', 'Accessible name of the minus button. The default follows the OinkProvider locale.') },
            { name: 'incrementLabel', type: 'string', default: t("'增加'", "'Increase'"), description: t('加号按钮的可读名称。', 'Accessible name of the plus button. The default follows the OinkProvider locale.') },
            { name: 'rootClassName / rootStyle', type: 'string / CSSProperties', description: t('外框的类名与样式。className / style 同样落在外框上。', 'Class and style for the outer frame. className / style also land on the frame.') },
            { name: '…rest', type: 'InputHTMLAttributes', description: t('其余原生属性（disabled、readOnly、name…）和 ref 落在 <input role="spinbutton"> 上。', 'Other native attributes (disabled, readOnly, name…) and ref go to the <input role="spinbutton">.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>输入框是 <code>role="spinbutton"</code>，带 <code>aria-valuenow</code> / <code>aria-valuemin</code> / <code>aria-valuemax</code>；有 format 时读屏读格式化后的文字。</>,
            <><kbd>↑</kbd> / <kbd>↓</kbd> 加减一步；<kbd>PageUp</kbd> / <kbd>PageDown</kbd> 加减一大步；设置了 min / max 时 <kbd>Home</kbd> / <kbd>End</kbd> 跳到两端；<kbd>Enter</kbd> 把输入的文字落成数值。</>,
            <>加减按钮不在 Tab 顺序里（键盘用方向键即可），但有可读名称，读屏的虚拟光标可以点到；到头时为 <code>aria-disabled</code>。</>,
            <>输入的不是数字时，失焦后退回原值，不会报错。</>,
            <>必须有可读名称：放进带 label 的 Field，或给 <code>aria-label</code>。</>,
          ], [
            <>The input is <code>role="spinbutton"</code> with <code>aria-valuenow</code> / <code>aria-valuemin</code> / <code>aria-valuemax</code>; with format set, screen readers read the formatted text.</>,
            <><kbd>↑</kbd> / <kbd>↓</kbd> step by one; <kbd>PageUp</kbd> / <kbd>PageDown</kbd> take a large step; with min / max set, <kbd>Home</kbd> / <kbd>End</kbd> jump to either end; <kbd>Enter</kbd> turns typed text into a number.</>,
            <>The plus / minus buttons aren’t in the Tab order (arrow keys cover the keyboard), but they have accessible names and a screen reader’s virtual cursor can reach them; at a limit they’re <code>aria-disabled</code>.</>,
            <>Text that isn’t a number reverts to the previous value on blur, without an error.</>,
            <>It must have an accessible name: put it in a labelled Field or give it an <code>aria-label</code>.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
