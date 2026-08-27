import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { copy, getLocale, locales, serviceContent, services } from "../../../content";
import { Arrow, Footer, Header } from "../../../site-ui";
import { ContentServicePage } from "./content-service";

type ServicePageProps = {
  params: Promise<{ locale: string; service: string }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    services.map((service) => ({ locale, service: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { locale: rawLocale, service: serviceSlug } = await params;
  const locale = getLocale(rawLocale);
  const service = services.find((item) => item.slug === serviceSlug);

  if (!service) return {};
  const serviceText = serviceContent[locale][service.slug];

  return {
    title: serviceText.name,
    description: serviceText.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { locale: rawLocale, service: serviceSlug } = await params;
  const locale = getLocale(rawLocale);
  const service = services.find((item) => item.slug === serviceSlug);

  if (!service) notFound();

  const t = copy[locale];
  const serviceText = serviceContent[locale][service.slug];

  if (service.slug === "content") {
    return (
      <main className="content-service-page">
        <Header locale={locale} />
        <ContentServicePage locale={locale} />
        <Footer locale={locale} />
      </main>
    );
  }

  return (
    <main className="service-detail-page">
      <Header locale={locale} />
      <section className="service-detail-hero">
        <Link className="back-link" href={`/${locale}/services`}>
          ← {t.serviceBack}
        </Link>
        <div className="service-detail-number">{service.number}</div>
        <div className="service-detail-copy">
          <p className="eyebrow">{t.servicePageLabel}</p>
          <h1>{serviceText.name}</h1>
          <p>{serviceText.description}</p>
          <span>{t.serviceComing}</span>
        </div>
      </section>
      <section className="service-detail-list">
        <p className="eyebrow">{t.capabilities}</p>
        <ul>
          {serviceText.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <a className="button" href={`/${locale}#contact`}>
          {t.start} <Arrow />
        </a>
      </section>
      <Footer locale={locale} />
    </main>
  );
}
