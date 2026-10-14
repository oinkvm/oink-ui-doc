import type { PropRow } from '../../doc';
import type { Translate } from '../../i18n';

/* 布局组件页共用的属性行（这个文件没有 meta，不会出现在侧栏里）。都是接收 t 的函数：asRow(t)、...spacingRows(t)、restRow(t) */

export const asRow = (t: Translate): PropRow => ({ name: 'as', type: 'ElementType', default: `'div'`, description: t('渲染成哪个元素。', 'Which element to render.') });

export const spacingRows = (t: Translate): PropRow[] => [
  { name: 'padding', type: 'Responsive<Space>', description: t('四边内边距（间距档位）。', 'Padding on all four sides (spacing step).') },
  { name: 'paddingX', type: 'Responsive<Space>', description: t('左右内边距，优先于 padding。', 'Horizontal padding; takes precedence over padding.') },
  { name: 'paddingY', type: 'Responsive<Space>', description: t('上下内边距，优先于 padding。', 'Vertical padding; takes precedence over padding.') },
];

export const restRow = (t: Translate): PropRow => ({ name: '…rest', type: 'HTMLAttributes', description: t('ref、className、style 和其余原生属性透传到根节点。', 'ref, className, style and other native attributes are forwarded to the root element.') });

/** Space 档位说明，放在页面里解释 gap / padding 填什么。用 t(SPACE_NOTE.zh, SPACE_NOTE.en) 取 */
export const SPACE_NOTE = {
  zh: 'Space 是间距档位：0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16，对应 --ok-s-*（档位 × 4px）。',
  en: 'Space is a spacing step: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16, mapping to --ok-s-* (step × 4px). ',
};
