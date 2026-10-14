import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode, RefObject } from 'react';
import {
  Avatar, Button, Checkbox, ContextMenu, DropdownMenu, EmptyState, Icon, MenuItem, MenuLabel, MenuSeparator, MenuSub,
  SearchInput, Segmented, Spacer, Tag, ToggleButton, Toolbar, Tooltip, VisuallyHidden,
} from 'oink-ui';
import { useT } from '../../i18n';
import { hasAttachment, isoTime, mailTime, useMail } from './data';
import type { FolderId, ListFilter, Mail, MailSettings } from './data';
import { ArchiveIcon, ClipIcon, FolderGlyph, FolderIcon, InboxIcon, MailOpenIcon, StarIcon } from './icons';

export interface MailActions {
  onOpen: (id: string) => void;
  onStar: (ids: string[], on: boolean) => void;
  onRead: (ids: string[], read: boolean) => void;
  onArchive: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
  onMove: (ids: string[], folder: FolderId) => void;
}

export interface MailListProps extends MailActions {
  title: string;
  /** 标题后面的一句统计，如“22 封，6 封未读” */
  summary: string;
  /** 当前文件夹（星标 / 标签视图为 null），用来决定“移动到”里排除谁、归档按钮要不要出现 */
  folder: FolderId | null;
  mails: Mail[];
  openId: string | null;
  selected: Set<string>;
  onSelect: (id: string, on: boolean) => void;
  onSelectAll: (on: boolean) => void;
  query: string;
  onQuery: (q: string) => void;
  filter: ListFilter;
  onFilter: (f: ListFilter) => void;
  onRefresh: () => void;
  onCompose: () => void;
  settings: MailSettings;
  searchRef: RefObject<HTMLInputElement>;
  /** 标题前的插槽（窄屏放打开侧栏的按钮） */
  leading?: ReactNode;
  /** 父级要求把焦点放到某一行（手机上从阅读区返回时） */
  focusRequest: { id: string; tick: number } | null;
}

/** “移动到”菜单里的目标文件夹 */
function MoveItems({ from, onPick }: { from: FolderId | null; onPick: (f: FolderId) => void }) {
  const { FOLDERS } = useMail();
  return (
    <>
      {FOLDERS.filter((f) => f.id !== from && f.id !== 'sent' && f.id !== 'drafts').map((f) => (
        <MenuItem key={f.id} icon={<FolderGlyph id={f.id} />} onSelect={() => onPick(f.id)}>{f.name}</MenuItem>
      ))}
    </>
  );
}

export function MailList(props: MailListProps) {
  const {
    title, summary, folder, mails, openId, selected, onSelect, onSelectAll, query, onQuery, filter, onFilter, onRefresh, onCompose,
    settings, searchRef, leading, focusRequest, onOpen, onStar, onRead, onArchive, onDelete, onMove,
  } = props;
  const t = useT();
  const { counterpart, labelOf, shortTime, snippetOf } = useMail();
  const FILTERS: Array<{ value: ListFilter; label: string }> = [
    { value: 'all', label: t('全部', 'All') },
    { value: 'unread', label: t('未读', 'Unread') },
    { value: 'starred', label: t('星标', 'Starred') },
  ];
  const listRef = useRef<HTMLUListElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  /** 键盘删掉 / 归档当前行之后，焦点要落到哪一行 */
  const pendingFocus = useRef<string | null>(null);

  const ids = mails.map((m) => m.id);
  const tabStop = activeId && ids.includes(activeId) ? activeId : openId && ids.includes(openId) ? openId : ids[0];
  const selectedHere = ids.filter((id) => selected.has(id));
  const allSelected = ids.length > 0 && selectedHere.length === ids.length;
  const canArchive = folder !== 'archive' && folder !== 'drafts';

  const focusRow = (id: string) => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-mail-id="${id}"]`);
    if (node) { node.focus(); setActiveId(id); }
    return !!node;
  };
  useEffect(() => {
    if (pendingFocus.current && focusRow(pendingFocus.current)) pendingFocus.current = null;
  });
  useEffect(() => {
    if (focusRequest) focusRow(focusRequest.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRequest]);

  /** 当前行要被移走时：先记下相邻的一行 */
  const leaveRow = (id: string) => {
    const at = ids.indexOf(id);
    pendingFocus.current = ids[at + 1] ?? ids[at - 1] ?? null;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const id = target.dataset.mailId;
    if (!id || e.altKey || e.ctrlKey || e.metaKey) return;
    const at = ids.indexOf(id);
    const mail = mails[at];
    if (!mail) return;
    let next: number | null = null;
    switch (e.key) {
      case 'ArrowDown': case 'j': next = Math.min(ids.length - 1, at + 1); break;
      case 'ArrowUp': case 'k': next = Math.max(0, at - 1); break;
      case 'Home': next = 0; break;
      case 'End': next = ids.length - 1; break;
      case 'x': onSelect(id, !selected.has(id)); break;
      case 's': onStar([id], !mail.starred); break;
      case 'u': onRead([id], mail.unread); break;
      case 'e': if (!canArchive) return; leaveRow(id); onArchive([id]); break;
      case 'Delete': case 'Backspace': leaveRow(id); onDelete([id]); break;
      default: return;
    }
    e.preventDefault();
    e.stopPropagation();   // 这些键在全局也有绑定，行内处理过就别再触发一次
    if (next !== null) focusRow(ids[next]);
  };

  const empty = (() => {
    if (query.trim()) {
      return (
        <EmptyState
          icon={<Icon name="search" />} title={t(`没有找到“${query.trim()}”`, `No results for “${query.trim()}”`)} titleAs="h3"
          description={t('换个关键词，或者去别的文件夹看看。', 'Try a different keyword, or look in another folder.')}
          actions={<Button size="sm" onClick={() => onQuery('')}>{t('清除搜索', 'Clear search')}</Button>}
        />
      );
    }
    if (filter !== 'all') {
      return (
        <EmptyState
          icon={filter === 'unread' ? <MailOpenIcon /> : <StarIcon />} titleAs="h3"
          title={filter === 'unread' ? t('没有未读邮件', 'No unread email') : t('这里没有星标邮件', 'No starred email here')}
          description={filter === 'unread' ? t('都看完了，可以歇一会儿。', 'You’re all caught up. Take a break.') : t('给重要的邮件点上星标，之后在这里找。', 'Star important emails to find them here later.')}
          actions={<Button size="sm" onClick={() => onFilter('all')}>{t('查看全部', 'Show all')}</Button>}
        />
      );
    }
    return (
      <EmptyState
        icon={folder ? <FolderGlyph id={folder} /> : <InboxIcon />} title={t(`“${title}”里还没有邮件`, `Nothing in “${title}” yet`)} titleAs="h3"
        description={folder === 'trash'
          ? t('删除的邮件会先放在这里。', 'Deleted emails land here first.')
          : folder === 'spam' ? t('可疑的邮件会被自动放到这里。', 'Suspicious emails are moved here automatically.') : t('新邮件到了会出现在这里。', 'New emails will show up here.')}
        actions={folder === 'inbox' || folder === 'sent' || folder === 'drafts' ? <Button size="sm" variant="primary" onClick={onCompose}>{t('写一封邮件', 'Write an email')}</Button> : undefined}
      />
    );
  })();

  return (
    <div className="mail-list">
      <div className="mail-list__head">
        <div className="mail-list__title">
          {leading}
          <h2 className="mail-h">{title}</h2>
          <span className="mail-list__summary">{summary}</span>
          <Spacer />
          <Tooltip content={t('检查新邮件', 'Check for new mail')}>
            <Button variant="ghost" size="sm" iconOnly aria-label={t('检查新邮件', 'Check for new mail')} onClick={onRefresh}><Icon name="replay" /></Button>
          </Tooltip>
        </div>
        <div role="search">
          <SearchInput ref={searchRef} value={query} onChange={onQuery} placeholder={t('搜索邮件', 'Search mail')} aria-label={t(`在${title}中搜索`, `Search ${title}`)} aria-keyshortcuts="/" />
        </div>

        {selectedHere.length > 0 ? (
          <Toolbar aria-label={t('批量操作', 'Bulk actions')} className="mail-list__bar">
            <Checkbox aria-label={t('全选', 'Select all')} checked={allSelected} indeterminate={!allSelected} onChange={(on) => onSelectAll(on)} />
            <span className="mail-list__count" aria-live="polite">{t(`已选 ${selectedHere.length} 封`, `${selectedHere.length} selected`)}</span>
            <Spacer />
            {canArchive && (
              <Tooltip content={t('归档', 'Archive')}>
                <Button variant="ghost" size="sm" iconOnly aria-label={t('归档所选', 'Archive selected')} onClick={() => onArchive(selectedHere)}><ArchiveIcon /></Button>
              </Tooltip>
            )}
            <Tooltip content={t('删除', 'Delete')}>
              <Button variant="ghost" size="sm" iconOnly aria-label={t('删除所选', 'Delete selected')} onClick={() => onDelete(selectedHere)}><Icon name="trash" /></Button>
            </Tooltip>
            <Tooltip content={t('标为已读', 'Mark as read')}>
              <Button variant="ghost" size="sm" iconOnly aria-label={t('把所选标为已读', 'Mark selected as read')} onClick={() => onRead(selectedHere, true)}><MailOpenIcon /></Button>
            </Tooltip>
            <DropdownMenu
              aria-label={t('移动到', 'Move to')} placement="bottom-end" matchTriggerWidth={false}
              trigger={<Button variant="ghost" size="sm" iconOnly aria-label={t('移动到…', 'Move to…')}><FolderIcon /></Button>}
            >
              <MenuLabel>{t('移动到', 'Move to')}</MenuLabel>
              <MoveItems from={folder} onPick={(f) => onMove(selectedHere, f)} />
            </DropdownMenu>
            <Tooltip content={t('取消选择', 'Clear selection')}>
              <Button variant="ghost" size="sm" iconOnly aria-label={t('取消选择', 'Clear selection')} onClick={() => onSelectAll(false)}><Icon name="x" /></Button>
            </Tooltip>
          </Toolbar>
        ) : (
          <div className="mail-list__bar">
            <Checkbox aria-label={t('全选', 'Select all')} checked={false} disabled={ids.length === 0} onChange={(on) => onSelectAll(on)} />
            <Segmented size="sm" aria-label={t('筛选', 'Filter')} options={FILTERS} value={filter} onChange={onFilter} />
          </div>
        )}
      </div>

      <div className="mail-list__scroll ok-scroll">
        {mails.length === 0 ? empty : (
          <ul ref={listRef} className="mail-rows" aria-label={t(`${title}，共 ${mails.length} 封`, `${title}, ${mails.length === 1 ? '1 email' : `${mails.length} emails`}`)} data-density={settings.density} onKeyDown={onKeyDown}>
            {mails.map((m) => {
              const who = counterpart(m);
              const isOpen = m.id === openId;
              const isSelected = selected.has(m.id);
              const tab = m.id === tabStop ? 0 : -1;
              const one = [m.id];
              return (
                <ContextMenu
                  key={m.id}
                  aria-label={t(`邮件操作：${m.subject}`, `Actions for: ${m.subject}`)}
                  menu={
                    <>
                      <MenuItem icon="mail" onSelect={() => onOpen(m.id)}>{t('打开', 'Open')}</MenuItem>
                      <MenuItem icon={<MailOpenIcon />} shortcut="U" onSelect={() => onRead(one, m.unread)}>{m.unread ? t('标为已读', 'Mark as read') : t('标为未读', 'Mark as unread')}</MenuItem>
                      <MenuItem icon={<StarIcon />} shortcut="S" onSelect={() => onStar(one, !m.starred)}>{m.starred ? t('取消星标', 'Unstar') : t('加星标', 'Star')}</MenuItem>
                      <MenuItem icon="check" shortcut="X" onSelect={() => onSelect(m.id, !isSelected)}>{isSelected ? t('取消选择', 'Deselect') : t('选择', 'Select')}</MenuItem>
                      <MenuSeparator />
                      {canArchive && <MenuItem icon={<ArchiveIcon />} shortcut="E" onSelect={() => onArchive(one)}>{t('归档', 'Archive')}</MenuItem>}
                      <MenuSub icon={<FolderIcon />} label={t('移动到', 'Move to')}>
                        <MoveItems from={m.folder} onPick={(f) => onMove(one, f)} />
                      </MenuSub>
                      <MenuSeparator />
                      <MenuItem icon="trash" tone="danger" shortcut="Del" onSelect={() => onDelete(one)}>{m.folder === 'trash' ? t('彻底删除', 'Delete forever') : t('删除', 'Delete')}</MenuItem>
                    </>
                  }
                >
                  <li className="mail-row" data-unread={m.unread ? '' : undefined} data-selected={isSelected ? '' : undefined} data-open={isOpen ? '' : undefined}>
                    <Checkbox
                      rootClassName="mail-row__check" aria-label={t(`选择：${m.subject}`, `Select: ${m.subject}`)} tabIndex={tab}
                      checked={isSelected} onChange={(on) => onSelect(m.id, on)}
                    />
                    <button
                      type="button" className="mail-row__main ok-focusable" data-mail-id={m.id} tabIndex={tab}
                      aria-current={isOpen ? 'true' : undefined} aria-keyshortcuts="Enter"
                      onClick={() => onOpen(m.id)} onFocus={() => setActiveId(m.id)}
                    >
                      <Avatar name={who.person.name} color="auto" size={36} aria-hidden="true" />
                      <span className="mail-row__text">
                        <span className="mail-row__top">
                          <span className="mail-row__from">
                            {m.unread && <><span className="mail-row__dot" aria-hidden="true" /><VisuallyHidden>{t('未读，', 'Unread, ')}</VisuallyHidden></>}
                            <span className="mail-row__name">{who.prefix}{who.person.name}</span>
                            {m.messages.length > 1 && <span className="mail-row__n" aria-label={t(`，${m.messages.length} 封往来`, `, ${m.messages.length} messages`)}>{m.messages.length}</span>}
                          </span>
                          <time className="mail-row__time" dateTime={isoTime(mailTime(m))}>{shortTime(mailTime(m))}</time>
                        </span>
                        <span className="mail-row__subject">{m.subject}</span>
                        {settings.showSnippet && <span className="mail-row__snippet">{snippetOf(m)}</span>}
                        {(hasAttachment(m) || m.labels.length > 0) && (
                          <span className="mail-row__meta">
                            {hasAttachment(m) && <Tag size="sm" icon={<ClipIcon />}>{t('附件', 'Attachment')}</Tag>}
                            {m.labels.map((l) => <Tag key={l} size="sm" tone={labelOf(l).tone}>{labelOf(l).name}</Tag>)}
                          </span>
                        )}
                      </span>
                    </button>
                    <ToggleButton
                      className="mail-row__star" variant="ghost" size="sm" iconOnly tabIndex={tab}
                      aria-label={t(`星标：${m.subject}`, `Star: ${m.subject}`)} pressed={m.starred} onChange={(on) => onStar(one, on)}
                    >
                      <StarIcon filled={m.starred} />
                    </ToggleButton>
                  </li>
                </ContextMenu>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
