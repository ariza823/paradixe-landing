import Text from "@atoms/text/Text.tsx";
import { padNumber } from "@core/utils/format.ts";
import type { CountdownState } from "@core/hooks/useCountdown.ts";

interface CountdownProps {
  readonly countdown: CountdownState;
  readonly dropName: string;
}

export function Countdown({ countdown, dropName }: CountdownProps) {
  const units = [
    { label: "Días", value: countdown.days },
    { label: "Horas", value: countdown.hours },
    { label: "Min", value: countdown.minutes },
    { label: "Seg", value: countdown.seconds },
  ];

  return (
    <div aria-live="polite" className="flex min-h-[88px] items-center justify-center">
      {countdown.isOver ? (
        <Text
          as="span"
          size="label_bold"
          variant="on_accent"
          addStyle="rounded-full bg-accent-green px-6 py-3"
        >
          {`${dropName} disponible`}
        </Text>
      ) : (
        <>
          <span className="sr-only">{`Faltan ${countdown.days} días para el ${dropName}`}</span>
          <ul aria-hidden="true" className="flex gap-3 sm:gap-6">
            {units.map((unit) => (
              <li
                key={unit.label}
                className="flex min-w-[64px] flex-col items-center gap-2 border border-dashed border-line bg-surface-soft px-2 py-3 sm:min-w-[96px] sm:px-4"
              >
                <Text as="span" size="countdown_value">
                  {padNumber(unit.value)}
                </Text>
                <Text as="span" size="countdown_unit" variant="muted">
                  {unit.label}
                </Text>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
