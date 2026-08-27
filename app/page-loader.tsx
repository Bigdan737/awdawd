"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageLoader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("produp-loader-seen")) {
      setHidden(true);
      setDone(true);
      return;
    }
    sessionStorage.setItem("produp-loader-seen", "1");

    const hideTimer = window.setTimeout(() => setHidden(true), 1400);
    const doneTimer = window.setTimeout(() => setDone(true), 1900);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null;
  if (done) return null;

  return (
    <div className={`page-loader ${hidden ? "is-hidden" : ""}`} aria-hidden="true">
      <div className="page-loader-mark">
        <span className="page-loader-bar" />
        <span className="page-loader-word">PRODUP</span>
      </div>
    </div>
  );
}
