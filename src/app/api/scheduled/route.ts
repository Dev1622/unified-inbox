import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get('contactId');

    if (!contactId) {
      return NextResponse.json({ error: 'Missing contactId' }, { status: 400 });
    }

    const scheduled = await prisma.scheduledMessage.findMany({
      where: { contactId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(scheduled);
  } catch (err) {
    console.error('Error in GET /api/scheduled:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { contactId, body, scheduledAt, channel } = await req.json();

    const parsedDate = new Date(scheduledAt);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid scheduledAt date' }, { status: 400 });
    }

    await prisma.scheduledMessage.create({
      data: {
        contactId,
        body,
        scheduledAt: parsedDate,
        channel,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in POST /api/scheduled:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
