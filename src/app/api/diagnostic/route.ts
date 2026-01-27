import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';
import { diagnosticFormSchema, type DiagnosticFormData } from '@/lib/validation';
import { runDiagnostic, generateTeaser, generateFullReport } from '@/lib/diagnostic';
import { sendAllEmails } from '@/lib/email';
import { sendToGHL } from '@/lib/integrations';

// ============================================================================
// POST /api/diagnostic
// Main endpoint for processing diagnostic form submissions
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input with Zod
    const parseResult = diagnosticFormSchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.flatten();
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors.fieldErrors,
        },
        { status: 400 }
      );
    }

    const formData: DiagnosticFormData = parseResult.data;

    // Run diagnostic analysis
    const results = runDiagnostic(formData);

    // Generate teaser for immediate display
    const teaser = generateTeaser(results);

    // Generate full report HTML for storage
    const calendarUrl = process.env.CALENDAR_URL || '#';
    const fullReportHtml = generateFullReport(results, calendarUrl);

    // Extract tracking info from request
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
    const userAgent = request.headers.get('user-agent');

    // Extract UTM parameters if present
    const url = new URL(request.url);
    const utmSource = url.searchParams.get('utm_source');
    const utmMedium = url.searchParams.get('utm_medium');
    const utmCampaign = url.searchParams.get('utm_campaign');

    // Get Prisma client (lazy initialization for serverless)
    const prisma = await getPrisma();

    // Persist to database
    const submission = await prisma.diagnosticSubmission.create({
      data: {
        // Contact info
        firstName: formData.firstName,
        email: formData.email,
        storeUrl: formData.storeUrl,
        monthlyRevenueRange: formData.monthlyRevenueRange,

        // Raw metrics
        sessions30d: formData.sessions30d,
        orders30d: formData.orders30d,
        conversionRate: formData.conversionRate,
        aov: formData.aov,
        cartAbandonRate: formData.cartAbandonRate,

        // Calculated values
        revenueEst: results.revenueEst,
        revenuePerSession: results.revenuePerSession,

        // Results
        leakScore: results.leakScore,
        topLeak1: results.topLeaks[0]?.title || 'None',
        topLeak2: results.topLeaks[1]?.title || 'None',

        // Stored output
        teaserJson: JSON.stringify(teaser),
        fullReportHtml,

        // Tracking
        ipAddress,
        userAgent,
        utmSource,
        utmMedium,
        utmCampaign,
      },
    });

    // Send emails and GHL sync in parallel, but wait for completion
    // On serverless (Vercel), we must await these before returning or they get terminated
    const [emailResults, ghlResult] = await Promise.all([
      sendAllEmails(submission.id, formData.email, formData.firstName, results)
        .catch((err) => {
          console.error('[API] Email sending failed:', err);
          return { leadEmail: { success: false }, ownerEmail: { success: false } };
        }),
      sendToGHL(results)
        .catch((err) => {
          console.error('[API] GHL sync failed:', err);
          return { success: false };
        }),
    ]);

    // Update submission with integration status
    const updates: Record<string, Date> = {};
    if (emailResults.leadEmail.success) {
      updates.emailSentAt = new Date();
    }
    if (emailResults.ownerEmail.success) {
      updates.ownerNotifiedAt = new Date();
    }
    if (ghlResult.success) {
      updates.ghlSyncedAt = new Date();
    }

    if (Object.keys(updates).length > 0) {
      await prisma.diagnosticSubmission.update({
        where: { id: submission.id },
        data: updates,
      });
    }

    // Return teaser results
    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      teaser,
      message: 'Your full report has been emailed to you.',
    });

  } catch (error) {
    console.error('[API] Diagnostic submission error:', error);

    // Don't expose internal errors to client
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred processing your request. Please try again.',
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// GET /api/diagnostic
// Returns basic info about the endpoint (for testing/debugging)
// ============================================================================

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/diagnostic',
    method: 'POST',
    description: 'Submit diagnostic form data for analysis',
    requiredFields: [
      'firstName',
      'email',
      'storeUrl',
      'sessions30d',
      'orders30d',
      'conversionRate',
      'aov',
      'cartAbandonRate',
    ],
    optionalFields: ['monthlyRevenueRange'],
  });
}
