import { useRef } from 'react';
import { Button, Code, CodeBlock, Grid, Icon, Inline, Tag, Text, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Keys, Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/toast', title: 'Toast 轻提示', group: '反馈', order: 60, subtitle: 'toast() · Toaster', en: { title: 'Toast', subtitle: 'toast() · Toaster' } };

function UpdateDemo() {
  const t = useT();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const run = () => {
    clearTimeout(timer.current);
    toast({ id: 'export', title: t('正在导出…', 'Exporting…'), description: t('大约需要几秒钟。', 'This takes a few seconds.'), duration: 0, closable: false });
    timer.current = setTimeout(() => {
      toast.success({ id: 'export', title: t('导出完成', 'Export complete'), description: t('报表.xlsx 已保存到下载目录。', 'report.xlsx was saved to your Downloads folder.'), duration: 4200 });
    }, 2000);
  };
  return <Button onClick={run}>{t('导出报表', 'Export report')}</Button>;
}

function DismissDemo() {
  const t = useT();
  const last = useRef<string>();
  return (
    <Inline justify="center">
      <Button onClick={() => { last.current = toast({ title: t('这条不会自己消失', 'This one won’t go away on its own'), duration: 0 }); }}>{t('发一条常驻的', 'Show a persistent one')}</Button>
      <Button onClick={() => toast.dismiss(last.current)}>{t('关掉最近那条', 'Dismiss the latest')}</Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>{t('全部关掉', 'Dismiss all')}</Button>
    </Inline>
  );
}

const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];

/* ------------------------------------------------------------------ 示例源码 */

const BASIC_CODE = {
  zh: `
<Button onClick={() => toast('已保存')}>只有标题</Button>
<Button onClick={() => toast({ title: '已保存草稿', description: '下次打开时会自动恢复到这里。' })}>标题加说明</Button>`,
  en: `
<Button onClick={() => toast('Saved')}>Title only</Button>
<Button onClick={() => toast({ title: 'Draft saved', description: 'You’ll pick up right here next time you open it.' })}>Title and description</Button>`,
};

const TONE_CODE = {
  zh: `
<Button onClick={() => toast.success('已发布')}>success</Button>
<Button onClick={() => toast.info({ title: '有新版本', description: '刷新页面即可更新。' })}>info</Button>
<Button onClick={() => toast.warning({ title: '网络不稳定', description: '修改会在恢复后同步。' })}>warning</Button>
<Button onClick={() => toast.danger({ title: '发送失败', description: '请检查网络后重试。' })}>danger</Button>
<Button onClick={() => toast.error('toast.error 等同于 toast.danger')}>error</Button>
<Button onClick={() => toast({ title: '在对象里写 tone', tone: 'success' })}>tone 字段</Button>`,
  en: `
<Button onClick={() => toast.success('Published')}>success</Button>
<Button onClick={() => toast.info({ title: 'New version available', description: 'Refresh the page to update.' })}>info</Button>
<Button onClick={() => toast.warning({ title: 'Unstable connection', description: 'Changes will sync once you’re back online.' })}>warning</Button>
<Button onClick={() => toast.danger({ title: 'Couldn’t send', description: 'Check your connection and try again.' })}>danger</Button>
<Button onClick={() => toast.error('toast.error is the same as toast.danger')}>error</Button>
<Button onClick={() => toast({ title: 'tone set in the options object', tone: 'success' })}>tone field</Button>`,
};

const ACTION_CODE = {
  zh: `
<Button
  onClick={() => toast({
    title: '已删除 3 个文件',
    duration: 8000,
    action: { label: '撤销', onClick: () => toast.success('已恢复') },
  })}
>
  删除并可撤销
</Button>
<Button
  onClick={() => toast.danger({
    title: '上传失败',
    description: '设计稿.fig',
    duration: 0,
    action: { label: '重试', dismiss: false, onClick: () => toast('正在重试…') },
  })}
>
  点操作后不关闭
</Button>`,
  en: `
<Button
  onClick={() => toast({
    title: '3 files deleted',
    duration: 8000,
    action: { label: 'Undo', onClick: () => toast.success('Restored') },
  })}
>
  Delete with undo
</Button>
<Button
  onClick={() => toast.danger({
    title: 'Upload failed',
    description: 'Mockups.fig',
    duration: 0,
    action: { label: 'Retry', dismiss: false, onClick: () => toast('Retrying…') },
  })}
>
  Stays open after the action
</Button>`,
};

const DURATION_CODE = {
  zh: `
<Button onClick={() => toast({ title: '1.5 秒后消失', duration: 1500 })}>短一点</Button>
<Button onClick={() => toast({ title: '10 秒后消失', description: '把指针移上来可以暂停计时。', duration: 10000, closable: true })}>长一点，带关闭按钮</Button>
<Button onClick={() => toast.warning({ title: '离线模式', description: '重新联网之前，这条通知会一直留着。', duration: 0 })}>常驻</Button>`,
  en: `
<Button onClick={() => toast({ title: 'Gone in 1.5 seconds', duration: 1500 })}>Shorter</Button>
<Button onClick={() => toast({ title: 'Gone in 10 seconds', description: 'Hover over it to pause the timer.', duration: 10000, closable: true })}>Longer, with close button</Button>
<Button onClick={() => toast.warning({ title: 'Offline mode', description: 'This stays until you’re back online.', duration: 0 })}>Persistent</Button>`,
};

const UPDATE_CODE = {
  zh: `
function UpdateDemo() {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const run = () => {
    clearTimeout(timer.current);
    toast({ id: 'export', title: '正在导出…', description: '大约需要几秒钟。', duration: 0, closable: false });
    timer.current = setTimeout(() => {
      toast.success({ id: 'export', title: '导出完成', description: '报表.xlsx 已保存到下载目录。', duration: 4200 });
    }, 2000);
  };
  return <Button onClick={run}>导出报表</Button>;
}`,
  en: `
function UpdateDemo() {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const run = () => {
    clearTimeout(timer.current);
    toast({ id: 'export', title: 'Exporting…', description: 'This takes a few seconds.', duration: 0, closable: false });
    timer.current = setTimeout(() => {
      toast.success({ id: 'export', title: 'Export complete', description: 'report.xlsx was saved to your Downloads folder.', duration: 4200 });
    }, 2000);
  };
  return <Button onClick={run}>Export report</Button>;
}`,
};

const DISMISS_CODE = {
  zh: `
function DismissDemo() {
  const last = useRef<string>();
  return (
    <Inline justify="center">
      <Button onClick={() => { last.current = toast({ title: '这条不会自己消失', duration: 0 }); }}>发一条常驻的</Button>
      <Button onClick={() => toast.dismiss(last.current)}>关掉最近那条</Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>全部关掉</Button>
    </Inline>
  );
}`,
  en: `
function DismissDemo() {
  const last = useRef<string>();
  return (
    <Inline justify="center">
      <Button onClick={() => { last.current = toast({ title: 'This one won’t go away on its own', duration: 0 }); }}>Show a persistent one</Button>
      <Button onClick={() => toast.dismiss(last.current)}>Dismiss the latest</Button>
      <Button variant="ghost" onClick={() => toast.dismiss()}>Dismiss all</Button>
    </Inline>
  );
}`,
};

const ICON_CODE = {
  zh: `
<Button onClick={() => toast({ title: '3 条新消息', icon: <Icon name="mail" /> })}>自定义图标</Button>
<Button onClick={() => toast({ title: '没有图标的通知', icon: false })}>不要图标</Button>
<Button onClick={() => toast({ title: '消失后会再弹一条', duration: 1500, onDismiss: () => toast('上一条已消失（onDismiss）') })}>onDismiss</Button>`,
  en: `
<Button onClick={() => toast({ title: '3 new messages', icon: <Icon name="mail" /> })}>Custom icon</Button>
<Button onClick={() => toast({ title: 'A toast without an icon', icon: false })}>No icon</Button>
<Button onClick={() => toast({ title: 'Another one pops up when this goes', duration: 1500, onDismiss: () => toast('The previous one is gone (onDismiss)') })}>onDismiss</Button>`,
};

const TOASTER_CODE = {
  zh: `import { Toaster } from 'oink-ui';

export function App() {
  return (
    <>
      <Routes />
      {/* 应用根部挂一次 */}
      <Toaster position="bottom-center" max={3} duration={5000} offset={24} />
    </>
  );
}`,
  en: `import { Toaster } from 'oink-ui';

export function App() {
  return (
    <>
      <Routes />
      {/* mount once at the app root */}
      <Toaster position="bottom-center" max={3} duration={5000} offset={24} />
    </>
  );
}`,
};

export default function ToastPage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '操作之后一闪而过的反馈：“已保存”“已复制”“发送失败”。它不打断人，几秒后自己消失，所以只放看不看都行的信息；必须被看到的内容用 Alert 或 Dialog。',
        'Brief feedback that flashes by after an action: “Saved”, “Copied”, “Couldn’t send”. It doesn’t interrupt and disappears after a few seconds, so only use it for information that’s fine to miss; anything that must be seen belongs in an Alert or Dialog.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t('在任何地方（组件里、事件回调里、请求的 then 里）直接调用 toast()，不需要 hook。页面根部要挂一个 <Toaster />（本站已挂）。传字符串只有标题；传对象可以带说明。返回值是这条通知的 id。', 'Call toast() from anywhere — in a component, an event handler, a request’s then — no hook needed. Mount one <Toaster /> at the page root (this site already does). A string gives just a title; an object can add a description. It returns the toast’s id.')}>
        <Demo code={t(BASIC_CODE.zh, BASIC_CODE.en)}>
          <Button onClick={() => toast(t('已保存', 'Saved'))}>{t('只有标题', 'Title only')}</Button>
          <Button onClick={() => toast({ title: t('已保存草稿', 'Draft saved'), description: t('下次打开时会自动恢复到这里。', 'You’ll pick up right here next time you open it.') })}>{t('标题加说明', 'Title and description')}</Button>
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')} description={t('toast.success / warning / danger / info 是带状态色的简写（toast.error 是 danger 的别名），也可以在对象里写 tone。每种状态有自己的图标：圆底先弹出来，符号再描线画出。', 'toast.success / warning / danger / info are shorthands with a status color (toast.error is an alias for danger); you can also set tone in the options object. Each status has its own icon: the round base pops in first, then the symbol draws itself in.')}>
        <Demo code={t(TONE_CODE.zh, TONE_CODE.en)}>
          <Button onClick={() => toast.success(t('已发布', 'Published'))}>success</Button>
          <Button onClick={() => toast.info({ title: t('有新版本', 'New version available'), description: t('刷新页面即可更新。', 'Refresh the page to update.') })}>info</Button>
          <Button onClick={() => toast.warning({ title: t('网络不稳定', 'Unstable connection'), description: t('修改会在恢复后同步。', 'Changes will sync once you’re back online.') })}>warning</Button>
          <Button onClick={() => toast.danger({ title: t('发送失败', 'Couldn’t send'), description: t('请检查网络后重试。', 'Check your connection and try again.') })}>danger</Button>
          <Button onClick={() => toast.error(t('toast.error 等同于 toast.danger', 'toast.error is the same as toast.danger'))}>error</Button>
          <Button onClick={() => toast({ title: t('在对象里写 tone', 'tone set in the options object'), tone: 'success' })}>{t('tone 字段', 'tone field')}</Button>
        </Demo>
      </DocSection>

      <DocSection title={t('带操作', 'With an action')} description={t('action 在通知右侧放一个按钮，最常见的是“撤销”。点了之后默认关掉这条通知；action.dismiss 设为 false 则保留。带操作的通知建议把时间放长一些，给人够得着的机会。', 'action puts a button on the right of the toast — most often “Undo”. Clicking it closes the toast by default; set action.dismiss to false to keep it. Give toasts with actions a longer duration so people have a real chance to reach them.')}>
        <Demo code={t(ACTION_CODE.zh, ACTION_CODE.en)}>
          <Button
            onClick={() => toast({
              title: t('已删除 3 个文件', '3 files deleted'),
              duration: 8000,
              action: { label: t('撤销', 'Undo'), onClick: () => toast.success(t('已恢复', 'Restored')) },
            })}
          >
            {t('删除并可撤销', 'Delete with undo')}
          </Button>
          <Button
            onClick={() => toast.danger({
              title: t('上传失败', 'Upload failed'),
              description: t('设计稿.fig', 'Mockups.fig'),
              duration: 0,
              action: { label: t('重试', 'Retry'), dismiss: false, onClick: () => toast(t('正在重试…', 'Retrying…')) },
            })}
          >
            {t('点操作后不关闭', 'Stays open after the action')}
          </Button>
        </Demo>
      </DocSection>

      <DocSection title={t('时长与常驻', 'Duration and persistence')} description={t('默认 4.2 秒后消失；指针停在通知上、或键盘焦点在通知里时暂停计时。duration 单独指定时长（毫秒），0 表示一直留着——常驻的通知自动带关闭按钮。也可以用 closable 给会自动消失的通知加上关闭按钮。点通知本身的任意位置也会关掉它。', 'Toasts disappear after 4.2 seconds by default; the timer pauses while the pointer rests on a toast or keyboard focus is inside it. duration sets a specific time (in ms), and 0 keeps it around — persistent toasts get a close button automatically. closable adds a close button to toasts that do auto-dismiss. Clicking anywhere on the toast also closes it.')}>
        <Demo code={t(DURATION_CODE.zh, DURATION_CODE.en)}>
          <Button onClick={() => toast({ title: t('1.5 秒后消失', 'Gone in 1.5 seconds'), duration: 1500 })}>{t('短一点', 'Shorter')}</Button>
          <Button onClick={() => toast({ title: t('10 秒后消失', 'Gone in 10 seconds'), description: t('把指针移上来可以暂停计时。', 'Hover over it to pause the timer.'), duration: 10000, closable: true })}>{t('长一点，带关闭按钮', 'Longer, with close button')}</Button>
          <Button onClick={() => toast.warning({ title: t('离线模式', 'Offline mode'), description: t('重新联网之前，这条通知会一直留着。', 'This stays until you’re back online.'), duration: 0 })}>{t('常驻', 'Persistent')}</Button>
        </Demo>
      </DocSection>

      <DocSection title={t('原地更新', 'Updating in place')} description={t('给通知一个固定的 id：同一个 id 再次调用会原地更新内容并重新计时，而不是新增一条。适合“进行中 → 完成 / 失败”。', 'Give a toast a fixed id: calling again with the same id updates its content in place and restarts the timer instead of adding a new one. Ideal for “in progress → done / failed”.')}>
        <Demo code={t(UPDATE_CODE.zh, UPDATE_CODE.en)}>
          <UpdateDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('手动关闭', 'Dismissing manually')} description={t('toast.dismiss(id) 关掉某一条，不传 id 则全部关掉。onDismiss 在通知消失之后回调。', 'toast.dismiss(id) closes one toast; without an id, it closes them all. onDismiss is called after a toast disappears.')}>
        <Demo code={t(DISMISS_CODE.zh, DISMISS_CODE.en)}>
          <DismissDemo />
        </Demo>
        <Demo title={t('自定义图标、不要图标、消失后的回调', 'Custom icon, no icon, and a callback after dismissal')} code={t(ICON_CODE.zh, ICON_CODE.en)}>
          <Button onClick={() => toast({ title: t('3 条新消息', '3 new messages'), icon: <Icon name="mail" /> })}>{t('自定义图标', 'Custom icon')}</Button>
          <Button onClick={() => toast({ title: t('没有图标的通知', 'A toast without an icon'), icon: false })}>{t('不要图标', 'No icon')}</Button>
          <Button onClick={() => toast({ title: t('消失后会再弹一条', 'Another one pops up when this goes'), duration: 1500, onDismiss: () => toast(t('上一条已消失（onDismiss）', 'The previous one is gone (onDismiss)')) })}>onDismiss</Button>
        </Demo>
      </DocSection>

      <DocSection title={t('位置', 'Position')} description={t('位置是 <Toaster /> 的属性，整个应用统一设置一次，不是每条通知各自决定。一共六个位置，默认 top-right；靠下的位置里最新的一条贴着底边，旧的往上让。窄于 520px 时一律横向撑满，只分上下。同时最多显示 max 条（默认 4），超出时最旧的先退场。', 'Position is a prop of <Toaster />, set once for the whole app rather than per toast. There are six positions, top-right by default; in the bottom positions the newest toast sits against the bottom edge and older ones move up. Below 520px wide, toasts always fill the width and only top or bottom matters. At most max toasts show at once (4 by default); beyond that the oldest leaves first.')}>
        <Demo layout="block">
          <Grid columns={3} gap={2}>
            {positions.map((p) => (
              <Inline key={p} justify="center"><Tag tone={p === 'top-right' ? 'accent' : 'neutral'}>{p}</Tag></Inline>
            ))}
          </Grid>
        </Demo>
        <Text as="p" tone="neutral">{t('本站在根部挂的是默认位置的 Toaster，所以这一页的通知都出现在右上角。一个应用里只挂一个 Toaster；挂多个的话每条通知会在每个出口各显示一次。', 'This site mounts a Toaster at the default position, so the toasts on this page all appear in the top-right corner. Mount only one Toaster per app; with several, every toast shows up once in each of them.')}</Text>
        <CodeBlock
          language="tsx"
          title="App.tsx"
          code={t(TOASTER_CODE.zh, TOASTER_CODE.en)}
        />
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={t<Array<[string, string]>>([
          ['卡片', '宽 360 · 圆角 20 · 内边距 16 · 不透明底，无阴影'],
          ['进场', '下落 32px + scale 0.84 → 1 · bouncy'],
          ['图标', '圆底弹出 → 符号描线'],
          ['让位', 'FLIP · spring'],
          ['退场', '朝停靠的一侧滑出 56px · 170ms ease-in'],
          ['时长', '默认 4.2s · 悬停或聚焦时暂停'],
        ], [
          ['Card', 'Width 360 · corner radius 20 · padding 16 · opaque fill, no shadow'],
          ['Enter', 'Drops 32px + scale 0.84 → 1 · bouncy'],
          ['Icon', 'Round base pops in → symbol draws in'],
          ['Making room', 'FLIP · spring'],
          ['Exit', 'Slides 56px toward its docked side · 170ms ease-in'],
          ['Duration', '4.2s by default · paused on hover or focus'],
        ])} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title={t('toast(options) 的选项', 'toast(options) options')} rows={[
          { name: 'title', type: 'ReactNode', description: t(<>标题。<Code>toast('文本')</Code> 等同于 <Code>{"toast({ title: '文本' })"}</Code>。</>, <>The title. <Code>toast('Text')</Code> is the same as <Code>{"toast({ title: 'Text' })"}</Code>.</>) },
          { name: 'description', type: 'ReactNode', description: t('标题下的说明。', 'Description under the title.') },
          { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", description: t('状态色。neutral 和 accent 用默认图标。', 'Status color. neutral and accent use the default icon.') },
          { name: 'icon', type: 'ReactNode | false', description: t('自定义图标；false 不要图标。', 'Custom icon; false for no icon.') },
          { name: 'duration', type: 'number', default: t('Toaster 的 duration', 'Toaster’s duration'), description: t('多少毫秒后自动消失；0 表示一直留着。', 'Milliseconds until it auto-dismisses; 0 keeps it around.') },
          { name: 'action', type: '{ label: ReactNode; onClick?: () => void; dismiss?: boolean }', description: t('操作按钮。dismiss 默认 true：点了之后关掉这条通知。', 'Action button. dismiss defaults to true: clicking it closes the toast.') },
          { name: 'closable', type: 'boolean', description: t('带一个关闭按钮。默认只有不会自动消失的通知才带。', 'Show a close button. By default only toasts that don’t auto-dismiss have one.') },
          { name: 'id', type: 'string', description: t('自己指定 id：同一个 id 再次调用会原地更新。', 'Your own id: calling again with the same id updates it in place.') },
          { name: 'live', type: "'polite' | 'assertive'", description: t('读屏播报的方式。默认 danger 用 assertive，其余 polite。', 'How screen readers announce it. By default danger is assertive and everything else polite.') },
          { name: 'onDismiss', type: '() => void', description: t('这条通知消失之后。', 'Called after this toast disappears.') },
        ]} />
        <PropsTable title={t('toast 上的方法', 'Methods on toast')} rows={[
          { name: 'toast(options | string)', type: '=> string', description: t('发一条通知，返回它的 id。', 'Shows a toast and returns its id.') },
          { name: 'toast.success / warning / danger / info', type: '(options | string) => string', description: t('带状态色的简写。', 'Shorthands with a status color.') },
          { name: 'toast.error', type: '(options | string) => string', description: t('danger 的别名。', 'Alias for danger.') },
          { name: 'toast.dismiss', type: '(id?: string) => void', description: t('关掉某一条；不传 id 则全部关掉。', 'Closes one toast; without an id, closes them all.') },
        ]} />
        <PropsTable title="Toaster" rows={[
          { name: 'position', type: "'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'", default: "'top-right'", description: t('停靠位置。窄屏一律横向撑满，只分上下。', 'Where toasts dock. On narrow screens they always fill the width; only top or bottom matters.') },
          { name: 'max', type: 'number', default: '4', description: t('同时最多显示几条，超出时最旧的先退场。', 'Maximum number shown at once; beyond that the oldest leaves first.') },
          { name: 'duration', type: 'number', default: '4200', description: t('默认的自动消失时间（ms）；0 表示不自动消失。', 'Default auto-dismiss time (ms); 0 disables auto-dismiss.') },
          { name: 'pauseOnHover', type: 'boolean', default: 'true', description: t('指针停在通知上时暂停计时。键盘焦点在通知里时总是暂停。', 'Pause the timer while the pointer rests on a toast. It always pauses while keyboard focus is inside one.') },
          { name: 'offset', type: 'number', default: t('20（窄屏 12）', '20 (12 on narrow screens)'), description: t('到视口边缘的距离（px）。', 'Distance from the viewport edges (px).') },
          { name: 'label', type: 'string', default: t("'通知'", "'Notifications'"), description: t('这块区域的读屏名称。', 'Screen reader name of the region. The default follows the OinkProvider locale.') },
          { name: 'closeLabel', type: 'string', default: t("'关闭'", "'Close'"), description: t('关闭按钮的读屏名称。', 'Screen reader label of the close button. The default follows the OinkProvider locale.') },
          { name: 'container', type: 'HTMLElement | null', description: t('渲染到哪个容器，默认 body。', 'Container to render into. Defaults to body.') },
        ]} />
        <A11yNotes items={t([
          <>Toaster 是一个有名字的 <Code>region</Code>（默认“通知”），读屏用户可以从地标列表直接跳过去。</>,
          <>每条通知是一个 live region：默认 <Code>role="status"</Code>（polite，等读屏空闲再读）；danger 是 <Code>role="alert"</Code>（assertive，立即打断）。可以用 <Code>live</Code> 覆盖。标题和说明作为一个整体读出（<Code>aria-atomic</Code>）。</>,
          '通知出现时不会抢走焦点。操作按钮和关闭按钮可以 Tab 到；焦点在通知里时计时暂停，不会读到一半消失。',
          <>焦点在通知里时按 <Keys k="Esc" /> 关掉这一条。</>,
          '会自动消失的通知，读屏和键盘用户很可能来不及操作。所以不要把唯一的入口（比如唯一的“撤销”）只放在 Toast 里；重要的、需要操作的通知用 duration: 0 常驻。',
          '状态除了颜色还有各自的图标形状，但图标对读屏隐藏——文字本身要说清是成功还是失败。',
          '减弱动效时进退场和让位都直接完成。',
        ], [
          <>Toaster is a named <Code>region</Code> (“Notifications” by default), so screen reader users can jump straight to it from the landmarks list.</>,
          <>Each toast is a live region: <Code>role="status"</Code> by default (polite — read when the screen reader is idle); danger is <Code>role="alert"</Code> (assertive — interrupts immediately). Override with <Code>live</Code>. The title and description are read as one unit (<Code>aria-atomic</Code>).</>,
          'Toasts never steal focus when they appear. Action and close buttons are reachable with Tab; while focus is inside a toast its timer pauses, so it won’t vanish mid-read.',
          <>With focus inside a toast, <Keys k="Esc" /> closes it.</>,
          'Screen reader and keyboard users may well not get to an auto-dismissing toast in time. So never put the only way to do something (say, the only Undo) in a toast alone; keep important, actionable toasts around with duration: 0.',
          'Besides color, each status has its own icon shape, but icons are hidden from screen readers — the text itself must say whether something succeeded or failed.',
          'With reduced motion, entering, exiting and making room all complete instantly.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
