import nodemailer from "nodemailer";
import { GMAIL, GMAIL_PASS } from "../config";
// Email

// OTP

export const GenerateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);

  let expiry = new Date();

  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { otp, expiry };
};

export const OnRequestOTP = async (otp: number, toEmail: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL,
        pass: GMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: GMAIL,
      to: toEmail,
      subject: "Hello",
      html: `
      
      <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px"
      >
        <h2>اهلا بك في موقع المتقن</h2>
        <p style="margin-bottom: 30px;">من فضلك ادخل الرمز</p>
        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>

      </div>
      
      `,
    });

    return info;
  } catch (error: any) {
    console.log(error.message);
  }
};

// Payment
