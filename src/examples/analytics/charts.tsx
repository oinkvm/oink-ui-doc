import { useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { Card, CardHeader, Segmented, Skeleton, cx } from 'oink-ui';
import { localeOf, useLang, useT } from '../../i18n';

/* ------------------------------------------------------------------ 公共 */

/** 量容器宽度：图表按真实像素宽度重新排布，而不是整体缩放（文字不会跟着变小） */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(Math.floor(el.getBoundingClientRect().width));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** 把最大值抬到一个好读的刻度上 */
function niceMax(v: number, ticks: number): number {
  if (v <= 0) return 1;
  const raw = v / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? 10 * mag;
  return step * ticks;
}

export type ChartView = 'chart' | 'table';

export interface ChartCardProps {
  title: string;
  /** 一句话摘要：图表想说的结论。同时是图形的无障碍描述 */
  summary: ReactNode;
  /** 图例等，放在标题下面 */
  legend?: ReactNode;
  loading?: boolean;
  /** 骨架的高度 */
  skeletonHeight?: number;
  /** 图形视图；拿到摘要的 id 用来做 aria-describedby */
  chart: (summaryId: string) => ReactNode;
  /** 表格视图：和图形同一份数据 */
  table: ReactNode;
  className?: string;
}

/** 图表卡片：标题 + 摘要 + “图表 / 表格”切换。两个视图是同一份数据 */
export function ChartCard({ title, summary, legend, loading, skeletonHeight = 240, chart, table, className }: ChartCardProps) {
  const t = useT();
  const [view, setView] = useState<ChartView>('chart');
  const id = useId();
  const summaryId = `${id}-summary`;
  return (
    <Card as="section" aria-labelledby={`${id}-title`} aria-busy={loading || undefined} className={cx('an-chart-card', className)}>
      <CardHeader
        titleAs="h2"
        title={<span id={`${id}-title`}>{title}</span>}
        description={loading ? <Skeleton width="70%" /> : <span id={summaryId}>{summary}</span>}
        actions={
          <Segmented<ChartView>
            size="sm"
            aria-label={t(`${title}的查看方式`, `${title} view`)}
            value={view}
            onChange={setView}
            options={[{ value: 'chart', label: t('图表', 'Chart') }, { value: 'table', label: t('表格', 'Table') }]}
          />
        }
      />
      {loading ? (
        <Skeleton variant="rect" width="100%" height={skeletonHeight} />
      ) : view === 'chart' ? (
        <>
          {legend}
          {chart(summaryId)}
        </>
      ) : table}
    </Card>
  );
}

/** 图例项：除了颜色还用线型 / 形状区分 */
export function LegendItem({ kind, children }: { kind: 'line' | 'dash' | 'bar' | 'tick'; children: ReactNode }) {
  return (
    <span className="an-legend__item">
      <svg className="an-legend__mark" viewBox="0 0 20 12" aria-hidden="true" data-kind={kind}>
        {kind === 'line' && <path d="M1 6h18" className="an-series-line" />}
        {kind === 'dash' && <path d="M1 6h18" className="an-compare-line" />}
        {kind === 'bar' && <rect x="1" y="2" width="18" height="8" rx="4" className="an-series-bar" />}
        {kind === 'tick' && <path d="M10 0v12" className="an-compare-tick" />}
      </svg>
      {children}
    </span>
  );
}
export function Legend({ children }: { children: ReactNode }) {
  return <div className="an-legend">{children}</div>;
}

interface TipProps { x: number; width: number; top?: number; children: ReactNode }
/** 数据提示：跟着当前数据点走，靠近右边缘时翻到左侧 */
function Tip({ x, width, top = 8, children }: TipProps) {
  const flip = x > width / 2;
  const style: CSSProperties = flip ? { right: Math.max(0, width - x + 12), top } : { left: Math.min(width, x + 12), top };
  return <div className="an-tip" style={style} aria-hidden="true">{children}</div>;
}

/** 方向键在数据点之间移动。返回新的下标；不是导航键返回 null */
function stepIndex(e: KeyboardEvent, cur: number | null, count: number, prevKey: string, nextKey: string): number | null {
  if (count === 0) return null;
  let next: number;
  if (e.key === nextKey) next = cur === null ? 0 : Math.min(count - 1, cur + 1);
  else if (e.key === prevKey) next = cur === null ? count - 1 : Math.max(0, cur - 1);
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = count - 1;
  else if (e.key === 'PageDown') next = Math.min(count - 1, (cur ?? -1) + 7);
  else if (e.key === 'PageUp') next = Math.max(0, (cur ?? count) - 7);
  else return null;
  e.preventDefault();
  return next;
}

/* ------------------------------------------------------------------ 折线 / 面积图 */

export interface LinePoint { label: string; full: string; value: number; compare: number | null; compareFull: string | null }

export interface LineChartProps {
  points: LinePoint[];
  /** 图形的名字（读屏） */
  label: string;
  describedBy?: string;
  seriesName: string;
  compareName?: string;
  formatValue: (v: number) => string;
  formatAxis: (v: number) => string;
  height?: number;
}

const TICKS = 4;

export function LineChart({ points, label, describedBy, seriesName, compareName, formatValue, formatAxis, height = 260 }: LineChartProps) {
  const t = useT();
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const [byKey, setByKey] = useState(false);
  const n = points.length;
  useEffect(() => { setActive(null); }, [points]);

  const compact = width > 0 && width < 440;
  const h = compact ? Math.min(height, 220) : height;
  const m = { top: 12, right: 8, bottom: 26, left: compact ? 44 : 56 };
  const iw = Math.max(1, width - m.left - m.right);
  const ih = h - m.top - m.bottom;
  const hasCompare = points.some((p) => p.compare !== null);
  const max = niceMax(Math.max(1, ...points.map((p) => Math.max(p.value, p.compare ?? 0))), TICKS);
  const x = (i: number) => m.left + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v: number) => m.top + ih - (v / max) * ih;
  const line = (get: (p: LinePoint) => number | null) => points.map((p, i) => { const v = get(p); return v === null ? '' : `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`; }).join('');
  const main = line((p) => p.value);
  const area = n > 1 ? `${main}L${x(n - 1).toFixed(1)} ${y(0)}L${x(0).toFixed(1)} ${y(0)}Z` : '';

  // x 轴标签：按宽度决定放几个，均匀抽取
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 64))));
  const xTicks = points.map((_, i) => i).filter((i) => (n - 1 - i) % every === 0);

  const indexAt = (clientX: number, el: Element) => {
    const r = el.getBoundingClientRect();
    const rel = (clientX - r.left - m.left) / iw;
    return Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1))));
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => { if (n) { setByKey(false); setActive(indexAt(e.clientX, e.currentTarget)); } };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && active !== null) { e.stopPropagation(); setActive(null); return; }
    const next = stepIndex(e, active, n, 'ArrowLeft', 'ArrowRight');
    if (next !== null) { setByKey(true); setActive(next); }
  };

  const p = active !== null ? points[active] : null;
  const delta = p && p.compare ? ((p.value - p.compare) / p.compare) * 100 : null;
  const sep = t('，', ', ');
  const spoken = p ? `${p.full}${sep}${seriesName} ${formatValue(p.value)}${p.compare !== null && compareName ? `${sep}${compareName} ${formatValue(p.compare)}` : ''}` : '';

  return (
    <div
      ref={ref}
      className="an-chart ok-focusable"
      style={{ height: h }}
      role="group"
      aria-roledescription={t('交互图表', 'interactive chart')}
      aria-label={t(`${label}。按左右方向键逐点查看，Home / End 到两端`, `${label}. Use the left and right arrow keys to step through points, Home / End to jump to either end.`)}
      aria-describedby={describedBy}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={(e) => { if (e.target === e.currentTarget && active === null && n && e.currentTarget.matches(':focus-visible')) { setByKey(true); setActive(n - 1); } }}
      onBlur={() => setActive(null)}
    >
      {width > 0 && (
        <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} aria-hidden="true" onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => { if (!byKey) setActive(null); }}>
          {Array.from({ length: TICKS + 1 }, (_, t) => {
            const v = (max / TICKS) * t;
            return (
              <g key={t}>
                <path d={`M${m.left} ${y(v)}H${width - m.right}`} className={t === 0 ? 'an-axis' : 'an-grid'} />
                <text x={m.left - 8} y={y(v)} dy="0.32em" textAnchor="end" className="an-tick">{formatAxis(v)}</text>
              </g>
            );
          })}
          {xTicks.map((i) => (
            <text key={i} x={x(i)} y={h - 6} textAnchor={i === n - 1 ? 'end' : i === 0 ? 'start' : 'middle'} className="an-tick">{points[i].label}</text>
          ))}
          {area && <path d={area} className="an-series-area" />}
          {hasCompare && <path d={line((q) => q.compare)} className="an-compare-line" />}
          <path d={main} className="an-series-line" />
          {n === 1 && <circle cx={x(0)} cy={y(points[0].value)} r="4" className="an-series-dot" />}
          {p && active !== null && (
            <g>
              <path d={`M${x(active)} ${m.top}V${m.top + ih}`} className="an-cursor" />
              {p.compare !== null && <circle cx={x(active)} cy={y(p.compare)} r="4" className="an-compare-dot" />}
              <circle cx={x(active)} cy={y(p.value)} r="5" className="an-series-dot" />
            </g>
          )}
        </svg>
      )}
      {p && active !== null && (
        <Tip x={x(active)} width={width}>
          <div className="an-tip__title">{p.full}</div>
          <div className="an-tip__row"><LegendItem kind="line">{seriesName}</LegendItem><b>{formatValue(p.value)}</b></div>
          {p.compare !== null && compareName && (
            <div className="an-tip__row"><LegendItem kind="dash">{compareName}</LegendItem><b>{formatValue(p.compare)}</b></div>
          )}
          {delta !== null && <div className="an-tip__delta" data-dir={delta >= 0 ? 'up' : 'down'}>{delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%</div>}
        </Tip>
      )}
      <span className="ok-sr" aria-live="polite">{byKey ? spoken : ''}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ 横向条形图 */

export interface BarRow { key: string; name: string; value: number; share: number; compare: number | null; change: number | null }

export interface BarChartProps {
  rows: BarRow[];
  label: string;
  describedBy?: string;
  seriesName: string;
  compareName?: string;
  formatValue: (v: number) => string;
}

const ROW_H = 40;

export function BarChart({ rows, label, describedBy, seriesName, compareName, formatValue }: BarChartProps) {
  const t = useT();
  const [ref, width] = useWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const [byKey, setByKey] = useState(false);
  useEffect(() => { setActive(null); }, [rows]);

  const n = rows.length;
  const h = n * ROW_H;
  const labelW = 76;
  const valueW = 52;
  const bw = Math.max(1, width - labelW - valueW);
  const max = Math.max(1, ...rows.map((r) => Math.max(r.value, r.compare ?? 0))) * 1.04;
  const w = (v: number) => (v / max) * bw;

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setByKey(false);
    setActive(Math.max(0, Math.min(n - 1, Math.floor((e.clientY - r.top) / ROW_H))));
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && active !== null) { e.stopPropagation(); setActive(null); return; }
    const next = stepIndex(e, active, n, 'ArrowUp', 'ArrowDown');
    if (next !== null) { setByKey(true); setActive(next); }
  };

  const r = active !== null ? rows[active] : null;
  const sep = t('，', ', ');
  const spoken = r ? `${r.name}${sep}${seriesName} ${formatValue(r.value)}${sep}${t(`占 ${r.share.toFixed(1)}%`, `${r.share.toFixed(1)}% share`)}${r.compare !== null && compareName ? `${sep}${compareName} ${formatValue(r.compare)}` : ''}` : '';

  return (
    <div
      ref={ref}
      className="an-chart ok-focusable"
      style={{ height: h }}
      role="group"
      aria-roledescription={t('交互图表', 'interactive chart')}
      aria-label={t(`${label}。按上下方向键逐项查看`, `${label}. Use the up and down arrow keys to step through rows.`)}
      aria-describedby={describedBy}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={(e) => { if (active === null && n && e.currentTarget.matches(':focus-visible')) { setByKey(true); setActive(0); } }}
      onBlur={() => setActive(null)}
    >
      {width > 0 && (
        <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} aria-hidden="true" onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => { if (!byKey) setActive(null); }}>
          {rows.map((row, i) => {
            const cy = i * ROW_H + ROW_H / 2;
            return (
              <g key={row.key}>
                {active === i && <rect x="0" y={i * ROW_H + 2} width={width} height={ROW_H - 4} rx="10" className="an-row-hl" />}
                <text x="8" y={cy} dy="0.35em" className="an-bar-label">{row.name}</text>
                <rect x={labelW} y={cy - 6} width={bw} height="12" rx="6" className="an-bar-track" />
                <rect x={labelW} y={cy - 6} width={Math.max(4, w(row.value))} height="12" rx="6" className="an-series-bar" />
                {row.compare !== null && <path d={`M${(labelW + w(row.compare)).toFixed(1)} ${cy - 11}v22`} className="an-compare-tick" />}
                <text x={width - 8} y={cy} dy="0.35em" textAnchor="end" className="an-bar-value">{row.share.toFixed(1)}%</text>
              </g>
            );
          })}
        </svg>
      )}
      {r && active !== null && (
        <Tip x={labelW + Math.min(w(r.value), bw * 0.6)} width={width} top={Math.max(0, Math.min(h - 96, active * ROW_H + ROW_H - 2))}>
          <div className="an-tip__title">{r.name}</div>
          <div className="an-tip__row"><LegendItem kind="bar">{seriesName}</LegendItem><b>{formatValue(r.value)}</b></div>
          {r.compare !== null && compareName && <div className="an-tip__row"><LegendItem kind="tick">{compareName}</LegendItem><b>{formatValue(r.compare)}</b></div>}
          {r.change !== null && <div className="an-tip__delta" data-dir={r.change >= 0 ? 'up' : 'down'}>{r.change >= 0 ? '↑' : '↓'} {Math.abs(r.change).toFixed(1)}%</div>}
        </Tip>
      )}
      <span className="ok-sr" aria-live="polite">{byKey ? spoken : ''}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ 留存热力表 */

export interface HeatRow { key: string; label: string; full: string; size: number; rates: Array<number | null> }

/**
 * 留存热力表：本身就是一张真正的 <table>，每格都写着数值，底色深浅只是第二重提示。
 * 所以它不需要“以表格查看”的切换——读屏拿到的就是完整数据。
 */
export function HeatTable({ rows, weeks, caption }: { rows: HeatRow[]; weeks: number; caption: string }) {
  const t = useT();
  const locale = localeOf(useLang());
  return (
    <table className="an-heat">
      <caption className="ok-sr">{caption}</caption>
      <thead>
        <tr>
          <th scope="col">{t('注册周', 'Cohort')}</th>
          <th scope="col" className="an-heat__size">{t('人数', 'Users')}</th>
          {Array.from({ length: weeks }, (_, i) => <th key={i} scope="col"><span aria-hidden="true">{i === 0 ? t('当周', 'Wk 0') : `+${i}`}</span><span className="ok-sr">{i === 0 ? t('当周', 'Signup week') : t(`第 ${i} 周后`, i === 1 ? '1 week later' : `${i} weeks later`)}</span></th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <th scope="row" title={row.full}>{row.label}<span className="ok-sr">{t('当周注册', ' cohort')}</span></th>
            <td className="an-heat__size">{row.size.toLocaleString(locale)}</td>
            {row.rates.map((v, i) => (
              v === null
                ? <td key={i} className="an-heat__cell" data-empty=""><span className="ok-sr">{t('尚无数据', 'No data yet')}</span></td>
                : <td key={i} className="an-heat__cell" style={{ '--an-heat': ((v - 25) / 75).toFixed(3) } as CSSProperties}>{v.toFixed(0)}<span className="an-heat__pct">%</span></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
