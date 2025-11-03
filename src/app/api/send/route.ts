import { NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/db";
import { Direction, MessageStatus, Channel } from "@/generated/prisma/client";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  const { to, message, channel, contactId } = await req.json();
  console.log("Incoming payload:", { to, message, channel, contactId });


  if (!to || !message || !channel || !contactId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const normalizedChannel = channel.trim().toLowerCase(); 

  try {
    switch (normalizedChannel) {
      case "whatsapp":
        await client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${to}`,
          body: message,
        });
        break;
      case "sms":
        await client.messages.create({
          from: process.env.TWILIO_SMS_NUMBER,
          to,
          body: message,
        });
        break;
      default:
        return NextResponse.json({ error: "Unsupported channel" }, { status: 400 });
    }

    console.log("Saving message with:", {
      contactId,
      body: message,
      channel: normalizedChannel,
      direction: Direction.outbound,
      status: MessageStatus.sent,
    });

    await prisma.message.create({
      data: {
        contactId,
        body: message,
        channel: normalizedChannel as Channel,
        direction: Direction.outbound,
        status: MessageStatus.sent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Send error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    console.error("Send error (non-Error):", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
