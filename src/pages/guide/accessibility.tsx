import { Alert, Badge, Button, Card, Code, Field, Grid, Icon, Inline, Input, Kbd, Stack, Switch, Text } from 'oink-ui';
import { Demo, DocPage, DocSection } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import './guide.css';

export const meta: PageMeta = { path: '/guide/accessibility', title: '无障碍', group: '开始', order: 9, subtitle: 'Accessibility', en: { title: 'Accessibility' } };

const GUARANTEES = [
  {
    key: 'semantics',
    title: { zh: '语义', en: 'Semantics' },
    text: {
      zh: '用对的原生元素：按钮是 <button type="button">，开关、复选框、单选是真的 <input>，链接是 <a>。复合组件按 WAI-ARIA 的模式带上 role 和 aria-* 属性。',
      en: 'The right native elements: buttons are <button type="button">, switches, checkboxes and radios are real <input>s, links are <a>. Composite components follow WAI-ARIA patterns with the matching role and aria-* attributes.',
    },
  },
  {
    key: 'keyboard',
    title: { zh: '键盘', en: 'Keyboard' },
    text: {
      zh: 'Tab 进出，方向键在组内移动，Home / End 到两端，Enter / Space 触发，Esc 关闭。组内用 roving tabindex 或 aria-activedescendant，一个组只占一个 Tab 停靠点。',
      en: 'Tab moves in and out, arrow keys move within a group, Home / End jump to the ends, Enter / Space activate, Esc closes. Groups use roving tabindex or aria-activedescendant, so each group is a single Tab stop.',
    },
  },
  {
    key: 'ring',
    title: { zh: '焦点环', en: 'Focus ring' },
    text: {
      zh: '所有可交互元素共用一套焦点环：2px 强调色描边，只在键盘聚焦（:focus-visible）时出现，指针点击不会留下。',
      en: 'Every interactive element shares one focus ring: a 2px accent-color outline that appears only on keyboard focus (:focus-visible) and never lingers after a pointer click.',
    },
  },
  {
    key: 'focus',
    title: { zh: '焦点管理', en: 'Focus management' },
    text: {
      zh: '模态的悬浮卡片会圈住焦点、锁住页面滚动，关闭后把焦点还给触发它的元素；非模态的面板不圈焦点，焦点在里面时 Esc 关闭。',
      en: 'Modal floating cards trap focus and lock page scrolling, then return focus to the element that opened them when closed. Non-modal panels don’t trap focus; Esc closes them while focus is inside.',
    },
  },
  {
    key: 'motion',
    title: { zh: '减弱动效', en: 'Reduced motion' },
    text: {
      zh: '系统开了“减弱动态效果”时，全局倍率 --ok-ms 变成 0：位移和缩放归零，只保留状态切换。脚本动画走 animate()，同样受这个倍率控制。',
      en: 'When the system’s “Reduce motion” setting is on, the global multiplier --ok-ms becomes 0: movement and scaling drop to zero and only state changes remain. Scripted animations go through animate() and obey the same multiplier.',
    },
  },
  {
    key: 'contrast',
    title: { zh: '对比度', en: 'Contrast' },
    text: {
      zh: '文字色 --ok-text、--ok-text-2 和各状态的 -text 色在两套主题的表面上都不低于 4.5:1。状态除了颜色还有图标、文字或形状做第二种提示。',
      en: 'Text colors --ok-text, --ok-text-2 and each status’s -text color reach at least 4.5:1 on the surfaces of both themes. Besides color, every status has a second cue: an icon, text or shape.',
    },
  },
  {
    key: 'touch',
    title: { zh: '触屏尺寸', en: 'Touch targets' },
    text: {
      zh: '触屏设备上控件高度自动抬到 36 / 44 / 52，点按区域不小于 44px；悬停样式都包在 @media (hover: hover) 里，不依赖悬停才能看到的信息。',
      en: 'On touch screens control heights rise to 36 / 44 / 52 automatically and tap targets are at least 44px. Hover styles are wrapped in @media (hover: hover), and no information is only visible on hover.',
    },
  },
  {
    key: 'live',
    title: { zh: '播报', en: 'Announcements' },
    text: {
      zh: 'Toast、表单错误、复制结果这类变化通过 aria-live 播报；危险类通知用 assertive，其余用 polite。',
      en: 'Changes such as toasts, form errors and copy results are announced through aria-live: assertive for danger notifications, polite for everything else.',
    },
  },
];

const FOCUS_CODE = {
  zh: `import { Button, Inline, Input, Switch } from 'oink-ui';

<Inline gap={3}>
  <Button>按钮</Button>
  <Button variant="primary">主按钮</Button>
  <Switch aria-label="示例开关" />
  <Input placeholder="输入框" aria-label="示例输入" block={false} />
</Inline>`,
  en: `import { Button, Inline, Input, Switch } from 'oink-ui';

<Inline gap={3}>
  <Button>Button</Button>
  <Button variant="primary">Primary</Button>
  <Switch aria-label="Example switch" />
  <Input placeholder="Input" aria-label="Example input" block={false} />
</Inline>`,
};

const NAME_CODE = {
  zh: `import { Button, Field, Icon, Inline, Input, Switch } from 'oink-ui';

{/* 图标按钮：iconOnly 时 TypeScript 会要求 aria-label */}
<Button iconOnly aria-label="删除" variant="ghost"><Icon name="trash" /></Button>

{/* 没有可见文字的开关：给 aria-label；有文字就写在 children 里 */}
<Switch aria-label="夜间免打扰" />
<Switch>夜间免打扰</Switch>

{/* 输入框：放进 Field，标签、提示、错误会自动接到控件上 */}
<Field label="邮箱" hint="用于接收通知" error="邮箱格式不对">
  <Input type="email" defaultValue="oink@" />
</Field>`,
  en: `import { Button, Field, Icon, Inline, Input, Switch } from 'oink-ui';

{/* Icon button: with iconOnly, TypeScript requires aria-label */}
<Button iconOnly aria-label="Delete" variant="ghost"><Icon name="trash" /></Button>

{/* Switch without visible text: give it aria-label; with text, put it in children */}
<Switch aria-label="Do not disturb at night" />
<Switch>Do not disturb at night</Switch>

{/* Input: wrap it in Field and the label, hint and error are wired to the control */}
<Field label="Email" hint="Used for notifications" error="That email doesn’t look right">
  <Input type="email" defaultValue="oink@" />
</Field>`,
};

const TONE_CODE = {
  zh: `import { Alert, Badge, Inline } from 'oink-ui';

{/* 颜色之外，让文字或图标本身说明状态 */}
<Inline gap={2}>
  <Badge tone="success" dot>已发布</Badge>
  <Badge tone="warning" dot>待审核</Badge>
  <Badge tone="danger" dot>已下线</Badge>
</Inline>
<Alert tone="danger" title="保存失败">网络断开了，稍后会自动重试。</Alert>`,
  en: `import { Alert, Badge, Inline } from 'oink-ui';

{/* Beyond color, let the text or icon itself state the status */}
<Inline gap={2}>
  <Badge tone="success" dot>Published</Badge>
  <Badge tone="warning" dot>In review</Badge>
  <Badge tone="danger" dot>Unpublished</Badge>
</Inline>
<Alert tone="danger" title="Couldn’t save">The network dropped. We’ll retry automatically in a moment.</Alert>`,
};

export default function Accessibility() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '无障碍是组件的默认行为，不是可选项。这一页分两部分：库替你保证了什么，以及哪些事只有使用者才能做。每个组件页的末尾还有该组件自己的键盘和读屏说明。',
        'Accessibility is the default behavior of every component, not an option. This page has two parts: what the library guarantees for you, and what only you can do. Each component page also ends with its own keyboard and screen reader notes.',
      )}
    >
      <DocSection title={t('库的通用保证', 'What the library guarantees')}>
        <Grid minItemWidth={260} gap={3}>
          {GUARANTEES.map((g) => (
            <Card key={g.key}>
              <Stack gap={1}>
                <Text as="h3" variant="label" style={{ margin: 0 }}>{t(g.title.zh, g.title.en)}</Text>
                <Text as="p" variant="caption" tone="neutral" style={{ margin: 0 }}>{t(g.text.zh, g.text.en)}</Text>
              </Stack>
            </Card>
          ))}
        </Grid>
      </DocSection>

      <DocSection
        title={t('焦点环', 'Focus ring')}
        description={t(
          <>点一下预览区的空白处，然后按 <Kbd k="Tab" /> 依次走过这些控件。自己写的可交互元素加上类名 <Code>ok-focusable</Code> 就能得到同一套焦点环。</>,
          <>Click an empty spot in the preview, then press <Kbd k="Tab" /> to step through the controls. Add the class <Code>ok-focusable</Code> to your own interactive elements to get the same focus ring.</>,
        )}
      >
        <Demo code={t(FOCUS_CODE.zh, FOCUS_CODE.en)}>
          <Inline gap={3}>
            <Button>{t('按钮', 'Button')}</Button>
            <Button variant="primary">{t('主按钮', 'Primary')}</Button>
            <Switch aria-label={t('示例开关', 'Example switch')} />
            <Input placeholder={t('输入框', 'Input')} aria-label={t('示例输入', 'Example input')} block={false} />
          </Inline>
        </Demo>
      </DocSection>

      <DocSection title={t('使用者要做的事', 'What you need to do')} description={t('下面这些，库没法替你决定。', 'The library can’t decide these for you.')}>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>给没有可见文字的控件起名字。</strong>图标按钮、没有标签的开关和滑块、搜索框，都要有 <Code>aria-label</Code> 或 <Code>aria-labelledby</Code>。</li>
              <li><strong>给区域和导航起名字。</strong>页面上有多个 <Code>Nav</Code>、<Code>Toolbar</Code>、<Code>ScrollArea</Code>、悬浮卡片时，用 <Code>aria-label</Code> 或标题把它们区分开。</li>
              <li><strong>保持标题层级。</strong>每页一个 <Code>h1</Code>，往下逐级。<Code>Heading</Code> 的 <Code>level</Code> 决定语义，<Code>variant</Code> 决定大小，两者可以分开选；<Code>CardHeader</Code>、<Code>Section</Code>、<Code>FloatingHeader</Code> 都能指定标题级别。</li>
              <li><strong>不要只靠颜色。</strong>状态要有文字或图标；图表、色板要有名字。</li>
              <li><strong>表单要有标签和错误文字。</strong>用 <Code>Field</Code> 包住控件，标签、提示、错误信息会自动通过 <Code>id</Code> 和 <Code>aria-describedby</Code> 接上。</li>
              <li><strong>图片要有替代文字。</strong><Code>Avatar</Code> 的 <Code>name</Code> 就是读屏读到的名字；有含义的 <Code>Icon</Code> 给 <Code>label</Code>，纯装饰的不用管，默认对读屏隐藏。</li>
              <li><strong>不要去掉焦点环。</strong>不要写 <Code>outline: none</Code> 覆盖 <Code>:focus-visible</Code>。</li>
              <li><strong>谨慎使用 motion="full"。</strong>它会无视系统的减弱动效设置，只应该在用户自己明确选择时启用。</li>
            </ul>,
            <ul>
              <li><strong>Name controls that have no visible text.</strong> Icon buttons, switches and sliders without labels, and search boxes all need <Code>aria-label</Code> or <Code>aria-labelledby</Code>.</li>
              <li><strong>Name regions and navigation.</strong> When a page has several <Code>Nav</Code>, <Code>Toolbar</Code>, <Code>ScrollArea</Code> or floating cards, tell them apart with <Code>aria-label</Code> or a heading.</li>
              <li><strong>Keep the heading hierarchy.</strong> One <Code>h1</Code> per page, then step down one level at a time. On <Code>Heading</Code>, <Code>level</Code> sets the semantics and <Code>variant</Code> sets the size, so you can pick them separately; <Code>CardHeader</Code>, <Code>Section</Code> and <Code>FloatingHeader</Code> all accept a heading level.</li>
              <li><strong>Don’t rely on color alone.</strong> Statuses need text or an icon; charts and swatches need names.</li>
              <li><strong>Give forms labels and error text.</strong> Wrap controls in <Code>Field</Code> and the label, hint and error message are connected through <Code>id</Code> and <Code>aria-describedby</Code>.</li>
              <li><strong>Give images alternative text.</strong> An <Code>Avatar</Code>’s <Code>name</Code> is what screen readers announce; give a meaningful <Code>Icon</Code> a <Code>label</Code>. Decorative icons need nothing; they are hidden from screen readers by default.</li>
              <li><strong>Don’t remove the focus ring.</strong> Never override <Code>:focus-visible</Code> with <Code>outline: none</Code>.</li>
              <li><strong>Use motion="full" with care.</strong> It ignores the system’s reduced motion setting and should only be enabled when the user has explicitly chosen it.</li>
            </ul>,
          )}
        </div>
        <Demo title={t('名字', 'Names')} code={t(NAME_CODE.zh, NAME_CODE.en)} layout="col" align="start">
          <Inline gap={4}>
            <Button iconOnly aria-label={t('删除', 'Delete')} variant="ghost"><Icon name="trash" /></Button>
            <Switch aria-label={t('夜间免打扰', 'Do not disturb at night')} />
            <Switch>{t('夜间免打扰', 'Do not disturb at night')}</Switch>
          </Inline>
          <div style={{ width: 'min(320px, 100%)' }}>
            <Field label={t('邮箱', 'Email')} hint={t('用于接收通知', 'Used for notifications')} error={t('邮箱格式不对', 'That email doesn’t look right')}>
              <Input type="email" defaultValue="oink@" />
            </Field>
          </div>
        </Demo>
        <Demo title={t('颜色之外的第二种提示', 'A second cue beyond color')} code={t(TONE_CODE.zh, TONE_CODE.en)} layout="col" align="start">
          <Inline gap={2}>
            <Badge tone="success" dot>{t('已发布', 'Published')}</Badge>
            <Badge tone="warning" dot>{t('待审核', 'In review')}</Badge>
            <Badge tone="danger" dot>{t('已下线', 'Unpublished')}</Badge>
          </Inline>
          <Alert tone="danger" title={t('保存失败', 'Couldn’t save')}>{t('网络断开了，稍后会自动重试。', 'The network dropped. We’ll retry automatically in a moment.')}</Alert>
        </Demo>
      </DocSection>

      <DocSection title={t('自查清单', 'Checklist')}>
        <div className="g-prose">
          {t(
            <ol>
              <li>只用键盘走一遍主要流程：每个能点的东西都能 Tab 到，焦点始终看得见，浮层能用 Esc 关掉，关掉后焦点回到原处。</li>
              <li>打开读屏走一遍：每个控件都有名字和角色，状态变化（展开、选中、错误）能被读出来。</li>
              <li>把系统设成“减弱动态效果”：界面仍然可用，没有大幅位移。</li>
              <li>把窗口缩到 375px 宽、把浏览器缩放调到 200%：内容不横向溢出，没有被裁掉的文字。</li>
              <li>切到深色主题再看一遍对比度。</li>
            </ol>,
            <ol>
              <li>Walk through the main flows with only a keyboard: everything clickable is reachable with Tab, focus is always visible, overlays close with Esc, and focus returns to where it was.</li>
              <li>Walk through them again with a screen reader: every control has a name and a role, and state changes (expanded, selected, error) are announced.</li>
              <li>Turn on the system’s “Reduce motion” setting: the interface still works and nothing moves a long way.</li>
              <li>Shrink the window to 375px wide and zoom the browser to 200%: nothing overflows horizontally and no text is clipped.</li>
              <li>Switch to the dark theme and check contrast again.</li>
            </ol>,
          )}
        </div>
      </DocSection>
    </DocPage>
  );
}
