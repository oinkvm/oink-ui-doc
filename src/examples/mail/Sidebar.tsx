import { Avatar, Button, Count, Icon, Nav, NavGroup, NavItem, Tooltip, useAppShell } from 'oink-ui';
import { useT } from '../../i18n';
import { useMail } from './data';
import type { FolderId, ViewId } from './data';
import { FolderGlyph, StarIcon } from './icons';

export interface SidebarProps {
  view: ViewId;
  onView: (view: ViewId) => void;
  /** 各文件夹要显示的数字：收件箱 / 垃圾邮件是未读数，草稿是封数 */
  counts: Record<FolderId, number>;
  onCompose: () => void;
  onSettings: () => void;
  composeKey: string;
}

/** 侧栏内容：停靠时在 AppShell.Sidebar 的卡片里，窄屏时同一份内容进抽屉 */
export function Sidebar({ view, onView, counts, onCompose, onSettings, composeKey }: SidebarProps) {
  const t = useT();
  const { FOLDERS, LABELS, ME } = useMail();
  const shell = useAppShell();
  const unread = (n: number) => t(`${n} 封未读`, `${n} unread`);
  const badge = (id: FolderId) => {
    const n = counts[id];
    if (!n) return undefined;
    if (id === 'inbox') return <Count value={n} label={unread(n)} />;
    return <Count value={n} tone="neutral" label={id === 'drafts' ? t(`${n} 封草稿`, n === 1 ? '1 draft' : `${n} drafts`) : unread(n)} />;
  };
  return (
    <>
      <div className="mail-brand">
        <span className="mail-brand__mark" aria-hidden="true"><Icon name="mail" /></span>
        <span className="mail-brand__name">{t('Oink 邮箱', 'Oink Mail')}</span>
      </div>

      <Button
        variant="primary" block leading={<Icon name="edit" />}
        aria-keyshortcuts={composeKey || undefined}
        onClick={() => { shell.closeSidebar(); onCompose(); }}
      >
        {t('写邮件', 'Compose')}
      </Button>

      <Nav aria-label={t('文件夹与标签', 'Folders and labels')} className="mail-nav">
        <NavGroup>
          <NavItem icon={<FolderGlyph id="inbox" />} current={view === 'inbox'} badge={badge('inbox')} onClick={() => onView('inbox')}>{t('收件箱', 'Inbox')}</NavItem>
          <NavItem icon={<StarIcon />} current={view === 'starred'} onClick={() => onView('starred')}>{t('星标邮件', 'Starred')}</NavItem>
          {FOLDERS.filter((f) => f.id !== 'inbox').map((f) => (
            <NavItem key={f.id} icon={<FolderGlyph id={f.id} />} current={view === f.id} badge={badge(f.id)} onClick={() => onView(f.id)}>{f.name}</NavItem>
          ))}
        </NavGroup>
        <NavGroup label={t('标签', 'Labels')}>
          {LABELS.map((l) => (
            <NavItem
              key={l.id} current={view === `label:${l.id}`} onClick={() => onView(`label:${l.id}`)}
              icon={<span className="mail-dot" data-tone={l.tone} />}
            >
              {l.name}
            </NavItem>
          ))}
        </NavGroup>
      </Nav>

      <div className="mail-account">
        <Avatar name={ME.name} size="md" status="online" />
        <span className="mail-account__text">
          <span className="mail-account__name">{ME.name}</span>
          <span className="mail-account__mail">{ME.email}</span>
        </span>
        <Tooltip content={t('设置', 'Settings')}>
          <Button variant="ghost" size="sm" iconOnly aria-label={t('设置', 'Settings')} onClick={() => { shell.closeSidebar(); onSettings(); }}>
            <Icon name="sliders" />
          </Button>
        </Tooltip>
      </div>
    </>
  );
}
