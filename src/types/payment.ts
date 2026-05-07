export type PaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "failed"
  | "timeout";

export type Currency = "INR" | "USD";

export type CardType = "visa" | "mastercard" | "amex" | "unknown";

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
  payload?: PaymentPayload;
}

export interface PaymentState {
  status: PaymentStatus;
  currentTransaction: Transaction | null;
  selectedTransaction: Transaction | null;
  history: Transaction[];
  error: string | null;
}

export interface PaymentFormValues {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: string;
  currency: Currency;
}


export type MakePaymentArgs = {
  payload: PaymentPayload;
  transaction: Transaction;
};

export type MakePaymentSuccess = {
  status: "success";
  transaction: Transaction;
};

export type MakePaymentFailure = {
  status: "failed" | "timeout";
  transaction: Transaction;
  error: string;
};