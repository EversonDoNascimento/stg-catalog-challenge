import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email("Email inválido"),
    confirmEmail: z.string(),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(10, "Número de telefone inválido")
      .regex(/^\d+$/, "Telefone deve conter apenas números"),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Os emails não coincidem",
    path: ["confirmEmail"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterData = z.infer<typeof registerSchema>;
