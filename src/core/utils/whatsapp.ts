export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function productMessage(product: { name: string; variant?: string | null | undefined }): string {
  const variant = product.variant ? ` (${product.variant})` : "";
  return `Hola Paradixe, me interesa ${product.name}${variant}. ¿Está disponible?`;
}

export function formatPhone(number: string): string {
  return number.replace(/^57/, "").replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");
}
