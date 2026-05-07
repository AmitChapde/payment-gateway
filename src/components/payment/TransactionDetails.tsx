"use client";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

import { setSelectedTransaction } from "@/store/features/payment/paymentSlice";

export default function TransactionDetails() {
  const dispatch = useAppDispatch();

  const selectedTransaction =
    useAppSelector(
      (state) =>
        state.payment.selectedTransaction
    );

  if (!selectedTransaction) {
    return null;
  }

  function handleClose() {
    dispatch(
      setSelectedTransaction(null)
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Transaction Details
          </h2>

          <button
            onClick={handleClose}
            className="cursor-pointer text-sm text-zinc-500 transition hover:text-zinc-900"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 text-sm text-zinc-700">
          <div>
            <p className="font-medium text-zinc-900">
              Transaction ID
            </p>

            <p className="break-all">
              {selectedTransaction.id}
            </p>
          </div>

          <div>
            <p className="font-medium text-zinc-900">
              Status
            </p>

            <p className="capitalize">
              {
                selectedTransaction.status
              }
            </p>
          </div>

          <div>
            <p className="font-medium text-zinc-900">
              Amount
            </p>

            <p>
              {
                selectedTransaction.currency
              }{" "}
              {
                selectedTransaction.amount
              }
            </p>
          </div>

          <div>
            <p className="font-medium text-zinc-900">
              Card
            </p>

            <p>
              ****{" "}
              {
                selectedTransaction.last4
              }
            </p>
          </div>

          <div>
            <p className="font-medium text-zinc-900">
              Card Holder
            </p>

            <p>
              {
                selectedTransaction.cardHolder
              }
            </p>
          </div>

          {(selectedTransaction.status ===
            "failed" ||
            selectedTransaction.status ===
              "timeout") && (
            <div>
              <p className="font-medium text-zinc-900">
                Attempts
              </p>

              <p>
                {
                  selectedTransaction.attempts
                }{" "}
                of 3
              </p>
            </div>
          )}

          <div>
            <p className="font-medium text-zinc-900">
              Created
            </p>

            <p>
              {new Date(
                selectedTransaction.createdAt
              ).toLocaleString()}
            </p>
          </div>

          {selectedTransaction.failureReason && (
            <div>
              <p className="font-medium text-red-600">
                Failure Reason
              </p>

              <p className="text-red-500">
                {
                  selectedTransaction.failureReason
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
