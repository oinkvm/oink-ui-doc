import { useState } from 'react';
import { Button, Code, Divider, Icon, Kbd, Spacer, Stack, Text, ToggleButton, Toolbar } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/toolbar', title: 'Toolbar 工具栏', group: '布局', order: 9, subtitle: 'Toolbar', en: { title: 'Toolbar' } };

const BASIC_CODE = {
  zh: `import { useState } from 'react';
import { Button, Divider, Icon, Spacer, Stack, Text, ToggleButton, Toolbar } from 'oink-ui';

function Editor() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Toolbar aria-label="文字格式">
        <ToggleButton size="sm" variant="ghost" pressed={bold} onChange={setBold}>加粗</ToggleButton>
        <ToggleButton size="sm" variant="ghost" pressed={italic} onChange={setItalic}>斜体</ToggleButton>
        <Divider orientation="vertical" decorative />
        <Button size="sm" variant="ghost" iconOnly aria-label="复制"><Icon name="copy" /></Button>
        <Button size="sm" variant="ghost" iconOnly aria-label="删除"><Icon name="trash" /></Button>
        <Spacer />
        <Button size="sm" variant="primary">发布</Button>
      </Toolbar>
      <Text style={{ fontWeight: bold ? 700 : 450, fontStyle: italic ? 'italic' : 'normal' }}>
        工具栏只占一个 Tab 停靠点，进去之后用方向键移动。
      </Text>
    </Stack>
  );
}`,
  en: `import { useState } from 'react';
import { Button, Divider, Icon, Spacer, Stack, Text, ToggleButton, Toolbar } from 'oink-ui';

function Editor() {
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Toolbar aria-label="Text formatting">
        <ToggleButton size="sm" variant="ghost" pressed={bold} onChange={setBold}>Bold</ToggleButton>
        <ToggleButton size="sm" variant="ghost" pressed={italic} onChange={setItalic}>Italic</ToggleButton>
        <Divider orientation="vertical" decorative />
        <Button size="sm" variant="ghost" iconOnly aria-label="Copy"><Icon name="copy" /></Button>
        <Button size="sm" variant="ghost" iconOnly aria-label="Delete"><Icon name="trash" /></Button>
        <Spacer />
        <Button size="sm" variant="primary">Publish</Button>
      </Toolbar>
      <Text style={{ fontWeight: bold ? 700 : 450, fontStyle: italic ? 'italic' : 'normal' }}>
        The toolbar is a single Tab stop; once inside, move with the arrow keys.
      </Text>
    </Stack>
  );
}`,
};

const VERTICAL_CODE = {
  zh: `import { Button, Icon, Toolbar } from 'oink-ui';

<Toolbar orientation="vertical" aria-label="画布工具" loop={false}>
  <Button variant="ghost" iconOnly aria-label="编辑"><Icon name="edit" /></Button>
  <Button variant="ghost" iconOnly aria-label="调整"><Icon name="sliders" /></Button>
  <Button variant="ghost" iconOnly aria-label="随机"><Icon name="shuffle" /></Button>
  <Button variant="ghost" iconOnly aria-label="更多"><Icon name="more" /></Button>
</Toolbar>`,
  en: `import { Button, Icon, Toolbar } from 'oink-ui';

<Toolbar orientation="vertical" aria-label="Canvas tools" loop={false}>
  <Button variant="ghost" iconOnly aria-label="Edit"><Icon name="edit" /></Button>
  <Button variant="ghost" iconOnly aria-label="Adjust"><Icon name="sliders" /></Button>
  <Button variant="ghost" iconOnly aria-label="Shuffle"><Icon name="shuffle" /></Button>
  <Button variant="ghost" iconOnly aria-label="More"><Icon name="more" /></Button>
</Toolbar>`,
};

function Editor() {
  const t = useT();
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Toolbar aria-label={t('文字格式', 'Text formatting')}>
        <ToggleButton size="sm" variant="ghost" pressed={bold} onChange={setBold}>{t('加粗', 'Bold')}</ToggleButton>
        <ToggleButton size="sm" variant="ghost" pressed={italic} onChange={setItalic}>{t('斜体', 'Italic')}</ToggleButton>
        <Divider orientation="vertical" decorative />
        <Button size="sm" variant="ghost" iconOnly aria-label={t('复制', 'Copy')}><Icon name="copy" /></Button>
        <Button size="sm" variant="ghost" iconOnly aria-label={t('删除', 'Delete')}><Icon name="trash" /></Button>
        <Spacer />
        <Button size="sm" variant="primary">{t('发布', 'Publish')}</Button>
      </Toolbar>
      <Text style={{ fontWeight: bold ? 700 : 450, fontStyle: italic ? 'italic' : 'normal' }}>
        {t('工具栏只占一个 Tab 停靠点，进去之后用方向键移动。', 'The toolbar is a single Tab stop; once inside, move with the arrow keys.')}
      </Text>
    </Stack>
  );
}

export default function ToolbarPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('把一组相关的控件收成一条：整条只占一个 Tab 停靠点，方向键在控件之间移动。放不下时沿主轴原生滚动。里面放按钮、开关按钮、分隔线、Spacer 都可以。', 'Gathers a set of related controls into one strip: the whole strip is a single Tab stop and the arrow keys move between controls. When it doesn’t fit, it scrolls natively along its main axis. Buttons, toggle buttons, dividers and Spacers can all go inside.')}>
      <DocSection title={t('示例', 'Examples')}>
        <Demo
          title={t('横向', 'Horizontal')}
          description={t(
            <>先 <Kbd k="Tab" /> 进入工具栏，再按 <Kbd k="ArrowRight" /> <Kbd k="ArrowLeft" /> 移动，<Kbd>Home</Kbd> / <Kbd>End</Kbd> 到两端。再按一次 <Kbd k="Tab" /> 直接离开。</>,
            <>Press <Kbd k="Tab" /> to enter the toolbar, then <Kbd k="ArrowRight" /> <Kbd k="ArrowLeft" /> to move and <Kbd>Home</Kbd> / <Kbd>End</Kbd> to jump to either end. One more <Kbd k="Tab" /> leaves it.</>,
          )}
          code={t(BASIC_CODE.zh, BASIC_CODE.en)}
          layout="block"
        >
          <Editor />
        </Demo>
        <Demo title={t('纵向', 'Vertical')} description={t('orientation="vertical" 时改用 ↑ ↓。这里关掉了 loop：走到头不再回到另一端。', 'With orientation="vertical" it uses ↑ ↓ instead. loop is off here, so reaching one end doesn’t wrap around to the other.')} code={t(VERTICAL_CODE.zh, VERTICAL_CODE.en)}>
          <Toolbar orientation="vertical" aria-label={t('画布工具', 'Canvas tools')} loop={false}>
            <Button variant="ghost" iconOnly aria-label={t('编辑', 'Edit')}><Icon name="edit" /></Button>
            <Button variant="ghost" iconOnly aria-label={t('调整', 'Adjust')}><Icon name="sliders" /></Button>
            <Button variant="ghost" iconOnly aria-label={t('随机', 'Shuffle')}><Icon name="shuffle" /></Button>
            <Button variant="ghost" iconOnly aria-label={t('更多', 'More')}><Icon name="more" /></Button>
          </Toolbar>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'orientation', type: `'horizontal' | 'vertical'`, default: `'horizontal'`, description: t('排列方向，同时决定用哪一对方向键。', 'Layout direction, which also decides which pair of arrow keys is used.') },
            { name: 'gap', type: 'Responsive<Space>', default: '2', description: t('子项间距（间距档位）。', 'Spacing between children (spacing step).') },
            { name: 'loop', type: 'boolean', default: 'true', description: t('方向键走到头后回到另一端。', 'Arrow keys wrap around from one end to the other.') },
            { name: 'wrap', type: 'boolean', default: 'false', description: t('放不下时换行，而不是横向滚动。只对横向工具栏有效。', 'Wraps instead of scrolling horizontally when it doesn’t fit. Horizontal toolbars only.') },
            { name: 'aria-label', type: 'string', description: t('工具栏的名字。页面上有多条时必须给。', 'Name of the toolbar. Required when a page has more than one.') },
            restRow(t),
          ]}
        />
        <A11yNotes
          items={t([
            <>根节点是 <Code>role="toolbar"</Code>，带 <Code>aria-orientation</Code>。记得给 <Code>aria-label</Code> 或 <Code>aria-labelledby</Code>。</>,
            <>roving tabindex：只有当前项能被 Tab 到，上次停在哪一项，下次 Tab 回来还在那一项。</>,
            <>← → （纵向为 ↑ ↓）移动，Home / End 到两端。禁用的按钮会被跳过。</>,
            <>焦点在文本输入框里时方向键留给光标，不会被工具栏拦走；带 Ctrl / Alt / ⌘ 的组合键也不拦。</>,
            <>图标按钮各自要有 <Code>aria-label</Code>；纯分组用的分隔线传 <Code>decorative</Code>。</>,
          ], [
            <>The root is <Code>role="toolbar"</Code> with <Code>aria-orientation</Code>. Remember to give it an <Code>aria-label</Code> or <Code>aria-labelledby</Code>.</>,
            <>Roving tabindex: only the current item is reachable with Tab, and tabbing back returns to wherever you last left off.</>,
            <>← → (↑ ↓ when vertical) move, Home / End jump to either end. Disabled buttons are skipped.</>,
            <>When focus is in a text input, the arrow keys stay with the caret and aren’t captured by the toolbar; combinations with Ctrl / Alt / ⌘ aren’t captured either.</>,
            <>Each icon button needs its own <Code>aria-label</Code>; dividers used only for grouping get <Code>decorative</Code>.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
