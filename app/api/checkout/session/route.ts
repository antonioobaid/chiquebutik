import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover", // behåll den version du använder
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    // 🔍 Hämtar session från Stripe och expanderar produktinformation
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        "line_items.data.price.product", // 👈 här hämtar vi alla produktdetaljer
        "payment_intent",
        "customer",
      ],
    });

    // ✅ Skicka hela sessionen som JSON till frontend (SuccessPage)
    return NextResponse.json({ session });
  } catch (err: unknown) {
    console.error("❌ Error fetching Stripe session:", err);
    
    // Type-safe error handling
    let errorMessage = "Internal Server Error";
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}