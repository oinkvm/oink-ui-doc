import { Box, Button, ScrollArea, Stack, Sticky, Tag, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { asRow, restRow } from './layout-shared';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/scroll-area', title: 'ScrollArea / Sticky 滚动与粘性定位', group: '布局', order: 6, subtitle: 'ScrollArea · Sticky', en: { title: 'ScrollArea / Sticky' } };

const LINES = {
  zh: ['设计原则', '品牌标志', '色彩', '字体', '形状 · 间距 · 层级', '动效', '组件', '令牌与用法', '主题', '无障碍', '响应式', '悬浮卡片'],
  en: ['Design principles', 'Logo', 'Color', 'Typography', 'Shape · spacing · elevation', 'Motion', 'Components', 'Tokens and usage', 'Theming', 'Accessibility', 'Responsive', 'Floating cards'],
};
const TAGS = {
  zh: ['全部', '设计', '前端', '无障碍', '动效', '响应式', '主题', '设计令牌', '组件库', '文档', '示例', '更新日志'],
  en: ['All', 'Design', 'Frontend', 'Accessibility', 'Motion', 'Responsive', 'Theming', 'Design tokens', 'Components', 'Docs', 'Examples', 'Changelog'],
};
const list = (items: string[]) => items.map((s) => `'${s}'`).join(', ');

const VERTICAL_CODE = {
  zh: `import { ScrollArea, Stack, Text } from 'oink-ui';

const LINES = [${list(LINES.zh)}];

<ScrollArea label="目录" style={{ height: 220, width: 'min(320px, 100%)', borderRadius: 'var(--ok-r-3)', background: 'var(--ok-card)' }}>
  <Stack gap={0} padding={2}>
    {LINES.map((t) => (
      <Text key={t} as="div" style={{ padding: '10px 12px' }}>{t}</Text>
    ))}
  </Stack>
</ScrollArea>`,
  en: `import { ScrollArea, Stack, Text } from 'oink-ui';

const LINES = [${list(LINES.en)}];

<ScrollArea label="Contents" style={{ height: 220, width: 'min(320px, 100%)', borderRadius: 'var(--ok-r-3)', background: 'var(--ok-card)' }}>
  <Stack gap={0} padding={2}>
    {LINES.map((t) => (
      <Text key={t} as="div" style={{ padding: '10px 12px' }}>{t}</Text>
    ))}
  </Stack>
</ScrollArea>`,
};

const HORIZONTAL_CODE = {
  zh: `import { ScrollArea, Tag } from 'oink-ui';

const TAGS = [${list(TAGS.zh)}];

<ScrollArea direction="horizontal" label="分类" style={{ width: 'min(360px, 100%)', padding: 4 }}>
  <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
    {TAGS.map((t) => <Tag key={t}>{t}</Tag>)}
  </div>
</ScrollArea>`,
  en: `import { ScrollArea, Tag } from 'oink-ui';

const TAGS = [${list(TAGS.en)}];

<ScrollArea direction="horizontal" label="Categories" style={{ width: 'min(360px, 100%)', padding: 4 }}>
  <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
    {TAGS.map((t) => <Tag key={t}>{t}</Tag>)}
  </div>
</ScrollArea>`,
};

const STICKY_CODE = {
  zh: `import { Box, Button, ScrollArea, Stack, Sticky, Text } from 'oink-ui';

<ScrollArea label="带粘性头尾的列表" style={{ height: 260, width: 'min(360px, 100%)', borderRadius: 'var(--ok-r-3)', background: 'var(--ok-card)' }}>
  <Sticky>
    <Box surface="raised" border padding={3}><Text variant="label">吸在顶部的表头</Text></Box>
  </Sticky>
  <Stack gap={0} padding={2}>
    {LINES.map((t) => (
      <Text key={t} as="div" style={{ padding: '10px 12px' }}>{t}</Text>
    ))}
  </Stack>
  <Sticky edge="bottom" offset={2}>
    <Box padding={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button size="sm" variant="primary">offset=2：离底边 8px</Button>
    </Box>
  </Sticky>
</ScrollArea>`,
  en: `import { Box, Button, ScrollArea, Stack, Sticky, Text } from 'oink-ui';

<ScrollArea label="List with sticky header and footer" style={{ height: 260, width: 'min(360px, 100%)', borderRadius: 'var(--ok-r-3)', background: 'var(--ok-card)' }}>
  <Sticky>
    <Box surface="raised" border padding={3}><Text variant="label">Header stuck to the top</Text></Box>
  </Sticky>
  <Stack gap={0} padding={2}>
    {LINES.map((t) => (
      <Text key={t} as="div" style={{ padding: '10px 12px' }}>{t}</Text>
    ))}
  </Stack>
  <Sticky edge="bottom" offset={2}>
    <Box padding={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button size="sm" variant="primary">offset=2: 8px from the bottom</Button>
    </Box>
  </Sticky>
</ScrollArea>`,
};

export default function ScrollPage() {
  const t = useT();
  const lines = t(LINES.zh, LINES.en);
  const tags = t(TAGS.zh, TAGS.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('滚动完全是浏览器原生的：滚轮、触控板、拖动、键盘、滚到头带动外层，都不用脚本重做。ScrollArea 只做三件事：套上细而圆的滚动条外观、限定滚动方向、让区域能被键盘聚焦。Sticky 是 position: sticky 的薄封装。', 'Scrolling is entirely native to the browser: wheel, trackpad, dragging, keyboard and scroll chaining at the ends are never reimplemented in script. ScrollArea does just three things: gives the scrollbar a thin, rounded look, restricts the scroll direction, and makes the area keyboard-focusable. Sticky is a thin wrapper around position: sticky.')}>
      <DocSection title={t('ScrollArea', 'ScrollArea')} description={t('高度（或最大高度）由外层布局或 style 决定。有指针的设备上滚动条平时隐藏，指针移入或键盘聚焦时淡入；触屏保留系统自带的滚动条。', 'Height (or max height) comes from the surrounding layout or style. On pointer devices the scrollbar stays hidden until the pointer enters or the area gets keyboard focus, then fades in; touch screens keep the system scrollbar.')}>
        <Demo title={t('纵向', 'Vertical')} code={t(VERTICAL_CODE.zh, VERTICAL_CODE.en)}>
          <ScrollArea label={t('目录', 'Contents')} style={{ height: 220, width: 'min(320px, 100%)', borderRadius: 'var(--ok-r-3)', background: 'var(--ok-card)' }}>
            <Stack gap={0} padding={2}>
              {lines.map((line) => (
                <Text key={line} as="div" style={{ padding: '10px 12px' }}>{line}</Text>
              ))}
            </Stack>
          </ScrollArea>
        </Demo>
        <Demo title={t('横向', 'Horizontal')} description={t('一排放不下的标签、卡片。内容自己要有超出的宽度（这里用 width: max-content）。', 'For a row of tags or cards that doesn’t fit. The content itself must be wider than the area (here via width: max-content).')} code={t(HORIZONTAL_CODE.zh, HORIZONTAL_CODE.en)}>
          <ScrollArea direction="horizontal" label={t('分类', 'Categories')} style={{ width: 'min(360px, 100%)', padding: 4 }}>
            <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
              {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </div>
          </ScrollArea>
        </Demo>
        <PropsTable
          title={t('ScrollArea 属性', 'ScrollArea props')}
          rows={[
            { name: 'direction', type: `'vertical' | 'horizontal' | 'both'`, default: `'vertical'`, description: t('允许滚动的方向。', 'Which directions can scroll.') },
            { name: 'label', type: 'string', description: t('读屏标签（等价于 aria-label）。', 'Screen reader label (same as aria-label).') },
            { name: 'focusable', type: 'boolean', default: 'true', description: t('键盘可聚焦：聚焦后用方向键、翻页键滚动。', 'Keyboard-focusable: once focused, scroll with the arrow and page keys.') },
            restRow(t),
          ]}
        />
        <A11yNotes
          items={t([
            '默认 tabIndex=0：里面没有可聚焦的子元素时，键盘用户也能聚焦这个区域并用方向键、PageUp / PageDown、Home / End 滚动。',
            '有名字（label、aria-label 或 aria-labelledby）时是 role="region"，否则是 role="group"。可滚动区域请给一个名字。',
            '里面本来就有很多可聚焦元素、不想多一个 Tab 停靠点时，可以传 focusable={false}。',
            '不需要组件时，给任何滚动容器加类名 ok-scroll 就有同样的滚动条外观。',
          ], [
            'tabIndex=0 by default: even with no focusable children inside, keyboard users can focus the area and scroll with the arrow keys, PageUp / PageDown and Home / End.',
            'With a name (label, aria-label or aria-labelledby) it is role="region", otherwise role="group". Please give scrollable areas a name.',
            'If it already contains plenty of focusable elements and you don’t want an extra Tab stop, pass focusable={false}.',
            'Without the component, add the ok-scroll class to any scroll container for the same scrollbar look.',
          ])}
        />
      </DocSection>

      <DocSection title={t('Sticky', 'Sticky')} description={t('滚动时吸附在最近的滚动容器边缘。注意它吸附的是“最近的滚动祖先”：祖先上有 overflow: hidden 会让它失效。', 'Sticks to the edge of the nearest scroll container while scrolling. Note that it sticks to the nearest scrolling ancestor: an ancestor with overflow: hidden will break it.')}>
        <Demo code={t(STICKY_CODE.zh, STICKY_CODE.en)}>
          <ScrollArea label={t('带粘性头尾的列表', 'List with sticky header and footer')} style={{ height: 260, width: 'min(360px, 100%)', borderRadius: 'var(--ok-r-3)', background: 'var(--ok-card)' }}>
            <Sticky>
              <Box surface="raised" border padding={3}><Text variant="label">{t('吸在顶部的表头', 'Header stuck to the top')}</Text></Box>
            </Sticky>
            <Stack gap={0} padding={2}>
              {lines.map((line) => (
                <Text key={line} as="div" style={{ padding: '10px 12px' }}>{line}</Text>
              ))}
            </Stack>
            <Sticky edge="bottom" offset={2}>
              <Box padding={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="sm" variant="primary">{t('offset=2：离底边 8px', 'offset=2: 8px from the bottom')}</Button>
              </Box>
            </Sticky>
          </ScrollArea>
        </Demo>
        <PropsTable
          title={t('Sticky 属性', 'Sticky props')}
          rows={[
            asRow(t),
            { name: 'edge', type: `'top' | 'bottom'`, default: `'top'`, description: t('吸附在滚动容器的哪一边。', 'Which edge of the scroll container it sticks to.') },
            { name: 'offset', type: 'Space', default: '0', description: t('距离那一边多远（间距档位）。', 'Distance from that edge (spacing step).') },
            restRow(t),
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
