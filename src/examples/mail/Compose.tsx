import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import {
  Button, Chip, Combobox, FileDrop, FloatingBody, FloatingFooter, FloatingHeader, Icon, Input, Kbd, Panel, Sheet, Spacer, Textarea, Tooltip, confirm,
} from 'oink-ui';
import { useT } from '../../i18n';
import { draftDirty, fileSize, useMail } from './data';
import type { Draft, Person } from './data';
import { ClipIcon, ExpandIcon, SendIcon } from './icons';

export interface ComposeSession {
  /** 每开一封新的换一个 key，表单状态跟着重置 */
  key: number;
  title: string;
  initial: Draft;
  /** 一打开就算“有未保存内容”（撤销发送后回到编辑时） */
  unsaved?: boolean;
}

export interface ComposeProps {
  session: ComposeSession | null;
  /** 宽屏：右下角的非模态悬浮卡片；窄屏：全高的底部弹层 */
  wide: boolean;
  onClose: () => void;
  onSend: (draft: Draft) => void;
  onSaveDraft: (draft: Draft) => void;
}

/** 写邮件。容器走库的悬浮卡片（Panel / Sheet）；草稿状态放在容器外面，宽窄切换时不会丢 */
export function Compose({ session, ...rest }: ComposeProps) {
  // 关掉之后还要留着上一封的内容把退场动画播完
  const [last, setLast] = useState(session);
  if (session && session !== last) setLast(session);
  if (!last) return null;
  return <ComposeForm key={last.key} open={session !== null} session={last} {...rest} />;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ComposeForm({ open, session, wide, onClose, onSend, onSaveDraft }: Omit<ComposeProps, 'session'> & { open: boolean; session: ComposeSession }) {
  const t = useT();
  const { CONTACTS } = useMail();
  const [draft, setDraft] = useState<Draft>(session.initial);
  const [toText, setToText] = useState('');
  const [toError, setToError] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const uid = useId();
  // Combobox 的 ref 落在外框上，拿不到里面的 <input>，只好按 id 找
  const focusTo = () => document.getElementById(uid + 'to')?.focus();
  const firstField = useMemo<RefObject<HTMLElement | null>>(() => ({
    get current() { return session.initial.to.length ? bodyRef.current : document.getElementById(uid + 'to'); },
  }), [session, uid]);
  // 非模态的 Panel 不会自己接管焦点：打开后把光标放进第一个要填的地方
  useEffect(() => {
    if (!wide) return;
    // 用定时器而不是 rAF：浮层经 Portal 晚一拍挂载，而且后台标签页里 rAF 不会跑
    const timer = window.setTimeout(() => firstField.current?.focus(), 30);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dirty = !!session.unsaved || draftDirty(draft, session.initial) || toText.trim() !== '';
  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));

  const addPerson = (person: Person) => {
    setToError(false);
    setDraft((d) => (d.to.some((x) => x.email === person.email) ? d : { ...d, to: [...d.to, person] }));
    setToText('');
    setToOpen(false);
  };
  /** 把输入框里手打的地址收成一个收件人；不是邮箱就原样留着 */
  const commitTyped = (): Person[] => {
    const text = toText.trim().replace(/[,，;；]$/, '');
    if (!EMAIL.test(text)) return draft.to;
    const person = CONTACTS.find((c) => c.email === text) ?? { name: text.split('@')[0], email: text };
    addPerson(person);
    return draft.to.some((x) => x.email === person.email) ? draft.to : [...draft.to, person];
  };
  const onToKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',' || e.key === '，' || e.key === ';') && EMAIL.test(toText.trim())) {
      e.preventDefault();
      commitTyped();
    } else if (e.key === 'Backspace' && toText === '' && draft.to.length > 0) {
      patch({ to: draft.to.slice(0, -1) });
    }
  };

  const requestClose = async () => {
    if (dirty) {
      const ok = await confirm({
        title: t('放弃这封邮件？', 'Discard this email?'),
        description: t('还没发送的内容不会保存。想留着的话，先“存为草稿”。', 'Unsent content won’t be saved. To keep it, choose “Save draft” first.'),
        confirmText: t('放弃', 'Discard'), cancelText: t('继续编辑', 'Keep editing'), tone: 'danger',
      });
      if (!ok) return;
    }
    onClose();
  };
  const send = () => {
    const to = commitTyped();
    if (to.length === 0) { setToError(true); setMinimized(false); window.setTimeout(focusTo, 30); return; }
    onSend({ ...draft, to });
  };
  const onFormKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
  };

  const options = CONTACTS.filter((c) => !draft.to.some((x) => x.email === c.email))
    .map((c) => ({ value: c.email, label: c.name, meta: c.email, textValue: `${c.name} ${c.email}` }));

  const header = (
    <FloatingHeader title={session.title} level={2} closeLabel={t('关闭写邮件', 'Close compose')} onClose={() => void requestClose()}>
      {wide && (
        <Tooltip content={minimized ? t('展开', 'Expand') : t('最小化', 'Minimize')}>
          <Button
            variant="ghost" size="sm" iconOnly aria-label={minimized ? t('展开写邮件', 'Expand compose') : t('最小化写邮件', 'Minimize compose')} aria-expanded={!minimized}
            onClick={() => setMinimized((v) => !v)}
          >
            {minimized ? <ExpandIcon /> : <Icon name="minus" />}
          </Button>
        </Tooltip>
      )}
    </FloatingHeader>
  );

  const body = (
    <>
      <FloatingBody className="mail-compose__body" onKeyDown={onFormKeyDown}>
        <div className="mail-compose__field">
          <label className="mail-compose__label" htmlFor={uid + 'to'}>{t('收件人', 'To')}</label>
          <div className="mail-compose__to">
            {draft.to.map((x) => (
              <Chip key={x.email} title={x.email} removeLabel={t(`移除 ${x.name}`, `Remove ${x.name}`)} onRemove={() => patch({ to: draft.to.filter((y) => y.email !== x.email) })}>{x.name}</Chip>
            ))}
            <Combobox
              id={uid + 'to'} className="mail-compose__combo" size="sm"
              options={options} value={null} open={toOpen} onOpenChange={setToOpen} inputValue={toText} onInputChange={(t) => { setToText(t); setToError(false); }}
              onChange={(_, o) => { const c = o && CONTACTS.find((x) => x.email === o.value); if (c) addPerson(c); }}
              onKeyDown={onToKeyDown} onBlur={() => { commitTyped(); }}
              placeholder={draft.to.length ? t('继续添加', 'Add more') : t('姓名或邮箱', 'Name or email')} emptyText={null}
              invalid={toError} aria-describedby={toError ? uid + 'err' : undefined}
            />
          </div>
        </div>
        {toError && <p id={uid + 'err'} className="mail-compose__error" role="alert"><Icon name="alert" size={16} />{t('至少填一位收件人', 'Add at least one recipient')}</p>}

        <div className="mail-compose__field">
          <label className="mail-compose__label" htmlFor={uid + 'subject'}>{t('主题', 'Subject')}</label>
          <Input id={uid + 'subject'} size="sm" value={draft.subject} onChange={(subject) => patch({ subject })} placeholder={t('这封邮件是关于什么的', 'What’s this email about?')} />
        </div>

        <Textarea
          ref={bodyRef} className="mail-compose__text" aria-label={t('正文', 'Message')} value={draft.body} onChange={(text) => patch({ body: text })}
          minRows={6} placeholder={t('写点什么…', 'Write something…')}
        />

        {draft.files.length > 0 && (
          <div className="mail-compose__files" role="group" aria-label={t('已添加的附件', 'Attached files')}>
            {draft.files.map((f, i) => (
              <Chip key={f.name + i} icon={<ClipIcon />} removeLabel={t(`移除 ${f.name}`, `Remove ${f.name}`)} onRemove={() => patch({ files: draft.files.filter((_, j) => j !== i) })}>
                {f.name} · {f.size}
              </Chip>
            ))}
          </div>
        )}
        {showDrop && (
          <FileDrop
            multiple aria-label={t('添加附件', 'Attach files')} title={t('把文件拖到这里，或点击选择', 'Drop files here, or click to choose')} hint={t('单个文件不超过 25 MB', 'Up to 25 MB per file')} maxSize={25 * 1024 * 1024}
            onChange={(files) => patch({ files: [...draft.files, ...files.map((f) => ({ name: f.name, size: fileSize(f.size) }))] })}
          />
        )}
      </FloatingBody>
      <FloatingFooter align="start" className="mail-compose__foot">
        <Tooltip content={t('发送', 'Send')} shortcut={<><Kbd k="Meta" /><Kbd k="Enter" /></>}>
          <Button variant="primary" leading={<SendIcon />} onClick={send}>{t('发送', 'Send')}</Button>
        </Tooltip>
        <Tooltip content={showDrop ? t('收起附件区', 'Hide attachments') : t('添加附件', 'Attach files')}>
          <Button variant="ghost" iconOnly aria-label={t('添加附件', 'Attach files')} aria-expanded={showDrop} onClick={() => setShowDrop((v) => !v)}><ClipIcon /></Button>
        </Tooltip>
        <Spacer />
        <Button variant="ghost" disabled={!dirty} onClick={() => onSaveDraft({ ...draft, to: commitTyped() })}>{t('存为草稿', 'Save draft')}</Button>
      </FloatingFooter>
    </>
  );

  if (!wide) {
    return (
      <Sheet
        open={open} onOpenChange={(next) => { if (!next) void requestClose(); }} size="full" stretch
        className="mail-compose mail-compose--sheet" initialFocus={firstField}
      >
        {header}
        {body}
      </Sheet>
    );
  }
  return (
    <Panel
      open={open} onOpenChange={(next) => { if (!next) void requestClose(); }} placement="bottom" stretch={false} role="dialog"
      size={minimized ? 'auto' : 'min(600px, 100%)'} className="mail-compose mail-compose--panel" data-minimized={minimized ? '' : undefined}
    >
      {header}
      {!minimized && body}
    </Panel>
  );
}
