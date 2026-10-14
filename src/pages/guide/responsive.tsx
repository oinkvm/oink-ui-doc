import { useState } from 'react';
import { Badge, Box, Code, CodeBlock, Grid, Hide, Inline, Segmented, Show, SplitPane, Stack, Text, useBreakpoint } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import './guide.css';

export const meta: PageMeta = { path: '/guide/responsive', title: '响应式', group: '开始', order: 10, subtitle: 'Responsive', en: { title: 'Responsive design' } };

const BP_CODE = `import { Badge, Inline, useBreakpoint } from 'oink-ui';

function Current() {
  const sm = useBreakpoint('sm');
  const md = useBreakpoint('md');
  const lg = useBreakpoint('lg');
  const xl = useBreakpoint('xl');
  return (
    <Inline gap={2}>
      <Badge tone={sm ? 'success' : 'neutral'}>sm ≥ 520</Badge>
      <Badge tone={md ? 'success' : 'neutral'}>md ≥ 768</Badge>
      <Badge tone={lg ? 'success' : 'neutral'}>lg ≥ 1024</Badge>
      <Badge tone={xl ? 'success' : 'neutral'}>xl ≥ 1280</Badge>
    </Inline>
  );
}`;

const RESPONSIVE_CODE = `import { Box, Grid } from 'oink-ui';

<Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 2, md: 4 }}>
  {[1, 2, 3, 4].map((n) => (
    <Box key={n} surface="card" border radius={3} padding={{ base: 3, md: 5 }}>{n}</Box>
  ))}
</Grid>`;

const SHOW_CODE = {
  zh: `import { Badge, Hide, Inline, Show } from 'oink-ui';

<Inline gap={2}>
  <Show above="md"><Badge tone="info">Show above="md"：宽屏才有</Badge></Show>
  <Show below="md"><Badge tone="accent">Show below="md"：窄屏才有</Badge></Show>
  <Hide below="sm"><Badge>Hide below="sm"：最窄时隐藏</Badge></Hide>
</Inline>`,
  en: `import { Badge, Hide, Inline, Show } from 'oink-ui';

<Inline gap={2}>
  <Show above="md"><Badge tone="info">Show above="md": wide screens only</Badge></Show>
  <Show below="md"><Badge tone="accent">Show below="md": narrow screens only</Badge></Show>
  <Hide below="sm"><Badge>Hide below="sm": hidden when narrowest</Badge></Hide>
</Inline>`,
};

const SPLIT_CODE = {
  zh: `import { Box, SplitPane } from 'oink-ui';

{/* 外框多宽，SplitPane 就按多宽判断：小于 sm（520px）改成上下堆叠 */}
<div style={{ width, maxWidth: '100%', height: 240 }}>
  <SplitPane stackBelow="sm" defaultValue={40}>
    <Box surface="card" border radius={3} padding={4} style={{ height: '100%' }}>列表</Box>
    <Box surface="card" border radius={3} padding={4} style={{ height: '100%' }}>详情</Box>
  </SplitPane>
</div>`,
  en: `import { Box, SplitPane } from 'oink-ui';

{/* SplitPane goes by the width of its frame: below sm (520px) it stacks vertically */}
<div style={{ width, maxWidth: '100%', height: 240 }}>
  <SplitPane stackBelow="sm" defaultValue={40}>
    <Box surface="card" border radius={3} padding={4} style={{ height: '100%' }}>List</Box>
    <Box surface="card" border radius={3} padding={4} style={{ height: '100%' }}>Details</Box>
  </SplitPane>
</div>`,
};

const CSS_CODE = {
  zh: `/* 断点是 min-width，CSS 里直接写数值 */
@media (min-width: 520px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }`,
  en: `/* Breakpoints are min-width; write the numbers directly in CSS */
@media (min-width: 520px)  { /* sm */ }
@media (min-width: 768px)  { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }`,
};

function Current() {
  const sm = useBreakpoint('sm');
  const md = useBreakpoint('md');
  const lg = useBreakpoint('lg');
  const xl = useBreakpoint('xl');
  return (
    <Inline gap={2}>
      <Badge tone={sm ? 'success' : 'neutral'}>sm ≥ 520</Badge>
      <Badge tone={md ? 'success' : 'neutral'}>md ≥ 768</Badge>
      <Badge tone={lg ? 'success' : 'neutral'}>lg ≥ 1024</Badge>
      <Badge tone={xl ? 'success' : 'neutral'}>xl ≥ 1280</Badge>
    </Inline>
  );
}

function SplitDemo() {
  const t = useT();
  const [width, setWidth] = useState<'100%' | '480px' | '320px'>('100%');
  return (
    <Stack gap={4} className="g-fill">
      <Segmented
        aria-label={t('外框宽度', 'Frame width')}
        value={width}
        onChange={setWidth}
        options={[{ value: '100%', label: t('撑满', 'Full') }, { value: '480px', label: '480' }, { value: '320px', label: '320' }]}
        style={{ alignSelf: 'center' }}
      />
      <div style={{ width, maxWidth: '100%', height: 240 }}>
        <SplitPane stackBelow="sm" defaultValue={40}>
          <Box surface="card" border radius={3} padding={4} style={{ height: '100%' }}>{t('列表', 'List')}</Box>
          <Box surface="card" border radius={3} padding={4} style={{ height: '100%' }}>{t('详情', 'Details')}</Box>
        </SplitPane>
      </div>
    </Stack>
  );
}

export default function Responsive() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '组件默认按容器宽度自适应：能换行就换行，长文字省略，不写死宽度。在此之上有四个断点、一种统一的响应式属性写法，以及两个按自身宽度（而不是视口）判断的骨架组件。',
        'Components adapt to their container by default: they wrap when they can, truncate long text and never hard-code widths. On top of that there are four breakpoints, one consistent syntax for responsive props, and two layout shells that respond to their own width rather than the viewport.',
      )}
    >
      <DocSection title={t('断点', 'Breakpoints')} description={t('四个，都是 min-width：sm 520、md 768、lg 1024、xl 1280。没有“小于 sm”的名字，那就是默认（base）。', 'Four, all min-width: sm 520, md 768, lg 1024, xl 1280. There is no name for “below sm”; that is simply the default (base).')}>
        <Demo code={BP_CODE} description={t('拖动浏览器窗口的宽度，亮起的徽标会跟着变。', 'Resize the browser window and the highlighted badges follow.')}>
          <Current />
        </Demo>
        <CodeBlock code={t(CSS_CODE.zh, CSS_CODE.en)} language="css" />
        <div className="g-prose">
          {t(
            <p>脚本里用 <Code>useBreakpoint('md')</Code>（视口不小于 768px 时为 <Code>true</Code>），常量在 <Code>BREAKPOINTS</Code> 里。它基于 <Code>matchMedia</Code>，服务端渲染时返回第二个参数 <Code>fallback</Code>（默认 <Code>true</Code>）。只是显隐或换布局的话优先用下面的纯 CSS 办法，首屏不会闪。</p>,
            <p>In scripts, use <Code>useBreakpoint('md')</Code> (<Code>true</Code> when the viewport is at least 768px); the constants live in <Code>BREAKPOINTS</Code>. It is based on <Code>matchMedia</Code> and returns its second argument, <Code>fallback</Code> (default <Code>true</Code>), during server-side rendering. If you only need to show, hide or rearrange things, prefer the pure CSS approaches below so the first paint doesn’t flash.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('响应式属性 Responsive<T>', 'Responsive props: Responsive<T>')} description={t('布局原语的 gap、padding、columns、align、justify、span 都接受单个值，或一个按断点给值的对象。', 'The layout primitives’ gap, padding, columns, align, justify and span props all accept either a single value or an object with values per breakpoint.')}>
        <Demo code={RESPONSIVE_CODE} layout="block">
          <Grid columns={{ base: 1, sm: 2, lg: 4 }} gap={{ base: 2, md: 4 }}>
            {[1, 2, 3, 4].map((n) => (
              <Box key={n} surface="card" border radius={3} padding={{ base: 3, md: 5 }}>{n}</Box>
            ))}
          </Grid>
        </Demo>
        <CodeBlock language="ts" code={`type Responsive<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T };`} />
        <div className="g-prose">
          {t(
            <ul>
              <li>对象写法向上补齐：<Code>{'{ base: 2, md: 4 }'}</Code> 等于 base 2、sm 2、md 4、lg 4、xl 4。</li>
              <li>没给 <Code>base</Code> 时，小于第一个给了值的断点用组件的默认值。</li>
              <li>实现上是把值写成带断点后缀的 CSS 变量，由样式表在对应的 <Code>@media</Code> 里解析，全程不需要脚本判断视口，服务端渲染出来的首屏就是对的。</li>
            </ul>,
            <ul>
              <li>Object values carry upward: <Code>{'{ base: 2, md: 4 }'}</Code> means base 2, sm 2, md 4, lg 4, xl 4.</li>
              <li>Without <Code>base</Code>, widths below the first breakpoint with a value use the component’s default.</li>
              <li>Under the hood the values become CSS variables with breakpoint suffixes, resolved by the stylesheet in the matching <Code>@media</Code> rules. No script ever checks the viewport, so the server-rendered first paint is already correct.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('Show / Hide', 'Show / Hide')} description={t('按断点显隐，纯 CSS：内容始终在 DOM 里，只是 display: none。包裹层是 display: contents，不参与布局。', 'Show or hide by breakpoint in pure CSS: the content always stays in the DOM and is just display: none. The wrapper is display: contents and doesn’t affect layout.')}>
        <Demo code={t(SHOW_CODE.zh, SHOW_CODE.en)}>
          <Inline gap={2}>
            <Show above="md"><Badge tone="info">{t('Show above="md"：宽屏才有', 'Show above="md": wide screens only')}</Badge></Show>
            <Show below="md"><Badge tone="accent">{t('Show below="md"：窄屏才有', 'Show below="md": narrow screens only')}</Badge></Show>
            <Hide below="sm"><Badge>{t('Hide below="sm"：最窄时隐藏', 'Hide below="sm": hidden when narrowest')}</Badge></Hide>
          </Inline>
        </Demo>
        <div className="g-prose">
          {t(
            <p>被隐藏的内容对读屏也是隐藏的，但组件仍然挂载着、副作用照常运行。两套内容差别很大、或者其中一套很重时，改用 <Code>useBreakpoint</Code> 条件渲染。更多示例见 <Link to="/components/show" className="g-link ok-focusable">Show / Hide</Link>。</p>,
            <p>Hidden content is hidden from screen readers too, but the components stay mounted and their effects keep running. When the two versions differ a lot, or one of them is heavy, render conditionally with <Code>useBreakpoint</Code> instead. More examples in <Link to="/components/show" className="g-link ok-focusable">Show / Hide</Link>.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('按容器宽度：AppShell 与 SplitPane', 'Container width: AppShell and SplitPane')} description={t('断点看的是视口。但一个组件被放进侧栏、对话框或者演示框里时，视口很宽而它自己很窄。这两个骨架组件因此能按自身宽度判断。', 'Breakpoints look at the viewport. But when a component sits in a sidebar, a dialog or a demo frame, the viewport can be wide while the component itself is narrow. So these two layout shells can respond to their own width.')}>
        <Demo title="SplitPane" description={t('SplitPane 始终按自己的宽度决定是否堆叠（@container），stackBelow 指定阈值。', 'SplitPane always decides whether to stack based on its own width (@container); stackBelow sets the threshold.')} code={t(SPLIT_CODE.zh, SPLIT_CODE.en)} layout="block">
          <SplitDemo />
        </Demo>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>SplitPane</strong>：自身宽度小于 <Code>stackBelow</Code>（默认 <Code>md</Code>）时改成上下堆叠，分隔条不再可拖。传 <Code>stacked</Code> 可以强制。详见 <Link to="/components/split-pane" className="g-link ok-focusable">SplitPane</Link>。</li>
              <li><strong>AppShell</strong>：默认看视口，小于 <Code>collapseBelow</Code>（默认 <Code>md</Code>）时侧栏变成抽屉。加上 <Code>contained</Code> 之后改为量自己的宽度，高度取 100%，抽屉也只盖住它自己，适合嵌在固定大小的区域里。详见 <Link to="/components/app-shell" className="g-link ok-focusable">AppShell</Link>。</li>
              <li>其余组件不用容器查询，而是靠弹性布局自己收缩：<Code>Inline</Code> 换行、<Code>Grid</Code> 的 <Code>minItemWidth</Code> 自动填充、<Code>PageHeader</Code> 的操作区放不下时换到标题下面。</li>
            </ul>,
            <ul>
              <li><strong>SplitPane</strong>: when its own width is below <Code>stackBelow</Code> (default <Code>md</Code>) it stacks vertically and the divider can no longer be dragged. Pass <Code>stacked</Code> to force it. See <Link to="/components/split-pane" className="g-link ok-focusable">SplitPane</Link>.</li>
              <li><strong>AppShell</strong>: looks at the viewport by default; below <Code>collapseBelow</Code> (default <Code>md</Code>) the sidebar becomes a drawer. With <Code>contained</Code> it measures its own width instead, takes 100% height, and its drawer only covers the shell itself, which suits embedding in a fixed-size area. See <Link to="/components/app-shell" className="g-link ok-focusable">AppShell</Link>.</li>
              <li>Other components don’t use container queries; they shrink through flexible layout: <Code>Inline</Code> wraps, <Code>Grid</Code> auto-fills with <Code>minItemWidth</Code>, and <Code>PageHeader</Code> moves its actions below the title when they don’t fit.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('触屏', 'Touch screens')}>
        <div className="g-prose">
          {t(
            <ul>
              <li>触屏设备（<Code>pointer: coarse</Code>）上控件高度自动从 32 / 40 / 48 抬到 36 / 44 / 52，输入框字号变成 16px（避免 iOS 聚焦时放大页面）。</li>
              <li>悬停样式都包在 <Code>@media (hover: hover)</Code> 里，点按之后不会残留悬停态。</li>
              <li>贴边的容器（<Code>AppShell</Code>、<Code>Container</Code>、<Code>TabBar</Code>、悬浮卡片）会避开 <Code>safe-area-inset-*</Code>。</li>
              <li>对话框在各种宽度下形态不变，都从触发点放大；贴边的抽屉、面板在窄屏上铺满整宽、右上角有关闭按钮，可以朝停靠的一侧滑动关闭；通知横向撑满。</li>
            </ul>,
            <ul>
              <li>On touch screens (<Code>pointer: coarse</Code>) control heights rise from 32 / 40 / 48 to 36 / 44 / 52, and input text becomes 16px (so iOS doesn’t zoom the page on focus).</li>
              <li>Hover styles are wrapped in <Code>@media (hover: hover)</Code>, so no hover state lingers after a tap.</li>
              <li>Edge-hugging containers (<Code>AppShell</Code>, <Code>Container</Code>, <Code>TabBar</Code>, floating cards) stay clear of <Code>safe-area-inset-*</Code>.</li>
              <li>Dialogs keep the same form at every width and scale up from their trigger. Edge-docked drawers and panels span the full width on narrow screens, get a close button in the top-right corner, and can be swiped toward their docked side to close. Toasts stretch across the full width.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="useBreakpoint(bp, fallback?)"
          rows={[
            { name: 'bp', type: `'sm' | 'md' | 'lg' | 'xl'`, required: true, description: t('断点名。返回视口是否不小于它。', 'Breakpoint name. Returns whether the viewport is at least that wide.') },
            { name: 'fallback', type: 'boolean', default: 'true', description: t('服务端渲染时返回的值。', 'Value returned during server-side rendering.') },
          ]}
        />
        <Text as="p" tone="neutral" style={{ margin: 0 }}>
          {t(
            <>相关的还有 <Code>useMediaQuery(query, fallback?)</Code>，用于断点之外的媒体查询。</>,
            <>There is also <Code>useMediaQuery(query, fallback?)</Code> for media queries beyond breakpoints.</>,
          )}
        </Text>
      </DocSection>
    </DocPage>
  );
}
