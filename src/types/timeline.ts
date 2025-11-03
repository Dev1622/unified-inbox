import { Message, Note, ScheduledMessage } from '@/generated/prisma/client';

export type TimelineItem =
  | { type: 'message'; data: Message }
  | { type: 'note'; data: Note }
  | { type: 'scheduled'; data: ScheduledMessage };
