import { useEffect, useRef, type ReactNode } from "react";
import Title from "@atoms/title/Title.tsx";
import { IconButton } from "@atoms/iconButton/IconButton.tsx";
import { CloseIcon } from "@atoms/icons/Icons.tsx";

type DialogVariant = "drawer" | "center";

interface DialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly variant?: DialogVariant;
  readonly preventClose?: boolean;
}

const variantClasses: Record<DialogVariant, string> = {
  drawer:
    "m-0 ml-auto h-dvh max-h-dvh w-full max-w-xl border-l border-dashed border-line",
  center: "m-auto w-[calc(100%-32px)] max-w-md border border-line",
};

export function Dialog({
  open,
  title,
  onClose,
  children,
  footer,
  variant = "drawer",
  preventClose = false,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `dialog-title-${title.replace(/\W+/g, "-").toLowerCase()}`;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return undefined;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!preventClose) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !preventClose) onClose();
      }}
      className={`bg-surface p-0 text-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px] ${variantClasses[variant]}`}
    >
      {open && (
        <div className="flex h-full max-h-[inherit] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-dashed border-line px-5 py-4">
            <Title as="h2" size="panel" id={titleId}>
              {title}
            </Title>
            <IconButton label="Cerrar" onClick={onClose} disabled={preventClose}>
              <CloseIcon size={18} />
            </IconButton>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">{children}</div>
          {footer && (
            <div className="flex flex-col-reverse gap-3 border-t border-dashed border-line px-5 py-4 sm:flex-row sm:justify-end">
              {footer}
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
