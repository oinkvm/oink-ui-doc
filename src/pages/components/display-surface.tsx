import { Code, Group, Row, Stack, Surface, Switch, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';
import { Specs } from './display-_kit';

export const meta: PageMeta = { path: '/components/surface', title: 'Surface 面板', group: '数据展示', order: 10, subtitle: 'Surface', en: { title: 'Surface' } };

const CODE_BASIC = {
  zh: `
<Surface>
  <Group>
    <Row label="消息通知" description="有人提到你时提醒"><Switch defaultChecked aria-label="消息通知" /></Row>
    <Row label="每周摘要"><Switch aria-label="每周摘要" /></Row>
  </Group>
  <Group>
    <Row label="语言" href="/components/surface">简体中文</Row>
  </Group>
</Surface>`,
  en: `
<Surface>
  <Group>
    <Row label="Notifications" description="Alert me when someone mentions me"><Switch defaultChecked aria-label="Notifications" /></Row>
    <Row label="Weekly digest"><Switch aria-label="Weekly digest" /></Row>
  </Group>
  <Group>
    <Row label="Language" href="/components/surface">English</Row>
  </Group>
</Surface>`,
};

const CODE_SIZES = {
  zh: `
<Surface size="sm"><Group><Row label="sm：圆角 32，内边距 12" /></Group></Surface>
<Surface size="md"><Group><Row label="md：圆角 44，内边距 16" /></Group></Surface>
<Surface size="lg"><Group><Row label="lg：圆角 44，内边距 20" /></Group></Surface>`,
  en: `
<Surface size="sm"><Group><Row label="sm: radius 32, padding 12" /></Group></Surface>
<Surface size="md"><Group><Row label="md: radius 44, padding 16" /></Group></Surface>
<Surface size="lg"><Group><Row label="lg: radius 44, padding 20" /></Group></Surface>`,
};

const CODE_SECTION = {
  zh: `
<Surface as="section" aria-labelledby="surface-demo-title">
  <Stack gap={1} paddingX={2} paddingY={1}>
    <Text as="h3" variant="h3" id="surface-demo-title">隐私</Text>
    <Text tone="neutral">这些设置只影响你自己的账号。</Text>
  </Stack>
  <Group>
    <Row label="公开个人主页"><Switch aria-label="公开个人主页" /></Row>
  </Group>
</Surface>`,
  en: `
<Surface as="section" aria-labelledby="surface-demo-title">
  <Stack gap={1} paddingX={2} paddingY={1}>
    <Text as="h3" variant="h3" id="surface-demo-title">Privacy</Text>
    <Text tone="neutral">These settings only affect your own account.</Text>
  </Stack>
  <Group>
    <Row label="Public profile"><Switch aria-label="Public profile" /></Row>
  </Group>
</Surface>`,
};

export default function SurfacePage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('页面上的一块底：把相关的分组、卡片圈在一起时用。它本身不承载内容，里面放 Group、Card 或表单。', 'A backing panel on the page, for gathering related groups and cards together. It carries no content of its own; put Group, Card or a form inside.')}>
      <DocSection title={t('基本用法', 'Basic usage')} description={t('面板用表面色 --ok-surface 和一圈发丝线与画布分开，没有阴影。里面的 Group 自动取同心圆角（面板圆角 − 面板内边距）。', 'The panel separates from the canvas with the surface color --ok-surface and a hairline, without a shadow. Groups inside take a concentric corner radius automatically (panel radius − panel padding).')}>
        <Demo layout="block" code={t(CODE_BASIC.zh, CODE_BASIC.en)}>
          <Surface>
            <Group>
              <Row label={t('消息通知', 'Notifications')} description={t('有人提到你时提醒', 'Alert me when someone mentions me')}><Switch defaultChecked aria-label={t('消息通知', 'Notifications')} /></Row>
              <Row label={t('每周摘要', 'Weekly digest')}><Switch aria-label={t('每周摘要', 'Weekly digest')} /></Row>
            </Group>
            <Group>
              <Row label={t('语言', 'Language')} href="/components/surface">{t('简体中文', 'English')}</Row>
            </Group>
          </Surface>
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸', 'Sizes')} description={t('三档圆角与内边距：sm 32 / 12、md 44 / 16（默认）、lg 44 / 20。子项之间的间距等于内边距。', 'Three steps of corner radius and padding: sm 32 / 12, md 44 / 16 (default), lg 44 / 20. The gap between children equals the padding.')}>
        <Demo layout="col" code={t(CODE_SIZES.zh, CODE_SIZES.en)}>
          <Surface size="sm"><Group><Row label={t('sm：圆角 32，内边距 12', 'sm: radius 32, padding 12')} /></Group></Surface>
          <Surface size="md"><Group><Row label={t('md：圆角 44，内边距 16', 'md: radius 44, padding 16')} /></Group></Surface>
          <Surface size="lg"><Group><Row label={t('lg：圆角 44，内边距 20', 'lg: radius 44, padding 20')} /></Group></Surface>
        </Demo>
      </DocSection>

      <DocSection title={t('作为地标区域', 'As a landmark region')} description={t('用 as 换成 section 并起名，读屏用户就能在地标列表里直接跳到它。', 'Switch it to a section with as and give it a name, and screen reader users can jump straight to it from the landmarks list.')}>
        <Demo layout="block" code={t(CODE_SECTION.zh, CODE_SECTION.en)}>
          <Surface as="section" aria-labelledby="surface-demo-title">
            <Stack gap={1} paddingX={2} paddingY={1}>
              <Text as="h3" variant="h3" id="surface-demo-title">{t('隐私', 'Privacy')}</Text>
              <Text tone="neutral">{t('这些设置只影响你自己的账号。', 'These settings only affect your own account.')}</Text>
            </Stack>
            <Group>
              <Row label={t('公开个人主页', 'Public profile')}><Switch aria-label={t('公开个人主页', 'Public profile')} /></Row>
            </Group>
          </Surface>
        </Demo>
      </DocSection>

      <DocSection title={t('规格', 'Specs')}>
        <Specs items={[
          [t('圆角', 'Corner radius'), t('44（sm 为 32），配 corner-shape', '44 (32 for sm), with corner-shape')],
          [t('内边距', 'Padding'), t('四边相等：16（sm 12、lg 20）', 'equal on all sides: 16 (sm 12, lg 20)')],
          [t('分层', 'Layering'), t('表面色 + 1px 发丝线 + 顶部高光，无阴影', 'surface color + 1px hairline + top highlight, no shadow')],
          [t('同心', 'Concentric'), t('内层 Group 圆角 = 面板圆角 − 内边距（44 − 16 = 28）', 'inner Group radius = panel radius − padding (44 − 16 = 28)')],
        ]} />
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable rows={[
          { name: 'as', type: 'ElementType', default: "'div'", description: t('渲染成什么元素。', 'Element to render.') },
          { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('圆角与内边距的档位。', 'Corner radius and padding step.') },
          { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: t(<>其余原生属性、<Code>className</Code>、<Code>style</Code> 和 ref 透传到根节点。</>, <>Other native attributes, <Code>className</Code>, <Code>style</Code> and ref are passed to the root element.</>) },
        ]} />
        <A11yNotes items={t([
          '默认是没有语义的 div，不会出现在读屏的地标里。',
          <>用 <Code>as="section"</Code> 时必须同时给 <Code>aria-label</Code> 或 <Code>aria-labelledby</Code>，否则不会成为 region 地标。</>,
          '面板本身不可聚焦，没有键盘操作；键盘焦点直接落到里面的控件上。',
        ], [
          'By default it’s a div with no semantics and doesn’t appear among screen reader landmarks.',
          <>With <Code>as="section"</Code> you must also provide <Code>aria-label</Code> or <Code>aria-labelledby</Code>; otherwise it won’t become a region landmark.</>,
          'The panel itself isn’t focusable and has no keyboard interaction; keyboard focus goes straight to the controls inside.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
