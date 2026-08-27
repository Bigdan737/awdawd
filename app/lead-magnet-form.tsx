"use client";

import { useState, type FormEvent } from "react";
import { copy, type Locale } from "./content";
import { Arrow } from "./site-ui";

export function LeadMagnetForm({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sent");
  };

  return (
    <section className="lead-magnet" data-reveal id="showreel">
      <div className="lead-magnet-copy">
        <p className="eyebrow">{t.leadMagnetEyebrow}</p>
        <h2>{t.leadMagnetTitle}</h2>
        <p className="lead-magnet-body">{t.leadMagnetBody}</p>
        <div className="lead-magnet-timer">
          <span className="timer-dot" aria-hidden="true" />
          {t.leadMagnetTimer}
        </div>
      </div>

      {status === "idle" ? (
        <form className="lead-magnet-form" onSubmit={onSubmit}>
          <div className="field">
            <input
              className="lead-magnet-input"
              type="text"
              name="name"
              placeholder=" "
              required
            />
            <label>{t.leadMagnetNamePlaceholder}</label>
          </div>
          <div className="field">
            <input
              className="lead-magnet-input"
              type="text"
              name="contact"
              placeholder=" "
              required
            />
            <label>{t.leadMagnetContactPlaceholder}</label>
          </div>
          <button className="button" type="submit">
            {t.leadMagnetSubmit} <Arrow />
          </button>
        </form>
      ) : (
        <div className="lead-magnet-success">
          <span className="success-check" aria-hidden="true" />
          {t.leadMagnetSuccess}
        </div>
      )}
    </section>
  );
}
