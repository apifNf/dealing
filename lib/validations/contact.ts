/** Shared by any form that captures a free-text "email or WA/Telegram" field. */
export function isValidContactInfo(value: string) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhoneOrHandle = /^[+\d][\d\s-]{6,}$/.test(value);
  return isEmail || isPhoneOrHandle;
}
