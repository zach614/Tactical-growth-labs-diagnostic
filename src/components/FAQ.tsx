'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What metrics do I need to run the diagnostic?',
    answer:
      'You\'ll need 5 metrics from your Shopify Analytics (last 30 days): Sessions, Orders, Conversion Rate, Average Order Value, and Abandoned Carts. Each field in the form includes instructions on exactly where to find these numbers in your Shopify admin.',
  },
  {
    question: 'How accurate is the leak score?',
    answer:
      'The leak score is a directional indicator based on observed performance ranges in e-commerce. It\'s designed to highlight where leverage likely exists, not to assign a grade. The walkthrough is where we validate what\'s real for your store.',
  },
  {
    question: 'What happens after I submit?',
    answer:
      'You\'ll immediately see a summary of your results on screen, including your leak score and top priority fixes. A detailed report with specific recommendations will be emailed to you within minutes.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes. Your data is transmitted securely over HTTPS and stored in our database. We never share your data with third parties. The metrics you provide are only used to generate your diagnostic report.',
  },
  {
    question: 'Why focus on tactical gear stores specifically?',
    answer:
      'Tactical gear has unique characteristics: higher AOV potential, specific customer psychology, seasonal patterns, and distinct product page requirements. Generic e-commerce advice often misses these nuances. Our diagnostic is calibrated specifically for this vertical.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-5 sm:py-8 md:py-12 bg-neutral-950">
      <div className="section-container">
        {/* Divider above */}
        <div className="section-divider mb-4 sm:mb-8" />

        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Everything you need to know about the diagnostic.
            </p>
          </div>

          {/* FAQ items */}
          <div className="space-y-1.5 sm:space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-white/[0.06] rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between p-2.5 sm:p-4 text-left hover:bg-neutral-800/50 transition-colors"
                >
                  <span className="font-medium text-white pr-3 text-xs sm:text-sm">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-500 flex-shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-2.5 sm:px-4 pb-2.5 sm:pb-4 text-neutral-400 text-2xs sm:text-xs md:text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
