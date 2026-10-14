import { Button, ColorSwatches, Dialog, Group, Hotkey, Row, Segmented, Select, Switch, useOink } from 'oink-ui';
import type { Accent, ThemeMode } from 'oink-ui';
import { useT } from '../../i18n';
import { DEFAULT_SETTINGS, useMail } from './data';
import type { MailSettings } from './data';

export interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: MailSettings;
  onChange: (next: MailSettings) => void;
}

const UNDO_SECONDS = ['5', '8', '15', '30'];

/** 设置：居中的对话框，窄屏自动变成底部弹层 */
export function Settings({ open, onOpenChange, value, onChange }: SettingsProps) {
  const t = useT();
  const { ACCENT_SWATCHES } = useMail();
  const { theme, setTheme, accent, setAccent } = useOink();
  const THEMES: Array<{ value: ThemeMode; label: string }> = [
    { value: 'light', label: t('浅色', 'Light') },
    { value: 'dark', label: t('深色', 'Dark') },
    { value: 'system', label: t('跟随系统', 'System') },
  ];
  const DENSITIES: Array<{ value: MailSettings['density']; label: string }> = [
    { value: 'comfortable', label: t('舒适', 'Comfortable') },
    { value: 'compact', label: t('紧凑', 'Compact') },
  ];
  const UNDO = UNDO_SECONDS.map((v) => ({ value: v, label: t(`${v} 秒`, `${v} seconds`) }));
  const set = <K extends keyof MailSettings>(key: K, v: MailSettings[K]) => onChange({ ...value, [key]: v });
  return (
    <Dialog
      open={open} onOpenChange={onOpenChange} size="lg" title={t('设置', 'Settings')} closable closeLabel={t('关闭设置', 'Close settings')}
      className="mail-settings"
      actions={
        <>
          <Button variant="ghost" onClick={() => onChange(DEFAULT_SETTINGS)}>{t('恢复默认', 'Restore defaults')}</Button>
          <Button variant="primary" onClick={() => onOpenChange(false)}>{t('完成', 'Done')}</Button>
        </>
      }
    >
      <section aria-labelledby="mail-set-look">
        <h3 id="mail-set-look" className="mail-settings__h">{t('外观', 'Appearance')}</h3>
        <Group compact>
          <Row label={t('主题', 'Theme')} stack>
            <Segmented block aria-label={t('主题', 'Theme')} options={THEMES} value={theme} onChange={(t) => setTheme(t)} />
          </Row>
          <Row label={t('强调色', 'Accent color')} description={t('主操作和未读标记用的颜色', 'Used for primary actions and unread markers')}>
            <ColorSwatches aria-label={t('强调色', 'Accent color')} size="sm" colors={ACCENT_SWATCHES} value={accent} onChange={(a) => setAccent(a as Accent)} />
          </Row>
          <Row label={t('列表密度', 'List density')}>
            <Segmented size="sm" aria-label={t('列表密度', 'List density')} options={DENSITIES} value={value.density} onChange={(d) => set('density', d)} />
          </Row>
          <Row label={t('显示摘要', 'Show preview')} description={t('在主题下面多显示一行正文', 'Show a line of the message under the subject')}>
            <Switch aria-label={t('显示摘要', 'Show preview')} checked={value.showSnippet} onChange={(v) => set('showSnippet', v)} />
          </Row>
        </Group>
      </section>

      <section aria-labelledby="mail-set-read">
        <h3 id="mail-set-read" className="mail-settings__h">{t('阅读与发送', 'Reading and sending')}</h3>
        <Group compact>
          <Row label={t('会话视图', 'Conversation view')} description={t('把同一主题的往来折叠在一起', 'Group replies on the same subject together')}>
            <Switch aria-label={t('会话视图', 'Conversation view')} checked={value.conversation} onChange={(v) => set('conversation', v)} />
          </Row>
          <Row label={t('撤销时限', 'Undo window')} description={t('发送、归档、删除后可以反悔多久', 'How long you can take back a send, archive or delete')}>
            <Select aria-label={t('撤销时限', 'Undo window')} size="sm" options={UNDO} value={value.undoSeconds} onChange={(v) => set('undoSeconds', v)} />
          </Row>
          <Row label={t('自动附上签名', 'Add signature automatically')}>
            <Switch aria-label={t('自动附上签名', 'Add signature automatically')} checked={value.signature} onChange={(v) => set('signature', v)} />
          </Row>
          <Row label={t('新邮件提醒', 'New mail alerts')} description={t('有新邮件时弹出通知并播报', 'Show a notification and announce new mail')}>
            <Switch aria-label={t('新邮件提醒', 'New mail alerts')} checked={value.notify} onChange={(v) => set('notify', v)} />
          </Row>
        </Group>
      </section>

      <section aria-labelledby="mail-set-keys">
        <h3 id="mail-set-keys" className="mail-settings__h">{t('快捷键', 'Keyboard shortcuts')}</h3>
        <Group compact>
          <Row label={t('写邮件', 'Compose')} description={t('点一下再按新的组合键', 'Click, then press a new key combination')}>
            <Hotkey aria-label={t('写邮件的快捷键', 'Shortcut for Compose')} size="sm" value={value.composeKey} onChange={(v) => set('composeKey', v)} />
          </Row>
        </Group>
      </section>
    </Dialog>
  );
}
