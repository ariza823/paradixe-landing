import type { ReactNode } from "react";

interface ChipProps {
  readonly children: ReactNode;
  readonly pressed: boolean;
  readonly onClick: () => void;
  readonly addStyle?: string;
}

export function Chip({ children, pressed, onClick, addStyle = "" }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={[
        "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-4 text-[13px] font-bold",
        pressed
          ? "-rotate-2 border-accent-sky bg-accent-sky text-on-accent"
          : "border-line bg-surface-soft text-ink hover:border-accent-lilac",
        addStyle,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
