import { NextRequest, NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';

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
  if (msg.includes('amalfi') || msg.includes('italy') || msg.includes('positano') || msg.includes('rome'))
    return ['https://images.unsplash.com/photo-1534445638895-9e762d1543f7?w=900&q=80','https://images.unsplash.com/photo-1555993539-1732b0258235?w=900&q=80','https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=80'];
  if (msg.includes('maldives') || msg.includes('beach') || msg.includes('seychelles') || msg.includes('island'))
    return ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=900&q=80','https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=900&q=80','https://images.unsplash.com/photo-1540202404-a2f29016b523?w=900&q=80'];
  if (msg.includes('paris') || msg.includes('france') || msg.includes('provence'))
    return ['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&q=80','https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900&q=80','https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=900&q=80'];
  if (msg.includes('bali') || msg.includes('ubud') || msg.includes('indonesia'))
    return ['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900&q=80','https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=900&q=80','https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&q=80'];
  if (msg.includes('santorini') || msg.includes('greece') || msg.includes('mykonos'))
    return ['https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=900&q=80','https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=80','https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=900&q=80'];
  if (msg.includes('japan') || msg.includes('tokyo') || msg.includes('kyoto'))
    return ['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80','https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=900&q=80','https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=900&q=80'];
  if (msg.includes('swiss') || msg.includes('alps') || msg.includes('mountain'))
    return ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80','https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=900&q=80','https://images.unsplash.com/photo-1520208422220-d12a3c588574?w=900&q=80'];
  if (msg.includes('dubai') || msg.includes('uae'))
    return ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80','https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&q=80','https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=900&q=80'];
  return [
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=900&q=80',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
  ];
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url + '&w=600&q=60', { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch { return null; }
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

async function generatePDF(firstname: string, lastname: string, itinerary: string, photoUrls: string[]): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
    const buffers: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const W = 595.28;
    const H = 841.89;
    const margin = 56;
    const accentColors = ['#8A7E73', '#6B7B8D', '#7D8B6E', '#8D6E7D', '#6E8D8A'];

    // Fetch only ONE small cover photo to keep PDF generation fast
    const photoBuffers = [await fetchImageBuffer(photoUrls[0]), null, null];

    // ── PAGE 1: Cover ────────────────────────────────────────────────────
    doc.addPage();

    // Dark background
    doc.rect(0, 0, W, H).fill('#111111');

    // Cover photo
    if (photoBuffers[0]) {
      try {
        doc.save();
        doc.rect(0, 0, W, H).clip();
        doc.image(photoBuffers[0], 0, 0, { width: W, height: H });
        doc.restore();
        // Dark overlay
        doc.rect(0, 0, W, H).fill('rgba(0,0,0,0.55)');
      } catch { doc.rect(0, 0, W, H).fill('#111111'); }
    }

    // Cover text
    const centerX = W / 2;
    doc.fontSize(9).font('Helvetica').fillColor('#C8B8A6')
      .text('PRIVATELY CURATED GLOBAL JOURNEYS', 0, H * 0.38, { align: 'center', characterSpacing: 3.5, width: W });

    doc.fontSize(42).font('Helvetica-Bold').fillColor('#FFFFFF')
      .text('SOLEIL NACRE', 0, H * 0.38 + 22, { align: 'center', characterSpacing: 6, width: W });

    doc.fontSize(14).font('Helvetica-Oblique').fillColor('rgba(255,255,255,0.75)')
      .text('A Bespoke Journey, Crafted for You', 0, H * 0.38 + 76, { align: 'center', width: W });

    // Divider line
    doc.moveTo(centerX - 60, H * 0.38 + 120).lineTo(centerX + 60, H * 0.38 + 120)
      .strokeColor('rgba(255,255,255,0.25)').lineWidth(0.5).stroke();

    doc.fontSize(9).font('Helvetica').fillColor('#C8B8A6')
      .text(`Prepared exclusively for ${firstname} ${lastname}`, 0, H * 0.38 + 136, { align: 'center', characterSpacing: 2, width: W });

    // (Photo grid page removed for performance — cover photo used instead)

    // ── PAGE 3+: Itinerary ───────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, W, H).fill('#FFFFFF');

    let y = margin;

    doc.fontSize(9).font('Helvetica').fillColor('#8A7E73')
      .text('YOUR BESPOKE ITINERARY', margin, y, { characterSpacing: 3 });
    y += 22;

    doc.fontSize(28).font('Helvetica-Bold').fillColor('#111111')
      .text(`Dear ${firstname},`, margin, y, { width: W - margin * 2 });
    y += 44;

    doc.fontSize(12).font('Helvetica-Oblique').fillColor('#777777')
      .text('Thank you for reaching out to Soleil Nacre. We have carefully crafted the following journey entirely around you — your preferences, your rhythm, and the experience you deserve.', margin, y, { width: W - margin * 2, lineGap: 4 });
    y += 60;

    // Divider
    doc.moveTo(margin, y).lineTo(W - margin, y).strokeColor('#EEEEEE').lineWidth(0.5).stroke();
    y += 24;

    const days = parseItineraryDays(itinerary);

    for (let i = 0; i < days.length; i++) {
      const d = days[i];

      // Check if we need a new page
      if (y > H - 180) {
        doc.addPage();
        doc.rect(0, 0, W, H).fill('#FFFFFF');
        y = margin;
      }

      // Day accent bar
      const accent = accentColors[i % accentColors.length];
      doc.rect(margin, y, 3, 22).fill(accent);
      doc.rect(margin + 3, y, W - margin * 2 - 3, 22).fill('#F7F3EE');
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#111111')
        .text(d.day, margin + 14, y + 5, { width: W - margin * 2 - 14 });
      y += 32;

      // Day content — split into lines and render
      const contentLines = d.content.split('\n').filter(l => l.trim());
      for (const line of contentLines) {
        if (y > H - 80) {
          doc.addPage();
          doc.rect(0, 0, W, H).fill('#FFFFFF');
          y = margin;
        }
        const isSection = line.match(/^(morning|afternoon|evening):/i);
        if (isSection) {
          doc.fontSize(10).font('Helvetica-Bold').fillColor(accent)
            .text(line, margin, y, { width: W - margin * 2 });
        } else {
          doc.fontSize(11).font('Helvetica').fillColor('#444444')
            .text(line, margin, y, { width: W - margin * 2, lineGap: 2 });
        }
        y += doc.currentLineHeight(true) + 4;
      }
      y += 16;

      // Section divider
      if (i < days.length - 1) {
        doc.moveTo(margin, y).lineTo(W - margin, y).strokeColor('#F0EDE9').lineWidth(0.5).stroke();
        y += 16;
      }
    }

    // ── Final footer band ────────────────────────────────────────────────
    if (y > H - 120) { doc.addPage(); doc.rect(0, 0, W, H).fill('#FFFFFF'); y = margin; }

    y += 24;
    doc.rect(margin, y, W - margin * 2, 100).fill('#111111');
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#FFFFFF')
      .text('SOLEIL NACRE', margin, y + 18, { align: 'center', width: W - margin * 2, characterSpacing: 4 });
    doc.fontSize(8).font('Helvetica').fillColor('#C8B8A6')
      .text('PRIVATELY CURATED GLOBAL JOURNEYS', margin, y + 48, { align: 'center', width: W - margin * 2, characterSpacing: 2.5 });
    doc.fontSize(9).font('Helvetica').fillColor('#8A7E73')
      .text('soleilnacre.com  ·  @soleil_nacre', margin, y + 68, { align: 'center', width: W - margin * 2 });

    doc.end();
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

    // ── 1. Generate itinerary ──────────────────────────────────────────
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
Write elegantly. Include Day 1-5 with Morning:, Afternoon:, Evening: sections. Name specific luxury hotels and restaurants. End with a warm closing. Plain text only, no markdown symbols.`,
        }],
      }),
    });
    const anthropicData = await anthropicRes.json();
    logs.push(`4. Anthropic status: ${anthropicRes.status}`);
    if (!anthropicRes.ok) return NextResponse.json({ error: 'Anthropic failed', detail: anthropicData, logs }, { status: 500 });
    const itinerary = anthropicData.content?.[0]?.text || '';
    logs.push(`5. Itinerary: ${itinerary.length} chars`);

    // ── 2. Generate PDF (with 25s timeout so email always sends) ─────
    logs.push('6. Generating PDF...');
    let pdfBase64 = '';
    const photoUrls = getDestinationPhotos(message);
    try {
      const pdfPromise = generatePDF(firstname, lastname, itinerary, photoUrls);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('PDF timeout after 40s')), 40000)
      );
      const pdfBuffer = await Promise.race([pdfPromise, timeoutPromise]);
      pdfBase64 = pdfBuffer.toString('base64');
      logs.push(`7. PDF done — ${Math.round(pdfBase64.length / 1024)}KB`);
    } catch (pdfErr) {
      logs.push(`7. PDF failed: ${String(pdfErr)}`);
    }

    // ── 3. Send email ──────────────────────────────────────────────────
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
  <tr><td style="padding:0;"><img src="${photoUrls[0]}" style="width:100%;height:220px;object-fit:cover;display:block;" /></td></tr>
  <tr><td style="padding:40px 48px 32px;">
    <p style="margin:0 0 8px;color:#8A7E73;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;font-family:Arial,sans-serif;">Your Bespoke Itinerary</p>
    <h2 style="margin:0 0 16px;color:#111;font-size:24px;font-family:Georgia,serif;">Dear ${firstname},</h2>
    <p style="margin:0;color:#555;font-size:15px;line-height:1.8;font-family:Arial,sans-serif;">
      ${pdfBase64
        ? 'Thank you for reaching out to Soleil Nacre. Your personalised itinerary is beautifully designed and attached as a PDF — crafted entirely around you.'
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
    logs.push(`9. Resend: ${emailRes.status} — id: ${emailData.id}`);
    if (!emailRes.ok) return NextResponse.json({ error: 'Resend failed', detail: emailData, logs }, { status: 500 });

    return NextResponse.json({ success: true, email_id: emailData.id, pdf_generated: !!pdfBase64, logs });

  } catch (err) {
    logs.push(`EXCEPTION: ${String(err)}`);
    return NextResponse.json({ error: String(err), logs }, { status: 500 });
  }
}
