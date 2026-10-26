```
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { name, phone, tradingview } = req.body;

    if (!name || !phone || !tradingview) {
        return res.status(400).json({ error: 'All fields required' });
    }

    const SHEET_URL = process.env.SHEET_URL; // Put in Vercel Env

    try {
        await fetch(SHEET_URL, {
            method: 'POST',
            body: JSON.stringify({ name, phone, tradingview, date: new Date().toISOString() })
        });
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ error: 'Failed to save' });
    }
}
```
