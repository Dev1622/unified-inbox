import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { sentAt: 'asc' },
        },
      },
    });

    const threads = contacts.map((contact) => {
      const lastMessage = contact.messages[contact.messages.length - 1];
      return {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        lastMessage: lastMessage?.body ?? null,
        lastSentAt: lastMessage?.sentAt ?? null,
        messages: contact.messages.map((msg) => ({
          id: msg.id,
          body: msg.body,
          direction: msg.direction,
          channel: msg.channel,
          sentAt: msg.sentAt,
        })),
      };
    });

    return NextResponse.json({ threads });
  } catch (err) {
    console.error('[THREAD_FETCH_ERROR]', err);
    return NextResponse.json({ error: 'Failed to fetch threads' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
