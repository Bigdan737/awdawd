"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { copy, type Locale } from "./content";

function BrandMark({ footer = false }: { footer?: boolean }) {
  return (
    <Image
      className={footer ? "footer-logo-image" : "brand-logo-image"}
      src="/media/produp-logo.png"
      alt="PRODUP"
      width={1200}
      height={264}
      priority
    />
  );
}

export function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasMenuOpenRef = useRef(false);
  const t = copy[locale];

  const localizedPath = (nextLocale: Locale) => {
    const parts = pathname.split("/");
    parts[1] = nextLocale;
    return parts.join("/") || `/${nextLocale}`;
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    wasMenuOpenRef.current = true;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("menu-open");
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("aria-disabled"));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.classList.remove("menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && wasMenuOpenRef.current) {
      wasMenuOpenRef.current = false;
      const frame = window.requestAnimationFrame(() => triggerRef.current?.focus());
      return () => window.cancelAnimationFrame(frame);
    }
  }, [menuOpen]);

  return (
    <header className="site-header">
      <Link className="brand" href={`/${locale}`} aria-label="PRODUP home">
        <BrandMark />
        <small>AI · Content · Marketing</small>
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen(true)}
        ref={triggerRef}
      >
        {t.menu}
      </button>

      <nav className="main-nav" aria-label="Primary navigation">
        <Link className={pathname.includes("/work") ? "active" : ""} href={`/${locale}/work`}>
          {t.nav.work}
        </Link>
        <Link className={pathname.includes("/services") ? "active" : ""} href={`/${locale}/services`}>
          {t.nav.services}
        </Link>
        <Link className={pathname.includes("/about") ? "active" : ""} href={`/${locale}/about`}>
          {t.nav.about}
        </Link>
        <span className="nav-soon" aria-disabled="true">{t.nav.insights}</span>
        <Link href={`/${locale}#contact`}>{t.nav.contact}</Link>
      </nav>

      <div className="header-actions">
        <div className="language-switcher" aria-label="Language">
          {(["en", "ru", "uk"] as Locale[]).map((item) => (
            <Link
              className={item === locale ? "active" : ""}
              href={localizedPath(item)}
              key={item}
              hrefLang={item}
            >
              {item.toUpperCase()}
            </Link>
          ))}
        </div>
        <a className="button button-small" href={`/${locale}#contact`}>
          {t.call}
          <Arrow />
        </a>
      </div>

      {menuOpen && (
        <div
          className="mobile-menu is-open"
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          ref={menuRef}
        >
          <div className="mobile-menu-top">
            <Link className="brand" href={`/${locale}`} onClick={closeMenu} aria-label="PRODUP home">
              <BrandMark />
              <small>AI · Content · Marketing</small>
            </Link>
            <button className="menu-close" type="button" onClick={closeMenu} ref={closeRef} autoFocus>
              {t.close} <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav className="mobile-menu-nav" aria-label="Mobile navigation">
            <Link className={pathname.includes("/work") ? "active" : ""} href={`/${locale}/work`} onClick={closeMenu}>
              {t.nav.work}
            </Link>
            <Link className={pathname.includes("/services") ? "active" : ""} href={`/${locale}/services`} onClick={closeMenu}>
              {t.nav.services}
            </Link>
            <Link className={pathname.includes("/about") ? "active" : ""} href={`/${locale}/about`} onClick={closeMenu}>
              {t.nav.about}
            </Link>
            <span aria-disabled="true">{t.nav.insights}</span>
            <Link href={`/${locale}#contact`} onClick={closeMenu}>{t.nav.contact}</Link>
          </nav>

          <div className="mobile-menu-bottom">
            <a className="button mobile-menu-cta" href={`/${locale}#contact`} onClick={closeMenu}>
              {t.call} <Arrow />
            </a>
            <div className="mobile-languages" aria-label="Language">
              {(["en", "ru", "uk"] as Locale[]).map((item) => (
                <Link
                  className={item === locale ? "active" : ""}
                  href={localizedPath(item)}
                  key={item}
                  hrefLang={item}
                  onClick={closeMenu}
                >
                  {item.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const pathname = usePathname();
  const localizedPath = (nextLocale: Locale) => {
    const parts = pathname.split("/");
    parts[1] = nextLocale;
    return parts.join("/") || `/${nextLocale}`;
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-intro">
        <div className="footer-mark"><BrandMark footer /></div>
        <p>{t.footer}</p>
      </div>
      <div className="footer-cta">
        <p>{t.footerPrompt}</p>
        <a className="footer-contact" href={`/${locale}#contact`}>
          {t.footerAction} <Arrow />
        </a>
      </div>
      <nav className="footer-nav" aria-label="Footer navigation">
        <Link href={`/${locale}`}>{t.home}</Link>
        <Link href={`/${locale}/work`}>{t.nav.work}</Link>
        <Link href={`/${locale}/services`}>{t.nav.services}</Link>
        <Link href={`/${locale}/about`}>{t.nav.about}</Link>
        <span>{t.nav.insights}</span>
        <Link href={`/${locale}#contact`}>{t.nav.contact}</Link>
      </nav>
      <div className="footer-languages" aria-label="Language">
        {(["en", "ru", "uk"] as Locale[]).map((item) => (
          <Link
            className={item === locale ? "active" : ""}
            href={localizedPath(item)}
            hrefLang={item}
            key={item}
          >
            {item.toUpperCase()}
          </Link>
        ))}
      </div>
      <small>© {new Date().getFullYear()} PRODUP. {t.copyright}</small>
    </footer>
  );
}

export function Arrow() {
  return <span className="arrow-icon" aria-hidden="true" />;
}
