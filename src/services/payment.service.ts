import { PaymentPayload } from "@/types/payment";

type PaymentApiResponse =
  | {
      success: true;
    }
  | {
      success: false;
      reason: string;
    };

export async function processPayment(
  payload: PaymentPayload
): Promise<PaymentApiResponse> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 6000);

  try {
    const response = await fetch("/api/pay", {
      method: "POST",
      cache: "no-store",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),

      signal: controller.signal,
    });

    const data = (await response.json()) as PaymentApiResponse;

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}
