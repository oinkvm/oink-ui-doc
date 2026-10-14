import { useState } from 'react';
import { Field, Stack, Textarea } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/textarea', title: 'Textarea 多行输入', group: '表单与操作', order: 30, subtitle: 'Textarea', en: { title: 'Textarea' } };

const box = { width: '100%', maxWidth: 420 };
const MAX = 80;

function CounterDemo() {
  const t = useT();
  const [bio, setBio] = useState(t('喜欢把界面做得安静一点。', 'I like my interfaces on the quiet side.'));
  const over = bio.length > MAX;
  return (
    <Field
      label={t('个人简介', 'Bio')}
      hint={`${bio.length} / ${MAX}`}
      error={over ? t(`最多 ${MAX} 个字`, `${MAX} characters at most`) : undefined}
      style={{ width: '100%', maxWidth: 420 }}
    >
      <Textarea value={bio} onChange={setBio} minRows={2} />
    </Field>
  );
}

const COUNTER_CODE = {
  zh: `
const MAX = 80;

function CounterDemo() {
  const [bio, setBio] = useState('喜欢把界面做得安静一点。');
  const over = bio.length > MAX;
  return (
    <Field label="个人简介" hint={\`\${bio.length} / \${MAX}\`} error={over ? \`最多 \${MAX} 个字\` : undefined} style={{ width: '100%', maxWidth: 420 }}>
      <Textarea value={bio} onChange={setBio} minRows={2} />
    </Field>
  );
}
`,
  en: `
const MAX = 80;

function CounterDemo() {
  const [bio, setBio] = useState('I like my interfaces on the quiet side.');
  const over = bio.length > MAX;
  return (
    <Field label="Bio" hint={\`\${bio.length} / \${MAX}\`} error={over ? \`\${MAX} characters at most\` : undefined} style={{ width: '100%', maxWidth: 420 }}>
      <Textarea value={bio} onChange={setBio} minRows={2} />
    </Field>
  );
}
`,
};

export default function TextareaPage() {
  const t = useT();
  return (
    <DocPage
      title={t('Textarea 多行输入', 'Textarea')}
      subtitle="Textarea"
      lead={t(
        '收集多行文字：备注、评论、描述。默认随内容自动增高，不需要用户拖拽。',
        'Collects multiple lines of text: notes, comments, descriptions. By default it grows with its content, so nobody has to drag it taller.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '默认最少 3 行，内容变多时自动增高。和 Input 一样需要标签：放进 Field 或给 aria-label。',
        'At least 3 rows by default, growing as content is added. Like Input, it needs a label: put it in a Field or give it an aria-label.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Field label="备注" hint="选填" style={{ width: '100%', maxWidth: 420 }}>
  <Textarea placeholder="写点什么…" />
</Field>
`, `
<Field label="Notes" hint="Optional" style={{ width: '100%', maxWidth: 420 }}>
  <Textarea placeholder="Write something…" />
</Field>
`)}
        >
          <Field label={t('备注', 'Notes')} hint={t('选填', 'Optional')} style={box}>
            <Textarea placeholder={t('写点什么…', 'Write something…')} />
          </Field>
        </Demo>
      </DocSection>

      <DocSection title={t('行数与增高', 'Rows and growth')} description={t(
        'minRows / maxRows 限定高度范围，超过 maxRows 后在内部滚动。关闭 autoGrow 后高度固定，可以用 resize 允许手动拖拽。',
        'minRows / maxRows bound the height; past maxRows it scrolls internally. With autoGrow off the height is fixed, and resize can allow manual dragging.',
      )}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={4} style={{ width: '100%', maxWidth: 420 }}>
  <Textarea aria-label="最少 1 行，最多 4 行" minRows={1} maxRows={4} placeholder="最少 1 行，最多 4 行，多打几行试试" />
  <Textarea aria-label="固定高度" autoGrow={false} minRows={4} placeholder="固定 4 行，不自动增高" />
  <Textarea aria-label="可拖拽" autoGrow={false} resize="vertical" placeholder="固定高度，可以拖右下角改高度" />
</Stack>
`, `
<Stack gap={4} style={{ width: '100%', maxWidth: 420 }}>
  <Textarea aria-label="1 to 4 rows" minRows={1} maxRows={4} placeholder="1 to 4 rows; type a few lines to try it" />
  <Textarea aria-label="Fixed height" autoGrow={false} minRows={4} placeholder="Fixed at 4 rows, no auto-grow" />
  <Textarea aria-label="Resizable" autoGrow={false} resize="vertical" placeholder="Fixed height; drag the bottom-right corner to resize" />
</Stack>
`)}
        >
          <Stack gap={4} style={box}>
            <Textarea aria-label={t('最少 1 行，最多 4 行', '1 to 4 rows')} minRows={1} maxRows={4} placeholder={t('最少 1 行，最多 4 行，多打几行试试', '1 to 4 rows; type a few lines to try it')} />
            <Textarea aria-label={t('固定高度', 'Fixed height')} autoGrow={false} minRows={4} placeholder={t('固定 4 行，不自动增高', 'Fixed at 4 rows, no auto-grow')} />
            <Textarea aria-label={t('可拖拽', 'Resizable')} autoGrow={false} resize="vertical" placeholder={t('固定高度，可以拖右下角改高度', 'Fixed height; drag the bottom-right corner to resize')} />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('状态', 'States')}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={4} style={{ width: '100%', maxWidth: 420 }}>
  <Textarea disabled aria-label="禁用" defaultValue="不可编辑" minRows={2} />
  <Textarea readOnly aria-label="只读" defaultValue="只读，可以选中复制" minRows={2} />
  <Field label="退款原因" error="请至少写 10 个字">
    <Textarea defaultValue="坏了" minRows={2} />
  </Field>
</Stack>
`, `
<Stack gap={4} style={{ width: '100%', maxWidth: 420 }}>
  <Textarea disabled aria-label="Disabled" defaultValue="Not editable" minRows={2} />
  <Textarea readOnly aria-label="Read-only" defaultValue="Read-only, but you can select and copy" minRows={2} />
  <Field label="Reason for refund" error="Please write at least 10 characters">
    <Textarea defaultValue="Broken" minRows={2} />
  </Field>
</Stack>
`)}
        >
          <Stack gap={4} style={box}>
            <Textarea disabled aria-label={t('禁用', 'Disabled')} defaultValue={t('不可编辑', 'Not editable')} minRows={2} />
            <Textarea readOnly aria-label={t('只读', 'Read-only')} defaultValue={t('只读，可以选中复制', 'Read-only, but you can select and copy')} minRows={2} />
            <Field label={t('退款原因', 'Reason for refund')} error={t('请至少写 10 个字', 'Please write at least 10 characters')}>
              <Textarea defaultValue={t('坏了', 'Broken')} minRows={2} />
            </Field>
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('受控用法', 'Controlled usage')} description={t(
        'onChange 的参数是新值。下面用它做了一个字数统计和超长校验。',
        'onChange is called with the new value. Below it drives a character count and a length check.',
      )}>
        <Demo layout="col" code={t(COUNTER_CODE.zh, COUNTER_CODE.en)}>
          <CounterDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'value', type: 'string', description: t('当前值（受控）。', 'Current value (controlled).') },
            { name: 'defaultValue', type: 'string', default: "''", description: t('初始值（非受控）。', 'Initial value (uncontrolled).') },
            { name: 'onChange', type: '(value: string) => void', description: t('值变化时触发，参数是新值。', 'Fires with the new value when it changes.') },
            { name: 'autoGrow', type: 'boolean', default: 'true', description: t('随内容自动增高。优先用 CSS field-sizing，不支持的浏览器用脚本量高度。', 'Grow with the content. Uses CSS field-sizing where available and measures with script elsewhere.') },
            { name: 'minRows', type: 'number', default: '3', description: t('最少行数。', 'Minimum number of rows.') },
            { name: 'maxRows', type: 'number', description: t('最多行数，超过后内部滚动。', 'Maximum number of rows; scrolls internally beyond that.') },
            { name: 'resize', type: "'none' | 'vertical'", default: "'none'", description: t('允许手动拖拽改高度；关闭 autoGrow 时才有意义。', 'Allow resizing the height by dragging; only meaningful with autoGrow off.') },
            { name: 'invalid', type: 'boolean', description: t('校验失败：标红并设置 aria-invalid。在 Field 里默认跟随 Field。', 'Failed validation: turns red and sets aria-invalid. Inside a Field it follows the Field by default.') },
            { name: '…rest', type: 'TextareaHTMLAttributes', description: t('其余原生属性、className、style 和 ref 都落在 <textarea> 上。', 'Other native attributes, className, style and ref all go to the <textarea>.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>根节点就是原生 <code>&lt;textarea&gt;</code>（多行 textbox）。<kbd>Enter</kbd> 换行，<kbd>Tab</kbd> 离开。</>,
            <>必须有可读名称：放进带 label 的 Field，或给 <code>aria-label</code>。</>,
            <>内容超过 maxRows 后的滚动是浏览器原生滚动，方向键和 PageUp / PageDown 照常可用。</>,
            <>校验失败时设置 <code>aria-invalid</code>；Field 的提示和错误通过 <code>aria-describedby</code> 关联。</>,
            <>字数统计这类持续变化的文字不要放进 aria-live 区域，免得每打一个字都播报。</>,
          ], [
            <>The root is a native <code>&lt;textarea&gt;</code> (a multi-line textbox). <kbd>Enter</kbd> adds a line and <kbd>Tab</kbd> leaves.</>,
            <>It must have an accessible name: put it in a labelled Field or give it an <code>aria-label</code>.</>,
            <>Scrolling beyond maxRows is the browser’s native scrolling, so arrow keys and PageUp / PageDown work as usual.</>,
            <>Failed validation sets <code>aria-invalid</code>; the Field’s hint and error are linked via <code>aria-describedby</code>.</>,
            <>Don’t put constantly changing text such as a character count in an aria-live region, or every keystroke gets announced.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
