import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "FlowerrMart Support <support@flowerrmart.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html:
      options.html ||
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f43f5e, #ec4899); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🌸 FlowerrMart</h1>
        <p style="color: #ffe4e6; margin: 10px 0 0 0;">Fresh flowers, delivered with care.</p>
      </div>
      <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937; margin-top: 0;">${options.subject}</h2>
        <div style="color: #4b5563; line-height: 1.6;">
          ${options.message.replace(/\n/g, "<br>")}
        </div>
        ${
          options.resetUrl
            ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${options.resetUrl}" style="background: #f43f5e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Your Password</a>
        </div>
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
          This link will expire in 15 minutes for security reasons.<br>
          If you didn't request this password reset, please ignore this email.
        </p>`
            : ""
        }
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
          Need help? Contact our support team at support@flowerrmart.com
        </p>
      </div>
    </div>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
