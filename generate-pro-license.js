export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, txn } = req.body;
  
  // TODO: Verify txn with Razorpay/PayPal API here - For now we trust
  // const razorpayVerified = await verifyRazorpay(txn);
  // if(!razorpayVerified) return res.status(400).json({error:'Payment not verified'});

  let indExp = new Date(); indExp.setMonth(indExp.getMonth()+3);
  let kitExp = new Date(); kitExp.setFullYear(kitExp.getFullYear()+1);
  const fmt = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;

  const payload = { 
    name, 
    i_exp: fmt(indExp), 
    k_exp: fmt(kitExp), 
    type: 'PAID_1YEAR_KIT_3MONTH',
    txn: txn,
    exp: fmt(indExp)
  };
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const SECRET = process.env.LICENSE_SECRET || "GROW_MORE_2026_SECRET_KEY_CHANGE_THIS";
  const crypto = await import('crypto');
  const signature = crypto.createHmac('sha256', SECRET).update(b64).digest('hex').substring(0,32);
  
  const licenseContent = `${b64}.${signature}`;

  res.setHeader('Content-Disposition', 'attachment; filename=License_PRO.txt');
  res.setHeader('Content-Type', 'text/plain');
  return res.status(200).send(licenseContent);
}