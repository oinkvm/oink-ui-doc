import type { ComponentType } from 'react';
import * as F from './pv-form';
import * as D from './pv-display';
import * as L from './pv-layout';
import * as O from './pv-overlay';

/** 文档页 slug（/components/<slug>）→ 预览。新增的文档页没有对应预览时用 FallbackPreview */
export const PREVIEWS: Record<string, ComponentType> = {
  // 基础
  icon: L.IconPreview, text: L.TextPreview, motion: L.MotionPreview,
  // 布局
  box: L.BoxPreview, stack: L.StackPreview, grid: L.GridPreview, container: L.ContainerPreview, divider: L.DividerPreview,
  'scroll-area': L.ScrollAreaPreview, show: L.ShowPreview, page: L.PagePreview, toolbar: L.ToolbarPreview,
  'app-shell': L.AppShellPreview, nav: L.NavPreview, 'tab-bar': L.TabBarPreview, 'split-pane': L.SplitPanePreview,
  // 表单与操作
  button: F.ButtonPreview, input: F.InputPreview, textarea: F.TextareaPreview, 'number-input': F.NumberInputPreview,
  'pin-input': F.PinInputPreview, field: F.FieldPreview, checkbox: F.CheckboxPreview, radio: F.RadioPreview,
  switch: F.SwitchPreview, slider: F.SliderPreview, segmented: F.SegmentedPreview, chip: F.ChipPreview,
  'option-card': F.OptionCardPreview, 'color-swatches': F.ColorSwatchesPreview, 'color-picker': F.ColorPickerPreview,
  hotkey: F.HotkeyPreview,
  rating: F.RatingPreview, 'file-drop': F.FileDropPreview,
  // 数据展示
  surface: D.SurfacePreview, card: D.CardPreview, image: D.ImagePreview, group: D.GroupPreview, list: D.ListPreview,
  'description-list': D.DescriptionListPreview, table: D.TablePreview, avatar: D.AvatarPreview, badge: D.BadgePreview,
  tag: D.TagPreview, count: D.CountPreview, stat: D.StatPreview, timeline: D.TimelinePreview, tree: D.TreePreview,
  code: D.CodePreview, reaction: D.ReactionPreview,
  // 导航
  tabs: D.TabsPreview, accordion: D.AccordionPreview, breadcrumb: D.BreadcrumbPreview, pagination: D.PaginationPreview,
  steps: D.StepsPreview,
  // 反馈
  alert: D.AlertPreview, progress: D.ProgressPreview, skeleton: D.SkeletonPreview, spinner: D.SpinnerPreview,
  'empty-state': D.EmptyStatePreview, toast: D.ToastPreview,
  // 浮层
  dialog: O.DialogPreview, drawer: O.DrawerPreview, sheet: O.SheetPreview, panel: O.PanelPreview,
  'command-palette': O.CommandPalettePreview, popover: O.PopoverPreview, tooltip: O.TooltipPreview, menu: O.MenuPreview,
  'context-menu': O.ContextMenuPreview, select: O.SelectPreview, 'multi-select': O.MultiSelectPreview,
  combobox: O.ComboboxPreview, calendar: O.CalendarPreview, 'date-picker': O.DatePickerPreview,
};

/** 还没有专门预览的组件：英文名首字母放在一块缓慢起伏的色块上 */
export function FallbackPreview({ name }: { name: string }) {
  const initials = name.replace(/[^A-Za-z]/g, '').slice(0, 2) || name.slice(0, 1);
  return <span className="pv-fallback a">{initials}</span>;
}
