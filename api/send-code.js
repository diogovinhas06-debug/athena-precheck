import nodemailer from "nodemailer";
import crypto from "crypto";

const SECRET = process.env.CODE_SECRET || "athena-secret-key-2024";

function signCode(code) {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = `${code}:${expires}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const token = signCode(code);

  const emails = (process.env.NOTIFY_EMAILS || process.env.GMAIL_USER || "").split(",").map(e => e.trim()).filter(Boolean);
  if (!emails.length) return res.status(500).json({ error: "No recipient emails configured" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"ATHENA System" <${process.env.GMAIL_USER}>`,
      to: emails.join(", "),
      subject: "ATHENA Dev Access Code",
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:24px;">
          <h2 style="color:#1C1C1C;margin-bottom:8px;">ATHENA Developer Access</h2>
          <p style="color:#666;margin-bottom:20px;">Your one-time access code:</p>
          <div style="background:#E4F577;border-radius:10px;padding:20px;text-align:center;font-size:36px;font-weight:700;letter-spacing:8px;color:#1C1C1C;">${code}</div>
          <p style="color:#999;font-size:12px;margin-top:16px;">Expires in 10 minutes. Do not share this code.</p>
        </div>
      `,
    });
    res.status(200).json({ token });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
