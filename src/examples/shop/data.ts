/* 栖木文具：示例数据与价格计算。全部是假数据。
 * 中英文两份在模块加载时一起生成（SHOP.zh / SHOP.en）：商品编号、价格、库存、评分完全一样，只有文字不同；组件里用 useShop() 取当前语言那份。 */
import { useLang } from '../../i18n';
import type { Lang } from '../../i18n';

export type ArtKind =
  | 'notebook' | 'binder' | 'planner' | 'sticky' | 'tape' | 'pen' | 'pencil' | 'marker' | 'ink' | 'eraser'
  | 'mat' | 'cup' | 'tray' | 'cable' | 'clip' | 'ruler' | 'scissors' | 'lamp' | 'stand' | 'pouch';

export type ColorId = 'ink' | 'milk' | 'oat' | 'blue' | 'green' | 'pink' | 'amber' | 'red';

/** 商品颜色：都由令牌混出来，深浅主题下都柔和 */
export const COLOR_VALUE: Record<ColorId, string> = {
  ink: 'color-mix(in srgb, var(--ok-ink) 82%, var(--ok-paper))',
  milk: 'color-mix(in srgb, var(--ok-paper) 94%, var(--ok-warning))',
  oat: 'color-mix(in srgb, var(--ok-warning) 30%, var(--ok-paper))',
  blue: 'color-mix(in srgb, var(--ok-info) 50%, var(--ok-paper))',
  green: 'color-mix(in srgb, var(--ok-success) 52%, var(--ok-paper))',
  pink: 'color-mix(in srgb, var(--ok-pink) 62%, var(--ok-paper))',
  amber: 'color-mix(in srgb, var(--ok-warning) 78%, var(--ok-paper))',
  red: 'color-mix(in srgb, var(--ok-danger) 68%, var(--ok-ink))',
};
export const COLOR_IDS = Object.keys(COLOR_VALUE) as ColorId[];
const COLOR_LABEL: Record<Lang, Record<ColorId, string>> = {
  zh: { ink: '墨黑', milk: '奶白', oat: '燕麦', blue: '雾蓝', green: '苔绿', pink: '樱粉', amber: '琥珀', red: '砖红' },
  en: { ink: 'Ink black', milk: 'Milk white', oat: 'Oat', blue: 'Mist blue', green: 'Moss green', pink: 'Blossom pink', amber: 'Amber', red: 'Brick red' },
};

export type CategoryId = 'write' | 'paper' | 'desk' | 'light' | 'small';
export interface Category { id: CategoryId; label: string; blurb: string; art: ArtKind; color: ColorId }
const CATEGORY_BASE: Array<Pick<Category, 'id' | 'art' | 'color'>> = [
  { id: 'write', art: 'pen', color: 'blue' },
  { id: 'paper', art: 'notebook', color: 'oat' },
  { id: 'desk', art: 'cup', color: 'green' },
  { id: 'light', art: 'lamp', color: 'amber' },
  { id: 'small', art: 'clip', color: 'pink' },
];
const CATEGORY_TEXT: Record<Lang, Record<CategoryId, [label: string, blurb: string]>> = {
  zh: {
    write: ['书写工具', '中性笔、钢笔、铅笔与墨水'],
    paper: ['本册纸品', '笔记本、手帐、便签与胶带'],
    desk: ['桌面收纳', '桌垫、笔筒与文件架'],
    light: ['灯光支架', '台灯、阅读灯与电脑支架'],
    small: ['小物配件', '夹子、尺子、剪刀与笔袋'],
  },
  en: {
    write: ['Writing', 'Gel pens, fountain pens, pencils and ink'],
    paper: ['Paper', 'Notebooks, planners, sticky notes and tape'],
    desk: ['Desk organizers', 'Desk mats, pen cups and file trays'],
    light: ['Lamps & stands', 'Desk lamps, reading lights and laptop stands'],
    small: ['Accessories', 'Clips, rulers, scissors and pencil cases'],
  },
};

export type ProductTag = 'new' | 'hot' | 'sale';
export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  art: ArtKind;
  price: number;
  /** 划线价 */
  original?: number;
  stock: number;
  rating: number;
  reviews: number;
  colors: ColorId[];
  /** 规格（尺寸、笔尖粗细…） */
  optionLabel?: string;
  options?: string[];
  tag?: ProductTag;
  summary: string;
  specs: Array<[string, string]>;
}

/** 中文商品：数字（价格、库存、评分）以这份为准，英文版只替换文字 */
const PRODUCTS_ZH: Product[] = [
  { id: 'p01', name: '晨雾网格笔记本', category: 'paper', art: 'notebook', price: 38, stock: 42, rating: 4.8, reviews: 326, colors: ['blue', 'oat', 'ink'], optionLabel: '尺寸', options: ['A5', 'B5'], tag: 'hot',
    summary: '100g 道林纸，钢笔不洇不透；180° 平摊，写到页边也顺手。', specs: [['纸张', '100g 道林纸'], ['页数', '192 页'], ['内页', '5mm 网格'], ['装订', '锁线裸脊'], ['产地', '浙江宁波']] },
  { id: 'p02', name: '云朵活页本', category: 'paper', art: 'binder', price: 56, original: 68, stock: 18, rating: 4.6, reviews: 142, colors: ['milk', 'pink', 'green'], optionLabel: '尺寸', options: ['A5 · 20 孔', 'B5 · 26 孔'], tag: 'sale',
    summary: '磨砂封壳配静音开合环，附 60 张横线替芯与 5 张分隔页。', specs: [['封面', 'PP 磨砂'], ['孔数', '20 / 26 孔'], ['附赠', '60 张替芯'], ['容量', '约 120 张']] },
  { id: 'p03', name: '周计划手帐 2027', category: 'paper', art: 'planner', price: 88, stock: 7, rating: 4.9, reviews: 89, colors: ['ink', 'red'], tag: 'new',
    summary: '一周两页，左侧时间轴、右侧自由方格；全年 54 周加月历与年度总览。', specs: [['开本', 'A5'], ['纸张', '52g 巴川纸'], ['页数', '240 页'], ['封面', '布面烫金']] },
  { id: 'p04', name: '便签纸六色套装', category: 'paper', art: 'sticky', price: 16, stock: 120, rating: 4.5, reviews: 512, colors: ['amber', 'pink', 'blue'],
    summary: '低粘可反复贴，撕下不卷边；六种低饱和色，一色 50 张。', specs: [['尺寸', '76 × 76 mm'], ['数量', '6 本 × 50 张'], ['背胶', '水性可移胶']] },
  { id: 'p05', name: '和纸胶带三卷装', category: 'paper', art: 'tape', price: 24, stock: 64, rating: 4.7, reviews: 203, colors: ['green', 'pink', 'oat'],
    summary: '手撕整齐、可书写，贴在本子上不留胶；纯色、细格、点阵各一卷。', specs: [['宽度', '15 mm'], ['长度', '每卷 7 m'], ['材质', '和纸']] },
  { id: 'p06', name: '顺滑中性笔五支装', category: 'write', art: 'pen', price: 19.9, stock: 300, rating: 4.7, reviews: 1280, colors: ['ink', 'blue', 'red'], optionLabel: '笔尖', options: ['0.38 mm', '0.5 mm'], tag: 'hot',
    summary: '速干墨水，左手写字也不蹭；软胶握位，连写两小时不累。', specs: [['墨水', '颜料速干'], ['书写长度', '约 400 m / 支'], ['笔身', '磨砂 ABS'], ['可换芯', '是']] },
  { id: 'p07', name: '黄铜签字笔', category: 'write', art: 'pen', price: 128, stock: 5, rating: 4.9, reviews: 64, colors: ['amber', 'ink'],
    summary: '整根黄铜车削，重 38 克；用得越久，包浆越温润。', specs: [['材质', 'H62 黄铜'], ['重量', '38 g'], ['笔芯', 'G2 通用芯 0.5'], ['包装', '牛皮纸礼盒']] },
  { id: 'p08', name: '原木铅笔十二支', category: 'write', art: 'pencil', price: 22, stock: 80, rating: 4.4, reviews: 96, colors: ['oat', 'green'], optionLabel: '硬度', options: ['HB', '2B'],
    summary: '北美雪松笔杆，好削不断芯；六角杆不滚桌。', specs: [['笔杆', '雪松木'], ['数量', '12 支'], ['附赠', '金属笔帽 1 个']] },
  { id: 'p09', name: '双头荧光笔六色', category: 'write', art: 'marker', price: 29, stock: 0, rating: 4.6, reviews: 310, colors: ['amber', 'pink', 'green'],
    summary: '一头斜方、一头细圆；淡色系不刺眼，复印不留痕。', specs: [['笔头', '4 mm 斜方 / 1 mm 圆'], ['墨水', '水性颜料'], ['数量', '6 支']] },
  { id: 'p10', name: '钢笔墨水 30ml', category: 'write', art: 'ink', price: 45, stock: 23, rating: 4.8, reviews: 77, colors: ['blue', 'ink', 'red'],
    summary: '染料型墨水，流动顺、易清洗；厚底玻璃瓶，吸到最后一滴。', specs: [['容量', '30 ml'], ['类型', '染料型'], ['瓶身', '厚底玻璃']] },
  { id: 'p11', name: '可塑橡皮两块装', category: 'write', art: 'eraser', price: 9.9, stock: 150, rating: 4.3, reviews: 58, colors: ['milk', 'pink'],
    summary: '碎屑成条不乱飞，擦得干净不伤纸。', specs: [['材质', 'PVC-free'], ['尺寸', '43 × 17 × 11 mm'], ['数量', '2 块']] },
  { id: 'p12', name: '毛毡桌垫 80×40', category: 'desk', art: 'mat', price: 79, original: 99, stock: 36, rating: 4.7, reviews: 418, colors: ['oat', 'ink', 'green'], tag: 'sale',
    summary: '4mm 加厚羊毛毡，冬天不冰手；背面防滑，键盘鼠标都安静。', specs: [['尺寸', '800 × 400 × 4 mm'], ['材质', '羊毛混纺毛毡'], ['底面', '天然橡胶防滑']] },
  { id: 'p13', name: '榉木笔筒', category: 'desk', art: 'cup', price: 49, stock: 14, rating: 4.8, reviews: 152, colors: ['oat'],
    summary: '整块榉木掏挖，木蜡油涂装；底部软木垫，不刮桌面。', specs: [['材质', '欧洲榉木'], ['尺寸', 'Ø 80 × 100 mm'], ['涂装', '木蜡油']] },
  { id: 'p14', name: '三层桌面文件架', category: 'desk', art: 'tray', price: 109, stock: 9, rating: 4.5, reviews: 73, colors: ['milk', 'ink'],
    summary: '免工具插接，A4 横放竖放都行；每层承重 3 公斤。', specs: [['材质', '冷轧钢 + 粉末喷涂'], ['尺寸', '320 × 250 × 260 mm'], ['层数', '3 层']] },
  { id: 'p15', name: '磁吸理线器四枚', category: 'small', art: 'cable', price: 25, stock: 60, rating: 4.4, reviews: 189, colors: ['ink', 'milk', 'blue'],
    summary: '线一放就吸住，拔下来不掉桌底；背胶可水洗重复贴。', specs: [['数量', '4 枚'], ['适用线径', '≤ 6 mm'], ['背胶', '纳米可水洗']] },
  { id: 'p16', name: '莫兰迪长尾夹 24 枚', category: 'small', art: 'clip', price: 15, stock: 200, rating: 4.6, reviews: 240, colors: ['green', 'pink', 'blue'], optionLabel: '尺寸', options: ['19 mm', '25 mm', '32 mm'],
    summary: '加厚弹簧钢，夹 80 张纸不变形；铁盒收纳。', specs: [['数量', '24 枚'], ['材质', '弹簧钢'], ['包装', '马口铁盒']] },
  { id: 'p17', name: '不锈钢直尺 20cm', category: 'small', art: 'ruler', price: 18, stock: 33, rating: 4.5, reviews: 44, colors: ['milk'],
    summary: '激光蚀刻刻度，用十年也不磨花；背面软木防滑。', specs: [['长度', '200 mm'], ['厚度', '1 mm'], ['刻度', '公制 / 英制']] },
  { id: 'p18', name: '圆头安全剪刀', category: 'small', art: 'scissors', price: 32, stock: 27, rating: 4.7, reviews: 91, colors: ['pink', 'blue', 'ink'],
    summary: '氟涂层刀刃不粘胶带；带保护套，放笔袋里也安心。', specs: [['刃长', '65 mm'], ['刀刃', '不锈钢氟涂层'], ['附赠', '保护套']] },
  { id: 'p19', name: '护眼台灯 Pro', category: 'light', art: 'lamp', price: 329, original: 399, stock: 11, rating: 4.9, reviews: 512, colors: ['milk', 'ink'], tag: 'hot',
    summary: '全光谱 LED，显色指数 97；无级调光调色，记住你上次的亮度。', specs: [['显色指数', 'Ra 97'], ['色温', '2700 – 5700 K'], ['照度', '国 AA 级'], ['功率', '12 W']] },
  { id: 'p20', name: '铝合金电脑支架', category: 'light', art: 'stand', price: 159, stock: 3, rating: 4.6, reviews: 133, colors: ['milk', 'ink'],
    summary: '六档高度，抬高屏幕护颈椎；折叠后只有 5 毫米厚。', specs: [['材质', '6063 铝合金'], ['适配', '11 – 16 英寸'], ['承重', '8 kg']] },
  { id: 'p21', name: '夹式阅读灯', category: 'light', art: 'lamp', price: 89, stock: 25, rating: 4.3, reviews: 67, colors: ['amber', 'milk'], tag: 'new',
    summary: '软管任意弯，夹在床头或书架；充一次电用 20 小时。', specs: [['续航', '约 20 小时'], ['充电', 'USB-C'], ['亮度', '三档']] },
  { id: 'p22', name: '帆布笔袋', category: 'small', art: 'pouch', price: 35, stock: 48, rating: 4.7, reviews: 276, colors: ['oat', 'blue', 'green'],
    summary: '12 安水洗帆布，越用越软；能装 30 支笔加一把 20cm 直尺。', specs: [['材质', '12 安帆布'], ['尺寸', '210 × 80 × 50 mm'], ['拉链', 'YKK']] },
];

type ProductText = Pick<Product, 'name' | 'summary' | 'specs' | 'optionLabel' | 'options'>;
/** 英文商品文字：按编号覆盖到中文那份上 */
const PRODUCT_TEXT_EN: Record<string, ProductText> = {
  p01: { name: 'Morning Mist Grid Notebook', optionLabel: 'Size', options: ['A5', 'B5'],
    summary: '100 gsm wood-free paper that fountain pens won’t feather or bleed through. Lies flat at 180°, so writing near the edge is easy.',
    specs: [['Paper', '100 gsm wood-free'], ['Pages', '192'], ['Ruling', '5 mm grid'], ['Binding', 'Sewn, exposed spine'], ['Made in', 'Ningbo, China']] },
  p02: { name: 'Cloud Ring Binder', optionLabel: 'Size', options: ['A5 · 20 rings', 'B5 · 26 rings'],
    summary: 'Frosted cover with quiet-close rings. Comes with 60 lined refill sheets and 5 dividers.',
    specs: [['Cover', 'Frosted PP'], ['Rings', '20 / 26'], ['Included', '60 refill sheets'], ['Capacity', 'About 120 sheets']] },
  p03: { name: 'Weekly Planner 2027',
    summary: 'A week across two pages: a timeline on the left, an open grid on the right. 54 weeks, plus monthly calendars and a year at a glance.',
    specs: [['Size', 'A5'], ['Paper', '52 gsm Tomoe River'], ['Pages', '240'], ['Cover', 'Cloth with gold foil']] },
  p04: { name: 'Sticky Notes, 6 Colors',
    summary: 'Low-tack and repositionable; peels off without curling. Six muted colors, 50 sheets each.',
    specs: [['Size', '76 × 76 mm'], ['Count', '6 pads × 50 sheets'], ['Adhesive', 'Water-based, removable']] },
  p05: { name: 'Washi Tape, 3 Rolls',
    summary: 'Tears cleanly by hand, takes ink and leaves no residue. One solid, one fine grid, one dot grid.',
    specs: [['Width', '15 mm'], ['Length', '7 m per roll'], ['Material', 'Washi paper']] },
  p06: { name: 'Smooth Gel Pens, 5-Pack', optionLabel: 'Tip', options: ['0.38 mm', '0.5 mm'],
    summary: 'Quick-dry ink that won’t smudge, even for lefties. A soft grip that stays comfortable for hours.',
    specs: [['Ink', 'Quick-dry pigment'], ['Writing length', 'About 400 m per pen'], ['Barrel', 'Matte ABS'], ['Refillable', 'Yes']] },
  p07: { name: 'Brass Rollerball Pen',
    summary: 'Turned from a solid brass rod, 38 g. Develops a warmer patina the longer you use it.',
    specs: [['Material', 'H62 brass'], ['Weight', '38 g'], ['Refill', 'Standard G2, 0.5 mm'], ['Packaging', 'Kraft gift box']] },
  p08: { name: 'Natural Wood Pencils, 12-Pack', optionLabel: 'Grade', options: ['HB', '2B'],
    summary: 'North American cedar that sharpens easily without snapping the lead. Hexagonal, so they don’t roll off the desk.',
    specs: [['Barrel', 'Cedar'], ['Count', '12 pencils'], ['Included', '1 metal pencil cap']] },
  p09: { name: 'Dual-Tip Highlighters, 6 Colors',
    summary: 'A chisel tip on one end, a fine round tip on the other. Soft shades that are easy on the eyes and don’t show on photocopies.',
    specs: [['Tips', '4 mm chisel / 1 mm round'], ['Ink', 'Water-based pigment'], ['Count', '6 pens']] },
  p10: { name: 'Fountain Pen Ink, 30 ml',
    summary: 'Dye-based ink that flows smoothly and rinses out easily. The thick-bottomed glass bottle lets you fill to the last drop.',
    specs: [['Volume', '30 ml'], ['Type', 'Dye-based'], ['Bottle', 'Thick-bottomed glass']] },
  p11: { name: 'Soft Erasers, 2-Pack',
    summary: 'Crumbs roll into strands instead of scattering. Erases cleanly without roughing up the paper.',
    specs: [['Material', 'PVC-free'], ['Size', '43 × 17 × 11 mm'], ['Count', '2']] },
  p12: { name: 'Felt Desk Mat 80×40',
    summary: 'Thick 4 mm wool felt that never feels cold in winter. A non-slip back keeps the keyboard and mouse quiet.',
    specs: [['Size', '800 × 400 × 4 mm'], ['Material', 'Wool-blend felt'], ['Backing', 'Natural rubber, non-slip']] },
  p13: { name: 'Beech Pen Cup',
    summary: 'Carved from a single block of beech and finished with hardwax oil. A cork base keeps it from scratching the desk.',
    specs: [['Material', 'European beech'], ['Size', 'Ø 80 × 100 mm'], ['Finish', 'Hardwax oil']] },
  p14: { name: '3-Tier Desk Tray',
    summary: 'Slots together without tools and holds A4 sideways or upright. Each tier carries 3 kg.',
    specs: [['Material', 'Cold-rolled steel, powder-coated'], ['Size', '320 × 250 × 260 mm'], ['Tiers', '3']] },
  p15: { name: 'Magnetic Cable Clips, 4-Pack',
    summary: 'Drop a cable in and it stays put; unplug it and it won’t slip behind the desk. The adhesive is washable and reusable.',
    specs: [['Count', '4'], ['Cable diameter', '≤ 6 mm'], ['Adhesive', 'Washable nano gel']] },
  p16: { name: 'Muted Binder Clips, 24-Pack', optionLabel: 'Size', options: ['19 mm', '25 mm', '32 mm'],
    summary: 'Thick spring steel that holds 80 sheets without bending. Comes in a tin.',
    specs: [['Count', '24'], ['Material', 'Spring steel'], ['Packaging', 'Tin box']] },
  p17: { name: 'Steel Ruler, 20 cm',
    summary: 'Laser-etched markings that won’t wear off, even after ten years. A cork back keeps it from sliding.',
    specs: [['Length', '200 mm'], ['Thickness', '1 mm'], ['Scale', 'Metric / imperial']] },
  p18: { name: 'Round-Tip Safety Scissors',
    summary: 'Fluorine-coated blades that tape won’t stick to. Comes with a sheath, so it’s safe in a pencil case.',
    specs: [['Blade length', '65 mm'], ['Blades', 'Fluorine-coated stainless steel'], ['Included', 'Blade sheath']] },
  p19: { name: 'Eye-Care Desk Lamp Pro',
    summary: 'Full-spectrum LEDs with a CRI of 97. Stepless brightness and color temperature, and it remembers your last setting.',
    specs: [['CRI', 'Ra 97'], ['Color temperature', '2700 – 5700 K'], ['Illuminance', 'Class AA'], ['Power', '12 W']] },
  p20: { name: 'Aluminum Laptop Stand',
    summary: 'Six height settings lift your screen and spare your neck. Folds down to just 5 mm thick.',
    specs: [['Material', '6063 aluminum alloy'], ['Fits', '11 – 16 inch laptops'], ['Load', '8 kg']] },
  p21: { name: 'Clip-On Reading Light',
    summary: 'A flexible neck that bends any way; clip it to a headboard or a bookshelf. 20 hours on a single charge.',
    specs: [['Battery life', 'About 20 hours'], ['Charging', 'USB-C'], ['Brightness', '3 levels']] },
  p22: { name: 'Canvas Pencil Case',
    summary: 'Washed 12 oz canvas that softens with use. Fits 30 pens and a 20 cm ruler.',
    specs: [['Material', '12 oz canvas'], ['Size', '210 × 80 × 50 mm'], ['Zipper', 'YKK']] },
};

export const PRICE_MAX = 400;
export const FREE_SHIPPING = 99;

export type PackId = 'single' | 'gift' | 'engrave';
const PACK_EXTRA: Record<PackId, number> = { single: 0, gift: 12, engrave: 8 };

export interface CartLine {
  /** 商品 + 规格的组合键 */
  key: string;
  productId: string;
  color: ColorId;
  option?: string;
  pack: PackId;
  qty: number;
}
export const lineKey = (l: Omit<CartLine, 'key' | 'qty'>) => [l.productId, l.color, l.option ?? '', l.pack].join('|');
const productPrice = (id: string) => PRODUCTS_ZH.find((p) => p.id === id)?.price ?? 0;
export const unitPrice = (l: CartLine) => productPrice(l.productId) + PACK_EXTRA[l.pack];

export type ShippingId = 'standard' | 'express' | 'pickup';
const SHIPPING_FEE: Record<ShippingId, number> = { standard: 8, express: 18, pickup: 0 };

export interface Totals { count: number; subtotal: number; discount: number; shipping: number; total: number }
const round2 = (n: number) => Math.round(n * 100) / 100;

export type PaymentId = 'wechat' | 'alipay' | 'cod';

export interface Address { name: string; phone: string; region: string | null; detail: string }
export interface Order {
  id: string;
  lines: CartLine[];
  totals: Totals;
  address: Address;
  shipping: ShippingId;
  payment: PaymentId;
}

export interface Coupon { label: string; apply: (subtotal: number) => number }

/** 金额：中文 ¥19.9 → ¥19.90；英文 $1,234.50 */
const MONEY: Record<Lang, (n: number) => string> = {
  zh: (n) => '¥' + (Number.isInteger(n) ? String(n) : n.toFixed(2)),
  en: (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }),
};

/** 一种语言里的全部文字数据 */
interface Text {
  packs: Record<PackId, [label: string, description: string]>;
  shipping: Record<ShippingId, [label: string, description: string]>;
  coupons: Record<string, Coupon>;
  couponHint: string;
  payments: Record<PaymentId, [label: string, description: string]>;
  regions: Array<{ label: string; options: string[] }>;
  /** 收货电话的校验和提示 */
  phoneOk: (phone: string) => boolean;
  reviews: Array<{ name: string; rating: number; date: string; text: string }>;
  faq: Array<{ value: string; title: string; content: string }>;
  tag: Record<ProductTag, string>;
}

const TEXT: Record<Lang, Text> = {
  zh: {
    packs: { single: ['单件', '环保纸盒'], gift: ['礼盒装', '含贺卡 +¥12'], engrave: ['刻字', '八字以内 +¥8'] },
    shipping: {
      standard: ['标准配送', '3–5 天送达，满 ¥99 包邮'],
      express: ['次日达', '16:00 前下单，次日送达'],
      pickup: ['门店自提', '上海 · 安福路店，备好后通知'],
    },
    coupons: {
      OINK10: { label: '全场九折', apply: (s) => Math.round(s * 10) / 100 },
      WENJU20: { label: '满 ¥200 减 ¥20', apply: (s) => (s >= 200 ? 20 : 0) },
    },
    couponHint: '示例可用：OINK10、WENJU20',
    payments: {
      wechat: ['微信支付', '提交后在微信内确认'],
      alipay: ['支付宝', '提交后跳转支付宝确认'],
      cod: ['货到付款', '签收时付款，支持扫码'],
    },
    regions: [
      { label: '华东', options: ['上海市', '杭州市', '南京市', '苏州市', '宁波市'] },
      { label: '华北', options: ['北京市', '天津市', '青岛市'] },
      { label: '华南', options: ['广州市', '深圳市', '厦门市'] },
      { label: '华中', options: ['武汉市', '长沙市', '郑州市'] },
      { label: '西南', options: ['成都市', '重庆市', '昆明市'] },
    ],
    phoneOk: (phone) => /^1\d{10}$/.test(phone.replace(/[\s-]/g, '')),
    reviews: [
      { name: '林晚', rating: 5, date: '9 月 28 日', text: '质感比图片还好，包装也很用心。已经回购第二次了。' },
      { name: '周予安', rating: 5, date: '9 月 21 日', text: '用了两周，细节做得很扎实，颜色是那种耐看的低饱和。' },
      { name: '陈一苇', rating: 4, date: '9 月 12 日', text: '整体满意，物流第三天到。如果能多几个颜色就更好了。' },
      { name: '许知远方', rating: 4, date: '8 月 30 日', text: '送朋友的，礼盒装很体面，朋友说每天都在用。' },
    ],
    faq: [
      { value: 'ship', title: '多久能发货？', content: '工作日 16:00 前付款的订单当天发出，其余次日发出。标准配送 3–5 天送达，次日达仅限江浙沪。' },
      { value: 'return', title: '不喜欢可以退吗？', content: '签收 7 天内，未使用且包装完好可以无理由退货；刻字定制商品除质量问题外不支持退换。' },
      { value: 'gift', title: '礼盒装里有什么？', content: '硬壳礼盒、一张可手写的贺卡和一只棉布抽绳袋。价格标签不会出现在包裹里。' },
      { value: 'invoice', title: '可以开发票吗？', content: '可以。下单后在“我的 › 最近订单”里申请电子发票，一般 24 小时内发到邮箱。' },
    ],
    tag: { new: '新品', hot: '热卖', sale: '特惠' },
  },
  en: {
    packs: { single: ['Single', 'Recycled paper box'], gift: ['Gift box', 'With a card +$12'], engrave: ['Engraving', 'Up to 12 characters +$8'] },
    shipping: {
      standard: ['Standard', 'Arrives in 3–5 days, free over $99'],
      express: ['Next day', 'Order by 4 pm, arrives tomorrow'],
      pickup: ['Store pickup', 'Brooklyn · Atlantic Ave; we’ll let you know when it’s ready'],
    },
    coupons: {
      OINK10: { label: '10% off everything', apply: (s) => Math.round(s * 10) / 100 },
      DESK20: { label: '$20 off orders over $200', apply: (s) => (s >= 200 ? 20 : 0) },
    },
    couponHint: 'Try OINK10 or DESK20',
    payments: {
      wechat: ['Apple Pay', 'Confirm on your device after placing the order'],
      alipay: ['PayPal', 'You’ll be redirected to PayPal to confirm'],
      cod: ['Pay on delivery', 'Pay by card or cash when it arrives'],
    },
    regions: [
      { label: 'Northeast', options: ['New York', 'Boston', 'Philadelphia', 'Pittsburgh', 'Providence'] },
      { label: 'Midwest', options: ['Chicago', 'Minneapolis', 'Detroit'] },
      { label: 'South', options: ['Atlanta', 'Austin', 'Nashville'] },
      { label: 'West Coast', options: ['Los Angeles', 'San Francisco', 'Seattle'] },
      { label: 'Mountain', options: ['Denver', 'Salt Lake City', 'Phoenix'] },
    ],
    phoneOk: (phone) => /^\d{10}$/.test(phone.replace(/[\s\-().]/g, '').replace(/^\+?1(?=\d{10}$)/, '')),
    reviews: [
      { name: 'Lena Park', rating: 5, date: 'Sep 28', text: 'Even nicer in person than in the photos, and the packaging is lovely. Already on my second order.' },
      { name: 'Owen Hart', rating: 5, date: 'Sep 21', text: 'Two weeks in and the details hold up. The colors are the muted kind you don’t get tired of.' },
      { name: 'Clara Wells', rating: 4, date: 'Sep 12', text: 'Happy overall; it arrived on day three. A few more color options would be great.' },
      { name: 'Theo Marsh', rating: 4, date: 'Aug 30', text: 'Bought it as a gift. The gift box looks great, and my friend says they use it every day.' },
    ],
    faq: [
      { value: 'ship', title: 'When will my order ship?', content: 'Orders paid before 4 pm on a business day ship the same day; everything else ships the next day. Standard delivery takes 3–5 days, and next-day delivery is available in the New York area only.' },
      { value: 'return', title: 'Can I return something I don’t like?', content: 'Within 7 days of delivery, unused items in their original packaging can be returned for any reason. Engraved items can only be returned if they’re defective.' },
      { value: 'gift', title: 'What comes in the gift box?', content: 'A rigid gift box, a blank card you can write on and a cotton drawstring bag. Prices never appear anywhere in the package.' },
      { value: 'invoice', title: 'Can I get an invoice?', content: 'Yes. After ordering, request one under “Account › Recent orders” and we’ll email it to you, usually within 24 hours.' },
    ],
    tag: { new: 'New', hot: 'Best seller', sale: 'Sale' },
  },
};

export interface ShopData {
  money: (n: number) => string;
  COLORS: Record<ColorId, { label: string; color: string }>;
  CATEGORIES: Category[];
  categoryLabel: (id: CategoryId) => string;
  PRODUCTS: Product[];
  productById: (id: string) => Product | undefined;
  PACKS: Array<{ id: PackId; label: string; description: string; extra: number }>;
  packById: (id: PackId) => { id: PackId; label: string; description: string; extra: number };
  lineVariant: (l: CartLine) => string;
  SHIPPING: Array<{ id: ShippingId; label: string; description: string; fee: number }>;
  COUPONS: Record<string, Coupon>;
  couponHint: string;
  computeTotals: (lines: CartLine[], coupon: string | null, shipping: ShippingId) => Totals;
  PAYMENTS: Array<{ id: PaymentId; label: string; description: string }>;
  REGIONS: Array<{ label: string; options: Array<{ value: string; label: string }> }>;
  phoneOk: (phone: string) => boolean;
  REVIEWS: Text['reviews'];
  FAQ: Text['faq'];
  tagLabel: Record<ProductTag, string>;
  /** 库存的文字说法：不只靠颜色 */
  stockText: (stock: number) => { text: string; tone: 'subtle' | 'warning' | 'success' };
}

function build(lang: Lang): ShopData {
  const T = TEXT[lang];
  const COLORS = Object.fromEntries(COLOR_IDS.map((id) => [id, { label: COLOR_LABEL[lang][id], color: COLOR_VALUE[id] }])) as ShopData['COLORS'];
  const CATEGORIES = CATEGORY_BASE.map((c) => ({ ...c, label: CATEGORY_TEXT[lang][c.id][0], blurb: CATEGORY_TEXT[lang][c.id][1] }));
  const PRODUCTS = lang === 'zh' ? PRODUCTS_ZH : PRODUCTS_ZH.map((p) => ({ ...p, ...PRODUCT_TEXT_EN[p.id] }));
  const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
  const PACKS = (Object.keys(PACK_EXTRA) as PackId[]).map((id) => ({ id, label: T.packs[id][0], description: T.packs[id][1], extra: PACK_EXTRA[id] }));
  const packById = (id: PackId) => PACKS.find((p) => p.id === id) ?? PACKS[0];
  const SHIPPING = (Object.keys(SHIPPING_FEE) as ShippingId[]).map((id) => ({ id, label: T.shipping[id][0], description: T.shipping[id][1], fee: SHIPPING_FEE[id] }));
  const COUPONS = T.coupons;

  function computeTotals(lines: CartLine[], coupon: string | null, shipping: ShippingId): Totals {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = round2(lines.reduce((n, l) => n + unitPrice(l) * l.qty, 0));
    const discount = coupon && COUPONS[coupon] ? round2(COUPONS[coupon].apply(subtotal)) : 0;
    const base = SHIPPING_FEE[shipping] ?? 0;
    const fee = count === 0 ? 0 : shipping === 'standard' && subtotal - discount >= FREE_SHIPPING ? 0 : base;
    return { count, subtotal, discount, shipping: fee, total: round2(subtotal - discount + fee) };
  }

  return {
    money: MONEY[lang],
    COLORS,
    CATEGORIES,
    categoryLabel: (id) => CATEGORIES.find((c) => c.id === id)?.label ?? '',
    PRODUCTS,
    productById,
    PACKS,
    packById,
    lineVariant: (l) => [COLORS[l.color].label, l.option, l.pack === 'single' ? null : packById(l.pack).label].filter(Boolean).join(' · '),
    SHIPPING,
    COUPONS,
    couponHint: T.couponHint,
    computeTotals,
    PAYMENTS: (Object.keys(T.payments) as PaymentId[]).map((id) => ({ id, label: T.payments[id][0], description: T.payments[id][1] })),
    REGIONS: T.regions.map((g) => ({ label: g.label, options: g.options.map((c) => ({ value: c, label: c })) })),
    phoneOk: T.phoneOk,
    REVIEWS: T.reviews,
    FAQ: T.faq,
    tagLabel: T.tag,
    stockText: (stock) => {
      if (stock === 0) return { text: lang === 'en' ? 'Sold out' : '已售罄', tone: 'subtle' };
      if (stock <= 9) return { text: lang === 'en' ? `Only ${stock} left` : `仅剩 ${stock} 件`, tone: 'warning' };
      return { text: lang === 'en' ? 'In stock' : '有货', tone: 'success' };
    },
  };
}

/** 两种语言的店铺数据，模块加载时一起生成 */
export const SHOP: Record<Lang, ShopData> = { zh: build('zh'), en: build('en') };
/** 当前语言的店铺数据 */
export const useShop = () => SHOP[useLang()];

/** 英文复数：1 item / 2 items */
export const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;
