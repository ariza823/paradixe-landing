import { useRef, useState } from "react";
import Text from "@atoms/text/Text.tsx";
import { LogoMark } from "@atoms/logo/Logo.tsx";
import { ChevronLeftIcon, ChevronRightIcon } from "@atoms/icons/Icons.tsx";
import { padNumber } from "@core/utils/format.ts";

interface ProductGalleryProps {
  readonly images: string[];
  readonly name: string;
  readonly edition: number;
  readonly isSoldOut: boolean;
}

function PhotoPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 bg-surface-soft">
      <span className="opacity-30">
        <LogoMark />
      </span>
      <Text as="span" size="label_bold" variant="muted">
        Foto
      </Text>
    </div>
  );
}

function GalleryImage({ src, alt }: { readonly src: string; readonly alt: string }) {
  const [hasError, setHasError] = useState(false);
  if (hasError) return <PhotoPlaceholder />;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={1080}
      height={1350}
      onError={() => setHasError(true)}
      className="h-full w-full object-cover"
    />
  );
}

export function ProductGallery({ images, name, edition, isSoldOut }: ProductGalleryProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const total = images.length;

  const goTo = (next: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: next * track.clientWidth, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className={`group/gallery relative aspect-[4/5] overflow-hidden bg-surface-soft ${isSoldOut ? "grayscale" : ""}`}>
      {total === 0 ? (
        <PhotoPlaceholder />
      ) : (
        <ul
          ref={trackRef}
          aria-label={`Fotos de ${name}`}
          onScroll={(event) => {
            const track = event.currentTarget;
            setIndex(Math.round(track.scrollLeft / Math.max(track.clientWidth, 1)));
          }}
          className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <li key={src} className="h-full w-full shrink-0 snap-start">
              <GalleryImage src={src} alt={total > 1 ? `${name}, foto ${i + 1} de ${total}` : name} />
            </li>
          ))}
        </ul>
      )}

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
            className="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-ink opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100 disabled:hidden"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            disabled={index === total - 1}
            onClick={() => goTo(index + 1)}
            className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/85 text-ink opacity-0 group-hover/gallery:opacity-100 focus-visible:opacity-100 disabled:hidden"
          >
            <ChevronRightIcon size={18} />
          </button>
          <div aria-hidden="true" className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-1.5 rounded-full bg-surface ${i === index ? "w-5 opacity-100" : "w-1.5 opacity-60"}`}
              />
            ))}
          </div>
        </>
      )}

      <Text
        as="span"
        size="label_bold"
        variant="gold"
        addStyle="pointer-events-none absolute top-3 left-3 border border-current bg-surface px-2 py-1 tracking-[2px]"
      >
        {`N°/${padNumber(edition, 3)}`}
      </Text>

      {isSoldOut && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Text
            as="span"
            size="stamp"
            addStyle="-rotate-12 border-4 border-double border-current bg-surface/85 px-5 py-2"
          >
            Agotado
          </Text>
        </div>
      )}
    </div>
  );
}
