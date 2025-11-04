/*import { NextRequest, NextResponse } from "next/server";
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
}*/

/*import { NextRequest, NextResponse } from "next/server";
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

    // ✅ Debug logging
    console.log('🔍 Checkout started:', {
      environment: process.env.NODE_ENV,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      cartItemsCount: cartItems.length
    });

    // ✅ Skapa line_items och koppla metadata till varje produkt
    const line_items = cartItems.map((item: CartItem) => {
      if (!item.products?.stripe_price_id) {
        throw new Error(`Missing Stripe price_id for product ${item.product_id}`);
      }

      return {
        price: item.products.stripe_price_id,
        quantity: item.quantity,
        adjustable_quantity: { enabled: false },
      };
    });

    // ✅ SMART URL-HANTERING: Använd miljövariabel eller fallback
    const getBaseUrl = () => {
      // Första prioritet: Environment variable
      if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
      }
      
      // Andra prioritet: Auto-detect baserat på miljö
      if (process.env.NODE_ENV === 'production') {
        return 'https://chiquebutik.vercel.app';
      }
      
      // Fallback: localhost för development
      return 'http://localhost:3000';
    };

    const baseUrl = getBaseUrl();
    const success_url = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${baseUrl}/checkout/cancel`;

    console.log('🔗 Using URLs:', { baseUrl, success_url, cancel_url });

    // ✅ Skapa Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna", "paypal"],
      mode: "payment",
      line_items,
      success_url,
      cancel_url,
      customer_email: email,
      metadata: {
        userId,
        email,
        cartItems: JSON.stringify(
          cartItems.map((item: CartItem) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          }))
        ),
      },
      shipping_address_collection: {
        allowed_countries: ['SE'] // Sverige
      },
    });

    console.log('✅ Stripe session created:', session.id);
    return NextResponse.json({ url: session.url });
    
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ 
      error: "Checkout failed",
      details: errorMessage 
    }, { status: 500 });
  }
}*/


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

    console.log('🔍 Checkout started on:', process.env.NODE_ENV);

    // ✅ Skapa line_items
    const line_items = cartItems.map((item: CartItem) => {
      if (!item.products?.stripe_price_id) {
        throw new Error(`Missing Stripe price_id for product ${item.product_id}`);
      }

      return {
        price: item.products.stripe_price_id,
        quantity: item.quantity,
        adjustable_quantity: { enabled: false },
      };
    });

    // ✅ HÅRDKODA URL:ERNA FÖR PRODUKTION
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? "https://chiquebutik.vercel.app" 
      : "http://localhost:3000";
    
    const success_url = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${baseUrl}/checkout/cancel`;

    console.log('🔗 Using URLs:', { baseUrl, success_url, cancel_url, isProduction });

    // ✅ Skapa Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna", "paypal"],
      mode: "payment",
      line_items,
      success_url,
      cancel_url,
      customer_email: email,
      metadata: {
        userId,
        email,
        cartItems: JSON.stringify(
          cartItems.map((item: CartItem) => ({
            product_id: item.product_id,
            quantity: item.quantity,
          }))
        ),
      },
      shipping_address_collection: {
        allowed_countries: ['SE']
      },
    });

    console.log('✅ Stripe session created:', session.id);
    return NextResponse.json({ url: session.url });
    
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ 
      error: "Checkout failed",
      details: errorMessage 
    }, { status: 500 });
  }
}