import nodemailer from "nodemailer";

const codes = {};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes[code] = Date.now();
  Object.keys(codes).forEach(k => { if (Date.now() - codes[k] > 600000) delete codes[k]; });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "ATHENA — Verification Code",
      html: `<div style="font-family:sans-serif;padding:32px;max-width:400px">
        <h2 style="font-family:Georgia,serif">ATHENA Pre-Check</h2>
        <p style="color:#666">Your verification code:</p>
        <div style="font-size:42px;font-weight:700;letter-spacing:12px;margin:24px 0">${code}</div>
        <p style="color:#999;font-size:12px">Expires in 10 minutes.</p>
      </div>`,
    });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to send email" });
  }
}
