import { Hero } from "@features/hero/components/Hero.tsx";
import { CatalogSection } from "@features/catalog/components/CatalogSection.tsx";
import { HowToBuy } from "@features/how-to-buy/components/HowToBuy.tsx";
import { Faq } from "@features/faq/components/Faq.tsx";
// import { useCountdown } from "@core/hooks/useCountdown.ts";
import { useDocumentTitle } from "@core/hooks/useDocumentTitle.ts";
import { config } from "@config/site.config.ts";

function HomePage() {
  // Drop: descomentar junto con Hero para volver a la cuenta regresiva
  // const countdown = useCountdown(config.drop.date);
  useDocumentTitle(`${config.brand.name} — Streetwear underground · ${config.brand.city}`);

  return (
    <>
      <Hero />
      {/* <Hero countdown={countdown} /> */}
      <CatalogSection line="streetwear" isReleased={false} />
      {/* <CatalogSection line="streetwear" isReleased={countdown.isOver} /> */}
      <HowToBuy />
      <Faq />
    </>
  );
}

export default HomePage;
