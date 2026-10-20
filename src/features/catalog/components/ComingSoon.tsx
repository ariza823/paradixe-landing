import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import Button from "@atoms/button/Button.tsx";
import { BarbedWire } from "@atoms/barbedWire/BarbedWire.tsx";
import { WhatsAppIcon } from "@atoms/icons/Icons.tsx";
import { config } from "@config/site.config.ts";
import type { LineConfig } from "@config/catalog.config.ts";
import { buildWhatsAppUrl } from "@core/utils/whatsapp.ts";

interface ComingSoonProps {
  readonly line: LineConfig;
}

export function ComingSoon({ line }: ComingSoonProps) {
  const waitlistUrl = buildWhatsAppUrl(
    config.whatsapp.number,
    `Hola Paradixe, quiero que me avisen cuando salga ${line.label}.`,
  );

  return (
    <div className="relative flex flex-col items-center gap-6 overflow-hidden border border-dashed border-line bg-surface-soft px-6 pt-16 pb-24 text-center sm:pt-24 sm:pb-32">
      <BarbedWire addStyle="pointer-events-none absolute inset-x-0 bottom-0 w-full translate-y-1/3 opacity-40" />
      <Text as="span" size="label" variant="gold" addStyle="relative">
        {line.label}
      </Text>
      <Title as="h3" addStyle="relative">
        {line.lockedLabel}
      </Title>
      <Text variant="muted" addStyle="relative max-w-md">
        {line.emptyMessage}
      </Text>
      <Button href={waitlistUrl} external variant="whatsapp" addStyle="relative w-full sm:w-auto">
        <WhatsAppIcon size={18} />
        Avísame por WhatsApp
      </Button>
    </div>
  );
}
