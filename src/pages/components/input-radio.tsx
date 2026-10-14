import { useState } from 'react';
import { Field, Radio, RadioGroup, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/radio', title: 'Radio 单选', group: '表单与操作', order: 80, subtitle: 'Radio · RadioGroup', en: { title: 'Radio', subtitle: 'Radio · RadioGroup' } };

function ControlledDemo() {
  const t = useT();
  const [plan, setPlan] = useState<string | null>('pro');
  return (
    <Stack gap={3}>
      <RadioGroup aria-label={t('套餐', 'Plan')} value={plan} onChange={setPlan}>
        <Radio value="free" description={t('3 个项目，社区支持', '3 projects, community support')}>{t('免费版', 'Free')}</Radio>
        <Radio value="pro" description={t('不限项目，优先支持', 'Unlimited projects, priority support')}>{t('专业版', 'Pro')}</Radio>
        <Radio value="team" description={t('成员管理与审计日志', 'Member management and audit log')}>{t('团队版', 'Team')}</Radio>
      </RadioGroup>
      <Text tone="subtle" variant="caption">{t('当前：', 'Current: ')}{plan}</Text>
    </Stack>
  );
}

const CONTROLLED_CODE = {
  zh: `
function ControlledDemo() {
  const [plan, setPlan] = useState<string | null>('pro');
  return (
    <Stack gap={3}>
      <RadioGroup aria-label="套餐" value={plan} onChange={setPlan}>
        <Radio value="free" description="3 个项目，社区支持">免费版</Radio>
        <Radio value="pro" description="不限项目，优先支持">专业版</Radio>
        <Radio value="team" description="成员管理与审计日志">团队版</Radio>
      </RadioGroup>
      <Text tone="subtle" variant="caption">当前：{plan}</Text>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [plan, setPlan] = useState<string | null>('pro');
  return (
    <Stack gap={3}>
      <RadioGroup aria-label="Plan" value={plan} onChange={setPlan}>
        <Radio value="free" description="3 projects, community support">Free</Radio>
        <Radio value="pro" description="Unlimited projects, priority support">Pro</Radio>
        <Radio value="team" description="Member management and audit log">Team</Radio>
      </RadioGroup>
      <Text tone="subtle" variant="caption">Current: {plan}</Text>
    </Stack>
  );
}
`,
};

export default function RadioPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Radio 单选', 'Radio')}
      subtitle="Radio · RadioGroup"
      lead={t(
        '从一组互斥的选项里选一个，并且希望所有选项都摆在明面上。选项多于五六个时用 Select；两三个短选项也可以用 Segmented；带示意图的用 OptionCard。',
        'Choose one of a set of mutually exclusive options when you want every option in plain view. With more than five or six options use Select; two or three short options can also use Segmented; options with illustrations use OptionCard.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        'Radio 放在 RadioGroup 里使用。组放进 Field 会自动用 Field 的标签命名，否则请给 aria-label。',
        'Use Radio inside a RadioGroup. Inside a Field the group takes the Field’s label as its name; otherwise give it an aria-label.',
      )}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Field label="配送方式">
  <RadioGroup defaultValue="standard" name="shipping">
    <Radio value="standard">标准配送</Radio>
    <Radio value="express">次日达</Radio>
    <Radio value="pickup">到店自提</Radio>
  </RadioGroup>
</Field>
`, `
<Field label="Shipping">
  <RadioGroup defaultValue="standard" name="shipping">
    <Radio value="standard">Standard</Radio>
    <Radio value="express">Next day</Radio>
    <Radio value="pickup">In-store pickup</Radio>
  </RadioGroup>
</Field>
`)}
        >
          <Field label={t('配送方式', 'Shipping')}>
            <RadioGroup defaultValue="standard" name="shipping">
              <Radio value="standard">{t('标准配送', 'Standard')}</Radio>
              <Radio value="express">{t('次日达', 'Next day')}</Radio>
              <Radio value="pickup">{t('到店自提', 'In-store pickup')}</Radio>
            </RadioGroup>
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('横向与说明文字', 'Horizontal and descriptions')}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={6}>
  <Field label="性别">
    <RadioGroup orientation="horizontal" defaultValue="na">
      <Radio value="f">女</Radio>
      <Radio value="m">男</Radio>
      <Radio value="na">不透露</Radio>
    </RadioGroup>
  </Field>
  <Field label="可见范围">
    <RadioGroup defaultValue="team">
      <Radio value="private" description="只有你自己能看到">私密</Radio>
      <Radio value="team" description="团队成员都能看到">团队</Radio>
      <Radio value="public" description="任何拿到链接的人都能看到">公开</Radio>
    </RadioGroup>
  </Field>
</Stack>
`, `
<Stack gap={6}>
  <Field label="Gender">
    <RadioGroup orientation="horizontal" defaultValue="na">
      <Radio value="f">Female</Radio>
      <Radio value="m">Male</Radio>
      <Radio value="na">Prefer not to say</Radio>
    </RadioGroup>
  </Field>
  <Field label="Visibility">
    <RadioGroup defaultValue="team">
      <Radio value="private" description="Only you can see it">Private</Radio>
      <Radio value="team" description="Everyone on your team can see it">Team</Radio>
      <Radio value="public" description="Anyone with the link can see it">Public</Radio>
    </RadioGroup>
  </Field>
</Stack>
`)}
        >
          <Stack gap={6}>
            <Field label={t('性别', 'Gender')}>
              <RadioGroup orientation="horizontal" defaultValue="na">
                <Radio value="f">{t('女', 'Female')}</Radio>
                <Radio value="m">{t('男', 'Male')}</Radio>
                <Radio value="na">{t('不透露', 'Prefer not to say')}</Radio>
              </RadioGroup>
            </Field>
            <Field label={t('可见范围', 'Visibility')}>
              <RadioGroup defaultValue="team">
                <Radio value="private" description={t('只有你自己能看到', 'Only you can see it')}>{t('私密', 'Private')}</Radio>
                <Radio value="team" description={t('团队成员都能看到', 'Everyone on your team can see it')}>{t('团队', 'Team')}</Radio>
                <Radio value="public" description={t('任何拿到链接的人都能看到', 'Anyone with the link can see it')}>{t('公开', 'Public')}</Radio>
              </RadioGroup>
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={6}>
  <Field label="单项禁用">
    <RadioGroup defaultValue="a" orientation="horizontal">
      <Radio value="a">可选</Radio>
      <Radio value="b" disabled>已售罄</Radio>
      <Radio value="c">可选</Radio>
    </RadioGroup>
  </Field>
  <Field label="整组禁用">
    <RadioGroup defaultValue="a" disabled orientation="horizontal">
      <Radio value="a">选项一</Radio>
      <Radio value="b">选项二</Radio>
    </RadioGroup>
  </Field>
  <Field label="发票类型" required error="请选择一种发票类型">
    <RadioGroup orientation="horizontal">
      <Radio value="personal">个人</Radio>
      <Radio value="company">企业</Radio>
    </RadioGroup>
  </Field>
</Stack>
`, `
<Stack gap={6}>
  <Field label="One option disabled">
    <RadioGroup defaultValue="a" orientation="horizontal">
      <Radio value="a">Available</Radio>
      <Radio value="b" disabled>Sold out</Radio>
      <Radio value="c">Available</Radio>
    </RadioGroup>
  </Field>
  <Field label="Whole group disabled">
    <RadioGroup defaultValue="a" disabled orientation="horizontal">
      <Radio value="a">Option one</Radio>
      <Radio value="b">Option two</Radio>
    </RadioGroup>
  </Field>
  <Field label="Invoice type" required error="Choose an invoice type">
    <RadioGroup orientation="horizontal">
      <Radio value="personal">Personal</Radio>
      <Radio value="company">Business</Radio>
    </RadioGroup>
  </Field>
</Stack>
`)}
        >
          <Stack gap={6}>
            <Field label={t('单项禁用', 'One option disabled')}>
              <RadioGroup defaultValue="a" orientation="horizontal">
                <Radio value="a">{t('可选', 'Available')}</Radio>
                <Radio value="b" disabled>{t('已售罄', 'Sold out')}</Radio>
                <Radio value="c">{t('可选', 'Available')}</Radio>
              </RadioGroup>
            </Field>
            <Field label={t('整组禁用', 'Whole group disabled')}>
              <RadioGroup defaultValue="a" disabled orientation="horizontal">
                <Radio value="a">{t('选项一', 'Option one')}</Radio>
                <Radio value="b">{t('选项二', 'Option two')}</Radio>
              </RadioGroup>
            </Field>
            <Field label={t('发票类型', 'Invoice type')} required error={t('请选择一种发票类型', 'Choose an invoice type')}>
              <RadioGroup orientation="horizontal">
                <Radio value="personal">{t('个人', 'Personal')}</Radio>
                <Radio value="company">{t('企业', 'Business')}</Radio>
              </RadioGroup>
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        'RadioGroup 的 onChange 参数是选中项的 value。value 传 null 表示都没选。',
        'RadioGroup’s onChange is called with the selected item’s value. Pass null as value for no selection.',
      )}>
        <Demo layout="col" align="start" code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="RadioGroup"
          rows={[
            { name: 'value', type: 'string | null', description: t('选中项的 value（受控）；null 表示没选。', 'Value of the selected item (controlled); null means none.') },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: t('初始选中项（非受控）。', 'Initially selected item (uncontrolled).') },
            { name: 'onChange', type: '(value: string) => void', description: t('选中项变化时触发。', 'Fires when the selection changes.') },
            { name: 'name', type: 'string', default: t('自动生成', 'generated'), description: t('字段名。同名的原生单选才能用方向键互相移动，所以不传也会生成一个。', 'Field name. Native radios only move between each other with arrow keys when they share a name, so one is generated if you don’t pass it.') },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: t('排列方向。', 'Layout direction.') },
            { name: 'disabled', type: 'boolean', description: t('整组禁用。', 'Disable the whole group.') },
            { name: 'required', type: 'boolean', description: t('必填。', 'Required.') },
            { name: 'invalid', type: 'boolean', description: t('校验失败。在 Field 里默认跟随 Field。', 'Failed validation. Inside a Field it follows the Field by default.') },
          ]}
        />
        <PropsTable
          title="Radio"
          rows={[
            { name: 'value', type: 'string', required: true, description: t('这一项的值。', 'Value of this item.') },
            { name: 'description', type: 'ReactNode', description: t('标签下的说明文字。', 'Note below the label.') },
            { name: 'disabled', type: 'boolean', description: t('禁用这一项。', 'Disable this item.') },
            { name: 'onChange', type: '(value: string) => void', description: t('这一项被选中时触发。不在 RadioGroup 里单独使用时配合 checked / name 用。', 'Fires when this item is selected. Outside a RadioGroup, use it with checked / name.') },
            { name: 'rootClassName / rootStyle', type: 'string / CSSProperties', description: t('外层 <label> 的类名与样式。className / style 同样落在 <label> 上。', 'Class and style for the outer <label>. className / style also land on the <label>.') },
            { name: '…rest', type: 'InputHTMLAttributes', description: t('其余原生属性和 ref 落在 <input type="radio"> 上。', 'Other native attributes and ref go to the <input type="radio">.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>组是 <code>role="radiogroup"</code>，每一项是真的 <code>&lt;input type="radio"&gt;</code>。</>,
            <><kbd>Tab</kbd> 进入组时落在选中项上（都没选则落在第一项），再按 <kbd>Tab</kbd> 离开整组。</>,
            <><kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> 在组内移动并同时选中，到头循环；<kbd>Space</kbd> 选中当前项。这是同名原生单选的浏览器行为，没有用脚本重做。</>,
            <>禁用项会被方向键跳过。</>,
            <>组的名称来自 Field 的标签（<code>aria-labelledby</code>）或 <code>aria-label</code>；必填与校验状态通过 <code>aria-required</code> / <code>aria-invalid</code> 标在组上。</>,
          ], [
            <>The group is <code>role="radiogroup"</code> and each item is a real <code>&lt;input type="radio"&gt;</code>.</>,
            <><kbd>Tab</kbd> into the group lands on the selected item (or the first if none is selected); <kbd>Tab</kbd> again leaves the group.</>,
            <><kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> move within the group and select at the same time, wrapping at the ends; <kbd>Space</kbd> selects the current item. This is the browser’s own behavior for same-named native radios, not reimplemented in script.</>,
            <>Arrow keys skip disabled items.</>,
            <>The group is named by the Field label (<code>aria-labelledby</code>) or <code>aria-label</code>; required and validation states are set on the group via <code>aria-required</code> / <code>aria-invalid</code>.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
