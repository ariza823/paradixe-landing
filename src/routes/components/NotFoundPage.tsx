import Text from "@atoms/text/Text.tsx";
import Title from "@atoms/title/Title.tsx";
import Button from "@atoms/button/Button.tsx";
import { useDocumentTitle } from "@core/hooks/useDocumentTitle.ts";

function NotFoundPage() {
  useDocumentTitle("Página no encontrada — Paradixe Urban");

  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 pt-28 text-center">
      <Text as="span" size="label" variant="gold">
        Error 404
      </Text>
      <Title as="h1">Esta pieza no existe</Title>
      <Text variant="muted">Puede que se haya agotado o que el link esté mal.</Text>
      <Button href="/">Volver al inicio</Button>
    </section>
  );
}

export default NotFoundPage;
