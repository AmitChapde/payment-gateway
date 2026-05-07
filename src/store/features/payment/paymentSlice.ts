import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentState, PaymentStatus, Transaction } from "@/types/payment";
import { makePayment } from "./paymentThunk";

const initialState: PaymentState = {
  status: "idle",
  currentTransaction: null,
  history: [],
  error: null,
  selectedTransaction: null,
};

function upsertTransaction(history: Transaction[], transaction: Transaction) {
  const existingIndex = history.findIndex((item) => item.id === transaction.id);

  if (existingIndex !== -1) {
    history[existingIndex] = transaction;
  } else {
    history.unshift(transaction);
  }
}

const paymentSlice = createSlice({
  name: "payment",

  initialState,
  extraReducers: (builder) => {
    builder

      .addCase(makePayment.pending, (state, action) => {
        state.status = "processing";

        state.currentTransaction = action.meta.arg.transaction;

        state.error = null;

        upsertTransaction(state.history, action.meta.arg.transaction);
      })

      .addCase(makePayment.fulfilled, (state, action) => {
        state.status = "success";

        state.currentTransaction = action.payload.transaction;

        state.error = null;

        upsertTransaction(state.history, action.payload.transaction);
      })

      .addCase(makePayment.rejected, (state, action) => {
        if (!action.payload) {
          const failedTransaction = {
            ...action.meta.arg.transaction,
            status: "failed" as const,
            failureReason: action.error.message || "Payment failed",
          };

          state.status = "failed";

          state.currentTransaction = failedTransaction;

          state.error = failedTransaction.failureReason;

          upsertTransaction(state.history, failedTransaction);

          return;
        }

        const payload = action.payload as {
          status: "failed" | "timeout";
          transaction: Transaction;
          error: string;
        };

        state.status = payload.status;

        state.currentTransaction = payload.transaction;

        state.error = payload.error;

        upsertTransaction(state.history, payload.transaction);
      });
  },
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
      }>,
    ) {
      const { transaction, status, error } = action.payload;

      state.status = status;

      state.currentTransaction = transaction;

      state.error = error || null;

      upsertTransaction(state.history, transaction);
    },

    setSelectedTransaction(state, action: PayloadAction<Transaction | null>) {
      state.selectedTransaction = action.payload;
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
  setSelectedTransaction
} = paymentSlice.actions;

export default paymentSlice.reducer;
