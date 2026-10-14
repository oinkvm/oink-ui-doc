import { useState } from 'react';
import { Field, Input, SearchInput, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/input', title: 'Input 输入框', group: '表单与操作', order: 20, subtitle: 'Input · SearchInput', en: { title: 'Input', subtitle: 'Input · SearchInput' } };

const box = { width: '100%', maxWidth: 360 };

function ControlledDemo() {
  const t = useT();
  const [name, setName] = useState('oink');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <Input aria-label={t('用户名', 'Username')} value={name} onChange={setName} clearable />
      <Text tone="subtle" variant="caption">{t('长度：', 'Length: ')}{name.length}</Text>
    </Stack>
  );
}

function SearchDemo() {
  const t = useT();
  const [query, setQuery] = useState('');
  const [last, setLast] = useState('');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <SearchInput aria-label={t('搜索文档', 'Search docs')} value={query} onChange={setQuery} onSearch={setLast} />
      <Text tone="subtle" variant="caption">
        {last ? t(`上次搜索：${last}`, `Last search: ${last}`) : t('输入后按 Enter 搜索，Esc 清空', 'Type, then press Enter to search or Esc to clear')}
      </Text>
    </Stack>
  );
}

const CONTROLLED_CODE = {
  zh: `
function ControlledDemo() {
  const [name, setName] = useState('oink');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <Input aria-label="用户名" value={name} onChange={setName} clearable />
      <Text tone="subtle" variant="caption">长度：{name.length}</Text>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [name, setName] = useState('oink');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <Input aria-label="Username" value={name} onChange={setName} clearable />
      <Text tone="subtle" variant="caption">Length: {name.length}</Text>
    </Stack>
  );
}
`,
};

const SEARCH_CODE = {
  zh: `
function SearchDemo() {
  const [query, setQuery] = useState('');
  const [last, setLast] = useState('');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <SearchInput aria-label="搜索文档" value={query} onChange={setQuery} onSearch={setLast} />
      <Text tone="subtle" variant="caption">{last ? \`上次搜索：\${last}\` : '输入后按 Enter 搜索，Esc 清空'}</Text>
    </Stack>
  );
}
`,
  en: `
function SearchDemo() {
  const [query, setQuery] = useState('');
  const [last, setLast] = useState('');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
      <SearchInput aria-label="Search docs" value={query} onChange={setQuery} onSearch={setLast} />
      <Text tone="subtle" variant="caption">{last ? \`Last search: \${last}\` : 'Type, then press Enter to search or Esc to clear'}</Text>
    </Stack>
  );
}
`,
};

export default function InputPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Input 输入框', 'Input')}
      subtitle="Input · SearchInput"
      lead={t(
        '收集一行文字：姓名、邮箱、密码、搜索词。多行内容用 Textarea，数字用 NumberInput，从固定选项里挑用 Select。',
        'Collects a single line of text: a name, an email, a password, a search query. For multiple lines use Textarea, for numbers NumberInput, and for a fixed set of options Select.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '输入框本身没有可见标签。要么放进 Field（推荐，自动接好标签、提示和错误），要么给 aria-label。',
        'The input has no visible label of its own. Either put it in a Field (recommended; label, hint and error are wired up for you) or give it an aria-label.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={4} style={{ width: '100%', maxWidth: 360 }}>
  <Field label="邮箱" hint="用于接收通知">
    <Input type="email" placeholder="you@example.com" />
  </Field>
  <Input aria-label="昵称" placeholder="不放进 Field 时给 aria-label" />
</Stack>
`, `
<Stack gap={4} style={{ width: '100%', maxWidth: 360 }}>
  <Field label="Email" hint="For notifications">
    <Input type="email" placeholder="you@example.com" />
  </Field>
  <Input aria-label="Nickname" placeholder="Outside a Field, give it an aria-label" />
</Stack>
`)}
        >
          <Stack gap={4} style={box}>
            <Field label={t('邮箱', 'Email')} hint={t('用于接收通知', 'For notifications')}>
              <Input type="email" placeholder="you@example.com" />
            </Field>
            <Input aria-label={t('昵称', 'Nickname')} placeholder={t('不放进 Field 时给 aria-label', 'Outside a Field, give it an aria-label')} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸与形状', 'Sizes and shape')} description={t(
        '高度和按钮一致：32 / 40 / 48。pill 变成全圆；block 默认开启，关掉后变成行内宽度。',
        'Heights match buttons: 32 / 40 / 48. pill makes it fully rounded; block is on by default, and turning it off gives an inline width.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
  <Input size="sm" aria-label="小号" placeholder="小号 32" />
  <Input size="md" aria-label="中号" placeholder="中号 40" />
  <Input size="lg" aria-label="大号" placeholder="大号 48" />
  <Input pill aria-label="全圆" placeholder="全圆" />
  <Input block={false} aria-label="行内" placeholder="行内宽度" />
</Stack>
`, `
<Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
  <Input size="sm" aria-label="Small" placeholder="Small 32" />
  <Input size="md" aria-label="Medium" placeholder="Medium 40" />
  <Input size="lg" aria-label="Large" placeholder="Large 48" />
  <Input pill aria-label="Pill" placeholder="Pill" />
  <Input block={false} aria-label="Inline" placeholder="Inline width" />
</Stack>
`)}
        >
          <Stack gap={3} style={box}>
            <Input size="sm" aria-label={t('小号', 'Small')} placeholder={t('小号 32', 'Small 32')} />
            <Input size="md" aria-label={t('中号', 'Medium')} placeholder={t('中号 40', 'Medium 40')} />
            <Input size="lg" aria-label={t('大号', 'Large')} placeholder={t('大号 48', 'Large 48')} />
            <Input pill aria-label={t('全圆', 'Pill')} placeholder={t('全圆', 'Pill')} />
            <Input block={false} aria-label={t('行内', 'Inline')} placeholder={t('行内宽度', 'Inline width')} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('图标、前后缀与附加按钮', 'Icons, affixes and extra buttons')}>
        <Demo
          layout="col"
          description={t(
            'icon 是前置图标，聚焦时变强调色并放大。prefix / suffix 放单位或固定文字，它们不计入可读名称。clearable 在有内容时显示清除按钮；type="password" 自带显示 / 隐藏按钮。',
            'icon is a leading icon that turns the accent color and grows on focus. prefix / suffix hold units or fixed text and aren’t part of the accessible name. clearable shows a clear button when there’s content; type="password" comes with a show / hide button.',
          )}
          code={t(`
<Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
  <Input icon="mail" type="email" aria-label="邮箱" placeholder="you@example.com" />
  <Input prefix="https://" suffix=".oink.dev" aria-label="站点地址" defaultValue="docs" />
  <Input suffix="元" inputMode="decimal" aria-label="金额" defaultValue="128.00" />
  <Input clearable aria-label="标签" defaultValue="可以一键清除" />
  <Input type="password" aria-label="密码" defaultValue="correct horse" />
  <Input type="password" revealable={false} aria-label="密码（不可查看）" defaultValue="secret" />
</Stack>
`, `
<Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
  <Input icon="mail" type="email" aria-label="Email" placeholder="you@example.com" />
  <Input prefix="https://" suffix=".oink.dev" aria-label="Site address" defaultValue="docs" />
  <Input suffix="USD" inputMode="decimal" aria-label="Amount" defaultValue="128.00" />
  <Input clearable aria-label="Tag" defaultValue="Clear me in one click" />
  <Input type="password" aria-label="Password" defaultValue="correct horse" />
  <Input type="password" revealable={false} aria-label="Password (can’t be shown)" defaultValue="secret" />
</Stack>
`)}
        >
          <Stack gap={3} style={box}>
            <Input icon="mail" type="email" aria-label={t('邮箱', 'Email')} placeholder="you@example.com" />
            <Input prefix="https://" suffix=".oink.dev" aria-label={t('站点地址', 'Site address')} defaultValue="docs" />
            <Input suffix={t('元', 'USD')} inputMode="decimal" aria-label={t('金额', 'Amount')} defaultValue="128.00" />
            <Input clearable aria-label={t('标签', 'Tag')} defaultValue={t('可以一键清除', 'Clear me in one click')} />
            <Input type="password" aria-label={t('密码', 'Password')} defaultValue="correct horse" />
            <Input type="password" revealable={false} aria-label={t('密码（不可查看）', 'Password (can’t be shown)')} defaultValue="secret" />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')}>
        <Demo
          layout="col"
          description={t(
            'invalid 只负责标红和 aria-invalid；错误文字交给 Field 的 error，它会展开并通过 aria-live 播报。',
            'invalid only handles the red state and aria-invalid; leave the error message to Field’s error, which expands and is announced via aria-live.',
          )}
          code={t(`
<Stack gap={4} style={{ width: '100%', maxWidth: 360 }}>
  <Input disabled aria-label="禁用" defaultValue="不可编辑" />
  <Input readOnly aria-label="只读" defaultValue="只读，可以选中复制" />
  <Input invalid aria-label="校验失败" defaultValue="not-an-email" />
  <Field label="邮箱" error="邮箱格式不正确">
    <Input type="email" defaultValue="not-an-email" />
  </Field>
</Stack>
`, `
<Stack gap={4} style={{ width: '100%', maxWidth: 360 }}>
  <Input disabled aria-label="Disabled" defaultValue="Not editable" />
  <Input readOnly aria-label="Read-only" defaultValue="Read-only, but you can select and copy" />
  <Input invalid aria-label="Invalid" defaultValue="not-an-email" />
  <Field label="Email" error="That doesn’t look like an email address">
    <Input type="email" defaultValue="not-an-email" />
  </Field>
</Stack>
`)}
        >
          <Stack gap={4} style={box}>
            <Input disabled aria-label={t('禁用', 'Disabled')} defaultValue={t('不可编辑', 'Not editable')} />
            <Input readOnly aria-label={t('只读', 'Read-only')} defaultValue={t('只读，可以选中复制', 'Read-only, but you can select and copy')} />
            <Input invalid aria-label={t('校验失败', 'Invalid')} defaultValue="not-an-email" />
            <Field label={t('邮箱', 'Email')} error={t('邮箱格式不正确', 'That doesn’t look like an email address')}>
              <Input type="email" defaultValue="not-an-email" />
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t('onChange 的第一个参数是新值（字符串），不是事件。', 'onChange’s first argument is the new value (a string), not an event.')}>
        <Demo layout="col" code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('搜索框', 'Search input')} description={t(
        'SearchInput 是预设好的 Input：全圆、带放大镜和清除按钮、type="search"。Enter 触发 onSearch，Esc 清空。',
        'SearchInput is a preconfigured Input: pill-shaped, with a magnifier and a clear button, type="search". Enter fires onSearch and Esc clears it.',
      )}>
        <Demo layout="col" code={t(SEARCH_CODE.zh, SEARCH_CODE.en)}>
          <SearchDemo />
        </Demo>
        <Demo
          title={t('尺寸与禁用', 'Sizes and disabled')}
          layout="col"
          code={t(`
<Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
  <SearchInput size="sm" aria-label="搜索（小）" />
  <SearchInput size="lg" aria-label="搜索（大）" placeholder="搜索组件…" />
  <SearchInput disabled aria-label="搜索（禁用）" />
</Stack>
`, `
<Stack gap={3} style={{ width: '100%', maxWidth: 360 }}>
  <SearchInput size="sm" aria-label="Search (small)" />
  <SearchInput size="lg" aria-label="Search (large)" placeholder="Search components…" />
  <SearchInput disabled aria-label="Search (disabled)" />
</Stack>
`)}
        >
          <Stack gap={3} style={box}>
            <SearchInput size="sm" aria-label={t('搜索（小）', 'Search (small)')} />
            <SearchInput size="lg" aria-label={t('搜索（大）', 'Search (large)')} placeholder={t('搜索组件…', 'Search components…')} />
            <SearchInput disabled aria-label={t('搜索（禁用）', 'Search (disabled)')} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['尺寸', '高 40，大号 48，和按钮等高 · 圆角 14 / 全圆'],
            ['聚焦', '边框变强调色 · 240ms ease-out，无光晕'],
            ['图标', '聚焦时变强调色并放大 1.1× · bouncy'],
            ['校验', '失败时抖动 + 提示高度展开（配合 Field）'],
          ], [
            ['Size', 'Height 40, large 48, same as buttons · corner radius 14 / pill'],
            ['Focus', 'Border turns the accent color · 240ms ease-out, no glow'],
            ['Icon', 'Turns the accent color and grows 1.1× on focus · bouncy'],
            ['Validation', 'Shakes on failure + message height expands (with Field)'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Input"
          rows={[
            { name: 'value', type: 'string', description: t('当前值（受控）。', 'Current value (controlled).') },
            { name: 'defaultValue', type: 'string', default: "''", description: t('初始值（非受控）。', 'Initial value (uncontrolled).') },
            { name: 'onChange', type: '(value: string) => void', description: t('值变化时触发，参数是新值。', 'Fires with the new value when it changes.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('高度 32 / 40 / 48。', 'Height 32 / 40 / 48.') },
            { name: 'type', type: 'string', default: "'text'", description: t('原生 input 类型。password 会带显示 / 隐藏按钮。', 'Native input type. password comes with a show / hide button.') },
            { name: 'pill', type: 'boolean', description: t('全圆。', 'Pill-shaped.') },
            { name: 'block', type: 'boolean', default: 'true', description: t('撑满容器宽度；false 时为行内宽度。', 'Fill the container width; false gives an inline width.') },
            { name: 'icon', type: 'IconName', description: t('前置的内置图标。', 'Built-in leading icon.') },
            { name: 'prefix', type: 'ReactNode', description: t('前缀插槽（单位、文字、图标）。', 'Prefix slot (unit, text, icon).') },
            { name: 'suffix', type: 'ReactNode', description: t('后缀插槽。', 'Suffix slot.') },
            { name: 'clearable', type: 'boolean', description: t('有内容时显示清除按钮。', 'Show a clear button when there’s content.') },
            { name: 'clearLabel', type: 'string', default: t("'清除'", "'Clear'"), description: t('清除按钮的可读名称。', 'Accessible name of the clear button. The default follows the OinkProvider locale.') },
            { name: 'onClear', type: '() => void', description: t('点击清除按钮后触发（此前 onChange 已收到空字符串）。', 'Fires after the clear button is clicked (onChange has already received an empty string).') },
            { name: 'revealable', type: 'boolean', default: 'true', description: t('type="password" 时是否显示“显示密码”按钮。', 'With type="password", whether to show the “Show password” button.') },
            { name: 'invalid', type: 'boolean', description: t('校验失败：标红并设置 aria-invalid。在 Field 里默认跟随 Field。', 'Failed validation: turns red and sets aria-invalid. Inside a Field it follows the Field by default.') },
            { name: 'rootClassName / rootStyle', type: 'string / CSSProperties', description: t('外框的类名与样式。className / style 同样落在外框上。', 'Class and style for the outer frame. className / style also land on the frame.') },
            { name: '…rest', type: 'InputHTMLAttributes', description: t('其余原生属性和 ref 落在里面的 <input> 上。', 'Other native attributes and ref go to the inner <input>.') },
          ]}
        />
        <PropsTable
          title="SearchInput"
          rows={[
            { name: 'onSearch', type: '(value: string) => void', description: t('按下 Enter 时触发。', 'Fires on Enter.') },
            { name: 'pill', type: 'boolean', default: 'true', description: t('默认全圆。', 'Pill-shaped by default.') },
            { name: 'clearable', type: 'boolean', default: 'true', description: t('默认带清除按钮。', 'Has a clear button by default.') },
            { name: 'placeholder', type: 'string', default: t("'搜索…'", "'Search…'"), description: t('占位文字。', 'Placeholder text. The default follows the OinkProvider locale.') },
            { name: '…', type: 'InputProps', description: t('其余同 Input（type、icon、revealable 已固定）。', 'Everything else as Input (type, icon and revealable are fixed).') },
          ]}
        />
        <A11yNotes
          items={t([
            <>里面是原生 <code>&lt;input&gt;</code>，角色随 type 而定（文本框是 textbox，SearchInput 是 searchbox）。</>,
            <>必须有可读名称：放进带 label 的 Field，或给 <code>aria-label</code> / <code>aria-labelledby</code>。占位文字不算名称。</>,
            <>前后缀是普通文字，不参与命名；点在外框空白处同样聚焦输入框。</>,
            <><kbd>Tab</kbd> 依次经过输入框、清除按钮（有内容时）和显示密码按钮。显示密码按钮用 <code>aria-pressed</code> 表达状态。</>,
            <>SearchInput：<kbd>Enter</kbd> 触发搜索，<kbd>Esc</kbd> 在有内容时清空（并阻止事件默认行为）。</>,
            <>校验失败时设置 <code>aria-invalid</code>；在 Field 里错误文字通过 <code>aria-describedby</code> 关联并由 aria-live 播报。</>,
          ], [
            <>Inside is a native <code>&lt;input&gt;</code> whose role follows its type (textbox for text, searchbox for SearchInput).</>,
            <>It must have an accessible name: put it in a labelled Field, or give it <code>aria-label</code> / <code>aria-labelledby</code>. Placeholder text doesn’t count as a name.</>,
            <>Prefixes and suffixes are plain text and don’t contribute to the name; clicking empty space in the frame also focuses the input.</>,
            <><kbd>Tab</kbd> moves through the input, the clear button (when there’s content) and the show-password button. The show-password button exposes its state with <code>aria-pressed</code>.</>,
            <>SearchInput: <kbd>Enter</kbd> searches, and <kbd>Esc</kbd> clears when there’s content (preventing the event’s default).</>,
            <>Failed validation sets <code>aria-invalid</code>; inside a Field the error message is linked via <code>aria-describedby</code> and announced via aria-live.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
