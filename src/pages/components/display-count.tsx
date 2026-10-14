import { useState } from 'react';
import { Button, ButtonGroup, Code, Count, Icon, Inline, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/count', title: 'Count 计数', group: '数据展示', order: 100, subtitle: 'Count', en: { title: 'Count' } };

const CODE_LIVE = {
  zh: `
function LiveDemo() {
  const [n, setN] = useState(3);
  return (
    <Stack gap={4} align="center">
      <Inline gap={2}>
        <Icon name="bell" />
        <Text variant="label">通知</Text>
        <Count value={n} label={\`\${n} 条未读通知\`} />
      </Inline>
      <ButtonGroup>
        <Button onClick={() => setN(Math.max(0, n - 1))} leading={<Icon name="minus" />}>减一</Button>
        <Button onClick={() => setN(n + 1)} leading={<Icon name="plus" />}>加一</Button>
        <Button onClick={() => setN(128)}>设为 128</Button>
        <Button onClick={() => setN(0)}>清零</Button>
      </ButtonGroup>
    </Stack>
  );
}`,
  en: `
function LiveDemo() {
  const [n, setN] = useState(3);
  return (
    <Stack gap={4} align="center">
      <Inline gap={2}>
        <Icon name="bell" />
        <Text variant="label">Notifications</Text>
        <Count value={n} label={\`\${n} unread notifications\`} />
      </Inline>
      <ButtonGroup>
        <Button onClick={() => setN(Math.max(0, n - 1))} leading={<Icon name="minus" />}>Minus one</Button>
        <Button onClick={() => setN(n + 1)} leading={<Icon name="plus" />}>Plus one</Button>
        <Button onClick={() => setN(128)}>Set to 128</Button>
        <Button onClick={() => setN(0)}>Reset</Button>
      </ButtonGroup>
    </Stack>
  );
}`,
};

function LiveDemo() {
  const t = useT();
  const [n, setN] = useState(3);
  return (
    <Stack gap={4} align="center">
      <Inline gap={2}>
        <Icon name="bell" />
        <Text variant="label">{t('通知', 'Notifications')}</Text>
        <Count value={n} label={t(`${n} 条未读通知`, `${n} unread notifications`)} />
      </Inline>
      <ButtonGroup>
        <Button onClick={() => setN(Math.max(0, n - 1))} leading={<Icon name="minus" />}>{t('减一', 'Minus one')}</Button>
        <Button onClick={() => setN(n + 1)} leading={<Icon name="plus" />}>{t('加一', 'Plus one')}</Button>
        <Button onClick={() => setN(128)}>{t('设为 128', 'Set to 128')}</Button>
        <Button onClick={() => setN(0)}>{t('清零', 'Reset')}</Button>
      </ButtonGroup>
    </Stack>
  );
}

export default function CountPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('挂在图标、标签旁边的小数字：未读数、购物车件数、待办数量。数字变化时会滚动替换并鼓一下，提醒人注意。', 'A small number next to an icon or label: unread messages, items in a cart, open to-dos. When it changes, the digits roll over and the badge pops to catch the eye.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('value 为 0 时默认不渲染；超过 max（默认 99）显示成“99+”。', 'Nothing renders when value is 0 by default; above max (99 by default) it shows “99+”.')}>
        <Demo
          code={`
<Count value={3} />
<Count value={42} />
<Count value={128} />
<Count value={1200} max={999} />
<Count value={0} showZero />`}
        >
          <Count value={3} />
          <Count value={42} />
          <Count value={128} />
          <Count value={1200} max={999} />
          <Count value={0} showZero />
        </Demo>
      </DocSection>

      <DocSection title={t('颜色', 'Colors')} description={t('accent（默认）用于一般的未读数；danger 用于需要处理的问题；neutral 用于不需要强调的数量。', 'accent (default) for ordinary unread counts; danger for problems that need attention; neutral for counts that don’t need emphasis.')}>
        <Demo
          code={`
<Count value={5} />
<Count value={5} tone="danger" />
<Count value={5} tone="neutral" />`}
        >
          <Count value={5} />
          <Count value={5} tone="danger" />
          <Count value={5} tone="neutral" />
        </Demo>
      </DocSection>

      <DocSection title={t('变化时的动效', 'Change animation')} description={t('数字变大时新值自下而上滚入，变小时自上而下；同时徽标放大到 1.35 再回弹。减到 0 时整个徽标消失。', 'When the number goes up, the new value rolls in from below; when it goes down, from above. At the same time the badge scales up to 1.35 and springs back. At 0 the whole badge disappears.')}>
        <Demo code={t(CODE_LIVE.zh, CODE_LIVE.en)}>
          <LiveDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('数字', 'Digits'), t('旧值 150ms 滚出，新值 spring 滚入', 'old value rolls out in 150ms, new value rolls in on a spring')],
          [t('徽标', 'Badge'), t('scale 1 → 1.35 → 1 回弹', 'scale 1 → 1.35 → 1 with spring-back')],
          [t('封顶', 'Cap'), t('超过 max 显示“max+”', 'shows “max+” above max')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'value', type: 'number', required: true, description: t('数量。', 'The count.') },
          { name: 'max', type: 'number', default: '99', description: t('超过后显示成“99+”。', 'Above this it shows “99+”.') },
          { name: 'showZero', type: 'boolean', description: t('0 也显示，默认不显示。', 'Shows 0 too; hidden by default.') },
          { name: 'tone', type: "'accent' | 'danger' | 'neutral'", default: "'accent'", description: t('颜色。', 'Color.') },
          { name: 'label', type: 'string', description: t('给读屏的完整说法，如“3 条未读通知”。不传只读出数字。', 'Full phrase for screen readers, such as “3 unread notifications”. Without it, only the number is read.') },
        ]} />
        <A11yNotes items={t([
          <>光一个数字对读屏用户没有意义，请传 <Code>label</Code> 说明这是什么的数量；传了之后可见的数字对读屏隐藏，只读 label。</>,
          <>组件本身不是 live region，数字变化不会自动播报。需要播报时放进 <Code>role="status"</Code> 的容器；挂在按钮上时更推荐把数量写进按钮的名字。</>,
          '不可聚焦，没有键盘操作。开了减弱动效时滚动和回弹都会跳过。',
        ], [
          <>A bare number means nothing to screen reader users, so pass <Code>label</Code> to say what’s being counted; the visible number is then hidden from screen readers and only the label is read.</>,
          <>The component isn’t a live region, so changes aren’t announced automatically. To announce them, put it in a <Code>role="status"</Code> container; on a button, prefer putting the count into the button’s name.</>,
          'Not focusable, no keyboard interaction. With reduced motion, the roll and spring-back are skipped.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
