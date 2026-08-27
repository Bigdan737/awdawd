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

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  if (slug === "keyman-chicago") {
    return {
      title: keymanContent[locale].metadataTitle,
      description: keymanContent[locale].metadataDescription,
    };
  }
  if (slug === "samal-construction") {
    const caseCopy = caseStudyCopy[locale];
    return { title: caseCopy.metadataTitle, description: caseCopy.metadataDescription };
  }
  const adminProject = await getAdminProjectDetail(slug, locale);
  if (adminProject) {
    return { title: adminProject.title, description: adminProject.services || undefined };
  }
  return {};
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = getLocale(rawLocale);
  const t = copy[locale];
  const caseCopy = caseStudyCopy[locale];

  if (slug === "keyman-chicago") return <KeymanCaseStudy locale={locale} />;

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

  // Any other slug: look it up among projects created in the admin panel.
  const adminProject = await getAdminProjectDetail(slug, locale);
  if (!adminProject) notFound();

  return <AdminCaseStudy project={adminProject} locale={locale} />;
}

/** Generic case-study template for projects created/edited in the admin panel. */
function AdminCaseStudy({ project, locale }: { project: AdminProjectDetail; locale: Locale }) {
  const t = copy[locale];
  const photos = project.media.filter((m) => m.type === "photo");
  const videos = project.media.filter((m) => m.type === "video");
  const hero = photos[0];

  return (
    <main className="case-page">
      <Header locale={locale} />
      <section className="case-hero">
        <Link className="back-link" href={`/${locale}/work`}>← {t.back}</Link>
        <div className="case-title">
          <p className="eyebrow">{t.workTitle}</p>
          <h1>{project.title}</h1>
          {project.services && <p className="case-subtitle">{project.services}</p>}
        </div>
        {hero && (
          <div className="case-visual">
            <Image src={hero.url} alt={hero.alt || project.title} fill priority loading="eager" unoptimized sizes="100vw" />
          </div>
        )}
      </section>

      {(project.challenge || project.approach) && (
        <section className="case-narrative">
          {project.challenge && (
            <div className="case-section"><span>01</span><h2>{project.challenge}</h2></div>
          )}
          {project.approach && (
            <div className="case-section"><span>02</span><h2>{project.approach}</h2></div>
          )}
        </section>
      )}

      {photos.length > 1 && (
        <section className="case-gallery">
          <div className="case-gallery-heading"><p className="eyebrow">03</p><h2>Gallery</h2></div>
          {photos.slice(1).map((photo, i) => (
            <div className={i % 2 === 0 ? "gallery-wide" : "gallery-tall"} key={photo.url}>
              <Image src={photo.url} alt={photo.alt || project.title} fill unoptimized sizes="(max-width: 760px) 100vw, 58vw" />
            </div>
          ))}
        </section>
      )}

      {videos.length > 0 && (
        <section className="case-gallery">
          <div className="case-gallery-heading"><p className="eyebrow">04</p><h2>Video</h2></div>
          {videos.map((video) => (
            <div className="gallery-wide" key={video.url}>
              <video src={video.url} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </section>
      )}

      <section className="case-cta">
        <h2>{t.selected}</h2>
        <a className="button" href={`/${locale}#contact`}>{t.explore} <Arrow /></a>
      </section>
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
