export type Message = {
  id: string;
  body: string;
  direction: 'inbound' | 'outbound';
  channel: 'whatsapp' | 'sms' | 'email';
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'received';
  sentAt: string | null;
  receivedAt: string | null;
  createdAt: string;
  mediaUrl?: string;
  providerId?: string;
  userId?: string;
};

export type Thread = {
  id: string;
  name: string;
  phone: string;
  channel: 'whatsapp' | 'sms' | 'email';
  messages: Message[];
  lastMessage?: string;
  lastSentAt?: string;
};
