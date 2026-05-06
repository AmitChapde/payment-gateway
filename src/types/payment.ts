export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "timeout";

export type CardType = "visa" | "mastercard" | "amex" | "unknown";

export interface Transaction {
  id: string;
  amount: number;
  currency: "INR" | "USD";
  cardHolder: string;
  last4: string;
  status: PaymentStatus;
  createdAt: string;
  attempts: number;
  failureReason?: string;
}
