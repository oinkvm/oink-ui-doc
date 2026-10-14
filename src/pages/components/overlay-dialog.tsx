import { useEffect, useRef, useState } from 'react';
import {
  Button, Code, Dialog, Field, FloatingBody, FloatingCard, FloatingFooter, FloatingHeader, Icon, Inline, Input, Text, confirm, toast,
} from 'oink-ui';
import type { DialogTone } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Keys, Specs } from './display-_kit';
import { FloatingFamily, floatingCommonRows, floatingPartsRows } from './overlay-_shared';

export const meta: PageMeta = { path: '/components/dialog', title: 'Dialog 对话框', group: '浮层', order: 1, subtitle: 'Dialog · confirm()', en: { title: 'Dialog', subtitle: 'Dialog · confirm()' } };

function StructureDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('打开结构示例', 'Open structure example')}</Button>
      <FloatingCard open={open} onOpenChange={setOpen} placement="center" size={440}>
        <FloatingHeader title="FloatingHeader" description={t('标题、说明和关闭按钮。', 'Title, description and close button.')} />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>{t('FloatingBody：占满头尾之间的空间，内容超出时在这里原生滚动。', 'FloatingBody: fills the space between header and footer, and scrolls natively when the content overflows.')}</Text>
        </FloatingBody>
        <FloatingFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>{t('取消', 'Cancel')}</Button>
          <Button variant="primary" onClick={() => setOpen(false)}>FloatingFooter</Button>
        </FloatingFooter>
      </FloatingCard>
    </>
  );
}

function BasicDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>{t('发布文章', 'Publish post')}</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        icon={<Icon name="upload" />}
        title={t('发布这篇文章？', 'Publish this post?')}
        description={t('发布后所有关注者都会收到通知，之后仍然可以修改。', 'All your followers will be notified. You can still edit it afterwards.')}
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>{t('再想想', 'Not yet')}</Button>
            <Button size="lg" variant="primary" onClick={() => { setOpen(false); toast.success(t('已发布', 'Published')); }}>{t('发布', 'Publish')}</Button>
          </>
        }
      />
    </>
  );
}

const tones: Array<{ tone: DialogTone; label: { zh: string; en: string }; icon: 'sparkle' | 'info' | 'check' | 'alert' | 'trash' | 'bell' }> = [
  { tone: 'accent', label: { zh: '强调', en: 'Accent' }, icon: 'sparkle' },
  { tone: 'neutral', label: { zh: '中性', en: 'Neutral' }, icon: 'bell' },
  { tone: 'info', label: { zh: '信息', en: 'Info' }, icon: 'info' },
  { tone: 'success', label: { zh: '成功', en: 'Success' }, icon: 'check' },
  { tone: 'warning', label: { zh: '警告', en: 'Warning' }, icon: 'alert' },
  { tone: 'danger', label: { zh: '危险', en: 'Danger' }, icon: 'trash' },
];

function ToneDemo() {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const cur = tones[index];
  const label = t(cur.label.zh, cur.label.en);
  return (
    <>
      <Inline justify="center">
        {tones.map((it, i) => <Button key={it.tone} onClick={() => { setIndex(i); setOpen(true); }}>{t(it.label.zh, it.label.en)}</Button>)}
      </Inline>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        tone={cur.tone}
        icon={<Icon name={cur.icon} />}
        title={t(`${label}色的图标`, `${label} icon`)}
        description={t(`tone="${cur.tone}" 只改变图标色块的颜色。`, `tone="${cur.tone}" only changes the color of the icon tile.`)}
        actions={<Button size="lg" variant="primary" onClick={() => setOpen(false)}>{t('知道了', 'Got it')}</Button>}
      />
    </>
  );
}

function CenterDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('退出登录', 'Sign out')}</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        align="center"
        size="sm"
        title={t('退出登录？', 'Sign out?')}
        description={t('退出后需要重新输入密码才能进入。', 'You’ll need to enter your password again to get back in.')}
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>{t('取消', 'Cancel')}</Button>
            <Button size="lg" variant="primary" onClick={() => setOpen(false)}>{t('退出', 'Sign out')}</Button>
          </>
        }
      />
    </>
  );
}

function SizeDemo() {
  const t = useT();
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
  const [last, setLast] = useState<'sm' | 'md' | 'lg'>('md');
  const show = (s: 'sm' | 'md' | 'lg') => { setLast(s); setSize(s); };
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => show('sm')}>sm · 320</Button>
        <Button onClick={() => show('md')}>md · 400</Button>
        <Button onClick={() => show('lg')}>lg · 560</Button>
      </Inline>
      <Dialog
        open={size !== null}
        onOpenChange={(o) => { if (!o) setSize(null); }}
        size={last}
        title={`size="${last}"`}
        description={t('窗口比预设窄时，对话框自动收到“视口宽度减去两侧间隙”。', 'When the window is narrower than the preset, the dialog shrinks to the viewport width minus the side gaps.')}
        actions={<Button size="lg" variant="primary" onClick={() => setSize(null)}>{t('好的', 'OK')}</Button>}
      />
    </>
  );
}

function FormDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(() => t('导航改版', 'Navigation redesign'));
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{t('重命名项目', 'Rename project')}</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        closable
        initialFocus={input}
        title={t('重命名项目', 'Rename project')}
        description={t('新名字会立即对所有成员生效。', 'The new name takes effect for all members immediately.')}
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>{t('取消', 'Cancel')}</Button>
            <Button size="lg" variant="primary" disabled={!name.trim()} onClick={() => { setOpen(false); toast.success(t(`已重命名为“${name.trim()}”`, `Renamed to “${name.trim()}”`)); }}>{t('保存', 'Save')}</Button>
          </>
        }
      >
        <Field label={t('项目名称', 'Project name')}>
          <Input ref={input} value={name} onChange={setName} />
        </Field>
      </Dialog>
    </>
  );
}

function AlertDialogDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>{t('会话已过期', 'Session expired')}</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        dismissible={false}
        tone="warning"
        icon={<Icon name="alert" />}
        title={t('登录已过期', 'Your session has expired')}
        description={t('为了保护你的账号，请重新登录后再继续。未保存的内容会保留在本机。', 'To keep your account safe, please sign in again to continue. Unsaved changes are kept on this device.')}
        actions={<Button size="lg" variant="primary" data-autofocus="" onClick={() => setOpen(false)}>{t('重新登录', 'Sign in again')}</Button>}
      />
    </>
  );
}

function OriginDemo() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<'trigger' | 'center'>('trigger');
  // Shift + D 打开：快捷键没有触发元素，明确要求从屏幕中心出来（焦点这时可能还停在别的按钮上）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      if (typing || !e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.key.toLowerCase() !== 'd') return;
      e.preventDefault();
      setOrigin('center');
      setOpen(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <Inline justify="center" align="center">
        <Button onClick={() => { setOrigin('trigger'); setOpen(true); }}>{t('从这个按钮出来', 'Grow from this button')}</Button>
        <Text tone="subtle">{t(<>或者按 <Keys k="Shift D" /> 从屏幕中心出来</>, <>or press <Keys k="Shift D" /> to grow from the screen center</>)}</Text>
      </Inline>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        origin={origin}
        align="center"
        size="sm"
        title={origin === 'center' ? t('从屏幕中心出来', 'From the screen center') : t('从按钮处出来', 'From the button')}
        description={t('关闭时缩回同一个点。', 'It shrinks back to the same point when closed.')}
        actions={<Button size="lg" variant="primary" onClick={() => setOpen(false)}>{t('知道了', 'Got it')}</Button>}
      />
    </>
  );
}

function ConfirmDemo() {
  const t = useT();
  return (
    <Inline justify="center">
      <Button
        onClick={async () => {
          const ok = await confirm(t('确定要归档这个项目吗？', 'Archive this project?'));
          toast(ok ? t('已归档', 'Archived') : t('已取消', 'Cancelled'));
        }}
      >
        {t('最简写法', 'Simplest form')}
      </Button>
      <Button
        variant="danger"
        onClick={async () => {
          const ok = await confirm({
            title: t('删除“导航改版”？', 'Delete “Navigation redesign”?'),
            description: t('项目里的 24 个任务和全部附件会一起删除，无法恢复。', 'All 24 tasks and every attachment in the project will be deleted. This can’t be undone.'),
            tone: 'danger',
            icon: <Icon name="trash" />,
            confirmText: t('删除', 'Delete'),
            cancelText: t('保留', 'Keep'),
          });
          if (ok) toast.danger(t('项目已删除', 'Project deleted'));
        }}
      >
        {t('危险操作', 'Destructive action')}
      </Button>
      <Button
        onClick={async () => {
          const ok = await confirm({
            title: t('应用更新并重启？', 'Apply update and restart?'),
            description: t('这一步不能用 Esc 或点遮罩跳过，必须明确选择。', 'This can’t be skipped with Esc or by clicking the scrim — a choice is required.'),
            confirmText: t('立即重启', 'Restart now'),
            cancelText: t('稍后', 'Later'),
            dismissible: false,
          });
          toast(ok ? t('正在重启…', 'Restarting…') : t('已推迟', 'Postponed'));
        }}
      >
        {t('必须作答', 'Answer required')}
      </Button>
    </Inline>
  );
}

/* ------------------------------------------------------------------ 示例源码 */

const STRUCTURE_CODE = {
  zh: `
function StructureDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开结构示例</Button>
      <FloatingCard open={open} onOpenChange={setOpen} placement="center" size={440}>
        <FloatingHeader title="FloatingHeader" description="标题、说明和关闭按钮。" />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>FloatingBody：占满头尾之间的空间，内容超出时在这里原生滚动。</Text>
        </FloatingBody>
        <FloatingFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="primary" onClick={() => setOpen(false)}>FloatingFooter</Button>
        </FloatingFooter>
      </FloatingCard>
    </>
  );
}`,
  en: `
function StructureDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open structure example</Button>
      <FloatingCard open={open} onOpenChange={setOpen} placement="center" size={440}>
        <FloatingHeader title="FloatingHeader" description="Title, description and close button." />
        <FloatingBody>
          <Text as="p" tone="neutral" style={{ margin: 0 }}>FloatingBody: fills the space between header and footer, and scrolls natively when the content overflows.</Text>
        </FloatingBody>
        <FloatingFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => setOpen(false)}>FloatingFooter</Button>
        </FloatingFooter>
      </FloatingCard>
    </>
  );
}`,
};

const BASIC_CODE = {
  zh: `
function BasicDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>发布文章</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        icon={<Icon name="upload" />}
        title="发布这篇文章？"
        description="发布后所有关注者都会收到通知，之后仍然可以修改。"
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>再想想</Button>
            <Button size="lg" variant="primary" onClick={() => { setOpen(false); toast.success('已发布'); }}>发布</Button>
          </>
        }
      />
    </>
  );
}`,
  en: `
function BasicDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>Publish post</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        icon={<Icon name="upload" />}
        title="Publish this post?"
        description="All your followers will be notified. You can still edit it afterwards."
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>Not yet</Button>
            <Button size="lg" variant="primary" onClick={() => { setOpen(false); toast.success('Published'); }}>Publish</Button>
          </>
        }
      />
    </>
  );
}`,
};

const TONE_CODE = {
  zh: `
const tones: Array<{ tone: DialogTone; label: string; icon: 'sparkle' | 'info' | 'check' | 'alert' | 'trash' | 'bell' }> = [
  { tone: 'accent', label: '强调', icon: 'sparkle' },
  { tone: 'neutral', label: '中性', icon: 'bell' },
  { tone: 'info', label: '信息', icon: 'info' },
  { tone: 'success', label: '成功', icon: 'check' },
  { tone: 'warning', label: '警告', icon: 'alert' },
  { tone: 'danger', label: '危险', icon: 'trash' },
];

function ToneDemo() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const t = tones[index];
  return (
    <>
      <Inline justify="center">
        {tones.map((it, i) => <Button key={it.tone} onClick={() => { setIndex(i); setOpen(true); }}>{it.label}</Button>)}
      </Inline>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        tone={t.tone}
        icon={<Icon name={t.icon} />}
        title={\`\${t.label}色的图标\`}
        description={\`tone="\${t.tone}" 只改变图标色块的颜色。\`}
        actions={<Button size="lg" variant="primary" onClick={() => setOpen(false)}>知道了</Button>}
      />
    </>
  );
}`,
  en: `
const tones: Array<{ tone: DialogTone; label: string; icon: 'sparkle' | 'info' | 'check' | 'alert' | 'trash' | 'bell' }> = [
  { tone: 'accent', label: 'Accent', icon: 'sparkle' },
  { tone: 'neutral', label: 'Neutral', icon: 'bell' },
  { tone: 'info', label: 'Info', icon: 'info' },
  { tone: 'success', label: 'Success', icon: 'check' },
  { tone: 'warning', label: 'Warning', icon: 'alert' },
  { tone: 'danger', label: 'Danger', icon: 'trash' },
];

function ToneDemo() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const t = tones[index];
  return (
    <>
      <Inline justify="center">
        {tones.map((it, i) => <Button key={it.tone} onClick={() => { setIndex(i); setOpen(true); }}>{it.label}</Button>)}
      </Inline>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        tone={t.tone}
        icon={<Icon name={t.icon} />}
        title={\`\${t.label} icon\`}
        description={\`tone="\${t.tone}" only changes the color of the icon tile.\`}
        actions={<Button size="lg" variant="primary" onClick={() => setOpen(false)}>Got it</Button>}
      />
    </>
  );
}`,
};

const CENTER_CODE = {
  zh: `
function CenterDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>退出登录</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        align="center"
        size="sm"
        title="退出登录？"
        description="退出后需要重新输入密码才能进入。"
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>取消</Button>
            <Button size="lg" variant="primary" onClick={() => setOpen(false)}>退出</Button>
          </>
        }
      />
    </>
  );
}`,
  en: `
function CenterDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Sign out</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        align="center"
        size="sm"
        title="Sign out?"
        description="You’ll need to enter your password again to get back in."
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="lg" variant="primary" onClick={() => setOpen(false)}>Sign out</Button>
          </>
        }
      />
    </>
  );
}`,
};

const SIZE_CODE = {
  zh: `
function SizeDemo() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
  const [last, setLast] = useState<'sm' | 'md' | 'lg'>('md');
  const show = (s: 'sm' | 'md' | 'lg') => { setLast(s); setSize(s); };
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => show('sm')}>sm · 320</Button>
        <Button onClick={() => show('md')}>md · 400</Button>
        <Button onClick={() => show('lg')}>lg · 560</Button>
      </Inline>
      <Dialog
        open={size !== null}
        onOpenChange={(o) => { if (!o) setSize(null); }}
        size={last}
        title={\`size="\${last}"\`}
        description="窗口比预设窄时，对话框自动收到“视口宽度减去两侧间隙”。"
        actions={<Button size="lg" variant="primary" onClick={() => setSize(null)}>好的</Button>}
      />
    </>
  );
}`,
  en: `
function SizeDemo() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
  const [last, setLast] = useState<'sm' | 'md' | 'lg'>('md');
  const show = (s: 'sm' | 'md' | 'lg') => { setLast(s); setSize(s); };
  return (
    <>
      <Inline justify="center">
        <Button onClick={() => show('sm')}>sm · 320</Button>
        <Button onClick={() => show('md')}>md · 400</Button>
        <Button onClick={() => show('lg')}>lg · 560</Button>
      </Inline>
      <Dialog
        open={size !== null}
        onOpenChange={(o) => { if (!o) setSize(null); }}
        size={last}
        title={\`size="\${last}"\`}
        description="When the window is narrower than the preset, the dialog shrinks to the viewport width minus the side gaps."
        actions={<Button size="lg" variant="primary" onClick={() => setSize(null)}>OK</Button>}
      />
    </>
  );
}`,
};

const FORM_CODE = {
  zh: `
function FormDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('导航改版');
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>重命名项目</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        closable
        initialFocus={input}
        title="重命名项目"
        description="新名字会立即对所有成员生效。"
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>取消</Button>
            <Button size="lg" variant="primary" disabled={!name.trim()} onClick={() => { setOpen(false); toast.success(\`已重命名为“\${name.trim()}”\`); }}>保存</Button>
          </>
        }
      >
        <Field label="项目名称">
          <Input ref={input} value={name} onChange={setName} />
        </Field>
      </Dialog>
    </>
  );
}`,
  en: `
function FormDemo() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('Navigation redesign');
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Rename project</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        closable
        initialFocus={input}
        title="Rename project"
        description="The new name takes effect for all members immediately."
        actions={
          <>
            <Button size="lg" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="lg" variant="primary" disabled={!name.trim()} onClick={() => { setOpen(false); toast.success(\`Renamed to “\${name.trim()}”\`); }}>Save</Button>
          </>
        }
      >
        <Field label="Project name">
          <Input ref={input} value={name} onChange={setName} />
        </Field>
      </Dialog>
    </>
  );
}`,
};

const ALERT_CODE = {
  zh: `
function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>会话已过期</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        dismissible={false}
        tone="warning"
        icon={<Icon name="alert" />}
        title="登录已过期"
        description="为了保护你的账号，请重新登录后再继续。未保存的内容会保留在本机。"
        actions={<Button size="lg" variant="primary" data-autofocus="" onClick={() => setOpen(false)}>重新登录</Button>}
      />
    </>
  );
}`,
  en: `
function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Session expired</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        dismissible={false}
        tone="warning"
        icon={<Icon name="alert" />}
        title="Your session has expired"
        description="To keep your account safe, please sign in again to continue. Unsaved changes are kept on this device."
        actions={<Button size="lg" variant="primary" data-autofocus="" onClick={() => setOpen(false)}>Sign in again</Button>}
      />
    </>
  );
}`,
};

const ORIGIN_CODE = {
  zh: `
function OriginDemo() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<'trigger' | 'center'>('trigger');
  // Shift + D 打开：快捷键没有触发元素，明确要求从屏幕中心出来（焦点这时可能还停在别的按钮上）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (typing || !e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.key.toLowerCase() !== 'd') return;
      e.preventDefault();
      setOrigin('center');
      setOpen(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <Inline justify="center" align="center">
        <Button onClick={() => { setOrigin('trigger'); setOpen(true); }}>从这个按钮出来</Button>
        <Text tone="subtle">或者按 <Keys k="Shift D" /> 从屏幕中心出来</Text>
      </Inline>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        origin={origin}
        align="center"
        size="sm"
        title={origin === 'center' ? '从屏幕中心出来' : '从按钮处出来'}
        description="关闭时缩回同一个点。"
        actions={<Button size="lg" variant="primary" onClick={() => setOpen(false)}>知道了</Button>}
      />
    </>
  );
}`,
  en: `
function OriginDemo() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<'trigger' | 'center'>('trigger');
  // Shift + D opens it: a shortcut has no trigger element, so ask explicitly for the screen center
  // (focus may still be sitting on some other button at this point)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (typing || !e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.key.toLowerCase() !== 'd') return;
      e.preventDefault();
      setOrigin('center');
      setOpen(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <Inline justify="center" align="center">
        <Button onClick={() => { setOrigin('trigger'); setOpen(true); }}>Grow from this button</Button>
        <Text tone="subtle">or press <Keys k="Shift D" /> to grow from the screen center</Text>
      </Inline>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        origin={origin}
        align="center"
        size="sm"
        title={origin === 'center' ? 'From the screen center' : 'From the button'}
        description="It shrinks back to the same point when closed."
        actions={<Button size="lg" variant="primary" onClick={() => setOpen(false)}>Got it</Button>}
      />
    </>
  );
}`,
};

const CONFIRM_CODE = {
  zh: `
function ConfirmDemo() {
  return (
    <Inline justify="center">
      <Button
        onClick={async () => {
          const ok = await confirm('确定要归档这个项目吗？');
          toast(ok ? '已归档' : '已取消');
        }}
      >
        最简写法
      </Button>
      <Button
        variant="danger"
        onClick={async () => {
          const ok = await confirm({
            title: '删除“导航改版”？',
            description: '项目里的 24 个任务和全部附件会一起删除，无法恢复。',
            tone: 'danger',
            icon: <Icon name="trash" />,
            confirmText: '删除',
            cancelText: '保留',
          });
          if (ok) toast.danger('项目已删除');
        }}
      >
        危险操作
      </Button>
      <Button
        onClick={async () => {
          const ok = await confirm({
            title: '应用更新并重启？',
            description: '这一步不能用 Esc 或点遮罩跳过，必须明确选择。',
            confirmText: '立即重启',
            cancelText: '稍后',
            dismissible: false,
          });
          toast(ok ? '正在重启…' : '已推迟');
        }}
      >
        必须作答
      </Button>
    </Inline>
  );
}`,
  en: `
function ConfirmDemo() {
  return (
    <Inline justify="center">
      <Button
        onClick={async () => {
          const ok = await confirm('Archive this project?');
          toast(ok ? 'Archived' : 'Cancelled');
        }}
      >
        Simplest form
      </Button>
      <Button
        variant="danger"
        onClick={async () => {
          const ok = await confirm({
            title: 'Delete “Navigation redesign”?',
            description: 'All 24 tasks and every attachment in the project will be deleted. This can’t be undone.',
            tone: 'danger',
            icon: <Icon name="trash" />,
            confirmText: 'Delete',
            cancelText: 'Keep',
          });
          if (ok) toast.danger('Project deleted');
        }}
      >
        Destructive action
      </Button>
      <Button
        onClick={async () => {
          const ok = await confirm({
            title: 'Apply update and restart?',
            description: 'This can’t be skipped with Esc or by clicking the scrim — a choice is required.',
            confirmText: 'Restart now',
            cancelText: 'Later',
            dismissible: false,
          });
          toast(ok ? 'Restarting…' : 'Postponed');
        }}
      >
        Answer required
      </Button>
    </Inline>
  );
}`,
};

export default function DialogPage() {
  const t = useT();
  const parts = floatingPartsRows(t);
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '打断当前的事，要人先回应：确认一个操作、补充一两项信息。它是模态的，出现时页面其余部分不可用，所以只在必须打断时才用；只是告知结果请用 Toast。',
        'Interrupts what the user is doing and asks for a response first: confirming an action, or filling in one or two fields. It’s modal — the rest of the page is unavailable while it’s open — so use it only when an interruption is truly needed. To simply report an outcome, use Toast.',
      )}
    >
      <FloatingFamily current="Dialog">
        <Demo
          title={t('结构件', 'Building blocks')}
          description={t(
            'Dialog 自带一套“图标 + 标题 + 说明 + 等分按钮”的排版，够用时直接传属性即可（见下文）。需要自己排版的居中卡片，可以直接用 FloatingCard 配三个结构件。',
            'Dialog comes with a ready-made “icon + title + description + equal-width buttons” layout; when that’s enough, just pass props (see below). For a centered card with your own layout, use FloatingCard with the three parts directly.',
          )}
          code={t(STRUCTURE_CODE.zh, STRUCTURE_CODE.en)}
        >
          <StructureDemo />
        </Demo>
      </FloatingFamily>

      <DocSection title={t('基本用法', 'Basic usage')} description={t('图标在标题左侧，下面是说明，底部一到两个等分撑满的按钮。Esc 或点遮罩关闭；关闭后焦点回到打开它的按钮上。', 'The icon sits to the left of the title, the description goes below, and one or two equal-width buttons fill the bottom. Esc or clicking the scrim closes it; focus then returns to the button that opened it.')}>
        <Demo code={t(BASIC_CODE.zh, BASIC_CODE.en)}>
          <BasicDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('图标的状态色', 'Icon tone')} description={t('tone 只改变图标色块的颜色，默认 accent。', 'tone only changes the color of the icon tile. Defaults to accent.')}>
        <Demo code={t(TONE_CODE.zh, TONE_CODE.en)}>
          <ToneDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('居中变体', 'Centered variant')} description={t('没有图标的简短确认框用 align="center"，标题和说明居中。', 'For short confirmations without an icon, use align="center" to center the title and description.')}>
        <Demo code={t(CENTER_CODE.zh, CENTER_CODE.en)}>
          <CenterDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')} description={t('宽度预设 sm 320、md 400（默认）、lg 560，也可以给数字或 CSS 长度。高度随内容，超出视口时卡片内部滚动。', 'Width presets are sm 320, md 400 (default) and lg 560; you can also pass a number or a CSS length. Height follows the content, and the card scrolls internally when it outgrows the viewport.')}>
        <Demo code={t(SIZE_CODE.zh, SIZE_CODE.en)}>
          <SizeDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('放表单', 'With a form')} description={t('children 放在说明和按钮之间。closable 在右上角加一个关闭按钮；initialFocus 指定打开后焦点落在哪个元素上。', 'children goes between the description and the buttons. closable adds a close button in the top-right corner; initialFocus picks which element receives focus on open.')}>
        <Demo code={t(FORM_CODE.zh, FORM_CODE.en)}>
          <FormDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('alertdialog', 'alertdialog')} description={t('需要用户立刻回应、不能随手关掉的打断，用 role="alertdialog" 并关掉 dismissible：Esc 和点遮罩都不再关闭，只能点按钮。给最安全的那个按钮加 data-autofocus，让焦点一开始就落在它上面。', 'For interruptions that need an immediate answer and shouldn’t be brushed aside, use role="alertdialog" and turn off dismissible: neither Esc nor clicking the scrim closes it — only the buttons do. Put data-autofocus on the safest button so focus starts there.')}>
        <Demo code={t(ALERT_CODE.zh, ALERT_CODE.en)}>
          <AlertDialogDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('从触发点进场', 'Entering from the trigger')} description={t('居中的对话框从打开它的地方放大出来，关闭时缩回同一个点：用指针点开的从点按处，用键盘（Tab 到按钮再按回车）打开的从按钮中心；通过快捷键打开、没有触发元素时（焦点在页面空白处或输入框里）从屏幕中心。快捷键按下时焦点可能还停在某个按钮上，这时传 origin="center" 明确要求从屏幕中心出来；也可以传视口坐标 { x, y }。手机宽度下也一样。', 'A centered dialog grows out of wherever it was opened and shrinks back to the same point on close: from the click or tap point when opened with a pointer, from the button’s center when opened with the keyboard (Tab to the button, then Enter), and from the screen center when opened by a shortcut with no trigger element (focus on the page body or in an input). When a shortcut fires, focus may still be on some button — pass origin="center" to ask for the screen center explicitly, or pass viewport coordinates { x, y }. The same applies at phone widths.')}>
        <Demo code={t(ORIGIN_CODE.zh, ORIGIN_CODE.en)}>
          <OriginDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('confirm()', 'confirm()')} description={t('最常见的“确定吗？”不需要自己管开合状态：await confirm(...) 返回一个 Promise，确认得到 true，取消、Esc、点遮罩得到 false。它渲染的是 alertdialog；tone 为 danger 时确认按钮用危险色，焦点默认落在“取消”上。在应用根部挂一个 <Confirmer />（本站已挂）。', 'The everyday “Are you sure?” needs no open state of your own: await confirm(...) returns a Promise that resolves to true on confirm, and to false on cancel, Esc or a scrim click. It renders an alertdialog; with tone set to danger, the confirm button uses the danger color and focus starts on Cancel. Mount one <Confirmer /> at the app root (this site already does).')}>
        <Demo code={t(CONFIRM_CODE.zh, CONFIRM_CODE.en)}>
          <ConfirmDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={t<Array<[string, string]>>([
          ['面板', '圆角 32 · 内边距 24 · 最大宽 400'],
          ['图标', '40 × 40 色块 · 在标题左侧'],
          ['居中变体', '无图标 · 标题与说明居中'],
          ['进场', '从触发点放大：scale 0.6 → 1 · spring-soft 曲线 303ms + 100ms 淡入；没有触发点时从屏幕中心'],
          ['遮罩', '160ms · 变暗 + 模糊 8px'],
          ['退场', '160ms ease-in · 缩回进场的那个点'],
        ], [
          ['Panel', 'Corner radius 32 · padding 24 · max width 400'],
          ['Icon', '40 × 40 tinted tile · left of the title'],
          ['Centered variant', 'No icon · title and description centered'],
          ['Enter', 'Grows from the trigger point: scale 0.6 → 1 · spring-soft curve 303ms + 100ms fade-in; from the screen center when there’s no trigger'],
          ['Scrim', '160ms · dim + 8px blur'],
          ['Exit', '160ms ease-in · shrinks back to the point it entered from'],
        ])} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Dialog" rows={[
          { name: 'title', type: 'ReactNode', description: t('标题，自动成为对话框的名字。', 'The title; automatically becomes the dialog’s accessible name.') },
          { name: 'description', type: 'ReactNode', description: t('说明，自动成为对话框的描述。', 'The description; automatically becomes the dialog’s accessible description.') },
          { name: 'icon', type: 'ReactNode', description: t('标题左侧的图标位（40×40 的色块）。', 'Icon slot to the left of the title (a 40×40 tinted tile).') },
          { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'accent'", description: t('图标色块的状态色。', 'Status color of the icon tile.') },
          { name: 'actions', type: 'ReactNode', description: t('底部操作区：放一到两个按钮，等分撑满。', 'Bottom action area: one or two buttons, stretched to equal widths.') },
          { name: 'children', type: 'ReactNode', description: t('说明和按钮之间的自定义内容。', 'Custom content between the description and the buttons.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number | string", default: "'md'", description: t('宽度预设：320 / 400 / 560；或数字（px）、CSS 长度。', 'Width preset: 320 / 400 / 560; or a number (px) or CSS length.') },
          { name: 'align', type: "'start' | 'center'", default: "'start'", description: t('center：标题与说明居中。', 'center: title and description are centered.') },
          { name: 'role', type: "'dialog' | 'alertdialog'", default: "'dialog'", description: t('需要用户立刻回应的打断用 alertdialog。', 'Use alertdialog for interruptions that need an immediate response.') },
          { name: 'closable', type: 'boolean', default: 'false', description: t('右上角带一个关闭按钮。', 'Adds a close button in the top-right corner.') },
          { name: 'closeLabel', type: 'string', default: t("'关闭'", "'Close'"), description: t('关闭按钮的读屏名称。', 'Screen reader label of the close button. The default follows the OinkProvider locale.') },
          { name: 'origin', type: "'trigger' | 'center' | { x: number; y: number }", default: "'trigger'", description: t('从哪里放大进场、缩回哪里。trigger：点按处 / 键盘焦点元素的中心，没有触发元素时屏幕中心；center：屏幕中心；也可以给视口坐标。', 'Where it grows from and shrinks back to. trigger: the click point / the center of the keyboard-focused element, or the screen center when there’s no trigger; center: the screen center; or viewport coordinates.') },
          ...floatingCommonRows(t),
        ]} />
        <PropsTable title="confirm(options)" rows={[
          { name: 'title', type: 'ReactNode', required: true, description: t(<>标题。也可以直接 <Code>confirm('一句话')</Code>。</>, <>The title. You can also just call <Code>confirm('One sentence')</Code>.</>) },
          { name: 'description', type: 'ReactNode', description: t('说明。', 'The description.') },
          { name: 'confirmText', type: 'ReactNode', default: t("'确定'", "'OK'"), description: t('确认按钮的文字。', 'Label of the confirm button. The default follows the OinkProvider locale.') },
          { name: 'cancelText', type: 'ReactNode', default: t("'取消'", "'Cancel'"), description: t('取消按钮的文字。', 'Label of the cancel button. The default follows the OinkProvider locale.') },
          { name: 'tone', type: 'DialogTone', description: t('danger：确认按钮用危险色，默认焦点落在“取消”上。', 'danger: the confirm button uses the danger color, and focus starts on Cancel.') },
          { name: 'icon', type: 'ReactNode', description: t('图标。不传图标时默认用居中变体。', 'Icon. Without one, the centered variant is used by default.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number | string", description: t('同 Dialog。', 'Same as Dialog.') },
          { name: 'align', type: "'start' | 'center'", description: t('默认：有图标靠左，没有图标居中。', 'Default: start-aligned with an icon, centered without one.') },
          { name: 'dismissible', type: 'boolean', default: 'true', description: t('允许 Esc / 点遮罩关闭（按“取消”算）。', 'Allow closing with Esc / a scrim click (counts as Cancel).') },
          { name: 'origin', type: "'trigger' | 'center' | { x: number; y: number }", default: "'trigger'", description: t('同 Dialog：从哪里放大进场。', 'Same as Dialog: where it grows from.') },
        ]} />
        <PropsTable title="FloatingHeader" rows={parts.header} />
        <PropsTable title="FloatingBody / FloatingFooter" rows={[...parts.body, ...parts.footer]} />
        <A11yNotes items={t([
          <><Code>role="dialog"</Code>（或 <Code>alertdialog</Code>）加 <Code>aria-modal="true"</Code>；名字和描述自动取自 title 和 description，没有可见标题时必须给 <Code>aria-label</Code>。</>,
          <>打开时焦点移进对话框：<Code>initialFocus</Code> 指定的元素 → 带 <Code>data-autofocus</Code> 的元素 → 对话框本身。<Keys k="Tab" /> 和 <Keys k="Shift Tab" /> 被圈在对话框里循环。</>,
          <><Keys k="Esc" /> 或点遮罩关闭（<Code>dismissible=&#123;false&#125;</Code> 时都不行）；关闭后焦点回到打开它的元素。</>,
          '打开期间页面背景锁定滚动，遮罩后面的内容不可点。',
          'alertdialog 会让读屏立刻读出标题和说明，只用于必须马上回应的事。破坏性操作把初始焦点放在“取消”上，confirm() 的 danger 已经这样做了。',
          '减弱动效时进退场直接完成。',
        ], [
          <><Code>role="dialog"</Code> (or <Code>alertdialog</Code>) with <Code>aria-modal="true"</Code>; the name and description come from title and description automatically. Without a visible title, you must provide <Code>aria-label</Code>.</>,
          <>On open, focus moves into the dialog: the <Code>initialFocus</Code> element → an element with <Code>data-autofocus</Code> → the dialog itself. <Keys k="Tab" /> and <Keys k="Shift Tab" /> cycle within the dialog.</>,
          <><Keys k="Esc" /> or a scrim click closes it (neither works with <Code>dismissible=&#123;false&#125;</Code>); focus then returns to the element that opened it.</>,
          'While open, the page behind is scroll-locked and content behind the scrim can’t be clicked.',
          'An alertdialog makes screen readers announce the title and description right away — use it only for things that need an immediate answer. For destructive actions, put initial focus on Cancel; confirm() with danger already does this.',
          'With reduced motion, enter and exit complete instantly.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
