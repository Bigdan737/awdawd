"use client";

import { usePathname } from "next/navigation";
import { getLocale } from "./content";
import { AiManagerWidget } from "./ai-manager-widget";

export function AiManagerMount() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  const segment = pathname?.split("/")[1] ?? "en";
  const locale = getLocale(segment);
  return <AiManagerWidget locale={locale} />;
}
