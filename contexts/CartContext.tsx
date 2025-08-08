"use client";
import { supabase } from "@/libs/supabase/supabase";
import { ProductType } from "@/types/product";
import { User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

type CartItem = {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;

  // Você pode adicionar mais dados do produto aqui se quiser
};

type CartContextType = {
  items: CartItem[];
  addToCart: (
    product: ProductType,
    user: User
  ) => Promise<{ data: any; error: any }>;
  removeFromCart: (productId: string) => Promise<{ error: any }>;
  updateQuantity: (
    productId: string,
    quantity: number
  ) => Promise<{ data: any; error: any }>;
  //   updateQuantity: (productId: string, quantity: number) => void
  //   clearCart: () => void
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuth()?.user;
  const [items, setItems] = useState<CartItem[]>([]);

  const getCartItems = async (): Promise<{ data: any; error: any }> => {
    if (!user) return { data: [], error: null };
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user?.id);
    return { data, error };
  };
  const addToCart = async (product: ProductType, user: User) => {
    const { data, error } = await supabase
      .from("cart_items")
      .insert({ user_id: user.id, product_id: product.id, quantity: 1 });
    if (!error) {
      const { data } = await getCartItems();
      if (data) {
        setItems(data);
      }
    }
    return { data, error };
  };
  useEffect(() => {
    (async () => {
      const { data, error } = await getCartItems();
      if (error) return;
      setItems(data);
    })();
  }, [user]);
  const removeFromCart = async (productId: string) => {
    const { data, error } = await supabase
      .from("cart_items")
      .delete()
      .eq("product_id", productId);
    if (!error) {
      const { data } = await getCartItems();
      if (data) {
        setItems(data);
      }
    }
    return { data, error };
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0 && productId.trim() !== "")
      return {
        data: [],
        error: "Quantidade inválida ou produto não encontrado",
      };
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("product_id", productId);

    if (!error) {
      const { data } = await getCartItems();
      if (data) {
        setItems(data);
      }
    }

    return { data, error };
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
