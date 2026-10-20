import type { ReactNode } from "react";
import Text from "@atoms/text/Text.tsx";

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 border border-dashed border-line px-6 py-14 text-center">
      <Text size="body_bold">{title}</Text>
      {description && (
        <Text size="body_sm" variant="muted">
          {description}
        </Text>
      )}
      {action}
    </div>
  );
}
