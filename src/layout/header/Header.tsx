import { Link, NavLink } from "react-router-dom";
import Button from "@atoms/button/Button.tsx";
import { LogoMark } from "@atoms/logo/Logo.tsx";
import { ThemeToggle } from "@atoms/themeToggle/ThemeToggle.tsx";
import { WhatsAppIcon } from "@atoms/icons/Icons.tsx";
import { config } from "@config/site.config.ts";
import { LINE_LIST } from "@config/catalog.config.ts";
import { buildWhatsAppUrl } from "@core/utils/whatsapp.ts";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex min-h-11 items-center px-3 text-[13px] font-bold uppercase tracking-[2px]",
    isActive ? "text-ink underline decoration-accent-sky decoration-2 underline-offset-8" : "text-ink-muted hover:text-ink",
  ].join(" ");

const mobileTabClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "flex min-h-11 flex-1 items-center justify-center text-[12px] font-bold uppercase tracking-[2px]",
    isActive ? "bg-accent-sky text-on-accent" : "text-ink-muted",
  ].join(" ");

export function Header() {
  const contactUrl = buildWhatsAppUrl(config.whatsapp.number, config.whatsapp.contactMessage);

  return (
    <header className="relative top-0 z-50 border-b md:sticky border-dashed border-line bg-surface/85 backdrop-blur-[8px]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 lg:px-12">
        <Link
          to="/"
          aria-label={`${config.brand.name}, ir al inicio`}
          className="flex min-h-11 min-w-11 items-center justify-center"
        >
          <LogoMark />
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-2">
          <ul className="hidden items-center md:flex">
            {LINE_LIST.map((line) => (
              <li key={line.id}>
                <NavLink to={line.path} end className={navLinkClasses}>
                  {line.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Button href="#como-comprar" variant="ghost">
                Cómo comprar
              </Button>
            </li>
          </ul>
          <ThemeToggle />
          <Button href={contactUrl} external variant="whatsapp" addStyle="px-4">
            <WhatsAppIcon size={18} />
            WhatsApp
          </Button>
        </nav>
      </div>

      <nav aria-label="Líneas" className="flex border-t border-dashed border-line md:hidden">
        {LINE_LIST.map((line) => (
          <NavLink key={line.id} to={line.path} end className={mobileTabClasses}>
            {line.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
