import { Outlet } from "react-router-dom";
import { Header } from "./header/Header.tsx";
import { Footer } from "./footer/Footer.tsx";

export function Layout() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-accent-sky focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
