import { useState } from 'react';
import { Button, Card, Code, Icon, Inline, Stack, Text, Tree } from 'oink-ui';
import type { TreeNode } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Keys } from './display-_kit';

export const meta: PageMeta = { path: '/components/tree', title: 'Tree 树', group: '数据展示', order: 130, subtitle: 'Tree', en: { title: 'Tree' } };

const makeFiles = (legacy: string): TreeNode[] => [
  {
    id: 'src', label: 'src', children: [
      {
        id: 'components', label: 'components', children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'dialog', label: 'Dialog.tsx' },
          { id: 'legacy', label: legacy, disabled: true },
        ],
      },
      { id: 'styles', label: 'styles', children: [{ id: 'tokens', label: 'tokens.css' }, { id: 'base', label: 'base.css' }] },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
];
const FILES = { zh: makeFiles('Legacy.tsx（只读）'), en: makeFiles('Legacy.tsx (read-only)') };

const OUTLINE: { zh: TreeNode[]; en: TreeNode[] } = {
  zh: [
    {
      id: 'guide', label: '指南', icon: <Icon name="info" />, children: [
        { id: 'start', label: '快速开始', icon: <Icon name="play" /> },
        { id: 'theme', label: '主题', icon: <Icon name="sun" /> },
      ],
    },
    { id: 'changelog', label: '更新记录', icon: <Icon name="replay" /> },
  ],
  en: [
    {
      id: 'guide', label: 'Guides', icon: <Icon name="info" />, children: [
        { id: 'start', label: 'Quick start', icon: <Icon name="play" /> },
        { id: 'theme', label: 'Theming', icon: <Icon name="sun" /> },
      ],
    },
    { id: 'changelog', label: 'Changelog', icon: <Icon name="replay" /> },
  ],
};

const codeFiles = (legacy: string, label: string) => `
const files: TreeNode[] = [
  {
    id: 'src', label: 'src', children: [
      {
        id: 'components', label: 'components', children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'dialog', label: 'Dialog.tsx' },
          { id: 'legacy', label: '${legacy}', disabled: true },
        ],
      },
      { id: 'styles', label: 'styles', children: [{ id: 'tokens', label: 'tokens.css' }, { id: 'base', label: 'base.css' }] },
      { id: 'index', label: 'index.ts' },
    ],
  },
  { id: 'package', label: 'package.json' },
  { id: 'readme', label: 'README.md' },
];

<Card size="sm">
  <Tree label="${label}" items={files} defaultExpanded={['src', 'components']} defaultSelected="button" />
</Card>`;
const CODE_BASIC = { zh: codeFiles('Legacy.tsx（只读）', '项目文件'), en: codeFiles('Legacy.tsx (read-only)', 'Project files') };

const CODE_ICONS = {
  zh: `
const outline: TreeNode[] = [
  {
    id: 'guide', label: '指南', icon: <Icon name="info" />, children: [
      { id: 'start', label: '快速开始', icon: <Icon name="play" /> },
      { id: 'theme', label: '主题', icon: <Icon name="sun" /> },
    ],
  },
  { id: 'changelog', label: '更新记录', icon: <Icon name="replay" /> },
];

<Card size="sm">
  <Tree label="文档大纲" items={outline} defaultExpanded={['guide']} />
</Card>`,
  en: `
const outline: TreeNode[] = [
  {
    id: 'guide', label: 'Guides', icon: <Icon name="info" />, children: [
      { id: 'start', label: 'Quick start', icon: <Icon name="play" /> },
      { id: 'theme', label: 'Theming', icon: <Icon name="sun" /> },
    ],
  },
  { id: 'changelog', label: 'Changelog', icon: <Icon name="replay" /> },
];

<Card size="sm">
  <Tree label="Docs outline" items={outline} defaultExpanded={['guide']} />
</Card>`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [expanded, setExpanded] = useState<string[]>(['src']);
  const [selected, setSelected] = useState<string | null>('index');
  return (
    <Stack gap={3}>
      <Inline>
        <Button size="sm" onClick={() => setExpanded(['src', 'components', 'styles'])}>全部展开</Button>
        <Button size="sm" onClick={() => setExpanded([])}>全部收起</Button>
        <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>取消选中</Button>
      </Inline>
      <Card size="sm">
        <Tree label="文件（受控）" items={files} expanded={expanded} onExpandedChange={setExpanded} selected={selected} onSelect={setSelected} />
      </Card>
      <Text tone="neutral" variant="caption">选中：{selected ?? '无'}；展开：{expanded.join('、') || '无'}</Text>
    </Stack>
  );
}`,
  en: `
function ControlledDemo() {
  const [expanded, setExpanded] = useState<string[]>(['src']);
  const [selected, setSelected] = useState<string | null>('index');
  return (
    <Stack gap={3}>
      <Inline>
        <Button size="sm" onClick={() => setExpanded(['src', 'components', 'styles'])}>Expand all</Button>
        <Button size="sm" onClick={() => setExpanded([])}>Collapse all</Button>
        <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Clear selection</Button>
      </Inline>
      <Card size="sm">
        <Tree label="Files (controlled)" items={files} expanded={expanded} onExpandedChange={setExpanded} selected={selected} onSelect={setSelected} />
      </Card>
      <Text tone="neutral" variant="caption">Selected: {selected ?? 'none'}; expanded: {expanded.join(', ') || 'none'}</Text>
    </Stack>
  );
}`,
};

function ControlledDemo() {
  const t = useT();
  const [expanded, setExpanded] = useState<string[]>(['src']);
  const [selected, setSelected] = useState<string | null>('index');
  return (
    <Stack gap={3}>
      <Inline>
        <Button size="sm" onClick={() => setExpanded(['src', 'components', 'styles'])}>{t('全部展开', 'Expand all')}</Button>
        <Button size="sm" onClick={() => setExpanded([])}>{t('全部收起', 'Collapse all')}</Button>
        <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>{t('取消选中', 'Clear selection')}</Button>
      </Inline>
      <Card size="sm">
        <Tree label={t('文件（受控）', 'Files (controlled)')} items={t(FILES.zh, FILES.en)} expanded={expanded} onExpandedChange={setExpanded} selected={selected} onSelect={setSelected} />
      </Card>
      <Text tone="neutral" variant="caption">
        {t('选中：', 'Selected: ')}{selected ?? t('无', 'none')}{t('；展开：', '; expanded: ')}{expanded.join(t('、', ', ')) || t('无', 'none')}
      </Text>
    </Stack>
  );
}

export default function TreePage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('有层级的列表：文件目录、组织架构、文档大纲。层级不超过一层时用 List 或 Nav 就够了。', 'A hierarchical list: file directories, org charts, document outlines. If there’s no more than one level, List or Nav is enough.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('传一棵 TreeNode。点一行会选中它；有子级的节点同时展开或收起。disabled 的节点不能选中，键盘移动时会跳过。', 'Pass a tree of TreeNode. Clicking a row selects it, and nodes with children also expand or collapse. disabled nodes can’t be selected and are skipped during keyboard navigation.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Card size="sm">
            <Tree label={t('项目文件', 'Project files')} items={t(FILES.zh, FILES.en)} defaultExpanded={['src', 'components']} defaultSelected="button" />
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('图标', 'Icons')} description={t('节点可以带图标，放在箭头和文字之间。', 'Nodes can carry an icon, placed between the chevron and the text.')}>
        <Demo layout="block" code={t(CODE_ICONS.zh, CODE_ICONS.en)}>
          <Card size="sm">
            <Tree label={t('文档大纲', 'Docs outline')} items={t(OUTLINE.zh, OUTLINE.en)} defaultExpanded={['guide']} />
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('受控', 'Controlled')} description={t('展开和选中各自支持受控与非受控。onSelect 的参数是节点 id。', 'Expansion and selection each support controlled and uncontrolled use. onSelect receives the node id.')}>
        <Demo layout="block" code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}>
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Tree" rows={[
          { name: 'items', type: 'TreeNode[]', required: true, description: t('树的数据。', 'Tree data.') },
          { name: 'expanded / defaultExpanded', type: 'string[]', default: '[]', description: t('展开的节点 id，受控 / 非受控。', 'Ids of expanded nodes, controlled / uncontrolled.') },
          { name: 'onExpandedChange', type: '(ids: string[]) => void', description: t('展开状态变化时。', 'Called when expansion changes.') },
          { name: 'selected / defaultSelected', type: 'string | null', default: 'null', description: t('选中的节点 id；null 表示没有选中。', 'Id of the selected node; null means none.') },
          { name: 'onSelect', type: '(id: string | null) => void', description: t('选中变化时。', 'Called when the selection changes.') },
          { name: 'label', type: 'string', description: t('树的名字（aria-label）。', 'Name of the tree (aria-label).') },
        ]} />
        <PropsTable title="TreeNode" rows={[
          { name: 'id', type: 'string', required: true, description: t('唯一标识。', 'Unique identifier.') },
          { name: 'label', type: 'ReactNode', required: true, description: t('节点文字。', 'Node text.') },
          { name: 'icon', type: 'ReactNode', description: t('文字前的图标。', 'Icon before the text.') },
          { name: 'children', type: 'TreeNode[]', description: t('子节点；有子节点的才能展开。', 'Child nodes; only nodes with children can expand.') },
          { name: 'disabled', type: 'boolean', description: t('禁用：不能选中，键盘移动时跳过。', 'Disabled: can’t be selected, skipped during keyboard navigation.') },
        ]} />
        <A11yNotes items={t([
          <>容器是 <Code>role="tree"</Code>，节点是 <Code>treeitem</Code>，子级包在 <Code>role="group"</Code> 里；每个节点带 <Code>aria-level</Code>、<Code>aria-setsize</Code>、<Code>aria-posinset</Code>，读屏能报出“第 2 层，3 项中的第 1 项”。</>,
          <>整棵树只有一个 Tab 停靠点（roving tabindex）。<Keys k="↑ ↓" /> 在可见节点间移动，<Keys k="Home End" /> 到首尾。</>,
          <><Keys k="→" /> 展开收起的节点，已展开则进入第一个子节点；<Keys k="←" /> 收起展开的节点，已收起（或是叶子）则回到父节点。</>,
          <><Keys k="Enter" /> 或 <Keys k="Space" /> 选中当前节点，有子级时同时切换展开。</>,
          <>展开状态在 <Code>aria-expanded</Code>，选中在 <Code>aria-selected</Code>，禁用在 <Code>aria-disabled</Code>；箭头和图标对读屏隐藏。</>,
        ], [
          <>The container is <Code>role="tree"</Code>, nodes are <Code>treeitem</Code>, and children are wrapped in <Code>role="group"</Code>; each node has <Code>aria-level</Code>, <Code>aria-setsize</Code> and <Code>aria-posinset</Code>, so screen readers can announce “level 2, 1 of 3”.</>,
          <>The whole tree is a single Tab stop (roving tabindex). <Keys k="↑ ↓" /> move between visible nodes, <Keys k="Home End" /> jump to the first / last.</>,
          <><Keys k="→" /> expands a collapsed node, or moves into the first child if already expanded; <Keys k="←" /> collapses an expanded node, or returns to the parent if already collapsed (or a leaf).</>,
          <><Keys k="Enter" /> or <Keys k="Space" /> selects the current node and also toggles expansion if it has children.</>,
          <>Expansion is in <Code>aria-expanded</Code>, selection in <Code>aria-selected</Code>, disabled in <Code>aria-disabled</Code>; chevrons and icons are hidden from screen readers.</>,
        ])} />
      </DocSection>
    </DocPage>
  );
}
