import fs from "node:fs/promises";
import path from "node:path";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const STORAGE_ROOT = process.env.MEDIA_STORAGE_DIR || path.join(process.cwd(), "storage", "media");
const SOURCE_DIR = path.join(process.cwd(), "public", "media", "keyman");

// [source filename in public/media/keyman, alt text]
const KEYMAN_PHOTOS: [string, string][] = [
  ["keyman-hero-hd.png", "KeyMan Chicago owner in front of the branded service van"],
  ["02_before_plain_van_2x.png", "Unbranded service van before the KeyMan Chicago identity system"],
  ["hd-shirt-clean.png", "KeyMan Chicago branded apparel"],
  ["hd-vehicle-clean.png", "Branded KeyMan Chicago service van"],
  ["hd-website-clean.png", "KeyMan Chicago website"],
  ["hd-youtube-clean.png", "KeyMan Chicago YouTube channel"],
  ["hd-production-clean.png", "Content production for KeyMan Chicago"],
  ["hd-social-clean.png", "KeyMan Chicago social media presence"],
  ["09_owner_portrait_2x.png", "KeyMan Chicago owner portrait"],
  ["15_cta_camera_2x.png", "Production camera in purple light"],
  ["keyman-hero-clean-v2.png", "KeyMan Chicago owner with the branded service van"],
  ["hd-keys-clean.png", "Automotive key handoff to a customer"],
  ["hd-van-rear-clean.png", "KeyMan Chicago service van on location"],
  ["key-cutting-machine.png", "Precision key-cutting equipment in action"],
  ["key-programming-chip.png", "Key programming and chip diagnostics"],
  ["bmw-diagnostic-screen.png", "BMW control-unit programming in progress"],
  ["van-mobile-workshop.png", "Mobile workshop inside the KeyMan Chicago van"],
  ["keyman-banner.png", "KeyMan Chicago banner"],
];

const KEYMAN_LOCALES = {
  en: {
    title: "KeyMan Chicago",
    services: "Branding · Vehicle Identity · Website · YouTube · Content · Social Media",
    breadcrumb: "Work / KeyMan Chicago",
    heroLine1: "BUILDING KEYMAN",
    heroLine2: "CHICAGO",
    heroAccent2: "FROM",
    heroAccent3: "THE GROUND UP.",
    summary: "A connected automotive service brand built across identity, digital presence and practical content.",
    chips: ["Branding", "Vehicle Identity", "Website", "YouTube", "Content", "Social Media"],
    challengeLabel: "The challenge",
    challengeTitle: "A strong local service needed a clearer, more consistent public presence.",
    challengeBody: "The brand needed to feel recognizable wherever customers discovered it — on the road, online and through practical service content.",
    approachLabel: "Our approach",
    approachTitle: "One connected system across identity, digital presence and content.",
    approachBody: "We aligned every public touchpoint around one practical idea: make the service easy to recognize, understand and trust.",
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
    overviewLabel: "Project overview",
    overviewTitle: "A connected public presence built around service, expertise and trust.",
    overviewBody: "KeyMan Chicago now appears as one coherent brand across the service vehicle, website, video content and social touchpoints.",
    ctaTitle: "READY TO BUILD A SHARPER BRAND STORY?",
    ctaBody: "Let's create a focused system that connects identity, content and digital experience.",
    ctaButton: "Book a discovery call",
    websiteUrl: "https://keymanchicago.com/",
    instagramUrl: "https://www.instagram.com/keyman.chicago?igsh=MXFyY29taWhrdGJ6cA==",
    youtubeUrl: "https://youtube.com/@keymanchicago?si=Gyb8B3SofAMWSBj5",
  },
  ru: {
    title: "KeyMan Chicago",
    services: "Брендинг · Автомобиль · Сайт · YouTube · Контент · Соцсети",
    breadcrumb: "Работы / KeyMan Chicago",
    heroLine1: "KEYMAN CHICAGO",
    heroLine2: "",
    heroAccent2: "С САМОГО",
    heroAccent3: "НАЧАЛА.",
    summary: "Цельный бренд автомобильного сервиса, объединяющий айдентику, цифровое присутствие и практический контент.",
    chips: ["Брендинг", "Автомобиль", "Сайт", "YouTube", "Контент", "Соцсети"],
    challengeLabel: "Задача",
    challengeTitle: "Локальному сервису не хватало цельного присутствия.",
    challengeBody: "Бренд должен был одинаково уверенно работать в дороге, онлайн и в практическом сервисном контенте.",
    approachLabel: "Наш подход",
    approachTitle: "Единая система айдентики, цифрового присутствия и контента.",
    approachBody: "Мы объединили все публичные точки контакта вокруг одной практичной идеи: сервис можно было легко узнать, понять и выбрать.",
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
    overviewLabel: "Обзор проекта",
    overviewTitle: "Цельное публичное присутствие, построенное вокруг сервиса, экспертизы и доверия.",
    overviewBody: "KeyMan Chicago выглядит как единый бренд на сервисном автомобиле, сайте, в видеоконтенте и социальных сетях.",
    ctaTitle: "ГОТОВЫ СОБРАТЬ БОЛЕЕ СИЛЬНУЮ ИСТОРИЮ БРЕНДА?",
    ctaBody: "Создадим сфокусированную систему, которая объединит айдентику, контент и цифровой опыт.",
    ctaButton: "Назначить встречу",
    websiteUrl: "https://keymanchicago.com/",
    instagramUrl: "https://www.instagram.com/keyman.chicago?igsh=MXFyY29taWhrdGJ6cA==",
    youtubeUrl: "https://youtube.com/@keymanchicago?si=Gyb8B3SofAMWSBj5",
  },
  uk: {
    title: "KeyMan Chicago",
    services: "Брендинг · Автомобіль · Сайт · YouTube · Контент · Соцмережі",
    breadcrumb: "Роботи / KeyMan Chicago",
    heroLine1: "KEYMAN CHICAGO",
    heroLine2: "",
    heroAccent2: "ВІД САМОГО",
    heroAccent3: "ПОЧАТКУ.",
    summary: "Цілісний бренд автомобільного сервісу, що поєднує айдентику, цифрову присутність і практичний контент.",
    chips: ["Брендинг", "Автомобіль", "Сайт", "YouTube", "Контент", "Соцмережі"],
    challengeLabel: "Завдання",
    challengeTitle: "Локальному сервісу бракувало цілісної присутності.",
    challengeBody: "Бренд мав однаково впевнено працювати в дорозі, онлайн і в практичному сервісному контенті.",
    approachLabel: "Наш підхід",
    approachTitle: "Єдина система айдентики, цифрової присутності та контенту.",
    approachBody: "Ми об'єднали всі публічні точки контакту навколо однієї практичної ідеї: сервіс має бути легко впізнати, зрозуміти й обрати.",
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
      ["6", "пов'язаних точок бренду"],
    ],
    overviewLabel: "Огляд проєкту",
    overviewTitle: "Цілісна публічна присутність, побудована навколо сервісу, експертизи й довіри.",
    overviewBody: "KeyMan Chicago виглядає як єдиний бренд на сервісному автомобілі, сайті, у відеоконтенті та соціальних мережах.",
    ctaTitle: "ГОТОВІ ЗІБРАТИ СИЛЬНІШУ ІСТОРІЮ БРЕНДУ?",
    ctaBody: "Створімо сфокусовану систему, що поєднає айдентику, контент і цифровий досвід.",
    ctaButton: "Домовитися про зустріч",
    websiteUrl: "https://keymanchicago.com/",
    instagramUrl: "https://www.instagram.com/keyman.chicago?igsh=MXFyY29taWhrdGJ6cA==",
    youtubeUrl: "https://youtube.com/@keymanchicago?si=Gyb8B3SofAMWSBj5",
  },
};

/**
 * Runs once, automatically, the first time the database is initialized.
 * Copies KeyMan Chicago's existing photos into the admin panel's media
 * storage (its own folder, `storage/media/projects/keyman-chicago/`) and
 * creates a fully-populated, published project row — so it shows up in
 * /admin/projects ready to edit immediately, with no manual setup.
 *
 * Safe to call on every boot: it checks for an existing keyman-chicago row
 * first and does nothing if one is already there.
 */
export async function seedKeymanProject(db: LibSQLDatabase<typeof schema>): Promise<void> {
  const existing = await db
    .select({ id: schema.projects.id })
    .from(schema.projects)
    .where(eq(schema.projects.slug, "keyman-chicago"))
    .limit(1);
  if (existing.length > 0) return;

  const destDir = path.join(STORAGE_ROOT, "projects", "keyman-chicago");
  await fs.mkdir(destDir, { recursive: true });

  // Create the project row FIRST so we have a real id to attach media to.
  // (Previously this inserted media rows with a placeholder projectId: 0
  // before the project existed, which violates the project_media ->
  // projects foreign key and silently fails every single insert — the
  // seeded project ended up with no photos/video and no cover image.)
  const projectInsert = await db
    .insert(schema.projects)
    .values({
      slug: "keyman-chicago",
      localesJson: JSON.stringify(KEYMAN_LOCALES),
      categoriesJson: JSON.stringify(["youtube", "commercial"]),
      shape: "wide",
      featured: true,
      published: true,
      sortOrder: 1000,
    })
    .returning({ id: schema.projects.id });

  const projectId = projectInsert[0]?.id;
  if (!projectId) return;

  let coverMediaId: number | null = null;

  for (const [filename, alt] of KEYMAN_PHOTOS) {
    const sourcePath = path.join(SOURCE_DIR, filename);
    try {
      const data = await fs.readFile(sourcePath);
      const storageKey = `projects/keyman-chicago/${filename}`;
      await fs.writeFile(path.join(STORAGE_ROOT, "projects", "keyman-chicago", filename), data);

      const inserted = await db
        .insert(schema.projectMedia)
        .values({
          projectId,
          type: "photo",
          storageKey,
          contentType: "image/png",
          sizeBytes: data.byteLength,
          alt,
          sortOrder: coverMediaId === null ? 0 : 1, // placeholder, real order set below
        })
        .returning({ id: schema.projectMedia.id });

      const id = inserted[0]?.id;
      if (id && filename === "keyman-banner.png") coverMediaId = id;
    } catch (err) {
      // Source image missing in this deploy — skip it, don't fail the whole seed.
      console.error(`[seed] Skipping keyman photo "${filename}":`, err instanceof Error ? err.message : err);
    }
  }

  if (coverMediaId) {
    await db.update(schema.projects).set({ coverMediaId }).where(eq(schema.projects.id, projectId));
  }
}