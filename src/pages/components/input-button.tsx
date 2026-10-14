import { useState } from 'react';
import { Button, ButtonGroup, Icon, Stack, Text, ToggleButton } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/button', title: 'Button 按钮', group: '表单与操作', order: 10, subtitle: 'Button · ButtonGroup · ToggleButton', en: { title: 'Button', subtitle: 'Button · ButtonGroup · ToggleButton' } };

function SaveDemo() {
  const t = useT();
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const save = () => {
    setState('loading');
    setTimeout(() => setState('success'), 1600);
    setTimeout(() => setState('idle'), 3200);
  };
  return (
    <Button variant="primary" loading={state === 'loading'} success={state === 'success'} onClick={save}>
      {t('保存更改', 'Save changes')}
    </Button>
  );
}

function ToggleDemo() {
  const t = useT();
  const [bold, setBold] = useState(true);
  return (
    <Stack gap={3} align="center">
      <ToggleButton pressed={bold} onChange={setBold} variant="outline">{t('加粗', 'Bold')}</ToggleButton>
      <Text tone="subtle" variant="caption">{t('当前：', 'Now: ')}{bold ? t('已按下', 'pressed') : t('未按下', 'not pressed')}</Text>
    </Stack>
  );
}

export default function ButtonPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Button 按钮', 'Button')}
      subtitle="Button · ButtonGroup · ToggleButton"
      lead={t(
        '触发一个立即发生的操作：提交、保存、打开浮层。跳转到别的页面时传 href，它会渲染成链接。一个区域里最多放一个主按钮。',
        'Triggers an action that happens right away: submit, save, open an overlay. Pass href to navigate elsewhere and it renders as a link. Use at most one primary button per area.',
      )}
    >
      <DocSection title={t('变体', 'Variants')} description={t(
        '默认是灰底的 soft。primary 给页面里最重要的那一个操作，accent 给需要品牌色强调的操作，danger 给不可恢复的操作。',
        'The default is soft, on a gray fill. primary is for the single most important action on the page, accent for actions that need the brand color, danger for actions that can’t be undone.',
      )}>
        <Demo
          code={t(`
<Button variant="primary">主按钮</Button>
<Button variant="accent">强调</Button>
<Button>默认</Button>
<Button variant="outline">描边</Button>
<Button variant="ghost">幽灵</Button>
<Button variant="danger">删除</Button>
`, `
<Button variant="primary">Primary</Button>
<Button variant="accent">Accent</Button>
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Delete</Button>
`)}
        >
          <Button variant="primary">{t('主按钮', 'Primary')}</Button>
          <Button variant="accent">{t('强调', 'Accent')}</Button>
          <Button>{t('默认', 'Default')}</Button>
          <Button variant="outline">{t('描边', 'Outline')}</Button>
          <Button variant="ghost">{t('幽灵', 'Ghost')}</Button>
          <Button variant="danger">{t('删除', 'Delete')}</Button>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')} description={t(
        '高度 32 / 40 / 48，触屏设备上自动各加 4。左右内边距约为高度的 0.48 倍。',
        'Heights 32 / 40 / 48, each 4 taller on touch screens. Horizontal padding is about 0.48 × the height.',
      )}>
        <Demo
          code={t(`
<Button size="sm">小号</Button>
<Button size="md">中号</Button>
<Button size="lg">大号</Button>
`, `
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
`)}
        >
          <Button size="sm">{t('小号', 'Small')}</Button>
          <Button size="md">{t('中号', 'Medium')}</Button>
          <Button size="lg">{t('大号', 'Large')}</Button>
        </Demo>
      </DocSection>

      <DocSection title={t('图标', 'Icons')} description={t(
        'leading / trailing 放在文字前后。只有图标时加 iconOnly，并且必须给 aria-label（类型上强制）。',
        'leading / trailing go before and after the label. For an icon on its own, add iconOnly and an aria-label (enforced by the types).',
      )}>
        <Demo
          code={t(`
<Button variant="primary" leading={<Icon name="plus" />}>新建项目</Button>
<Button trailing={<Icon name="chevron-right" />}>下一步</Button>
<Button iconOnly aria-label="分享"><Icon name="share" /></Button>
<Button iconOnly variant="ghost" aria-label="更多操作"><Icon name="more" /></Button>
<Button iconOnly variant="outline" size="sm" aria-label="编辑"><Icon name="edit" /></Button>
`, `
<Button variant="primary" leading={<Icon name="plus" />}>New project</Button>
<Button trailing={<Icon name="chevron-right" />}>Next</Button>
<Button iconOnly aria-label="Share"><Icon name="share" /></Button>
<Button iconOnly variant="ghost" aria-label="More actions"><Icon name="more" /></Button>
<Button iconOnly variant="outline" size="sm" aria-label="Edit"><Icon name="edit" /></Button>
`)}
        >
          <Button variant="primary" leading={<Icon name="plus" />}>{t('新建项目', 'New project')}</Button>
          <Button trailing={<Icon name="chevron-right" />}>{t('下一步', 'Next')}</Button>
          <Button iconOnly aria-label={t('分享', 'Share')}><Icon name="share" /></Button>
          <Button iconOnly variant="ghost" aria-label={t('更多操作', 'More actions')}><Icon name="more" /></Button>
          <Button iconOnly variant="outline" size="sm" aria-label={t('编辑', 'Edit')}><Icon name="edit" /></Button>
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')}>
        <Demo
          title={t('禁用', 'Disabled')}
          description={t(
            '原生 disabled 会让按钮离开 Tab 顺序。需要保留焦点（比如要配一条解释原因的提示）时改用 aria-disabled，点击同样会被拦下。',
            'Native disabled takes the button out of the Tab order. When it needs to stay focusable (say, to carry a tooltip explaining why), use aria-disabled instead; clicks are still blocked.',
          )}
          code={t(`
<Button variant="primary" disabled>不可用</Button>
<Button variant="outline" disabled>不可用</Button>
<Button aria-disabled="true">仍可聚焦</Button>
`, `
<Button variant="primary" disabled>Unavailable</Button>
<Button variant="outline" disabled>Unavailable</Button>
<Button aria-disabled="true">Still focusable</Button>
`)}
        >
          <Button variant="primary" disabled>{t('不可用', 'Unavailable')}</Button>
          <Button variant="outline" disabled>{t('不可用', 'Unavailable')}</Button>
          <Button aria-disabled="true">{t('仍可聚焦', 'Still focusable')}</Button>
        </Demo>
        <Demo
          title={t('加载与成功', 'Loading and success')}
          description={t(
            'loading 时文字上滑让位、尾巴加载器弹入，期间点击无效；结束后把 success 短暂置为 true 会描出对勾。只要传过 loading 或 success（哪怕是 false），按钮就会预留状态位。',
            'While loading, the label slides up out of the way and a trailing spinner pops in; clicks do nothing in the meantime. Set success to true briefly afterwards and a check mark draws itself. Once loading or success is passed at all (even as false), the button reserves room for the status.',
          )}
          code={t(`
function SaveDemo() {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const save = () => {
    setState('loading');
    setTimeout(() => setState('success'), 1600);
    setTimeout(() => setState('idle'), 3200);
  };
  return (
    <Button variant="primary" loading={state === 'loading'} success={state === 'success'} onClick={save}>
      保存更改
    </Button>
  );
}
`, `
function SaveDemo() {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const save = () => {
    setState('loading');
    setTimeout(() => setState('success'), 1600);
    setTimeout(() => setState('idle'), 3200);
  };
  return (
    <Button variant="primary" loading={state === 'loading'} success={state === 'success'} onClick={save}>
      Save changes
    </Button>
  );
}
`)}
        >
          <SaveDemo />
          <Button loading>{t('加载中', 'Loading')}</Button>
          <Button variant="accent" success>{t('已完成', 'Done')}</Button>
        </Demo>
        <Demo
          title={t('撑满与链接', 'Full width and links')}
          description={t(
            'block 撑满一行。传 href 渲染成 <a>；target="_blank" 时自动补 rel。',
            'block fills the row. Pass href to render an <a>; with target="_blank", rel is added for you.',
          )}
          layout="col"
          code={t(`
<Button variant="primary" block>继续</Button>
<Button variant="outline" block href="/components/input">查看输入框文档</Button>
`, `
<Button variant="primary" block>Continue</Button>
<Button variant="outline" block href="/components/input">Read the Input docs</Button>
`)}
        >
          <Button variant="primary" block>{t('继续', 'Continue')}</Button>
          <Button variant="outline" block href="/components/input">{t('查看输入框文档', 'Read the Input docs')}</Button>
        </Demo>
      </DocSection>

      <DocSection title={t('按钮组', 'Button groups')} description={t(
        'ButtonGroup 把一组相关操作排在一起，并统一下发 size / variant / disabled。attached 让按钮连成一体。记得给组一个 aria-label。',
        'ButtonGroup lays out a set of related actions and passes size / variant / disabled down to all of them. attached joins the buttons into one piece. Remember to give the group an aria-label.',
      )}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<ButtonGroup aria-label="文档操作">
  <Button variant="primary">发布</Button>
  <Button>存为草稿</Button>
  <Button variant="ghost">取消</Button>
</ButtonGroup>

<ButtonGroup attached variant="outline" aria-label="对齐方式">
  <Button>左对齐</Button>
  <Button>居中</Button>
  <Button>右对齐</Button>
</ButtonGroup>

<ButtonGroup attached size="sm" disabled aria-label="分页">
  <Button>上一页</Button>
  <Button>下一页</Button>
</ButtonGroup>
`, `
<ButtonGroup aria-label="Document actions">
  <Button variant="primary">Publish</Button>
  <Button>Save draft</Button>
  <Button variant="ghost">Cancel</Button>
</ButtonGroup>

<ButtonGroup attached variant="outline" aria-label="Alignment">
  <Button>Left</Button>
  <Button>Center</Button>
  <Button>Right</Button>
</ButtonGroup>

<ButtonGroup attached size="sm" disabled aria-label="Pagination">
  <Button>Previous</Button>
  <Button>Next</Button>
</ButtonGroup>
`)}
        >
          <ButtonGroup aria-label={t('文档操作', 'Document actions')}>
            <Button variant="primary">{t('发布', 'Publish')}</Button>
            <Button>{t('存为草稿', 'Save draft')}</Button>
            <Button variant="ghost">{t('取消', 'Cancel')}</Button>
          </ButtonGroup>
          <ButtonGroup attached variant="outline" aria-label={t('对齐方式', 'Alignment')}>
            <Button>{t('左对齐', 'Left')}</Button>
            <Button>{t('居中', 'Center')}</Button>
            <Button>{t('右对齐', 'Right')}</Button>
          </ButtonGroup>
          <ButtonGroup attached size="sm" disabled aria-label={t('分页', 'Pagination')}>
            <Button>{t('上一页', 'Previous')}</Button>
            <Button>{t('下一页', 'Next')}</Button>
          </ButtonGroup>
        </Demo>
        <Demo
          title={t('撑满', 'Full width')}
          description={t(
            'block 让按钮组占满一行并平分宽度，常用在窄容器和对话框底部。',
            'block makes the group fill the row and split the width evenly; handy in narrow containers and dialog footers.',
          )}
          layout="col"
          code={t(`
<ButtonGroup block aria-label="确认">
  <Button>取消</Button>
  <Button variant="primary">确定</Button>
</ButtonGroup>
`, `
<ButtonGroup block aria-label="Confirm">
  <Button>Cancel</Button>
  <Button variant="primary">OK</Button>
</ButtonGroup>
`)}
        >
          <ButtonGroup block aria-label={t('确认', 'Confirm')}>
            <Button>{t('取消', 'Cancel')}</Button>
            <Button variant="primary">{t('确定', 'OK')}</Button>
          </ButtonGroup>
        </Demo>
        <Demo
          title={t('纵向', 'Vertical')}
          code={t(`
<ButtonGroup attached orientation="vertical" aria-label="缩放">
  <Button iconOnly aria-label="放大"><Icon name="plus" /></Button>
  <Button iconOnly aria-label="缩小"><Icon name="minus" /></Button>
</ButtonGroup>
`, `
<ButtonGroup attached orientation="vertical" aria-label="Zoom">
  <Button iconOnly aria-label="Zoom in"><Icon name="plus" /></Button>
  <Button iconOnly aria-label="Zoom out"><Icon name="minus" /></Button>
</ButtonGroup>
`)}
        >
          <ButtonGroup attached orientation="vertical" aria-label={t('缩放', 'Zoom')}>
            <Button iconOnly aria-label={t('放大', 'Zoom in')}><Icon name="plus" /></Button>
            <Button iconOnly aria-label={t('缩小', 'Zoom out')}><Icon name="minus" /></Button>
          </ButtonGroup>
        </Demo>
      </DocSection>

      <DocSection title={t('开关按钮', 'Toggle buttons')} description={t(
        'ToggleButton 有按下 / 弹起两个状态，用 aria-pressed 表达。适合工具栏里的“加粗”“收藏”这类即时生效的开关；设置项请用 Switch。',
        'ToggleButton has two states, pressed and released, exposed through aria-pressed. It suits toolbar toggles that take effect immediately, like “Bold” or “Favorite”; for settings, use Switch.',
      )}>
        <Demo
          title={t('非受控', 'Uncontrolled')}
          code={t(`
<ToggleButton defaultPressed leading={<Icon name="bell" />}>通知</ToggleButton>
<ToggleButton iconOnly aria-label="随机播放"><Icon name="shuffle" /></ToggleButton>
<ToggleButton disabled>不可用</ToggleButton>
`, `
<ToggleButton defaultPressed leading={<Icon name="bell" />}>Notifications</ToggleButton>
<ToggleButton iconOnly aria-label="Shuffle"><Icon name="shuffle" /></ToggleButton>
<ToggleButton disabled>Unavailable</ToggleButton>
`)}
        >
          <ToggleButton defaultPressed leading={<Icon name="bell" />}>{t('通知', 'Notifications')}</ToggleButton>
          <ToggleButton iconOnly aria-label={t('随机播放', 'Shuffle')}><Icon name="shuffle" /></ToggleButton>
          <ToggleButton disabled>{t('不可用', 'Unavailable')}</ToggleButton>
        </Demo>
        <Demo
          title={t('受控', 'Controlled')}
          code={t(`
function ToggleDemo() {
  const [bold, setBold] = useState(true);
  return (
    <Stack gap={3} align="center">
      <ToggleButton pressed={bold} onChange={setBold} variant="outline">加粗</ToggleButton>
      <Text tone="subtle" variant="caption">当前：{bold ? '已按下' : '未按下'}</Text>
    </Stack>
  );
}
`, `
function ToggleDemo() {
  const [bold, setBold] = useState(true);
  return (
    <Stack gap={3} align="center">
      <ToggleButton pressed={bold} onChange={setBold} variant="outline">Bold</ToggleButton>
      <Text tone="subtle" variant="caption">Now: {bold ? 'pressed' : 'not pressed'}</Text>
    </Stack>
  );
}
`)}
        >
          <ToggleDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['尺寸', '32 / 40 / 48 · 圆角全圆 · 左右内边距 = 高 × .48'],
            ['按下', 'scale .955 · 90ms ease-out'],
            ['松开', 'spring-bouncy 回弹'],
            ['悬停', '只换一档底色 · 150ms，无高光、无棱台、无阴影'],
            ['描边', '仅描边按钮 1.5px · 禁用时保留'],
            ['加载', '文字上滑让位 → 尾巴加载器 → 对勾描线'],
          ], [
            ['Size', '32 / 40 / 48 · pill · horizontal padding = height × .48'],
            ['Press', 'scale .955 · 90ms ease-out'],
            ['Release', 'spring-bouncy rebound'],
            ['Hover', 'Fill steps up one shade · 150ms; no highlight, bevel or shadow'],
            ['Stroke', 'Outline buttons only, 1.5px · kept when disabled'],
            ['Loading', 'Label slides up → trailing spinner → check mark draws in'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Button"
          rows={[
            { name: 'variant', type: "'primary' | 'accent' | 'soft' | 'ghost' | 'outline' | 'danger'", default: "'soft'", description: t('变体。在 ButtonGroup 里默认取组的 variant。', 'Visual variant. Inside a ButtonGroup it defaults to the group’s variant.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('高度 32 / 40 / 48。', 'Height 32 / 40 / 48.') },
            { name: 'loading', type: 'boolean', description: t('加载中：显示加载器，aria-busy，期间不响应点击。', 'Loading: shows a spinner, sets aria-busy, and ignores clicks meanwhile.') },
            { name: 'success', type: 'boolean', description: t('成功：描出对勾，期间不响应点击。', 'Success: draws a check mark and ignores clicks meanwhile.') },
            { name: 'leading', type: 'ReactNode', description: t('文字前的图标。', 'Icon before the label.') },
            { name: 'trailing', type: 'ReactNode', description: t('文字后的图标。', 'Icon after the label.') },
            { name: 'iconOnly', type: 'boolean', description: t('图标按钮（正方形）。为 true 时必须同时给 aria-label 或 aria-labelledby。', 'Icon button (square). When true, aria-label or aria-labelledby is required.') },
            { name: 'block', type: 'boolean', description: t('撑满一行。', 'Fill the row.') },
            { name: 'disabled', type: 'boolean', description: t('禁用。渲染成链接时改为去掉 href 并加 aria-disabled。', 'Disabled. When rendered as a link, href is removed and aria-disabled added instead.') },
            { name: 'href', type: 'string', description: t('传了就渲染成 <a>；可配 target、rel、download。', 'Renders an <a> when set; works with target, rel and download.') },
            { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: t('原生按钮类型。表单提交按钮要显式写 submit。', 'Native button type. Form submit buttons must say submit explicitly.') },
            { name: '…rest', type: 'ButtonHTMLAttributes', description: t('其余原生属性和 ref 透传到根节点。onClick 收到的是原生事件。', 'Other native attributes and ref are forwarded to the root. onClick receives the native event.') },
          ]}
        />
        <PropsTable
          title="ButtonGroup"
          rows={[
            { name: 'size', type: "'sm' | 'md' | 'lg'", description: t('组内按钮的默认尺寸。', 'Default size for buttons in the group.') },
            { name: 'variant', type: 'ButtonVariant', description: t('组内按钮的默认变体。', 'Default variant for buttons in the group.') },
            { name: 'disabled', type: 'boolean', description: t('整组禁用。', 'Disable the whole group.') },
            { name: 'attached', type: 'boolean', description: t('连体：按钮贴在一起，中间的圆角收小。', 'Attached: buttons sit flush, with smaller inner corner radii.') },
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: t('排列方向。', 'Layout direction.') },
            { name: 'block', type: 'boolean', description: t('撑满一行并平分宽度。', 'Fill the row and split the width evenly.') },
          ]}
        />
        <PropsTable
          title="ToggleButton"
          rows={[
            { name: 'pressed', type: 'boolean', description: t('是否按下（受控）。', 'Whether it’s pressed (controlled).') },
            { name: 'defaultPressed', type: 'boolean', default: 'false', description: t('初始是否按下（非受控）。', 'Initially pressed (uncontrolled).') },
            { name: 'onChange', type: '(pressed: boolean) => void', description: t('状态变化时触发，参数是新状态。在 onClick 里 preventDefault 可以阻止切换。', 'Fires with the new state when it changes. Call preventDefault in onClick to stop the toggle.') },
            { name: '…', type: 'ButtonProps', description: t('其余同 Button（不支持 href）。', 'Everything else as Button (href not supported).') },
          ]}
        />
        <A11yNotes
          items={t([
            <>根节点是原生 <code>&lt;button type="button"&gt;</code>；传 <code>href</code> 时是 <code>&lt;a&gt;</code>。<kbd>Enter</kbd> 和 <kbd>Space</kbd> 触发按钮，链接只响应 <kbd>Enter</kbd>。</>,
            <>图标按钮必须有 <code>aria-label</code>，读屏读出的是这个名称而不是图标。</>,
            <>加载中带 <code>aria-busy="true"</code>；加载器和对勾是装饰，对读屏隐藏。需要播报结果时请另用 Toast 或 aria-live 区域。</>,
            <>ToggleButton 用 <code>aria-pressed</code> 表达状态，读屏会读“已按下 / 未按下”。</>,
            <>ButtonGroup 是 <code>role="group"</code>，组内按钮各自是 Tab 停靠点，没有方向键导航。</>,
            <>键盘聚焦时显示统一的焦点环；禁用按钮指针为 not-allowed，不响应悬停和按压。</>,
          ], [
            <>The root is a native <code>&lt;button type="button"&gt;</code>, or an <code>&lt;a&gt;</code> when <code>href</code> is set. <kbd>Enter</kbd> and <kbd>Space</kbd> activate a button; a link responds only to <kbd>Enter</kbd>.</>,
            <>Icon buttons must have an <code>aria-label</code>; that name is what screen readers announce, not the icon.</>,
            <>While loading it carries <code>aria-busy="true"</code>; the spinner and check mark are decorative and hidden from screen readers. To announce the result, use a Toast or an aria-live region.</>,
            <>ToggleButton exposes its state through <code>aria-pressed</code>, so screen readers announce “pressed” / “not pressed”.</>,
            <>ButtonGroup is <code>role="group"</code>; each button in it is its own Tab stop, with no arrow-key navigation.</>,
            <>Keyboard focus shows the standard focus ring; disabled buttons get a not-allowed cursor and don’t react to hover or press.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
