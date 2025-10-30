// components/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { CartItem } from "@/types/types";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, size?: string) => Promise<boolean>;
  removeFromCart: (cartId: number) => Promise<void>;
  clearCart: () => void;
  error: string | null;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // ✅ Hämta varukorg från servern
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

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
  }, [user]);

  // ✅ FIXAD: Lägg till produkt med bättre felhantering
  async function addToCart(productId: number, size?: string): Promise<boolean> {
    if (!user) {
      setError("Du måste logga in för att lägga till produkter i varukorgen.");
      return false;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId, 
          quantity: 1,
          size: size || null
        }),
      });

      const data = await res.json();

      // ✅ FIX: Hantera 400-fel (Bad Request) separat
      if (res.status === 400) {
        // Detta är ett förväntat fel (t.ex. produkten är slut)
        setError(data.error || "Kunde inte lägga till produkten");
        return false;
      }

      if (res.status === 401) {
        setError("Du måste logga in för att lägga till produkter i varukorgen.");
        return false;
      }

      if (res.ok && data.cartItem) {
        setCartItems(prev => {
          const existingIndex = prev.findIndex(item => 
            item.id === data.cartItem.id
          );
          
          if (existingIndex !== -1) {
            const newCart = [...prev];
            newCart[existingIndex] = data.cartItem;
            return newCart;
          } else {
            return [...prev, data.cartItem];
          }
        });
        setError(null);
        return true;
      } else {
        setError(data.error || "Kunde inte lägga till produkten");
        return false;
      }
    } catch (error) {
      console.error(error);
      setError("Ett fel uppstod när produkten skulle läggas till");
      return false;
    }
  }

  // ... resten av koden förblir oförändrad
  // ✅ Ta bort produkt från varukorgen
  async function removeFromCart(cartId: number) {
    try {
      const res = await fetch(`/api/cart?id=${cartId}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok && data.success) {
        setCartItems(prev => prev.filter(item => item.id !== cartId));
        setError(null);
      } else {
        setError(data.error || "Kunde inte ta bort produkten");
      }
    } catch (error) {
      console.error(error);
      setError("Ett fel uppstod när produkten skulle tas bort");
    }
  }

  // ✅ Töm varukorgen
  async function clearCart() {
    try {
      const res = await fetch("/api/cart/clear", { method: "DELETE" });
      const data = await res.json();

      if (res.ok && data.success) {
        setCartItems([]);
        setError(null);
      } else {
        setError(data.error || "Kunde inte rensa varukorgen");
      }
    } catch (error) {
      console.error("Fel vid rensning av varukorg:", error);
      setError("Ett fel uppstod när varukorgen skulle rensas");
    }
  }

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      error,
      clearError
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart måste användas inom CartProvider");
  return context;
}