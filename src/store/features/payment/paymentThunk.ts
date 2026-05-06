import { createAsyncThunk } from "@reduxjs/toolkit";

import { processPayment } from "@/services/payment.service";

import { PaymentPayload, Transaction } from "@/types/payment";

export const makePayment = createAsyncThunk(
  "payment/makePayment",

  async (
    {
      payload,
      transaction,
    }: {
      payload: PaymentPayload;
      transaction: Transaction;
    },
    thunkAPI,
  ) => {
    try {
      const result = await processPayment(payload);

      if (result.success) {
        return {
          status: "success",
          transaction,
        };
      }

      return thunkAPI.rejectWithValue({
        status: "failed",
        transaction: {
          ...transaction,
          failureReason: result.reason,
        },
        error: result.reason,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return thunkAPI.rejectWithValue({
            status: "timeout",
            transaction,
            error: "Payment timed out",
          });
        }
      }

      return thunkAPI.rejectWithValue({
        status: "failed",
        transaction,
        error: "Network error. Please try again.",
      });
    }
  },
);
