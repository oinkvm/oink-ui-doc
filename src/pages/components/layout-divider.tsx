import { useState } from 'react';
import { AspectRatio, Button, Center, Divider, Inline, Segmented, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/divider', title: 'Divider / AspectRatio 分隔线与宽高比', group: '布局', order: 5, subtitle: 'Divider · AspectRatio', en: { title: 'Divider / AspectRatio' } };

const DIVIDER_CODE = {
  zh: `import { Divider, Stack, Text } from 'oink-ui';

<Stack gap={4} style={{ width: 'min(360px, 100%)' }}>
  <Text>上面的内容</Text>
  <Divider />
  <Text>下面的内容</Text>
  <Divider labelAlign={labelAlign}>或者</Divider>
  <Text>带文字的分隔线</Text>
</Stack>`,
  en: `import { Divider, Stack, Text } from 'oink-ui';

<Stack gap={4} style={{ width: 'min(360px, 100%)' }}>
  <Text>Content above</Text>
  <Divider />
  <Text>Content below</Text>
  <Divider labelAlign={labelAlign}>or</Divider>
  <Text>A divider with a label</Text>
</Stack>`,
};

const VERTICAL_CODE = {
  zh: `import { Button, Divider, Inline } from 'oink-ui';

<Inline gap={3}>
  <Button variant="ghost" size="sm">撤销</Button>
  <Button variant="ghost" size="sm">重做</Button>
  <Divider orientation="vertical" />
  <Button variant="ghost" size="sm">导出</Button>
</Inline>`,
  en: `import { Button, Divider, Inline } from 'oink-ui';

<Inline gap={3}>
  <Button variant="ghost" size="sm">Undo</Button>
  <Button variant="ghost" size="sm">Redo</Button>
  <Divider orientation="vertical" />
  <Button variant="ghost" size="sm">Export</Button>
</Inline>`,
};

const RATIO_CODE = `import { AspectRatio, Center, Text } from 'oink-ui';

<div style={{ width: 'min(360px, 100%)' }}>
  <AspectRatio ratio={ratio} style={{ borderRadius: 'var(--ok-r-3)', background: 'var(--ok-well)' }}>
    <Center style={{ height: '100%' }}>
      <Text variant="mono" tone="neutral">{label}</Text>
    </Center>
  </AspectRatio>
</div>`;

const RATIOS = { '16 / 9': 16 / 9, '4 / 3': 4 / 3, '1 / 1': 1, '3 / 4': 3 / 4 } as const;
type RatioKey = keyof typeof RATIOS;

function DividerPlay() {
  const t = useT();
  const [labelAlign, setLabelAlign] = useState<'start' | 'center' | 'end'>('center');
  return (
    <Stack gap={5} align="center" className="g-fill">
      <Stack gap={4} style={{ width: 'min(360px, 100%)' }}>
        <Text>{t('上面的内容', 'Content above')}</Text>
        <Divider />
        <Text>{t('下面的内容', 'Content below')}</Text>
        <Divider labelAlign={labelAlign}>{t('或者', 'or')}</Divider>
        <Text>{t('带文字的分隔线', 'A divider with a label')}</Text>
      </Stack>
      <Segmented
        size="sm" aria-label="labelAlign" value={labelAlign} onChange={setLabelAlign}
        options={[{ value: 'start', label: 'start' }, { value: 'center', label: 'center' }, { value: 'end', label: 'end' }]}
      />
    </Stack>
  );
}

function RatioPlay() {
  const [label, setLabel] = useState<RatioKey>('16 / 9');
  const ratio = RATIOS[label];
  return (
    <Stack gap={5} align="center" className="g-fill">
      <div style={{ width: 'min(360px, 100%)' }}>
        <AspectRatio ratio={ratio} style={{ borderRadius: 'var(--ok-r-3)', background: 'var(--ok-well)' }}>
          <Center style={{ height: '100%' }}>
            <Text variant="mono" tone="neutral">{label}</Text>
          </Center>
        </AspectRatio>
      </div>
      <Segmented
        size="sm" aria-label="ratio" value={label} onChange={setLabel}
        options={(Object.keys(RATIOS) as RatioKey[]).map((k) => ({ value: k, label: k }))}
      />
    </Stack>
  );
}

export default function DividerPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('Divider 是一条 1px 的发丝线，横竖都行，横向时中间可以带文字。AspectRatio 是一个固定宽高比的盒子，用来给图片、视频、地图这类内容预留位置。', 'Divider is a 1px hairline, horizontal or vertical, and can carry a label in the middle when horizontal. AspectRatio is a box with a fixed aspect ratio that reserves space for images, video, maps and the like.')}>
      <DocSection title={t('Divider', 'Divider')} description={t('分隔用发丝线（--ok-line），不描整圈。行与行之间、工具栏的分组之间用它。', 'Separate with a hairline (--ok-line) rather than outlining the whole box. Use it between rows and between groups in a toolbar.')}>
        <Demo title={t('横向与带文字', 'Horizontal and labeled')} code={t(DIVIDER_CODE.zh, DIVIDER_CODE.en)} layout="block">
          <DividerPlay />
        </Demo>
        <Demo title={t('纵向', 'Vertical')} description={t('放在横向的 flex 容器里，高度自动撑满。', 'Inside a horizontal flex container, it stretches to full height automatically.')} code={t(VERTICAL_CODE.zh, VERTICAL_CODE.en)}>
          <Inline gap={3}>
            <Button variant="ghost" size="sm">{t('撤销', 'Undo')}</Button>
            <Button variant="ghost" size="sm">{t('重做', 'Redo')}</Button>
            <Divider orientation="vertical" />
            <Button variant="ghost" size="sm">{t('导出', 'Export')}</Button>
          </Inline>
        </Demo>
        <PropsTable
          title={t('Divider 属性', 'Divider props')}
          rows={[
            { name: 'orientation', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: t('线的方向。', 'Direction of the line.') },
            { name: 'children', type: 'ReactNode', description: t('线中间的文字（仅横向）。', 'Label in the middle of the line (horizontal only).') },
            { name: 'labelAlign', type: `'start' | 'center' | 'end'`, default: `'center'`, description: t('文字的位置。', 'Where the label sits.') },
            { name: 'decorative', type: 'boolean', default: 'false', description: t('纯装饰：不暴露给读屏（role="none"）。', 'Purely decorative: not exposed to screen readers (role="none").') },
            restRow(t),
          ]}
        />
        <A11yNotes
          items={t([
            '默认 role="separator"；纵向时带 aria-orientation="vertical"。',
            '带纯文字时，文字同时作为 aria-label。',
            '只是视觉上隔开、没有“分组”含义时传 decorative，读屏不会念出一堆“分隔符”。',
          ], [
            'role="separator" by default, plus aria-orientation="vertical" when vertical.',
            'With a plain-text label, the text also serves as the aria-label.',
            'When it only separates visually and carries no grouping meaning, pass decorative so screen readers don’t announce a string of “separator”s.',
          ])}
        />
      </DocSection>

      <DocSection title={t('AspectRatio', 'AspectRatio')} description={t('盒子的宽度跟随外层，高度按比例算。直接子元素是 img、video、iframe、canvas 时自动铺满并裁切（object-fit: cover）。', 'The box takes its width from its parent and computes its height from the ratio. A direct img, video, iframe or canvas child fills it and is cropped (object-fit: cover).')}>
        <Demo code={RATIO_CODE} layout="block">
          <RatioPlay />
        </Demo>
        <PropsTable
          title={t('AspectRatio 属性', 'AspectRatio props')}
          rows={[
            { name: 'ratio', type: 'number | string', default: '16 / 9', description: t(`宽高比：数字（16 / 9）或 '16 / 9' 这样的字符串。`, `Aspect ratio: a number (16 / 9) or a string such as '16 / 9'.`) },
            restRow(t),
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
