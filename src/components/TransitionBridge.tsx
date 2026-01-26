export default function TransitionBridge() {
  return (
    <section className="py-12 sm:py-16 bg-neutral-950">
      <div className="section-container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            Here&apos;s the problem
          </h2>

          {/* Body */}
          <p className="text-neutral-400 mb-6">
            Most tactical gear stores don&apos;t know where they&apos;re leaking revenue.
            <br className="hidden sm:block" />
            So they optimize ads, traffic, or tactics — instead of fixing the real constraint.
          </p>

          {/* Follow-up line */}
          <p className="text-neutral-300 text-sm">
            That&apos;s why we built a simple diagnostic based on the same system-level logic.
          </p>
        </div>
      </div>
    </section>
  );
}
