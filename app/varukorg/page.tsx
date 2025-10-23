'use client';

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-gray-700 dark:text-gray-300 bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        Din varukorg är tom.
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.products?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="flex flex-col min-h-[70vh] bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-gray-900 dark:text-white text-center">
        Din Varukorg
      </h1>

      <div className="space-y-6 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-md hover:shadow-xl transition p-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.products?.image_url || "/placeholder.png"}
                alt={item.products?.title || "Produktbild"}
                className="w-28 h-28 object-cover rounded-2xl shadow-md"
              />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {item.products?.title ?? "Okänd produkt"}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {item.products?.price ?? 0} kr × {item.quantity}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(item.id)}
              className="px-5 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full shadow hover:scale-105 transition font-semibold"
            >
              Ta bort
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Totalt: <span className="text-blue-500">{totalPrice} kr</span>
        </p>
        <Link
          href="/checkout"
          className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold rounded-full shadow-md transition-all hover:scale-105"
        >
          Gå till betalning
        </Link>
      </div>
    </div>
  );
}
