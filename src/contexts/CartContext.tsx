import { Cart } from "@/data-types/cart";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { useUser } from "./UserContext";

// Define the shape of the context
interface CartContextProps {
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  cart: Cart[];
  setCart: React.Dispatch<React.SetStateAction<Cart[]>>;
}

// Create the context with default values
const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUser();

  // Query to fetch cart data
  const { data: carts, refetch } = useQuery<Cart[]>({
    queryKey: ["all-cart"],
    queryFn: async () => {
      const response = await axios.get<Cart[]>("/api/cart/get-all-cart", {
        params: { user_id: user?._id },
      });
      return response.data;
    },
    enabled: !!user?._id, // Only enable the query when user._id is available
  });

  const [cartCount, setCartCount] = useState<number>(0);
  const [cart, setCart] = useState<Cart[]>([]);

  // Update cart and cartCount whenever carts data changes
  useEffect(() => {
    if (carts) {
      setCart(carts);
      setCartCount(totalQuantity(carts));
    }
  }, [carts]);

  // Refetch the cart data whenever user._id changes
  useEffect(() => {
    if (user?._id || carts) {
      refetch();
    }
  }, [user?._id, refetch, carts]);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export function totalQuantity(cart: Cart[]) {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}