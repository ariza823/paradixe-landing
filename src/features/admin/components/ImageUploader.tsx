import { useId, useRef, useState, type DragEvent } from "react";
import Text from "@atoms/text/Text.tsx";
import { IconButton } from "@atoms/iconButton/IconButton.tsx";
import { CloseIcon, StarIcon, UploadIcon } from "@atoms/icons/Icons.tsx";
import { MAX_PRODUCT_IMAGES } from "@config/catalog.config.ts";
import { ACCEPTED_IMAGE_TYPES, compressImage } from "@core/utils/image.ts";
import type { ProductImageItem } from "@features/catalog/dto/product.types.ts";

interface ImageUploaderProps {
  readonly images: ProductImageItem[];
  readonly onChange: (images: ProductImageItem[]) => void;
  readonly onError: (message: string) => void;
  readonly disabled?: boolean;
}

const srcOf = (image: ProductImageItem) => (image.kind === "remote" ? image.url : image.preview);

export function ImageUploader({ images, onChange, onError, disabled = false }: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const remaining = MAX_PRODUCT_IMAGES - images.length;

  const addFiles = async (files: File[]) => {
    const valid = files.filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
    if (valid.length < files.length) onError("Solo se aceptan fotos JPG, PNG o WEBP.");
    const accepted = valid.slice(0, Math.max(remaining, 0));
    if (valid.length > accepted.length) onError(`Máximo ${MAX_PRODUCT_IMAGES} fotos por producto.`);
    if (accepted.length === 0) return;

    setIsProcessing(true);
    try {
      const blobs = await Promise.all(accepted.map((file) => compressImage(file)));
      onChange([
        ...images,
        ...blobs.map((blob) => ({ kind: "local" as const, blob, preview: URL.createObjectURL(blob) })),
      ]);
    } catch (error) {
      onError(error instanceof Error ? error.message : "No se pudo procesar la foto.");
    } finally {
      setIsProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (index: number) => {
    const target = images[index];
    if (target?.kind === "local") URL.revokeObjectURL(target.preview);
    onChange(images.filter((_, i) => i !== index));
  };

  const makeCover = (index: number) => {
    const target = images[index];
    if (!target) return;
    onChange([target, ...images.filter((_, i) => i !== index)]);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) void addFiles(Array.from(event.dataTransfer.files));
  };

  const isFull = remaining <= 0;

  return (
    <div className="flex flex-col gap-3">
      <Text as="span" size="field_label" variant="muted">
        {`Fotos · ${images.length}/${MAX_PRODUCT_IMAGES}`}
      </Text>

      {images.length > 0 && (
        <ul className="grid grid-cols-3 gap-3">
          {images.map((image, index) => (
            <li key={srcOf(image)} className="relative aspect-[4/5] overflow-hidden border border-line bg-surface-soft">
              <img src={srcOf(image)} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />
              {index === 0 && (
                <Text
                  as="span"
                  size="caption"
                  variant="on_accent"
                  addStyle="absolute bottom-2 left-2 rounded-full bg-accent-sky px-2 py-0.5 font-bold"
                >
                  Portada
                </Text>
              )}
              <div className="absolute top-1 right-1 flex flex-col gap-1">
                <IconButton label={`Quitar foto ${index + 1}`} tone="danger" onClick={() => remove(index)} disabled={disabled} addStyle="h-9! w-9!">
                  <CloseIcon size={14} />
                </IconButton>
                {index > 0 && (
                  <IconButton label={`Usar foto ${index + 1} como portada`} onClick={() => makeCover(index)} disabled={disabled} addStyle="h-9! w-9!">
                    <StarIcon size={14} />
                  </IconButton>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isFull && (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={[
            "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed px-4 py-6 text-center",
            isDragging ? "border-accent-sky bg-surface-soft" : "border-line hover:border-accent-lilac",
            disabled || isProcessing ? "pointer-events-none opacity-50" : "",
          ].join(" ")}
        >
          <UploadIcon size={22} />
          <Text as="span" size="body_bold">
            {isProcessing ? "Procesando fotos…" : "Sube o arrastra fotos"}
          </Text>
          <Text as="span" size="caption" variant="muted">
            {`JPG, PNG o WEBP · se optimizan a 1080×1350 · quedan ${remaining}`}
          </Text>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            multiple
            disabled={disabled || isProcessing}
            onChange={(event) => void addFiles(Array.from(event.target.files ?? []))}
            className="sr-only"
          />
        </label>
      )}
    </div>
  );
}
