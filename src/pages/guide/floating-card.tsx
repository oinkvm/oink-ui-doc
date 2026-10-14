import { useState } from 'react';
import {
  Button, Code, Dialog, Drawer, FloatingBody, FloatingCard, FloatingFooter, FloatingHeader, Inline, Panel, Segmented, Sheet, Stack, Switch, Text,
} from 'oink-ui';
import type { FloatPlacement } from 'oink-ui';
import { Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { Link } from '../../router';
import './guide.css';

export const meta: PageMeta = { path: '/guide/floating-card', title: '悬浮卡片体系', group: '开始', order: 11, subtitle: 'Floating card', en: { title: 'Floating card system' } };

const PLAYGROUND_CODE = {
  zh: `import { useState } from 'react';
import { Button, FloatingBody, FloatingCard, FloatingFooter, FloatingHeader, Inline, Segmented, Stack, Switch } from 'oink-ui';
import type { FloatPlacement } from 'oink-ui';

const SIZE: Record<FloatPlacement, number> = { center: 300, left: 240, right: 240, top: 230, bottom: 230 };

function Playground() {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<FloatPlacement>('right');
  const [modal, setModal] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={4}>
      <Inline gap={3} justify="center">
        <Segmented
          size="sm"
          aria-label="停靠位置"
          value={placement}
          onChange={setPlacement}
          options={[
            { value: 'center', label: 'center' },
            { value: 'left', label: 'left' },
            { value: 'right', label: 'right' },
            { value: 'top', label: 'top' },
            { value: 'bottom', label: 'bottom' },
          ]}
        />
        <Switch checked={modal} onChange={setModal}>模态</Switch>
      </Inline>

      {/* 演示框：position: relative + 固定高度。卡片渲染进它里面，只盖住它 */}
      <div ref={setFrame} style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <Stack gap={3} align="center" justify="center" style={{ height: '100%' }}>
          <Button variant="primary" onClick={() => setOpen(true)}>打开卡片</Button>
        </Stack>
        <FloatingCard
          open={open}
          onOpenChange={setOpen}
          placement={placement}
          modal={modal}
          size={SIZE[placement]}
          container={frame}
          contained
        >
          <FloatingHeader title="悬浮卡片" description={\`placement="\${placement}"\`} />
          <FloatingBody>同一张卡片，换个位置。</FloatingBody>
          <FloatingFooter>
            <Button variant="primary" onClick={() => setOpen(false)}>好的</Button>
          </FloatingFooter>
        </FloatingCard>
      </div>
    </Stack>
  );
}`,
  en: `import { useState } from 'react';
import { Button, FloatingBody, FloatingCard, FloatingFooter, FloatingHeader, Inline, Segmented, Stack, Switch } from 'oink-ui';
import type { FloatPlacement } from 'oink-ui';

const SIZE: Record<FloatPlacement, number> = { center: 300, left: 240, right: 240, top: 230, bottom: 230 };

function Playground() {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<FloatPlacement>('right');
  const [modal, setModal] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={4}>
      <Inline gap={3} justify="center">
        <Segmented
          size="sm"
          aria-label="Placement"
          value={placement}
          onChange={setPlacement}
          options={[
            { value: 'center', label: 'center' },
            { value: 'left', label: 'left' },
            { value: 'right', label: 'right' },
            { value: 'top', label: 'top' },
            { value: 'bottom', label: 'bottom' },
          ]}
        />
        <Switch checked={modal} onChange={setModal}>Modal</Switch>
      </Inline>

      {/* Demo frame: position: relative + fixed height. The card renders inside it and covers only it */}
      <div ref={setFrame} style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <Stack gap={3} align="center" justify="center" style={{ height: '100%' }}>
          <Button variant="primary" onClick={() => setOpen(true)}>Open card</Button>
        </Stack>
        <FloatingCard
          open={open}
          onOpenChange={setOpen}
          placement={placement}
          modal={modal}
          size={SIZE[placement]}
          container={frame}
          contained
        >
          <FloatingHeader title="Floating card" description={\`placement="\${placement}"\`} />
          <FloatingBody>Same card, different place.</FloatingBody>
          <FloatingFooter>
            <Button variant="primary" onClick={() => setOpen(false)}>OK</Button>
          </FloatingFooter>
        </FloatingCard>
      </div>
    </Stack>
  );
}`,
};

const FAMILY_CODE = {
  zh: `import { useState } from 'react';
import { Button, Dialog, Drawer, FloatingBody, FloatingFooter, FloatingHeader, Inline, Panel, Sheet } from 'oink-ui';

function Family() {
  const [which, setWhich] = useState<'dialog' | 'drawer' | 'sheet' | 'panel' | null>(null);
  const close = () => setWhich(null);
  const bind = (name: typeof which) => ({ open: which === name, onOpenChange: (o: boolean) => setWhich(o ? name : null) });
  return (
    <>
      <Inline gap={3} justify="center">
        <Button onClick={() => setWhich('dialog')}>Dialog</Button>
        <Button onClick={() => setWhich('drawer')}>Drawer</Button>
        <Button onClick={() => setWhich('sheet')}>Sheet</Button>
        <Button onClick={() => setWhich('panel')}>Panel（非模态）</Button>
      </Inline>

      <Dialog
        {...bind('dialog')}
        title="对话框"
        description="居中的悬浮卡片。模态：带遮罩、圈住焦点、锁住页面滚动。"
        actions={<><Button onClick={close}>取消</Button><Button variant="primary" onClick={close}>确定</Button></>}
      />

      <Drawer {...bind('drawer')} placement="right">
        <FloatingHeader title="抽屉" description="贴着一侧滑入的悬浮卡片，默认模态。" />
        <FloatingBody>四周留着和对话框一样的缝。</FloatingBody>
        <FloatingFooter><Button variant="primary" onClick={close}>完成</Button></FloatingFooter>
      </Drawer>

      <Sheet {...bind('sheet')}>
        <FloatingHeader title="底部弹层" description="从底边升起，带抓手，可以按住头部向下拖拽关闭。" />
        <FloatingBody>窄屏上用它代替对话框和抽屉。</FloatingBody>
      </Sheet>

      <Panel {...bind('panel')} placement="right" aria-label="检查器">
        <FloatingHeader title="侧面板" description="非模态：没有遮罩，页面其余部分照常可用。" />
        <FloatingBody>焦点在面板里时按 Esc 关闭。</FloatingBody>
      </Panel>
    </>
  );
}`,
  en: `import { useState } from 'react';
import { Button, Dialog, Drawer, FloatingBody, FloatingFooter, FloatingHeader, Inline, Panel, Sheet } from 'oink-ui';

function Family() {
  const [which, setWhich] = useState<'dialog' | 'drawer' | 'sheet' | 'panel' | null>(null);
  const close = () => setWhich(null);
  const bind = (name: typeof which) => ({ open: which === name, onOpenChange: (o: boolean) => setWhich(o ? name : null) });
  return (
    <>
      <Inline gap={3} justify="center">
        <Button onClick={() => setWhich('dialog')}>Dialog</Button>
        <Button onClick={() => setWhich('drawer')}>Drawer</Button>
        <Button onClick={() => setWhich('sheet')}>Sheet</Button>
        <Button onClick={() => setWhich('panel')}>Panel (non-modal)</Button>
      </Inline>

      <Dialog
        {...bind('dialog')}
        title="Dialog"
        description="A centered floating card. Modal: scrim, focus trap, page scroll locked."
        actions={<><Button onClick={close}>Cancel</Button><Button variant="primary" onClick={close}>OK</Button></>}
      />

      <Drawer {...bind('drawer')} placement="right">
        <FloatingHeader title="Drawer" description="A floating card that slides in from one edge. Modal by default." />
        <FloatingBody>It keeps the same gap around it as a dialog.</FloatingBody>
        <FloatingFooter><Button variant="primary" onClick={close}>Done</Button></FloatingFooter>
      </Drawer>

      <Sheet {...bind('sheet')}>
        <FloatingHeader title="Bottom sheet" description="Rises from the bottom edge with a grip; drag the header down to close." />
        <FloatingBody>Use it instead of dialogs and drawers on narrow screens.</FloatingBody>
      </Sheet>

      <Panel {...bind('panel')} placement="right" aria-label="Inspector">
        <FloatingHeader title="Side panel" description="Non-modal: no scrim, and the rest of the page stays usable." />
        <FloatingBody>Press Esc to close while focus is inside the panel.</FloatingBody>
      </Panel>
    </>
  );
}`,
};

const SIZE: Record<FloatPlacement, number> = { center: 300, left: 240, right: 240, top: 230, bottom: 230 };

function Playground() {
  const t = useT();
  const [frame, setFrame] = useState<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<FloatPlacement>('right');
  const [modal, setModal] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={4} className="g-fill">
      <Inline gap={3} justify="center">
        <Segmented
          size="sm"
          aria-label={t('停靠位置', 'Placement')}
          value={placement}
          onChange={setPlacement}
          options={[
            { value: 'center', label: 'center' },
            { value: 'left', label: 'left' },
            { value: 'right', label: 'right' },
            { value: 'top', label: 'top' },
            { value: 'bottom', label: 'bottom' },
          ]}
        />
        <Switch checked={modal} onChange={setModal}>{t('模态', 'Modal')}</Switch>
      </Inline>

      <div ref={setFrame} className="g-frame" style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
        <Stack gap={3} align="center" justify="center" style={{ height: '100%' }}>
          <Button variant="primary" onClick={() => setOpen(true)}>{t('打开卡片', 'Open card')}</Button>
        </Stack>
        <FloatingCard
          open={open}
          onOpenChange={setOpen}
          placement={placement}
          modal={modal}
          size={SIZE[placement]}
          container={frame}
          contained
        >
          <FloatingHeader title={t('悬浮卡片', 'Floating card')} description={`placement="${placement}"`} />
          <FloatingBody>{t('同一张卡片，换个位置。', 'Same card, different place.')}</FloatingBody>
          <FloatingFooter>
            <Button variant="primary" onClick={() => setOpen(false)}>{t('好的', 'OK')}</Button>
          </FloatingFooter>
        </FloatingCard>
      </div>
    </Stack>
  );
}

function Family() {
  const t = useT();
  const [which, setWhich] = useState<'dialog' | 'drawer' | 'sheet' | 'panel' | null>(null);
  const close = () => setWhich(null);
  const bind = (name: typeof which) => ({ open: which === name, onOpenChange: (o: boolean) => setWhich(o ? name : null) });
  return (
    <>
      <Inline gap={3} justify="center">
        <Button onClick={() => setWhich('dialog')}>Dialog</Button>
        <Button onClick={() => setWhich('drawer')}>Drawer</Button>
        <Button onClick={() => setWhich('sheet')}>Sheet</Button>
        <Button onClick={() => setWhich('panel')}>{t('Panel（非模态）', 'Panel (non-modal)')}</Button>
      </Inline>

      <Dialog
        {...bind('dialog')}
        title={t('对话框', 'Dialog')}
        description={t('居中的悬浮卡片。模态：带遮罩、圈住焦点、锁住页面滚动。', 'A centered floating card. Modal: scrim, focus trap, page scroll locked.')}
        actions={<><Button onClick={close}>{t('取消', 'Cancel')}</Button><Button variant="primary" onClick={close}>{t('确定', 'OK')}</Button></>}
      />

      <Drawer {...bind('drawer')} placement="right">
        <FloatingHeader title={t('抽屉', 'Drawer')} description={t('贴着一侧滑入的悬浮卡片，默认模态。', 'A floating card that slides in from one edge. Modal by default.')} />
        <FloatingBody>{t('四周留着和对话框一样的缝。', 'It keeps the same gap around it as a dialog.')}</FloatingBody>
        <FloatingFooter><Button variant="primary" onClick={close}>{t('完成', 'Done')}</Button></FloatingFooter>
      </Drawer>

      <Sheet {...bind('sheet')}>
        <FloatingHeader title={t('底部弹层', 'Bottom sheet')} description={t('从底边升起，带抓手，可以按住头部向下拖拽关闭。', 'Rises from the bottom edge with a grip; drag the header down to close.')} />
        <FloatingBody>{t('窄屏上用它代替对话框和抽屉。', 'Use it instead of dialogs and drawers on narrow screens.')}</FloatingBody>
      </Sheet>

      <Panel {...bind('panel')} placement="right" aria-label={t('检查器', 'Inspector')}>
        <FloatingHeader title={t('侧面板', 'Side panel')} description={t('非模态：没有遮罩，页面其余部分照常可用。', 'Non-modal: no scrim, and the rest of the page stays usable.')} />
        <FloatingBody>{t('焦点在面板里时按 Esc 关闭。', 'Press Esc to close while focus is inside the panel.')}</FloatingBody>
      </Panel>
    </>
  );
}

export default function FloatingCardGuide() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '所有“浮在页面之上的容器”都是同一张卡片：圆角 --ok-r-5、表面 --ok-surface、1px 描边加顶部高光，四周和边缘留一圈缝，从停靠的那一侧滑入。Dialog、Drawer、Sheet、Panel 以及 AppShell 的侧栏，只是它在不同位置、不同尺寸、是否模态下的用法。',
        'Every container that floats above the page is the same card: corner radius --ok-r-5, surface --ok-surface, a 1px stroke plus top highlight, a gap all around from the edges, and it slides in from the side it docks to. Dialog, Drawer, Sheet, Panel and the AppShell sidebar are just that card used at different placements, at different sizes, modal or not.',
      )}
    >
      <DocSection title={t('一张卡片，五个位置', 'One card, five placements')} description={t('下面直接用基座组件 FloatingCard。切换 placement 和 modal，再打开卡片：外观、间隙、进退场的方式都是同一套。演示用了 contained，把卡片限制在演示框里。', 'This uses the base component, FloatingCard, directly. Switch placement and modal, then open the card: the look, the gaps and the enter and exit motion are all the same. The demo uses contained to keep the card inside the demo frame.')}>
        <Demo code={t(PLAYGROUND_CODE.zh, PLAYGROUND_CODE.en)} layout="block">
          <Playground />
        </Demo>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>center</strong>：居中，从触发点（没有触发点时从中心）0.6 放大到位。</li>
              <li><strong>left / right / top / bottom</strong>：贴着对应的边滑入；手机宽度下卡片撑满整宽，只滑进三分之一的距离。<Code>size</Code> 在左右是宽度，在上下是高度。</li>
              <li>五个位置共用一条进场、一条退场：进场 303ms 用 soft 弹簧落位、不过冲（<Code>--ok-float-in-dur</Code> / <Code>--ok-float-in-ease</Code>），退场 160ms 加速走开（<Code>--ok-float-out-dur</Code> / <Code>--ok-float-out-ease</Code>），遮罩跟着同一档时长。见 <Link to="/guide/motion" className="g-link ok-focusable">动效 · 悬浮卡片</Link>。</li>
              <li>没有阴影。模态时靠遮罩压暗并模糊背景，非模态时靠 <Code>--ok-line-2</Code> 的描边和页面分开。</li>
            </ul>,
            <ul>
              <li><strong>center</strong>: centered, scaling up from 0.6 out of the trigger (or out of the center when there is no trigger).</li>
              <li><strong>left / right / top / bottom</strong>: slides in along that edge; at phone widths the card spans the full width and only slides in a third of the distance. <Code>size</Code> is the width for left and right, the height for top and bottom.</li>
              <li>All five placements share one enter and one exit: the enter takes 303ms and settles on the soft spring without overshoot (<Code>--ok-float-in-dur</Code> / <Code>--ok-float-in-ease</Code>), the exit accelerates away in 160ms (<Code>--ok-float-out-dur</Code> / <Code>--ok-float-out-ease</Code>), and the scrim follows the same durations. See <Link to="/guide/motion" className="g-link ok-focusable">Motion · Floating cards</Link>.</li>
              <li>No shadows. Modal cards stand apart because the scrim dims and blurs the background; non-modal cards are separated from the page by an <Code>--ok-line-2</Code> stroke.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('模态与非模态', 'Modal and non-modal')}>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>模态（默认，Dialog / Drawer / Sheet）。</strong>带遮罩；锁住页面滚动；焦点圈在卡片里，打开时自动移进去，关闭后还给触发元素；Esc 和点遮罩关闭；<Code>role="dialog"</Code> 加 <Code>aria-modal</Code>。</li>
              <li><strong>非模态（<Code>modal={'{false}'}</Code>，Panel）。</strong>没有遮罩，不锁滚动，不圈焦点，页面其余部分照常可用；焦点在卡片里时 Esc 才关闭，关闭时把焦点还回原处；默认 <Code>role="complementary"</Code>，需要用标题或 <Code>aria-label</Code> 起名字。</li>
            </ul>,
            <ul>
              <li><strong>Modal (default; Dialog / Drawer / Sheet).</strong> Has a scrim; locks page scrolling; traps focus inside the card, moving it in on open and returning it to the trigger on close; closes on Esc or a scrim click; <Code>role="dialog"</Code> with <Code>aria-modal</Code>.</li>
              <li><strong>Non-modal (<Code>modal={'{false}'}</Code>; Panel).</strong> No scrim, no scroll lock, no focus trap, and the rest of the page stays usable. Esc closes it only while focus is inside, and focus goes back where it was on close. Defaults to <Code>role="complementary"</Code> and needs a name from a heading or <Code>aria-label</Code>.</li>
            </ul>,
          )}
        </div>
        <div className="g-prose">
          {t(
            <p>选哪种，看用户是不是必须先处理它：必须回应的（确认、表单）用模态；辅助性的、要和页面对照着看的（检查器、筛选面板）用非模态。<Code>dismissible={'{false}'}</Code> 可以关掉 Esc 和点遮罩，这时一定要在卡片里留一个明确的关闭或确认按钮。</p>,
            <p>Which to use depends on whether the user has to deal with it first: things that need a response (confirmations, forms) are modal; supporting content meant to be read alongside the page (inspectors, filter panels) is non-modal. <Code>dismissible={'{false}'}</Code> turns off Esc and scrim clicks; when you use it, always leave a clear close or confirm button in the card.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('四个封装', 'Four wrappers')} description={t('日常直接用封装好的组件：它们各有一张 sm / md / lg 尺寸表，并补上各自的结构和默认值。这里的四个都渲染在整个视口上。', 'Day to day, use the wrapped components: each has its own sm / md / lg size table and adds its own structure and defaults. The four here all render over the whole viewport.')}>
        <Demo code={t(FAMILY_CODE.zh, FAMILY_CODE.en)}>
          <Family />
        </Demo>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>Dialog</strong>（center，模态）：宽度 sm 320 / md 400 / lg 560。自带图标位、标题、说明、操作区。各种宽度下形态不变，都从触发点放大进场。</li>
              <li><strong>Drawer</strong>（四边，默认模态）：左右宽度 sm 280 / md 360 / lg 480，上下高度 sm 240 / md 360 / lg 520。</li>
              <li><strong>Sheet</strong>（bottom，默认模态）：高度跟随内容，或 sm 40% / md 60% / lg 85% / full。带抓手，可拖拽关闭；宽屏上最宽 560 并居中。</li>
              <li><strong>Panel</strong>（四边，非模态）：左右宽度 sm 280 / md 320 / lg 400，上下高度 sm 200 / md 280 / lg 400。支持 <Code>container</Code> 加 <Code>contained</Code>。</li>
              <li><strong>AppShell.Sidebar / Aside</strong>（left / right，模态）：宽屏时是停靠在两侧、占据布局空间的卡片；窄屏时同一份内容改由 FloatingCard 从对应一侧滑入。见 <Link to="/components/app-shell" className="g-link ok-focusable">AppShell</Link>。</li>
            </ul>,
            <ul>
              <li><strong>Dialog</strong> (center, modal): width sm 320 / md 400 / lg 560. Comes with an icon slot, title, description and actions. Keeps the same form at every width and scales in from its trigger.</li>
              <li><strong>Drawer</strong> (any edge, modal by default): width sm 280 / md 360 / lg 480 on the left and right, height sm 240 / md 360 / lg 520 on the top and bottom.</li>
              <li><strong>Sheet</strong> (bottom, modal by default): height follows the content, or sm 40% / md 60% / lg 85% / full. Has a grip and can be dragged to close; on wide screens it is at most 560 wide and centered.</li>
              <li><strong>Panel</strong> (any edge, non-modal): width sm 280 / md 320 / lg 400 on the left and right, height sm 200 / md 280 / lg 400 on the top and bottom. Supports <Code>container</Code> with <Code>contained</Code>.</li>
              <li><strong>AppShell.Sidebar / Aside</strong> (left / right, modal): on wide screens, cards docked at the sides that take up layout space; on narrow screens the same content slides in from that side as a FloatingCard. See <Link to="/components/app-shell" className="g-link ok-focusable">AppShell</Link>.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('contained：限制在一个区域里', 'contained: keeping it inside an area')} description={t('默认卡片渲染到 body 下、盖住整个视口。传 container（一个 position: relative 的元素）加 contained 之后，卡片渲染进这个元素，定位、遮罩都只在它里面，也不再锁页面滚动。', 'By default the card renders under body and covers the whole viewport. Pass container (an element with position: relative) plus contained and the card renders into that element instead: positioning and the scrim stay inside it, and page scrolling is no longer locked.')}>
        <div className="g-prose">
          {t(
            <ul>
              <li>上面“五个位置”的演示就是这么做的；<Code>AppShell</Code> 的 <Code>contained</Code> 模式也用它把侧栏抽屉限制在骨架自己的范围里。</li>
              <li>容器需要 <Code>position: relative</Code>，通常再加 <Code>overflow: hidden</Code>，否则滑入滑出的过程会露到容器外面。</li>
              <li><Code>container</Code> 是元素本身而不是 ref：用 <Code>useState</Code> 存回调 ref 拿到的节点，节点就绪后会触发一次重渲染。</li>
              <li><Code>Dialog</Code>、<Code>Drawer</Code>、<Code>Sheet</Code> 没有开放 <Code>contained</Code>；需要限制范围时用 <Code>Panel</Code>，或者直接用 <Code>FloatingCard</Code>。</li>
            </ul>,
            <ul>
              <li>That’s how the five-placement demo above works; <Code>AppShell</Code>’s <Code>contained</Code> mode also uses it to keep the sidebar drawer within the shell.</li>
              <li>The container needs <Code>position: relative</Code>, and usually <Code>overflow: hidden</Code> too; otherwise the card shows outside the container while it slides in and out.</li>
              <li><Code>container</Code> is the element itself, not a ref: store the node from a callback ref in <Code>useState</Code>, which triggers a re-render once the node is ready.</li>
              <li><Code>Dialog</Code>, <Code>Drawer</Code> and <Code>Sheet</Code> don’t expose <Code>contained</Code>; when you need to constrain the area, use <Code>Panel</Code> or <Code>FloatingCard</Code> directly.</li>
            </ul>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('结构件', 'Building blocks')} description={t('卡片里面用四个结构件搭：它们负责内边距、滚动和无障碍接线。', 'Inside the card, build with four structural parts that handle padding, scrolling and accessibility wiring.')}>
        <PropsTable
          title="FloatingHeader / FloatingBody / FloatingFooter / FloatingGrip"
          rows={[
            { name: 'FloatingHeader', type: 'title, description, icon, level, closable', description: t('标题、说明和关闭按钮。标题和说明会自动成为卡片的 aria-labelledby / aria-describedby；在可拖拽的卡片里同时是拖拽把手。', 'Title, description and close button. The title and description automatically become the card’s aria-labelledby / aria-describedby; in a draggable card it is also the drag handle.') },
            { name: 'FloatingBody', type: 'padded', description: t('内容区：占满头尾之间的空间，超出时原生滚动。内容自己通栏（列表、表格）时把 padded 关掉。', 'Content area: fills the space between header and footer and scrolls natively on overflow. Turn padded off when the content runs edge to edge (lists, tables).') },
            { name: 'FloatingFooter', type: `align: 'start' | 'end' | 'between' | 'stretch'`, description: t('操作区：一排按钮，默认靠右。', 'Actions: a row of buttons, right-aligned by default.') },
            { name: 'FloatingGrip', type: '—', description: t('顶上的小横杠，也是拖拽关闭的把手。纯装饰，对读屏隐藏。Sheet 默认自带。', 'The small bar at the top, also the handle for drag-to-close. Purely decorative and hidden from screen readers. Included in Sheet by default.') },
          ]}
        />
        <Text as="p" tone="neutral" style={{ margin: 0 }}>
          {t(
            <>在结构件或自己的子组件里，可以用 <Code>useFloatingCard()</Code> 拿到所在卡片的 <Code>close()</Code>、<Code>placement</Code>、<Code>modal</Code> 等。</>,
            <>Inside the structural parts or your own child components, <Code>useFloatingCard()</Code> gives you the enclosing card’s <Code>close()</Code>, <Code>placement</Code>, <Code>modal</Code> and more.</>,
          )}
        </Text>
      </DocSection>

      <DocSection title={t('FloatingCard 属性', 'FloatingCard props')}>
        <PropsTable
          rows={[
            { name: 'open', type: 'boolean', required: true, description: t('是否打开。基座只有受控写法；封装组件另外支持 defaultOpen。', 'Whether it is open. The base component is controlled only; the wrappers also support defaultOpen.') },
            { name: 'onOpenChange', type: '(open: boolean) => void', description: t('请求开合时触发（Esc、点遮罩、关闭按钮、拖拽关闭）。', 'Called when opening or closing is requested (Esc, scrim click, close button, drag to close).') },
            { name: 'placement', type: `'center' | 'left' | 'right' | 'top' | 'bottom'`, default: `'center'`, description: t('停靠位置。', 'Where the card docks.') },
            { name: 'modal', type: 'boolean', default: 'true', description: t('模态：遮罩、锁滚动、圈焦点。', 'Modal: scrim, scroll lock, focus trap.') },
            { name: 'dismissible', type: 'boolean', default: 'true', description: t('允许 Esc 和点遮罩关闭。', 'Allow closing with Esc and scrim clicks.') },
            { name: 'size', type: 'number | string', description: t('主轴尺寸：left / right / center 是宽度，top / bottom 是高度。数字按 px。永远不会超过可用空间。', 'Size along the main axis: width for left / right / center, height for top / bottom. Numbers are px. Never exceeds the available space.') },
            { name: 'gap', type: 'number', default: t('12（窄屏 8）', '12 (8 on narrow screens)'), description: t('卡片到边缘的间隙（px）。', 'Gap between the card and the edges (px).') },
            { name: 'stretch', type: 'boolean', default: 'true', description: t('贴边时是否在另一个方向上撑满；false 则按内容大小并居中。', 'Whether an edge-docked card fills the cross axis; false sizes it to its content and centers it.') },
            { name: 'role', type: `'dialog' | 'alertdialog' | 'complementary' | 'region'`, default: `'dialog'`, description: t('语义角色。', 'Semantic role.') },
            { name: 'initialFocus', type: 'RefObject<HTMLElement>', description: t('模态打开时先聚焦哪个元素；不传则找带 data-autofocus 的元素，再没有就聚焦卡片本身。', 'Which element gets focus when a modal opens; otherwise the element with data-autofocus, and failing that the card itself.') },
            { name: 'restoreFocus', type: 'boolean', default: 'true', description: t('关闭后把焦点还给之前的元素。', 'Return focus to the previous element after closing.') },
            { name: 'container', type: 'HTMLElement | null', description: t('渲染到哪个容器，默认 body。', 'Container to render into; defaults to body.') },
            { name: 'contained', type: 'boolean', default: 'false', description: t('配合 container：把浮层限制在容器范围内。', 'Used with container: keeps the overlay within the container.') },
            { name: 'dragToDismiss', type: 'boolean', default: 'false', description: t('按住带 data-ok-drag-handle 的区域朝停靠的一侧拖拽关闭。只对贴边的卡片有效。', 'Drag the area marked data-ok-drag-handle toward the docked side to close. Edge-docked cards only.') },
            { name: 'onExited', type: '() => void', description: t('退场动画结束、节点卸载之后。', 'Called after the exit animation finishes and the node unmounts.') },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
