import crypto from "crypto";

const SECRET = process.env.CODE_SECRET || "athena-secret-key-2024";

function verifyToken(token, submittedCode) {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [storedCode, expires, sig] = parts;
    if (Date.now() > parseInt(expires)) return false;
    const payload = `${storedCode}:${expires}`;
    const expectedSig = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (sig !== expectedSig) return false;
    return storedCode === submittedCode;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { code, token } = req.body;
  if (!code || !token) return res.status(400).json({ error: "Missing code or token" });
  if (verifyToken(token, code)) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid or expired code" });
  }
}
