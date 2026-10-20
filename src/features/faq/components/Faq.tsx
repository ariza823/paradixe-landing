import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import { Section } from "@molecules/section/Section.tsx";
import { config } from "@config/site.config.ts";

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <Title id="faq-title">Preguntas</Title>

      <div className="flex flex-col">
        {config.faq.map((item) => (
          <details key={item.q} className="group border-b border-dashed border-line">
            <summary className="flex min-h-14 list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <Text as="span" size="none" addStyle="text-[16px] font-bold">
                {item.q}
              </Text>
              <span
                aria-hidden="true"
                className="text-[22px] leading-none text-accent-lilac group-open:rotate-45 motion-safe:transition-transform"
              >
                +
              </span>
            </summary>
            <Text variant="muted" addStyle="pb-6">
              {item.a}
            </Text>
          </details>
        ))}
      </div>
    </Section>
  );
}
