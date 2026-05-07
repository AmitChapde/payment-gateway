"use client";

import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { makePayment } from "@/store/features/payment/paymentThunk";
import { detectCardType } from "@/utils/card";
import { formatCardNumber, formatExpiry } from "@/utils/format";
import {
  validateAmount,
  validateCardHolder,
  validateCardNumber,
  validateCVV,
  validateExpiry,
} from "@/utils/validation";
import { PaymentFormValues } from "@/types/payment";
import CardPreview from "./CardPreview";
import { FaCcAmex, FaCcMastercard, FaCcVisa } from "react-icons/fa6";

export default function PaymentForm() {
  const dispatch = useAppDispatch();

  const status = useAppSelector((state) => state.payment.status);

  const [values, setValues] = useState<PaymentFormValues>({
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

  function validateField(name: string, value: string) {
    switch (name) {
      case "cardHolder":
        return validateCardHolder(value);

      case "cardNumber":
        return validateCardNumber(value, cardType);

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
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    }

    if (name === "expiry") {
      formattedValue = formatExpiry(value);
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "");
    }

    if (name === "amount") {
      formattedValue = value.replace(/[^0-9.]/g, "");
    }

    setValues((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (name !== "currency") {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, formattedValue),
      }));
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLSelectElement>,
  ) {
    const { name } = e.target;

    if (name !== "currency") {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, values[name as keyof typeof values]),
      }));
    }
  }

  const isFormValid =
    values.cardHolder.trim() !== "" &&
    values.cardNumber.trim() !== "" &&
    values.expiry.trim() !== "" &&
    values.cvv.trim() !== "" &&
    values.amount.trim() !== "" &&
    Object.values(errors).every((error) => error === "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid || status === "processing") {
      return;
    }

    const transactionId = crypto.randomUUID();
    const payload = {
      transactionId,

      cardHolder: values.cardHolder,

      cardNumber: values.cardNumber,

      expiry: values.expiry,

      cvv: values.cvv,

      amount: Number(values.amount),

      currency: values.currency,
    };

    const transaction = {
      id: transactionId,

      amount: Number(values.amount),

      currency: values.currency,

      cardHolder: values.cardHolder,

      last4: values.cardNumber.replace(/\s/g, "").slice(-4),

      status: "processing" as const,

      createdAt: new Date().toISOString(),

      attempts: 1,

      payload,
    };

    const resultAction = await dispatch(
      makePayment({
        payload,
        transaction,
      }),
    );

    if (makePayment.fulfilled.match(resultAction)) {
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
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Secure Checkout
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          Complete your{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-0 bottom-1 h-3 rounded-full " />
            <span className="relative text-emerald-800">payment</span>
          </span>
        </h1>
      </div>

      <CardPreview
        cardHolder={values.cardHolder}
        cardNumber={values.cardNumber}
        expiry={values.expiry}
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-xl shadow-zinc-200/70"
      >
        <div className="space-y-2">
          <label htmlFor="cardHolder" className="block text-sm font-medium">
            Cardholder Name
          </label>

          <input
            id="cardHolder"
            name="cardHolder"
            type="text"
            value={values.cardHolder}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={!!errors.cardHolder}
            aria-describedby="cardHolder-error"
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            placeholder="John Doe"
          />

          {touched.cardHolder && errors.cardHolder && (
            <p id="cardHolder-error" className="text-sm text-red-500">
              {errors.cardHolder}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="cardNumber" className="block text-sm font-medium">
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
              aria-invalid={!!errors.cardNumber}
              aria-describedby="cardNumber-error"
              maxLength={19}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 pr-14 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
              placeholder="4242 4242 4242 4242"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-3xl text-zinc-500">
              {cardType === "visa" && <FaCcVisa />}

              {cardType === "mastercard" && <FaCcMastercard />}

              {cardType === "amex" && <FaCcAmex />}
            </div>
          </div>

          {touched.cardNumber && errors.cardNumber && (
            <p id="cardNumber-error" className="text-sm text-red-500">
              {errors.cardNumber}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="expiry" className="block text-sm font-medium">
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
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            />

            {touched.expiry && errors.expiry && (
              <p id="expiry-error" className="text-sm text-red-500">
                {errors.expiry}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="cvv" className="block text-sm font-medium">
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
              maxLength={cardType === "amex" ? 4 : 3}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
              placeholder={cardType === "amex" ? "1234" : "123"}
            />

            {touched.cvv && errors.cvv && (
              <p id="cvv-error" className="text-sm text-red-500">
                {errors.cvv}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="amount" className="block text-sm font-medium">
            Amount
          </label>

          <div className="flex gap-3">
            <select
              name="currency"
              value={values.currency}
              onChange={handleChange}
              className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none transition hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
            >
              <option value="INR">INR</option>

              <option value="USD">USD</option>
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
              className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200"
              placeholder="100"
            />
          </div>

          {touched.amount && errors.amount && (
            <p id="amount-error" className="text-sm text-red-500">
              {errors.amount}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || status === "processing"}
          className="w-full cursor-pointer rounded-lg bg-zinc-950 px-4 py-3 font-medium text-white shadow-lg shadow-zinc-300 transition hover:-translate-y-0.5 hover:bg-zinc-800 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {status === "processing" ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
