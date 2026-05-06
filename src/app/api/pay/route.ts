import { NextRequest, NextResponse } from "next/server";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const random = Math.random();

  
    if (random < 0.6) {
      await wait(2000);

      return NextResponse.json({
        success: true,
      });
    }

    if (random < 0.85) {
      await wait(2000);

      return NextResponse.json({
        success: false,
        reason: "Insufficient funds",
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