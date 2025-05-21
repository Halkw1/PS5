
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Order, CartItem } from "../types/types";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], total: number) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    if (user) {
      const savedOrders = localStorage.getItem(`ps5store_orders_${user.id}`);
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (error) {
          console.error("Failed to parse saved orders", error);
          localStorage.removeItem(`ps5store_orders_${user.id}`);
        }
      }
    } else {
      setOrders([]);
    }
  }, [user]);

  useEffect(() => {
    // Save orders to localStorage whenever they change
    if (user) {
      localStorage.setItem(`ps5store_orders_${user.id}`, JSON.stringify(orders));
    }
  }, [orders, user]);

  const createOrder = async (items: CartItem[], total: number): Promise<Order> => {
    if (!user) {
      throw new Error("User must be logged in to create an order");
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      items,
      status: "processing",
      total,
      createdAt: new Date().toISOString(),
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    
    toast({
      title: "Order created",
      description: `Your order #${newOrder.id.slice(-6)} has been placed successfully.`,
    });

    return newOrder;
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
