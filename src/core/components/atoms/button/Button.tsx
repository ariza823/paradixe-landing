import type { ButtonProps, ButtonVariant } from "./Button.types.ts";

const baseClasses =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-[13px] font-bold uppercase tracking-[1px] whitespace-nowrap text-center sm:tracking-[2px] disabled:cursor-not-allowed disabled:opacity-45";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent-sky text-on-accent enabled:hover:brightness-110 [&[href]]:hover:brightness-110",
  whatsapp: "bg-accent-green text-on-accent enabled:hover:brightness-110 [&[href]]:hover:brightness-110",
  outline_green:
    "border-2 border-accent-green text-ink hover:bg-accent-green hover:text-on-accent",
  ghost: "px-3 text-ink hover:text-accent-lilac",
};

function Button({
  children,
  variant = "primary",
  href,
  external = false,
  disabled = false,
  onClick,
  ariaLabel,
  addStyle = "",
}: Readonly<ButtonProps>) {
  const className = `${baseClasses} ${variantClasses[variant]} ${addStyle}`.trim();

  if (href && !disabled) {
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default Button;
