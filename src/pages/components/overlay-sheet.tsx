import { useState } from 'react';
import { Button, Code, FloatingBody, FloatingFooter, FloatingHeader, Group, Icon, Inline, List, ListItem, Row, Sheet, Text, toast } from 'oink-ui';
import type { SheetSize } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Keys, Specs } from './display-_kit';
import { FloatingFamily, floatingCommonRows, floatingPartsRows } from './overlay-_shared';

export const meta: PageMeta = { path: '/components/sheet', title: 'Sheet 底部弹层', group: '浮层', order: 3, subtitle: 'Sheet', en: { title: 'Sheet' } };

function StructureDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>{t('分享', 'Share')}</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <FloatingHeader title={t('分享到', 'Share to')} description={t('拿到链接的人都可以查看。', 'Anyone with the link can view.')} />
        <FloatingBody>
          <Group compact>
            <Row label={t('复制链接', 'Copy link')} leading={<Icon name="copy" />} interactive onClick={() => { setOpen(false); toast.success(t('链接已复制', 'Link copied')); }} />
            <Row label={t('发邮件', 'Email')} leading={<Icon name="mail" />} interactive onClick={() => { setOpen(false); toast(t('已打开邮件', 'Opened in Mail')); }} />
            <Row label={t('下载为 PDF', 'Download as PDF')} leading={<Icon name="download" />} interactive onClick={() => { setOpen(false); toast(t('开始下载', 'Download started')); }} />
          </Group>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button size="lg" onClick={() => setOpen(false)}>{t('取消', 'Cancel')}</Button>
        </FloatingFooter>
      </Sheet>
    </>
  );
}

const sizes: Array<{ size: SheetSize; label: { zh: string; en: string } }> = [
  { size: 'auto', label: { zh: 'auto · 随内容', en: 'auto · fits content' } },
  { size: 'sm', label: { zh: 'sm · 40%', en: 'sm · 40%' } },
  { size: 'md', label: { zh: 'md · 60%', en: 'md · 60%' } },
  { size: 'lg', label: { zh: 'lg · 85%', en: 'lg · 85%' } },
  { size: 'full', label: { zh: 'full · 撑满', en: 'full · 100%' } },
];

function SizeDemo() {
  const t = useT();
  const [size, setSize] = useState<SheetSize>('auto');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Inline justify="center">
        {sizes.map((s) => <Button key={s.size} onClick={() => { setSize(s.size); setOpen(true); }}>{t(s.label.zh, s.label.en)}</Button>)}
      </Inline>
      <Sheet open={open} onOpenChange={setOpen} size={size}>
        <FloatingHeader title={`size="${size}"`} description={t('高度按视口的百分比算，并减去上下的间隙。', 'Height is a percentage of the viewport, minus the top and bottom gaps.')} />
        <FloatingBody>
          <List marker="number">
            {Array.from({ length: 16 }, (_, i) => <ListItem key={i}>{t(`第 ${i + 1} 行内容：超出时只有这一块滚动，头部留在原地。`, `Row ${i + 1}: when content overflows, only this area scrolls and the header stays put.`)}</ListItem>)}
          </List>
        </FloatingBody>
      </Sheet>
    </>
  );
}

function DragDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setOpen(true)}>{t('可以拖拽关闭', 'Drag to dismiss')}</Button>
        <Button onClick={() => setLocked(true)}>{t('没有抓手，不能拖', 'No grabber, no dragging')}</Button>
      </Inline>
      <Sheet open={open} onOpenChange={setOpen}>
        <FloatingHeader title={t('按住抓手或标题往下拖', 'Drag the grabber or title down')} closable={false} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>{t('拖过四成高度（最多 160px）或快速向下一甩就关闭，否则弹回原位。拖的时候遮罩跟着变淡；往上只能拖出一点点阻尼。', 'Drag past 40% of the height (160px at most) or flick down to close; otherwise it springs back. The scrim fades as you drag; dragging up only gives a little resistance.')}</Text>
        </FloatingBody>
      </Sheet>
      <Sheet open={locked} onOpenChange={setLocked} grip={false} dragToDismiss={false}>
        <FloatingHeader title="grip={false} dragToDismiss={false}" description={t('仍然可以按 Esc、点遮罩或点关闭按钮。', 'Esc, a scrim click or the close button still work.')} />
      </Sheet>
    </>
  );
}

function StretchDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('横向撑满', 'Full width')}</Button>
      <Sheet open={open} onOpenChange={setOpen} stretch>
        <FloatingHeader title="stretch" description={t('宽屏上默认最宽 560 并居中；加了 stretch 就横向撑满（仍然留着两侧的间隙）。', 'On wide screens it’s 560 wide at most and centered by default; with stretch it fills the width (still keeping the side gaps).')} />
        <FloatingFooter>
          <Button variant="primary" onClick={() => setOpen(false)}>{t('知道了', 'Got it')}</Button>
        </FloatingFooter>
      </Sheet>
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
      <Button variant="primary" onClick={() => setOpen(true)}>分享</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <FloatingHeader title="分享到" description="拿到链接的人都可以查看。" />
        <FloatingBody>
          <Group compact>
            <Row label="复制链接" leading={<Icon name="copy" />} interactive onClick={() => { setOpen(false); toast.success('链接已复制'); }} />
            <Row label="发邮件" leading={<Icon name="mail" />} interactive onClick={() => { setOpen(false); toast('已打开邮件'); }} />
            <Row label="下载为 PDF" leading={<Icon name="download" />} interactive onClick={() => { setOpen(false); toast('开始下载'); }} />
          </Group>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button size="lg" onClick={() => setOpen(false)}>取消</Button>
        </FloatingFooter>
      </Sheet>
    </>
  );
}`,
  en: `
function StructureDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Share</Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <FloatingHeader title="Share to" description="Anyone with the link can view." />
        <FloatingBody>
          <Group compact>
            <Row label="Copy link" leading={<Icon name="copy" />} interactive onClick={() => { setOpen(false); toast.success('Link copied'); }} />
            <Row label="Email" leading={<Icon name="mail" />} interactive onClick={() => { setOpen(false); toast('Opened in Mail'); }} />
            <Row label="Download as PDF" leading={<Icon name="download" />} interactive onClick={() => { setOpen(false); toast('Download started'); }} />
          </Group>
        </FloatingBody>
        <FloatingFooter align="stretch">
          <Button size="lg" onClick={() => setOpen(false)}>Cancel</Button>
        </FloatingFooter>
      </Sheet>
    </>
  );
}`,
};

const DRAG_CODE = {
  zh: `
function DragDemo() {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setOpen(true)}>可以拖拽关闭</Button>
        <Button onClick={() => setLocked(true)}>没有抓手，不能拖</Button>
      </Inline>
      <Sheet open={open} onOpenChange={setOpen}>
        <FloatingHeader title="按住抓手或标题往下拖" closable={false} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>拖过四成高度（最多 160px）或快速向下一甩就关闭，否则弹回原位。拖的时候遮罩跟着变淡；往上只能拖出一点点阻尼。</Text>
        </FloatingBody>
      </Sheet>
      <Sheet open={locked} onOpenChange={setLocked} grip={false} dragToDismiss={false}>
        <FloatingHeader title="grip={false} dragToDismiss={false}" description="仍然可以按 Esc、点遮罩或点关闭按钮。" />
      </Sheet>
    </>
  );
}`,
  en: `
function DragDemo() {
  const [open, setOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setOpen(true)}>Drag to dismiss</Button>
        <Button onClick={() => setLocked(true)}>No grabber, no dragging</Button>
      </Inline>
      <Sheet open={open} onOpenChange={setOpen}>
        <FloatingHeader title="Drag the grabber or title down" closable={false} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>Drag past 40% of the height (160px at most) or flick down to close; otherwise it springs back. The scrim fades as you drag; dragging up only gives a little resistance.</Text>
        </FloatingBody>
      </Sheet>
      <Sheet open={locked} onOpenChange={setLocked} grip={false} dragToDismiss={false}>
        <FloatingHeader title="grip={false} dragToDismiss={false}" description="Esc, a scrim click or the close button still work." />
      </Sheet>
    </>
  );
}`,
};

const SIZE_CODE = {
  zh: `
const sizes: Array<{ size: SheetSize; label: string }> = [
  { size: 'auto', label: 'auto · 随内容' },
  { size: 'sm', label: 'sm · 40%' },
  { size: 'md', label: 'md · 60%' },
  { size: 'lg', label: 'lg · 85%' },
  { size: 'full', label: 'full · 撑满' },
];

function SizeDemo() {
  const [size, setSize] = useState<SheetSize>('auto');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Inline justify="center">
        {sizes.map((s) => <Button key={s.size} onClick={() => { setSize(s.size); setOpen(true); }}>{s.label}</Button>)}
      </Inline>
      <Sheet open={open} onOpenChange={setOpen} size={size}>
        <FloatingHeader title={\`size="\${size}"\`} description="高度按视口的百分比算，并减去上下的间隙。" />
        <FloatingBody>
          <List marker="number">
            {Array.from({ length: 16 }, (_, i) => <ListItem key={i}>第 {i + 1} 行内容：超出时只有这一块滚动，头部留在原地。</ListItem>)}
          </List>
        </FloatingBody>
      </Sheet>
    </>
  );
}`,
  en: `
const sizes: Array<{ size: SheetSize; label: string }> = [
  { size: 'auto', label: 'auto · fits content' },
  { size: 'sm', label: 'sm · 40%' },
  { size: 'md', label: 'md · 60%' },
  { size: 'lg', label: 'lg · 85%' },
  { size: 'full', label: 'full · 100%' },
];

function SizeDemo() {
  const [size, setSize] = useState<SheetSize>('auto');
  const [open, setOpen] = useState(false);
  return (
    <>
      <Inline justify="center">
        {sizes.map((s) => <Button key={s.size} onClick={() => { setSize(s.size); setOpen(true); }}>{s.label}</Button>)}
      </Inline>
      <Sheet open={open} onOpenChange={setOpen} size={size}>
        <FloatingHeader title={\`size="\${size}"\`} description="Height is a percentage of the viewport, minus the top and bottom gaps." />
        <FloatingBody>
          <List marker="number">
            {Array.from({ length: 16 }, (_, i) => <ListItem key={i}>Row {i + 1}: when content overflows, only this area scrolls and the header stays put.</ListItem>)}
          </List>
        </FloatingBody>
      </Sheet>
    </>
  );
}`,
};

const STRETCH_CODE = {
  zh: `
function StretchDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>横向撑满</Button>
      <Sheet open={open} onOpenChange={setOpen} stretch>
        <FloatingHeader title="stretch" description="宽屏上默认最宽 560 并居中；加了 stretch 就横向撑满（仍然留着两侧的间隙）。" />
        <FloatingFooter>
          <Button variant="primary" onClick={() => setOpen(false)}>知道了</Button>
        </FloatingFooter>
      </Sheet>
    </>
  );
}`,
  en: `
function StretchDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Full width</Button>
      <Sheet open={open} onOpenChange={setOpen} stretch>
        <FloatingHeader title="stretch" description="On wide screens it’s 560 wide at most and centered by default; with stretch it fills the width (still keeping the side gaps)." />
        <FloatingFooter>
          <Button variant="primary" onClick={() => setOpen(false)}>Got it</Button>
        </FloatingFooter>
      </Sheet>
    </>
  );
}`,
};

export default function SheetPage() {
  const t = useT();
  const parts = floatingPartsRows(t);
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '从屏幕底边升起的模态卡片，带抓手，可以向下拖拽关闭。在手机上代替对话框和抽屉：离拇指近，也符合人在触屏上的习惯。',
        'A modal card that rises from the bottom edge of the screen, with a grabber you can drag down to dismiss. On phones it replaces dialogs and drawers: it sits within thumb reach and matches how people expect touch screens to behave.',
      )}
    >
      <FloatingFamily current="Sheet">
        <Demo
          title={t('结构件', 'Building blocks')}
          description={t(
            'Sheet 在卡片顶上自动加了一条抓手（FloatingGrip），其余和抽屉一样用 FloatingHeader / FloatingBody / FloatingFooter 来搭。',
            'Sheet automatically adds a grabber (FloatingGrip) at the top of the card; otherwise it’s built just like a drawer, from FloatingHeader / FloatingBody / FloatingFooter.',
          )}
          code={t(STRUCTURE_CODE.zh, STRUCTURE_CODE.en)}
        >
          <StructureDemo />
        </Demo>
      </FloatingFamily>

      <DocSection title={t('抓手与拖拽关闭', 'Grabber and drag to dismiss')} description={t('抓手和头部都是拖拽把手：按住往下拖，松手时按距离和速度决定关闭还是回弹。把手里的按钮、链接照常响应点按；内容区照常滚动。grip={false} 去掉抓手，dragToDismiss={false} 关掉拖拽。', 'Both the grabber and the header are drag handles: press and drag down, and on release the distance and speed decide whether it closes or springs back. Buttons and links inside the handle still respond to taps, and the content area scrolls as usual. grip={false} removes the grabber; dragToDismiss={false} turns off dragging.')}>
        <Demo code={t(DRAG_CODE.zh, DRAG_CODE.en)}>
          <DragDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('高度', 'Height')} description={t('默认 auto，高度跟随内容。sm / md / lg / full 分别是视口高度的 40% / 60% / 85% / 100%（都减去间隙）；也可以给数字（px）或 CSS 长度。内容超出时 FloatingBody 内部滚动。', 'Defaults to auto, following the content. sm / md / lg / full are 40% / 60% / 85% / 100% of the viewport height (all minus the gaps); a number (px) or CSS length also works. When content overflows, FloatingBody scrolls internally.')}>
        <Demo code={t(SIZE_CODE.zh, SIZE_CODE.en)}>
          <SizeDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('宽屏上的宽度', 'Width on wide screens')} description={t('窄屏上弹层总是横向撑满。宽屏上默认最宽 560 并居中，避免变成一条很扁的横幅；需要通栏时加 stretch。', 'On narrow screens the sheet always fills the width. On wide screens it’s 560 wide at most and centered by default, so it doesn’t turn into a flat banner; add stretch when you need it full width.')}>
        <Demo code={t(STRETCH_CODE.zh, STRETCH_CODE.en)}>
          <StretchDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={t<Array<[string, string]>>([
          ['卡片', '圆角 32 · 内边距 24 · 到视口边缘 12（窄屏 8）'],
          ['抓手', '36 × 5 的横杠，拖动时伸到 44'],
          ['进场', '自底边升起 · spring-soft 曲线 303ms，和所有悬浮卡片一致'],
          ['拖拽关闭', '超过高度的 40%（最多 160px），或速度超过 0.5px/ms'],
          ['退场', '160ms ease-in'],
        ], [
          ['Card', 'Corner radius 32 · padding 24 · 12 from the viewport edges (8 on narrow screens)'],
          ['Grabber', '36 × 5 bar, stretching to 44 while dragging'],
          ['Enter', 'Rises from the bottom edge · spring-soft curve 303ms, same as all floating cards'],
          ['Drag to dismiss', 'Past 40% of the height (160px at most), or faster than 0.5px/ms'],
          ['Exit', '160ms ease-in'],
        ])} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Sheet" rows={[
          { name: 'size', type: "'auto' | 'sm' | 'md' | 'lg' | 'full' | number | string", default: "'auto'", description: t('高度：auto 跟随内容；40% / 60% / 85% / 撑满；或数字（px）、CSS 长度。', 'Height: auto follows the content; 40% / 60% / 85% / full; or a number (px) or CSS length.') },
          { name: 'grip', type: 'boolean', default: 'true', description: t('顶上的抓手。', 'The grabber at the top.') },
          { name: 'dragToDismiss', type: 'boolean', default: 'true', description: t('按住抓手或头部向下拖拽关闭。', 'Drag the grabber or header down to close.') },
          { name: 'stretch', type: 'boolean', default: 'false', description: t('宽屏上是否横向撑满；默认最宽 560，居中。', 'Whether to fill the width on wide screens; by default it’s 560 wide at most and centered.') },
          { name: 'modal', type: 'boolean', default: 'true', description: t('模态：带遮罩、锁滚动、圈住焦点。', 'Modal: scrim, scroll lock and focus trap.') },
          { name: 'role', type: "'dialog' | 'alertdialog' | 'complementary' | 'region'", default: "'dialog'", description: t('语义角色。', 'Semantic role.') },
          ...floatingCommonRows(t),
        ]} />
        <PropsTable title="FloatingHeader" rows={parts.header} />
        <PropsTable title="FloatingBody / FloatingFooter" rows={[...parts.body, ...parts.footer]} />
        <A11yNotes items={t([
          <><Code>role="dialog"</Code> 加 <Code>aria-modal="true"</Code>，名字和描述取自 FloatingHeader。焦点移入并被圈住，关闭后还给触发元素。</>,
          <>抓手是纯装饰（<Code>aria-hidden</Code>），拖拽只是指针上的捷径。键盘和读屏用户用 <Keys k="Esc" /> 或关闭按钮；所以去掉头部的关闭按钮时，要确保卡片里还有别的按钮能关。</>,
          '把手区域设了 touch-action: none，手指在上面拖动不会带着页面滚；内容区的原生滚动不受影响。',
          '打开期间页面背景锁定滚动。减弱动效时升起和落下直接完成，拖拽仍然可用。',
        ], [
          <><Code>role="dialog"</Code> with <Code>aria-modal="true"</Code>; the name and description come from FloatingHeader. Focus moves in and is trapped, then returns to the trigger on close.</>,
          <>The grabber is purely decorative (<Code>aria-hidden</Code>), and dragging is only a pointer shortcut. Keyboard and screen reader users use <Keys k="Esc" /> or the close button — so if you remove the header’s close button, make sure another button in the card can close it.</>,
          'The handle area sets touch-action: none, so dragging a finger on it won’t scroll the page; native scrolling in the content area is unaffected.',
          'While open, the page behind is scroll-locked. With reduced motion, rising and falling complete instantly; dragging still works.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
