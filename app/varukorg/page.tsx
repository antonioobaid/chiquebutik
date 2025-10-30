'use client';

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-gray-700 dark:text-gray-300
        bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        Din varukorg är tom.
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.products?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-white via-blue-50 to-blue-100
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-gray-900 dark:text-white text-center">
        Din Varukorg
      </h1>

      {/* Grid container med mer gap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 max-w-6xl mx-auto w-full">
        {/* Vänster: produkter */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white/90 dark:bg-gray-800/90
              backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-md
              hover:shadow-lg transition p-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.products?.image_url || "/placeholder.png"}
                  alt={item.products?.title || "Produktbild"}
                  className="w-28 h-32 sm:w-36 sm:h-40 object-cover rounded-2xl shadow-sm"
                />
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {item.products?.title ?? "Okänd produkt"}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">
                    {item.products?.price ?? 0} kr × {item.quantity}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Färg: {item.products?.color} 
                    {/* ✅ ÄNDRAD: Använd item.size istället för item.products?.size */}
                    {item.size && ` | Storlek: ${item.size}`}
                  </p>
                </div>
              </div>

              {/* X-knapp */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 dark:text-red-400 font-extrabold text-3xl hover:text-red-700 transition p-4"
                aria-label="Ta bort produkt"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Höger: sammanfattning */}
        <div className="sticky top-20 h-fit bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
          rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Sammanfattning
          </h2>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Antal produkter</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Totalt pris</span>
              <span>{totalPrice} kr</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Frakt</span>
              <span>0,00 kr</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Snabbleverans</span>
              <span>✔</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="inline-block w-full text-center px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
              hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold rounded-full shadow-md
              transition-all hover:scale-105"
          >
            Gå till betalning
          </Link>

          <p className="mt-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            Vi accepterar Visa, Swish, Klarna och PayPal
          </p>
        </div>
      </div>
    </div>
  );
}

