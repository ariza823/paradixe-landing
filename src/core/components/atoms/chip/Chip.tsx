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
        "inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-4 text-[13px] font-bold",
        pressed
          ? "border-accent-sky bg-accent-sky text-on-accent"
          : "border-line text-ink hover:border-accent-lilac",
        addStyle,
      ].join(" ")}
    >
      {children}
    </button>
  );
}
