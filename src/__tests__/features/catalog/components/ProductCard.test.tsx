import { render, screen } from "@testing-library/react";
import { ProductCard } from "@features/catalog/components/ProductCard.tsx";
import { makeProduct } from "../../../fixtures/product.ts";

describe("ProductCard", () => {
  it("enlaza a WhatsApp con el mensaje del producto, sin tallas", () => {
    render(<ProductCard product={makeProduct({ category: "clasicos" })} isReleased />);

    expect(screen.queryByRole("group", { name: /talla/i })).not.toBeInTheDocument();
    const link = screen.getByRole("link", { name: /pedir por whatsapp/i });
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain(
      "wa.me/573143370824?text=Hola Paradixe, me interesa Hoodie Cielo (Negro)",
    );
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("usa los números de su categoría: dos en hoodies, uno en jeans", () => {
    const { rerender } = render(<ProductCard product={makeProduct({ category: "hoodies" })} isReleased />);
    const links = screen.getAllByRole("link", { name: /pedir por whatsapp al/i });
    expect(links.map((l) => l.getAttribute("href")?.split("?")[0])).toEqual([
      "https://wa.me/573143370824",
      "https://wa.me/573238492841",
    ]);
    expect(screen.getByText("323 849 2841")).toBeInTheDocument();

    rerender(<ProductCard product={makeProduct({ category: "jeans" })} isReleased />);
    expect(screen.getByRole("link", { name: /pedir por whatsapp/i })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/573015311468"),
    );
  });

  it("muestra numeración, precio en COP y 'precio por confirmar' cuando es 0", () => {
    const { rerender } = render(<ProductCard product={makeProduct()} isReleased />);
    expect(screen.getByText("N°/030")).toBeInTheDocument();
    expect(screen.getByText(/180\.000/)).toBeInTheDocument();

    rerender(<ProductCard product={makeProduct({ price: 0 })} isReleased />);
    expect(screen.getByText(/precio por confirmar/i)).toBeInTheDocument();
  });

  it("bloquea 'soon' con el texto de su línea hasta el lanzamiento", () => {
    const { rerender } = render(<ProductCard product={makeProduct({ status: "soon" })} isReleased={false} />);
    expect(screen.getByRole("button", { name: /próximamente/i })).toBeDisabled();

    rerender(<ProductCard product={makeProduct({ status: "soon", line: "joyeria" })} isReleased={false} />);
    expect(screen.getByRole("button", { name: /próximamente/i })).toBeDisabled();
  });

  it("muestra el sello AGOTADO sin botón de pedido", () => {
    render(<ProductCard product={makeProduct({ status: "sold_out" })} isReleased />);
    expect(screen.getByText("Agotado")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /whatsapp/i })).not.toBeInTheDocument();
  });

  it("muestra galería navegable cuando hay varias fotos", () => {
    render(<ProductCard product={makeProduct({ images: ["/a.webp", "/b.webp"] })} isReleased />);
    expect(screen.getByRole("img", { name: "Hoodie Cielo, foto 1 de 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Foto siguiente" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Foto anterior" })).toBeDisabled();
  });
});
