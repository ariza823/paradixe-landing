import Text from "@atoms/text/Text.tsx";
import Button from "@atoms/button/Button.tsx";
import { Logo } from "@atoms/logo/Logo.tsx";
import { BarbedWire } from "@atoms/barbedWire/BarbedWire.tsx";
import { WhatsAppIcon } from "@atoms/icons/Icons.tsx";
import { config } from "@config/site.config.ts";
import { LINES } from "@config/catalog.config.ts";
import { buildWhatsAppUrl } from "@core/utils/whatsapp.ts";

export function JewelryHero() {
  const contactUrl = buildWhatsAppUrl(config.whatsapp.number, config.whatsapp.contactMessage);

  return (
    <section
      id="top"
      className="flex min-h-[78svh] flex-col items-center justify-center gap-10 px-4 py-12 sm:py-16 lg:px-12"
    >
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-1 sm:flex-row sm:justify-between">
        <Text as="span" size="label" variant="muted">
          {config.jewelry.eyebrowLeft}
        </Text>
        <Text as="span" size="label" variant="muted">
          {config.jewelry.eyebrowRight}
        </Text>
      </div>

      <div className="relative flex w-full max-w-[900px] items-center justify-center">
        <BarbedWire addStyle="absolute inset-x-0 top-[40%] w-full -translate-y-1/2 text-accent-gold" />
        <div className="relative">
          <Logo as="h1" size="hero" pill={LINES.joyeria.label} pillTone="gold" />
        </div>
      </div>

      <Text variant="muted" addStyle="max-w-md text-center">
        {config.jewelry.intro}
      </Text>

      <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <Button href={`#${LINES.joyeria.sectionId}`} variant="primary" addStyle="w-full sm:w-auto">
          Ver la joyería
        </Button>
        <Button href={contactUrl} external variant="outline_green" addStyle="w-full sm:w-auto">
          <WhatsAppIcon size={18} />
          Preguntar por WhatsApp
        </Button>
      </div>
    </section>
  );
}
