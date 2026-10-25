export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const SHEET_URL = process.env.SHEET_URL; // Put your sheet URL in Vercel Env
  try {
    await fetch(SHEET_URL, { method: 'POST', body: JSON.stringify(req.body) });
    return res.status(200).json({ok:true});
  } catch(e){
    return res.status(500).json({error:'fail'});
  }
}