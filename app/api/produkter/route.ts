import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/produkter
export async function GET() {
  try {
    // Hämta alla produkter
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      console.error("Fel vid hämtning av produkter:", error.message);
      return NextResponse.json({ error: "Kunde inte hämta produkter" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Serverfel:", err);
    return NextResponse.json({ error: "Serverfel" }, { status: 500 });
  }
}
