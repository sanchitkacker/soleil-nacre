import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'concierge@soleilnacre.com';

// GET endpoint — for testing the route is live and env vars are set
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    anthropic_key_set: !!process.env.ANTHROPIC_API_KEY,
    resend_key_set: !!process.env.RESEND_API_KEY,
    from_email: FROM_EMAIL,
  });
}

// POST — called by HubSpot webhook OR directly for testing
export async function POST(req: NextRequest) {
  const logs: string[] = [];

  try {
    const body = await req.json();
    logs.push(`Body received: ${JSON.stringify(body).slice(0, 300)}`);

    // HubSpot webhook sends an array of events
    const event = Array.isArray(body) ? body[0] : body;
    const properties = event?.properties || event;
    logs.push(`Properties: ${JSON.stringify(properties).slice(0, 300)}`);

    const firstname = properties?.firstname?.value || properties?.firstname || 'Valued Guest';
    const lastname  = properties?.lastname?.value  || properties?.lastname  || '';
    const email     = properties?.email?.value     || properties?.email;
    const message   = properties?.message?.value   || properties?.message   || '';

    logs.push(`Parsed — name: ${firstname} ${lastname}, email: ${email}, message: ${message.slice(0, 100)}`);

    if (!email) {
      return NextResponse.json({ error: 'No email found in payload', logs }, { status: 400 });
    }

    // ── 1. Generate itinerary with Claude ──────────────────────────────────
    logs.push('Calling Claude API...');
    const claudeResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `You are the concierge at Soleil Nacre, an ultra-luxury private travel company. A new client has submitted an inquiry. Create a beautifully written, personalised 5-day luxury itinerary for them based on their message.

Client name: ${firstname} ${lastname}
Their inquiry: "${message}"

Guidelines:
- If no specific destination is mentioned, choose the most fitting luxury destination based on the tone of their message
- Write in an elegant, editorial tone — warm but refined, like a letter from a trusted concierge
- Include: a brief personal opening, day-by-day itinerary (Day 1–5), each day with morning / afternoon / evening suggestions, specific luxury hotels, restaurants, and experiences by name
- End with a warm closing inviting them to reply with any adjustments
- Format in clean plain text with clear Day headers — no markdown symbols like ** or ##
- Keep it personal, specific, and aspirational`,
        },
      ],
    });

    const itinerary =
      claudeResponse.content[0].type === 'text'
        ? claudeResponse.content[0].text
        : 'Your personalised itinerary is being prepared and will follow shortly.';

    logs.push(`Claude responded — itinerary length: ${itinerary.length} chars`);

    // ── 2. Send email via Resend ───────────────────────────────────────────
    logs.push('Sending email via Resend...');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#111111;padding:40px;text-align:center;">
            <p style="margin:0;color:#C8B8A6;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;font-family:Arial,sans-serif;">Privately Curated Global Journeys</p>
            <h1 style="margin:12px 0 0;color:#ffffff;font-size:28px;letter-spacing:0.3em;font-family:Georgia,serif;">SOLEIL NACRE</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 48px 24px;">
            <p style="margin:0 0 8px;color:#8A7E73;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;font-family:Arial,sans-serif;">Your Bespoke Itinerary</p>
            <h2 style="margin:0 0 24px;color:#111111;font-size:24px;font-family:Georgia,serif;">Dear ${firstname},</h2>
            <p style="margin:0;color:#555555;font-size:15px;line-height:1.8;font-family:Arial,sans-serif;">
              Thank you for reaching out to Soleil Nacre. We have carefully considered your inquiry and prepared a personalised journey crafted entirely around you.
            </p>
          </td>
        </tr>
        <tr><td style="padding:0 48px;"><hr style="border:none;border-top:1px solid #EEEEEE;margin:0;"></td></tr>
        <tr>
          <td style="padding:32px 48px 40px;">
            <div style="color:#333333;font-size:15px;line-height:1.9;font-family:Arial,sans-serif;white-space:pre-wrap;">${itinerary.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 48px 48px;text-align:center;">
            <a href="https://soleilnacre.com" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">
              Refine Your Journey
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#F7F3EE;padding:28px 48px;text-align:center;border-top:1px solid #EEEEEE;">
            <p style="margin:0 0 4px;color:#8A7E73;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,sans-serif;">Soleil Nacre</p>
            <p style="margin:0;color:#AAAAAA;font-size:11px;font-family:Arial,sans-serif;">
              <a href="https://soleilnacre.com" style="color:#8A7E73;text-decoration:none;">soleilnacre.com</a> &nbsp;·&nbsp;
              <a href="https://instagram.com/soleil_nacre" style="color:#8A7E73;text-decoration:none;">@soleil_nacre</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Soleil Nacre Concierge <${FROM_EMAIL}>`,
        to: [email],
        subject: `Your Bespoke Journey — Soleil Nacre`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();
    logs.push(`Resend response: ${JSON.stringify(resendData)}`);

    if (!resendRes.ok) {
      throw new Error(`Resend error: ${JSON.stringify(resendData)}`);
    }

    return NextResponse.json({ success: true, message: `Itinerary sent to ${email}`, logs });
  } catch (error) {
    console.error('Itinerary generation error:', error);
    return NextResponse.json({ error: String(error), logs }, { status: 500 });
  }
}
