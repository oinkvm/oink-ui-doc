import { useEffect, useState } from 'react';
import { Autocomplete, Combobox, Field, Stack, Text } from 'oink-ui';
import type { SelectOption, SelectOptions } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/combobox', title: 'Combobox 组合框', group: '浮层', order: 70, subtitle: 'Combobox · Autocomplete', en: { title: 'Combobox', subtitle: 'Combobox · Autocomplete' } };

const COUNTRIES: { zh: SelectOptions; en: SelectOptions } = {
  zh: [
    { value: 'cn', label: '中国' },
    { value: 'jp', label: '日本' },
    { value: 'kr', label: '韩国' },
    { value: 'sg', label: '新加坡' },
    { value: 'de', label: '德国' },
    { value: 'fr', label: '法国' },
    { value: 'us', label: '美国' },
    { value: 'ca', label: '加拿大', disabled: true },
  ],
  en: [
    { value: 'cn', label: 'China' },
    { value: 'jp', label: 'Japan' },
    { value: 'kr', label: 'South Korea' },
    { value: 'sg', label: 'Singapore' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada', disabled: true },
  ],
};

const LANGS: { zh: SelectOptions; en: SelectOptions } = {
  zh: [
    { label: '前端', options: [{ value: 'ts', label: 'TypeScript', meta: '.ts' }, { value: 'js', label: 'JavaScript', meta: '.js' }, { value: 'css', label: 'CSS', meta: '.css' }] },
    { label: '后端', options: [{ value: 'go', label: 'Go', meta: '.go' }, { value: 'rs', label: 'Rust', meta: '.rs' }, { value: 'py', label: 'Python', meta: '.py' }] },
  ],
  en: [
    { label: 'Frontend', options: [{ value: 'ts', label: 'TypeScript', meta: '.ts' }, { value: 'js', label: 'JavaScript', meta: '.js' }, { value: 'css', label: 'CSS', meta: '.css' }] },
    { label: 'Backend', options: [{ value: 'go', label: 'Go', meta: '.go' }, { value: 'rs', label: 'Rust', meta: '.rs' }, { value: 'py', label: 'Python', meta: '.py' }] },
  ],
};

const toOptions = (domains: string[]): SelectOptions => domains.map((d) => ({ value: d, label: d }));
const EMAILS = {
  zh: toOptions(['gmail.com', 'outlook.com', 'icloud.com', 'qq.com', '163.com']),
  en: toOptions(['gmail.com', 'outlook.com', 'icloud.com', 'yahoo.com', 'proton.me']),
};

const REPOS = ['oink-ui', 'oink-icons', 'oink-docs', 'piglet-cli', 'piglet-server', 'truffle-search', 'truffle-index'];

function ControlledDemo() {
  const t = useT();
  const [value, setValue] = useState<string | null>('jp');
  const [text, setText] = useState(t('日本', 'Japan'));
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <Combobox aria-label={t('国家或地区', 'Country or region')} options={t(COUNTRIES.zh, COUNTRIES.en)} value={value} onChange={setValue} inputValue={text} onInputChange={setText} clearable />
      <Text tone="subtle" variant="caption">{t(<>value：{value ?? 'null'} · 输入框文字：“{text}”</>, <>value: {value ?? 'null'} · Input text: “{text}”</>)}</Text>
    </Stack>
  );
}

function AsyncDemo() {
  const t = useT();
  const [query, setQuery] = useState('');
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  // 输入停下 1 秒后出结果：这个定时器既是防抖，也模拟了网络延迟。真实项目里在这里发请求，并在清理函数里取消
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setOptions([]); setLoading(false); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      setOptions(REPOS.filter((r) => r.includes(q)).map((r) => ({ value: r, label: r })));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <Combobox
        aria-label={t('搜索仓库', 'Search repositories')}
        icon="search"
        placeholder={t('输入 oink、piglet 或 truffle', 'Try oink, piglet or truffle')}
        options={options}
        filter={false}
        loading={loading}
        loadingText={t('正在搜索…', 'Searching…')}
        emptyText={query.trim() ? t('没有找到仓库', 'No repositories found') : null}
        value={value}
        onChange={setValue}
        inputValue={query}
        onInputChange={setQuery}
        clearable
      />
      <Text tone="subtle" variant="caption">{t('已选仓库：', 'Selected repository: ')}{value ?? t('无', 'none')}</Text>
    </Stack>
  );
}

const CODE_BASIC = {
  zh: `
const COUNTRIES: SelectOptions = [
  { value: 'cn', label: '中国' },
  { value: 'jp', label: '日本' },
  { value: 'kr', label: '韩国' },
  { value: 'sg', label: '新加坡' },
  { value: 'de', label: '德国' },
  { value: 'fr', label: '法国' },
  { value: 'us', label: '美国' },
  { value: 'ca', label: '加拿大', disabled: true },
];

<Combobox aria-label="国家或地区" options={COUNTRIES} placeholder="搜索国家或地区" style={{ maxWidth: 280 }} />
`,
  en: `
const COUNTRIES: SelectOptions = [
  { value: 'cn', label: 'China' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'sg', label: 'Singapore' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada', disabled: true },
];

<Combobox aria-label="Country or region" options={COUNTRIES} placeholder="Search countries or regions" style={{ maxWidth: 280 }} />
`,
};

const CODE_GROUPS = {
  zh: `
const LANGS: SelectOptions = [
  { label: '前端', options: [{ value: 'ts', label: 'TypeScript', meta: '.ts' }, { value: 'js', label: 'JavaScript', meta: '.js' }, { value: 'css', label: 'CSS', meta: '.css' }] },
  { label: '后端', options: [{ value: 'go', label: 'Go', meta: '.go' }, { value: 'rs', label: 'Rust', meta: '.rs' }, { value: 'py', label: 'Python', meta: '.py' }] },
];

<Combobox aria-label="语言" options={LANGS} defaultValue="ts" icon="search" clearable style={{ maxWidth: 280 }} />
`,
  en: `
const LANGS: SelectOptions = [
  { label: 'Frontend', options: [{ value: 'ts', label: 'TypeScript', meta: '.ts' }, { value: 'js', label: 'JavaScript', meta: '.js' }, { value: 'css', label: 'CSS', meta: '.css' }] },
  { label: 'Backend', options: [{ value: 'go', label: 'Go', meta: '.go' }, { value: 'rs', label: 'Rust', meta: '.rs' }, { value: 'py', label: 'Python', meta: '.py' }] },
];

<Combobox aria-label="Language" options={LANGS} defaultValue="ts" icon="search" clearable style={{ maxWidth: 280 }} />
`,
};

const CODE_SIZES = {
  zh: `
<Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
  <Combobox size="sm" aria-label="小号" options={COUNTRIES} placeholder="小号" />
  <Combobox size="md" aria-label="中号" options={COUNTRIES} placeholder="中号" />
  <Combobox size="lg" aria-label="大号" options={COUNTRIES} placeholder="大号" />
  <Combobox disabled aria-label="禁用" options={COUNTRIES} defaultValue="cn" />
  <Combobox invalid aria-label="校验失败" options={COUNTRIES} placeholder="必填" />
  <Combobox aria-label="自定义空状态" options={COUNTRIES} emptyText="换个关键词试试" placeholder="输入 xyz 看空状态" />
</Stack>
`,
  en: `
<Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
  <Combobox size="sm" aria-label="Small" options={COUNTRIES} placeholder="Small" />
  <Combobox size="md" aria-label="Medium" options={COUNTRIES} placeholder="Medium" />
  <Combobox size="lg" aria-label="Large" options={COUNTRIES} placeholder="Large" />
  <Combobox disabled aria-label="Disabled" options={COUNTRIES} defaultValue="cn" />
  <Combobox invalid aria-label="Invalid" options={COUNTRIES} placeholder="Required" />
  <Combobox aria-label="Custom empty state" options={COUNTRIES} emptyText="Try another keyword" placeholder="Type xyz to see the empty state" />
</Stack>
`,
};

const CODE_CONTROLLED = {
  zh: `
function ControlledDemo() {
  const [value, setValue] = useState<string | null>('jp');
  const [text, setText] = useState('日本');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <Combobox aria-label="国家或地区" options={COUNTRIES} value={value} onChange={setValue} inputValue={text} onInputChange={setText} clearable />
      <Text tone="subtle" variant="caption">value：{value ?? 'null'} · 输入框文字：“{text}”</Text>
    </Stack>
  );
}
`,
  en: `
function ControlledDemo() {
  const [value, setValue] = useState<string | null>('jp');
  const [text, setText] = useState('Japan');
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <Combobox aria-label="Country or region" options={COUNTRIES} value={value} onChange={setValue} inputValue={text} onInputChange={setText} clearable />
      <Text tone="subtle" variant="caption">value: {value ?? 'null'} · Input text: “{text}”</Text>
    </Stack>
  );
}
`,
};

const CODE_ASYNC = {
  zh: `
const REPOS = ['oink-ui', 'oink-icons', 'oink-docs', 'piglet-cli', 'piglet-server', 'truffle-search', 'truffle-index'];

function AsyncDemo() {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  // 输入停下 1 秒后出结果：这个定时器既是防抖，也模拟了网络延迟。真实项目里在这里发请求，并在清理函数里取消
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setOptions([]); setLoading(false); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      setOptions(REPOS.filter((r) => r.includes(q)).map((r) => ({ value: r, label: r })));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <Combobox
        aria-label="搜索仓库"
        icon="search"
        placeholder="输入 oink、piglet 或 truffle"
        options={options}
        filter={false}
        loading={loading}
        loadingText="正在搜索…"
        emptyText={query.trim() ? '没有找到仓库' : null}
        value={value}
        onChange={setValue}
        inputValue={query}
        onInputChange={setQuery}
        clearable
      />
      <Text tone="subtle" variant="caption">已选仓库：{value ?? '无'}</Text>
    </Stack>
  );
}
`,
  en: `
const REPOS = ['oink-ui', 'oink-icons', 'oink-docs', 'piglet-cli', 'piglet-server', 'truffle-search', 'truffle-index'];

function AsyncDemo() {
  const [query, setQuery] = useState('');
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Results arrive 1 second after typing stops: the timer debounces and also fakes network latency.
  // In a real app, send the request here and cancel it in the cleanup function.
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setOptions([]); setLoading(false); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      setOptions(REPOS.filter((r) => r.includes(q)).map((r) => ({ value: r, label: r })));
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
      <Combobox
        aria-label="Search repositories"
        icon="search"
        placeholder="Try oink, piglet or truffle"
        options={options}
        filter={false}
        loading={loading}
        loadingText="Searching…"
        emptyText={query.trim() ? 'No repositories found' : null}
        value={value}
        onChange={setValue}
        inputValue={query}
        onInputChange={setQuery}
        clearable
      />
      <Text tone="subtle" variant="caption">Selected repository: {value ?? 'none'}</Text>
    </Stack>
  );
}
`,
};

const CODE_AUTOCOMPLETE = {
  zh: `
const EMAILS: SelectOptions = ['gmail.com', 'outlook.com', 'icloud.com', 'qq.com', '163.com'].map((d) => ({ value: d, label: d }));

<Field label="邮箱后缀" hint="可以选一个常用的，也可以自己输入" style={{ width: '100%', maxWidth: 280 }}>
  <Autocomplete name="domain" options={EMAILS} placeholder="example.com" />
</Field>
`,
  en: `
const EMAILS: SelectOptions = ['gmail.com', 'outlook.com', 'icloud.com', 'yahoo.com', 'proton.me'].map((d) => ({ value: d, label: d }));

<Field label="Email domain" hint="Pick a common one or type your own" style={{ width: '100%', maxWidth: 280 }}>
  <Autocomplete name="domain" options={EMAILS} placeholder="example.com" />
</Field>
`,
};

export default function ComboboxPage() {
  const t = useT();
  const countries = t(COUNTRIES.zh, COUNTRIES.en);
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t(
        '选项很多、用户大概知道自己要什么时，让他们边打字边筛选：国家、成员、仓库。Combobox 的值必须是选项之一；Autocomplete 允许任意输入，选项只是建议。选项不多时直接用 Select。',
        'When there are many options and people roughly know what they want, let them filter as they type: countries, members, repositories. A Combobox value must be one of the options; Autocomplete accepts any input and treats the options as suggestions. With only a few options, use Select instead.',
      )}
    >
      <DocSection
        title={t('基本用法', 'Basic usage')}
        description={t(
          '点击或打字都会展开列表；刚展开、还没改过文字时显示全部选项。没选就离开，文字会回到当前选中项。',
          'Clicking or typing opens the list; right after opening, before the text is edited, all options are shown. Leaving without picking resets the text to the current selection.',
        )}
      >
        <Demo
          minHeight={400}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_BASIC.zh, CODE_BASIC.en)}
        >
          <Combobox aria-label={t('国家或地区', 'Country or region')} options={countries} placeholder={t('搜索国家或地区', 'Search countries or regions')} style={{ maxWidth: 280 }} />
        </Demo>
      </DocSection>

      <DocSection
        title={t('分组、图标与清除', 'Groups, icon and clearing')}
        description={t(
          '选项的写法和 Select 相同（分组、禁用、图标、meta）。clearable 在有内容时显示清除按钮；icon 是输入框前面的图标。',
          'Options are written the same way as in Select (groups, disabled, icons, meta). clearable shows a clear button when there is content; icon is shown at the start of the input.',
        )}
      >
        <Demo
          minHeight={420}
          style={{ alignContent: 'flex-start' }}
          align="start"
          code={t(CODE_GROUPS.zh, CODE_GROUPS.en)}
        >
          <Combobox aria-label={t('语言', 'Language')} options={t(LANGS.zh, LANGS.en)} defaultValue="ts" icon="search" clearable style={{ maxWidth: 280 }} />
        </Demo>
      </DocSection>

      <DocSection title={t('尺寸与状态', 'Sizes and states')}>
        <Demo
          minHeight={160}
          layout="col"
          code={t(CODE_SIZES.zh, CODE_SIZES.en)}
        >
          <Stack gap={3} style={{ width: '100%', maxWidth: 280 }}>
            <Combobox size="sm" aria-label={t('小号', 'Small')} options={countries} placeholder={t('小号', 'Small')} />
            <Combobox size="md" aria-label={t('中号', 'Medium')} options={countries} placeholder={t('中号', 'Medium')} />
            <Combobox size="lg" aria-label={t('大号', 'Large')} options={countries} placeholder={t('大号', 'Large')} />
            <Combobox disabled aria-label={t('禁用', 'Disabled')} options={countries} defaultValue="cn" />
            <Combobox invalid aria-label={t('校验失败', 'Invalid')} options={countries} placeholder={t('必填', 'Required')} />
            <Combobox aria-label={t('自定义空状态', 'Custom empty state')} options={countries} emptyText={t('换个关键词试试', 'Try another keyword')} placeholder={t('输入 xyz 看空状态', 'Type xyz to see the empty state')} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection
        title={t('受控用法', 'Controlled usage')}
        description={t(
          '有两份状态：value 是选中项的值，inputValue 是输入框里的文字。把文字清空会把 value 置为 null。',
          'There are two pieces of state: value is the selected option’s value, inputValue is the text in the input. Clearing the text sets value to null.',
        )}
      >
        <Demo
          minHeight={420}
          layout="col"
          align="start"
          code={t(CODE_CONTROLLED.zh, CODE_CONTROLLED.en)}
        >
          <ControlledDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('异步加载', 'Async loading')}
        description={t(
          '选项来自接口时：监听 onInputChange 去请求，把 filter 设为 false（不在本地再筛一遍），请求期间传 loading。emptyText 传 null 可以在没有内容时干脆不弹出。',
          'When options come from an API: request on onInputChange, set filter to false (no second filtering pass locally) and pass loading while the request is in flight. Passing null as emptyText keeps the list closed when there is nothing to show.',
        )}
      >
        <Demo
          minHeight={300}
          layout="col"
          align="start"
          code={t(CODE_ASYNC.zh, CODE_ASYNC.en)}
        >
          <AsyncDemo />
        </Demo>
      </DocSection>

      <DocSection
        title={t('Autocomplete 自动补全', 'Autocomplete')}
        description={t(
          '可以任意输入，选项只是建议：值就是输入框里的文字。适合邮箱后缀、标签、搜索历史这类“多半是这些，但也可能是别的”的输入。',
          'Accepts any input; the options are only suggestions, and the value is whatever is in the input. Good for email domains, tags and search history: inputs that are “probably one of these, but maybe something else”.',
        )}
      >
        <Demo
          minHeight={340}
          layout="col"
          align="start"
          code={t(CODE_AUTOCOMPLETE.zh, CODE_AUTOCOMPLETE.en)}
        >
          <Field label={t('邮箱后缀', 'Email domain')} hint={t('可以选一个常用的，也可以自己输入', 'Pick a common one or type your own')} style={{ width: '100%', maxWidth: 280 }}>
            <Autocomplete name="domain" options={t(EMAILS.zh, EMAILS.en)} placeholder="example.com" />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          title="Combobox"
          rows={[
            { name: 'options', type: 'Array<SelectOption | { label: string; options: SelectOption[] }>', required: true, description: t('选项；可以混入分组。SelectOption 的字段见 Select。', 'Options, optionally mixed with groups. See Select for the SelectOption fields.') },
            { name: 'value', type: 'string | null', description: t('选中项的 value（受控）；null 表示没选。Autocomplete 时就是输入框里的文字。', 'Value of the selected option (controlled); null means nothing is selected. For Autocomplete it is the text in the input.') },
            { name: 'defaultValue', type: 'string | null', default: 'null', description: t('初始选中项（非受控）。', 'Initially selected option (uncontrolled).') },
            { name: 'onChange', type: '(value: string | null, option?: SelectOption) => void', description: t('选中项变化时触发；清空时为 null。', 'Called when the selection changes; null when cleared.') },
            { name: 'inputValue', type: 'string', description: t('输入框里的文字（受控）。', 'Text in the input (controlled).') },
            { name: 'defaultInputValue', type: 'string', description: t('输入框的初始文字，默认取选中项的文字。', 'Initial text in the input; defaults to the selected option’s label.') },
            { name: 'onInputChange', type: '(text: string) => void', description: t('文字变化时触发（打字、选中、清除）。', 'Called when the text changes (typing, selecting, clearing).') },
            { name: 'filter', type: '((option, query) => boolean) | false', default: t('按文字包含（不分大小写）', 'Case-insensitive substring match'), description: t('自定义筛选；false 表示不在本地筛选。', 'Custom filter; false disables local filtering.') },
            { name: 'loading', type: 'boolean', default: 'false', description: t('正在加载选项：列表上方显示加载文字，输入框带 aria-busy。', 'Options are loading: loading text is shown above the list and the input gets aria-busy.') },
            { name: 'loadingText', type: 'ReactNode', default: t("'加载中…'", "'Loading…'"), description: t('加载时显示的内容。', 'Shown while loading. The default follows the OinkProvider locale.') },
            { name: 'emptyText', type: 'ReactNode', default: t("'没有匹配的选项'", "'No matching options'"), description: t('没有匹配项时显示的内容；传 null 则不弹出。', 'Shown when nothing matches; pass null to keep the list closed. The default follows the OinkProvider locale.') },
            { name: 'freeSolo', type: 'boolean', default: 'false', description: t('允许任意输入。Autocomplete 就是固定开启它的 Combobox。', 'Allows any input. Autocomplete is a Combobox with this always on.') },
            { name: 'clearable', type: 'boolean', default: 'false', description: t('有内容时显示清除按钮。', 'Shows a clear button when there is content.') },
            { name: 'icon', type: 'IconName | ReactNode', description: t('输入框前面的图标。', 'Icon at the start of the input.') },
            { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: t('尺寸。', 'Size.') },
            { name: 'invalid / disabled / required', type: 'boolean', description: t('校验未通过 / 禁用 / 必填。放在 Field 里时没传就取 Field 的。', 'Invalid / disabled / required. Inside a Field, unset values are taken from the Field.') },
            { name: 'name / form', type: 'string', description: t('配合表单提交：Combobox 提交选中项的 value，Autocomplete 提交输入的文字。', 'For form submission: Combobox submits the selected value, Autocomplete submits the typed text.') },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: t('列表的展开状态。', 'Whether the list is open.') },
            { name: 'placement', type: 'Placement', default: "'bottom-start'", description: t('列表相对输入框的位置。', 'Position of the list relative to the input.') },
            { name: 'ref', type: 'Ref<HTMLInputElement>', description: t('指向里面的原生 <input>（和 Input、SearchInput 一致），可以直接 focus() / select()。', 'Points to the native <input> inside (like Input and SearchInput), so you can call focus() / select() directly.') },
            { name: 'rootRef', type: 'Ref<HTMLDivElement>', description: t('外框（.ok-input）的 ref，需要量尺寸或以它为锚点时用。', 'Ref to the outer frame (.ok-input), for measuring or anchoring to it.') },
            { name: 'rootClassName / rootStyle', type: 'string / CSSProperties', description: t('外框的类名与样式；className / style 也落在外框上。', 'Class name and style for the outer frame; className / style also land on the frame.') },
            { name: '…rest', type: 'InputHTMLAttributes', description: t('其余原生属性（id、placeholder、aria-*）落在 <input> 上。', 'Other native attributes (id, placeholder, aria-*) go on the <input>.') },
          ]}
        />
        <A11yNotes
          items={t(
            [
              <>输入框是 <code>role="combobox"</code>，<code>aria-autocomplete="list"</code>；列表是 <code>role="listbox"</code>。焦点始终在输入框里，高亮项通过 <code>aria-activedescendant</code> 告诉读屏。</>,
              <><kbd>↓</kbd> / <kbd>↑</kbd> 展开并在选项间移动（跳过禁用项）；<kbd>Enter</kbd> 选中高亮项；<kbd>Esc</kbd> 收起列表；<kbd>Tab</kbd> 收起并离开。</>,
              <>打字时自动高亮第一个匹配项，所以“打几个字 + Enter”就能选中；异步搜索的结果回来后同样会高亮第一项。</>,
              <>“加载中”和“没有匹配的选项”是 <code>role="status"</code>，会被播报；加载期间输入框带 <code>aria-busy</code>。</>,
              <>清除按钮不在 Tab 顺序里：键盘用户全选后删除即可，效果相同。</>,
              <>必须有可读名称：<code>aria-label</code>，或直接放进带 label 的 Field——id、<code>aria-describedby</code>、<code>aria-invalid</code>、required、disabled 会自动接上。</>,
            ],
            [
              <>The input is <code>role="combobox"</code> with <code>aria-autocomplete="list"</code>; the list is <code>role="listbox"</code>. Focus always stays in the input, and the highlighted option is conveyed to screen readers via <code>aria-activedescendant</code>.</>,
              <><kbd>↓</kbd> / <kbd>↑</kbd> open the list and move between options (skipping disabled ones); <kbd>Enter</kbd> picks the highlighted option; <kbd>Esc</kbd> closes the list; <kbd>Tab</kbd> closes it and moves on.</>,
              <>Typing highlights the first match automatically, so “a few letters + Enter” is enough to pick; async results highlight their first item the same way.</>,
              <>“Loading” and “No matching options” are <code>role="status"</code> and get announced; the input carries <code>aria-busy</code> while loading.</>,
              <>The clear button is not in the Tab order: keyboard users can select all and delete, with the same effect.</>,
              <>It needs an accessible name: <code>aria-label</code>, or place it in a Field with a label, which wires up the id, <code>aria-describedby</code>, <code>aria-invalid</code>, required and disabled automatically.</>,
            ],
          )}
        />
      </DocSection>
    </DocPage>
  );
}
