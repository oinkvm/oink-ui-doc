import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppShell, AvatarGroup, Avatar, Button, CommandPalette, DropdownMenu, EmptyState, Heading, Icon, Kbd, MenuCheckboxItem, MenuLabel,
  MultiSelect, Nav, NavGroup, NavItem, SearchInput, Segmented, confirm, toast, useBreakpoint, useOink,
} from 'oink-ui';
import type { CommandItem, SelectOption } from 'oink-ui';
import type { ExampleMeta } from '../../registry';
import { BoardView } from './BoardView';
import { ListView } from './ListView';
import { NewTaskDialog } from './NewTaskDialog';
import { TaskDetailHost } from './TaskDetail';
import type { DetailMode } from './TaskDetail';
import { EmptyArt, PriorityGlyph, StatusDot, TIcon } from './bits';
import { useT } from '../../i18n';
import { EMPTY_FILTERS, ME, STATUS_ORDER, UNASSIGNED, hasFilters, inScope, nextTaskId, uid, useData } from './data';
import type { Filters, Scope, Status, Task, TaskActivity, TrackerData, ViewMode } from './data';
import { focusTaskLink } from './actions';
import type { CreatePreset, TaskDraft, TaskPatch, TrackerActions } from './actions';
import './tracker.css';

export const meta: ExampleMeta = {
  slug: 'tracker',
  title: '任务追踪',
  domain: '项目协作',
  description: '一个完整的任务管理工具：列表与看板两种视图、筛选、批量操作、任务详情、评论与活动记录、命令面板。',
  en: {
    title: 'Task tracker',
    domain: 'Project management',
    description: 'A complete task manager: list and board views, filters, bulk actions, task details, comments and activity, and a command palette.',
  },
  order: 1,
};

const sameScope = (a: Scope, b: Scope) => a.kind === b.kind && (a.kind !== 'project' || (b.kind === 'project' && a.id === b.id));

/**
 * 一次修改会写哪些活动记录、通知里怎么说。
 * message(n)：改了 n 个任务时的通知标题（中文是“n 个任务”+ 单个时的说法，英文按句式各写一份）
 */
function describePatch(patch: TaskPatch, d: TrackerData): { activity: Array<Pick<TaskActivity, 'text' | 'tone'>>; message: (n: number) => string } {
  const en = d.lang === 'en';
  const activity: Array<Pick<TaskActivity, 'text' | 'tone'>> = [];
  const zh = (one: string) => (n: number) => (n === 1 ? one : `${n} 个任务${one}`);
  let message = en ? (n: number) => (n === 1 ? 'Updated' : `Updated ${n} tasks`) : zh('已更新');
  if (patch.status !== undefined) {
    const s = d.statusOf(patch.status);
    activity.push({ text: d.act.status(s.label), tone: s.tone });
    message = en ? (n) => (n === 1 ? `Moved to “${s.label}”` : `Moved ${n} tasks to “${s.label}”`) : zh(`已移到「${s.label}」`);
  }
  if (patch.priority !== undefined) {
    const p = d.priorityOf(patch.priority);
    activity.push({ text: d.act.priority(p.label), tone: p.tone });
    message = en ? (n) => (n === 1 ? `Priority set to “${p.label}”` : `Set ${n} tasks to “${p.label}” priority`) : zh(`优先级已改为「${p.label}」`);
  }
  if (patch.assigneeId !== undefined) {
    const m = d.memberOf(patch.assigneeId);
    activity.push({ text: m ? d.act.assigned(m.name) : d.act.unassigned });
    message = en
      ? (n) => (m ? (n === 1 ? `Assigned to ${m.name}` : `Assigned ${n} tasks to ${m.name}`) : (n === 1 ? 'Unassigned' : `Unassigned ${n} tasks`))
      : zh(m ? `已指派给 ${m.name}` : '已取消指派');
  }
  if (patch.due !== undefined) {
    const due = patch.due;
    activity.push({ text: due ? d.act.due(due) : d.act.dueCleared });
    message = en
      ? (n) => (due ? `Due date set to ${d.dueInfo(due).text}${n === 1 ? '' : ` for ${n} tasks`}` : `Cleared the due date${n === 1 ? '' : ` on ${n} tasks`}`)
      : zh(due ? `截止日期已改为 ${d.dueInfo(due).text}` : '已清除截止日期');
  }
  if (patch.labels !== undefined) {
    activity.push({ text: patch.labels.length ? d.act.labels(patch.labels) : d.act.labelsCleared });
    message = en ? (n) => (n === 1 ? 'Labels updated' : `Updated labels on ${n} tasks`) : zh('标签已更新');
  }
  return { activity, message };
}

const changes = (task: Task, patch: TaskPatch) =>
  (Object.keys(patch) as Array<keyof TaskPatch>).some((k) => (k === 'labels' ? (patch.labels ?? []).join('|') !== task.labels.join('|') : patch[k] !== task[k]));

export default function TrackerExample() {
  const tr = useT();
  const d = useData();
  const { MEMBERS, PRIORITIES, PROJECTS, STATUSES, matchesFilters, memberOf, projectOf, statusOf } = d;
  const en = d.lang === 'en';
  /** n 个任务 / n tasks */
  const nTasks = (n: number) => tr(`${n} 个任务`, n === 1 ? '1 task' : `${n} tasks`);
  const { resolvedTheme, setTheme } = useOink();
  const wide = useBreakpoint('md');
  const docked = useBreakpoint('xl');
  const detailMode: DetailMode = docked ? 'panel' : wide ? 'drawer' : 'sheet';

  // 切换语言时整个示例会重新挂载，所以按当前语言播一次种就够了
  const [tasks, setTasks] = useState<Task[]>(() => d.createSeedTasks());
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const [scope, setScope] = useState<Scope>({ kind: 'all' });
  const [view, setView] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [selected, setSelected] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createPreset, setCreatePreset] = useState<CreatePreset>({});
  const mainRef = useRef<HTMLElement | null>(null);
  const [mainEl, setMainEl] = useState<HTMLElement | null>(null);
  const setMain = useCallback((el: HTMLElement | null) => { mainRef.current = el; setMainEl(el); }, []);
  const searchRef = useRef<HTMLInputElement>(null);

  const patchFilters = (patch: Partial<Filters>) => { setFilters((f) => ({ ...f, ...patch })); setSelected([]); };
  const clearFilters = () => { setFilters(EMPTY_FILTERS); setSelected([]); };
  const changeScope = (next: Scope) => { setScope(next); setSelected([]); };

  /* ---------------------------------------------------------------- 数据操作 */

  const openTask = useCallback((id: string) => setOpenId(id), []);

  const openIdRef = useRef(openId);
  openIdRef.current = openId;
  const closeDetail = useCallback(() => {
    const cur = openIdRef.current;
    setOpenId(null);
    // 关掉后把焦点还给列表 / 看板里的这条任务；找不到（被筛掉、被删）就落到主区
    if (cur) focusTaskLink(cur, () => mainRef.current?.focus());
  }, []);

  const updateTasks = useCallback((ids: string[], patch: TaskPatch) => {
    const targets = tasksRef.current.filter((t) => ids.includes(t.id) && changes(t, patch));
    if (!targets.length) return;
    const { activity, message } = describePatch(patch, d);
    const now = new Date().toISOString();
    const before = new Map(targets.map((t) => [t.id, t] as const));
    const added = new Map<string, string[]>();
    setTasks((list) => list.map((t) => {
      if (!before.has(t.id)) return t;
      const entries = activity.map((a) => ({ ...a, id: uid('act'), actorId: ME, at: now }));
      added.set(t.id, entries.map((e) => e.id));
      return { ...t, ...patch, activity: [...t.activity, ...entries] };
    }));
    const undo = () => {
      setTasks((list) => list.map((t) => {
        const prev = before.get(t.id);
        if (!prev) return t;
        const restored = Object.fromEntries((Object.keys(patch) as Array<keyof TaskPatch>).map((k) => [k, prev[k]])) as TaskPatch;
        const drop = added.get(t.id) ?? [];
        return { ...t, ...restored, activity: t.activity.filter((a) => !drop.includes(a.id)) };
      }));
      // 同一个 id 是原地合并更新：要把上一条的说明和“撤销”按钮显式清掉
      toast({ id: 'trk-change', title: tr('已撤销', 'Undone'), tone: 'neutral', description: undefined, action: undefined, duration: 2400 });
    };
    toast({
      id: 'trk-change',
      tone: 'success',
      title: message(targets.length),
      duration: 6000,
      description: targets.length === 1 ? `${targets[0].id} ${targets[0].title}` : undefined,
      action: { label: tr('撤销', 'Undo'), onClick: undo, dismiss: false },
    });
  }, [d, tr]);

  const removeTasks = useCallback(async (ids: string[]) => {
    const targets = tasksRef.current.filter((t) => ids.includes(t.id));
    if (!targets.length) return false;
    const one = targets.length === 1 ? targets[0] : null;
    const ok = await confirm({
      title: one ? tr(`删除「${one.title}」？`, `Delete “${one.title}”?`) : tr(`删除选中的 ${targets.length} 个任务？`, `Delete ${targets.length} selected tasks?`),
      description: tr('评论和活动记录会一起删除。删除后可以在通知里撤销。', 'Comments and activity are deleted too. You can undo from the notification.'),
      confirmText: tr('删除', 'Delete'),
      tone: 'danger',
      icon: <Icon name="trash" />,
    });
    if (!ok) return false;
    const positions = targets.map((t) => ({ task: t, index: tasksRef.current.indexOf(t) }));
    const gone = new Set(targets.map((t) => t.id));
    setTasks((list) => list.filter((t) => !gone.has(t.id)));
    setSelected((keys) => keys.filter((k) => !gone.has(k)));
    setOpenId((cur) => (cur && gone.has(cur) ? null : cur));
    // 触发删除的按钮多半跟着任务一起没了，把焦点放回主区
    // （确认框退场后才会尝试归还焦点，所以隔一会儿再看几次）
    [60, 400, 900].forEach((ms) => window.setTimeout(() => {
      const lost = !document.activeElement || document.activeElement === document.body;
      if (lost && !document.querySelector('.ok-float--modal[data-state="open"]')) mainRef.current?.focus({ preventScroll: true });
    }, ms));
    toast({
      tone: 'neutral',
      title: one ? tr(`已删除 ${one.id}`, `Deleted ${one.id}`) : tr(`已删除 ${targets.length} 个任务`, `Deleted ${targets.length} tasks`),
      description: one ? one.title : undefined,
      duration: 7000,
      action: {
        label: tr('撤销', 'Undo'),
        onClick: () => {
          setTasks((list) => {
            const next = [...list];
            [...positions].sort((a, b) => a.index - b.index).forEach(({ task, index }) => {
              if (!next.some((t) => t.id === task.id)) next.splice(Math.min(index, next.length), 0, task);
            });
            return next;
          });
          toast({ title: one ? tr(`已恢复 ${one.id}`, `Restored ${one.id}`) : tr(`已恢复 ${targets.length} 个任务`, `Restored ${targets.length} tasks`), tone: 'success', duration: 2400 });
          if (one) focusTaskLink(one.id);
        },
      },
    });
    return true;
  }, [tr]);

  const addComment = useCallback((id: string, text: string) => {
    const now = new Date().toISOString();
    setTasks((list) => list.map((t) => (t.id === id
      ? { ...t, comments: [...t.comments, { id: uid('cmt'), authorId: ME, text, at: now }], activity: [...t.activity, { id: uid('act'), actorId: ME, text: d.act.commented, at: now }] }
      : t)));
    toast({ title: tr('评论已发表', 'Comment posted'), tone: 'success', duration: 2400 });
  }, [d, tr]);

  const openCreate = useCallback((preset?: CreatePreset) => {
    setCreatePreset(preset ?? {});
    setCreateOpen(true);
  }, []);

  const actions = useMemo<TrackerActions>(
    () => ({ openTask, updateTasks, removeTasks, addComment, openCreate }),
    [openTask, updateTasks, removeTasks, addComment, openCreate],
  );

  const createTask = (draft: TaskDraft) => {
    const id = nextTaskId(tasksRef.current, draft.projectId);
    const now = new Date().toISOString();
    const activity: TaskActivity[] = [{ id: uid('act'), actorId: ME, text: d.act.created, at: now }];
    if (draft.assigneeId) activity.push({ id: uid('act'), actorId: ME, text: d.act.assigned(memberOf(draft.assigneeId)!.name), at: now });
    const task: Task = { ...draft, id, comments: [], activity, createdAt: now };
    setTasks((list) => [task, ...list]);
    setCreateOpen(false);
    const hidden = !inScope(task, scope) || !matchesFilters(task, filters);
    toast({
      tone: 'success',
      title: tr(`已创建 ${id}`, `Created ${id}`),
      description: hidden ? tr(`${draft.title}（不在当前筛选范围内）`, `${draft.title} (hidden by the current filters)`) : draft.title,
      duration: 7000,
      action: {
        label: tr('撤销', 'Undo'),
        onClick: () => {
          setTasks((list) => list.filter((t) => t.id !== id));
          setOpenId((cur) => (cur === id ? null : cur));
          toast({ title: tr(`已撤销创建 ${id}`, `Removed ${id}`), duration: 2400 });
        },
      },
    });
    if (!hidden) focusTaskLink(id);
  };

  /* ---------------------------------------------------------------- 派生数据 */

  const scoped = useMemo(() => tasks.filter((t) => inScope(t, scope)), [tasks, scope]);
  const visible = useMemo(() => scoped.filter((t) => matchesFilters(t, filters)), [scoped, filters]);
  const openTaskData = openId ? tasks.find((t) => t.id === openId) ?? null : null;
  const filtering = hasFilters(filters);
  const openCount = (s: Scope) => tasks.filter((t) => inScope(t, s) && t.status !== 'done').length;
  const head = d.scopeTitle(scope);
  const doingCount = scoped.filter((t) => t.status === 'doing').length;
  const boardStatuses = filters.statuses.length ? STATUS_ORDER.filter((s) => filters.statuses.includes(s)) : STATUS_ORDER;

  const statusOptions = useMemo<SelectOption[]>(() => STATUSES.map((s) => ({ value: s.value, label: s.label, icon: <StatusDot status={s.value} /> })), [STATUSES]);
  const assigneeOptions = useMemo<SelectOption[]>(
    () => [...MEMBERS.map((m) => ({ value: m.id, label: d.meName(m) })), { value: UNASSIGNED, label: tr('未分配', 'Unassigned') }], [MEMBERS, d, tr],
  );

  /* ---------------------------------------------------------------- 快捷键 */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const el = e.target as HTMLElement | null;
        if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
        if (document.querySelector('.ok-float--modal[data-state="open"]')) return;
        if (searchRef.current) { e.preventDefault(); searchRef.current.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const toggleTheme = (origin?: { x: number; y: number }) => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark', origin);

  const gActions = tr('操作', 'Actions');
  const gGo = tr('前往', 'Go to');
  const commands = useMemo<CommandItem[]>(() => [
    { id: 'new', group: gActions, label: tr('新建任务', 'New task'), icon: <Icon name="plus" />, keywords: en ? ['create', 'add'] : ['create', 'new', 'xinjian'], onSelect: () => openCreate(scope.kind === 'project' ? { projectId: scope.id } : undefined) },
    { id: 'view-list', group: gActions, label: tr('切换到列表视图', 'Switch to list view'), icon: <TIcon name="list" />, keywords: en ? ['list', 'table'] : ['list', 'liebiao'], disabled: view === 'list', onSelect: () => setView('list') },
    { id: 'view-board', group: gActions, label: tr('切换到看板视图', 'Switch to board view'), icon: <TIcon name="board" />, keywords: ['board', 'kanban'], disabled: view === 'board', onSelect: () => setView('board') },
    { id: 'clear', group: gActions, label: tr('清除全部筛选', 'Clear all filters'), icon: <Icon name="sliders" />, keywords: en ? ['filter', 'reset'] : ['filter', 'shaixuan'], disabled: !filtering, onSelect: clearFilters },
    { id: 'theme', group: gActions, label: resolvedTheme === 'dark' ? tr('切换到浅色', 'Switch to light theme') : tr('切换到深色', 'Switch to dark theme'), icon: <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} />, keywords: en ? ['theme', 'dark', 'light', 'mode'] : ['theme', 'dark', 'light', 'zhuti'], onSelect: () => toggleTheme() },
    { id: 'go-all', group: gGo, label: tr('全部任务', 'All tasks'), icon: <TIcon name="inbox" />, onSelect: () => changeScope({ kind: 'all' }) },
    { id: 'go-mine', group: gGo, label: tr('分配给我', 'Assigned to me'), icon: <TIcon name="user" />, onSelect: () => changeScope({ kind: 'mine' }) },
    { id: 'go-week', group: gGo, label: tr('本周到期', 'Due this week'), icon: <TIcon name="calendar" />, onSelect: () => changeScope({ kind: 'week' }) },
    ...PROJECTS.map((p) => ({
      id: `go-${p.id}`, group: gGo, label: p.name, description: p.summary, keywords: [p.prefix],
      icon: <span className="trk-dot" data-tone={p.tone} aria-hidden="true" />, onSelect: () => changeScope({ kind: 'project', id: p.id }),
    })),
    ...tasks.map((t) => ({
      id: `task-${t.id}`, group: tr('任务', 'Tasks'), label: t.title, description: `${t.id} · ${statusOf(t.status).label}`,
      keywords: [t.id, projectOf(t.projectId).name, memberOf(t.assigneeId)?.name ?? ''], icon: <PriorityGlyph priority={t.priority} />,
      onSelect: () => setOpenId(t.id),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [tasks, view, filtering, resolvedTheme, scope, openCreate, d, tr]);

  /* ---------------------------------------------------------------- 界面 */

  const search = (
    <SearchInput
      ref={searchRef}
      className="trk-search"
      aria-label={tr('搜索任务', 'Search tasks')}
      placeholder={tr('搜索标题、编号、负责人…', 'Search titles, IDs, assignees…')}
      value={filters.query}
      onChange={(q) => patchFilters({ query: q })}
    />
  );

  const empty = (
    <EmptyState
      className="trk-empty"
      icon={<EmptyArt />}
      titleAs="h2"
      title={filtering ? tr('没有符合条件的任务', 'No matching tasks') : tr('这里还没有任务', 'No tasks here yet')}
      description={filtering ? tr('换个关键词，或者放宽筛选条件试试。', 'Try a different keyword, or loosen the filters.') : tr('新建一个任务，把要做的事记下来。', 'Create a task to keep track of what needs doing.')}
      actions={
        filtering
          ? <Button onClick={() => { clearFilters(); mainRef.current?.focus(); }}>{tr('清除筛选', 'Clear filters')}</Button>
          : <Button variant="primary" leading={<Icon name="plus" />} onClick={() => openCreate(scope.kind === 'project' ? { projectId: scope.id } : undefined)}>{tr('新建任务', 'New task')}</Button>
      }
    />
  );


  return (
    <>
      <AppShell className="trk" collapseBelow="lg" skipLinkLabel={tr('跳到任务列表', 'Skip to tasks')}>
        <AppShell.Header className="trk-header">
          <AppShell.Trigger drawerOnly label={tr('打开导航', 'Open navigation')} />
          <div className="trk-brand">
            <span className="trk-brand__mark" aria-hidden="true"><TIcon name="board" size={16} /></span>
            <span className="trk-brand__name">{tr('澄川工作室', 'Clearwater Studio')}</span>
          </div>
          {wide && <div className="trk-header__search">{search}</div>}
          <div className="trk-header__actions">
            {wide ? (
              <Button variant="ghost" onClick={() => setPaletteOpen(true)} aria-haspopup="dialog" aria-keyshortcuts="Meta+K Control+K" trailing={<span className="trk-kbd" aria-hidden="true"><Kbd size="sm">⌘</Kbd><Kbd size="sm">K</Kbd></span>}>
                {tr('命令', 'Commands')}
              </Button>
            ) : (
              <Button variant="ghost" iconOnly aria-label={tr('打开命令面板', 'Open command palette')} aria-haspopup="dialog" onClick={() => setPaletteOpen(true)}>
                <TIcon name="command" />
              </Button>
            )}
            <Button
              variant="ghost" iconOnly aria-label={resolvedTheme === 'dark' ? tr('切换到浅色', 'Switch to light theme') : tr('切换到深色', 'Switch to dark theme')}
              onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 }); }}
            >
              <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} />
            </Button>
            {wide ? (
              <Button variant="primary" leading={<Icon name="plus" />} onClick={() => openCreate(scope.kind === 'project' ? { projectId: scope.id } : undefined)}>{tr('新建任务', 'New task')}</Button>
            ) : (
              <Button variant="primary" iconOnly aria-label={tr('新建任务', 'New task')} onClick={() => openCreate(scope.kind === 'project' ? { projectId: scope.id } : undefined)}>
                <Icon name="plus" />
              </Button>
            )}
          </div>
        </AppShell.Header>

        <AppShell.Sidebar label={tr('任务导航', 'Task navigation')} width={248} className="trk-sidebar">
          <div className="trk-side">
            <Nav aria-label={tr('视图与项目', 'Views and projects')}>
              <NavGroup label={tr('视图', 'Views')}>
                <NavItem icon={<TIcon name="inbox" />} current={scope.kind === 'all'} badge={openCount({ kind: 'all' })} onClick={() => changeScope({ kind: 'all' })}>{tr('全部任务', 'All tasks')}</NavItem>
                <NavItem icon={<TIcon name="user" />} current={scope.kind === 'mine'} badge={openCount({ kind: 'mine' })} onClick={() => changeScope({ kind: 'mine' })}>{tr('分配给我', 'Assigned to me')}</NavItem>
                <NavItem icon={<TIcon name="calendar" />} current={scope.kind === 'week'} badge={openCount({ kind: 'week' })} onClick={() => changeScope({ kind: 'week' })}>{tr('本周到期', 'Due this week')}</NavItem>
              </NavGroup>
              <NavGroup label={tr('项目', 'Projects')}>
                {PROJECTS.map((p) => {
                  const s: Scope = { kind: 'project', id: p.id };
                  return (
                    <NavItem key={p.id} icon={<span className="trk-dot" data-tone={p.tone} />} current={sameScope(scope, s)} badge={openCount(s)} onClick={() => changeScope(s)}>
                      {p.name}
                    </NavItem>
                  );
                })}
              </NavGroup>
            </Nav>
            <div className="trk-team">
              <span className="trk-team__label" id="trk-team-label">{tr('成员', 'Team')}</span>
              <AvatarGroup aria-labelledby="trk-team-label" max={5} size="sm">
                {MEMBERS.map((m) => <Avatar key={m.id} name={m.name} color="auto" />)}
              </AvatarGroup>
            </div>
          </div>
        </AppShell.Sidebar>

        <AppShell.Main ref={setMain} className="trk-main">
          <div className="trk-page">
            <header className="trk-head">
              <div className="trk-head__text">
                <Heading level={1} variant="h2" className="trk-head__title">{head.title}</Heading>
                <p className="trk-head__desc">{head.description}</p>
              </div>
              <Segmented<ViewMode>
                aria-label={tr('视图', 'View')}
                className="trk-viewswitch"
                value={view}
                onChange={setView}
                options={[
                  { value: 'list', label: tr('列表', 'List'), icon: <TIcon name="list" size={16} /> },
                  { value: 'board', label: tr('看板', 'Board'), icon: <TIcon name="board" size={16} /> },
                ]}
              />
            </header>

            <div className="trk-filters" role="group" aria-label={tr('筛选', 'Filters')}>
              {!wide && search}
              <MultiSelect
                className="trk-filter"
                size="sm"
                aria-label={tr('按状态筛选', 'Filter by status')}
                placeholder={tr('状态', 'Status')}
                options={statusOptions}
                value={filters.statuses}
                onChange={(v) => patchFilters({ statuses: v })}
                renderValue={(sel) => (sel.length === 1 ? sel[0].label : `${tr('状态', 'Status')} · ${sel.length}`)}
              />
              <MultiSelect
                className="trk-filter"
                size="sm"
                aria-label={tr('按负责人筛选', 'Filter by assignee')}
                placeholder={tr('负责人', 'Assignee')}
                options={assigneeOptions}
                value={filters.assignees}
                onChange={(v) => patchFilters({ assignees: v })}
                renderValue={(sel) => (sel.length === 1 ? sel[0].label : `${tr('负责人', 'Assignee')} · ${sel.length}`)}
              />
              <DropdownMenu
                matchTriggerWidth={false}
                trigger={
                  <Button size="sm" variant={filters.priorities.length ? 'soft' : 'outline'} leading={<TIcon name="flag" size={16} />} trailing={<Icon name="chevron-down" />}>
                    {filters.priorities.length ? `${tr('优先级', 'Priority')} · ${filters.priorities.length}` : tr('优先级', 'Priority')}
                  </Button>
                }
              >
                <MenuLabel>{tr('按优先级筛选', 'Filter by priority')}</MenuLabel>
                {PRIORITIES.map((p) => (
                  <MenuCheckboxItem
                    key={p.value}
                    icon={<PriorityGlyph priority={p.value} />}
                    checked={filters.priorities.includes(p.value)}
                    onCheckedChange={(on) => patchFilters({ priorities: on ? [...filters.priorities, p.value] : filters.priorities.filter((x) => x !== p.value) })}
                  >
                    {p.label}
                  </MenuCheckboxItem>
                ))}
              </DropdownMenu>
              {filtering && <Button size="sm" variant="ghost" leading={<Icon name="x" />} onClick={() => { clearFilters(); mainRef.current?.focus(); }}>{tr('清除筛选', 'Clear filters')}</Button>}
              <p className="trk-count" role="status">
                {filtering
                  ? tr(`筛选出 ${visible.length} / ${scoped.length} 个任务`, `Showing ${visible.length} of ${nTasks(scoped.length)}`)
                  : tr(`${scoped.length} 个任务，${doingCount} 个进行中`, `${nTasks(scoped.length)}, ${doingCount} in progress`)}
              </p>
            </div>

            {view === 'list' ? (
              <ListView
                tasks={visible}
                showProject={scope.kind !== 'project' && docked}
                selected={selected}
                onSelectedChange={setSelected}
                actions={actions}
                empty={empty}
              />
            ) : visible.length === 0 ? (
              <div className="trk-board-empty">{empty}</div>
            ) : (
              <BoardView tasks={visible} statuses={boardStatuses as Status[]} actions={actions} />
            )}
          </div>
        </AppShell.Main>
      </AppShell>

      <TaskDetailHost task={openTaskData} mode={detailMode} onClose={closeDetail} actions={actions} container={mainEl} />
      <NewTaskDialog open={createOpen} onOpenChange={setCreateOpen} preset={createPreset} onCreate={createTask} />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        items={commands}
        placeholder={tr('搜索任务，或输入命令…', 'Search tasks or type a command…')}
        emptyText={tr('没有匹配的任务或命令', 'No matching tasks or commands')}
        footer={<span className="trk-palette-foot"><Kbd size="sm">↑</Kbd><Kbd size="sm">↓</Kbd> {tr('选择', 'select')} <Kbd size="sm">↵</Kbd> {tr('执行', 'run')} <Kbd size="sm">Esc</Kbd> {tr('关闭', 'close')}</span>}
      />
    </>
  );
}
