import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Box, Button, Card, Checkbox, Code, CodeBlock, Group, Inline, Input, Row, Slider, Stack, Surface, Tag, Text, Tooltip } from 'oink-ui';
import { Demo, DocPage, DocSection } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import { useTokenPx } from '../../foundations/lib';
import '../../foundations/foundations.css';
import './guide.css';

export const meta: PageMeta = { path: '/guide/shape', title: '形状 · 间距 · 层级', group: '开始', order: 5, subtitle: 'Shape · Space · Layers', en: { title: 'Shape · Spacing · Layers' } };

/* ------------------------------------------------------------------ 圆角 */

const RADII: Array<[name: string, px: number, zh: string, en: string]> = [
  ['r-1', 8, '复选框、键帽、文字提示这一档（实际 7–10）', 'Checkboxes, keycaps, tooltips (7–10 in practice)'],
  ['r-2', 12, '菜单项、快捷键框、图标块', 'Menu items, shortcut fields, icon tiles'],
  ['r-3', 16, '输入框、菜单、提示条这一档（实际 14–18）', 'Inputs, menus, alerts (14–18 in practice)'],
  ['r-4', 24, '卡片、分组、表格', 'Cards, groups, tables'],
  ['r-5', 32, '对话框、悬浮卡片', 'Dialogs, floating cards'],
  ['r-6', 44, '面板', 'Panels'],
  ['r-full', 999, '按钮、搜索框、开关、滑块、标签', 'Buttons, search fields, switches, sliders, tags'],
];

function RadiusScale() {
  const t = useT();
  return (
    <div className="f-radius">
      {RADII.map(([name, px, zh, en]) => {
        const use = t(zh, en);
        const size = px === 999 ? t('全圆', 'Full') : `${px}px`;
        return (
          <Tooltip key={name} content={use}>
            <div className={px === 999 ? 'is-full' : undefined} style={{ '--r': `var(--ok-${name})` } as CSSProperties} tabIndex={0} aria-label={t(`--ok-${name}，${size}：${use}`, `--ok-${name}, ${size}: ${use}`)}>
              <i aria-hidden="true" /><p><b>{size}</b><span>--ok-{name}</span></p>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ 同心圆角 */

const OUTER = 44;

/** 和 Surface 同一个写法：外层把“圆角 − 内边距 × rk”写进 --ok-r-nested，里面的 Group 直接取用 */
function Concentric() {
  const t = useT();
  const [pad, setPad] = useState(16);
  const inner = Math.max(4, OUTER - pad);
  return (
    <div className="f-nest">
      <div className="f-nest__stage">
        <div
          className="f-nest__outer"
          style={{
            padding: pad,
            '--ok-r-nested': `max(calc(4px * var(--ok-rk)), calc(${OUTER}px * var(--ok-rk) - ${pad}px * var(--ok-rk)))`,
          } as CSSProperties}
        >
          <Group>
            <Row label={t('外层圆角', 'Outer radius')}>{OUTER}</Row>
            <Row label={t('内边距', 'Padding')}>{pad}</Row>
            <Row label={t('分组圆角', 'Group radius')}>{inner}</Row>
          </Group>
        </div>
      </div>
      <Stack gap={5} className="f-nest__side">
        <div className="f-formula" aria-live="polite">
          <span><b>{OUTER}</b>{t('外圆角', 'outer')}</span><i aria-hidden="true">−</i><span><b>{pad}</b>{t('内边距', 'padding')}</span><i aria-hidden="true">=</i><span className="is-accent"><b>{inner}</b>{t('内圆角', 'inner')}</span>
        </div>
        <Slider aria-label={t('内边距', 'Padding')} min={4} max={32} step={1} value={pad} onChange={setPad} format={(v) => `${v}px`} />
        <Text as="p" variant="caption" tone="neutral" style={{ margin: 0 }}>
          {t(
            <>里面是一个真的 <Code>Group</Code>：它没有设圆角，读的是外层传下来的 <Code>--ok-r-nested</Code>。</>,
            <>Inside is a real <Code>Group</Code>: it sets no radius of its own and reads the <Code>--ok-r-nested</Code> passed down from outside.</>,
          )}
        </Text>
      </Stack>
    </div>
  );
}

const NESTED_CODE = {
  zh: `import { Card, CodeBlock, Stack, Surface, Text } from 'oink-ui';

{/* 面板 44 / 16 → 卡片自动取 28；卡片内边距 20 → 代码块自动取 8 */}
<Surface>
  <Card>
    <Stack gap={3}>
      <Text variant="caption" tone="neutral">面板 44 − 16 → 卡片圆角 28；28 − 20 → 代码块圆角 8</Text>
      <CodeBlock code="npm i oink-ui" language="bash" />
    </Stack>
  </Card>
</Surface>`,
  en: `import { Card, CodeBlock, Stack, Surface, Text } from 'oink-ui';

{/* Panel 44 / 16 → the card gets 28 automatically; card padding 20 → the code block gets 8 */}
<Surface>
  <Card>
    <Stack gap={3}>
      <Text variant="caption" tone="neutral">Panel 44 − 16 → card radius 28; 28 − 20 → code block radius 8</Text>
      <CodeBlock code="npm i oink-ui" language="bash" />
    </Stack>
  </Card>
</Surface>`,
};

/* ------------------------------------------------------------------ 间距 */

const SPACES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];

function SpacingScale() {
  return (
    <div className="f-space">
      {SPACES.map((n, i) => (
        <div key={n} style={{ '--i': i } as CSSProperties}>
          <code>--ok-s-{n}</code>
          <i style={{ '--w': `calc(var(--ok-s-${n}) * var(--f-k, 3))` } as CSSProperties} aria-hidden="true" />
          <span>{n * 4}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 控件高度 */

const HEIGHTS: Array<[token: string, zh: string, en: string]> = [['h-sm', '小', 'Small'], ['h-md', '中', 'Medium'], ['h-lg', '大', 'Large'], ['h-item', '列表项', 'Item'], ['h-item-sub', '子项', 'Sub-item']];

function Heights() {
  const t = useT();
  const px = useTokenPx(HEIGHTS.map(([tk]) => tk));
  return (
    <div className="f-heights">
      {HEIGHTS.map(([tk, zh, en]) => (
        <div key={tk} className="g-swatch" style={{ justifyItems: 'center' }}>
          <span className={tk.startsWith('h-item') ? 'f-heights__item' : 'g-height'} style={{ height: `var(--ok-${tk})` }}>{t(zh, en)}</span>
          <span className="g-swatch__name">--ok-{tk}</span>
          <span className="g-swatch__value">{px[tk] != null ? `${px[tk]}px` : '…'}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ 描边 */

const STROKE_CODE = {
  zh: `import { Box, Button, Checkbox, Input, Tag } from 'oink-ui';

{/* 有底色：不描边 */}
<Button>默认按钮</Button>
<Tag>标签</Tag>
<Input placeholder="凹槽输入框" aria-label="示例输入" block={false} />

{/* 白底的块：1px --ok-line */}
<Box surface="card" border radius={3} padding={4}>卡片</Box>

{/* 盖在内容上的浮层：1px --ok-line-2 */}
<Box surface="raised" border="strong" radius={3} padding={4}>浮层</Box>

{/* 小控件：1.5px --ok-line-2 */}
<Checkbox>复选框</Checkbox>
<Button variant="outline">描边按钮</Button>`,
  en: `import { Box, Button, Checkbox, Input, Tag } from 'oink-ui';

{/* Has a fill: no stroke */}
<Button>Default</Button>
<Tag>Tag</Tag>
<Input placeholder="Well input" aria-label="Example input" block={false} />

{/* White blocks: 1px --ok-line */}
<Box surface="card" border radius={3} padding={4}>Card</Box>

{/* Overlays above content: 1px --ok-line-2 */}
<Box surface="raised" border="strong" radius={3} padding={4}>Overlay</Box>

{/* Small controls: 1.5px --ok-line-2 */}
<Checkbox>Checkbox</Checkbox>
<Button variant="outline">Outline</Button>`,
};

/* ------------------------------------------------------------------ 层级 */

const LAYERS: Array<{ cls: string; name: { zh: string; en: string }; note: { zh: string; en: string } }> = [
  { cls: 'well', name: { zh: '凹槽 Well', en: 'Well' }, note: { zh: '轨道、输入框、代码块 · 比所在表面更深', en: 'Tracks, inputs, code blocks · deeper than the surface they sit on' } },
  { cls: 'card', name: { zh: '卡片 Card', en: 'Card' }, note: { zh: '分组、卡片、表格 · 浅边 + 顶部高光', en: 'Groups, cards, tables · light stroke + top highlight' } },
  { cls: 'raised', name: { zh: '浮起 Raised', en: 'Raised' }, note: { zh: '分段选中块、步进按钮 · 浅边', en: 'Segmented selection, stepper buttons · light stroke' } },
  { cls: 'hover', name: { zh: '可点击卡片悬停', en: 'Clickable card, hover' }, note: { zh: '只把浅边加深成深边，底色不变', en: 'Only the light stroke darkens; the fill stays the same' } },
  { cls: 'pop', name: { zh: '浮层 Popover', en: 'Popover' }, note: { zh: '菜单、下拉、通知 · 不透明 --ok-pop + 深边', en: 'Menus, dropdowns, toasts · opaque --ok-pop + dark stroke' } },
  { cls: 'dialog', name: { zh: '对话框 Dialog', en: 'Dialog' }, note: { zh: '遮罩压暗并模糊背后的页面', en: 'A scrim dims and blurs the page behind' } },
];

const PANEL_CSS = {
  zh: `.my-panel {
  padding: var(--ok-s-5);
  border-radius: var(--ok-r-4); corner-shape: var(--ok-corner);
  background: var(--ok-card);
  /* 内描边 + 顶部高光，不是投影 */
  box-shadow: inset 0 0 0 1px var(--ok-line), inset 0 1.5px 0 var(--ok-hi);
}`,
  en: `.my-panel {
  padding: var(--ok-s-5);
  border-radius: var(--ok-r-4); corner-shape: var(--ok-corner);
  background: var(--ok-card);
  /* inner stroke + top highlight, not a drop shadow */
  box-shadow: inset 0 0 0 1px var(--ok-line), inset 0 1.5px 0 var(--ok-hi);
}`,
};

export default function ShapePage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '圆得彻底，但圆得有规矩：内圆角 = 外圆角 − 内边距。间距走 4pt 栅格，控件高度只有三档。层级不用阴影，靠表面色阶和发丝线表达。',
        'Thoroughly rounded, but by the rules: inner radius = outer radius − padding. Spacing follows a 4pt grid, and controls come in just three heights. Layers are expressed without shadows, through the surface ladder and hairlines.',
      )}
    >
      <DocSection title={t('圆角', 'Corner radius')} description={t('按钮、搜索框、开关、滑块一律全圆；装内容的容器按层级从 14 取到 44。嵌套时内圆角 = 外圆角 − 内边距，所以实际用到的值不全落在刻度上（比如 20、28）。悬停或聚焦色块，粗线会沿轮廓描一遍。', 'Buttons, search fields, switches and sliders are always fully rounded; containers that hold content range from 14 to 44 by level. When nested, inner radius = outer radius − padding, so not every value in use falls on the scale (20 and 28, for example). Hover or focus a tile to trace its outline with a thick line.')}>
        <Demo layout="block"><RadiusScale /></Demo>
        <div className="g-prose">
          {t(
            <p>容器的圆角是曲率连续的超椭圆：直边和弧线之间没有曲率突变。支持 <Code>corner-shape</Code> 的浏览器里，<Code>--ok-r-1</Code> … <Code>--ok-r-6</Code> 会乘上半径倍率 <Code>--ok-rk</Code>（1.45）来保持视觉大小，所以刻度上标的是标称值；不支持的浏览器回退成普通圆角。全圆始终是正圆。倍率怎么改、两种曲线的对比见 <Link to="/guide/theming" className="g-link ok-focusable">主题 · 圆角系数</Link>。自己写圆角时记得配上 <Code>corner-shape: var(--ok-corner)</Code>。</p>,
            <p>Container corners are superellipses with continuous curvature: no sudden jump in curvature where the straight edge meets the arc. In browsers that support <Code>corner-shape</Code>, <Code>--ok-r-1</Code> … <Code>--ok-r-6</Code> are multiplied by the radius multiplier <Code>--ok-rk</Code> (1.45) to keep the same visual size, so the scale shows nominal values; other browsers fall back to plain rounded corners. Fully rounded shapes are always perfectly round. For changing the multiplier and comparing the two curves, see <Link to="/guide/theming" className="g-link ok-focusable">Theming · Corner radius multiplier</Link>. When you write your own corner radius, remember to pair it with <Code>corner-shape: var(--ok-corner)</Code>.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('同心圆角', 'Concentric corners')} description={t('拖动滑块改变内边距：内圆角始终等于外圆角减去内边距，两条弧线保持平行。', 'Drag the slider to change the padding: the inner radius always equals the outer radius minus the padding, so the two curves stay parallel.')}>
        <Demo layout="block"><Concentric /></Demo>
        <div className="g-prose">
          {t(
            <p>库里的容器自动做这件事。装圆角容器的外层——<Code>Surface</Code>、悬浮卡片（对话框、抽屉等）、AppShell 的侧栏卡片、<Code>Popover</Code> 的内容区——把“圆角 − 内边距 × rk”（不小于 4 × rk）写进 <Code>--ok-r-nested</Code>；<Code>Card</Code> 把它写到自己的直接子元素上。可以嵌套的容器——<Code>Card</Code>、<Code>Group</Code>、<Code>Table</Code>、<Code>CodeBlock</Code>、<Code>Image</Code>、<Code>Alert</Code>——圆角写的是 <Code>var(--ok-r-nested, 默认圆角)</Code>：单独用时是默认值，放进容器就自动同心。</p>,
            <p>The library’s containers do this automatically. Outer layers that hold rounded containers (<Code>Surface</Code>, floating cards such as dialogs and drawers, the AppShell sidebar card, the <Code>Popover</Code> content area) write “radius − padding × rk” (at least 4 × rk) into <Code>--ok-r-nested</Code>; <Code>Card</Code> writes it onto its direct children. Nestable containers (<Code>Card</Code>, <Code>Group</Code>, <Code>Table</Code>, <Code>CodeBlock</Code>, <Code>Image</Code>, <Code>Alert</Code>) use <Code>var(--ok-r-nested, default radius)</Code> as their radius: on their own they get the default, and inside a container they become concentric automatically.</p>,
          )}
        </div>
        <Demo title={t('放进容器就同心', 'Concentric inside any container')} description={t('不需要给里面的组件传圆角。', 'No need to pass a radius to the components inside.')} code={t(NESTED_CODE.zh, NESTED_CODE.en)} layout="block">
          <Surface>
            <Card>
              <Stack gap={3}>
                <Text variant="caption" tone="neutral">{t('面板 44 − 16 → 卡片圆角 28；28 − 20 → 代码块圆角 8', 'Panel 44 − 16 → card radius 28; 28 − 20 → code block radius 8')}</Text>
                <CodeBlock code="npm i oink-ui" language="bash" />
              </Stack>
            </Card>
          </Surface>
        </Demo>
      </DocSection>

      <DocSection title={t('容器内边距', 'Container padding')} description={t('卡片、分组、表格、对话框、通知这些装内容的容器，内边距按同一套规矩取。', 'Containers that hold content (cards, groups, tables, dialogs, toasts) all follow the same padding rules.')}>
        <div className="g-prose">
          {t(
            <>
              <ul>
                <li><strong>四边相等。</strong>内容到容器上、下、左、右的距离是同一个值。分组和表格里，首行、末行自己的内边距不够，差的部分由容器补足。</li>
                <li><strong>跟着圆角走。</strong>内边距取圆角的四分之三左右，落在 4pt 栅格上：圆角 20 配 16，24 配 20，32 配 24。</li>
                <li><strong>套容器用同心。</strong>里面装的是另一个圆角容器时，内边距 = 外圆角 − 内圆角：面板 44 套分组 28，内边距就是 16。</li>
              </ul>
              <p>库里已经按这套规矩配好：<Code>Card</Code> 的 <Code>size</Code> 是 sm 20 / 16、md 24 / 20、lg 32 / 24（圆角 / 内边距）；<Code>Surface</Code> 是 sm 32 / 12、md 44 / 16、lg 44 / 20。自己用 <Code>Box</Code> 拼容器时，<Code>radius</Code> 和 <Code>padding</Code> 要成对选。</p>
            </>,
            <>
              <ul>
                <li><strong>Equal on all sides.</strong> Content sits the same distance from the container’s top, bottom, left and right. In groups and tables, where the first and last rows’ own padding falls short, the container makes up the difference.</li>
                <li><strong>Follow the corner radius.</strong> Padding is about three quarters of the radius, snapped to the 4pt grid: radius 20 pairs with 16, 24 with 20, 32 with 24.</li>
                <li><strong>Nest concentrically.</strong> When the content is another rounded container, padding = outer radius − inner radius: a 44 panel holding a 28 group has 16 padding.</li>
              </ul>
              <p>The library is already set up this way: <Code>Card</Code> <Code>size</Code> is sm 20 / 16, md 24 / 20, lg 32 / 24 (radius / padding); <Code>Surface</Code> is sm 32 / 12, md 44 / 16, lg 44 / 20. When you build a container from <Code>Box</Code>, choose <Code>radius</Code> and <Code>padding</Code> as a pair.</p>
            </>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('间距', 'Spacing')} description={t('4pt 栅格，令牌 --ok-s-1 到 --ok-s-16，后面的数字乘 4 就是像素。组件内 8 / 12，行内 16 / 20，区块之间 32 / 48。布局原语（Stack、Inline、Grid、Box）的 gap、padding 属性填的就是这个档位数字。', 'A 4pt grid with tokens --ok-s-1 to --ok-s-16; multiply the number by 4 to get pixels. 8 / 12 within a component, 16 / 20 within a row, 32 / 48 between sections. The gap and padding props of the layout primitives (Stack, Inline, Grid, Box) take these step numbers.')}>
        <Demo layout="block"><SpacingScale /></Demo>
      </DocSection>

      <DocSection title={t('控件高度', 'Control heights')} description={t('按钮、输入框、选择器、分段、步进、快捷键框共用三档高度 32 / 40 / 48，并排时取同一档。可点击的列表项（菜单项、下拉选项、导航项、命令面板结果、树节点）用 --ok-h-item：桌面 36，子项 30。下面标注的是当前环境的实际值。', 'Buttons, inputs, selects, segmented controls, steppers and shortcut fields share three heights, 32 / 40 / 48, and use the same one when side by side. Clickable list items (menu items, dropdown options, nav items, command palette results, tree nodes) use --ok-h-item: 36 on desktop, 30 for sub-items. The labels below show the actual values in your current environment.')}>
        <Demo><Heights /></Demo>
        <div className="g-prose">
          {t(
            <p>触屏设备上三档控件高度抬到 36 / 44 / 52；列表项在触屏和手机宽度（&lt; 520px）下都抬到 44。保证点按区域不小于 44px。在桌面上模拟触屏用 <Code>data-touch</Code>，演示见 <Link to="/guide/theming" className="g-link ok-focusable">主题 · 触屏高度</Link>。</p>,
            <p>On touch screens the three control heights rise to 36 / 44 / 52; list items rise to 44 on touch screens and at phone widths (&lt; 520px). This keeps tap targets at least 44px. To simulate touch on desktop, use <Code>data-touch</Code>; see the demo in <Link to="/guide/theming" className="g-link ok-focusable">Theming · Touch heights</Link>.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('描边', 'Strokes')} description={t('底色和背景分不开才描边。描边只有浅、深两档颜色（--ok-line、--ok-line-2），一律画在元素内侧，不占布局。', 'Strokes are drawn only when a fill doesn’t separate from its background. There are just two stroke colors, light and dark (--ok-line, --ok-line-2), always drawn on the inside of the element so they take no layout space.')}>
        <Demo code={t(STROKE_CODE.zh, STROKE_CODE.en)} layout="col" align="start">
          <Stack gap={5}>
            <Stack gap={2}>
              <Text variant="caption" tone="neutral">{t('有底色：不描边', 'Has a fill: no stroke')}</Text>
              <Inline gap={3}>
                <Button>{t('默认按钮', 'Default')}</Button>
                <Tag>{t('标签', 'Tag')}</Tag>
                <Input placeholder={t('凹槽输入框', 'Well input')} aria-label={t('示例输入', 'Example input')} block={false} />
              </Inline>
            </Stack>
            <Stack gap={2}>
              <Text variant="caption" tone="neutral">{t('白底的块 1px 浅边；盖在内容上的浮层 1px 深边', 'White blocks: 1px light stroke; overlays above content: 1px dark stroke')}</Text>
              <Inline gap={3}>
                <Box surface="card" border radius={3} padding={4}>{t('卡片', 'Card')}</Box>
                <Box surface="raised" border="strong" radius={3} padding={4}>{t('浮层', 'Overlay')}</Box>
              </Inline>
            </Stack>
            <Stack gap={2}>
              <Text variant="caption" tone="neutral">{t('小控件 1.5px 深边', 'Small controls: 1.5px dark stroke')}</Text>
              <Inline gap={4}>
                <Checkbox>{t('复选框', 'Checkbox')}</Checkbox>
                <Button variant="outline">{t('描边按钮', 'Outline')}</Button>
              </Inline>
            </Stack>
          </Stack>
        </Demo>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>有底色不描。</strong>灰底或彩色底的控件靠颜色区分：输入框、各种轨道、标签、徽标，以及默认、主、强调按钮。</li>
              <li><strong>白底描浅边。</strong>白色或接近表面色的块描 1px <Code>--ok-line</Code>：面板、卡片、分组、表格、选项卡片、分段的选中块。</li>
              <li><strong>浮层描深边。</strong>盖在内容上面的层描 1px <Code>--ok-line-2</Code>：菜单、下拉、通知、悬浮卡片。</li>
              <li><strong>小控件描深边。</strong>复选框、单选框、描边按钮 1.5px <Code>--ok-line-2</Code>；滑块圆钮 1px。</li>
              <li><strong>状态只换颜色。</strong>悬停时浅边加深成深边，粗细不变；聚焦和校验结果用 1.5px 的状态色。</li>
              <li><strong>分隔用发丝线。</strong>行与行、单元格之间只画一条 1px 浅线，不描整圈。</li>
            </ul>,
            <ul>
              <li><strong>No stroke on fills.</strong> Controls with a gray or colored fill are separated by color: inputs, tracks, tags, badges, and default, primary and accent buttons.</li>
              <li><strong>Light stroke on white.</strong> White blocks, or blocks close to the surface color, get a 1px <Code>--ok-line</Code>: panels, cards, groups, tables, option cards, the segmented selection.</li>
              <li><strong>Dark stroke on overlays.</strong> Layers that sit above content get a 1px <Code>--ok-line-2</Code>: menus, dropdowns, toasts, floating cards.</li>
              <li><strong>Dark stroke on small controls.</strong> Checkboxes, radios and outline buttons get 1.5px <Code>--ok-line-2</Code>; slider thumbs get 1px.</li>
              <li><strong>States only change color.</strong> On hover the light stroke darkens without changing width; focus and validation use a 1.5px status color.</li>
              <li><strong>Separate with hairlines.</strong> Between rows and cells, draw a single 1px light line, never a full outline.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('层级', 'Layers')} description={t('不用阴影。层与层靠表面色阶和发丝线区分：越靠上的层越亮；浮层换成加深的描边，对话框再用遮罩压暗背景。各层的色值见色彩页的“语义表面”。', 'No shadows. Layers are told apart by the surface ladder and hairlines: higher layers are brighter, overlays switch to a darker stroke, and dialogs add a scrim that dims the background. For each layer’s color values, see “Semantic surfaces” on the Color page.')}>
        <Demo layout="block">
          <div className="f-layers">
            {LAYERS.map((l) => {
              const name = t(l.name.zh, l.name.en);
              const note = t(l.note.zh, l.note.en);
              return (
                <div key={l.cls} className={`f-layer f-layer--${l.cls}`}>
                  {l.cls === 'dialog' ? <span className="f-layer__card"><b>{name}</b><span>{note}</span></span> : <><b>{name}</b><span>{note}</span></>}
                </div>
              );
            })}
          </div>
        </Demo>
        <div className="g-prose">
          {t(
            <>
              <ul>
                <li><strong>顶部高光只给大块容器。</strong>面板、分组、卡片、表格、菜单、通知、对话框顶部带一道 1.5px 的 <Code>--ok-hi</Code>；按钮、输入框这些控件不带。</li>
                <li><strong>浮层不透明、不磨砂。</strong>菜单、下拉、通知用不透明的 <Code>--ok-pop</Code>，不加背景模糊。只有模态遮罩 <Code>--ok-scrim</Code> 会把背后的页面压暗并模糊 8px。</li>
                <li><strong>深色主题方向不变。</strong>越往上越亮，凹槽比画布更深。</li>
              </ul>
              <p>表面色阶的完整色值见 <Link to="/guide/color" className="g-link ok-focusable">色彩</Link>。</p>
            </>,
            <>
              <ul>
                <li><strong>Top highlights only on large containers.</strong> Panels, groups, cards, tables, menus, toasts and dialogs carry a 1.5px <Code>--ok-hi</Code> along the top; controls such as buttons and inputs don’t.</li>
                <li><strong>Overlays are opaque, not frosted.</strong> Menus, dropdowns and toasts use the opaque <Code>--ok-pop</Code> with no backdrop blur. Only the modal scrim, <Code>--ok-scrim</Code>, dims the page behind and blurs it by 8px.</li>
                <li><strong>Same direction in the dark theme.</strong> Higher is brighter, and wells are deeper than the canvas.</li>
              </ul>
              <p>The full values of the surface ladder are on the <Link to="/guide/color" className="g-link ok-focusable">Color</Link> page.</p>
            </>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('在自己的样式里用', 'Using it in your own styles')}>
        <CodeBlock language="css" code={t(PANEL_CSS.zh, PANEL_CSS.en)} />
      </DocSection>
    </DocPage>
  );
}
