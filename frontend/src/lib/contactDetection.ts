// Client-side contact information detection utility

const PHONE_PATTERNS = [
  /(\+91[\-\s]?)?[6-9]\d{9}/g,
  /(\+91[\-\s]?)?[6-9]\d{4}[\-\s]\d{5}/g,
  /0\d{10}/g,
  /\b\d{10}\b/g,
];

const EMAIL_PATTERNS = [
  /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
];

const UPI_PATTERNS = [
  /[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+/g,
  /\b\d{10}@[a-zA-Z]+\b/g,
];

export type DetectionResult = {
  hasContactInfo: boolean;
  type?: 'phone' | 'email' | 'upi';
  message?: string;
};

export function validateMessageContent(text: string): DetectionResult {
  // Check for phone numbers
  for (const pattern of PHONE_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      return {
        hasContactInfo: true,
        type: 'phone',
        message: 'Phone number detected',
      };
    }
  }

  // Check for email addresses
  for (const pattern of EMAIL_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      return {
        hasContactInfo: true,
        type: 'email',
        message: 'Email address detected',
      };
    }
  }

  // Check for UPI IDs (more specific check to avoid false positives)
  const upiPattern = /\b[a-zA-Z0-9.\-_]{3,}@(ybl|upi|paytm|gpay|phonepe|okaxis|okhdfcbank|okicici|oksbi|apl|ibl|axl|barodampay|centralbank|cnrb|csbpay|dbs|dcb|equitas|esaf|federal|hdfcbank|icici|idbi|idfc|idfcbank|indus|jkb|jsb|karb|kbl|kotak|kvb|lvb|mahb|nsdl|pnb|rbl|saraswat|sbi|scb|sib|syndicate|tjsb|uco|union|utbi|vijb|yesbank)\b/i;
  if (upiPattern.test(text)) {
    return {
      hasContactInfo: true,
      type: 'upi',
      message: 'UPI ID detected',
    };
  }

  return { hasContactInfo: false };
}
