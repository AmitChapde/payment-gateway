"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import { resetPaymentState } from "@/store/features/payment/paymentSlice";

import { useCallback, useEffect, useRef } from "react";

interface StatusScreenProps {
  onRetry: () => void;
}

export default function StatusScreen({ onRetry }: StatusScreenProps) {
  const dispatch = useAppDispatch();

  const { status, currentTransaction, error } = useAppSelector(
    (state) => state.payment,
  );

  const modalRef = useRef<HTMLDivElement>(null);
  const previousStatusRef = useRef(status);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  const handleClose = useCallback(() => {
    dispatch(resetPaymentState());

    window.setTimeout(() => {
      previousFocusedElementRef.current?.focus();
      previousFocusedElementRef.current = null;
    }, 0);
  }, [dispatch]);

  useEffect(() => {
    if (status !== "idle" && previousStatusRef.current === "idle") {
      previousFocusedElementRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }

    if (status !== "idle" && modalRef.current) {
      modalRef.current.focus();
    }

    previousStatusRef.current = status;
  }, [status]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && status !== "processing") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, status]);

  if (status === "idle" || !currentTransaction) {
    return null;
  }

  const isFailureState = status === "failed" || status === "timeout";

  const maxAttempts = 3;

  const remainingAttempts = Math.max(
    maxAttempts - currentTransaction.attempts,
    0,
  );

  const canRetry = remainingAttempts > 0 && isFailureState;

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && status !== "processing") {
      handleClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-950/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-status-title"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="w-full max-w-md rounded-2xl bg-white p-6 text-zinc-900 shadow-2xl shadow-zinc-950/30 focus:outline-none focus:ring-2 focus:ring-zinc-950"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Payment Status
            </p>

            <h2
              id="payment-status-title"
              className="mt-2 text-2xl font-semibold tracking-tight"
            >
              {status === "processing" && "Processing Payment"}

              {status === "success" && "Payment Successful"}

              {status === "failed" && "Payment Failed"}

              {status === "timeout" && "Payment Timed Out"}
            </h2>
          </div>

          {status !== "processing" && (
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded-full px-2 py-1 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Close payment status"
            >
              Close
            </button>
          )}
        </div>

        {status === "success" && (
          <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
            Your payment was approved and added to transaction history.
          </p>
        )}

        <div className="space-y-3 text-sm">
          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="font-medium text-zinc-900">Transaction ID</p>

            <p className="mt-1 break-all text-zinc-600">
              {currentTransaction.id}
            </p>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4">
            <p className="font-medium text-zinc-900">Amount</p>

            <p className="mt-1 text-zinc-600">
              {currentTransaction.currency} {currentTransaction.amount}
            </p>
          </div>

          {isFailureState && (
            <div className="rounded-xl bg-zinc-50 p-4">
              <p className="font-medium text-zinc-900">
                Attempt {currentTransaction.attempts} of {maxAttempts}
              </p>

              <p className="mt-1 text-zinc-600">
                {remainingAttempts > 0
                  ? `${remainingAttempts} ${
                      remainingAttempts === 1 ? "retry" : "retries"
                    } remaining for this transaction.`
                  : "No retries remaining for this transaction."}
              </p>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {canRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="cursor-pointer rounded-lg bg-zinc-950 px-4 py-2.5 font-medium text-white shadow-lg shadow-zinc-300 transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Retry Payment
            </button>
          )}

          {status !== "processing" && (
            <button
              type="button"
              onClick={handleClose}
              className="cursor-pointer rounded-lg bg-zinc-100 px-4 py-2.5 font-medium text-zinc-900 transition hover:bg-zinc-200"
            >
              {status === "success" ? "Done" : "Dismiss"}
            </button>
          )}
        </div>

        {!canRetry && isFailureState && (
          <p className="mt-4 text-sm text-red-500">
            Final failure after {maxAttempts} attempts. Please start a new
            payment or contact support if the issue continues.
          </p>
        )}

        {status === "processing" && (
          <div className="mt-4 rounded-xl bg-zinc-50 p-4">
            <div className="flex items-center gap-3 text-sm text-zinc-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />

              <p>Please wait while the transaction is being confirmed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
