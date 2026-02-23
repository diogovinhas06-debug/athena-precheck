const codes = {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { code } = req.body || {};

  if (!code) {
    return res.status(400).json({ error: "Code required" });
  }

  const timestamp = codes[code];

  if (!timestamp) {
    return res.status(400).json({ error: "Invalid code" });
  }

  if (Date.now() - timestamp > 600000) {
    delete codes[code];
    return res.status(400).json({ error: "Code expired" });
  }

  delete codes[code];
  return res.status(200).json({ success: true });
}
