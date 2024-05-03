import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export enum MailType {
  THRESHOLD_LIGHT = "THRESHOLD_LIGHT",
  THRESHOLD_TEMPERATURE = "THRESHOLD_TEMPERATURE",
  THRESHOLD_HUMIDITY = "THRESHOLD_HUMIDITY",
  THRESHOLD_LED = "THRESHOLD_LED",
  THRESHOLD_FAN = "THRESHOLD_FAN",
}

export const MailMessage: Record<MailType, string> = {
  [MailType.THRESHOLD_TEMPERATURE]: "The temperature is currently over the threshold.",
  [MailType.THRESHOLD_LIGHT]: "The light level is currently over the threshold.",
  [MailType.THRESHOLD_HUMIDITY]: "The humidity level is currently over the threshold.",
  [MailType.THRESHOLD_LED]: "The LED usage is currently over the threshold.",
  [MailType.THRESHOLD_FAN]: "The fan is currently over the threshold.",
};

class MailService {
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private static instance: MailService;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_APP_USERNAME,
        pass: process.env.MAIL_APP_PASSWORD,
      },
    });
  }

  public static getInstance() {
    if (!MailService.instance) {
      MailService.instance = new MailService();
    }
    return MailService.instance;
  }

  async sendEmail(emails: string[], type: MailType) {
    const mailInfo = await this.transporter.sendMail({
      from: `"YoloHome App" <${process.env.MAIL_APP_USERNAME}>`,
      to: emails,
      subject: "YoloHome Warning",
      text: "This is a warning email from YoloHome App",
      html: `
        <h2>This is a message from YoloHome App</h2>
        <p>${MailMessage[type]} Please be aware!</p>
      `,
    });
    mailInfo.accepted.forEach(email =>
      console.log(`Send a ${type} email to ${email} successfully`)
    );
    mailInfo.rejected.forEach(email =>
      console.log(`Send a ${type} email to ${email} failed`)
    );
  }
}

export default MailService;
