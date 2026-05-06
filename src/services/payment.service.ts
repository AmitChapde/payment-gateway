import { PaymentPayload } from "@/types/payment";

export async function processPayment(
  payload: PaymentPayload
) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 6000);

  try {
    const response = await fetch("/api/pay", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),

      signal: controller.signal,
    });

    const data = await response.json();

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}