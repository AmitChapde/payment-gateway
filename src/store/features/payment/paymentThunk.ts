import { createAsyncThunk } from "@reduxjs/toolkit";

import { processPayment } from "@/services/payment.service";

import { PaymentPayload, Transaction } from "@/types/payment";
import {
  MakePaymentArgs,
  MakePaymentFailure,
  MakePaymentSuccess,
} from "@/types/payment";

export const makePayment = createAsyncThunk<
  MakePaymentSuccess,
  MakePaymentArgs,
  { rejectValue: MakePaymentFailure }
>(
  "payment/makePayment",

  async ({ payload, transaction }: MakePaymentArgs, thunkAPI) => {
    try {
      const result = await processPayment(payload);

      if (result.success) {
        return {
          status: "success",

          transaction: {
            ...transaction,
            status: "success",
            failureReason: undefined,
          },
        };
      }

      return thunkAPI.rejectWithValue({
        status: "failed",

        transaction: {
          ...transaction,
          status: "failed",
          failureReason: result.reason,
        },

        error: result.reason,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          return thunkAPI.rejectWithValue({
            status: "timeout",
            transaction: {
              ...transaction,
              status: "timeout",
              failureReason: "Payment timed out",
            },
            error: "Payment timed out",
          });
        }
      }

      return thunkAPI.rejectWithValue({
        status: "failed",

        transaction: {
          ...transaction,
          status: "failed",
          failureReason: "Network error",
        },

        error: "Network error. Please try again.",
      });
    }
  },
);
