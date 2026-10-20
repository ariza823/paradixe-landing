import type { ReactNode } from "react";

type IconButtonTone = "default" | "danger" | "solid";

interface IconButtonProps {
  readonly label: string;
  readonly children: ReactNode;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly tone?: IconButtonTone;
  readonly addStyle?: string;
}

const toneClasses: Record<IconButtonTone, string> = {
  default: "border border-line bg-surface text-ink enabled:hover:border-accent-lilac enabled:hover:text-accent-lilac",
  danger: "border border-line bg-surface text-ink enabled:hover:border-danger enabled:hover:text-danger",
  solid: "bg-accent-sky text-on-accent enabled:hover:brightness-110",
};

export function IconButton({
  label,
  children,
  onClick,
  disabled = false,
  tone = "default",
  addStyle = "",
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-40 ${toneClasses[tone]} ${addStyle}`.trim()}
    >
      {children}
    </button>
  );
}
