import { useState } from 'react';
import { Field, RangeSlider, Slider, Stack, Text } from 'oink-ui';
import type { RangeValue } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/slider', title: 'Slider 滑块', group: '表单与操作', order: 100, subtitle: 'Slider · RangeSlider', en: { title: 'Slider', subtitle: 'Slider · RangeSlider' } };

const box = { width: '100%', maxWidth: 420 };

function ControlledDemo() {
  const t = useT();
  const [volume, setVolume] = useState(40);
  const [saved, setSaved] = useState(40);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 420 }}>
      <Slider aria-label={t('音量', 'Volume')} value={volume} onChange={setVolume} onChangeEnd={setSaved} />
      <Text tone="subtle" variant="caption">{t(`实时值 ${volume} · 松手后保存的值 ${saved}`, `Live ${volume} · saved on release ${saved}`)}</Text>
    </Stack>
  );
}

function PriceDemo() {
  const t = useT();
  const cur = t('¥', '$');
  const [range, setRange] = useState<RangeValue>([200, 600]);
  return (
    <Field label={t('价格区间', 'Price range')} hint={`${cur}${range[0]} – ${cur}${range[1]}`} style={{ width: '100%', maxWidth: 420 }}>
      <RangeSlider value={range} onChange={setRange} min={0} max={1000} step={50} minDistance={100} format={(v) => cur + v} thumbLabels={t<[string, string]>(['最低价', '最高价'], ['Minimum price', 'Maximum price'])} />
    </Field>
  );
}

const CONTROLLED_CODE = {
  zh: `
function ControlledDemo() {
  const [volume, setVolume] = useState(40);
  const [saved, setSaved] = useState(40);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 420 }}>
      <Slider aria-label="音量" value={volume} onChange={setVolume} onChangeEnd={setSaved} />
      <Text tone="subtle" variant="caption">实时值 {volume} · 松手后保存的值 {saved}</Text>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [volume, setVolume] = useState(40);
  const [saved, setSaved] = useState(40);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 420 }}>
      <Slider aria-label="Volume" value={volume} onChange={setVolume} onChangeEnd={setSaved} />
      <Text tone="subtle" variant="caption">Live {volume} · saved on release {saved}</Text>
    </Stack>
  );
}
`,
};

const PRICE_CODE = {
  zh: `
function PriceDemo() {
  const [range, setRange] = useState<RangeValue>([200, 600]);
  return (
    <Field label="价格区间" hint={\`¥\${range[0]} – ¥\${range[1]}\`} style={{ width: '100%', maxWidth: 420 }}>
      <RangeSlider value={range} onChange={setRange} min={0} max={1000} step={50} minDistance={100} format={(v) => '¥' + v} thumbLabels={['最低价', '最高价']} />
    </Field>
  );
}
`,
  en: `
function PriceDemo() {
  const [range, setRange] = useState<RangeValue>([200, 600]);
  return (
    <Field label="Price range" hint={\`$\${range[0]} – $\${range[1]}\`} style={{ width: '100%', maxWidth: 420 }}>
      <RangeSlider value={range} onChange={setRange} min={0} max={1000} step={50} minDistance={100} format={(v) => '$' + v} thumbLabels={['Minimum price', 'Maximum price']} />
    </Field>
  );
}
`,
};

export default function SliderPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Slider 滑块', 'Slider')}
      subtitle="Slider · RangeSlider"
      lead={t(
        '在一个范围里大致选一个值（音量、亮度、缩放），或用 RangeSlider 选一段区间（价格、年龄）。需要精确数字时用 NumberInput，或者两者并排。',
        'Pick a rough value within a range (volume, brightness, zoom), or a span with RangeSlider (price, age). When you need an exact number, use NumberInput, or put the two side by side.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '默认 0–100、步长 1。拖动或键盘聚焦时在滑块上方显示数值气泡。',
        'Defaults to 0–100 with a step of 1. A value bubble appears above the thumb while dragging or with keyboard focus.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Field label="亮度" style={{ width: '100%', maxWidth: 420 }}>
  <Slider defaultValue={60} />
</Field>
`, `
<Field label="Brightness" style={{ width: '100%', maxWidth: 420 }}>
  <Slider defaultValue={60} />
</Field>
`)}
        >
          <Field label={t('亮度', 'Brightness')} style={box}>
            <Slider defaultValue={60} />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('步长与刻度', 'Steps and ticks')} description={t(
        '档位不超过 12 个时可以用 ticks 显示刻度点，滑块用弹簧吸附到刻度；显示刻度时不显示数值气泡。format 决定数值怎么显示，同时用作读屏文字。',
        'With 12 steps or fewer, ticks shows tick marks and the thumb springs onto them; the value bubble is hidden while ticks are shown. format controls how the value is displayed and doubles as the screen reader text.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="字号档位" hint="5 档，带刻度">
    <Slider min={1} max={5} step={1} defaultValue={3} ticks format={(v) => '第 ' + v + ' 档'} />
  </Field>
  <Field label="缩放" hint="步长 25">
    <Slider min={50} max={200} step={25} defaultValue={100} format={(v) => v + '%'} />
  </Field>
  <Field label="不显示气泡">
    <Slider defaultValue={30} bubble={false} />
  </Field>
</Stack>
`, `
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="Text size" hint="5 levels, with ticks">
    <Slider min={1} max={5} step={1} defaultValue={3} ticks format={(v) => 'Level ' + v} />
  </Field>
  <Field label="Zoom" hint="Step 25">
    <Slider min={50} max={200} step={25} defaultValue={100} format={(v) => v + '%'} />
  </Field>
  <Field label="No bubble">
    <Slider defaultValue={30} bubble={false} />
  </Field>
</Stack>
`)}
        >
          <Stack gap={6} style={box}>
            <Field label={t('字号档位', 'Text size')} hint={t('5 档，带刻度', '5 levels, with ticks')}>
              <Slider min={1} max={5} step={1} defaultValue={3} ticks format={(v) => t('第 ' + v + ' 档', 'Level ' + v)} />
            </Field>
            <Field label={t('缩放', 'Zoom')} hint={t('步长 25', 'Step 25')}>
              <Slider min={50} max={200} step={25} defaultValue={100} format={(v) => v + '%'} />
            </Field>
            <Field label={t('不显示气泡', 'No bubble')}>
              <Slider defaultValue={30} bubble={false} />
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('无极', 'Continuous')} description={t(
        'step="any" 不吸附到任何刻度，值是连续的小数；显示时默认取整，用 digits 指定小数位。键盘一步是范围的百分之一。',
        'step="any" doesn’t snap to anything, so the value is a continuous decimal; it’s displayed rounded by default, and digits sets the decimal places. One keyboard step is 1% of the range.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="不透明度">
    <Slider step="any" defaultValue={72.5} format={(v) => Math.round(v) + '%'} />
  </Field>
  <Field label="播放速度" hint="保留两位小数">
    <Slider step="any" min={0.5} max={2} defaultValue={1} digits={2} />
  </Field>
</Stack>
`, `
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="Opacity">
    <Slider step="any" defaultValue={72.5} format={(v) => Math.round(v) + '%'} />
  </Field>
  <Field label="Playback speed" hint="Two decimal places">
    <Slider step="any" min={0.5} max={2} defaultValue={1} digits={2} />
  </Field>
</Stack>
`)}
        >
          <Stack gap={6} style={box}>
            <Field label={t('不透明度', 'Opacity')}>
              <Slider step="any" defaultValue={72.5} format={(v) => Math.round(v) + '%'} />
            </Field>
            <Field label={t('播放速度', 'Playback speed')} hint={t('保留两位小数', 'Two decimal places')}>
              <Slider step="any" min={0.5} max={2} defaultValue={1} digits={2} />
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('禁用', 'Disabled')}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Slider aria-label="禁用的滑块" defaultValue={45} disabled />
  <RangeSlider aria-label="禁用的区间" defaultValue={[20, 70]} disabled />
</Stack>
`, `
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Slider aria-label="Disabled slider" defaultValue={45} disabled />
  <RangeSlider aria-label="Disabled range" defaultValue={[20, 70]} disabled />
</Stack>
`)}
        >
          <Stack gap={6} style={box}>
            <Slider aria-label={t('禁用的滑块', 'Disabled slider')} defaultValue={45} disabled />
            <RangeSlider aria-label={t('禁用的区间', 'Disabled range')} defaultValue={[20, 70]} disabled />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        'onChange 在拖动过程中连续触发；onChangeEnd 在松手或每次按键之后触发一次，适合发请求。',
        'onChange fires continuously while dragging; onChangeEnd fires once on release or after each key press, a good time to send a request.',
      )}>
        <Demo layout="col" code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('区间滑块', 'Range slider')} description={t(
        'RangeSlider 的值是 [下限, 上限]。按在轨道上会移动离得近的那个滑块；两个滑块不能交叉，minDistance 规定它们至少隔多远。',
        'RangeSlider’s value is [lower, upper]. Pressing the track moves whichever thumb is closer; the thumbs can’t cross, and minDistance sets how far apart they must stay.',
      )}>
        <Demo
          title={t('非受控', 'Uncontrolled')}
          layout="col"
          code={t(`
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="年龄范围">
    <RangeSlider min={18} max={80} defaultValue={[25, 45]} format={(v) => v + ' 岁'} />
  </Field>
  <Field label="无极区间">
    <RangeSlider step="any" defaultValue={[12.5, 60]} />
  </Field>
</Stack>
`, `
<Stack gap={6} style={{ width: '100%', maxWidth: 420 }}>
  <Field label="Age range">
    <RangeSlider min={18} max={80} defaultValue={[25, 45]} format={(v) => v + ' yrs'} />
  </Field>
  <Field label="Continuous range">
    <RangeSlider step="any" defaultValue={[12.5, 60]} />
  </Field>
</Stack>
`)}
        >
          <Stack gap={6} style={box}>
            <Field label={t('年龄范围', 'Age range')}>
              <RangeSlider min={18} max={80} defaultValue={[25, 45]} format={(v) => v + t(' 岁', ' yrs')} />
            </Field>
            <Field label={t('无极区间', 'Continuous range')}>
              <RangeSlider step="any" defaultValue={[12.5, 60]} />
            </Field>
          </Stack>
        </Demo>
        <Demo title={t('受控', 'Controlled')} layout="col" code={t(PRICE_CODE.zh, PRICE_CODE.en)}>
          <PriceDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['滑块', '轨道 6 · 滑块 42 × 28 宽胶囊 · 1px 描边'],
            ['按住', '滑块 1.12× · 数值气泡 bouncy 弹出'],
            ['落位', '弹簧落位（分档 / 点击 / 键盘）；连续型拖动时直接跟手'],
            ['无极', 'step="any" · 不吸附刻度，显示值取整'],
            ['键盘', '← → 步进 · PageUp / PageDown 走范围的十分之一 · Home / End'],
          ], [
            ['Thumb', 'Track 6 · thumb 42 × 28 wide pill · 1px stroke'],
            ['Held', 'Thumb 1.12× · value bubble pops in, bouncy'],
            ['Settle', 'Springs into place (stepped / click / keyboard); continuous drags track the pointer directly'],
            ['Continuous', 'step="any" · no snapping, displayed value rounded'],
            ['Keyboard', '← → step · PageUp / PageDown move a tenth of the range · Home / End'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Slider"
          rows={[
            { name: 'value', type: 'number', description: t('当前值（受控）。', 'Current value (controlled).') },
            { name: 'defaultValue', type: 'number', default: 'min', description: t('初始值（非受控）。', 'Initial value (uncontrolled).') },
            { name: 'onChange', type: '(value: number) => void', description: t('值变化时触发，拖动过程中连续触发。', 'Fires when the value changes, continuously while dragging.') },
            { name: 'onChangeEnd', type: '(value: number) => void', description: t('一次操作结束时触发：松手，或每次按键之后。', 'Fires when an interaction ends: on release, or after each key press.') },
            { name: 'min', type: 'number', default: '0', description: t('最小值。', 'Minimum value.') },
            { name: 'max', type: 'number', default: '100', description: t('最大值。', 'Maximum value.') },
            { name: 'step', type: "number | 'any'", default: '1', description: t("步长；'any' 为无极。", "Step; 'any' makes it continuous.") },
            { name: 'ticks', type: 'boolean', description: t('显示刻度点，只在不超过 12 档时生效；此时不显示气泡。', 'Show tick marks; only applies with 12 steps or fewer, and hides the bubble.') },
            { name: 'bubble', type: 'boolean', default: 'true', description: t('拖动或键盘聚焦时显示数值气泡。', 'Show a value bubble while dragging or with keyboard focus.') },
            { name: 'format', type: '(value: number) => string', description: t('数值的显示方式，同时用作 aria-valuetext。', 'How the value is displayed; also used as aria-valuetext.') },
            { name: 'digits', type: 'number', description: t('显示的小数位；无极滑块默认取整。', 'Decimal places displayed; continuous sliders round by default.') },
            { name: 'disabled', type: 'boolean', description: t('禁用。', 'Disabled.') },
            { name: 'name', type: 'string', description: t('表单字段名：多渲染一个隐藏 input。', 'Form field name: renders an extra hidden input.') },
          ]}
        />
        <PropsTable
          title="RangeSlider"
          rows={[
            { name: 'value', type: '[number, number]', description: t('[下限, 上限]（受控）。', '[lower, upper] (controlled).') },
            { name: 'defaultValue', type: '[number, number]', default: '[min, max]', description: t('初始值（非受控）。', 'Initial value (uncontrolled).') },
            { name: 'onChange / onChangeEnd', type: '(value: [number, number]) => void', description: t('同 Slider，参数是区间。', 'As Slider, called with the range.') },
            { name: 'minDistance', type: 'number', default: '0', description: t('两个滑块之间至少隔多远；0 表示可以重合，不能交叉。', 'Minimum distance between the thumbs; 0 lets them meet but not cross.') },
            { name: 'thumbLabels', type: '[string, string]', default: t("['最小值', '最大值']", "['Minimum', 'Maximum']"), description: t('两个滑块各自的可读名称。', 'Accessible names of the two thumbs. The default follows the OinkProvider locale.') },
            { name: 'name', type: 'string', description: t('表单字段名：渲染两个同名的隐藏 input。', 'Form field name: renders two hidden inputs with that name.') },
            { name: 'min / max / step / bubble / format / digits / disabled', type: '—', description: t('同 Slider。不支持 ticks。', 'As Slider. ticks isn’t supported.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>Slider 的根节点是 <code>role="slider"</code>，带 <code>aria-valuemin</code> / <code>aria-valuemax</code> / <code>aria-valuenow</code> / <code>aria-valuetext</code>（取 format 的结果）。</>,
            <>RangeSlider 的根节点是 <code>role="group"</code>，里面两个滑块各自可聚焦，名称取 thumbLabels；它们的取值范围会随对方实时收窄。</>,
            <><kbd>←</kbd> <kbd>↓</kbd> 减一步，<kbd>→</kbd> <kbd>↑</kbd> 加一步；<kbd>PageUp</kbd> / <kbd>PageDown</kbd> 走一大步（范围的十分之一，不小于一步）；<kbd>Home</kbd> / <kbd>End</kbd> 到两端。</>,
            <>必须有可读名称：放进带 label 的 Field（走 <code>aria-labelledby</code>），或给 <code>aria-label</code>。</>,
            <>数值气泡是装饰（<code>aria-hidden</code>）。需要一直看得到当前值时，请在旁边另外显示。</>,
            <>禁用时为 <code>aria-disabled</code> 并离开 Tab 顺序。</>,
          ], [
            <>Slider’s root is <code>role="slider"</code> with <code>aria-valuemin</code> / <code>aria-valuemax</code> / <code>aria-valuenow</code> / <code>aria-valuetext</code> (the result of format).</>,
            <>RangeSlider’s root is <code>role="group"</code>; its two thumbs are each focusable and named by thumbLabels, and each one’s allowed range narrows live as the other moves.</>,
            <><kbd>←</kbd> <kbd>↓</kbd> step down and <kbd>→</kbd> <kbd>↑</kbd> step up; <kbd>PageUp</kbd> / <kbd>PageDown</kbd> take a large step (a tenth of the range, at least one step); <kbd>Home</kbd> / <kbd>End</kbd> go to either end.</>,
            <>It must have an accessible name: put it in a labelled Field (via <code>aria-labelledby</code>) or give it an <code>aria-label</code>.</>,
            <>The value bubble is decorative (<code>aria-hidden</code>). If the current value should always be visible, show it separately alongside.</>,
            <>When disabled it’s <code>aria-disabled</code> and leaves the Tab order.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
