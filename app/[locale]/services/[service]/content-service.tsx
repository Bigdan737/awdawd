import Image from "next/image";
import Link from "next/link";
import type { Locale } from "../../../content";
import { Arrow } from "../../../site-ui";

type ContentServicePageProps = {
  locale: Locale;
};

const contentPageCopy = {
  en: {
    breadcrumb: "Capabilities / Content",
    title: ["CONTENT", "THAT CONNECTS.", "STORIES THAT SELL."],
    intro:
      "We create high-impact video and visual content that earns attention, builds trust and moves audiences to act.",
    primary: "Book a Discovery Call",
    secondary: "View Our Work",
    trusted: "Trusted by ambitious teams",
    whatLabel: "What we do",
    whatTitle: "Full-service content production.",
    featuredLabel: "Featured work",
    featuredTitle: "Content shaped around real brands.",
    viewAll: "View all projects",
    processLabel: "Our process",
    processTitle: ["A clear process.", "Powerful content."],
    proofLabel: "Production system",
    ctaTitle: "Let’s create content that grows your business.",
    ctaBody: "Tell us what you are building and we will shape the right production plan.",
    ctaButton: "Book a Discovery Call",
    ctaPoints: ["Focused discovery", "Custom production plan", "Clear deliverables"],
    services: [
      { title: "Video Production", items: ["Commercials", "Brand Films", "Corporate Videos", "Event Coverage"] },
      { title: "Video Editing", items: ["Long & Short Form", "Social Media Edits", "YouTube Videos", "Reels & Shorts"] },
      { title: "Photography", items: ["Product Photography", "Corporate Shoots", "Portraits", "Event Photography"] },
      { title: "Drone", items: ["Aerial Video", "Aerial Photography", "Real Estate", "Inspections"] },
      { title: "Podcast Production", items: ["Multi-Camera Setup", "Audio Recording", "Editing & Mixing", "Show Notes & Clips"] },
      { title: "Motion Graphics", items: ["Logo Animation", "Explainer Videos", "Social Media Motion", "Visual Effects"] },
    ],
    projects: [
      { title: "Samal Construction", meta: "Website · Brand Film · Drone", note: "Architecture presented with a cinematic digital language." },
      { title: "KeyMan Chicago", meta: "YouTube · Commercial · Social", note: "Automotive expertise translated into practical visual content." },
      { title: "Joeking Drives", meta: "YouTube · Editing · Brand Identity", note: "Automotive storytelling built for attention and retention." },
      { title: "Luxury Real Estate", meta: "Video · Drone · Content", note: "Property content designed around atmosphere and detail." },
    ],
    process: [
      ["01", "Discover", "We learn the brand, goals and audience."],
      ["02", "Plan", "We shape the concept, script and production path."],
      ["03", "Produce", "We shoot with a focused crew and clear direction."],
      ["04", "Edit & Deliver", "We refine, package and deliver content for every format."],
    ],
    proof: [
      ["6", "Production capabilities"],
      ["3", "Core languages"],
      ["1", "Connected creative partner"],
      ["360°", "From concept to delivery"],
    ],
  },
  ru: {
    breadcrumb: "Услуги / Контент",
    title: ["КОНТЕНТ,", "КОТОРЫЙ СВЯЗЫВАЕТ.", "ИСТОРИИ, КОТОРЫЕ ПРОДАЮТ."],
    intro:
      "Создаём сильный видео- и визуальный контент, который привлекает внимание, укрепляет доверие и приводит аудиторию к действию.",
    primary: "Обсудить проект",
    secondary: "Смотреть работы",
    trusted: "Нам доверяют амбициозные команды",
    whatLabel: "Что мы делаем",
    whatTitle: "Контент-продакшн полного цикла.",
    featuredLabel: "Избранные работы",
    featuredTitle: "Контент, созданный вокруг реальных брендов.",
    viewAll: "Все проекты",
    processLabel: "Наш процесс",
    processTitle: ["Понятный процесс.", "Сильный контент."],
    proofLabel: "Production-система",
    ctaTitle: "Создадим контент, который помогает бизнесу расти.",
    ctaBody: "Расскажите о задаче — мы сформируем подходящий план производства.",
    ctaButton: "Обсудить проект",
    ctaPoints: ["Фокусная встреча", "Индивидуальный production-план", "Понятные результаты"],
    services: [
      { title: "Видеопродакшн", items: ["Реклама", "Бренд-фильмы", "Корпоративные видео", "Съёмка мероприятий"] },
      { title: "Видеомонтаж", items: ["Длинные и короткие форматы", "Монтаж для соцсетей", "YouTube-видео", "Reels и Shorts"] },
      { title: "Фотография", items: ["Предметная съёмка", "Корпоративные съёмки", "Портреты", "События"] },
      { title: "Дрон", items: ["Аэросъёмка", "Фото с воздуха", "Недвижимость", "Инспекции"] },
      { title: "Подкасты", items: ["Мультикамерная съёмка", "Запись звука", "Монтаж и сведение", "Клипы и описания"] },
      { title: "Моушн-дизайн", items: ["Анимация логотипа", "Объясняющие ролики", "Моушн для соцсетей", "Визуальные эффекты"] },
    ],
    projects: [
      { title: "Samal Construction", meta: "Сайт · Бренд-видео · Дрон", note: "Архитектура, представленная в кинематографичном цифровом языке." },
      { title: "KeyMan Chicago", meta: "YouTube · Реклама · Соцсети", note: "Автомобильная экспертиза, превращённая в понятный визуальный контент." },
      { title: "Joeking Drives", meta: "YouTube · Монтаж · Айдентика", note: "Автомобильный сторителлинг для внимания и удержания." },
      { title: "Luxury Real Estate", meta: "Видео · Дрон · Контент", note: "Контент о недвижимости с акцентом на атмосферу и детали." },
    ],
    process: [
      ["01", "Погружение", "Изучаем бренд, задачи и аудиторию."],
      ["02", "План", "Формируем идею, сценарий и production-маршрут."],
      ["03", "Производство", "Снимаем сфокусированной командой с ясной режиссурой."],
      ["04", "Монтаж и сдача", "Дорабатываем и подготавливаем контент под нужные форматы."],
    ],
    proof: [
      ["6", "Production-направлений"],
      ["3", "Основных языка"],
      ["1", "Единый креативный партнёр"],
      ["360°", "От идеи до публикации"],
    ],
  },
  uk: {
    breadcrumb: "Послуги / Контент",
    title: ["КОНТЕНТ,", "ЩО ОБ’ЄДНУЄ.", "ІСТОРІЇ, ЩО ПРОДАЮТЬ."],
    intro:
      "Створюємо сильний відео- та візуальний контент, який привертає увагу, формує довіру та спонукає аудиторію до дії.",
    primary: "Обговорити проєкт",
    secondary: "Дивитися роботи",
    trusted: "Нам довіряють амбітні команди",
    whatLabel: "Що ми робимо",
    whatTitle: "Контент-продакшн повного циклу.",
    featuredLabel: "Вибрані роботи",
    featuredTitle: "Контент, створений навколо реальних брендів.",
    viewAll: "Усі проєкти",
    processLabel: "Наш процес",
    processTitle: ["Зрозумілий процес.", "Сильний контент."],
    proofLabel: "Production-система",
    ctaTitle: "Створімо контент, який допомагає бізнесу зростати.",
    ctaBody: "Розкажіть про завдання — ми сформуємо відповідний виробничий план.",
    ctaButton: "Обговорити проєкт",
    ctaPoints: ["Фокусна зустріч", "Індивідуальний production-план", "Зрозумілі результати"],
    services: [
      { title: "Відеопродакшн", items: ["Реклама", "Бренд-фільми", "Корпоративні відео", "Зйомка подій"] },
      { title: "Відеомонтаж", items: ["Довгі та короткі формати", "Монтаж для соцмереж", "YouTube-відео", "Reels і Shorts"] },
      { title: "Фотографія", items: ["Предметна зйомка", "Корпоративні зйомки", "Портрети", "Події"] },
      { title: "Дрон", items: ["Аерозйомка", "Фото з повітря", "Нерухомість", "Інспекції"] },
      { title: "Подкасти", items: ["Мультикамерна зйомка", "Запис звуку", "Монтаж і зведення", "Кліпи та описи"] },
      { title: "Моушн-дизайн", items: ["Анімація логотипа", "Пояснювальні ролики", "Моушн для соцмереж", "Візуальні ефекти"] },
    ],
    projects: [
      { title: "Samal Construction", meta: "Сайт · Бренд-відео · Дрон", note: "Архітектура, представлена кінематографічною цифровою мовою." },
      { title: "KeyMan Chicago", meta: "YouTube · Реклама · Соцмережі", note: "Автомобільна експертиза, перетворена на зрозумілий візуальний контент." },
      { title: "Joeking Drives", meta: "YouTube · Монтаж · Айдентика", note: "Автомобільний сторітелінг для уваги та утримання." },
      { title: "Luxury Real Estate", meta: "Відео · Дрон · Контент", note: "Контент про нерухомість з акцентом на атмосферу та деталі." },
    ],
    process: [
      ["01", "Занурення", "Вивчаємо бренд, завдання та аудиторію."],
      ["02", "План", "Формуємо ідею, сценарій і production-маршрут."],
      ["03", "Виробництво", "Знімаємо сфокусованою командою з чіткою режисурою."],
      ["04", "Монтаж і здача", "Допрацьовуємо та готуємо контент під потрібні формати."],
    ],
    proof: [
      ["6", "Production-напрямів"],
      ["3", "Основні мови"],
      ["1", "Єдиний креативний партнер"],
      ["360°", "Від ідеї до публікації"],
    ],
  },
} as const;

const serviceImages = [
  "/media/service-content.jpg",
  "/media/keyman/hd-youtube-clean.png",
  "/media/product.jpg",
  "/media/real-estate.jpg",
  "/media/podcast.jpg",
  "/media/ai.jpg",
] as const;

const projectImages = [
  "/media/samal-house.jpg",
  "/media/keyman/keyman-hero-clean-v2.png",
  "/media/car.jpg",
  "/media/real-estate.jpg",
] as const;

export function ContentServicePage({ locale }: ContentServicePageProps) {
  const t = contentPageCopy[locale];

  return (
    <>
      <section className="content-service-hero">
        <Image
          className="content-service-hero__image"
          src="/media/content-production-hero.png"
          alt="Camera operator filming in a dark neon production studio"
          fill
          priority
          sizes="100vw"
        />
        <div className="content-service-hero__shade" />
        <div className="content-service-container content-service-hero__inner">
          <p className="content-service-kicker">{t.breadcrumb}</p>
          <h1>
            <span>{t.title[0]}</span>
            <span>{t.title[1]}</span>
            <span>{t.title[2]}</span>
          </h1>
          <p className="content-service-hero__intro">{t.intro}</p>
          <div className="content-service-actions">
            <a className="button" href={`/${locale}#contact`}>
              {t.primary} <Arrow />
            </a>
            <Link className="content-service-secondary" href={`/${locale}/work`}>
              {t.secondary} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="content-service-trusted">
            <p>{t.trusted}</p>
            <div>
              <span>KEYMAN<br /><small>CHICAGO</small></span>
              <span>SAMAL<br /><small>CONSTRUCTION</small></span>
              <span>WORSHIPHILL<br /><small>CHURCH</small></span>
              <span>JOEKING<br /><small>DRIVES</small></span>
              <span>+ MORE</span>
            </div>
          </div>
        </div>
      </section>

      <div className="content-service-container content-service-body">
        <section className="content-service-section">
          <header className="content-service-heading">
            <p className="content-service-kicker">{t.whatLabel}</p>
            <h2>{t.whatTitle}</h2>
          </header>
          <div className="content-service-grid">
            {t.services.map((service, index) => (
              <article className="content-service-card" key={service.title}>
                <Image
                  src={serviceImages[index]!}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                />
                <div className="content-service-card__overlay" />
                <div className="content-service-card__copy">
                  <span className="content-service-card__icon" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{service.title}</h3>
                  <ul>
                    {service.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <span className="content-service-card__arrow" aria-hidden="true">↗</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="content-service-section content-service-featured">
          <header className="content-service-heading content-service-heading--row">
            <div>
              <p className="content-service-kicker">{t.featuredLabel}</p>
              <h2>{t.featuredTitle}</h2>
            </div>
            <Link href={`/${locale}/work`}>{t.viewAll} <Arrow /></Link>
          </header>
          <div className="content-service-projects">
            {t.projects.map((project, index) => (
              <Link
                className="content-service-project"
                href={index === 0 ? `/${locale}/work/samal-construction` : index === 1 ? `/${locale}/work/keyman-chicago` : `/${locale}/work`}
                key={project.title}
              >
                <figure>
                  <Image src={projectImages[index]!} alt="" fill sizes="(max-width: 760px) 100vw, 25vw" />
                </figure>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.meta}</p>
                  <span>{project.note}</span>
                </div>
                <i aria-hidden="true">↗</i>
              </Link>
            ))}
          </div>
        </section>

        <section className="content-service-process">
          <div className="content-service-process__intro">
            <p className="content-service-kicker">{t.processLabel}</p>
            <h2>{t.processTitle[0]}<br />{t.processTitle[1]}</h2>
          </div>
          <ol>
            {t.process.map(([number, title, description]) => (
              <li key={number}>
                <div><span>{number}</span><i aria-hidden="true">→</i></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="content-service-proof" aria-label={t.proofLabel}>
          {t.proof.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className="content-service-logos">
          <p>{t.trusted}</p>
          <div>
            <span>KEYMAN <small>CHICAGO</small></span>
            <span>SAMAL <small>CONSTRUCTION</small></span>
            <span>WORSHIPHILL <small>CHURCH</small></span>
            <span>JOEKING <small>DRIVES</small></span>
            <span>CONTAINER <small>BEAST</small></span>
            <span>DENTAL <small>ARTS</small></span>
          </div>
        </section>

        <section className="content-service-cta">
          <Image src="/media/keyman/15_cta_camera_2x.png" alt="" fill sizes="100vw" />
          <div className="content-service-cta__shade" />
          <div className="content-service-cta__copy">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaBody}</p>
          </div>
          <div className="content-service-cta__action">
            <a className="button" href={`/${locale}#contact`}>{t.ctaButton} <Arrow /></a>
            <ul>
              {t.ctaPoints.map((point) => <li key={point}>✓ {point}</li>)}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
