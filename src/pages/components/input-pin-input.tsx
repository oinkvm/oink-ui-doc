import { useState } from 'react';
import { Button, Field, PinInput, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/pin-input', title: 'PinInput 验证码输入', group: '表单与操作', order: 50, subtitle: 'PinInput', en: { title: 'PinInput' } };

function VerifyDemo() {
  const t = useT();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const check = (v: string) => setStatus(v === '246810' ? 'ok' : 'bad');
  return (
    <Stack gap={3} align="center">
      <Field label={t('短信验证码', 'SMS code')} hint={t('试试 246810', 'Try 246810')} error={status === 'bad' ? t('验证码不正确', 'That code isn’t right') : undefined}>
        <PinInput value={code} onChange={(v) => { setCode(v); setStatus('idle'); }} onComplete={check} />
      </Field>
      <Text tone={status === 'ok' ? 'success' : 'subtle'} variant="caption" role="status">
        {status === 'ok' ? t('验证通过', 'Verified') : t(`已输入 ${code.length} / 6 位`, `${code.length} / 6 entered`)}
      </Text>
      <Button size="sm" variant="ghost" onClick={() => { setCode(''); setStatus('idle'); }}>{t('清空', 'Clear')}</Button>
    </Stack>
  );
}

const VERIFY_CODE = {
  zh: `
function VerifyDemo() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const check = (v: string) => setStatus(v === '246810' ? 'ok' : 'bad');
  return (
    <Stack gap={3} align="center">
      <Field label="短信验证码" hint="试试 246810" error={status === 'bad' ? '验证码不正确' : undefined}>
        <PinInput value={code} onChange={(v) => { setCode(v); setStatus('idle'); }} onComplete={check} />
      </Field>
      <Text tone={status === 'ok' ? 'success' : 'subtle'} variant="caption" role="status">
        {status === 'ok' ? '验证通过' : \`已输入 \${code.length} / 6 位\`}
      </Text>
      <Button size="sm" variant="ghost" onClick={() => { setCode(''); setStatus('idle'); }}>清空</Button>
    </Stack>
  );
}
`,
  en: `
function VerifyDemo() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'ok' | 'bad'>('idle');
  const check = (v: string) => setStatus(v === '246810' ? 'ok' : 'bad');
  return (
    <Stack gap={3} align="center">
      <Field label="SMS code" hint="Try 246810" error={status === 'bad' ? 'That code isn’t right' : undefined}>
        <PinInput value={code} onChange={(v) => { setCode(v); setStatus('idle'); }} onComplete={check} />
      </Field>
      <Text tone={status === 'ok' ? 'success' : 'subtle'} variant="caption" role="status">
        {status === 'ok' ? 'Verified' : \`\${code.length} / 6 entered\`}
      </Text>
      <Button size="sm" variant="ghost" onClick={() => { setCode(''); setStatus('idle'); }}>Clear</Button>
    </Stack>
  );
}
`,
};

export default function PinInputPage() {
  const t = useT();
  return (
    <DocPage
      title={t('PinInput 验证码输入', 'PinInput')}
      subtitle="PinInput"
      lead={t(
        '输入固定位数的一次性验证码或 PIN。一格一位，支持整段粘贴和短信自动填充。位数不固定的内容请用 Input。',
        'Enter a fixed-length one-time code or PIN. One character per box, with support for pasting the whole code and SMS autofill. For content of varying length, use Input.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '默认 6 位、只收数字。打一位自动跳到下一格，退格回到上一格；在任意一格粘贴整段验证码都会依次填入。',
        'Six digits by default, numbers only. Typing a character moves to the next box and Backspace goes back; pasting a full code into any box fills them all in order.',
      )}>
        <Demo
          code={t(`
<PinInput aria-label="验证码" />
`, `
<PinInput aria-label="Verification code" />
`)}
        >
          <PinInput aria-label={t('验证码', 'Verification code')} />
        </Demo>
      </DocSection>

      <DocSection title={t('位数、类型与遮罩', 'Length, type and masking')}>
        <Demo
          layout="col"
          align="center"
          code={t(`
<Stack gap={5} align="center">
  <Field label="4 位数字 PIN">
    <PinInput length={4} />
  </Field>
  <Field label="字母数字混合">
    <PinInput length={5} type="alphanumeric" defaultValue="A7" />
  </Field>
  <Field label="遮罩（支付密码）">
    <PinInput length={6} mask defaultValue="1234" />
  </Field>
</Stack>
`, `
<Stack gap={5} align="center">
  <Field label="4-digit PIN">
    <PinInput length={4} />
  </Field>
  <Field label="Letters and numbers">
    <PinInput length={5} type="alphanumeric" defaultValue="A7" />
  </Field>
  <Field label="Masked (payment PIN)">
    <PinInput length={6} mask defaultValue="1234" />
  </Field>
</Stack>
`)}
        >
          <Stack gap={5} align="center">
            <Field label={t('4 位数字 PIN', '4-digit PIN')}>
              <PinInput length={4} />
            </Field>
            <Field label={t('字母数字混合', 'Letters and numbers')}>
              <PinInput length={5} type="alphanumeric" defaultValue="A7" />
            </Field>
            <Field label={t('遮罩（支付密码）', 'Masked (payment PIN)')}>
              <PinInput length={6} mask defaultValue="1234" />
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸与状态', 'Sizes and states')}>
        <Demo
          layout="col"
          align="center"
          code={t(`
<Stack gap={4} align="center">
  <PinInput size="sm" length={4} aria-label="小号" />
  <PinInput length={4} aria-label="禁用" disabled defaultValue="12" />
  <PinInput length={4} aria-label="校验失败" invalid defaultValue="0000" />
</Stack>
`, `
<Stack gap={4} align="center">
  <PinInput size="sm" length={4} aria-label="Small" />
  <PinInput length={4} aria-label="Disabled" disabled defaultValue="12" />
  <PinInput length={4} aria-label="Invalid" invalid defaultValue="0000" />
</Stack>
`)}
        >
          <Stack gap={4} align="center">
            <PinInput size="sm" length={4} aria-label={t('小号', 'Small')} />
            <PinInput length={4} aria-label={t('禁用', 'Disabled')} disabled defaultValue="12" />
            <PinInput length={4} aria-label={t('校验失败', 'Invalid')} invalid defaultValue="0000" />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        'value 是已输入字符连成的字符串。onComplete 在输满的那一下触发，适合直接发起校验。',
        'value is the entered characters joined into a string. onComplete fires the moment every box is filled, a good point to start verification.',
      )}>
        <Demo code={t(VERIFY_CODE.zh, VERIFY_CODE.en)}>
          <VerifyDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'length', type: 'number', default: '6', description: t('位数。', 'Number of characters.') },
            { name: 'value', type: 'string', description: t('当前值（受控）。', 'Current value (controlled).') },
            { name: 'defaultValue', type: 'string', default: "''", description: t('初始值（非受控）。', 'Initial value (uncontrolled).') },
            { name: 'onChange', type: '(value: string) => void', description: t('值变化时触发。', 'Fires when the value changes.') },
            { name: 'onComplete', type: '(value: string) => void', description: t('输满时触发。', 'Fires when every box is filled.') },
            { name: 'type', type: "'numeric' | 'alphanumeric'", default: "'numeric'", description: t('numeric 只收数字并唤起数字键盘；alphanumeric 收字母和数字。', 'numeric accepts digits only and brings up the numeric keypad; alphanumeric accepts letters and digits.') },
            { name: 'mask', type: 'boolean', description: t('用圆点遮住内容。', 'Hide the content behind dots.') },
            { name: 'size', type: "'sm' | 'md'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'disabled', type: 'boolean', description: t('禁用全部格子。', 'Disable every box.') },
            { name: 'invalid', type: 'boolean', description: t('校验失败。在 Field 里默认跟随 Field。', 'Failed validation. Inside a Field it follows the Field by default.') },
            { name: 'required', type: 'boolean', description: t('必填（每格带 aria-required）。', 'Required (each box carries aria-required).') },
            { name: 'autoFocus', type: 'boolean', description: t('挂载后聚焦第一格。', 'Focus the first box on mount.') },
            { name: 'name', type: 'string', description: t('表单字段名：多渲染一个隐藏 input 提交完整的值。', 'Form field name: renders an extra hidden input that submits the full value.') },
            { name: '…rest', type: 'HTMLAttributes<HTMLDivElement>', description: t('其余属性和 ref 落在外层 role="group" 上。', 'Other attributes and ref go to the outer role="group".') },
          ]}
        />
        <A11yNotes
          items={t([
            <>外层是 <code>role="group"</code>，名称取 Field 的标签或 <code>aria-label</code>，都没有时默认叫“验证码”。每一格是独立的文本框，名称是“第 n 位，共 N 位”。</>,
            <><kbd>←</kbd> / <kbd>→</kbd> 在格子间移动；<kbd>Home</kbd> 到第一格，<kbd>End</kbd> 到已输入内容的末尾；<kbd>Backspace</kbd> 在空格子里会删掉前一位并退回去。</>,
            <>第一格带 <code>autocomplete="one-time-code"</code>，手机收到短信后可以一键填入；粘贴时自动丢掉不合法的字符。</>,
            <>聚焦某一格会选中其中的字符，直接打字即可覆盖。</>,
            <>错误信息请放在 Field 的 error 里，它会通过 aria-live 播报；不要只靠格子变红。</>,
          ], [
            <>The wrapper is <code>role="group"</code>, named by the Field label or <code>aria-label</code>, or “Verification code” by default (following the OinkProvider locale). Each box is its own text box named “Digit n of N”.</>,
            <><kbd>←</kbd> / <kbd>→</kbd> move between boxes; <kbd>Home</kbd> goes to the first box and <kbd>End</kbd> to the end of what’s entered; <kbd>Backspace</kbd> in an empty box deletes the previous character and moves back.</>,
            <>The first box has <code>autocomplete="one-time-code"</code>, so phones can fill in a code from an SMS with one tap; invalid characters are dropped on paste.</>,
            <>Focusing a box selects its character, so typing replaces it.</>,
            <>Put error messages in the Field’s error, which is announced via aria-live; don’t rely on the boxes turning red alone.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
