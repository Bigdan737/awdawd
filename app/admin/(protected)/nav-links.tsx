"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/projects", label: "Проекты" },
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/settings", label: "Настройки" },
  { href: "/admin/account", label: "Аккаунт" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {LINKS.map((link) => {
        const isActive = link.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(link.href);
        return (
          <Link key={link.href} href={link.href} className={`admin-nav-link${isActive ? " is-active" : ""}`}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
