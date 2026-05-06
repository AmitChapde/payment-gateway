"use client";

import { useAppSelector } from "@/store/hooks";

export default function TransactionHistory() {
  const history = useAppSelector(
    (state) => state.payment.history
  );

  if (history.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 text-zinc-900 shadow-sm">
        <h2 className="mb-2 text-xl font-semibold">
          Transaction History
        </h2>

        <p className="text-sm text-zinc-500">
          No transactions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6 text-zinc-900 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">
        Transaction History
      </h2>

      <div className="space-y-3">
        {history.map((transaction) => (
          <div
            key={transaction.id}
            className="rounded-lg border bg-white p-4 text-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {
                    transaction.currency
                  }{" "}
                  {transaction.amount}
                </p>

                <p className="text-xs text-zinc-500">
                  ****{" "}
                  {transaction.last4}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm capitalize">
                  {transaction.status}
                </p>

                <p className="text-xs text-zinc-500">
                  {new Date(
                    transaction.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
