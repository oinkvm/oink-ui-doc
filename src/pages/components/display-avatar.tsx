import { Avatar, AvatarGroup, Code, Icon, Inline } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/avatar', title: 'Avatar 头像', group: '数据展示', order: 70, subtitle: 'Avatar · AvatarGroup', en: { title: 'Avatar', subtitle: 'Avatar · AvatarGroup' } };

// 内联的示例图片，避免依赖外部网络
const PHOTO = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="#7FB0FF"/><circle cx="24" cy="19" r="9" fill="#fff"/><path d="M6 48c2-12 10-16 18-16s16 4 18 16z" fill="#fff"/></svg>')}`;

/** 示例里的人名：中文版用中文名，英文版用英文名 */
const NAMES = {
  zh: { zhou: '周屿', lin: '林小满', ada: 'Ada Chen', song: '宋知远', he: '何田田' },
  en: { zhou: 'Owen Hart', lin: 'Ella Morgan', ada: 'Ada Chen', song: 'Sam Turner', he: 'Hannah Reed' },
};
type Names = typeof NAMES.zh;

const W = {
  zh: { missing: '/不存在的图片.png', anyImage: '// 任意图片地址', bot: '机器人', meeting: '会议中', members: '项目成员', reviewers: '评审人', followers: '关注者' },
  en: { missing: '/missing-image.png', anyImage: '// any image URL', bot: 'Bot', meeting: 'In a meeting', members: 'Project members', reviewers: 'Reviewers', followers: 'Followers' },
};
type Words = typeof W.zh;

const codeBasic = (n: Names, w: Words) => `
const PHOTO = 'data:image/svg+xml,…'; ${w.anyImage}

<Avatar src={PHOTO} name="${n.zhou}" />
<Avatar name="${n.lin}" />
<Avatar name="${n.ada}" />
<Avatar src="${w.missing}" name="${n.song}" />
<Avatar />`;

const codeSizes = (n: Names) => `
<Avatar name="${n.lin}" size="sm" />
<Avatar name="${n.lin}" size="md" />
<Avatar name="${n.lin}" size="lg" />
<Avatar name="${n.lin}" size={72} />`;

const codeColor = (n: Names, w: Words) => `
<Avatar name="${n.lin}" color="auto" />
<Avatar name="${n.zhou}" color="auto" />
<Avatar name="${n.ada}" color="auto" />
<Avatar name="${n.song}" color="auto" />
<Avatar name="${n.he}" color="#D9A6FF" />
<Avatar alt="${w.bot}" color="var(--ok-fill)"><Icon name="sparkle" /></Avatar>`;

const codeStatus = (n: Names, w: Words) => `
<Avatar name="${n.lin}" size="lg" status="online" />
<Avatar name="${n.zhou}" size="lg" status="busy" />
<Avatar name="${n.ada}" size="lg" status="away" />
<Avatar name="${n.song}" size="lg" status="offline" />
<Avatar name="${n.he}" size="lg" status="busy" statusLabel="${w.meeting}" />`;

const codeGroup = (n: Names, w: Words) => `
<AvatarGroup label="${w.members}" max={3}>
  <Avatar name="${n.lin}" color="auto" />
  <Avatar name="${n.zhou}" color="auto" />
  <Avatar name="${n.ada}" color="auto" />
  <Avatar name="${n.song}" color="auto" />
  <Avatar name="${n.he}" color="auto" />
</AvatarGroup>

<Inline gap={5}>
  <AvatarGroup label="${w.reviewers}" size="sm" total={12}>
    <Avatar name="${n.lin}" color="auto" />
    <Avatar name="${n.zhou}" color="auto" />
  </AvatarGroup>
  <AvatarGroup label="${w.followers}" size="lg">
    <Avatar name="${n.ada}" color="auto" />
    <Avatar name="${n.song}" color="auto" />
    <Avatar name="${n.he}" color="auto" />
  </AvatarGroup>
</Inline>`;

export default function AvatarPage() {
  const t = useT();
  const n = t(NAMES.zh, NAMES.en);
  const w = t(W.zh, W.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('代表一个人或一个账号。有图片显示图片，没有或加载失败时回退到名字的首字母。多个人挤在一起时用 AvatarGroup。', 'Represents a person or an account. Shows the image when there is one, and falls back to the name’s initials when there isn’t or it fails to load. Use AvatarGroup for several people side by side.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('name 既用来生成首字母，也是读屏读到的名字。中日韩名字取第一个字，拉丁名字取首尾两个词的首字母。什么都不传时显示一个人形图标，并对读屏隐藏。', 'name generates the initials and is also what screen readers announce. CJK names use the first character; Latin names use the initials of the first and last words. With nothing passed, a person icon is shown and hidden from screen readers.')}>
        <Demo code={codeBasic(n, w)}>
          <Avatar src={PHOTO} name={n.zhou} />
          <Avatar name={n.lin} />
          <Avatar name={n.ada} />
          <Avatar src={w.missing} name={n.song} />
          <Avatar />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')} description={t('sm 28、md 36（默认）、lg 48，也可以直接给像素值；首字母的字号跟着缩放。', 'sm 28, md 36 (default), lg 48, or any pixel value; the initials scale along.')}>
        <Demo code={codeSizes(n)}>
          <Avatar name={n.lin} size="sm" />
          <Avatar name={n.lin} size="md" />
          <Avatar name={n.lin} size="lg" />
          <Avatar name={n.lin} size={72} />
        </Demo>
      </DocSection>

      <DocSection title={t('底色', 'Background color')} description={t('首字母的底色默认是强调色。color="auto" 按名字从六种固定颜色里挑一个（同一个名字永远是同一种颜色）；也可以传任意颜色值，或用 children 换掉首字母。', 'Initials sit on the accent color by default. color="auto" picks one of six fixed colors from the name (the same name always gets the same color); you can also pass any color value, or replace the initials with children.')}>
        <Demo code={codeColor(n, w)}>
          <Avatar name={n.lin} color="auto" />
          <Avatar name={n.zhou} color="auto" />
          <Avatar name={n.ada} color="auto" />
          <Avatar name={n.song} color="auto" />
          <Avatar name={n.he} color="#D9A6FF" />
          <Avatar alt={w.bot} color="var(--ok-fill)"><Icon name="sparkle" /></Avatar>
        </Demo>
      </DocSection>

      <DocSection title={t('状态点', 'Status dot')} description={t('右下角的小点表示在线状态。状态会并进读屏的名字里（“林小满，在线”），不只靠颜色。', 'The dot in the bottom-right corner shows presence. The status is folded into the screen reader name (“Ella Morgan, online”), so it doesn’t rely on color alone.')}>
        <Demo code={codeStatus(n, w)}>
          <Avatar name={n.lin} size="lg" status="online" />
          <Avatar name={n.zhou} size="lg" status="busy" />
          <Avatar name={n.ada} size="lg" status="away" />
          <Avatar name={n.song} size="lg" status="offline" />
          <Avatar name={n.he} size="lg" status="busy" statusLabel={w.meeting} />
        </Demo>
      </DocSection>

      <DocSection title={t('头像组', 'Avatar group')} description={t('头像固定叠放（间距 −10），没有悬停动效。max 限制显示的个数，其余折成“+N”；实际人数比传进来的头像多时用 total。size 统一设置里面头像的尺寸。', 'Avatars overlap at a fixed −10 spacing, with no hover effect. max caps how many are shown and folds the rest into “+N”; use total when there are more people than avatars passed in. size sets the size of every avatar inside.')}>
        <Demo layout="col" align="start" code={codeGroup(n, w)}>
          <AvatarGroup label={w.members} max={3}>
            <Avatar name={n.lin} color="auto" />
            <Avatar name={n.zhou} color="auto" />
            <Avatar name={n.ada} color="auto" />
            <Avatar name={n.song} color="auto" />
            <Avatar name={n.he} color="auto" />
          </AvatarGroup>

          <Inline gap={5}>
            <AvatarGroup label={w.reviewers} size="sm" total={12}>
              <Avatar name={n.lin} color="auto" />
              <Avatar name={n.zhou} color="auto" />
            </AvatarGroup>
            <AvatarGroup label={w.followers} size="lg">
              <Avatar name={n.ada} color="auto" />
              <Avatar name={n.song} color="auto" />
              <Avatar name={n.he} color="auto" />
            </AvatarGroup>
          </Inline>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('尺寸', 'Sizes'), t('28 / 36 / 48 · 全圆', '28 / 36 / 48 · fully round')],
          [t('头像组', 'Group'), t('叠放间距 −10 · 无悬停动效', 'overlap −10 · no hover effect')],
          [t('回退', 'Fallback'), t('图片失败 → 首字母 → 人形图标', 'image fails → initials → person icon')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Avatar" rows={[
          { name: 'src', type: 'string', description: t('图片地址；加载失败时回退到首字母。', 'Image URL; falls back to initials if it fails to load.') },
          { name: 'name', type: 'string', description: t('人名：用来生成首字母，也是读屏读到的名字。', 'Person’s name: generates the initials and is what screen readers announce.') },
          { name: 'alt', type: 'string', description: t('覆盖读屏读到的名字。', 'Overrides the name announced by screen readers.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number", default: "'md'", description: t('28 / 36 / 48，或像素值。在 AvatarGroup 里默认跟随组的 size。', '28 / 36 / 48, or a pixel value. Inside AvatarGroup it follows the group’s size by default.') },
          { name: 'color', type: "string | 'auto'", description: t('首字母底色。默认强调色；auto 按名字从一组固定颜色里挑。', 'Background behind the initials. Accent color by default; auto picks from a fixed set based on the name.') },
          { name: 'status', type: "'online' | 'busy' | 'away' | 'offline'", description: t('右下角的状态点。', 'Status dot in the bottom-right corner.') },
          { name: 'statusLabel', type: 'string', description: t('状态的读屏文字，默认 在线 / 忙碌 / 离开 / 离线。', 'Screen reader text for the status. Defaults to Online / Busy / Away / Offline, following the OinkProvider locale.') },
          { name: 'children', type: 'ReactNode', description: t('自定义回退内容，替换首字母。', 'Custom fallback content that replaces the initials.') },
        ]} />
        <PropsTable title="AvatarGroup" rows={[
          { name: 'max', type: 'number', description: t('最多显示几个头像，其余折成“+N”。', 'Maximum number of avatars shown; the rest fold into “+N”.') },
          { name: 'total', type: 'number', description: t('实际总人数（比传进来的头像多时用），用来算“+N”。', 'Actual headcount (when it exceeds the avatars passed in), used to compute “+N”.') },
          { name: 'size', type: "'sm' | 'md' | 'lg' | number", description: t('统一设置里面头像的尺寸。', 'Sets the size of every avatar inside.') },
          { name: 'label', type: 'string', description: t('这组头像的名字，如“项目成员”。', 'Name of the group, such as “Project members”.') },
        ]} />
        <A11yNotes items={t([
          <>有名字时整个头像是一张图：<Code>role="img"</Code>，名字是 <Code>name</Code>（或 <Code>alt</Code>）加状态文字；里面的图片和首字母对读屏隐藏，不会重复朗读。</>,
          <>没有名字的头像是纯装饰，自动 <Code>aria-hidden</Code>。旁边已经写了人名时，可以故意不传 name 以免读两遍。</>,
          <>AvatarGroup 是 <Code>role="group"</Code>，用 <Code>label</Code> 起名；“+N”读作“还有 N 人”。</>,
          '头像不可聚焦，没有键盘操作；需要点击时请包进按钮或链接并给出名字。',
        ], [
          <>With a name, the whole avatar is one image: <Code>role="img"</Code>, named by <Code>name</Code> (or <Code>alt</Code>) plus the status text; the inner image and initials are hidden from screen readers so nothing is read twice.</>,
          <>An avatar without a name is purely decorative and gets <Code>aria-hidden</Code> automatically. When the name is already written next to it, you can leave name out on purpose to avoid reading it twice.</>,
          <>AvatarGroup is a <Code>role="group"</Code> named by <Code>label</Code>; “+N” is read as “N more”.</>,
          'Avatars aren’t focusable and have no keyboard interaction; if one needs to be clickable, wrap it in a named button or link.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
