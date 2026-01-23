'use client';

export default function ProofVideo() {
  return (
    <section className="py-16 sm:py-20 bg-neutral-900">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* What This Is / What This Isn't Card */}
          <div className="card-elevated">
            <div className="grid md:grid-cols-2 gap-8">
              {/* What This Is */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  What This Is
                </h3>
                <ul className="space-y-3 text-neutral-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    A quick diagnostic using your actual Shopify metrics
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Identifies your top 2 conversion leaks
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Estimates revenue upside from fixing the right thing first
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    Gives you a simple priority order
                  </li>
                </ul>
              </div>

              {/* Divider for mobile */}
              <div className="divider md:hidden" />

              {/* What This Isn't */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  What This Isn&apos;t
                </h3>
                <ul className="space-y-3 text-neutral-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    Not a traffic audit or ad account review
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    Not an ad swipe file or keyword list
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    Not a generic agency pitch
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
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
