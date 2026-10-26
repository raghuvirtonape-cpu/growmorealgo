export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name } = req.body;

  if (!name || name.length < 3) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  // 3 working days logic - Skip Sat & Sun
  let expiry = new Date();
  let added = 0;

  while (added < 3) {
    expiry.setDate(expiry.getDate() + 1);
    let d = expiry.getDay();
    if (d !== 0 && d !== 6) {
      added++;
    }
  }

  const dd = String(expiry.getDate()).padStart(2, '0');
  const mm = String(expiry.getMonth() + 1).padStart(2, '0');
  const yyyy = expiry.getFullYear();
  const expiryStr = `${dd}/${mm}/${yyyy}`;

  // Create payload
  const payload = {
    name: name.trim(),
    exp: expiryStr,
    product: 'Dashboard23',
    v: '2.3'
  };

  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

  // IMPORTANT: Change this secret! Must be same in MQL5
  const SECRET = process.env.LICENSE_SECRET || "GROW_MORE_2026_SECRET_KEY_CHANGE_THIS";

  const crypto = await import('crypto');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(b64)
    .digest('hex')
    .substring(0, 32);

  const licenseContent = `${b64}.${signature}\n# Do not edit - signed license`;

  res.setHeader('Content-Disposition', 'attachment; filename=License.txt');
  res.setHeader('Content-Type', 'text/plain');

  return res.status(200).send(licenseContent);
}

// Last edited: 2026-05-13 - Kept license logic same - 3 working days
