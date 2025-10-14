'use client';

import { useCart } from "@/components/CartContext";
import { Product } from "@/types/types";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
        Din varukorg är tom.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[70vh] bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white text-center">
        Din Varukorg
      </h1>

      <div className="space-y-6 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {cartItems.map((product: Product) => (
          <div
            key={product.cartId}
            className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition p-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-28 h-28 object-cover rounded-xl"
              />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {product.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {product.price} kr
                </p>
              </div>
            </div>

            <button
              onClick={() => removeFromCart(product.cartId!)}
              className="px-5 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition font-semibold"
            >
              Ta bort
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
