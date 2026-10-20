import Text from "@atoms/text/Text.tsx";
import Button from "@atoms/button/Button.tsx";
import { Dialog } from "@molecules/dialog/Dialog.tsx";
import { useAppDispatch, useAppSelector } from "@core/store/hookStore.ts";
import { showToast } from "@core/slices/uiSlice.ts";
import { deleteProduct } from "@features/catalog/slices/catalogSlice.ts";
import type { Product } from "@features/catalog/dto/product.types.ts";

interface DeleteProductDialogProps {
  readonly product: Product | null;
  readonly onClose: () => void;
}

export function DeleteProductDialog({ product, onClose }: DeleteProductDialogProps) {
  const dispatch = useAppDispatch();
  const deletingId = useAppSelector((state) => state.catalog.deletingId);
  const isDeleting = product !== null && deletingId === product.id;

  const confirm = async () => {
    if (!product) return;
    try {
      await dispatch(deleteProduct(product)).unwrap();
      dispatch(showToast("success", `${product.name} eliminado.`));
      onClose();
    } catch (error) {
      dispatch(showToast("error", typeof error === "string" ? error : "No se pudo eliminar el producto."));
    }
  };

  return (
    <Dialog
      open={product !== null}
      variant="center"
      title="Eliminar producto"
      onClose={onClose}
      preventClose={isDeleting}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={isDeleting}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-danger px-6 text-[13px] font-bold uppercase tracking-[2px] text-surface enabled:hover:brightness-110 disabled:opacity-45"
          >
            {isDeleting ? "Eliminando…" : "Eliminar"}
          </button>
        </>
      }
    >
      <Text>
        {`¿Eliminar "${product?.name ?? ""}"? También se borran sus fotos. Esta acción no se puede deshacer.`}
      </Text>
    </Dialog>
  );
}
