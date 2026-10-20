import Text from "@atoms/text/Text.tsx";
import Button from "@atoms/button/Button.tsx";
import { Logo } from "@atoms/logo/Logo.tsx";
import { BarbedWire } from "@atoms/barbedWire/BarbedWire.tsx";
import { WhatsAppIcon } from "@atoms/icons/Icons.tsx";
import { config } from "@config/site.config.ts";
import { LINES } from "@config/catalog.config.ts";
import { buildWhatsAppUrl } from "@core/utils/whatsapp.ts";
// import type { CountdownState } from "@core/hooks/useCountdown.ts";
// import { Countdown } from "./Countdown.tsx";

// interface HeroProps {
//   readonly countdown: CountdownState;
// }

// export function Hero({ countdown }: HeroProps) {
export function Hero() {
  const waitlistUrl = buildWhatsAppUrl(config.whatsapp.number, config.whatsapp.waitlistMessage);

  return (
    <section
      id="top"
      className="flex min-h-[78svh] flex-col items-center justify-center gap-10 px-4 py-12 sm:py-16 lg:px-12"
    >
      <div className="flex w-full max-w-[1200px] flex-col items-center gap-1 sm:flex-row sm:justify-between">
        <Text as="span" size="label" variant="muted">
          {config.hero.eyebrowLeft}
        </Text>
        <Text as="span" size="label" variant="muted">
          {config.hero.eyebrowRight}
        </Text>
      </div>

      <div className="relative flex w-full max-w-[900px] items-center justify-center">
        <BarbedWire addStyle="absolute inset-x-0 top-[40%] w-full -translate-y-1/2" />
        <div className="relative">
          <Logo as="h1" size="hero" />
        </div>
      </div>

      {/* <Countdown countdown={countdown} dropName={config.drop.name} /> */}

      <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
        <Button href={`#${LINES.streetwear.sectionId}`} variant="primary" addStyle="w-full sm:w-auto">
          Ver la colección
        </Button>
        <Button href={waitlistUrl} external variant="outline_green" addStyle="w-full sm:w-auto">
          <WhatsAppIcon size={18} />
          Avísame por WhatsApp
        </Button>
      </div>
    </section>
  );
}
