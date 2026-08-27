import type { Metadata } from "next";
import Link from "next/link";
import {
  copy,
  getLocale,
  serviceContent,
  services,
} from "../../content";
import { Arrow, Footer, Header } from "../../site-ui";

export const metadata: Metadata = {
  title: "About",
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = getLocale(rawLocale);
  const t = copy[locale];

  return (
    <main className="about-page">
      <section className="about-hero">
        <Header locale={locale} />
        <p className="eyebrow">{t.aboutEyebrow}</p>
        <h1>{t.aboutTitle}</h1>
        <p className="about-hero-body">{t.aboutBody}</p>
      </section>

      <section className="about-stats" data-reveal>
        <p className="eyebrow">{t.aboutStatsTitle}</p>
        <div className="about-stats-row">
          <div className="hero-stat">
            <strong><span data-counter="60">0</span>+</strong>
            <small>{t.heroStatProjects}</small>
          </div>
          <div className="hero-stat">
            <strong><span data-counter="12">0</span></strong>
            <small>{t.heroStatServices}</small>
          </div>
          <div className="hero-stat">
            <strong><span data-counter="3">0</span></strong>
            <small>{t.heroStatLanguages}</small>
          </div>
        </div>
      </section>

      <section className="about-clients">
        <p className="eyebrow">{t.aboutClientsTitle}</p>
        <div className="about-clients-row">
          <strong>KEYMAN</strong>
          <strong>SAMAL CONSTRUCTION</strong>
          <strong>WORSHIPHILL</strong>
          <strong>JOEKING</strong>
        </div>
      </section>

      <section className="about-capabilities">
        <div className="about-capabilities-heading">
          <p className="eyebrow">{t.homeServicesLabel}</p>
          <h2>{t.aboutCapabilitiesTitle}</h2>
          <p>{t.aboutCapabilitiesBody}</p>
        </div>
        <ul className="about-capabilities-list">
          {services.map((service) => {
            const serviceText = serviceContent[locale][service.slug];
            return (
              <li key={service.slug}>
                <Link href={`/${locale}/services/${service.slug}`}>
                  <span>{service.number}</span>
                  <strong>{serviceText.name}</strong>
                  <Arrow />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="home-final-cta" data-scene="final">
        <p className="eyebrow">{t.sceneFinal}</p>
        <h2>{t.aboutCtaTitle}</h2>
        <a className="button" href={`/${locale}#contact`}>
          {t.aboutCtaButton} <Arrow />
        </a>
      </section>

      <Footer locale={locale} />
    </main>
  );
}
