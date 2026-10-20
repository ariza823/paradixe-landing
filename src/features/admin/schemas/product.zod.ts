import { z } from "zod";

const wholeNumber = (label: string) =>
  z.number({ error: `Ingresa ${label}` }).int("Sin decimales");

export const productFormSchema = z.object({
  category: z.string().min(1, "Elige una categoría"),
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(80, "Máximo 80 caracteres"),
  variant: z.string().trim().max(80, "Máximo 80 caracteres"),
  description: z.string().trim().max(500, "Máximo 500 caracteres"),
  price: wholeNumber("un precio").min(0, "No puede ser negativo").max(50_000_000, "Revisa el precio"),
  edition: wholeNumber("las unidades").min(1, "Mínimo 1").max(9999, "Máximo 9999"),
  position: wholeNumber("un número").min(0, "No puede ser negativo"),
  status: z.enum(["available", "soon", "sold_out"]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
