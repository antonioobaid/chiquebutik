import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "@/types/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { cartItems, userId, email } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ✅ Skapa line_items och koppla metadata till varje produkt
    const line_items = cartItems.map((item: CartItem) => {
      if (!item.products?.stripe_price_id) {
        throw new Error(`Missing Stripe price_id for product ${item.product_id}`);
      }

      return {
        price: item.products.stripe_price_id,
        quantity: item.quantity,
        // 🔥 Här kopplar vi produktens id i Supabase till Stripe
        adjustable_quantity: { enabled: false },
      };
    });

    // ✅ Skapa Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna", "paypal"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      customer_email: email, // ✅ lägg till detta
      metadata: {
        userId,
        email, // ✅ så du även får den i webhooken om du vill spara den i Supabase
        cartItems: JSON.stringify(
          cartItems.map((item: CartItem) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    
    // Type-safe error handling
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}