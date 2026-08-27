import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  copy,
  getLocale,
  homeProjectServices,
  serviceContent,
  services,
} from "../content";
import { getAllProjects } from "../../lib/site-projects";
import { Arrow, Footer, Header } from "../site-ui";
import { LeadMagnetForm } from "../lead-magnet-form";
import { ScoutPopup } from "../scout-popup";
import { TimelineRail } from "../timeline-rail";
import { EditTimeline } from "../edit-timeline";

export const metadata: Metadata = {
  title: "Content that grows business",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = getLocale(rawLocale);
  const t = copy[locale];
  const allProjects = await getAllProjects(locale);
  const selectedProjects = allProjects.slice(0, 3);

  return (
    <main>
      <TimelineRail />
      <ScoutPopup locale={locale} />
      <section className="home-hero" data-scene="idea">
        <Header locale={locale} />
        <div className="hero-glow" aria-hidden="true" />
        <div className={`hero-copy locale-${locale}`}>
          <p className="eyebrow">{t.heroEyebrow}</p>
          <h1>
            {t.hero.map((line, index) => (
              <span className={index === 2 ? "accent" : ""} key={line}>
                {line}
              </span>
            ))}
          </h1>
          <p className="hero-intro">{t.intro}</p>
          <div className="hero-buttons">
            <a className="button" href={`/${locale}#contact`}>
              {t.discovery} <Arrow />
            </a>
            <Link className="button button-ghost" href={`/${locale}/work`}>
              {t.viewWork} <span className="play-dot"><Arrow /></span>
            </Link>
          </div>
        </div>

        <div className="camera-scene" aria-label="Cinematographer at work">
          <Image
            src="/media/hero-camera.jpg"
            alt="Camera operator working in a neon-lit studio"
            fill
            priority
            loading="eager"
            unoptimized
            sizes="(max-width: 760px) 100vw, 62vw"
          />
        </div>

        <div className="trusted-row">
          <span>{t.trusted}</span>
          <strong>KEYMAN</strong>
          <strong>SAMAL CONSTRUCTION</strong>
          <strong>WORSHIPHILL</strong>
          <strong>JOEKING</strong>
          <strong>+ MORE</strong>
        </div>

        <div className="hero-stats" data-reveal>
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

      <section className="home-followup home-selected" data-scene="shoot">
        <div className="section-number">
          <span className="scene-badge">{t.sceneShoot}</span>
        </div>
        <div className="selected-intro">
          <h2>{t.selected}</h2>
          <p>{t.selectedCopy}</p>
          <Link className="text-link" href={`/${locale}/work`}>
            {t.explore} <Arrow />
          </Link>
        </div>
        <div className="home-project-grid">
          {selectedProjects.map((project) => (
            <Link
              className={`home-project-card ${project.slug === "samal-construction" ? "home-project-dominant" : ""}`}
              href={project.published ? `/${locale}/work/${project.slug}` : `/${locale}/work`}
              key={project.slug}
            >
              {project.image && (
                <Image
                  src={project.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 760px) 100vw, 28vw"
                />
              )}
              {project.visual === "keyman" && (
                <div className="project-placeholder project-keyman" aria-hidden="true">
                  <span>KEYMAN</span>
                  <strong>CHI</strong>
                  <i>Studio notes / YouTube</i>
                </div>
              )}
              <div className="home-project-overlay">
                <strong>{project.title}</strong>
                <small>
                  {homeProjectServices[locale][project.slug as keyof (typeof homeProjectServices)[typeof locale]]}
                </small>
              </div>
              <span className="home-project-arrow"><Arrow /></span>
            </Link>
          ))}
        </div>
      </section>

      <EditTimeline locale={locale} projects={allProjects} />

      <section className="home-services-preview">
        <div className="home-services-heading">
          <p className="eyebrow">{t.homeServicesLabel}</p>
          <h2>{t.homeServicesTitle}</h2>
          <p>{t.homeServicesCopy}</p>
          <Link className="text-link" href={`/${locale}/services`}>
            {t.exploreServices} <Arrow />
          </Link>
        </div>
        <div className="home-services-list">
          {services.map((service) => {
            const serviceText = serviceContent[locale][service.slug];
            return (
              <Link href={`/${locale}/services/${service.slug}`} key={service.slug}>
                <Image
                  src={service.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 520px) 100vw, (max-width: 1100px) 50vw, 17vw"
                />
                <span>{service.number}</span>
                <strong>{serviceText.name}</strong>
                <Arrow />
              </Link>
            );
          })}
        </div>
      </section>

      <LeadMagnetForm locale={locale} />

      <section className="home-final-cta" data-scene="final">
        <p className="eyebrow">{t.sceneFinal}</p>
        <h2>{t.footerPrompt}</h2>
        <a className="button" href={`/${locale}#contact`}>
          {t.footerAction} <Arrow />
        </a>
      </section>
      <Footer locale={locale} />
    </main>
  );
}
