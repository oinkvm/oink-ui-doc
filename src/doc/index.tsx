import { useId, useState, useSyncExternalStore } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { CodeBlock, Heading, Text, cx } from 'oink-ui';
import { useT } from '../i18n';
import './doc.css';

/** 文档页外壳：标题、副标题、导语 */
export function DocPage({ title, subtitle: rawSubtitle, lead, children }: { title: string; subtitle?: string; lead?: ReactNode; children: ReactNode }) {
  // 副标题已经是标题的一部分（'Icon 图标' 配 'Icon'）就不重复显示
  const subtitle = rawSubtitle && rawSubtitle !== title && !title.startsWith(rawSubtitle + ' ') ? rawSubtitle : undefined;
  return (
    <article className="doc">
      <header className="doc__head">
        <Heading level={1} className="doc__title">{title}{subtitle && <span className="doc__subtitle">{subtitle}</span>}</Heading>
        {lead && <Text as="p" variant="body-l" tone="subtle" className="doc__lead">{lead}</Text>}
      </header>
      {children}
    </article>
  );
}

/** 一节：二级标题 + 说明 */
export function DocSection({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  const id = useId();
  return (
    <section className="doc__section" aria-labelledby={id}>
      <Heading level={2} id={id} variant="h2" className="doc__h2">{title}</Heading>
      {description && <Text as="p" tone="subtle" className="doc__desc">{description}</Text>}
      {children}
    </section>
  );
}

export interface DemoProps {
  title?: string;
  description?: ReactNode;
  /** 示例源码，展示在预览下方，可折叠 */
  code?: string;
  /** 预览区布局：row 横排可换行（默认）、col 纵排、block 不加 flex */
  layout?: 'row' | 'col' | 'block';
  /** 预览区对齐方式 */
  align?: 'center' | 'start' | 'stretch';
  /** 预览区最小高度，放菜单之类需要空间的东西 */
  minHeight?: number;
  /** 去掉预览区内边距（放 AppShell 之类自带边界的东西） */
  flush?: boolean;
  style?: CSSProperties;
  children: ReactNode;
}

/** 示例：上面是真实渲染的组件，下面是可展开的源码 */
export function Demo({ title, description, code, layout = 'row', align = 'center', minHeight, flush, style, children }: DemoProps) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <figure className="demo">
      {(title || description) && (
        <figcaption className="demo__cap">
          {title && <Heading level={3} variant="h3" className="demo__title">{title}</Heading>}
          {description && <Text as="p" tone="subtle">{description}</Text>}
        </figcaption>
      )}
      <div className={cx('demo__stage', flush && 'demo__stage--flush')} data-layout={layout} data-align={align} style={{ minHeight, ...style }}>
        {children}
      </div>
      {code && (
        <div className="demo__code">
          <button type="button" className="ok-btn ok-btn--ghost ok-btn--sm ok-focusable" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
            {open ? t('收起代码', 'Hide code') : t('查看代码', 'Show code')}
          </button>
          <div id={id} hidden={!open}>{open && <CodeBlock code={code.trim()} language="tsx" />}</div>
        </div>
      )}
    </figure>
  );
}

export interface PropRow { name: string; type: string; default?: string; description: ReactNode; required?: boolean }

/** 属性表。窄屏自动变成逐条堆叠 */
export function PropsTable({ title, rows }: { title?: string; rows: PropRow[] }) {
  const t = useT();
  title ??= t('属性', 'Props');
  return (
    <div className="props">
      <Heading level={3} variant="h3" className="props__title">{title}</Heading>
      <div className="props__table ok-scroll" role="region" aria-label={title} tabIndex={0}>
        <table>
          <thead><tr><th scope="col">{t('属性', 'Prop')}</th><th scope="col">{t('类型', 'Type')}</th><th scope="col">{t('默认值', 'Default')}</th><th scope="col">{t('说明', 'Description')}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <th scope="row"><code>{r.name}</code>{r.required && <span className="props__req" title={t('必填', 'Required')}>*</span>}</th>
                <td><code>{r.type}</code></td>
                <td>{r.default ? <code>{r.default}</code> : <span aria-label={t('无', 'None')}>—</span>}</td>
                <td>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** 无障碍 / 键盘说明列表 */
export function A11yNotes({ items }: { items: ReactNode[] }) {
  const t = useT();
  return (
    <div className="a11y">
      <Heading level={3} variant="h3">{t('无障碍', 'Accessibility')}</Heading>
      <ul>{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
    </div>
  );
}

const noSubscribe = () => () => {};
/**
 * 只有浏览器才知道的值（特性检测之类）。预渲染和注水时用 fallback，注水后马上换成真实值，
 * 这样预渲染的 HTML 和注水的第一帧一致
 */
export function useClientValue<T>(get: () => T, fallback: T): T {
  return useSyncExternalStore(noSubscribe, get, () => fallback);
}
