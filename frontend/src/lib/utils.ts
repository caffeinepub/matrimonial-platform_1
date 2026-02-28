import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Blurs a phone number showing only first 2 and last 2 digits
 * e.g. '9876543210' becomes '98XXXXXX10'
 */
export function blurPhoneNumber(phone: string): string {
  if (!phone || phone.length < 4) return phone;
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 4) return phone;
  const first2 = cleaned.slice(0, 2);
  const last2 = cleaned.slice(-2);
  const xCount = cleaned.length - 4;
  return `${first2}${"X".repeat(xCount)}${last2}`;
}

/**
 * Detects if a message contains contact information (phone, UPI, email)
 */
export function detectContactInfo(text: string): { detected: boolean; type?: string } {
  // Phone number patterns (Indian)
  const phonePattern = /(\+91[\s-]?)?[6-9]\d{9}/g;
  // UPI ID pattern
  const upiPattern = /[\w.\-]+@[a-zA-Z]+/g;
  // Email pattern
  const emailPattern = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

  if (phonePattern.test(text)) {
    return { detected: true, type: "phone number" };
  }
  if (emailPattern.test(text)) {
    return { detected: true, type: "email address" };
  }
  if (upiPattern.test(text)) {
    return { detected: true, type: "UPI ID" };
  }
  return { detected: false };
}
