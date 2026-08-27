import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { copy, getLocale, serviceContent, services } from "../../content";
import { Arrow, Footer, Header } from "../../site-ui";

export const metadata: Metadata = {
  title: "Services",
  description: "Six focused PRODUP practices across AI, content, web, marketing, branding and YouTube.",
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = getLocale(rawLocale);
  const t = copy[locale];

  return (
    <main className="services-page">
      <section className="services-hero">
        <Header locale={locale} />
        <div className="services-hero-copy">
          <p className="eyebrow">{t.servicesEyebrow}</p>
          <h1>{t.servicesTitle}</h1>
          <p>{t.servicesIntro}</p>
          <small>{t.servicesNote}</small>
        </div>
        <div className="services-hero-image services-reel" aria-hidden="true">
          <div className="reel-orbit reel-orbit-one" />
          <div className="reel-orbit reel-orbit-two" />
          <div className="reel-core">06</div>
          <span>Focused practices</span>
        </div>
        <div className="scroll-note">{t.servicesScroll} <span>↓</span></div>
      </section>

      <aside className="service-index" aria-label="Service chapters">
        {services.map((service) => (
          <Link key={service.number} href={`/${locale}/services/${service.slug}`}>
            {service.number}
          </Link>
        ))}
      </aside>

      <div className="service-chapters">
        {services.map((service) => {
          const serviceText = serviceContent[locale][service.slug];
          return (
            <Link
              className="service-chapter"
              href={`/${locale}/services/${service.slug}`}
              id={`service-${service.number}`}
              key={service.number}
              aria-label={`${t.serviceExplore}: ${serviceText.name}`}
            >
              <div className="service-number">{service.number}</div>
              <div className="service-copy">
                <h2>{serviceText.name}</h2>
                <p>{serviceText.description}</p>
                <ul>
                  {serviceText.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="service-action">
                  {t.serviceExplore} <Arrow />
                </span>
              </div>
              <div className="service-image">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 760px) 28vw, 42vw"
                />
              </div>
              <span className="service-row-arrow"><Arrow /></span>
            </Link>
          );
        })}
      </div>

      <section className="services-cta">
        <p>{t.servicesCtaLabel}</p>
        <h2>{t.servicesCtaTitle}</h2>
        <a className="button" href={`/${locale}#contact`}>
          {t.start} <Arrow />
        </a>
      </section>
      <Footer locale={locale} />
    </main>
  );
}
