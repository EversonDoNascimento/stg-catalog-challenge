"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabase/supabase";
import { ProductType } from "@/types/product";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Skeleton from "@/components/Skeleton";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagem */}
        <div className="w-full h-96 relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {loading ? (
            <Skeleton width="100%" height="100%" />
          ) : product?.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500">
              Sem imagem
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="space-y-4">
          {loading ? (
            <>
              <Skeleton width="60%" height="2rem" />
              <Skeleton width="40%" height="1.5rem" />
              <Skeleton width="100%" height="6rem" />
              <Skeleton width="50%" height="3rem" />
            </>
          ) : product ? (
            <>
              <h1 className="text-3xl font-bold text-foreground">
                {product.name}
              </h1>
              <p className="text-xl text-primary font-semibold">
                R$ {product.price.toFixed(2)}
              </p>
              {product.description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
              )}
              <button className="mt-6 px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition">
                Adicionar ao carrinho
              </button>
            </>
          ) : (
            <p className="text-red-500">Produto não encontrado.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
