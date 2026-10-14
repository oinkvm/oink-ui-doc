/* 首页卡片用的插画：内联 SVG 写成 data URI，不依赖外部图片。深浅主题各一套配色（插画里的颜色是唯一写死颜色的地方） */

const uri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** 五种预设强调色的色值（与 tokens.css 的 [data-accent] 一致），插画只能用写死的颜色，所以在这里按名字取；自定义强调色本身就是色值 */
export const ACCENT_HEX: Record<string, string> = {
  pink: '#FF6B8E', orange: '#FF7A2F', amber: '#FFBE3B', blue: '#2E7BFF', violet: '#C77DFF',
};
export const ACCENT_NAME: Record<string, string> = { pink: '粉色', orange: '橙色', amber: '黄色', blue: '蓝色', violet: '紫色' };
export const ACCENT_NAME_EN: Record<string, string> = { pink: 'pink', orange: 'orange', amber: 'amber', blue: 'blue', violet: 'violet' };

/** 在 sRGB 里按比例混合两个十六进制颜色，t = 0 取 a，t = 1 取 b */
function mix(a: string, b: string, t: number): string {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/** 商品主图：一本点阵笔记本和一支笔，4:3。笔记本的布面跟着当前强调色 */
export function notebookArt(dark: boolean, accent = 'pink'): string {
  const k = ACCENT_HEX[accent] ?? (/^#[0-9a-f]{6}$/i.test(accent) ? accent : ACCENT_HEX.pink);
  const c = dark
    ? { a: mix(k, '#1E1D1B', 0.82), b: '#2A2927', blob: mix(k, '#1E1D1B', 0.7), cover: mix(k, '#1E1D1B', 0.25), spine: mix(k, '#1E1D1B', 0.45), label: '#E9E4D8', band: mix(k, '#1E1D1B', 0.6), pen: '#D9D6CF', penDark: '#8E8B84', dot: mix(k, '#FFFFFF', 0.35) }
    : { a: mix(k, '#FFFFFF', 0.86), b: '#F4F3F1', blob: mix(k, '#FFFFFF', 0.72), cover: mix(k, '#FFFFFF', 0.12), spine: mix(k, '#1B1C22', 0.22), label: '#FBF8F1', band: mix(k, '#1B1C22', 0.45), pen: '#3A3B42', penDark: '#1B1C22', dot: mix(k, '#FFFFFF', 0.55) };
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient></defs>
<rect width="400" height="300" fill="url(#g)"/>
<circle cx="318" cy="64" r="96" fill="${c.blob}" opacity=".55"/>
<circle cx="70" cy="262" r="64" fill="${c.blob}" opacity=".4"/>
<g transform="rotate(-8 200 156)">
<rect x="124" y="56" width="152" height="198" rx="16" fill="${c.cover}"/>
<rect x="124" y="56" width="28" height="198" rx="14" fill="${c.spine}"/>
<rect x="174" y="94" width="80" height="32" rx="7" fill="${c.label}"/>
<rect x="184" y="104" width="46" height="5" rx="2.5" fill="${c.spine}" opacity=".7"/>
<rect x="184" y="114" width="28" height="4" rx="2" fill="${c.spine}" opacity=".45"/>
${[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((col) => `<circle cx="${178 + col * 16}" cy="${160 + r * 18}" r="2.4" fill="${c.dot}"/>`).join('')).join('')}
<rect x="252" y="56" width="9" height="198" fill="${c.band}"/>
</g>
<g transform="rotate(32 310 196)">
<rect x="244" y="188" width="128" height="16" rx="8" fill="${c.pen}"/>
<rect x="244" y="188" width="34" height="16" rx="8" fill="${c.penDark}"/>
<path d="M370 189.5 L388 196 L370 202.5 Z" fill="${c.penDark}"/>
</g>
</svg>`);
}

/** 资料卡封面：几团柔和的色块，3:1 */
export function coverArt(dark: boolean): string {
  const c = dark
    ? { a: '#2D2A3A', b: '#3A2A30', p: '#6A4B7E', q: '#7E4B5C', r: '#4B6A7E' }
    : { a: '#EEE8FB', b: '#FCE8EE', p: '#D9C8F5', q: '#F8C9D6', r: '#C9E2F5' };
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient>
<filter id="f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
</defs>
<rect width="360" height="120" fill="url(#g)"/>
<g filter="url(#f)">
<circle cx="70" cy="30" r="56" fill="${c.p}"/>
<circle cx="230" cy="96" r="60" fill="${c.q}"/>
<circle cx="330" cy="20" r="44" fill="${c.r}"/>
</g>
</svg>`);
}
