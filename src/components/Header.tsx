'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-800'
          : 'bg-transparent'
      }`}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Text only */}
          <a href="/" className="font-semibold text-white tracking-tight">
            Tactical Growth Labs
          </a>

          {/* Nav Links */}
          <div className="flex items-center gap-4">
            <a
              href="#book"
              className="btn-ghost text-sm hidden sm:inline-flex"
            >
              Book 15-Min Walkthrough
            </a>
            <a
              href="#diagnostic"
              className="btn-primary text-sm py-2 px-4"
            >
              Run Free Diagnostic
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
