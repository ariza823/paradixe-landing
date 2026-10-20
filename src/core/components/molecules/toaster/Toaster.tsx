import { useEffect } from "react";
import Text from "@atoms/text/Text.tsx";
import { CloseIcon } from "@atoms/icons/Icons.tsx";
import { useAppDispatch, useAppSelector } from "@core/store/hookStore.ts";
import { dismissToast, type Toast, type ToastTone } from "@core/slices/uiSlice.ts";

const TOAST_DURATION = 4500;

const toneClasses: Record<ToastTone, string> = {
  success: "border-accent-green",
  error: "border-danger",
  info: "border-accent-sky",
};

function ToastItem({ toast }: { readonly toast: Toast }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const id = setTimeout(() => dispatch(dismissToast(toast.id)), TOAST_DURATION);
    return () => clearTimeout(id);
  }, [dispatch, toast.id]);

  return (
    <li
      className={`flex items-start gap-3 border-l-4 bg-surface-soft px-4 py-3 shadow-[0_8px_24px_rgb(0_0_0/0.25)] ${toneClasses[toast.tone]}`}
    >
      <Text size="body_sm" addStyle="flex-1 pt-0.5">
        {toast.message}
      </Text>
      <button
        type="button"
        aria-label="Cerrar aviso"
        onClick={() => dispatch(dismissToast(toast.id))}
        className="-m-2 flex h-9 w-9 items-center justify-center text-ink-muted hover:text-ink"
      >
        <CloseIcon size={16} />
      </button>
    </li>
  );
}

export function Toaster() {
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-4 z-[70] sm:left-auto sm:w-96">
      <ul className="pointer-events-auto flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </ul>
    </div>
  );
}
