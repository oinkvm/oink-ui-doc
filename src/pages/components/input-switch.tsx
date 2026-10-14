import { useState } from 'react';
import { Field, Stack, Switch, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/switch', title: 'Switch 开关', group: '表单与操作', order: 90, subtitle: 'Switch', en: { title: 'Switch' } };

function ControlledDemo() {
  const t = useT();
  const [on, setOn] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Switch checked={on} onChange={setOn}>{t('勿扰模式', 'Do not disturb')}</Switch>
      <Text tone="subtle" variant="caption" role="status">{on ? t('已开启，通知将被静音', 'On, notifications are silenced') : t('已关闭', 'Off')}</Text>
    </Stack>
  );
}

const CONTROLLED_CODE = {
  zh: `
function ControlledDemo() {
  const [on, setOn] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Switch checked={on} onChange={setOn}>勿扰模式</Switch>
      <Text tone="subtle" variant="caption" role="status">{on ? '已开启，通知将被静音' : '已关闭'}</Text>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [on, setOn] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Switch checked={on} onChange={setOn}>Do not disturb</Switch>
      <Text tone="subtle" variant="caption" role="status">{on ? 'On, notifications are silenced' : 'Off'}</Text>
    </Stack>
  );
}
`,
};

export default function SwitchPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Switch 开关', 'Switch')}
      subtitle="Switch"
      lead={t(
        '打开或关闭一个立即生效的设置，比如“深色模式”“接收通知”。需要点“保存”才生效的选项用 Checkbox。',
        'Turns a setting on or off with immediate effect, such as “Dark mode” or “Receive notifications”. For options that only apply after clicking “Save”, use Checkbox.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        'children 是开关旁的文字，点文字同样可以切换。按住时滑块会拉伸，松开弹到另一侧。',
        'children is the label next to the switch, and clicking it toggles too. Holding the switch stretches the thumb; releasing springs it to the other side.',
      )}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={4}>
  <Switch defaultChecked>自动保存</Switch>
  <Switch>向所有人公开</Switch>
</Stack>
`, `
<Stack gap={4}>
  <Switch defaultChecked>Autosave</Switch>
  <Switch>Make public to everyone</Switch>
</Stack>
`)}
        >
          <Stack gap={4}>
            <Switch defaultChecked>{t('自动保存', 'Autosave')}</Switch>
            <Switch>{t('向所有人公开', 'Make public to everyone')}</Switch>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('没有可见文字', 'Without visible text')} description={t(
        '只有开关本身时必须给 aria-label，或者放进带标签的 Field（标签在上、开关在下，提示文字会一并关联）。',
        'A switch on its own must have an aria-label, or sit in a labelled Field (label on top, switch below, with the hint linked as well).',
      )}>
        <Demo
          code={t(`
<Switch aria-label="启用双重验证" />
<Field label="每周摘要" hint="每周一早上发到邮箱">
  <Switch defaultChecked />
</Field>
`, `
<Switch aria-label="Enable two-factor authentication" />
<Field label="Weekly digest" hint="Emailed every Monday morning">
  <Switch defaultChecked />
</Field>
`)}
        >
          <Switch aria-label={t('启用双重验证', 'Enable two-factor authentication')} />
          <Field label={t('每周摘要', 'Weekly digest')} hint={t('每周一早上发到邮箱', 'Emailed every Monday morning')}>
            <Switch defaultChecked />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('禁用', 'Disabled')} description={t(
        '禁用后轨道只剩描边、滑块变灰；开着的保留淡强调色，仍能看出状态。',
        'When disabled, the track keeps only its stroke and the thumb turns gray; a switch that’s on keeps a faint accent color so its state is still visible.',
      )}>
        <Demo
          code={t(`
<Switch disabled>关（禁用）</Switch>
<Switch disabled defaultChecked>开（禁用）</Switch>
`, `
<Switch disabled>Off (disabled)</Switch>
<Switch disabled defaultChecked>On (disabled)</Switch>
`)}
        >
          <Switch disabled>{t('关（禁用）', 'Off (disabled)')}</Switch>
          <Switch disabled defaultChecked>{t('开（禁用）', 'On (disabled)')}</Switch>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t('onChange 的参数是新的布尔值。', 'onChange is called with the new boolean.')}>
        <Demo code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['尺寸', '54 × 32 · 滑块 32 × 26'],
            ['按住', '滑块宽 32 → 38 · 150ms'],
            ['切换', '位移走弹簧'],
            ['禁用', '轨道只剩描边、滑块变灰；开着的保留淡强调色'],
          ], [
            ['Size', '54 × 32 · thumb 32 × 26'],
            ['Held', 'Thumb width 32 → 38 · 150ms'],
            ['Toggle', 'Movement uses a spring'],
            ['Disabled', 'Track keeps only its stroke, thumb turns gray; on keeps a faint accent color'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'checked', type: 'boolean', description: t('是否打开（受控）。', 'Whether it’s on (controlled).') },
            { name: 'defaultChecked', type: 'boolean', default: 'false', description: t('初始是否打开（非受控）。', 'Initially on (uncontrolled).') },
            { name: 'onChange', type: '(checked: boolean) => void', description: t('状态变化时触发，参数是新状态。', 'Fires with the new state when it changes.') },
            { name: 'children', type: 'ReactNode', description: t('开关旁的文字。', 'Label next to the switch.') },
            { name: 'disabled', type: 'boolean', description: t('禁用。', 'Disabled.') },
            { name: 'name / value', type: 'string', description: t('原生属性：放在表单里时，打开才会提交。', 'Native attributes: inside a form, submitted only when on.') },
            { name: 'rootClassName / rootStyle', type: 'string / CSSProperties', description: t('外层 <label> 的类名与样式。className / style 同样落在 <label> 上。', 'Class and style for the outer <label>. className / style also land on the <label>.') },
            { name: '…rest', type: 'InputHTMLAttributes', description: t('其余原生属性和 ref 落在 <input> 上。', 'Other native attributes and ref go to the <input>.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>是真的 <code>&lt;input type="checkbox" role="switch"&gt;</code>，读屏读作“开关，开 / 关”。</>,
            <><kbd>Tab</kbd> 聚焦，<kbd>Space</kbd> 切换。</>,
            <>必须有可读名称：写 children、给 <code>aria-label</code>，或放进带标签的 Field。</>,
            <>开关表示“立即生效”。切换后如果有异步请求，失败时要把状态拨回去并说明原因。</>,
            <>状态除了颜色还有滑块位置这第二种提示。</>,
          ], [
            <>It’s a real <code>&lt;input type="checkbox" role="switch"&gt;</code>, announced by screen readers as “switch, on / off”.</>,
            <><kbd>Tab</kbd> focuses it and <kbd>Space</kbd> toggles it.</>,
            <>It must have an accessible name: children, an <code>aria-label</code>, or a labelled Field around it.</>,
            <>A switch means “takes effect immediately”. If toggling triggers an async request that fails, flip the state back and explain why.</>,
            <>Besides color, the thumb’s position gives a second cue for the state.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
