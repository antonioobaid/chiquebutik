'use client';

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useState } from "react";
import { CartItem as CartItemType, Product } from "@/types/types";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m5.5 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Din varukorg är tom</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
            Upptäck vårt utbud av exklusiva klänningar och lägg till dina favoriter här.
          </p>
          <Link
            href="/produkter"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"
          >
            Fortsätt shoppa
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.products?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Product list */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Varukorg ({totalQuantity} produkter)
              </h1>

              <div className="space-y-0">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <CartItem
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                    {index < cartItems.length - 1 && (
                      <div className="border-b border-gray-200 dark:border-gray-700 my-6"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                Ordersammanfattning
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Antal produkter</span>
                  <span>{totalQuantity}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Delsumma</span>
                  <span>{totalPrice} kr</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Frakt</span>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Totalt</span>
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {totalPrice} kr
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">inkl. moms</p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-4 px-6 text-center font-semibold rounded-lg hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg block"
              >
                Fortsätt till kassan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Uppdaterad CartItem-komponent med korrekta typer
function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const quantityOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleQuantitySelect = (newQuantity: number) => {
    onUpdateQuantity(item.id, newQuantity);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-start space-x-6 py-4">
      {/* ✅ Produktbild med Next.js Image */}
      <div className="flex-shrink-0 relative w-24 h-32">
        <Image
          src={item.products?.image_url || "/placeholder.png"}
          alt={item.products?.title || "Produktbild"}
          fill
          className="object-cover rounded-xl shadow-md"
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
        />
      </div>

      {/* Produktdetaljer */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
              {item.products?.title ?? "Okänd produkt"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
              {item.products?.color}
              {item.size && ` • Storlek ${item.size}`}
            </p>
            <p className="text-gray-900 dark:text-white font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {item.products?.price ?? 0} kr
            </p>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2"
            aria-label="Ta bort produkt"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Antal + totalpris */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:border-pink-300 dark:hover:border-purple-400 transition-colors"
            >
              <span className="font-medium">Antal: {item.quantity}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl z-50">
                {quantityOptions.map((quantity) => (
                  <button
                    key={quantity}
                    onClick={() => handleQuantitySelect(quantity)}
                    className={`w-full px-4 py-2 text-left transition-colors ${
                      quantity === item.quantity
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold"
                        : "hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {quantity} st
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-900 dark:text-white text-lg">
              {(item.products?.price ?? 0) * item.quantity} kr
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.quantity} × {item.products?.price ?? 0} kr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}