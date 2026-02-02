'use client';

export default function VideoSection() {
  // Extract video ID from YouTube URL
  const videoId = 'RolPuylur9Y';

  return (
    <section className="py-5 sm:py-8 md:py-14 bg-neutral-950">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          {/* Video container with subtle border */}
          <div className="section-card">
            {/* Section headline */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center mb-2 sm:mb-3">
              Why This Store Sustained Exceptional ROAS — and Why Most Don&apos;t
            </h2>

            {/* Supporting copy */}
            <p className="text-xs sm:text-sm md:text-base text-neutral-400 text-center max-w-xl mx-auto mb-4 sm:mb-6">
              Store economics, leverage, and decision systems that allow paid traffic to compound instead of exposing leaks.
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
            <div className="mt-3 sm:mt-5 text-center">
              <p className="text-xs sm:text-sm text-neutral-300">
                Average ROAS of $13.37 over 3+ years. Example spike: $15.72 in June.
              </p>
              <p className="text-2xs sm:text-xs text-neutral-500 mt-1">
                Individual months fluctuate. The point is durability, not a single outlier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
