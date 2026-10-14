import { Badge, Box, Button, Code, Hide, Icon, Inline, Show, Stack, Text, useBreakpoint } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { asRow, restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/show', title: 'Show / Hide 显隐', group: '布局', order: 7, subtitle: 'Show · Hide', en: { title: 'Show / Hide' } };

const BASIC_CODE = {
  zh: `import { Badge, Hide, Show, Stack } from 'oink-ui';

<Stack gap={2} align="center">
  <Show above="lg"><Badge tone="info">Show above="lg"：≥ 1024 才显示</Badge></Show>
  <Show above="md"><Badge tone="info">Show above="md"：≥ 768 才显示</Badge></Show>
  <Show below="md"><Badge tone="accent">Show below="md"：&lt; 768 才显示</Badge></Show>
  <Show above="sm" below="lg"><Badge tone="success">Show above="sm" below="lg"：520–1023 之间</Badge></Show>
  <Hide below="sm"><Badge>Hide below="sm"：&lt; 520 时隐藏</Badge></Hide>
</Stack>`,
  en: `import { Badge, Hide, Show, Stack } from 'oink-ui';

<Stack gap={2} align="center">
  <Show above="lg"><Badge tone="info">Show above="lg": shown at ≥ 1024</Badge></Show>
  <Show above="md"><Badge tone="info">Show above="md": shown at ≥ 768</Badge></Show>
  <Show below="md"><Badge tone="accent">Show below="md": shown at &lt; 768</Badge></Show>
  <Show above="sm" below="lg"><Badge tone="success">Show above="sm" below="lg": between 520 and 1023</Badge></Show>
  <Hide below="sm"><Badge>Hide below="sm": hidden at &lt; 520</Badge></Hide>
</Stack>`,
};

const TOOLBAR_CODE = {
  zh: `import { Button, Icon, Inline, Show } from 'oink-ui';

{/* 常见用法：宽屏是带文字的按钮，窄屏换成图标按钮 */}
<Inline gap={2}>
  <Show above="sm">
    <Button leading={<Icon name="download" />}>导出报表</Button>
    <Button leading={<Icon name="share" />}>分享</Button>
  </Show>
  <Show below="sm">
    <Button iconOnly aria-label="导出报表"><Icon name="download" /></Button>
    <Button iconOnly aria-label="分享"><Icon name="share" /></Button>
  </Show>
</Inline>`,
  en: `import { Button, Icon, Inline, Show } from 'oink-ui';

{/* A common pattern: labeled buttons on wide screens, icon buttons on phones */}
<Inline gap={2}>
  <Show above="sm">
    <Button leading={<Icon name="download" />}>Export report</Button>
    <Button leading={<Icon name="share" />}>Share</Button>
  </Show>
  <Show below="sm">
    <Button iconOnly aria-label="Export report"><Icon name="download" /></Button>
    <Button iconOnly aria-label="Share"><Icon name="share" /></Button>
  </Show>
</Inline>`,
};

const HOOK_CODE = {
  zh: `import { Box, Text, useBreakpoint } from 'oink-ui';

function Sidebar() {
  // 两套内容差别很大、或者其中一套很重：用 hook 条件渲染，另一套根本不挂载
  const wide = useBreakpoint('md');
  return wide
    ? <Box surface="card" border radius={3} padding={4}><Text>宽屏：挂载的是完整侧栏</Text></Box>
    : <Box surface="card" border radius={3} padding={4}><Text>窄屏：挂载的是精简版</Text></Box>;
}`,
  en: `import { Box, Text, useBreakpoint } from 'oink-ui';

function Sidebar() {
  // When the two versions differ a lot, or one is heavy: render conditionally with the hook so the other never mounts
  const wide = useBreakpoint('md');
  return wide
    ? <Box surface="card" border radius={3} padding={4}><Text>Wide screen: the full sidebar is mounted</Text></Box>
    : <Box surface="card" border radius={3} padding={4}><Text>Narrow screen: the compact version is mounted</Text></Box>;
}`,
};

function Sidebar() {
  const t = useT();
  const wide = useBreakpoint('md');
  return wide
    ? <Box surface="card" border radius={3} padding={4}><Text>{t('宽屏：挂载的是完整侧栏', 'Wide screen: the full sidebar is mounted')}</Text></Box>
    : <Box surface="card" border radius={3} padding={4}><Text>{t('窄屏：挂载的是精简版', 'Narrow screen: the compact version is mounted')}</Text></Box>;
}

export default function ShowPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('纯 CSS 的按断点显隐。内容始终在 DOM 里，只是在不该出现的宽度上 display: none，所以服务端渲染的首屏就是对的，不会闪。两个组件是同一件事的两种说法，哪个读起来顺用哪个。', 'Pure-CSS show and hide by breakpoint. The content is always in the DOM and just gets display: none at widths where it shouldn’t appear, so the server-rendered first paint is already correct, with no flash. The two components are two ways of saying the same thing; use whichever reads better.')}>
      <DocSection title={t('示例', 'Examples')}>
        <Demo title={t('above 与 below', 'above and below')} description={t('拖动浏览器宽度。above 含断点本身（min-width），below 不含。', 'Resize the browser. above includes the breakpoint itself (min-width); below does not.')} code={t(BASIC_CODE.zh, BASIC_CODE.en)}>
          <Stack gap={2} align="center">
            <Show above="lg"><Badge tone="info">{t('Show above="lg"：≥ 1024 才显示', 'Show above="lg": shown at ≥ 1024')}</Badge></Show>
            <Show above="md"><Badge tone="info">{t('Show above="md"：≥ 768 才显示', 'Show above="md": shown at ≥ 768')}</Badge></Show>
            <Show below="md"><Badge tone="accent">{t('Show below="md"：< 768 才显示', 'Show below="md": shown at < 768')}</Badge></Show>
            <Show above="sm" below="lg"><Badge tone="success">{t('Show above="sm" below="lg"：520–1023 之间', 'Show above="sm" below="lg": between 520 and 1023')}</Badge></Show>
            <Hide below="sm"><Badge>{t('Hide below="sm"：< 520 时隐藏', 'Hide below="sm": hidden at < 520')}</Badge></Hide>
          </Stack>
        </Demo>
        <Demo title={t('同一位置换一套内容', 'Swapping content in place')} description={t('包裹层是 display: contents，不产生额外的盒子，里面的按钮直接参与外层 Inline 的布局。', 'The wrapper is display: contents, so it adds no extra box and the buttons inside take part directly in the outer Inline layout.')} code={t(TOOLBAR_CODE.zh, TOOLBAR_CODE.en)}>
          <Inline gap={2}>
            <Show above="sm">
              <Button leading={<Icon name="download" />}>{t('导出报表', 'Export report')}</Button>
              <Button leading={<Icon name="share" />}>{t('分享', 'Share')}</Button>
            </Show>
            <Show below="sm">
              <Button iconOnly aria-label={t('导出报表', 'Export report')}><Icon name="download" /></Button>
              <Button iconOnly aria-label={t('分享', 'Share')}><Icon name="share" /></Button>
            </Show>
          </Inline>
        </Demo>
        <Demo title={t('什么时候改用 useBreakpoint', 'When to use useBreakpoint instead')} code={t(HOOK_CODE.zh, HOOK_CODE.en)}>
          <Sidebar />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title={t('Show 属性', 'Show props')}
          rows={[
            asRow(t),
            { name: 'above', type: `'sm' | 'md' | 'lg' | 'xl'`, description: t('视口不小于该断点时才显示。', 'Shown only when the viewport is at least this breakpoint.') },
            { name: 'below', type: `'sm' | 'md' | 'lg' | 'xl'`, description: t('视口小于该断点时才显示。和 above 同时给就是一个区间。', 'Shown only when the viewport is below this breakpoint. Combined with above, it defines a range.') },
            restRow(t),
          ]}
        />
        <PropsTable
          title={t('Hide 属性', 'Hide props')}
          rows={[
            asRow(t),
            { name: 'below', type: `'sm' | 'md' | 'lg' | 'xl'`, description: t('视口小于该断点时隐藏。', 'Hidden when the viewport is below this breakpoint.') },
            { name: 'above', type: `'sm' | 'md' | 'lg' | 'xl'`, description: t('视口不小于该断点时隐藏。', 'Hidden when the viewport is at least this breakpoint.') },
            restRow(t),
          ]}
        />
        <div className="g-prose">
          {t(
            <ul>
              <li>被隐藏的内容对读屏和键盘也是隐藏的（<Code>display: none</Code>），不用另外处理。</li>
              <li>隐藏的组件仍然挂载着，副作用（请求、定时器）照常运行；两套内容里有相同 <Code>id</Code> 的元素时会重复。遇到这些情况改用 <Code>useBreakpoint</Code>。</li>
              <li>看的是视口宽度，不是容器宽度。</li>
            </ul>,
            <ul>
              <li>Hidden content is hidden from screen readers and the keyboard too (<Code>display: none</Code>); nothing else to handle.</li>
              <li>Hidden components stay mounted, so side effects (requests, timers) keep running, and elements with the same <Code>id</Code> in both versions end up duplicated. In those cases use <Code>useBreakpoint</Code> instead.</li>
              <li>It looks at the viewport width, not the container width.</li>
            </ul>,
          )}
        </div>
      </DocSection>
    </DocPage>
  );
}
