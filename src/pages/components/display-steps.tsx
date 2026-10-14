import { useState } from 'react';
import { Button, Code, Icon, Inline, Stack, Steps } from 'oink-ui';
import type { StepItem } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/steps', title: 'Steps 步骤条', group: '导航', order: 50, subtitle: 'Steps', en: { title: 'Steps' } };

const STEPS: { zh: StepItem[]; en: StepItem[] } = {
  zh: [
    { title: '填写信息', description: '收货人和地址' },
    { title: '选择支付', description: '支持多种方式' },
    { title: '确认订单', description: '核对后提交' },
  ],
  en: [
    { title: 'Details', description: 'Recipient and address' },
    { title: 'Payment', description: 'Several methods supported' },
    { title: 'Confirm', description: 'Review and place order' },
  ],
};

const CODE_WIZARD = {
  zh: `
const steps: StepItem[] = [
  { title: '填写信息', description: '收货人和地址' },
  { title: '选择支付', description: '支持多种方式' },
  { title: '确认订单', description: '核对后提交' },
];

function WizardDemo() {
  const [current, setCurrent] = useState(1);
  const [failed, setFailed] = useState(false);
  return (
    <Stack gap={5}>
      <Steps items={steps} current={current} status={failed ? 'error' : 'default'} />
      <Inline justify="center">
        <Button disabled={current === 0} onClick={() => { setFailed(false); setCurrent(current - 1); }}>上一步</Button>
        <Button variant="primary" disabled={current === steps.length} onClick={() => { setFailed(false); setCurrent(current + 1); }}>
          {current >= steps.length - 1 ? '完成' : '下一步'}
        </Button>
        <Button variant="ghost" disabled={current === steps.length} onClick={() => setFailed(!failed)}>{failed ? '清除错误' : '模拟出错'}</Button>
      </Inline>
    </Stack>
  );
}`,
  en: `
const steps: StepItem[] = [
  { title: 'Details', description: 'Recipient and address' },
  { title: 'Payment', description: 'Several methods supported' },
  { title: 'Confirm', description: 'Review and place order' },
];

function WizardDemo() {
  const [current, setCurrent] = useState(1);
  const [failed, setFailed] = useState(false);
  return (
    <Stack gap={5}>
      <Steps items={steps} current={current} status={failed ? 'error' : 'default'} />
      <Inline justify="center">
        <Button disabled={current === 0} onClick={() => { setFailed(false); setCurrent(current - 1); }}>Back</Button>
        <Button variant="primary" disabled={current === steps.length} onClick={() => { setFailed(false); setCurrent(current + 1); }}>
          {current >= steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
        <Button variant="ghost" disabled={current === steps.length} onClick={() => setFailed(!failed)}>{failed ? 'Clear error' : 'Simulate error'}</Button>
      </Inline>
    </Stack>
  );
}`,
};

const CODE_VERTICAL = {
  zh: `
<Steps
  orientation="vertical"
  label="导入进度"
  current={2}
  items={[
    { title: '上传文件', description: 'members.csv，共 1,204 行' },
    { title: '匹配字段', description: '已匹配 8 个字段，忽略 2 个' },
    { title: '校验数据', description: '正在检查重复的邮箱…' },
    { title: '完成导入' },
  ]}
/>`,
  en: `
<Steps
  orientation="vertical"
  label="Import progress"
  current={2}
  items={[
    { title: 'Upload file', description: 'members.csv, 1,204 rows' },
    { title: 'Map fields', description: '8 fields mapped, 2 ignored' },
    { title: 'Validate data', description: 'Checking for duplicate emails…' },
    { title: 'Finish import' },
  ]}
/>`,
};

const CODE_ICONS = {
  zh: `
<Steps
  label="发布流程"
  current={1}
  items={[
    { title: '编辑', icon: <Icon name="edit" /> },
    { title: '上传', icon: <Icon name="upload" /> },
    { title: '分享', icon: <Icon name="share" /> },
  ]}
/>`,
  en: `
<Steps
  label="Publishing"
  current={1}
  items={[
    { title: 'Edit', icon: <Icon name="edit" /> },
    { title: 'Upload', icon: <Icon name="upload" /> },
    { title: 'Share', icon: <Icon name="share" /> },
  ]}
/>`,
};

function WizardDemo() {
  const t = useT();
  const steps = t(STEPS.zh, STEPS.en);
  const [current, setCurrent] = useState(1);
  const [failed, setFailed] = useState(false);
  return (
    <Stack gap={5}>
      <Steps items={steps} current={current} status={failed ? 'error' : 'default'} />
      <Inline justify="center">
        <Button disabled={current === 0} onClick={() => { setFailed(false); setCurrent(current - 1); }}>{t('上一步', 'Back')}</Button>
        <Button variant="primary" disabled={current === steps.length} onClick={() => { setFailed(false); setCurrent(current + 1); }}>
          {current >= steps.length - 1 ? t('完成', 'Finish') : t('下一步', 'Next')}
        </Button>
        <Button variant="ghost" disabled={current === steps.length} onClick={() => setFailed(!failed)}>{failed ? t('清除错误', 'Clear error') : t('模拟出错', 'Simulate error')}</Button>
      </Inline>
    </Stack>
  );
}

export default function StepsPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('一个要分几步走完的流程，现在走到了哪一步：注册、下单、导入向导。它只展示进度，不负责切换内容。', 'Shows how far along a multi-step flow is: sign-up, checkout, an import wizard. It only displays progress; it doesn’t switch the content.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('current 是当前步骤的下标（从 0 开始）；之前的步骤显示对勾，之后的显示序号。current 等于步骤数表示全部完成。status="error" 把当前步骤标成出错。', 'current is the index of the current step (from 0); earlier steps show a check mark, later ones their number. current equal to the number of steps means all are complete. status="error" marks the current step as failed.')}>
        <Demo layout="block" code={t(CODE_WIZARD.zh, CODE_WIZARD.en)}>
          <WizardDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('纵向', 'Vertical')} description={t('默认横向排列，窄于 520px 时自动改成纵向。步骤多、说明长，或者放在侧栏里时直接用 orientation="vertical"。', 'Horizontal by default, switching to vertical below 520px. With many steps, long descriptions or a sidebar placement, use orientation="vertical" directly.')}>
        <Demo layout="block" code={t(CODE_VERTICAL.zh, CODE_VERTICAL.en)}>
          <Steps
            orientation="vertical"
            label={t('导入进度', 'Import progress')}
            current={2}
            items={t([
              { title: '上传文件', description: 'members.csv，共 1,204 行' },
              { title: '匹配字段', description: '已匹配 8 个字段，忽略 2 个' },
              { title: '校验数据', description: '正在检查重复的邮箱…' },
              { title: '完成导入' },
            ], [
              { title: 'Upload file', description: 'members.csv, 1,204 rows' },
              { title: 'Map fields', description: '8 fields mapped, 2 ignored' },
              { title: 'Validate data', description: 'Checking for duplicate emails…' },
              { title: 'Finish import' },
            ])}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('自定义图标', 'Custom icons')} description={t('icon 替换圆圈里的序号。已完成的步骤仍然显示对勾，出错的显示叉号。', 'icon replaces the number in the circle. Completed steps still show a check mark, and failed ones a cross.')}>
        <Demo layout="block" code={t(CODE_ICONS.zh, CODE_ICONS.en)}>
          <Steps
            label={t('发布流程', 'Publishing')}
            current={1}
            items={[
              { title: t('编辑', 'Edit'), icon: <Icon name="edit" /> },
              { title: t('上传', 'Upload'), icon: <Icon name="upload" /> },
              { title: t('分享', 'Share'), icon: <Icon name="share" /> },
            ]}
          />
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Steps" rows={[
          { name: 'items', type: 'StepItem[]', required: true, description: t('步骤列表。', 'The steps.') },
          { name: 'current', type: 'number', default: '0', description: t('当前步骤的下标（从 0 开始）；等于 items.length 表示全部完成。', 'Index of the current step (from 0); equal to items.length means all complete.') },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: t('方向。horizontal 在窄屏自动改成纵向。', 'Direction. horizontal switches to vertical on narrow screens.') },
          { name: 'status', type: "'default' | 'error'", default: "'default'", description: t('当前步骤是否出错。', 'Whether the current step has failed.') },
          { name: 'label', type: 'string', default: t("'步骤'", "'Steps'"), description: t('步骤条的名字。', 'Name of the steps list. The default follows the OinkProvider locale.') },
        ]} />
        <PropsTable title="StepItem" rows={[
          { name: 'title', type: 'ReactNode', required: true, description: t('步骤名。', 'Step name.') },
          { name: 'description', type: 'ReactNode', description: t('步骤说明。', 'Step description.') },
          { name: 'icon', type: 'ReactNode', description: t('替换圆圈里的序号。', 'Replaces the number in the circle.') },
        ]} />
        <A11yNotes items={t([
          <>渲染成有名字的有序列表 <Code>ol</Code>；当前步骤带 <Code>aria-current="step"</Code>。</>,
          '每一步的标题前有一段只给读屏的文字：“第 2 步，当前步骤：”“第 1 步，已完成：”“出错：”。状态不只靠颜色，圆圈里还有对勾、叉号或序号。',
          '步骤条是只读的，不可聚焦、没有键盘操作。需要点步骤跳转时，请另外提供按钮（如上面的“上一步 / 下一步”）。',
          <>步骤变化不会自动播报；切换步骤后请把焦点移到新一步的标题上，或在一个 <Code>role="status"</Code> 区域里说明。</>,
        ], [
          <>Renders a named ordered list <Code>ol</Code>; the current step has <Code>aria-current="step"</Code>.</>,
          'Each step title is preceded by screen-reader-only text: “Step 2, Current step:”, “Step 1, Completed:”, “Error:”. State doesn’t rely on color alone; the circle also shows a check mark, a cross or the number.',
          'Steps are read-only: not focusable, no keyboard interaction. If people need to jump between steps, provide separate buttons (like Back / Next above).',
          <>Step changes aren’t announced automatically; after changing steps, move focus to the new step’s heading, or describe the change in a <Code>role="status"</Code> region.</>,
        ])} />
      </DocSection>
    </DocPage>
  );
}
