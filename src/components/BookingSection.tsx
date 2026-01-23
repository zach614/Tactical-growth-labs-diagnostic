'use client';

interface BookingSectionProps {
  calendarUrl: string;
  calendarEmbedUrl?: string;
}

export default function BookingSection({ calendarUrl, calendarEmbedUrl }: BookingSectionProps) {
  return (
    <section id="book" className="py-16 sm:py-20 bg-neutral-900">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              15-Minute Diagnostic Walkthrough
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto mb-6">
              This is a short, tactical review of your diagnostic results. No pitch. No obligation.
            </p>

            {/* What to expect */}
            <ul className="text-left max-w-md mx-auto space-y-3 text-neutral-300 text-sm mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Review your leak score and assumptions
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm top 1–2 fixes
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Answer specific questions
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Decide next steps (or not)
              </li>
            </ul>

            {/* Qualifier */}
            <p className="text-sm text-neutral-500 mb-8">
              This is for tactical gear stores with active traffic. We&apos;ll review your diagnostic results and answer specific questions. This is not a generic marketing pitch.
            </p>
          </div>

          {/* Calendar embed or button */}
          {calendarEmbedUrl ? (
            <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
              <iframe
                src={calendarEmbedUrl}
                width="100%"
                height="700"
                frameBorder="0"
                className="w-full"
                title="Book a 15-Minute Diagnostic Walkthrough"
              />
            </div>
          ) : (
            <div className="text-center">
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-lg"
              >
                Book My Walkthrough
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
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
