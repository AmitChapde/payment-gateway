"use client";

import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { makePayment } from "@/store/features/payment/paymentThunk";
import { detectCardType } from "@/utils/card";
import {
  formatCardNumber,
  formatExpiry,
} from "@/utils/format";
import {
  validateAmount,
  validateCardHolder,
  validateCardNumber,
  validateCVV,
  validateExpiry,
} from "@/utils/validation";
import { PaymentFormValues } from "@/types/payment";

export default function PaymentForm() {
  const dispatch = useAppDispatch();

  const status = useAppSelector(
    (state) => state.payment.status
  );

  const [values, setValues] =
    useState<PaymentFormValues>({
      cardHolder: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      amount: "",
      currency: "INR",
    });

  const [errors, setErrors] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    amount: "",
  });

  const [touched, setTouched] = useState({
    cardHolder: false,
    cardNumber: false,
    expiry: false,
    cvv: false,
    amount: false,
  });

  const cardType = useMemo(() => {
    return detectCardType(values.cardNumber);
  }, [values.cardNumber]);

  function validateField(
    name: string,
    value: string
  ) {
    switch (name) {
      case "cardHolder":
        return validateCardHolder(value);

      case "cardNumber":
        return validateCardNumber(value);

      case "expiry":
        return validateExpiry(value);

      case "cvv":
        return validateCVV(value, cardType);

      case "amount":
        return validateAmount(Number(value));

      default:
        return "";
    }
  }

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue =
        formatCardNumber(value);
    }

    if (name === "expiry") {
      formattedValue =
        formatExpiry(value);
    }

    if (name === "cvv") {
      formattedValue = value.replace(
        /\D/g,
        ""
      );
    }

    if (name === "amount") {
      formattedValue = value.replace(
        /[^0-9.]/g,
        ""
      );
    }

    setValues((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (name !== "currency") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(
          name,
          formattedValue
        ),
      }));
    }
  }

  function handleBlur(
    e:
      | React.FocusEvent<HTMLInputElement>
      | React.FocusEvent<HTMLSelectElement>
  ) {
    const { name } = e.target;

    if (name !== "currency") {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(
          name,
          values[name as keyof typeof values]
        ),
      }));
    }
  }

  const isFormValid =
    values.cardHolder.trim() !== "" &&
    values.cardNumber.trim() !== "" &&
    values.expiry.trim() !== "" &&
    values.cvv.trim() !== "" &&
    values.amount.trim() !== "" &&
    Object.values(errors).every(
      (error) => error === ""
    );

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !isFormValid ||
      status === "processing"
    ) {
      return;
    }

    const transactionId =
      crypto.randomUUID();

    const transaction = {
      id: transactionId,

      amount: Number(values.amount),

      currency: values.currency,

      cardHolder: values.cardHolder,

      last4:
        values.cardNumber
          .replace(/\s/g, "")
          .slice(-4),

      status: "processing" as const,

      createdAt:
        new Date().toISOString(),

      attempts: 1,
    };

    const payload = {
      transactionId,

      cardHolder: values.cardHolder,

      cardNumber: values.cardNumber,

      expiry: values.expiry,

      cvv: values.cvv,

      amount: Number(values.amount),

      currency: values.currency,
    };

    const resultAction = await dispatch(
      makePayment({
        payload,
        transaction,
      })
    );

    if (
      makePayment.fulfilled.match(
        resultAction
      )
    ) {
      setValues({
        cardHolder: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        amount: "",
        currency: "INR",
      });

      setTouched({
        cardHolder: false,
        cardNumber: false,
        expiry: false,
        cvv: false,
        amount: false,
      });

      setErrors({
        cardHolder: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
        amount: "",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto space-y-5 rounded-xl border p-6 shadow-sm"
    >
      <div className="space-y-2">
        <label
          htmlFor="cardHolder"
          className="block text-sm font-medium"
        >
          Cardholder Name
        </label>

        <input
          id="cardHolder"
          name="cardHolder"
          type="text"
          value={values.cardHolder}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={
            !!errors.cardHolder
          }
          aria-describedby="cardHolder-error"
          className="w-full rounded-md border px-3 py-2 outline-none"
          placeholder="John Doe"
        />

        {touched.cardHolder &&
          errors.cardHolder && (
            <p
              id="cardHolder-error"
              className="text-sm text-red-500"
            >
              {errors.cardHolder}
            </p>
          )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="cardNumber"
          className="block text-sm font-medium"
        >
          Card Number
        </label>

        <div className="relative">
          <input
            id="cardNumber"
            name="cardNumber"
            type="text"
            value={values.cardNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={
              !!errors.cardNumber
            }
            aria-describedby="cardNumber-error"
            maxLength={19}
            className="w-full rounded-md border px-3 py-2 outline-none"
            placeholder="4242 4242 4242 4242"
          />

          <span className="absolute right-3 top-2 text-sm font-medium capitalize">
            {cardType}
          </span>
        </div>

        {touched.cardNumber &&
          errors.cardNumber && (
            <p
              id="cardNumber-error"
              className="text-sm text-red-500"
            >
              {errors.cardNumber}
            </p>
          )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="expiry"
            className="block text-sm font-medium"
          >
            Expiry
          </label>

          <input
            id="expiry"
            name="expiry"
            type="text"
            value={values.expiry}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.expiry}
            aria-describedby="expiry-error"
            placeholder="MM/YY"
            maxLength={5}
            className="w-full rounded-md border px-3 py-2 outline-none"
          />

          {touched.expiry &&
            errors.expiry && (
              <p
                id="expiry-error"
                className="text-sm text-red-500"
              >
                {errors.expiry}
              </p>
            )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="cvv"
            className="block text-sm font-medium"
          >
            CVV
          </label>

          <input
            id="cvv"
            name="cvv"
            type="password"
            value={values.cvv}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.cvv}
            aria-describedby="cvv-error"
            maxLength={
              cardType === "amex"
                ? 4
                : 3
            }
            className="w-full rounded-md border px-3 py-2 outline-none"
            placeholder={
              cardType === "amex"
                ? "1234"
                : "123"
            }
          />

          {touched.cvv &&
            errors.cvv && (
              <p
                id="cvv-error"
                className="text-sm text-red-500"
              >
                {errors.cvv}
              </p>
            )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="amount"
          className="block text-sm font-medium"
        >
          Amount
        </label>

        <div className="flex gap-2">
          <select
            name="currency"
            value={values.currency}
            onChange={handleChange}
            className="rounded-md border px-3 py-2"
          >
            <option value="INR">
              INR
            </option>

            <option value="USD">
              USD
            </option>
          </select>

          <input
            id="amount"
            name="amount"
            type="text"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.amount}
            aria-describedby="amount-error"
            className="flex-1 rounded-md border px-3 py-2 outline-none"
            placeholder="100"
          />
        </div>

        {touched.amount &&
          errors.amount && (
            <p
              id="amount-error"
              className="text-sm text-red-500"
            >
              {errors.amount}
            </p>
          )}
      </div>

      <button
        type="submit"
        disabled={
          !isFormValid ||
          status === "processing"
        }
        className="w-full rounded-md bg-black px-4 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "processing"
          ? "Processing..."
          : "Pay Now"}
      </button>
    </form>
  );
}