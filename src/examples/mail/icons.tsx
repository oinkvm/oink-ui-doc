import { Icon } from 'oink-ui';
import type { IconProps } from 'oink-ui';
import type { AttachmentKind, FolderId } from './data';

/* 内置图标不够用的，按 20×20 描线补在这里 */
type P = Omit<IconProps, 'name' | 'children'>;
const make = (d: string[]) => function MailIcon(props: P) {
  return <Icon {...props}>{d.map((x) => <path key={x} d={x} />)}</Icon>;
};

export const InboxIcon = make(['M3 11l2-6h10l2 6v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4z', 'M3 11h4l1 2h4l1-2h4']);
export const StarIcon = make(['M10 3l2.1 4.4 4.9.7-3.5 3.4.8 4.8L10 14l-4.300 2.300.8-4.800L3 8.100l4.900-.7L10 3z']);
export const SendIcon = make(['M17 3L9 11', 'M17 3l-5 14-3-6-6-3 14-5z']);
export const DraftIcon = make(['M6 3h5l4 4v9a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z', 'M11 3v4h4']);
export const ArchiveIcon = make(['M3 5h14v3H3z', 'M4.500 8v7a1 1 0 001 1h9a1 1 0 001-1V8', 'M8 11.500h4']);
export const ClipIcon = make(['M14.500 9.500l-5 5a3 3 0 01-4.200-4.200l6-6a2 2 0 012.800 2.800l-6 6a1 1 0 01-1.400-1.400l5-5']);
export const ReplyIcon = make(['M8 5L3 10l5 5', 'M3 10h8a6 6 0 016 6']);
export const ForwardIcon = make(['M12 5l5 5-5 5', 'M17 10H9a6 6 0 00-6 6']);
export const BackIcon = make(['M12 5l-5 5 5 5']);
export const FolderIcon = make(['M3 6a1 1 0 011-1h4l2 2h6a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V6z']);
export const ExpandIcon = make(['M5 12l5-5 5 5']);
export const MailOpenIcon = make(['M3 8l7-4.500L17 8v7a1 1 0 01-1 1H4a1 1 0 01-1-1V8z', 'M3 8l7 4.500L17 8']);
export const ImageIcon = make(['M4 4h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z', 'M3 13l4-4 4 4 2-2 4 4', 'M13 7.500h.01']);
export const SheetIcon = make(['M4 4h12a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z', 'M3 8.500h14', 'M8 8.500V16']);

export function FolderGlyph({ id }: { id: FolderId }) {
  switch (id) {
    case 'inbox': return <InboxIcon />;
    case 'sent': return <SendIcon />;
    case 'drafts': return <DraftIcon />;
    case 'archive': return <ArchiveIcon />;
    case 'spam': return <Icon name="alert" />;
    default: return <Icon name="trash" />;
  }
}

export function AttachmentGlyph({ kind }: { kind: AttachmentKind }) {
  if (kind === 'image') return <ImageIcon />;
  if (kind === 'sheet') return <SheetIcon />;
  if (kind === 'zip') return <ArchiveIcon />;
  return <DraftIcon />;
}
