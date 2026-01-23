import type { DiagnosticResults } from './diagnostic';

// ============================================================================
// GOHIGHLEVEL DIRECT API INTEGRATION
// Uses GHL API directly to create contacts, tags, and opportunities
// ============================================================================

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';

// Pipeline configuration - Marketing Pipeline
const GHL_PIPELINE_ID = process.env.GHL_PIPELINE_ID || 'rqrDtKP2rtXBtqCwd0kt';
const GHL_PIPELINE_STAGE_ID = process.env.GHL_PIPELINE_STAGE_ID || 'bbd9c31a-ef08-4164-b30c-18b53194fb8a'; // "New Lead" stage

export interface GHLIntegrationResult {
  success: boolean;
  contactId?: string;
  opportunityId?: string;
  error?: string;
}

/**
 * Get leak score tag based on bucket
 */
function getLeakScoreTag(bucket: string): string {
  switch (bucket) {
    case 'major':
      return 'diagnostic-major-leakage';
    case 'meaningful':
      return 'diagnostic-meaningful-leakage';
    case 'solid':
      return 'diagnostic-solid-fundamentals';
    default:
      return 'diagnostic-submitted';
  }
}

/**
 * Make authenticated request to GHL API
 */
async function ghlRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: Record<string, unknown>
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    return { success: false, error: 'GHL credentials not configured' };
  }

  try {
    const response = await fetch(`${GHL_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${GHL_API_KEY}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || `HTTP ${response.status}` };
    }

    return { success: true, data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Create or update contact in GHL
 */
async function upsertContact(results: DiagnosticResults): Promise<{ success: boolean; contactId?: string; error?: string }> {
  const { inputs, leakScore, leakBucket, revenueEst, topLeaks } = results;

  // Build tags array
  const tags = [
    'diagnostic-lead',
    'tactical-growth-labs',
    getLeakScoreTag(leakBucket),
  ];

  // Add revenue range tag if provided
  if (inputs.monthlyRevenueRange) {
    tags.push(`revenue-${inputs.monthlyRevenueRange}`);
  }

  const contactData = {
    locationId: GHL_LOCATION_ID,
    firstName: inputs.firstName,
    email: inputs.email,
    website: inputs.storeUrl,
    tags,
    source: 'Diagnostic Tool',
    // Store diagnostic data in custom fields (you may need to create these in GHL)
    customFields: [
      { key: 'leak_score', field_value: leakScore.toString() },
      { key: 'leak_bucket', field_value: leakBucket },
      { key: 'estimated_revenue', field_value: revenueEst.toString() },
      { key: 'top_leak_1', field_value: topLeaks[0]?.title || 'None' },
      { key: 'top_leak_2', field_value: topLeaks[1]?.title || 'None' },
      { key: 'conversion_rate', field_value: inputs.conversionRate.toString() },
      { key: 'aov', field_value: inputs.aov.toString() },
      { key: 'cart_abandon_rate', field_value: inputs.cartAbandonRate.toString() },
      { key: 'sessions_30d', field_value: inputs.sessions30d.toString() },
      { key: 'orders_30d', field_value: inputs.orders30d.toString() },
    ],
  };

  // Try upsert first (creates or updates based on email)
  const result = await ghlRequest('/contacts/upsert', 'POST', contactData);

  if (result.success && result.data) {
    const data = result.data as { contact?: { id: string } };
    return { success: true, contactId: data.contact?.id };
  }

  return { success: false, error: result.error };
}

/**
 * Create opportunity in pipeline
 */
async function createOpportunity(
  contactId: string,
  results: DiagnosticResults
): Promise<{ success: boolean; opportunityId?: string; error?: string }> {
  const { inputs, revenueEst, leakBucket } = results;

  // Estimate opportunity value based on potential improvement
  // If major leakage, higher potential value
  let monetaryValue = 0;
  switch (leakBucket) {
    case 'major':
      monetaryValue = Math.round(revenueEst * 0.3); // 30% potential uplift
      break;
    case 'meaningful':
      monetaryValue = Math.round(revenueEst * 0.15); // 15% potential uplift
      break;
    case 'solid':
      monetaryValue = Math.round(revenueEst * 0.05); // 5% optimization potential
      break;
  }

  const opportunityData = {
    locationId: GHL_LOCATION_ID,
    name: `${inputs.firstName} - Diagnostic Lead (${inputs.storeUrl.replace('https://', '')})`,
    pipelineId: GHL_PIPELINE_ID,
    pipelineStageId: GHL_PIPELINE_STAGE_ID,
    status: 'open',
    contactId,
    monetaryValue,
    source: 'Diagnostic Tool',
  };

  const result = await ghlRequest('/opportunities/', 'POST', opportunityData);

  if (result.success && result.data) {
    const data = result.data as { opportunity?: { id: string } };
    return { success: true, opportunityId: data.opportunity?.id };
  }

  return { success: false, error: result.error };
}

/**
 * Main function to sync diagnostic submission to GoHighLevel
 *
 * This function:
 * 1. Creates/updates the contact with diagnostic data and tags
 * 2. Creates an opportunity in the sales pipeline
 *
 * NEVER blocks the main response - all errors are caught and logged
 */
export async function sendToGHL(results: DiagnosticResults): Promise<GHLIntegrationResult> {
  // Skip if GHL not configured
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.log('[GHL] API credentials not configured - skipping');
    return { success: false, error: 'GHL not configured' };
  }

  try {
    // Step 1: Create/update contact
    const contactResult = await upsertContact(results);

    if (!contactResult.success || !contactResult.contactId) {
      console.error('[GHL] Failed to create contact:', contactResult.error);
      return { success: false, error: contactResult.error };
    }

    console.log(`[GHL] Contact created/updated: ${contactResult.contactId}`);

    // Step 2: Create opportunity
    const oppResult = await createOpportunity(contactResult.contactId, results);

    if (!oppResult.success) {
      console.warn('[GHL] Failed to create opportunity:', oppResult.error);
      // Still return partial success - contact was created
      return {
        success: true,
        contactId: contactResult.contactId,
        error: `Contact created but opportunity failed: ${oppResult.error}`,
      };
    }

    console.log(`[GHL] Opportunity created: ${oppResult.opportunityId}`);

    return {
      success: true,
      contactId: contactResult.contactId,
      opportunityId: oppResult.opportunityId,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[GHL] Integration error:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

// ============================================================================
// LEGACY WEBHOOK SUPPORT (kept for backwards compatibility)
// ============================================================================

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;

/**
 * Send to webhook if configured (legacy method)
 */
export async function sendToGHLWebhook(results: DiagnosticResults): Promise<{ sent: boolean; error?: string }> {
  if (!GHL_WEBHOOK_URL) {
    return { sent: false };
  }

  try {
    const { inputs, leakScore, leakBucket, revenueEst, topLeaks } = results;

    const payload = {
      firstName: inputs.firstName,
      email: inputs.email,
      storeUrl: inputs.storeUrl,
      monthlyRevenueRange: inputs.monthlyRevenueRange || undefined,
      sessions30d: inputs.sessions30d,
      orders30d: inputs.orders30d,
      conversionRate: inputs.conversionRate,
      aov: inputs.aov,
      cartAbandonRate: inputs.cartAbandonRate,
      leakScore,
      leakBucket,
      revenueEst,
      topLeak1: topLeaks[0]?.title || 'None',
      topLeak2: topLeaks[1]?.title || 'None',
      source: 'diagnostic_tool',
      submittedAt: new Date().toISOString(),
    };

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}`);
    }

    return { sent: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[GHL Webhook] Failed:', errorMessage);
    return { sent: false, error: errorMessage };
  }
}

// ============================================================================
// MCP INTEGRATION PLACEHOLDERS
// ============================================================================

export const MCP_INTEGRATION_NOTES = {
  currentStatus: 'Using local deterministic logic',
  integrationPoints: [
    'runDiagnostic() - Main analysis function',
    'generateTeaser() - On-screen result generation',
    'generateFullReport() - Email report generation',
  ],
  envVarsNeeded: ['MCP_ENDPOINT', 'MCP_API_KEY'],
};

export async function checkMCPConnection(): Promise<{ connected: boolean; error?: string }> {
  const MCP_ENDPOINT = process.env.MCP_ENDPOINT;
  if (!MCP_ENDPOINT) {
    return { connected: false, error: 'MCP_ENDPOINT not configured' };
  }
  return { connected: false, error: 'MCP integration not yet implemented' };
}
