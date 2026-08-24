"use server";

import transporter from "@/lib/nodemailer";

interface MetaDataProps {
  description: string;
  link: string;
}

interface SendEmailActionProps {
  to: string;
  subject: string;
  meta: MetaDataProps;
}

const styles = {
  page: "margin:0;padding:32px 16px;background:#f5f3ff;font-family:Arial,Helvetica,sans-serif;",
  container:
    "max-width:520px;margin:0 auto;padding:32px;background:#ffffff;border:1px solid #ddd6fe;border-radius:16px;",
  brand:
    "margin:0 0 20px;color:#5b21b6;font-size:13px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;",
  heading:
    "margin:0 0 14px;color:#1e1b4b;font-size:26px;font-weight:700;line-height:1.3;",
  paragraph: "margin:0 0 24px;color:#4c4b63;font-size:16px;line-height:1.7;",
  button:
    "display:inline-block;padding:13px 22px;background:#6d28d9;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;border-radius:10px;",
  footer:
    "margin:28px 0 0;padding-top:20px;border-top:1px solid #ede9fe;color:#7c7a92;font-size:13px;line-height:1.6;",
};

export default async function sendEmailAction({
  to,
  subject,
  meta,
}: SendEmailActionProps) {
  const mailOption = {
    from: `"BetterAuthy" <${process.env.NODEMAILER_USER}>`,
    to,
    subject: `BetterAuthy • ${subject}`,
    html: `
      <div style="${styles.container}">
        <h1 style="${styles.heading}">${subject}</h1>

        <p style="${styles.paragraph}">
          ${meta.description}
        </p>

        <a href="${meta.link}" style="${styles.button}">
          Reset Password
        </a>

        <p style="${styles.footer}">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOption);

    console.log("Email sent successfully");
    console.log(info);

    return info;
  } catch (error) {
    console.error("Failed to send email:", error);

    throw new Error(
      "Unable to send the email at this time. Please try again later.",
    );
  }
}
