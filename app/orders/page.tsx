"use client";

import { useEffect, useState, Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoutes";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/libs/supabase/supabase";

type OrderItem = {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
};

type OrderRow = {
  id: string;
  status: string | null;
  total: number;
  created_at: string;
  order_items: OrderItem[];
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function OrdersPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          status,
          total,
          created_at,
          order_items (
            id,
            product_id,
            product_name,
            unit_price,
            quantity
          )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        if (error) {
          console.error(error);
          setErrorMsg("Não foi possível carregar seus pedidos.");
        } else {
          setOrders((data as OrderRow[]) || []);
        }
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <ProtectedRoute>
      {loading && <LoadingSpinner />}
      <Header />

      <main className="max-w-7xl mx-auto px-6 mt-16 mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          Meus Pedidos
        </h1>

        {errorMsg && (
          <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <p className="text-muted-foreground">Você ainda não tem pedidos.</p>
        )}

        <div className="space-y-3">
          {orders.map((order) => {
            const created = new Date(order.created_at);
            const dateLabel = created.toLocaleString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Disclosure key={order.id} as="div" className="rounded-md border">
                {({ open }) => (
                  <>
                    {/* Cabeçalho do pedido */}
                    <Disclosure.Button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 ">
                      <div className="flex flex-col text-left">
                        <span className="text-sm text-muted-foreground">
                          Pedido
                        </span>
                        <span className="font-semibold">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-left">
                          <span className="text-xs text-muted-foreground block">
                            Data
                          </span>
                          <span className="text-sm">{dateLabel}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-xs text-muted-foreground block">
                            Status
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border">
                            {order.status ?? "pending"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-muted-foreground block">
                            Total
                          </span>
                          <span className="text-sm font-semibold">
                            {currency.format(order.total ?? 0)}
                          </span>
                        </div>
                        <ChevronDownIcon
                          className={`h-5 w-5 transition ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </Disclosure.Button>

                    {/* Itens (sem imagem) */}
                    <Transition
                      as={Fragment}
                      enter="transition duration-200 ease-out"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="transition duration-150 ease-in"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Disclosure.Panel className="px-4 pb-4">
                        <ul className="mt-3 divide-y rounded-md border bg-white dark:bg-background">
                          {order.order_items.map((it) => (
                            <li
                              key={it.id}
                              className="p-3 flex items-center justify-between gap-3"
                            >
                              <div className="flex-1">
                                <p className="font-medium leading-5">
                                  {it.product_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Qtd: {it.quantity} · Unit.:{" "}
                                  {currency.format(it.unit_price)}
                                </p>
                              </div>
                              <div className="text-sm font-semibold">
                                {currency.format(
                                  (it.unit_price ?? 0) * (it.quantity ?? 0)
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-3 flex items-center justify-end gap-6">
                          <div className="text-sm text-muted-foreground">
                            Total
                          </div>
                          <div className="text-lg font-bold">
                            {currency.format(order.total ?? 0)}
                          </div>
                        </div>
                      </Disclosure.Panel>
                    </Transition>
                  </>
                )}
              </Disclosure>
            );
          })}
        </div>
      </main>

      <Footer />
    </ProtectedRoute>
  );
}
