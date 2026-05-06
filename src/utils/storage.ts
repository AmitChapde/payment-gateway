import { Transaction } from "@/types/payment";

const STORAGE_KEY = "payment-history";

export function saveTransactions(
  transactions: Transaction[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(transactions)
  );
}

export function loadTransactions(): Transaction[] {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}