"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterData } from "../../libs/zod/validation";
import Head from "next/head";
import { supabase } from "@/libs/supabase/supabase";
import Link from "next/link";
import { useState } from "react";
import FeedbackModal from "@/components/FeedbackModal";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

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

  const onSubmit = async (formData: RegisterData) => {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          phone: formData.phone,
        },
      },
    });

    if (!error) {
      await supabase.auth.updateUser({
        data: { name: formData.name, phone: formData.phone },
      });
    }

    setLoading(false);
    if (error) {
      showModal("Erro ao criar conta", "error");
      console.error("Erro ao criar conta:", error.message);
      return;
    }

    showModal(
      "Conta criada com sucesso! Verifique seu e-mail para ativar a conta.",
      "success"
    );
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
        <title>Registro</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Criar Conta
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground">
                Nome
              </label>
              <input
                type="text"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? "border-danger" : "border-gray-300"
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-danger text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? "border-danger" : "border-gray-300"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground">
                Confirmar Email
              </label>
              <input
                type="email"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.confirmEmail ? "border-danger" : "border-gray-300"
                }`}
                {...register("confirmEmail")}
              />
              {errors.confirmEmail && (
                <p className="text-danger text-sm mt-1">
                  {errors.confirmEmail.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground">
                Senha
              </label>
              <input
                type="password"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? "border-danger" : "border-gray-300"
                }`}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-danger text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground">
                Confirmar Senha
              </label>
              <input
                type="password"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.confirmPassword ? "border-danger" : "border-gray-300"
                }`}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-danger text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground">
                Telefone
              </label>
              <input
                type="tel"
                inputMode="numeric"
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? "border-danger" : "border-gray-300"
                }`}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-danger text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Registrar
            </button>
          </form>

          <div className="w-full text-center mt-8">
            <p>
              Já possui uma conta?{" "}
              <Link className="underline text-blue-700" href="/login">
                Fazer Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
