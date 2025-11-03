import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; 

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[MESSAGE_DELETE_ERROR]', err);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
