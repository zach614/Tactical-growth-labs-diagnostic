export default function TransitionBridge() {
  return (
    <section className="py-4 sm:py-8 md:py-10 bg-neutral-950">
      <div className="section-container">
        {/* Divider above */}
        <div className="section-divider mb-4 sm:mb-8" />

        <div className="max-w-2xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3">
            Here&apos;s the problem
          </h2>

          {/* Body */}
          <p className="text-xs sm:text-sm md:text-base text-neutral-400 mb-2 sm:mb-4">
            Most tactical gear stores don&apos;t know where they&apos;re leaking revenue — so they optimize ads instead of fixing the real constraint.
          </p>

          {/* Follow-up line */}
          <p className="text-neutral-300 text-2xs sm:text-xs md:text-sm">
            That&apos;s why we built a simple diagnostic based on the same system-level logic.
          </p>
        </div>
      </div>
    </section>
  );
}
