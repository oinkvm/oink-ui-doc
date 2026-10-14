import { useState } from 'react';
import { Checkbox, CheckboxGroup, Field, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/checkbox', title: 'Checkbox 复选框', group: '表单与操作', order: 70, subtitle: 'Checkbox · CheckboxGroup', en: { title: 'Checkbox', subtitle: 'Checkbox · CheckboxGroup' } };

const ALL = ['read', 'write', 'admin'];

function SelectAllDemo() {
  const t = useT();
  const [value, setValue] = useState<string[]>(['read']);
  const all = value.length === ALL.length;
  return (
    <Stack gap={3}>
      <Checkbox checked={all} indeterminate={value.length > 0 && !all} onChange={(on) => setValue(on ? ALL : [])}>
        {t('全部权限', 'All permissions')}
      </Checkbox>
      <CheckboxGroup aria-label={t('权限', 'Permissions')} value={value} onChange={setValue} style={{ paddingLeft: 28 }}>
        <Checkbox value="read">{t('查看', 'View')}</Checkbox>
        <Checkbox value="write">{t('编辑', 'Edit')}</Checkbox>
        <Checkbox value="admin">{t('管理成员', 'Manage members')}</Checkbox>
      </CheckboxGroup>
      <Text tone="subtle" variant="caption">{t('已选：', 'Selected: ')}{value.length ? value.join(t('、', ', ')) : t('无', 'none')}</Text>
    </Stack>
  );
}

const SELECT_ALL_CODE = {
  zh: `
const ALL = ['read', 'write', 'admin'];

function SelectAllDemo() {
  const [value, setValue] = useState<string[]>(['read']);
  const all = value.length === ALL.length;
  return (
    <Stack gap={3}>
      <Checkbox checked={all} indeterminate={value.length > 0 && !all} onChange={(on) => setValue(on ? ALL : [])}>
        全部权限
      </Checkbox>
      <CheckboxGroup aria-label="权限" value={value} onChange={setValue} style={{ paddingLeft: 28 }}>
        <Checkbox value="read">查看</Checkbox>
        <Checkbox value="write">编辑</Checkbox>
        <Checkbox value="admin">管理成员</Checkbox>
      </CheckboxGroup>
      <Text tone="subtle" variant="caption">已选：{value.length ? value.join('、') : '无'}</Text>
    </Stack>
  );
}
`,
  en: `
const ALL = ['read', 'write', 'admin'];

function SelectAllDemo() {
  const [value, setValue] = useState<string[]>(['read']);
  const all = value.length === ALL.length;
  return (
    <Stack gap={3}>
      <Checkbox checked={all} indeterminate={value.length > 0 && !all} onChange={(on) => setValue(on ? ALL : [])}>
        All permissions
      </Checkbox>
      <CheckboxGroup aria-label="Permissions" value={value} onChange={setValue} style={{ paddingLeft: 28 }}>
        <Checkbox value="read">View</Checkbox>
        <Checkbox value="write">Edit</Checkbox>
        <Checkbox value="admin">Manage members</Checkbox>
      </CheckboxGroup>
      <Text tone="subtle" variant="caption">Selected: {value.length ? value.join(', ') : 'none'}</Text>
    </Stack>
  );
}
`,
};

export default function CheckboxPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Checkbox 复选框', 'Checkbox')}
      subtitle="Checkbox · CheckboxGroup"
      lead={t(
        '从一组选项里选零个或多个，或者单独表示“同意 / 不同意”。需要提交后才生效时用它；立即生效的设置用 Switch；只能选一个用 Radio。',
        'Pick zero or more options from a set, or stand alone for a yes / no such as “I agree”. Use it when the choice takes effect on submit; for settings that apply immediately use Switch, and for a single choice use Radio.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        'children 是标签文字，点文字同样可以切换。description 是标签下的说明。',
        'children is the label, and clicking it toggles the box too. description adds a note below the label.',
      )}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={3}>
  <Checkbox defaultChecked>记住我</Checkbox>
  <Checkbox>订阅产品更新</Checkbox>
  <Checkbox description="每周一封，随时可以退订">接收周报</Checkbox>
</Stack>
`, `
<Stack gap={3}>
  <Checkbox defaultChecked>Remember me</Checkbox>
  <Checkbox>Subscribe to product updates</Checkbox>
  <Checkbox description="One email a week, unsubscribe any time">Weekly digest</Checkbox>
</Stack>
`)}
        >
          <Stack gap={3}>
            <Checkbox defaultChecked>{t('记住我', 'Remember me')}</Checkbox>
            <Checkbox>{t('订阅产品更新', 'Subscribe to product updates')}</Checkbox>
            <Checkbox description={t('每周一封，随时可以退订', 'One email a week, unsubscribe any time')}>{t('接收周报', 'Weekly digest')}</Checkbox>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')}>
        <Demo
          layout="col"
          align="start"
          description={t('indeterminate 表示“部分选中”，只影响外观和读屏播报。', 'indeterminate means “partly selected”; it only affects the look and what screen readers announce.')}
          code={t(`
<Stack gap={3}>
  <Checkbox indeterminate>半选</Checkbox>
  <Checkbox disabled>禁用</Checkbox>
  <Checkbox disabled defaultChecked>禁用（已选）</Checkbox>
  <Checkbox invalid>校验失败</Checkbox>
  <Checkbox aria-label="没有可见文字时给 aria-label" />
</Stack>
`, `
<Stack gap={3}>
  <Checkbox indeterminate>Indeterminate</Checkbox>
  <Checkbox disabled>Disabled</Checkbox>
  <Checkbox disabled defaultChecked>Disabled (checked)</Checkbox>
  <Checkbox invalid>Invalid</Checkbox>
  <Checkbox aria-label="With no visible label, give it an aria-label" />
</Stack>
`)}
        >
          <Stack gap={3}>
            <Checkbox indeterminate>{t('半选', 'Indeterminate')}</Checkbox>
            <Checkbox disabled>{t('禁用', 'Disabled')}</Checkbox>
            <Checkbox disabled defaultChecked>{t('禁用（已选）', 'Disabled (checked)')}</Checkbox>
            <Checkbox invalid>{t('校验失败', 'Invalid')}</Checkbox>
            <Checkbox aria-label={t('没有可见文字时给 aria-label', 'With no visible label, give it an aria-label')} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('复选组', 'Checkbox groups')} description={t(
        'CheckboxGroup 用一个字符串数组管理一组复选框。放进 Field 会自动用 Field 的标签命名，否则请给 aria-label。',
        'CheckboxGroup manages a set of checkboxes with an array of strings. Inside a Field it takes the Field’s label as its name; otherwise give it an aria-label.',
      )}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={6}>
  <Field label="通知渠道" hint="至少选一个">
    <CheckboxGroup defaultValue={['email']} name="channel">
      <Checkbox value="email">邮件</Checkbox>
      <Checkbox value="sms">短信</Checkbox>
      <Checkbox value="push" disabled>推送（未安装客户端）</Checkbox>
    </CheckboxGroup>
  </Field>
  <Field label="配料">
    <CheckboxGroup orientation="horizontal" defaultValue={['cheese']}>
      <Checkbox value="cheese">芝士</Checkbox>
      <Checkbox value="egg">鸡蛋</Checkbox>
      <Checkbox value="bacon">培根</Checkbox>
    </CheckboxGroup>
  </Field>
  <Field label="整组禁用">
    <CheckboxGroup disabled defaultValue={['a']} orientation="horizontal">
      <Checkbox value="a">选项一</Checkbox>
      <Checkbox value="b">选项二</Checkbox>
    </CheckboxGroup>
  </Field>
  <Field label="服务条款" error="请勾选全部条款">
    <CheckboxGroup>
      <Checkbox value="tos">同意用户协议</Checkbox>
      <Checkbox value="privacy">同意隐私政策</Checkbox>
    </CheckboxGroup>
  </Field>
</Stack>
`, `
<Stack gap={6}>
  <Field label="Notification channels" hint="Pick at least one">
    <CheckboxGroup defaultValue={['email']} name="channel">
      <Checkbox value="email">Email</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
      <Checkbox value="push" disabled>Push (app not installed)</Checkbox>
    </CheckboxGroup>
  </Field>
  <Field label="Toppings">
    <CheckboxGroup orientation="horizontal" defaultValue={['cheese']}>
      <Checkbox value="cheese">Cheese</Checkbox>
      <Checkbox value="egg">Egg</Checkbox>
      <Checkbox value="bacon">Bacon</Checkbox>
    </CheckboxGroup>
  </Field>
  <Field label="Whole group disabled">
    <CheckboxGroup disabled defaultValue={['a']} orientation="horizontal">
      <Checkbox value="a">Option one</Checkbox>
      <Checkbox value="b">Option two</Checkbox>
    </CheckboxGroup>
  </Field>
  <Field label="Terms of service" error="Please accept all terms">
    <CheckboxGroup>
      <Checkbox value="tos">I agree to the Terms of Use</Checkbox>
      <Checkbox value="privacy">I agree to the Privacy Policy</Checkbox>
    </CheckboxGroup>
  </Field>
</Stack>
`)}
        >
          <Stack gap={6}>
            <Field label={t('通知渠道', 'Notification channels')} hint={t('至少选一个', 'Pick at least one')}>
              <CheckboxGroup defaultValue={['email']} name="channel">
                <Checkbox value="email">{t('邮件', 'Email')}</Checkbox>
                <Checkbox value="sms">{t('短信', 'SMS')}</Checkbox>
                <Checkbox value="push" disabled>{t('推送（未安装客户端）', 'Push (app not installed)')}</Checkbox>
              </CheckboxGroup>
            </Field>
            <Field label={t('配料', 'Toppings')}>
              <CheckboxGroup orientation="horizontal" defaultValue={['cheese']}>
                <Checkbox value="cheese">{t('芝士', 'Cheese')}</Checkbox>
                <Checkbox value="egg">{t('鸡蛋', 'Egg')}</Checkbox>
                <Checkbox value="bacon">{t('培根', 'Bacon')}</Checkbox>
              </CheckboxGroup>
            </Field>
            <Field label={t('整组禁用', 'Whole group disabled')}>
              <CheckboxGroup disabled defaultValue={['a']} orientation="horizontal">
                <Checkbox value="a">{t('选项一', 'Option one')}</Checkbox>
                <Checkbox value="b">{t('选项二', 'Option two')}</Checkbox>
              </CheckboxGroup>
            </Field>
            <Field label={t('服务条款', 'Terms of service')} error={t('请勾选全部条款', 'Please accept all terms')}>
              <CheckboxGroup>
                <Checkbox value="tos">{t('同意用户协议', 'I agree to the Terms of Use')}</Checkbox>
                <Checkbox value="privacy">{t('同意隐私政策', 'I agree to the Privacy Policy')}</Checkbox>
              </CheckboxGroup>
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        '单个复选框用 checked / onChange（参数是新的布尔值）；组用 value / onChange（参数是选中项的数组）。下面是常见的“全选 + 半选”。',
        'A single checkbox uses checked / onChange (called with the new boolean); a group uses value / onChange (called with the array of selected values). Below is the familiar “select all + indeterminate” pattern.',
      )}>
        <Demo layout="col" align="start" code={t(SELECT_ALL_CODE.zh, SELECT_ALL_CODE.en)}>
          <SelectAllDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['描边', '1.5px；悬停时边变强调色，无光晕'],
            ['选中', '对勾描线 240ms · 延迟 50ms'],
            ['取消', '90ms 快速擦除'],
          ], [
            ['Stroke', '1.5px; turns the accent color on hover, no glow'],
            ['Check', 'Check mark draws in over 240ms · 50ms delay'],
            ['Uncheck', 'Quick 90ms wipe'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Checkbox"
          rows={[
            { name: 'checked', type: 'boolean', description: t('是否选中（受控）。在带 value 的 CheckboxGroup 里由组决定。', 'Whether it’s checked (controlled). Inside a CheckboxGroup with a value, the group decides.') },
            { name: 'defaultChecked', type: 'boolean', default: 'false', description: t('初始是否选中（非受控）。', 'Initially checked (uncontrolled).') },
            { name: 'onChange', type: '(checked: boolean) => void', description: t('状态变化时触发，参数是新状态。', 'Fires with the new state when it changes.') },
            { name: 'indeterminate', type: 'boolean', default: 'false', description: t('半选，只影响外观和读屏播报。', 'Indeterminate; only affects the look and screen reader announcement.') },
            { name: 'value', type: 'string', description: t('在组里标识这一项；单独使用时是表单提交的值。', 'Identifies this item within a group; on its own, it’s the value submitted with the form.') },
            { name: 'description', type: 'ReactNode', description: t('标签下的说明文字。', 'Note shown below the label.') },
            { name: 'invalid', type: 'boolean', description: t('校验失败。', 'Failed validation.') },
            { name: 'rootClassName / rootStyle', type: 'string / CSSProperties', description: t('外层 <label> 的类名与样式。className / style 同样落在 <label> 上。', 'Class and style for the outer <label>. className / style also land on the <label>.') },
            { name: '…rest', type: 'InputHTMLAttributes', description: t('其余原生属性（disabled、required、name…）和 ref 落在 <input> 上。', 'Other native attributes (disabled, required, name…) and ref go to the <input>.') },
          ]}
        />
        <PropsTable
          title="CheckboxGroup"
          rows={[
            { name: 'value', type: 'string[]', description: t('选中项的 value 列表（受控）。', 'Values of the checked items (controlled).') },
            { name: 'defaultValue', type: 'string[]', default: '[]', description: t('初始选中项（非受控）。', 'Initially checked items (uncontrolled).') },
            { name: 'onChange', type: '(value: string[]) => void', description: t('选中项变化时触发。', 'Fires when the checked items change.') },
            { name: 'name', type: 'string', description: t('组内复选框共用的字段名。', 'Field name shared by the checkboxes in the group.') },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: t('排列方向；横向放不下会换行。', 'Layout direction; horizontal wraps when it runs out of room.') },
            { name: 'disabled', type: 'boolean', description: t('整组禁用。', 'Disable the whole group.') },
            { name: 'invalid', type: 'boolean', description: t('整组标成校验失败。在 Field 里默认跟随 Field。', 'Mark the whole group invalid. Inside a Field it follows the Field by default.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>每一项都是真的 <code>&lt;input type="checkbox"&gt;</code>，包在 <code>&lt;label&gt;</code> 里，点文字即可切换。</>,
            <><kbd>Tab</kbd> 逐个经过每个复选框，<kbd>Space</kbd> 切换。复选组没有方向键导航，这是复选框的常规模式。</>,
            <>半选时读屏读作“部分选中 / 混合”。</>,
            <>CheckboxGroup 是 <code>role="group"</code>，名称来自 Field 的标签或 <code>aria-label</code>。</>,
            <>没有可见文字的复选框（表格里的行选择等）必须给 <code>aria-label</code>。</>,
            <>勾选框本身是装饰（<code>aria-hidden</code>），状态由原生 input 传达；键盘聚焦时焦点环画在勾选框上。</>,
          ], [
            <>Each item is a real <code>&lt;input type="checkbox"&gt;</code> wrapped in a <code>&lt;label&gt;</code>, so clicking the text toggles it.</>,
            <><kbd>Tab</kbd> visits each checkbox in turn and <kbd>Space</kbd> toggles it. Checkbox groups have no arrow-key navigation; that’s the standard pattern for checkboxes.</>,
            <>When indeterminate, screen readers announce it as “partially checked” / “mixed”.</>,
            <>CheckboxGroup is <code>role="group"</code>, named by the Field label or <code>aria-label</code>.</>,
            <>A checkbox with no visible text (row selection in a table, for example) must have an <code>aria-label</code>.</>,
            <>The box itself is decorative (<code>aria-hidden</code>); the native input carries the state, and keyboard focus draws the focus ring on the box.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
