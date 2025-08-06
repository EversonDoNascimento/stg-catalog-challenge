"use client";
// pages/login.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginData } from "../../libs/zod/validation";
import Head from "next/head";
import { supabase } from "@/libs/supabase/supabase";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";
import Link from "next/link";
import FeedbackModal from "@/components/FeedbackModal";
export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginData) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    setLoading(false);

    if (error) {
      console.error("Erro ao fazer login:", error.message);
      showModal("Email ou senha incorretos.", "error");

      return;
    }

    router.push("/home");
  };

  return (
    <>
      <FeedbackModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
        type={modalType}
      />
      {loading && <LoadingSpinner />}
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Entrar
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.email ? "border-danger" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <input
                type="password"
                id="password"
                className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.password ? "border-danger" : ""
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-danger text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Entrar
            </button>
          </form>
          <div className="w-full text-center mt-8">
            <p>
              Não possui uma conta?{" "}
              <Link className="underline text-blue-700" href="/register">
                Fazer Cadastro
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
