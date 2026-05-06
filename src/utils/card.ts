import { CardType } from "@/types/payment";

export function detectCardType(
  cardNumber: string
): CardType {
  const cleaned = cardNumber.replace(/\s/g, "");

  // Visa
  if (/^4/.test(cleaned)) {
    return "visa";
  }

  // Mastercard
  if (/^5[1-5]/.test(cleaned)) {
    return "mastercard";
  }

  // Amex
  if (/^3[47]/.test(cleaned)) {
    return "amex";
  }

  return "unknown";
}