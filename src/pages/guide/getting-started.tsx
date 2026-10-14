import { useState } from 'react';
import { Alert, Button, Card, CardBody, CardFooter, CardHeader, Code, CodeBlock, Field, Inline, Input, confirm, toast } from 'oink-ui';
import { Demo, DocPage, DocSection } from '../../doc';
import { useT } from '../../i18n';
import type { PageMeta } from '../../registry';
import './guide.css';

export const meta: PageMeta = { path: '/guide/getting-started', title: '快速上手', group: '开始', order: 1, subtitle: 'Getting started', en: { title: 'Getting started' } };

const INSTALL = `npm install oink-ui`;

const STYLES = {
  zh: `// 应用入口（main.tsx）里引入一次
import 'oink-ui/styles.css';`,
  en: `// Import once in your app entry (main.tsx)
import 'oink-ui/styles.css';`,
};

const STYLES_ALL = {
  zh: `// 方式一：整包——令牌、基础样式和全部组件（约 170 KB，gzip 后约 28 KB）
import 'oink-ui/styles.css';`,
  en: `// Option 1: everything: tokens, base styles and all components (about 170 KB, about 28 KB gzipped)
import 'oink-ui/styles.css';`,
};

const STYLES_PICK = {
  zh: `// 方式二：按需——base 最先引、只引一次（令牌、基础样式、关键帧、主题切换，所有组件都依赖）
import 'oink-ui/styles/base.css';

// 再引用到的组件家族：先引被依赖的，再引自己
import 'oink-ui/styles/button.css';
import 'oink-ui/styles/floating-card.css';
import 'oink-ui/styles/dialog.css';`,
  en: `// Option 2: à la carte: base first, exactly once (tokens, base styles, keyframes, theme switching; every component depends on it)
import 'oink-ui/styles/base.css';

// Then the component families you use: dependencies first, then the family itself
import 'oink-ui/styles/button.css';
import 'oink-ui/styles/floating-card.css';
import 'oink-ui/styles/dialog.css';`,
};

const PROVIDER = `import { createRoot } from 'react-dom/client';
import { Confirmer, OinkProvider, Toaster } from 'oink-ui';
import 'oink-ui/styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <OinkProvider defaultTheme="system" defaultAccent="pink" storageKey="my-app-theme">
    <App />
    <Toaster />
    <Confirmer />
  </OinkProvider>,
);`;

const FIRST = {
  zh: `import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Field, Input, toast } from 'oink-ui';

export function Welcome() {
  const [name, setName] = useState('');
  return (
    <Card style={{ width: 'min(360px, 100%)' }}>
      <CardHeader title="打个招呼" description="填个名字，点一下按钮。" />
      <CardBody>
        <Field label="名字">
          <Input value={name} onChange={setName} placeholder="比如：小猪" />
        </Field>
      </CardBody>
      <CardFooter align="end">
        <Button variant="primary" disabled={!name.trim()} onClick={() => toast.success(\`你好，\${name.trim()}\`)}>
          打招呼
        </Button>
      </CardFooter>
    </Card>
  );
}`,
  en: `import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Field, Input, toast } from 'oink-ui';

export function Welcome() {
  const [name, setName] = useState('');
  return (
    <Card style={{ width: 'min(360px, 100%)' }}>
      <CardHeader title="Say hello" description="Enter a name and press the button." />
      <CardBody>
        <Field label="Name">
          <Input value={name} onChange={setName} placeholder="e.g. Piglet" />
        </Field>
      </CardBody>
      <CardFooter align="end">
        <Button variant="primary" disabled={!name.trim()} onClick={() => toast.success(\`Hello, \${name.trim()}\`)}>
          Say hello
        </Button>
      </CardFooter>
    </Card>
  );
}`,
};

const IMPERATIVE = {
  zh: `import { Button, Inline, confirm, toast } from 'oink-ui';

<Inline gap={3}>
  <Button onClick={() => toast({ title: '已保存', description: '改动已经同步。' })}>
    发一条通知
  </Button>
  <Button
    variant="danger"
    onClick={async () => {
      const ok = await confirm({ title: '删除这条记录？', description: '删除后无法恢复。', tone: 'danger', confirmText: '删除' });
      if (ok) toast.success('已删除');
    }}
  >
    删除…
  </Button>
</Inline>`,
  en: `import { Button, Inline, confirm, toast } from 'oink-ui';

<Inline gap={3}>
  <Button onClick={() => toast({ title: 'Saved', description: 'Your changes are synced.' })}>
    Show a toast
  </Button>
  <Button
    variant="danger"
    onClick={async () => {
      const ok = await confirm({ title: 'Delete this record?', description: 'This can’t be undone.', tone: 'danger', confirmText: 'Delete' });
      if (ok) toast.success('Deleted');
    }}
  >
    Delete…
  </Button>
</Inline>`,
};

function Welcome() {
  const t = useT();
  const [name, setName] = useState('');
  return (
    <Card style={{ width: 'min(360px, 100%)' }}>
      <CardHeader title={t('打个招呼', 'Say hello')} description={t('填个名字，点一下按钮。', 'Enter a name and press the button.')} />
      <CardBody>
        <Field label={t('名字', 'Name')}>
          <Input value={name} onChange={setName} placeholder={t('比如：小猪', 'e.g. Piglet')} />
        </Field>
      </CardBody>
      <CardFooter align="end">
        <Button variant="primary" disabled={!name.trim()} onClick={() => toast.success(t(`你好，${name.trim()}`, `Hello, ${name.trim()}`))}>
          {t('打招呼', 'Say hello')}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function GettingStarted() {
  const t = useT();
  return (
    <DocPage
      title={t(meta.title, meta.en!.title)}
      subtitle={t(meta.subtitle, meta.en!.subtitle)}
      lead={t('四步：装包、引入样式、挂 Provider、写组件。库只依赖 react 和 react-dom（18 及以上）。', 'Four steps: install the package, import the styles, mount the Provider, write components. The library only depends on react and react-dom (18 or later).')}
    >
      <DocSection title={t('1. 安装', '1. Install')}>
        <CodeBlock code={INSTALL} language="bash" />
        <div className="g-prose">
          {t(
            <p><Code>react</Code> 和 <Code>react-dom</Code> 是 peer 依赖，版本不低于 18。包里同时带 ESM、CJS 和类型声明，不需要另装 <Code>@types</Code>。</p>,
            <p><Code>react</Code> and <Code>react-dom</Code> are peer dependencies, version 18 or later. The package ships ESM, CJS and type declarations, so there is no separate <Code>@types</Code> package to install.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('2. 引入样式', '2. Import the styles')}>
        <CodeBlock code={t(STYLES.zh, STYLES.en)} language="tsx" />
        <div className="g-prose">
          {t(
            <p>组件的 JS 不带样式，要在入口里自己引入。最省事的是整包：这一个文件里有全部设计令牌（<Code>--ok-*</Code>）和组件样式（<Code>.ok-*</Code>）；只想引用到的组件，见下面的“按需引入样式”。全局层面它只做两件事：给所有元素设 <Code>box-sizing: border-box</Code>，在 <Code>:root</Code> 上声明变量。页面的底色和字体需要自己接到令牌上：</p>,
            <p>The components’ JavaScript doesn’t include styles; import them yourself in your entry file. The simplest option is the full bundle: this single file contains every design token (<Code>--ok-*</Code>) and all component styles (<Code>.ok-*</Code>). To import only the components you use, see “Importing styles per component” below. Globally it does just two things: sets <Code>box-sizing: border-box</Code> on all elements and declares the variables on <Code>:root</Code>. Hook your page background and font up to the tokens yourself:</p>,
          )}
        </div>
        <CodeBlock language="css" code={`body { margin: 0; background: var(--ok-bg); color: var(--ok-text); font: 450 15px/1.6 var(--ok-font); }`} />
      </DocSection>

      <DocSection title={t('按需引入样式', 'Importing styles per component')} description={t('组件不会自动带上样式，需要在入口文件里自己引入。下面两种方式选一种，不要混用。', 'Components don’t bring their styles along automatically; import them in your entry file. Pick one of the two approaches below and don’t mix them.')}>
        <CodeBlock code={t(STYLES_ALL.zh, STYLES_ALL.en)} language="tsx" />
        <CodeBlock code={t(STYLES_PICK.zh, STYLES_PICK.en)} language="tsx" />
        <div className="g-prose">
          {t(
            <>
              <p>每个入口是 <Code>{'oink-ui/styles/<名字>.css'}</Code>，名字是组件家族名的短横线写法：<Code>button</Code>、<Code>slider</Code>、<Code>chip</Code>、<Code>group</Code>、<Code>dialog</Code>、<Code>select</Code>、<Code>calendar</Code>……</p>
              <p>入口文件里不重复打包依赖，依赖由使用者自己引一次；建议按“base → 被依赖的 → 自己”的顺序引入。常见的依赖：</p>
            </>,
            <>
              <p>Each entry is <Code>{'oink-ui/styles/<name>.css'}</Code>, where the name is the component family in kebab case: <Code>button</Code>, <Code>slider</Code>, <Code>chip</Code>, <Code>group</Code>, <Code>dialog</Code>, <Code>select</Code>, <Code>calendar</Code>…</p>
              <p>Entries don’t bundle their dependencies again; you import each dependency once yourself, ideally in the order “base → dependencies → the family itself”. Common dependencies:</p>
            </>,
          )}
          <ul>
            <li><strong>Dialog / Drawer / Sheet / confirm(){t('：', ': ')}</strong><Code>button</Code>{t('、', ', ')}<Code>floating-card</Code></li>
            <li><strong>Toaster / toast() / CodeBlock{t('：', ': ')}</strong><Code>button</Code></li>
            <li><strong>Alert{t('：', ': ')}</strong><Code>button</Code>{t('、', ', ')}<Code>group</Code></li>
            <li><strong>Select{t('：', ': ')}</strong><Code>popup</Code>{t('、', ', ')}<Code>menu</Code></li>
            <li><strong>Combobox{t('：', ': ')}</strong><Code>popup</Code>{t('、', ', ')}<Code>menu</Code>{t('、', ', ')}<Code>input</Code></li>
            <li><strong>DatePicker / Calendar{t('：', ': ')}</strong><Code>button</Code>{t('、', ', ')}<Code>popup</Code>{t('、', ', ')}<Code>popover</Code>{t('、', ', ')}<Code>input</Code></li>
            <li><strong>Table{t('：', ': ')}</strong><Code>checkbox</Code>{t('、', ', ')}<Code>pagination</Code></li>
            <li><strong>Card{t('：', ': ')}</strong><Code>image</Code></li>
            <li><strong>Count / Progress / Reaction{t('：', ': ')}</strong><Code>roll</Code></li>
          </ul>
          {t(
            <p>完整的对照表在 oink-ui 仓库 <Code>AGENTS.md</Code> 的“Importing styles per component”一节；每个入口文件开头的注释也写着要先引入哪些入口。</p>,
            <p>The full table is in <Code>AGENTS.md</Code> in the oink-ui repository, in the section “Importing styles per component”; the comment at the top of each entry file also lists which entries to import first.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('3. 挂上 OinkProvider', '3. Mount OinkProvider')} description={t('Provider 负责主题、强调色和动效偏好，把结果写到 <html> 的 data-theme / data-accent / data-motion 上。', 'The Provider manages theme, accent color and motion preference, and writes the result to data-theme / data-accent / data-motion on <html>.')}>
        <CodeBlock code={PROVIDER} language="tsx" title="main.tsx" />
        <div className="g-prose">
          {t(
            <>
              <ul>
                <li><Code>defaultTheme</Code>：<Code>'light' | 'dark' | 'system'</Code>，默认 <Code>'system'</Code>（跟随系统）。</li>
                <li><Code>defaultAccent</Code>：五种预设强调色之一，或任意颜色（<Code>'#3fa7c4'</Code>），默认 <Code>'pink'</Code>。</li>
                <li><Code>defaultMotion</Code>：<Code>'auto' | 'full' | 'reduced'</Code>，默认 <Code>'auto'</Code>（跟随系统的“减弱动态效果”）。</li>
                <li><Code>storageKey</Code>：传了就把用户的选择记在 <Code>localStorage</Code> 的这个键下，刷新后恢复。</li>
                <li><Code>locale</Code>：<Code>'auto' | 'zh-CN' | 'en-US'</Code>，默认 <Code>'auto'</Code>（跟随浏览器语言，中文用 zh-CN、其它用 en-US）。切换组件自带的文案：关闭、确认之类的按钮、aria-label、占位文字、日历的月份名等。服务端渲染的应用最好显式传入。</li>
              </ul>
              <p>不包 Provider 组件也能渲染（浅色加默认强调色），只是 <Code>useOink()</Code> 拿到的是只读的默认值，切换主题的方法不会生效。</p>
            </>,
            <>
              <ul>
                <li><Code>defaultTheme</Code>: <Code>'light' | 'dark' | 'system'</Code>, defaults to <Code>'system'</Code> (follow the OS).</li>
                <li><Code>defaultAccent</Code>: one of five preset accent colors, or any color (<Code>'#3fa7c4'</Code>); defaults to <Code>'pink'</Code>.</li>
                <li><Code>defaultMotion</Code>: <Code>'auto' | 'full' | 'reduced'</Code>, defaults to <Code>'auto'</Code> (follow the OS “Reduce motion” setting).</li>
                <li><Code>storageKey</Code>: when set, the user’s choices are saved under this <Code>localStorage</Code> key and restored on reload.</li>
                <li><Code>locale</Code>: <Code>'auto' | 'zh-CN' | 'en-US'</Code>, defaults to <Code>'auto'</Code> (follows the browser language: Chinese → zh-CN, anything else → en-US). Switches the components’ built-in strings: buttons such as Close and Confirm, aria-labels, placeholders, calendar month names and so on. Server-rendered apps should pass it explicitly.</li>
              </ul>
              <p>Components render without the Provider too (light theme with the default accent color), but <Code>useOink()</Code> then returns read-only defaults and the theme setters do nothing.</p>
            </>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('4. 第一个示例', '4. A first example')}>
        <Demo code={t(FIRST.zh, FIRST.en)}>
          <Welcome />
        </Demo>
        <div className="g-prose">
          {t(
            <p>几个贯穿全库的约定：<Code>onChange</Code> 的第一个参数是新值而不是事件；尺寸统一叫 <Code>size</Code>（<Code>sm / md / lg</Code>），变体叫 <Code>variant</Code>，状态色叫 <Code>tone</Code>；<Code>ref</Code>、<Code>className</Code>、<Code>style</Code> 和其余原生属性都透传到根节点。</p>,
            <p>A few conventions that run through the whole library: the first argument of <Code>onChange</Code> is the new value, not an event; sizes are always <Code>size</Code> (<Code>sm / md / lg</Code>), variants are <Code>variant</Code>, status colors are <Code>tone</Code>; <Code>ref</Code>, <Code>className</Code>, <Code>style</Code> and all other native attributes are forwarded to the root element.</p>,
          )}
        </div>
      </DocSection>

      <DocSection title={t('Toaster 与 Confirmer', 'Toaster and Confirmer')} description={t('通知和确认框是命令式调用的：toast() 和 confirm() 只负责把请求放进队列，真正渲染的是这两个出口组件。', 'Toasts and confirm dialogs are called imperatively: toast() and confirm() only queue a request, and these two outlet components do the actual rendering.')}>
        <Demo code={t(IMPERATIVE.zh, IMPERATIVE.en)}>
          <Inline gap={3}>
            <Button onClick={() => toast({ title: t('已保存', 'Saved'), description: t('改动已经同步。', 'Your changes are synced.') })}>
              {t('发一条通知', 'Show a toast')}
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                const ok = await confirm({ title: t('删除这条记录？', 'Delete this record?'), description: t('删除后无法恢复。', 'This can’t be undone.'), tone: 'danger', confirmText: t('删除', 'Delete') });
                if (ok) toast.success(t('已删除', 'Deleted'));
              }}
            >
              {t('删除…', 'Delete…')}
            </Button>
          </Inline>
        </Demo>
        <div className="g-prose">
          {t(
            <ul>
              <li><strong>Toaster</strong>：在应用根部挂一个。没挂的时候 <Code>toast()</Code> 不会报错，通知先攒着，等 Toaster 出现再显示。位置、同时显示的条数、停留时间都在它的属性上配。</li>
              <li><strong>Confirmer</strong>：挂在 Provider 里面，确认框就能拿到你的 React 上下文（路由、国际化等）。没挂的话，第一次调用 <Code>confirm()</Code> 时库会自己在 <Code>body</Code> 下建一个独立的根来渲染，功能一样，只是拿不到上下文。</li>
              <li>两者都只挂一份。挂多个 Confirmer 时只有一个负责渲染。</li>
            </ul>,
            <ul>
              <li><strong>Toaster</strong>: mount one at the root of your app. Without it <Code>toast()</Code> doesn’t throw; toasts wait in the queue and appear once a Toaster mounts. Position, how many show at once and how long they stay are all props on it.</li>
              <li><strong>Confirmer</strong>: mount it inside the Provider and confirm dialogs get your React context (router, i18n and so on). Without it, the first <Code>confirm()</Code> call creates a separate root under <Code>body</Code> to render into; it works the same, just without your context.</li>
              <li>Mount exactly one of each. With several Confirmers, only one renders.</li>
            </ul>,
          )}
        </div>
        <Alert tone="info" title={t('服务端渲染', 'Server-side rendering')}>
          {t(
            <>组件不在模块顶层访问 <Code>window</Code> / <Code>document</Code>，可以在服务端渲染；<Code>confirm()</Code> 在服务端直接返回 <Code>false</Code>。</>,
            <>Components never touch <Code>window</Code> / <Code>document</Code> at module top level, so they can be rendered on the server; on the server <Code>confirm()</Code> simply returns <Code>false</Code>.</>,
          )}
        </Alert>
      </DocSection>
    </DocPage>
  );
}
