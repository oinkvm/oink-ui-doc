import { Code, CodeBlock, Text, toast } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/code', title: 'Code 代码', group: '数据展示', order: 140, subtitle: 'Code · CodeBlock', en: { title: 'Code', subtitle: 'Code · CodeBlock' } };

const SNIPPET = {
  zh: `import { Button, toast } from 'oink-ui';

export function SaveButton() {
  return <Button variant="primary" onClick={() => toast.success('已保存')}>保存</Button>;
}`,
  en: `import { Button, toast } from 'oink-ui';

export function SaveButton() {
  return <Button variant="primary" onClick={() => toast.success('Saved')}>Save</Button>;
}`,
};

const longLine = `curl -X POST https://api.example.com/v1/projects/8a1f/deployments -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"branch":"main","environment":"production"}'`;

const MANY_LINES = {
  zh: Array.from({ length: 18 }, (_, i) => `${String(i + 1).padStart(2, '0')}  2024-08-17 10:${String(10 + i)}:02  INFO  已处理第 ${i + 1} 批任务`).join('\n'),
  en: Array.from({ length: 18 }, (_, i) => `${String(i + 1).padStart(2, '0')}  2024-08-17 10:${String(10 + i)}:02  INFO  Processed batch ${i + 1}`).join('\n'),
};

const CODE_INLINE = {
  zh: `
<Text as="p">
  运行 <Code>npm install oink-ui</Code> 安装，然后在入口文件里 <Code>import 'oink-ui/styles.css'</Code>。
</Text>`,
  en: `
<Text as="p">
  Run <Code>npm install oink-ui</Code> to install, then add <Code>import 'oink-ui/styles.css'</Code> to your entry file.
</Text>`,
};

const CODE_BLOCK = {
  zh: `
const snippet = \`import { Button, toast } from 'oink-ui';

export function SaveButton() {
  return <Button variant="primary" onClick={() => toast.success('已保存')}>保存</Button>;
}\`;

<CodeBlock code={snippet} language="tsx" title="SaveButton.tsx" onCopy={() => toast.success('已复制到剪贴板')} />`,
  en: `
const snippet = \`import { Button, toast } from 'oink-ui';

export function SaveButton() {
  return <Button variant="primary" onClick={() => toast.success('Saved')}>Save</Button>;
}\`;

<CodeBlock code={snippet} language="tsx" title="SaveButton.tsx" onCopy={() => toast.success('Copied to clipboard')} />`,
};

const CODE_LONG = {
  zh: `
const longLine = \`curl -X POST https://api.example.com/v1/projects/8a1f/deployments -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"branch":"main","environment":"production"}'\`;

<CodeBlock language="bash" label="部署命令（横向滚动）">{longLine}</CodeBlock>
<CodeBlock language="bash" label="部署命令（自动换行）" wrap>{longLine}</CodeBlock>`,
  en: `
const longLine = \`curl -X POST https://api.example.com/v1/projects/8a1f/deployments -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"branch":"main","environment":"production"}'\`;

<CodeBlock language="bash" label="Deploy command (scrolls horizontally)">{longLine}</CodeBlock>
<CodeBlock language="bash" label="Deploy command (wrapped)" wrap>{longLine}</CodeBlock>`,
};

const CODE_MAX = {
  zh: `
const manyLines = Array.from({ length: 18 }, (_, i) => \`\${String(i + 1).padStart(2, '0')}  2024-08-17 10:\${String(10 + i)}:02  INFO  已处理第 \${i + 1} 批任务\`).join('\\n');

<CodeBlock code={manyLines} title="worker.log" maxHeight={180} />
<CodeBlock code="npm run dev" copyable={false} />`,
  en: `
const manyLines = Array.from({ length: 18 }, (_, i) => \`\${String(i + 1).padStart(2, '0')}  2024-08-17 10:\${String(10 + i)}:02  INFO  Processed batch \${i + 1}\`).join('\\n');

<CodeBlock code={manyLines} title="worker.log" maxHeight={180} />
<CodeBlock code="npm run dev" copyable={false} />`,
};

export default function CodePage() {
  const t = useT();
  return (
    <DocPage title={t(meta.title, meta.en!.title)} subtitle={t(meta.subtitle, meta.en!.subtitle)} lead={t('Code 用来在句子里标出一个标识符、命令或取值；CodeBlock 展示成段的代码，带复制按钮。两者都只做等宽排版，不做语法高亮。', 'Code marks an identifier, command or value inside a sentence; CodeBlock shows a block of code with a copy button. Both only set monospace type; there’s no syntax highlighting.')}>
      <DocSection title={t('行内代码', 'Inline code')}>
        <Demo code={t(CODE_INLINE.zh, CODE_INLINE.en)}>
          {t(
            <Text as="p">
              运行 <Code>npm install oink-ui</Code> 安装，然后在入口文件里 <Code>import 'oink-ui/styles.css'</Code>。
            </Text>,
            <Text as="p">
              Run <Code>npm install oink-ui</Code> to install, then add <Code>import 'oink-ui/styles.css'</Code> to your entry file.
            </Text>,
          )}
        </Demo>
      </DocSection>

      <DocSection title={t('代码块', 'Code block')} description={t('代码可以用 code 属性传，也可以写在 children 里。language 显示在左上角，title 通常放文件名。右上角的按钮把全部代码复制到剪贴板，成功后图标变成对勾两秒。', 'Pass the code through the code prop or as children. language appears in the top-left corner, and title usually holds a file name. The button in the top-right corner copies all the code to the clipboard; on success its icon turns into a check mark for two seconds.')}>
        <Demo layout="block" code={t(CODE_BLOCK.zh, CODE_BLOCK.en)}>
          <CodeBlock code={t(SNIPPET.zh, SNIPPET.en)} language="tsx" title="SaveButton.tsx" onCopy={() => toast.success(t('已复制到剪贴板', 'Copied to clipboard'))} />
        </Demo>
      </DocSection>

      <DocSection title={t('长行', 'Long lines')} description={t('默认不换行，在代码块内部横向滚动（原生滚动，只换了滚动条外观）；加 wrap 则自动换行。', 'By default lines don’t wrap and the block scrolls horizontally (native scrolling, with only the scrollbar restyled); add wrap to wrap them.')}>
        <Demo layout="col" code={t(CODE_LONG.zh, CODE_LONG.en)}>
          <CodeBlock language="bash" label={t('部署命令（横向滚动）', 'Deploy command (scrolls horizontally)')}>{longLine}</CodeBlock>
          <CodeBlock language="bash" label={t('部署命令（自动换行）', 'Deploy command (wrapped)')} wrap>{longLine}</CodeBlock>
        </Demo>
      </DocSection>

      <DocSection title={t('限高与不带头部', 'Max height and no header')} description={t('maxHeight 限制高度，超出后纵向滚动。不传 language 和 title、并关掉 copyable 时没有头部，只剩代码。', 'maxHeight caps the height and scrolls vertically beyond it. With no language or title and copyable turned off, there’s no header, just the code.')}>
        <Demo layout="col" code={t(CODE_MAX.zh, CODE_MAX.en)}>
          <CodeBlock code={t(MANY_LINES.zh, MANY_LINES.en)} title="worker.log" maxHeight={180} />
          <CodeBlock code="npm run dev" copyable={false} />
        </Demo>
      </DocSection>

      <DocSection title={t('接口', 'API')}>
        <PropsTable title="CodeBlock" rows={[
          { name: 'code', type: 'string', description: t('代码文本；也可以写在 children 里（只接受字符串）。', 'The code; can also go in children (strings only).') },
          { name: 'language', type: 'string', description: t(<>语言名，显示在头部，并写到 <Code>code</Code> 元素的 <Code>language-*</Code> 类名上（方便接入第三方高亮）。</>, <>Language name, shown in the header and added to the <Code>code</Code> element as a <Code>language-*</Code> class (handy for third-party highlighters).</>) },
          { name: 'title', type: 'ReactNode', description: t('标题（文件名等），显示在语言前面。', 'Title (a file name, say), shown before the language.') },
          { name: 'copyable', type: 'boolean', default: 'true', description: t('显示复制按钮。', 'Shows the copy button.') },
          { name: 'wrap', type: 'boolean', description: t('长行自动换行。默认不换行，横向滚动。', 'Wraps long lines. By default they don’t wrap and scroll horizontally.') },
          { name: 'maxHeight', type: 'number | string', description: t('最大高度，超出后纵向滚动。', 'Maximum height; scrolls vertically beyond it.') },
          { name: 'label', type: 'string', description: t('代码区域的名字（给读屏），默认取 title / language /“代码”。', 'Name of the code region (for screen readers). Defaults to title / language / “Code” (from the OinkProvider locale).') },
          { name: 'onCopy', type: '(code: string) => void', description: t('复制成功后。', 'Called after a successful copy.') },
        ]} />
        <PropsTable title="Code" rows={[
          { name: '...rest', type: 'HTMLAttributes<HTMLElement>', description: t(<>渲染成 <Code>code</Code> 元素，原生属性全部透传。</>, <>Renders a <Code>code</Code> element; all native attributes are passed through.</>) },
        ]} />
        <A11yNotes items={t([
          <>代码区域是可聚焦的 <Code>pre</Code>（<Code>role="group"</Code> + 名字）：内容超出时，键盘用户 Tab 到它上面，用方向键滚动。</>,
          '复制按钮的名字是“复制代码”；结果通过 aria-live 区域播报“已复制”或“复制失败”，不只靠图标变化。',
          '没有异步剪贴板接口（非安全上下文）时自动退回 execCommand。',
          '行内 Code 只是视觉标记，读屏不会特别提示；需要强调“这是要输入的内容”时在文字里说明。',
        ], [
          <>The code region is a focusable <Code>pre</Code> (<Code>role="group"</Code> with a name): when content overflows, keyboard users can Tab to it and scroll with the arrow keys.</>,
          'The copy button is named “Copy code”; the result is announced as “Copied” or “Copy failed” through an aria-live region, not just by the icon change.',
          'Without the async clipboard API (in an insecure context), it falls back to execCommand.',
          'Inline Code is a visual marker only and screen readers don’t call it out; if you need to stress “type this”, say so in the text.',
        ])} />
      </DocSection>
    </DocPage>
  );
}
