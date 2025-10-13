'use client'

import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/types"; // Importera din Product-typ

import { v4 as uuidv4 } from "uuid";

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string | number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  /*function addToCart(product: Product) {
    setCartItems(prev => [...prev, product , ]);
  }*/

    function addToCart(product: Product) {
  setCartItems(prev => [...prev, { ...product, cartId: uuidv4() }]);
}
  

  function removeFromCart(id: string | number) {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart måste användas inom CartProvider");
  return context;
}
