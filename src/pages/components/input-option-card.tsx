import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Field, OptionCard, OptionCardGroup, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/option-card', title: 'OptionCard 选项卡片', group: '表单与操作', order: 130, subtitle: 'OptionCard · OptionCardGroup', en: { title: 'OptionCard', subtitle: 'OptionCard · OptionCardGroup' } };

/** 示意图：art 里的 <b> 是色块、<i> 是预览线，位置自己定 */
const line = (top: number, left: number, width: number): CSSProperties => ({ top, left, width });
const side: CSSProperties = { top: 0, bottom: 0, left: 0, width: 30 };
const bar: CSSProperties = { top: 0, left: 0, right: 0, height: 16 };

const artDefault = <><b style={side} /><i style={line(14, 40, 56)} /><i style={line(26, 40, 72)} /><i style={line(38, 40, 44)} /><i style={line(50, 40, 64)} /></>;
const artCompact = <><b style={{ ...side, width: 14 }} /><i style={line(14, 24, 64)} /><i style={line(26, 24, 84)} /><i style={line(38, 24, 52)} /><i style={line(50, 24, 72)} /></>;
const artFocus = <><b style={bar} /><i style={line(28, 16, 72)} /><i style={line(40, 16, 88)} /><i style={line(52, 16, 56)} /></>;

function ControlledDemo() {
  const t = useT();
  const [layout, setLayout] = useState<string | null>('default');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <OptionCardGroup aria-label={t('布局', 'Layout')} value={layout} onChange={setLayout}>
        <OptionCard value="default" art={artDefault}>{t('默认', 'Default')}</OptionCard>
        <OptionCard value="compact" art={artCompact}>{t('紧凑', 'Compact')}</OptionCard>
        <OptionCard value="focus" art={artFocus}>{t('专注', 'Focus')}</OptionCard>
      </OptionCardGroup>
      <Text tone="subtle" variant="caption">{t('当前布局：', 'Current layout: ')}{layout}</Text>
    </Stack>
  );
}

function MultiDemo() {
  const t = useT();
  const [addons, setAddons] = useState<string[]>(['backup']);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <OptionCardGroup multiple aria-label={t('附加服务', 'Add-ons')} value={addons} onChange={setAddons} minItemWidth={180}>
        <OptionCard value="backup" description={t('每天自动备份，保留 30 天', 'Daily automatic backups, kept for 30 days')}>{t('自动备份', 'Automatic backups')}</OptionCard>
        <OptionCard value="cdn" description={t('全球节点加速静态资源', 'Serve static assets from edge locations worldwide')}>{t('CDN 加速', 'CDN')}</OptionCard>
        <OptionCard value="audit" description={t('记录所有成员操作', 'Record every member action')}>{t('审计日志', 'Audit log')}</OptionCard>
        <OptionCard value="sso" description={t('企业版可用', 'Available on Enterprise')} disabled>{t('单点登录', 'Single sign-on')}</OptionCard>
      </OptionCardGroup>
      <Text tone="subtle" variant="caption">{t(`已选 ${addons.length} 项`, `${addons.length} selected`)}</Text>
    </Stack>
  );
}

const ART_CODE = {
  zh: `/** 示意图：art 里的 <b> 是色块、<i> 是预览线，位置自己定 */`,
  en: `/** Illustration: in art, <b> is a color block and <i> a preview line; position them yourself */`,
};

const art = (comment: string) => `
${comment}
const line = (top: number, left: number, width: number): CSSProperties => ({ top, left, width });
const side: CSSProperties = { top: 0, bottom: 0, left: 0, width: 30 };
const bar: CSSProperties = { top: 0, left: 0, right: 0, height: 16 };

const artDefault = <><b style={side} /><i style={line(14, 40, 56)} /><i style={line(26, 40, 72)} /><i style={line(38, 40, 44)} /><i style={line(50, 40, 64)} /></>;
const artCompact = <><b style={{ ...side, width: 14 }} /><i style={line(14, 24, 64)} /><i style={line(26, 24, 84)} /><i style={line(38, 24, 52)} /><i style={line(50, 24, 72)} /></>;
const artFocus = <><b style={bar} /><i style={line(28, 16, 72)} /><i style={line(40, 16, 88)} /><i style={line(52, 16, 56)} /></>;
`;

const CONTROLLED_CODE = {
  zh: `${art(ART_CODE.zh)}
function ControlledDemo() {
  const [layout, setLayout] = useState<string | null>('default');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <OptionCardGroup aria-label="布局" value={layout} onChange={setLayout}>
        <OptionCard value="default" art={artDefault}>默认</OptionCard>
        <OptionCard value="compact" art={artCompact}>紧凑</OptionCard>
        <OptionCard value="focus" art={artFocus}>专注</OptionCard>
      </OptionCardGroup>
      <Text tone="subtle" variant="caption">当前布局：{layout}</Text>
    </Stack>
  );
}
`,
  en: `${art(ART_CODE.en)}
function ControlledDemo() {
  const [layout, setLayout] = useState<string | null>('default');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <OptionCardGroup aria-label="Layout" value={layout} onChange={setLayout}>
        <OptionCard value="default" art={artDefault}>Default</OptionCard>
        <OptionCard value="compact" art={artCompact}>Compact</OptionCard>
        <OptionCard value="focus" art={artFocus}>Focus</OptionCard>
      </OptionCardGroup>
      <Text tone="subtle" variant="caption">Current layout: {layout}</Text>
    </Stack>
  );
}
`,
};

const MULTI_CODE = {
  zh: `
function MultiDemo() {
  const [addons, setAddons] = useState<string[]>(['backup']);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <OptionCardGroup multiple aria-label="附加服务" value={addons} onChange={setAddons} minItemWidth={180}>
        <OptionCard value="backup" description="每天自动备份，保留 30 天">自动备份</OptionCard>
        <OptionCard value="cdn" description="全球节点加速静态资源">CDN 加速</OptionCard>
        <OptionCard value="audit" description="记录所有成员操作">审计日志</OptionCard>
        <OptionCard value="sso" description="企业版可用" disabled>单点登录</OptionCard>
      </OptionCardGroup>
      <Text tone="subtle" variant="caption">已选 {addons.length} 项</Text>
    </Stack>
  );
}
`,
  en: `
function MultiDemo() {
  const [addons, setAddons] = useState<string[]>(['backup']);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <OptionCardGroup multiple aria-label="Add-ons" value={addons} onChange={setAddons} minItemWidth={180}>
        <OptionCard value="backup" description="Daily automatic backups, kept for 30 days">Automatic backups</OptionCard>
        <OptionCard value="cdn" description="Serve static assets from edge locations worldwide">CDN</OptionCard>
        <OptionCard value="audit" description="Record every member action">Audit log</OptionCard>
        <OptionCard value="sso" description="Available on Enterprise" disabled>Single sign-on</OptionCard>
      </OptionCardGroup>
      <Text tone="subtle" variant="caption">{addons.length} selected</Text>
    </Stack>
  );
}
`,
};

export default function OptionCardPage() {
  const t = useT();
  return (
    <DocPage
      title={t('OptionCard 选项卡片', 'OptionCard')}
      subtitle="OptionCard · OptionCardGroup"
      lead={t(
        '选项需要一张示意图或一段说明才能讲清楚时，用卡片代替单选 / 复选框：布局模式、套餐、附加服务。选项只是几个短词时用 Radio 或 Segmented。',
        'When an option needs an illustration or a short explanation to make sense, use cards instead of radios / checkboxes: layout modes, plans, add-ons. When the options are just a few short words, use Radio or Segmented.',
      )}
    >
      <DocSection title={t('单选', 'Single choice')} description={t(
        'OptionCardGroup 默认单选。art 是卡片上半部分的示意图：里面的 <i> 是预览线（选中时依次伸长），<b> 是色块，位置由你自己用样式决定。下面示例里的 artDefault 等变量见“查看代码”。',
        'OptionCardGroup is single-choice by default. art is the illustration in the top half of the card: <i> elements are preview lines (they extend one after another when selected) and <b> elements are color blocks, positioned with your own styles. See “Show code” below for artDefault and friends.',
      )}>
        <Demo layout="col" code={t(CONTROLLED_CODE.zh, CONTROLLED_CODE.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('说明文字与非受控', 'Descriptions and uncontrolled')} description={t(
        '没有示意图时用 description 写一两句说明。minItemWidth 决定每列最小宽度，列数随容器宽度自动增减。',
        'Without an illustration, use description for a sentence or two. minItemWidth sets the minimum column width, and the number of columns follows the container width.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Field label="套餐" style={{ width: '100%', maxWidth: 460 }}>
  <OptionCardGroup defaultValue="pro" minItemWidth={200}>
    <OptionCard value="free" description="3 个项目，社区支持">免费版</OptionCard>
    <OptionCard value="pro" description="不限项目，优先支持">专业版</OptionCard>
  </OptionCardGroup>
</Field>
`, `
<Field label="Plan" style={{ width: '100%', maxWidth: 460 }}>
  <OptionCardGroup defaultValue="pro" minItemWidth={200}>
    <OptionCard value="free" description="3 projects, community support">Free</OptionCard>
    <OptionCard value="pro" description="Unlimited projects, priority support">Pro</OptionCard>
  </OptionCardGroup>
</Field>
`)}
        >
          <Field label={t('套餐', 'Plan')} style={{ width: '100%', maxWidth: 460 }}>
            <OptionCardGroup defaultValue="pro" minItemWidth={200}>
              <OptionCard value="free" description={t('3 个项目，社区支持', '3 projects, community support')}>{t('免费版', 'Free')}</OptionCard>
              <OptionCard value="pro" description={t('不限项目，优先支持', 'Unlimited projects, priority support')}>{t('专业版', 'Pro')}</OptionCard>
            </OptionCardGroup>
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('多选', 'Multiple choice')} description={t('加 multiple 后值变成数组，每张卡片是一个复选框。', 'With multiple, the value becomes an array and each card is a checkbox.')}>
        <Demo layout="col" code={t(MULTI_CODE.zh, MULTI_CODE.en)}>
          <MultiDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('禁用', 'Disabled')}>
        <Demo
          layout="col"
          code={t(`
<OptionCardGroup disabled aria-label="整组禁用" defaultValue="a" style={{ width: '100%', maxWidth: 460 }}>
  <OptionCard value="a">选项一</OptionCard>
  <OptionCard value="b">选项二</OptionCard>
</OptionCardGroup>
`, `
<OptionCardGroup disabled aria-label="Whole group disabled" defaultValue="a" style={{ width: '100%', maxWidth: 460 }}>
  <OptionCard value="a">Option one</OptionCard>
  <OptionCard value="b">Option two</OptionCard>
</OptionCardGroup>
`)}
        >
          <OptionCardGroup disabled aria-label={t('整组禁用', 'Whole group disabled')} defaultValue="a" style={{ width: '100%', maxWidth: 460 }}>
            <OptionCard value="a">{t('选项一', 'Option one')}</OptionCard>
            <OptionCard value="b">{t('选项二', 'Option two')}</OptionCard>
          </OptionCardGroup>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['圆角', '卡片 20 · 预览 12（同心）'],
            ['悬停', '描边加深，粗细不变'],
            ['光环', '外扩 5px · scale .94 → 1 · bouncy'],
            ['对勾', '方块旋入 + 描线 · 延迟 120ms'],
            ['预览线', 'scaleX .72 → 1 · 错峰 30ms'],
          ], [
            ['Corners', 'Card 20 · preview 12 (concentric)'],
            ['Hover', 'Stroke darkens, same width'],
            ['Halo', 'Extends 5px · scale .94 → 1 · bouncy'],
            ['Check', 'Square rotates in + check draws · 120ms delay'],
            ['Lines', 'scaleX .72 → 1 · 30ms stagger'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="OptionCardGroup"
          rows={[
            { name: 'multiple', type: 'boolean', default: 'false', description: t('多选。决定 value 的类型和卡片的角色。', 'Multiple choice. Determines the type of value and the cards’ role.') },
            { name: 'value', type: t('string | null（单选）/ string[]（多选）', 'string | null (single) / string[] (multiple)'), description: t('选中项（受控）。', 'Selected item(s) (controlled).') },
            { name: 'defaultValue', type: 'string | null / string[]', description: t('初始选中项（非受控）。', 'Initially selected item(s) (uncontrolled).') },
            { name: 'onChange', type: '(value: string) => void / (value: string[]) => void', description: t('选中项变化时触发。', 'Fires when the selection changes.') },
            { name: 'minItemWidth', type: 'number', default: '128', description: t('每列最小宽度（px）。', 'Minimum column width (px).') },
            { name: 'disabled', type: 'boolean', description: t('整组禁用。', 'Disable the whole group.') },
          ]}
        />
        <PropsTable
          title="OptionCard"
          rows={[
            { name: 'value', type: 'string', required: true, description: t('这一项的值。', 'Value of this item.') },
            { name: 'children', type: 'ReactNode', description: t('标题，单行，过长省略。', 'Title; one line, truncated when too long.') },
            { name: 'art', type: 'ReactNode', description: t('卡片上半部分的示意图。', 'Illustration in the top half of the card.') },
            { name: 'description', type: 'ReactNode', description: t('标题下的说明。', 'Note below the title.') },
            { name: 'disabled', type: 'boolean', description: t('禁用这一张。', 'Disable this card.') },
            { name: 'checked', type: 'boolean', description: t('不在组里单独使用时的选中状态（此时是复选框语义）。', 'Checked state when used on its own outside a group (it then has checkbox semantics).') },
            { name: 'onChange', type: '(checked: boolean) => void', description: t('单独使用时：点击后触发。', 'When used on its own: fires on click.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>单选：组是 <code>role="radiogroup"</code>，卡片是 <code>role="radio"</code>。整组一个 Tab 停靠点（选中项，没选则是第一张）；方向键移动并同时选中，到头循环；<kbd>Home</kbd> / <kbd>End</kbd> 到两端。</>,
            <>多选：组是 <code>role="group"</code>，卡片是 <code>role="checkbox"</code>，各自可 <kbd>Tab</kbd> 到，<kbd>Space</kbd> / <kbd>Enter</kbd> 切换。</>,
            <>卡片的可读名称是标题加说明文字；示意图请保持纯装饰，不要放必须读到的信息。</>,
            <>选中除了光环还有右下角的对勾方块。</>,
            <>请给组 <code>aria-label</code> 或放进带 label 的 Field。</>,
          ], [
            <>Single choice: the group is <code>role="radiogroup"</code> and the cards are <code>role="radio"</code>. The group is one Tab stop (the selected card, or the first if none); arrow keys move and select at the same time, wrapping at the ends; <kbd>Home</kbd> / <kbd>End</kbd> jump to either end.</>,
            <>Multiple choice: the group is <code>role="group"</code> and the cards are <code>role="checkbox"</code>, each reachable with <kbd>Tab</kbd> and toggled with <kbd>Space</kbd> / <kbd>Enter</kbd>.</>,
            <>A card’s accessible name is its title plus description; keep the illustration purely decorative and don’t put essential information in it.</>,
            <>Selection shows as a check-mark square in the bottom-right corner as well as the halo.</>,
            <>Give the group an <code>aria-label</code> or put it in a labelled Field.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
