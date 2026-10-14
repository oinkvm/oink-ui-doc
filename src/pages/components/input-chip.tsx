import { useState } from 'react';
import { Button, Chip, ChipGroup, Field, Icon, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './input-shared';

export const meta: PageMeta = { path: '/components/chip', title: 'Chip 标签', group: '表单与操作', order: 120, subtitle: 'Chip · ChipGroup', en: { title: 'Chip', subtitle: 'Chip · ChipGroup' } };

const INITIAL = {
  zh: ['设计', '前端', '无障碍', '动效', '设计系统'],
  en: ['Design', 'Frontend', 'Accessibility', 'Motion', 'Design systems'],
};

function RemovableDemo() {
  const t = useT();
  const initial = t(INITIAL.zh, INITIAL.en);
  const [tags, setTags] = useState(initial);
  return (
    <Stack gap={3} align="center">
      <ChipGroup aria-label={t('已添加的标签', 'Added tags')}>
        {tags.map((tag) => (
          <Chip key={tag} onRemove={() => setTags((list) => list.filter((x) => x !== tag))}>{tag}</Chip>
        ))}
      </ChipGroup>
      <Button size="sm" variant="ghost" onClick={() => setTags(initial)} disabled={tags.length === initial.length}>{t('恢复全部', 'Restore all')}</Button>
    </Stack>
  );
}

function FilterDemo() {
  const t = useT();
  const [value, setValue] = useState<string[]>(['open']);
  return (
    <Stack gap={3} align="center">
      <ChipGroup aria-label={t('按状态筛选', 'Filter by status')} value={value} onChange={setValue}>
        <Chip value="open">{t('进行中', 'In progress')}</Chip>
        <Chip value="review">{t('待评审', 'In review')}</Chip>
        <Chip value="done">{t('已完成', 'Done')}</Chip>
        <Chip value="archived" disabled>{t('已归档', 'Archived')}</Chip>
      </ChipGroup>
      <Text tone="subtle" variant="caption">{t('筛选条件：', 'Filters: ')}{value.length ? value.join(t('、', ', ')) : t('无', 'none')}</Text>
    </Stack>
  );
}

const FILTER_CODE = {
  zh: `
function FilterDemo() {
  const [value, setValue] = useState<string[]>(['open']);
  return (
    <Stack gap={3} align="center">
      <ChipGroup aria-label="按状态筛选" value={value} onChange={setValue}>
        <Chip value="open">进行中</Chip>
        <Chip value="review">待评审</Chip>
        <Chip value="done">已完成</Chip>
        <Chip value="archived" disabled>已归档</Chip>
      </ChipGroup>
      <Text tone="subtle" variant="caption">筛选条件：{value.length ? value.join('、') : '无'}</Text>
    </Stack>
  );
}
`,
  en: `
function FilterDemo() {
  const [value, setValue] = useState<string[]>(['open']);
  return (
    <Stack gap={3} align="center">
      <ChipGroup aria-label="Filter by status" value={value} onChange={setValue}>
        <Chip value="open">In progress</Chip>
        <Chip value="review">In review</Chip>
        <Chip value="done">Done</Chip>
        <Chip value="archived" disabled>Archived</Chip>
      </ChipGroup>
      <Text tone="subtle" variant="caption">Filters: {value.length ? value.join(', ') : 'none'}</Text>
    </Stack>
  );
}
`,
};

const REMOVABLE_CODE = {
  zh: `
const INITIAL = ['设计', '前端', '无障碍', '动效', '设计系统'];

function RemovableDemo() {
  const [tags, setTags] = useState(INITIAL);
  return (
    <Stack gap={3} align="center">
      <ChipGroup aria-label="已添加的标签">
        {tags.map((t) => (
          <Chip key={t} onRemove={() => setTags((list) => list.filter((x) => x !== t))}>{t}</Chip>
        ))}
      </ChipGroup>
      <Button size="sm" variant="ghost" onClick={() => setTags(INITIAL)} disabled={tags.length === INITIAL.length}>恢复全部</Button>
    </Stack>
  );
}
`,
  en: `
const INITIAL = ['Design', 'Frontend', 'Accessibility', 'Motion', 'Design systems'];

function RemovableDemo() {
  const [tags, setTags] = useState(INITIAL);
  return (
    <Stack gap={3} align="center">
      <ChipGroup aria-label="Added tags">
        {tags.map((t) => (
          <Chip key={t} onRemove={() => setTags((list) => list.filter((x) => x !== t))}>{t}</Chip>
        ))}
      </ChipGroup>
      <Button size="sm" variant="ghost" onClick={() => setTags(INITIAL)} disabled={tags.length === INITIAL.length}>Restore all</Button>
    </Stack>
  );
}
`,
};

export default function ChipPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Chip 标签', 'Chip')}
      subtitle="Chip · ChipGroup"
      lead={t(
        '两种用途：可选中的标签用来筛选（多选或单选，立即生效）；可移除的标签用来展示已添加的条目。只是展示状态、不可交互的小标记请用 Badge。',
        'Two uses: selectable chips filter things (multiple or single choice, applied immediately); removable chips show items that have been added. For a small non-interactive status marker, use Badge.',
      )}
    >
      <DocSection title={t('可选中', 'Selectable')} description={t(
        '传了 selected / defaultSelected / onChange 之一，Chip 就渲染成可按下的按钮，选中时“长出”对勾。',
        'Pass any of selected / defaultSelected / onChange and the Chip renders as a pressable button that grows a check mark when selected.',
      )}>
        <Demo
          code={t(`
<Chip defaultSelected>已关注</Chip>
<Chip defaultSelected={false}>只看未读</Chip>
<Chip defaultSelected={false} icon={<Icon name="bell" />}>有提醒</Chip>
<Chip defaultSelected disabled>禁用</Chip>
`, `
<Chip defaultSelected>Following</Chip>
<Chip defaultSelected={false}>Unread only</Chip>
<Chip defaultSelected={false} icon={<Icon name="bell" />}>Has reminder</Chip>
<Chip defaultSelected disabled>Disabled</Chip>
`)}
        >
          <Chip defaultSelected>{t('已关注', 'Following')}</Chip>
          <Chip defaultSelected={false}>{t('只看未读', 'Unread only')}</Chip>
          <Chip defaultSelected={false} icon={<Icon name="bell" />}>{t('有提醒', 'Has reminder')}</Chip>
          <Chip defaultSelected disabled>{t('禁用', 'Disabled')}</Chip>
        </Demo>
      </DocSection>

      <DocSection title={t('标签组', 'Chip groups')} description={t(
        'ChipGroup 负责换行排布，并用一个数组管理选中项。默认多选；multiple={false} 时选中一个会取消其它。',
        'ChipGroup handles wrapping and manages the selection as an array. Multiple selection is the default; with multiple={false}, selecting one deselects the others.',
      )}>
        <Demo title={t('多选（受控）', 'Multiple (controlled)')} code={t(FILTER_CODE.zh, FILTER_CODE.en)}>
          <FilterDemo />
        </Demo>
        <Demo
          title={t('单选与整组禁用', 'Single choice and disabled group')}
          layout="col"
          align="start"
          code={t(`
<Stack gap={5}>
  <Field label="时间范围">
    <ChipGroup multiple={false} defaultValue={['7d']}>
      <Chip value="1d">今天</Chip>
      <Chip value="7d">近 7 天</Chip>
      <Chip value="30d">近 30 天</Chip>
    </ChipGroup>
  </Field>
  <Field label="整组禁用">
    <ChipGroup disabled defaultValue={['a']}>
      <Chip value="a">选项一</Chip>
      <Chip value="b">选项二</Chip>
    </ChipGroup>
  </Field>
</Stack>
`, `
<Stack gap={5}>
  <Field label="Time range">
    <ChipGroup multiple={false} defaultValue={['7d']}>
      <Chip value="1d">Today</Chip>
      <Chip value="7d">Last 7 days</Chip>
      <Chip value="30d">Last 30 days</Chip>
    </ChipGroup>
  </Field>
  <Field label="Whole group disabled">
    <ChipGroup disabled defaultValue={['a']}>
      <Chip value="a">Option one</Chip>
      <Chip value="b">Option two</Chip>
    </ChipGroup>
  </Field>
</Stack>
`)}
        >
          <Stack gap={5}>
            <Field label={t('时间范围', 'Time range')}>
              <ChipGroup multiple={false} defaultValue={['7d']}>
                <Chip value="1d">{t('今天', 'Today')}</Chip>
                <Chip value="7d">{t('近 7 天', 'Last 7 days')}</Chip>
                <Chip value="30d">{t('近 30 天', 'Last 30 days')}</Chip>
              </ChipGroup>
            </Field>
            <Field label={t('整组禁用', 'Whole group disabled')}>
              <ChipGroup disabled defaultValue={['a']}>
                <Chip value="a">{t('选项一', 'Option one')}</Chip>
                <Chip value="b">{t('选项二', 'Option two')}</Chip>
              </ChipGroup>
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('可移除', 'Removable')} description={t(
        '传 onRemove 就显示移除按钮。点击后标签先缩小淡出，再调用 onRemove；放在 ChipGroup 里时其余标签会滑过去补位。',
        'Pass onRemove to show a remove button. Clicking it shrinks and fades the chip out, then calls onRemove; inside a ChipGroup the remaining chips slide over to fill the gap.',
      )}>
        <Demo code={t(REMOVABLE_CODE.zh, REMOVABLE_CODE.en)}>
          <RemovableDemo />
        </Demo>
        <Demo
          title={t('静态与禁用', 'Static and disabled')}
          description={t('什么交互属性都不传时只是一个静态标签。', 'With no interactive props at all, it’s just a static label.')}
          code={t(`
<Chip>只读标签</Chip>
<Chip icon={<Icon name="mail" />}>带图标</Chip>
<Chip onRemove={() => {}} disabled>不可移除</Chip>
`, `
<Chip>Read-only</Chip>
<Chip icon={<Icon name="mail" />}>With icon</Chip>
<Chip onRemove={() => {}} disabled>Can’t remove</Chip>
`)}
        >
          <Chip>{t('只读标签', 'Read-only')}</Chip>
          <Chip icon={<Icon name="mail" />}>{t('带图标', 'With icon')}</Chip>
          <Chip onRemove={() => {}} disabled>{t('不可移除', 'Can’t remove')}</Chip>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs
          items={t([
            ['筛选', '对勾宽度 0 → 14 · 弹簧'],
            ['移除', '140ms 缩小淡出 → 其余 FLIP 补位'],
            ['叉号', '悬停只变底色，不旋转'],
          ], [
            ['Filter', 'Check mark width 0 → 14 · spring'],
            ['Remove', '140ms shrink and fade → the rest FLIP into place'],
            ['Cross', 'Hover changes only the fill; no rotation'],
          ])}
        />
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Chip"
          rows={[
            { name: 'value', type: 'string', description: t('在 ChipGroup 里标识这一项。', 'Identifies this item within a ChipGroup.') },
            { name: 'selected', type: 'boolean', description: t('是否选中（受控）。', 'Whether it’s selected (controlled).') },
            { name: 'defaultSelected', type: 'boolean', description: t('初始是否选中（非受控）。传了它（哪怕是 false）就变成可选中。', 'Initially selected (uncontrolled). Passing it at all (even false) makes the chip selectable.') },
            { name: 'onChange', type: '(selected: boolean) => void', description: t('选中状态变化时触发。', 'Fires when the selected state changes.') },
            { name: 'onRemove', type: '() => void', description: t('传了就显示移除按钮；退场动画播完后调用。', 'Shows a remove button when set; called after the exit animation finishes.') },
            { name: 'removeLabel', type: 'string', default: t("'移除'", "'Remove'"), description: t('移除按钮的可读名称；children 是字符串时会拼成“移除 xxx”。', 'Accessible name of the remove button; when children is a string it becomes “Remove xxx”. The default follows the OinkProvider locale.') },
            { name: 'icon', type: 'ReactNode', description: t('文字前的图标。', 'Icon before the label.') },
            { name: 'disabled', type: 'boolean', description: t('禁用。', 'Disabled.') },
          ]}
        />
        <PropsTable
          title="ChipGroup"
          rows={[
            { name: 'value', type: 'string[]', description: t('选中项的 value 列表（受控）。传了 value / defaultValue / onChange 之一，组内带 value 的 Chip 就变成可选中。', 'Values of the selected items (controlled). Pass any of value / defaultValue / onChange and chips in the group that have a value become selectable.') },
            { name: 'defaultValue', type: 'string[]', description: t('初始选中项（非受控）。', 'Initially selected items (uncontrolled).') },
            { name: 'onChange', type: '(value: string[]) => void', description: t('选中项变化时触发。单选时数组里最多一个。', 'Fires when the selection changes. In single mode the array holds at most one item.') },
            { name: 'multiple', type: 'boolean', default: 'true', description: t('是否可多选。', 'Allow multiple selection.') },
            { name: 'disabled', type: 'boolean', description: t('整组禁用。', 'Disable the whole group.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>可选中的 Chip 是 <code>&lt;button aria-pressed&gt;</code>，<kbd>Enter</kbd> / <kbd>Space</kbd> 切换，读屏读“已按下 / 未按下”。选中除了底色还有对勾。</>,
            <>可移除的 Chip 本身是静态文字，里面的移除按钮才可聚焦，名称是“移除 + 标签文字”。</>,
            <>ChipGroup 是 <code>role="group"</code>，每个 Chip 各自是 Tab 停靠点；请给组 <code>aria-label</code> 或放进带 label 的 Field。</>,
            <>移除一项后焦点会随被删的按钮一起消失，必要时请自己把焦点移到相邻的标签或输入框上。</>,
          ], [
            <>A selectable Chip is a <code>&lt;button aria-pressed&gt;</code>: <kbd>Enter</kbd> / <kbd>Space</kbd> toggle it and screen readers announce “pressed” / “not pressed”. Selection shows as a check mark as well as a fill.</>,
            <>A removable Chip is itself static text; only the remove button inside is focusable, named “Remove + chip text”.</>,
            <>ChipGroup is <code>role="group"</code> and each Chip is its own Tab stop; give the group an <code>aria-label</code> or put it in a labelled Field.</>,
            <>When an item is removed, focus disappears along with its button; move focus to a neighboring chip or input yourself where it matters.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
