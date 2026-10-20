import type { ReactNode } from "react";

export const BUTTON_VARIANTS = ["primary", "whatsapp", "outline_green", "ghost"] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant | undefined;
  href?: string | undefined;
  external?: boolean | undefined;
  disabled?: boolean | undefined;
  onClick?: (() => void) | undefined;
  ariaLabel?: string | undefined;
  addStyle?: string | undefined;
}
