import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudyCopy, copy, getLocale, projects, type Locale } from "../../../content";
import { getAdminProjectDetail, type AdminProjectDetail } from "../../../../lib/site-projects";
import { Arrow, Footer, Header } from "../../../site-ui";
import { KeymanLightbox } from "./keyman-lightbox";

const keymanInstagram = "https://www.instagram.com/keyman.chicago?igsh=MXFyY29taWhrdGJ6cA==";
const keymanYoutube = "https://youtube.com/@keymanchicago?si=Gyb8B3SofAMWSBj5";
const keymanWebsite = "https://keymanchicago.com/";

const keymanContent = {
  en: {
    metadataTitle: "KeyMan Chicago — Brand Case Study",
    metadataDescription: "KeyMan Chicago across identity, digital presence and practical content.",
    breadcrumb: "Work / KeyMan Chicago",
    heroLineOne: "BUILDING KEYMAN",
    heroLineTwo: "CHICAGO",
    heroAccentTwo: "FROM",
    heroAccentThree: "THE GROUND UP.",
    summary: "A connected automotive service brand built across identity, digital presence and practical content.",
    chips: ["Branding", "Vehicle Identity", "Website", "YouTube", "Content", "Social Media"],
    visit: "Visit website",
    challengeLabel: "The challenge",
    challengeTitle: "A strong local service needed a clearer, more consistent public presence.",
    challengeBody: "The brand needed to feel recognizable wherever customers discovered it — on the road, online and through practical service content.",
    approachLabel: "Our approach",
    approachTitle: "One connected system across identity, digital presence and content.",
    approachBody: "We aligned every public touchpoint around one practical idea: make the service easy to recognize, understand and trust.",
    processLabel: "The process",
    processTitle: "Ten connected stages, one recognizable public presence.",
    stages: ["Discovery", "Positioning", "Identity", "Vehicle", "Website", "Content", "YouTube", "Social", "Optimization", "Growth"],
    whatLabel: "What we did",
    cards: [
      ["Branding", "A recognizable visual language across customer-facing touchpoints."],
      ["Vehicle Identity", "A mobile brand presence designed for immediate local recognition."],
      ["Website", "A central digital destination for services, information and contact."],
      ["YouTube", "Educational automotive-key content and practical demonstrations."],
      ["Content Production", "Video-led explanations, demonstrations and service content."],
      ["Social Media", "A consistent public content presence across vertical formats."],
    ],
    reachLabel: "Current reach",
    reachTitle: "An active public presence across content and social platforms.",
    metrics: [
      ["5,355", "Instagram followers"],
      ["972", "YouTube subscribers"],
      ["23", "YouTube videos"],
      ["2,352", "Featured-video views"],
      ["6", "Connected brand touchpoints"],
    ],
    actionLabel: "Project in action",
    overviewLabel: "Project overview",
    overviewTitle: "A connected public presence built around service, expertise and trust.",
    overviewBody: "KeyMan Chicago now appears as one coherent brand across the service vehicle, website, video content and social touchpoints.",
    ctaTitle: "READY TO BUILD A SHARPER BRAND STORY?",
    ctaBody: "Let’s create a focused system that connects identity, content and digital experience.",
    ctaButton: "Book a discovery call",
  },
  ru: {
    metadataTitle: "KeyMan Chicago — кейс бренда",
    metadataDescription: "KeyMan Chicago: айдентика, цифровое присутствие и практический контент.",
    breadcrumb: "Работы / KeyMan Chicago",
    heroLineOne: "KEYMAN CHICAGO",
    heroLineTwo: "",
    heroAccentTwo: "С САМОГО",
    heroAccentThree: "НАЧАЛА.",
    summary: "Цельный бренд автомобильного сервиса, объединяющий айдентику, цифровое присутствие и практический контент.",
    chips: ["Брендинг", "Автомобиль", "Сайт", "YouTube", "Контент", "Соцсети"],
    visit: "Открыть сайт",
    challengeLabel: "Задача",
    challengeTitle: "Локальному сервису не хватало цельного присутствия.",
    challengeBody: "Бренд должен был одинаково уверенно работать в дороге, онлайн и в практическом сервисном контенте.",
    approachLabel: "Наш подход",
    approachTitle: "Единая система айдентики, цифрового присутствия и контента.",
    approachBody: "Мы объединили все публичные точки контакта вокруг одной практичной идеи: сервис можно было легко узнать, понять и выбрать.",
    processLabel: "Процесс",
    processTitle: "Десять связанных этапов — одно узнаваемое присутствие.",
    stages: ["Исследование", "Позиционирование", "Айдентика", "Автомобиль", "Сайт", "Контент", "YouTube", "Соцсети", "Оптимизация", "Рост"],
    whatLabel: "Что сделали",
    cards: [
      ["Брендинг", "Узнаваемый визуальный язык для всех клиентских точек контакта."],
      ["Дизайн автомобиля", "Мобильное присутствие бренда для быстрой локальной узнаваемости."],
      ["Сайт", "Центральная цифровая площадка для услуг, информации и контакта."],
      ["YouTube", "Образовательный контент об автоключах и практические демонстрации."],
      ["Производство контента", "Видеообъяснения, демонстрации и контент об услугах."],
      ["Социальные сети", "Последовательное присутствие бренда в вертикальных форматах."],
    ],
    reachLabel: "Текущий охват",
    reachTitle: "Активное присутствие на контентных и социальных платформах.",
    metrics: [
      ["5 355", "подписчиков Instagram"],
      ["972", "подписчика YouTube"],
      ["23", "видео на YouTube"],
      ["2 352", "просмотра выбранного видео"],
      ["6", "связанных точек бренда"],
    ],
    actionLabel: "Проект в действии",
    overviewLabel: "Обзор проекта",
    overviewTitle: "Цельное публичное присутствие, построенное вокруг сервиса, экспертизы и доверия.",
    overviewBody: "KeyMan Chicago выглядит как единый бренд на сервисном автомобиле, сайте, в видеоконтенте и социальных сетях.",
    ctaTitle: "ГОТОВЫ СОБРАТЬ БОЛЕЕ СИЛЬНУЮ ИСТОРИЮ БРЕНДА?",
    ctaBody: "Создадим сфокусированную систему, которая объединит айдентику, контент и цифровой опыт.",
    ctaButton: "Назначить встречу",
  },
  uk: {
    metadataTitle: "KeyMan Chicago — кейс бренду",
    metadataDescription: "KeyMan Chicago: айдентика, цифрова присутність і практичний контент.",
    breadcrumb: "Роботи / KeyMan Chicago",
    heroLineOne: "KEYMAN CHICAGO",
    heroLineTwo: "",
    heroAccentTwo: "ВІД САМОГО",
    heroAccentThree: "ПОЧАТКУ.",
    summary: "Цілісний бренд автомобільного сервісу, що поєднує айдентику, цифрову присутність і практичний контент.",
    chips: ["Брендинг", "Автомобіль", "Сайт", "YouTube", "Контент", "Соцмережі"],
    visit: "Відкрити сайт",
    challengeLabel: "Завдання",
    challengeTitle: "Локальному сервісу бракувало цілісної присутності.",
    challengeBody: "Бренд мав однаково впевнено працювати в дорозі, онлайн і в практичному сервісному контенті.",
    approachLabel: "Наш підхід",
    approachTitle: "Єдина система айдентики, цифрової присутності та контенту.",
    approachBody: "Ми об’єднали всі публічні точки контакту навколо однієї практичної ідеї: сервіс має бути легко впізнати, зрозуміти й обрати.",
    processLabel: "Процес",
    processTitle: "Десять пов’язаних етапів — одна впізнавана присутність.",
    stages: ["Дослідження", "Позиціонування", "Айдентика", "Автомобіль", "Сайт", "Контент", "YouTube", "Соцмережі", "Оптимізація", "Зростання"],
    whatLabel: "Що зробили",
    cards: [
      ["Брендинг", "Упізнавана візуальна мова для всіх клієнтських точок контакту."],
      ["Дизайн автомобіля", "Мобільна присутність бренду для швидкого локального впізнавання."],
      ["Сайт", "Центральний цифровий простір для послуг, інформації та контакту."],
      ["YouTube", "Освітній контент про автоключі та практичні демонстрації."],
      ["Виробництво контенту", "Відеопояснення, демонстрації та контент про послуги."],
      ["Соціальні мережі", "Послідовна присутність бренду у вертикальних форматах."],
    ],
    reachLabel: "Поточне охоплення",
    reachTitle: "Активна присутність на контентних і соціальних платформах.",
    metrics: [
      ["5 355", "підписників Instagram"],
      ["972", "підписники YouTube"],
      ["23", "відео на YouTube"],
      ["2 352", "перегляди обраного відео"],
      ["6", "пов’язаних точок бренду"],
    ],
    actionLabel: "Проєкт у дії",
    overviewLabel: "Огляд проєкту",
    overviewTitle: "Цілісна публічна присутність, побудована навколо сервісу, експертизи й довіри.",
    overviewBody: "KeyMan Chicago виглядає як єдиний бренд на сервісному автомобілі, сайті, у відеоконтенті та соціальних мережах.",
    ctaTitle: "ГОТОВІ ЗІБРАТИ СИЛЬНІШУ ІСТОРІЮ БРЕНДУ?",
    ctaBody: "Створімо сфокусовану систему, що поєднає айдентику, контент і цифровий досвід.",
    ctaButton: "Домовитися про зустріч",
  },
} as const;

const keymanWorkImages = [
  "/media/keyman/hd-shirt-clean.png",
  "/media/keyman/hd-vehicle-clean.png",
  "/media/keyman/hd-website-clean.png",
  "/media/keyman/hd-youtube-clean.png",
  "/media/keyman/hd-production-clean.png",
  "/media/keyman/hd-social-clean.png",
] as const;

const keymanGallery = [
  ["/media/keyman/keyman-hero-clean-v2.png", "KeyMan Chicago owner with the branded service van"],
  ["/media/keyman/hd-vehicle-clean.png", "Branded KeyMan Chicago service van"],
  ["/media/keyman/hd-shirt-clean.png", "KeyMan Chicago branded apparel"],
  ["/media/keyman/hd-keys-clean.png", "Automotive key handoff to a customer"],
  ["/media/keyman/hd-van-rear-clean.png", "KeyMan Chicago service van on location"],
  ["/media/keyman/key-cutting-machine.png", "Precision key-cutting equipment in action"],
  ["/media/keyman/key-programming-chip.png", "Key programming and chip diagnostics"],
  ["/media/keyman/bmw-diagnostic-screen.png", "BMW control-unit programming in progress"],
  ["/media/keyman/van-mobile-workshop.png", "Mobile workshop inside the KeyMan Chicago van"],
] as const;

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function pairs(value: unknown): [string, string][] {
  if (!Array.isArray(value)) return [];
  return value.filter((p): p is [string, string] => Array.isArray(p) && p.length === 2 && typeof p[0] === "string" && typeof p[1] === "string");
}

function strList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);

  if (slug === "samal-construction") {
    const caseCopy = caseStudyCopy[locale];
    return { title: caseCopy.metadataTitle, description: caseCopy.metadataDescription };
  }

  const adminProject = await getAdminProjectDetail(slug, locale);
  if (adminProject) {
    const title = str(adminProject.locale.title) || adminProject.slug;
    const description = str(adminProject.locale.summary) || str(adminProject.locale.services) || undefined;
    return { title, description };
  }

  if (slug === "keyman-chicago") {
    return {
      title: keymanContent[locale].metadataTitle,
      description: keymanContent[locale].metadataDescription,
    };
  }

  return {};
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const t = copy[locale];
  const caseCopy = caseStudyCopy[locale];

  // Every slug except the one legacy bespoke case study now resolves
  // through the admin panel's database first — including keyman-chicago,
  // which is auto-seeded there so it's editable from day one.
  if (slug !== "samal-construction") {
    const adminProject = await getAdminProjectDetail(slug, locale);
    if (adminProject) return <PremiumCaseStudy project={adminProject} locale={locale} />;
    if (slug === "keyman-chicago") return <KeymanCaseStudy locale={locale} />; // safety net only
  }

  if (slug === "samal-construction") {
    const project = projects.find((item) => item.slug === slug && item.published);
    if (!project?.image) notFound();

    return (
      <main className="case-page">
        <Header locale={locale} />
        <section className="case-hero">
          <Link className="back-link" href={`/${locale}/work`}>← {t.back}</Link>
          <div className="case-title">
            <p className="eyebrow">{caseCopy.label}</p>
            <h1>{project.title}</h1>
            <p className="case-subtitle">{caseCopy.subtitle}</p>
            <p className="case-summary">{caseCopy.summary}</p>
          </div>
          <div className="case-facts">
            {caseCopy.facts.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <div className="case-visual">
            <Image src={project.image} alt={caseCopy.heroAlt} fill priority loading="eager" unoptimized sizes="100vw" />
          </div>
        </section>

        <section className="case-overview">
          <p className="eyebrow">{caseCopy.overviewLabel}</p>
          <h2>{caseCopy.overviewHeading}</h2>
          <p>{caseCopy.overviewText}</p>
        </section>

        <section className="case-narrative">
          <div className="case-section"><span>01</span><h2>{caseCopy.challenge}</h2><p>{caseCopy.challengeText}</p></div>
          <div className="case-section"><span>02</span><h2>{caseCopy.approach}</h2><p>{caseCopy.approachText}</p></div>
          <div className="case-section"><span>03</span><h2>{caseCopy.deliverables}</h2><ul>{caseCopy.deliverableItems.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </section>

        <section className="case-gallery">
          <div className="case-gallery-heading"><p className="eyebrow">04</p><h2>{caseCopy.gallery}</h2></div>
          <div className="gallery-tall"><Image src="/media/real-estate.jpg" alt={caseCopy.galleryAltOne} fill unoptimized sizes="(max-width: 760px) 100vw, 42vw" /></div>
          <div className="gallery-wide"><Image src="/media/samal-house.jpg" alt={caseCopy.galleryAltTwo} fill unoptimized sizes="(max-width: 760px) 100vw, 58vw" /></div>
        </section>

        <section className="case-cta">
          <div><p className="eyebrow">{caseCopy.ctaEyebrow}</p><p>{caseCopy.ctaBody}</p></div>
          <h2>{caseCopy.ctaHeading}</h2>
          <a className="button" href={`/${locale}#contact`}>{caseCopy.ctaButton} <Arrow /></a>
        </section>
        <Footer locale={locale} />
      </main>
    );
  }

  notFound();
}

/** Premium case-study template for projects created/edited in the admin panel — reuses the same layout/CSS as the KeyMan case study, driven entirely by data. */
function PremiumCaseStudy({ project, locale }: { project: AdminProjectDetail; locale: Locale }) {
  const d = project.locale;
  const photos = project.media.filter((m) => m.type === "photo");
  const videos = project.media.filter((m) => m.type === "video");

  const title = str(d.title) || project.slug;
  const chips = strList(d.chips);
  const stages = strList(d.stages);
  const cards = pairs(d.cards);
  const metrics = pairs(d.metrics);

  const hero = photos[0];
  const beforeImg = photos[1];
  const cardImages = photos.slice(2, 2 + cards.length);
  const overviewImg = photos[2 + cards.length];
  const ctaImg = photos[photos.length - 1];
  const galleryItems: [string, string][] = photos.map((p) => [p.url, p.alt || title]);

  const visitLabel = locale === "ru" ? "Открыть сайт" : locale === "uk" ? "Відкрити сайт" : "Visit website";

  return (
    <main className="case-page keyman-page">
      <Header locale={locale} />

      <section className="keyman-hero">
        {hero && (
          <Image className="keyman-hero__image" src={hero.url} alt={hero.alt || title} fill priority loading="eager" unoptimized sizes="100vw" />
        )}
        <div className="keyman-hero__copy">
          {str(d.breadcrumb) && <p className="keyman-kicker">{str(d.breadcrumb)}</p>}
          <h1>
            <span>{str(d.heroLine1) || title}</span>
            {(str(d.heroLine2) || str(d.heroAccent2)) && (
              <span>
                {str(d.heroLine2)} {str(d.heroAccent2) && <em>{str(d.heroAccent2)}</em>}
              </span>
            )}
            {str(d.heroAccent3) && <em>{str(d.heroAccent3)}</em>}
          </h1>
          {str(d.summary) && <p className="keyman-hero__summary">{str(d.summary)}</p>}
          {chips.length > 0 && (
            <div className="keyman-hero__tags" aria-label={`${title} services`}>
              {chips.map((chip) => <span key={chip}>{chip}</span>)}
            </div>
          )}
          {(str(d.websiteUrl) || str(d.instagramUrl) || str(d.youtubeUrl)) && (
            <div className="keyman-hero__actions">
              {str(d.websiteUrl) && (
                <a className="button" href={str(d.websiteUrl)} target="_blank" rel="noreferrer">{visitLabel} <Arrow /></a>
              )}
              {str(d.instagramUrl) && <a href={str(d.instagramUrl)} target="_blank" rel="noreferrer">Instagram</a>}
              {str(d.youtubeUrl) && <a href={str(d.youtubeUrl)} target="_blank" rel="noreferrer">YouTube</a>}
            </div>
          )}
        </div>
      </section>

      {(str(d.challengeTitle) || str(d.approachTitle)) && (
        <section className="keyman-story keyman-container">
          {str(d.challengeTitle) && (
            <article className="keyman-story__challenge">
              {str(d.challengeLabel) && <p className="keyman-kicker">{str(d.challengeLabel)}</p>}
              <h2>{str(d.challengeTitle)}</h2>
              {str(d.challengeBody) && <p>{str(d.challengeBody)}</p>}
              {beforeImg && (
                <figure>
                  <Image src={beforeImg.url} alt={beforeImg.alt || title} fill unoptimized sizes="(max-width: 760px) 100vw, 260px" />
                </figure>
              )}
            </article>
          )}
          {str(d.approachTitle) && (
            <article className="keyman-story__approach">
              {str(d.approachLabel) && <p className="keyman-kicker">{str(d.approachLabel)}</p>}
              <h3>{str(d.approachTitle)}</h3>
              {str(d.approachBody) && <p className="keyman-story__approach-copy">{str(d.approachBody)}</p>}
              {stages.length > 0 && (
                <ol className="keyman-story__timeline">
                  {stages.map((stage, index) => (
                    <li key={stage}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{stage}</strong>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          )}
        </section>
      )}

      {cards.length > 0 && (
        <section className="keyman-work keyman-container">
          {str(d.whatLabel) && <p className="keyman-kicker">{str(d.whatLabel)}</p>}
          <div className="keyman-work__grid">
            {cards.map(([cardTitle, description], index) => (
              <article className="keyman-work-card" key={cardTitle}>
                {cardImages[index] && (
                  <figure><Image src={cardImages[index].url} alt="" fill unoptimized sizes="(max-width: 760px) 100vw, 17vw" /></figure>
                )}
                <div><h3>{cardTitle}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>
      )}

      {metrics.length > 0 && (
        <section className="keyman-reach keyman-container">
          <div className="keyman-reach__intro">
            {str(d.reachLabel) && <p className="keyman-kicker">{str(d.reachLabel)}</p>}
            {str(d.reachTitle) && <h2>{str(d.reachTitle)}</h2>}
          </div>
          <div className="keyman-reach__stats">
            {metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </section>
      )}

      {galleryItems.length > 0 && (
        <section className="keyman-gallery keyman-container">
          <p className="keyman-kicker">Gallery</p>
          <KeymanLightbox items={galleryItems} />
        </section>
      )}

      {videos.length > 0 && (
        <section className="case-gallery">
          <div className="case-gallery-heading"><p className="eyebrow">Video</p></div>
          {videos.map((video) => (
            <div className="gallery-wide" key={video.url}>
              <video src={video.url} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </section>
      )}

      {(str(d.overviewTitle) || str(d.ctaTitle)) && (
        <div className="keyman-closing keyman-container">
          {str(d.overviewTitle) && (
            <article className="keyman-statement">
              {str(d.overviewLabel) && <p className="keyman-kicker">{str(d.overviewLabel)}</p>}
              <div className="keyman-statement__content">
                {overviewImg && (
                  <figure><Image src={overviewImg.url} alt={overviewImg.alt || title} fill unoptimized sizes="120px" /></figure>
                )}
                <div>
                  <h2>{str(d.overviewTitle)}</h2>
                  {str(d.overviewBody) && <p>{str(d.overviewBody)}</p>}
                </div>
              </div>
            </article>
          )}
          <article className="keyman-final-cta">
            <div className="keyman-final-cta__copy">
              <h2>{str(d.ctaTitle) || title}</h2>
              {str(d.ctaBody) && <p>{str(d.ctaBody)}</p>}
              <a className="button" href={`/${locale}#contact`}>{str(d.ctaButton) || "Book a discovery call"} <Arrow /></a>
            </div>
            {ctaImg && (
              <figure><Image src={ctaImg.url} alt={ctaImg.alt || title} fill unoptimized sizes="(max-width: 760px) 100vw, 38vw" /></figure>
            )}
          </article>
        </div>
      )}

      <Footer locale={locale} />
    </main>
  );
}

function KeymanCaseStudy({ locale }: { locale: Locale }) {
  const c = keymanContent[locale];

  return (
    <main className="case-page keyman-page">
      <Header locale={locale} />
      <KeymanHero c={c} />
      <KeymanStory c={c} />
      <KeymanWork c={c} />
      <KeymanReach c={c} />
      <KeymanGallery c={c} />
      <div className="keyman-closing keyman-container">
        <KeymanProjectStatement c={c} />
        <KeymanFinalCta c={c} locale={locale} />
      </div>
      <Footer locale={locale} />
    </main>
  );
}

type KeymanCopy = (typeof keymanContent)[Locale];

function KeymanHero({ c }: { c: KeymanCopy }) {
  return (
    <section className="keyman-hero">
      <Image className="keyman-hero__image" src="/media/keyman/keyman-hero-hd.png" alt="KeyMan Chicago owner standing in front of a branded service van" fill priority loading="eager" unoptimized sizes="100vw" />
      <div className="keyman-hero__copy">
        <p className="keyman-kicker">{c.breadcrumb}</p>
        <h1><span>{c.heroLineOne}</span><span>{c.heroLineTwo} <em>{c.heroAccentTwo}</em></span><em>{c.heroAccentThree}</em></h1>
        <p className="keyman-hero__summary">{c.summary}</p>
        <div className="keyman-hero__tags" aria-label="KeyMan Chicago services">{c.chips.map((chip) => <span key={chip}>{chip}</span>)}</div>
        <div className="keyman-hero__actions">
          <a className="button" href={keymanWebsite} target="_blank" rel="noreferrer">{c.visit} <Arrow /></a>
          <a href={keymanInstagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={keymanYoutube} target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>
    </section>
  );
}

function KeymanStory({ c }: { c: KeymanCopy }) {
  return (
    <section className="keyman-story keyman-container">
      <article className="keyman-story__challenge">
        <p className="keyman-kicker">{c.challengeLabel}</p>
        <h2>{c.challengeTitle}</h2>
        <p>{c.challengeBody}</p>
        <figure>
          <Image src="/media/keyman/02_before_plain_van_2x.png" alt="Unbranded service van before the KeyMan Chicago identity system" fill unoptimized sizes="(max-width: 760px) 100vw, 260px" />
          <span>Before</span>
        </figure>
      </article>

      <article className="keyman-story__approach">
        <p className="keyman-kicker">{c.approachLabel}</p>
        <h3>{c.approachTitle}</h3>
        <p className="keyman-story__approach-copy">{c.approachBody}</p>
        <ol className="keyman-story__timeline">
          {c.stages.map((stage, index) => (
            <li key={stage}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage}</strong>
            </li>
          ))}
        </ol>
      </article>
    </section>
  );
}

function KeymanWork({ c }: { c: KeymanCopy }) {
  return (
    <section className="keyman-work keyman-container">
      <p className="keyman-kicker">{c.whatLabel}</p>
      <div className="keyman-work__grid">
        {c.cards.map(([title, description], index) => (
          <article className="keyman-work-card" key={title}>
            <figure><Image src={keymanWorkImages[index]} alt="" fill unoptimized sizes="(max-width: 760px) 100vw, 17vw" /></figure>
            <div><h3>{title}</h3><p>{description}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function KeymanReach({ c }: { c: KeymanCopy }) {
  return (
    <section className="keyman-reach keyman-container">
      <div className="keyman-reach__intro">
        <p className="keyman-kicker">{c.reachLabel}</p>
        <h2>{c.reachTitle}</h2>
      </div>
      <div className="keyman-reach__stats">
        {c.metrics.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </div>
    </section>
  );
}

function KeymanGallery({ c }: { c: KeymanCopy }) {
  return (
    <section className="keyman-gallery keyman-container">
      <p className="keyman-kicker">{c.actionLabel}</p>
      <KeymanLightbox items={keymanGallery} />
    </section>
  );
}

function KeymanProjectStatement({ c }: { c: KeymanCopy }) {
  return (
    <article className="keyman-statement">
      <p className="keyman-kicker">{c.overviewLabel}</p>
      <div className="keyman-statement__content">
        <figure><Image src="/media/keyman/09_owner_portrait_2x.png" alt="KeyMan Chicago owner" fill unoptimized sizes="120px" /></figure>
        <div><h2>{c.overviewTitle}</h2><p>{c.overviewBody}</p></div>
      </div>
    </article>
  );
}

function KeymanFinalCta({ c, locale }: { c: KeymanCopy; locale: Locale }) {
  return (
    <article className="keyman-final-cta">
      <div className="keyman-final-cta__copy">
        <h2>{c.ctaTitle}</h2>
        <p>{c.ctaBody}</p>
        <a className="button" href={`/${locale}#contact`}>{c.ctaButton} <Arrow /></a>
      </div>
      <figure><Image src="/media/keyman/15_cta_camera_2x.png" alt="Production camera in purple light" fill unoptimized sizes="(max-width: 760px) 100vw, 38vw" /></figure>
    </article>
  );
}
