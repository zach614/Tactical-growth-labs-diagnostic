'use client';

import { useState } from 'react';
import { REVENUE_RANGES } from '@/lib/validation';
import type { TeaserResult } from '@/lib/diagnostic';

// Shopify metric instructions
const SHOPIFY_INSTRUCTIONS: Record<string, { path: string; note?: string }> = {
  sessions30d: {
    path: 'Analytics → Overview → Last 30 days → "Sessions"',
    note: 'Total sessions, not unique visitors',
  },
  orders30d: {
    path: 'Analytics → Overview → Last 30 days → "Total orders"',
  },
  conversionRate: {
    path: 'Analytics → Overview → Last 30 days → "Online store conversion rate"',
    note: 'Enter as percentage (e.g., 2.3 for 2.3%)',
  },
  aov: {
    path: 'Analytics → Overview → Last 30 days → "Average order value"',
    note: 'Enter the dollar amount without the $ sign',
  },
  abandonedCarts30d: {
    path: 'Shopify Admin → Analytics → Dashboards or Reports → Search "Abandoned carts" → Set date range to last 30 days → Use total abandoned carts.',
    note: 'Exact labels vary by Shopify plan. Use the closest matching total.',
  },
};

interface DiagnosticFormProps {
  onSubmitSuccess: (teaser: TeaserResult) => void;
}

export default function DiagnosticForm({ onSubmitSuccess }: DiagnosticFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    storeUrl: '',
    monthlyRevenueRange: '',
    sessions30d: '',
    orders30d: '',
    conversionRate: '',
    aov: '',
    abandonedCarts30d: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [expandedHelper, setExpandedHelper] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.storeUrl.trim()) {
      newErrors.storeUrl = 'Store URL is required';
    }

    // Numeric fields
    const sessions = parseInt(formData.sessions30d, 10);
    if (isNaN(sessions) || sessions < 0) {
      newErrors.sessions30d = 'Please enter a valid number';
    }

    const orders = parseInt(formData.orders30d, 10);
    if (isNaN(orders) || orders < 0) {
      newErrors.orders30d = 'Please enter a valid number';
    }

    const conversionRate = parseFloat(formData.conversionRate);
    if (isNaN(conversionRate) || conversionRate < 0 || conversionRate > 20) {
      newErrors.conversionRate = 'Please enter a rate between 0 and 20';
    }

    const aov = parseFloat(formData.aov);
    if (isNaN(aov) || aov < 0 || aov > 5000) {
      newErrors.aov = 'Please enter an amount between 0 and 5000';
    }

    const abandonedCarts = parseInt(formData.abandonedCarts30d, 10);
    if (isNaN(abandonedCarts) || abandonedCarts < 0) {
      newErrors.abandonedCarts30d = 'Please enter a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/diagnostic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          email: formData.email.trim(),
          storeUrl: formData.storeUrl.trim(),
          monthlyRevenueRange: formData.monthlyRevenueRange || null,
          sessions30d: parseInt(formData.sessions30d, 10),
          orders30d: parseInt(formData.orders30d, 10),
          conversionRate: parseFloat(formData.conversionRate),
          aov: parseFloat(formData.aov),
          abandonedCarts30d: parseInt(formData.abandonedCarts30d, 10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Call success handler with teaser results
      onSubmitSuccess(data.teaser);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHelper = (field: string) => {
    setExpandedHelper(expandedHelper === field ? null : field);
  };

  const renderShopifyHelper = (field: string) => {
    const instruction = SHOPIFY_INSTRUCTIONS[field];
    if (!instruction) return null;

    const isExpanded = expandedHelper === field;

    return (
      <div className="mt-1">
        <button
          type="button"
          onClick={() => toggleHelper(field)}
          className="accordion-trigger text-2xs sm:text-xs"
        >
          <svg
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          Where to find in Shopify
        </button>
        <div
          className={`accordion-content ${
            isExpanded ? 'max-h-40 opacity-100 mt-1.5' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="text-2xs sm:text-xs bg-neutral-800 rounded-md p-2 sm:p-2.5 border border-neutral-700">
            <code className="block text-accent-400 mb-0.5 font-mono text-2xs sm:text-xs">{instruction.path}</code>
            {instruction.note && (
              <p className="text-neutral-500 italic text-2xs">{instruction.note}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="pb-6 sm:pb-10 md:pb-16 bg-neutral-950">
      <div className="section-container px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="card-elevated p-3 sm:p-5">
            {/* Contact Information */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2.5 sm:mb-3 pb-2 border-b border-neutral-800">
                Your Information
              </h3>
              <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label htmlFor="firstName" className="form-label">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'form-input-error' : 'form-input'}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="form-error">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'form-input-error' : 'form-input'}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
              </div>

              <div className="mt-2.5 sm:mt-3">
                <label htmlFor="storeUrl" className="form-label">
                  Store URL *
                </label>
                <input
                  type="text"
                  id="storeUrl"
                  name="storeUrl"
                  value={formData.storeUrl}
                  onChange={handleChange}
                  className={errors.storeUrl ? 'form-input-error' : 'form-input'}
                  placeholder="mystore.com"
                />
                {errors.storeUrl && (
                  <p className="form-error">{errors.storeUrl}</p>
                )}
              </div>

              <div className="mt-2.5 sm:mt-3">
                <label htmlFor="monthlyRevenueRange" className="form-label">
                  Revenue Range{' '}
                  <span className="text-neutral-500 font-normal">(optional)</span>
                </label>
                <select
                  id="monthlyRevenueRange"
                  name="monthlyRevenueRange"
                  value={formData.monthlyRevenueRange}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select a range...</option>
                  {REVENUE_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shopify Metrics */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2.5 sm:mb-3 pb-2 border-b border-neutral-800">
                Shopify Metrics (Last 30 Days)
              </h3>

              <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label htmlFor="sessions30d" className="form-label">
                    Sessions *
                  </label>
                  <input
                    type="number"
                    id="sessions30d"
                    name="sessions30d"
                    value={formData.sessions30d}
                    onChange={handleChange}
                    className={errors.sessions30d ? 'form-input-error' : 'form-input'}
                    placeholder="e.g., 15000"
                    min="0"
                  />
                  {errors.sessions30d && (
                    <p className="form-error">{errors.sessions30d}</p>
                  )}
                  {renderShopifyHelper('sessions30d')}
                </div>

                <div>
                  <label htmlFor="orders30d" className="form-label">
                    Total Orders *
                  </label>
                  <input
                    type="number"
                    id="orders30d"
                    name="orders30d"
                    value={formData.orders30d}
                    onChange={handleChange}
                    className={errors.orders30d ? 'form-input-error' : 'form-input'}
                    placeholder="e.g., 350"
                    min="0"
                  />
                  {errors.orders30d && (
                    <p className="form-error">{errors.orders30d}</p>
                  )}
                  {renderShopifyHelper('orders30d')}
                </div>

                <div>
                  <label htmlFor="conversionRate" className="form-label">
                    Conversion Rate (%) *
                  </label>
                  <input
                    type="number"
                    id="conversionRate"
                    name="conversionRate"
                    value={formData.conversionRate}
                    onChange={handleChange}
                    className={errors.conversionRate ? 'form-input-error' : 'form-input'}
                    placeholder="e.g., 2.3"
                    step="0.01"
                    min="0"
                    max="20"
                  />
                  {errors.conversionRate && (
                    <p className="form-error">{errors.conversionRate}</p>
                  )}
                  {renderShopifyHelper('conversionRate')}
                </div>

                <div>
                  <label htmlFor="aov" className="form-label">
                    Average Order Value ($) *
                  </label>
                  <input
                    type="number"
                    id="aov"
                    name="aov"
                    value={formData.aov}
                    onChange={handleChange}
                    className={errors.aov ? 'form-input-error' : 'form-input'}
                    placeholder="e.g., 145"
                    step="0.01"
                    min="0"
                    max="5000"
                  />
                  {errors.aov && <p className="form-error">{errors.aov}</p>}
                  {renderShopifyHelper('aov')}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="abandonedCarts30d" className="form-label">
                    Abandoned Carts (Last 30 Days) *
                  </label>
                  <input
                    type="number"
                    id="abandonedCarts30d"
                    name="abandonedCarts30d"
                    value={formData.abandonedCarts30d}
                    onChange={handleChange}
                    className={errors.abandonedCarts30d ? 'form-input-error' : 'form-input'}
                    placeholder="e.g., 450"
                    min="0"
                  />
                  <p className="text-2xs sm:text-xs text-neutral-500 mt-0.5">Carts started but not completed</p>
                  {errors.abandonedCarts30d && (
                    <p className="form-error">{errors.abandonedCarts30d}</p>
                  )}
                  {renderShopifyHelper('abandonedCarts30d')}
                </div>
              </div>
            </div>

            {/* Submit error */}
            {submitError && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-2xs sm:text-xs">
                {submitError}
              </div>
            )}

            {/* Pre-submit micro-copy */}
            <p className="text-center text-2xs sm:text-xs text-neutral-500 mb-2.5 sm:mb-3">
              See teaser instantly. Full report emailed.
            </p>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary-lg w-full"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing Your Store...
                </>
              ) : (
                'Generate My Diagnostic Report'
              )}
            </button>

            {/* Privacy note */}
            <p className="text-center text-2xs sm:text-xs text-neutral-500 mt-2.5 sm:mt-3">
              Your data is secure and never shared.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
