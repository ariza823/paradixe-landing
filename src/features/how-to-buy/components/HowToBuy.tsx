import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import { Section } from "@molecules/section/Section.tsx";
import { config } from "@config/site.config.ts";
import { padNumber } from "@core/utils/format.ts";

export function HowToBuy() {
  return (
    <Section id="como-comprar" labelledBy="como-comprar-title" addStyle="bg-surface-soft/60">
      <Title id="como-comprar-title">Cómo comprar</Title>

      <ol className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {config.howToBuy.map((step, index) => (
          <li key={step} className="flex flex-col gap-4 border-t border-dashed border-line pt-6">
            <Text as="span" size="step_number" variant="gold" aria-hidden="true">
              {padNumber(index + 1)}
            </Text>
            <Text>{step}</Text>
          </li>
        ))}
      </ol>

      <Text size="body_sm" variant="muted">
        {config.shipping}
      </Text>
    </Section>
  );
}
