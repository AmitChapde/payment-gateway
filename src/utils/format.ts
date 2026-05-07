export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  const isAmex = /^3[47]/.test(digits);
  const cleaned = digits.slice(0, isAmex ? 15 : 16);

  if (isAmex) {
    return [cleaned.slice(0, 4), cleaned.slice(4, 10), cleaned.slice(10, 15)]
      .filter(Boolean)
      .join(" ");
  }

  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
}

export function formatExpiry(value: string) {
  const cleaned = value.replace(/\D/g, "").slice(0, 4);
  if (cleaned.length === 0) return "";
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
}
