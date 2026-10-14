/* 文档示例用的小插画：全部是内联 SVG / data URI，不用外部图片。
   风景用柔和的固定色（data URI 里取不到 CSS 变量）；跟主题走的图直接写成内联 svg、颜色用 --ok-* 令牌。 */
import type { SVGProps } from 'react';

export type ScenePalette = 'dawn' | 'lake' | 'meadow' | 'dusk';

const SCENES: Record<ScenePalette, [sky1: string, sky2: string, sun: string, h1: string, h2: string, h3: string]> = {
  dawn: ['#FFEBDD', '#FFC8D6', '#FFF6D6', '#F8B0C2', '#EF8DA9', '#D9708F'],
  lake: ['#E2F0FF', '#BCD8FF', '#FFFFFF', '#A3C7F6', '#7DAAEB', '#5B8CD8'],
  meadow: ['#EFF8E2', '#CDEBC0', '#FFF5C8', '#A6DB9E', '#79C37E', '#55A866'],
  dusk: ['#EEE3FF', '#CDB7F6', '#FFE6F0', '#B79BEC', '#9A7ADB', '#7B5DC2'],
};

/** 一张小风景（320×200）：天空渐变、太阳、云、三层山丘 */
export function sceneMarkup(p: ScenePalette): string {
  const [s1, s2, sun, h1, h2, h3] = SCENES[p];
  return `<defs><linearGradient id="og-sky-${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient></defs>`
    + `<rect width="320" height="200" fill="url(#og-sky-${p})"/>`
    + `<circle cx="226" cy="74" r="28" fill="${sun}"/>`
    + `<g fill="#FFFFFF" opacity=".7"><ellipse cx="88" cy="58" rx="30" ry="9"/><ellipse cx="110" cy="50" rx="18" ry="9"/><ellipse cx="262" cy="40" rx="20" ry="6"/></g>`
    + `<path d="M0 128C52 100 98 102 150 124S252 150 320 112V200H0Z" fill="${h1}"/>`
    + `<path d="M0 156C60 132 122 136 182 154S280 170 320 148V200H0Z" fill="${h2}"/>`
    + `<path d="M0 184C80 166 168 168 238 180S300 190 320 184V200H0Z" fill="${h3}"/>`;
}

/** 风景的 data URI，拿来当 <img src> 用 */
export function sceneUri(p: ScenePalette): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="640" height="400" preserveAspectRatio="xMidYMid slice">${sceneMarkup(p)}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** 风景的内联版本 */
export function Scene({ palette, ...rest }: { palette: ScenePalette } & SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" {...rest} dangerouslySetInnerHTML={{ __html: sceneMarkup(palette) }} />;
}

export type ProductKind = 'mug' | 'plant' | 'lamp';

const PRODUCT_BG: Record<ProductKind, [bg: string, main: string, dark: string, accent: string]> = {
  mug: ['#FFF1E8', '#FF9F7A', '#E07E5A', '#FFFFFF'],
  plant: ['#EEF7EA', '#E9C7A8', '#C9A27E', '#5FB36E'],
  lamp: ['#F1EFFF', '#8E7BE0', '#6E5BC4', '#FFE59A'],
};

/** 竖版的商品小图（240×300），浅色底 + 一件扁平的物件 */
export function productMarkup(kind: ProductKind): string {
  const [bg, main, dark, accent] = PRODUCT_BG[kind];
  const floor = `<ellipse cx="120" cy="244" rx="70" ry="9" fill="${dark}" opacity=".14"/>`;
  let body = '';
  if (kind === 'mug') {
    body = `<path d="M150 150c26 0 26 44 0 44" fill="none" stroke="${dark}" stroke-width="12" stroke-linecap="round"/>`
      + `<rect x="70" y="124" width="88" height="118" rx="20" fill="${main}"/>`
      + `<rect x="70" y="124" width="88" height="22" rx="11" fill="${dark}" opacity=".25"/>`
      + `<path d="M98 112c-8-12 8-18 0-32M122 112c-8-12 8-18 0-32" fill="none" stroke="${dark}" stroke-width="6" stroke-linecap="round" opacity=".35"/>`
      + `<circle cx="114" cy="190" r="14" fill="${accent}" opacity=".9"/>`;
  } else if (kind === 'plant') {
    body = `<g fill="${accent}"><ellipse cx="96" cy="118" rx="18" ry="44" transform="rotate(-28 96 118)"/><ellipse cx="144" cy="112" rx="18" ry="48" transform="rotate(26 144 112)"/><ellipse cx="120" cy="96" rx="16" ry="54"/></g>`
      + `<path d="M120 150V70" stroke="#3E8F52" stroke-width="5" stroke-linecap="round"/>`
      + `<path d="M76 154h88l-12 88H88Z" fill="${main}"/>`
      + `<rect x="70" y="146" width="100" height="22" rx="8" fill="${dark}"/>`;
  } else {
    body = `<path d="M120 112V230" stroke="${dark}" stroke-width="8" stroke-linecap="round"/>`
      + `<rect x="78" y="226" width="84" height="16" rx="8" fill="${dark}"/>`
      + `<path d="M120 116c40 0 56-20 56-46H64c0 26 16 46 56 46Z" fill="${accent}" opacity=".55"/>`
      + `<path d="M64 74c0-30 24-48 56-48s56 18 56 48Z" fill="${main}"/>`;
  }
  return `<rect width="240" height="300" fill="${bg}"/>${floor}${body}`;
}

export function productUri(kind: ProductKind): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 300" width="480" height="600">${productMarkup(kind)}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** 跟着主题与强调色走的抽象插画：底色、圆环、波浪都用 --ok-* 令牌 */
export function AccentArt(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" {...props}>
      <rect width="320" height="200" style={{ fill: 'var(--ok-accent-tint, var(--ok-well))' }} />
      <circle cx="250" cy="52" r="70" style={{ fill: 'var(--ok-accent)' }} opacity=".22" />
      <circle cx="250" cy="52" r="36" style={{ fill: 'var(--ok-accent)' }} opacity=".45" />
      <path d="M0 150C60 118 110 118 160 140S260 170 320 132V200H0Z" style={{ fill: 'var(--ok-accent)' }} opacity=".35" />
      <path d="M0 176C70 154 130 158 190 172S280 186 320 172V200H0Z" style={{ fill: 'var(--ok-accent)' }} opacity=".6" />
      <path d="M44 70c0 20 12 34 30 34 10 0 16-6 16-14s-6-14-14-14c-7 0-12 5-13 12" fill="none" style={{ stroke: 'var(--ok-text)' }} strokeWidth="7" strokeLinecap="round" opacity=".85" />
    </svg>
  );
}
