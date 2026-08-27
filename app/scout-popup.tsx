"use client";

import { useEffect, useState } from "react";
import { copy, type Locale } from "./content";
import { Arrow } from "./site-ui";

export function ScoutPopup({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const key = "produp-scout-popup-seen";
    if (sessionStorage.getItem(key)) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && scrolled / max > 0.55) {
        setVisible(true);
        sessionStorage.setItem(key, "1");
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const close = () => {
    setVisible(false);
    setDismissed(true);
  };

  if (!visible) return null;

  return (
    <div className="scout-popup" role="dialog" aria-live="polite">
      <div className="scout-popup-top">
        <span className="scout-slate" aria-hidden="true">
          <span>SCENE 04</span>
          <span>TAKE 01</span>
        </span>
        <button className="scout-close" type="button" onClick={close} aria-label={t.popupDismiss}>
          ×
        </button>
      </div>
      <p className="scout-eyebrow">{t.popupEyebrow}</p>
      <strong className="scout-title">{t.popupTitle}</strong>
      <p className="scout-body">{t.popupBody}</p>
      <a className="button button-small" href={`/${locale}#contact`} onClick={close}>
        {t.popupCta} <Arrow />
      </a>
    </div>
  );
}
