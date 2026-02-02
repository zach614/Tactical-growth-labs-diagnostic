'use client';

export default function ProofVideo() {
  return (
    <section className="py-5 sm:py-8 md:py-12 bg-neutral-950">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          {/* What This Is / What This Isn't Card */}
          <div className="rounded-lg border border-white/[0.06] p-3 sm:p-5">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* What This Is */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  What This Is
                </h3>
                <ul className="space-y-1.5 sm:space-y-2 text-neutral-300 text-2xs sm:text-xs md:text-sm">
                  <li className="flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5 text-2xs">•</span>
                    Quick diagnostic using your Shopify metrics
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5 text-2xs">•</span>
                    Identifies top 2 conversion leaks
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5 text-2xs">•</span>
                    Estimates revenue upside from fixes
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5 text-2xs">•</span>
                    Simple priority order
                  </li>
                </ul>
              </div>

              {/* Divider for mobile */}
              <div className="divider md:hidden" />

              {/* What This Isn't */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  What This Isn&apos;t
                </h3>
                <ul className="space-y-1.5 sm:space-y-2 text-neutral-400 text-2xs sm:text-xs md:text-sm">
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5 text-2xs">•</span>
                    Not a traffic or ad account audit
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5 text-2xs">•</span>
                    Not an ad swipe or keyword list
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5 text-2xs">•</span>
                    Not a generic agency pitch
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5 text-2xs">•</span>
                    No ad account access required
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
