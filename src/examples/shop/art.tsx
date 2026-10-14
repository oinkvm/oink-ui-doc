import type { CSSProperties, ReactNode } from 'react';
import { Icon, cx } from 'oink-ui';
import { COLOR_VALUE } from './data';
import type { ArtKind, ColorId } from './data';
import './art.css';

/* 商品插画：120×120 的内联 SVG。类名 a / b / c / w 是主色、浅色、深色、纸白；s* 是同色的描线。颜色在 art.css 里由 --art 混出来。 */
const ART: Record<ArtKind, ReactNode> = {
  notebook: (<>
    <rect className="a" x="34" y="22" width="56" height="76" rx="7" />
    <rect className="c" x="34" y="22" width="11" height="76" rx="5" />
    <rect className="w" x="54" y="36" width="26" height="12" rx="3" />
    <rect className="b" x="82" y="22" width="4" height="76" />
  </>),
  binder: (<>
    <rect className="a" x="28" y="24" width="64" height="72" rx="7" />
    {[38, 51, 64, 77].map((y) => <circle key={y} className="w" cx="38" cy={y + 3} r="3.5" />)}
    <rect className="b" x="50" y="38" width="32" height="9" rx="3" />
    <rect className="b" x="50" y="53" width="22" height="5" rx="2.5" />
  </>),
  planner: (<>
    <rect className="w" x="28" y="30" width="64" height="66" rx="7" />
    <path className="a" d="M28 37a7 7 0 0 1 7-7h50a7 7 0 0 1 7 7v11H28z" />
    <rect className="c" x="43" y="23" width="5" height="14" rx="2.5" />
    <rect className="c" x="72" y="23" width="5" height="14" rx="2.5" />
    {[0, 1, 2].flatMap((r) => [0, 1, 2, 3].map((c) => (
      <rect key={`${r}${c}`} className={r === 1 && c === 2 ? 'a' : 'b'} x={37 + c * 12.5} y={56 + r * 11.5} width="8" height="7" rx="2" />
    )))}
  </>),
  sticky: (<>
    <rect className="b" x="26" y="40" width="46" height="46" rx="4" transform="rotate(-9 49 63)" />
    <rect className="a" x="40" y="32" width="46" height="46" rx="4" transform="rotate(5 63 55)" />
    <rect className="w" x="52" y="46" width="46" height="46" rx="4" transform="rotate(-3 75 69)" />
    <rect className="b" x="60" y="58" width="26" height="4" rx="2" transform="rotate(-3 75 69)" />
    <rect className="b" x="60" y="67" width="18" height="4" rx="2" transform="rotate(-3 75 69)" />
  </>),
  tape: (<>
    <circle className="a" cx="48" cy="56" r="27" />
    <circle className="w" cx="48" cy="56" r="11" />
    <circle className="b" cx="80" cy="74" r="20" />
    <circle className="w" cx="80" cy="74" r="8" />
    <path className="b" d="M80 94h22v-9l-5 3-5-3-5 3-7-4z" />
  </>),
  pen: (<g transform="rotate(-38 60 60)">
    <rect className="a" x="20" y="53" width="66" height="14" rx="7" />
    <rect className="c" x="80" y="53" width="10" height="14" />
    <path className="c" d="M90 53l16 7-16 7z" />
    <rect className="c" x="24" y="48" width="30" height="4" rx="2" />
    <rect className="b" x="20" y="74" width="62" height="10" rx="5" />
  </g>),
  pencil: (<g transform="rotate(-38 60 60)">
    <rect className="a" x="18" y="46" width="66" height="13" />
    <path className="w" d="M84 46l18 6.5-18 6.5z" />
    <path className="c" d="M96 50.3l6 2.2-6 2.2z" />
    <rect className="c" x="18" y="46" width="9" height="13" />
    <rect className="b" x="24" y="66" width="62" height="13" />
    <path className="w" d="M86 66l18 6.5-18 6.5z" />
    <path className="c" d="M98 70.3l6 2.2-6 2.2z" />
  </g>),
  marker: (<>
    <rect className="b" x="34" y="30" width="18" height="66" rx="9" />
    <rect className="a" x="34" y="30" width="18" height="24" rx="9" />
    <rect className="a" x="60" y="22" width="18" height="74" rx="9" />
    <rect className="c" x="60" y="22" width="18" height="26" rx="9" />
    <rect className="w" x="64" y="58" width="10" height="24" rx="3" />
    <rect className="b" x="84" y="84" width="14" height="12" rx="3" />
  </>),
  ink: (<>
    <rect className="c" x="47" y="26" width="26" height="20" rx="4" />
    <rect className="a" x="34" y="44" width="52" height="52" rx="10" />
    <rect className="w" x="42" y="60" width="36" height="20" rx="4" />
    <rect className="b" x="48" y="67" width="24" height="5" rx="2.5" />
  </>),
  eraser: (<g transform="rotate(-12 60 60)">
    <rect className="w" x="24" y="42" width="72" height="36" rx="8" />
    <rect className="a" x="24" y="42" width="44" height="36" rx="8" />
    <rect className="c" x="34" y="56" width="24" height="8" rx="4" />
  </g>),
  mat: (<>
    <rect className="a" x="12" y="34" width="96" height="56" rx="9" />
    <rect className="w" x="24" y="50" width="48" height="18" rx="4" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} className="b" x={28 + i * 8.4} y="55" width="5.5" height="8" rx="1.5" />)}
    <rect className="w" x="82" y="48" width="14" height="22" rx="7" />
    <rect className="c" x="24" y="78" width="26" height="4" rx="2" />
  </>),
  cup: (<>
    <rect className="c" x="46" y="22" width="7" height="40" rx="3" />
    <rect className="b" x="57" y="14" width="7" height="48" rx="3" />
    <path className="w" d="M68 28h8v34h-8z" />
    <path className="c" d="M68 28l4-9 4 9z" />
    <rect className="a" x="36" y="50" width="48" height="48" rx="8" />
    <rect className="b" x="36" y="58" width="48" height="5" />
  </>),
  tray: (<>
    <rect className="c" x="24" y="30" width="5" height="64" rx="2.5" />
    <rect className="c" x="91" y="30" width="5" height="64" rx="2.5" />
    <rect className="w" x="36" y="27" width="44" height="8" rx="2" />
    <rect className="a" x="24" y="34" width="72" height="13" rx="4" />
    <rect className="b" x="24" y="57" width="72" height="13" rx="4" />
    <rect className="w" x="40" y="74" width="40" height="8" rx="2" />
    <rect className="a" x="24" y="81" width="72" height="13" rx="4" />
  </>),
  cable: (<>
    {[[30, 28, 'a'], [66, 28, 'b'], [30, 64, 'b'], [66, 64, 'a']].map(([x, y, k]) => (
      <g key={`${x}${y}`}>
        <rect className={k as string} x={x} y={y} width="26" height="26" rx="9" />
        <rect className="w" x={(x as number) + 11} y={y} width="4" height="15" rx="2" />
      </g>
    ))}
    <path className="sc" d="M43 18v14M79 100V78" strokeWidth="3" />
  </>),
  clip: (<>
    <path className="sc" d="M46 52c-10-30 38-30 28 0" strokeWidth="4" />
    <path className="a" d="M32 50h56l-7 40H39z" />
    <path className="b" d="M32 50h56l-1.5 8h-53z" />
    <rect className="w" x="50" y="68" width="20" height="8" rx="4" />
  </>),
  ruler: (<g transform="rotate(-24 60 60)">
    <rect className="a" x="10" y="48" width="100" height="24" rx="4" />
    {Array.from({ length: 11 }, (_, i) => <rect key={i} className="c" x={18 + i * 8.4} y="48" width="2" height={i % 5 === 0 ? 12 : 7} />)}
    <circle className="w" cx="100" cy="63" r="3" />
  </g>),
  scissors: (<>
    <path className="sc" d="M50 74L76 22M70 74L44 22" strokeWidth="7" />
    <circle className="sa" cx="42" cy="86" r="11" strokeWidth="7" />
    <circle className="sa" cx="78" cy="86" r="11" strokeWidth="7" />
    <circle className="w" cx="60" cy="54" r="3.5" />
  </>),
  lamp: (<>
    <path className="glow" d="M62 40h40l10 44H50z" />
    <path className="sc" d="M48 92l-6-40 30-18" strokeWidth="5" />
    <path className="a" d="M64 24h36a8 8 0 0 1 8 8v8H56v-8a8 8 0 0 1 8-8z" />
    <rect className="c" x="26" y="90" width="44" height="9" rx="4.5" />
    <circle className="w" cx="42" cy="52" r="4" />
  </>),
  stand: (<>
    <path className="sa" d="M30 94h58L74 68" strokeWidth="7" />
    <path className="sc" d="M26 76l56-16" strokeWidth="7" />
    <path className="sb" d="M82 60l12-38" strokeWidth="7" />
    <circle className="w" cx="74" cy="68" r="3.5" />
  </>),
  pouch: (<>
    <rect className="a" x="16" y="40" width="88" height="44" rx="16" />
    <rect className="c" x="26" y="50" width="68" height="4" rx="2" />
    <circle className="w" cx="90" cy="52" r="5" />
    <rect className="b" x="28" y="64" width="16" height="10" rx="2.5" />
  </>),
};

/** 图集里的三个取景：整体、特写、俯拍 */
const VIEWS = [
  { viewBox: '0 0 120 120', transform: undefined },
  { viewBox: '26 22 68 68', transform: undefined },
  { viewBox: '0 0 120 120', transform: 'rotate(14 60 60) scale(.82) translate(13 13)' },
] as const;

export interface ProductArtProps {
  kind: ArtKind;
  color: ColorId;
  /** 取景：0 整体、1 特写、2 斜放 */
  view?: 0 | 1 | 2;
  /** 给了就作为图片朗读；不给则是装饰 */
  label?: string;
  className?: string;
}

/** 商品插画。放进 AspectRatio 里铺满 */
export function ProductArt({ kind, color, view = 0, label, className }: ProductArtProps) {
  const v = VIEWS[view];
  return (
    <span className={cx('shop-art', className)} style={{ '--art': COLOR_VALUE[color] } as CSSProperties} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox={v.viewBox} aria-hidden="true" focusable="false">
        {view === 2 && <circle className="spot" cx="60" cy="60" r="46" />}
        <g transform={v.transform}>{ART[kind]}</g>
      </svg>
    </span>
  );
}

/* 库里没有的图标：20×20 描线，照 Icon 的规矩内联 */
export const CartIcon = () => <Icon><path d="M4.5 7h11l-.9 9.5H5.4L4.5 7z" /><path d="M7.5 7V6a2.5 2.5 0 0 1 5 0v1" /></Icon>;
export const HeartIcon = () => <Icon><path d="M10 16.5s-6-3.7-6-8.1A3.4 3.4 0 0 1 10 6.2a3.4 3.4 0 0 1 6 2.2c0 4.4-6 8.1-6 8.1z" /></Icon>;
export const HomeIcon = () => <Icon><path d="M3.5 9L10 3.5 16.5 9v7.5h-4.5V12H8v4.5H3.5V9z" /></Icon>;
export const GridIcon = () => <Icon><path d="M3.5 3.5h5v5h-5zM11.5 3.5h5v5h-5zM3.5 11.5h5v5h-5zM11.5 11.5h5v5h-5z" /></Icon>;
export const UserIcon = () => <Icon><circle cx="10" cy="7" r="3.2" /><path d="M3.8 16.5c.8-2.6 3.2-4 6.2-4s5.4 1.4 6.2 4" /></Icon>;
export const BackIcon = () => <Icon name="chevron-right" style={{ transform: 'rotate(180deg)' }} />;
/** Reaction 用的 24×24 心形 */
export const HEART_24 = <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z" strokeLinejoin="round" /></svg>;

/** 店铺标志：一片叶子 */
export const BrandMark = () => (
  <svg className="shop-brand__mark" viewBox="0 0 28 28" aria-hidden="true">
    <rect className="bg" width="28" height="28" rx="9" />
    <path className="fg" d="M8 20c0-7 4-12 12-12 0 8-5 12-12 12zm0 0l7-7" />
  </svg>
);
