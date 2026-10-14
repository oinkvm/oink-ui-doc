import { Badge, Code, Inline } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/badge', title: 'Badge 徽标', group: '数据展示', order: 80, subtitle: 'Badge', en: { title: 'Badge' } };

/** 示例里的文字 */
const W = {
  zh: { draft: '草稿', fresh: '新功能', published: '已发布', review: '待审核', failed: '失败', testing: '测试中', default: '默认', running: '运行中', queued: '排队中', stopped: '已停止', live: '直播中', syncing: '同步中' },
  en: { draft: 'Draft', fresh: 'New', published: 'Published', review: 'In review', failed: 'Failed', testing: 'Testing', default: 'Default', running: 'Running', queued: 'Queued', stopped: 'Stopped', live: 'Live', syncing: 'Syncing' },
};
type Words = typeof W.zh;

const codeTones = (w: Words) => `
<Badge>${w.draft}</Badge>
<Badge tone="accent">${w.fresh}</Badge>
<Badge tone="success">${w.published}</Badge>
<Badge tone="warning">${w.review}</Badge>
<Badge tone="danger">${w.failed}</Badge>
<Badge tone="info">${w.testing}</Badge>`;

const codeVariants = (w: Words) => `
<Inline>
  <Badge variant="solid">${w.default}</Badge>
  <Badge variant="solid" tone="accent">${w.fresh}</Badge>
  <Badge variant="solid" tone="success">${w.published}</Badge>
  <Badge variant="solid" tone="warning">${w.review}</Badge>
  <Badge variant="solid" tone="danger">${w.failed}</Badge>
  <Badge variant="solid" tone="info">${w.testing}</Badge>
</Inline>
<Inline>
  <Badge variant="ink">Pro</Badge>
  <Badge variant="ink">Beta</Badge>
</Inline>`;

const codeDots = (w: Words) => `
<Badge tone="success" dot>${w.running}</Badge>
<Badge tone="warning" dot>${w.queued}</Badge>
<Badge dot>${w.stopped}</Badge>
<Badge tone="danger" ping>${w.live}</Badge>
<Badge tone="success" ping>${w.syncing}</Badge>`;

export default function BadgePage() {
  const t = useT();
  const w = t(W.zh, W.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('一个词说明状态：已发布、待审核、失败。徽标表示状态，Tag 表示归类，Count 表示数量，三者不要混用。', 'A single word for a status: Published, In review, Failed. Badge is for status, Tag for categories, Count for numbers; don’t mix them up.')}>
      <DocSection title={t('状态色', 'Tones')} description={t('六种 tone。默认的 soft 变体是柔和底配同色相的深色文字（--ok-*-text）。', 'Six tones. The default soft variant pairs a soft fill with dark text of the same hue (--ok-*-text).')}>
        <Demo code={codeTones(w)}>
          <Badge>{w.draft}</Badge>
          <Badge tone="accent">{w.fresh}</Badge>
          <Badge tone="success">{w.published}</Badge>
          <Badge tone="warning">{w.review}</Badge>
          <Badge tone="danger">{w.failed}</Badge>
          <Badge tone="info">{w.testing}</Badge>
        </Demo>
      </DocSection>

      <DocSection title={t('变体', 'Variants')} description={t('solid 是实色底，更醒目，一屏里别超过一两处（不带 tone 的 solid 是强调色，和原型一致）；ink 是反色底，不带状态含义，用于“Pro”“Beta”这类标记。', 'solid uses a solid fill and stands out more, so keep it to one or two per screen (solid without a tone uses the accent color, as in the prototype). ink is inverted and carries no status meaning; use it for markers like “Pro” or “Beta”.')}>
        <Demo layout="col" align="start" code={codeVariants(w)}>
          <Inline>
            <Badge variant="solid">{w.default}</Badge>
            <Badge variant="solid" tone="accent">{w.fresh}</Badge>
            <Badge variant="solid" tone="success">{w.published}</Badge>
            <Badge variant="solid" tone="warning">{w.review}</Badge>
            <Badge variant="solid" tone="danger">{w.failed}</Badge>
            <Badge variant="solid" tone="info">{w.testing}</Badge>
          </Inline>
          <Inline>
            <Badge variant="ink">Pro</Badge>
            <Badge variant="ink">Beta</Badge>
          </Inline>
        </Demo>
      </DocSection>

      <DocSection title={t('状态点', 'Status dot')} description={t('dot 在文字前加一个同色的圆点；ping 让圆点向外扩散，表示“正在进行”。开了减弱动效时扩散会停下。', 'dot adds a matching dot before the text; ping makes the dot pulse outward to mean “in progress”. The pulse stops under reduced motion.')}>
        <Demo code={codeDots(w)}>
          <Badge tone="success" dot>{w.running}</Badge>
          <Badge tone="warning" dot>{w.queued}</Badge>
          <Badge dot>{w.stopped}</Badge>
          <Badge tone="danger" ping>{w.live}</Badge>
          <Badge tone="success" ping>{w.syncing}</Badge>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('徽标', 'Badge'), t('高 24 · 全圆 · 12px / 600', 'height 24 · pill · 12px / 600')],
          [t('状态点', 'Status dot'), t('扩散 3.2× · 1.8s 循环', 'pulse 3.2× · 1.8s loop')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: t('状态色。', 'Tone.') },
          { name: 'variant', type: "'soft' | 'solid' | 'ink'", default: "'soft'", description: t('soft：柔和底 + 同色相文字；solid：实色底；ink：反色底。', 'soft: soft fill + same-hue text; solid: solid fill; ink: inverted.') },
          { name: 'dot', type: 'boolean', description: t('文字前的状态点。', 'Status dot before the text.') },
          { name: 'ping', type: 'boolean', description: t('状态点向外扩散（“进行中”）。隐含 dot。', 'Pulsing status dot (“in progress”). Implies dot.') },
          { name: '...rest', type: 'HTMLAttributes<HTMLSpanElement>', description: t('其余原生属性透传到根节点。', 'Other native attributes are passed to the root element.') },
        ]} />
        <A11yNotes items={t([
          <>徽标是普通的 <Code>span</Code>，没有角色，读屏直接读文字。所以文字本身必须说清状态，不能只靠颜色（不要写一个只有颜色没有字的徽标）。</>,
          '状态点是装饰，对读屏隐藏。',
          <>状态会动态变化、需要播报时，把徽标放进一个 <Code>role="status"</Code> 的容器，而不是给徽标本身加角色。</>,
          '不可聚焦，没有键盘操作。需要可点击的筛选项请用 Chip。',
        ], [
          <>A badge is a plain <Code>span</Code> with no role; screen readers just read the text. So the text must state the status on its own, not rely on color (never make a badge that is color with no words).</>,
          'The status dot is decorative and hidden from screen readers.',
          <>When the status changes dynamically and should be announced, put the badge inside a <Code>role="status"</Code> container rather than giving the badge itself a role.</>,
          'Not focusable, no keyboard interaction. For clickable filters, use Chip.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
