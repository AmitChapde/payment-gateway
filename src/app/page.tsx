"use client";

import PaymentForm from "@/components/payment/PaymentForm";

import StatusScreen from "@/components/payment/StatusScreen";

import TransactionHistory from "@/components/payment/TransactionHistory";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

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
      !currentTransaction.payload
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
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PaymentForm />

          <StatusScreen
            onRetry={handleRetry}
          />
        </div>

        <TransactionHistory />
      </div>
    </main>
  );
}
