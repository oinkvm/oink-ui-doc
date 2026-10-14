import { useState } from 'react';
import {
  Badge, Button, Code, DescriptionList, Drawer, Field, FloatingBody, FloatingFooter, FloatingHeader, Group, Icon, Inline, Input, Row, Stack, Switch, Text, Textarea, toast,
} from 'oink-ui';
import type { DrawerPlacement } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Keys } from './display-_kit';
import { FloatingFamily, floatingCommonRows, floatingPartsRows } from './overlay-_shared';

export const meta: PageMeta = { path: '/components/drawer', title: 'Drawer 抽屉', group: '浮层', order: 2, subtitle: 'Drawer', en: { title: 'Drawer' } };

function StructureDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>{t('新建任务', 'New task')}</Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <FloatingHeader title={t('新建任务', 'New task')} description={t('带 * 的是必填项。', 'Fields marked * are required.')} />
        <FloatingBody>
          <Stack gap={4}>
            <Field label={t('标题', 'Title')} required><Input placeholder={t('一句话说清要做什么', 'What needs doing, in one sentence')} /></Field>
            <Field label={t('说明', 'Description')}><Textarea rows={4} placeholder={t('背景、验收标准…', 'Background, acceptance criteria…')} /></Field>
            <Field label={t('截止日期', 'Due date')} hint={t('不填表示没有期限', 'Leave empty for no deadline')}><Input placeholder="2024-09-01" /></Field>
          </Stack>
        </FloatingBody>
        <FloatingFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>{t('取消', 'Cancel')}</Button>
          <Button variant="primary" onClick={() => { setOpen(false); toast.success(t('任务已创建', 'Task created')); }}>{t('创建', 'Create')}</Button>
        </FloatingFooter>
      </Drawer>
    </>
  );
}

const sides: Array<{ placement: DrawerPlacement; label: { zh: string; en: string } }> = [
  { placement: 'left', label: { zh: '左', en: 'left' } },
  { placement: 'right', label: { zh: '右', en: 'right' } },
  { placement: 'top', label: { zh: '上', en: 'top' } },
  { placement: 'bottom', label: { zh: '下', en: 'bottom' } },
];

function PlacementDemo() {
  const t = useT();
  const [placement, setPlacement] = useState<DrawerPlacement>('right');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Inline justify="center">
        {sides.map((s) => <Button key={s.placement} onClick={() => { setPlacement(s.placement); setOpen(true); }}>{t(`从${s.label.zh}边滑入`, `Slide in from the ${s.label.en}`)}</Button>)}
      </Inline>
      <Drawer open={open} onOpenChange={setOpen} placement={placement}>
        <FloatingHeader title={`placement="${placement}"`} description={t('卡片贴着这一侧，但四周始终留着一圈缝。', 'The card docks to this side, but always keeps a gap all around.')} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>{t('左右的抽屉在纵向撑满，上下的抽屉在横向撑满。按 Esc、点遮罩或右上角的按钮关闭。', 'Left and right drawers fill the height; top and bottom drawers fill the width. Close with Esc, by clicking the scrim, or with the button in the top-right corner.')}</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}

type Size = 'sm' | 'md' | 'lg';

function SizeDemo() {
  const t = useT();
  const [size, setSize] = useState<Size | number>('md');
  const [open, setOpen] = useState(false);
  const show = (s: Size | number) => { setSize(s); setOpen(true); };
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => show('sm')}>sm · 280</Button>
        <Button onClick={() => show('md')}>md · 360</Button>
        <Button onClick={() => show('lg')}>lg · 480</Button>
        <Button onClick={() => show(640)}>{t('自定义 640', 'Custom 640')}</Button>
      </Inline>
      <Drawer open={open} onOpenChange={setOpen} size={size}>
        <FloatingHeader title={`size=${typeof size === 'number' ? `{${size}}` : `"${size}"`}`} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>{t('宽度永远不会超过视口减去两侧的间隙，所以在手机上这几档看起来一样宽。', 'The width never exceeds the viewport minus the side gaps, so on phones these sizes all look the same.')}</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}

function FlushDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} leading={<Icon name="sliders" />}>{t('通知设置', 'Notification settings')}</Button>
      <Drawer open={open} onOpenChange={setOpen} placement="left" size="sm">
        <FloatingHeader title={t('通知设置', 'Notification settings')} icon={<Icon name="bell" />} closeLabel={t('关闭通知设置', 'Close notification settings')} />
        <FloatingBody>
          <Stack gap={4}>
            <Group compact>
              <Row label={t('评论', 'Comments')}><Switch defaultChecked aria-label={t('评论', 'Comments')} /></Row>
              <Row label={t('提到我', 'Mentions')}><Switch defaultChecked aria-label={t('提到我', 'Mentions')} /></Row>
              <Row label={t('每周摘要', 'Weekly digest')}><Switch aria-label={t('每周摘要', 'Weekly digest')} /></Row>
            </Group>
            <DescriptionList layout="stacked" items={[{ term: t('推送到', 'Send to'), description: t('xiaoman@example.com', 'alex@example.com') }, { term: t('状态', 'Status'), description: <Badge tone="success" dot>{t('已开启', 'On')}</Badge> }]} />
          </Stack>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setOpen(false)}>{t('完成', 'Done')}</Button>
        </FloatingFooter>
      </Drawer>
    </>
  );
}

function BehaviorDemo() {
  const t = useT();
  const [strict, setStrict] = useState(false);
  const [drag, setDrag] = useState(false);
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setStrict(true)}>{t('必须点按钮关闭', 'Close by button only')}</Button>
        <Button onClick={() => setDrag(true)}>{t('可以拖拽关闭', 'Drag to dismiss')}</Button>
      </Inline>
      <Drawer open={strict} onOpenChange={setStrict} dismissible={false}>
        <FloatingHeader title={t('还有未保存的修改', 'You have unsaved changes')} description={t('dismissible={false}：Esc 和点遮罩都不会关闭，头部也没有关闭按钮。', 'dismissible={false}: neither Esc nor clicking the scrim closes it, and the header has no close button.')} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>{t('离开之前请先决定怎么处理这些修改。', 'Decide what to do with these changes before you leave.')}</Text>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setStrict(false)}>{t('放弃修改', 'Discard')}</Button>
          <Button variant="primary" data-autofocus="" onClick={() => { setStrict(false); toast.success(t('已保存', 'Saved')); }}>{t('保存', 'Save')}</Button>
        </FloatingFooter>
      </Drawer>
      <Drawer open={drag} onOpenChange={setDrag} dragToDismiss>
        <FloatingHeader title={t('按住这里往右拖', 'Grab here and drag right')} description={t('dragToDismiss：头部是拖拽把手，拖过四成宽度或快速一甩就关闭，否则弹回。', 'dragToDismiss: the header is a drag handle. Drag past 40% of the width or flick it to close; otherwise it springs back.')} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>{t('内容区照常滚动和选择文字，不会触发拖拽。', 'The content area scrolls and selects text as usual without triggering a drag.')}</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}

/* ------------------------------------------------------------------ 示例源码 */

const STRUCTURE_CODE = {
  zh: `
function StructureDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>新建任务</Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <FloatingHeader title="新建任务" description="带 * 的是必填项。" />
        <FloatingBody>
          <Stack gap={4}>
            <Field label="标题" required><Input placeholder="一句话说清要做什么" /></Field>
            <Field label="说明"><Textarea rows={4} placeholder="背景、验收标准…" /></Field>
            <Field label="截止日期" hint="不填表示没有期限"><Input placeholder="2024-09-01" /></Field>
          </Stack>
        </FloatingBody>
        <FloatingFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="primary" onClick={() => { setOpen(false); toast.success('任务已创建'); }}>创建</Button>
        </FloatingFooter>
      </Drawer>
    </>
  );
}`,
  en: `
function StructureDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>New task</Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <FloatingHeader title="New task" description="Fields marked * are required." />
        <FloatingBody>
          <Stack gap={4}>
            <Field label="Title" required><Input placeholder="What needs doing, in one sentence" /></Field>
            <Field label="Description"><Textarea rows={4} placeholder="Background, acceptance criteria…" /></Field>
            <Field label="Due date" hint="Leave empty for no deadline"><Input placeholder="2024-09-01" /></Field>
          </Stack>
        </FloatingBody>
        <FloatingFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => { setOpen(false); toast.success('Task created'); }}>Create</Button>
        </FloatingFooter>
      </Drawer>
    </>
  );
}`,
};

const PLACEMENT_CODE = {
  zh: `
const sides: Array<{ placement: DrawerPlacement; label: string }> = [
  { placement: 'left', label: '左' },
  { placement: 'right', label: '右' },
  { placement: 'top', label: '上' },
  { placement: 'bottom', label: '下' },
];

function PlacementDemo() {
  const [placement, setPlacement] = useState<DrawerPlacement>('right');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Inline justify="center">
        {sides.map((s) => <Button key={s.placement} onClick={() => { setPlacement(s.placement); setOpen(true); }}>从{s.label}边滑入</Button>)}
      </Inline>
      <Drawer open={open} onOpenChange={setOpen} placement={placement}>
        <FloatingHeader title={\`placement="\${placement}"\`} description="卡片贴着这一侧，但四周始终留着一圈缝。" />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>左右的抽屉在纵向撑满，上下的抽屉在横向撑满。按 Esc、点遮罩或右上角的按钮关闭。</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}`,
  en: `
const sides: DrawerPlacement[] = ['left', 'right', 'top', 'bottom'];

function PlacementDemo() {
  const [placement, setPlacement] = useState<DrawerPlacement>('right');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Inline justify="center">
        {sides.map((side) => <Button key={side} onClick={() => { setPlacement(side); setOpen(true); }}>Slide in from the {side}</Button>)}
      </Inline>
      <Drawer open={open} onOpenChange={setOpen} placement={placement}>
        <FloatingHeader title={\`placement="\${placement}"\`} description="The card docks to this side, but always keeps a gap all around." />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>Left and right drawers fill the height; top and bottom drawers fill the width. Close with Esc, by clicking the scrim, or with the button in the top-right corner.</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}`,
};

const SIZE_CODE = {
  zh: `
type Size = 'sm' | 'md' | 'lg';

function SizeDemo() {
  const [size, setSize] = useState<Size | number>('md');
  const [open, setOpen] = useState(false);
  const show = (s: Size | number) => { setSize(s); setOpen(true); };
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => show('sm')}>sm · 280</Button>
        <Button onClick={() => show('md')}>md · 360</Button>
        <Button onClick={() => show('lg')}>lg · 480</Button>
        <Button onClick={() => show(640)}>自定义 640</Button>
      </Inline>
      <Drawer open={open} onOpenChange={setOpen} size={size}>
        <FloatingHeader title={\`size=\${typeof size === 'number' ? \`{\${size}}\` : \`"\${size}"\`}\`} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>宽度永远不会超过视口减去两侧的间隙，所以在手机上这几档看起来一样宽。</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}`,
  en: `
type Size = 'sm' | 'md' | 'lg';

function SizeDemo() {
  const [size, setSize] = useState<Size | number>('md');
  const [open, setOpen] = useState(false);
  const show = (s: Size | number) => { setSize(s); setOpen(true); };
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => show('sm')}>sm · 280</Button>
        <Button onClick={() => show('md')}>md · 360</Button>
        <Button onClick={() => show('lg')}>lg · 480</Button>
        <Button onClick={() => show(640)}>Custom 640</Button>
      </Inline>
      <Drawer open={open} onOpenChange={setOpen} size={size}>
        <FloatingHeader title={\`size=\${typeof size === 'number' ? \`{\${size}}\` : \`"\${size}"\`}\`} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>The width never exceeds the viewport minus the side gaps, so on phones these sizes all look the same.</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}`,
};

const FLUSH_CODE = {
  zh: `
function FlushDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} leading={<Icon name="sliders" />}>通知设置</Button>
      <Drawer open={open} onOpenChange={setOpen} placement="left" size="sm">
        <FloatingHeader title="通知设置" icon={<Icon name="bell" />} closeLabel="关闭通知设置" />
        <FloatingBody>
          <Stack gap={4}>
            <Group compact>
              <Row label="评论"><Switch defaultChecked aria-label="评论" /></Row>
              <Row label="提到我"><Switch defaultChecked aria-label="提到我" /></Row>
              <Row label="每周摘要"><Switch aria-label="每周摘要" /></Row>
            </Group>
            <DescriptionList layout="stacked" items={[{ term: '推送到', description: 'xiaoman@example.com' }, { term: '状态', description: <Badge tone="success" dot>已开启</Badge> }]} />
          </Stack>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setOpen(false)}>完成</Button>
        </FloatingFooter>
      </Drawer>
    </>
  );
}`,
  en: `
function FlushDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} leading={<Icon name="sliders" />}>Notification settings</Button>
      <Drawer open={open} onOpenChange={setOpen} placement="left" size="sm">
        <FloatingHeader title="Notification settings" icon={<Icon name="bell" />} closeLabel="Close notification settings" />
        <FloatingBody>
          <Stack gap={4}>
            <Group compact>
              <Row label="Comments"><Switch defaultChecked aria-label="Comments" /></Row>
              <Row label="Mentions"><Switch defaultChecked aria-label="Mentions" /></Row>
              <Row label="Weekly digest"><Switch aria-label="Weekly digest" /></Row>
            </Group>
            <DescriptionList layout="stacked" items={[{ term: 'Send to', description: 'alex@example.com' }, { term: 'Status', description: <Badge tone="success" dot>On</Badge> }]} />
          </Stack>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </FloatingFooter>
      </Drawer>
    </>
  );
}`,
};

const BEHAVIOR_CODE = {
  zh: `
function BehaviorDemo() {
  const [strict, setStrict] = useState(false);
  const [drag, setDrag] = useState(false);
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setStrict(true)}>必须点按钮关闭</Button>
        <Button onClick={() => setDrag(true)}>可以拖拽关闭</Button>
      </Inline>
      <Drawer open={strict} onOpenChange={setStrict} dismissible={false}>
        <FloatingHeader title="还有未保存的修改" description="dismissible={false}：Esc 和点遮罩都不会关闭，头部也没有关闭按钮。" />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>离开之前请先决定怎么处理这些修改。</Text>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setStrict(false)}>放弃修改</Button>
          <Button variant="primary" data-autofocus="" onClick={() => { setStrict(false); toast.success('已保存'); }}>保存</Button>
        </FloatingFooter>
      </Drawer>
      <Drawer open={drag} onOpenChange={setDrag} dragToDismiss>
        <FloatingHeader title="按住这里往右拖" description="dragToDismiss：头部是拖拽把手，拖过四成宽度或快速一甩就关闭，否则弹回。" />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>内容区照常滚动和选择文字，不会触发拖拽。</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}`,
  en: `
function BehaviorDemo() {
  const [strict, setStrict] = useState(false);
  const [drag, setDrag] = useState(false);
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setStrict(true)}>Close by button only</Button>
        <Button onClick={() => setDrag(true)}>Drag to dismiss</Button>
      </Inline>
      <Drawer open={strict} onOpenChange={setStrict} dismissible={false}>
        <FloatingHeader title="You have unsaved changes" description="dismissible={false}: neither Esc nor clicking the scrim closes it, and the header has no close button." />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>Decide what to do with these changes before you leave.</Text>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button onClick={() => setStrict(false)}>Discard</Button>
          <Button variant="primary" data-autofocus="" onClick={() => { setStrict(false); toast.success('Saved'); }}>Save</Button>
        </FloatingFooter>
      </Drawer>
      <Drawer open={drag} onOpenChange={setDrag} dragToDismiss>
        <FloatingHeader title="Grab here and drag right" description="dragToDismiss: the header is a drag handle. Drag past 40% of the width or flick it to close; otherwise it springs back." />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>The content area scrolls and selects text as usual without triggering a drag.</Text>
        </FloatingBody>
      </Drawer>
    </>
  );
}`,
};

export default function DrawerPage() {
  const t = useT();
  const parts = floatingPartsRows(t);
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '从屏幕一侧滑入的模态面板，用来放比对话框更长的内容：详情、多字段表单、窄屏上的导航。它盖住页面的一部分，人还看得见原来的上下文。',
        'A modal panel that slides in from one side of the screen, for content longer than a dialog can hold: details, multi-field forms, navigation on narrow screens. It covers only part of the page, so the original context stays in view.',
      )}
    >
      <FloatingFamily current="Drawer">
        <Demo
          title={t('结构件', 'Building blocks')}
          description={t(
            '抽屉本身只是一张贴边的卡片，里面用 FloatingHeader（标题、说明、关闭按钮）、FloatingBody（可滚动的内容区）、FloatingFooter（一排按钮）来搭。头尾固定，内容超出时只有中间滚动。',
            'A drawer is just a card docked to an edge, built from FloatingHeader (title, description, close button), FloatingBody (the scrollable content area) and FloatingFooter (a row of buttons). Header and footer stay put; only the middle scrolls when the content overflows.',
          )}
          code={t(STRUCTURE_CODE.zh, STRUCTURE_CODE.en)}
        >
          <StructureDemo />
        </Demo>
      </FloatingFamily>

      <DocSection title={t('四个方向', 'Four placements')} description={t('placement 决定从哪一侧滑入，默认 right。进退场和所有悬浮卡片共用：303ms 用 spring-soft 落位（不冲出边距），160ms ease-in 退场。', 'placement sets which side it slides in from; the default is right. Enter and exit motion is shared by all floating cards: it settles in 303ms on spring-soft (without overshooting the gap) and exits in 160ms ease-in.')}>
        <Demo code={t(PLACEMENT_CODE.zh, PLACEMENT_CODE.en)}>
          <PlacementDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')} description={t('size 是主轴尺寸。左右抽屉是宽度：sm 280、md 360（默认）、lg 480；上下抽屉是高度：sm 240、md 360、lg 520。也可以给数字（px）或 CSS 长度。', 'size is the main-axis size. For left and right drawers it’s the width: sm 280, md 360 (default), lg 480; for top and bottom drawers it’s the height: sm 240, md 360, lg 520. A number (px) or CSS length also works.')}>
        <Demo code={t(SIZE_CODE.zh, SIZE_CODE.en)}>
          <SizeDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('头部图标与撑满的按钮', 'Header icon and stretched buttons')} description={t('FloatingHeader 的 icon 在标题左边放一个色块图标；FloatingFooter 的 align 控制按钮的排法（end、start、between、stretch）。', 'FloatingHeader’s icon puts a tinted icon tile to the left of the title; FloatingFooter’s align controls how the buttons are laid out (end, start, between, stretch).')}>
        <Demo code={t(FLUSH_CODE.zh, FLUSH_CODE.en)}>
          <FlushDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('关闭方式', 'Ways to close')} description={t('默认 Esc、点遮罩、头部的关闭按钮都能关。dismissible={false} 时前两种失效，头部的关闭按钮也随之消失，只能走你提供的按钮。dragToDismiss 让头部变成拖拽把手，朝停靠的那一侧拖出去关闭。', 'By default, Esc, a scrim click and the header’s close button all close it. With dismissible={false}, the first two stop working and the header’s close button goes away too, leaving only the buttons you provide. dragToDismiss turns the header into a drag handle: drag it out toward the docked side to close.')}>
        <Demo code={t(BEHAVIOR_CODE.zh, BEHAVIOR_CODE.en)}>
          <BehaviorDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Drawer" rows={[
          { name: 'placement', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: t('从哪一侧滑入。', 'Which side it slides in from.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number | string", default: "'md'", description: t('主轴尺寸。左右是宽度 280 / 360 / 480；上下是高度 240 / 360 / 520。', 'Main-axis size. Width for left/right: 280 / 360 / 480; height for top/bottom: 240 / 360 / 520.') },
          { name: 'modal', type: 'boolean', default: 'true', description: t('模态：带遮罩、锁滚动、圈住焦点。需要非模态时优先用 Panel。', 'Modal: scrim, scroll lock and focus trap. For non-modal, prefer Panel.') },
          { name: 'stretch', type: 'boolean', default: 'true', description: t('是否在另一个方向上撑满；false 则按内容大小并居中。', 'Whether to fill the cross axis; false sizes it to the content and centers it.') },
          { name: 'dragToDismiss', type: 'boolean', default: 'false', description: t('按住头部（或抓手）朝停靠的那一侧拖拽关闭。需要 dismissible。', 'Drag the header (or grabber) toward the docked side to close. Requires dismissible.') },
          { name: 'role', type: "'dialog' | 'alertdialog' | 'complementary' | 'region'", default: "'dialog'", description: t('语义角色。', 'Semantic role.') },
          ...floatingCommonRows(t),
        ]} />
        <PropsTable title="FloatingHeader" rows={parts.header} />
        <PropsTable title="FloatingBody / FloatingFooter" rows={[...parts.body, ...parts.footer]} />
        <A11yNotes items={t([
          <>模态抽屉是 <Code>role="dialog"</Code> 加 <Code>aria-modal="true"</Code>，名字和描述自动取自 FloatingHeader 的标题和说明。不用 FloatingHeader 时请自己给 <Code>aria-label</Code>。</>,
          <>打开时焦点移进抽屉（<Code>initialFocus</Code> → <Code>data-autofocus</Code> → 卡片本身），<Keys k="Tab" /> 被圈在里面循环；关闭后焦点回到打开它的元素。</>,
          <><Keys k="Esc" /> 或点遮罩关闭；头部的关闭按钮是带名字的图标按钮（默认“关闭”，可用 closeLabel 改）。</>,
          '内容区是原生滚动容器，键盘可以用方向键、空格、PageUp / PageDown 滚动。',
          '拖拽关闭只是指针上的捷径，键盘和读屏用户始终有 Esc 和关闭按钮；不要做成唯一的关闭方式。',
          '打开期间页面背景锁定滚动。减弱动效时滑入滑出直接完成。',
        ], [
          <>A modal drawer is <Code>role="dialog"</Code> with <Code>aria-modal="true"</Code>; its name and description come from the FloatingHeader title and description. Without FloatingHeader, provide <Code>aria-label</Code> yourself.</>,
          <>On open, focus moves into the drawer (<Code>initialFocus</Code> → <Code>data-autofocus</Code> → the card itself) and <Keys k="Tab" /> cycles within it; on close, focus returns to the element that opened it.</>,
          <><Keys k="Esc" /> or a scrim click closes it; the header’s close button is a labeled icon button (“Close” by default, following the OinkProvider locale; change it with closeLabel).</>,
          'The content area is a native scroll container, so the keyboard can scroll it with the arrow keys, Space and PageUp / PageDown.',
          'Drag-to-dismiss is only a pointer shortcut; keyboard and screen reader users always have Esc and the close button. Never make it the only way to close.',
          'While open, the page behind is scroll-locked. With reduced motion, sliding in and out completes instantly.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
