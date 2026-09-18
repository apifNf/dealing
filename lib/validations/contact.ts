/** Shared by any form that captures a free-text "email or WA/Telegram" field. */
export function isValidContactInfo(value: string) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhoneOrHandle = /^[+\d][\d\s-]{6,}$/.test(value);
  return isEmail || isPhoneOrHandle;
}

/**
 * WhatsApp-number-only validator for MembershipForm.tsx — deliberately
 * separate from isValidContactInfo (which accepts email OR phone and is
 * shared with onboarding's seller/buyer forms). Do not reuse this for
 * those forms, and do not fold this into isValidContactInfo.
 *
 * Accepts 08xxxxxxxxxx, 62xxxxxxxxxx, or +62xxxxxxxxxx — i.e. an optional
 * "+" only in front of "62", followed by "8" and 8-12 more digits (9-13
 * digits total after the leading "0" or "62"). No letters, "@", spaces, or
 * dashes anywhere.
 */
export function isValidWhatsAppNumber(value: string) {
  return /^(?:\+?62|0)8\d{8,12}$/.test(value.trim());
}
