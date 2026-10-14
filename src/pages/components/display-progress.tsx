import { useEffect, useState } from 'react';
import { Button, Code, Inline, Meter, Progress, ProgressRing, Slider, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/progress', title: 'Progress 进度', group: '反馈', order: 20, subtitle: 'Progress · ProgressRing · Meter', en: { title: 'Progress', subtitle: 'Progress · ProgressRing · Meter' } };

const CODE_UPLOAD = {
  zh: `
function UploadDemo() {
  const [value, setValue] = useState(30);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setValue((v) => Math.min(100, v + 5 + Math.round(Math.random() * 12))), 500);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => { if (value >= 100) setRunning(false); }, [value]);
  return (
    <Stack gap={4}>
      <Inline gap={4} wrap={false}>
        <ProgressRing value={value} label="上传进度" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text variant="label" id="upload-demo-label">设计稿.fig {value >= 100 ? '上传完成' : \`已上传 \${value}%\`}</Text>
          <Progress value={value} aria-labelledby="upload-demo-label" />
        </Stack>
      </Inline>
      <Inline>
        <Button size="sm" variant="primary" disabled={running || value >= 100} onClick={() => setRunning(true)}>开始</Button>
        <Button size="sm" disabled={!running} onClick={() => setRunning(false)}>暂停</Button>
        <Button size="sm" variant="ghost" onClick={() => { setRunning(false); setValue(0); }}>重置</Button>
      </Inline>
    </Stack>
  );
}`,
  en: `
function UploadDemo() {
  const [value, setValue] = useState(30);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setValue((v) => Math.min(100, v + 5 + Math.round(Math.random() * 12))), 500);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => { if (value >= 100) setRunning(false); }, [value]);
  return (
    <Stack gap={4}>
      <Inline gap={4} wrap={false}>
        <ProgressRing value={value} label="Upload progress" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text variant="label" id="upload-demo-label">designs.fig {value >= 100 ? 'Upload complete' : \`\${value}% uploaded\`}</Text>
          <Progress value={value} aria-labelledby="upload-demo-label" />
        </Stack>
      </Inline>
      <Inline>
        <Button size="sm" variant="primary" disabled={running || value >= 100} onClick={() => setRunning(true)}>Start</Button>
        <Button size="sm" disabled={!running} onClick={() => setRunning(false)}>Pause</Button>
        <Button size="sm" variant="ghost" onClick={() => { setRunning(false); setValue(0); }}>Reset</Button>
      </Inline>
    </Stack>
  );
}`,
};

const CODE_BARS = {
  zh: `
<Progress size="sm" value={40} label="小号" />
<Progress value={40} label="默认" />
<Progress size="lg" value={40} label="大号" />
<Progress value={55} tone="info" label="信息" />
<Progress value={72} tone="warning" label="警告" />
<Progress value={90} tone="danger" label="危险" />
<Progress value={100} label="完成后自动变绿" />
<Progress value={100} noDoneState label="完成后保持原色" />
<Progress label="正在连接服务器" />`,
  en: `
<Progress size="sm" value={40} label="Small" />
<Progress value={40} label="Default" />
<Progress size="lg" value={40} label="Large" />
<Progress value={55} tone="info" label="Info" />
<Progress value={72} tone="warning" label="Warning" />
<Progress value={90} tone="danger" label="Danger" />
<Progress value={100} label="Turns green when done" />
<Progress value={100} noDoneState label="Keeps its color when done" />
<Progress label="Connecting to server" />`,
};

const CODE_RING = {
  zh: `
<ProgressRing size="sm" value={25} label="小号进度环" />
<ProgressRing value={50} label="默认进度环" />
<ProgressRing size="lg" value={75} label="大号进度环" />
<ProgressRing size="lg" value={100} label="已完成" />
<ProgressRing size={80} thickness={3} value={3} max={5} label="已完成 3 步，共 5 步">3 / 5</ProgressRing>`,
  en: `
<ProgressRing size="sm" value={25} label="Small progress ring" />
<ProgressRing value={50} label="Default progress ring" />
<ProgressRing size="lg" value={75} label="Large progress ring" />
<ProgressRing size="lg" value={100} label="Complete" />
<ProgressRing size={80} thickness={3} value={3} max={5} label="3 of 5 steps complete">3 / 5</ProgressRing>`,
};

const CODE_METER = {
  zh: `
function MeterDemo() {
  const [level, setLevel] = useState(62);
  return (
    <Stack gap={4}>
      <Slider value={level} onChange={setLevel} aria-label="输入电平" />
      <Meter value={level} label="输入电平" valueText={\`\${level}%\`} segments={20} warnAt={70} dangerAt={90} />
    </Stack>
  );
}`,
  en: `
function MeterDemo() {
  const [level, setLevel] = useState(62);
  return (
    <Stack gap={4}>
      <Slider value={level} onChange={setLevel} aria-label="Input level" />
      <Meter value={level} label="Input level" valueText={\`\${level}%\`} segments={20} warnAt={70} dangerAt={90} />
    </Stack>
  );
}`,
};

const CODE_METER_SIZES = {
  zh: `
<Meter size="sm" value={3} max={5} segments={5} label="信号强度" valueText="3 / 5 格" tone="neutral" />
<Meter value={2} max={4} segments={4} label="密码强度" valueText="中等" tone="warning" />
<Meter size="lg" value={80} label="磁盘用量" valueText="80%" tone="info" />`,
  en: `
<Meter size="sm" value={3} max={5} segments={5} label="Signal strength" valueText="3 of 5 bars" tone="neutral" />
<Meter value={2} max={4} segments={4} label="Password strength" valueText="Medium" tone="warning" />
<Meter size="lg" value={80} label="Disk usage" valueText="80%" tone="info" />`,
};

function UploadDemo() {
  const t = useT();
  const [value, setValue] = useState(30);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setValue((v) => Math.min(100, v + 5 + Math.round(Math.random() * 12))), 500);
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => { if (value >= 100) setRunning(false); }, [value]);
  return (
    <Stack gap={4}>
      <Inline gap={4} wrap={false}>
        <ProgressRing value={value} label={t('上传进度', 'Upload progress')} />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text variant="label" id="upload-demo-label">{t('设计稿.fig', 'designs.fig')} {value >= 100 ? t('上传完成', 'Upload complete') : t(`已上传 ${value}%`, `${value}% uploaded`)}</Text>
          <Progress value={value} aria-labelledby="upload-demo-label" />
        </Stack>
      </Inline>
      <Inline>
        <Button size="sm" variant="primary" disabled={running || value >= 100} onClick={() => setRunning(true)}>{t('开始', 'Start')}</Button>
        <Button size="sm" disabled={!running} onClick={() => setRunning(false)}>{t('暂停', 'Pause')}</Button>
        <Button size="sm" variant="ghost" onClick={() => { setRunning(false); setValue(0); }}>{t('重置', 'Reset')}</Button>
      </Inline>
    </Stack>
  );
}

function MeterDemo() {
  const t = useT();
  const [level, setLevel] = useState(62);
  return (
    <Stack gap={4}>
      <Slider value={level} onChange={setLevel} aria-label={t('输入电平', 'Input level')} />
      <Meter value={level} label={t('输入电平', 'Input level')} valueText={`${level}%`} segments={20} warnAt={70} dangerAt={90} />
    </Stack>
  );
}

export default function ProgressPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('Progress 和 ProgressRing 表示一件事做到了多少（上传、导入、加载）；Meter 表示一个量现在有多大（电平、容量、强度）。等待时间很短或无法估计时用 Spinner。', 'Progress and ProgressRing show how far along a task is (uploading, importing, loading); Meter shows how large a quantity is right now (level, capacity, strength). When the wait is very short or can’t be estimated, use Spinner.')}>
      <DocSection title={t('进度条', 'Progress bar')} description={t('value 在 0 到 max 之间。条用 soft 弹簧追赶真实进度；到 100% 自动变成成功色。', 'value runs from 0 to max. The bar chases the real progress on the soft spring and turns the success color at 100%.')}>
        <Demo layout="block" code={t(CODE_UPLOAD.zh, CODE_UPLOAD.en)}>
          <UploadDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸、颜色与不确定进度', 'Sizes, colors and indeterminate')} description={t('三档粗细：sm 4、md 8（默认）、lg 12。tone 换颜色；noDoneState 让 100% 时保持原色。不传 value 就是不确定进度，一小段条来回移动。', 'Three thicknesses: sm 4, md 8 (default), lg 12. tone changes the color; noDoneState keeps the original color at 100%. Without value, it’s indeterminate: a short bar moves back and forth.')}>
        <Demo layout="col" code={t(CODE_BARS.zh, CODE_BARS.en)}>
          <Progress size="sm" value={40} label={t('小号', 'Small')} />
          <Progress value={40} label={t('默认', 'Default')} />
          <Progress size="lg" value={40} label={t('大号', 'Large')} />
          <Progress value={55} tone="info" label={t('信息', 'Info')} />
          <Progress value={72} tone="warning" label={t('警告', 'Warning')} />
          <Progress value={90} tone="danger" label={t('危险', 'Danger')} />
          <Progress value={100} label={t('完成后自动变绿', 'Turns green when done')} />
          <Progress value={100} noDoneState label={t('完成后保持原色', 'Keeps its color when done')} />
          <Progress label={t('正在连接服务器', 'Connecting to server')} />
        </Demo>
      </DocSection>

      <DocSection title={t('进度环', 'Progress ring')} description={t('空间小或需要突出百分比时用环。直径 sm 40、md 64（默认）、lg 96，或像素值；中间的数字滚动更新（sm 放不下，默认不显示）。children 可以换掉中间的内容。', 'Use a ring when space is tight or the percentage should stand out. Diameter is sm 40, md 64 (default), lg 96, or a pixel value; the number in the middle rolls as it updates (sm has no room, so it’s hidden by default). children can replace the center content.')}>
        <Demo code={t(CODE_RING.zh, CODE_RING.en)}>
          <ProgressRing size="sm" value={25} label={t('小号进度环', 'Small progress ring')} />
          <ProgressRing value={50} label={t('默认进度环', 'Default progress ring')} />
          <ProgressRing size="lg" value={75} label={t('大号进度环', 'Large progress ring')} />
          <ProgressRing size="lg" value={100} label={t('已完成', 'Complete')} />
          <ProgressRing size={80} thickness={3} value={3} max={5} label={t('已完成 3 步，共 5 步', '3 of 5 steps complete')}>3 / 5</ProgressRing>
        </Demo>
      </DocSection>

      <DocSection title={t('Meter 分段电平', 'Meter')} description={t('只读的分段量条。segments 是段数；warnAt / dangerAt 让达到阈值的段变成警告色 / 危险色（像峰值表的黄区和红区）。传了 tone 就固定用一种颜色。拖动滑块看看。', 'A read-only segmented gauge. segments sets the number of segments; warnAt / dangerAt turn segments at or past those thresholds the warning / danger color (like the yellow and red zones on a peak meter). Passing tone fixes a single color. Drag the slider to try it.')}>
        <Demo layout="block" code={t(CODE_METER.zh, CODE_METER.en)}>
          <MeterDemo />
        </Demo>
        <Demo title={t('尺寸与固定颜色', 'Sizes and fixed colors')} layout="col" align="start" code={t(CODE_METER_SIZES.zh, CODE_METER_SIZES.en)}>
          <Meter size="sm" value={3} max={5} segments={5} label={t('信号强度', 'Signal strength')} valueText={t('3 / 5 格', '3 of 5 bars')} tone="neutral" />
          <Meter value={2} max={4} segments={4} label={t('密码强度', 'Password strength')} valueText={t('中等', 'Medium')} tone="warning" />
          <Meter size="lg" value={80} label={t('磁盘用量', 'Disk usage')} valueText="80%" tone="info" />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('条', 'Bar'), t('高 8 · 圆头', 'height 8 · round caps')],
          [t('追赶', 'Chase'), 'spring-soft 587ms'],
          [t('不确定', 'Indeterminate'), t('1.5s 循环 · 宽度呼吸', '1.5s loop · width breathes')],
          [t('完成', 'Done'), t('到 100% 变成成功色', 'turns the success color at 100%')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Progress" rows={[
          { name: 'value', type: 'number | null', description: t('当前值；不传（或 null）就是不确定进度。', 'Current value; omit it (or pass null) for indeterminate.') },
          { name: 'max', type: 'number', default: '100', description: t('最大值。', 'Maximum value.') },
          { name: 'label', type: 'string', description: t('进度条的名字（aria-label）。没有可见标签时必须给。', 'Name of the bar (aria-label). Required when there’s no visible label.') },
          { name: 'tone', type: "'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'accent'", description: t('条的颜色。', 'Bar color.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('粗细：4 / 8 / 12。', 'Thickness: 4 / 8 / 12.') },
          { name: 'noDoneState', type: 'boolean', description: t('到 100% 时不要自动变绿。', 'Don’t turn green automatically at 100%.') },
        ]} />
        <PropsTable title="ProgressRing" rows={[
          { name: 'value', type: 'number', default: '0', description: t('当前值。', 'Current value.') },
          { name: 'max', type: 'number', default: '100', description: t('最大值。', 'Maximum value.') },
          { name: 'label', type: 'string', description: t('名字（aria-label）。', 'Name (aria-label).') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", description: t('直径：40 / 64 / 96，或像素值。', 'Diameter: 40 / 64 / 96, or a pixel value.') },
          { name: 'thickness', type: 'number', default: '6', description: t('环的粗细（按 36 的视图坐标）。', 'Ring thickness (in a 36-unit viewBox).') },
          { name: 'showValue', type: 'boolean', description: t('中间显示百分比。默认直径 ≥ 56 时显示。', 'Shows the percentage in the center. On by default when the diameter is ≥ 56.') },
          { name: 'children', type: 'ReactNode', description: t('自定义中间的内容，替换百分比。', 'Custom center content that replaces the percentage.') },
          { name: 'noDoneState', type: 'boolean', description: t('到 100% 时不要自动变绿。', 'Don’t turn green automatically at 100%.') },
        ]} />
        <PropsTable title="Meter" rows={[
          { name: 'value', type: 'number', required: true, description: t('当前值。', 'Current value.') },
          { name: 'min / max', type: 'number', default: '0 / 100', description: t('取值范围。', 'Value range.') },
          { name: 'segments', type: 'number', default: '10', description: t('分成几段。', 'Number of segments.') },
          { name: 'label', type: 'string', description: t('名字（aria-label）。', 'Name (aria-label).') },
          { name: 'valueText', type: 'string', description: t('给读屏的数值说法，如“68%”“3 / 5 格”。', 'How the value is spoken to screen readers, such as “68%” or “3 of 5 bars”.') },
          { name: 'tone', type: "'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'", description: t('固定颜色。不传时按 warnAt / dangerAt 自动变色。', 'Fixed color. Without it, the color changes automatically by warnAt / dangerAt.') },
          { name: 'warnAt / dangerAt', type: 'number', description: t('达到这个值的段显示成警告色 / 危险色。', 'Segments at or past this value show the warning / danger color.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('高度：8 / 16 / 24。', 'Height: 8 / 16 / 24.') },
        ]} />
        <A11yNotes items={t([
          <>Progress 和 ProgressRing 是 <Code>role="progressbar"</Code>，带 <Code>aria-valuemin / max / now</Code>；不确定进度不写这三个值，读屏会报“忙碌”。</>,
          <>Meter 是 <Code>role="meter"</Code>；数值本身不好理解时用 <Code>valueText</Code> 给出人话（“中等”“3 / 5 格”）。</>,
          <>三者都需要名字：用 <Code>label</Code>，或用 <Code>aria-labelledby</Code> 指向旁边可见的文字。</>,
          '只读，不可聚焦，没有键盘操作。进度变化读屏不会逐次播报；完成时请另外给出文字或 Toast。',
          '完成变绿、电平变红都只是颜色提示，重要的状态变化要同时体现在文字上。',
        ], [
          <>Progress and ProgressRing are <Code>role="progressbar"</Code> with <Code>aria-valuemin / max / now</Code>; indeterminate progress omits those three, and screen readers report it as busy.</>,
          <>Meter is <Code>role="meter"</Code>; when the raw number is hard to interpret, use <Code>valueText</Code> to put it in plain words (“Medium”, “3 of 5 bars”).</>,
          <>All three need a name: use <Code>label</Code>, or <Code>aria-labelledby</Code> pointing at visible text nearby.</>,
          'Read-only, not focusable, no keyboard interaction. Screen readers don’t announce each progress change; when it finishes, say so in text or with a Toast.',
          'Turning green when done or red at high levels is only a color cue; important state changes must also show up in text.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
