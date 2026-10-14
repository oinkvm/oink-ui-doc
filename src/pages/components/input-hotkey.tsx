import { useState } from 'react';
import { Button, Field, Hotkey, Inline, Kbd, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/hotkey', title: 'Hotkey 快捷键', group: '表单与操作', order: 150, subtitle: 'Hotkey · Kbd', en: { title: 'Hotkey', subtitle: 'Hotkey · Kbd' } };

function ControlledDemo() {
  const t = useT();
  const [combo, setCombo] = useState('Meta+Shift+K');
  return (
    <Stack gap={3} align="center">
      <Hotkey aria-label={t('打开命令面板的快捷键', 'Shortcut to open the command palette')} value={combo} onChange={(v) => setCombo(v)} />
      <Text tone="subtle" variant="caption">{t('value：', 'value: ')}{combo || t('（未设置）', '(not set)')}</Text>
      <Button size="sm" variant="ghost" onClick={() => setCombo('')} disabled={!combo}>{t('清除', 'Clear')}</Button>
    </Stack>
  );
}

const CONTROLLED_CODE = {
  zh: `
function ControlledDemo() {
  const [combo, setCombo] = useState('Meta+Shift+K');
  return (
    <Stack gap={3} align="center">
      <Hotkey aria-label="打开命令面板的快捷键" value={combo} onChange={(v) => setCombo(v)} />
      <Text tone="subtle" variant="caption">value：{combo || '（未设置）'}</Text>
      <Button size="sm" variant="ghost" onClick={() => setCombo('')} disabled={!combo}>清除</Button>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [combo, setCombo] = useState('Meta+Shift+K');
  return (
    <Stack gap={3} align="center">
      <Hotkey aria-label="Shortcut to open the command palette" value={combo} onChange={(v) => setCombo(v)} />
      <Text tone="subtle" variant="caption">value: {combo || '(not set)'}</Text>
      <Button size="sm" variant="ghost" onClick={() => setCombo('')} disabled={!combo}>Clear</Button>
    </Stack>
  );
}
`,
};

export default function HotkeyPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Hotkey 快捷键', 'Hotkey')}
      subtitle="Hotkey · Kbd"
      lead={t(
        'Hotkey 让用户录制一个组合键，用在“自定义快捷键”这类设置里。Kbd 是单个键帽，用来在文档、菜单和提示里展示按键。',
        'Hotkey lets people record a key combination, for settings like “custom shortcuts”. Kbd is a single keycap for showing keys in docs, menus and tooltips.',
      )}
    >
      <DocSection title={t('录制', 'Recording')} description={t(
        '点击或按 Enter / 空格开始录制，然后直接按下组合键。修饰键按下即显示，按下一个非修饰键后完成。Esc、Tab 或失焦取消，原来的值不变。',
        'Click or press Enter / Space to start recording, then press the combination. Modifiers appear as soon as they’re held, and recording finishes on the first non-modifier key. Esc, Tab or losing focus cancels and keeps the previous value.',
      )}>
        <Demo
          code={t(`
<Field label="全局搜索" hint="点击后按下新的组合键">
  <Hotkey defaultValue="Meta+K" />
</Field>
<Field label="未设置">
  <Hotkey />
</Field>
`, `
<Field label="Global search" hint="Click, then press a new combination">
  <Hotkey defaultValue="Meta+K" />
</Field>
<Field label="Not set">
  <Hotkey />
</Field>
`)}
        >
          <Field label={t('全局搜索', 'Global search')} hint={t('点击后按下新的组合键', 'Click, then press a new combination')}>
            <Hotkey defaultValue="Meta+K" />
          </Field>
          <Field label={t('未设置', 'Not set')}>
            <Hotkey />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸、文案与禁用', 'Sizes, text and disabled')}>
        <Demo
          code={t(`
<Hotkey size="sm" aria-label="小号" defaultValue="Control+B" />
<Hotkey size="md" aria-label="中号" defaultValue="Alt+Shift+F" />
<Hotkey size="lg" aria-label="大号" defaultValue="Meta+Enter" />
<Hotkey aria-label="自定义文案" placeholder="尚未绑定" recordingText="请按键…" />
<Hotkey aria-label="禁用" defaultValue="Meta+S" disabled />
`, `
<Hotkey size="sm" aria-label="Small" defaultValue="Control+B" />
<Hotkey size="md" aria-label="Medium" defaultValue="Alt+Shift+F" />
<Hotkey size="lg" aria-label="Large" defaultValue="Meta+Enter" />
<Hotkey aria-label="Custom text" placeholder="Not bound yet" recordingText="Press a key…" />
<Hotkey aria-label="Disabled" defaultValue="Meta+S" disabled />
`)}
        >
          <Hotkey size="sm" aria-label={t('小号', 'Small')} defaultValue="Control+B" />
          <Hotkey size="md" aria-label={t('中号', 'Medium')} defaultValue="Alt+Shift+F" />
          <Hotkey size="lg" aria-label={t('大号', 'Large')} defaultValue="Meta+Enter" />
          <Hotkey aria-label={t('自定义文案', 'Custom text')} placeholder={t('尚未绑定', 'Not bound yet')} recordingText={t('请按键…', 'Press a key…')} />
          <Hotkey aria-label={t('禁用', 'Disabled')} defaultValue="Meta+S" disabled />
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        'value 是用 + 连接的按键名（KeyboardEvent.key 的写法），空字符串表示未设置。onChange 的第二个参数是拆开的数组。组件只负责录制，不负责监听和触发快捷键。',
        'value is key names joined with + (as written by KeyboardEvent.key); an empty string means not set. onChange’s second argument is the keys as an array. The component only records; it doesn’t listen for or trigger the shortcut.',
      )}>
        <Demo code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('Kbd 键帽', 'Kbd keycaps')} description={t(
        '用 k 传按键名会自动换成符号（⌘ ⇧ ⌥ ⌃ ↩ …），并带上读屏能读出的名称；也可以直接写 children。',
        'Pass a key name as k and it becomes a symbol (⌘ ⇧ ⌥ ⌃ ↩ …) with a name screen readers can read; or just write children.',
      )}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={4}>
  <Inline gap={2}>
    <Kbd k="Meta" /><Kbd k="Shift" /><Kbd k="Alt" /><Kbd k="Control" />
    <Kbd k="Enter" /><Kbd k="Backspace" /><Kbd k="Tab" /><Kbd k="Escape" /><Kbd k="Space" />
    <Kbd k="ArrowUp" /><Kbd k="ArrowDown" /><Kbd k="ArrowLeft" /><Kbd k="ArrowRight" />
  </Inline>
  <Inline gap={2}>
    <Kbd size="sm">A</Kbd><Kbd size="md">A</Kbd><Kbd size="lg">A</Kbd>
  </Inline>
  <Text>按 <Kbd k="Meta" /> <Kbd>K</Kbd> 打开命令面板，按 <Kbd k="Escape" /> 关闭。</Text>
</Stack>
`, `
<Stack gap={4}>
  <Inline gap={2}>
    <Kbd k="Meta" /><Kbd k="Shift" /><Kbd k="Alt" /><Kbd k="Control" />
    <Kbd k="Enter" /><Kbd k="Backspace" /><Kbd k="Tab" /><Kbd k="Escape" /><Kbd k="Space" />
    <Kbd k="ArrowUp" /><Kbd k="ArrowDown" /><Kbd k="ArrowLeft" /><Kbd k="ArrowRight" />
  </Inline>
  <Inline gap={2}>
    <Kbd size="sm">A</Kbd><Kbd size="md">A</Kbd><Kbd size="lg">A</Kbd>
  </Inline>
  <Text>Press <Kbd k="Meta" /> <Kbd>K</Kbd> to open the command palette and <Kbd k="Escape" /> to close it.</Text>
</Stack>
`)}
        >
          <Stack gap={4}>
            <Inline gap={2}>
              <Kbd k="Meta" /><Kbd k="Shift" /><Kbd k="Alt" /><Kbd k="Control" />
              <Kbd k="Enter" /><Kbd k="Backspace" /><Kbd k="Tab" /><Kbd k="Escape" /><Kbd k="Space" />
              <Kbd k="ArrowUp" /><Kbd k="ArrowDown" /><Kbd k="ArrowLeft" /><Kbd k="ArrowRight" />
            </Inline>
            <Inline gap={2}>
              <Kbd size="sm">A</Kbd><Kbd size="md">A</Kbd><Kbd size="lg">A</Kbd>
            </Inline>
            {t(
              <Text>按 <Kbd k="Meta" /> <Kbd>K</Kbd> 打开命令面板，按 <Kbd k="Escape" /> 关闭。</Text>,
              <Text>Press <Kbd k="Meta" /> <Kbd>K</Kbd> to open the command palette and <Kbd k="Escape" /> to close it.</Text>,
            )}
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['录制中', '强调色描边 + 光环呼吸 1.6s · 不再叠加焦点环'],
            ['键帽', '逐个弹入 · 错峰 45ms · bouncy'],
          ], [
            ['Recording', 'Accent color stroke + 1.6s breathing halo · no extra focus ring'],
            ['Keycaps', 'Pop in one by one · 45ms stagger · bouncy'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Hotkey"
          rows={[
            { name: 'value', type: 'string', description: t('组合键（受控），用 + 连接，如 "Meta+Shift+K"；空字符串表示未设置。', 'The combination (controlled), joined with +, e.g. "Meta+Shift+K"; an empty string means not set.') },
            { name: 'defaultValue', type: 'string', default: "''", description: t('初始组合键（非受控）。', 'Initial combination (uncontrolled).') },
            { name: 'onChange', type: '(value: string, keys: string[]) => void', description: t('录到新的组合键时触发。', 'Fires when a new combination is recorded.') },
            { name: 'placeholder', type: 'string', default: t("'点击录制'", "'Click to record'"), description: t('未设置时的提示。', 'Prompt shown when not set. The default follows the OinkProvider locale.') },
            { name: 'recordingText', type: 'string', default: t("'按下组合键…'", "'Press keys…'"), description: t('录制中的提示。', 'Prompt shown while recording. The default follows the OinkProvider locale.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'disabled', type: 'boolean', description: t('禁用。', 'Disabled.') },
          ]}
        />
        <PropsTable
          title="Kbd"
          rows={[
            { name: 'k', type: 'string', description: t('按键名（Meta、Shift、Enter、ArrowUp、K…）：自动换成符号并带可读名称。', 'Key name (Meta, Shift, Enter, ArrowUp, K…): turned into a symbol with an accessible name.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('高度 20 / 默认 / 28。', 'Height 20 / default / 28.') },
            { name: 'children', type: 'ReactNode', description: t('不传 k 时直接显示的内容。', 'Content shown as-is when k isn’t passed.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>Hotkey 是 <code>role="button"</code>，用 <code>aria-pressed</code> 表示是否在录制；当前绑定（或“正在录制”）写在一个 aria-live 区域里并通过 <code>aria-describedby</code> 关联，读屏读的是“Command + K”而不是符号。</>,
            <><kbd>Enter</kbd> / <kbd>Space</kbd> 开始录制；录制中 <kbd>Esc</kbd> 取消、<kbd>Tab</kbd> 取消并照常移走焦点，其它按键都会被录下。</>,
            <>录制期间按键被拦下，不会冒泡到外层——在对话框里录制时按 <kbd>Esc</kbd> 只取消录制，不会关掉对话框。</>,
            <>必须有可读名称：放进带 label 的 Field，或给 <code>aria-label</code>。</>,
            <>Kbd 渲染成 <code>&lt;kbd&gt;</code>；符号外面包了带 title 的 <code>&lt;abbr&gt;</code>，悬停和部分读屏能得到按键的名字。</>,
          ], [
            <>Hotkey is <code>role="button"</code> and uses <code>aria-pressed</code> to show whether it’s recording; the current binding (or “recording”) lives in an aria-live region linked through <code>aria-describedby</code>, so screen readers say “Command + K” rather than the symbols.</>,
            <><kbd>Enter</kbd> / <kbd>Space</kbd> start recording; while recording, <kbd>Esc</kbd> cancels, <kbd>Tab</kbd> cancels and moves focus as usual, and every other key is recorded.</>,
            <>Keys are intercepted while recording and don’t bubble out, so pressing <kbd>Esc</kbd> while recording inside a dialog only cancels the recording and leaves the dialog open.</>,
            <>It must have an accessible name: put it in a labelled Field or give it an <code>aria-label</code>.</>,
            <>Kbd renders a <code>&lt;kbd&gt;</code>; symbols are wrapped in an <code>&lt;abbr&gt;</code> with a title, so hovering and some screen readers get the key name.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
