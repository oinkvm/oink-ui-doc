import type { ReactNode } from 'react';
import { Card, DescriptionList, Kbd } from 'oink-ui';

/** 规格表：转写自原型里的 demo__specs，一行一个“名目 —— 取值” */
export function Specs({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <Card size="sm">
      <DescriptionList divided items={items.map(([term, description]) => ({ key: term, term, description }))} />
    </Card>
  );
}

/** 一串按键：<Keys k="ArrowLeft ArrowRight" /> */
export function Keys({ k }: { k: string }) {
  return (
    <>
      {k.split(' ').map((key, i) => (
        <span key={key}>{i > 0 && ' '}<Kbd size="sm">{key}</Kbd></span>
      ))}
    </>
  );
}
