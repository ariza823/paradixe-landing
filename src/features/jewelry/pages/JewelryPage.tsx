import { CatalogSection } from "@features/catalog/components/CatalogSection.tsx";
import { HowToBuy } from "@features/how-to-buy/components/HowToBuy.tsx";
import { Faq } from "@features/faq/components/Faq.tsx";
import { useDocumentTitle } from "@core/hooks/useDocumentTitle.ts";
import { config } from "@config/site.config.ts";
import { JewelryHero } from "../components/JewelryHero.tsx";

function JewelryPage() {
  useDocumentTitle(`Joyería — ${config.brand.name} · ${config.brand.city}`);

  return (
    <>
      <JewelryHero />
      <CatalogSection line="joyeria" isReleased={false} />
      <HowToBuy />
      <Faq />
    </>
  );
}

export default JewelryPage;
