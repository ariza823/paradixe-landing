import type { TextProps, TextSize, TextVariant } from "./Text.types.ts";

const sizeClasses: Record<TextSize, string> = {
  none: "",
  label: "text-[13px] font-normal uppercase tracking-[3px] leading-normal",
  label_bold: "text-[13px] font-bold uppercase tracking-[3px] leading-normal",
  caption: "text-[12px] font-normal leading-[1.4]",
  field_label: "text-[12px] font-bold uppercase tracking-[2px] leading-normal",
  body: "text-[15px] sm:text-[16px] font-normal leading-[1.6]",
  body_sm: "text-[14px] font-normal leading-[1.5]",
  body_bold: "text-[15px] sm:text-[16px] font-bold leading-[1.4]",
  price: "text-[16px] font-bold leading-normal",
  countdown_value: "text-[32px] sm:text-[48px] font-bold leading-none tabular-nums",
  countdown_unit: "text-[12px] font-normal uppercase tracking-[3px] leading-normal",
  step_number: "text-[32px] font-bold leading-none tabular-nums",
  stamp: "font-gothic text-[32px] font-bold leading-none",
  stat: "text-[28px] font-bold leading-none tabular-nums",
};

const variantClasses: Record<TextVariant, string> = {
  none: "",
  default: "text-ink",
  muted: "text-ink-muted",
  gold: "text-accent-gold",
  on_accent: "text-on-accent",
  danger: "text-danger",
};

function Text({
  children,
  as: Tag = "p",
  size = "body",
  variant = "default",
  addStyle = "",
  ...props
}: Readonly<TextProps>) {
  return (
    <Tag
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${addStyle}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Text;
