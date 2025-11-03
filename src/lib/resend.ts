import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const fromEmail = process.env.RESEND_FROM_EMAIL!;

export async function sendEmail({ to, body }: { to: string; body: string }) {
  const res = await resend.emails.send({
    from: fromEmail,
    to,
    subject: "Unified Inbox",
    html: `<div style="font-family:sans-serif;font-size:14px;line-height:1.5">${body}</div>`,
  });

  const providerId = res.data?.id;
  const status: "sent" | "failed" = res.error ? "failed" : "sent"; // ✅ narrow type

  return { providerId, status };
}

