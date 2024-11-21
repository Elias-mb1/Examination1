//page.tsx
"use client";
import { useState } from "react";
import WontonCard from "./components/menucard";
import DipCard from "./components/dipcard";
import Drink from "./components/drinkcard";
import Cart from "./components/cartItems";
import { CartItems } from "./types";

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItems[]>([]);

  const addToCart = (item: CartItems) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="bg-[#489078] min-h-screen grid grid-cols-1 md:grid-rows-auto md:justify-items-center py-10 gap-8">
      <main className="p-4 flex flex-col gap-4 w-full max-w-md text-center sm:px-6 md:px-10">
        <h1 className="text-[24px] md:text-[32px] font-bold text-white">MENY</h1>
        <WontonCard addToCart={addToCart} />
        <DipCard addToCart={addToCart} />
        <Drink addToCart={addToCart} />
      </main>
      <Cart cartItems={cartItems} clearCart={clearCart} />
    </div>
  );
}
