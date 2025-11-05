'use client';

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useState, useEffect, useRef } from "react";
import { CartItem as CartItemType } from "@/types/types";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m5.5 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Din varukorg är tom</h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
            Upptäck vårt utbud av exklusiva klänningar och lägg till dina favoriter här.
          </p>
          <Link
            href="/produkter"
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 text-sm sm:text-base w-full sm:w-auto justify-center"
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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {/* Product list */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 md:mb-8">
                Varukorg ({totalQuantity} {totalQuantity === 1 ? 'produkt' : 'produkter'})
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
                      <div className="border-b border-gray-200 dark:border-gray-700 my-4 sm:my-6"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-6 md:top-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 z-10">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                Ordersammanfattning
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <span>Antal produkter</span>
                  <span>{totalQuantity}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <span>Delsumma</span>
                  <span>{totalPrice} kr</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <span>Frakt</span>
                  <span className="text-green-600 font-semibold">Gratis</span>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    <span>Totalt</span>
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {totalPrice} kr
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">inkl. moms</p>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold rounded-lg hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg block text-sm sm:text-base"
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
// ✅ Uppdaterad CartItem-komponent med modal för mobil
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

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Stäng dropdown när man klickar utanför
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleQuantitySelect = (newQuantity: number) => {
    onUpdateQuantity(item.id, newQuantity);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-start space-x-4 sm:space-x-6 py-3 sm:py-4">
      {/* ✅ Produktbild med Next.js Image - mobilanpassad */}
      <div className="flex-shrink-0 relative w-16 h-20 sm:w-20 sm:h-28 md:w-24 md:h-32">
        <Image
          src={item.products?.image_url || "/placeholder.png"}
          alt={item.products?.title || "Produktbild"}
          fill
          className="object-cover rounded-lg sm:rounded-xl shadow-md"
          sizes="(max-width: 640px) 80px, (max-width: 768px) 100px, 120px"
          priority
        />
      </div>

      {/* Produktdetaljer - mobilanpassade */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="min-w-0 flex-1 mr-2">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-1 sm:mb-2">
              {item.products?.title ?? "Okänd produkt"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1">
              {item.products?.color}
              {item.size && ` • Storlek ${item.size}`}
            </p>
            <p className="text-gray-900 dark:text-white font-bold text-base sm:text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {item.products?.price ?? 0} kr
            </p>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 sm:p-2 flex-shrink-0"
            aria-label="Ta bort produkt"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Antal + totalpris - FIXAD för mobil */}
        <div className="flex items-center justify-between gap-2">
          {/* Antal dropdown - tar inte hela bredden */}
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:border-pink-300 dark:hover:border-purple-400 transition-colors text-sm sm:text-base min-w-[100px] sm:min-w-[120px] justify-between"
            >
              <span className="font-medium">{item.quantity} st</span>
              <svg
                className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
                <div className="fixed inset-0 z-[9999] lg:absolute lg:inset-auto lg:top-full lg:left-0 lg:mt-1">
                  {/* Overlay som täcker allt på mobil */}
                  <div className="absolute inset-0 bg-transparent lg:hidden" onClick={() => setIsDropdownOpen(false)}></div>
                  
                  {/* Dropdown menu */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-h-48 overflow-y-auto lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:w-32">
                    {[1, 2, 3, 4].map((quantity) => (
                      <button
                        key={quantity}
                        onClick={() => handleQuantitySelect(quantity)}
                        className={`w-full px-3 py-2 text-left transition-colors text-sm ${
                          quantity === item.quantity
                            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold"
                            : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {quantity} st
                      </button>
                    ))}
                  </div>
                </div>
              )}     
          </div>

          {/* Totalpris - under antal på mobil, bredvid på desktop */}
          <div className="text-right flex-1 sm:flex-none">
            <p className="font-bold text-gray-900 dark:text-white text-base sm:text-lg whitespace-nowrap">
              {(item.products?.price ?? 0) * item.quantity} kr
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {item.quantity} × {item.products?.price ?? 0} kr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}