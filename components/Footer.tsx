"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../public/assets/logo.png";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-gray-200 dark:border-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo / Sobre */}
        <div>
          <Link
            href="/"
            className="text-xl font-bold text-primary flex items-center space-x-2"
          >
            <Image
              src={logo}
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span>Minha Loja</span>
          </Link>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Produtos de qualidade com os melhores preços. Compre com segurança.
          </p>
        </div>

        {/* Navegação */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Navegação</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/produtos" className="hover:text-primary">
                Produtos
              </Link>
            </li>
            <li>
              <Link href="/categorias" className="hover:text-primary">
                Categorias
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="hover:text-primary">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-primary">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contato</h4>
          <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-primary" />
              contato@minhaloja.com
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-primary" />
              (11) 99999-9999
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-primary" />
              Rua Exemplo, 123 - SP
            </li>
          </ul>
        </div>

        {/* Redes sociais */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
          <div className="flex gap-4">
            {/* Substitua por links reais */}
            <Link href="#" className="hover:text-primary">
              Facebook
            </Link>
            <Link href="#" className="hover:text-primary">
              Instagram
            </Link>
            <Link href="#" className="hover:text-primary">
              X
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 text-sm text-center py-4 text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Minha Loja. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
