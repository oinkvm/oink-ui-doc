import { useState } from 'react';
import type { DragEvent } from 'react';
import { Button, Card, CardLink, DropdownMenu, Icon, MenuItem, MenuLabel, MenuRadioGroup, MenuRadioItem, MenuSeparator, Tag } from 'oink-ui';
import { Assignee, DueText, PriorityMark, StatusDot } from './bits';
import { useT } from '../../i18n';
import { useData } from './data';
import type { Status, Task } from './data';
import { focusTaskLink } from './actions';
import type { TrackerActions } from './actions';

interface BoardViewProps {
  tasks: Task[];
  /** 要显示的列；状态筛选为空时是全部 */
  statuses: Status[];
  actions: TrackerActions;
}

export function BoardView({ tasks, statuses, actions }: BoardViewProps) {
  const t = useT();
  const { statusOf } = useData();
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<Status | null>(null);

  const move = (task: Task, status: Status) => {
    if (task.status === status) return;
    actions.updateTasks([task.id], { status });
    // 卡片换了一列会重新挂载，把焦点跟过去
    focusTaskLink(task.id);
  };

  const onDrop = (e: DragEvent<HTMLElement>, status: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragging;
    const task = tasks.find((t) => t.id === id);
    setDragging(null); setOver(null);
    if (task && task.status !== status) actions.updateTasks([task.id], { status });
  };

  return (
    <div className="trk-board ok-scroll" role="group" aria-label={t('看板', 'Board')}>
      {statuses.map((status) => {
        const s = statusOf(status);
        const items = tasks.filter((t) => t.status === status);
        const headingId = `trk-col-${status}`;
        return (
          <section
            key={status}
            className="trk-col"
            aria-labelledby={headingId}
            data-over={over === status && dragging ? '' : undefined}
            onDragOver={(e) => { if (dragging) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (over !== status) setOver(status); } }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOver((cur) => (cur === status ? null : cur)); }}
            onDrop={(e) => onDrop(e, status)}
          >
            <header className="trk-col__head">
              <h2 id={headingId} className="trk-col__title">
                <StatusDot status={status} />
                {s.label}
                <span className="trk-col__count" aria-label={t(`${items.length} 个任务`, items.length === 1 ? '1 task' : `${items.length} tasks`)}>{items.length}</span>
              </h2>
              <Button variant="ghost" size="sm" iconOnly aria-label={t(`在「${s.label}」里新建任务`, `New task in “${s.label}”`)} onClick={() => actions.openCreate({ status })}>
                <Icon name="plus" />
              </Button>
            </header>
            {items.length === 0 ? (
              <p className="trk-col__empty">{dragging ? t('拖到这里', 'Drop here') : s.hint}</p>
            ) : (
              <ul className="trk-col__list">
                {items.map((task) => (
                  <li
                    key={task.id}
                    draggable
                    data-dragging={dragging === task.id ? '' : undefined}
                    onDragStart={(e) => { e.dataTransfer.setData('text/plain', task.id); e.dataTransfer.effectAllowed = 'move'; setDragging(task.id); }}
                    onDragEnd={() => { setDragging(null); setOver(null); }}
                  >
                    <BoardCard task={task} onMove={(next) => move(task, next)} actions={actions} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

function BoardCard({ task, onMove, actions }: { task: Task; onMove: (status: Status) => void; actions: TrackerActions }) {
  const t = useT();
  const { STATUSES } = useData();
  return (
    <Card as="article" size="sm" className="trk-card" aria-label={`${task.id} ${task.title}`}>
      <div className="trk-card__top">
        <span className="trk-id">{task.id}</span>
        <DropdownMenu
          placement="bottom-end"
          matchTriggerWidth={false}
          trigger={<Button variant="ghost" size="sm" iconOnly className="trk-card__menu" aria-label={t(`移动或管理 ${task.id}`, `Move or manage ${task.id}`)}><Icon name="more" /></Button>}
        >
          <MenuLabel>{t('移动到', 'Move to')}</MenuLabel>
          <MenuRadioGroup aria-label={t('移动到', 'Move to')} value={task.status} onChange={(v) => onMove(v as Status)}>
            {STATUSES.map((s) => <MenuRadioItem key={s.value} value={s.value} closeOnSelect>{s.label}</MenuRadioItem>)}
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuItem icon="edit" onSelect={() => actions.openTask(task.id)}>{t('打开详情', 'Open details')}</MenuItem>
          <MenuItem icon="trash" tone="danger" onSelect={() => { void actions.removeTasks([task.id]); }}>{t('删除任务', 'Delete task')}</MenuItem>
        </DropdownMenu>
      </div>
      <h3 className="trk-card__title">
        <CardLink data-task-link={task.id} onClick={() => actions.openTask(task.id)}>{task.title}</CardLink>
      </h3>
      {task.labels.length > 0 && (
        <div className="trk-card__tags">
          {task.labels.map((l) => <Tag key={l} size="sm">{l}</Tag>)}
        </div>
      )}
      <div className="trk-card__foot">
        <PriorityMark priority={task.priority} />
        <DueText task={task} icon />
        <span className="trk-card__who"><Assignee id={task.assigneeId} avatarOnly size={24} /></span>
      </div>
    </Card>
  );
}
