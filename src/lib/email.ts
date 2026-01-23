import sgMail from '@sendgrid/mail';
import type { DiagnosticResults } from './diagnostic';
import { generateFullReport, generateFullReportText } from './diagnostic';

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'hello@tacticalgrowthlabs.com';
const OWNER_NOTIFY_EMAIL = process.env.OWNER_NOTIFY_EMAIL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CALENDAR_URL = process.env.CALENDAR_URL || '#';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

// ============================================================================
// EMAIL SENDING FUNCTIONS
// All email operations are wrapped in try/catch to prevent blocking the response
// ============================================================================

export interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Send the full diagnostic report to the lead
 * IMPORTANT: This should never block the API response - always use try/catch
 */
export async function sendReportToLead(
  email: string,
  firstName: string,
  results: DiagnosticResults
): Promise<EmailResult> {
  if (!SENDGRID_API_KEY) {
    console.warn('[Email] SendGrid API key not configured - skipping lead email');
    return { success: false, error: 'SendGrid not configured' };
  }

  try {
    const htmlContent = generateFullReport(results, CALENDAR_URL);
    const textContent = generateFullReportText(results, CALENDAR_URL);

    const msg = {
      to: email,
      from: {
        email: FROM_EMAIL,
        name: 'Tactical Growth Labs',
      },
      subject: `${firstName}, Your Revenue Leak Diagnostic Report`,
      text: textContent,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log(`[Email] Report sent successfully to ${email}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Email] Failed to send report to ${email}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send notification to the site owner about a new submission
 * IMPORTANT: This should never block the API response - always use try/catch
 */
export async function sendOwnerNotification(
  submissionId: string,
  results: DiagnosticResults
): Promise<EmailResult> {
  if (!SENDGRID_API_KEY) {
    console.warn('[Email] SendGrid API key not configured - skipping owner notification');
    return { success: false, error: 'SendGrid not configured' };
  }

  if (!OWNER_NOTIFY_EMAIL) {
    console.warn('[Email] Owner notification email not configured');
    return { success: false, error: 'Owner email not configured' };
  }

  try {
    const { inputs, leakScore, revenueEst } = results;
    const adminUrl = `${APP_URL}/admin?id=${submissionId}`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: #059669; color: white; padding: 16px 24px; border-radius: 8px 8px 0 0; margin-bottom: 0;">
    <h1 style="margin: 0; font-size: 18px;">🎯 New Diagnostic Submission</h1>
  </div>

  <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 0; color: #6b7280; width: 140px;">Name</td>
        <td style="padding: 8px 0; font-weight: 600;">${inputs.firstName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Email</td>
        <td style="padding: 8px 0;"><a href="mailto:${inputs.email}" style="color: #2563eb;">${inputs.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Store URL</td>
        <td style="padding: 8px 0;"><a href="${inputs.storeUrl}" target="_blank" style="color: #2563eb;">${inputs.storeUrl.replace('https://', '')}</a></td>
      </tr>
      ${inputs.monthlyRevenueRange ? `
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Revenue Range</td>
        <td style="padding: 8px 0;">${inputs.monthlyRevenueRange}</td>
      </tr>
      ` : ''}
    </table>

    <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #374151; border-top: 1px solid #e5e7eb; padding-top: 16px;">
      Metrics Submitted
    </h2>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Sessions (30d)</td>
        <td style="padding: 6px 0; text-align: right;">${inputs.sessions30d.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Orders (30d)</td>
        <td style="padding: 6px 0; text-align: right;">${inputs.orders30d.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Conversion Rate</td>
        <td style="padding: 6px 0; text-align: right;">${inputs.conversionRate}%</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">AOV</td>
        <td style="padding: 6px 0; text-align: right;">$${inputs.aov.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Cart Abandon Rate</td>
        <td style="padding: 6px 0; text-align: right;">${inputs.cartAbandonRate}%</td>
      </tr>
    </table>

    <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 4px 0; color: #374151; font-weight: 600;">Leak Score</td>
          <td style="padding: 4px 0; text-align: right; font-size: 24px; font-weight: 700; color: ${leakScore < 40 ? '#dc2626' : leakScore < 70 ? '#f59e0b' : '#059669'};">${leakScore}/100</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #374151; font-weight: 600;">Est. Revenue</td>
          <td style="padding: 4px 0; text-align: right; font-size: 18px; font-weight: 600;">$${revenueEst.toLocaleString()}/mo</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center;">
      <a href="${adminUrl}" style="display: inline-block; padding: 12px 24px; background: #1f2937; color: white; text-decoration: none; border-radius: 6px; font-weight: 500;">
        View Full Submission →
      </a>
    </div>

    <p style="margin: 24px 0 0 0; font-size: 12px; color: #9ca3af; text-align: center;">
      Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
    </p>

  </div>
</body>
</html>
    `.trim();

    const textContent = `
New Diagnostic Submission
========================

Name: ${inputs.firstName}
Email: ${inputs.email}
Store: ${inputs.storeUrl}
${inputs.monthlyRevenueRange ? `Revenue Range: ${inputs.monthlyRevenueRange}` : ''}

Metrics:
- Sessions (30d): ${inputs.sessions30d.toLocaleString()}
- Orders (30d): ${inputs.orders30d.toLocaleString()}
- Conversion Rate: ${inputs.conversionRate}%
- AOV: $${inputs.aov.toFixed(2)}
- Cart Abandon: ${inputs.cartAbandonRate}%

Results:
- Leak Score: ${leakScore}/100
- Est. Revenue: $${revenueEst.toLocaleString()}/mo

View submission: ${adminUrl}
    `.trim();

    const msg = {
      to: OWNER_NOTIFY_EMAIL,
      from: {
        email: FROM_EMAIL,
        name: 'TGL Diagnostic Tool',
      },
      subject: `🎯 New Lead: ${inputs.firstName} (${inputs.storeUrl.replace('https://', '')}) - Score: ${leakScore}`,
      text: textContent,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log(`[Email] Owner notification sent for submission ${submissionId}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Email] Failed to send owner notification:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Send both emails in parallel (non-blocking)
 * Returns immediately after starting the sends
 */
export async function sendAllEmails(
  submissionId: string,
  email: string,
  firstName: string,
  results: DiagnosticResults
): Promise<{ leadEmail: EmailResult; ownerEmail: EmailResult }> {
  // Send both emails in parallel
  const [leadEmail, ownerEmail] = await Promise.all([
    sendReportToLead(email, firstName, results),
    sendOwnerNotification(submissionId, results),
  ]);

  return { leadEmail, ownerEmail };
}
