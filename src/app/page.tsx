'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProofVideo from '@/components/ProofVideo';
import DiagnosticIntro from '@/components/DiagnosticIntro';
import DiagnosticForm from '@/components/DiagnosticForm';
import Results from '@/components/Results';
import BookingSection from '@/components/BookingSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import MobileCTA from '@/components/MobileCTA';
import type { TeaserResult } from '@/lib/diagnostic';

// Calendar URLs - uses env vars in production
const CALENDAR_URL = process.env.NEXT_PUBLIC_CALENDAR_URL || '#';
const CALENDAR_EMBED_URL = process.env.NEXT_PUBLIC_CALENDAR_EMBED_URL || '';

export default function HomePage() {
  const [showResults, setShowResults] = useState(false);
  const [teaserResults, setTeaserResults] = useState<TeaserResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleDiagnosticSuccess = (teaser: TeaserResult) => {
    setTeaserResults(teaser);
    setShowResults(true);
  };

  // Scroll to results when they appear
  useEffect(() => {
    if (showResults && resultsRef.current) {
      // Small delay to ensure the component has rendered
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [showResults]);

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* What This Is / What This Isn't */}
        <ProofVideo />

        {/* Diagnostic Section */}
        {!showResults && (
          <>
            <DiagnosticIntro />
            <DiagnosticForm onSubmitSuccess={handleDiagnosticSuccess} />
          </>
        )}

        {/* Results Section (shown after submission) */}
        {showResults && teaserResults && (
          <div ref={resultsRef}>
            <Results teaser={teaserResults} calendarUrl={CALENDAR_URL} />
          </div>
        )}

        {/* Booking Section */}
        <BookingSection
          calendarUrl={CALENDAR_URL}
          calendarEmbedUrl={CALENDAR_EMBED_URL || undefined}
        />

        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer />

      {/* Mobile Sticky CTA */}
      <MobileCTA showResults={showResults} calendarUrl={CALENDAR_URL} />
    </>
  );
}
