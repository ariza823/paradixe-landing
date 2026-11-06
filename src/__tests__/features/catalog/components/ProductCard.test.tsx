import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ProductCard } from "@features/catalog/components/ProductCard.tsx";
import { makeProduct } from "../../../fixtures/product.ts";

describe("ProductCard", () => {
  it("enlaza a WhatsApp con el mensaje del producto, sin selector de talla", () => {
    render(<ProductCard product={makeProduct({ category: "clasicos" })} isReleased />);

    expect(screen.queryByRole("group", { name: /talla/i })).not.toBeInTheDocument();
    const link = screen.getByRole("link", { name: /pedir por whatsapp/i });
    expect(decodeURIComponent(link.getAttribute("href") ?? "")).toContain(
      "wa.me/573143370824?text=Hola Paradixe, me interesa Hoodie Cielo (Negro)",
    );
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each([
    [0, "wa.me/573143370824"],
    [0.99, "wa.me/573238492841"],
  ])("muestra un solo botón con un número al azar de la categoría (%s)", (random, number) => {
    const spy = vi.spyOn(Math, "random").mockReturnValue(random);
    render(<ProductCard product={makeProduct({ category: "camisetas" })} isReleased />);
    spy.mockRestore();

    expect(screen.getByRole("link", { name: /pedir por whatsapp/i })).toHaveAttribute(
      "href",
      expect.stringContaining(number),
    );
  });

  it("usa el número de jeans", () => {
    render(<ProductCard product={makeProduct({ category: "jeans" })} isReleased />);
    expect(screen.getByRole("link", { name: /pedir por whatsapp/i })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/573015311468"),
    );
  });

  it("abre el detalle al tocar la foto, con el mismo número de WhatsApp de la tarjeta", async () => {
    const user = userEvent.setup();
    const product = makeProduct({ images: ["/a.webp"], description: "Algodón pesado." });
    render(<ProductCard product={product} isReleased />);
    const cardHref = screen.getByRole("link", { name: /pedir por whatsapp/i }).getAttribute("href");

    await user.click(screen.getByRole("button", { name: "Ver detalle de Hoodie Cielo" }));

    const dialog = screen.getByRole("dialog", { name: "Hoodie Cielo" });
    expect(within(dialog).getByText("Algodón pesado.")).toBeInTheDocument();
    expect(within(dialog).getByText("30 piezas")).toBeInTheDocument();
    expect(within(dialog).getByRole("link", { name: /pedir por whatsapp/i })).toHaveAttribute("href", cardHref);

    await user.click(within(dialog).getByRole("button", { name: "Cerrar" }));
    expect(screen.queryByText("Algodón pesado.")).not.toBeInTheDocument();
  });

  it("el detalle de una prenda agotada no tiene botón de pedido", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={makeProduct({ images: ["/a.webp"], status: "sold_out" })} isReleased />);

    await user.click(screen.getByRole("button", { name: "Ver detalle de Hoodie Cielo" }));

    expect(within(screen.getByRole("dialog")).queryByRole("link")).not.toBeInTheDocument();
  });

  it("muestra la talla solo si la prenda la tiene", () => {
    const { rerender } = render(<ProductCard product={makeProduct({ size: "M" })} isReleased />);
    expect(screen.getByText("Talla M")).toBeInTheDocument();

    rerender(<ProductCard product={makeProduct()} isReleased />);
    expect(screen.queryByText(/^talla/i)).not.toBeInTheDocument();
  });

  it("muestra precio en COP y 'precio por confirmar' cuando es 0", () => {
    const { rerender } = render(<ProductCard product={makeProduct()} isReleased />);
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
