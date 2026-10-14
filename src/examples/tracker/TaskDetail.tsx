import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import {
  Button, Chip, ChipGroup, DatePicker, Drawer, DropdownMenu, Field, FloatingBody, FloatingHeader, Icon, MenuCheckboxItem, MenuItem,
  MenuLabel, MenuSeparator, Panel, Segmented, Select, Sheet, Tabs, Textarea, Timeline, formatISODate, parseISODate, toast,
} from 'oink-ui';
import type { SelectOption } from 'oink-ui';
import { MemberAvatar, StatusDot, TIcon } from './bits';
import { useT } from '../../i18n';
import { UNASSIGNED, useData } from './data';
import type { Priority, Status, Task } from './data';
import type { TrackerActions } from './actions';

export type DetailMode = 'panel' | 'drawer' | 'sheet';
const PANEL_WIDTH = 420;

interface TaskDetailHostProps {
  task: Task | null;
  mode: DetailMode;
  onClose: () => void;
  actions: TrackerActions;
  /** 停靠的面板限制在这个容器里（主区），不盖住顶栏 */
  container: HTMLElement | null;
}

/** 同一份详情内容，按宽度换容器：≥1280 浮在主区右侧的非模态 Panel（不挤占内容，后面照常滚动），768–1279 模态 Drawer，更窄是底部 Sheet */
export function TaskDetailHost({ task, mode, onClose, actions, container }: TaskDetailHostProps) {
  // 关闭动画期间还要显示刚才那条任务
  const last = useRef<Task | null>(task);
  if (task) last.current = task;
  const shown = task ?? last.current;
  const open = task !== null;
  const onOpenChange = (next: boolean) => { if (!next) onClose(); };
  const panelRef = useRef<HTMLDivElement | null>(null);

  // 非模态面板不会自己接管焦点：打开或换任务时把焦点送进去，Esc 才能关、读屏才知道内容换了
  const openId = task?.id ?? null;
  useEffect(() => {
    if (mode !== 'panel' || !openId) return;
    let tries = 0;
    let frame = 0;
    const attempt = () => {
      const el = panelRef.current;
      if (el) { if (!el.contains(document.activeElement)) el.focus({ preventScroll: true }); return; }
      if (++tries < 6) frame = requestAnimationFrame(attempt);
    };
    attempt();
    return () => cancelAnimationFrame(frame);
  }, [mode, openId]);

  const body = shown ? <TaskDetail key={shown.id} task={shown} actions={actions} /> : null;

  if (mode === 'panel') {
    if (!container) return null;
    return (
      <Panel
        ref={panelRef} open={open} onOpenChange={onOpenChange} size={PANEL_WIDTH} role="complementary" className="trk-detail"
        container={container} contained
      >
        {body}
      </Panel>
    );
  }
  if (mode === 'drawer') {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} size={460} className="trk-detail">
        {body}
      </Drawer>
    );
  }
  return (
    <Sheet open={open} onOpenChange={onOpenChange} size="lg" stretch className="trk-detail">
      {body}
    </Sheet>
  );
}

function TaskDetail({ task, actions }: { task: Task; actions: TrackerActions }) {
  const t = useT();
  const { LABELS, MEMBERS, PRIORITIES, STATUSES, meName, projectOf } = useData();
  const project = projectOf(task.projectId);
  const [tab, setTab] = useState('comments');

  const statusOptions = useMemo<SelectOption[]>(
    () => STATUSES.map((s) => ({ value: s.value, label: s.label, icon: <StatusDot status={s.value} /> })), [STATUSES],
  );
  const memberOptions = useMemo<SelectOption[]>(
    () => [
      ...MEMBERS.map((m) => ({ value: m.id, label: meName(m), meta: m.role })),
      { value: UNASSIGNED, label: t('未分配', 'Unassigned') },
    ], [MEMBERS, meName, t],
  );

  const toggleLabel = (label: string, on: boolean) => {
    const next = on ? [...task.labels, label] : task.labels.filter((l) => l !== label);
    actions.updateTasks([task.id], { labels: LABELS.filter((l) => next.includes(l)) });
  };

  return (
    <>
      <FloatingHeader title={task.title} description={`${task.id} · ${project.name}`} closeLabel={t('关闭详情', 'Close details')}>
        <DropdownMenu
          placement="bottom-end"
          matchTriggerWidth={false}
          trigger={<Button variant="ghost" size="sm" iconOnly aria-label={t('更多操作', 'More actions')}><Icon name="more" /></Button>}
        >
          <MenuItem icon="copy" onSelect={() => { void navigator.clipboard?.writeText(task.id).catch(() => undefined); toast({ title: t(`已复制编号 ${task.id}`, `Copied ${task.id}`), tone: 'success' }); }}>{t('复制编号', 'Copy ID')}</MenuItem>
          {task.status !== 'done' && <MenuItem icon="check" onSelect={() => actions.updateTasks([task.id], { status: 'done' })}>{t('标记为已完成', 'Mark as done')}</MenuItem>}
          <MenuSeparator />
          <MenuItem icon="trash" tone="danger" onSelect={() => { void actions.removeTasks([task.id]); }}>{t('删除任务', 'Delete task')}</MenuItem>
        </DropdownMenu>
      </FloatingHeader>
      <FloatingBody className="trk-detail__body">
        <p className="trk-detail__desc">{task.description}</p>

        <div className="trk-props">
          <Field label={t('状态', 'Status')} orientation="horizontal">
            {(c) => (
              <Select
                id={c.id} size="sm" options={statusOptions} value={task.status}
                onChange={(v) => actions.updateTasks([task.id], { status: v as Status })}
              />
            )}
          </Field>
          <Field label={t('负责人', 'Assignee')} orientation="horizontal">
            {(c) => (
              <Select
                id={c.id} size="sm" options={memberOptions} value={task.assigneeId ?? UNASSIGNED}
                onChange={(v) => actions.updateTasks([task.id], { assigneeId: v === UNASSIGNED ? null : v })}
              />
            )}
          </Field>
          <Field label={t('优先级', 'Priority')} orientation="horizontal">
            <Segmented<Priority>
              size="sm" block value={task.priority}
              options={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))}
              onChange={(v) => actions.updateTasks([task.id], { priority: v })}
            />
          </Field>
          <Field label={t('截止日期', 'Due date')} orientation="horizontal">
            {(c) => (
              <div className="trk-due">
                <DatePicker
                  id={c.id} size="sm" value={task.due ? parseISODate(task.due) : null}
                  onChange={(d) => actions.updateTasks([task.id], { due: d ? formatISODate(d) : null })}
                />
                {task.due && (
                  <Button variant="ghost" size="sm" iconOnly aria-label={t('清除截止日期', 'Clear due date')} onClick={() => actions.updateTasks([task.id], { due: null })}>
                    <Icon name="x" />
                  </Button>
                )}
              </div>
            )}
          </Field>
          <Field label={t('标签', 'Labels')} orientation="horizontal">
            <ChipGroup className="trk-labels">
              {task.labels.map((l) => (
                <Chip key={l} onRemove={() => toggleLabel(l, false)} removeLabel={t(`移除标签 ${l}`, `Remove label ${l}`)}>{l}</Chip>
              ))}
              <DropdownMenu
                matchTriggerWidth={false}
                trigger={<Button variant="ghost" size="sm" leading={<Icon name="plus" />}>{task.labels.length ? t('添加', 'Add') : t('添加标签', 'Add label')}</Button>}
              >
                <MenuLabel>{t('标签', 'Labels')}</MenuLabel>
                {LABELS.map((l) => (
                  <MenuCheckboxItem key={l} checked={task.labels.includes(l)} onCheckedChange={(on) => toggleLabel(l, on)}>{l}</MenuCheckboxItem>
                ))}
              </DropdownMenu>
            </ChipGroup>
          </Field>
        </div>

        <Tabs
          className="trk-detail__tabs"
          label={t('评论与活动', 'Comments and activity')}
          value={tab}
          onChange={setTab}
          unmountInactive
          items={[
            { value: 'comments', label: `${t('评论', 'Comments')} ${task.comments.length || ''}`.trim(), content: <Comments task={task} actions={actions} /> },
            { value: 'activity', label: t('活动', 'Activity'), content: <Activity task={task} /> },
          ]}
        />
      </FloatingBody>
    </>
  );
}

function Comments({ task, actions }: { task: Task; actions: TrackerActions }) {
  const t = useT();
  const { memberOf, timeAgo } = useData();
  const [text, setText] = useState('');
  const send = () => {
    const value = text.trim();
    if (!value) return;
    actions.addComment(task.id, value);
    setText('');
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
  };
  return (
    <div className="trk-comments">
      <h3 className="ok-sr">{t('评论', 'Comments')}</h3>
      {task.comments.length === 0 ? (
        <p className="trk-comments__empty">{t('还没有评论。说点什么，让大家知道进展。', 'No comments yet. Post an update so everyone knows where this stands.')}</p>
      ) : (
        <ul className="trk-comments__list">
          {task.comments.map((c) => {
            const m = memberOf(c.authorId);
            return (
              <li key={c.id} className="trk-comment">
                <MemberAvatar id={c.authorId} size={28} />
                <div className="trk-comment__main">
                  <div className="trk-comment__head">
                    <span className="trk-comment__name">{m?.name ?? t('已离开的成员', 'Former member')}</span>
                    <time className="trk-comment__time" dateTime={c.at}>{timeAgo(c.at)}</time>
                  </div>
                  <p className="trk-comment__text">{c.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="trk-composer">
        <Textarea
          aria-label={t('添加评论', 'Add a comment')} placeholder={t('写下评论…', 'Write a comment…')} minRows={2} maxRows={6}
          value={text} onChange={setText} onKeyDown={onKeyDown}
        />
        <div className="trk-composer__row">
          <span className="trk-composer__hint" aria-hidden="true">{t('⌘ / Ctrl + Enter 发送', '⌘ / Ctrl + Enter to send')}</span>
          <Button variant="primary" size="sm" disabled={!text.trim()} onClick={send} leading={<TIcon name="comment" size={16} />}>{t('发表评论', 'Comment')}</Button>
        </div>
      </div>
    </div>
  );
}

function Activity({ task }: { task: Task }) {
  const t = useT();
  const { memberOf, timeAgo } = useData();
  const items = [...task.activity].reverse().map((a) => ({
    key: a.id,
    title: <><strong className="trk-activity__who">{memberOf(a.actorId)?.name ?? t('系统', 'System')}</strong> {a.text}</>,
    time: timeAgo(a.at),
    dateTime: a.at,
    tone: a.tone,
  }));
  return (
    <div className="trk-activity">
      <h3 className="ok-sr">{t('活动', 'Activity')}</h3>
      <Timeline items={items} aria-label={t('活动记录', 'Activity log')} />
    </div>
  );
}
