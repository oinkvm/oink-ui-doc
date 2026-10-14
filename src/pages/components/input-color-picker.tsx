import { useState } from 'react';
import { Button, ColorPicker, Field, Popover, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/color-picker', title: 'ColorPicker 取色器', group: '表单与操作', order: 145, subtitle: 'ColorPicker', en: { title: 'ColorPicker' } };

const SWATCHES = ['#ff6b8e', '#ff7a2f', '#ffbe3b', '#4cd787', '#4c8dff', '#b57bff', '#1b1c22'];

/** 触发按钮前面的色点 */
function Dot({ color }: { color: string }) {
  return <span aria-hidden="true" style={{ display: 'inline-block', flex: 'none', verticalAlign: 'middle', width: 16, height: 16, borderRadius: '50%', background: color, boxShadow: 'inset 0 0 0 1px var(--ok-line-2)' }} />;
}

function ControlledDemo() {
  const t = useT();
  const [color, setColor] = useState('#4c8dff');
  const [saved, setSaved] = useState('#4c8dff');
  return (
    <Stack gap={3} align="center">
      <ColorPicker aria-label={t('标签颜色', 'Label color')} value={color} onChange={setColor} onChangeEnd={setSaved} />
      <Text tone="subtle" variant="caption">{t(`实时值 ${color} · 一次操作结束后保存的值 ${saved}`, `Live ${color} · saved at end of interaction ${saved}`)}</Text>
    </Stack>
  );
}

function PopoverDemo() {
  const t = useT();
  const [color, setColor] = useState('#ff6b8e');
  return (
    <Popover
      aria-label={t('选择强调色', 'Choose accent color')}
      placement="bottom-start"
      trigger={<Button leading={<Dot color={color} />}>{t('强调色', 'Accent')} {color}</Button>}
    >
      <ColorPicker aria-label={t('强调色', 'Accent color')} value={color} onChange={setColor} swatches={SWATCHES} />
    </Popover>
  );
}

const CONTROLLED_CODE = {
  zh: `
function ControlledDemo() {
  const [color, setColor] = useState('#4c8dff');
  const [saved, setSaved] = useState('#4c8dff');
  return (
    <Stack gap={3} align="center">
      <ColorPicker aria-label="标签颜色" value={color} onChange={setColor} onChangeEnd={setSaved} />
      <Text tone="subtle" variant="caption">实时值 {color} · 一次操作结束后保存的值 {saved}</Text>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [color, setColor] = useState('#4c8dff');
  const [saved, setSaved] = useState('#4c8dff');
  return (
    <Stack gap={3} align="center">
      <ColorPicker aria-label="Label color" value={color} onChange={setColor} onChangeEnd={setSaved} />
      <Text tone="subtle" variant="caption">Live {color} · saved at end of interaction {saved}</Text>
    </Stack>
  );
}
`,
};

const POPOVER_CODE = {
  zh: `
function PopoverDemo() {
  const [color, setColor] = useState('#ff6b8e');
  return (
    <Popover
      aria-label="选择强调色"
      placement="bottom-start"
      trigger={<Button leading={<Dot color={color} />}>强调色 {color}</Button>}
    >
      <ColorPicker aria-label="强调色" value={color} onChange={setColor} swatches={SWATCHES} />
    </Popover>
  );
}
`,
  en: `
function PopoverDemo() {
  const [color, setColor] = useState('#ff6b8e');
  return (
    <Popover
      aria-label="Choose accent color"
      placement="bottom-start"
      trigger={<Button leading={<Dot color={color} />}>Accent {color}</Button>}
    >
      <ColorPicker aria-label="Accent color" value={color} onChange={setColor} swatches={SWATCHES} />
    </Popover>
  );
}
`,
};

export default function ColorPickerPage() {
  const t = useT();
  return (
    <DocPage
      title={t('ColorPicker 取色器', 'ColorPicker')}
      subtitle="ColorPicker"
      lead={t(
        '选任意一个颜色：自定义主题色、标签色、画板颜色。它是一块内联的面板，本身不弹出；要从按钮弹出时放进 Popover。只在几个预设里挑时用 ColorSwatches 更简单。',
        'Pick any color: a custom theme color, a label color, a canvas color. It’s an inline panel and doesn’t pop up by itself; put it in a Popover to open it from a button. When choosing among a few presets, ColorSwatches is simpler.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '上面的方块横向是饱和度、纵向是亮度；下面是色相条和十六进制输入框。浏览器支持屏幕取色（EyeDropper）时，输入框旁边会多出一个吸管按钮。值统一是小写的 #rrggbb。',
        'In the square on top, the horizontal axis is saturation and the vertical axis is brightness; below are the hue bar and a hex input. When the browser supports screen color picking (EyeDropper), an eyedropper button appears next to the input. Values are always lowercase #rrggbb.',
      )}>
        <Demo
          code={t(`
<ColorPicker aria-label="背景色" defaultValue="#ff6b8e" />
`, `
<ColorPicker aria-label="Background color" defaultValue="#ff6b8e" />
`)}
        >
          <ColorPicker aria-label={t('背景色', 'Background color')} defaultValue="#ff6b8e" />
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        'onChange 在拖动过程中连续触发，适合实时预览；onChangeEnd 在一次操作结束时触发（松开指针、每次按键、输入框提交、点色板），适合保存或写进历史记录。',
        'onChange fires continuously while dragging, good for live previews; onChangeEnd fires when an interaction ends (pointer released, each key press, input committed, swatch clicked), good for saving or recording history.',
      )}>
        <Demo code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('预设色板', 'Preset swatches')} description={t(
        'swatches 在面板下方放一排预设颜色，点一下就选中；当前颜色正好是其中之一时，那个色块带选中标记。',
        'swatches adds a row of preset colors below the panel; one click selects a color. When the current color matches one of them, that swatch shows a selected mark.',
      )}>
        <Demo
          code={t(`
const SWATCHES = ['#ff6b8e', '#ff7a2f', '#ffbe3b', '#4cd787', '#4c8dff', '#b57bff', '#1b1c22'];

<ColorPicker aria-label="分类颜色" defaultValue="#4cd787" swatches={SWATCHES} />
`, `
const SWATCHES = ['#ff6b8e', '#ff7a2f', '#ffbe3b', '#4cd787', '#4c8dff', '#b57bff', '#1b1c22'];

<ColorPicker aria-label="Category color" defaultValue="#4cd787" swatches={SWATCHES} />
`)}
        >
          <ColorPicker aria-label={t('分类颜色', 'Category color')} defaultValue="#4cd787" swatches={SWATCHES} />
        </Demo>
      </DocSection>

      <DocSection title={t('放进 Popover', 'Inside a Popover')} description={t(
        '点按钮弹出面板，Esc 或点外面关闭。方块的圆角会按 Popover 的内边距自动收小，和浮层的圆角同心。',
        'Click the button to open the panel; Esc or a click outside closes it. The square’s corner radius shrinks by the Popover’s padding so it stays concentric with the overlay.',
      )}>
        <Demo minHeight={420} align="start" style={{ alignContent: 'flex-start' }} code={t(POPOVER_CODE.zh, POPOVER_CODE.en)}>
          <PopoverDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('禁用与 Field', 'Disabled and Field')}>
        <Demo
          layout="col"
          align="start"
          code={t(`
<Stack gap={5}>
  <Field label="品牌色" hint="用于按钮和链接">
    <ColorPicker defaultValue="#b57bff" />
  </Field>
  <Field label="已锁定">
    <ColorPicker defaultValue="#ff7a2f" disabled />
  </Field>
</Stack>
`, `
<Stack gap={5}>
  <Field label="Brand color" hint="Used for buttons and links">
    <ColorPicker defaultValue="#b57bff" />
  </Field>
  <Field label="Locked">
    <ColorPicker defaultValue="#ff7a2f" disabled />
  </Field>
</Stack>
`)}
        >
          <Stack gap={5}>
            <Field label={t('品牌色', 'Brand color')} hint={t('用于按钮和链接', 'Used for buttons and links')}>
              <ColorPicker defaultValue="#b57bff" />
            </Field>
            <Field label={t('已锁定', 'Locked')}>
              <ColorPicker defaultValue="#ff7a2f" disabled />
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['面板', '默认宽 240（不超过容器）· 零件间距 12'],
            ['方块', '3 : 2 · 圆角 12，放进浮层或卡片时按同心圆角收小'],
            ['色相条', '原生 range 换肤 · 色带 12 · 圆钮 22'],
            ['圆钮', '3px 白圈 + 发丝线 · 悬停 1.05× · 按住 1.18×'],
          ], [
            ['Panel', 'Default width 240 (capped at the container) · 12 between parts'],
            ['Square', '3 : 2 · corner radius 12, shrinks to stay concentric inside overlays and cards'],
            ['Hue bar', 'Restyled native range · band 12 · thumb 22'],
            ['Thumb', '3px white ring + hairline · hover 1.05× · held 1.18×'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="ColorPicker"
          rows={[
            { name: 'value', type: 'string', description: t('当前颜色，#rrggbb（受控）。大小写都可以，输出统一小写。', 'Current color as #rrggbb (controlled). Either case is accepted; output is always lowercase.') },
            { name: 'defaultValue', type: 'string', default: "'#ff6b8e'", description: t('初始颜色（非受控）。', 'Initial color (uncontrolled).') },
            { name: 'onChange', type: '(hex: string) => void', description: t('颜色变化时触发，拖动过程中连续触发。', 'Fires when the color changes, continuously while dragging.') },
            { name: 'onChangeEnd', type: '(hex: string) => void', description: t('一次操作结束时触发：松开指针、键盘调整、输入框提交、点色板、屏幕取色。', 'Fires when an interaction ends: pointer released, keyboard adjustment, input committed, swatch clicked, screen color picked.') },
            { name: 'swatches', type: 'string[]', description: t('面板下方的预设颜色。', 'Preset colors below the panel.') },
            { name: 'disabled', type: 'boolean', description: t('整体禁用。', 'Disable the whole picker.') },
            { name: 'aria-label', type: 'string', default: t("'颜色'", "'Color'"), description: t('整组的名称；放进 Field 时默认取 Field 的标签。', 'Name of the group; inside a Field it defaults to the Field label. The default follows the OinkProvider locale.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>根节点是 <code>role="group"</code>，名称取 aria-label（默认“颜色”）或 Field 的标签。</>,
            <>方块是 <code>role="slider"</code>，<code>aria-roledescription="二维滑块"</code>，读屏读出 <code>aria-valuetext</code>，如“饱和度 60%，亮度 80%”。<kbd>←</kbd> / <kbd>→</kbd> 调饱和度，<kbd>↑</kbd> / <kbd>↓</kbd> 调亮度，一步 1%，按住 <kbd>Shift</kbd> 一步 10%；<kbd>PageUp</kbd> / <kbd>PageDown</kbd> 亮度 ±10%；<kbd>Home</kbd> / <kbd>End</kbd> 饱和度到两端。</>,
            <>色相条是原生的 <code>&lt;input type="range"&gt;</code>，键盘、触屏拖动和读屏都按浏览器的原生行为，读出“色相 120°”这样的值。</>,
            <>十六进制输入框在失焦或按 <kbd>Enter</kbd> 时校验，接受 #rgb、#rrggbb，大小写不限、可以省略 #；不合法时恢复成当前颜色，<kbd>Esc</kbd> 放弃这次编辑。</>,
            <>颜色本身之外还有文字：输入框里始终显示十六进制值，色板每个色块的名称就是它的色值。</>,
            <>屏幕取色按钮只在浏览器支持 EyeDropper 时出现（挂载后才检测，预渲染的页面和注水后的第一帧一致）。</>,
          ], [
            <>The root is <code>role="group"</code>, named by aria-label (default “Color”) or the Field label.</>,
            <>The square is <code>role="slider"</code> with <code>aria-roledescription="2D slider"</code>; screen readers read its <code>aria-valuetext</code>, such as “Saturation 60%, brightness 80%”. <kbd>←</kbd> / <kbd>→</kbd> adjust saturation and <kbd>↑</kbd> / <kbd>↓</kbd> brightness, 1% per step, 10% with <kbd>Shift</kbd>; <kbd>PageUp</kbd> / <kbd>PageDown</kbd> change brightness by ±10%; <kbd>Home</kbd> / <kbd>End</kbd> take saturation to either end.</>,
            <>The hue bar is a native <code>&lt;input type="range"&gt;</code>, so keyboard, touch dragging and screen readers all get the browser’s native behavior, reading values like “Hue 120°”.</>,
            <>The hex input validates on blur or <kbd>Enter</kbd>. It accepts #rgb and #rrggbb in any case, with or without the #; invalid input reverts to the current color, and <kbd>Esc</kbd> abandons the edit.</>,
            <>Color is never the only cue: the input always shows the hex value, and each swatch is named by its color value.</>,
            <>The eyedropper button appears only when the browser supports EyeDropper (detected after mount, so the prerendered page matches the first hydrated frame).</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
