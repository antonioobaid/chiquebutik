import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
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

    // Hämtar session från Stripe och expanderar customer, line_items och payment_intent
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent", "customer"],
    });

    return NextResponse.json({ session });
  } catch (err: any) {
    console.error("Error fetching Stripe session:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
