import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'concierge@soleilnacre.com';

export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    anthropic_key_set: !!process.env.ANTHROPIC_API_KEY,
    resend_key_set: !!RESEND_API_KEY,
  });
}

export async function POST(req: NextRequest) {
  const logs: string[] = [];

  try {
    const body = await req.json();
    logs.push('1. Body parsed OK');

    const event = Array.isArray(body) ? body[0] : body;
    const properties = event?.properties || event;

    const firstname = properties?.firstname?.value || properties?.firstname || 'Valued Guest';
    const lastname  = properties?.lastname?.value  || properties?.lastname  || '';
    const email     = properties?.email?.value     || properties?.email;
    const message   = properties?.message?.value   || properties?.message   || '';

    logs.push(`2. Fields parsed — email: ${email}, name: ${firstname} ${lastname}`);

    if (!email) {
      return NextResponse.json({ error: 'No email found', logs }, { status: 400 });
    }

    // ── Step 1: Generate itinerary via Anthropic REST (no SDK, avoids cold-start issues) ──
    logs.push('3. Calling Anthropic API...');
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `You are the concierge at Soleil Nacre, an ultra-luxury private travel company. Write a personalised 5-day luxury itinerary for this client.

Client: ${firstname} ${lastname}
Inquiry: "${message}"

Write in an elegant tone. Include Day 1-5 with morning/afternoon/evening. Name specific hotels and restaurants. End with a warm closing. Plain text only, no markdown symbols.`,
        }],
      }),
    });

    const anthropicData = await anthropicRes.json();
    logs.push(`4. Anthropic status: ${anthropicRes.status}`);

    if (!anthropicRes.ok) {
      logs.push(`Anthropic error: ${JSON.stringify(anthropicData)}`);
      return NextResponse.json({ error: 'Anthropic failed', detail: anthropicData, logs }, { status: 500 });
    }

    const itinerary = anthropicData.content?.[0]?.text || 'Your itinerary is being prepared.';
    logs.push(`5. Itinerary generated — ${itinerary.length} chars`);

    // ── Step 2: Send email via Resend ──
    logs.push('6. Sending email via Resend...');
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Soleil Nacre Concierge <${FROM_EMAIL}>`,
        to: [email],
        subject: 'Your Bespoke Journey — Soleil Nacre',
        html: `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:#111;padding:40px;text-align:center;">
          <p style="margin:0;color:#C8B8A6;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;font-family:Arial,sans-serif;">Privately Curated Global Journeys</p>
          <h1 style="margin:12px 0 0;color:#fff;font-size:28px;letter-spacing:0.3em;font-family:Georgia,serif;">SOLEIL NACRE</h1>
        </td></tr>
        <tr><td style="padding:40px 48px 24px;">
          <p style="margin:0 0 8px;color:#8A7E73;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;font-family:Arial,sans-serif;">Your Bespoke Itinerary</p>
          <h2 style="margin:0 0 24px;color:#111;font-size:24px;font-family:Georgia,serif;">Dear ${firstname},</h2>
          <p style="margin:0;color:#555;font-size:15px;line-height:1.8;font-family:Arial,sans-serif;">Thank you for reaching out to Soleil Nacre. We have carefully considered your inquiry and prepared a personalised journey crafted entirely around you.</p>
        </td></tr>
        <tr><td style="padding:0 48px;"><hr style="border:none;border-top:1px solid #EEE;"></td></tr>
        <tr><td style="padding:32px 48px 40px;">
          <div style="color:#333;font-size:15px;line-height:1.9;font-family:Arial,sans-serif;white-space:pre-wrap;">${itinerary.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </td></tr>
        <tr><td style="padding:0 48px 48px;text-align:center;">
          <a href="https://soleilnacre.com" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">Refine Your Journey</a>
        </td></tr>
        <tr><td style="background:#F7F3EE;padding:28px 48px;text-align:center;border-top:1px solid #EEE;">
          <p style="margin:0;color:#AAAAAA;font-size:11px;font-family:Arial,sans-serif;">
            <a href="https://soleilnacre.com" style="color:#8A7E73;text-decoration:none;">soleilnacre.com</a> &nbsp;·&nbsp;
            <a href="https://instagram.com/soleil_nacre" style="color:#8A7E73;text-decoration:none;">@soleil_nacre</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
      }),
    });

    const emailData = await emailRes.json();
    logs.push(`7. Resend status: ${emailRes.status} — ${JSON.stringify(emailData)}`);

    if (!emailRes.ok) {
      return NextResponse.json({ error: 'Resend failed', detail: emailData, logs }, { status: 500 });
    }

    return NextResponse.json({ success: true, email_id: emailData.id, logs });

  } catch (err) {
    logs.push(`EXCEPTION: ${String(err)}`);
    return NextResponse.json({ error: String(err), logs }, { status: 500 });
  }
}
