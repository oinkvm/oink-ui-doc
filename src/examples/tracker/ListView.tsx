import { useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Button, Card, CardLink, Checkbox, DropdownMenu, Icon, MenuItem, MenuLabel, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuSub, Select,
  Table, Tag, Toolbar, useBreakpoint,
} from 'oink-ui';
import type { TableColumn } from 'oink-ui';
import { Assignee, DueText, PriorityGlyph, PriorityMark, StatusBadge, StatusDot, TIcon } from './bits';
import { useT } from '../../i18n';
import { STATUS_ORDER, useData } from './data';
import type { Priority, Status, Task } from './data';
import type { TrackerActions } from './actions';

type MobileSort = 'default' | 'priority' | 'due' | 'status';

interface ListViewProps {
  tasks: Task[];
  showProject: boolean;
  selected: string[];
  onSelectedChange: (keys: string[]) => void;
  actions: TrackerActions;
  empty: ReactNode;
}

export function ListView({ tasks, showProject, selected, onSelectedChange, actions, empty }: ListViewProps) {
  const tr = useT();
  const { MEMBERS, PRIORITIES, STATUSES, memberOf, priorityOf, projectOf } = useData();
  const tableRef = useRef<HTMLDivElement>(null);
  // 手机宽度下表格换成卡片列表：一行一张小卡片，排序用下拉框
  const roomy = useBreakpoint('sm');
  const [mobileSort, setMobileSort] = useState<MobileSort>('default');
  const sorted = useMemo(() => {
    if (mobileSort === 'default') return tasks;
    const cmp: Record<Exclude<MobileSort, 'default'>, (a: Task, b: Task) => number> = {
      priority: (a, b) => priorityOf(a.priority).rank - priorityOf(b.priority).rank,
      status: (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
      due: (a, b) => (a.due ?? '9999').localeCompare(b.due ?? '9999'),
    };
    return [...tasks].sort(cmp[mobileSort]);
  }, [tasks, mobileSort, priorityOf]);

  const columns = useMemo<TableColumn<Task>[]>(() => {
    const cols: TableColumn<Task>[] = [
      {
        key: 'title', header: tr('任务', 'Task'), sortable: true, accessor: (t) => t.title,
        render: (t) => (
          <div className="trk-cell-title">
            <button type="button" className="trk-rowlink ok-focusable" data-task-link={t.id} onClick={() => actions.openTask(t.id)}>
              <span className="trk-id">{t.id}</span>
              <span className="trk-rowlink__title">{t.title}</span>
            </button>
            {t.labels.length > 0 && (
              <span className="trk-cell-tags">
                {t.labels.slice(0, 2).map((l) => <Tag key={l} size="sm">{l}</Tag>)}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'status', header: tr('状态', 'Status'), sortable: true,
        compare: (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
        render: (t) => <StatusBadge status={t.status} />,
      },
      {
        key: 'priority', header: tr('优先级', 'Priority'), sortable: true,
        compare: (a, b) => priorityOf(a.priority).rank - priorityOf(b.priority).rank,
        render: (t) => <PriorityMark priority={t.priority} />,
      },
    ];
    cols.push({
      key: 'assignee', header: tr('负责人', 'Assignee'), sortable: true, accessor: (t) => memberOf(t.assigneeId)?.name ?? null,
      render: (t) => <Assignee id={t.assigneeId} />,
    });
    if (showProject) {
      cols.push({ key: 'project', header: tr('项目', 'Project'), sortable: true, accessor: (t) => projectOf(t.projectId).name, render: (t) => <span className="trk-muted">{projectOf(t.projectId).name}</span> });
    }
    cols.push(
      { key: 'due', header: tr('截止', 'Due'), sortable: true, accessor: (t) => t.due, render: (t) => <DueText task={t} /> },
      {
        key: 'actions', header: <span className="ok-sr">{tr('操作', 'Actions')}</span>, label: tr('操作', 'Actions'), align: 'end', width: 56,
        render: (t) => <RowMenu task={t} actions={actions} />,
      },
    );
    return cols;
  }, [actions, showProject, tr, memberOf, priorityOf, projectOf]);

  const picked = selected.filter((id) => tasks.some((t) => t.id === id));
  const backToTable = () => {
    requestAnimationFrame(() => tableRef.current?.querySelector<HTMLElement>('thead input, thead button, .trk-mlist__bar input')?.focus());
  };
  const clear = () => { onSelectedChange([]); backToTable(); };

  return (
    <div className="trk-list">
      {picked.length > 0 && (
        <Toolbar className="trk-bulk" aria-label={tr('批量操作', 'Bulk actions')} gap={2} wrap>
          <span className="trk-bulk__count">{tr(`已选 ${picked.length} 项`, `${picked.length} selected`)}</span>
          <DropdownMenu
            matchTriggerWidth={false}
            trigger={<Button size="sm" leading={<TIcon name="move" size={16} />}>{tr('状态', 'Status')}</Button>}
          >
            <MenuLabel>{tr('移动到', 'Move to')}</MenuLabel>
            {STATUSES.map((s) => (
              <MenuItem key={s.value} icon={<StatusDot status={s.value} />} onSelect={() => actions.updateTasks(picked, { status: s.value })}>{s.label}</MenuItem>
            ))}
          </DropdownMenu>
          <DropdownMenu
            matchTriggerWidth={false}
            trigger={<Button size="sm" leading={<TIcon name="user" size={16} />}>{tr('负责人', 'Assignee')}</Button>}
          >
            <MenuLabel>{tr('指派给', 'Assign to')}</MenuLabel>
            {MEMBERS.map((m) => (
              <MenuItem key={m.id} onSelect={() => actions.updateTasks(picked, { assigneeId: m.id })}>{m.name}</MenuItem>
            ))}
            <MenuSeparator />
            <MenuItem onSelect={() => actions.updateTasks(picked, { assigneeId: null })}>{tr('取消指派', 'Unassign')}</MenuItem>
          </DropdownMenu>
          <DropdownMenu
            matchTriggerWidth={false}
            trigger={<Button size="sm" leading={<TIcon name="flag" size={16} />}>{tr('优先级', 'Priority')}</Button>}
          >
            <MenuLabel>{tr('优先级设为', 'Set priority')}</MenuLabel>
            {PRIORITIES.map((p) => (
              <MenuItem key={p.value} icon={<PriorityGlyph priority={p.value} />} onSelect={() => actions.updateTasks(picked, { priority: p.value })}>{p.label}</MenuItem>
            ))}
          </DropdownMenu>
          <Button
            size="sm" variant="ghost" className="trk-danger" leading={<Icon name="trash" />}
            onClick={async () => { if (await actions.removeTasks(picked)) { onSelectedChange([]); backToTable(); } }}
          >
            {tr('删除', 'Delete')}
          </Button>
          <span className="trk-bulk__spacer" aria-hidden="true" />
          <Button size="sm" variant="ghost" onClick={clear}>{tr('取消选择', 'Clear selection')}</Button>
        </Toolbar>
      )}
      {roomy ? (
        <Table<Task>
          ref={tableRef}
          className="trk-table"
          label={tr('任务列表', 'Tasks')}
          columns={columns}
          data={tasks}
          rowKey="id"
          selectable
          selectedKeys={selected}
          onSelectionChange={onSelectedChange}
          getRowLabel={(t) => `${t.id} ${t.title}`}
            empty={empty}
        />
      ) : (
        <div ref={tableRef} className="trk-mlist">
          {tasks.length === 0 ? empty : (
            <>
              <div className="trk-mlist__bar">
                <Checkbox
                  checked={picked.length === tasks.length}
                  indeterminate={picked.length > 0 && picked.length < tasks.length}
                  onChange={(on) => onSelectedChange(on ? tasks.map((t) => t.id) : [])}
                >
                  {tr('全选', 'Select all')}
                </Checkbox>
                <Select
                  className="trk-mlist__sort" size="sm" aria-label={tr('排序方式', 'Sort by')} placement="bottom-end"
                  value={mobileSort} onChange={(v) => setMobileSort(v as MobileSort)}
                  options={[
                    { value: 'default', label: tr('默认排序', 'Default order') },
                    { value: 'priority', label: tr('按优先级', 'By priority') },
                    { value: 'due', label: tr('按截止日期', 'By due date') },
                    { value: 'status', label: tr('按状态', 'By status') },
                  ]}
                />
              </div>
              <ul className="trk-mlist__items" aria-label={tr('任务列表', 'Tasks')}>
                {sorted.map((t) => {
                  const on = selected.includes(t.id);
                  return (
                    <li key={t.id}>
                      <Card as="article" size="sm" className="trk-mcard" data-selected={on ? '' : undefined} aria-label={`${t.id} ${t.title}`}>
                        <div className="trk-mcard__top">
                          <Checkbox
                            checked={on} aria-label={tr(`选择 ${t.id} ${t.title}`, `Select ${t.id} ${t.title}`)}
                            onChange={(next) => onSelectedChange(next ? [...selected, t.id] : selected.filter((k) => k !== t.id))}
                          />
                          <span className="trk-id">{t.id}</span>
                          <StatusBadge status={t.status} />
                          <span className="trk-mcard__menu"><RowMenu task={t} actions={actions} /></span>
                        </div>
                        <h2 className="trk-card__title">
                          <CardLink data-task-link={t.id} onClick={() => actions.openTask(t.id)}>{t.title}</CardLink>
                        </h2>
                        <div className="trk-card__foot">
                          <PriorityMark priority={t.priority} />
                          <DueText task={t} icon />
                          <span className="trk-card__who"><Assignee id={t.assigneeId} avatarOnly size={24} /></span>
                        </div>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function RowMenu({ task, actions }: { task: Task; actions: TrackerActions }) {
  const t = useT();
  const { PRIORITIES, STATUSES } = useData();
  return (
    <DropdownMenu
      placement="bottom-end"
      matchTriggerWidth={false}
      trigger={<Button variant="ghost" size="sm" iconOnly aria-label={t(`${task.id} 的更多操作`, `More actions for ${task.id}`)}><Icon name="more" /></Button>}
    >
      <MenuItem icon="edit" onSelect={() => actions.openTask(task.id)}>{t('打开详情', 'Open details')}</MenuItem>
      <MenuSub label={t('移动到', 'Move to')} icon={<TIcon name="move" />}>
        <MenuRadioGroup aria-label={t('状态', 'Status')} value={task.status} onChange={(v) => actions.updateTasks([task.id], { status: v as Status })}>
          {STATUSES.map((s) => <MenuRadioItem key={s.value} value={s.value} closeOnSelect>{s.label}</MenuRadioItem>)}
        </MenuRadioGroup>
      </MenuSub>
      <MenuSub label={t('优先级', 'Priority')} icon={<TIcon name="flag" />}>
        <MenuRadioGroup aria-label={t('优先级', 'Priority')} value={task.priority} onChange={(v) => actions.updateTasks([task.id], { priority: v as Priority })}>
          {PRIORITIES.map((p) => <MenuRadioItem key={p.value} value={p.value} closeOnSelect>{p.label}</MenuRadioItem>)}
        </MenuRadioGroup>
      </MenuSub>
      {task.assigneeId !== null && <MenuItem icon={<TIcon name="user" />} onSelect={() => actions.updateTasks([task.id], { assigneeId: null })}>{t('取消指派', 'Unassign')}</MenuItem>}
      <MenuSeparator />
      <MenuItem icon="trash" tone="danger" onSelect={() => { void actions.removeTasks([task.id]); }}>{t('删除任务', 'Delete task')}</MenuItem>
    </DropdownMenu>
  );
}
