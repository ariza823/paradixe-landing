import { Link } from "react-router-dom";
import Text from "@atoms/text/Text.tsx";
import { Logo } from "@atoms/logo/Logo.tsx";
import { InstagramIcon, TikTokIcon } from "@atoms/icons/Icons.tsx";
import { config } from "@config/site.config.ts";
import { LINE_LIST } from "@config/catalog.config.ts";

export function Footer() {
  const socialLinks = [
    { href: config.social.instagram, label: `Instagram de ${config.brand.name}`, Icon: InstagramIcon },
    { href: config.social.tiktok, label: `TikTok de ${config.brand.name}`, Icon: TikTokIcon },
  ];

  return (
    <footer className="section-divider px-4 py-16 lg:px-12">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-8">
        <Logo size="footer" />

        <nav aria-label="Líneas de producto">
          <ul className="flex gap-2">
            {LINE_LIST.map((line) => (
              <li key={line.id}>
                <Link
                  to={line.path}
                  className="inline-flex min-h-11 items-center px-3 text-[13px] font-bold uppercase tracking-[2px] text-ink-muted hover:text-ink"
                >
                  {line.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-3">
          {socialLinks.map(({ href, label, Icon }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink hover:border-accent-lilac hover:text-accent-lilac"
              >
                <Icon />
              </a>
            </li>
          ))}
        </ul>

        <Text size="label" variant="muted" addStyle="text-center">
          {`© ${new Date().getFullYear()} ${config.brand.name} · ${config.brand.city}`}
        </Text>
      </div>
    </footer>
  );
}
