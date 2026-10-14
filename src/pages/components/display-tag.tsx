import { useState } from 'react';
import { Button, Code, Icon, Inline, Stack, Tag } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/tag', title: 'Tag 标签', group: '数据展示', order: 90, subtitle: 'Tag', en: { title: 'Tag' } };

const ALL = { zh: ['设计', '前端', '无障碍', '动效'], en: ['Design', 'Front end', 'Accessibility', 'Motion'] };

/** 示例里的文字 */
const W = {
  zh: { default: '默认', accent: '强调', success: '成功', warning: '警告', danger: '危险', info: '信息', small: '小号', fresh: '新功能', reminder: '提醒' },
  en: { default: 'Default', accent: 'Accent', success: 'Success', warning: 'Warning', danger: 'Danger', info: 'Info', small: 'Small', fresh: 'New', reminder: 'Reminder' },
};
type Words = typeof W.zh;

const codeTones = (w: Words) => `
<Tag>${w.default}</Tag>
<Tag tone="accent">${w.accent}</Tag>
<Tag tone="success">${w.success}</Tag>
<Tag tone="warning">${w.warning}</Tag>
<Tag tone="danger">${w.danger}</Tag>
<Tag tone="info">${w.info}</Tag>`;

const codeSizes = (w: Words) => `
<Tag size="sm">${w.small}</Tag>
<Tag>${w.default}</Tag>
<Tag size="sm" icon={<Icon name="sparkle" />} tone="accent">${w.fresh}</Tag>
<Tag icon={<Icon name="bell" />}>${w.reminder}</Tag>`;

const CODE_REMOVABLE = {
  zh: `
const ALL = ['设计', '前端', '无障碍', '动效'];

function RemovableDemo() {
  const [tags, setTags] = useState(ALL);
  return (
    <Stack gap={3} align="start">
      <Inline role="list" aria-label="文章标签">
        {tags.map((t) => (
          <span role="listitem" key={t}>
            <Tag onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>
          </span>
        ))}
        {tags.length === 0 && '没有标签了'}
      </Inline>
      <Button size="sm" variant="ghost" onClick={() => setTags(ALL)}>恢复全部</Button>
    </Stack>
  );
}`,
  en: `
const ALL = ['Design', 'Front end', 'Accessibility', 'Motion'];

function RemovableDemo() {
  const [tags, setTags] = useState(ALL);
  return (
    <Stack gap={3} align="start">
      <Inline role="list" aria-label="Article tags">
        {tags.map((t) => (
          <span role="listitem" key={t}>
            <Tag onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</Tag>
          </span>
        ))}
        {tags.length === 0 && 'No tags left'}
      </Inline>
      <Button size="sm" variant="ghost" onClick={() => setTags(ALL)}>Restore all</Button>
    </Stack>
  );
}`,
};

function RemovableDemo() {
  const t = useT();
  const all = t(ALL.zh, ALL.en);
  // 记下删掉的下标而不是标签文字，切换语言时示例状态不会错乱
  const [removed, setRemoved] = useState<number[]>([]);
  const tags = all.map((text, i) => ({ text, i })).filter((x) => !removed.includes(x.i));
  return (
    <Stack gap={3} align="start">
      <Inline role="list" aria-label={t('文章标签', 'Article tags')}>
        {tags.map((x) => (
          <span role="listitem" key={x.i}>
            <Tag onRemove={() => setRemoved([...removed, x.i])}>{x.text}</Tag>
          </span>
        ))}
        {tags.length === 0 && t('没有标签了', 'No tags left')}
      </Inline>
      <Button size="sm" variant="ghost" onClick={() => setRemoved([])}>{t('恢复全部', 'Restore all')}</Button>
    </Stack>
  );
}

export default function TagPage() {
  const t = useT();
  const w = t(W.zh, W.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('给内容归类的小方角标记：话题、类型、技术栈。表示状态用 Badge；需要可切换的筛选项用 Chip。', 'A small square-cornered marker for categorizing content: topics, types, tech stacks. Use Badge for status, and Chip for toggleable filters.')}>
      <DocSection title={t('颜色', 'Colors')} description={t('默认是中性色。颜色只用来区分类别，不要让它承担状态含义。', 'Neutral by default. Color only tells categories apart; don’t let it carry status meaning.')}>
        <Demo code={codeTones(w)}>
          <Tag>{w.default}</Tag>
          <Tag tone="accent">{w.accent}</Tag>
          <Tag tone="success">{w.success}</Tag>
          <Tag tone="warning">{w.warning}</Tag>
          <Tag tone="danger">{w.danger}</Tag>
          <Tag tone="info">{w.info}</Tag>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸与图标', 'Sizes and icons')} description={t('两档尺寸：md（默认）和 sm。icon 放在文字前面。', 'Two sizes: md (default) and sm. icon goes before the text.')}>
        <Demo code={codeSizes(w)}>
          <Tag size="sm">{w.small}</Tag>
          <Tag>{w.default}</Tag>
          <Tag size="sm" icon={<Icon name="sparkle" />} tone="accent">{w.fresh}</Tag>
          <Tag icon={<Icon name="bell" />}>{w.reminder}</Tag>
        </Demo>
      </DocSection>

      <DocSection title={t('可移除', 'Removable')} description={t('传了 onRemove 就出现移除按钮。按钮的名字默认是“移除 + 标签文字”；标签内容不是纯文字时用 removeLabel 指定。', 'Passing onRemove adds a remove button. Its name defaults to “Remove + tag text”; when the tag content isn’t plain text, set it with removeLabel.')}>
        <Demo code={t(CODE_REMOVABLE.zh, CODE_REMOVABLE.en)}>
          <RemovableDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'tone', type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", default: "'neutral'", description: t('颜色。', 'Color.') },
          { name: 'size', type: "'sm' | 'md'", default: "'md'", description: t('尺寸。', 'Size.') },
          { name: 'icon', type: 'ReactNode', description: t('文字前的图标。', 'Icon before the text.') },
          { name: 'onRemove', type: '() => void', description: t('传了就出现移除按钮。', 'When set, a remove button appears.') },
          { name: 'removeLabel', type: 'string', description: t(<>移除按钮的 <Code>aria-label</Code>，默认“移除 + 标签文字”。</>, <>The remove button’s <Code>aria-label</Code>; defaults to “Remove + tag text” (following the OinkProvider locale).</>) },
        ]} />
        <A11yNotes items={t([
          '标签本身是 span，没有角色；图标是装饰，对读屏隐藏。',
          '移除按钮是真的按钮：Tab 聚焦，Enter / 空格触发，名字里带着标签文字（“移除 设计”），不会一排都读成“移除”。',
          '移除后焦点会随被删掉的按钮一起消失，落回文档开头；标签多的时候，请在 onRemove 里把焦点移到相邻的标签或输入框上。',
          <>一组标签建议放进 <Code>role="list"</Code> 的容器，让读屏知道一共有几个。</>,
        ], [
          'The tag itself is a span with no role; the icon is decorative and hidden from screen readers.',
          'The remove button is a real button: Tab to focus, Enter / Space to activate. Its name includes the tag text (“Remove Design”), so a row of them isn’t all read as just “Remove”.',
          'After removal, focus disappears with the deleted button and falls back to the start of the document; with many tags, move focus to a neighboring tag or input in onRemove.',
          <>Put a set of tags in a <Code>role="list"</Code> container so screen readers know how many there are.</>,
        ])} />
      </DocSection>
    </DocPage>
  );
}
