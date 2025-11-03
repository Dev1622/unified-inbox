import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const contactId = searchParams.get("contactId");

  if (!contactId) {
    return NextResponse.json({ error: "Missing contactId" }, { status: 400 });
  }

  const notes = await prisma.note.findMany({
    where: { contactId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const { contactId, body } = await req.json();

  await prisma.note.create({
    data: { contactId, body },
  });

  return NextResponse.json({ success: true });
}
