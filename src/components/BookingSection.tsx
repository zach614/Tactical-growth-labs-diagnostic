'use client';

interface BookingSectionProps {
  calendarUrl: string;
  calendarEmbedUrl?: string;
}

export default function BookingSection({ calendarUrl, calendarEmbedUrl }: BookingSectionProps) {
  return (
    <section id="book" className="py-6 sm:py-10 md:py-16 bg-neutral-950">
      <div className="section-container">
        {/* Divider above */}
        <div className="section-divider mb-5 sm:mb-10" />

        <div className="max-w-2xl mx-auto">
          {/* Card wrapper for visual separation */}
          <div className="section-card">
            {/* Section Header */}
            <div className="text-center mb-4 sm:mb-8">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
                15-Minute Diagnostic Walkthrough
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-neutral-400 max-w-lg mx-auto mb-3 sm:mb-5">
                Short, tactical review of your results. No pitch. No obligation.
              </p>

              {/* What to expect */}
              <ul className="text-left max-w-sm mx-auto space-y-1.5 sm:space-y-2 text-neutral-300 text-2xs sm:text-xs md:text-sm mb-4 sm:mb-6">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Review leak score and assumptions
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm top 1–2 fixes
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Answer specific questions
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Decide next steps (or not)
                </li>
              </ul>

              {/* Qualifier */}
              <p className="text-2xs sm:text-xs text-neutral-500 mb-4 sm:mb-6">
                For tactical gear stores with active traffic. Not a generic pitch.
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
      </div>
    </section>
  );
}
