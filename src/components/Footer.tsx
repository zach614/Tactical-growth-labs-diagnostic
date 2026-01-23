export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white py-12 border-t border-neutral-800">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* Main footer content */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-neutral-800">
            {/* Logo - text only */}
            <div>
              <p className="font-semibold text-white">Tactical Growth Labs</p>
              <p className="text-sm text-neutral-500">
                Revenue optimization for tactical gear
              </p>
            </div>

            {/* Quick links */}
            <div className="flex items-center gap-6">
              <a
                href="#diagnostic"
                className="text-sm text-neutral-400 hover:text-accent-400 transition-colors"
              >
                Run Diagnostic
              </a>
              <a
                href="#book"
                className="text-sm text-neutral-400 hover:text-accent-400 transition-colors"
              >
                Book Walkthrough
              </a>
              <a
                href="#"
                className="text-sm text-neutral-400 hover:text-accent-400 transition-colors"
              >
                Privacy
              </a>
            </div>
          </div>

          {/* Positioning line */}
          <div className="pt-6 pb-4 text-center">
            <p className="text-sm text-neutral-400">
              Built for operators who already have traffic — and want it to convert.
            </p>
          </div>

          {/* Bottom section */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p>&copy; {currentYear} Tactical Growth Labs. All rights reserved.</p>
            <p>Results vary. This diagnostic estimates potential leaks using provided inputs.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
