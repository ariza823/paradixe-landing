import { Link } from "react-router-dom";
import Text from "@atoms/text/Text.tsx";
import { LogoMark } from "@atoms/logo/Logo.tsx";
import { ThemeToggle } from "@atoms/themeToggle/ThemeToggle.tsx";
import { IconButton } from "@atoms/iconButton/IconButton.tsx";
import { ExternalIcon, LogOutIcon } from "@atoms/icons/Icons.tsx";
import { useAuth } from "@features/auth/context/AuthContext.tsx";

export function AdminTopBar() {
  const { email, isDemo, signOut } = useAuth();

  return (
    <header className="relative top-0 z-40 border-b sm:sticky border-dashed border-line bg-surface/90 backdrop-blur-[8px]">
      {isDemo && (
        <Text size="caption" variant="none" addStyle="bg-accent-gold px-4 py-2 text-center font-bold text-surface dark:text-on-accent">
          Modo demo · los cambios se guardan solo en este navegador. Conecta Supabase para publicarlos.
        </Text>
      )}
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 lg:px-12">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex w-20 shrink-0">
            <LogoMark />
          </span>
          <div className="flex min-w-0 flex-col">
            <Text as="span" size="label_bold">
              Panel
            </Text>
            <Text as="span" size="caption" variant="muted" addStyle="truncate">
              {email ?? "Administrador demo"}
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="hidden min-h-11 items-center gap-2 rounded-full border border-line px-4 text-[12px] font-bold uppercase tracking-[2px] text-ink hover:border-accent-lilac sm:inline-flex"
          >
            Ver sitio
            <ExternalIcon size={14} />
          </Link>
          <ThemeToggle />
          <IconButton label="Cerrar sesión" onClick={() => void signOut()}>
            <LogOutIcon size={18} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
