import { useCallback } from 'react';
import { useLang } from './router';
import type { Lang } from './router';
import type { OinkLocale } from 'oink-ui';

/*
 * 站点的两种语言。中英文写在同一个文件里、挨在一起，示例的逻辑只有一份：
 *
 *   const t = useT();
 *   <Button>{t('保存', 'Save')}</Button>
 *   <DocSection title={t('变体', 'Variants')} description={t('……', '…')}>
 *
 * 模块顶层的常量（示例数据、示例源码）写成 { zh, en } 两份，在组件里用 t(X.zh, X.en) 或 pick(lang, X) 取。
 * 约定：DocSection 的 title 一律写成 title={t('中文', 'English')}，两个参数都是单引号字面量——
 * 站内搜索按这个格式从源码里提取小节标题（见 SearchPalette）。
 */

export type { Lang };
export { useLang };

export type Translate = <T>(zh: T, en: T) => T;

/** t(中文, 英文)：按当前语言取一个 */
export function useT(): Translate {
  const lang = useLang();
  return useCallback(<T,>(zh: T, en: T): T => (lang === 'en' ? en : zh), [lang]) as Translate;
}

/** 从 { zh, en } 里按语言取 */
export const pick = <T,>(lang: Lang, v: { zh: T; en: T }): T => (lang === 'en' ? v.en : v.zh);

/** 库组件（OinkProvider locale、Calendar 等）用的语言代码 */
export const localeOf = (lang: Lang): OinkLocale => (lang === 'en' ? 'en-US' : 'zh-CN');
