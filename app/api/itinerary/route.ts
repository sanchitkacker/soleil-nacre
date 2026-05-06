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

function getDestinationPhotos(message: string): string[] {
  const msg = message.toLowerCase();
  if (msg.includes('amalfi') || msg.includes('italy') || msg.includes('positano') || msg.includes('rome')) {
    return [
      'https://images.unsplash.com/photo-1534445638895-9e762d1543f7?w=900&q=80',
      'https://images.unsplash.com/photo-1555993539-1732b0258235?w=900&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80',
    ];
  } else if (msg.includes('maldives') || msg.includes('island') || msg.includes('beach') || msg.includes('seychelles')) {
    return [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900&q=80',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&q=80',
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=900&q=80',
    ];
  } else if (msg.includes('paris') || msg.includes('france') || msg.includes('provence')) {
    return [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80',
      'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=900&q=80',
    ];
  } else if (msg.includes('bali') || msg.includes('ubud') || msg.includes('indonesia')) {
    return [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=900&q=80',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&q=80',
    ];
  } else if (msg.includes('santorini') || msg.includes('greece') || msg.includes('mykonos')) {
    return [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=80',
      'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=900&q=80',
    ];
  } else if (msg.includes('japan') || msg.includes('tokyo') || msg.includes('kyoto')) {
    return [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80',
      'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=900&q=80',
    ];
  } else if (msg.includes('swiss') || msg.includes('alps') || msg.includes('mountain')) {
    return [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=80',
      'https://images.unsplash.com/photo-1520208422220-d12a3c588574?w=900&q=80',
    ];
  } else if (msg.includes('dubai') || msg.includes('uae')) {
    return [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&q=80',
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=900&q=80',
    ];
  }
  return [
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
  ];
}

function parseItineraryDays(text: string): { day: string; content: string }[] {
  const days: { day: string; content: string }[] = [];
  const lines = text.split('\n');
  let currentDay = '';
  let currentContent: string[] = [];
  for (const line of lines) {
    if (line.match(/^Day \d+/i)) {
      if (currentDay) days.push({ day: currentDay, content: currentContent.join('\n').trim() });
      currentDay = line.trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentDay) days.push({ day: currentDay, content: currentContent.join('\n').trim() });
  return days.length > 0 ? days : [{ day: 'Your Journey', content: text }];
}

// Fetch image as base64 data URI
async function fetchImageAsDataUri(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return `data:${contentType};base64,${base64}`;
  } catch {
    return '';
  }
}

// Build a beautiful self-contained PDF HTML (all images inlined as base64)
async function buildPdfHtml(firstname: string, itinerary: string, photoUrls: string[]): Promise<string> {
  const days = parseItineraryDays(itinerary);
  const dayAccents = ['#8A7E73', '#6B7B8D', '#7D8B6E', '#8D6E7D', '#6E8D8A'];

  // Fetch all photos as base64 so they render in the PDF
  const photoData = await Promise.all(photoUrls.map(fetchImageAsDataUri));

  const daysHtml = days.map((d, i) => `
    <div style="margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid #F0EDE9;">
      <div style="padding:10px 16px;margin-bottom:12px;background:#F7F3EE;border-left:4px solid ${dayAccents[i % dayAccents.length]};border-radius:0 4px 4px 0;">
        <span style="font-size:15px;font-weight:bold;color:#111;letter-spacing:0.05em;">${d.day}</span>
      </div>
      <div style="font-size:13px;line-height:1.9;color:#444;font-family:Arial,sans-serif;">${d.content.replace(/\n/g, '<br>')}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: Georgia, serif; background: #fff; }
  @page { margin: 0; size: A4; }
</style>
</head>
<body>

<!-- PAGE 1: Cover -->
<div style="position:relative;width:210mm;height:297mm;background:#111;display:flex;align-items:center;justify-content:center;page-break-after:always;overflow:hidden;">
  ${photoData[0] ? `<img src="${photoData[0]}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.4;" />` : ''}
  <div style="position:relative;z-index:2;text-align:center;padding:48px;">
    <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.45em;text-transform:uppercase;color:#C8B8A6;margin-bottom:18px;">Privately Curated Global Journeys</p>
    <h1 style="font-size:48px;letter-spacing:0.3em;color:#fff;margin-bottom:14px;font-family:Georgia,serif;">SOLEIL NACRE</h1>
    <p style="font-size:17px;color:rgba(255,255,255,0.75);margin-bottom:40px;font-style:italic;">A Bespoke Journey, Crafted for You</p>
    <div style="border-top:1px solid rgba(255,255,255,0.2);padding-top:24px;margin-top:8px;">
      <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#C8B8A6;">Prepared exclusively for ${firstname}</p>
    </div>
  </div>
</div>

<!-- PAGE 2: Photo Grid -->
<div style="width:210mm;min-height:297mm;padding:48px;background:#fff;page-break-after:always;">
  <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#8A7E73;margin-bottom:20px;text-align:center;">Your Destination</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;grid-template-rows:260px 260px;gap:10px;">
    ${photoData[0] ? `<img src="${photoData[0]}" style="grid-row:1/3;width:100%;height:100%;object-fit:cover;border-radius:8px;" />` : '<div style="grid-row:1/3;background:#F7F3EE;border-radius:8px;"></div>'}
    ${photoData[1] ? `<img src="${photoData[1]}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />` : '<div style="background:#F7F3EE;border-radius:8px;"></div>'}
    ${photoData[2] ? `<img src="${photoData[2]}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />` : '<div style="background:#F7F3EE;border-radius:8px;"></div>'}
  </div>
  <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#C8B8A6;text-align:center;margin-top:20px;">soleilnacre.com</p>
</div>

<!-- PAGE 3+: Itinerary -->
<div style="width:210mm;padding:56px 60px;background:#fff;">
  <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:#8A7E73;margin-bottom:10px;">Your Bespoke Itinerary</p>
  <h2 style="font-size:32px;color:#111;margin-bottom:8px;font-family:Georgia,serif;">Dear ${firstname},</h2>
  <p style="font-size:14px;line-height:1.8;color:#555;font-style:italic;margin-bottom:36px;padding-bottom:28px;border-bottom:1px solid #EEE;font-family:Arial,sans-serif;">
    Thank you for reaching out to Soleil Nacre. We have carefully crafted the following journey entirely around you — your preferences, your rhythm, and the experience you deserve.
  </p>
  ${daysHtml}
  <div style="margin-top:48px;padding:40px;background:#111;border-radius:12px;text-align:center;">
    <p style="font-size:24px;letter-spacing:0.3em;color:#fff;margin-bottom:10px;font-family:Georgia,serif;">SOLEIL NACRE</p>
    <p style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#C8B8A6;margin-bottom:16px;">Privately Curated Global Journeys</p>
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#8A7E73;">soleilnacre.com &nbsp;·&nbsp; @soleil_nacre</p>
  </div>
</div>

</body>
</html>`;
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

    logs.push(`2. Fields — email: ${email}, name: ${firstname} ${lastname}`);
    if (!email) return NextResponse.json({ error: 'No email found', logs }, { status: 400 });

    // ── 1. Generate itinerary ──────────────────────────────────────────────
    logs.push('3. Calling Anthropic...');
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
Write in an elegant tone. Include Day 1-5 with morning/afternoon/evening. Name specific luxury hotels and restaurants. End with a warm closing. Plain text only, no markdown.`,
        }],
      }),
    });
    const anthropicData = await anthropicRes.json();
    logs.push(`4. Anthropic status: ${anthropicRes.status}`);
    if (!anthropicRes.ok) return NextResponse.json({ error: 'Anthropic failed', detail: anthropicData, logs }, { status: 500 });

    const itinerary = anthropicData.content?.[0]?.text || 'Your itinerary is being prepared.';
    logs.push(`5. Itinerary generated — ${itinerary.length} chars`);

    // ── 2. Get photos + build PDF HTML ────────────────────────────────────
    logs.push('6. Fetching photos...');
    const photoUrls = getDestinationPhotos(message);
    const pdfHtml = await buildPdfHtml(firstname, itinerary, photoUrls);
    logs.push(`7. PDF HTML built — ${Math.round(pdfHtml.length / 1024)}KB`);

    // ── 3. Convert HTML to PDF via Gotenberg (free open API) ─────────────
    logs.push('8. Generating PDF via API...');
    let pdfBase64 = '';
    try {
      const formData = new FormData();
      formData.append('files', new Blob([pdfHtml], { type: 'text/html' }), 'index.html');
      formData.append('marginTop', '0');
      formData.append('marginBottom', '0');
      formData.append('marginLeft', '0');
      formData.append('marginRight', '0');
      formData.append('printBackground', 'true');

      const pdfRes = await fetch('https://gotenberg.marcflorent.com/forms/chromium/convert/html', {
        method: 'POST',
        body: formData,
      });

      if (pdfRes.ok) {
        const pdfBuffer = await pdfRes.arrayBuffer();
        pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
        logs.push(`9. PDF generated — ${Math.round(pdfBase64.length / 1024)}KB`);
      } else {
        logs.push(`9. PDF API failed: ${pdfRes.status} — falling back to HTML`);
      }
    } catch (pdfErr) {
      logs.push(`9. PDF error: ${String(pdfErr)} — falling back to HTML`);
    }

    // ── 4. Send email ──────────────────────────────────────────────────────
    logs.push('10. Sending email...');
    const emailPayload: Record<string, unknown> = {
      from: `Soleil Nacre Concierge <${FROM_EMAIL}>`,
      to: [email],
      subject: 'Your Bespoke Journey — Soleil Nacre',
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F3EE;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background:#111;padding:40px;text-align:center;">
    <p style="margin:0;color:#C8B8A6;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;font-family:Arial,sans-serif;">Privately Curated Global Journeys</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:28px;letter-spacing:0.3em;font-family:Georgia,serif;">SOLEIL NACRE</h1>
  </td></tr>
  <tr><td style="padding:0;"><img src="${photoUrls[0]}" style="width:100%;height:220px;object-fit:cover;display:block;" /></td></tr>
  <tr><td style="padding:40px 48px 24px;">
    <p style="margin:0 0 8px;color:#8A7E73;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;font-family:Arial,sans-serif;">Your Bespoke Itinerary</p>
    <h2 style="margin:0 0 16px;color:#111;font-size:24px;font-family:Georgia,serif;">Dear ${firstname},</h2>
    <p style="margin:0;color:#555;font-size:15px;line-height:1.8;font-family:Arial,sans-serif;">
      ${pdfBase64
        ? 'Thank you for reaching out to Soleil Nacre. Your personalised itinerary is attached as a beautifully designed PDF — crafted entirely around you.'
        : 'Thank you for reaching out to Soleil Nacre. Your personalised journey is below.'}
    </p>
    ${!pdfBase64 ? `<div style="margin-top:24px;color:#333;font-size:14px;line-height:1.9;font-family:Arial,sans-serif;white-space:pre-wrap;">${itinerary.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>` : ''}
  </td></tr>
  <tr><td style="padding:8px 48px 48px;text-align:center;">
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
    };

    if (pdfBase64) {
      emailPayload.attachments = [{
        filename: `Soleil-Nacre-Itinerary-${firstname}-${lastname}.pdf`,
        content: pdfBase64,
      }];
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });
    const emailData = await emailRes.json();
    logs.push(`11. Resend: ${emailRes.status} — id: ${emailData.id}`);
    if (!emailRes.ok) return NextResponse.json({ error: 'Resend failed', detail: emailData, logs }, { status: 500 });

    return NextResponse.json({ success: true, email_id: emailData.id, pdf_generated: !!pdfBase64, logs });

  } catch (err) {
    logs.push(`EXCEPTION: ${String(err)}`);
    return NextResponse.json({ error: String(err), logs }, { status: 500 });
  }
}
