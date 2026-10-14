import { useState } from 'react';
import { Code, Heading, Slider, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/text', title: 'Text / Heading 文字', group: '基础', order: 2, subtitle: 'Text · Heading', en: { title: 'Text / Heading' } };

const VARIANTS_CODE = {
  zh: `import { Stack, Text } from 'oink-ui';

<Stack gap={2}>
  <Text variant="body-l">body-l：导语，比正文大一档</Text>
  <Text variant="body">body：正文（默认）</Text>
  <Text variant="label">label：标签与按钮文字</Text>
  <Text variant="caption">caption：说明、辅助信息</Text>
  <Text variant="micro">micro · overline</Text>
  <Text variant="mono">mono：⌘K 240ms</Text>
</Stack>`,
  en: `import { Stack, Text } from 'oink-ui';

<Stack gap={2}>
  <Text variant="body-l">body-l: lead text, one step above body</Text>
  <Text variant="body">body: body text (default)</Text>
  <Text variant="label">label: labels and button text</Text>
  <Text variant="caption">caption: notes and supporting info</Text>
  <Text variant="micro">micro · overline</Text>
  <Text variant="mono">mono: ⌘K 240ms</Text>
</Stack>`,
};

const TONE_CODE = {
  zh: `import { Stack, Text } from 'oink-ui';

<Stack gap={1}>
  <Text>default：跟随父级</Text>
  <Text tone="neutral">neutral：次要文字</Text>
  <Text tone="subtle">subtle：三级色，只用于装饰性文字</Text>
  <Text tone="accent">accent</Text>
  <Text tone="success">success</Text>
  <Text tone="warning">warning</Text>
  <Text tone="danger">danger</Text>
  <Text tone="info">info</Text>
</Stack>`,
  en: `import { Stack, Text } from 'oink-ui';

<Stack gap={1}>
  <Text>default: inherits from the parent</Text>
  <Text tone="neutral">neutral: secondary text</Text>
  <Text tone="subtle">subtle: tertiary, for decorative text only</Text>
  <Text tone="accent">accent</Text>
  <Text tone="success">success</Text>
  <Text tone="warning">warning</Text>
  <Text tone="danger">danger</Text>
  <Text tone="info">info</Text>
</Stack>`,
};

const HEADING_CODE = {
  zh: `import { Heading, Stack } from 'oink-ui';

<Stack gap={3}>
  <Heading level={2} variant="display">display</Heading>
  <Heading level={2} variant="h1">h1 的大小</Heading>
  <Heading level={2}>h2（level 默认 2）</Heading>
  <Heading level={3}>h3</Heading>
  <Heading level={4}>h4</Heading>
  {/* 语义是 h3，看起来是 h4 */}
  <Heading level={3} variant="h4">h3 的语义、h4 的大小</Heading>
</Stack>`,
  en: `import { Heading, Stack } from 'oink-ui';

<Stack gap={3}>
  <Heading level={2} variant="display">display</Heading>
  <Heading level={2} variant="h1">h1 size</Heading>
  <Heading level={2}>h2 (level defaults to 2)</Heading>
  <Heading level={3}>h3</Heading>
  <Heading level={4}>h4</Heading>
  {/* Semantically an h3, looks like an h4 */}
  <Heading level={3} variant="h4">h3 semantics, h4 size</Heading>
</Stack>`,
};

const TRUNCATE_CODE = {
  zh: `import { Stack, Text } from 'oink-ui';

<Stack gap={3} style={{ width }}>
  <Text as="p" truncate style={{ margin: 0 }}>
    单行省略：这是一段比较长的文字，容器放不下的时候末尾会变成省略号。
  </Text>
  <Text as="p" lineClamp={2} tone="neutral" style={{ margin: 0 }}>
    多行省略：这是一段更长的文字，最多显示两行。超过两行的部分会被截断，并在第二行的末尾加上省略号，适合卡片里的摘要。
  </Text>
</Stack>`,
  en: `import { Stack, Text } from 'oink-ui';

<Stack gap={3} style={{ width }}>
  <Text as="p" truncate style={{ margin: 0 }}>
    Single-line truncation: this is a fairly long sentence, and when the container runs out of room its end turns into an ellipsis.
  </Text>
  <Text as="p" lineClamp={2} tone="neutral" style={{ margin: 0 }}>
    Multi-line clamping: this is an even longer passage that shows at most two lines. Anything past the second line is cut off and an ellipsis is added at the end of line two, which suits summaries inside cards.
  </Text>
</Stack>`,
};

const AS_CODE = {
  zh: `import { Text } from 'oink-ui';

<Text as="p" style={{ margin: 0 }}>
  渲染成 <Text as="strong" variant="label">strong</Text>、
  <Text as="em" tone="accent">em</Text> 或者
  <Text as="code" variant="mono">code</Text> 都可以。
</Text>`,
  en: `import { Text } from 'oink-ui';

<Text as="p" style={{ margin: 0 }}>
  Render as <Text as="strong" variant="label">strong</Text>,{' '}
  <Text as="em" tone="accent">em</Text> or{' '}
  <Text as="code" variant="mono">code</Text>, whatever you need.
</Text>`,
};

function TruncateDemo() {
  const t = useT();
  const [width, setWidth] = useState(280);
  return (
    <Stack gap={4} align="center" className="g-fill">
      <div style={{ width: 'min(280px, 100%)' }}>
        <Slider aria-label={t('容器宽度', 'Container width')} min={160} max={480} step={20} value={width} onChange={setWidth} format={(v) => v + 'px'} />
      </div>
      <Stack gap={3} style={{ width, maxWidth: '100%' }}>
        <Text as="p" truncate style={{ margin: 0 }}>
          {t('单行省略：这是一段比较长的文字，容器放不下的时候末尾会变成省略号。', 'Single-line truncation: this is a fairly long sentence, and when the container runs out of room its end turns into an ellipsis.')}
        </Text>
        <Text as="p" lineClamp={2} tone="neutral" style={{ margin: 0 }}>
          {t('多行省略：这是一段更长的文字，最多显示两行。超过两行的部分会被截断，并在第二行的末尾加上省略号，适合卡片里的摘要。', 'Multi-line clamping: this is an even longer passage that shows at most two lines. Anything past the second line is cut off and an ellipsis is added at the end of line two, which suits summaries inside cards.')}
        </Text>
      </Stack>
    </Stack>
  );
}

export default function TextPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('Text 把字阶、颜色、省略这几件事收成属性；Heading 是带语义级别的标题，级别和大小可以分开选。两者都只是给元素加上 .ok-t-* 类名，不想用组件时直接写类名效果一样。', 'Text turns type scale, color and truncation into props; Heading is a heading with a semantic level, where level and size are chosen independently. Both only add .ok-t-* class names to the element, so writing the classes by hand works just the same if you’d rather skip the components.')}>
      <DocSection title={t('Text', 'Text')}>
        <Demo title={t('字阶', 'Type scale')} code={t(VARIANTS_CODE.zh, VARIANTS_CODE.en)} align="start">
          <Stack gap={2}>
            <Text variant="body-l">{t('body-l：导语，比正文大一档', 'body-l: lead text, one step above body')}</Text>
            <Text variant="body">{t('body：正文（默认）', 'body: body text (default)')}</Text>
            <Text variant="label">{t('label：标签与按钮文字', 'label: labels and button text')}</Text>
            <Text variant="caption">{t('caption：说明、辅助信息', 'caption: notes and supporting info')}</Text>
            <Text variant="micro">micro · overline</Text>
            <Text variant="mono">{t('mono：⌘K 240ms', 'mono: ⌘K 240ms')}</Text>
          </Stack>
        </Demo>
        <Demo title={t('颜色', 'Color')} description={t('neutral 是次要色；subtle 是三级色，对比度不足 4.5:1，不要用在需要读的文字上。状态色用的是各自的 -text 档，深浅主题下都够对比度。', 'neutral is the secondary color; subtle is tertiary and falls below 4.5:1 contrast, so keep it off text people need to read. Status tones use their own -text step, which has enough contrast in both light and dark themes.')} code={t(TONE_CODE.zh, TONE_CODE.en)} align="start">
          <Stack gap={1}>
            <Text>{t('default：跟随父级', 'default: inherits from the parent')}</Text>
            <Text tone="neutral">{t('neutral：次要文字', 'neutral: secondary text')}</Text>
            <Text tone="subtle">{t('subtle：三级色，只用于装饰性文字', 'subtle: tertiary, for decorative text only')}</Text>
            <Text tone="accent">accent</Text>
            <Text tone="success">success</Text>
            <Text tone="warning">warning</Text>
            <Text tone="danger">danger</Text>
            <Text tone="info">info</Text>
          </Stack>
        </Demo>
        <Demo title={t('省略', 'Truncation')} description={t('拖动滑块改变容器宽度。', 'Drag the slider to change the container width.')} code={t(TRUNCATE_CODE.zh, TRUNCATE_CODE.en)} layout="block">
          <TruncateDemo />
        </Demo>
        <Demo title={t('渲染成别的元素', 'Rendering as another element')} description={t('默认是 span。用 as 换成 p、strong、em、code 等；类型上只接受通用的 HTML 属性。', 'Renders a span by default. Use as to switch to p, strong, em, code and so on; the types only accept generic HTML attributes.')} code={t(AS_CODE.zh, AS_CODE.en)}>
          {t(
            <Text as="p" style={{ margin: 0 }}>
              渲染成 <Text as="strong" variant="label">strong</Text>、
              <Text as="em" tone="accent">em</Text> 或者
              <Text as="code" variant="mono">code</Text> 都可以。
            </Text>,
            <Text as="p" style={{ margin: 0 }}>
              Render as <Text as="strong" variant="label">strong</Text>,{' '}
              <Text as="em" tone="accent">em</Text> or{' '}
              <Text as="code" variant="mono">code</Text>, whatever you need.
            </Text>,
          )}
        </Demo>
        <PropsTable
          title={t('Text 属性', 'Text props')}
          rows={[
            { name: 'variant', type: `'display' | 'h1' | 'h2' | 'h3' | 'body-l' | 'body' | 'label' | 'caption' | 'micro' | 'mono'`, default: `'body'`, description: t('字体样式，对应 .ok-t-*。', 'Type style, maps to .ok-t-*.') },
            { name: 'as', type: 'ElementType', default: `'span'`, description: t('渲染成什么元素。', 'Which element to render.') },
            { name: 'tone', type: `'default' | 'subtle' | 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'`, default: `'default'`, description: t('文字颜色。default 跟随父级。', 'Text color. default inherits from the parent.') },
            { name: 'truncate', type: 'boolean', default: 'false', description: t('单行省略。', 'Single-line truncation.') },
            { name: 'lineClamp', type: 'number', description: t('多行省略的行数。', 'Number of lines before clamping.') },
            { name: 'align', type: `'start' | 'center' | 'end'`, description: t('文字对齐。', 'Text alignment.') },
          ]}
        />
      </DocSection>

      <DocSection title={t('Heading', 'Heading')}>
        <Demo description={t('level 决定渲染成 h1–h4，variant 决定视觉大小（默认跟随 level）。display、h1、h2 三档在窄屏上会按视口宽度缩小。', 'level decides whether it renders h1–h4, variant decides the visual size (follows level by default). display, h1 and h2 scale down with the viewport on narrow screens.')} code={t(HEADING_CODE.zh, HEADING_CODE.en)} align="start">
          <Stack gap={3}>
            <Heading level={2} variant="display">display</Heading>
            <Heading level={2} variant="h1">{t('h1 的大小', 'h1 size')}</Heading>
            <Heading level={2}>{t('h2（level 默认 2）', 'h2 (level defaults to 2)')}</Heading>
            <Heading level={3}>h3</Heading>
            <Heading level={4}>h4</Heading>
            <Heading level={3} variant="h4">{t('h3 的语义、h4 的大小', 'h3 semantics, h4 size')}</Heading>
          </Stack>
        </Demo>
        <PropsTable
          title={t('Heading 属性', 'Heading props')}
          rows={[
            { name: 'level', type: '1 | 2 | 3 | 4', default: '2', description: t('语义层级，渲染成 h1–h4。', 'Semantic level; renders h1–h4.') },
            { name: 'variant', type: `'display' | 'h1' | 'h2' | 'h3' | 'h4'`, description: t('视觉大小；默认跟随 level。', 'Visual size; follows level by default.') },
            { name: 'tone', type: 'TextTone', default: `'default'`, description: t('同 Text。', 'Same as Text.') },
            { name: 'truncate', type: 'boolean', default: 'false', description: t('单行省略。', 'Single-line truncation.') },
            { name: 'align', type: `'start' | 'center' | 'end'`, description: t('文字对齐。', 'Text alignment.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>标题级别按文档结构选，不按大小选：每页一个 <Code>h1</Code>，往下逐级，不跳级。想要别的大小用 <Code>variant</Code>。</>,
            <>被 <Code>truncate</Code> / <Code>lineClamp</Code> 截掉的文字读屏仍然能读到；但看得见的用户读不到，重要信息不要放在可能被截掉的位置。</>,
            <>不要用 <Code>tone="subtle"</Code> 写需要阅读的内容。</>,
          ], [
            <>Choose heading levels by document structure, not by size: one <Code>h1</Code> per page, then step down one level at a time without skipping. Use <Code>variant</Code> for a different size.</>,
            <>Text cut off by <Code>truncate</Code> / <Code>lineClamp</Code> is still read by screen readers, but sighted users can’t see it, so don’t put important information where it might be cut.</>,
            <>Don’t use <Code>tone="subtle"</Code> for content people need to read.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
