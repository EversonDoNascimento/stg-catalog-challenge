"use client";
import CategoryCard from "@/components/CategoryCard";
import FeedbackModal from "@/components/FeedbackModal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import ProtectedRoute from "@/components/ProtectedRoutes";
import Skeleton from "@/components/Skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/libs/supabase/supabase";
import { CategoryType } from "@/types/category";
import { ProductType } from "@/types/product";

import {
  BoltIcon,
  ComputerDesktopIcon,
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { CarFront, Shirt, ToolCase } from "lucide-react";

const Home = () => {
  const user = useAuth().user;
  const cart = useCart();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [category, setCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"error" | "success" | "info">(
    "info"
  );
  const showModal = (
    message: string,
    type: "error" | "success" | "info" = "info"
  ) => {
    setModalMessage(message);
    setModalType(type);
    setModalOpen(true);
  };
  const [loading, setLoading] = useState(false);

  const renderIconCategory = (category: string) => {
    switch (category) {
      case "eletronicos":
        return <ComputerDesktopIcon className="w-6 h-6" />;
      case "esporte":
        return <BoltIcon className="w-6 h-6" />;
      case "casa":
        return <HomeIcon className="w-6 h-6" />;
      case "roupa":
        return <Shirt className="w-6 h-6" />;
      case "carros":
        return <CarFront className="w-6 h-6" />;
      case "acessorios":
        return <ToolCase className="w-6 h-6" />;
      default:
        return <ShoppingCartIcon className="w-6 h-6" />;
    }
  };
  const handleAddToCart = async (product: ProductType) => {
    setLoading(true);
    if (!user) {
      showModal(
        "Você precisa estar logado para adicionar ao carrinho",
        "error"
      );
      return;
    }
    const { error } = await cart.addToCart(product, user);
    setLoading(false);
    if (error) {
      showModal("Erro ao adicionar ao carrinho", "error");
      return;
    }
    showModal("Produto adicionado ao carrinho", "success");
  };

  const handleRemoveFromCart = async (product: ProductType) => {
    setLoading(true);
    const { error } = await cart.removeFromCart(product.id);
    setLoading(false);
    if (error) {
      showModal("Erro ao remover do carrinho", "error");
      return;
    }
    showModal("Produto removido do carrinho", "success");
  };

  useEffect(() => {
    (async () => {
      setLoadingCategories(true);
      const { data, error } = await supabase.from("categories").select("*");
      setLoadingCategories(false);
      if (error) {
        showModal("Erro ao carregar categorias", "error");
        return;
      }
      setCategories(data);
    })();
    (async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        showModal("Erro ao carregar produtos", "error");
        return;
      }
      setProducts(data);
    })();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const query = supabase.from("products").select("*");
      const { data, error } =
        category === "all"
          ? await query
          : await query.eq("category_id", category);

      setLoading(false);

      if (error) {
        showModal("Erro ao carregar produtos", "error");
        return;
      }

      setProducts(data);
    };

    fetchProducts();
  }, [category]);
  return (
    <>
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
        type={modalType}
      />
      {/* {loading && <LoadingSpinner />} */}
      <Header></Header>
      <main className="max-w-7xl mx-auto flex flex-col gap-3 ">
        <h2 className="text-2xl font-bold text-foreground mt-16 ml-8 md:ml-12">
          Categorias
        </h2>
        <div className="flex flex-wrap justify-center gap-4 p-6">
          {loadingCategories &&
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} width="24rem" height="4rem" />
            ))}

          {categories.map((cat) => (
            <CategoryCard
              onClick={() => setCategory(cat.id)}
              key={cat.id}
              title={cat.title}
              icon={renderIconCategory(cat.slug)}
            />
          ))}
        </div>
        <div className="flex items-center justify-between px-11">
          <h2 className="text-2xl font-bold text-foreground  ">
            Lista de produtos
          </h2>
          {category !== "all" && (
            <p>
              Filtrando por:{" "}
              <strong
                onClick={() => setCategory("all")}
                className="text-red-600 underline cursor-pointer"
              >
                x {categories.find((c) => c.id === category)?.title}
              </strong>
            </p>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-6 p-6">
          {loading &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} width="24rem" height="24rem" />
            ))}
          {products.length === 0 ? (
            <h2 className="text-2xl font-bold text-foreground  ml-8 md:ml-12">
              Nenhum produto encontrado
            </h2>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInTheCart={cart.items.some(
                  (item) => item.product_id === product.id
                )}
                onAddOrRemoveToCart={() => {
                  const findProduct = cart.items.find(
                    (item) => item.product_id === product.id
                  );
                  if (!findProduct) {
                    handleAddToCart(product);
                    return;
                  }
                  handleRemoveFromCart(product);
                }}
              />
            ))
          )}
        </div>
      </main>

      <Footer></Footer>
    </>
  );
};

export default Home;
