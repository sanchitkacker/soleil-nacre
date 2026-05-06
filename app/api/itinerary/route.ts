import { NextRequest, NextResponse } from 'next/server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'concierge@soleilnacre.com';
export const maxDuration = 60;

export async function GET() {
  return NextResponse.json({ status: 'ok', anthropic_key_set: !!process.env.ANTHROPIC_API_KEY, resend_key_set: !!RESEND_API_KEY });
}

function getDestinationPhoto(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('amalfi') || m.includes('italy') || m.includes('positano')) return 'https://images.unsplash.com/photo-1534445638895-9e762d1543f7?w=800&q=70';
  if (m.includes('maldives') || m.includes('beach') || m.includes('seychelles')) return 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=70';
  if (m.includes('paris') || m.includes('france') || m.includes('provence')) return 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=70';
  if (m.includes('bali') || m.includes('ubud')) return 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=70';
  if (m.includes('santorini') || m.includes('greece') || m.includes('mykonos')) return 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=70';
  if (m.includes('japan') || m.includes('tokyo') || m.includes('kyoto')) return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=70';
  if (m.includes('swiss') || m.includes('alps') || m.includes('mountain')) return 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=70';
  if (m.includes('dubai') || m.includes('uae')) return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=70';
  return 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=70';
}

function parseItineraryDays(text: string): { day: string; content: string }[] {
  const days: { day: string; content: string }[] = [];
  let currentDay = '';
  let currentContent: string[] = [];
  for (const line of text.split('\n')) {
    if (/^Day \d+/i.test(line)) {
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
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const W = 595.28;
  const H = 841.89;
  const ML = 56; // margin left/right
  const accents = ['#8A7E73', '#6B7B8D', '#7D8B6E', '#8D6E7D', '#6E8D8A'];

  // ── COVER PAGE ──────────────────────────────────────────────────────
  // Background
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, W, H, 'F');

  // Cover photo
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 6000);
    const imgRes = await fetch(photoUrl, { signal: ctrl.signal });
    if (imgRes.ok) {
      const b64 = Buffer.from(await imgRes.arrayBuffer()).toString('base64');
      doc.addImage('data:image/jpeg;base64,' + b64, 'JPEG', 0, 0, W, H);
      // Overlay: draw dark rect on top (jsPDF has no native opacity without GState plugin)
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, W, H, 'F'); // This is opaque — workaround: use a semi-opaque PNG trick
    }
  } catch { /* keep dark bg */ }

  // Re-draw background after image attempt so text is always visible
  // (if image loaded, it's behind; we overlay with a dark rect)
  // Actually: draw image THEN dark rect — but rect will fully cover image
  // Fix: DON'T draw dark rect; instead draw image with lower portion darkened
  // Simpler fix: draw image then add a gradient-like overlay using multiple rects at low alpha
  // jsPDF doesn't support alpha without plugin, so: draw image at full, add brand box behind text

  // Brand box behind text for legibility
  const boxY = H * 0.35;
  const boxH = 200;
  doc.setFillColor(0, 0, 0);
  doc.roundedRect(ML, boxY, W - ML * 2, boxH, 4, 4, 'F');

  // Cover text inside box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 184, 166);
  doc.text('PRIVATELY CURATED GLOBAL JOURNEYS', W / 2, boxY + 28, { align: 'center', charSpace: 2.5 });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(34);
  doc.setTextColor(255, 255, 255);
  doc.text('SOLEIL NACRE', W / 2, boxY + 72, { align: 'center', charSpace: 5 });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(210, 210, 210);
  doc.text('A Bespoke Journey, Crafted for You', W / 2, boxY + 102, { align: 'center' });

  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.4);
  doc.line(W / 2 - 45, boxY + 120, W / 2 + 45, boxY + 120);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 184, 166);
  doc.text(('Prepared exclusively for ' + firstname + ' ' + lastname).toUpperCase(), W / 2, boxY + 144, { align: 'center', charSpace: 1.5 });

  // ── ITINERARY PAGE(S) ───────────────────────────────────────────────
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  let y = 56;

  // Section label
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(138, 126, 115);
  doc.text('YOUR BESPOKE ITINERARY', ML, y, { charSpace: 2.5 });
  y += 26;

  // Greeting
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(17, 17, 17);
  doc.text('Dear ' + firstname + ',', ML, y);
  y += 34;

  // Intro
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(119, 119, 119);
  const intro = doc.splitTextToSize('Thank you for reaching out to Soleil Nacre. We have carefully crafted the following journey entirely around you — your preferences, your rhythm, and the experience you deserve.', W - ML * 2);
  doc.text(intro, ML, y);
  y += intro.length * 14 + 18;

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(ML, y, W - ML, y);
  y += 22;

  const days = parseItineraryDays(itinerary);

  for (let i = 0; i < days.length; i++) {
    // New page if needed
    if (y > H - 120) {
      doc.addPage();
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, 'F');
      y = 56;
    }

    const accent = accents[i % accents.length];

    // Day header: accent left bar + cream background
    doc.setFillColor(accent);
    doc.rect(ML, y, 3, 22, 'F');
    doc.setFillColor(247, 243, 238);
    doc.rect(ML + 3, y, W - ML * 2 - 3, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(17, 17, 17);
    doc.text(days[i].day, ML + 12, y + 15);
    y += 30;

    // Day content
    const lines = days[i].content.split('\n').filter((l: string) => l.trim());
    for (const line of lines) {
      if (y > H - 60) {
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, W, H, 'F');
        y = 56;
      }

      if (/^(morning|afternoon|evening):/i.test(line)) {
        y += 6;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(accent);
        doc.text(line.toUpperCase(), ML, y);
        y += 14;
      } else if (line.trim()) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(68, 68, 68);
        const wrapped = doc.splitTextToSize(line, W - ML * 2);
        doc.text(wrapped, ML, y);
        y += wrapped.length * 13.5 + 3;
      }
    }
    y += 16;

    if (i < days.length - 1) {
      doc.setDrawColor(235, 232, 228);
      doc.setLineWidth(0.4);
      doc.line(ML, y, W - ML, y);
      y += 16;
    }
  }

  // ── FOOTER BAND ─────────────────────────────────────────────────────
  if (y > H - 96) {
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, 'F');
    y = 56;
  }
  y += 24;
  doc.setFillColor(17, 17, 17);
  doc.roundedRect(ML, y, W - ML * 2, 88, 4, 4, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('SOLEIL NACRE', W / 2, y + 28, { align: 'center', charSpace: 3.5 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 184, 166);
  doc.text('PRIVATELY CURATED GLOBAL JOURNEYS', W / 2, y + 50, { align: 'center', charSpace: 2 });

  doc.setFontSize(9);
  doc.setTextColor(138, 126, 115);
  doc.text('soleilnacre.com  ·  @soleil_nacre', W / 2, y + 70, { align: 'center' });

  return Buffer.from(doc.output('arraybuffer') as ArrayBuffer).toString('base64');
}

export async function POST(req: NextRequest) {
  const logs: string[] = [];
  try {
    const body = await req.json();
    logs.push('1. Body parsed OK');
    const event = Array.isArray(body) ? body[0] : body;
    const props = event?.properties || event;
    const firstname = props?.firstname?.value || props?.firstname || 'Valued Guest';
    const lastname  = props?.lastname?.value  || props?.lastname  || '';
    const email     = props?.email?.value     || props?.email;
    const message   = props?.message?.value   || props?.message   || '';
    logs.push('2. Fields — email: ' + email + ', name: ' + firstname + ' ' + lastname);
    if (!email) return NextResponse.json({ error: 'No email', logs }, { status: 400 });

    // ── Anthropic ──────────────────────────────────────────────────────
    logs.push('3. Calling Anthropic...');
    const aRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY || '', 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: `You are the concierge at Soleil Nacre, an ultra-luxury private travel company. Write a personalised 5-day luxury itinerary.\nClient: ${firstname} ${lastname}\nInquiry: "${message}"\nFormat exactly as:\nDay 1: [Title]\nMorning: [details]\nAfternoon: [details]\nEvening: [details]\n\n(repeat for Day 2-5)\n\nName specific luxury hotels and restaurants. Elegant tone. No markdown symbols.` }],
      }),
    });
    const aData = await aRes.json();
    logs.push('4. Anthropic: ' + aRes.status);
    if (!aRes.ok) return NextResponse.json({ error: 'Anthropic failed', detail: aData, logs }, { status: 500 });
    const itinerary = aData.content?.[0]?.text || '';
    logs.push('5. Itinerary: ' + itinerary.length + ' chars');

    // ── PDF ────────────────────────────────────────────────────────────
    logs.push('6. Generating PDF...');
    let pdfBase64 = '';
    try {
      pdfBase64 = await Promise.race([
        tryGeneratePDF(firstname, lastname, itinerary, getDestinationPhoto(message)),
        new Promise<string>((_, rej) => setTimeout(() => rej(new Error('timeout')), 35000)),
      ]);
      logs.push('7. PDF: ' + Math.round(pdfBase64.length / 1024) + 'KB');
    } catch (e) {
      logs.push('7. PDF skipped: ' + String(e));
    }

    // ── Email ──────────────────────────────────────────────────────────
    logs.push('8. Sending email...');
    const photoUrl = getDestinationPhoto(message);
    const emailPayload: Record<string, unknown> = {
      from: 'Soleil Nacre Concierge <' + FROM_EMAIL + '>',
      to: [email],
      subject: 'Your Bespoke Journey — Soleil Nacre',
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F7F3EE;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EE;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background:#111;padding:40px;text-align:center;">
    <p style="margin:0;color:#C8B8A6;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;font-family:Arial,sans-serif;">Privately Curated Global Journeys</p>
    <h1 style="margin:12px 0 0;color:#fff;font-size:28px;letter-spacing:0.3em;font-family:Georgia,serif;">SOLEIL NACRE</h1>
  </td></tr>
  <tr><td><img src="${photoUrl}" width="600" style="width:100%;height:220px;object-fit:cover;display:block;" /></td></tr>
  <tr><td style="padding:40px 48px 32px;">
    <p style="margin:0 0 8px;color:#8A7E73;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;font-family:Arial,sans-serif;">Your Bespoke Itinerary</p>
    <h2 style="margin:0 0 16px;color:#111;font-size:22px;font-family:Georgia,serif;">Dear ${firstname},</h2>
    <p style="margin:0 0 20px;color:#555;font-size:14px;line-height:1.8;font-family:Arial,sans-serif;">${pdfBase64 ? 'Your personalised itinerary is attached as a beautifully designed PDF. A summary is included below.' : 'Thank you for reaching out. Your personalised journey is below.'}</p>
    <div style="color:#333;font-size:13px;line-height:1.9;font-family:Arial,sans-serif;white-space:pre-wrap;">${itinerary.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
  </td></tr>
  <tr><td style="padding:16px 48px 48px;text-align:center;">
    <a href="https://soleilnacre.com" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:15px 34px;border-radius:50px;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif;">Refine Your Journey</a>
  </td></tr>
  <tr><td style="background:#F7F3EE;padding:24px 48px;text-align:center;border-top:1px solid #EEE;">
    <p style="margin:0;color:#AAA;font-size:11px;font-family:Arial,sans-serif;">
      <a href="https://soleilnacre.com" style="color:#8A7E73;text-decoration:none;">soleilnacre.com</a> &nbsp;·&nbsp;
      <a href="https://instagram.com/soleil_nacre" style="color:#8A7E73;text-decoration:none;">@soleil_nacre</a>
    </p>
  </td></tr>
</table></td></tr></table></body></html>`,
    };
    if (pdfBase64) {
      emailPayload.attachments = [{ filename: 'Soleil-Nacre-Itinerary-' + firstname + '-' + lastname + '.pdf', content: pdfBase64 }];
    }
    const eRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });
    const eData = await eRes.json();
    logs.push('9. Resend: ' + eRes.status + ' — ' + eData.id);
    if (!eRes.ok) return NextResponse.json({ error: 'Resend failed', detail: eData, logs }, { status: 500 });
    return NextResponse.json({ success: true, email_id: eData.id, pdf_generated: !!pdfBase64, logs });
  } catch (err) {
    logs.push('EXCEPTION: ' + String(err));
    return NextResponse.json({ error: String(err), logs }, { status: 500 });
  }
}
