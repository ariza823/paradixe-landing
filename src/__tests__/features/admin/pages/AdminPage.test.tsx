import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "@features/admin/pages/AdminPage.tsx";
import { Toaster } from "@molecules/toaster/Toaster.tsx";
import { createAppStore } from "@core/store/rootReducer.ts";
import { setProductsRepository } from "@features/catalog/services/productsService.ts";
import { createDemoRepository } from "@features/catalog/services/demoProducts.ts";

function renderAdmin() {
  setProductsRepository(createDemoRepository(localStorage));
  const store = createAppStore();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <>
          <AdminPage />
          <Toaster />
        </>
      </MemoryRouter>
    </Provider>,
  );
  return store;
}

describe("AdminPage (modo demo)", () => {
  it("entra al panel, muestra las categorías del seed y crea una camiseta con el +", async () => {
    const user = userEvent.setup();
    const store = renderAdmin();

    await user.click(screen.getByRole("button", { name: /entrar al panel demo/i }));

    const shirts = await screen.findByRole("region", { name: "Camisetas" });
    expect(within(shirts).getAllByRole("button", { name: /^editar camiseta/i })).toHaveLength(8);
    expect(screen.getByRole("region", { name: "Hoodies" })).toBeInTheDocument();

    await user.click(within(shirts).getAllByRole("button", { name: "Agregar camiseta" }).at(-1)!);
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByLabelText("Nombre"), "Tee Alambre");
    await user.clear(within(dialog).getByLabelText("Precio (COP)"));
    await user.type(within(dialog).getByLabelText("Precio (COP)"), "95000");
    await user.click(within(dialog).getByRole("button", { name: "Disponible" }));
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByText("Producto creado.")).toBeInTheDocument();
    const created = store.getState().catalog.items.find((p) => p.name === "Tee Alambre");
    expect(created).toMatchObject({ category: "camisetas", price: 95000, status: "available", position: 9 });
    expect(within(shirts).getByRole("button", { name: "Editar Tee Alambre" })).toBeInTheDocument();
  });

  it("valida el formulario antes de guardar", async () => {
    const user = userEvent.setup();
    renderAdmin();
    await user.click(screen.getByRole("button", { name: /entrar al panel demo/i }));
    await screen.findByRole("region", { name: "Hoodies" });

    await user.click(screen.getAllByRole("button", { name: /nuevo/i })[0]!);
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(await screen.findByText("Mínimo 2 caracteres")).toBeInTheDocument();
  });
});
