import { useState } from 'react';
import { Box, Code, Inline, Segmented, Stack, Switch, Text } from 'oink-ui';
import type { BoxRadius, BoxSurface } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { SPACE_NOTE, asRow, restRow, spacingRows } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/box', title: 'Box 盒子', group: '布局', order: 1, subtitle: 'Box', en: { title: 'Box' } };

const BASIC_CODE = `import { Box, Inline } from 'oink-ui';

<Inline gap={3}>
  <Box surface="well" radius={3} padding={4}>well</Box>
  <Box surface="surface" border radius={3} padding={4}>surface</Box>
  <Box surface="card" border highlight radius={3} padding={4}>card</Box>
  <Box surface="raised" border="strong" highlight radius={3} padding={4}>raised</Box>
</Inline>`;

const PLAY_CODE = `import { Box } from 'oink-ui';

<Box surface={surface} radius={radius} border={border} highlight={highlight} padding={5}>
  Box
</Box>`;

const NEST_CODE = {
  zh: `import { Box } from 'oink-ui';

{/* 套容器用同心：外圆角 r-5（32）− 内边距 2（8）= 内圆角 r-4（24） */}
<Box surface="surface" border highlight radius={5} padding={2}>
  <Box surface="card" border radius={4} padding={5}>内层卡片</Box>
</Box>`,
  en: `import { Box } from 'oink-ui';

{/* Nested containers stay concentric: outer radius r-5 (32) − padding 2 (8) = inner radius r-4 (24) */}
<Box surface="surface" border highlight radius={5} padding={2}>
  <Box surface="card" border radius={4} padding={5}>Inner card</Box>
</Box>`,
};

const RESPONSIVE_CODE = {
  zh: `import { Box } from 'oink-ui';

<Box as="section" aria-label="响应式内边距" surface="card" border radius={4} padding={{ base: 3, md: 6 }} paddingX={{ lg: 10 }}>
  窄屏内边距 12，md 起 24，lg 起左右 40。
</Box>`,
  en: `import { Box } from 'oink-ui';

<Box as="section" aria-label="Responsive padding" surface="card" border radius={4} padding={{ base: 3, md: 6 }} paddingX={{ lg: 10 }}>
  Padding is 12 on phones, 24 from md, and 40 left and right from lg.
</Box>`,
};

function Playground() {
  const t = useT();
  const [surface, setSurface] = useState<BoxSurface>('card');
  const [radius, setRadius] = useState<'2' | '4' | '6' | 'full'>('4');
  const [border, setBorder] = useState<'none' | 'line' | 'strong'>('line');
  const [highlight, setHighlight] = useState(true);
  const r: BoxRadius = radius === 'full' ? 'full' : (Number(radius) as BoxRadius);
  return (
    <Stack gap={5} align="center" className="g-fill">
      <Box surface={surface} radius={r} border={border === 'none' ? false : border === 'line' ? true : 'strong'} highlight={highlight} padding={5}>
        Box
      </Box>
      <Stack gap={3} align="center">
        <Segmented
          size="sm" aria-label="surface" value={surface} onChange={setSurface}
          options={[{ value: 'well', label: 'well' }, { value: 'bg', label: 'bg' }, { value: 'surface', label: 'surface' }, { value: 'card', label: 'card' }, { value: 'raised', label: 'raised' }]}
        />
        <Inline gap={3} justify="center">
          <Segmented
            size="sm" aria-label="radius" value={radius} onChange={setRadius}
            options={[{ value: '2', label: 'r-2' }, { value: '4', label: 'r-4' }, { value: '6', label: 'r-6' }, { value: 'full', label: 'full' }]}
          />
          <Segmented
            size="sm" aria-label="border" value={border} onChange={setBorder}
            options={[{ value: 'none', label: t('无边', 'None') }, { value: 'line', label: t('浅边', 'Light') }, { value: 'strong', label: t('深边', 'Strong') }]}
          />
          <Switch checked={highlight} onChange={setHighlight}>highlight</Switch>
        </Inline>
      </Stack>
    </Stack>
  );
}

export default function BoxPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('最基础的容器：一个可以换标签的元素，带表面色阶、圆角、内描边、顶部高光和内边距这几个和设计令牌直接对应的属性。其余样式照常用 className / style。', 'The most basic container: an element whose tag you can swap, with props that map straight onto design tokens for surface level, corner radius, inner border, top highlight and padding. Everything else is styled with className / style as usual.')}>
      <DocSection title={t('示例', 'Examples')}>
        <Demo title={t('表面色阶', 'Surface levels')} description={t('不用阴影分层：越靠上的层越亮。白色系的块描浅边，浮起来的描深边，大块容器加顶部高光。', 'Layers are told apart without shadows: the higher the layer, the lighter it is. White-ish blocks get a light border, raised ones a strong border, and large containers a top highlight.')} code={BASIC_CODE}>
          <Inline gap={3}>
            <Box surface="well" radius={3} padding={4}>well</Box>
            <Box surface="surface" border radius={3} padding={4}>surface</Box>
            <Box surface="card" border highlight radius={3} padding={4}>card</Box>
            <Box surface="raised" border="strong" highlight radius={3} padding={4}>raised</Box>
          </Inline>
        </Demo>
        <Demo title={t('试一试', 'Try it')} code={PLAY_CODE} layout="block">
          <Playground />
        </Demo>
        <Demo title={t('同心圆角', 'Concentric corners')} description={t('里面装的是另一个圆角容器时，内边距 = 外圆角 − 内圆角。', 'When a box holds another rounded container, padding = outer corner radius − inner corner radius.')} code={t(NEST_CODE.zh, NEST_CODE.en)}>
          <Box surface="surface" border highlight radius={5} padding={2}>
            <Box surface="card" border radius={4} padding={5}>{t('内层卡片', 'Inner card')}</Box>
          </Box>
        </Demo>
        <Demo title={t('响应式内边距与换标签', 'Responsive padding and tag swapping')} code={t(RESPONSIVE_CODE.zh, RESPONSIVE_CODE.en)} layout="block">
          <Box as="section" aria-label={t('响应式内边距', 'Responsive padding')} surface="card" border radius={4} padding={{ base: 3, md: 6 }} paddingX={{ lg: 10 }}>
            {t('窄屏内边距 12，md 起 24，lg 起左右 40。', 'Padding is 12 on phones, 24 from md, and 40 left and right from lg.')}
          </Box>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            asRow(t),
            { name: 'surface', type: `'bg' | 'surface' | 'card' | 'raised' | 'well'`, description: t('表面色阶：bg 画布 → surface 面板 → card 卡片 → raised 浮起；well 为凹槽。同时把文字色设为 --ok-text。', 'Surface level: bg canvas → surface panel → card → raised; well is a recessed well. Also sets the text color to --ok-text.') },
            { name: 'radius', type: `0 | 1 | 2 | 3 | 4 | 5 | 6 | 'full'`, description: t('圆角档位，对应 --ok-r-1..6；full 为全圆。', 'Corner radius step, mapping to --ok-r-1..6; full makes a pill.') },
            { name: 'border', type: `boolean | 'strong'`, default: 'false', description: t('1px 内描边：true 用 --ok-line，strong 用 --ok-line-2。', '1px inner border: true uses --ok-line, strong uses --ok-line-2.') },
            { name: 'highlight', type: 'boolean', default: 'false', description: t('顶部 1.5px 高光，只给大块容器。', 'A 1.5px top highlight, for large containers only.') },
            ...spacingRows(t),
            restRow(t),
          ]}
        />
        <Text as="p" tone="neutral" style={{ margin: 0 }}>
          {t(
            <>{SPACE_NOTE.zh}需要现成的卡片、面板时优先用 <Code>Card</Code>、<Code>Surface</Code>，它们的圆角和内边距已经配好。</>,
            <>{SPACE_NOTE.en}For ready-made cards and panels, prefer <Code>Card</Code> and <Code>Surface</Code>, which come with corner radius and padding already set.</>,
          )}
        </Text>
      </DocSection>
    </DocPage>
  );
}
