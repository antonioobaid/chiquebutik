'use client';

import { useCart } from "@/components/CartContext";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  
  const { user } = useUser();
  const userId = user?.id;
  const userEmail = user?.primaryEmailAddress?.emailAddress || "guest@example.com";

  const total = cartItems.reduce((sum, item) => {
    const price = item.products?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
          email: userEmail,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
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
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Inga produkter att betala</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Din varukorg är tom. Lägg till produkter för att fortsätta till kassan.
          </p>
          <button
            onClick={() => router.push("/produkter")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Utforska produkter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{totalItems} produkter • {total} kr</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Säker betalning</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Checkout Form */}
          <div className="space-y-8">
            {/* Progress Steps */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      activeStep >= step 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 mx-4 ${
                        activeStep > step ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Information</span>
                <span>Leverans</span>
                <span>Betalning</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Välj betalningssätt</h2>
              <div className="grid gap-4">
                {[
                  { id: "card", name: "Kreditkort", desc: "Visa, Mastercard", icon: "💳" },
                  { id: "swish", name: "Swish", desc: "Betala direkt med Swish", icon: "📱" },
                  { id: "klarna", name: "Klarna", desc: "Betala senare eller dela upp", icon: "🛒" },
                  { id: "paypal", name: "PayPal", desc: "Snabbt och säkert", icon: "🔵" },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.id
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl">{method.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">{method.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{method.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${
                      paymentMethod === method.id 
                        ? 'bg-pink-500 border-pink-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {paymentMethod === method.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary Mobile */}
            <div className="lg:hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Din beställning</h3>
              <div className="space-y-3">
                {cartItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={item.products?.image_url || "/placeholder.png"}
                      alt={item.products?.title || "Produkt"}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.products?.title || "Okänd produkt"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.quantity} × {item.products?.price ?? 0} kr
                      </div>
                    </div>
                  </div>
                ))}
                {cartItems.length > 3 && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    + {cartItems.length - 3} fler produkter
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white">
                <h2 className="text-xl font-bold mb-2">Sammanfattning</h2>
                <p className="text-pink-100 text-sm">{totalItems} produkter i din beställning</p>
              </div>

              {/* Products */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    const productPrice = item.products?.price ?? 0;
                    const productTitle = item.products?.title || "Okänd produkt";
                    const productImage = item.products?.image_url || "/placeholder.png";
                    const productColor = item.products?.color;
                    
                    return (
                      <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <img
                          src={productImage}
                          alt={productTitle}
                          className="w-16 h-20 rounded-lg object-cover shadow-sm"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {productTitle}
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                            {item.size && `Storlek: ${item.size} • `}{productColor}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {item.quantity} × {productPrice} kr
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {productPrice * item.quantity} kr
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Delsumma</span>
                    <span>{total} kr</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Frakt</span>
                    <span className="text-green-600 font-semibold">Gratis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span>Att betala</span>
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {total} kr
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Bearbetar betalning...
                    </span>
                  ) : (
                    `Betala ${total} kr`
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                  ⚡ Snabb & säker betalning • 🔒 256-bit kryptering
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}