'use client';

import { useCart } from "@/components/CartContext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  
  const { user } = useUser(); // ✅ Hämta inloggad användare från Clerk
  const userId = user?.id ;
  const userEmail = user?.primaryEmailAddress?.emailAddress || "guest@example.com";

  const total = cartItems.reduce((sum, item) => {
    const price = item.products?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  async function handlePayment() {
    
    if (!userId) {
      alert("Du måste vara inloggad för att betala.");
      return;
    }

    if (cartItems.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
           userId,
          email: userEmail, // Byt till Clerk user ID
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect till Stripe Checkout
      } else {
        alert("Något gick fel vid betalning.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Betalning misslyckades, försök igen.");
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-600 dark:text-gray-300">
        Din varukorg är tom. 🛒
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="w-full max-w-3xl bg-gradient-to-r from-blue-100 via-pink-50 to-white dark:from-gray-700 dark:to-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Kassa
        </h1>

        {/* Produkter */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item, index) => (
            <div
              key={item.id ?? `${item.product_id}-${index}`}
              className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.products?.title ?? "Okänd produkt"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.products?.price ?? 0} kr × {item.quantity}
                </p>
              </div>
              <img
                src={item.products?.image_url ?? "/placeholder.png"}
                alt={item.products?.title ?? "Produktbild"}
                className="w-24 h-24 rounded-lg object-cover shadow"
              />
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold mb-6 text-gray-900 dark:text-white">
          <span>Totalt:</span>
          <span>{total} kr</span>
        </div>

        {/* Betalningsmetod */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Välj betalningsmetod
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { id: "card", name: "Kort", img: "/payment/Visa.png" },
              { id: "swish", name: "Swish", img: "/payment/swish1.png" },
              { id: "paypal", name: "PayPal", img: "/payment/Paypal.png" },
              { id: "klarna", name: "Klarna", img: "/payment/klarna.jpeg" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-semibold border transition
                  ${paymentMethod === method.id
                    ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white border-transparent"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                <img src={method.img} alt={method.name} className="w-10 h-10 object-contain" />
                <span>{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Betala knapp */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Skapar betalning..." : "Betala nu"}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Säker betalning via dina valda metoder 💳
        </p>
      </div>
    </div>
  );
}
