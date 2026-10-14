import { useState } from 'react';
import { Button, Field, FileDrop, Stack, Text } from 'oink-ui';
import { A11yNotes, Demo, DocPage, DocSection, PropsTable } from '../../doc';
import type { PageMeta } from '../../registry';
import { useT } from '../../i18n';

export const meta: PageMeta = { path: '/components/file-drop', title: 'FileDrop 文件拖放', group: '表单与操作', order: 170, subtitle: 'FileDrop', en: { title: 'FileDrop' } };

const box = { width: '100%', maxWidth: 460 };
const kb = (n: number) => (n < 1024 * 1024 ? Math.max(1, Math.round(n / 1024)) + ' KB' : (n / 1024 / 1024).toFixed(1) + ' MB');

function UploadDemo() {
  const t = useT();
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<File[]>([]);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <Field
        label={t('附件', 'Attachments')}
        hint={t('PNG / JPG / PDF，单个不超过 2 MB', 'PNG / JPG / PDF, up to 2 MB each')}
        error={rejected.length ? t(`${rejected.map((f) => f.name).join('、')} 不符合要求`, `Not accepted: ${rejected.map((f) => f.name).join(', ')}`) : undefined}
      >
        <FileDrop
          multiple
          accept="image/png,image/jpeg,.pdf"
          maxSize={2 * 1024 * 1024}
          onChange={(list) => { setFiles((prev) => [...prev, ...list]); setRejected([]); }}
          onReject={setRejected}
        />
      </Field>
      {files.length > 0 && (
        <Stack as="ul" gap={1} style={{ margin: 0, paddingLeft: 20 }}>
          {files.map((f, i) => <Text as="li" key={i} variant="caption">{t(`${f.name}（${kb(f.size)}）`, `${f.name} (${kb(f.size)})`)}</Text>)}
        </Stack>
      )}
      {files.length > 0 && <Button size="sm" variant="ghost" onClick={() => setFiles([])} style={{ alignSelf: 'start' }}>{t('清空列表', 'Clear list')}</Button>}
    </Stack>
  );
}

const UPLOAD_CODE = {
  zh: `
const kb = (n: number) => (n < 1024 * 1024 ? Math.max(1, Math.round(n / 1024)) + ' KB' : (n / 1024 / 1024).toFixed(1) + ' MB');

function UploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<File[]>([]);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <Field label="附件" hint="PNG / JPG / PDF，单个不超过 2 MB" error={rejected.length ? \`\${rejected.map((f) => f.name).join('、')} 不符合要求\` : undefined}>
        <FileDrop
          multiple
          accept="image/png,image/jpeg,.pdf"
          maxSize={2 * 1024 * 1024}
          onChange={(list) => { setFiles((prev) => [...prev, ...list]); setRejected([]); }}
          onReject={setRejected}
        />
      </Field>
      {files.length > 0 && (
        <Stack as="ul" gap={1} style={{ margin: 0, paddingLeft: 20 }}>
          {files.map((f, i) => <Text as="li" key={i} variant="caption">{f.name}（{kb(f.size)}）</Text>)}
        </Stack>
      )}
      {files.length > 0 && <Button size="sm" variant="ghost" onClick={() => setFiles([])} style={{ alignSelf: 'start' }}>清空列表</Button>}
    </Stack>
  );
}
`,
  en: `
const kb = (n: number) => (n < 1024 * 1024 ? Math.max(1, Math.round(n / 1024)) + ' KB' : (n / 1024 / 1024).toFixed(1) + ' MB');

function UploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<File[]>([]);
  return (
    <Stack gap={3} style={{ width: '100%', maxWidth: 460 }}>
      <Field label="Attachments" hint="PNG / JPG / PDF, up to 2 MB each" error={rejected.length ? \`Not accepted: \${rejected.map((f) => f.name).join(', ')}\` : undefined}>
        <FileDrop
          multiple
          accept="image/png,image/jpeg,.pdf"
          maxSize={2 * 1024 * 1024}
          onChange={(list) => { setFiles((prev) => [...prev, ...list]); setRejected([]); }}
          onReject={setRejected}
        />
      </Field>
      {files.length > 0 && (
        <Stack as="ul" gap={1} style={{ margin: 0, paddingLeft: 20 }}>
          {files.map((f, i) => <Text as="li" key={i} variant="caption">{f.name} ({kb(f.size)})</Text>)}
        </Stack>
      )}
      {files.length > 0 && <Button size="sm" variant="ghost" onClick={() => setFiles([])} style={{ alignSelf: 'start' }}>Clear list</Button>}
    </Stack>
  );
}
`,
};

export default function FileDropPage() {
  const t = useT();
  return (
    <DocPage
      title={t('FileDrop 文件拖放', 'FileDrop')}
      subtitle="FileDrop"
      lead={t(
        '让用户把文件拖进来或点击选择。组件只负责收文件并按类型、大小筛选，不负责上传；已选文件的列表和上传进度请自己展示。',
        'Lets people drag files in or click to choose them. The component only receives files and filters them by type and size; it doesn’t upload. Show the list of chosen files and upload progress yourself.',
      )}
    >
      <DocSection title={t('基本用法', 'Basic usage')} description={t(
        '背后是一个铺满整块的真 input[type=file]：点击、或 Tab 聚焦后按空格 / Enter，都由浏览器打开文件选择框。拖着文件经过时整块高亮。',
        'Underneath is a real input[type=file] covering the whole area: clicking, or focusing with Tab and pressing Space / Enter, lets the browser open its file picker. The whole area highlights while a file is dragged over it.',
      )}>
        <Demo
          layout="col"
          code={t(`
<FileDrop aria-label="上传文件" style={{ width: '100%', maxWidth: 460 }} />
`, `
<FileDrop aria-label="Upload files" style={{ width: '100%', maxWidth: 460 }} />
`)}
        >
          <FileDrop aria-label={t('上传文件', 'Upload files')} style={box} />
        </Demo>
      </DocSection>

      <DocSection title={t('筛选、列表与错误', 'Filtering, lists and errors')} description={t(
        'accept 支持扩展名、MIME 和 image/* 这类通配；maxSize 是单个文件的字节上限。通过的文件进 onChange，被挡下的进 onReject。组件是非受控的：每次选择只回传这一次的文件，累加和去重由你决定。',
        'accept takes extensions, MIME types and wildcards like image/*; maxSize is the per-file limit in bytes. Files that pass go to onChange, the rest to onReject. The component is uncontrolled: each selection reports only that batch of files, and accumulating or de-duplicating is up to you.',
      )}>
        <Demo layout="col" code={t(UPLOAD_CODE.zh, UPLOAD_CODE.en)}>
          <UploadDemo />
        </Demo>
      </DocSection>

      <DocSection title={t('文案与状态', 'Text and states')}>
        <Demo
          layout="col"
          code={t(`
<Stack gap={4} style={{ width: '100%', maxWidth: 460 }}>
  <FileDrop title="上传头像" hint="建议 400 × 400 以上的正方形图片" accept="image/*" />
  <FileDrop title="校验失败" hint="请重新选择文件" invalid />
  <FileDrop title="暂时不能上传" hint="存储空间已满" disabled />
</Stack>
`, `
<Stack gap={4} style={{ width: '100%', maxWidth: 460 }}>
  <FileDrop title="Upload avatar" hint="A square image, 400 × 400 or larger" accept="image/*" />
  <FileDrop title="Validation failed" hint="Please choose another file" invalid />
  <FileDrop title="Uploads unavailable" hint="Storage is full" disabled />
</Stack>
`)}
        >
          <Stack gap={4} style={box}>
            <FileDrop title={t('上传头像', 'Upload avatar')} hint={t('建议 400 × 400 以上的正方形图片', 'A square image, 400 × 400 or larger')} accept="image/*" />
            <FileDrop title={t('校验失败', 'Validation failed')} hint={t('请重新选择文件', 'Please choose another file')} invalid />
            <FileDrop title={t('暂时不能上传', 'Uploads unavailable')} hint={t('存储空间已满', 'Storage is full')} disabled />
          </Stack>
        </Demo>
      </DocSection>

      <DocSection title={t('API', 'API')}>
        <PropsTable
          rows={[
            { name: 'onChange', type: '(files: File[]) => void', description: t('选了或拖入了文件：参数是通过筛选的文件。没开 multiple 时最多一个。', 'Files were chosen or dropped: called with the files that passed the filters. At most one without multiple.') },
            { name: 'onReject', type: '(files: File[]) => void', description: t('被 accept / maxSize 挡下的文件。', 'Files blocked by accept / maxSize.') },
            { name: 'accept', type: 'string', description: t('允许的类型，逗号分隔：.pdf、image/png、image/*。拖入的文件也按它筛选。', 'Allowed types, comma-separated: .pdf, image/png, image/*. Dropped files are filtered by it too.') },
            { name: 'multiple', type: 'boolean', description: t('允许一次选多个。', 'Allow choosing several at once.') },
            { name: 'maxSize', type: 'number', description: t('单个文件的大小上限（字节）。', 'Maximum size per file (bytes).') },
            { name: 'title', type: 'ReactNode', default: t("'把文件拖到这里，或点击选择'", "'Drop files here, or click to browse'"), description: t('主文案。', 'Main text. The default follows the OinkProvider locale.') },
            { name: 'hint', type: 'ReactNode', description: t('副文案（格式、大小限制等）。', 'Secondary text (formats, size limits and so on).') },
            { name: 'icon', type: 'ReactNode', description: t('自定义图标，默认是上传图标。', 'Custom icon; defaults to an upload icon.') },
            { name: 'invalid', type: 'boolean', description: t('校验失败。在 Field 里默认跟随 Field。', 'Failed validation. Inside a Field it follows the Field by default.') },
            { name: 'disabled', type: 'boolean', description: t('禁用：不能点击，也不接收拖入。', 'Disabled: can’t be clicked and doesn’t accept drops.') },
            { name: 'children', type: 'ReactNode', description: t('追加在文案下面的内容。', 'Extra content below the text.') },
            { name: 'rootClassName / rootStyle', type: 'string / CSSProperties', description: t('外层 <label> 的类名与样式。className / style 同样落在 <label> 上。', 'Class and style for the outer <label>. className / style also land on the <label>.') },
            { name: '…rest', type: 'InputHTMLAttributes', description: t('其余原生属性（name、required、capture…）和 ref 落在 <input type="file"> 上。', 'Other native attributes (name, required, capture…) and ref go to the <input type="file">.') },
          ]}
        />
        <A11yNotes
          items={t([
            <>真正可聚焦的是原生 <code>&lt;input type="file"&gt;</code>，外层是包着它的 <code>&lt;label&gt;</code>，所以主文案和副文案就是它的可读名称。</>,
            <><kbd>Tab</kbd> 聚焦，<kbd>Space</kbd> / <kbd>Enter</kbd> 打开系统的文件选择框。拖放只是鼠标用户的捷径，键盘始终可用。</>,
            <>选完后组件里有一行 aria-live 文字播报结果（“已选择 a.png”“2 个文件不符合要求”）。</>,
            <>被拒绝的原因请写进 Field 的 error，说清楚是哪个文件、为什么。</>,
            <>没有可见标题时请给 <code>aria-label</code>。</>,
          ], [
            <>What actually takes focus is a native <code>&lt;input type="file"&gt;</code>, wrapped in a <code>&lt;label&gt;</code>, so the main and secondary text form its accessible name.</>,
            <><kbd>Tab</kbd> focuses it and <kbd>Space</kbd> / <kbd>Enter</kbd> open the system file picker. Drag and drop is only a shortcut for mouse users; the keyboard always works.</>,
            <>After a selection, an aria-live line in the component announces the result (“Selected a.png”, “2 files not accepted”).</>,
            <>Put the reason for a rejection in the Field’s error, saying which file and why.</>,
            <>Without a visible title, give it an <code>aria-label</code>.</>,
          ])}
        />
      </DocSection>
    </DocPage>
  );
}
