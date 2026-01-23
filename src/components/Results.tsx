'use client';

import type { TeaserResult } from '@/lib/diagnostic';

interface ResultsProps {
  teaser: TeaserResult;
  calendarUrl: string;
}

export default function Results({ teaser, calendarUrl }: ResultsProps) {
  const getScoreColor = (bucket: string) => {
    switch (bucket) {
      case 'major':
        return 'text-red-400';
      case 'meaningful':
        return 'text-amber-400';
      case 'solid':
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  const getBadgeClass = (bucket: string) => {
    switch (bucket) {
      case 'major':
        return 'score-badge-major';
      case 'meaningful':
        return 'score-badge-meaningful';
      case 'solid':
        return 'score-badge-solid';
      default:
        return 'score-badge';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  // Conditional copy based on leak score
  const getWalkthroughContext = (leakScore: number) => {
    if (leakScore < 40) {
      return "There's meaningful leakage here — a walkthrough helps prioritize what to fix first.";
    } else if (leakScore < 70) {
      return "A walkthrough helps validate where leverage actually exists.";
    } else {
      return "A walkthrough can confirm whether scaling traffic makes sense right now.";
    }
  };

  return (
    <section
      id="results"
      className="py-16 sm:py-20 bg-neutral-950 animate-fade-in"
    >
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* Success header */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
              <svg
                className="w-7 h-7 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Your Diagnostic Results
            </h2>
            <p className="text-neutral-400">
              Your full report has been emailed to you.
            </p>
          </div>

          {/* Leak Score - Main Metric */}
          <div className="card-elevated mb-8 text-center">
            <p className="text-sm uppercase tracking-wide text-neutral-500 mb-3">
              Leak Score
            </p>
            <p className={`text-6xl font-bold mb-3 ${getScoreColor(teaser.leakBucket)}`}>
              {teaser.leakScore}
              <span className="text-2xl text-neutral-600">/100</span>
            </p>
            <span className={getBadgeClass(teaser.leakBucket)}>
              {teaser.leakBucketLabel}
            </span>

            {/* Revenue context */}
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <p className="text-sm text-neutral-500 mb-1">Estimated Monthly Revenue</p>
              <p className="text-2xl font-semibold text-white">
                ${teaser.revenueEst.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Top 2 Leaks */}
          {teaser.topLeaks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Top Priority {teaser.topLeaks.length === 1 ? 'Fix' : 'Fixes'}
              </h3>
              <div className="space-y-4">
                {teaser.topLeaks.map((leak, index) => (
                  <div
                    key={index}
                    className="card border-l-2 border-l-accent-500"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <span className="w-8 h-8 bg-accent-500/20 text-accent-400 rounded-full flex items-center justify-center font-semibold text-sm border border-accent-500/30">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold text-white">
                            {leak.title}
                          </h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-md font-medium border ${getImpactBadge(
                              leak.impact
                            )}`}
                          >
                            {leak.impact} impact
                          </span>
                        </div>
                        <p className="text-sm text-neutral-400">{leak.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upside Simulation */}
          <div className="highlight-box mb-10">
            <h3 className="text-lg font-semibold text-white mb-3">
              What&apos;s Possible
            </h3>
            <p className="text-sm text-neutral-400 mb-4">
              If you improve <span className="text-white font-medium">{teaser.bestSimulation.scenario.toLowerCase()}</span>:
            </p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-accent-500">
                  +${teaser.bestSimulation.uplift.toLocaleString()}
                </p>
                <p className="text-sm text-neutral-500">per month</p>
              </div>
              <span className="inline-flex items-center px-3 py-1.5 bg-accent-500 text-white rounded-md text-sm font-semibold">
                +{teaser.bestSimulation.upliftPercent}% revenue
              </span>
            </div>
          </div>

          {/* Authority Bridge Block - Walkthrough CTA */}
          <div className="card-elevated">
            <h3 className="text-xl font-semibold text-white mb-3">
              Want to sanity-check this?
            </h3>
            <p className="text-neutral-400 mb-4">
              This diagnostic is directional by design. The fastest way to confirm what&apos;s real — and what&apos;s noise — is to walk through it together.
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              I&apos;ll review your numbers live, explain why these leaks matter (or don&apos;t), and tell you exactly what I&apos;d fix first — and what I&apos;d ignore.
            </p>

            {/* Context based on score */}
            <p className="text-sm text-neutral-400 mb-6 italic">
              {getWalkthroughContext(teaser.leakScore)}
            </p>

            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-lg w-full sm:w-auto"
            >
              Book a 15-Minute Diagnostic Walkthrough
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </a>

            {/* Micro-qualification */}
            <p className="text-xs text-neutral-500 mt-4">
              For tactical gear stores with active traffic. No prep required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
