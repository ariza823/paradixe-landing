import { buildWhatsAppUrl, productMessage } from "@core/utils/whatsapp.ts";

describe("whatsapp utils", () => {
  it("arma el mensaje con la variante", () => {
    expect(productMessage({ name: "Hoodie Cielo", variant: "Negro" })).toBe(
      "Hola Paradixe, me interesa Hoodie Cielo (Negro). ¿Está disponible?",
    );
  });

  it("omite la variante cuando no existe", () => {
    expect(productMessage({ name: "Tee" })).toBe("Hola Paradixe, me interesa Tee. ¿Está disponible?");
  });

  it("codifica el mensaje en la URL de wa.me", () => {
    expect(buildWhatsAppUrl("573001234567", "Hola ¿Tee?")).toBe(
      "https://wa.me/573001234567?text=Hola%20%C2%BFTee%3F",
    );
  });
});
