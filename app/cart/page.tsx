"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoutes";
import FeedbackModal from "@/components/FeedbackModal";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductType } from "@/types/product";
import { supabase } from "@/libs/supabase/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";

const CartPage = () => {
  const { items, removeFromCart } = useCart();
  const [products, setProducts] = useState<ProductType[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "success" | "info">(
    "info"
  );

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("cart_items")
        .select("id, user_id, quantity, product:products(*)")
        .eq("user_id", user.id);
      if (error) return;
      setProducts(data.map((item: any) => item.product));
      console.log(data);
    })();
  }, [user, items]);
  const showModal = (
    message: string,
    type: "error" | "success" | "info" = "info"
  ) => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  const handleRemove = async (productId: string) => {
    setLoading(true);
    const { error } = await removeFromCart(productId);
    setLoading(false);
    if (error) {
      showModal("Erro ao remover do carrinho", "error");
      return;
    }
    showModal("Produto removido do carrinho", "success");
  };

  //   const handleQuantityChange = (productId: string, quantity: number) => {
  //     updateQuantity(productId, quantity);
  //   };

  //   const total = items.reduce(
  //     (acc, item) => acc + item.product.price * item.quantity,
  //     0
  //   );

  return (
    <ProtectedRoute>
      {loading && <LoadingSpinner />}
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
        type={modalType}
      />
      <Header />
      <main className="max-w-7xl mx-auto px-6 mt-16">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          Carrinho de Compras
        </h1>

        {items.length === 0 ? (
          <p className="text-lg text-muted-foreground">
            Seu carrinho está vazio.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {products.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={item.image_url ? item.image_url : "/placeholder.jpg"}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="text-sm mt-1">
                      Preço:{" "}
                      <span className="font-semibold">
                        R$ {item.price.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      //   onClick={() =>
                      //     handleQuantityChange(
                      //       item.product_id,
                      //       Math.max(1, item.quantity - 1)
                      //     )
                      //   }
                      className="px-2 py-1"
                    >
                      -
                    </button>
                    <span className="px-3 py-1">
                      {items.find((i) => i.product_id === item.id)?.quantity ||
                        0}
                    </span>
                    <button
                      //   onClick={() =>
                      //     handleQuantityChange(item.product_id, item.quantity + 1)
                      //   }
                      className="px-2 py-1"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
            <div className="text-right mt-6">
              <p className="text-xl font-semibold">
                Total: R${" "}
                {products.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
              </p>
              <button
                // onClick={clearCart}
                className="mt-2 text-sm text-red-600 underline"
              >
                Esvaziar carrinho
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </ProtectedRoute>
  );
};

export default CartPage;
