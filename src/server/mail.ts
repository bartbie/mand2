import nodemailer from "nodemailer";
import { env } from "~/env.mjs";
import { type ContactMessage } from "./api/routers/contact";

const MAIL_ENV = {
  HOST: env.SMTP_HOST,
  PORT: Number(env.SMTP_PORT),
  USERNAME: env.SMTP_USERNAME,
  PASSWORD: env.SMTP_PASSWORD,
  SENDER: env.SMTP_SENDER,
};

const transporter = nodemailer.createTransport({
  host: MAIL_ENV.HOST,
  port: MAIL_ENV.PORT,
  secure: false,
  auth: {
    user: MAIL_ENV.USERNAME,
    pass: MAIL_ENV.PASSWORD,
  },
});

type MailData = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

async function sendMail(mail: MailData) {
  return await transporter.sendMail(mail);
}

export async function sendMessageReceivedMail(
  msg: ContactMessage
): Promise<
  | { success: true; info: Awaited<ReturnType<typeof sendMail>> }
  | { success: false; error: string }
> {
  const SUBJECT = `✔ Hey ${msg.name}! We Received you message: ${msg.subject}`;
  const subtitle = "We will contact you shortly.";

  try {
    const info = await sendMail({
      from: `"Mand2" <${MAIL_ENV.SENDER}>`,
      to: msg.email,
      subject: SUBJECT,
      html: `<h1>${SUBJECT}.</h1><h2>${subtitle}</h2><h3>Your message:</h3><h4>${msg.subject}</h4><p>${msg.message}</p>`,
      text: `${SUBJECT}.\n${subtitle}\nYour message:\n\n${msg.subject}\n${msg.message}`,
    });
    return { success: true, info };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
