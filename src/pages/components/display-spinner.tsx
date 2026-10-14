import { useState } from 'react';
import { Button, Card, Code, Dots, Inline, Spinner, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/spinner', title: 'Spinner 加载', group: '反馈', order: 40, subtitle: 'Spinner · Dots', en: { title: 'Spinner', subtitle: 'Spinner · Dots' } };

const CODE_DOTS = {
  zh: `
<Card size="sm">
  <Inline gap={3}>
    <Text tone="neutral">周屿</Text>
    <Dots label="周屿正在输入" />
  </Inline>
</Card>`,
  en: `
<Card size="sm">
  <Inline gap={3}>
    <Text tone="neutral">Owen Hart</Text>
    <Dots label="Owen Hart is typing" />
  </Inline>
</Card>`,
};

const CODE_INLINE = {
  zh: `
function InlineDemo() {
  const [loading, setLoading] = useState(false);
  const run = () => { setLoading(true); setTimeout(() => setLoading(false), 2400); };
  return (
    <Inline gap={4}>
      <Button onClick={run} disabled={loading}>刷新数据</Button>
      {loading && <Inline gap={2}><Spinner size="sm" label="正在刷新数据" /><Text tone="neutral">正在刷新…</Text></Inline>}
    </Inline>
  );
}`,
  en: `
function InlineDemo() {
  const [loading, setLoading] = useState(false);
  const run = () => { setLoading(true); setTimeout(() => setLoading(false), 2400); };
  return (
    <Inline gap={4}>
      <Button onClick={run} disabled={loading}>Refresh data</Button>
      {loading && <Inline gap={2}><Spinner size="sm" label="Refreshing data" /><Text tone="neutral">Refreshing…</Text></Inline>}
    </Inline>
  );
}`,
};

function InlineDemo() {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const run = () => { setLoading(true); setTimeout(() => setLoading(false), 2400); };
  return (
    <Inline gap={4}>
      <Button onClick={run} disabled={loading}>{t('刷新数据', 'Refresh data')}</Button>
      {loading && <Inline gap={2}><Spinner size="sm" label={t('正在刷新数据', 'Refreshing data')} /><Text tone="neutral">{t('正在刷新…', 'Refreshing…')}</Text></Inline>}
    </Inline>
  );
}

export default function SpinnerPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('告诉人“正在处理，请稍等”。等待很短或无法估计进度时用；知道进度用 Progress，知道内容形状用 Skeleton。', 'Tells people “working on it, hang on”. Use it when the wait is short or progress can’t be estimated; use Progress when you know the progress, and Skeleton when you know the shape of the content.')}>
      <DocSection title={t('两种样子', 'Two styles')} description={t('默认的 tail 是品牌加载器：一截画出来、甩一下、再收回去的小尾巴。ring 是普通的转圈，放在密集界面里更低调。', 'The default tail is the brand loader: a little tail that draws itself, flicks and retracts. ring is a plain spinning circle, quieter in dense interfaces.')}>
        <Demo
          code={`
<Spinner />
<Spinner variant="ring" />`}
        >
          <Spinner />
          <Spinner variant="ring" />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')} description={t('sm 20、md 28（默认）、lg 40，或像素值。颜色跟随强调色。', 'sm 20, md 28 (default), lg 40, or a pixel value. The color follows the accent color.')}>
        <Demo
          code={`
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size={64} />
<Spinner variant="ring" size="sm" />
<Spinner variant="ring" size="lg" />`}
        >
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size={64} />
          <Spinner variant="ring" size="sm" />
          <Spinner variant="ring" size="lg" />
        </Demo>
      </DocSection>

      <DocSection title={t('Dots 圆点', 'Dots')} description={t('三个依次弹跳的圆点，用于“对方正在输入”这类轻量的等待。', 'Three dots bouncing in turn, for light waits like “someone is typing”.')}>
        <Demo code={t(CODE_DOTS.zh, CODE_DOTS.en)}>
          <Card size="sm">
            <Inline gap={3}>
              <Text tone="neutral">{t('周屿', 'Owen Hart')}</Text>
              <Dots label={t('周屿正在输入', 'Owen Hart is typing')} />
            </Inline>
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('配合操作', 'Alongside an action')} description={t('加载器按需出现在触发它的操作旁边。按钮自己的加载状态请直接用 Button 的 loading 属性。', 'The spinner appears on demand next to the action that triggered it. For a button’s own loading state, use Button’s loading prop.')}>
        <Demo minHeight={104} code={t(CODE_INLINE.zh, CODE_INLINE.en)}>
          <InlineDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('尾巴', 'Tail'), t('描线 + 摆动 ±11° · 1.5s', 'stroke draw + swing ±11° · 1.5s')],
          [t('圆点', 'Dots'), t('依次弹跳 · 间隔 120ms', 'bounce in turn · 120ms apart')],
          [t('转圈', 'Ring'), t('0.8s 线性一圈', '0.8s linear per turn')],
          [t('减弱动效', 'Reduced motion'), t('尾巴不甩、圆点不跳，改成描线 / 透明度变化', 'no tail flick or bouncing dots; stroke drawing / opacity changes instead')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Spinner" rows={[
          { name: 'variant', type: "'tail' | 'ring'", default: "'tail'", description: t('tail：品牌加载器；ring：普通的转圈。', 'tail: the brand loader; ring: a plain spinning circle.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", description: t('20 / 28 / 40，或像素值。', '20 / 28 / 40, or a pixel value.') },
          { name: 'label', type: 'string', default: t("'加载中'", "'Loading'"), description: t('给读屏的文字。', 'Text for screen readers. The default follows the OinkProvider locale.') },
        ]} />
        <PropsTable title="Dots" rows={[
          { name: 'label', type: 'string', default: t("'加载中'", "'Loading'"), description: t('给读屏的文字。', 'Text for screen readers. The default follows the OinkProvider locale.') },
        ]} />
        <A11yNotes items={t([
          <>两者都是 <Code>role="status"</Code>：出现时读屏会礼貌地读出 label（默认“加载中”），图形本身对读屏隐藏。</>,
          '请把 label 写具体（“正在刷新数据”），尤其是一页里可能同时有多个加载器的时候。',
          '不可聚焦，没有键盘操作。加载结束后把它卸载，并用文字或 Toast 说明结果。',
          '减弱动效时不会完全静止：尾巴保留描线、圆点改成明暗交替，仍然看得出在加载。',
        ], [
          <>Both are <Code>role="status"</Code>: when they appear, screen readers politely read the label (“Loading” by default); the graphic itself is hidden from screen readers.</>,
          'Make the label specific (“Refreshing data”), especially when a page may show several spinners at once.',
          'Not focusable, no keyboard interaction. Unmount it when loading ends, and report the result in text or a Toast.',
          'Under reduced motion it doesn’t freeze entirely: the tail keeps its stroke drawing and the dots fade in and out, so it still reads as loading.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
