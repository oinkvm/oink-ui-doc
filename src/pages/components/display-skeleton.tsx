import { useState } from 'react';
import { Avatar, Button, Card, Code, Inline, Skeleton, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/skeleton', title: 'Skeleton 骨架', group: '反馈', order: 30, subtitle: 'Skeleton', en: { title: 'Skeleton' } };

/** 示例里的文字 */
const W = {
  zh: { name: '林小满', meta: '设计 · 3 分钟前', body: '导航改版的第三稿已经传到云盘了，主要改了侧栏的折叠方式和窄屏下的抽屉。', show: '显示内容', back: '回到加载中' },
  en: { name: 'Ella Morgan', meta: 'Design · 3 min ago', body: 'The third draft of the nav redesign is up on Drive. The main changes are how the sidebar collapses and the drawer on narrow screens.', show: 'Show content', back: 'Back to loading' },
};
type Words = typeof W.zh;

const codeLoading = (w: Words) => `
function LoadingCardDemo() {
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 400 }}>
      <Card aria-busy={loading}>
        {loading ? (
          <Stack gap={4}>
            <Inline gap={3} wrap={false}>
              <Skeleton variant="circle" width={36} />
              <Skeleton lines={2} width="60%" />
            </Inline>
            <Skeleton lines={3} />
          </Stack>
        ) : (
          <Stack gap={4}>
            <Inline gap={3} wrap={false}>
              <Avatar name="${w.name}" />
              <Stack gap={0}>
                <Text variant="label">${w.name}</Text>
                <Text variant="caption" tone="neutral">${w.meta}</Text>
              </Stack>
            </Inline>
            <Text as="p" tone="neutral" style={{ margin: 0 }}>${w.body}</Text>
          </Stack>
        )}
      </Card>
      <div>
        <Button size="sm" onClick={() => setLoading(!loading)}>{loading ? '${w.show}' : '${w.back}'}</Button>
      </div>
    </Stack>
  );
}`;

function LoadingCardDemo() {
  const t = useT();
  const w = t(W.zh, W.en);
  const [loading, setLoading] = useState(true);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 400 }}>
      <Card aria-busy={loading}>
        {loading ? (
          <Stack gap={4}>
            <Inline gap={3} wrap={false}>
              <Skeleton variant="circle" width={36} />
              <Skeleton lines={2} width="60%" />
            </Inline>
            <Skeleton lines={3} />
          </Stack>
        ) : (
          <Stack gap={4}>
            <Inline gap={3} wrap={false}>
              <Avatar name={w.name} />
              <Stack gap={0}>
                <Text variant="label">{w.name}</Text>
                <Text variant="caption" tone="neutral">{w.meta}</Text>
              </Stack>
            </Inline>
            <Text as="p" tone="neutral" style={{ margin: 0 }}>{w.body}</Text>
          </Stack>
        )}
      </Card>
      <div>
        <Button size="sm" onClick={() => setLoading(!loading)}>{loading ? w.show : w.back}</Button>
      </div>
    </Stack>
  );
}

export default function SkeletonPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('内容还没到的时候先把它的轮廓画出来，等真内容来了原地替换，页面不跳。加载通常超过一秒、而且知道内容大概长什么样时用；否则用 Spinner。', 'Sketches the outline of content before it arrives, then swaps in the real thing in place so the page doesn’t jump. Use it when loading usually takes over a second and you know roughly what the content looks like; otherwise use Spinner.')}>
      <DocSection title={t('三种形状', 'Three shapes')} description={t('text 是一条文字（默认高 12），circle 是头像，rect 是图片或卡片块。width / height 接受数字（px）或 CSS 长度。', 'text is a line of text (12 high by default), circle is an avatar, rect is an image or card block. width / height take a number (px) or a CSS length.')}>
        <Demo
          layout="col"
          code={`
<Skeleton width="50%" />
<Skeleton variant="circle" />
<Skeleton variant="circle" width={64} />
<Skeleton variant="rect" />
<Skeleton variant="rect" width={160} height={120} />`}
        >
          <Skeleton width="50%" />
          <Skeleton variant="circle" />
          <Skeleton variant="circle" width={64} />
          <Skeleton variant="rect" />
          <Skeleton variant="rect" width={160} height={120} />
        </Demo>
      </DocSection>

      <DocSection title={t('多行文字', 'Multiple lines')} description={t('lines 渲染几行，最后一行自动短一些（70%）。', 'lines renders several lines; the last one is automatically shorter (70%).')}>
        <Demo layout="block" code={`<Skeleton lines={4} />`}>
          <Skeleton lines={4} />
        </Demo>
      </DocSection>

      <DocSection title={t('拼成内容的样子', 'Shaped like the content')} description={t('用几块骨架拼出真实内容的布局，并在外层容器上标 aria-busy。', 'Combine a few skeletons into the layout of the real content, and mark the outer container with aria-busy.')}>
        <Demo code={codeLoading(t(W.zh, W.en))}>
          <LoadingCardDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('高光', 'Shimmer'), t('扫过 · 1.6s 线性循环', 'sweeps across · 1.6s linear loop')],
          [t('圆角', 'Corner radius'), t('文字 8 · 方块 12 · 圆形全圆', 'text 8 · rect 12 · circle fully round')],
          [t('减弱动效', 'Reduced motion'), t('高光停下，只留静态底色', 'shimmer stops, leaving a static fill')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'variant', type: "'text' | 'circle' | 'rect'", default: "'text'", description: t('形状。', 'Shape.') },
          { name: 'width', type: 'number | string', description: t('宽度。text / rect 默认撑满；circle 默认 40。', 'Width. text / rect fill the container by default; circle defaults to 40.') },
          { name: 'height', type: 'number | string', description: t('高度。text 默认 12，rect 默认 96；circle 默认等于宽度。', 'Height. text defaults to 12, rect to 96; circle matches its width.') },
          { name: 'lines', type: 'number', default: '1', description: t('text 时渲染几行，最后一行短一些。', 'Number of lines for text; the last one is shorter.') },
        ]} />
        <A11yNotes items={t([
          <>骨架是纯装饰，自带 <Code>aria-hidden</Code>，读屏完全读不到。</>,
          <>所以“正在加载”要另外告诉读屏：在外层容器上标 <Code>aria-busy="true"</Code>，必要时再加一段只给读屏的“加载中”文字（或一个 Spinner）。</>,
          '内容到了之后去掉 aria-busy。骨架不可聚焦，没有键盘操作。',
          '减弱动效时高光不再扫过。',
        ], [
          <>Skeletons are purely decorative and carry <Code>aria-hidden</Code>, so screen readers can’t perceive them at all.</>,
          <>That means “loading” has to be conveyed separately: mark the outer container with <Code>aria-busy="true"</Code>, and if needed add screen-reader-only “Loading” text (or a Spinner).</>,
          'Remove aria-busy once the content arrives. Skeletons aren’t focusable and have no keyboard interaction.',
          'The shimmer stops sweeping under reduced motion.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
