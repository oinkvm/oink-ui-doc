import { useState } from 'react';
import { Badge, Box, Button, Center, Container, Icon, Inline, Segmented, Spacer, Stack, Text } from 'oink-ui';
import type { ContainerSize } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { asRow, restRow, spacingRows } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/container', title: 'Container 容器与留白', group: '布局', order: 4, subtitle: 'Container · Center · Spacer', en: { title: 'Container / Center / Spacer' } };

const CONTAINER_CODE = {
  zh: `import { Box, Container } from 'oink-ui';

<Container size={size}>
  <Box surface="card" border radius={3} padding={4}>内容最宽 {size}</Box>
</Container>`,
  en: `import { Box, Container } from 'oink-ui';

<Container size={size}>
  <Box surface="card" border radius={3} padding={4}>Content max width {size}</Box>
</Container>`,
};

const CENTER_CODE = {
  zh: `import { Center, Icon, Inline, Text } from 'oink-ui';

{/* 块级：把内容放到区域正中 */}
<Center style={{ height: 160, width: '100%' }}>
  <Text tone="neutral">空白区域正中的一句话</Text>
</Center>

{/* inline：给图标一个固定大小的底，图标在里面居中 */}
<Inline gap={3}>
  <Center inline style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--ok-fill)' }}>
    <Icon name="bell" />
  </Center>
  <Text>inline 用法</Text>
</Inline>`,
  en: `import { Center, Icon, Inline, Text } from 'oink-ui';

{/* Block: puts the content dead center in the area */}
<Center style={{ height: 160, width: '100%' }}>
  <Text tone="neutral">A sentence in the middle of empty space</Text>
</Center>

{/* inline: gives an icon a fixed-size backdrop and centers it inside */}
<Inline gap={3}>
  <Center inline style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--ok-fill)' }}>
    <Icon name="bell" />
  </Center>
  <Text>inline usage</Text>
</Inline>`,
};

const SPACER_CODE = {
  zh: `import { Badge, Button, Inline, Spacer, Text } from 'oink-ui';

<Inline wrap={false} style={{ width: '100%' }}>
  <Text variant="label">收件箱</Text>
  <Badge>12</Badge>
  <Spacer />
  <Button size="sm">全部已读</Button>
</Inline>

{/* 固定大小：两个子项之间多留 24px */}
<Inline wrap={false}>
  <Button size="sm">上一步</Button>
  <Spacer size={6} />
  <Button size="sm" variant="primary">下一步</Button>
</Inline>`,
  en: `import { Badge, Button, Inline, Spacer, Text } from 'oink-ui';

<Inline wrap={false} style={{ width: '100%' }}>
  <Text variant="label">Inbox</Text>
  <Badge>12</Badge>
  <Spacer />
  <Button size="sm">Mark all as read</Button>
</Inline>

{/* Fixed size: an extra 24px between two children */}
<Inline wrap={false}>
  <Button size="sm">Back</Button>
  <Spacer size={6} />
  <Button size="sm" variant="primary">Next</Button>
</Inline>`,
};

const WIDTH: Record<ContainerSize, { zh: string; en: string }> = {
  sm: { zh: '560px', en: '560px' },
  md: { zh: '720px', en: '720px' },
  lg: { zh: '960px', en: '960px' },
  xl: { zh: '1200px', en: '1200px' },
  full: { zh: '不限', en: 'unlimited' },
};

function ContainerPlay() {
  const t = useT();
  const [size, setSize] = useState<ContainerSize>('sm');
  const width = t(WIDTH[size].zh, WIDTH[size].en);
  return (
    <Stack gap={4} className="g-fill">
      <Segmented
        size="sm" aria-label="size" value={size} onChange={setSize} style={{ alignSelf: 'center' }}
        options={[{ value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' }, { value: 'xl', label: 'xl' }, { value: 'full', label: 'full' }]}
      />
      <div className="g-frame" style={{ padding: '16px 0' }}>
        <Container size={size}>
          <Box surface="card" border radius={3} padding={4}>{t(`内容最宽 ${width}`, `Content max width ${width}`)}</Box>
        </Container>
      </div>
    </Stack>
  );
}

export default function ContainerPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('三个小原语：Container 限制内容宽度并留出左右边距，Center 把内容居中，Spacer 在 flex 容器里把两边推开。', 'Three small primitives: Container caps the content width and adds side gutters, Center centers its content, and Spacer pushes things apart inside a flex container.')}>
      <DocSection title={t('Container', 'Container')} description={t('内容居中、最大宽度按档位取，左右留白随视口变化（16 → 20 → 24 → 32）并避开刘海屏的安全区。', 'Content is centered with a max width taken from a size step; the side gutters grow with the viewport (16 → 20 → 24 → 32) and stay clear of notch safe areas.')}>
        <Demo code={t(CONTAINER_CODE.zh, CONTAINER_CODE.en)} description={t('演示框比较窄时各档看起来一样；把窗口拉宽再切换。', 'When the demo frame is narrow every size looks the same; widen the window and switch again.')} layout="block">
          <ContainerPlay />
        </Demo>
        <PropsTable
          title={t('Container 属性', 'Container props')}
          rows={[
            asRow(t),
            { name: 'size', type: `'sm' | 'md' | 'lg' | 'xl' | 'full'`, default: `'lg'`, description: t('内容最大宽度：sm 560 / md 720 / lg 960 / xl 1200 / full 不限。', 'Max content width: sm 560 / md 720 / lg 960 / xl 1200 / full unlimited.') },
            { name: 'gutter', type: 'boolean', default: 'true', description: t('左右留白。', 'Side gutters.') },
            { name: 'center', type: 'boolean', default: 'true', description: t('水平居中。', 'Center horizontally.') },
            restRow(t),
          ]}
        />
      </DocSection>

      <DocSection title={t('Center', 'Center')}>
        <Demo code={t(CENTER_CODE.zh, CENTER_CODE.en)} layout="col">
          <Center style={{ height: 160, width: '100%' }}>
            <Text tone="neutral">{t('空白区域正中的一句话', 'A sentence in the middle of empty space')}</Text>
          </Center>
          <Inline gap={3}>
            <Center inline style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--ok-fill)' }}>
              <Icon name="bell" />
            </Center>
            <Text>{t('inline 用法', 'inline usage')}</Text>
          </Inline>
        </Demo>
        <PropsTable
          title={t('Center 属性', 'Center props')}
          rows={[
            asRow(t),
            { name: 'axis', type: `'both' | 'horizontal' | 'vertical'`, default: `'both'`, description: t('在哪个方向上居中。', 'Which direction to center in.') },
            { name: 'inline', type: 'boolean', default: 'false', description: t('行内（inline-grid），用来把图标之类的小东西居中。', 'Inline (inline-grid), for centering small things like icons.') },
            ...spacingRows(t),
            restRow(t),
          ]}
        />
      </DocSection>

      <DocSection title={t('Spacer', 'Spacer')} description={t('放在 Stack、Inline、Toolbar 这些 flex 容器里。不传 size 时吃掉剩余空间，传了就是固定大小的空白。它对读屏隐藏。', 'Goes inside flex containers such as Stack, Inline and Toolbar. Without size it takes up the remaining space; with size it is a fixed gap. It is hidden from screen readers.')}>
        <Demo code={t(SPACER_CODE.zh, SPACER_CODE.en)} layout="col">
          <Inline wrap={false} style={{ width: '100%' }}>
            <Text variant="label">{t('收件箱', 'Inbox')}</Text>
            <Badge>12</Badge>
            <Spacer />
            <Button size="sm">{t('全部已读', 'Mark all as read')}</Button>
          </Inline>
          <Inline wrap={false}>
            <Button size="sm">{t('上一步', 'Back')}</Button>
            <Spacer size={6} />
            <Button size="sm" variant="primary">{t('下一步', 'Next')}</Button>
          </Inline>
        </Demo>
        <PropsTable
          title={t('Spacer 属性', 'Spacer props')}
          rows={[
            { name: 'size', type: 'Space', description: t('固定大小（间距档位）。不传则撑满剩余空间。', 'Fixed size (spacing step). Without it, fills the remaining space.') },
            restRow(t),
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
