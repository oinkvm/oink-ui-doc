import { useState } from 'react';
import { Button, Checkbox, Field, Fieldset, Form, FormActions, Input, Label, Radio, RadioGroup, Select, Stack, Switch, Text, Textarea } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/field', title: 'Field 表单项', group: '表单与操作', order: 60, subtitle: 'Field · Label · Fieldset · Form', en: { title: 'Field', subtitle: 'Field · Label · Fieldset · Form' } };

const box = { width: '100%', maxWidth: 420 };

type Errors = Partial<Record<'name' | 'email' | 'password' | 'role' | 'agree', string>>;

function SignupForm() {
  const t = useT();
  const [errors, setErrors] = useState<Errors>({});
  const [role, setRole] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState('');
  const [formKey, setFormKey] = useState(0);

  const submit = (data: FormData) => {
    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    if (!name) next.name = t('请填写姓名', 'Enter your name');
    if (!email) next.email = t('请填写邮箱', 'Enter your email');
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = t('邮箱格式不正确', 'That doesn’t look like an email address');
    if (password.length < 8) next.password = t('密码至少 8 位', 'Use at least 8 characters');
    if (!role) next.role = t('请选择角色', 'Choose a role');
    if (!data.get('agree')) next.agree = t('需要先同意服务条款', 'You need to accept the terms first');
    setErrors(next);
    setResult('');
    if (Object.keys(next).length) return;
    setState('loading');
    setTimeout(() => {
      setState('done');
      setResult(t(`已提交：${name}（${email}），角色 ${role}`, `Submitted: ${name} (${email}), role ${role}`));
      setTimeout(() => setState('idle'), 1600);
    }, 1200);
  };
  const clear = (key: keyof Errors) => () => setErrors((e) => ({ ...e, [key]: undefined }));
  // 控件都是非受控的：换一个 key 让表单整体重新挂载，就是重置
  const reset = () => { setErrors({}); setRole(null); setResult(''); setFormKey((k) => k + 1); };

  return (
    <Form key={formKey} noValidate onSubmit={submit} style={{ width: '100%', maxWidth: 420 }} aria-label={t('创建账号', 'Create account')}>
      <Field label={t('姓名', 'Name')} required error={errors.name}>
        <Input name="name" autoComplete="name" onChange={clear('name')} />
      </Field>
      <Field label={t('邮箱', 'Email')} required hint={t('用于登录和接收通知', 'For signing in and notifications')} error={errors.email}>
        <Input name="email" type="email" autoComplete="email" onChange={clear('email')} />
      </Field>
      <Field label={t('密码', 'Password')} required hint={t('至少 8 位', 'At least 8 characters')} error={errors.password}>
        <Input name="password" type="password" autoComplete="new-password" onChange={clear('password')} />
      </Field>
      <Field label={t('角色', 'Role')} required error={errors.role}>
        {(control) => (
          <Select
            id={control.id}
            aria-describedby={control['aria-describedby']}
            invalid={!!errors.role}
            name="role"
            value={role}
            onChange={(v) => { setRole(v); clear('role')(); }}
            options={[
              { value: 'designer', label: t('设计师', 'Designer') },
              { value: 'engineer', label: t('工程师', 'Engineer') },
              { value: 'pm', label: t('产品经理', 'Product manager') },
            ]}
          />
        )}
      </Field>
      <Field label={t('自我介绍', 'About you')} hint={t('选填', 'Optional')}>
        <Textarea name="bio" minRows={2} />
      </Field>
      <Field error={errors.agree}>
        <Checkbox name="agree" value="yes" onChange={clear('agree')}>{t('我已阅读并同意服务条款', 'I have read and agree to the Terms of Service')}</Checkbox>
      </Field>
      <FormActions align="end">
        <Button variant="ghost" onClick={reset}>{t('重置', 'Reset')}</Button>
        <Button type="submit" variant="primary" loading={state === 'loading'} success={state === 'done'}>{t('创建账号', 'Create account')}</Button>
      </FormActions>
      <Text as="p" tone="success" variant="caption" role="status" style={{ margin: 0 }}>{result}</Text>
    </Form>
  );
}

function NativeForm() {
  const t = useT();
  const [sent, setSent] = useState('');
  return (
    <Form onSubmit={(data) => setSent(String(data.get('email')))} style={{ width: '100%', maxWidth: 420 }} aria-label={t('订阅', 'Subscribe')}>
      <Field label={t('邮箱', 'Email')} required>
        <Input name="email" type="email" placeholder="you@example.com" />
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">{t('订阅', 'Subscribe')}</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0 }}>{sent && t(`已订阅：${sent}`, `Subscribed: ${sent}`)}</Text>
    </Form>
  );
}

const NATIVE_CODE = {
  zh: `
function NativeForm() {
  const [sent, setSent] = useState('');
  return (
    <Form onSubmit={(data) => setSent(String(data.get('email')))} style={{ width: '100%', maxWidth: 420 }} aria-label="订阅">
      <Field label="邮箱" required>
        <Input name="email" type="email" placeholder="you@example.com" />
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">订阅</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0 }}>{sent && \`已订阅：\${sent}\`}</Text>
    </Form>
  );
}
`,
  en: `
function NativeForm() {
  const [sent, setSent] = useState('');
  return (
    <Form onSubmit={(data) => setSent(String(data.get('email')))} style={{ width: '100%', maxWidth: 420 }} aria-label="Subscribe">
      <Field label="Email" required>
        <Input name="email" type="email" placeholder="you@example.com" />
      </Field>
      <FormActions>
        <Button type="submit" variant="primary">Subscribe</Button>
      </FormActions>
      <Text as="p" tone="subtle" variant="caption" role="status" style={{ margin: 0 }}>{sent && \`Subscribed: \${sent}\`}</Text>
    </Form>
  );
}
`,
};

const SIGNUP_CODE = {
  zh: `
type Errors = Partial<Record<'name' | 'email' | 'password' | 'role' | 'agree', string>>;

function SignupForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [role, setRole] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState('');
  const [formKey, setFormKey] = useState(0);

  const submit = (data: FormData) => {
    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    if (!name) next.name = '请填写姓名';
    if (!email) next.email = '请填写邮箱';
    else if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) next.email = '邮箱格式不正确';
    if (password.length < 8) next.password = '密码至少 8 位';
    if (!role) next.role = '请选择角色';
    if (!data.get('agree')) next.agree = '需要先同意服务条款';
    setErrors(next);
    setResult('');
    if (Object.keys(next).length) return;
    setState('loading');
    setTimeout(() => {
      setState('done');
      setResult(\`已提交：\${name}（\${email}），角色 \${role}\`);
      setTimeout(() => setState('idle'), 1600);
    }, 1200);
  };
  const clear = (key: keyof Errors) => () => setErrors((e) => ({ ...e, [key]: undefined }));
  // 控件都是非受控的：换一个 key 让表单整体重新挂载，就是重置
  const reset = () => { setErrors({}); setRole(null); setResult(''); setFormKey((k) => k + 1); };

  return (
    <Form key={formKey} noValidate onSubmit={submit} style={{ width: '100%', maxWidth: 420 }} aria-label="创建账号">
      <Field label="姓名" required error={errors.name}>
        <Input name="name" autoComplete="name" onChange={clear('name')} />
      </Field>
      <Field label="邮箱" required hint="用于登录和接收通知" error={errors.email}>
        <Input name="email" type="email" autoComplete="email" onChange={clear('email')} />
      </Field>
      <Field label="密码" required hint="至少 8 位" error={errors.password}>
        <Input name="password" type="password" autoComplete="new-password" onChange={clear('password')} />
      </Field>
      <Field label="角色" required error={errors.role}>
        {(control) => (
          <Select
            id={control.id}
            aria-describedby={control['aria-describedby']}
            invalid={!!errors.role}
            name="role"
            value={role}
            onChange={(v) => { setRole(v); clear('role')(); }}
            options={[
              { value: 'designer', label: '设计师' },
              { value: 'engineer', label: '工程师' },
              { value: 'pm', label: '产品经理' },
            ]}
          />
        )}
      </Field>
      <Field label="自我介绍" hint="选填">
        <Textarea name="bio" minRows={2} />
      </Field>
      <Field error={errors.agree}>
        <Checkbox name="agree" value="yes" onChange={clear('agree')}>我已阅读并同意服务条款</Checkbox>
      </Field>
      <FormActions align="end">
        <Button variant="ghost" onClick={reset}>重置</Button>
        <Button type="submit" variant="primary" loading={state === 'loading'} success={state === 'done'}>创建账号</Button>
      </FormActions>
      <Text as="p" tone="success" variant="caption" role="status" style={{ margin: 0 }}>{result}</Text>
    </Form>
  );
}
`,
  en: `
type Errors = Partial<Record<'name' | 'email' | 'password' | 'role' | 'agree', string>>;

function SignupForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [role, setRole] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState('');
  const [formKey, setFormKey] = useState(0);

  const submit = (data: FormData) => {
    const next: Errors = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    if (!name) next.name = 'Enter your name';
    if (!email) next.email = 'Enter your email';
    else if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(email)) next.email = 'That doesn’t look like an email address';
    if (password.length < 8) next.password = 'Use at least 8 characters';
    if (!role) next.role = 'Choose a role';
    if (!data.get('agree')) next.agree = 'You need to accept the terms first';
    setErrors(next);
    setResult('');
    if (Object.keys(next).length) return;
    setState('loading');
    setTimeout(() => {
      setState('done');
      setResult(\`Submitted: \${name} (\${email}), role \${role}\`);
      setTimeout(() => setState('idle'), 1600);
    }, 1200);
  };
  const clear = (key: keyof Errors) => () => setErrors((e) => ({ ...e, [key]: undefined }));
  // The controls are uncontrolled: remounting the form with a new key resets it
  const reset = () => { setErrors({}); setRole(null); setResult(''); setFormKey((k) => k + 1); };

  return (
    <Form key={formKey} noValidate onSubmit={submit} style={{ width: '100%', maxWidth: 420 }} aria-label="Create account">
      <Field label="Name" required error={errors.name}>
        <Input name="name" autoComplete="name" onChange={clear('name')} />
      </Field>
      <Field label="Email" required hint="For signing in and notifications" error={errors.email}>
        <Input name="email" type="email" autoComplete="email" onChange={clear('email')} />
      </Field>
      <Field label="Password" required hint="At least 8 characters" error={errors.password}>
        <Input name="password" type="password" autoComplete="new-password" onChange={clear('password')} />
      </Field>
      <Field label="Role" required error={errors.role}>
        {(control) => (
          <Select
            id={control.id}
            aria-describedby={control['aria-describedby']}
            invalid={!!errors.role}
            name="role"
            value={role}
            onChange={(v) => { setRole(v); clear('role')(); }}
            options={[
              { value: 'designer', label: 'Designer' },
              { value: 'engineer', label: 'Engineer' },
              { value: 'pm', label: 'Product manager' },
            ]}
          />
        )}
      </Field>
      <Field label="About you" hint="Optional">
        <Textarea name="bio" minRows={2} />
      </Field>
      <Field error={errors.agree}>
        <Checkbox name="agree" value="yes" onChange={clear('agree')}>I have read and agree to the Terms of Service</Checkbox>
      </Field>
      <FormActions align="end">
        <Button variant="ghost" onClick={reset}>Reset</Button>
        <Button type="submit" variant="primary" loading={state === 'loading'} success={state === 'done'}>Create account</Button>
      </FormActions>
      <Text as="p" tone="success" variant="caption" role="status" style={{ margin: 0 }}>{result}</Text>
    </Form>
  );
}
`,
};

export default function FieldPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Field 表单项', 'Field')}
      subtitle="Field · Label · Fieldset · Form"
      lead={t(
        'Field 把标签、控件、提示和错误文字组成一项，并自动接好 id 与 aria 属性。Fieldset 给一组相关控件加标题，Form 负责纵向排布和提交。凡是需要标签的控件，都优先放进 Field。',
        'Field combines a label, a control, a hint and an error message into one form item, and wires up the id and aria attributes for you. Fieldset gives a group of related controls a heading; Form handles vertical layout and submission. Any control that needs a label should go in a Field first.',
      )}
    >
      <DocSection title={t('Field', 'Field')} description={t(
        '本库的控件放进去会自动接线；原生 input / select / textarea 会被克隆接线；其它情况传函数，自己把 id 和 aria-describedby 接上。',
        'Controls from this library are wired up automatically; native input / select / textarea are cloned and wired; for anything else, pass a function and connect the id and aria-describedby yourself.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="项目名称" hint="之后可以修改">
    <Input placeholder="例如：官网改版" />
  </Field>
  <Field label="项目代号" required>
    <Input />
  </Field>
  <Field label="每周摘要" hint="每周一早上发到邮箱">
    <Switch />
  </Field>
</Stack>
`, `
<Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="Project name" hint="You can change it later">
    <Input placeholder="e.g. Website redesign" />
  </Field>
  <Field label="Project code" required>
    <Input />
  </Field>
  <Field label="Weekly digest" hint="Emailed every Monday morning">
    <Switch />
  </Field>
</Stack>
`)}
        >
          <Stack gap={5} style={box}>
            <Field label={t('项目名称', 'Project name')} hint={t('之后可以修改', 'You can change it later')}>
              <Input placeholder={t('例如：官网改版', 'e.g. Website redesign')} />
            </Field>
            <Field label={t('项目代号', 'Project code')} required>
              <Input />
            </Field>
            <Field label={t('每周摘要', 'Weekly digest')} hint={t('每周一早上发到邮箱', 'Emailed every Monday morning')}>
              <Switch />
            </Field>
          </Stack>
        </Demo>
        <Demo
          title={t('错误与禁用', 'Errors and disabled')}
          description={t(
            'error 有值即视为校验失败：控件标红并抖动一下，错误文字展开并由 aria-live 播报。只想标红不显示文字时用 invalid。disabled 会传给里面的控件。',
            'Any value in error means validation failed: the control turns red and shakes once, and the error message expands and is announced via aria-live. To mark it red without a message, use invalid. disabled is passed to the control inside.',
          )}
          layout="col"
          code={t(`
<Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="邮箱" hint="用于登录" error="这个邮箱已经注册过了">
    <Input type="email" defaultValue="hi@oink.dev" />
  </Field>
  <Field label="邀请码" invalid>
    <Input defaultValue="只标红，没有文字" />
  </Field>
  <Field label="所属团队" hint="由管理员分配" disabled>
    <Input defaultValue="设计系统组" />
  </Field>
</Stack>
`, `
<Stack gap={5} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="Email" hint="Used to sign in" error="This email is already registered">
    <Input type="email" defaultValue="hi@oink.dev" />
  </Field>
  <Field label="Invite code" invalid>
    <Input defaultValue="Red only, no message" />
  </Field>
  <Field label="Team" hint="Assigned by an admin" disabled>
    <Input defaultValue="Design Systems" />
  </Field>
</Stack>
`)}
        >
          <Stack gap={5} style={box}>
            <Field label={t('邮箱', 'Email')} hint={t('用于登录', 'Used to sign in')} error={t('这个邮箱已经注册过了', 'This email is already registered')}>
              <Input type="email" defaultValue="hi@oink.dev" />
            </Field>
            <Field label={t('邀请码', 'Invite code')} invalid>
              <Input defaultValue={t('只标红，没有文字', 'Red only, no message')} />
            </Field>
            <Field label={t('所属团队', 'Team')} hint={t('由管理员分配', 'Assigned by an admin')} disabled>
              <Input defaultValue={t('设计系统组', 'Design Systems')} />
            </Field>
          </Stack>
        </Demo>
        <Demo
          title={t('横向排布', 'Horizontal layout')}
          description={t(
            'orientation="horizontal" 在 520px 以上把标签放到左边，窄屏自动回到上下排布。',
            'orientation="horizontal" puts the label on the left above 520px; on narrow screens it falls back to stacking.',
          )}
          layout="col"
          code={t(`
<Stack gap={4} style={{ width: '100%', maxWidth: 520 }}>
  <Field label="显示名称" orientation="horizontal">
    <Input defaultValue="Oink" />
  </Field>
  <Field label="个人主页" orientation="horizontal" hint="会显示在名片上">
    <Input prefix="https://" />
  </Field>
</Stack>
`, `
<Stack gap={4} style={{ width: '100%', maxWidth: 520 }}>
  <Field label="Display name" orientation="horizontal">
    <Input defaultValue="Oink" />
  </Field>
  <Field label="Website" orientation="horizontal" hint="Shown on your profile card">
    <Input prefix="https://" />
  </Field>
</Stack>
`)}
        >
          <Stack gap={4} style={{ width: '100%', maxWidth: 520 }}>
            <Field label={t('显示名称', 'Display name')} orientation="horizontal">
              <Input defaultValue="Oink" />
            </Field>
            <Field label={t('个人主页', 'Website')} orientation="horizontal" hint={t('会显示在名片上', 'Shown on your profile card')}>
              <Input prefix="https://" />
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('Label', 'Label')} description={t(
        '不用 Field 时的独立标签，用 htmlFor 指向控件 id。required 只是视觉上的星号，控件本身还要写 required。',
        'A standalone label for use without Field; point htmlFor at the control’s id. required only adds a visual asterisk; the control itself still needs required.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={2} style={{ width: '100%', maxWidth: 420 }}>
  <Label htmlFor="doc-label-company" required>公司名称</Label>
  <Input id="doc-label-company" required />
  <Label htmlFor="doc-label-tax" size="md">税号</Label>
  <Input id="doc-label-tax" />
  <Label htmlFor="doc-label-off" disabled>已停用的字段</Label>
  <Input id="doc-label-off" disabled />
</Stack>
`, `
<Stack gap={2} style={{ width: '100%', maxWidth: 420 }}>
  <Label htmlFor="doc-label-company" required>Company name</Label>
  <Input id="doc-label-company" required />
  <Label htmlFor="doc-label-tax" size="md">Tax ID</Label>
  <Input id="doc-label-tax" />
  <Label htmlFor="doc-label-off" disabled>Retired field</Label>
  <Input id="doc-label-off" disabled />
</Stack>
`)}
        >
          <Stack gap={2} style={box}>
            <Label htmlFor="doc-label-company" required>{t('公司名称', 'Company name')}</Label>
            <Input id="doc-label-company" required />
            <Label htmlFor="doc-label-tax" size="md">{t('税号', 'Tax ID')}</Label>
            <Input id="doc-label-tax" />
            <Label htmlFor="doc-label-off" disabled>{t('已停用的字段', 'Retired field')}</Label>
            <Input id="doc-label-off" disabled />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('Fieldset', 'Fieldset')} description={t(
        '原生 fieldset + legend：给一组相关控件起名。disabled 会让里面的控件全部禁用。',
        'Native fieldset + legend: names a group of related controls. disabled disables every control inside.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Fieldset legend="收货地址" hint="仅支持中国大陆地区">
    <Field label="收件人"><Input autoComplete="name" /></Field>
    <Field label="详细地址"><Input autoComplete="street-address" /></Field>
  </Fieldset>
  <Fieldset legend="发票（暂未开放）" disabled>
    <Field label="抬头"><Input /></Field>
    <Checkbox>需要纸质发票</Checkbox>
  </Fieldset>
</Stack>
`, `
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Fieldset legend="Shipping address" hint="Domestic addresses only">
    <Field label="Recipient"><Input autoComplete="name" /></Field>
    <Field label="Street address"><Input autoComplete="street-address" /></Field>
  </Fieldset>
  <Fieldset legend="Invoice (coming soon)" disabled>
    <Field label="Billing name"><Input /></Field>
    <Checkbox>Send a paper invoice</Checkbox>
  </Fieldset>
</Stack>
`)}
        >
          <Stack gap={6} style={box}>
            <Fieldset legend={t('收货地址', 'Shipping address')} hint={t('仅支持中国大陆地区', 'Domestic addresses only')}>
              <Field label={t('收件人', 'Recipient')}><Input autoComplete="name" /></Field>
              <Field label={t('详细地址', 'Street address')}><Input autoComplete="street-address" /></Field>
            </Fieldset>
            <Fieldset legend={t('发票（暂未开放）', 'Invoice (coming soon)')} disabled>
              <Field label={t('抬头', 'Billing name')}><Input /></Field>
              <Checkbox>{t('需要纸质发票', 'Send a paper invoice')}</Checkbox>
            </Fieldset>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('Form', 'Form')} description={t(
        '纵向表单布局。onSubmit 的第一个参数是 FormData，默认的整页跳转已被阻止。FormActions 是底部操作区，窄屏下按钮自动竖排撑满。',
        'Vertical form layout. onSubmit receives FormData as its first argument, and the default full-page navigation is prevented. FormActions is the action area at the bottom; on narrow screens its buttons stack and fill the width.',
      )}>
        <Demo
          title={t('原生校验', 'Native validation')}
          description={t('默认交给浏览器校验（required / type / pattern），通过后才触发 onSubmit。', 'By default the browser validates (required / type / pattern), and onSubmit fires only once that passes.')}
          layout="col"
          code={t(NATIVE_CODE.zh, NATIVE_CODE.en)}
        >
          <NativeForm />
        </Demo>
        <Demo
          title={t('完整示例：自定义校验', 'Full example: custom validation')}
          description={t(
            '加 noValidate 关掉浏览器气泡，提交时自己校验，把错误写进各个 Field 的 error。直接点“创建账号”看看错误状态；改动某一项时清掉它的错误。Select、Combobox、DatePicker 这类浮层控件放进 Field 同样会自动接线，不需要额外处理。',
            'Add noValidate to turn off the browser’s bubbles, validate on submit yourself, and put each error into its Field’s error. Click “Create account” right away to see the error states; editing a field clears its error. Overlay controls such as Select, Combobox and DatePicker are wired up automatically inside a Field too, with no extra work.',
          )}
          layout="col"
          code={t(SIGNUP_CODE.zh, SIGNUP_CODE.en)}
        >
          <SignupForm />
        </Demo>
        <Demo
          title={t('间距与操作区对齐', 'Spacing and action alignment')}
          layout="col"
          code={t(`
<Form size="sm" style={{ width: '100%', maxWidth: 420 }} aria-label="通知偏好">
  <Field label="通知方式">
    <RadioGroup defaultValue="email" orientation="horizontal">
      <Radio value="email">邮件</Radio>
      <Radio value="sms">短信</Radio>
    </RadioGroup>
  </Field>
  <FormActions align="between">
    <Button variant="ghost">恢复默认</Button>
    <Button type="submit" variant="primary">保存</Button>
  </FormActions>
</Form>
`, `
<Form size="sm" style={{ width: '100%', maxWidth: 420 }} aria-label="Notification preferences">
  <Field label="Notify me by">
    <RadioGroup defaultValue="email" orientation="horizontal">
      <Radio value="email">Email</Radio>
      <Radio value="sms">SMS</Radio>
    </RadioGroup>
  </Field>
  <FormActions align="between">
    <Button variant="ghost">Restore defaults</Button>
    <Button type="submit" variant="primary">Save</Button>
  </FormActions>
</Form>
`)}
        >
          <Form size="sm" style={box} aria-label={t('通知偏好', 'Notification preferences')}>
            <Field label={t('通知方式', 'Notify me by')}>
              <RadioGroup defaultValue="email" orientation="horizontal">
                <Radio value="email">{t('邮件', 'Email')}</Radio>
                <Radio value="sms">{t('短信', 'SMS')}</Radio>
              </RadioGroup>
            </Field>
            <FormActions align="between">
              <Button variant="ghost">{t('恢复默认', 'Restore defaults')}</Button>
              <Button type="submit" variant="primary">{t('保存', 'Save')}</Button>
            </FormActions>
          </Form>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Field"
          rows={[
            { name: 'label', type: 'ReactNode', description: t('标签文字，渲染成 <label for>。', 'Label text, rendered as a <label for>.') },
            { name: 'hint', type: 'ReactNode', description: t('提示文字，常驻，通过 aria-describedby 关联到控件。', 'Persistent hint text, linked to the control via aria-describedby.') },
            { name: 'error', type: 'ReactNode', description: t('错误文字；有值即视为校验失败。', 'Error message; any value means validation failed.') },
            { name: 'invalid', type: 'boolean', description: t('没有错误文字但要标红时用。', 'Mark as invalid without an error message.') },
            { name: 'required', type: 'boolean', default: 'false', description: t('必填：标签后显示星号，并把 required 传给控件。', 'Required: shows an asterisk after the label and passes required to the control.') },
            { name: 'disabled', type: 'boolean', default: 'false', description: t('禁用：置灰标签，并把 disabled 传给控件。', 'Disabled: dims the label and passes disabled to the control.') },
            { name: 'id', type: 'string', description: t('控件 id；不传自动生成。', 'Control id; generated if omitted.') },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: t('标签在上，或在左（520px 以上）。', 'Label on top, or on the left (above 520px).') },
            { name: 'children', type: 'ReactNode | (control: FieldControlProps) => ReactNode', description: t('控件。传函数时拿到 id、aria-describedby、aria-invalid、required、disabled，自己接到控件上。', 'The control. As a function it receives id, aria-describedby, aria-invalid, required and disabled for you to apply to the control.') },
          ]}
        />
        <PropsTable
          title="Label"
          rows={[
            { name: 'htmlFor', type: 'string', description: t('指向控件的 id。', 'The id of the control.') },
            { name: 'required', type: 'boolean', description: t('显示必填星号（纯视觉）。', 'Shows the required asterisk (visual only).') },
            { name: 'disabled', type: 'boolean', description: t('置灰。', 'Dimmed.') },
            { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: t('字号。', 'Font size.') },
          ]}
        />
        <PropsTable
          title="Fieldset"
          rows={[
            { name: 'legend', type: 'ReactNode', description: t('图例（这一组的标题）。', 'Legend (the group’s heading).') },
            { name: 'hint', type: 'ReactNode', description: t('图例下的说明，通过 aria-describedby 关联。', 'Note below the legend, linked via aria-describedby.') },
            { name: 'disabled', type: 'boolean', description: t('原生属性：禁用里面的全部控件。', 'Native attribute: disables every control inside.') },
          ]}
        />
        <PropsTable
          title="Form / FormActions"
          rows={[
            { name: 'Form · size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('项与项的间距。', 'Spacing between items.') },
            { name: 'Form · onSubmit', type: '(data: FormData, event: FormEvent) => void', description: t('提交时触发；默认行为已阻止。', 'Fires on submit; the default action is prevented.') },
            { name: 'Form · noValidate', type: 'boolean', description: t('原生属性：关掉浏览器校验，自己处理。', 'Native attribute: turns off browser validation so you can handle it.') },
            { name: 'FormActions · align', type: "'start' | 'end' | 'between'", default: "'start'", description: t('按钮的对齐方式。', 'Button alignment.') },
            { name: 'FormActions · stack', type: 'boolean', default: 'true', description: t('窄屏（< 520px）时按钮竖排并撑满。', 'On narrow screens (< 520px), stack the buttons full width.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>标签是真的 <code>&lt;label for&gt;</code>，点标签即聚焦控件；滑块、单选组这类复合控件改用 <code>aria-labelledby</code> 指向标签。</>,
            <>提示和错误通过 <code>aria-describedby</code> 关联，读屏聚焦控件时会一并读出。</>,
            <>错误区常驻且是 <code>aria-live="polite"</code>，错误出现时自动播报；同时有图标和文字，不只靠红色。</>,
            <>必填星号对读屏隐藏，必填状态由控件上的 <code>required</code> / <code>aria-required</code> 传达。</>,
            <>Fieldset 是原生 <code>&lt;fieldset&gt;</code>，读屏进入时会先读出 legend。</>,
            <>Form 里按 <kbd>Enter</kbd> 提交（焦点在单行输入框时），前提是有一个 <code>type="submit"</code> 的按钮。提交失败后建议把焦点移到第一个出错的控件。</>,
          ], [
            <>The label is a real <code>&lt;label for&gt;</code>, so clicking it focuses the control; composite controls such as sliders and radio groups use <code>aria-labelledby</code> pointing at the label instead.</>,
            <>Hints and errors are linked via <code>aria-describedby</code>, so screen readers read them along with the focused control.</>,
            <>The error area is always present and <code>aria-live="polite"</code>, so errors are announced as they appear; they carry an icon and text, not just red.</>,
            <>The required asterisk is hidden from screen readers; the required state comes from <code>required</code> / <code>aria-required</code> on the control.</>,
            <>Fieldset is a native <code>&lt;fieldset&gt;</code>; screen readers read the legend on entering it.</>,
            <>Pressing <kbd>Enter</kbd> in a Form (with focus in a single-line input) submits it, provided there’s a <code>type="submit"</code> button. After a failed submit, consider moving focus to the first invalid control.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
