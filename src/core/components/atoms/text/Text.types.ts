import type { HTMLAttributes, ReactNode } from "react";

export const TEXT_SIZES = [
  "none",
  "label",
  "label_bold",
  "caption",
  "field_label",
  "body",
  "body_sm",
  "body_bold",
  "price",
  "countdown_value",
  "countdown_unit",
  "step_number",
  "stamp",
  "stat",
] as const;

export type TextSize = (typeof TEXT_SIZES)[number];

export const TEXT_VARIANTS = ["none", "default", "muted", "gold", "on_accent", "danger"] as const;

export type TextVariant = (typeof TEXT_VARIANTS)[number];

export type TextTag = "p" | "span" | "div" | "label";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: TextTag | undefined;
  htmlFor?: string | undefined;
  size?: TextSize | undefined;
  variant?: TextVariant | undefined;
  addStyle?: string | undefined;
}
