'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LineItem {
  description: string;
  quantity: number;
  price: {
    unit_amount: number;
    currency: string;
    product: {
      name: string;
    };
  };
}

interface PaymentInfo {
  id: string;
  amount_total: number;
  currency: string;
  customer_email: string | null;
  customer?: {
    name?: string | null;
    email?: string | null;
  };
  payment_intent?: {
    payment_method_types?: string[];
  };
  line_items?: {
    data: LineItem[];
  };
}

export default function SuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("session_id");

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    async function fetchSession() {
      try {
        const res = await fetch(`/api/checkout/session?session_id=${sessionId}`);
        const data = await res.json();

        if (data.session) {
          setPaymentInfo(data.session);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">Laddar betalningsinformation...</p>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-red-600">Kunde inte hämta betalningsinformation.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
        >
          Tillbaka till startsidan
        </button>
      </div>
    );
  }

  // ⚡ Säkerställ att vi alltid har namn och e-post
  const customerName =
    paymentInfo.customer?.name || "Gäst";
  const customerEmail =
    paymentInfo.customer?.email || paymentInfo.customer_email || "Ej angivet";

  const amount = (paymentInfo.amount_total / 100).toFixed(2);
  const currency = paymentInfo.currency.toUpperCase();
  const paymentMethods = paymentInfo.payment_intent?.payment_method_types?.join(", ") || "-";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Betalningen lyckades!</h1>
        <p className="text-gray-700 mb-2">Tack för ditt köp, {customerName}!</p>
        <p className="text-gray-700 mb-6">Din betalning har genomförts korrekt.</p>

        <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 mb-6">
          <p><strong>E-post:</strong> {customerEmail}</p>
          <p><strong>Belopp:</strong> {amount} {currency}</p>
          <p><strong>Betalningsmetod:</strong> {paymentMethods}</p>
        </div>

        {paymentInfo.line_items?.data.length ? (
          <div className="mb-6 text-left">
            <h2 className="font-semibold mb-2">Produkter:</h2>
            <ul className="space-y-2">
              {paymentInfo.line_items.data.map((item, index) => (
                <li key={index} className="border-b border-gray-300 pb-1">
                  {item.price.product.name} × {item.quantity} — {(item.price.unit_amount / 100).toFixed(2)} {item.price.currency.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
        >
          Tillbaka till startsidan
        </button>
      </div>
    </div>
  );
}
