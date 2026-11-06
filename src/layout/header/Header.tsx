import { Link, NavLink } from "react-router-dom";
import Button from "@atoms/button/Button.tsx";
import { BarbedWire } from "@atoms/barbedWire/BarbedWire.tsx";
import { LogoMark } from "@atoms/logo/Logo.tsx";
import { ThemeToggle } from "@atoms/themeToggle/ThemeToggle.tsx";
import { SparkleIcon, WhatsAppIcon } from "@atoms/icons/Icons.tsx";
import { config } from "@config/site.config.ts";
import { LINE_LIST } from "@config/catalog.config.ts";
import { buildWhatsAppUrl } from "@core/utils/whatsapp.ts";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "inline-flex min-h-11 items-center rounded-full px-4 text-[13px] font-bold uppercase tracking-[2px]",
    isActive ? "-rotate-2 bg-accent-sky text-on-accent" : "text-ink-muted hover:text-ink",
  ].join(" ");

const mobileTabClasses = ({ isActive }: { isActive: boolean }) =>
  [
    "flex min-h-11 flex-1 items-center justify-center rounded-full text-[12px] font-bold uppercase tracking-[2px]",
    isActive ? "-rotate-1 bg-accent-sky text-on-accent" : "text-ink-muted",
  ].join(" ");

export function Header() {
  const contactUrl = buildWhatsAppUrl(config.whatsapp.number, config.whatsapp.contactMessage);

  return (
    <header className="relative z-50 px-4 pt-3 lg:px-12">
      <div className="chrome-frame chrome-stack mx-auto flex h-16 max-w-[1200px] items-center gap-3 rounded-full pr-2 pl-3">
        <Link
          to="/"
          aria-label={`${config.brand.name}, ir al inicio`}
          className="flex min-h-11 min-w-11 items-center justify-center"
        >
          <LogoMark />
        </Link>

        <BarbedWire addStyle="hidden h-9 min-w-0 flex-1 lg:block" />
        <span className="hidden text-accent-gold lg:block">
          <SparkleIcon size={18} />
        </span>

        <nav aria-label="Principal" className="ml-auto flex items-center gap-2">
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

      <nav aria-label="Líneas" className="chrome-frame mt-5 flex gap-1 rounded-full p-1 md:hidden">
        {LINE_LIST.map((line) => (
          <NavLink key={line.id} to={line.path} end className={mobileTabClasses}>
            {line.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
