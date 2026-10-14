import { Avatar, Badge, Button, Card, Code, Grid, Icon, List, ListItem, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/list', title: 'List 列表', group: '数据展示', order: 40, subtitle: 'List · ListItem', en: { title: 'List', subtitle: 'List · ListItem' } };

/** 示例里的文字 */
const W = {
  zh: {
    members: '项目成员', lin: '林小满', linDesc: '设计 · 负责导航改版', owner: '负责人', zhou: '周屿', zhouDesc: '前端', ago: '3 分钟前',
    adaDesc: '产品', mailAda: '给 Ada Chen 发邮件', mailOpened: '已打开邮件',
    plain: ['没有记号', '只是纵向排开', '适合放自定义内容'],
    bullets: ['支持浅色和深色', '五种预设强调色', '尊重减弱动效的系统设置'],
    steps: ['安装依赖', '引入样式', '在根部挂上 OinkProvider'],
    gap: '间距', notes: '会议纪要.md', budget: '预算.xlsx',
  },
  en: {
    members: 'Project members', lin: 'Ella Morgan', linDesc: 'Design · Leading the nav redesign', owner: 'Owner', zhou: 'Owen Hart', zhouDesc: 'Front end', ago: '3 min ago',
    adaDesc: 'Product', mailAda: 'Email Ada Chen', mailOpened: 'Mail opened',
    plain: ['No marker', 'Just stacked vertically', 'Good for custom content'],
    bullets: ['Light and dark modes', 'Five preset accent colors', 'Respects the system reduced motion setting'],
    steps: ['Install the package', 'Import the styles', 'Wrap the root in OinkProvider'],
    gap: 'Spacing', notes: 'meeting-notes.md', budget: 'budget.xlsx',
  },
};
type Words = typeof W.zh;

const codeBasic = (w: Words) => `
<Card>
  <List divided aria-label="${w.members}">
    <ListItem leading={<Avatar name="${w.lin}" status="online" />} title="${w.lin}" description="${w.linDesc}" trailing={<Badge tone="accent">${w.owner}</Badge>} />
    <ListItem leading={<Avatar name="${w.zhou}" color="auto" />} title="${w.zhou}" description="${w.zhouDesc}" trailing="${w.ago}" />
    <ListItem
      leading={<Avatar name="Ada Chen" color="auto" />}
      title="Ada Chen"
      description="${w.adaDesc}"
      trailing={<Button size="sm" variant="ghost" iconOnly aria-label="${w.mailAda}" onClick={() => toast('${w.mailOpened}')}><Icon name="mail" /></Button>}
    />
  </List>
</Card>`;

const codeMarkers = (w: Words) => `
<Grid columns={{ base: 1, md: 3 }}>
  <List>
${w.plain.map((s) => `    <ListItem>${s}</ListItem>`).join('\n')}
  </List>
  <List marker="bullet">
${w.bullets.map((s) => `    <ListItem>${s}</ListItem>`).join('\n')}
  </List>
  <List marker="number">
${w.steps.map((s) => `    <ListItem>${s}</ListItem>`).join('\n')}
  </List>
</Grid>`;

const codeSizes = (w: Words) => `
<Grid columns={{ base: 1, md: 3 }}>
${(['sm', 'md', 'lg'] as const).map((s, i) => `  <List size="${s}" divided>
    <ListItem title="${s}" description="${w.gap} ${[8, 12, 16][i]}" />
    <ListItem title="${w.notes}" trailing="12 KB" />
    <ListItem title="${w.budget}" trailing="48 KB" />
  </List>`).join('\n')}
</Grid>`;

export default function ListPage() {
  const t = useT();
  const w = t(W.zh, W.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('一组同类条目的纵向排列：成员、文件、待办、要点。只负责排版和列表语义，不带卡片底；需要底时放进 Card。', 'A vertical run of similar items: members, files, to-dos, key points. It handles only layout and list semantics, with no card background; put it in a Card when you need one.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('ListItem 有前置、内容、后置三个位置。title 和 description 是内容区的两行文字。', 'ListItem has three slots: leading, content and trailing. title and description are the two lines of text in the content slot.')}>
        <Demo layout="block" code={codeBasic(w)}>
          <Card>
            <List divided aria-label={w.members}>
              <ListItem leading={<Avatar name={w.lin} status="online" />} title={w.lin} description={w.linDesc} trailing={<Badge tone="accent">{w.owner}</Badge>} />
              <ListItem leading={<Avatar name={w.zhou} color="auto" />} title={w.zhou} description={w.zhouDesc} trailing={w.ago} />
              <ListItem
                leading={<Avatar name="Ada Chen" color="auto" />}
                title="Ada Chen"
                description={w.adaDesc}
                trailing={<Button size="sm" variant="ghost" iconOnly aria-label={w.mailAda} onClick={() => toast(w.mailOpened)}><Icon name="mail" /></Button>}
              />
            </List>
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('项目符号', 'Markers')} description={t('marker 决定条目前面的记号：none（默认）、bullet 圆点、number 序号。number 时根元素自动换成 ol。', 'marker sets the symbol in front of each item: none (default), bullet, or number. With number the root switches to ol automatically.')}>
        <Demo layout="block" code={codeMarkers(w)}>
          <Grid columns={{ base: 1, md: 3 }}>
            <List>
              {w.plain.map((s) => <ListItem key={s}>{s}</ListItem>)}
            </List>
            <List marker="bullet">
              {w.bullets.map((s) => <ListItem key={s}>{s}</ListItem>)}
            </List>
            <List marker="number">
              {w.steps.map((s) => <ListItem key={s}>{s}</ListItem>)}
            </List>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('间距与分隔线', 'Spacing and dividers')} description={t('size 控制条目的上下间距（sm 8、md 12、lg 16）；divided 在条目之间加发丝线。', 'size sets the vertical spacing between items (sm 8, md 12, lg 16); divided adds hairlines between them.')}>
        <Demo layout="block" code={codeSizes(w)}>
          <Grid columns={{ base: 1, md: 3 }}>
            {(['sm', 'md', 'lg'] as const).map((s, i) => (
              <List key={s} size={s} divided>
                <ListItem title={s} description={`${w.gap} ${[8, 12, 16][i]}`} />
                <ListItem title={w.notes} trailing="12 KB" />
                <ListItem title={w.budget} trailing="48 KB" />
              </List>
            ))}
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="List" rows={[
          { name: 'as', type: "'ul' | 'ol'", default: "'ul'", description: t(<>根元素。<Code>marker="number"</Code> 时默认 <Code>ol</Code>。</>, <>Root element. Defaults to <Code>ol</Code> with <Code>marker="number"</Code>.</>) },
          { name: 'marker', type: "'none' | 'bullet' | 'number'", default: "'none'", description: t('项目符号。', 'Item marker.') },
          { name: 'divided', type: 'boolean', description: t('条目之间加发丝线。', 'Adds hairlines between items.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('条目的上下间距。', 'Vertical spacing between items.') },
        ]} />
        <PropsTable title="ListItem" rows={[
          { name: 'leading', type: 'ReactNode', description: t('前置内容：图标、头像。', 'Leading content: an icon or avatar.') },
          { name: 'title', type: 'ReactNode', description: t('主标题；不传就直接用 children 作为内容。', 'Main title; without it, children are used as the content.') },
          { name: 'description', type: 'ReactNode', description: t('标题下的说明。', 'Description under the title.') },
          { name: 'trailing', type: 'ReactNode', description: t('后置内容：徽标、时间、操作。', 'Trailing content: a badge, a time, an action.') },
        ]} />
        <A11yNotes items={t([
          <>根元素是真的 <Code>ul</Code> / <Code>ol</Code>，并显式写了 <Code>role="list"</Code>：去掉默认列表样式后，部分读屏会丢掉列表语义，这样能保住“列表，共 N 项”的播报。</>,
          '圆点和序号是 CSS 生成的装饰；顺序有意义时用 number，读屏会按 ol 读出序号。',
          '列表本身不可聚焦，没有键盘操作；条目里的按钮、链接按文档顺序 Tab 到。',
          '后置位置放图标按钮时，aria-label 里要带上是哪一条（如“给 Ada Chen 发邮件”）。',
        ], [
          <>The root is a real <Code>ul</Code> / <Code>ol</Code> with an explicit <Code>role="list"</Code>: some screen readers drop list semantics once default list styles are removed, and this keeps the “list, N items” announcement.</>,
          'Bullets and numbers are CSS-generated decoration; when order matters, use number so screen readers read the numbers from the ol.',
          'The list itself isn’t focusable and has no keyboard interaction; buttons and links inside items are reached by Tab in document order.',
          'When the trailing slot holds an icon button, its aria-label should say which item it’s for (such as “Email Ada Chen”).',
        ])} />
      </DocSection>
    </DocPage>
  );
}
