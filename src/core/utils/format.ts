const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatCOP(value: number): string {
  return copFormatter.format(value);
}

export function padNumber(value: number, length = 2): string {
  return String(value).padStart(length, "0");
}
