import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabaseServerClient";


// GET - Hämta användarens varukorg
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabaseServer
      .from("cart")
      .select("id, product_id, quantity, created_at, products(*)")
      .eq("user_id", userId);


    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ cart: data || [] }, { status: 200 });
  } catch (err: any) {
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

    if (!productId) return NextResponse.json({ error: "productId is required" }, { status: 400 });

    // Kontrollera om produkten redan finns
    const { data: existing, error: existingError } = await supabaseServer
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (existingError && existingError.code !== "PGRST116") {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existing) {
      // Öka quantity
      const { data, error } = await supabaseServer
        .from("cart")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select("*, products(*)");

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ cartItem: data[0] }, { status: 200 });
    } else {
      // Lägg till ny produkt
      const { data, error } = await supabaseServer
        .from("cart")
        .insert([{ user_id: userId, product_id: productId, quantity }])
        .select("*, products(*)");

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ cartItem: data[0] }, { status: 200 });
    }
  } catch (err: any) {
    console.error("POST /cart error:", err);
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
  } catch (err: any) {
    console.error("DELETE /cart error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
