export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "timeout";

export type Currency = "INR" | "USD";

export type CardType =
  | "visa"
  | "mastercard"
  | "amex"
  | "unknown";

export interface PaymentPayload {
  transactionId: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: number;
  currency: Currency;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  cardHolder: string;
  last4: string;
  status: PaymentStatus;
  createdAt: string;
  attempts: number;
  failureReason?: string;
}

export interface PaymentState {
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  history: Transaction[];
  error: string | null;
}