import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_TOKEN!);
const whatsappFrom = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER!}`;
const smsFrom = process.env.TWILIO_SMS_NUMBER!;

export async function sendWhatsApp({ to, body }: { to: string; body: string }) {
  const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const msg = await client.messages.create({ from: whatsappFrom, to: toFormatted, body });
  return { providerId: msg.sid, status: "sent" as const };
}

export async function sendSMS({ to, body }: { to: string; body: string }) {
  const msg = await client.messages.create({ from: smsFrom, to, body });
  return { providerId: msg.sid, status: "sent" as const };
}
