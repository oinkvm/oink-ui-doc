import { useEffect, useId, useRef, useState } from 'react';
import {
  Button, Chip, ChipGroup, DatePicker, Dialog, Field, Form, Input, Segmented, Select, Textarea, formatISODate,
} from 'oink-ui';
import { StatusDot } from './bits';
import { useT } from '../../i18n';
import { UNASSIGNED, startOfToday, useData } from './data';
import type { Priority, Status } from './data';
import type { CreatePreset, TaskDraft } from './actions';

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preset: CreatePreset;
  onCreate: (draft: TaskDraft) => void;
}

interface Errors { title?: string; project?: string; due?: string }

const TITLE_MAX = 60;

export function NewTaskDialog({ open, onOpenChange, preset, onCreate }: NewTaskDialogProps) {
  const t = useT();
  const { LABELS, MEMBERS, PRIORITIES, PROJECTS, STATUSES, meName } = useData();
  const formId = useId();
  const titleRef = useRef<HTMLInputElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assignee, setAssignee] = useState<string>(UNASSIGNED);
  const [due, setDue] = useState<Date | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);

  // 每次打开都是一张新表
  useEffect(() => {
    if (!open) return;
    setTitle(''); setDescription(''); setProjectId(preset.projectId ?? null); setStatus(preset.status ?? 'todo');
    setPriority('medium'); setAssignee(UNASSIGNED); setDue(null); setLabels([]); setErrors({}); setTried(false);
  }, [open, preset]);

  const validate = (next: { title: string; projectId: string | null; due: Date | null }): Errors => {
    const out: Errors = {};
    const text = next.title.trim();
    if (!text) out.title = t('给任务起个标题', 'Give the task a title');
    else if (text.length < 2) out.title = t('标题至少两个字', 'Use at least 2 characters');
    else if (text.length > TITLE_MAX) out.title = t(`标题不要超过 ${TITLE_MAX} 个字（现在 ${text.length} 个）`, `Keep it under ${TITLE_MAX} characters (currently ${text.length})`);
    if (!next.projectId) out.project = t('选择任务所属的项目', 'Choose a project for this task');
    if (next.due && next.due < startOfToday()) out.due = t('截止日期不能早于今天', 'The due date can’t be in the past');
    return out;
  };
  // 提交过一次之后，边改边重新校验
  const recheck = (patch: Partial<{ title: string; projectId: string | null; due: Date | null }>) => {
    if (tried) setErrors(validate({ title, projectId, due, ...patch }));
  };

  const submit = () => {
    const found = validate({ title, projectId, due });
    setErrors(found);
    setTried(true);
    if (found.title) { titleRef.current?.focus(); return; }
    if (found.project) { projectRef.current?.querySelector<HTMLElement>('button')?.focus(); return; }
    if (found.due || !projectId) return;
    onCreate({
      title: title.trim(), description: description.trim(), projectId, status, priority,
      assigneeId: assignee === UNASSIGNED ? null : assignee, due: due ? formatISODate(due) : null,
      labels: LABELS.filter((l) => labels.includes(l)),
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title={t('新建任务', 'New task')}
      closable
      initialFocus={titleRef}
      className="trk-new"
      actions={
        <>
          <Button size="lg" onClick={() => onOpenChange(false)}>{t('取消', 'Cancel')}</Button>
          <Button size="lg" variant="primary" type="submit" form={formId}>{t('创建任务', 'Create task')}</Button>
        </>
      }
    >
      <Form id={formId} noValidate onSubmit={submit}>
        <Field label={t('标题', 'Title')} required error={errors.title}>
          <Input
            ref={titleRef} value={title} placeholder={t('例如：订单列表支持导出', 'e.g. Export the order list')} autoComplete="off"
            onChange={(v) => { setTitle(v); recheck({ title: v }); }}
          />
        </Field>
        <Field label={t('描述', 'Description')} hint={t('背景、验收标准，或者复现步骤', 'Context, acceptance criteria, or steps to reproduce')}>
          <Textarea value={description} onChange={setDescription} minRows={3} maxRows={8} />
        </Field>
        <div className="trk-new__grid">
          <Field label={t('项目', 'Project')} required error={errors.project}>
            {(c) => (
              <Select
                ref={projectRef} id={c.id} invalid={!!errors.project} aria-describedby={c['aria-describedby']}
                placeholder={t('选择项目', 'Choose a project')} value={projectId}
                options={PROJECTS.map((p) => ({ value: p.id, label: p.name, meta: p.prefix }))}
                onChange={(v) => { setProjectId(v); recheck({ projectId: v }); }}
              />
            )}
          </Field>
          <Field label={t('状态', 'Status')}>
            {(c) => (
              <Select
                id={c.id} value={status} onChange={(v) => setStatus(v as Status)}
                options={STATUSES.map((s) => ({ value: s.value, label: s.label, icon: <StatusDot status={s.value} /> }))}
              />
            )}
          </Field>
          <Field label={t('负责人', 'Assignee')}>
            {(c) => (
              <Select
                id={c.id} value={assignee} onChange={setAssignee}
                options={[
                  { value: UNASSIGNED, label: t('未分配', 'Unassigned') },
                  ...MEMBERS.map((m) => ({ value: m.id, label: meName(m), meta: m.role })),
                ]}
              />
            )}
          </Field>
          <Field label={t('截止日期', 'Due date')} error={errors.due}>
            {(c) => (
              <DatePicker
                id={c.id} invalid={!!errors.due} aria-describedby={c['aria-describedby']}
                value={due} onChange={(d) => { setDue(d); recheck({ due: d }); }}
              />
            )}
          </Field>
        </div>
        <Field label={t('优先级', 'Priority')}>
          <Segmented<Priority> block value={priority} onChange={setPriority} options={PRIORITIES.map((p) => ({ value: p.value, label: p.label }))} />
        </Field>
        <Field label={t('标签', 'Labels')}>
          <ChipGroup value={labels} onChange={setLabels}>
            {LABELS.map((l) => <Chip key={l} value={l}>{l}</Chip>)}
          </ChipGroup>
        </Field>
      </Form>
    </Dialog>
  );
}
