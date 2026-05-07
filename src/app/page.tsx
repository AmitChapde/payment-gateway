"use client";

import PaymentForm from "@/components/payment/PaymentForm";

import StatusScreen from "@/components/payment/StatusScreen";

import TransactionHistory from "@/components/payment/TransactionHistory";

import TransactionDetails from "@/components/payment/TransactionDetails";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

import { makePayment } from "@/store/features/payment/paymentThunk";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const currentTransaction =
    useAppSelector(
      (state) =>
        state.payment.currentTransaction
    );

  async function handleRetry() {
    if (
      !currentTransaction ||
      !currentTransaction.payload ||
      currentTransaction.attempts >= 3
    ) {
      return;
    }

    const updatedTransaction = {
      ...currentTransaction,

      attempts:
        currentTransaction.attempts + 1,

      status: "processing" as const,
    };

    await dispatch(
      makePayment({
        payload:
          currentTransaction.payload,

        transaction:
          updatedTransaction,
      })
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950 sm:px-6 lg:flex lg:h-screen lg:items-center lg:overflow-hidden lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-stretch gap-8 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
        <div className="space-y-6 lg:min-h-0 lg:overflow-y-auto lg:pr-1">
          <PaymentForm />

          <StatusScreen
            onRetry={handleRetry}
          />

          <TransactionDetails />
        </div>

        <TransactionHistory />
      </div>
    </main>
  );
} 
