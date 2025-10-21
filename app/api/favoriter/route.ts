// app/api/favoriter/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

// 🔹 POST - Toggle favorit (lägg till eller ta bort)
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    // 🔹 Kolla om favoriten redan finns
    const { data: existingFavorite, error: checkError } = await supabaseServer
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 betyder "no rows found" – det ignorerar vi
      console.error("Supabase error (check):", checkError);
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    if (existingFavorite) {
      // 🔹 Om redan finns → ta bort (unfavorite)
      const { error: deleteError } = await supabaseServer
        .from("favorites")
        .delete()
        .eq("id", existingFavorite.id);

      if (deleteError) {
        console.error("Supabase error (delete):", deleteError);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, removed: true }, { status: 200 });
    }

    // 🔹 Annars → lägg till ny favorit
    const { data, error } = await supabaseServer
      .from("favorites")
      .insert([{ user_id: userId, product_id: Number(productId) }])
      .select();

    if (error) {
      console.error("Supabase error (insert):", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, added: true, favorite: data }, { status: 200 });
  } catch (err: any) {
    console.error("Server error (POST):", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔹 GET - Hämta alla favorit-produkter för användaren
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Hämta favorit-ids
  const { data: favorites, error: favError } = await supabaseServer
    .from("favorites")
    .select("product_id")
    .eq("user_id", userId);

  if (favError) return NextResponse.json({ error: favError.message }, { status: 500 });
  if (!favorites || favorites.length === 0) return NextResponse.json({ products: [] }, { status: 200 });

  const productIds = favorites.map(f => f.product_id);

  // Hämta produkterna baserat på favorit-ids
  const { data: products, error: prodError } = await supabaseServer
    .from("products")
    .select("*")
    .in("id", productIds);

  if (prodError) return NextResponse.json({ error: prodError.message }, { status: 500 });

  return NextResponse.json({ products }, { status: 200 });
}
