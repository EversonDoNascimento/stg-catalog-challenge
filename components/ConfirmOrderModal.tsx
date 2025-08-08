"use client";

import { Fragment, useMemo, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type CartItem = {
  id: string; // id da row do carrinho (opcional)
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string | null;
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void; // você injeta a ação real
  items: CartItem[];
  loading?: boolean; // desabilita botões durante a confirmação
  title?: string;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ConfirmOrderModal({
  isOpen,
  onClose,
  onConfirm,
  items,
  loading = false,
  title = "Confirmar pedido",
}: Props) {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  const total = useMemo(
    () =>
      items.reduce(
        (acc, r) => acc + (r.product?.price ?? 0) * (r.quantity ?? 0),
        0
      ),
    [items]
  );

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={loading ? () => {} : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto ">
          <div className="flex min-h-full items-end sm:items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center  justify-between border-b px-5 py-4">
                  <Dialog.Title className="text-lg font-semibold">
                    {title}
                  </Dialog.Title>
                  <button
                    className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={onClose}
                    aria-label="Fechar"
                    disabled={loading}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Revise os itens do pedido antes de confirmar.
                  </p>

                  <ul className="divide-y rounded-md border">
                    {items.map(({ id, product, quantity }) => (
                      <li
                        key={id ?? product.id}
                        className="flex items-center gap-3 p-3"
                      >
                        <div className="h-12 w-12 relative rounded overflow-hidden bg-gray-50">
                          <Image
                            src={product.image_url || "/placeholder.jpg"}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium leading-5">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qtd: {quantity} · Unit.:{" "}
                            {currency.format(product.price)}
                          </p>
                        </div>
                        <div className="text-sm font-semibold">
                          {currency.format(product.price * quantity)}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-lg font-bold">
                      {currency.format(total)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t px-5 py-3">
                  <button
                    ref={cancelButtonRef}
                    type="button"
                    className="px-4 py-2 rounded border hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-white text-sm"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white hover:bg-primary/90 disabled:opacity-60 text-sm"
                    onClick={onConfirm}
                    disabled={loading}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    {loading ? "Confirmando..." : "Confirmar pedido"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
