"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";

import { store } from "@/store/store";

import {
  loadTransactions,
  saveTransactions,
} from "@/utils/storage";

import { loadTransactions as loadTransactionsAction } from "@/store/features/payment/paymentSlice";

function StorePersistence() {
  useEffect(() => {
    const existingTransactions =
      loadTransactions();

    store.dispatch(
      loadTransactionsAction(existingTransactions)
    );

    const unsubscribe = store.subscribe(() => {
      saveTransactions(
        store.getState().payment.history
      );
    });

    return unsubscribe;
  }, []);

  return null;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <StorePersistence />
      {children}
    </Provider>
  );
}