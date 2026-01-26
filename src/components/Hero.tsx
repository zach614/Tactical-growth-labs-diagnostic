export default function Hero() {
  return (
    <section className="py-16 sm:py-20 bg-neutral-950">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full"></span>
            Free Revenue Diagnostic
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 text-balance">
            Most Tactical Gear Stores Are{' '}
            <span className="text-accent-500">Bleeding Revenue</span>{' '}
            — Find Out Exactly Where in 60 Seconds
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-4">
            Enter 5 numbers from your Shopify dashboard to uncover your store&apos;s
            biggest conversion leaks and what to fix first.
          </p>

          {/* Authority/credibility line */}
          <p className="text-sm text-neutral-500 max-w-xl mx-auto mb-8">
            Based on the same diagnostic logic used to support a tactical gear store averaging $13.37 ROAS over 3+ years.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#diagnostic"
              className="btn-primary-lg w-full sm:w-auto"
            >
              Run Free Diagnostic
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
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
            <a
              href="#book"
              className="btn-secondary w-full sm:w-auto"
            >
              Book 15-Min Walkthrough
            </a>
          </div>

          {/* Social proof - minimal */}
          <p className="mt-10 text-sm text-neutral-500">
            Used by 50+ tactical gear stores doing $50k–$2M/month
          </p>
        </div>
      </div>
    </section>
  );
}
