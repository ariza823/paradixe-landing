import { LogoMark } from "@atoms/logo/Logo.tsx";

export function PageLoader() {
  return (
    <div role="status" className="flex min-h-svh items-center justify-center">
      <span className="motion-safe:animate-pulse">
        <LogoMark />
      </span>
      <span className="sr-only">Cargando…</span>
    </div>
  );
}
