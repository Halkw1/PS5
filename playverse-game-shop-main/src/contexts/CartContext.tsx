
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Game } from "../types/types";
import { toast } from "@/components/ui/use-toast";

interface CartContextType {
  items: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("ps5store_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse saved cart", error);
        localStorage.removeItem("ps5store_cart");
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("ps5store_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (game: Game) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.game.id === game.id);
      if (existingItem) {
        const updatedItems = prevItems.map((item) =>
          item.game.id === game.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        toast({
          title: "Cart updated",
          description: `${game.title} quantity increased to ${existingItem.quantity + 1}`,
        });
        return updatedItems;
      } else {
        toast({
          title: "Added to cart",
          description: `${game.title} has been added to your cart`,
        });
        return [...prevItems, { game, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (gameId: string) => {
    setItems((prevItems) => {
      const removedItem = prevItems.find((item) => item.game.id === gameId);
      if (removedItem) {
        toast({
          title: "Removed from cart",
          description: `${removedItem.game.title} has been removed from your cart`,
        });
      }
      return prevItems.filter((item) => item.game.id !== gameId);
    });
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(gameId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.game.id === gameId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.game.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
