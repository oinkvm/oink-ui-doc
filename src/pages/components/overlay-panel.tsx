import { useState } from 'react';
import {
  Badge, Button, Checkbox, Code, DescriptionList, FloatingBody, FloatingFooter, FloatingHeader, Inline, Panel, Segmented, Stack, Switch, Text, toast, useBreakpoint,
} from 'oink-ui';
import type { PanelPlacement } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Keys } from './display-_kit';
import { FloatingFamily, floatingCommonRows, floatingPartsRows } from './overlay-_shared';
import './overlay-panel.css';

export const meta: PageMeta = { path: '/components/panel', title: 'Panel 悬浮面板', group: '浮层', order: 4, subtitle: 'Panel', en: { title: 'Panel' } };

function ContainedDemo() {
  const t = useT();
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);
  const [dense, setDense] = useState(false);
  const wide = useBreakpoint('sm'); // 窄屏放不下左右并排：改停靠在底边
  return (
    <div ref={setBox} className="overlay-panel-box">
      <Stack gap={3} align="start">
        <Text variant="label">{t('画布', 'Canvas')}</Text>
        <Text tone="neutral">{t('面板打开时，这里的按钮和开关照常可用。', 'While the panel is open, the button and switch here still work.')}</Text>
        <Inline>
          <Button onClick={() => setOpen(!open)} aria-expanded={open}>{open ? t('收起检查器', 'Hide inspector') : t('打开检查器', 'Show inspector')}</Button>
          <Switch checked={dense} onChange={setDense}>{t('紧凑视图', 'Compact view')}</Switch>
        </Inline>
      </Stack>
      {box && (
        <Panel open={open} onOpenChange={setOpen} container={box} contained placement={wide ? 'right' : 'bottom'} size="sm">
          <FloatingHeader title={t('检查器', 'Inspector')} description={t('选中的图层', 'Selected layer')} />
          <FloatingBody>
            <DescriptionList layout="inline" items={[
              { term: t('名称', 'Name'), description: t('主按钮', 'Primary button') },
              { term: t('尺寸', 'Size'), description: '120 × 40' },
              { term: t('视图', 'View'), description: dense ? t('紧凑', 'Compact') : t('宽松', 'Comfortable') },
            ]} />
          </FloatingBody>
          <FloatingFooter align="stretch">
            <Button onClick={() => toast(t('已复制样式', 'Style copied'))}>{t('复制样式', 'Copy style')}</Button>
          </FloatingFooter>
        </Panel>
      )}
    </div>
  );
}

const sides: Array<{ value: PanelPlacement; label: { zh: string; en: string } }> = [
  { value: 'left', label: { zh: '左', en: 'Left' } },
  { value: 'right', label: { zh: '右', en: 'Right' } },
  { value: 'top', label: { zh: '上', en: 'Top' } },
  { value: 'bottom', label: { zh: '下', en: 'Bottom' } },
];

function PlacementDemo() {
  const t = useT();
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<PanelPlacement>('right');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('sm');
  return (
    <Stack gap={4}>
      <Inline gap={3}>
        <Segmented aria-label={t('停靠位置', 'Placement')} options={sides.map((s) => ({ value: s.value, label: t(s.label.zh, s.label.en) }))} value={placement} onChange={setPlacement} />
        <Segmented aria-label={t('尺寸', 'Size')} options={[{ value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' }]} value={size} onChange={setSize} />
      </Inline>
      <div ref={setBox} className="overlay-panel-box overlay-panel-box--framed">
        {box && (
          <Panel open container={box} contained placement={placement} size={size} dismissible={false} aria-label={t('位置与尺寸示例', 'Placement and size example')}>
            <FloatingBody>
              <Text tone="neutral">placement="{placement}" size="{size}"</Text>
            </FloatingBody>
          </Panel>
        )}
      </div>
    </Stack>
  );
}

function PageDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(2);
  return (
    <>
      <Button onClick={() => setOpen(!open)} aria-expanded={open}>
        {t('筛选', 'Filters')} <Badge tone="accent">{filters}</Badge>
      </Button>
      <Panel open={open} onOpenChange={setOpen} role="dialog" size="sm">
        <FloatingHeader title={t('筛选', 'Filters')} description={t('改动立即生效，页面其余部分照常可用。', 'Changes apply immediately, and the rest of the page stays usable.')} />
        <FloatingBody>
          <Stack gap={3}>
            <Checkbox defaultChecked onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>{t('只看我负责的', 'Assigned to me')}</Checkbox>
            <Checkbox defaultChecked onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>{t('未完成', 'Incomplete')}</Checkbox>
            <Checkbox onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>{t('本周到期', 'Due this week')}</Checkbox>
          </Stack>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setOpen(false)}>{t('完成', 'Done')}</Button>
        </FloatingFooter>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ 示例源码 */

const CONTAINED_CODE = {
  zh: `
/* overlay-panel.css
.overlay-panel-box { position: relative; min-height: 340px; padding: 24px; overflow: hidden; }
*/

function ContainedDemo() {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);
  const [dense, setDense] = useState(false);
  const wide = useBreakpoint('sm'); // 窄屏放不下左右并排：改停靠在底边
  return (
    <div ref={setBox} className="overlay-panel-box">
      <Stack gap={3} align="start">
        <Text variant="label">画布</Text>
        <Text tone="neutral">面板打开时，这里的按钮和开关照常可用。</Text>
        <Inline>
          <Button onClick={() => setOpen(!open)} aria-expanded={open}>{open ? '收起检查器' : '打开检查器'}</Button>
          <Switch checked={dense} onChange={setDense}>紧凑视图</Switch>
        </Inline>
      </Stack>
      {box && (
        <Panel open={open} onOpenChange={setOpen} container={box} contained placement={wide ? 'right' : 'bottom'} size="sm">
          <FloatingHeader title="检查器" description="选中的图层" />
          <FloatingBody>
            <DescriptionList layout="inline" items={[
              { term: '名称', description: '主按钮' },
              { term: '尺寸', description: '120 × 40' },
              { term: '视图', description: dense ? '紧凑' : '宽松' },
            ]} />
          </FloatingBody>
          <FloatingFooter align="stretch">
            <Button onClick={() => toast('已复制样式')}>复制样式</Button>
          </FloatingFooter>
        </Panel>
      )}
    </div>
  );
}`,
  en: `
/* overlay-panel.css
.overlay-panel-box { position: relative; min-height: 340px; padding: 24px; overflow: hidden; }
*/

function ContainedDemo() {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(true);
  const [dense, setDense] = useState(false);
  const wide = useBreakpoint('sm'); // no room side by side on narrow screens: dock to the bottom instead
  return (
    <div ref={setBox} className="overlay-panel-box">
      <Stack gap={3} align="start">
        <Text variant="label">Canvas</Text>
        <Text tone="neutral">While the panel is open, the button and switch here still work.</Text>
        <Inline>
          <Button onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Hide inspector' : 'Show inspector'}</Button>
          <Switch checked={dense} onChange={setDense}>Compact view</Switch>
        </Inline>
      </Stack>
      {box && (
        <Panel open={open} onOpenChange={setOpen} container={box} contained placement={wide ? 'right' : 'bottom'} size="sm">
          <FloatingHeader title="Inspector" description="Selected layer" />
          <FloatingBody>
            <DescriptionList layout="inline" items={[
              { term: 'Name', description: 'Primary button' },
              { term: 'Size', description: '120 × 40' },
              { term: 'View', description: dense ? 'Compact' : 'Comfortable' },
            ]} />
          </FloatingBody>
          <FloatingFooter align="stretch">
            <Button onClick={() => toast('Style copied')}>Copy style</Button>
          </FloatingFooter>
        </Panel>
      )}
    </div>
  );
}`,
};

const PLACEMENT_CODE = {
  zh: `
/* overlay-panel.css
.overlay-panel-box--framed { min-height: 420px; border-radius: var(--ok-r-6); background: var(--ok-well); } /* 面板 R32 离框 12：32 + 12 */
*/

const sides: Array<{ value: PanelPlacement; label: string }> = [
  { value: 'left', label: '左' },
  { value: 'right', label: '右' },
  { value: 'top', label: '上' },
  { value: 'bottom', label: '下' },
];

function PlacementDemo() {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<PanelPlacement>('right');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('sm');
  return (
    <Stack gap={4}>
      <Inline gap={3}>
        <Segmented aria-label="停靠位置" options={sides} value={placement} onChange={setPlacement} />
        <Segmented aria-label="尺寸" options={[{ value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' }]} value={size} onChange={setSize} />
      </Inline>
      <div ref={setBox} className="overlay-panel-box overlay-panel-box--framed">
        {box && (
          <Panel open container={box} contained placement={placement} size={size} dismissible={false} aria-label="位置与尺寸示例">
            <FloatingBody>
              <Text tone="neutral">placement="{placement}" size="{size}"</Text>
            </FloatingBody>
          </Panel>
        )}
      </div>
    </Stack>
  );
}`,
  en: `
/* overlay-panel.css
.overlay-panel-box--framed { min-height: 420px; border-radius: var(--ok-r-6); background: var(--ok-well); } /* panel R32, 12 from the frame: 32 + 12 */
*/

const sides: Array<{ value: PanelPlacement; label: string }> = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
];

function PlacementDemo() {
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<PanelPlacement>('right');
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('sm');
  return (
    <Stack gap={4}>
      <Inline gap={3}>
        <Segmented aria-label="Placement" options={sides} value={placement} onChange={setPlacement} />
        <Segmented aria-label="Size" options={[{ value: 'sm', label: 'sm' }, { value: 'md', label: 'md' }, { value: 'lg', label: 'lg' }]} value={size} onChange={setSize} />
      </Inline>
      <div ref={setBox} className="overlay-panel-box overlay-panel-box--framed">
        {box && (
          <Panel open container={box} contained placement={placement} size={size} dismissible={false} aria-label="Placement and size example">
            <FloatingBody>
              <Text tone="neutral">placement="{placement}" size="{size}"</Text>
            </FloatingBody>
          </Panel>
        )}
      </div>
    </Stack>
  );
}`,
};

const PAGE_CODE = {
  zh: `
function PageDemo() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(2);
  return (
    <>
      <Button onClick={() => setOpen(!open)} aria-expanded={open}>
        筛选 <Badge tone="accent">{filters}</Badge>
      </Button>
      <Panel open={open} onOpenChange={setOpen} role="dialog" size="sm">
        <FloatingHeader title="筛选" description="改动立即生效，页面其余部分照常可用。" />
        <FloatingBody>
          <Stack gap={3}>
            <Checkbox defaultChecked onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>只看我负责的</Checkbox>
            <Checkbox defaultChecked onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>未完成</Checkbox>
            <Checkbox onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>本周到期</Checkbox>
          </Stack>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setOpen(false)}>完成</Button>
        </FloatingFooter>
      </Panel>
    </>
  );
}`,
  en: `
function PageDemo() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState(2);
  return (
    <>
      <Button onClick={() => setOpen(!open)} aria-expanded={open}>
        Filters <Badge tone="accent">{filters}</Badge>
      </Button>
      <Panel open={open} onOpenChange={setOpen} role="dialog" size="sm">
        <FloatingHeader title="Filters" description="Changes apply immediately, and the rest of the page stays usable." />
        <FloatingBody>
          <Stack gap={3}>
            <Checkbox defaultChecked onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>Assigned to me</Checkbox>
            <Checkbox defaultChecked onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>Incomplete</Checkbox>
            <Checkbox onChange={(on) => setFilters((n) => n + (on ? 1 : -1))}>Due this week</Checkbox>
          </Stack>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </FloatingFooter>
      </Panel>
    </>
  );
}`,
};

export default function PanelPage() {
  const t = useT();
  const parts = floatingPartsRows(t);
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '停靠在一侧的非模态卡片：没有遮罩、不锁滚动、不圈焦点，打开时页面其余部分照常可用。用于检查器、筛选面板这类“边看边调”的辅助区域。需要人先处理完才能继续时用 Drawer。',
        'A non-modal card docked to one side: no scrim, no scroll lock, no focus trap — the rest of the page stays usable while it’s open. Use it for supporting areas you tweak while you look, like inspectors and filter panels. When people must finish something before continuing, use Drawer.',
      )}
    >
      <FloatingFamily current="Panel">
        <Demo
          title={t('结构件，以及限制在一个区域里', 'Building blocks, contained to an area')}
          description={t(
            '面板默认停靠在视口边上。传 container 和 contained 可以把它限制在某个容器里（该容器需要 position: relative）——下面的面板就停靠在演示框的右边，而不是整个页面。里面同样用 FloatingHeader / FloatingBody / FloatingFooter 来搭。',
            'By default a panel docks to the edge of the viewport. Pass container and contained to keep it inside a container (which needs position: relative) — the panel below docks to the right of the demo box rather than the whole page. Inside, it’s built from FloatingHeader / FloatingBody / FloatingFooter as well.',
          )}
          flush
          layout="block"
          code={t(CONTAINED_CODE.zh, CONTAINED_CODE.en)}
        >
          <ContainedDemo />
        </Demo>
      </FloatingFamily>

      <DocSection title={t('位置与尺寸', 'Placement and size')} description={t('placement 是停靠的那一侧，默认 right。size 是主轴尺寸：左右是宽度 sm 280、md 320（默认）、lg 400；上下是高度 sm 200、md 280、lg 400。尺寸不会超过容器减去间隙。', 'placement is the side it docks to; the default is right. size is the main-axis size: width for left/right — sm 280, md 320 (default), lg 400; height for top/bottom — sm 200, md 280, lg 400. It never exceeds the container minus the gaps.')}>
        <Demo layout="block" code={t(PLACEMENT_CODE.zh, PLACEMENT_CODE.en)}>
          <PlacementDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('停靠在页面上', 'Docked to the page')} description={t('不传 container 时面板停靠在视口边上，浮在页面内容之上。打开它不会抢走焦点；焦点在面板里时按 Esc 关闭，并把焦点还给进来之前的元素。面板会盖住它下面的内容，所以通常要给页面留出相应的空位，或者让面板可以收起。', 'Without container, the panel docks to the viewport edge and floats above the page content. Opening it doesn’t steal focus; when focus is inside the panel, Esc closes it and returns focus to where it was before. The panel covers the content beneath it, so usually you’ll want to leave room for it in the layout, or let it be collapsed.')}>
        <Demo code={t(PAGE_CODE.zh, PAGE_CODE.en)}>
          <PageDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Panel" rows={[
          { name: 'placement', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: t('停靠在哪一侧。', 'Which side it docks to.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number | string", default: "'md'", description: t('主轴尺寸。左右是宽度 280 / 320 / 400；上下是高度 200 / 280 / 400。', 'Main-axis size. Width for left/right: 280 / 320 / 400; height for top/bottom: 200 / 280 / 400.') },
          { name: 'role', type: "'complementary' | 'region' | 'dialog'", default: "'complementary'", description: t('语义：页面的辅助区域、普通区域，或非模态对话框。', 'Semantics: a complementary area of the page, a generic region, or a non-modal dialog.') },
          { name: 'contained', type: 'boolean', description: t(<>配合 <Code>container</Code>：把面板限制在该容器内（容器需要 <Code>position: relative</Code>）。</>, <>With <Code>container</Code>: keeps the panel inside that container (which needs <Code>position: relative</Code>).</>) },
          { name: 'stretch', type: 'boolean', default: 'true', description: t('是否在另一个方向上撑满；false 则按内容大小并居中。', 'Whether to fill the cross axis; false sizes it to the content and centers it.') },
          ...floatingCommonRows(t),
        ]} />
        <Text as="p" tone="neutral">{t(<>同一个组件还以 <Code>FloatingPanel</Code> 的名字导出，和布局类的“面板”容器重名时用它。</>, <>The same component is also exported as <Code>FloatingPanel</Code>; use that name when it would clash with a layout “panel” container.</>)}</Text>
        <PropsTable title="FloatingHeader" rows={parts.header} />
        <PropsTable title="FloatingBody / FloatingFooter" rows={[...parts.body, ...parts.footer]} />
        <A11yNotes items={t([
          <>默认是 <Code>role="complementary"</Code>（辅助地标），名字取自 FloatingHeader 的标题；没有标题时必须给 <Code>aria-label</Code>。一页里有多个辅助地标时名字要各不相同。</>,
          <>非模态：没有 <Code>aria-modal</Code>，不圈焦点，打开时也不移动焦点。请让触发按钮带 <Code>aria-expanded</Code>，并让面板在 DOM 或 Tab 顺序上容易到达。</>,
          <>焦点在面板里时 <Keys k="Esc" /> 关闭，焦点还给进面板之前所在的元素；焦点在面板外时 Esc 不归它管，不会抢页面上别处的 Esc。</>,
          '面板渲染在 Portal 里（默认挂到 body 末尾）：键盘用户要 Tab 过整页才能到它。内容重要时用 container 把它放到触发按钮附近，或打开后主动把焦点移进去。',
          '没有遮罩，靠 1px 的 --ok-line-2 描边和页面分开，深浅色下都看得清。',
        ], [
          <>Defaults to <Code>role="complementary"</Code> (a complementary landmark), named by the FloatingHeader title; without a title you must provide <Code>aria-label</Code>. When a page has several complementary landmarks, give each a distinct name.</>,
          <>Non-modal: no <Code>aria-modal</Code>, no focus trap, and focus doesn’t move on open. Give the trigger button <Code>aria-expanded</Code>, and make the panel easy to reach in DOM or Tab order.</>,
          <>When focus is inside the panel, <Keys k="Esc" /> closes it and returns focus to where it was before entering; when focus is outside, Esc isn’t the panel’s business, so it never steals Esc from elsewhere on the page.</>,
          'The panel renders in a portal (appended to the end of body by default), so keyboard users have to Tab through the whole page to reach it. If its content matters, use container to place it near the trigger, or move focus into it after opening.',
          'There’s no scrim; a 1px --ok-line-2 hairline sets it apart from the page, clearly visible in both light and dark mode.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
