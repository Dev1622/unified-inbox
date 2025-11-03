import { sendWhatsApp, sendSMS } from "./twilio";
import { sendEmail } from "./resend";

type SendPayload = { to: string; body: string };
type SendResult = { providerId?: string; status?: "queued" | "sent" | "failed" };

export function createSender(channel: "whatsapp" | "sms" | "email") {
  return {
    async send(payload: SendPayload): Promise<SendResult> {
      switch (channel) {
        case "whatsapp":
          return sendWhatsApp(payload);
        case "sms":
          return sendSMS(payload);
        case "email":
          return sendEmail(payload);
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }
    },
  };
}
