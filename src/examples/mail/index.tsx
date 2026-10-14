import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppShell, Box, Button, Count, Icon, SplitPane, TabBar, VisuallyHidden, confirm, toast, useBreakpoint, useEvent,
} from 'oink-ui';
import type { ExampleMeta } from '../../registry';
import { useT } from '../../i18n';
import { DEFAULT_SETTINGS, EMPTY_DRAFT, lastMessage, mailTime, newId, useMail } from './data';
import type { Attachment, Draft, FolderId, LabelId, ListFilter, Mail, MailSettings, ViewId } from './data';
import { Compose } from './Compose';
import type { ComposeSession } from './Compose';
import { InboxIcon, SendIcon, StarIcon } from './icons';
import { MailList } from './MailList';
import { Reader } from './Reader';
import { Settings } from './Settings';
import { Sidebar } from './Sidebar';
import './mail.css';

export const meta: ExampleMeta = {
  slug: 'mail',
  title: '邮箱',
  domain: '通讯',
  description: '三栏邮件客户端：文件夹、邮件列表、阅读区；带批量操作、写邮件、搜索筛选和设置。',
  en: {
    title: 'Mail',
    domain: 'Communication',
    description: 'A three-pane email client with folders, a message list and a reading pane, plus bulk actions, compose, search, filters and settings.',
  },
  order: 3,
  // 收件时间按访问时刻和时区显示，构建时渲染不出来
  prerender: false,
};

function inView(m: Mail, view: ViewId): boolean {
  if (view === 'starred') return m.starred && m.folder !== 'trash' && m.folder !== 'spam';
  if (view.startsWith('label:')) return m.labels.includes(view.slice(6) as LabelId) && m.folder !== 'trash' && m.folder !== 'spam';
  return m.folder === view;
}

/** 按键事件是不是设置里录的那个组合键（如 "C"、"Meta+Shift+K"） */
function matchesHotkey(e: KeyboardEvent, combo: string): boolean {
  if (!combo) return false;
  const parts = combo.split('+');
  const key = parts[parts.length - 1];
  const has = (m: string) => parts.slice(0, -1).includes(m);
  if (e.metaKey !== has('Meta') || e.ctrlKey !== has('Control') || e.altKey !== has('Alt') || e.shiftKey !== has('Shift')) return false;
  return e.key.toLowerCase() === key.toLowerCase();
}

export default function MailExample() {
  const t = useT();
  const { INCOMING, ME, NO_SUBJECT, SEED, SIGNATURE, folderName, fullTime, lang, messageText, viewName } = useMail();
  const en = lang === 'en';
  /** ≥ 768：列表和阅读区并排；更窄就是单栏，“推进 / 返回” */
  const twoPane = useBreakpoint('md');
  const roomy = useBreakpoint('xl');

  // 切换语言时整个示例会重新挂载，所以按当前语言播一次种就够了
  const [mails, setMails] = useState<Mail[]>(SEED);
  const [view, setView] = useState<ViewId>('inbox');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ListFilter>('all');
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState<{ id: string; tick: number } | null>(null);
  const [settings, setSettings] = useState<MailSettings>(DEFAULT_SETTINGS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [compose, setCompose] = useState<(ComposeSession & { draftId?: string }) | null>(null);
  const [live, setLive] = useState({ text: '', n: 0 });
  const searchRef = useRef<HTMLInputElement>(null);
  const composeSeq = useRef(0);
  const incoming = useRef(0);
  const tick = useRef(0);

  const announce = (text: string) => setLive((prev) => ({ text, n: prev.n + 1 }));
  const undoMs = Number(settings.undoSeconds) * 1000;

  /* ------------------------------------------------------------------ 派生数据 */
  const inFolder = useMemo(() => mails.filter((m) => inView(m, view)).sort((a, b) => mailTime(b) - mailTime(a)), [mails, view]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inFolder.filter((m) => {
      if (filter === 'unread' && !m.unread) return false;
      if (filter === 'starred' && !m.starred) return false;
      if (!q) return true;
      const hay = [m.subject, ...m.messages.flatMap((x) => [x.from.name, x.from.email, messageText(x)])].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [inFolder, query, filter]);
  const counts = useMemo(() => {
    const c: Record<FolderId, number> = { inbox: 0, sent: 0, drafts: 0, archive: 0, spam: 0, trash: 0 };
    for (const m of mails) {
      if (m.folder === 'drafts') c.drafts++;
      else if ((m.folder === 'inbox' || m.folder === 'spam') && m.unread) c[m.folder]++;
    }
    return c;
  }, [mails]);
  const openMail = openId ? mails.find((m) => m.id === openId) ?? null : null;
  const unreadHere = inFolder.filter((m) => m.unread).length;
  const title = viewName(view);
  const summary = t(
    `${inFolder.length} 封${unreadHere ? `，${unreadHere} 封未读` : ''}`,
    `${inFolder.length === 1 ? '1 email' : `${inFolder.length} emails`}${unreadHere ? `, ${unreadHere} unread` : ''}`,
  );
  const folder = view === 'starred' || view.startsWith('label:') ? null : (view as FolderId);
  const showReader = !twoPane && openMail !== null;

  // 搜索 / 筛选的结果数读给读屏听
  const filtering = query.trim() !== '' || filter !== 'all';
  useEffect(() => {
    if (filtering) announce(visible.length
      ? t(`找到 ${visible.length} 封邮件`, visible.length === 1 ? 'Found 1 email' : `Found ${visible.length} emails`)
      : t('没有符合条件的邮件', 'No matching emails'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering, visible.length, query, filter]);

  /* ------------------------------------------------------------------ 改数据 */
  /** 把这几封恢复成之前的样子（被彻底移除的也放回来） */
  const restore = (before: Mail[]) => {
    setMails((cur) => {
      const map = new Map(before.map((m) => [m.id, m]));
      const kept = cur.map((m) => map.get(m.id) ?? m);
      return [...kept, ...before.filter((m) => !cur.some((c) => c.id === m.id))];
    });
    announce(t('已撤销', 'Undone'));
  };
  /** 改一批邮件，弹一条带“撤销”的通知 */
  const change = (ids: string[], update: (m: Mail) => Mail | null, message: string, opts: { leaves?: boolean; undo?: boolean } = {}) => {
    const set = new Set(ids);
    const before = mails.filter((m) => set.has(m.id));
    if (before.length === 0) return;
    setMails((cur) => cur.flatMap((m) => { if (!set.has(m.id)) return [m]; const next = update(m); return next ? [next] : []; }));
    if (opts.leaves) {
      setSelected((prev) => new Set([...prev].filter((id) => !set.has(id))));
      if (openId && set.has(openId)) {
        // 正在读的这封被移走了：收起阅读区，焦点交给列表里相邻的一行
        const at = visible.findIndex((m) => m.id === openId);
        const neighbor = visible.slice(at + 1).find((m) => !set.has(m.id)) ?? visible.slice(0, Math.max(at, 0)).reverse().find((m) => !set.has(m.id));
        setOpenId(null);
        if (neighbor) setFocusRequest({ id: neighbor.id, tick: ++tick.current });
      }
    }
    toast({
      title: message, duration: undoMs,
      action: opts.undo === false ? undefined : { label: t('撤销', 'Undo'), onClick: () => restore(before) },
    });
  };
  // 句中的“邮件 / 3 封邮件”（英文 email / 3 emails），以及英文放在句首时的写法
  const n = (ids: string[]) => (ids.length > 1 ? t(`${ids.length} 封邮件`, `${ids.length} emails`) : t('邮件', 'email'));
  const N = (ids: string[]) => (ids.length > 1 ? `${ids.length} emails` : 'Email');

  const onMove = (ids: string[], to: FolderId) =>
    change(ids, (m) => ({ ...m, folder: to }), t(`已把${n(ids)}移到“${folderName(to)}”`, `Moved ${n(ids)} to “${folderName(to)}”`), { leaves: to !== folder });
  const onArchive = (ids: string[]) => change(ids, (m) => ({ ...m, folder: 'archive' }), t(`已归档${n(ids)}`, `${N(ids)} archived`), { leaves: true });
  const onDelete = async (ids: string[]) => {
    const forever = mails.filter((m) => ids.includes(m.id) && m.folder === 'trash').map((m) => m.id);
    if (forever.length > 0 && forever.length === ids.length) {
      const ok = await confirm({
        title: t(`彻底删除${n(ids)}？`, `Permanently delete ${ids.length > 1 ? `${ids.length} emails` : 'this email'}?`),
        description: t('删除后无法恢复。', 'This can’t be undone.'), confirmText: t('彻底删除', 'Delete forever'), tone: 'danger',
        icon: <Icon name="trash" />,
      });
      if (!ok) return;
      change(ids, () => null, t(`已彻底删除${n(ids)}`, `${N(ids)} permanently deleted`), { leaves: true, undo: false });
      return;
    }
    change(ids, (m) => ({ ...m, folder: 'trash' }), t(`已删除${n(ids)}`, `${N(ids)} deleted`), { leaves: true });
  };
  const onRead = (ids: string[], read: boolean) => {
    const leaves = !read && openId !== null && ids.includes(openId);
    change(ids, (m) => ({ ...m, unread: !read }), t(`已把${n(ids)}标为${read ? '已读' : '未读'}`, `Marked ${n(ids)} as ${read ? 'read' : 'unread'}`), { leaves });
    if (read) setSelected(new Set());
  };
  const onStar = (ids: string[], on: boolean) => {
    const set = new Set(ids);
    setMails((cur) => cur.map((m) => (set.has(m.id) ? { ...m, starred: on } : m)));
    announce(on ? t('已加星标', 'Starred') : t('已取消星标', 'Unstarred'));
  };

  /* ------------------------------------------------------------------ 写邮件 */
  const startCompose = (titleText = t('新邮件', 'New message'), initial?: Draft, draftId?: string) => {
    if (compose) { toast.info({ title: t('还有一封没写完', 'You’re still writing an email'), description: t('先发送、存为草稿或关闭正在写的这封。', 'Send it, save it as a draft, or close it first.') }); return; }
    const base = initial ?? { ...EMPTY_DRAFT, body: settings.signature ? SIGNATURE : '' };
    setCompose({ key: ++composeSeq.current, title: titleText, initial: base, draftId });
  };
  const quote = (m: Mail) => {
    const last = lastMessage(m);
    const header = t(`${fullTime(last.at)}，${last.from.name} 写道：`, `On ${fullTime(last.at)}, ${last.from.name} wrote:`);
    // 按句子断行：中文在“。”后断，英文在句末标点后的空格处断
    const lines = en ? messageText(last).split(/(?<=[.!?])\s+/) : messageText(last).split(/(?<=。)/);
    return `${settings.signature ? SIGNATURE : ''}\n\n${header}\n${lines.map((x) => `> ${x}`).join('\n')}`;
  };
  const onReply = (m: Mail) => {
    const last = lastMessage(m);
    const to = last.from.email === ME.email ? last.to : [last.from];
    const prefixed = en ? /^re:/i.test(m.subject) : /^回复[:：]/.test(m.subject);
    startCompose(t('回复', 'Reply'), { to, subject: prefixed ? m.subject : t(`回复：${m.subject}`, `Re: ${m.subject}`), body: quote(m), files: [] });
  };
  const onForward = (m: Mail) => {
    const files = (lastMessage(m).attachments ?? []).map((f) => ({ name: f.name, size: f.size }));
    const prefixed = en ? /^fwd?:/i.test(m.subject) : /^转发[:：]/.test(m.subject);
    startCompose(t('转发', 'Forward'), { to: [], subject: prefixed ? m.subject : t(`转发：${m.subject}`, `Fwd: ${m.subject}`), body: quote(m), files });
  };
  const draftToMail = (draft: Draft, to: FolderId): Mail => ({
    id: newId('c'), folder: to, subject: draft.subject.trim() || NO_SUBJECT, unread: false, starred: false, labels: [],
    messages: [{
      id: newId('m'), from: ME, to: draft.to, at: Date.now(),
      body: draft.body.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean),
      attachments: draft.files.length ? draft.files.map((f) => ({ ...f, kind: 'doc' as const })) : undefined,
    }],
  });
  const onSend = (draft: Draft) => {
    const session = compose;
    const sent = draftToMail(draft, 'sent');
    const replaced = session?.draftId ? mails.find((m) => m.id === session.draftId) : undefined;
    setMails((cur) => [...cur.filter((m) => m.id !== session?.draftId), sent]);
    setCompose(null);
    toast.success({
      title: t('邮件已发送', 'Email sent'), description: t(`发给 ${draft.to.map((x) => x.name).join('、')}`, `To ${draft.to.map((x) => x.name).join(', ')}`), duration: undoMs,
      action: {
        label: t('撤销', 'Undo'),
        onClick: () => {
          setMails((cur) => [...cur.filter((m) => m.id !== sent.id), ...(replaced ? [replaced] : [])]);
          setCompose({ key: ++composeSeq.current, title: session?.title ?? t('新邮件', 'New message'), initial: draft, draftId: session?.draftId, unsaved: true });
          announce(t('已撤销发送，邮件回到编辑状态', 'Send undone. The email is back in the editor.'));
        },
      },
    });
  };
  const onSaveDraft = (draft: Draft) => {
    const saved = draftToMail(draft, 'drafts');
    setMails((cur) => [...cur.filter((m) => m.id !== compose?.draftId), saved]);
    setCompose(null);
    toast({ title: t('已存为草稿', 'Saved as draft') });
  };

  /* ------------------------------------------------------------------ 导航 */
  const changeView = (next: ViewId) => {
    setView(next);
    setSelected(new Set());
    setOpenId(null);
    setQuery('');
    setFilter('all');
  };
  const onOpen = (id: string) => {
    const m = mails.find((x) => x.id === id);
    if (!m) return;
    if (m.folder === 'drafts') {
      // 草稿直接回到编辑状态
      const last = lastMessage(m);
      startCompose(t('编辑草稿', 'Edit draft'), { to: last.to, subject: m.subject === NO_SUBJECT ? '' : m.subject, body: last.body.map((b) => (typeof b === 'string' ? b : '')).join('\n\n'), files: [] }, m.id);
      return;
    }
    setOpenId(id);
    if (m.unread) setMails((cur) => cur.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  };
  const goBack = () => {
    if (openId) setFocusRequest({ id: openId, tick: ++tick.current });
    setOpenId(null);
  };
  const onRefresh = () => {
    const next = INCOMING[incoming.current];
    if (!next) { toast({ title: t('没有新邮件', 'No new mail'), description: t('已经是最新的了。', 'You’re up to date.') }); return; }
    incoming.current++;
    const arrived: Mail = {
      id: newId('c'), folder: 'inbox', subject: next.subject, unread: true, starred: false, labels: next.labels,
      messages: [{ id: newId('m'), from: next.from, to: [ME], at: Date.now(), body: next.body }],
    };
    setMails((cur) => [...cur, arrived]);
    if (settings.notify) {
      toast.info({
        title: t(`新邮件：${next.from.name}`, `New email from ${next.from.name}`), description: next.subject, icon: <Icon name="mail" />,
        action: { label: t('查看', 'View'), onClick: () => { setView('inbox'); setQuery(''); setFilter('all'); setOpenId(arrived.id); setMails((cur) => cur.map((x) => (x.id === arrived.id ? { ...x, unread: false } : x))); } },
      });
    } else announce(t(`收到 1 封新邮件：${next.from.name}，${next.subject}`, `1 new email from ${next.from.name}: ${next.subject}`));
  };
  const onDownload = (f: Attachment) => toast({ title: t(`开始下载 ${f.name}`, `Downloading ${f.name}`), description: t(`${f.size} · 演示环境不会真的下载`, `${f.size} · Nothing is actually downloaded in this demo`) });

  /* ------------------------------------------------------------------ 全局快捷键 */
  const onKey = useEvent((e: KeyboardEvent) => {
    if (e.defaultPrevented) return;
    const target = e.target as HTMLElement | null;
    // 在输入框、浮层、菜单里打字时不抢键；有模态浮层开着时也不动
    if (target?.closest?.('input, textarea, select, [contenteditable="true"], .ok-float__card, .ok-popup, [role="menu"], [role="listbox"]')) return;
    if (document.querySelector('.ok-float--modal[data-state="open"]')) return;
    if (matchesHotkey(e, settings.composeKey)) { e.preventDefault(); startCompose(); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/') { e.preventDefault(); if (showReader) goBack(); window.setTimeout(() => searchRef.current?.focus(), 30); return; }
    if (!openMail) return;
    const one = [openMail.id];
    switch (e.key) {
      case 'r': onReply(openMail); break;
      case 'f': onForward(openMail); break;
      case 'e': if (openMail.folder === 'archive') return; onArchive(one); break;
      case '#': void onDelete(one); break;
      case 's': onStar(one, !openMail.starred); break;
      case 'u': onRead(one, false); break;
      case 'Escape': if (!showReader) return; goBack(); break;
      default: return;
    }
    e.preventDefault();
  });
  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKey]);

  /* ------------------------------------------------------------------ 渲染 */
  const actions = { onOpen, onStar, onRead, onArchive, onDelete: (ids: string[]) => void onDelete(ids), onMove };
  const list = (
    <Box as="section" aria-label={t('邮件列表', 'Message list')} className="mail-pane" surface="surface" radius={5} border highlight>
      <MailList
        {...actions}
        title={title} summary={summary} folder={folder} mails={visible} openId={openId}
        selected={selected}
        onSelect={(id, on) => setSelected((prev) => { const next = new Set(prev); if (on) next.add(id); else next.delete(id); return next; })}
        onSelectAll={(on) => setSelected(on ? new Set(visible.map((m) => m.id)) : new Set())}
        query={query} onQuery={setQuery} filter={filter} onFilter={setFilter}
        onRefresh={onRefresh} onCompose={() => startCompose()} settings={settings} searchRef={searchRef}
        leading={<AppShell.Trigger drawerOnly label={t('打开文件夹', 'Open folders')} className="ok-btn--sm" />}
        focusRequest={focusRequest}
      />
    </Box>
  );
  const reader = (
    <Box as="section" aria-label={t('阅读区', 'Reading pane')} className="mail-pane" surface="surface" radius={5} border highlight>
      <Reader
        {...actions}
        mail={openMail} onBack={twoPane ? undefined : goBack} roomy={roomy} conversation={settings.conversation}
        onReply={onReply} onForward={onForward} onDownload={onDownload}
      />
    </Box>
  );
  const tab = view === 'inbox' || view === 'starred' || view === 'sent' ? view : '';

  return (
    <AppShell collapseBelow="lg" className="mail-app" data-density={settings.density}>
      <AppShell.Sidebar label={t('邮箱导航', 'Mail navigation')} width={248} className="mail-sidebar">
        <Sidebar
          view={view} onView={changeView} counts={counts} composeKey={settings.composeKey}
          onCompose={() => startCompose()} onSettings={() => setSettingsOpen(true)}
        />
      </AppShell.Sidebar>

      <AppShell.Main className="mail-main">
        <h1 className="ok-sr">{t('邮箱', 'Mail')}</h1>
        {twoPane ? (
          <SplitPane defaultValue={roomy ? 38 : 48} min={30} max={62} stackBelow={false} separatorLabel={t('调整邮件列表的宽度', 'Resize the message list')}>
            {list}
            {reader}
          </SplitPane>
        ) : showReader ? reader : list}
        <VisuallyHidden role="status" aria-live="polite">{live.text}{live.n % 2 ? '​' : ''}</VisuallyHidden>
      </AppShell.Main>

      {!twoPane && !showReader && (
        <AppShell.Footer className="mail-tabs">
          <TabBar
            position="static" aria-label={t('常用文件夹', 'Main folders')} value={tab} onChange={(v) => changeView(v as ViewId)}
            action={<Button variant="primary" size="lg" iconOnly aria-label={t('写邮件', 'Compose')} onClick={() => startCompose()}><Icon name="edit" /></Button>}
          >
            <TabBar.Item value="inbox" icon={<InboxIcon />} badge={counts.inbox ? <Count value={counts.inbox} label={t(`${counts.inbox} 封未读`, `${counts.inbox} unread`)} /> : undefined}>{t('收件箱', 'Inbox')}</TabBar.Item>
            <TabBar.Item value="starred" icon={<StarIcon />}>{t('星标', 'Starred')}</TabBar.Item>
            <TabBar.Item value="sent" icon={<SendIcon />}>{t('已发送', 'Sent')}</TabBar.Item>
          </TabBar>
        </AppShell.Footer>
      )}

      <Compose session={compose} wide={twoPane} onClose={() => setCompose(null)} onSend={onSend} onSaveDraft={onSaveDraft} />
      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} value={settings} onChange={setSettings} />
    </AppShell>
  );
}
