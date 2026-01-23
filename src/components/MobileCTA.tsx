'use client';

import { useState, useEffect } from 'react';

interface MobileCTAProps {
  showResults: boolean;
  calendarUrl: string;
}

export default function MobileCTA({ showResults, calendarUrl }: MobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past the hero (approximately 400px)
      const shouldShow = window.scrollY > 400;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render on desktop or when not visible
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-800 sm:hidden z-50">
      {showResults ? (
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full justify-center"
        >
          Book 15-Min Walkthrough
        </a>
      ) : (
        <a href="#diagnostic" className="btn-primary w-full justify-center">
          Run Free Diagnostic
        </a>
      )}
    </div>
  );
}
