import { useState } from 'react';
import { Badge, Box, Button, Code, Inline, Kbd, SplitPane, Stack, Switch, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/split-pane', title: 'SplitPane 分栏', group: '布局', order: 13, subtitle: 'SplitPane', en: { title: 'SplitPane' } };

const BASIC_CODE = {
  zh: `import { useState } from 'react';
import { Badge, Box, Button, Inline, SplitPane, Stack, Switch, Text } from 'oink-ui';

function Mail() {
  const [size, setSize] = useState(36);
  const [stacked, setStacked] = useState(false);
  return (
    <Stack gap={4}>
      <Inline gap={3} justify="center">
        <Badge>第一栏 {Math.round(size)}%</Badge>
        <Button size="sm" onClick={() => setSize(50)}>设为 50%</Button>
        <Switch checked={stacked} onChange={setStacked}>强制堆叠</Switch>
      </Inline>
      {/* SplitPane 撑满外层：外层要有确定的高度 */}
      <div style={{ height: 300 }}>
        <SplitPane value={size} onChange={setSize} min={24} max={70} stackBelow="sm" stacked={stacked || undefined} separatorLabel="调整列表宽度">
          <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>
            <Text variant="label">列表</Text>
          </Box>
          <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>
            <Text variant="label">详情</Text>
          </Box>
        </SplitPane>
      </div>
    </Stack>
  );
}`,
  en: `import { useState } from 'react';
import { Badge, Box, Button, Inline, SplitPane, Stack, Switch, Text } from 'oink-ui';

function Mail() {
  const [size, setSize] = useState(36);
  const [stacked, setStacked] = useState(false);
  return (
    <Stack gap={4}>
      <Inline gap={3} justify="center">
        <Badge>First pane {Math.round(size)}%</Badge>
        <Button size="sm" onClick={() => setSize(50)}>Set to 50%</Button>
        <Switch checked={stacked} onChange={setStacked}>Force stacking</Switch>
      </Inline>
      {/* SplitPane fills its parent, so the parent needs a definite height */}
      <div style={{ height: 300 }}>
        <SplitPane value={size} onChange={setSize} min={24} max={70} stackBelow="sm" stacked={stacked || undefined} separatorLabel="Resize list">
          <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>
            <Text variant="label">List</Text>
          </Box>
          <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>
            <Text variant="label">Details</Text>
          </Box>
        </SplitPane>
      </div>
    </Stack>
  );
}`,
};

const VERTICAL_CODE = {
  zh: `import { Box, SplitPane } from 'oink-ui';

<div style={{ height: 320, width: 'min(420px, 100%)' }}>
  <SplitPane orientation="vertical" defaultValue={60} step={5}>
    <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>编辑器</Box>
    <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>终端</Box>
  </SplitPane>
</div>`,
  en: `import { Box, SplitPane } from 'oink-ui';

<div style={{ height: 320, width: 'min(420px, 100%)' }}>
  <SplitPane orientation="vertical" defaultValue={60} step={5}>
    <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>Editor</Box>
    <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>Terminal</Box>
  </SplitPane>
</div>`,
};

function Mail() {
  const t = useT();
  const [size, setSize] = useState(36);
  const [stacked, setStacked] = useState(false);
  return (
    <Stack gap={4} className="g-fill">
      <Inline gap={3} justify="center">
        <Badge>{t(`第一栏 ${Math.round(size)}%`, `First pane ${Math.round(size)}%`)}</Badge>
        <Button size="sm" onClick={() => setSize(50)}>{t('设为 50%', 'Set to 50%')}</Button>
        <Switch checked={stacked} onChange={setStacked}>{t('强制堆叠', 'Force stacking')}</Switch>
      </Inline>
      <div style={{ height: 300 }}>
        <SplitPane value={size} onChange={setSize} min={24} max={70} stackBelow="sm" stacked={stacked || undefined} separatorLabel={t('调整列表宽度', 'Resize list')}>
          <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>
            <Text variant="label">{t('列表', 'List')}</Text>
          </Box>
          <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>
            <Text variant="label">{t('详情', 'Details')}</Text>
          </Box>
        </SplitPane>
      </div>
    </Stack>
  );
}

export default function SplitPanePage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('把一块区域分成两栏，中间一条可以拖动的分隔条。分隔条本身是透明的，中间一枚小把手；能拖、能用键盘调、双击复位。自身变窄时自动改成上下堆叠：看的是自己的宽度，不是视口。', 'Splits an area into two panes with a draggable separator between them. The separator itself is transparent with a small handle in the middle; drag it, adjust it with the keyboard, or double-click to reset. When the component itself gets narrow it stacks the panes vertically, judging by its own width rather than the viewport.')}>
      <DocSection title={t('示例', 'Examples')}>
        <Demo
          title={t('左右分栏（受控）', 'Side by side (controlled)')}
          description={t(
            <>拖动中间的把手；或者 <Kbd k="Tab" /> 聚焦它，用 <Kbd k="ArrowLeft" /> <Kbd k="ArrowRight" /> 调整（按住 <Kbd k="Shift" /> 步子更大），<Kbd k="Enter" /> 或双击回到初始值。演示框窄于 520px 时自动堆叠。</>,
            <>Drag the handle in the middle, or focus it with <Kbd k="Tab" /> and adjust with <Kbd k="ArrowLeft" /> <Kbd k="ArrowRight" /> (hold <Kbd k="Shift" /> for bigger steps); <Kbd k="Enter" /> or a double-click returns to the initial value. The panes stack when the demo frame is narrower than 520px.</>,
          )}
          code={t(BASIC_CODE.zh, BASIC_CODE.en)}
          layout="block"
        >
          <Mail />
        </Demo>
        <Demo title={t('上下分栏', 'Top and bottom')} description={t('orientation="vertical"。上下分栏本来就是堆叠的，不受 stackBelow 影响。', 'orientation="vertical". A top-and-bottom split is already stacked, so stackBelow has no effect.')} code={t(VERTICAL_CODE.zh, VERTICAL_CODE.en)}>
          <div style={{ height: 320, width: 'min(420px, 100%)' }}>
            <SplitPane orientation="vertical" defaultValue={60} step={5}>
              <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>{t('编辑器', 'Editor')}</Box>
              <Box surface="card" border radius={4} padding={5} style={{ height: '100%' }}>{t('终端', 'Terminal')}</Box>
            </SplitPane>
          </div>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactNode', required: true, description: t('正好两个子节点：第一栏和第二栏。', 'Exactly two children: the first and second panes.') },
            { name: 'orientation', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: t('分栏方向：左右或上下。', 'Split direction: side by side or top and bottom.') },
            { name: 'value', type: 'number', description: t('第一栏占的百分比（受控），0–100。', 'Percentage taken by the first pane (controlled), 0–100.') },
            { name: 'defaultValue', type: 'number', default: '50', description: t('初始百分比（非受控）；双击分隔条或按 Enter 回到这个值。', 'Initial percentage (uncontrolled); double-clicking the separator or pressing Enter returns to it.') },
            { name: 'onChange', type: '(value: number) => void', description: t('大小变化时触发，参数是新的百分比（保留一位小数）。', 'Called when the size changes, with the new percentage (one decimal place).') },
            { name: 'min / max', type: 'number', default: '20 / 80', description: t('第一栏的最小 / 最大百分比。', 'Minimum / maximum percentage of the first pane.') },
            { name: 'step', type: 'number', default: '2', description: t('方向键每次调整的百分比；按住 Shift 为 10。', 'Percentage per arrow key press; 10 with Shift held.') },
            { name: 'stackBelow', type: `'sm' | 'md' | 'lg' | 'xl' | false`, default: `'md'`, description: t('自身宽度小于该断点时改为上下堆叠（不可拖拽）。false 关闭。', 'Stacks the panes vertically (not draggable) when its own width is below this breakpoint. false turns it off.') },
            { name: 'stacked', type: 'boolean', description: t('强制堆叠 / 不堆叠，忽略 stackBelow。', 'Forces stacking on or off, ignoring stackBelow.') },
            { name: 'separatorLabel', type: 'string', default: t(`'调整分栏大小'`, `'Resize panes'`), description: t('分隔条的无障碍名称。', 'Accessible name of the separator. The default follows the OinkProvider locale.') },
            restRow(t),
          ]}
        />
        <A11yNotes
          items={t([
            <>分隔条是可聚焦的 <Code>role="separator"</Code>，带 <Code>aria-valuenow / min / max</Code>、<Code>aria-orientation</Code> 和指向第一栏的 <Code>aria-controls</Code>。</>,
            <>键盘：← →（上下分栏为 ↑ ↓）按 <Code>step</Code> 调整，Shift 加方向键一次 10%，Home / End 到最小 / 最大，Enter 复位。</>,
            <>堆叠之后分隔条不再可聚焦、不再响应拖拽，只是一条普通的分隔。</>,
            <>触屏上分隔条的可点按宽度从 12px 加到 20px。两栏各自滚动；栏里的内容多时给它们各自一个带名字的滚动区域。</>,
            <>页面上有多个分栏时用 <Code>separatorLabel</Code> 说清楚调的是什么（“调整列表宽度”）。</>,
          ], [
            <>The separator is a focusable <Code>role="separator"</Code> with <Code>aria-valuenow / min / max</Code>, <Code>aria-orientation</Code>, and <Code>aria-controls</Code> pointing at the first pane.</>,
            <>Keyboard: ← → (↑ ↓ for top and bottom) adjust by <Code>step</Code>, Shift plus an arrow moves 10% at a time, Home / End go to the minimum / maximum, and Enter resets.</>,
            <>Once stacked, the separator is no longer focusable or draggable; it is just an ordinary divider.</>,
            <>On touch screens the separator’s hit area grows from 12px to 20px. Each pane scrolls on its own; when a pane holds a lot of content, give it its own named scroll area.</>,
            <>With several split panes on a page, use <Code>separatorLabel</Code> to say what each one adjusts (“Resize list”).</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
