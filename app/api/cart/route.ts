
// app/api/cart/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabaseServerClient";
import { Product, ProductSize } from "@/types/types";

// GET - Hämta användarens varukorg
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabaseServer
      .from("cart")
      .select("id, product_id, quantity, size, created_at, products(*)")
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ cart: data || [] }, { status: 200 });
  } catch (err: unknown) {
    console.error("GET /cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST - Lägg till produkt i varukorg
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const productId = Number(body.productId);
    const quantity = Number(body.quantity || 1);
    const size = body.size;

    if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

    // Kontrollera om produkten finns och dess lagerstatus
    const { data: product, error: productError } = await supabaseServer
      .from("products")
      .select(`
        *,
        product_sizes(*)
      `)
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Produkten hittades inte" }, { status: 404 });
    }

    // Kontrollera om produkten är HELT slut
    const allSizes: ProductSize[] = product.product_sizes || [];
    const availableSizes = allSizes.filter((sizeItem: ProductSize) => sizeItem.in_stock);
    const isProductSoldOut = allSizes.length > 0 && availableSizes.length === 0;

    if (isProductSoldOut) {
      return NextResponse.json({ error: "Denna produkt är tyvärr slut i lager" }, { status: 400 });
    }

    // Om produkten har storlekar, kontrollera att vald storlek finns i lager
    if (allSizes.length > 0 && size) {
      const selectedSize = allSizes.find((sizeItem: ProductSize) => sizeItem.size === size);
      if (!selectedSize || !selectedSize.in_stock) {
        return NextResponse.json({ error: `Storlek ${size} är tyvärr slut i lager` }, { status: 400 });
      }
    }

    // Hantera null/undefined size korrekt
    let existingQuery = supabaseServer
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId);

    // Om size är null/undefined, kolla efter rader där size är null
    if (size === null || size === undefined) {
      existingQuery = existingQuery.is("size", null);
    } else {
      existingQuery = existingQuery.eq("size", size);
    }

    const { data: existing, error: existingError } = await existingQuery.single();

    if (existingError && existingError.code !== "PGRST116") {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    let result;

    if (existing) {
      // Öka quantity och använd .single()
      const { data, error } = await supabaseServer
        .from("cart")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select("*, products(*)")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      result = data;
    } else {
      // Lägg till ny produkt och använd .single()
      const { data, error } = await supabaseServer  
        .from("cart")
        .insert([{ 
          user_id: userId, 
          product_id: productId, 
          quantity,
          size
        }])
        .select("*, products(*)")
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      result = data;
    }

    return NextResponse.json({ cartItem: result }, { status: 200 });
  } catch (err: unknown) {
    console.error("POST /cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Uppdatera antal i varukorg
export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const cartItemId = Number(body.cartItemId);
    const quantity = Number(body.quantity);

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json({ error: "cartItemId and quantity are required" }, { status: 400 });
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    // KONTROLLERA LAGERSTATUS INNAN UPPDATERING
    // Hämta cart item med produktinfo för att kolla lager
    const { data: cartItem, error: cartError } = await supabaseServer
      .from("cart")
      .select("*, products(*, product_sizes(*))")
      .eq("id", cartItemId)
      .eq("user_id", userId)
      .single();

    if (cartError || !cartItem) {
      return NextResponse.json({ error: "Varukorgsitem hittades inte" }, { status: 404 });
    }

    const product = cartItem.products as Product;
    const allSizes: ProductSize[] = product.product_sizes || [];
    const availableSizes = allSizes.filter((sizeItem: ProductSize) => sizeItem.in_stock);
    const isProductSoldOut = allSizes.length > 0 && availableSizes.length === 0;

    if (isProductSoldOut) {
      return NextResponse.json({ error: "Denna produkt är tyvärr slut i lager" }, { status: 400 });
    }

    // Om produkten har storlekar, kontrollera att den valda storleken fortfarande finns i lager
    if (allSizes.length > 0 && cartItem.size) {
      const selectedSize = allSizes.find((sizeItem: ProductSize) => sizeItem.size === cartItem.size);
      if (!selectedSize || !selectedSize.in_stock) {
        return NextResponse.json({ error: `Storlek ${cartItem.size} är tyvärr slut i lager` }, { status: 400 });
      }
    }

    // Uppdatera antal i databasen
    const { data, error } = await supabaseServer
      .from("cart")
      .update({ quantity })
      .eq("id", cartItemId)
      .eq("user_id", userId)
      .select("*, products(*)")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, cartItem: data }, { status: 200 });
  } catch (err: unknown) {
    console.error("PUT /cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE - Ta bort produkt från varukorg
export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const id = Number(url.searchParams.get("id"));
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const { error } = await supabaseServer
      .from("cart")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("DELETE /cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
