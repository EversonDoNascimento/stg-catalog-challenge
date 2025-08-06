"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartIcon } from "@heroicons/react/24/outline";

import { ProductType } from "@/types/product";
import { clsx } from "clsx";

type Props = {
  product: ProductType;
  onAddOrRemoveToCart?: (productId: string) => void;
  isInTheCart?: boolean;
};

const ProductCard = ({ product, onAddOrRemoveToCart, isInTheCart }: Props) => {
  return (
    <div className="w-96 hover:scale-105  ease-in-out bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Imagem */}
      <Link href={`/product/${product.id}`}>
        <div className="relative w-full h-60">
          <Image
            src={product.image_url ? product.image_url : "/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>

      {/* Conteúdo */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-foreground">
            {product.name}
          </h3>
          <button className="hover:text-primary">
            <HeartIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="text-primary font-bold text-base">
          R$ {product.price.toFixed(2)}
        </p>

        <button
          onClick={() => onAddOrRemoveToCart?.(product.id)}
          className={clsx(
            "w-full text-sm px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition",

            {
              "bg-red-500": isInTheCart,
              "hover:bg-red-500/90": isInTheCart,
            }
          )}
        >
          {isInTheCart ? "Remover do carrinho" : "Adicionar ao carrinho"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
