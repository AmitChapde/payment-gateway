"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";

import { makePayment } from "@/store/features/payment/paymentThunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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

type PaymentFormErrors = {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  amount: string;
};

type PaymentFormTouched = {
  cardHolder: boolean;
  cardNumber: boolean;
  expiry: boolean;
  cvv: boolean;
  amount: boolean;
};

type PaymentFieldElement = HTMLInputElement | HTMLSelectElement;

const initialValues: PaymentFormValues = {
  cardHolder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  amount: "",
  currency: "INR",
};

const initialErrors: PaymentFormErrors = {
  cardHolder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
  amount: "",
};

const initialTouched: PaymentFormTouched = {
  cardHolder: false,
  cardNumber: false,
  expiry: false,
  cvv: false,
  amount: false,
};

export function usePaymentForm() {
  const dispatch = useAppDispatch();

  const status = useAppSelector((state) => state.payment.status);

  const [values, setValues] = useState<PaymentFormValues>(initialValues);

  const [errors, setErrors] = useState<PaymentFormErrors>(initialErrors);

  const [touched, setTouched] = useState<PaymentFormTouched>(initialTouched);

  const cardType = useMemo(() => {
    return detectCardType(values.cardNumber);
  }, [values.cardNumber]);

  const validationErrors = useMemo<PaymentFormErrors>(() => {
    return {
      cardHolder: validateCardHolder(values.cardHolder),
      cardNumber: validateCardNumber(values.cardNumber, cardType),
      expiry: validateExpiry(values.expiry),
      cvv: validateCVV(values.cvv, cardType),
      amount: validateAmount(Number(values.amount)),
    };
  }, [cardType, values]);

  function validateField(name: string, value: string) {
    const detectedCardType =
      name === "cardNumber"
        ? detectCardType(value)
        : detectCardType(values.cardNumber);

    switch (name) {
      case "cardHolder":
        return validateCardHolder(value);

      case "cardNumber":
        return validateCardNumber(value, detectedCardType);

      case "expiry":
        return validateExpiry(value);

      case "cvv":
        return validateCVV(value, detectedCardType);

      case "amount":
        return validateAmount(Number(value));

      default:
        return "";
    }
  }

  function formatFieldValue(name: string, value: string) {
    if (name === "cardNumber") {
      return formatCardNumber(value);
    }

    if (name === "expiry") {
      return formatExpiry(value);
    }

    if (name === "cvv") {
      return value.replace(/\D/g, "");
    }

    if (name === "amount") {
      return value.replace(/[^0-9.]/g, "");
    }

    return value;
  }

  function updateField(name: string, value: string) {
    const formattedValue = formatFieldValue(name, value);

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

  function handleChange(e: ChangeEvent<PaymentFieldElement>) {
    updateField(e.currentTarget.name, e.currentTarget.value);
  }

  function handleBlur(
    e: FocusEvent<PaymentFieldElement>,
  ) {
    const { name, value } = e.currentTarget;

    if (name !== "currency") {
      const formattedValue = formatFieldValue(name, value);

      setValues((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));

      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, formattedValue),
      }));
    }
  }

  const isFormValid =
    values.cardHolder.trim() !== "" &&
    values.cardNumber.trim() !== "" &&
    values.expiry.trim() !== "" &&
    values.cvv.trim() !== "" &&
    values.amount.trim() !== "" &&
    Object.values(validationErrors).every((error) => error === "");

  function resetForm() {
    setValues(initialValues);

    setTouched(initialTouched);

    setErrors(initialErrors);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFormValid || status === "processing") {
      return;
    }

    const transactionId = createTransactionId();

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
      resetForm();
    }
  }

  return {
    cardType,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isFormValid,
    status,
    touched,
    values,
  };
}

function createTransactionId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `txn-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
