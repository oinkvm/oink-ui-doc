import { useState } from 'react';
import { Button, Code, Icon, Reaction, Stack, Text, burst } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/reaction', title: 'Reaction 点赞', group: '数据展示', order: 150, subtitle: 'Reaction · burst', en: { title: 'Reaction', subtitle: 'Reaction · burst' } };

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [liked, setLiked] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Reaction pressed={liked} onChange={setLiked} count={128} label="赞这篇文章" />
      <Text tone="neutral" variant="caption">{liked ? '你和另外 128 人赞过' : '128 人赞过'}</Text>
    </Stack>
  );
}`,
  en: `
function ControlledDemo() {
  const [liked, setLiked] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Reaction pressed={liked} onChange={setLiked} count={128} label="Like this article" />
      <Text tone="neutral" variant="caption">{liked ? 'You and 128 others liked this' : '128 people liked this'}</Text>
    </Stack>
  );
}`,
};

const CODE_CUSTOM = {
  zh: `
<Reaction icon={<Icon name="bell" />} label="订阅" count={8} />
<Reaction label="收藏">收藏</Reaction>
<Reaction count={3} noBurst label="赞（不放粒子）" />
<Reaction count={5} disabled />`,
  en: `
<Reaction icon={<Icon name="bell" />} label="Subscribe" count={8} />
<Reaction label="Save">Save</Reaction>
<Reaction count={3} noBurst label="Like (no particles)" />
<Reaction count={5} disabled />`,
};

const CODE_BURST = {
  zh: `
<Button
  onClick={(e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, { count: 18, distance: 64 });
  }}
>
  放一圈粒子
</Button>`,
  en: `
<Button
  onClick={(e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, { count: 18, distance: 64 });
  }}
>
  Burst particles
</Button>`,
};

function ControlledDemo() {
  const t = useT();
  const [liked, setLiked] = useState(false);
  return (
    <Stack gap={3} align="center">
      <Reaction pressed={liked} onChange={setLiked} count={128} label={t('赞这篇文章', 'Like this article')} />
      <Text tone="neutral" variant="caption">{liked ? t('你和另外 128 人赞过', 'You and 128 others liked this') : t('128 人赞过', '128 people liked this')}</Text>
    </Stack>
  );
}

export default function ReactionPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('表达“喜欢”的开关按钮，也是 Oink 的品牌微交互：点亮时猪鼻子弹一下、迸出一圈粒子，数字滚动加一。一条内容上放一个就够了。', 'A toggle button for saying “I like this”, and Oink’s signature micro-interaction: when it lights up, the snout bounces, a ring of particles bursts out and the count rolls up by one. One per piece of content is enough.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('不传 count 时只有图标；count 是别人点的数量（不含自己），显示的数字 = count + 自己是否点了。', 'Without count it’s just the icon. count is how many others reacted (not including you); the number shown is count plus your own reaction.')}>
        <Demo
          code={`
<Reaction />
<Reaction count={12} />
<Reaction count={99} defaultPressed />`}
        >
          <Reaction />
          <Reaction count={12} />
          <Reaction count={99} defaultPressed />
        </Demo>
      </DocSection>

      <DocSection title={t('受控', 'Controlled')} description={t('pressed / onChange 受控。label 是按钮给读屏的名字，默认“Oink 一下”，请换成具体的动作。', 'Control it with pressed / onChange. label is the button’s name for screen readers; it defaults to “Oink” (following the OinkProvider locale), so replace it with the specific action.')}>
        <Demo code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('自定义', 'Customization')} description={t('icon 换成别的 24×24 图标；children 放可见的文字；noBurst 关掉粒子；disabled 禁用。', 'icon swaps in another 24×24 icon; children add visible text; noBurst turns off the particles; disabled disables it.')}>
        <Demo code={t(CODE_CUSTOM.zh, CODE_CUSTOM.en)}>
          <Reaction icon={<Icon name="bell" />} label={t('订阅', 'Subscribe')} count={8} />
          <Reaction label={t('收藏', 'Save')}>{t('收藏', 'Save')}</Reaction>
          <Reaction count={3} noBurst label={t('赞（不放粒子）', 'Like (no particles)')} />
          <Reaction count={5} disabled />
        </Demo>
      </DocSection>

      <DocSection title={t('单独使用粒子', 'Particles on their own')} description={t('burst(x, y) 在视口坐标处放一圈粒子，可以用在别的“完成了”的时刻。开了减弱动效时什么都不做。', 'burst(x, y) releases a ring of particles at viewport coordinates, for other “done!” moments. It does nothing under reduced motion.')}>
        <Demo code={t(CODE_BURST.zh, CODE_BURST.en)}>
          <Button
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              burst(r.left + r.width / 2, r.top + r.height / 2, { count: 18, distance: 64 });
            }}
          >
            {t('放一圈粒子', 'Burst particles')}
          </Button>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('粒子', 'Particles'), t('12 颗 · 直径 4–10 · 飞出约 46px 后下落 14px 消失 · 620–880ms', '12 · diameter 4–10 · fly out about 46px, then drop 14px and vanish · 620–880ms')],
          [t('粒子颜色', 'Particle colors'), t('强调色、浅强调色、正文色轮流', 'alternate between accent, light accent and body text color')],
          [t('数字', 'Count'), t('旧值滚出、新值 spring 滚入', 'old value rolls out, new value rolls in on a spring')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Reaction" rows={[
          { name: 'pressed / defaultPressed', type: 'boolean', default: 'false', description: t('是否点亮，受控 / 非受控。', 'Whether it’s on, controlled / uncontrolled.') },
          { name: 'onChange', type: '(pressed: boolean) => void', description: t('切换时。', 'Called on toggle.') },
          { name: 'count', type: 'number', description: t('别人点的数量（不含自己）。不传就不显示数字。', 'How many others reacted (not including you). Without it, no number is shown.') },
          { name: 'label', type: 'string', default: t("'Oink 一下'", "'Oink'"), description: t('按钮的名字（给读屏）。', 'The button’s name (for screen readers). The default follows the OinkProvider locale.') },
          { name: 'icon', type: 'ReactNode', description: t('自定义图标（24×24），默认猪鼻子。', 'Custom icon (24×24); the snout by default.') },
          { name: 'noBurst', type: 'boolean', description: t('点亮时不放粒子。', 'No particles when turned on.') },
          { name: '...rest', type: 'ButtonHTMLAttributes', description: t(<>其余原生按钮属性（<Code>disabled</Code> 等）透传。</>, <>Other native button attributes (<Code>disabled</Code> and so on) are passed through.</>) },
        ]} />
        <PropsTable title="burst(x, y, options?)" rows={[
          { name: 'x, y', type: 'number', required: true, description: t('视口坐标（clientX / clientY 那一套）。', 'Viewport coordinates (the clientX / clientY kind).') },
          { name: 'options.count', type: 'number', default: '12', description: t('粒子数量。', 'Number of particles.') },
          { name: 'options.distance', type: 'number', default: '46', description: t('飞出的大致距离（px）。', 'Approximate travel distance (px).') },
          { name: 'options.colors', type: 'string[]', description: t('粒子颜色，轮流使用。默认取主题色。', 'Particle colors, used in turn. Theme colors by default.') },
          { name: 'options.source', type: 'Element', description: t('从哪个元素上读主题色，默认根元素。', 'Element to read theme colors from; the root element by default.') },
        ]} />
        <A11yNotes items={t([
          <>原生按钮加 <Code>aria-pressed</Code>：读屏读作“赞这篇文章，切换按钮，已按下 / 未按下”。Tab 聚焦，Enter 或空格切换。</>,
          '名字来自 label（视觉上隐藏），后面跟着可见的文字和数字；请把 label 写成具体动作。',
          '粒子是纯装饰：带 aria-hidden、不接收指针事件，减弱动效时不出现。',
          '点亮与否除了颜色变化，aria-pressed 是给读屏的第二种提示；数字变化也同步可见。',
        ], [
          <>A native button with <Code>aria-pressed</Code>: screen readers read “Like this article, toggle button, pressed / not pressed”. Tab to focus, Enter or Space to toggle.</>,
          'The name comes from label (visually hidden), followed by any visible text and the count; write label as a specific action.',
          'Particles are purely decorative: aria-hidden, they ignore pointer events and don’t appear under reduced motion.',
          'Beyond the color change, aria-pressed is a second cue for screen readers; the count change is visible at the same time.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
