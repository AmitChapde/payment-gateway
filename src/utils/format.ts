export function formatCardNumber(
  value: string
) {
  const cleaned = value.replace(/\D/g, "");

  return cleaned
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}