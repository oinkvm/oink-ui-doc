import { useState } from 'react';
import { Box, Grid, GridItem, Slider, Stack, Text } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { SPACE_NOTE, asRow, restRow, spacingRows } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/grid', title: 'Grid 栅格', group: '布局', order: 3, subtitle: 'Grid · GridItem', en: { title: 'Grid', subtitle: 'Grid · GridItem' } };

const COLUMNS_CODE = {
  zh: `import { Box, Grid } from 'oink-ui';

{/* 默认 1 列，sm 起 2 列，lg 起 4 列 */}
<Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
    <Box key={n} surface="card" border radius={3} padding={4}>{n}</Box>
  ))}
</Grid>`,
  en: `import { Box, Grid } from 'oink-ui';

{/* 1 column by default, 2 from sm, 4 from lg */}
<Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
    <Box key={n} surface="card" border radius={3} padding={4}>{n}</Box>
  ))}
</Grid>`,
};

const AUTO_CODE = {
  zh: `import { Box, Grid } from 'oink-ui';

{/* 每项至少 minItemWidth 宽，能放几列放几列；容器比它还窄时退成一列 */}
<Grid minItemWidth={minItemWidth} gap={3}>
  {[1, 2, 3, 4, 5, 6].map((n) => (
    <Box key={n} surface="card" border radius={3} padding={4}>{n}</Box>
  ))}
</Grid>`,
  en: `import { Box, Grid } from 'oink-ui';

{/* Each item is at least minItemWidth wide and as many columns fit as possible; narrower than that, it falls back to one column */}
<Grid minItemWidth={minItemWidth} gap={3}>
  {[1, 2, 3, 4, 5, 6].map((n) => (
    <Box key={n} surface="card" border radius={3} padding={4}>{n}</Box>
  ))}
</Grid>`,
};

const SPAN_CODE = {
  zh: `import { Box, Grid, GridItem } from 'oink-ui';

<Grid columns={{ base: 2, md: 4 }} gap={3}>
  <GridItem span={{ base: 'full', md: 2 }}>
    <Box surface="card" border radius={3} padding={4}>窄屏整行，md 起跨 2 列</Box>
  </GridItem>
  <Box surface="card" border radius={3} padding={4}>A</Box>
  <Box surface="card" border radius={3} padding={4}>B</Box>
  <GridItem span="full">
    <Box surface="card" border radius={3} padding={4}>span="full"：始终整行</Box>
  </GridItem>
</Grid>`,
  en: `import { Box, Grid, GridItem } from 'oink-ui';

<Grid columns={{ base: 2, md: 4 }} gap={3}>
  <GridItem span={{ base: 'full', md: 2 }}>
    <Box surface="card" border radius={3} padding={4}>Full row on phones, 2 columns from md</Box>
  </GridItem>
  <Box surface="card" border radius={3} padding={4}>A</Box>
  <Box surface="card" border radius={3} padding={4}>B</Box>
  <GridItem span="full">
    <Box surface="card" border radius={3} padding={4}>span="full": always a full row</Box>
  </GridItem>
</Grid>`,
};

function AutoDemo() {
  const [minItemWidth, setMin] = useState(160);
  return (
    <Stack gap={5} className="g-fill">
      <div style={{ width: 'min(320px, 100%)', alignSelf: 'center' }}>
        <Slider aria-label="minItemWidth" min={80} max={320} step={20} value={minItemWidth} onChange={setMin} format={(v) => v + 'px'} />
      </div>
      <Grid minItemWidth={minItemWidth} gap={3}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Box key={n} surface="card" border radius={3} padding={4}>{n}</Box>
        ))}
      </Grid>
    </Stack>
  );
}

export default function GridPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('等宽栅格。两种用法：按断点指定列数（columns），或者只说每项最小多宽、让它自己决定放几列（minItemWidth）。后者不依赖视口断点，放进任何宽度的容器里都成立。', 'An equal-width grid, used in one of two ways: set the column count per breakpoint (columns), or just state the minimum item width and let it decide how many columns fit (minItemWidth). The latter doesn’t depend on viewport breakpoints, so it works in a container of any width.')}>
      <DocSection title={t('示例', 'Examples')}>
        <Demo title={t('响应式列数', 'Responsive columns')} description={t('拖动浏览器宽度看列数变化。', 'Resize the browser to see the column count change.')} code={t(COLUMNS_CODE.zh, COLUMNS_CODE.en)} layout="block">
          <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <Box key={n} surface="card" border radius={3} padding={4}>{n}</Box>
            ))}
          </Grid>
        </Demo>
        <Demo title={t('minItemWidth 自动填充', 'Auto-fill with minItemWidth')} description={t('给了 minItemWidth 就忽略 columns。拖动滑块改变最小宽度。', 'When minItemWidth is set, columns is ignored. Drag the slider to change the minimum width.')} code={t(AUTO_CODE.zh, AUTO_CODE.en)} layout="block">
          <AutoDemo />
        </Demo>
        <Demo title={t('跨列', 'Spanning columns')} description={t('普通单元格不用包；需要跨列、跨行的用 GridItem。', 'Plain cells need no wrapper; use GridItem for cells that span columns or rows.')} code={t(SPAN_CODE.zh, SPAN_CODE.en)} layout="block">
          <Grid columns={{ base: 2, md: 4 }} gap={3}>
            <GridItem span={{ base: 'full', md: 2 }}>
              <Box surface="card" border radius={3} padding={4}>{t('窄屏整行，md 起跨 2 列', 'Full row on phones, 2 columns from md')}</Box>
            </GridItem>
            <Box surface="card" border radius={3} padding={4}>A</Box>
            <Box surface="card" border radius={3} padding={4}>B</Box>
            <GridItem span="full">
              <Box surface="card" border radius={3} padding={4}>{t('span="full"：始终整行', 'span="full": always a full row')}</Box>
            </GridItem>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title={t('Grid 属性', 'Grid props')}
          rows={[
            asRow(t),
            { name: 'columns', type: 'Responsive<number>', default: '1', description: t('列数，等宽。', 'Number of equal-width columns.') },
            { name: 'minItemWidth', type: 'number | string', description: t('每项的最小宽度（数字按 px）。给了它就改为自动填充，忽略 columns。', 'Minimum width of each item (numbers are px). Setting it switches to auto-fill and ignores columns.') },
            { name: 'gap', type: 'Responsive<Space>', default: '4', description: t('行列间距。', 'Gap between rows and columns.') },
            { name: 'rowGap', type: 'Responsive<Space>', description: t('行距，默认同 gap。', 'Gap between rows; defaults to gap.') },
            { name: 'align', type: `Responsive<'start' | 'center' | 'end' | 'stretch' | 'baseline'>`, default: `'stretch'`, description: t('单元格内纵向对齐。', 'Vertical alignment within cells.') },
            { name: 'justify', type: `Responsive<'start' | 'center' | 'end' | 'stretch'>`, default: `'stretch'`, description: t('单元格内横向对齐。', 'Horizontal alignment within cells.') },
            ...spacingRows(t),
            restRow(t),
          ]}
        />
        <PropsTable
          title={t('GridItem 属性', 'GridItem props')}
          rows={[
            asRow(t),
            { name: 'span', type: `Responsive<number | 'full'>`, description: t('横跨几列；full 为整行。', 'How many columns it spans; full spans the whole row.') },
            { name: 'rowSpan', type: 'number', description: t('纵跨几行。', 'How many rows it spans.') },
            restRow(t),
          ]}
        />
        <Text as="p" tone="neutral" style={{ margin: 0 }}>
          {t(
            <>{SPACE_NOTE.zh}列用的是 <code>minmax(0, 1fr)</code>，内容再长也不会把列撑宽。</>,
            <>{SPACE_NOTE.en}Columns use <code>minmax(0, 1fr)</code>, so long content never stretches a column.</>,
          )}
        </Text>
      </DocSection>
    </DocPage>
  );
}
