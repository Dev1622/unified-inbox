import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [contacts, messages, notes, scheduled] = await Promise.all([
      prisma.contact.findMany(),
      prisma.message.findMany(),
      prisma.note.findMany(),
      prisma.scheduledMessage.findMany(),
    ]);

    const perContact = contacts.map(contact => {
      const contactMessages = messages.filter(m => m.contactId === contact.id);
      const contactNotes = notes.filter(n => n.contactId === contact.id);
      const contactScheduled = scheduled.filter(s => s.contactId === contact.id);

      const channelCounts = contactMessages.reduce((acc, msg) => {
        acc[msg.channel] = (acc[msg.channel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        id: contact.id,
        name: contact.name,
        totalMessages: contactMessages.length,
        totalNotes: contactNotes.length,
        totalScheduled: contactScheduled.length,
        lastActivity: [
          ...contactMessages,
          ...contactNotes,
          ...contactScheduled,
        ]
          .map(item => new Date(item.createdAt).getTime())
          .sort((a, b) => b - a)[0] || null,
        channels: channelCounts, 
      };
    });

    return NextResponse.json({ perContact });
  } catch (err) {
    console.error('Error in /api/analytics:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
