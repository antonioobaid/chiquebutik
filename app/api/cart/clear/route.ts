import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabaseServerClient";

// DELETE /api/cart/clear — töm hela varukorgen för inloggad användare
export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ta bort alla rader i cart där user_id = inloggad användare
    const { error } = await supabaseServer
      .from("cart")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Fel vid rensning av varukorg:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Varukorgen rensades." },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API /cart/clear error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
