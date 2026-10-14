import { useEffect, useId, useRef } from 'react';
import {
  Accordion, Avatar, Button, Card, DropdownMenu, EmptyState, Icon, MenuItem, MenuSeparator, MenuSub, Spacer, Tag, ToggleButton, Toolbar, Tooltip,
} from 'oink-ui';
import { useT } from '../../i18n';
import { isoTime, useMail } from './data';
import type { Attachment, Block, FolderId, Mail, Message } from './data';
import { ArchiveIcon, AttachmentGlyph, BackIcon, FolderGlyph, FolderIcon, ForwardIcon, MailOpenIcon, ReplyIcon, StarIcon } from './icons';

export interface ReaderProps {
  mail: Mail | null;
  /** 传了就在工具条前面出现“返回列表”（手机单栏时） */
  onBack?: () => void;
  /** 操作按钮带不带文字（阅读区够宽时带） */
  roomy: boolean;
  conversation: boolean;
  onReply: (mail: Mail) => void;
  onForward: (mail: Mail) => void;
  onArchive: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
  onStar: (ids: string[], on: boolean) => void;
  onRead: (ids: string[], read: boolean) => void;
  onMove: (ids: string[], folder: FolderId) => void;
  onDownload: (file: Attachment) => void;
}

function Body({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mail-body">
      {blocks.map((b, i) => {
        if (typeof b === 'string') return <p key={i}>{b}</p>;
        if ('quote' in b) {
          return (
            <blockquote key={i}>
              <p>{b.quote}</p>
              {b.cite && <footer>—— <cite>{b.cite}</cite></footer>}
            </blockquote>
          );
        }
        const Tag = b.ordered ? 'ol' : 'ul';
        return <Tag key={i}>{b.list.map((x) => <li key={x}>{x}</li>)}</Tag>;
      })}
    </div>
  );
}

function Attachments({ files, onDownload }: { files: Attachment[]; onDownload: (f: Attachment) => void }) {
  const t = useT();
  return (
    <ul className="mail-files" aria-label={t(`附件，共 ${files.length} 个`, files.length === 1 ? '1 attachment' : `${files.length} attachments`)}>
      {files.map((f) => (
        <li key={f.name}>
          <Card size="sm" className="mail-file">
            <span className="mail-file__icon" aria-hidden="true"><AttachmentGlyph kind={f.kind} /></span>
            <span className="mail-file__text">
              <span className="mail-file__name">{f.name}</span>
              <span className="mail-file__size">{f.size}</span>
            </span>
            <Tooltip content={t('下载', 'Download')}>
              <Button variant="ghost" size="sm" iconOnly aria-label={t(`下载 ${f.name}`, `Download ${f.name}`)} onClick={() => onDownload(f)}><Icon name="download" /></Button>
            </Tooltip>
          </Card>
        </li>
      ))}
    </ul>
  );
}

/** 收件人列表：自己显示成“我” */
function usePeople() {
  const t = useT();
  const { ME } = useMail();
  return (list: Message['to']) => list.map((x) => (x.email === ME.email ? t('我', 'me') : x.name)).join(t('、', ', '));
}

/** 一封邮件的抬头：头像、发件人、收件人、时间。放在折叠标题（按钮）里时只能用短语内容，所以全是 span */
function MessageHead({ m, preview }: { m: Message; preview?: boolean }) {
  const t = useT();
  const { ME, fullTime, messageText, shortTime } = useMail();
  const people = usePeople();
  const mine = m.from.email === ME.email;
  return (
    <span className="mail-msg__head">
      <Avatar name={m.from.name} color="auto" size={36} aria-hidden="true" />
      <span className="mail-msg__who">
        <span className="mail-msg__from">
          <span className="mail-msg__name">{mine ? t('我', 'Me') : m.from.name}</span>
          <span className="mail-msg__email">{m.from.email}</span>
        </span>
        <span className="mail-msg__to">{preview ? messageText(m) : t(`发给 ${people(m.to)}`, `To ${people(m.to)}`)}</span>
      </span>
      <time className="mail-msg__time" dateTime={isoTime(m.at)} title={fullTime(m.at)}>{preview ? shortTime(m.at) : fullTime(m.at)}</time>
    </span>
  );
}

export function Reader({ mail, onBack, roomy, conversation, onReply, onForward, onArchive, onDelete, onStar, onRead, onMove, onDownload }: ReaderProps) {
  const t = useT();
  const { FOLDERS, fullTime, labelOf } = useMail();
  const people = usePeople();
  const titleId = useId();
  const backRef = useRef<HTMLButtonElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const mailId = mail?.id;

  // 换了一封：滚回顶部；手机上是“推进”来的，把焦点交给返回按钮
  useEffect(() => {
    if (!mailId) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    backRef.current?.focus({ preventScroll: true });
  }, [mailId]);

  if (!mail) {
    return (
      <div className="mail-reader mail-reader--empty">
        <EmptyState
          size="lg" icon={<Icon name="mail" />} title={t('选一封邮件来读', 'Pick an email to read')} titleAs="h2"
          description={t('在列表里用 ↑ ↓ 移动，Enter 打开；按 / 搜索。', 'Use ↑ ↓ to move through the list and Enter to open. Press / to search.')}
        />
      </div>
    );
  }

  const one = [mail.id];
  const canArchive = mail.folder !== 'archive' && mail.folder !== 'drafts';
  const thread = mail.messages;
  const last = thread[thread.length - 1];
  const deleteLabel = mail.folder === 'trash' ? t('彻底删除', 'Delete forever') : t('删除', 'Delete');
  const act = (label: string, icon: JSX.Element, onClick: () => void, primary = false) => (
    roomy
      ? <Button size="sm" variant={primary ? 'soft' : 'ghost'} leading={icon} onClick={onClick}>{label}</Button>
      : <Button size="sm" variant="ghost" iconOnly aria-label={label} onClick={onClick}>{icon}</Button>
  );

  return (
    <article className="mail-reader" aria-labelledby={titleId}>
      <div className="mail-reader__bar">
        {onBack && (
          <Button ref={backRef} variant="ghost" size="sm" iconOnly aria-label={t('返回列表', 'Back to list')} onClick={onBack}><BackIcon /></Button>
        )}
        <Toolbar aria-label={t('邮件操作', 'Message actions')} className="mail-reader__tools">
          <Tooltip content={t('回复', 'Reply')} shortcut="R">{act(t('回复', 'Reply'), <ReplyIcon />, () => onReply(mail), true)}</Tooltip>
          <Tooltip content={t('转发', 'Forward')} shortcut="F">{act(t('转发', 'Forward'), <ForwardIcon />, () => onForward(mail))}</Tooltip>
          {canArchive && <Tooltip content={t('归档', 'Archive')} shortcut="E">{act(t('归档', 'Archive'), <ArchiveIcon />, () => onArchive(one))}</Tooltip>}
          <Tooltip content={deleteLabel} shortcut="#">{act(deleteLabel, <Icon name="trash" />, () => onDelete(one))}</Tooltip>
          <Spacer />
          <Tooltip content={mail.starred ? t('取消星标', 'Unstar') : t('加星标', 'Star')} shortcut="S">
            <ToggleButton variant="ghost" size="sm" iconOnly aria-label={t('星标', 'Starred')} pressed={mail.starred} onChange={(on) => onStar(one, on)}>
              <StarIcon filled={mail.starred} />
            </ToggleButton>
          </Tooltip>
          <DropdownMenu
            aria-label={t('更多操作', 'More actions')} placement="bottom-end" matchTriggerWidth={false}
            trigger={<Button variant="ghost" size="sm" iconOnly aria-label={t('更多操作', 'More actions')}><Icon name="more" /></Button>}
          >
            <MenuItem icon={<MailOpenIcon />} shortcut="U" onSelect={() => onRead(one, false)}>{t('标为未读', 'Mark as unread')}</MenuItem>
            <MenuSub icon={<FolderIcon />} label={t('移动到', 'Move to')}>
              {FOLDERS.filter((f) => f.id !== mail.folder && f.id !== 'sent' && f.id !== 'drafts').map((f) => (
                <MenuItem key={f.id} icon={<FolderGlyph id={f.id} />} onSelect={() => onMove(one, f.id)}>{f.name}</MenuItem>
              ))}
            </MenuSub>
            <MenuSeparator />
            <MenuItem icon="copy" onSelect={() => { void navigator.clipboard?.writeText(mail.subject).catch(() => {}); }}>{t('复制主题', 'Copy subject')}</MenuItem>
          </DropdownMenu>
        </Toolbar>
      </div>

      <div ref={scrollRef} className="mail-reader__scroll ok-scroll">
        <header className="mail-reader__header">
          <h2 id={titleId} className="mail-reader__subject">{mail.subject}</h2>
          <div className="mail-reader__tags">
            <Tag size="sm" icon={<FolderGlyph id={mail.folder} />}>{FOLDERS.find((f) => f.id === mail.folder)?.name}</Tag>
            {mail.labels.map((l) => <Tag key={l} size="sm" tone={labelOf(l).tone}>{labelOf(l).name}</Tag>)}
            {thread.length > 1 && <span className="mail-reader__n">{t(`${thread.length} 封往来`, `${thread.length} messages`)}</span>}
          </div>
        </header>

        {thread.length > 1 && conversation ? (
          <Accordion
            key={mail.id} className="mail-thread" variant="plain" headingLevel={3} defaultValue={[last.id]}
            items={thread.map((m) => ({
              value: m.id,
              title: <MessageHead m={m} preview />,
              content: (
                <div className="mail-msg__content">
                  <p className="mail-msg__meta">{t('发给', 'To')} {people(m.to)} · <time dateTime={isoTime(m.at)}>{fullTime(m.at)}</time></p>
                  <Body blocks={m.body} />
                  {m.attachments && <Attachments files={m.attachments} onDownload={onDownload} />}
                </div>
              ),
            }))}
          />
        ) : (
          thread.map((m) => (
            <section key={m.id} className="mail-msg" aria-label={t(`${m.from.name} 的邮件`, `Message from ${m.from.name}`)}>
              <MessageHead m={m} />
              <Body blocks={m.body} />
              {m.attachments && <Attachments files={m.attachments} onDownload={onDownload} />}
            </section>
          ))
        )}

        <div className="mail-reader__foot">
          <Button leading={<ReplyIcon />} onClick={() => onReply(mail)}>{t('回复', 'Reply')}</Button>
          <Button variant="ghost" leading={<ForwardIcon />} onClick={() => onForward(mail)}>{t('转发', 'Forward')}</Button>
        </div>
      </div>
    </article>
  );
}
