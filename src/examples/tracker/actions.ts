import type { Priority, Status, Task } from './data';

export type TaskPatch = Partial<Pick<Task, 'status' | 'priority' | 'assigneeId' | 'due' | 'labels'>>;

export interface TaskDraft {
  title: string;
  description: string;
  projectId: string;
  status: Status;
  priority: Priority;
  assigneeId: string | null;
  due: string | null;
  labels: string[];
}

export interface CreatePreset { status?: Status; projectId?: string }

export interface TrackerActions {
  openTask: (id: string) => void;
  /** 改一个或多个任务的属性：写活动记录，并弹出带“撤销”的通知 */
  updateTasks: (ids: string[], patch: TaskPatch) => void;
  /** 先确认再删除；返回是否真的删了 */
  removeTasks: (ids: string[]) => Promise<boolean>;
  addComment: (id: string, text: string) => void;
  openCreate: (preset?: CreatePreset) => void;
}

/** 把焦点送到某个任务在当前视图里的入口（表格里的标题按钮 / 看板卡片的标题） */
export function focusTaskLink(id: string, fallback?: () => void) {
  let tries = 0;
  const attempt = () => {
    const el = document.querySelector<HTMLElement>(`[data-task-link="${id}"]`);
    if (el) { el.focus(); return; }
    if (++tries < 4) requestAnimationFrame(attempt);
    else fallback?.();
  };
  requestAnimationFrame(attempt);
}
