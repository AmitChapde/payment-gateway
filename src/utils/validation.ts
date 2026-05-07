export function validateCardHolder(value: string) {
  if (!value.trim()) {
    return "Cardholder name is required";
  }

  return "";
}

export function validateCardNumber(value: string, cardType: CardType) {
  const cleaned = value.replace(/\s/g, "");

  if (cardType === "amex") {
    if (cleaned.length !== 15) {
      return "Amex card number must be 15 digits";
    }

    return "";
  }

  if (cleaned.length !== 16) {
    return "Card number must be 16 digits";
  }

  return "";
}

export function validateExpiry(value: string) {
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return "Expiry must be MM/YY";
  }

  const [monthStr, yearStr] = value.split("/");

  const month = Number(monthStr);

  const year = Number(`20${yearStr}`);

  if (month < 1 || month > 12) {
    return "Invalid month";
  }

  const now = new Date();

  const currentYear = now.getFullYear();

  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return "Card has expired";
  }

  return "";
}

import { CardType } from "@/types/payment";

export function validateCVV(value: string, cardType: CardType) {
  const cleaned = value.replace(/\D/g, "");

  if (cardType === "amex") {
    if (cleaned.length !== 4) {
      return "Amex CVV must be 4 digits";
    }

    return "";
  }

  if (cleaned.length !== 3) {
    return "CVV must be 3 digits";
  }

  return "";
}

export function validateAmount(amount: number) {
  if (amount <= 0) {
    return "Amount must be greater than 0";
  }

  return "";
}
