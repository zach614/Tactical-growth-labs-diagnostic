# Tactical Growth Labs - Revenue Leak Diagnostic Tool

A Next.js-based landing page and diagnostic tool for tactical gear e-commerce brands. Helps store owners identify revenue leaks and prioritize optimization efforts.

## Features

- **Landing Page**: Hero, case study video section, strategic framing, diagnostic form, FAQ
- **Revenue Leak Diagnostic**: Analyzes Shopify metrics to identify conversion, cart abandonment, and AOV issues
- **Instant Results**: On-screen teaser showing leak score, top issues, and revenue simulation
- **Email Reports**: Full diagnostic report sent via SendGrid
- **Admin Dashboard**: Password-protected view of all submissions
- **Integration Ready**: Prepared for GoHighLevel and MCP integrations

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Email**: SendGrid
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- SendGrid account (for email functionality)

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd tactical-growth-labs
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your values:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # SendGrid
   SENDGRID_API_KEY="your-sendgrid-api-key"
   FROM_EMAIL="hello@tacticalgrowthlabs.com"
   OWNER_NOTIFY_EMAIL="your-email@example.com"

   # Admin
   ADMIN_PASSWORD="your-secure-password"

   # Calendar (for booking links)
   CALENDAR_URL="https://calendly.com/your-link"
   NEXT_PUBLIC_CALENDAR_URL="https://calendly.com/your-link"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Initialize the database**:
   ```bash
   npx prisma db push
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

## SendGrid Configuration

1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Create an API key with "Mail Send" permissions
3. Verify your sender email domain or address
4. Add the API key to your `.env` file

### Email Templates

The diagnostic tool sends two types of emails:

1. **Lead Report**: Full diagnostic report with:
   - Input summary
   - Leak score explanation
   - Priority fixes with action items
   - Revenue simulation table
   - Calendar booking link

2. **Owner Notification**: Alert email with:
   - Lead contact info
   - Submitted metrics
   - Leak score
   - Link to admin dashboard

## Admin Dashboard

Access at `/admin` with the password set in `ADMIN_PASSWORD`.

Features:
- View all submissions (newest first)
- Click to see detailed metrics
- Track email/notification status
- Direct link from owner notification emails

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts
│   │   │   ├── verify/route.ts
│   │   │   └── submissions/route.ts
│   │   └── diagnostic/route.ts
│   ├── admin/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── DiagnosticForm.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── MobileCTA.tsx
│   ├── ProofVideo.tsx
│   ├── Results.tsx
│   └── StrategicFraming.tsx
└── lib/
    ├── db.ts
    ├── diagnostic.ts
    ├── email.ts
    ├── integrations.ts
    └── validation.ts
```

## Diagnostic Logic

### Leak Score Calculation (0-100)

Starts at 100 and subtracts:

| Metric | Condition | Penalty |
|--------|-----------|---------|
| Conversion Rate | < 1.5% | -25 |
| Conversion Rate | 1.5-2.0% | -15 |
| Conversion Rate | 2.0-2.5% | -8 |
| Cart Abandonment | > 75% | -20 |
| Cart Abandonment | 65-75% | -12 |
| Cart Abandonment | 55-65% | -6 |
| AOV | < $90 | -12 |
| AOV | $90-130 | -6 |

### Score Buckets

- **0-39**: Major Leakage Detected
- **40-69**: Meaningful Leakage Detected
- **70-100**: Solid Fundamentals

### Revenue Simulation

Simulates impact of:
- Conversion rate +0.3% and +0.5%
- AOV +$15 and +$25

## GoHighLevel Integration

Currently disabled by default. To enable:

1. Get your GHL webhook URL
2. Add to `.env`:
   ```env
   GHL_WEBHOOK_URL="https://hooks.ghl.com/your-webhook"
   ```
3. The integration will automatically start sending data

### Payload Structure

```typescript
{
  firstName: string;
  email: string;
  storeUrl: string;
  monthlyRevenueRange?: string;
  sessions30d: number;
  orders30d: number;
  conversionRate: number;
  aov: number;
  cartAbandonRate: number;
  leakScore: number;
  leakBucket: string;
  revenueEst: number;
  topLeak1: string;
  topLeak2: string;
  source: "diagnostic_tool";
  submittedAt: string;
}
```

## MCP Integration (Future)

The diagnostic logic is designed for easy MCP integration:

### Integration Points

1. **`runDiagnostic()`** in `src/lib/diagnostic.ts`
   - Currently uses local deterministic logic
   - Can be swapped to call MCP endpoint

2. **`generateTeaser()`** - On-screen result generation
3. **`generateFullReport()`** - Email report generation

### Environment Variables (when ready)

```env
MCP_ENDPOINT="https://your-mcp-endpoint"
MCP_API_KEY="your-mcp-api-key"
```

See `src/lib/integrations.ts` for detailed implementation notes.

## Customization

### Adding Your Video

Edit `src/components/ProofVideo.tsx`:

```tsx
<iframe
  src="YOUR_VIDEO_EMBED_URL"
  className="absolute inset-0 w-full h-full"
  frameBorder="0"
  allow="autoplay; fullscreen; picture-in-picture"
  allowFullScreen
/>
```

### Updating Copy

All copy is in the respective component files:
- Hero: `src/components/Hero.tsx`
- Strategic framing: `src/components/StrategicFraming.tsx`
- FAQ: `src/components/FAQ.tsx`

### Adjusting Diagnostic Logic

Edit thresholds and penalties in `src/lib/diagnostic.ts`:
- `calculateLeakScore()` - Score calculation
- `LEAK_DEFINITIONS` - Leak descriptions and recommendations
- `runSimulations()` - Revenue simulation scenarios

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

Note: For SQLite in production, consider:
- Using Vercel Postgres or PlanetScale
- Or using a persistent storage solution for SQLite

### Manual Deployment

1. Build:
   ```bash
   npm run build
   ```

2. Start:
   ```bash
   npm start
   ```

## Database Commands

```bash
# Push schema changes
npx prisma db push

# Open Prisma Studio (database browser)
npx prisma studio

# Generate Prisma client
npx prisma generate

# Reset database
npx prisma db push --force-reset
```

## Assumptions Made

1. **Single admin user**: Simple password auth (no multi-user)
2. **SQLite for MVP**: Easy to swap for PostgreSQL later
3. **No rate limiting**: Add for production
4. **Video placeholder**: Replace with actual embed
5. **Calendar via env var**: Easy GoHighLevel replacement
6. **Email failures don't block**: Response always returns teaser

## Support

For issues or questions, contact the development team.

---

Built for tactical gear operators who demand results.
