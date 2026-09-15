import { z } from "zod";

const email = z.string().min(1, "Email wajib diisi").email("Masukkan email yang valid");
const password = z.string().min(8, "Password minimal 8 karakter");

export const registerSchema = z
  .object({
    email,
    password,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: "custom", message: "Konfirmasi password tidak cocok", path: ["confirmPassword"] });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ code: "custom", message: "Konfirmasi password tidak cocok", path: ["confirmPassword"] });
    }
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
