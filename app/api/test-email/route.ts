import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const to = searchParams.get('to') || 'test@example.com';

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

  // Step 1: Check env vars
  if (!RESEND_API_KEY) return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });
  if (!ANTHROPIC_KEY) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });

  // Step 2: Check Resend domain status
  const domainsRes = await fetch('https://api.resend.com/domains', {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });
  const domainsData = await domainsRes.json();

  // Step 3: Try sending a simple test email
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Soleil Nacre <concierge@soleilnacre.com>',
      to: [to],
      subject: 'Soleil Nacre — Email Test',
      html: '<h2>It works!</h2><p>Your Resend + Soleil Nacre email setup is working correctly.</p>',
    }),
  });
  const emailData = await emailRes.json();

  return NextResponse.json({
    resend_key_prefix: RESEND_API_KEY.slice(0, 10) + '...',
    anthropic_key_set: !!ANTHROPIC_KEY,
    domains: domainsData,
    email_send_status: emailRes.status,
    email_send_response: emailData,
  });
}
