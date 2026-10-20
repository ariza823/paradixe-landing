import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Ingresa un correo válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export type LoginValues = z.infer<typeof loginSchema>;
