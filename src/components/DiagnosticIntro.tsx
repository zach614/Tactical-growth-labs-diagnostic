export default function DiagnosticIntro() {
  return (
    <section id="diagnostic" className="pt-6 sm:pt-10 md:pt-16 pb-3 sm:pb-5 bg-neutral-950">
      <div className="section-container">
        {/* Divider above */}
        <div className="section-divider mb-5 sm:mb-10" />

        <div className="max-w-2xl mx-auto text-center">
          {/* Section Header */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3">
            Run Your Free Diagnostic
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-neutral-400 mb-1.5 sm:mb-2">
            See a summary instantly — full breakdown emailed for later.
          </p>
          <p className="text-2xs sm:text-xs md:text-sm text-neutral-500">
            Uses your actual Shopify numbers. No ad account access required.
          </p>

          {/* Readiness line */}
          <p className="mt-3 sm:mt-5 text-2xs sm:text-xs md:text-sm text-accent-400/80 font-medium">
            Use last 30 days. Takes about 60 seconds.
          </p>
        </div>
      </div>
    </section>
  );
}
