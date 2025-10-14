'use client';

import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");

  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  function handlePayment() {
    if (cartItems.length === 0) return;
    alert(`Betalning med ${paymentMethod} lyckades! Tack för ditt köp 💖`);
    clearCart();
    router.push("/");
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-gray-600 dark:text-gray-300">
        Din varukorg är tom. 🛒
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Kassa
        </h1>

        {/* Produkter */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div
              key={item.cartId}
              className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.price} kr
                </p>
              </div>
              <img
                src={item.image_url}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover shadow"
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
          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "card", name: "💳 Kort" },
              { id: "swish", name: "📱 Swish" },
              { id: "paypal", name: "💰 PayPal" },
              { id: "klarna", name: "🛍️ Klarna" },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-4 rounded-lg font-semibold border transition ${
                  paymentMethod === method.id
                    ? "bg-gradient-to-r from-pink-600 to-blue-600 text-white border-transparent"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>

        {/* Betala knapp */}
        <button
          onClick={handlePayment}
          className="w-full py-3 bg-gradient-to-r from-pink-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 transition"
        >
          Betala nu
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Säker betalning via dina valda metoder 💳
        </p>
      </div>
    </div>
  );
}
