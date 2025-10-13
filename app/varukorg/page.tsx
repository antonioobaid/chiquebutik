'use client';

import { useCart } from "@/components/CartContext";
import { Product } from "@/types/types";

export default function CartPage() {
  const { cartItems, removeFromCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 dark:text-gray-300">
        Din varukorg är tom.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Din Varukorg</h1>
      <div className="space-y-6">
        {cartItems.map((product: Product) => (
          <div key={product.cartId}  className="flex items-center justify-between border p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{product.title}</h2>
                <p className="text-gray-700 dark:text-gray-300">{product.price} kr</p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(product.cartId!)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Ta bort
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
