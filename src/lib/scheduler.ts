import { prisma } from "@/lib/db";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function checkAndSendScheduledMessages() {
  const dueMessages = await prisma.scheduledMessage.findMany({
    where: {
      status: "pending",
      scheduledAt: { lte: new Date() },
    },
    include: { contact: true },
  });

  for (const msg of dueMessages) {
    try {
      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${msg.contact.phone}`,
        body: msg.body,
      });

      await prisma.scheduledMessage.update({
        where: { id: msg.id },
        data: { status: "sent" },
      });
    } catch (err) {
      console.error("Failed to send scheduled message:", err);
      await prisma.scheduledMessage.update({
        where: { id: msg.id },
        data: { status: "failed" },
      });
    }
  }
}
