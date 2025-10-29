// fil: app/api/search/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .ilike("title", `%${query}%`); // Sök i titel, case-insensitive

    if (error) {
      console.error("Fel vid sökning:", error.message);
      return NextResponse.json({ error: "Kunde inte söka produkter" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Serverfel:", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
