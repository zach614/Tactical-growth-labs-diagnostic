import type { DiagnosticFormData } from './validation';

// ============================================================================
// DIAGNOSTIC CALCULATIONS
// Core business logic for revenue leak analysis
// ============================================================================

export interface DiagnosticResults {
  // Input echo
  inputs: DiagnosticFormData;

  // Baseline calculations
  revenueEst: number;
  revenuePerSession: number;

  // Leak analysis
  leakScore: number;
  leakBucket: 'major' | 'meaningful' | 'solid';
  leakBucketLabel: string;

  // Top leaks identified
  topLeaks: LeakDetail[];

  // Leverage simulation
  simulations: SimulationResult[];

  // Timestamps
  analyzedAt: string;
}

export interface LeakDetail {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  impactScore: number;
  checkFirst: string[];
  category: 'conversion' | 'cart' | 'aov' | 'traffic';
}

export interface SimulationResult {
  scenario: string;
  crChange: number;
  aovChange: number;
  newRevenue: number;
  uplift: number;
  upliftPercent: number;
}

// ============================================================================
// LEAK DEFINITIONS
// ============================================================================

const LEAK_DEFINITIONS: Record<string, Omit<LeakDetail, 'impactScore'>> = {
  low_conversion: {
    id: 'low_conversion',
    title: 'Low Conversion Rate',
    description:
      'Your conversion rate suggests visitors are not finding what they need or encountering friction. This is often the highest-leverage fix for tactical gear stores.',
    impact: 'high',
    category: 'conversion',
    checkFirst: [
      'Product page load time (should be under 3 seconds)',
      'Mobile checkout experience (60%+ of traffic is mobile)',
      'Trust signals: reviews, security badges, shipping info',
      'Product photography quality and zoom functionality',
      'Clear sizing/compatibility information',
      'Prominent call-to-action buttons',
    ],
  },
  high_cart_abandon: {
    id: 'high_cart_abandon',
    title: 'High Cart Abandonment',
    description:
      'Too many customers are adding items but not completing checkout. This indicates checkout friction, shipping surprise, or trust issues at the critical moment.',
    impact: 'high',
    category: 'cart',
    checkFirst: [
      'Shipping costs visible before checkout (surprise fees kill conversions)',
      'Guest checkout option available',
      'Payment options: Apple Pay, Google Pay, PayPal',
      'Cart abandonment email sequence in place',
      'Exit-intent offers for cart abandoners',
      'Checkout page load speed and mobile optimization',
    ],
  },
  low_aov: {
    id: 'low_aov',
    title: 'Below-Average Order Value',
    description:
      'Customers are buying but not maximizing basket size. For tactical gear, bundling and smart upsells can significantly increase revenue without more traffic.',
    impact: 'medium',
    category: 'aov',
    checkFirst: [
      'Product bundles (e.g., "range day kit", "EDC bundle")',
      'Post-purchase upsells on confirmation page',
      'In-cart recommendations for complementary items',
      'Free shipping threshold above current AOV',
      'Volume discounts for consumables (ammo, targets, etc.)',
      'Loyalty/rewards program incentives',
    ],
  },
  conversion_medium: {
    id: 'conversion_medium',
    title: 'Room for Conversion Improvement',
    description:
      'Your conversion rate is acceptable but below top-tier tactical stores. Incremental improvements here compound significantly over time.',
    impact: 'medium',
    category: 'conversion',
    checkFirst: [
      'A/B test product page layouts',
      'Review and testimonial placement',
      'Urgency elements (stock levels, sale timers)',
      'Search functionality and filtering',
      'Category page organization',
    ],
  },
  cart_medium: {
    id: 'cart_medium',
    title: 'Cart Recovery Opportunity',
    description:
      'You have more abandoned carts than completed orders — there\'s meaningful revenue being left on the table that recovery tactics can capture.',
    impact: 'medium',
    category: 'cart',
    checkFirst: [
      'Multi-step abandoned cart email sequence',
      'SMS recovery for mobile abandoners',
      'Retargeting ads for cart abandoners',
      'Simplified checkout (fewer form fields)',
    ],
  },
};

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate baseline revenue metrics
 */
function calculateBaseline(data: DiagnosticFormData): { revenueEst: number; revenuePerSession: number } {
  const revenueEst = data.sessions30d * (data.conversionRate / 100) * data.aov;
  const revenuePerSession = data.sessions30d > 0 ? revenueEst / data.sessions30d : 0;

  return {
    revenueEst: Math.round(revenueEst * 100) / 100,
    revenuePerSession: Math.round(revenuePerSession * 100) / 100,
  };
}

/**
 * Calculate leak score (0-100)
 * Higher score = fewer leaks = better
 */
function calculateLeakScore(data: DiagnosticFormData): number {
  let score = 100;

  // Conversion Rate penalties
  if (data.conversionRate < 1.5) {
    score -= 25;
  } else if (data.conversionRate < 2.0) {
    score -= 15;
  } else if (data.conversionRate < 2.5) {
    score -= 8;
  }

  // Cart Abandonment penalties (relative to orders)
  // High: abandonedCarts > orders * 2
  // Moderate: abandonedCarts > orders
  // Lower: abandonedCarts <= orders
  if (data.abandonedCarts30d > data.orders30d * 2) {
    score -= 20;
  } else if (data.abandonedCarts30d > data.orders30d) {
    score -= 12;
  }

  // AOV penalties
  if (data.aov < 90) {
    score -= 12;
  } else if (data.aov < 130) {
    score -= 6;
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Determine leak score bucket
 */
function getLeakBucket(score: number): { bucket: 'major' | 'meaningful' | 'solid'; label: string } {
  if (score < 40) {
    return { bucket: 'major', label: 'Major Leakage Detected' };
  } else if (score < 70) {
    return { bucket: 'meaningful', label: 'Meaningful Leakage Detected' };
  } else {
    return { bucket: 'solid', label: 'Solid Fundamentals' };
  }
}

/**
 * Identify and rank top leaks
 */
function identifyLeaks(data: DiagnosticFormData): LeakDetail[] {
  const leaks: LeakDetail[] = [];

  // Check conversion rate
  if (data.conversionRate < 1.5) {
    leaks.push({ ...LEAK_DEFINITIONS.low_conversion, impactScore: 25 });
  } else if (data.conversionRate < 2.0) {
    leaks.push({ ...LEAK_DEFINITIONS.low_conversion, impactScore: 15 });
  } else if (data.conversionRate < 2.5) {
    leaks.push({ ...LEAK_DEFINITIONS.conversion_medium, impactScore: 8 });
  }

  // Check cart abandonment (relative to orders)
  if (data.abandonedCarts30d > data.orders30d * 2) {
    leaks.push({ ...LEAK_DEFINITIONS.high_cart_abandon, impactScore: 20 });
  } else if (data.abandonedCarts30d > data.orders30d) {
    leaks.push({ ...LEAK_DEFINITIONS.cart_medium, impactScore: 12 });
  }

  // Check AOV
  if (data.aov < 90) {
    leaks.push({ ...LEAK_DEFINITIONS.low_aov, impactScore: 12 });
  } else if (data.aov < 130) {
    leaks.push({ ...LEAK_DEFINITIONS.low_aov, impactScore: 6 });
  }

  // Sort by impact score (highest first)
  leaks.sort((a, b) => b.impactScore - a.impactScore);

  return leaks;
}

/**
 * Run leverage simulations
 */
function runSimulations(data: DiagnosticFormData, baseline: { revenueEst: number }): SimulationResult[] {
  const simulations: SimulationResult[] = [];

  // CR +0.3%
  const crPlus03 = data.sessions30d * ((data.conversionRate + 0.3) / 100) * data.aov;
  simulations.push({
    scenario: 'Conversion Rate +0.3%',
    crChange: 0.3,
    aovChange: 0,
    newRevenue: Math.round(crPlus03),
    uplift: Math.round(crPlus03 - baseline.revenueEst),
    upliftPercent: baseline.revenueEst > 0 ? Math.round(((crPlus03 - baseline.revenueEst) / baseline.revenueEst) * 100) : 0,
  });

  // CR +0.5%
  const crPlus05 = data.sessions30d * ((data.conversionRate + 0.5) / 100) * data.aov;
  simulations.push({
    scenario: 'Conversion Rate +0.5%',
    crChange: 0.5,
    aovChange: 0,
    newRevenue: Math.round(crPlus05),
    uplift: Math.round(crPlus05 - baseline.revenueEst),
    upliftPercent: baseline.revenueEst > 0 ? Math.round(((crPlus05 - baseline.revenueEst) / baseline.revenueEst) * 100) : 0,
  });

  // AOV +$15
  const aovPlus15 = data.sessions30d * (data.conversionRate / 100) * (data.aov + 15);
  simulations.push({
    scenario: 'AOV +$15',
    crChange: 0,
    aovChange: 15,
    newRevenue: Math.round(aovPlus15),
    uplift: Math.round(aovPlus15 - baseline.revenueEst),
    upliftPercent: baseline.revenueEst > 0 ? Math.round(((aovPlus15 - baseline.revenueEst) / baseline.revenueEst) * 100) : 0,
  });

  // AOV +$25
  const aovPlus25 = data.sessions30d * (data.conversionRate / 100) * (data.aov + 25);
  simulations.push({
    scenario: 'AOV +$25',
    crChange: 0,
    aovChange: 25,
    newRevenue: Math.round(aovPlus25),
    uplift: Math.round(aovPlus25 - baseline.revenueEst),
    upliftPercent: baseline.revenueEst > 0 ? Math.round(((aovPlus25 - baseline.revenueEst) / baseline.revenueEst) * 100) : 0,
  });

  return simulations;
}

// ============================================================================
// MAIN DIAGNOSTIC FUNCTION
// ============================================================================

/**
 * Run full diagnostic analysis
 * This is the main entry point for generating diagnostic results
 *
 * NOTE: This function is designed to be swapped with MCP-based analysis later.
 * The interface (DiagnosticResults) should remain stable.
 */
export function runDiagnostic(data: DiagnosticFormData): DiagnosticResults {
  const baseline = calculateBaseline(data);
  const leakScore = calculateLeakScore(data);
  const { bucket, label } = getLeakBucket(leakScore);
  const leaks = identifyLeaks(data);
  const simulations = runSimulations(data, baseline);

  return {
    inputs: data,
    revenueEst: baseline.revenueEst,
    revenuePerSession: baseline.revenuePerSession,
    leakScore,
    leakBucket: bucket,
    leakBucketLabel: label,
    topLeaks: leaks.slice(0, 2), // Only top 2 for teaser
    simulations,
    analyzedAt: new Date().toISOString(),
  };
}

// ============================================================================
// TEASER GENERATION
// For on-screen display after submission
// ============================================================================

export interface TeaserResult {
  leakScore: number;
  leakBucket: 'major' | 'meaningful' | 'solid';
  leakBucketLabel: string;
  topLeaks: Array<{
    title: string;
    description: string;
    impact: string;
  }>;
  bestSimulation: {
    scenario: string;
    uplift: number;
    upliftPercent: number;
  };
  revenueEst: number;
}

/**
 * Generate teaser result for on-screen display
 * This is a subset of the full diagnostic, optimized for quick consumption
 *
 * NOTE: MCP integration point - this function can be enhanced to call
 * external AI services for more sophisticated analysis
 */
export function generateTeaser(results: DiagnosticResults): TeaserResult {
  // Find best simulation by uplift
  const bestSim = results.simulations.reduce((best, current) =>
    current.uplift > best.uplift ? current : best
  );

  return {
    leakScore: results.leakScore,
    leakBucket: results.leakBucket,
    leakBucketLabel: results.leakBucketLabel,
    topLeaks: results.topLeaks.map((leak) => ({
      title: leak.title,
      description: leak.description,
      impact: leak.impact,
    })),
    bestSimulation: {
      scenario: bestSim.scenario,
      uplift: bestSim.uplift,
      upliftPercent: bestSim.upliftPercent,
    },
    revenueEst: results.revenueEst,
  };
}

// ============================================================================
// FULL REPORT GENERATION
// For email delivery
// ============================================================================

/**
 * Generate full HTML report for email
 *
 * NOTE: MCP integration point - this function can be enhanced to generate
 * more sophisticated reports using AI-powered insights
 */
export function generateFullReport(results: DiagnosticResults, calendarUrl: string): string {
  const { inputs, leakScore, leakBucketLabel, topLeaks, simulations, revenueEst, revenuePerSession } = results;

  const leakSections = topLeaks
    .map(
      (leak, index) => `
    <div style="margin-bottom: 24px; padding: 20px; background: ${index === 0 ? '#fef2f2' : '#fff7ed'}; border-radius: 8px; border-left: 4px solid ${index === 0 ? '#ef4444' : '#f97316'};">
      <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px;">
        ${index === 0 ? '🔴' : '🟠'} Priority ${index + 1}: ${leak.title}
      </h3>
      <p style="margin: 0 0 16px 0; color: #4b5563; line-height: 1.6;">
        ${leak.description}
      </p>
      <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
        What to check first:
      </h4>
      <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
        ${leak.checkFirst.map((item) => `<li style="margin-bottom: 4px;">${item}</li>`).join('')}
      </ul>
    </div>
  `
    )
    .join('');

  const simulationRows = simulations
    .map(
      (sim) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${sim.scenario}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${sim.newRevenue.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #059669; font-weight: 600;">+$${sim.uplift.toLocaleString()} (+${sim.upliftPercent}%)</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Revenue Leak Diagnostic Report</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">

  <!-- Header -->
  <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb;">
    <h1 style="margin: 0 0 8px 0; color: #111827; font-size: 24px;">
      Revenue Leak Diagnostic Report
    </h1>
    <p style="margin: 0; color: #6b7280; font-size: 14px;">
      Prepared for ${inputs.firstName} • ${inputs.storeUrl.replace('https://', '')}
    </p>
  </div>

  <!-- Leak Score -->
  <div style="text-align: center; margin-bottom: 32px; padding: 24px; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; color: white;">
    <p style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8;">
      Your Leak Score
    </p>
    <p style="margin: 0 0 8px 0; font-size: 48px; font-weight: 700;">
      ${leakScore}/100
    </p>
    <p style="margin: 0; font-size: 16px; color: ${leakScore < 40 ? '#fca5a5' : leakScore < 70 ? '#fcd34d' : '#86efac'};">
      ${leakBucketLabel}
    </p>
  </div>

  <!-- Input Summary -->
  <div style="margin-bottom: 32px; padding: 20px; background: #f9fafb; border-radius: 8px;">
    <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #374151;">
      Your Metrics (Last 30 Days)
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Sessions</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 500;">${inputs.sessions30d.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Orders</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 500;">${inputs.orders30d.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Conversion Rate</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 500;">${inputs.conversionRate}%</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Average Order Value</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 500;">$${inputs.aov.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Abandoned Carts</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 500;">${inputs.abandonedCarts30d.toLocaleString()}</td>
      </tr>
      <tr style="border-top: 1px solid #e5e7eb;">
        <td style="padding: 12px 0 8px 0; color: #374151; font-weight: 600;">Est. Monthly Revenue</td>
        <td style="padding: 12px 0 8px 0; text-align: right; font-weight: 700; color: #059669;">$${revenueEst.toLocaleString()}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #374151; font-weight: 600;">Revenue per Session</td>
        <td style="padding: 8px 0; text-align: right; font-weight: 700; color: #059669;">$${revenuePerSession.toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <!-- Top Leaks -->
  <div style="margin-bottom: 32px;">
    <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827;">
      Your Priority Fixes
    </h2>
    ${leakSections || '<p style="color: #6b7280;">Great news! No major leaks detected. Focus on optimization and scaling.</p>'}
  </div>

  <!-- Leverage Simulations -->
  <div style="margin-bottom: 32px;">
    <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #111827;">
      What's Possible
    </h2>
    <p style="margin: 0 0 16px 0; color: #4b5563;">
      Here's how small improvements would impact your monthly revenue:
    </p>
    <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="padding: 12px; text-align: left; font-weight: 600; font-size: 14px;">Scenario</th>
          <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 14px;">New Revenue</th>
          <th style="padding: 12px; text-align: right; font-weight: 600; font-size: 14px;">Monthly Uplift</th>
        </tr>
      </thead>
      <tbody>
        ${simulationRows}
      </tbody>
    </table>
  </div>

  <!-- CTA -->
  <div style="text-align: center; margin-bottom: 32px; padding: 32px; background: linear-gradient(135deg, #4f5c3d 0%, #65774c 100%); border-radius: 12px; color: white;">
    <h2 style="margin: 0 0 12px 0; font-size: 20px;">
      Want a Deeper Analysis?
    </h2>
    <p style="margin: 0 0 20px 0; opacity: 0.9;">
      Book a free 15-minute teardown call to walk through your specific situation and identify your highest-leverage opportunities.
    </p>
    <a href="${calendarUrl}" style="display: inline-block; padding: 14px 28px; background: white; color: #4f5c3d; text-decoration: none; font-weight: 600; border-radius: 8px; font-size: 16px;">
      Book Your Free Teardown →
    </a>
  </div>

  <!-- Footer -->
  <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0 0 8px 0;">
      Tactical Growth Labs • Revenue Optimization for Tactical Gear Brands
    </p>
    <p style="margin: 0;">
      This report was generated automatically based on the metrics you provided.
    </p>
  </div>

</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of the report (email fallback)
 */
export function generateFullReportText(results: DiagnosticResults, calendarUrl: string): string {
  const { inputs, leakScore, leakBucketLabel, topLeaks, simulations, revenueEst, revenuePerSession } = results;

  const leakSections = topLeaks
    .map(
      (leak, index) => `
PRIORITY ${index + 1}: ${leak.title}
${'='.repeat(40)}
${leak.description}

What to check first:
${leak.checkFirst.map((item) => `• ${item}`).join('\n')}
`
    )
    .join('\n');

  const simulationLines = simulations
    .map((sim) => `• ${sim.scenario}: $${sim.newRevenue.toLocaleString()} (+$${sim.uplift.toLocaleString()})`)
    .join('\n');

  return `
REVENUE LEAK DIAGNOSTIC REPORT
==============================
Prepared for ${inputs.firstName}
Store: ${inputs.storeUrl.replace('https://', '')}

YOUR LEAK SCORE: ${leakScore}/100
Status: ${leakBucketLabel}

YOUR METRICS (Last 30 Days)
---------------------------
Sessions: ${inputs.sessions30d.toLocaleString()}
Orders: ${inputs.orders30d.toLocaleString()}
Conversion Rate: ${inputs.conversionRate}%
Average Order Value: $${inputs.aov.toFixed(2)}
Abandoned Carts: ${inputs.abandonedCarts30d.toLocaleString()}

Estimated Monthly Revenue: $${revenueEst.toLocaleString()}
Revenue per Session: $${revenuePerSession.toFixed(2)}

YOUR PRIORITY FIXES
-------------------
${leakSections || 'Great news! No major leaks detected.'}

WHAT'S POSSIBLE
---------------
Small improvements could mean significant gains:
${simulationLines}

NEXT STEP
---------
Book a free 15-minute teardown call:
${calendarUrl}

--
Tactical Growth Labs
Revenue Optimization for Tactical Gear Brands
  `.trim();
}
