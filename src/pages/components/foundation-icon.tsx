import { useMemo, useState } from 'react';
import { Button, Code, ICONS, Icon, Inline, SearchInput, Stack, Text, toast } from 'oink-ui';
import type { IconName } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import '../guide/guide.css';

export const meta: PageMeta = { path: '/components/icon', title: 'Icon 图标', group: '基础', order: 1, subtitle: 'Icon', en: { title: 'Icon' } };

const NAMES = Object.keys(ICONS) as IconName[];

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* 落到下面的回退 */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch { return false; }
}

function Gallery() {
  const t = useT();
  const [query, setQuery] = useState('');
  const list = useMemo(() => NAMES.filter((n) => n.includes(query.trim().toLowerCase())), [query]);
  const copy = async (name: IconName) => {
    const ok = await copyText(name);
    if (ok) toast.success({ id: 'icon-copy', title: t(`已复制 ${name}`, `Copied ${name}`) });
    else toast.danger({ id: 'icon-copy', title: t('复制失败', 'Copy failed'), description: t(`图标名是 ${name}`, `The icon name is ${name}`) });
  };
  return (
    <Stack gap={4} className="g-fill">
      <SearchInput value={query} onChange={setQuery} placeholder={t('按名字筛选', 'Filter by name')} aria-label={t('筛选图标', 'Filter icons')} />
      {list.length ? (
        <div className="g-icons">
          {list.map((name) => (
            <button key={name} type="button" className="g-icon-btn ok-focusable" onClick={() => copy(name)} aria-label={t(`复制图标名 ${name}`, `Copy icon name ${name}`)}>
              <Icon name={name} size={24} />
              <span>{name}</span>
            </button>
          ))}
        </div>
      ) : (
        <Text tone="neutral" role="status">{t(`没有名字里带“${query}”的图标。`, `No icons with “${query}” in the name.`)}</Text>
      )}
    </Stack>
  );
}

const BASIC_CODE = `import { Icon, Inline } from 'oink-ui';

<Inline gap={4}>
  <Icon name="search" />
  <Icon name="bell" size={28} />
  <Icon name="sparkle" filled />
  <Icon name="check" style={{ color: 'var(--ok-success-text)' }} />
</Inline>`;

const CUSTOM_CODE = {
  zh: `import { Icon } from 'oink-ui';

{/* 不传 name：直接把 20×20 画布上的描线路径写在 children 里 */}
<Icon size={28}>
  <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
</Icon>`,
  en: `import { Icon } from 'oink-ui';

{/* No name: write stroke paths on the 20×20 canvas straight into children */}
<Icon size={28}>
  <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
</Icon>`,
};

const A11Y_CODE = {
  zh: `import { Button, Icon, Inline } from 'oink-ui';

<Inline gap={4}>
  {/* 装饰性：旁边已经有文字，图标默认对读屏隐藏 */}
  <Button leading={<Icon name="download" />}>下载</Button>

  {/* 图标按钮：名字写在按钮上 */}
  <Button iconOnly aria-label="分享"><Icon name="share" /></Button>

  {/* 单独出现、有含义的图标：给 label，会变成 role="img" */}
  <Icon name="alert" label="有未处理的告警" style={{ color: 'var(--ok-warning-text)' }} />
</Inline>`,
  en: `import { Button, Icon, Inline } from 'oink-ui';

<Inline gap={4}>
  {/* Decorative: text sits right next to it, so the icon is hidden from screen readers by default */}
  <Button leading={<Icon name="download" />}>Download</Button>

  {/* Icon button: put the name on the button */}
  <Button iconOnly aria-label="Share"><Icon name="share" /></Button>

  {/* A standalone icon that carries meaning: give it a label and it becomes role="img" */}
  <Icon name="alert" label="Unresolved alerts" style={{ color: 'var(--ok-warning-text)' }} />
</Inline>`,
};

export default function IconPage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('20×20 的描线图标：圆头、等宽、线宽 1.8，颜色跟随文字。内置一小组界面常用的图标；不够时把路径写在 children 里，笔触自动保持一致。', '20×20 stroke icons: round caps, even weight, 1.8 stroke width, colored like the surrounding text. A small built-in set covers common interface needs; when it falls short, write paths into children and the stroke stays consistent automatically.')}>
      <DocSection title={t('全部内置图标', 'All built-in icons')} description={t(`共 ${NAMES.length} 个。点一下复制名字。`, `${NAMES.length} in total. Click one to copy its name.`)}>
        <Demo layout="block">
          <Gallery />
        </Demo>
      </DocSection>

      <DocSection title={t('用法', 'Usage')}>
        <Demo title={t('尺寸、填充与颜色', 'Size, fill and color')} description={t('size 是像素边长；filled 改为实心；颜色用 CSS 的 color。', 'size is the edge length in pixels; filled switches to solid; set the color with CSS color.')} code={BASIC_CODE}>
          <Inline gap={4}>
            <Icon name="search" />
            <Icon name="bell" size={28} />
            <Icon name="sparkle" filled />
            <Icon name="check" style={{ color: 'var(--ok-success-text)' }} />
          </Inline>
        </Demo>
        <Demo title={t('自定义路径', 'Custom paths')} code={t(CUSTOM_CODE.zh, CUSTOM_CODE.en)}>
          <Icon size={28}>
            <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />
          </Icon>
        </Demo>
        <Demo title={t('有含义还是装饰', 'Meaningful or decorative')} code={t(A11Y_CODE.zh, A11Y_CODE.en)}>
          <Inline gap={4}>
            <Button leading={<Icon name="download" />}>{t('下载', 'Download')}</Button>
            <Button iconOnly aria-label={t('分享', 'Share')}><Icon name="share" /></Button>
            <Icon name="alert" label={t('有未处理的告警', 'Unresolved alerts')} style={{ color: 'var(--ok-warning-text)' }} />
          </Inline>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'name', type: 'IconName', description: t('内置图标名。不传时渲染 children 里的路径。', 'Built-in icon name. Without it, the paths in children are rendered.') },
            { name: 'size', type: 'number', default: '20', description: t('边长（px）。', 'Edge length (px).') },
            { name: 'label', type: 'string', description: t('有含义的图标给一个名字：渲染成 role="img" 加 aria-label。不传则 aria-hidden。', 'Names an icon that carries meaning: renders role="img" with aria-label. Without it the icon is aria-hidden.') },
            { name: 'filled', type: 'boolean', default: 'false', description: t('实心：用 fill 而不是描线。', 'Solid: uses fill instead of stroke.') },
            { name: 'children', type: 'ReactNode', description: t('自定义的 <path> 等 SVG 内容（20×20 画布）。', 'Custom SVG content such as <path> (20×20 canvas).') },
            { name: '…rest', type: 'SVGAttributes<SVGSVGElement>', description: t(<>其余属性和 ref 透传到 <Code>{'<svg>'}</Code>。</>, <>Other props and ref are forwarded to the <Code>{'<svg>'}</Code>.</>) },
          ]}
        />
        <A11yNotes
          items={t([
            '默认是装饰性的（aria-hidden），读屏会跳过。',
            <>单独表达含义时传 <Code>label</Code>；放在按钮里时把名字写在按钮上（<Code>aria-label</Code>），图标保持隐藏。</>,
            '不要只用图标的颜色表达状态，配上文字或不同的图形。',
          ], [
            'Decorative by default (aria-hidden), so screen readers skip it.',
            <>When an icon carries meaning on its own, pass <Code>label</Code>; inside a button, put the name on the button (<Code>aria-label</Code>) and keep the icon hidden.</>,
            'Don’t rely on icon color alone to convey state; pair it with text or a different shape.',
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
