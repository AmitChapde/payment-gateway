import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const failureReasons = [
  "Insufficient funds",
  "Card declined",
  "Bank authorization failed",
];

export async function POST(req: NextRequest) {
  try {
    await req.json();

    const random = 0.7;

    if (random < 0.6) {
      await wait(2000);

      return NextResponse.json({
        success: true,
      });
    }

    if (random < 0.85) {
      await wait(2000);

      const reason =
        failureReasons[Math.floor(Math.random() * failureReasons.length)];

      return NextResponse.json({
        success: false,
        reason,
      });
    }

    await wait(8000);

    return NextResponse.json({
      success: false,
      reason: "Gateway timeout",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        reason: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}
