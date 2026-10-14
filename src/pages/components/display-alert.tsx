import { useState } from 'react';
import { Alert, Button, Code, Icon, Stack, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/alert', title: 'Alert 提示条', group: '反馈', order: 10, subtitle: 'Alert', en: { title: 'Alert' } };

const CODE_TONES = {
  zh: `
<Alert title="小提示。">按住 Shift 再点可以连续选择多行。</Alert>
<Alert tone="neutral">这个项目已归档，目前是只读的。</Alert>
<Alert tone="info" title="计划维护。">本周六 02:00–04:00 服务会短暂不可用。</Alert>
<Alert tone="success" title="已发布。">所有人现在都能看到最新版本。</Alert>
<Alert tone="warning" title="存储空间即将用完。">已使用 92%，上传可能很快失败。</Alert>
<Alert tone="danger" title="付款失败。">银行卡被拒绝，请更换支付方式后重试。</Alert>`,
  en: `
<Alert title="Tip.">Hold Shift and click to select a range of rows.</Alert>
<Alert tone="neutral">This project is archived and read-only.</Alert>
<Alert tone="info" title="Scheduled maintenance.">The service will be briefly unavailable this Saturday, 02:00–04:00.</Alert>
<Alert tone="success" title="Published.">Everyone can now see the latest version.</Alert>
<Alert tone="warning" title="Storage almost full.">92% used. Uploads may start failing soon.</Alert>
<Alert tone="danger" title="Payment failed.">Your card was declined. Update your payment method and try again.</Alert>`,
};

const CODE_ACTION = {
  zh: `
<Alert
  tone="warning"
  title="存储空间即将用完。"
  action={<Button size="sm" onClick={() => toast('前往升级')}>升级套餐</Button>}
>
  已使用 92%，升级后可获得 100 GB。
</Alert>`,
  en: `
<Alert
  tone="warning"
  title="Storage almost full."
  action={<Button size="sm" onClick={() => toast('Opening upgrade')}>Upgrade plan</Button>}
>
  92% used. Upgrade to get 100 GB.
</Alert>`,
};

const CODE_CLOSABLE = {
  zh: `
function ClosableDemo() {
  const [open, setOpen] = useState(true);
  return (
    <Stack gap={3}>
      <Alert tone="info" title="新版本可用。" closable open={open} onOpenChange={setOpen}>
        刷新页面即可更新到 2.4.0。
      </Alert>
      <div>
        <Button size="sm" disabled={open} onClick={() => setOpen(true)}>再显示一次</Button>
      </div>
    </Stack>
  );
}`,
  en: `
function ClosableDemo() {
  const [open, setOpen] = useState(true);
  return (
    <Stack gap={3}>
      <Alert tone="info" title="A new version is available." closable open={open} onOpenChange={setOpen}>
        Refresh the page to update to 2.4.0.
      </Alert>
      <div>
        <Button size="sm" disabled={open} onClick={() => setOpen(true)}>Show again</Button>
      </div>
    </Stack>
  );
}`,
};

const CODE_ICON = {
  zh: `
<Alert tone="neutral" icon={<Icon name="bell" />}>你关注的任务有 3 条新评论。</Alert>
<Alert tone="success" icon={false}>没有图标的提示条。</Alert>`,
  en: `
<Alert tone="neutral" icon={<Icon name="bell" />}>A task you follow has 3 new comments.</Alert>
<Alert tone="success" icon={false}>An alert without an icon.</Alert>`,
};

function ClosableDemo() {
  const t = useT();
  const [open, setOpen] = useState(true);
  return (
    <Stack gap={3}>
      <Alert tone="info" title={t('新版本可用。', 'A new version is available.')} closable open={open} onOpenChange={setOpen}>
        {t('刷新页面即可更新到 2.4.0。', 'Refresh the page to update to 2.4.0.')}
      </Alert>
      <div>
        <Button size="sm" disabled={open} onClick={() => setOpen(true)}>{t('再显示一次', 'Show again')}</Button>
      </div>
    </Stack>
  );
}

export default function AlertPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('嵌在页面里的一条提示，和它说明的内容待在一起：表单上方的错误汇总、功能区顶部的公告。操作之后一闪而过的反馈用 Toast；必须先处理才能继续的用 Dialog。', 'An inline message that sits next to the content it describes: an error summary above a form, an announcement at the top of a section. For brief feedback after an action, use Toast; for something that must be dealt with before continuing, use Dialog.')}>
      <DocSection title={t('状态色', 'Tones')} description={t('六种 tone，默认 accent。每种带一个默认图标；颜色和图标之外，文字本身要把事情说清楚。', 'Six tones, accent by default. Each comes with a default icon; beyond color and icon, the text itself has to say what’s going on.')}>
        <Demo layout="col" code={t(CODE_TONES.zh, CODE_TONES.en)}>
          <Alert title={t('小提示。', 'Tip.')}>{t('按住 Shift 再点可以连续选择多行。', 'Hold Shift and click to select a range of rows.')}</Alert>
          <Alert tone="neutral">{t('这个项目已归档，目前是只读的。', 'This project is archived and read-only.')}</Alert>
          <Alert tone="info" title={t('计划维护。', 'Scheduled maintenance.')}>{t('本周六 02:00–04:00 服务会短暂不可用。', 'The service will be briefly unavailable this Saturday, 02:00–04:00.')}</Alert>
          <Alert tone="success" title={t('已发布。', 'Published.')}>{t('所有人现在都能看到最新版本。', 'Everyone can now see the latest version.')}</Alert>
          <Alert tone="warning" title={t('存储空间即将用完。', 'Storage almost full.')}>{t('已使用 92%，上传可能很快失败。', '92% used. Uploads may start failing soon.')}</Alert>
          <Alert tone="danger" title={t('付款失败。', 'Payment failed.')}>{t('银行卡被拒绝，请更换支付方式后重试。', 'Your card was declined. Update your payment method and try again.')}</Alert>
        </Demo>
      </DocSection>

      <DocSection title={t('带操作', 'With an action')} description={t('action 放在右侧，通常是一个小按钮。窄于 520px 时操作换到正文下面一行。', 'action sits on the right, usually a small button. Below 520px it wraps onto its own line under the text.')}>
        <Demo layout="col" code={t(CODE_ACTION.zh, CODE_ACTION.en)}>
          <Alert
            tone="warning"
            title={t('存储空间即将用完。', 'Storage almost full.')}
            action={<Button size="sm" onClick={() => toast(t('前往升级', 'Opening upgrade'))}>{t('升级套餐', 'Upgrade plan')}</Button>}
          >
            {t('已使用 92%，升级后可获得 100 GB。', '92% used. Upgrade to get 100 GB.')}
          </Alert>
        </Demo>
      </DocSection>

      <DocSection title={t('可关闭', 'Closable')} description={t('closable 显示关闭按钮。关闭时高度用 soft 弹簧折叠并淡出，结束后才卸载，下面的内容平滑补位。open / onOpenChange 可受控；出现时不做入场动画，避免页面加载时跳动。', 'closable shows a close button. On close, the height collapses on the soft spring while fading out, and the alert unmounts only afterwards, so the content below slides up smoothly. open / onOpenChange make it controlled; there’s no enter animation, so nothing jumps on page load.')}>
        <Demo layout="block" code={t(CODE_CLOSABLE.zh, CODE_CLOSABLE.en)}>
          <ClosableDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('自定义图标', 'Custom icon')} description={t('icon 换掉默认图标；传 false 不显示图标。', 'icon replaces the default icon; pass false to show none.')}>
        <Demo layout="col" code={t(CODE_ICON.zh, CODE_ICON.en)}>
          <Alert tone="neutral" icon={<Icon name="bell" />}>{t('你关注的任务有 3 条新评论。', 'A task you follow has 3 new comments.')}</Alert>
          <Alert tone="success" icon={false}>{t('没有图标的提示条。', 'An alert without an icon.')}</Alert>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('容器', 'Container'), t('圆角 18 · 内边距 16 · 柔和底色，不描边', 'corner radius 18 · padding 16 · soft fill, no border')],
          [t('关闭', 'Close'), t('高度 spring-soft 折叠 + 淡出，结束后卸载', 'height collapses on spring-soft + fades out, then unmounts')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'accent'", description: t('状态色，同时决定默认图标和默认角色。', 'Tone; also sets the default icon and default role.') },
          { name: 'title', type: 'ReactNode', description: t('加粗的标题，后面接正文。', 'Bold title, followed by the body text.') },
          { name: 'icon', type: 'ReactNode | false', description: t('自定义图标；false 不显示。默认按 tone 选。', 'Custom icon; false hides it. Chosen by tone by default.') },
          { name: 'action', type: 'ReactNode', description: t('右侧的操作（按钮、链接）。', 'Action on the right (button, link).') },
          { name: 'closable', type: 'boolean', description: t('显示关闭按钮。', 'Shows a close button.') },
          { name: 'open / defaultOpen', type: 'boolean', default: 'true', description: t('是否显示，受控 / 非受控。', 'Whether it’s shown, controlled / uncontrolled.') },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: t('显示状态变化时。', 'Called when visibility changes.') },
          { name: 'onClose', type: '() => void', description: t('点了关闭按钮。', 'Called when the close button is clicked.') },
          { name: 'closeLabel', type: 'string', default: t("'关闭'", "'Close'"), description: t('关闭按钮的读屏名称。', 'Screen reader name of the close button. The default follows the OinkProvider locale.') },
          { name: 'role', type: 'string', description: t('覆盖默认角色（见下）。', 'Overrides the default role (see below).') },
        ]} />
        <A11yNotes items={t([
          <>warning 和 danger 默认是 <Code>role="alert"</Code>：出现时读屏立即打断播报。其余是 <Code>role="status"</Code>：等读屏空闲时再读。</>,
          <>页面加载时就在的静态提示不需要播报，可以传 <Code>role="note"</Code> 之类覆盖；只有动态插入的才值得用 alert。</>,
          '关闭按钮是带名字的图标按钮，Tab 聚焦、Enter / 空格触发。关闭后焦点会丢失，请在 onClose 里把焦点移到合理的位置。',
          '图标是装饰性的，对读屏隐藏；状态必须从文字里读得出来。',
          '正文文字用正文色，在六种柔和底色上的对比度都高于 4.5:1。',
        ], [
          <>warning and danger default to <Code>role="alert"</Code>: screen readers interrupt to announce them as soon as they appear. The rest are <Code>role="status"</Code> and are read when the screen reader is idle.</>,
          <>Static alerts that are present on page load don’t need announcing; override with something like <Code>role="note"</Code>. Only dynamically inserted alerts deserve alert.</>,
          'The close button is a named icon button: Tab to focus, Enter / Space to activate. Focus is lost after closing, so move it somewhere sensible in onClose.',
          'Icons are decorative and hidden from screen readers; the state must be readable from the text.',
          'Body text uses the body text color, with contrast above 4.5:1 on all six soft fills.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
