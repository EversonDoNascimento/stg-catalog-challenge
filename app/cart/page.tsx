"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoutes";
import FeedbackModal from "@/components/FeedbackModal";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ProductType } from "@/types/product";
import { supabase } from "@/libs/supabase/supabase";
import LoadingSpinner from "@/components/LoadingSpinner";
import formatOrder from "@/utils/formatOrder";
import ConfirmOrderModal from "@/components/ConfirmOrderModal";

type CartRow = {
  id: string;
  quantity: number;
  product: ProductType;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const CartPage = () => {
  const { removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "success" | "info">(
    "info"
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  async function handleConfirmOrder() {
    if (!user) {
      showModal("Você precisa estar logado para confirmar o pedido.", "info");
      return;
    }

    try {
      setConfirmLoading(true);

      const total = cartItems.reduce(
        (acc, r) => acc + r.product.price * r.quantity,
        0
      );

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total,
          status: "pending",
        })
        .select("id")
        .single();

      if (orderErr || !order)
        throw orderErr || new Error("Falha ao criar pedido");

      const itemsPayload = cartItems.map((r) => ({
        order_id: order.id,
        product_id: r.product.id,
        product_name: r.product.name, // snapshot
        unit_price: r.product.price, // snapshot
        quantity: r.quantity,
      }));

      const { error: itemsErr } = await supabase
        .from("order_items")
        .insert(itemsPayload);

      if (itemsErr) {
        await supabase.from("orders").delete().eq("id", order.id);
        throw itemsErr;
      }

      await supabase.from("cart_items").delete().eq("user_id", user.id);

      await sendOrderForWhatsapp?.();

      setConfirmOpen(false);
      showModal("Pedido confirmado com sucesso!", "success");
    } catch (e) {
      console.error(e);
      showModal("Falha ao confirmar o pedido.", "error");
    } finally {
      setConfirmLoading(false);
    }
  }

  const showModal = (
    message: string,
    type: "error" | "success" | "info" = "info"
  ) => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!user) return;
    let isCancelled = false;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("cart_items")
        .select("id, quantity, product:products(*)")
        .eq("user_id", user.id);

      if (!isCancelled) {
        if (error) {
          console.error(error);
          showModal("Não foi possível carregar o carrinho.", "error");
        } else {
          const rows = (data ?? []).map((r: any) => ({
            id: r.id,
            quantity: r.quantity,
            product: r.product as ProductType,
          })) as CartRow[];
          setCartItems(rows);
        }
        setLoading(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const total = useMemo(() => {
    return cartItems.reduce(
      (acc, row) => acc + (row.product?.price ?? 0) * (row.quantity ?? 0),
      0
    );
  }, [cartItems]);

  const handleRemove = async (productId: string) => {
    setLoading(true);
    const { error } = await removeFromCart(productId);
    setLoading(false);
    if (error) {
      showModal("Erro ao remover do carrinho", "error");
      return;
    }
    setCartItems((prev) => prev.filter((r) => r.product.id !== productId));
    showModal("Produto removido do carrinho", "success");
  };

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setLoading(true);
    const { error } = await updateQuantity(productId, quantity);
    setLoading(false);
    if (error) {
      showModal("Erro ao modificar quantidade", "error");
      return;
    }
    setCartItems((prev) =>
      prev.map((r) => (r.product.id === productId ? { ...r, quantity } : r))
    );
  };

  const sendOrderForWhatsapp = () => {
    const message = `${formatOrder({
      nomeCliente: user?.user_metadata?.name ?? "",
      emailCliente: user?.email ?? "",
      produtos: cartItems.map(({ product, quantity }) => ({
        nome: product.name,
        quantidade: quantity,
        preco: product.price,
      })),
    })}`;
    const url = `https://api.whatsapp.com/send?phone=55${
      user?.user_metadata?.phone ?? ""
    }&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <ProtectedRoute>
      <ConfirmOrderModal
        isOpen={confirmOpen}
        onClose={() => !confirmLoading && setConfirmOpen(false)}
        onConfirm={handleConfirmOrder}
        items={cartItems}
        loading={confirmLoading}
        title="Confirmar pedido"
      />
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

        {cartItems.length === 0 ? (
          <p className="text-lg text-muted-foreground">
            Seu carrinho está vazio.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {cartItems.map(({ id, product, quantity }) => (
              <div
                key={id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={product.image_url || "/placeholder.jpg"}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <p className="text-sm mt-1">
                      Preço:{" "}
                      <span className="font-semibold">
                        {currency.format(product.price)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product.id,
                          Math.max(1, quantity - 1)
                        )
                      }
                      className="px-2 py-1"
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(product.id, quantity + 1)
                      }
                      className="px-2 py-1"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-red-600 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right mt-6">
              <p className="text-xl font-semibold">
                Total: {currency.format(total)}
              </p>
              <button
                onClick={() => setCartItems([])}
                className="mt-2 text-sm text-red-600 underline"
              >
                Esvaziar carrinho
              </button>
            </div>
          </div>
        )}

        <div className="flex w-full justify-end">
          {cartItems.length > 0 && (
            <button
              onClick={() => setConfirmOpen(true)}
              className="mt-6 px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              Realizar pedido
            </button>
          )}
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
};

export default CartPage;
