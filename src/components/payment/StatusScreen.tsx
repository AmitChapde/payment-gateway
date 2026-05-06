"use client";

import { useAppSelector } from "@/store/hooks";

interface StatusScreenProps {
  onRetry: () => void;
}

export default function StatusScreen({ onRetry }: StatusScreenProps) {
  const { status, currentTransaction, error } = useAppSelector(
    (state) => state.payment,
  );

  if (status === "idle" || !currentTransaction) {
    return null;
  }

  const isFailureState = status === "failed" || status === "timeout";

  const canRetry = currentTransaction.attempts < 3 && isFailureState;

  return (
    <div
      className="mx-auto max-w-md rounded-xl border bg-white p-6 text-zinc-900 shadow-sm"
      tabIndex={-1}
    >
      <h2 className="mb-4 text-2xl font-semibold">
        {status === "processing" && "Processing Payment"}

        {status === "success" && "Payment Successful"}

        {status === "failed" && "Payment Failed"}

        {status === "timeout" && "Payment Timed Out"}
      </h2>

      <div className="space-y-2 text-sm">
        <p>
          <span className="font-medium">Transaction ID:</span>{" "}
          {currentTransaction.id}
        </p>

        <p>
          <span className="font-medium">Amount:</span>{" "}
          {currentTransaction.currency} {currentTransaction.amount}
        </p>

        {isFailureState && (
          <p>
            <span className="font-medium">Attempts:</span>{" "}
            {currentTransaction.attempts} of 3
          </p>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>

      {canRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-md bg-black px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Retry Payment
        </button>
      )}

      {!canRetry && isFailureState && (
        <p className="mt-4 text-sm text-red-500">
          Maximum retry attempts reached.
        </p>
      )}
    </div>
  );
}
