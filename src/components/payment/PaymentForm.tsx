"use client";

import { usePaymentForm } from "@/hooks/usePaymentForm";
import CardPreview from "./CardPreview";
import { FaCcAmex, FaCcMastercard, FaCcVisa } from "react-icons/fa6";

export default function PaymentForm() {
  const {
    cardType,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isFormValid,
    status,
    touched,
    values,
  } = usePaymentForm();

  return (
    <div className="mx-auto w-full max-w-md space-y-7 lg:space-y-6">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Secure Checkout
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 lg:text-2xl xl:text-3xl">
          Complete your{" "}
          <span className="relative inline-block">
            <span className="absolute inset-x-0 bottom-1 h-3 rounded-full" />
            <span className="relative text-emerald-800">payment</span>
          </span>
        </h1>
      </div>

      {/* Card preview — same position as original, no sticky/fixed */}
      <CardPreview
        cardHolder={values.cardHolder}
        cardNumber={values.cardNumber}
        expiry={values.expiry}
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-xl shadow-zinc-200/70 lg:space-y-4 lg:p-5 xl:space-y-5 xl:p-6"
      >
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
            Enter your details
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Use your card information to complete this payment securely.
          </p>
        </div>

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
            autoComplete="cc-name"
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
              maxLength={cardType === "amex" ? 17 : 19}
              inputMode="numeric"
              autoComplete="cc-number"
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 pr-14 font-mono text-sm tracking-widest text-zinc-900 shadow-sm outline-none transition placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-200 sm:text-base"
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
              inputMode="numeric"
              autoComplete="cc-exp"
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
              inputMode="numeric"
              autoComplete="cc-csc"
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
              inputMode="decimal"
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
