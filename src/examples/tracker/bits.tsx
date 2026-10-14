import type { ReactNode } from 'react';
import { Avatar, Badge, Icon } from 'oink-ui';
import { useT } from '../../i18n';
import { useData } from './data';
import type { Priority, Status, Task } from './data';

/* ------------------------------------------------------------------ 图标（20×20 描线） */

const PATHS = {
  list: 'M7.500 5.500h9M7.500 10h9M7.500 14.500h9M3.800 5.500h.1M3.800 10h.1M3.800 14.500h.1',
  board: 'M4 4h3.500v12H4zM8.250 4h3.500v8h-3.500zM12.500 4H16v5h-3.500z',
  inbox: 'M3.500 5h13v10h-13zM3.500 11H7l1 1.500h4l1-1.500h3.500',
  user: 'M10 10a3 3 0 100-6 3 3 0 000 6zM4.500 16c.6-2.600 2.800-4 5.500-4s4.900 1.400 5.500 4',
  calendar: 'M4 5.500h12V16H4zM4 8.500h12M7 3.500v3M13 3.500v3',
  comment: 'M4 4.500h12V13H9l-3.500 3v-3H4z',
  clock: 'M10 16.500a6.500 6.500 0 100-13 6.500 6.500 0 000 13zM10 6.500V10l2.500 1.500',
  move: 'M4 10h12M12 6l4 4-4 4',
  tag: 'M3.500 4.500h6l7 7-5.500 5.500-7.500-7.500zM7 8h.1',
  command: 'M7 7h6v6H7zM7 7H5.500A1.500 1.500 0 117 5.500zM13 7V5.500A1.500 1.500 0 1114.500 7zM13 13h1.500A1.500 1.500 0 1113 14.500zM7 13v1.500A1.500 1.500 0 115.500 13z',
  flag: 'M5 17V4M5 4.500h9.500l-2 3 2 3H5',
} as const;

export type TrackerIcon = keyof typeof PATHS;

export function TIcon({ name, size }: { name: TrackerIcon; size?: number }) {
  return <Icon size={size}><path d={PATHS[name]} /></Icon>;
}

/** 空状态里的小插画：一摞卡片加一个放大镜，全部用令牌色 */
export function EmptyArt() {
  return (
    <svg className="trk-art" viewBox="0 0 96 72" width="96" height="72" aria-hidden="true">
      <rect x="14" y="10" width="52" height="34" rx="9" className="trk-art__back" />
      <rect x="22" y="20" width="52" height="34" rx="9" className="trk-art__front" />
      <path d="M31 31h22M31 39h14" className="trk-art__line" />
      <circle cx="70" cy="48" r="9" className="trk-art__lens" />
      <path d="M77 55l7 7" className="trk-art__handle" />
    </svg>
  );
}

/* ------------------------------------------------------------------ 状态 / 优先级 / 截止 / 负责人 */

export function StatusBadge({ status }: { status: Status }) {
  const s = useData().statusOf(status);
  return <Badge tone={s.tone} dot ping={status === 'doing'}>{s.label}</Badge>;
}

/** 状态圆点：纯装饰，旁边必须有文字 */
export function StatusDot({ status }: { status: Status }) {
  return <span className="trk-dot" data-tone={useData().statusOf(status).tone} aria-hidden="true" />;
}

/** 优先级：三格信号条（紧急是带叹号的方块），形状和文字一起表达，不只靠颜色 */
export function PriorityGlyph({ priority }: { priority: Priority }) {
  const p = useData().priorityOf(priority);
  if (priority === 'urgent') {
    return (
      <svg className="trk-prio" data-tone={p.tone} viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
        <rect x="3" y="3" width="14" height="14" rx="4.500" fill="currentColor" />
        <path d="M10 6.500v4.300M10 13.400v.1" className="trk-prio__mark" />
      </svg>
    );
  }
  const level = priority === 'high' ? 3 : priority === 'medium' ? 2 : 1;
  return (
    <svg className="trk-prio" data-tone={p.tone} viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <rect key={i} x={3.500 + i * 5} y={12 - i * 4} width="3" height={5 + i * 4} rx="1.500" fill="currentColor" opacity={i < level ? 1 : 0.22} />
      ))}
    </svg>
  );
}

export function PriorityMark({ priority, iconOnly }: { priority: Priority; iconOnly?: boolean }) {
  const p = useData().priorityOf(priority);
  return (
    <span className="trk-meta">
      <PriorityGlyph priority={priority} />
      {iconOnly ? <span className="ok-sr">{p.label}</span> : <span>{p.label}</span>}
    </span>
  );
}

export function DueText({ task, icon }: { task: Pick<Task, 'due' | 'status'>; icon?: boolean }) {
  const t = useT();
  const info = useData().dueInfo(task.due, task.status);
  if (!task.due) return <span className="trk-meta trk-muted">{icon ? <TIcon name="calendar" size={16} /> : null}—<span className="ok-sr">{t('未设置截止日期', 'No due date')}</span></span>;
  return (
    <time className="trk-meta" data-tone={info.tone === 'neutral' ? undefined : info.tone} dateTime={task.due} title={task.due}>
      {icon ? <TIcon name="calendar" size={16} /> : null}{info.text}
    </time>
  );
}

export function Assignee({ id, avatarOnly, size = 24 }: { id: string | null; avatarOnly?: boolean; size?: number }) {
  const t = useT();
  const m = useData().memberOf(id);
  if (!m) {
    return (
      <span className="trk-meta trk-muted">
        <Avatar size={size} className="trk-avatar--empty" alt={avatarOnly ? t('未分配', 'Unassigned') : undefined} />
        {avatarOnly ? null : <span>{t('未分配', 'Unassigned')}</span>}
      </span>
    );
  }
  return (
    <span className="trk-meta">
      {avatarOnly ? <Avatar size={size} name={m.name} color="auto" /> : <MemberFace name={m.name} size={size} />}
      {avatarOnly ? null : <span className="trk-truncate">{m.name}</span>}
    </span>
  );
}

/** 成员头像（装饰用，旁边另有名字） */
export function MemberAvatar({ id, size = 28 }: { id: string | null; size?: number }): ReactNode {
  const m = useData().memberOf(id);
  return m
    ? <MemberFace name={m.name} size={size} />
    : <Avatar size={size} className="trk-avatar--empty" />;
}

/** color="auto" 按名字取色，需要 name；但旁边已有名字时不想让读屏重复读一遍 */
function MemberFace({ name, size }: { name: string; size: number }) {
  return <Avatar size={size} name={name} color="auto" aria-hidden="true" role={undefined} aria-label={undefined} />;
}
