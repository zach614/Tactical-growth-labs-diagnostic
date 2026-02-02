import { z } from 'zod';

// Normalize store URL to consistent format
function normalizeStoreUrl(url: string): string {
  let normalized = url.trim().toLowerCase();

  // Remove protocol if present
  normalized = normalized.replace(/^https?:\/\//, '');

  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');

  // Remove www. prefix for consistency
  normalized = normalized.replace(/^www\./, '');

  // Add https:// back for storage
  return `https://${normalized}`;
}

// Monthly revenue range options
export const REVENUE_RANGES = [
  { value: 'under-50k', label: 'Under $50k/month' },
  { value: '50k-150k', label: '$50k – $150k/month' },
  { value: '150k-500k', label: '$150k – $500k/month' },
  { value: '500k-plus', label: '$500k+/month' },
] as const;

export type RevenueRange = typeof REVENUE_RANGES[number]['value'];

// Form validation schema
export const diagnosticFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name is too long')
    .transform(s => s.trim()),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long')
    .transform(s => s.trim().toLowerCase()),

  storeUrl: z
    .string()
    .min(1, 'Store URL is required')
    .max(500, 'URL is too long')
    .refine(
      (url) => {
        // Basic URL validation - should contain a dot and valid characters
        const urlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]*(\.[a-zA-Z0-9-]+)+/;
        const cleaned = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
        return urlPattern.test(cleaned);
      },
      'Please enter a valid store URL (e.g., mystore.com or mystore.myshopify.com)'
    )
    .transform(normalizeStoreUrl),

  sessions30d: z
    .number({ invalid_type_error: 'Sessions must be a number' })
    .int('Sessions must be a whole number')
    .min(0, 'Sessions cannot be negative')
    .max(100000000, 'Sessions value seems too high'),

  orders30d: z
    .number({ invalid_type_error: 'Orders must be a number' })
    .int('Orders must be a whole number')
    .min(0, 'Orders cannot be negative')
    .max(10000000, 'Orders value seems too high'),

  conversionRate: z
    .number({ invalid_type_error: 'Conversion rate must be a number' })
    .min(0, 'Conversion rate cannot be negative')
    .max(20, 'Conversion rate cannot exceed 20%'),

  aov: z
    .number({ invalid_type_error: 'AOV must be a number' })
    .min(0, 'AOV cannot be negative')
    .max(5000, 'AOV cannot exceed $5,000'),

  abandonedCarts30d: z
    .number({ invalid_type_error: 'Abandoned carts must be a number' })
    .int('Abandoned carts must be a whole number')
    .min(0, 'Abandoned carts cannot be negative'),

  monthlyRevenueRange: z
    .enum(['under-50k', '50k-150k', '150k-500k', '500k-plus'])
    .optional()
    .nullable(),
});

export type DiagnosticFormData = z.infer<typeof diagnosticFormSchema>;

// Client-side validation for individual fields
export const fieldValidators = {
  sessions30d: (value: string): string | null => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < 0) return 'Sessions cannot be negative';
    return null;
  },

  orders30d: (value: string): string | null => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < 0) return 'Orders cannot be negative';
    return null;
  },

  conversionRate: (value: string): string | null => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < 0) return 'Rate cannot be negative';
    if (num > 20) return 'Rate seems too high (max 20%)';
    return null;
  },

  aov: (value: string): string | null => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < 0) return 'AOV cannot be negative';
    if (num > 5000) return 'AOV seems too high (max $5,000)';
    return null;
  },

  abandonedCarts30d: (value: string): string | null => {
    const num = parseInt(value, 10);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < 0) return 'Abandoned carts cannot be negative';
    return null;
  },
};
