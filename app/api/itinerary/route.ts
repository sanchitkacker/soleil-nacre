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

// Map destination keywords to curated Unsplash photo IDs
function getDestinationPhotos(message: string): string[] {
  const msg = message.toLowerCase();
  if (msg.includes('amalfi') || msg.includes('italy') || msg.includes('positano') || msg.includes('rome') || msg.includes('florence')) {
    return [
      'https://images.unsplash.com/photo-1534445638895-9e762d1543f7?w=1200&q=85',
      'https://images.unsplash.com/photo-1555993539-1732b0258235?w=1200&q=85',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=85',
    ];
  } else if (msg.includes('maldives') || msg.includes('island') || msg.includes('beach') || msg.includes('seychelles')) {
    return [
      'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=85',
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200&q=85',
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1200&q=85',
    ];
  } else if (msg.includes('paris') || msg.includes('france') || msg.includes('provence')) {
    return [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=85',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85',
      'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=1200&q=85',
    ];
  } else if (msg.includes('bali') || msg.includes('indonesia') || msg.includes('ubud')) {
    return [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=85',
      'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=85',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=85',
    ];
  } else if (msg.includes('santorini') || msg.includes('greece') || msg.includes('mykonos')) {
    return [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=85',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=85',
      'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1200&q=85',
    ];
  } else if (msg.includes('japan') || msg.includes('tokyo') || msg.includes('kyoto')) {
    return [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=85',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85',
      'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1200&q=85',
    ];
  } else if (msg.includes('swiss') || msg.includes('alps') || msg.includes('courchevel') || msg.includes('mountain')) {
    return [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&q=85',
      'https://images.unsplash.com/photo-1520208422220-d12a3c588574?w=1200&q=85',
    ];
  } else if (msg.includes('dubai') || msg.includes('uae') || msg.includes('abu dhabi')) {
    return [
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=85',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=85',
      'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1200&q=85',
    ];
  } else {
    // Default luxury travel photos
    return [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=85',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200&q=85',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=85',
    ];
  }
}

// Parse itinerary text into days
function parseItineraryDays(text: string): { day: string; content: string }[] {
  const days: { day: string; content: string }[] = [];
  const lines = text.split('\n');
  let currentDay = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    if (line.match(/^Day \d+/i)) {
      if (currentDay) days.push({ day: currentDay, content: currentContent.join('\n') });
      currentDay = line.trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentDay) days.push({ day: currentDay, content: currentContent.join('\n') });
  return days.length > 0 ? days : [{ day: 'Your Journey', content: text }];
}

// Build PDF HTML
function buildPdfHtml(firstname: string, itinerary: string, photos: string[]): string {
  const days = parseItineraryDays(itinerary);

  const dayColors = ['#8A7E73', '#6B7B8D', '#7D8B6E', '#8D6E7D', '#6E8D8A'];

  const daysHtml = days.map((d, i) => `
    <div class="day-card">
      <div class="day-header" style="border-left: 4px solid ${dayColors[i % dayColors.length]}">
        <span class="day-label">${d.day}</span>
      </div>
      <div class="day-content">${d.content.replace(/\n/g, '<br>')}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', serif; background: #fff; color: #222; }

  .cover {
    position: relative;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #111;
    page-break-after: always;
  }
  .cover-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.45;
  }
  .cover-content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 40px;
  }
  .cover-tag {
    font-family: Arial, sans-serif;
    font-size: 11px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: #C8B8A6;
    margin-bottom: 20px;
  }
  .cover-title {
    font-size: 52px;
    letter-spacing: 0.3em;
    color: #fff;
    margin-bottom: 16px;
  }
  .cover-subtitle {
    font-size: 18px;
    color: rgba(255,255,255,0.75);
    margin-bottom: 48px;
    font-style: italic;
  }
  .cover-name {
    font-family: Arial, sans-serif;
    font-size: 12px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #C8B8A6;
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 24px;
    margin-top: 24px;
  }

  .photos-page {
    padding: 60px 60px 40px;
    page-break-after: always;
  }
  .photos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 300px 300px;
    gap: 12px;
  }
  .photos-grid img:first-child {
    grid-row: 1 / 3;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  .photos-grid img:not(:first-child) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
  .photos-caption {
    margin-top: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 11px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #8A7E73;
  }

  .itinerary-page {
    padding: 60px;
  }
  .section-label {
    font-family: Arial, sans-serif;
    font-size: 11px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: #8A7E73;
    margin-bottom: 12px;
  }
  .itinerary-title {
    font-size: 36px;
    color: #111;
    margin-bottom: 8px;
  }
  .itinerary-intro {
    font-size: 15px;
    line-height: 1.8;
    color: #555;
    font-style: italic;
    margin-bottom: 40px;
    padding-bottom: 32px;
    border-bottom: 1px solid #EEE;
  }
  .day-card {
    margin-bottom: 36px;
    padding-bottom: 36px;
    border-bottom: 1px solid #F0EDE9;
  }
  .day-card:last-child { border-bottom: none; }
  .day-header {
    padding: 10px 16px;
    margin-bottom: 14px;
    background: #F7F3EE;
    border-radius: 4px;
  }
  .day-label {
    font-size: 16px;
    font-weight: bold;
    color: #111;
    letter-spacing: 0.05em;
  }
  .day-content {
    font-size: 14px;
    line-height: 1.9;
    color: #444;
  }

  .footer-page {
    margin-top: 60px;
    padding: 48px 60px;
    background: #111;
    text-align: center;
  }
  .footer-brand {
    font-size: 28px;
    letter-spacing: 0.3em;
    color: #fff;
    margin-bottom: 12px;
  }
  .footer-tag {
    font-family: Arial, sans-serif;
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #C8B8A6;
    margin-bottom: 24px;
  }
  .footer-link {
    font-family: Arial, sans-serif;
    font-size: 11px;
    color: #8A7E73;
    text-decoration: none;
  }
</style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover">
    <img class="cover-img" src="${photos[0]}" />
    <div class="cover-content">
      <p class="cover-tag">Privately Curated Global Journeys</p>
      <h1 class="cover-title">SOLEIL NACRE</h1>
      <p class="cover-subtitle">A Bespoke Journey, Crafted for You</p>
      <p class="cover-name">Prepared exclusively for ${firstname}</p>
    </div>
  </div>

  <!-- Photos Page -->
  <div class="photos-page">
    <div class="photos-grid">
      <img src="${photos[0]}" />
      <img src="${photos[1]}" />
      <img src="${photos[2]}" />
    </div>
    <p class="photos-caption">Your destination awaits</p>
  </div>

  <!-- Itinerary -->
  <div class="itinerary-page">
    <p class="section-label">Your Bespoke Itinerary</p>
    <h2 class="itinerary-title">Dear ${firstname},</h2>
    <p class="itinerary-intro">
      Thank you for reaching out to Soleil Nacre. We have carefully crafted the following journey entirely around you — your preferences, your rhythm, and the experience you deserve.
    </p>
    ${daysHtml}

    <!-- Footer -->
    <div class="footer-page">
      <p class="footer-brand">SOLEIL NACRE</p>
      <p class="footer-tag">Privately Curated Global Journeys</p>
      <a class="footer-link" href="https://soleilnacre.com">soleilnacre.com</a>
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

    // ── Step 1: Generate itinerary ──────────────────────────────────────────
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

Write in an elegant tone. Include Day 1-5 with morning/afternoon/evening sections. Name specific luxury hotels and restaurants. End with a warm closing. Plain text only, no markdown symbols like ** or ##.`,
        }],
      }),
    });

    const anthropicData = await anthropicRes.json();
    logs.push(`4. Anthropic status: ${anthropicRes.status}`);
    if (!anthropicRes.ok) return NextResponse.json({ error: 'Anthropic failed', detail: anthropicData, logs }, { status: 500 });

    const itinerary = anthropicData.content?.[0]?.text || 'Your itinerary is being prepared.';
    logs.push(`5. Itinerary generated — ${itinerary.length} chars`);

    // ── Step 2: Get destination photos ─────────────────────────────────────
    const photos = getDestinationPhotos(message);
    logs.push(`6. Photos selected — ${photos.length} images`);

    // ── Step 3: Generate PDF via Puppeteer ─────────────────────────────────
    logs.push('7. Generating PDF...');
    let pdfBase64 = '';

    try {
      const chromium = (await import('@sparticuz/chromium-min')).default;
      const puppeteer = (await import('puppeteer-core')).default;

      const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
        ),
        headless: true,
      });

      const page = await browser.newPage();
      const html = buildPdfHtml(firstname, itinerary, photos);
      await page.setContent(html, { waitUntil: 'networkidle0', timeout: 20000 });
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });
      await browser.close();
      pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
      logs.push(`8. PDF generated — ${Math.round(pdfBase64.length / 1024)}KB`);
    } catch (pdfErr) {
      logs.push(`PDF generation failed (will send HTML email instead): ${String(pdfErr)}`);
    }

    // ── Step 4: Send email with PDF attachment ──────────────────────────────
    logs.push('9. Sending email via Resend...');

    const emailPayload: Record<string, unknown> = {
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
          <h2 style="margin:0 0 16px;color:#111;font-size:24px;font-family:Georgia,serif;">Dear ${firstname},</h2>
          <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.8;font-family:Arial,sans-serif;">
            Thank you for reaching out to Soleil Nacre. Your personalised journey is attached as a beautifully designed PDF — crafted entirely around you.
          </p>
          ${pdfBase64 ? '<p style="margin:0;color:#8A7E73;font-size:14px;font-family:Arial,sans-serif;font-style:italic;">Please find your bespoke itinerary attached.</p>' : `<div style="color:#333;font-size:14px;line-height:1.9;font-family:Arial,sans-serif;white-space:pre-wrap;margin-top:16px;">${itinerary.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`}
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
      </table>
    </td></tr>
  </table>
</body></html>`,
    };

    // Attach PDF if generated successfully
    if (pdfBase64) {
      emailPayload.attachments = [{
        filename: `Soleil-Nacre-Itinerary-${firstname}.pdf`,
        content: pdfBase64,
      }];
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });

    const emailData = await emailRes.json();
    logs.push(`10. Resend status: ${emailRes.status} — ${JSON.stringify(emailData)}`);
    if (!emailRes.ok) return NextResponse.json({ error: 'Resend failed', detail: emailData, logs }, { status: 500 });

    return NextResponse.json({ success: true, email_id: emailData.id, pdf_generated: !!pdfBase64, logs });

  } catch (err) {
    logs.push(`EXCEPTION: ${String(err)}`);
    return NextResponse.json({ error: String(err), logs }, { status: 500 });
  }
}
