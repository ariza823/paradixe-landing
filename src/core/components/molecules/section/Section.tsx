import type { ReactNode } from "react";

interface SectionProps {
  readonly id: string;
  readonly labelledBy: string;
  readonly children: ReactNode;
  readonly addStyle?: string;
}

export function Section({ id, labelledBy, children, addStyle = "" }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`section-divider px-4 py-20 lg:px-12 lg:py-28 ${addStyle}`.trim()}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-10">{children}</div>
    </section>
  );
}
