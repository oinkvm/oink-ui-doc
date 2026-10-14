import { useState } from 'react';
import { Badge, Button, Code, Grid, Icon, Image, Inline, Stack, Text } from 'oink-ui';
import type { ImageRadius } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';
import { AccentArt, Scene, productUri, sceneUri } from './display-_art';

export const meta: PageMeta = { path: '/components/image', title: 'Image 图片', group: '数据展示', order: 21, subtitle: 'Image', en: { title: 'Image' } };

const RADII: ImageRadius[] = [0, 1, 2, 3, 4, 5, 6, 'full'];

const CODE_BASIC = {
  zh: `
<Grid columns={{ base: 1, sm: 3 }}>
  <Image src="/photos/dawn.jpg" alt="清晨粉色的山丘" ratio={16 / 9} />
  <Image src="/photos/meadow.jpg" alt="绿色草坡和太阳" ratio={4 / 3} />
  <Image src="/photos/dusk.jpg" alt="紫色黄昏" ratio={1} />
</Grid>`,
  en: `
<Grid columns={{ base: 1, sm: 3 }}>
  <Image src="/photos/dawn.jpg" alt="Pink hills at dawn" ratio={16 / 9} />
  <Image src="/photos/meadow.jpg" alt="Green meadow under the sun" ratio={4 / 3} />
  <Image src="/photos/dusk.jpg" alt="Purple dusk" ratio={1} />
</Grid>`,
};

const CODE_FIT = {
  zh: `
<Grid columns={2}>
  <Image src="/products/plant.png" alt="陶土花盆里的绿植" ratio={16 / 9} />
  <Image src="/products/plant.png" alt="陶土花盆里的绿植" ratio={16 / 9} fit="contain" />
</Grid>`,
  en: `
<Grid columns={2}>
  <Image src="/products/plant.png" alt="A plant in a terracotta pot" ratio={16 / 9} />
  <Image src="/products/plant.png" alt="A plant in a terracotta pot" ratio={16 / 9} fit="contain" />
</Grid>`,
};

const CODE_CHILDREN = {
  zh: `
<Grid columns={{ base: 1, sm: 2 }}>
  <Image alt="强调色的波浪与圆环" ratio={16 / 9}>
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">…</svg>
  </Image>
  <Image alt="黄昏的山丘" ratio={16 / 9} radius={5}>
    <Scene palette="dusk" />
  </Image>
</Grid>`,
  en: `
<Grid columns={{ base: 1, sm: 2 }}>
  <Image alt="Waves and rings in the accent color" ratio={16 / 9}>
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">…</svg>
  </Image>
  <Image alt="Hills at dusk" ratio={16 / 9} radius={5}>
    <Scene palette="dusk" />
  </Image>
</Grid>`,
};

const CODE_FALLBACK = {
  zh: `
<Image src={cover} alt="蓝色湖边的山丘" ratio={4 / 3} />
<Image src="broken.png" alt="封面图" ratio={4 / 3} />
<Image
  src="broken.png"
  alt="封面图"
  ratio={4 / 3}
  fallback={<Stack gap={1} align="center"><Icon name="image" /><Text variant="caption">图片走丢了</Text></Stack>}
/>`,
  en: `
<Image src={cover} alt="Hills by a blue lake" ratio={4 / 3} />
<Image src="broken.png" alt="Cover image" ratio={4 / 3} />
<Image
  src="broken.png"
  alt="Cover image"
  ratio={4 / 3}
  fallback={<Stack gap={1} align="center"><Icon name="image" /><Text variant="caption">Image went missing</Text></Stack>}
/>`,
};

const CODE_OVERLAY = {
  zh: `
<Image src="/products/mug.png" alt="珊瑚色马克杯" ratio={4 / 5} style={{ width: 200 }}>
  <Badge tone="accent" style={{ position: 'absolute', top: 12, left: 12 }}>新品</Badge>
</Image>`,
  en: `
<Image src="/products/mug.png" alt="Coral mug" ratio={4 / 5} style={{ width: 200 }}>
  <Badge tone="accent" style={{ position: 'absolute', top: 12, left: 12 }}>New</Badge>
</Image>`,
};

function ReloadDemo() {
  const t = useT();
  const [n, setN] = useState(0);
  return (
    <Stack gap={3} style={{ width: '100%' }}>
      <Grid columns={{ base: 1, sm: 3 }}>
        <Stack gap={2}>
          <Image key={n} src={sceneUri('lake')} alt={t('蓝色湖边的山丘', 'Hills by a blue lake')} ratio={4 / 3} />
          <Text variant="caption" tone="neutral">{t('加载完淡入', 'Fades in once loaded')}</Text>
        </Stack>
        <Stack gap={2}>
          <Image src="data:image/svg+xml,broken" alt={t('封面图', 'Cover image')} ratio={4 / 3} />
          <Text variant="caption" tone="neutral">{t('加载失败：默认回退', 'Failed to load: default fallback')}</Text>
        </Stack>
        <Stack gap={2}>
          <Image
            src="data:image/svg+xml,broken"
            alt={t('封面图', 'Cover image')}
            ratio={4 / 3}
            fallback={<Stack gap={1} align="center"><Icon name="image" /><Text variant="caption" tone="neutral">{t('图片走丢了', 'Image went missing')}</Text></Stack>}
          />
          <Text variant="caption" tone="neutral">{t('自定义 fallback', 'Custom fallback')}</Text>
        </Stack>
      </Grid>
      <div><Button size="sm" leading={<Icon name="replay" />} onClick={() => setN(n + 1)}>{t('重新加载第一张', 'Reload the first image')}</Button></div>
    </Stack>
  );
}

export default function ImagePage() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t('放图的框：固定比例、裁切方式、圆角一次给齐。加载中先扫一道骨架微光，加载完淡入，失败了回退成一块中性色。没有图片地址时，也可以直接把 svg 插画放进去当图。', 'A frame for images that sets aspect ratio, cropping and corner radius in one go. While loading it shows a skeleton shimmer, fades in once loaded, and falls back to a neutral block on failure. With no image URL, you can drop an svg illustration straight in as the image.')}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t('alt 必填。ratio 固定宽高比，图片按 cover 裁切铺满；宽度跟着容器走。', 'alt is required. ratio fixes the aspect ratio and the image is cropped to cover it; the width follows the container.')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Grid columns={{ base: 1, sm: 3 }} align="start">
            <Image src={sceneUri('dawn')} alt={t('清晨粉色的山丘', 'Pink hills at dawn')} ratio={16 / 9} />
            <Image src={sceneUri('meadow')} alt={t('绿色草坡和太阳', 'Green meadow under the sun')} ratio={4 / 3} />
            <Image src={sceneUri('dusk')} alt={t('紫色黄昏', 'Purple dusk')} ratio={1} />
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('裁切方式', 'Fit')} description={t('fit="cover"（默认）裁掉多出来的部分把框铺满；fit="contain" 把整张图放进框里，空出来的地方露出凹槽底色。竖图放进横框时差别最明显。', 'fit="cover" (default) crops the overflow to fill the frame; fit="contain" fits the whole image inside, with the well color showing in the leftover space. The difference is clearest with a portrait image in a landscape frame.')}>
        <Demo layout="block" code={t(CODE_FIT.zh, CODE_FIT.en)}>
          <Grid columns={2}>
            <Stack gap={2}><Image src={productUri('plant')} alt={t('陶土花盆里的绿植', 'A plant in a terracotta pot')} ratio={16 / 9} /><Text variant="caption" tone="neutral">cover</Text></Stack>
            <Stack gap={2}><Image src={productUri('plant')} alt={t('陶土花盆里的绿植', 'A plant in a terracotta pot')} ratio={16 / 9} fit="contain" /><Text variant="caption" tone="neutral">contain</Text></Stack>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('圆角', 'Corner radius')} description={t('radius 取圆角档位 0–6（对应 --ok-r-1..6，配超椭圆曲线）或 full（正圆）。默认 3，也就是 16px。', 'radius takes a corner radius step from 0–6 (mapping to --ok-r-1..6, with superellipse corners) or full (a circle). Defaults to 3, which is 16px.')}>
        <Demo
          code={`
{[0, 1, 2, 3, 4, 5, 6, 'full'].map((r) => (
  <Image key={r} src="/photos/meadow.jpg" alt="" ratio={1} radius={r} style={{ width: 88 }} />
))}`}
        >
          {RADII.map((r) => (
            <Stack key={r} gap={2} align="center">
              <Image src={sceneUri('meadow')} alt="" ratio={1} radius={r} style={{ width: 88 }} />
              <Text variant="caption" tone="neutral">{String(r)}</Text>
            </Stack>
          ))}
        </Demo>
      </DocSection>

      <DocSection title={t('不用图片地址', 'Without an image URL')} description={t('不传 src 时，children 就是“图”：内联 svg、插画、canvas 都行，照样按 ratio、radius 裁好，alt 用来给它起名字。下面这张插画的颜色取自 --ok-accent，换强调色或深浅色时跟着变。', 'Without src, children are the image: an inline svg, an illustration or a canvas, still clipped to ratio and radius, with alt giving it a name. The illustration below takes its colors from --ok-accent, so it follows changes to the accent color and light or dark mode.')}>
        <Demo layout="block" code={t(CODE_CHILDREN.zh, CODE_CHILDREN.en)}>
          <Grid columns={{ base: 1, sm: 2 }}>
            <Image alt={t('强调色的波浪与圆环', 'Waves and rings in the accent color')} ratio={16 / 9}><AccentArt /></Image>
            <Image alt={t('黄昏的山丘', 'Hills at dusk')} ratio={16 / 9} radius={5}><Scene palette="dusk" /></Image>
          </Grid>
        </Demo>
      </DocSection>

      <DocSection title={t('加载与回退', 'Loading and fallback')} description={t('加载中显示骨架微光（placeholder="none" 时只有底色），加载完用 --ok-dur-3 淡入。加载失败、或者 src 和 children 都没有时，显示 fallback：默认是凹槽色块加一个图片图标，可以换成任何内容。', 'While loading it shows a skeleton shimmer (just the background with placeholder="none"), then fades in over --ok-dur-3. When loading fails, or there’s neither src nor children, it shows fallback: a well-colored block with an image icon by default, replaceable with anything.')}>
        <Demo layout="block" code={t(CODE_FALLBACK.zh, CODE_FALLBACK.en)}>
          <ReloadDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('叠在图上的内容', 'Overlay content')} description={t('有 src 时，children 叠在图片上面，适合放角标、标签。图片本身没有悬停效果，可点击时交给外层的卡片或链接处理。', 'With src, children are layered over the image, which suits corner badges and labels. The image has no hover effect of its own; when it needs to be clickable, leave that to a surrounding card or link.')}>
        <Demo code={t(CODE_OVERLAY.zh, CODE_OVERLAY.en)}>
          <Image src={productUri('mug')} alt={t('珊瑚色马克杯', 'Coral mug')} ratio={4 / 5} style={{ width: 200 }}>
            <Badge tone="accent" style={{ position: 'absolute', top: 12, left: 12 }}>{t('新品', 'New')}</Badge>
          </Image>
          <Image src={productUri('lamp')} alt={t('紫色台灯', 'Purple desk lamp')} ratio={4 / 5} style={{ width: 200 }}>
            <Inline gap={1} style={{ position: 'absolute', insetInline: 12, bottom: 12 }}>
              <Badge>{t('库存 3', '3 in stock')}</Badge>
            </Inline>
          </Image>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('底色', 'Background'), t('--ok-well；不描边、不加阴影', '--ok-well; no border, no shadow')],
          [t('圆角', 'Corner radius'), t('默认 --ok-r-3（16），配 corner-shape', '--ok-r-3 (16) by default, with corner-shape')],
          [t('加载中', 'Loading'), t('骨架微光，与 Skeleton 相同；减弱动效时不扫光', 'skeleton shimmer, same as Skeleton; no shimmer under reduced motion')],
          [t('加载完', 'Loaded'), t('透明度 0 → 1 · --ok-dur-3', 'opacity 0 → 1 · --ok-dur-3')],
          [t('回退', 'Fallback'), t('凹槽色块 + 图片图标（--ok-text-3）', 'well-colored block + image icon (--ok-text-3)')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="Image" rows={[
          { name: 'alt', type: 'string', required: true, description: t(<>图片说明。纯装饰的图传 <Code>alt=""</Code>，整块对读屏隐藏。</>, <>Image description. For a purely decorative image pass <Code>alt=""</Code> and the whole block is hidden from screen readers.</>) },
          { name: 'src', type: 'string', description: t('图片地址。不传时显示 children；children 也没有时显示 fallback。', 'Image URL. Without it, children are shown; without children either, fallback is shown.') },
          { name: 'ratio', type: 'number | string', description: t(<>固定宽高比：<Code>16 / 9</Code> 或 <Code>'4 / 3'</Code>。不传时按图片本身的比例。</>, <>Fixed aspect ratio: <Code>16 / 9</Code> or <Code>'4 / 3'</Code>. Without it, the image’s own ratio is used.</>) },
          { name: 'fit', type: "'cover' | 'contain'", default: "'cover'", description: t('裁切铺满，或完整显示。', 'Crop to fill, or show the whole image.') },
          { name: 'radius', type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'full'", default: '3', description: t('圆角档位。', 'Corner radius step.') },
          { name: 'fallback', type: 'ReactNode', default: t('色块 + 图标', 'block + icon'), description: t('加载失败或没有内容时显示。', 'Shown when loading fails or there’s no content.') },
          { name: 'placeholder', type: "'skeleton' | 'none'", default: "'skeleton'", description: t('加载中的占位。', 'Placeholder while loading.') },
          { name: 'loading', type: "'lazy' | 'eager'", default: "'lazy'", description: t('原生懒加载。首屏的大图可改成 eager。', 'Native lazy loading. Switch large above-the-fold images to eager.') },
          { name: 'children', type: 'ReactNode', description: t('没有 src 时当作图；有 src 时叠在图上。', 'Acts as the image without src; layered over it with src.') },
          { name: t('…img 属性', '…img attributes'), type: 'ImgHTMLAttributes', description: t(<><Code>srcSet</Code>、<Code>sizes</Code>、<Code>onLoad</Code> 等透传到 <Code>img</Code>；<Code>className</Code>、<Code>style</Code>、<Code>ref</Code> 给外框。</>, <><Code>srcSet</Code>, <Code>sizes</Code>, <Code>onLoad</Code> and the like are passed to the <Code>img</Code>; <Code>className</Code>, <Code>style</Code> and <Code>ref</Code> go to the frame.</>) },
        ]} />
        <A11yNotes items={t([
          <>有图片时 alt 落在原生 <Code>img</Code> 上；回退或用 children 当图时，外框变成 <Code>role="img"</Code>，名字取自 alt。</>,
          <><Code>alt=""</Code> 表示纯装饰：图片不读，回退和插画对读屏隐藏。</>,
          '骨架微光在系统开了“减弱动态效果”时停止。',
          '外框上有 data-status（loading / loaded / error / empty / content），需要时可以据此写样式。',
        ], [
          <>With an image, alt goes on the native <Code>img</Code>; for a fallback or children used as the image, the frame becomes <Code>role="img"</Code> named by alt.</>,
          <><Code>alt=""</Code> means purely decorative: the image isn’t read, and fallbacks and illustrations are hidden from screen readers.</>,
          'The skeleton shimmer stops when the system’s reduce motion setting is on.',
          'The frame carries data-status (loading / loaded / error / empty / content) for styling when needed.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
