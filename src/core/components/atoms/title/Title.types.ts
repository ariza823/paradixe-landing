import type { HTMLAttributes, ReactNode } from "react";

export const TITLE_SIZES = ["none", "section", "group", "panel", "product"] as const;

export type TitleSize = (typeof TITLE_SIZES)[number];

export type TitleTag = "h1" | "h2" | "h3";

export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: TitleTag | undefined;
  size?: TitleSize | undefined;
  addStyle?: string | undefined;
}
