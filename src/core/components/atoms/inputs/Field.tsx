import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import Text from "@atoms/text/Text.tsx";

const controlClasses =
  "w-full min-h-11 rounded-none border bg-surface px-3 py-2 text-[15px] text-ink placeholder:text-ink-muted/70 outline-none focus-visible:border-accent-lilac";

interface FieldShellProps {
  readonly id: string;
  readonly label: string;
  readonly error?: string | undefined;
  readonly hint?: string | undefined;
  readonly children: ReactNode;
}

export function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <Text as="label" htmlFor={id} size="field_label" variant="muted">
        {label}
      </Text>
      {children}
      {error ? (
        <Text id={`${id}-error`} size="caption" variant="danger" role="alert">
          {error}
        </Text>
      ) : (
        hint && (
          <Text id={`${id}-hint`} size="caption" variant="muted">
            {hint}
          </Text>
        )
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

function borderOf(error?: string) {
  return error ? "border-danger" : "border-line";
}

type BaseProps = {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
};

export const TextField = forwardRef<HTMLInputElement, BaseProps & InputHTMLAttributes<HTMLInputElement>>(
  function TextField({ id, label, error, hint, className = "", ...props }, ref) {
    return (
      <FieldShell id={id} label={label} error={error} hint={hint}>
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={`${controlClasses} ${borderOf(error)} ${className}`.trim()}
          {...props}
        />
      </FieldShell>
    );
  },
);

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextAreaField({ id, label, error, hint, className = "", ...props }, ref) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${controlClasses} ${borderOf(error)} min-h-24 resize-y ${className}`.trim()}
        {...props}
      />
    </FieldShell>
  );
});

export const SelectField = forwardRef<
  HTMLSelectElement,
  BaseProps & SelectHTMLAttributes<HTMLSelectElement>
>(function SelectField({ id, label, error, hint, className = "", children, ...props }, ref) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={`${controlClasses} ${borderOf(error)} ${className}`.trim()}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
});
