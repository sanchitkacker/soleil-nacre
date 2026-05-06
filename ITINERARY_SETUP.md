# Automatic Itinerary Generation — Setup Guide

## How it works
1. Client submits inquiry form on soleilnacre.com
2. HubSpot receives the contact
3. HubSpot webhook fires → calls your `/api/itinerary` endpoint
4. Claude generates a personalised 5-day luxury itinerary
5. Resend emails the itinerary to the client in a branded Soleil Nacre template

---

## Step 1 — Add environment variables to Vercel

Go to: **Vercel Dashboard → soleil-nacre → Settings → Environment Variables**

Add these two:

| Key | Value |
|-----|-------|
| `ANTHROPIC_API_KEY` | Get from console.anthropic.com → API Keys |
| `RESEND_API_KEY` | Get from resend.com → API Keys |

---

## Step 2 — Set up Resend (free)

1. Sign up at **resend.com**
2. Go to **Domains** → Add domain → enter `soleilnacre.com`
3. Add the 2 DNS records shown (takes ~10 mins to verify)
4. Go to **API Keys** → Create key → copy and paste into Vercel above

---

## Step 3 — Set up HubSpot Webhook

1. In HubSpot → go to **Settings → Integrations → Private Apps**
2. Create a private app with scope: `crm.objects.contacts.read`
3. Go to **Settings → Integrations → Webhooks**
4. Click **Create Subscription**:
   - Event type: `contact.creation`
   - Target URL: `https://soleilnacre.com/api/itinerary`
5. Save and activate

That's it — every new inquiry now triggers a Claude-generated itinerary email automatically.

---

## Testing

You can test the endpoint manually:

```bash
curl -X POST https://soleilnacre.com/api/itinerary \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "firstname": "Jane",
      "lastname": "Doe",
      "email": "jane@example.com",
      "message": "I would love a 5-day escape to the Amalfi Coast with my partner."
    }
  }'
```
