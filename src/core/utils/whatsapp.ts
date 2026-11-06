export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function productMessage(product: { name: string; variant?: string | null | undefined }): string {
  const variant = product.variant ? ` (${product.variant})` : "";
  return `Hola Paradixe, me interesa ${product.name}${variant}. ¿Está disponible?`;
}
