import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

function detectChannel(from: string | null) {
  if (!from) return "sms";
  return from.startsWith("whatsapp:") ? "whatsapp" : "sms";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const from = (form.get("From") as string) ?? null;
    const body = (form.get("Body") as string) ?? "";
    const providerId = (form.get("MessageSid") as string) ?? null;
    const mediaUrl = (form.get("MediaUrl0") as string) ?? null;

    if (!from) {
      console.warn("[TWILIO_WEBHOOK] Missing 'From'");
      return NextResponse.json({ error: "Missing 'From'" }, { status: 400 });
    }
    const channel = detectChannel(from);
    const normalizedFrom = from.replace("whatsapp:", "");

    let contact = await prisma.contact.findFirst({ where: { phone: normalizedFrom } });
    if (!contact) {
      contact = await prisma.contact.create({
        data: { name: normalizedFrom, phone: normalizedFrom },
      });
    }

    await prisma.message.create({
      data: {
        contactId: contact.id,
        channel,
        direction: "inbound",
        body,
        mediaUrl: mediaUrl ?? undefined,
        providerId: providerId ?? undefined,
        status: "received",
        receivedAt: new Date(),
      },
    });

     await prisma.contact.update({
      where: { id: contact.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[TWILIO_WEBHOOK_ERROR]", err);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
