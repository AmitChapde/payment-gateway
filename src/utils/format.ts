export function formatCardNumber(
  value: string
) {
  const cleaned = value.replace(/\D/g, "");

  return cleaned
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

export function formatExpiry(
  value: string
) {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length <= 2) {
    return cleaned;
  }

  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
}