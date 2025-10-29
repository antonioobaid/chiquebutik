'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs"; // 🟢 NYTT: för att veta om användaren är inloggad
import { CartItem } from "@/types/types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user } = useUser(); // 🟢 NYTT: hämtar användarinformation från Clerk
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // ✅ Hämta varukorg från servern när användaren är inloggad
  useEffect(() => {
    if (!user) return; // 🟢 NYTT: hoppa över om användaren inte är inloggad

    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");
        if (!res.ok) throw new Error("Kunde inte hämta varukorgen");
        const data: { cart: CartItem[] } = await res.json();
        setCartItems(data.cart || []);
      } catch (error) {
        console.error(error);
        setCartItems([]);
      }
    }

    fetchCart();
  }, [user]); // 🟢 NYTT: effekten körs bara när användaren ändras (t.ex. loggar in)

  // ✅ Lägg till produkt i servern och uppdatera frontend
  async function addToCart(productId: number) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data: { cartItem?: CartItem; error?: string } = await res.json();

      if (res.status === 401) {
        alert("Du måste logga in för att lägga till produkter i varukorgen.");
        window.location.href = "/"; // 🟢 oförändrad: skickar till startsidan
        return;
      }

      if (res.ok && data.cartItem) {
        setCartItems(prev => {
          const existingIndex = prev.findIndex(item => item.id === data.cartItem!.id);
          if (existingIndex !== -1) {
            const newCart = [...prev];
            newCart[existingIndex] = data.cartItem!;
            return newCart;
          } else {
            return [...prev, data.cartItem!];
          }
        });
      } else {
        alert(data.error || "Kunde inte lägga till produkten");
      }
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod när produkten skulle läggas till");
    }
  }

  // ✅ Ta bort produkt från servern och uppdatera frontend
  async function removeFromCart(cartId: number) {
    try {
      const res = await fetch(`/api/cart?id=${cartId}`, { method: "DELETE" });
      const data: { success?: boolean; error?: string } = await res.json();

      if (res.ok && data.success) {
        setCartItems(prev => prev.filter(item => item.id !== cartId));
      } else {
        alert(data.error || "Kunde inte ta bort produkten");
      }
    } catch (error) {
      console.error(error);
      alert("Ett fel uppstod när produkten skulle tas bort");
    }
  }


   // Töm varukorgen både i databasen och client-side
async function clearCart() {
  try {
    const res = await fetch("/api/cart/clear", { method: "DELETE" });
    const data = await res.json();

    if (res.ok && data.success) {
      setCartItems([]); // töm client state
    } else {
      console.error("Kunde inte rensa varukorgen:", data.error);
    }
  } catch (error) {
    console.error("Fel vid rensning av varukorg:", error);
  }
}



  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// ✅ Hook för att använda CartContext
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart måste användas inom CartProvider");
  return context;
}
