"use client";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

import { setSelectedTransaction } from "@/store/features/payment/paymentSlice";

export default function TransactionHistory() {
  const dispatch = useAppDispatch();

  const history = useAppSelector(
    (state) => state.payment.history
  );

  function getStatusStyles(
    status: string
  ) {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";

      case "failed":
        return "bg-red-100 text-red-700";

      case "timeout":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-zinc-100 text-zinc-700";
    }
  }

  return (
    <div className="flex max-h-[70vh] flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-2xl shadow-zinc-300 lg:h-full lg:max-h-none lg:min-h-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">
            Transaction History
          </h2>

          <p className="text-sm text-zinc-500">
            Recent payment activity
          </p>
        </div>

        <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
          {history.length}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex min-h-0 flex-1 items-center justify-center rounded-xl bg-zinc-50 shadow-inner shadow-zinc-200">
          <p className="text-sm text-zinc-500">
            No transactions yet
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {history.map((transaction) => (
            <button
              key={transaction.id}
              type="button"
              onClick={() =>
                dispatch(
                  setSelectedTransaction(
                    transaction
                  )
                )
              }
              className="w-full rounded-xl bg-white p-4 text-left shadow-md shadow-zinc-200 transition hover:-translate-y-0.5 hover:bg-zinc-50 hover:shadow-lg hover:shadow-zinc-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <p className="truncate font-semibold text-zinc-900">
                      {
                        transaction.currency
                      }{" "}
                      {transaction.amount}
                    </p>

                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusStyles(
                        transaction.status
                      )}`}
                    >
                      {
                        transaction.status
                      }
                    </span>
                  </div>

                  <p className="text-sm text-zinc-500">
                    ****{" "}
                    {transaction.last4}
                  </p>

                  <p className="mt-1 truncate text-xs text-zinc-400">
                    {
                      transaction.id
                    }
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs text-zinc-500">
                    {new Date(
                      transaction.createdAt
                    ).toLocaleDateString()}
                  </p>

                  <p className="mt-1 text-xs text-zinc-400">
                    {new Date(
                      transaction.createdAt
                    ).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
