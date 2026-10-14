/* 表单与操作类的预览：尽量用库里的真组件，由 useStep 驱动受控属性“自己动” */
import {
  Button, Checkbox, Chip, ChipGroup, ColorPicker, ColorSwatches, Field, Icon, Input, Kbd, NumberInput, OptionCard, OptionCardGroup,
  PinInput, Radio, RadioGroup, Rating, Segmented, Slider, Switch, Textarea,
} from 'oink-ui';
import { useT } from '../i18n';
import { pick, useStep } from './loop';

const noop = () => {};

function typed(text: string, step: number) {
  const chars = Array.from(text);
  return chars.slice(0, Math.min(step, chars.length)).join('');
}

/**
 * 输入类的完整一轮：失焦空着 → 获得焦点 → 逐字输入 → 停一会儿 → 失去焦点（保留内容）。
 * 预览区是 inert 的，真实焦点进不来，聚焦外观由外层的 .pv-focus 复刻（见 gallery.css）
 */
function focusSteps(text: string, perChar = 80, hold = 1300) {
  return [1000, 450, ...Array.from(text, () => perChar), hold, 1500];
}
function focusState(text: string, step: number) {
  const n = Array.from(text).length;
  return { focused: step >= 1 && step <= n + 2, value: step === 0 ? '' : typed(text, step - 1) };
}
const cxFocus = (on: boolean, base = 'pv-w') => base + (on ? ' pv-focus' : '');

export function ButtonPreview() {
  const t = useT();
  const s = useStep([1500, 1400, 1300]);
  return (
    <div className="pv-col pv-center">
      <Button variant="primary" loading={s === 1} success={s === 2}>{t('保存改动', 'Save changes')}</Button>
      <div className="pv-row">
        <Button size="sm">{t('柔和', 'Soft')}</Button>
        <Button size="sm" variant="outline">{t('描边', 'Outline')}</Button>
        <Button size="sm" variant="ghost">{t('文字', 'Ghost')}</Button>
      </div>
    </div>
  );
}

const EMAIL = 'oink@example.com';
export function InputPreview() {
  const t = useT();
  const steps = focusSteps(EMAIL);
  const s = useStep(steps, EMAIL.length + 1);
  const { focused, value } = focusState(EMAIL, s);
  return (
    <div className={cxFocus(focused)}>
      <Input icon="mail" placeholder={t('邮箱地址', 'Email address')} value={value} onChange={noop} readOnly tabIndex={-1} />
    </div>
  );
}

const NOTE = { zh: '周五前把首页改版的稿子发出来，顺便约一下评审。', en: 'Send out the homepage drafts by Friday and book a review.' };
export function TextareaPreview() {
  const t = useT();
  const note = t(NOTE.zh, NOTE.en);
  // 英文字符多，打字快一点，一轮的时长和中文差不多
  const steps = focusSteps(note, t(70, 40));
  const s = useStep(steps, Array.from(note).length + 1);
  const { focused, value } = focusState(note, s);
  return (
    <div className={cxFocus(focused)}>
      <Textarea placeholder={t('写点什么…', 'Write something…')} value={value} onChange={noop} readOnly tabIndex={-1} autoGrow minRows={2} maxRows={4} />
    </div>
  );
}

export function NumberInputPreview() {
  const t = useT();
  // 失焦 → 聚焦 → 连加三下、减一下 → 失焦
  const s = useStep([1000, 500, 600, 600, 600, 900, 1300]);
  const value = pick([1, 1, 2, 3, 4, 3, 3], s);
  return (
    <div className={cxFocus(s >= 1 && s <= 5, '')}>
      <NumberInput aria-label={t('数量', 'Quantity')} value={value} onChange={noop} min={0} max={9} readOnly tabIndex={-1} />
    </div>
  );
}

const PIN = '3829';
export function PinInputPreview() {
  const t = useT();
  // 失焦 → 第一格聚焦 → 逐位填入，焦点跟着往后走 → 填满后失焦
  const s = useStep([1000, 500, 280, 280, 280, 1800], 5);
  const filled = Math.max(0, Math.min(4, s - 1));
  const focused = s >= 1 && s <= 4;
  return (
    <div className={cxFocus(focused, '')} data-pin={focused ? filled : undefined}>
      <PinInput length={4} value={PIN.slice(0, filled)} onChange={noop} aria-label={t('验证码', 'Verification code')} />
    </div>
  );
}

export function FieldPreview() {
  const t = useT();
  // 失焦 → 聚焦输入了两个字 → 失焦后校验报错 → 再聚焦补全 → 失焦，错误消失
  const s = useStep([900, 900, 1500, 900, 1500]);
  const value = pick(['', 'oi', 'oi', 'oink', 'oink'], s);
  const bad = s === 2;
  return (
    <div className={cxFocus(s === 1 || s === 3)}>
      <Field label={t('用户名', 'Username')} hint={t('3 到 16 个字符。', '3 to 16 characters.')} error={bad ? t('至少需要 3 个字符。', 'Must be at least 3 characters.') : undefined} invalid={bad}>
        <Input value={value} placeholder="oink" onChange={noop} readOnly tabIndex={-1} />
      </Field>
    </div>
  );
}

export function CheckboxPreview() {
  const t = useT();
  const s = useStep([700, 650, 650, 1600]);
  return (
    <div className="pv-col">
      {t(['订阅周报', '新评论提醒', '自动同步'], ['Weekly digest', 'Comment alerts', 'Auto sync']).map((label, i) => (
        <Checkbox key={label} checked={s > i} onChange={noop}>{label}</Checkbox>
      ))}
    </div>
  );
}

export function RadioPreview() {
  const t = useT();
  const s = useStep(1200, 2);
  return (
    <RadioGroup aria-label={t('付费周期', 'Billing period')} value={pick(['month', 'quarter', 'year'], s)} onChange={noop}>
      <Radio value="month">{t('月付', 'Monthly')}</Radio>
      <Radio value="quarter">{t('季付', 'Quarterly')}</Radio>
      <Radio value="year">{t('年付', 'Yearly')}</Radio>
    </RadioGroup>
  );
}

export function SwitchPreview() {
  const t = useT();
  const s = useStep(1100, 1);
  const [a, b] = pick([[false, false], [true, false], [true, true], [false, true]] as const, s);
  return (
    <div className="pv-col pv-switches">
      <Switch checked={a} onChange={noop}>{t('免打扰', 'Do not disturb')}</Switch>
      <Switch checked={b} onChange={noop}>{t('深色模式', 'Dark mode')}</Switch>
    </div>
  );
}

export function SliderPreview() {
  const t = useT();
  const s = useStep(1100, 1);
  return (
    <div className="pv-w">
      <Slider aria-label={t('音量', 'Volume')} value={pick([24, 72, 46, 88], s)} onChange={noop} />
    </div>
  );
}

export function SegmentedPreview() {
  const t = useT();
  const s = useStep(1100, 1);
  return (
    <Segmented
      aria-label={t('时间范围', 'Time range')} value={pick(['d', 'w', 'm', 'w'], s)} onChange={noop}
      options={t(
        [{ value: 'd', label: '日' }, { value: 'w', label: '周' }, { value: 'm', label: '月' }, { value: 'y', label: '年' }],
        [{ value: 'd', label: 'Day' }, { value: 'w', label: 'Week' }, { value: 'm', label: 'Month' }, { value: 'y', label: 'Year' }],
      )}
    />
  );
}

const CHIPS = [
  { value: 'design', zh: '设计', en: 'Design' },
  { value: 'frontend', zh: '前端', en: 'Frontend' },
  { value: 'product', zh: '产品', en: 'Product' },
  { value: 'ops', zh: '运营', en: 'Marketing' },
];
const CHIP_SETS = [[], ['design'], ['design', 'product'], ['design', 'product', 'ops'], ['product', 'ops']];
export function ChipPreview() {
  const t = useT();
  const s = useStep([800, 700, 700, 1300, 900], 2);
  return (
    <ChipGroup multiple aria-label={t('兴趣', 'Interests')} value={pick(CHIP_SETS, s)} onChange={noop} className="pv-chips">
      {CHIPS.map((c) => <Chip key={c.value} value={c.value}>{t(c.zh, c.en)}</Chip>)}
    </ChipGroup>
  );
}

export function OptionCardPreview() {
  const t = useT();
  const s = useStep(1500);
  return (
    <OptionCardGroup aria-label={t('配送方式', 'Shipping')} value={pick(['std', 'fast'], s)} onChange={noop} className="pv-options">
      <OptionCard value="std" description={t('3 到 5 天', '3–5 days')}>{t('标准', 'Standard')}</OptionCard>
      <OptionCard value="fast" description={t('次日达', 'Next day')}>{t('加急', 'Express')}</OptionCard>
    </OptionCardGroup>
  );
}

const SWATCHES = {
  zh: [
    { value: 'accent', color: 'var(--ok-accent)', label: '强调色' },
    { value: 'info', color: 'var(--ok-info)', label: '蓝' },
    { value: 'success', color: 'var(--ok-success)', label: '绿' },
    { value: 'warning', color: 'var(--ok-warning)', label: '黄' },
    { value: 'danger', color: 'var(--ok-danger)', label: '红' },
  ],
  en: [
    { value: 'accent', color: 'var(--ok-accent)', label: 'Accent' },
    { value: 'info', color: 'var(--ok-info)', label: 'Blue' },
    { value: 'success', color: 'var(--ok-success)', label: 'Green' },
    { value: 'warning', color: 'var(--ok-warning)', label: 'Yellow' },
    { value: 'danger', color: 'var(--ok-danger)', label: 'Red' },
  ],
};
export function ColorSwatchesPreview() {
  const t = useT();
  const s = useStep(900);
  const colors = t(SWATCHES.zh, SWATCHES.en);
  return <ColorSwatches aria-label={t('颜色', 'Color')} colors={colors} value={pick(colors, s).value} onChange={noop} />;
}

/** ColorPicker：圆钮在方块里换几个位置，色相条跟着换色（十六进制那一行在预览里藏起来，见 gallery.css） */
const PICKS = ['#ff6b8e', '#c2185b', '#ffb3c4', '#4c8dff', '#1f4fa8', '#4cd787'];
export function ColorPickerPreview() {
  const t = useT();
  const s = useStep(1100);
  return <ColorPicker aria-label={t('颜色', 'Color')} value={pick(PICKS, s)} onChange={noop} className="pv-picker" />;
}

export function HotkeyPreview() {
  const t = useT();
  // 依次按下 ⌘、⇧、K，停一下，松开
  const s = useStep([900, 300, 300, 1300], 3);
  return (
    <div className="pv-col pv-center">
      <div className="pv-keys" data-s={s}>
        <Kbd size="lg" k="Meta" data-on={s >= 1 || undefined} />
        <Kbd size="lg" k="Shift" data-on={s >= 2 || undefined} />
        <Kbd size="lg" k="K" data-on={s >= 3 || undefined} />
      </div>
      <span className="pv-caption" data-show={s === 3 || undefined}>{t('打开命令面板', 'Open command palette')}</span>
    </div>
  );
}

export function RatingPreview() {
  const t = useT();
  const s = useStep([700, 300, 300, 300, 300, 1600], 4);
  return <Rating aria-label={t('评分', 'Rating')} value={s} onChange={noop} />;
}

/** FileDrop：文件落进虚线框 → 框变成强调色 → 出现一行文件并走完进度。纯示意 */
export function FileDropPreview() {
  return (
    <div className="pv-drop">
      <div className="pv-drop__zone a">
        <Icon name="upload" />
        <i className="pv-bar" style={{ width: '46%' }} />
      </div>
      <div className="pv-drop__file a"><Icon name="file" /></div>
      <div className="pv-drop__row a">
        <Icon name="file" />
        <span className="pv-drop__meta"><i className="pv-bar" style={{ width: '60%' }} /><i className="pv-drop__prog"><i className="a" /></i></span>
      </div>
    </div>
  );
}
