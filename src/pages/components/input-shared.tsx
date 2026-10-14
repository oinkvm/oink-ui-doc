import { Inline, Stack, Text } from 'oink-ui';
import { useLang } from '../../i18n';

/** 规格列表：转写自原型里的规格说明（本文件没有 meta，不会被注册成页面）。英文的键更长，键列放宽一些 */
export function Specs({ items }: { items: Array<[string, string]> }) {
  const keyWidth = useLang() === 'en' ? '6.5em' : '4.5em';
  return (
    <Stack as="dl" gap={2} style={{ margin: 0 }}>
      {items.map(([k, v]) => (
        <Inline key={k} gap={3} align="baseline" wrap={false}>
          <Text as="dt" variant="label" style={{ flex: `0 0 ${keyWidth}` }}>{k}</Text>
          <Text as="dd" tone="subtle" style={{ margin: 0, minWidth: 0 }}>{v}</Text>
        </Inline>
      ))}
    </Stack>
  );
}
