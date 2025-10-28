import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // 🎯 Hantera checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // 🛒 Skapa order i Supabase
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: session.client_reference_id || null,
          stripe_session: session.id,
          total_amount: session.amount_total! / 100,
          status: "paid",
          email: session.customer_email,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order insert error:", orderError.message);
        return NextResponse.json({ error: orderError.message }, { status: 500 });
      }

      // 🧾 Hämta produkterna från Stripe-sessionen
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      const orderItems: any[] = [];

      for (const item of lineItems.data) {
        const stripeProductId = item.price?.product as string;

        // 🔍 Hämta rätt Supabase-produkt genom stripe_product_id
        const { data: product } = await supabase
          .from("products")
          .select("id")
          .eq("stripe_product_id", stripeProductId)
          .single();

        orderItems.push({
          order_id: order.id,
          product_id: product?.id || null,
          quantity: item.quantity ?? 1,
          price: (item.amount_total ?? 0) / 100,
        });
      }

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items insert error:", itemsError.message);
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
      }

      console.log("✅ Order och order_items skapades i databasen!");
    } catch (err: any) {
      console.error("❌ Webhook error:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
