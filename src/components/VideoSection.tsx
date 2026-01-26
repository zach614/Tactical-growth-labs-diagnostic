'use client';

export default function VideoSection() {
  // Extract video ID from YouTube URL
  const videoId = 'd6txGWXD-xI';

  return (
    <section className="py-12 sm:py-16 bg-neutral-950">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* Section headline */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
            Why This Store Sustained Exceptional ROAS — and Why Most Stores Don&apos;t
          </h2>

          {/* Supporting copy */}
          <p className="text-neutral-400 text-center max-w-2xl mx-auto mb-8">
            This isn&apos;t about copying ads. It&apos;s about store economics, leverage, and decision systems that allow paid traffic to compound instead of exposing leaks.
          </p>

          {/* Video embed */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0`}
              title="Why This Store Sustained Exceptional ROAS"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Video caption / credibility line */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-300">
              Average ROAS of $13.37 over 3 years and 5 months.
              <br />
              Example spike: $15.72 ROAS in June.
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              Individual months fluctuate. The point is durability, not a single outlier.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
