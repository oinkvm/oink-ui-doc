import { Avatar, Badge, Button, Card, CardBody, CardFooter, CardHeader, CardLink, CardMedia, Code, Grid, Icon, Text, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';
import { AccentArt, productUri, sceneUri } from './display-_art';
import type { ProductKind } from './display-_art';

export const meta: PageMeta = { path: '/components/card', title: 'Card 卡片', group: '数据展示', order: 20, subtitle: 'Card · CardLink · CardMedia', en: { title: 'Card', subtitle: 'Card · CardLink · CardMedia' } };

type Product = { kind: ProductKind; name: string; desc: string; price: string; alt: string; badge?: string };
const PRODUCTS: { zh: Product[]; en: Product[] } = {
  zh: [
    { kind: 'mug', name: '珊瑚马克杯', desc: '350ml · 哑光釉面', price: '¥68', alt: '珊瑚色的马克杯，冒着热气', badge: '新品' },
    { kind: 'plant', name: '陶土小盆栽', desc: '含托盘 · 适合窗台', price: '¥45', alt: '陶土花盆里的三片叶子绿植' },
    { kind: 'lamp', name: '暮紫台灯', desc: '三档暖光 · USB-C', price: '¥199', alt: '紫色灯罩的台灯，亮着暖黄的光' },
  ],
  en: [
    { kind: 'mug', name: 'Coral mug', desc: '350 ml · matte glaze', price: '$14', alt: 'A coral mug with steam rising from it', badge: 'New' },
    { kind: 'plant', name: 'Terracotta planter', desc: 'Saucer included · windowsill size', price: '$9', alt: 'A three-leaf plant in a terracotta pot' },
    { kind: 'lamp', name: 'Dusk desk lamp', desc: 'Three warm settings · USB-C', price: '$39', alt: 'A desk lamp with a purple shade, glowing warm yellow' },
  ],
};

const CODE_BASIC = {
  zh: `
<Card style={{ maxWidth: 400 }}>
  <CardHeader title="本周周报" description="周五 18:00 前提交" actions={<Badge tone="warning" dot>待提交</Badge>} />
  <CardBody>汇总本周完成的事项、遇到的阻碍和下周计划，提交后组长会收到通知。</CardBody>
  <CardFooter>
    <Button variant="primary" onClick={() => toast('已打开周报编辑器')}>开始填写</Button>
    <Button variant="ghost">稍后提醒</Button>
  </CardFooter>
</Card>`,
  en: `
<Card style={{ maxWidth: 400 }}>
  <CardHeader title="Weekly report" description="Due Friday 18:00" actions={<Badge tone="warning" dot>Not submitted</Badge>} />
  <CardBody>Sum up what you finished this week, what blocked you and what’s next. Your lead is notified when you submit.</CardBody>
  <CardFooter>
    <Button variant="primary" onClick={() => toast('Report editor opened')}>Start writing</Button>
    <Button variant="ghost">Remind me later</Button>
  </CardFooter>
</Card>`,
};

const CODE_SIZES = {
  zh: `
<Grid columns={{ base: 1, md: 3 }} align="start">
  <Card size="sm"><CardHeader title="sm" description="圆角 20，内边距 16" /></Card>
  <Card size="md"><CardHeader title="md" description="圆角 24，内边距 20" /></Card>
  <Card size="lg"><CardHeader title="lg" description="圆角 32，内边距 24" /></Card>
</Grid>`,
  en: `
<Grid columns={{ base: 1, md: 3 }} align="start">
  <Card size="sm"><CardHeader title="sm" description="Radius 20, padding 16" /></Card>
  <Card size="md"><CardHeader title="md" description="Radius 24, padding 20" /></Card>
  <Card size="lg"><CardHeader title="lg" description="Radius 32, padding 24" /></Card>
</Grid>`,
};

const CODE_INTERACTIVE = {
  zh: `
<Grid columns={{ base: 1, md: 2 }}>
  <Card href="/components/card" chevron>
    <Text as="div" variant="label">整卡是链接</Text>
    <Text as="div" tone="neutral">href + chevron</Text>
  </Card>
  <Card interactive chevron onClick={() => toast('点了按钮卡片')}>
    <Text as="span" variant="label" style={{ display: 'block' }}>整卡是按钮</Text>
    <Text as="span" tone="neutral" style={{ display: 'block' }}>interactive + chevron</Text>
  </Card>
  <Card interactive chevron disabled>
    <Text as="span" variant="label" style={{ display: 'block' }}>禁用</Text>
    <Text as="span" tone="neutral" style={{ display: 'block' }}>不响应悬停和按压</Text>
  </Card>
  <Card interactive onClick={() => toast('没有箭头的按钮卡片')}>
    <Text as="span" variant="label" style={{ display: 'block' }}>不带箭头</Text>
    <Text as="span" tone="neutral" style={{ display: 'block' }}>只有描边和按压反馈</Text>
  </Card>
</Grid>`,
  en: `
<Grid columns={{ base: 1, md: 2 }}>
  <Card href="/components/card" chevron>
    <Text as="div" variant="label">Whole card is a link</Text>
    <Text as="div" tone="neutral">href + chevron</Text>
  </Card>
  <Card interactive chevron onClick={() => toast('Button card clicked')}>
    <Text as="span" variant="label" style={{ display: 'block' }}>Whole card is a button</Text>
    <Text as="span" tone="neutral" style={{ display: 'block' }}>interactive + chevron</Text>
  </Card>
  <Card interactive chevron disabled>
    <Text as="span" variant="label" style={{ display: 'block' }}>Disabled</Text>
    <Text as="span" tone="neutral" style={{ display: 'block' }}>No hover or press response</Text>
  </Card>
  <Card interactive onClick={() => toast('Button card without a chevron')}>
    <Text as="span" variant="label" style={{ display: 'block' }}>No chevron</Text>
    <Text as="span" tone="neutral" style={{ display: 'block' }}>Just the border and press feedback</Text>
  </Card>
</Grid>`,
};

const CODE_CARDLINK = {
  zh: `
<Grid columns={{ base: 1, md: 2 }}>
  <Card>
    <CardHeader
      title={<CardLink href="/components/card">设计评审：导航改版</CardLink>}
      description="周四 14:00 · 3 号会议室"
      actions={<Button size="sm" iconOnly variant="ghost" aria-label="分享设计评审" onClick={() => toast('已复制链接')}><Icon name="share" /></Button>}
    />
    <CardFooter align="between">
      <Avatar name="林小满" size="sm" />
      <Button size="sm" onClick={() => toast.success('已接受邀请')}>接受</Button>
    </CardFooter>
  </Card>
  <Card>
    <CardHeader title={<CardLink onClick={() => toast('不传 href 时是按钮')}>不传 href 时是按钮</CardLink>} description="点卡片任意位置触发 onClick" />
  </Card>
</Grid>`,
  en: `
<Grid columns={{ base: 1, md: 2 }}>
  <Card>
    <CardHeader
      title={<CardLink href="/components/card">Design review: nav redesign</CardLink>}
      description="Thursday 14:00 · Room 3"
      actions={<Button size="sm" iconOnly variant="ghost" aria-label="Share design review" onClick={() => toast('Link copied')}><Icon name="share" /></Button>}
    />
    <CardFooter align="between">
      <Avatar name="Ella Morgan" size="sm" />
      <Button size="sm" onClick={() => toast.success('Invitation accepted')}>Accept</Button>
    </CardFooter>
  </Card>
  <Card>
    <CardHeader title={<CardLink onClick={() => toast('A button when there’s no href')}>A button when there’s no href</CardLink>} description="Click anywhere on the card to fire onClick" />
  </Card>
</Grid>`,
};

const CODE_PRODUCTS = {
  zh: `
<Grid columns={{ base: 1, sm: 2, lg: 3 }}>
  {products.map((p) => (
    <Card key={p.name}>
      <CardMedia src={p.image} alt={p.alt} ratio={1}>
        {p.badge && <Badge tone="accent" style={{ position: 'absolute', top: 12, left: 12 }}>{p.badge}</Badge>}
      </CardMedia>
      <CardHeader title={<CardLink href={p.href}>{p.name}</CardLink>} description={p.desc} />
      <CardFooter align="between">
        <Text variant="label">¥{p.price}</Text>
        <Button size="sm" iconOnly aria-label={\`把\${p.name}加入购物车\`} onClick={() => addToCart(p)}><Icon name="cart" /></Button>
      </CardFooter>
    </Card>
  ))}
</Grid>`,
  en: `
<Grid columns={{ base: 1, sm: 2, lg: 3 }}>
  {products.map((p) => (
    <Card key={p.name}>
      <CardMedia src={p.image} alt={p.alt} ratio={1}>
        {p.badge && <Badge tone="accent" style={{ position: 'absolute', top: 12, left: 12 }}>{p.badge}</Badge>}
      </CardMedia>
      <CardHeader title={<CardLink href={p.href}>{p.name}</CardLink>} description={p.desc} />
      <CardFooter align="between">
        <Text variant="label">\${p.price}</Text>
        <Button size="sm" iconOnly aria-label={\`Add \${p.name} to cart\`} onClick={() => addToCart(p)}><Icon name="cart" /></Button>
      </CardFooter>
    </Card>
  ))}
</Grid>`,
};

const CODE_MEDIA = {
  zh: `
<Grid columns={{ base: 1, md: 2 }}>
  <Card href="/articles/hiking">
    <CardMedia src={cover} alt="" />
    <CardHeader title="周末去湖边走走" description="一条 6 公里的环湖步道，适合新手" />
  </Card>
  <Card size="sm">
    <CardMedia alt="强调色的波浪插画" ratio={2}>
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">…</svg>
    </CardMedia>
    <CardHeader title="跟着主题变色" description="插画用 --ok-accent 上色" />
  </Card>
</Grid>`,
  en: `
<Grid columns={{ base: 1, md: 2 }}>
  <Card href="/articles/hiking">
    <CardMedia src={cover} alt="" />
    <CardHeader title="A weekend walk by the lake" description="A 6 km loop trail, easy for beginners" />
  </Card>
  <Card size="sm">
    <CardMedia alt="Wave illustration in the accent color" ratio={2}>
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">…</svg>
    </CardMedia>
    <CardHeader title="Follows the theme" description="The illustration is colored with --ok-accent" />
  </Card>
</Grid>`,
};

const CODE_START = {
  zh: `
<Card style={{ maxWidth: 680 }}>
  <CardMedia position="start" src={cover} alt="傍晚紫色的山丘" />
  <CardHeader title="山顶看日落" description="周六 16:30 · 西山步道入口集合" actions={<Badge tone="success" dot>报名中</Badge>} />
  <CardBody>全程约 2 小时，坡度平缓。带一件薄外套，山顶风大。</CardBody>
  <CardFooter>
    <Button variant="primary">报名</Button>
    <Button variant="ghost">收藏</Button>
  </CardFooter>
</Card>`,
  en: `
<Card style={{ maxWidth: 680 }}>
  <CardMedia position="start" src={cover} alt="Purple hills at dusk" />
  <CardHeader title="Sunset from the summit" description="Saturday 16:30 · Meet at the West Hill trailhead" actions={<Badge tone="success" dot>Open</Badge>} />
  <CardBody>About 2 hours round trip on gentle slopes. Bring a light jacket; it’s windy at the top.</CardBody>
  <CardFooter>
    <Button variant="primary">Sign up</Button>
    <Button variant="ghost">Save</Button>
  </CardFooter>
</Card>`,
};

export default function CardPage() {
  const t = useT();
  const products = t(PRODUCTS.zh, PRODUCTS.en);
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('把一件事的标题、内容和操作收在一个白色块里：列表里的一个条目、仪表盘上的一块信息。整块可点击时用可点击卡片或 CardLink。', 'Gathers the title, content and actions of one thing into a single white block: an entry in a list, a tile on a dashboard. When the whole block should be clickable, use an interactive card or CardLink.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('CardHeader、CardBody、CardFooter 是可选的分区；也可以直接往 Card 里放任何内容。', 'CardHeader, CardBody and CardFooter are optional sections; you can also put anything straight into Card.')}>
        <Demo align="stretch" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Card style={{ maxWidth: 400 }}>
            <CardHeader title={t('本周周报', 'Weekly report')} description={t('周五 18:00 前提交', 'Due Friday 18:00')} actions={<Badge tone="warning" dot>{t('待提交', 'Not submitted')}</Badge>} />
            <CardBody>{t('汇总本周完成的事项、遇到的阻碍和下周计划，提交后组长会收到通知。', 'Sum up what you finished this week, what blocked you and what’s next. Your lead is notified when you submit.')}</CardBody>
            <CardFooter>
              <Button variant="primary" onClick={() => toast(t('已打开周报编辑器', 'Report editor opened'))}>{t('开始填写', 'Start writing')}</Button>
              <Button variant="ghost">{t('稍后提醒', 'Remind me later')}</Button>
            </CardFooter>
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')} description={t('圆角与内边距成对变化，内边距四边相等：sm 20 / 16、md 24 / 20（默认）、lg 32 / 24。', 'Corner radius and padding change in pairs, with equal padding on all sides: sm 20 / 16, md 24 / 20 (default), lg 32 / 24.')}>
        <Demo layout="block" code={t(CODE_SIZES.zh, CODE_SIZES.en)}>
          <Grid columns={{ base: 1, md: 3 }} align="start">
            <Card size="sm"><CardHeader title="sm" description={t('圆角 20，内边距 16', 'Radius 20, padding 16')} /></Card>
            <Card size="md"><CardHeader title="md" description={t('圆角 24，内边距 20', 'Radius 24, padding 20')} /></Card>
            <Card size="lg"><CardHeader title="lg" description={t('圆角 32，内边距 24', 'Radius 32, padding 24')} /></Card>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('可点击卡片', 'Interactive cards')} description={t('传 href 时根节点是链接，传 interactive 时是按钮。悬停只把描边加深一档、箭头变深，按下整体回缩到 0.985。按钮形态里只能放短语内容（文字、图标、头像），不能放标题和别的按钮。', 'With href the root is a link; with interactive it’s a button. Hover only darkens the border one step and deepens the chevron; pressing scales the whole card to 0.985. The button form can only hold phrasing content (text, icons, avatars), not headings or other buttons.')}>
        <Demo layout="block" code={t(CODE_INTERACTIVE.zh, CODE_INTERACTIVE.en)}>
          <Grid columns={{ base: 1, md: 2 }}>
            <Card href="/components/card" chevron>
              <Text as="div" variant="label">{t('整卡是链接', 'Whole card is a link')}</Text>
              <Text as="div" tone="neutral">href + chevron</Text>
            </Card>
            <Card interactive chevron onClick={() => toast(t('点了按钮卡片', 'Button card clicked'))}>
              <Text as="span" variant="label" style={{ display: 'block' }}>{t('整卡是按钮', 'Whole card is a button')}</Text>
              <Text as="span" tone="neutral" style={{ display: 'block' }}>interactive + chevron</Text>
            </Card>
            <Card interactive chevron disabled>
              <Text as="span" variant="label" style={{ display: 'block' }}>{t('禁用', 'Disabled')}</Text>
              <Text as="span" tone="neutral" style={{ display: 'block' }}>{t('不响应悬停和按压', 'No hover or press response')}</Text>
            </Card>
            <Card interactive onClick={() => toast(t('没有箭头的按钮卡片', 'Button card without a chevron'))}>
              <Text as="span" variant="label" style={{ display: 'block' }}>{t('不带箭头', 'No chevron')}</Text>
              <Text as="span" tone="neutral" style={{ display: 'block' }}>{t('只有描边和按压反馈', 'Just the border and press feedback')}</Text>
            </Card>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('CardLink 覆盖链接', 'CardLink overlay link')} description={t('卡片里既有标题又有别的按钮时，把 CardLink 放进标题：它的点击区域铺满整张卡片，其余链接和按钮浮在上面，仍然可以单独点。读屏读到的是一个名字清楚的链接，而不是把整张卡片的文字念一遍。', 'When a card has both a title and other buttons, put CardLink in the title: its hit area stretches over the whole card while the other links and buttons float above it and stay clickable on their own. Screen readers hear one clearly named link instead of the entire card’s text.')}>
        <Demo layout="block" code={t(CODE_CARDLINK.zh, CODE_CARDLINK.en)}>
          <Grid columns={{ base: 1, md: 2 }}>
            <Card>
              <CardHeader
                title={<CardLink href="/components/card">{t('设计评审：导航改版', 'Design review: nav redesign')}</CardLink>}
                description={t('周四 14:00 · 3 号会议室', 'Thursday 14:00 · Room 3')}
                actions={<Button size="sm" iconOnly variant="ghost" aria-label={t('分享设计评审', 'Share design review')} onClick={() => toast(t('已复制链接', 'Link copied'))}><Icon name="share" /></Button>}
              />
              <CardFooter align="between">
                <Avatar name={t('林小满', 'Ella Morgan')} size="sm" />
                <Button size="sm" onClick={() => toast.success(t('已接受邀请', 'Invitation accepted'))}>{t('接受', 'Accept')}</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader title={<CardLink onClick={() => toast(t('不传 href 时是按钮', 'A button when there’s no href'))}>{t('不传 href 时是按钮', 'A button when there’s no href')}</CardLink>} description={t('点卡片任意位置触发 onClick', 'Click anywhere on the card to fire onClick')} />
            </Card>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('带主图的卡片', 'Cards with media')} description={t('把 CardMedia 放成 Card 的第一个子元素：它贴满卡片顶部、和卡片边界没有间距，上两个角跟着卡片圆角，下边是直的；下面的内容照常留内边距。卡片的描边和顶部高光画在图片之上，可点击卡片的悬停、按下和焦点环照常。', 'Make CardMedia the first child of Card: it fills the top edge with no gap to the card’s border, its top two corners follow the card’s corner radius and its bottom edge is straight; the content below keeps its usual padding. The card’s border and top highlight are drawn over the image, and hover, press and focus ring on interactive cards work as usual.')}>
        <Demo
          title={t('商品卡', 'Product card')}
          description={t('标题放 CardLink，整张卡片（包括图片）都能点；加购按钮浮在上面，单独可点。', 'With CardLink in the title, the whole card (image included) is clickable; the add-to-cart button floats above it and can be clicked on its own.')}
          layout="block"
          code={t(CODE_PRODUCTS.zh, CODE_PRODUCTS.en)}
        >
          <Grid columns={{ base: 1, sm: 2, lg: 3 }}>
            {products.map((p) => (
              <Card key={p.kind}>
                <CardMedia src={productUri(p.kind)} alt={p.alt} ratio={1}>
                  {p.badge && <Badge tone="accent" style={{ position: 'absolute', top: 12, left: 12 }}>{p.badge}</Badge>}
                </CardMedia>
                <CardHeader title={<CardLink href="/components/card">{p.name}</CardLink>} description={p.desc} />
                <CardFooter align="between">
                  <Text variant="label">{p.price}</Text>
                  <Button size="sm" iconOnly aria-label={t(`把${p.name}加入购物车`, `Add ${p.name} to cart`)} onClick={() => toast.success(t(`已把${p.name}加入购物车`, `Added ${p.name} to cart`))}><Icon name="cart" /></Button>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Demo>
        <Demo
          title={t('整卡链接与插画', 'Link cards and illustrations')}
          description={t('href 卡片放主图同样贴边；没有图片地址时，往 CardMedia 里直接放 svg。', 'Media on an href card is flush with the edges too; without an image URL, put an svg straight into CardMedia.')}
          layout="block"
          code={t(CODE_MEDIA.zh, CODE_MEDIA.en)}
        >
          <Grid columns={{ base: 1, md: 2 }} align="start">
            <Card href="/components/card">
              <CardMedia src={sceneUri('lake')} alt="" />
              <CardHeader title={t('周末去湖边走走', 'A weekend walk by the lake')} description={t('一条 6 公里的环湖步道，适合新手', 'A 6 km loop trail, easy for beginners')} />
            </Card>
            <Card size="sm">
              <CardMedia alt={t('强调色的波浪插画', 'Wave illustration in the accent color')} ratio={2}><AccentArt /></CardMedia>
              <CardHeader title={t('跟着主题变色', 'Follows the theme')} description={t('插画用 --ok-accent 上色，换强调色试试', 'The illustration is colored with --ok-accent; try another accent color')} />
            </Card>
          </Grid>
        </Demo>
        <Demo
          title={t('左图右文', 'Image on the side')}
          description={t(
            <>position=&quot;start&quot;：卡片宽于约 520px 时图片贴在左侧、占满卡片高度，左两个角跟着卡片圆角；卡片变窄后自动回到顶部。用卡片自身的宽度判断（容器查询），不看视口。</>,
            <>position=&quot;start&quot;: when the card is wider than about 520px, the image sits flush on the left at full card height, its left two corners following the card’s corner radius; on a narrower card it moves back to the top. It goes by the card’s own width (a container query), not the viewport.</>,
          )}
          layout="block"
          code={t(CODE_START.zh, CODE_START.en)}
        >
          <Card style={{ maxWidth: 680 }}>
            <CardMedia position="start" src={sceneUri('dusk')} alt={t('傍晚紫色的山丘', 'Purple hills at dusk')} />
            <CardHeader title={t('山顶看日落', 'Sunset from the summit')} description={t('周六 16:30 · 西山步道入口集合', 'Saturday 16:30 · Meet at the West Hill trailhead')} actions={<Badge tone="success" dot>{t('报名中', 'Open')}</Badge>} />
            <CardBody>{t('全程约 2 小时，坡度平缓。带一件薄外套，山顶风大。', 'About 2 hours round trip on gentle slopes. Bring a light jacket; it’s windy at the top.')}</CardBody>
            <CardFooter>
              <Button variant="primary" onClick={() => toast.success(t('报名成功', 'You’re signed up'))}>{t('报名', 'Sign up')}</Button>
              <Button variant="ghost" onClick={() => toast(t('已收藏', 'Saved'))}>{t('收藏', 'Save')}</Button>
            </CardFooter>
          </Card>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('卡片', 'Card'), t('圆角 24 · 内边距 20，四边相等', 'corner radius 24 · padding 20 on all sides')],
          [t('悬停', 'Hover'), t('描边加深（--ok-line → --ok-line-2），底色不变', 'border darkens (--ok-line → --ok-line-2), background unchanged')],
          [t('箭头', 'Chevron'), t('悬停时变深，不位移', 'darkens on hover, doesn’t move')],
          [t('按下', 'Press'), t('scale 0.985 · 90ms，松开弹回', 'scale 0.985 · 90ms, springs back on release')],
          [t('禁用', 'Disabled'), t('不透明度 0.5，指针 not-allowed', 'opacity 0.5, cursor not-allowed')],
          [t('主图', 'Media'), t('贴边、无间距；上两角（start 时左两角）跟卡片圆角；描边与高光叠在图上', 'flush, no gap; top two corners (left two with start) follow the card’s corner radius; border and highlight drawn over the image')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Card" rows={[
          { name: 'as', type: 'ElementType', default: "'div'", description: t(<>静态卡片渲染成什么元素。传了 <Code>href</Code> 或 <Code>interactive</Code> 时忽略。</>, <>Element to render for a static card. Ignored when <Code>href</Code> or <Code>interactive</Code> is set.</>) },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('圆角与内边距：20 / 16、24 / 20、32 / 24。', 'Corner radius and padding: 20 / 16, 24 / 20, 32 / 24.') },
          { name: 'href', type: 'string', description: t(<>整卡是链接，根节点渲染成 <Code>a</Code>；可配合 <Code>target</Code>、<Code>rel</Code>。</>, <>Makes the whole card a link; the root renders as <Code>a</Code>. Works with <Code>target</Code> and <Code>rel</Code>.</>) },
          { name: 'interactive', type: 'boolean', description: t(<>整卡是按钮，根节点渲染成 <Code>button type="button"</Code>。</>, <>Makes the whole card a button; the root renders as <Code>button type="button"</Code>.</>) },
          { name: 'disabled', type: 'boolean', description: t('interactive 时禁用。', 'Disables an interactive card.') },
          { name: 'chevron', type: 'boolean', description: t('末尾的前进箭头。', 'Forward chevron at the end.') },
        ]} />
        <PropsTable title="CardHeader" rows={[
          { name: 'title', type: 'ReactNode', description: t('标题。', 'Title.') },
          { name: 'description', type: 'ReactNode', description: t('标题下的说明。', 'Description under the title.') },
          { name: 'titleAs', type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'", default: "'h3'", description: t('标题用什么元素，按页面的标题层级选。', 'Element for the title; pick it to fit the page’s heading levels.') },
          { name: 'actions', type: 'ReactNode', description: t('右侧操作区。', 'Actions on the right.') },
        ]} />
        <PropsTable title="CardFooter / CardLink" rows={[
          { name: 'CardFooter.align', type: "'start' | 'end' | 'between'", default: "'start'", description: t('操作按钮的对齐。', 'Alignment of the action buttons.') },
          { name: 'CardLink.href', type: 'string', description: t(<>不传时渲染成 <Code>button type="button"</Code>。其余属性透传。</>, <>Without it, renders as <Code>button type="button"</Code>. Other props are passed through.</>) },
        ]} />
        <PropsTable title="CardMedia" rows={[
          { name: 'alt', type: 'string', required: true, description: t(<>图片说明；纯装饰传 <Code>alt=""</Code>。</>, <>Image description; pass <Code>alt=""</Code> if purely decorative.</>) },
          { name: 'src', type: 'string', description: t('图片地址。不传时显示 children。', 'Image URL. Without it, children are shown.') },
          { name: 'ratio', type: 'number | string', default: '16 / 9', description: t('position="start" 且卡片够宽时不用比例，改为占满卡片高度。', 'With position="start" on a wide enough card, the ratio is ignored and the media fills the card’s height.') },
          { name: 'position', type: "'top' | 'start'", default: "'top'", description: t('主图在顶部，或在宽卡片里贴左（窄于约 520px 时回到顶部）。', 'Media at the top, or flush left on a wide card (back on top below about 520px).') },
          { name: 'fit / fallback / children', type: t('同 Image', 'Same as Image'), description: t(<>其余属性与 <Code>Image</Code> 相同（圆角由卡片决定，没有 radius）。</>, <>The rest match <Code>Image</Code> (corner radius comes from the card, so there’s no radius prop).</>) },
        ]} />
        <A11yNotes items={t([
          '静态卡片没有角色；可点击卡片是原生的链接或按钮，Tab 聚焦，链接用 Enter、按钮用 Enter 或空格触发。',
          '可点击卡片的名字是里面全部文字，所以内容要短；内容多时改用 CardLink，名字只取链接文字。',
          'CardLink 的焦点环画在整张卡片外沿；卡片里其它可聚焦元素保持各自的 Tab 顺序。',
          '禁用的按钮卡片用原生 disabled，会从 Tab 顺序里移除。',
          <>CardHeader 的标题默认是 <Code>h3</Code>，请用 <Code>titleAs</Code> 对齐所在页面的标题层级。</>,
          <>CardMedia 的 alt 落在图片上。整卡链接里的主图如果只是配图，传 <Code>alt=""</Code>，免得链接名字里多一段图片说明。</>,
        ], [
          'A static card has no role; an interactive card is a native link or button. Tab to focus; Enter activates a link, Enter or Space a button.',
          'An interactive card’s name is all the text inside it, so keep the content short; when there’s more, use CardLink so the name is only the link text.',
          'CardLink draws its focus ring around the whole card; other focusable elements in the card keep their own Tab order.',
          'A disabled button card uses native disabled and is removed from the Tab order.',
          <>CardHeader’s title is an <Code>h3</Code> by default; use <Code>titleAs</Code> to match the page’s heading levels.</>,
          <>CardMedia’s alt goes on the image. If the media in a link card is just illustrative, pass <Code>alt=""</Code> so the link name doesn’t pick up an image description.</>,
        ])} />
      </DocSection>
    </DocPage>
  );
}
