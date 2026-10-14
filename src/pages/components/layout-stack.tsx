import { useState } from 'react';
import { Box, Button, Code, Inline, Segmented, Stack, Switch, Tag, Text } from 'oink-ui';
import type { Align, Justify } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { SPACE_NOTE, asRow, restRow, spacingRows } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/stack', title: 'Stack / Inline 排列', group: '布局', order: 2, subtitle: 'Stack · Inline', en: { title: 'Stack / Inline' } };

const STACK_CODE = {
  zh: `import { Box, Stack } from 'oink-ui';

<Stack gap={gap} align={align} style={{ width: 'min(320px, 100%)' }}>
  <Box surface="card" border radius={2} padding={3}>第一项</Box>
  <Box surface="card" border radius={2} padding={3}>第二项，稍微长一点</Box>
  <Box surface="card" border radius={2} padding={3}>第三项</Box>
</Stack>`,
  en: `import { Box, Stack } from 'oink-ui';

<Stack gap={gap} align={align} style={{ width: 'min(320px, 100%)' }}>
  <Box surface="card" border radius={2} padding={3}>First item</Box>
  <Box surface="card" border radius={2} padding={3}>Second item, a little longer</Box>
  <Box surface="card" border radius={2} padding={3}>Third item</Box>
</Stack>`,
};

const DIVIDER_CODE = {
  zh: `import { Stack, Text } from 'oink-ui';

<Stack divider gap={3} style={{ width: 'min(320px, 100%)' }}>
  <Text>账号与安全</Text>
  <Text>通知</Text>
  <Text>外观</Text>
</Stack>`,
  en: `import { Stack, Text } from 'oink-ui';

<Stack divider gap={3} style={{ width: 'min(320px, 100%)' }}>
  <Text>Account and security</Text>
  <Text>Notifications</Text>
  <Text>Appearance</Text>
</Stack>`,
};

const TAGS = {
  zh: ['设计', '前端', '无障碍', '动效', '响应式', '主题', '设计令牌', '组件库'],
  en: ['Design', 'Frontend', 'Accessibility', 'Motion', 'Responsive', 'Theming', 'Design tokens', 'Components'],
};

const INLINE_CODE = {
  zh: `import { Inline, Tag } from 'oink-ui';

<Inline gap={2} justify={justify} wrap={wrap} style={{ width: '100%' }}>
${TAGS.zh.map((s) => `  <Tag>${s}</Tag>`).join('\n')}
</Inline>`,
  en: `import { Inline, Tag } from 'oink-ui';

<Inline gap={2} justify={justify} wrap={wrap} style={{ width: '100%' }}>
${TAGS.en.map((s) => `  <Tag>${s}</Tag>`).join('\n')}
</Inline>`,
};

const COMBINE_CODE = {
  zh: `import { Button, Inline, Stack, Text } from 'oink-ui';

{/* 窄屏纵向排、按钮撑满；sm 起标题和按钮分到两端 */}
<Stack gap={3} style={{ width: '100%' }}>
  <Inline justify="between" gap={3}>
    <Stack gap={1}>
      <Text variant="label">自动备份</Text>
      <Text variant="caption" tone="neutral">每天凌晨 3 点备份一次</Text>
    </Stack>
    <Inline gap={2}>
      <Button>稍后</Button>
      <Button variant="primary">立即备份</Button>
    </Inline>
  </Inline>
</Stack>`,
  en: `import { Button, Inline, Stack, Text } from 'oink-ui';

{/* Stacked vertically on phones with the buttons filling the row; from sm, title and buttons sit at opposite ends */}
<Stack gap={3} style={{ width: '100%' }}>
  <Inline justify="between" gap={3}>
    <Stack gap={1}>
      <Text variant="label">Automatic backup</Text>
      <Text variant="caption" tone="neutral">Backs up every day at 3 a.m.</Text>
    </Stack>
    <Inline gap={2}>
      <Button>Later</Button>
      <Button variant="primary">Back up now</Button>
    </Inline>
  </Inline>
</Stack>`,
};

function StackPlay() {
  const t = useT();
  const [gap, setGap] = useState<'1' | '3' | '6'>('3');
  const [align, setAlign] = useState<Align>('stretch');
  return (
    <Stack gap={5} align="center" className="g-fill">
      <Stack gap={Number(gap) as 1 | 3 | 6} align={align} style={{ width: 'min(320px, 100%)' }}>
        <Box surface="card" border radius={2} padding={3}>{t('第一项', 'First item')}</Box>
        <Box surface="card" border radius={2} padding={3}>{t('第二项，稍微长一点', 'Second item, a little longer')}</Box>
        <Box surface="card" border radius={2} padding={3}>{t('第三项', 'Third item')}</Box>
      </Stack>
      <Inline gap={3} justify="center">
        <Segmented size="sm" aria-label="gap" value={gap} onChange={setGap} options={[{ value: '1', label: 'gap 1' }, { value: '3', label: 'gap 3' }, { value: '6', label: 'gap 6' }]} />
        <Segmented
          size="sm" aria-label="align" value={align} onChange={setAlign}
          options={[{ value: 'stretch', label: 'stretch' }, { value: 'start', label: 'start' }, { value: 'center', label: 'center' }, { value: 'end', label: 'end' }]}
        />
      </Inline>
    </Stack>
  );
}

function InlinePlay() {
  const t = useT();
  const [justify, setJustify] = useState<Justify>('start');
  const [wrap, setWrap] = useState(true);
  return (
    <Stack gap={5} align="center" className="g-fill">
      <Inline gap={2} justify={justify} wrap={wrap} style={{ width: '100%' }}>
        {t(TAGS.zh, TAGS.en).map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </Inline>
      <Inline gap={3} justify="center">
        <Segmented
          size="sm" aria-label="justify" value={justify} onChange={setJustify}
          options={[{ value: 'start', label: 'start' }, { value: 'center', label: 'center' }, { value: 'end', label: 'end' }, { value: 'between', label: 'between' }]}
        />
        <Switch checked={wrap} onChange={setWrap}>wrap</Switch>
      </Inline>
    </Stack>
  );
}

export default function StackPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('两个最常用的布局原语。Stack 把子项纵向排开，Inline 横向排开并在放不下时换行。间距只填档位数字，不写像素；所有间距、对齐属性都支持按断点给值。', 'The two most-used layout primitives. Stack lays children out vertically; Inline lays them out horizontally and wraps when they don’t fit. Spacing takes step numbers, never pixels, and every spacing and alignment prop accepts per-breakpoint values.')}>
      <DocSection title={t('Stack', 'Stack')}>
        <Demo title={t('间距与对齐', 'Spacing and alignment')} code={t(STACK_CODE.zh, STACK_CODE.en)} layout="block">
          <StackPlay />
        </Demo>
        <Demo title={t('分隔线', 'Dividers')} description={t('divider 在子项之间插入 Divider；也可以传自定义节点。', 'divider inserts a Divider between children; you can also pass a custom node.')} code={t(DIVIDER_CODE.zh, DIVIDER_CODE.en)}>
          <Stack divider gap={3} style={{ width: 'min(320px, 100%)' }}>
            <Text>{t('账号与安全', 'Account and security')}</Text>
            <Text>{t('通知', 'Notifications')}</Text>
            <Text>{t('外观', 'Appearance')}</Text>
          </Stack>
        </Demo>
        <PropsTable
          title={t('Stack 属性', 'Stack props')}
          rows={[
            asRow(t),
            { name: 'gap', type: 'Responsive<Space>', default: '4', description: t('子项间距。', 'Spacing between children.') },
            { name: 'align', type: `Responsive<'start' | 'center' | 'end' | 'stretch' | 'baseline'>`, default: `'stretch'`, description: t('交叉轴（横向）对齐。', 'Cross-axis (horizontal) alignment.') },
            { name: 'justify', type: `Responsive<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>`, default: `'start'`, description: t('主轴（纵向）分布。容器有多余高度时才看得出来。', 'Main-axis (vertical) distribution. Only visible when the container has spare height.') },
            { name: 'divider', type: 'boolean | ReactNode', default: 'false', description: t('子项之间插入分隔线。', 'Inserts a divider between children.') },
            ...spacingRows(t),
            restRow(t),
          ]}
        />
      </DocSection>

      <DocSection title={t('Inline', 'Inline')}>
        <Demo title={t('换行与分布', 'Wrapping and distribution')} description={t('把窗口拉窄，或者关掉 wrap 看看。Cluster 是 Inline 的别名。', 'Narrow the window, or turn wrap off and see. Cluster is an alias of Inline.')} code={t(INLINE_CODE.zh, INLINE_CODE.en)} layout="block">
          <InlinePlay />
        </Demo>
        <Demo title={t('组合', 'Combining')} description={t('Inline 放不下时整块换行，不需要断点：窄屏上按钮组自然落到文字下面。', 'When Inline runs out of room it wraps whole blocks, no breakpoints needed: on phones the button group naturally drops below the text.')} code={t(COMBINE_CODE.zh, COMBINE_CODE.en)} layout="block">
          <Stack gap={3} style={{ width: '100%' }}>
            <Inline justify="between" gap={3}>
              <Stack gap={1}>
                <Text variant="label">{t('自动备份', 'Automatic backup')}</Text>
                <Text variant="caption" tone="neutral">{t('每天凌晨 3 点备份一次', 'Backs up every day at 3 a.m.')}</Text>
              </Stack>
              <Inline gap={2}>
                <Button>{t('稍后', 'Later')}</Button>
                <Button variant="primary">{t('立即备份', 'Back up now')}</Button>
              </Inline>
            </Inline>
          </Stack>
        </Demo>
        <PropsTable
          title={t('Inline 属性', 'Inline props')}
          rows={[
            asRow(t),
            { name: 'gap', type: 'Responsive<Space>', default: '2', description: t('子项间距。', 'Spacing between children.') },
            { name: 'rowGap', type: 'Responsive<Space>', description: t('换行后的行距，默认同 gap。', 'Spacing between wrapped rows; defaults to gap.') },
            { name: 'align', type: `Responsive<'start' | 'center' | 'end' | 'stretch' | 'baseline'>`, default: `'center'`, description: t('交叉轴（纵向）对齐。', 'Cross-axis (vertical) alignment.') },
            { name: 'justify', type: `Responsive<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>`, default: `'start'`, description: t('主轴（横向）分布。', 'Main-axis (horizontal) distribution.') },
            { name: 'wrap', type: 'boolean', default: 'true', description: t('放不下时换行。', 'Wraps when there isn’t enough room.') },
            ...spacingRows(t),
            restRow(t),
          ]}
        />
        <Text as="p" tone="neutral" style={{ margin: 0 }}>
          {t(
            <>{SPACE_NOTE.zh}子项默认 <Code>min-width: 0</Code>，长文字不会把容器撑破。</>,
            <>{SPACE_NOTE.en}Children get <Code>min-width: 0</Code> by default, so long text won’t burst the container.</>,
          )}
        </Text>
      </DocSection>
    </DocPage>
  );
}
