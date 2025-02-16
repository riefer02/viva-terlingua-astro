/**
 * Format options for different date styles
 */
export const DATE_FORMATS = {
  FULL: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  SHORT: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  WITH_TIME: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
} as const;

/**
 * Format a date string into a human-readable format
 * @param dateString - ISO date string or Date object
 * @param format - Format options from DATE_FORMATS
 * @param locale - Locale string (defaults to 'en-US')
 * @returns Formatted date string or empty string if date is invalid
 */
export function formatDate(
  dateString: string | Date | undefined,
  format: keyof typeof DATE_FORMATS = 'FULL',
  locale: string = 'en-US'
): string {
  if (!dateString) return '';

  try {
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString(locale, DATE_FORMATS[format]);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Date]', dateString, error);
    }
    return '';
  }
}

/**
 * Get a machine-readable ISO date string for HTML time elements
 * @param dateString - ISO date string or Date object
 * @returns ISO date string or empty string if date is invalid
 */
export function getISODate(dateString: string | Date | undefined): string {
  if (!dateString) return '';

  try {
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toISOString();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Date]', dateString, error);
    }
    return '';
  }
}

/**
 * Check if a date is in the future
 * @param dateString - ISO date string or Date object
 * @returns boolean indicating if date is in the future
 */
export function isFutureDate(dateString: string | Date | undefined): boolean {
  if (!dateString) return false;

  try {
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date > new Date();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Date]', dateString, error);
    }
    return false;
  }
}
