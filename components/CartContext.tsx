'use client'

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/types"; 
import { v4 as uuidv4 } from "uuid";

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  function addToCart(product: Product) {
    setCartItems(prev => [...prev, { ...product, cartId: uuidv4() }]);
  }

  function removeFromCart(cartId: string) {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  }

  function clearCart() {
    setCartItems([]); // ✅ töm varukorgen
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart , clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart måste användas inom CartProvider");
  return context;
}
