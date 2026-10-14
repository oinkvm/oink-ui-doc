import { useEffect, useState } from 'react';
import { Button, Code, CommandPalette, Icon, Inline, Kbd, Text, toast, useOink } from 'oink-ui';
import type { CommandItem } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { navigate } from '../../router';
import { useT } from '../../i18n';
import { Keys, Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/command-palette', title: 'CommandPalette 命令面板', group: '浮层', order: 5, subtitle: 'CommandPalette', en: { title: 'CommandPalette' } };

function BasicDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useOink();

  // ⌘K / Ctrl+K 由使用者自己绑
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const actions = t('操作', 'Actions');
  const prefs = t('偏好', 'Preferences');
  const go = t('跳转', 'Go to');
  const docs = t('组件文档', 'Component docs');
  const items: CommandItem[] = [
    { id: 'new-task', group: actions, label: t('新建任务', 'New task'), icon: <Icon name="plus" />, shortcut: ['⌘', 'N'], keywords: t(['create', 'xinjian'], ['create', 'add']), onSelect: () => toast.success(t('已新建任务', 'Task created')) },
    { id: 'upload', group: actions, label: t('上传文件', 'Upload file'), icon: <Icon name="upload" />, description: t('最大 2 GB', 'Up to 2 GB'), onSelect: () => toast(t('选择要上传的文件', 'Choose a file to upload')) },
    { id: 'share', group: actions, label: t('分享项目', 'Share project'), icon: <Icon name="share" />, shortcut: ['⌘', '⇧', 'S'], onSelect: () => toast.success(t('链接已复制', 'Link copied')) },
    { id: 'export', group: actions, label: t('导出为 PDF', 'Export as PDF'), icon: <Icon name="download" />, description: t('需要专业版', 'Requires Pro'), disabled: true },
    { id: 'theme', group: prefs, label: resolvedTheme === 'dark' ? t('切换到浅色', 'Switch to light') : t('切换到深色', 'Switch to dark'), icon: <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} />, keywords: t(['theme', 'dark', 'light', '主题'], ['theme', 'dark', 'light', 'appearance']), onSelect: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark') },
    { id: 'notify', group: prefs, label: t('通知设置', 'Notification settings'), icon: <Icon name="bell" />, onSelect: () => toast(t('打开通知设置', 'Opening notification settings')) },
    { id: 'go-table', group: go, label: t('Table 表格', 'Table'), icon: <Icon name="chevron-right" />, description: docs, onSelect: () => { navigate('/components/table'); } },
    { id: 'go-dialog', group: go, label: t('Dialog 对话框', 'Dialog'), icon: <Icon name="chevron-right" />, description: docs, onSelect: () => { navigate('/components/dialog'); } },
    { id: 'go-toast', group: go, label: t('Toast 轻提示', 'Toast'), icon: <Icon name="chevron-right" />, description: docs, onSelect: () => { navigate('/components/toast'); } },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)} leading={<Icon name="search" />}>
        {t('搜索命令', 'Search commands')} <Kbd size="sm" k="Meta" /><Kbd size="sm">K</Kbd>
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items}
        footer={t(<><span>↑ ↓ 选择</span><span>↩ 执行</span><span>Esc 关闭</span></>, <><span>↑ ↓ select</span><span>↩ run</span><span>Esc close</span></>)}
      />
    </>
  );
}

const PEOPLE = {
  zh: ['林小满', '周屿', 'Ada Chen', '宋知远', '何田田', '陈一苇', '许青禾', 'Leo Park'],
  en: ['Mia Lawson', 'Owen Hart', 'Ada Chen', 'Theo Grant', 'Hannah Reed', 'Iris Cole', 'Nora Quinn', 'Leo Park'],
};

function AsyncDemo() {
  const t = useT();
  const people = t(PEOPLE.zh, PEOPLE.en);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  // filter={false}：组件不过滤，结果由外部按 query 给出（这里用本地数组模拟远程搜索）
  const results: CommandItem[] = people
    .filter((p) => p.toLowerCase().includes(query.trim().toLowerCase()))
    .map((p) => ({ id: p, label: p, description: picked.includes(p) ? t('已添加', 'Added') : undefined, icon: <Icon name={picked.includes(p) ? 'check' : 'plus'} /> }));

  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setOpen(true)}>{t('添加成员', 'Add members')}</Button>
        <Text tone="neutral">{picked.length ? t(`已添加：${picked.join('、')}`, `Added: ${picked.join(', ')}`) : t('还没有添加成员', 'No members added yet')}</Text>
      </Inline>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        label={t('添加成员', 'Add members')}
        placeholder={t('按姓名搜索…', 'Search by name…')}
        emptyText={t('没有找到这个人', 'No one by that name')}
        width={420}
        items={results}
        filter={false}
        query={query}
        onQueryChange={setQuery}
        closeOnSelect={false}
        onSelect={(item) => setPicked((list) => (list.includes(item.id) ? list.filter((x) => x !== item.id) : [...list, item.id]))}
      />
    </>
  );
}

/* ------------------------------------------------------------------ 示例源码 */

const BASIC_CODE = {
  zh: `
function BasicDemo() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useOink();

  // ⌘K / Ctrl+K 由使用者自己绑
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const items: CommandItem[] = [
    { id: 'new-task', group: '操作', label: '新建任务', icon: <Icon name="plus" />, shortcut: ['⌘', 'N'], keywords: ['create', 'xinjian'], onSelect: () => toast.success('已新建任务') },
    { id: 'upload', group: '操作', label: '上传文件', icon: <Icon name="upload" />, description: '最大 2 GB', onSelect: () => toast('选择要上传的文件') },
    { id: 'share', group: '操作', label: '分享项目', icon: <Icon name="share" />, shortcut: ['⌘', '⇧', 'S'], onSelect: () => toast.success('链接已复制') },
    { id: 'export', group: '操作', label: '导出为 PDF', icon: <Icon name="download" />, description: '需要专业版', disabled: true },
    { id: 'theme', group: '偏好', label: resolvedTheme === 'dark' ? '切换到浅色' : '切换到深色', icon: <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} />, keywords: ['theme', 'dark', 'light', '主题'], onSelect: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark') },
    { id: 'notify', group: '偏好', label: '通知设置', icon: <Icon name="bell" />, onSelect: () => toast('打开通知设置') },
    { id: 'go-table', group: '跳转', label: 'Table 表格', icon: <Icon name="chevron-right" />, description: '组件文档', onSelect: () => { navigate('/components/table'); } },
    { id: 'go-dialog', group: '跳转', label: 'Dialog 对话框', icon: <Icon name="chevron-right" />, description: '组件文档', onSelect: () => { navigate('/components/dialog'); } },
    { id: 'go-toast', group: '跳转', label: 'Toast 轻提示', icon: <Icon name="chevron-right" />, description: '组件文档', onSelect: () => { navigate('/components/toast'); } },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)} leading={<Icon name="search" />}>
        搜索命令 <Kbd size="sm" k="Meta" /><Kbd size="sm">K</Kbd>
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items}
        footer={<><span>↑ ↓ 选择</span><span>↩ 执行</span><span>Esc 关闭</span></>}
      />
    </>
  );
}`,
  en: `
function BasicDemo() {
  const [open, setOpen] = useState(false);
  const { resolvedTheme, setTheme } = useOink();

  // ⌘K / Ctrl+K is bound by the app, not the component
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const items: CommandItem[] = [
    { id: 'new-task', group: 'Actions', label: 'New task', icon: <Icon name="plus" />, shortcut: ['⌘', 'N'], keywords: ['create', 'add'], onSelect: () => toast.success('Task created') },
    { id: 'upload', group: 'Actions', label: 'Upload file', icon: <Icon name="upload" />, description: 'Up to 2 GB', onSelect: () => toast('Choose a file to upload') },
    { id: 'share', group: 'Actions', label: 'Share project', icon: <Icon name="share" />, shortcut: ['⌘', '⇧', 'S'], onSelect: () => toast.success('Link copied') },
    { id: 'export', group: 'Actions', label: 'Export as PDF', icon: <Icon name="download" />, description: 'Requires Pro', disabled: true },
    { id: 'theme', group: 'Preferences', label: resolvedTheme === 'dark' ? 'Switch to light' : 'Switch to dark', icon: <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} />, keywords: ['theme', 'dark', 'light', 'appearance'], onSelect: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark') },
    { id: 'notify', group: 'Preferences', label: 'Notification settings', icon: <Icon name="bell" />, onSelect: () => toast('Opening notification settings') },
    { id: 'go-table', group: 'Go to', label: 'Table', icon: <Icon name="chevron-right" />, description: 'Component docs', onSelect: () => { navigate('/components/table'); } },
    { id: 'go-dialog', group: 'Go to', label: 'Dialog', icon: <Icon name="chevron-right" />, description: 'Component docs', onSelect: () => { navigate('/components/dialog'); } },
    { id: 'go-toast', group: 'Go to', label: 'Toast', icon: <Icon name="chevron-right" />, description: 'Component docs', onSelect: () => { navigate('/components/toast'); } },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)} leading={<Icon name="search" />}>
        Search commands <Kbd size="sm" k="Meta" /><Kbd size="sm">K</Kbd>
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        items={items}
        footer={<><span>↑ ↓ select</span><span>↩ run</span><span>Esc close</span></>}
      />
    </>
  );
}`,
};

const ASYNC_CODE = {
  zh: `
const people = ['林小满', '周屿', 'Ada Chen', '宋知远', '何田田', '陈一苇', '许青禾', 'Leo Park'];

function AsyncDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  // filter={false}：组件不过滤，结果由外部按 query 给出（这里用本地数组模拟远程搜索）
  const results: CommandItem[] = people
    .filter((p) => p.toLowerCase().includes(query.trim().toLowerCase()))
    .map((p) => ({ id: p, label: p, description: picked.includes(p) ? '已添加' : undefined, icon: <Icon name={picked.includes(p) ? 'check' : 'plus'} /> }));

  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setOpen(true)}>添加成员</Button>
        <Text tone="neutral">{picked.length ? \`已添加：\${picked.join('、')}\` : '还没有添加成员'}</Text>
      </Inline>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        label="添加成员"
        placeholder="按姓名搜索…"
        emptyText="没有找到这个人"
        width={420}
        items={results}
        filter={false}
        query={query}
        onQueryChange={setQuery}
        closeOnSelect={false}
        onSelect={(item) => setPicked((list) => (list.includes(item.id) ? list.filter((x) => x !== item.id) : [...list, item.id]))}
      />
    </>
  );
}`,
  en: `
const people = ['Mia Lawson', 'Owen Hart', 'Ada Chen', 'Theo Grant', 'Hannah Reed', 'Iris Cole', 'Nora Quinn', 'Leo Park'];

function AsyncDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  // filter={false}: the component doesn’t filter; results come from outside based on query
  // (a local array stands in for a remote search here)
  const results: CommandItem[] = people
    .filter((p) => p.toLowerCase().includes(query.trim().toLowerCase()))
    .map((p) => ({ id: p, label: p, description: picked.includes(p) ? 'Added' : undefined, icon: <Icon name={picked.includes(p) ? 'check' : 'plus'} /> }));

  return (
    <>
      <Inline justify="center">
        <Button onClick={() => setOpen(true)}>Add members</Button>
        <Text tone="neutral">{picked.length ? \`Added: \${picked.join(', ')}\` : 'No members added yet'}</Text>
      </Inline>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        label="Add members"
        placeholder="Search by name…"
        emptyText="No one by that name"
        width={420}
        items={results}
        filter={false}
        query={query}
        onQueryChange={setQuery}
        closeOnSelect={false}
        onSelect={(item) => setPicked((list) => (list.includes(item.id) ? list.filter((x) => x !== item.id) : [...list, item.id]))}
      />
    </>
  );
}`,
};

export default function CommandPalettePage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '一个搜索框加一份可以键盘操作的命令列表：让熟练用户不离开键盘就能跳转、执行操作。它是已有功能的捷径，不要把只能从这里进入的功能藏在里面。',
        'A search box plus a keyboard-driven list of commands, so experienced users can navigate and act without leaving the keyboard. It’s a shortcut to existing features — don’t hide anything in it that can only be reached from here.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t('传一组 CommandItem。相同 group 的归到一组，组的顺序按首次出现。输入时按标签、说明、分组和 keywords 过滤（空格分隔的每个词都要命中）。快捷键只是展示，绑定由你自己做——这个示例绑了 ⌘K / Ctrl+K。', 'Pass an array of CommandItem. Items with the same group are grouped together, in order of first appearance. Typing filters by label, description, group and keywords (every space-separated word must match). Shortcuts are display only — binding them is up to you; this example binds ⌘K / Ctrl+K.')}>
        <Demo code={t(BASIC_CODE.zh, BASIC_CODE.en)}>
          <BasicDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('外部过滤、选中后不关闭', 'External filtering, staying open on select')} description={t('filter={false} 时组件不做过滤，结果完全由你按 query 给出（远程搜索就是这样接）；也可以传一个函数自定义匹配。closeOnSelect={false} 让面板在选中后保持打开，适合连续多选。width 改宽度，placeholder / emptyText / label 改文案。', 'With filter={false} the component does no filtering and the results are entirely yours to provide from query — that’s how you hook up a remote search; you can also pass a function for custom matching. closeOnSelect={false} keeps the palette open after a selection, handy for picking several in a row. width changes the width; placeholder / emptyText / label change the copy.')}>
        <Demo code={t(ASYNC_CODE.zh, ASYNC_CODE.en)}>
          <AsyncDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={t<Array<[string, string]>>([
          ['外壳', 'FloatingCard · placement="top" · 不撑满 · 宽 560 · 圆角 24'],
          ['位置', '离顶边让出 10vh（最多 96px），窄屏贴顶'],
          ['搜索行', '高 56 · 左右内边距 20'],
          ['列表', '内边距 12 = 外圆角 24 − 列表项圆角 12；最高 520，超出原生滚动'],
          ['高亮', '中性浅灰底 · 键盘和指针共用同一个高亮'],
        ], [
          ['Shell', 'FloatingCard · placement="top" · not stretched · width 560 · corner radius 24'],
          ['Position', '10vh from the top edge (96px at most); docked to the top on narrow screens'],
          ['Search row', 'Height 56 · horizontal padding 20'],
          ['List', 'Padding 12 = outer corner radius 24 − item corner radius 12; max height 520, scrolls natively beyond that'],
          ['Highlight', 'Neutral light gray fill · keyboard and pointer share one highlight'],
        ])} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="CommandPalette" rows={[
          { name: 'items', type: 'CommandItem[]', required: true, description: t('命令列表。', 'The list of commands.') },
          { name: 'open / defaultOpen', type: 'boolean', default: 'false', description: t('开合，受控 / 非受控。快捷键由使用者自己绑。', 'Open state, controlled / uncontrolled. Keyboard shortcuts are bound by you.') },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: t('开合变化时。', 'Called when the open state changes.') },
          { name: 'query / defaultQuery', type: 'string', default: "''", description: t('搜索词，受控 / 非受控。每次打开会清空。', 'Search query, controlled / uncontrolled. Cleared each time it opens.') },
          { name: 'onQueryChange', type: '(query: string) => void', description: t('搜索词变化时。', 'Called when the query changes.') },
          { name: 'filter', type: 'false | ((item, query) => boolean)', description: t('自定义匹配；false 表示不在组件里过滤。', 'Custom matching; false means no filtering inside the component.') },
          { name: 'onSelect', type: '(item: CommandItem) => void', description: t(<>选中一项时（Enter 或点按）。<Code>item.onSelect</Code> 也会被调用。</>, <>Called when an item is chosen (Enter or click). <Code>item.onSelect</Code> is called too.</>) },
          { name: 'closeOnSelect', type: 'boolean', default: 'true', description: t('选中后是否关闭。', 'Whether to close after a selection.') },
          { name: 'placeholder', type: 'string', default: t("'搜索命令…'", "'Search commands…'"), description: t('搜索框占位文字。', 'Placeholder of the search box. The default follows the OinkProvider locale.') },
          { name: 'emptyText', type: 'ReactNode', default: t("'没有匹配的结果'", "'No matching results'"), description: t('没有结果时显示的内容。', 'Shown when there are no results. The default follows the OinkProvider locale.') },
          { name: 'label', type: 'string', default: t("'命令面板'", "'Command palette'"), description: t('面板和搜索框的读屏名称。', 'Screen reader name of the palette and search box. The default follows the OinkProvider locale.') },
          { name: 'width', type: 'number | string', default: '560', description: t('宽度。', 'Width.') },
          { name: 'footer', type: 'ReactNode', description: t('列表下面的一行提示（比如按键说明）。', 'A line of hints below the list (such as key help).') },
          { name: 'dismissible', type: 'boolean', default: 'true', description: t('允许 Esc 和点遮罩关闭。', 'Allow closing with Esc and by clicking the scrim.') },
        ]} />
        <PropsTable title="CommandItem" rows={[
          { name: 'id', type: 'string', required: true, description: t('唯一标识。', 'Unique identifier.') },
          { name: 'label', type: 'string', required: true, description: t('命令名。', 'Command name.') },
          { name: 'description', type: 'string', description: t('标签右边的一句说明。', 'A short description to the right of the label.') },
          { name: 'icon', type: 'ReactNode', description: t('图标。', 'Icon.') },
          { name: 'shortcut', type: 'string[]', description: t("快捷键提示，一个键一项，如 ['⌘', 'S']。只是展示。", "Shortcut hint, one key per entry, e.g. ['⌘', 'S']. Display only.") },
          { name: 'keywords', type: 'string[]', description: t('额外的搜索关键词（拼音、英文别名…）。', 'Extra search keywords (synonyms, aliases in other languages…).') },
          { name: 'group', type: 'string', description: t('分组标题；相同的归到一组。', 'Group heading; items with the same one are grouped together.') },
          { name: 'disabled', type: 'boolean', description: t('禁用：显示但不能选，键盘移动时跳过。', 'Disabled: shown but not selectable, and skipped by keyboard navigation.') },
          { name: 'onSelect', type: '() => void', description: t('选中时。', 'Called when chosen.') },
        ]} />
        <A11yNotes items={t([
          <>外壳是模态 <Code>dialog</Code>。搜索框是 <Code>role="combobox"</Code>，结果是 <Code>listbox</Code> / <Code>option</Code>，分组是带名字的 <Code>group</Code>。</>,
          <>焦点始终留在搜索框里，当前项通过 <Code>aria-activedescendant</Code> 告诉读屏，所以可以一边打字一边选。</>,
          <><Keys k="↑ ↓" /> 在结果里循环移动，<Keys k="Home End" /> 到首尾，<Keys k="PageUp PageDown" /> 一次跳五项；禁用的项会被跳过。</>,
          <><Keys k="Enter" /> 执行当前项，<Keys k="Esc" /> 关闭；关闭后焦点回到打开前的元素。</>,
          '输入法正在组字时，方向键和回车归输入法，不会误触发命令（中文输入时很重要）。',
          '结果数量变化通过 aria-live 播报“N 条结果”；没有结果时读出空状态文字。',
          '快捷键提示对读屏隐藏（它们只是装饰性的提醒）；真正的快捷键请写进各自功能的说明里。',
        ], [
          <>The shell is a modal <Code>dialog</Code>. The search box is <Code>role="combobox"</Code>, results are <Code>listbox</Code> / <Code>option</Code>, and groups are named <Code>group</Code>s.</>,
          <>Focus always stays in the search box; the active item is conveyed to screen readers via <Code>aria-activedescendant</Code>, so people can type and choose at the same time.</>,
          <><Keys k="↑ ↓" /> cycle through results, <Keys k="Home End" /> jump to the first and last, <Keys k="PageUp PageDown" /> move five at a time; disabled items are skipped.</>,
          <><Keys k="Enter" /> runs the active item and <Keys k="Esc" /> closes; focus then returns to where it was before opening.</>,
          'While an input method is composing, the arrow keys and Enter belong to the IME and won’t trigger commands by accident (important for Chinese, Japanese and Korean input).',
          'Changes in the result count are announced via aria-live as “N results”; with no results, the empty-state text is read.',
          'Shortcut hints are hidden from screen readers (they’re decorative reminders); document the real shortcuts with each feature.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
