import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CatalogSection } from "@features/catalog/components/CatalogSection.tsx";
import { createAppStore } from "@core/store/rootReducer.ts";
import { setProductsRepository } from "@features/catalog/services/productsService.ts";
import { createDemoRepository, DEMO_STORAGE_KEY } from "@features/catalog/services/demoProducts.ts";
import { makeProduct } from "../../../fixtures/product.ts";

function renderLine(line: "streetwear" | "joyeria") {
  setProductsRepository(createDemoRepository(localStorage));
  render(
    <Provider store={createAppStore()}>
      <MemoryRouter>
        <CatalogSection line={line} isReleased={false} />
      </MemoryRouter>
    </Provider>,
  );
}

describe("CatalogSection", () => {
  it("muestra 'Próximamente' sin filtros cuando la línea no tiene productos", async () => {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify([makeProduct()]));
    renderLine("joyeria");

    expect(await screen.findByRole("heading", { name: "Próximamente" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /avísame por whatsapp/i })).toHaveAttribute(
      "href",
      expect.stringContaining("wa.me/573143370824"),
    );
    expect(screen.queryByRole("group", { name: "Categoría" })).not.toBeInTheDocument();
  });

  it("muestra el catálogo normal cuando hay productos", async () => {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify([makeProduct({ images: ["/a.webp"] })]));
    renderLine("streetwear");

    expect(await screen.findByRole("group", { name: "Categoría" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Próximamente" })).not.toBeInTheDocument();
  });

  it("oculta las prendas sin foto y su categoría", async () => {
    localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify([
        makeProduct({ images: ["/a.webp"] }),
        makeProduct({ id: "p-2", name: "Jean Vacío", category: "jeans" }),
      ]),
    );
    renderLine("streetwear");

    expect(await screen.findByRole("heading", { name: "Hoodie Cielo" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Jean Vacío" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /jeans/i })).not.toBeInTheDocument();
  });

  it("muestra 'Próximamente' cuando ninguna prenda de la línea tiene foto", async () => {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify([makeProduct()]));
    renderLine("streetwear");

    expect(await screen.findByRole("heading", { name: "Próximamente" })).toBeInTheDocument();
  });
});
