import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@atoms/button/Button.tsx";
import { Chip } from "@atoms/chip/Chip.tsx";
import { SelectField, TextAreaField, TextField } from "@atoms/inputs/Field.tsx";
import { Dialog } from "@molecules/dialog/Dialog.tsx";
import { LINES, STATUS_LABELS } from "@config/catalog.config.ts";
import { formatCOP } from "@core/utils/format.ts";
import { useAppDispatch, useAppSelector } from "@core/store/hookStore.ts";
import { showToast } from "@core/slices/uiSlice.ts";
import { saveProduct } from "@features/catalog/slices/catalogSlice.ts";
import type { Product, ProductImageItem, ProductLine, ProductStatus } from "@features/catalog/dto/product.types.ts";
import { productFormSchema, type ProductFormValues } from "../schemas/product.zod.ts";
import { emptyFormValues, formValuesToInput, productToFormValues } from "../utils/productForm.ts";
import { ImageUploader } from "./ImageUploader.tsx";

interface ProductFormDialogProps {
  readonly open: boolean;
  readonly line: ProductLine;
  readonly product: Product | null;
  readonly presetCategory: string | null;
  readonly onClose: () => void;
}

const FORM_ID = "product-form";
const STATUSES = Object.keys(STATUS_LABELS) as ProductStatus[];

function revokeLocal(images: ProductImageItem[]) {
  images.forEach((image) => {
    if (image.kind === "local") URL.revokeObjectURL(image.preview);
  });
}

export function ProductFormDialog({ open, line, product, presetCategory, onClose }: ProductFormDialogProps) {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.catalog.items);
  const saving = useAppSelector((state) => state.catalog.saving);
  const lineConfig = LINES[line];
  const [images, setImages] = useState<ProductImageItem[]>([]);
  const imagesRef = useRef(images);
  imagesRef.current = images;
  const productsRef = useRef(products);
  productsRef.current = products;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyFormValues(line, presetCategory, products),
  });

  useEffect(() => {
    if (!open) return;
    reset(product ? productToFormValues(product) : emptyFormValues(line, presetCategory, productsRef.current));
    setImages(product ? product.images.map((url) => ({ kind: "remote" as const, url })) : []);
  }, [open, product, line, presetCategory, reset]);

  useEffect(() => () => revokeLocal(imagesRef.current), []);

  const status = useWatch({ control, name: "status" });
  const price = useWatch({ control, name: "price" });

  const close = () => {
    if (saving) return;
    revokeLocal(images);
    setImages([]);
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await dispatch(
        saveProduct({
          id: product?.id ?? null,
          input: formValuesToInput(line, values),
          images,
          previousImages: product?.images ?? [],
        }),
      ).unwrap();
      dispatch(showToast("success", product ? "Producto actualizado." : "Producto creado."));
      revokeLocal(images);
      setImages([]);
      onClose();
    } catch (error) {
      dispatch(showToast("error", typeof error === "string" ? error : "No se pudo guardar el producto."));
    }
  });

  const imagesChanged = product
    ? images.map((i) => (i.kind === "remote" ? i.url : i.preview)).join() !== product.images.join()
    : images.length > 0;

  return (
    <Dialog
      open={open}
      title={product ? "Editar producto" : `Nuevo producto · ${lineConfig.label}`}
      onClose={close}
      preventClose={saving}
      footer={
        <>
          <Button variant="ghost" onClick={close} disabled={saving}>
            Cancelar
          </Button>
          <button
            type="submit"
            form={FORM_ID}
            disabled={saving || (product !== null && !isDirty && !imagesChanged)}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent-sky px-6 text-[13px] font-bold uppercase tracking-[2px] text-on-accent enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {saving ? "Guardando…" : "Guardar"}
          </button>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <ImageUploader
          images={images}
          onChange={setImages}
          onError={(message) => dispatch(showToast("error", message))}
          disabled={saving}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SelectField id="product-category" label="Categoría" error={errors.category?.message} {...register("category")}>
            {lineConfig.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </SelectField>
          <TextField
            id="product-position"
            label="Orden"
            type="number"
            inputMode="numeric"
            min={0}
            hint="Menor número = aparece primero"
            error={errors.position?.message}
            {...register("position", { valueAsNumber: true })}
          />
        </div>

        <TextField
          id="product-name"
          label="Nombre"
          placeholder="Hoodie Cielo"
          maxLength={80}
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          id="product-variant"
          label="Color / variante"
          placeholder="Negro / estampado lila"
          maxLength={80}
          error={errors.variant?.message}
          {...register("variant")}
        />
        <TextAreaField
          id="product-description"
          label="Descripción (opcional)"
          maxLength={500}
          error={errors.description?.message}
          {...register("description")}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextField
            id="product-price"
            label="Precio (COP)"
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            hint={Number.isFinite(price) && price > 0 ? formatCOP(price) : "0 = precio por confirmar"}
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />
          <TextField
            id="product-edition"
            label="Unidades (N°)"
            type="number"
            inputMode="numeric"
            min={1}
            error={errors.edition?.message}
            {...register("edition", { valueAsNumber: true })}
          />
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-[12px] font-bold uppercase tracking-[2px] text-ink-muted">Estado</legend>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((value) => (
              <Chip
                key={value}
                pressed={status === value}
                onClick={() => setValue("status", value, { shouldDirty: true })}
              >
                {STATUS_LABELS[value]}
              </Chip>
            ))}
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
