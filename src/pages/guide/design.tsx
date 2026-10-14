import { Card, Group, Row, Text } from 'oink-ui';
import { DocPage, DocSection } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import { href } from '../../router';
import '../../foundations/foundations.css';
import './guide.css';

export const meta: PageMeta = { path: '/guide/design', title: '设计原则', group: '开始', order: 2, subtitle: 'Design', en: { title: 'Design principles' } };

const PRINCIPLES = [
  {
    key: 'radius',
    title: { zh: '形状柔和', en: 'Soft shapes' },
    text: {
      zh: '大圆角、曲率连续的曲线，控件做成胶囊。柔和感全部来自轮廓：内圆角 = 外圆角 − 内边距，层层嵌套，弧线始终平行。',
      en: 'Generous corner radii with continuous curvature; controls are pills. All of the softness comes from outlines: inner radius = outer radius − padding, so nested curves always run parallel.',
    },
  },
  {
    key: 'flat',
    title: { zh: '表面平整', en: 'Flat surfaces' },
    text: {
      zh: '不用阴影和棱台，也几乎不用半透明。层次靠表面色阶和两档发丝线，底色分得开就不描边；只有大块容器顶部留一道高光。',
      en: 'No shadows, no bevels, and almost no translucency. Depth comes from a ladder of surface colors and two weights of hairline; when fills already separate, there is no stroke. Only large containers get a highlight along the top edge.',
    },
  },
  {
    key: 'ink',
    title: { zh: '用色安静', en: 'Quiet color' },
    text: {
      zh: '墨色与中性色承担结构和文字；强调色只给主操作和少数状态，面积不超过一成。选中多用加粗、灰色高亮这类中性手段。',
      en: 'Ink and neutrals carry structure and text; the accent color is reserved for primary actions and a few states, covering no more than a tenth of the screen. Selection is shown with neutral means such as bolder weight or a gray highlight.',
    },
  },
  {
    key: 'motion',
    title: { zh: '动效利落', en: 'Crisp motion' },
    text: {
      zh: '动效用来解释因果：从哪来、到哪去、发生了什么。高频操作快而不回弹，内容一次出现；弹簧留给落位，明显的回弹只留给少数几个时刻。',
      en: 'Motion explains cause and effect: where something came from, where it went, what happened. Frequent actions are fast and never bounce, and content appears in one go; springs are for settling into place, and visible overshoot is saved for a handful of moments.',
    },
  },
];

const CHAPTERS = [
  { title: { zh: '色彩', en: 'Color' }, text: { zh: '品牌色、表面与文字的色阶、强调色和状态色怎么派生，半透明只用在哪四处。', en: 'Brand colors, the surface and text ladders, how accent and status colors are derived, and the four places translucency is allowed.' }, to: '/guide/color' },
  { title: { zh: '字体', en: 'Typography' }, text: { zh: '三套系统字体、十一级字阶和响应式标题字号，字重和排版的规矩。', en: 'Three system font stacks, an eleven-step type scale with responsive heading sizes, and the rules for weight and layout.' }, to: '/guide/typography' },
  { title: { zh: '形状 · 间距 · 层级', en: 'Shape · Spacing · Layers' }, text: { zh: '圆角刻度、同心圆角、容器内边距、间距与控件高度、描边，以及不用阴影怎么分层。', en: 'The corner radius scale, concentric corners, container padding, spacing and control heights, strokes, and layering without shadows.' }, to: '/guide/shape' },
  { title: { zh: '动效', en: 'Motion' }, text: { zh: '时长、缓动与弹簧，六种基本动作，从触发点进场，悬停与按压，减弱动效。', en: 'Durations, easings and springs, six basic moves, entering from the trigger, hover and press, and reduced motion.' }, to: '/guide/motion' },
];

export default function Design() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '形状柔和，表面平整，用色安静，动效利落。四条原则决定了每个组件的样子；后面四章把它们落成具体的规矩和令牌，自己写样式时照着来，就能和库里的组件对上。',
        'Soft shapes, flat surfaces, quiet color, crisp motion. These four principles shape every component; the four chapters that follow turn them into concrete rules and tokens. Follow them in your own styles and your work will sit right next to the library’s components.',
      )}
    >
      <DocSection title={t('四条原则', 'Four principles')}>
        {/* 一张卡片里四行：左边示意图、右边文字。不用多列网格，避免 3 + 1 的落单和 2 × 2 时卡片被拉变形 */}
        <Card className="f-principles">
          <ul className="f-principles__list">
            {PRINCIPLES.map((p) => (
              <li key={p.key} className="f-principle">
                <div className={`f-pv f-pv--${p.key}`} aria-hidden="true"><i /><i /><i /></div>
                <div className="f-principle__text">
                  <Text as="h3" variant="label" style={{ margin: 0 }}>{t(p.title.zh, p.title.en)}</Text>
                  <Text as="p" variant="caption" tone="neutral" style={{ margin: 0 }}>{t(p.text.zh, p.text.en)}</Text>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </DocSection>

      <DocSection title={t('设计基础', 'Foundations')} description={t('四章分别讲原则背后的具体规矩，每章都有跟着主题实时变化的演示。', 'Each chapter covers the concrete rules behind a principle, with live demos that follow the current theme.')}>
        {/* 和上面同样的一列四行：可点击的设置行，整行链接到对应章节 */}
        <Group>
          {CHAPTERS.map((c) => (
            <Row key={c.to} href={href(c.to)} label={t(c.title.zh, c.title.en)} description={t(c.text.zh, c.text.en)} />
          ))}
        </Group>
      </DocSection>
    </DocPage>
  );
}
