"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import logo from "../public/assets/logo.png";
import Image from "next/image";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  HeartIcon,
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const cart = useCart();
  const [cartCount, setCartCount] = useState(0);

  // 👉 Agora pegamos o user também
  const { user, signOut } = useAuth();

  useEffect(() => {
    setCartCount(cart.items.length);
  }, [cart.items]);

  return (
    <header className="bg-background text-foreground shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src={logo}
                alt="Logo da Loja"
                width={60}
                height={60}
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative hover:text-primary">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full px-1.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Área do usuário (login x perfil) */}
            {!user ? (
              // Se NÃO estiver logado → mostra botão Entrar
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-1.5 rounded hover:text-primary border border-transparent hover:border-primary transition"
                aria-label="Entrar"
              >
                <UserIcon className="h-6 w-6" />
                <span className="text-sm">Entrar</span>
              </Link>
            ) : (
              // Se estiver logado → mantém seu Popover de perfil
              <Popover className="relative">
                <PopoverButton className="focus:outline-none hover:text-primary flex items-center gap-2">
                  <UserIcon className="h-6 w-6" />
                  <span className="text-sm hidden lg:inline">
                    {user?.email ?? "Minha conta"}
                  </span>
                </PopoverButton>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <PopoverPanel className="absolute right-0 mt-2 w-48 bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                    <div className="py-1 bg-white dark:bg-background rounded-md">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-primary dark:hover:text-white"
                      >
                        Meu Perfil
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-primary dark:hover:text-white"
                      >
                        Meus Pedidos
                      </Link>
                      <button
                        onClick={signOut}
                        className="w-full text-start px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-primary dark:hover:text-white"
                      >
                        Sair
                      </button>
                    </div>
                  </PopoverPanel>
                </Transition>
              </Popover>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Popover className="relative">
              <PopoverButton className="hover:text-primary focus:outline-none">
                <Bars3Icon className="h-6 w-6" />
              </PopoverButton>

              <Transition
                as={Fragment}
                enter="transition duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <PopoverPanel className="absolute right-0 top-12 w-56 bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-20">
                  <div className="p-4 space-y-2 bg-white dark:bg-background rounded-md">
                    <Link
                      href="/cart"
                      className="flex items-center justify-between hover:text-primary"
                    >
                      Carrinho
                      {cartCount > 0 && (
                        <span className="ml-2 bg-danger text-white text-xs rounded-full px-1.5">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    {!user ? (
                      // Mobile: deslogado → mostrar botão Entrar
                      <Link href="/login" className="block hover:text-primary">
                        Entrar / Criar conta
                      </Link>
                    ) : (
                      // Mobile: logado → menu completo
                      <>
                        <Link
                          href="/profile"
                          className="block hover:text-primary"
                        >
                          Meu Perfil
                        </Link>
                        <Link
                          href="/orders"
                          className="block hover:text-primary"
                        >
                          Meus Pedidos
                        </Link>
                        <button
                          onClick={signOut}
                          className="w-full text-start text-danger hover:text-danger/80"
                        >
                          Sair
                        </button>
                      </>
                    )}
                  </div>
                </PopoverPanel>
              </Transition>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
