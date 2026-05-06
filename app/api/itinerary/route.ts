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

function getDestinationPhoto(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('amalfi') || msg.includes('italy') || msg.includes('positano') || msg.includes('rome'))
    return 'https://images.unsplash.com/photo-1534445638895-9e762d1543f7?w=800&q=75';
  if (msg.includes('maldives') || msg.includes('beach') || msg.includes('seychelles') || msg.includes('island'))
    return 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=75';
  if (msg.includes('paris') || msg.includes('france') || msg.includes('provence'))
    return 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=75';
  if (msg.includes('bali') || msg.includes('ubud') || msg.includes('indonesia'))
    return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=75';
  if (msg.includes('santorini') || msg.includes('greece') || msg.includes('mykonos'))
    return 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=75';
  if (msg.includes('japan') || msg.includes('tokyo') || msg.includes('kyoto'))
    return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=75';
  if (msg.includes('swiss') || msg.includes('alps') || msg.includes('mountain'))
    return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=75';
  if (msg.includes('dubai') || msg.includes('uae'))
    return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=75';
  return 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=75';
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

async function tryGeneratePDF(firstname: string, lastname: string, itinerary: string, photoUrl: string): Promise<string> {
  const { default: PDFDocument } = await import('pdfkit');

  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
      const buffers: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers).toString('base64')));
      doc.on('error', reject);

      const W = 595.28;
      const H = 841.89;
      const M = 52;
      const accentColors = ['#8A7E73', '#6B7B8D', '#7D8B6E', '#8D6E7D', '#6E8D8A'];

      // ── PAGE 1: Cover ──────────────────────────────────────────────
      doc.addPage();
      doc.rect(0, 0, W, H).fill('#111111');

      // Try to load cover photo
      try {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), 6000);
        const imgRes = await fetch(photoUrl, { signal: ctrl.signal });
        if (imgRes.ok) {
          const imgBuf = Buffer.from(await imgRes.arrayBuffer());
          doc.save();
          doc.rect(0, 0, W, H).clip();
          doc.image(imgBuf, 0, 0, { width: W, height: H });
          doc.restore();
        }
      } catch { /* no photo — dark cover still looks great */ }

      // Dark overlay
      doc.rect(0, 0, W, H).fill('#00000088');

      // Cover text
      doc.fontSize(9).font('Helvetica').fillColor('#C8B8A6')
        .text('PRIVATELY CURATED GLOBAL JOURNEYS', 0, H * 0.40, { align: 'center', characterSpacing: 3, width: W });
      doc.fontSize(40).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('SOLEIL NACRE', 0, H * 0.40 + 20, { align: 'center', characterSpacing: 5, width: W });
      doc.fontSize(14).font('Helvetica-Oblique').fillColor('rgba(255,255,255,0.75)')
        .text('A Bespoke Journey, Crafted for You', 0, H * 0.40 + 72, { align: 'center', width: W });
      doc.moveTo(W / 2 - 50, H * 0.40 + 114).lineTo(W / 2 + 50, H * 0.40 + 114)
        .strokeColor('#ffffff44').lineWidth(0.5).stroke();
      doc.fontSize(9).font('Helvetica').fillColor('#C8B8A6')
        .text(`Prepared exclusively for ${firstname} ${lastname}`.toUpperCase(), 0, H * 0.40 + 126, { align: 'center', characterSpacing: 2, width: W });

      // ── PAGE 2: Itinerary ──────────────────────────────────────────
      doc.addPage();
      doc.rect(0, 0, W, H).fill('#FFFFFF');

      let y = M;

      doc.fontSize(9).font('Helvetica').fillColor('#8A7E73')
        .text('YOUR BESPOKE ITINERARY', M, y, { characterSpacing: 3 });
      y += 20;

      doc.fontSize(26).font('Helvetica-Bold').fillColor('#111111')
        .text(`Dear ${firstname},`, M, y, { width: W - M * 2 });
      y += 40;

      doc.fontSize(11).font('Helvetica-Oblique').fillColor('#777777')
        .text('Thank you for reaching out to Soleil Nacre. We have carefully crafted the following journey entirely around you — your preferences, your rhythm, and the experience you deserve.', M, y, { width: W - M * 2, lineGap: 3 });
      y += 56;

      doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#EEEEEE').lineWidth(0.5).stroke();
      y += 20;

      const days = parseItineraryDays(itinerary);

      for (let i = 0; i < days.length; i++) {
        if (y > H - 160) {
          doc.addPage();
          doc.rect(0, 0, W, H).fill('#FFFFFF');
          y = M;
        }

        const accent = accentColors[i % accentColors.length];
        doc.rect(M, y, 3, 20).fill(accent);
        doc.rect(M + 3, y, W - M * 2 - 3, 20).fill('#F7F3EE');
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#111111')
          .text(days[i].day, M + 12, y + 4, { width: W - M * 2 - 12 });
        y += 28;

        const lines = days[i].content.split('\n').filter(l => l.trim());
        for (const line of lines) {
          if (y > H - 80) {
            doc.addPage();
            doc.rect(0, 0, W, H).fill('#FFFFFF');
            y = M;
          }
          const isLabel = line.match(/^(morning|afternoon|evening):/i);
          if (isLabel) {
            doc.fontSize(9).font('Helvetica-Bold').fillColor(accent)
              .text(line.toUpperCase(), M, y, { width: W - M * 2 });
          } else {
            doc.fontSize(10.5).font('Helvetica').fillColor('#444444')
              .text(line, M, y, { width: W - M * 2, lineGap: 2 });
          }
          y += doc.currentLineHeight(true) + 3;
        }
        y += 14;

        if (i < days.length - 1) {
          doc.moveTo(M, y).lineTo(W - M, y).strokeColor('#F0EDE9').lineWidth(0.5).stroke();
          y += 14;
        }
      }

      // Footer band
      if (y > H - 110) { doc.addPage(); doc.rect(0, 0, W, H).fill('#FFFFFF'); y = M; }
      y += 20;
      doc.rect(M, y, W - M * 2, 90).fill('#111111');
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#FFFFFF')
        .text('SOLEIL NACRE', M, y + 16, { align: 'center', width: W - M * 2, characterSpacing: 4 });
      doc.fontSize(8).font('Helvetica').fillColor('#C8B8A6')
        .text('PRIVATELY CURATED GLOBAL JOURNEYS', M, y + 42, { align: 'center', width: W - M * 2, characterSpacing: 2 });
      doc.fontSize(9).font('Helvetica').fillColor('#8A7E73')
        .text('soleilnacre.com  ·  @soleil_nacre', M, y + 60, { align: 'center', width: W - M * 2 });

      doc.end();
    } catch (e) {
      reject(e);
    }
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

    logs.push(`2. Fields — email: ${email}, name: ${firstname} ${lastname}`);
    if (!email) return NextResponse.json({ error: 'No email found', logs }, { status: 400 });

    // ── 1. Generate itinerary ────────────────────────────────────────
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
          content: `You are the concierge at Soleil Nacre, an ultra-luxury private travel company. Write a personalised 5-day luxury itinerary.
Client: ${firstname} ${lastname}
Inquiry: "${message}"
Format each day as:
Day 1: [Title]
Morning: [details]
Afternoon: [details]
Evening: [details]
Name specific luxury hotels and restaurants. Elegant tone. No markdown symbols.`,
        }],
      }),
    });
    const anthropicData = await anthropicRes.json();
    logs.push(`4. Anthropic: ${anthropicRes.status}`);
    if (!anthropicRes.ok) return NextResponse.json({ error: 'Anthropic failed', detail: anthropicData, logs }, { status: 500 });
    const itinerary = anthropicData.content?.[0]?.text || '';
    logs.push(`5. Itinerary: ${itinerary.length} chars`);

    // ── 2. Generate PDF — totally isolated, never blocks email ───────
    const photoUrl = getDestinationPhoto(message);
    let pdfBase64 = '';
    try {
      logs.push('6. Generating PDF...');
      pdfBase64 = await Promise.race([
        tryGeneratePDF(firstname, lastname, itinerary, photoUrl),
        new Promise<string>((_, reject) => setTimeout(() => reject(new Error('timeout')), 35000)),
      ]);
      logs.push(`7. PDF: ${Math.round(pdfBase64.length / 1024)}KB`);
    } catch (e) {
      logs.push(`7. PDF skipped: ${String(e)}`);
      pdfBase64 = '';
    }

    // ── 3. Send email — always runs ───────────────────────────────────
    logs.push('8. Sending email...');
    const emailPayload: Record<string, unknown> = {
      from: `Soleil Nacre Concierge <${FROM_EMAIL}>`,
      to: [email],
      subject: 'Your Bespoke Journey — Soleil Nacre',
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F3EE;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background:#111;padding:40px;text-align:center;">
    <p style="margin:0;color:#C8B8A6;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;font-family:Arial,sans-serif;">Privately Curated Global Journeys</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:28px;letter-spacing:0.3em;font-family:Georgia,serif;">SOLEIL NACRE</h1>
  </td></tr>
  <tr><td style="padding:0;"><img src="${photoUrl}" width="600" style="width:100%;height:220px;object-fit:cover;display:block;" /></td></tr>
  <tr><td style="padding:40px 48px 32px;">
    <p style="margin:0 0 8px;color:#8A7E73;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;font-family:Arial,sans-serif;">Your Bespoke Itinerary</p>
    <h2 style="margin:0 0 16px;color:#111;font-size:24px;font-family:Georgia,serif;">Dear ${firstname},</h2>
    <p style="margin:0 0 20px;color:#555;font-size:15px;line-height:1.8;font-family:Arial,sans-serif;">
      ${pdfBase64 ? 'Your personalised itinerary is attached as a beautifully designed PDF. Please find it below.' : 'Thank you for reaching out. Your personalised journey is below.'}
    </p>
    <div style="color:#333;font-size:14px;line-height:1.9;font-family:Arial,sans-serif;white-space:pre-wrap;">${itinerary.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
  </td></tr>
  <tr><td style="padding:24px 48px 48px;text-align:center;">
    <a href="https://soleilnacre.com" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:16px 36px;border-radius:50px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">Refine Your Journey</a>
  </td></tr>
  <tr><td style="background:#F7F3EE;padding:28px 48px;text-align:center;border-top:1px solid #EEE;">
    <p style="margin:0;color:#AAAAAA;font-size:11px;font-family:Arial,sans-serif;">
      <a href="https://soleilnacre.com" style="color:#8A7E73;text-decoration:none;">soleilnacre.com</a> &nbsp;·&nbsp;
      <a href="https://instagram.com/soleil_nacre" style="color:#8A7E73;text-decoration:none;">@soleil_nacre</a>
    </p>
  </td></tr>
</table></td></tr></table>
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
    logs.push(`9. Resend: ${emailRes.status} — ${emailData.id}`);
    if (!emailRes.ok) return NextResponse.json({ error: 'Resend failed', detail: emailData, logs }, { status: 500 });

    return NextResponse.json({ success: true, email_id: emailData.id, pdf_generated: !!pdfBase64, logs });

  } catch (err) {
    logs.push(`EXCEPTION: ${String(err)}`);
    return NextResponse.json({ error: String(err), logs }, { status: 500 });
  }
}
