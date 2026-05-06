import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PaymentState,
  PaymentStatus,
  Transaction,
} from "@/types/payment";

const initialState: PaymentState = {
  status: "idle",
  currentTransaction: null,
  history: [],
  error: null,
};

function upsertTransaction(
  history: Transaction[],
  transaction: Transaction
) {
  const existingIndex = history.findIndex(
    (item) => item.id === transaction.id
  );

  if (existingIndex !== -1) {
    history[existingIndex] = transaction;
  } else {
    history.unshift(transaction);
  }
}

const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    setProcessing(state) {
      state.status = "processing";
      state.error = null;
    },

    setPaymentResult(
      state,
      action: PayloadAction<{
        transaction: Transaction;
        status: PaymentStatus;
        error?: string;
      }>
    ) {
      const { transaction, status, error } = action.payload;

      state.status = status;

      state.currentTransaction = transaction;

      state.error = error || null;

      upsertTransaction(state.history, transaction);
    },

    loadTransactions(state, action: PayloadAction<Transaction[]>) {
      state.history = action.payload;
    },

    resetPaymentState(state) {
      state.status = "idle";
      state.currentTransaction = null;
      state.error = null;
    },
  },
});

export const {
  setProcessing,
  setPaymentResult,
  loadTransactions,
  resetPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;