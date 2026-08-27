export const locales = ["en", "ru", "uk"] as const;
export type Locale = (typeof locales)[number];

export function getLocale(value: string): Locale {
  return locales.includes(value as Locale) ? (value as Locale) : "en";
}

export const copy = {
  en: {
    nav: { work: "Work", services: "Services", about: "About", insights: "Insights", contact: "Contact" },
    home: "Home",
    menu: "Menu",
    close: "Close",
    call: "Book a Call",
    heroEyebrow: "Independent creative production studio",
    hero: ["CONTENT", "THAT GROWS", "BUSINESS."],
    intro:
      "We combine creativity, AI and strategy to build powerful content that attracts, engages and converts.",
    discovery: "Book a Discovery Call",
    viewWork: "View Our Work",
    trusted: "Trusted by ambitious teams",
    heroStatProjects: "Projects delivered",
    heroStatServices: "Services",
    heroStatLanguages: "Languages",
    leadMagnetEyebrow: "Free showreel + estimate",
    leadMagnetTitle: "Get our full showreel and a project estimate in 2 minutes.",
    leadMagnetBody: "Leave your contact and we'll send the reel plus a rough budget for your project — no obligation.",
    leadMagnetNamePlaceholder: "Your name",
    leadMagnetContactPlaceholder: "Email or phone",
    leadMagnetSubmit: "Send me the showreel",
    leadMagnetTimer: "We reply within 15 minutes",
    leadMagnetSuccess: "Got it — check your inbox shortly.",
    popupEyebrow: "Crew notice",
    popupTitle: "Still scouting the site?",
    popupBody: "Let's talk about your project — a quick call costs nothing and we reply within 15 minutes.",
    popupCta: "Start a project",
    popupDismiss: "Not now",
    loaderLabel: "PRODUP",
    sceneIdea: "SCENE 01 — IDEA",
    sceneShoot: "SCENE 02 — SHOOT",
    sceneEdit: "SCENE 03 — EDIT",
    sceneFinal: "SCENE 04 — FINAL",
    editEyebrow: "SCENE 03 / EDIT",
    editTitle: "Every project, cut together.",
    editCopy: "Drag the timeline or tap a clip to scrub through recent work — the way we'd lay it out on a real editing timeline.",
    editHint: "Drag to scrub · tap a clip to jump",
    aiWidgetName: "PRODUP AI Manager",
    aiWidgetStatus: "Online · replies fast",
    aiWidgetPlaceholder: "Type a message…",
    aiTabChat: "AI Assistant",
    aiTabLead: "Quick Request",
    aiDisclaimer: "AI replies are for general guidance only and may be inaccurate.",
    aiGreeting: "Hi! I'm the produp AI assistant — ask about our services, process or how to start a project.",
    aiFieldContact: "How can we reach you?",
    aiFieldContactPlaceholder: "Phone, email or Telegram",
    aiFieldTask: "What do you need?",
    aiFieldTaskPlaceholder: "Briefly describe your project",
    aiConsent: "I agree to the processing of personal data",
    aiSubmit: "Send Request",
    aiLeadSuccess: "Request sent! We will contact you shortly.",
    aiLeadError: "Something went wrong. Please try again.",
    aboutEyebrow: "About PRODUP",
    aboutTitle: "An independent studio for content that grows business.",
    aboutBody: "We combine creativity, AI and strategy to build powerful content that attracts, engages and converts — from first concept to final cut, all under one roof.",
    aboutStatsTitle: "By the numbers",
    aboutClientsTitle: "Studios and brands we've worked with",
    aboutCapabilitiesTitle: "One partner, six focused practices",
    aboutCapabilitiesBody: "Every project draws on the same in-house team — no hand-offs, no guesswork between disciplines.",
    aboutCtaTitle: "Have a project that needs a sharper story?",
    aboutCtaButton: "Plan a project",
    selected: "Selected work, framed differently.",
    selectedLabel: "01 / Selected Work",
    selectedCopy:
      "A first look at the work behind the statement. The full editorial archive lives on a separate page.",
    explore: "Explore all projects",
    homeServicesLabel: "02 / Services",
    homeServicesTitle: "One partner. Six focused practices.",
    homeServicesCopy: "A compact view of the capabilities behind every PRODUP project.",
    exploreServices: "Explore all services",
    workTitle: "Our Work",
    workIntro: "Real projects. Real results.",
    load: "Load More Projects",
    loaded: "All projects loaded",
    viewProject: "View full case",
    coming: "Case study coming soon",
    servicesTitle: "Services",
    servicesEyebrow: "Creative practice / end to end",
    servicesIntro: "Everything we create, build and grow.",
    servicesNote:
      "Six focused practices. One production partner from first idea to measurable momentum.",
    servicesScroll: "Scroll to explore",
    servicesCtaLabel: "Have a bigger idea?",
    servicesCtaTitle: "Let’s build it together.",
    capabilities: "Capabilities",
    back: "Back to All Projects",
    challenge: "Challenge",
    approach: "Approach",
    start: "Start a project",
    footer: "AI · Content · Marketing",
    footerPrompt: "Have a project that needs a sharper story?",
    footerAction: "Plan a project",
    serviceExplore: "Explore service",
    servicePageLabel: "Service overview",
    serviceComing: "The full service page is coming soon.",
    serviceBack: "Back to all services",
    copyright: "All rights reserved.",
  },
  ru: {
    nav: { work: "Работы", services: "Услуги", about: "О нас", insights: "Инсайты", contact: "Контакты" },
    home: "Главная",
    menu: "Меню",
    close: "Закрыть",
    call: "Назначить звонок",
    heroEyebrow: "Независимая креативная production-студия",
    hero: ["КОНТЕНТ", "КОТОРЫЙ РАСТИТ", "БИЗНЕС."],
    intro:
      "Объединяем креатив, AI и стратегию, чтобы создавать контент, который привлекает, вовлекает и конвертирует.",
    discovery: "Обсудить проект",
    viewWork: "Смотреть работы",
    trusted: "Нам доверяют амбициозные команды",
    heroStatProjects: "Проектов",
    heroStatServices: "Услуг",
    heroStatLanguages: "Языка",
    leadMagnetEyebrow: "Бесплатный шоурил + смета",
    leadMagnetTitle: "Получите наш полный шоурил и смету проекта за 2 минуты.",
    leadMagnetBody: "Оставьте контакт — пришлём шоурил и приблизительный бюджет вашего проекта, без обязательств.",
    leadMagnetNamePlaceholder: "Ваше имя",
    leadMagnetContactPlaceholder: "Email или телефон",
    leadMagnetSubmit: "Прислать шоурил",
    leadMagnetTimer: "Отвечаем в течение 15 минут",
    leadMagnetSuccess: "Готово — проверьте почту в ближайшее время.",
    popupEyebrow: "Заметка со съёмок",
    popupTitle: "Ещё присматриваетесь?",
    popupBody: "Расскажите о проекте — короткий звонок ничего не стоит, отвечаем в течение 15 минут.",
    popupCta: "Начать проект",
    popupDismiss: "Не сейчас",
    loaderLabel: "PRODUP",
    sceneIdea: "СЦЕНА 01 — IDEA",
    sceneShoot: "СЦЕНА 02 — SHOOT",
    sceneEdit: "СЦЕНА 03 — EDIT",
    sceneFinal: "СЦЕНА 04 — FINAL",
    editEyebrow: "СЦЕНА 03 / MONTAGE",
    editTitle: "Каждый проект — как монтажная склейка.",
    editCopy: "Тяните таймлайн или кликайте по клипу, чтобы пролистать недавние работы — так же, как мы раскладываем реальный монтаж.",
    editHint: "Тяните, чтобы пролистать · клик по клипу — переход",
    aiWidgetName: "AI-менеджер PRODUP",
    aiWidgetStatus: "На связи · отвечает быстро",
    aiWidgetPlaceholder: "Введите сообщение…",
    aiTabChat: "AI-ассистент",
    aiTabLead: "Быстрая заявка",
    aiDisclaimer: "Ответы ИИ носят справочный характер и могут быть неточными.",
    aiGreeting: "Привет! Я AI-ассистент produp — спросите про услуги, процесс или как начать проект.",
    aiFieldContact: "Как с вами связаться?",
    aiFieldContactPlaceholder: "Телефон, email или Telegram",
    aiFieldTask: "Что вам нужно?",
    aiFieldTaskPlaceholder: "Коротко опишите проект",
    aiConsent: "Согласен на обработку персональных данных",
    aiSubmit: "Отправить заявку",
    aiLeadSuccess: "Заявка отправлена! Мы свяжемся с вами в ближайшее время.",
    aiLeadError: "Что-то пошло не так. Попробуйте ещё раз.",
    aboutEyebrow: "О PRODUP",
    aboutTitle: "Независимая студия для контента, который растит бизнес.",
    aboutBody: "Мы соединяем креатив, AI и стратегию, чтобы создавать сильный контент, который привлекает, вовлекает и конвертирует — от первой идеи до финального монтажа, под одной крышей.",
    aboutStatsTitle: "В цифрах",
    aboutClientsTitle: "Студии и бренды, с которыми мы работали",
    aboutCapabilitiesTitle: "Один партнёр, шесть направлений",
    aboutCapabilitiesBody: "Каждый проект ведёт одна и та же команда внутри студии — без передачи между подрядчиками и потери контекста.",
    aboutCtaTitle: "Есть проект, которому нужна более ясная история?",
    aboutCtaButton: "Обсудить проект",
    selected: "Избранные работы — в редакционном ритме.",
    selectedLabel: "01 / Избранные работы",
    selectedCopy:
      "Первый взгляд на проекты, которые стоят за заявлением. Полный архив находится на отдельной странице.",
    explore: "Все проекты",
    homeServicesLabel: "02 / Услуги",
    homeServicesTitle: "Один партнёр. Шесть направлений.",
    homeServicesCopy: "Краткий обзор возможностей, которые стоят за каждым проектом PRODUP.",
    exploreServices: "Все услуги",
    workTitle: "Наши работы",
    workIntro: "Реальные проекты. Реальный результат.",
    load: "Показать ещё",
    loaded: "Все проекты загружены",
    viewProject: "Смотреть полный кейс",
    coming: "Кейс скоро появится",
    servicesTitle: "Услуги",
    servicesEyebrow: "Креативная практика / полный цикл",
    servicesIntro: "Всё, что мы создаём, строим и развиваем.",
    servicesNote:
      "Шесть направлений. Один production-партнёр — от первой идеи до измеримого роста.",
    servicesScroll: "Смотреть направления",
    servicesCtaLabel: "Есть идея крупнее?",
    servicesCtaTitle: "Давайте создадим её вместе.",
    capabilities: "Возможности",
    back: "Ко всем проектам",
    challenge: "Задача",
    approach: "Подход",
    start: "Начать проект",
    footer: "AI · Контент · Маркетинг",
    footerPrompt: "Есть проект, которому нужна более ясная история?",
    footerAction: "Обсудить проект",
    serviceExplore: "Открыть услугу",
    servicePageLabel: "Обзор услуги",
    serviceComing: "Полная страница услуги скоро появится.",
    serviceBack: "Ко всем услугам",
    copyright: "Все права защищены.",
  },
  uk: {
    nav: { work: "Роботи", services: "Послуги", about: "Про нас", insights: "Інсайти", contact: "Контакти" },
    home: "Головна",
    menu: "Меню",
    close: "Закрити",
    call: "Замовити дзвінок",
    heroEyebrow: "Незалежна креативна production-студія",
    hero: ["КОНТЕНТ", "ЩО РОЗВИВАЄ", "БІЗНЕС."],
    intro:
      "Ми поєднуємо креатив, AI та стратегію, щоб створювати контент, який привертає увагу, залучає та конвертує.",
    discovery: "Обговорити проєкт",
    viewWork: "Дивитися роботи",
    trusted: "Нам довіряють амбітні команди",
    heroStatProjects: "Проєктів",
    heroStatServices: "Послуг",
    heroStatLanguages: "Мови",
    leadMagnetEyebrow: "Безкоштовний шоурил + кошторис",
    leadMagnetTitle: "Отримайте наш повний шоурил і кошторис проєкту за 2 хвилини.",
    leadMagnetBody: "Залиште контакт — надішлемо шоурил і приблизний бюджет вашого проєкту, без зобов'язань.",
    leadMagnetNamePlaceholder: "Ваше ім'я",
    leadMagnetContactPlaceholder: "Email або телефон",
    leadMagnetSubmit: "Надіслати шоурил",
    leadMagnetTimer: "Відповідаємо протягом 15 хвилин",
    leadMagnetSuccess: "Готово — перевірте пошту найближчим часом.",
    popupEyebrow: "Нотатка зі знімального майданчика",
    popupTitle: "Ще придивляєтесь?",
    popupBody: "Розкажіть про проєкт — короткий дзвінок нічого не коштує, відповідаємо протягом 15 хвилин.",
    popupCta: "Почати проєкт",
    popupDismiss: "Не зараз",
    loaderLabel: "PRODUP",
    sceneIdea: "СЦЕНА 01 — IDEA",
    sceneShoot: "СЦЕНА 02 — SHOOT",
    sceneEdit: "СЦЕНА 03 — EDIT",
    sceneFinal: "СЦЕНА 04 — FINAL",
    editEyebrow: "СЦЕНА 03 / MONTAGE",
    editTitle: "Кожен проєкт — як монтажна склейка.",
    editCopy: "Тягніть таймлайн або клікайте по кліпу, щоб переглянути останні роботи — так само, як ми розкладаємо реальний монтаж.",
    editHint: "Тягніть, щоб перегорнути · клік по кліпу — перехід",
    aiWidgetName: "AI-менеджер PRODUP",
    aiWidgetStatus: "На звʼязку · відповідає швидко",
    aiWidgetPlaceholder: "Введіть повідомлення…",
    aiTabChat: "AI-асистент",
    aiTabLead: "Швидка заявка",
    aiDisclaimer: "Відповіді ІІ мають довідковий характер і можуть бути неточними.",
    aiGreeting: "Привіт! Я AI-асистент produp — запитайте про послуги, процес або як почати проєкт.",
    aiFieldContact: "Як з вами звʼязатися?",
    aiFieldContactPlaceholder: "Телефон, email або Telegram",
    aiFieldTask: "Що вам потрібно?",
    aiFieldTaskPlaceholder: "Коротко опишіть проєкт",
    aiConsent: "Згоден на обробку персональних даних",
    aiSubmit: "Надіслати заявку",
    aiLeadSuccess: "Заявку надіслано! Ми звʼяжемося з вами найближчим часом.",
    aiLeadError: "Щось пішло не так. Спробуйте ще раз.",
    aboutEyebrow: "Про PRODUP",
    aboutTitle: "Незалежна студія для контенту, що вирощує бізнес.",
    aboutBody: "Ми поєднуємо креатив, AI та стратегію, щоб створювати потужний контент, який приваблює, залучає і конвертує — від першої ідеї до фінального монтажу, під одним дахом.",
    aboutStatsTitle: "У цифрах",
    aboutClientsTitle: "Студії та бренди, з якими ми працювали",
    aboutCapabilitiesTitle: "Один партнер, шість напрямів",
    aboutCapabilitiesBody: "Кожен проєкт веде та сама команда всередині студії — без передач між підрядниками і втрати контексту.",
    aboutCtaTitle: "Маєте проєкт, якому потрібна виразніша історія?",
    aboutCtaButton: "Обговорити проєкт",
    selected: "Вибрані роботи — в редакційному ритмі.",
    selectedLabel: "01 / Вибрані роботи",
    selectedCopy:
      "Перший погляд на проєкти, що стоять за нашими словами. Повний архів розміщено на окремій сторінці.",
    explore: "Усі проєкти",
    homeServicesLabel: "02 / Послуги",
    homeServicesTitle: "Один партнер. Шість напрямів.",
    homeServicesCopy: "Стислий огляд можливостей, що стоять за кожним проєктом PRODUP.",
    exploreServices: "Усі послуги",
    workTitle: "Наші роботи",
    workIntro: "Реальні проєкти. Реальні результати.",
    load: "Показати ще",
    loaded: "Усі проєкти завантажено",
    viewProject: "Переглянути повний кейс",
    coming: "Кейс незабаром з’явиться",
    servicesTitle: "Послуги",
    servicesEyebrow: "Креативна практика / повний цикл",
    servicesIntro: "Усе, що ми створюємо, будуємо та розвиваємо.",
    servicesNote:
      "Шість напрямів. Один production-партнер — від першої ідеї до вимірюваного зростання.",
    servicesScroll: "Переглянути напрями",
    servicesCtaLabel: "Маєте більшу ідею?",
    servicesCtaTitle: "Створімо її разом.",
    capabilities: "Можливості",
    back: "До всіх проєктів",
    challenge: "Завдання",
    approach: "Підхід",
    start: "Почати проєкт",
    footer: "AI · Контент · Маркетинг",
    footerPrompt: "Маєте проєкт, якому потрібна виразніша історія?",
    footerAction: "Обговорити проєкт",
    serviceExplore: "Відкрити послугу",
    servicePageLabel: "Огляд послуги",
    serviceComing: "Повна сторінка послуги незабаром з’явиться.",
    serviceBack: "До всіх послуг",
    copyright: "Усі права захищено.",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export const caseStudyCopy = {
  en: {
    metadataTitle: "Samal Construction — Concept Case Study",
    metadataDescription:
      "A cinematic website concept and visual direction for premium residential construction.",
    label: "Concept Case Study / 2026",
    subtitle: "Residential construction · Digital presentation",
    summary:
      "A cinematic digital concept for presenting premium residential construction with clarity, confidence and restraint.",
    facts: [
      ["Type", "Concept Case Study"],
      ["Focus", "Website Concept · Visual Direction"],
      ["Industry", "Residential Construction"],
      ["Status", "Prototype"],
    ],
    overviewLabel: "Overview",
    overviewHeading: "A clearer way to present premium construction.",
    overviewText:
      "The concept combines architectural photography, restrained typography and a clear editorial structure. The spaces remain the main focus while the interface guides visitors through the project without unnecessary visual noise.",
    challenge: "Challenge",
    challengeText:
      "Premium construction projects often contain a large amount of technical information. The challenge was to create a presentation that feels clear and trustworthy without becoming dense or visually heavy.",
    approach: "Approach",
    approachText:
      "The page is built around large architectural imagery, concise copy and a controlled sequence of information. Layered dark surfaces strengthen the visual identity while preserving contrast and readability.",
    deliverables: "Deliverables",
    deliverableItems: [
      "Website Concept",
      "Visual Direction",
      "Content Structure",
      "Responsive Prototype",
    ],
    gallery: "Gallery",
    ctaEyebrow: "Have a project in mind?",
    ctaHeading: "Let’s turn it into a clear, compelling digital story.",
    ctaBody:
      "Tell us what you are building and we will help define the right visual and digital direction.",
    ctaButton: "Start a Project",
    heroAlt: "Contemporary residential interior with open glass walls",
    galleryAltOne: "Modern residential architecture in a natural landscape",
    galleryAltTwo: "Open-plan interior of a contemporary residence",
  },
  ru: {
    metadataTitle: "Samal Construction — концептуальный кейс",
    metadataDescription:
      "Кинематографичная концепция сайта и визуального направления для премиального жилого строительства.",
    label: "Концептуальный кейс / 2026",
    subtitle: "Жилое строительство · Цифровая презентация",
    summary:
      "Кинематографичная цифровая концепция, которая помогает представить премиальное жилое строительство ясно, уверенно и сдержанно.",
    facts: [
      ["Тип", "Концептуальный кейс"],
      ["Фокус", "Концепция сайта · Визуальное направление"],
      ["Индустрия", "Жилое строительство"],
      ["Статус", "Прототип"],
    ],
    overviewLabel: "Обзор",
    overviewHeading: "Более ясный способ представить премиальное строительство.",
    overviewText:
      "Концепция объединяет архитектурную фотографию, сдержанную типографику и понятную редакционную структуру. Пространства остаются в центре внимания, а интерфейс ведёт посетителя по проекту без лишнего визуального шума.",
    challenge: "Задача",
    challengeText:
      "Премиальные строительные проекты часто содержат большой объём технической информации. Задача состояла в том, чтобы сделать презентацию ясной и убедительной, не перегружая её деталями и визуальными приёмами.",
    approach: "Подход",
    approachText:
      "Страница строится вокруг крупной архитектурной фотографии, лаконичного текста и выверенной последовательности информации. Система тёмных поверхностей усиливает визуальную идентичность, сохраняя контраст и читаемость.",
    deliverables: "Результат",
    deliverableItems: [
      "Концепция сайта",
      "Визуальное направление",
      "Структура контента",
      "Адаптивный прототип",
    ],
    gallery: "Галерея",
    ctaEyebrow: "Есть проект?",
    ctaHeading: "Превратим его в ясную и убедительную цифровую историю.",
    ctaBody:
      "Расскажите, что вы создаёте, — мы поможем определить подходящее визуальное и цифровое направление.",
    ctaButton: "Начать проект",
    heroAlt: "Современный жилой интерьер с открытыми стеклянными стенами",
    galleryAltOne: "Современная жилая архитектура в природном окружении",
    galleryAltTwo: "Открытый интерьер современного жилого дома",
  },
  uk: {
    metadataTitle: "Samal Construction — концептуальний кейс",
    metadataDescription:
      "Кінематографічна концепція сайту та візуального напряму для преміального житлового будівництва.",
    label: "Концептуальний кейс / 2026",
    subtitle: "Житлове будівництво · Цифрова презентація",
    summary:
      "Кінематографічна цифрова концепція, що допомагає презентувати преміальне житлове будівництво чітко, впевнено та стримано.",
    facts: [
      ["Тип", "Концептуальний кейс"],
      ["Фокус", "Концепція сайту · Візуальний напрям"],
      ["Галузь", "Житлове будівництво"],
      ["Статус", "Прототип"],
    ],
    overviewLabel: "Огляд",
    overviewHeading: "Зрозуміліший спосіб презентувати преміальне будівництво.",
    overviewText:
      "Концепція поєднує архітектурну фотографію, стриману типографіку та зрозумілу редакційну структуру. Простір залишається в центрі уваги, а інтерфейс веде відвідувача крізь проєкт без зайвого візуального шуму.",
    challenge: "Завдання",
    challengeText:
      "Преміальні будівельні проєкти часто містять великий обсяг технічної інформації. Завдання полягало в тому, щоб зробити презентацію зрозумілою та переконливою, не перевантажуючи її деталями й візуальними прийомами.",
    approach: "Підхід",
    approachText:
      "Сторінка побудована навколо великих архітектурних фотографій, лаконічного тексту та вивіреної послідовності інформації. Система темних поверхонь посилює візуальну ідентичність, зберігаючи контраст і читабельність.",
    deliverables: "Результат",
    deliverableItems: [
      "Концепція сайту",
      "Візуальний напрям",
      "Структура контенту",
      "Адаптивний прототип",
    ],
    gallery: "Галерея",
    ctaEyebrow: "Маєте проєкт?",
    ctaHeading: "Перетворімо його на зрозумілу та переконливу цифрову історію.",
    ctaBody:
      "Розкажіть, що ви створюєте, — ми допоможемо визначити відповідний візуальний і цифровий напрям.",
    ctaButton: "Почати проєкт",
    heroAlt: "Сучасний житловий інтер’єр із відкритими скляними стінами",
    galleryAltOne: "Сучасна житлова архітектура в природному оточенні",
    galleryAltTwo: "Відкритий інтер’єр сучасного житлового будинку",
  },
} satisfies Record<Locale, {
  metadataTitle: string;
  metadataDescription: string;
  label: string;
  subtitle: string;
  summary: string;
  facts: [string, string][];
  overviewLabel: string;
  overviewHeading: string;
  overviewText: string;
  challenge: string;
  challengeText: string;
  approach: string;
  approachText: string;
  deliverables: string;
  deliverableItems: string[];
  gallery: string;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
  heroAlt: string;
  galleryAltOne: string;
  galleryAltTwo: string;
}>;

export const keymanCaseCopy = {
  en: {
    metadataTitle: "Key Man Chicago — Client Profile Draft",
    metadataDescription:
      "A source-grounded draft profile of Key Man Chicago’s public brand and content presence.",
    label: "Client profile / Draft case",
    draft: "Draft · facts and media awaiting approval",
    summary:
      "A structured look at the public-facing identity and content ecosystem of an automotive locksmith serving the Chicago area.",
    facts: [
      ["Client", "Key Man Chicago"],
      ["Industry", "Automotive locksmith"],
      ["Location", "Chicago area"],
      ["Status", "Draft / awaiting confirmation"],
      ["Public snapshot", "July 31, 2026"],
      ["Website", "keymanchicago.com"],
    ],
    sources: "Public sources",
    website: "Open website",
    instagram: "Open Instagram",
    youtube: "Open YouTube",
    contextLabel: "Context",
    contextTitle: "More than a single social channel.",
    contextBody:
      "The current public ecosystem combines a mobile automotive-key service, an educational academy, a website and active social channels. This draft maps that broader presence without attributing unconfirmed work or business results to PRODUP.",
    ecosystemLabel: "Public service ecosystem",
    ecosystemTitle: "Service, education and media.",
    ecosystemIntro:
      "The categories below are currently visible on the official Key Man Chicago website. They describe the business, not PRODUP’s confirmed project scope.",
    ecosystem: [
      ["Mobile automotive service", "On-site car-key support across Chicago and Buffalo Grove."],
      ["Keys and remotes", "Duplication, smart keys, remotes and OEM equipment."],
      ["Lockout and replacement", "Emergency lockouts and lost-key replacement."],
      ["Key Man Academy", "Public training offer for automotive locksmith skills."],
      ["Content channels", "YouTube and Instagram extend the service into education and demonstrations."],
    ],
    themesLabel: "Observed content themes",
    themesTitle: "What the public channels communicate.",
    themes: [
      ["Automotive expertise", "Practical car-key topics and service-specific knowledge."],
      ["Educational content", "Videos and posts built around explanations, demonstrations and common questions."],
      ["Local service presence", "A recognizable Chicago-area identity across public-facing touchpoints."],
    ],
    channelsLabel: "Public presence",
    channelsTitle: "Website plus two public channels.",
    channelsIntro:
      "The figures below are a dated screenshot snapshot, not growth metrics or permanent claims.",
    websiteCard: "The official website connects services, training, public content and contact information.",
    instagramCard: "A public profile centered on automotive-key services, remote expertise and programming.",
    youtubeCard: "A public video library focused on car keys, programming and practical demonstrations.",
    snapshotLabel: "Snapshot / July 31, 2026",
    snapshotTitle: "Visible public channel figures.",
    metrics: [
      ["5,355", "Instagram followers shown"],
      ["972", "YouTube subscribers shown"],
      ["23", "YouTube videos shown"],
      ["2,352", "Featured video views shown"],
    ],
    snapshotNote:
      "Source: screenshots supplied by the user on July 31, 2026. These values do not represent growth or results delivered by PRODUP.",
    galleryLabel: "Reference media",
    galleryTitle: "The brand in context.",
    galleryNote:
      "Temporary extracted crops are used for layout only. Replace them with approved original client media before publication.",
    galleryAlt: [
      "Reference image of a branded Key Man Chicago service vehicle",
      "Reference image of automotive keys",
      "Reference image of a branded service vehicle at night",
    ],
    approvalLabel: "Before publication",
    approvalTitle: "What still needs confirmation.",
    approvals: [
      "Exact project scope delivered by PRODUP",
      "Permission to use portraits, logo and vehicle photography",
      "Project period and approved original media",
      "Any results, testimonial or performance claims",
    ],
    ctaEyebrow: "Have a project in mind?",
    ctaHeading: "Let’s shape the story with clarity.",
    ctaBody: "We build focused content systems without adding noise or unsupported claims.",
    ctaButton: "Start a project",
  },
  ru: {
    metadataTitle: "Key Man Chicago — черновик профиля клиента",
    metadataDescription:
      "Основанный на источниках черновой профиль публичного бренда и контента Key Man Chicago.",
    label: "Профиль клиента / Черновой кейс",
    draft: "Черновик · факты и медиа ожидают подтверждения",
    summary:
      "Структурированный взгляд на публичную айдентику и контент-экосистему автомобильного сервиса ключей в регионе Чикаго.",
    facts: [
      ["Клиент", "Key Man Chicago"],
      ["Индустрия", "Автомобильные ключи и замки"],
      ["География", "Регион Чикаго"],
      ["Статус", "Черновик / ожидает подтверждения"],
      ["Публичный снимок", "31 июля 2026"],
      ["Сайт", "keymanchicago.com"],
    ],
    sources: "Публичные источники",
    website: "Открыть сайт",
    instagram: "Открыть Instagram",
    youtube: "Открыть YouTube",
    contextLabel: "Контекст",
    contextTitle: "Больше, чем один социальный канал.",
    contextBody:
      "Текущая публичная экосистема объединяет мобильный сервис автоключей, образовательную академию, сайт и активные социальные каналы. Этот черновик показывает более широкий контекст, не приписывая PRODUP неподтверждённые работы или бизнес-результаты.",
    ecosystemLabel: "Публичная экосистема",
    ecosystemTitle: "Сервис, обучение и медиа.",
    ecosystemIntro:
      "Категории ниже сейчас представлены на официальном сайте Key Man Chicago. Они описывают бизнес, а не подтверждённый объём работ PRODUP.",
    ecosystem: [
      ["Мобильный автосервис", "Выездная помощь с автомобильными ключами в Чикаго и Buffalo Grove."],
      ["Ключи и пульты", "Дублирование, smart-ключи, пульты и OEM-оборудование."],
      ["Открытие и замена", "Экстренное открытие автомобилей и замена утерянных ключей."],
      ["Key Man Academy", "Публичная программа обучения навыкам автомобильного locksmith-сервиса."],
      ["Контент-каналы", "YouTube и Instagram развивают образовательные темы и демонстрации."],
    ],
    themesLabel: "Наблюдаемые темы",
    themesTitle: "Что сообщают публичные каналы.",
    themes: [
      ["Автомобильная экспертиза", "Практические темы об автоключах и специализированные знания."],
      ["Образовательный контент", "Видео и публикации с объяснениями, демонстрациями и ответами на частые вопросы."],
      ["Локальное присутствие", "Узнаваемая идентичность региона Чикаго в публичных точках контакта."],
    ],
    channelsLabel: "Публичное присутствие",
    channelsTitle: "Сайт и два публичных канала.",
    channelsIntro:
      "Цифры ниже — датированный снимок со скриншотов, а не показатели роста или постоянные утверждения.",
    websiteCard: "Официальный сайт объединяет услуги, обучение, публичный контент и контакты.",
    instagramCard: "Публичный профиль об автоключах, удалённой экспертизе и программировании.",
    youtubeCard: "Публичная видеотека об автомобильных ключах, программировании и практических демонстрациях.",
    snapshotLabel: "Снимок / 31 июля 2026",
    snapshotTitle: "Видимые показатели публичных каналов.",
    metrics: [
      ["5 355", "Подписчиков Instagram на снимке"],
      ["972", "Подписчика YouTube на снимке"],
      ["23", "Видео YouTube на снимке"],
      ["2 352", "Просмотра у показанного видео"],
    ],
    snapshotNote:
      "Источник: скриншоты, предоставленные пользователем 31 июля 2026 года. Эти значения не являются показателями роста или результатами работы PRODUP.",
    galleryLabel: "Референсные материалы",
    galleryTitle: "Бренд в реальном контексте.",
    galleryNote:
      "Для макета временно используются увеличенные кропы из референса. Перед публикацией их нужно заменить одобренными оригиналами.",
    galleryAlt: [
      "Референсное изображение брендированного автомобиля Key Man Chicago",
      "Референсное изображение автомобильных ключей",
      "Референсное изображение брендированного автомобиля ночью",
    ],
    approvalLabel: "До публикации",
    approvalTitle: "Что ещё нужно подтвердить.",
    approvals: [
      "Точный объём работ, выполненных PRODUP",
      "Разрешение на использование портретов, логотипа и фотографий автомобиля",
      "Период проекта и одобренные оригинальные материалы",
      "Любые результаты, отзыв или показатели эффективности",
    ],
    ctaEyebrow: "Есть проект?",
    ctaHeading: "Сформулируем его историю ясно.",
    ctaBody: "Создаём сфокусированные контент-системы без лишнего шума и неподтверждённых обещаний.",
    ctaButton: "Начать проект",
  },
  uk: {
    metadataTitle: "Key Man Chicago — чернетка профілю клієнта",
    metadataDescription:
      "Заснована на джерелах чернетка профілю публічного бренду та контенту Key Man Chicago.",
    label: "Профіль клієнта / Чернетка кейсу",
    draft: "Чернетка · факти й медіа очікують підтвердження",
    summary:
      "Структурований погляд на публічну айдентику й контент-екосистему автомобільного сервісу ключів у регіоні Чикаго.",
    facts: [
      ["Клієнт", "Key Man Chicago"],
      ["Галузь", "Автомобільні ключі та замки"],
      ["Географія", "Регіон Чикаго"],
      ["Статус", "Чернетка / очікує підтвердження"],
      ["Публічний знімок", "31 липня 2026"],
      ["Сайт", "keymanchicago.com"],
    ],
    sources: "Публічні джерела",
    website: "Відкрити сайт",
    instagram: "Відкрити Instagram",
    youtube: "Відкрити YouTube",
    contextLabel: "Контекст",
    contextTitle: "Більше, ніж один соціальний канал.",
    contextBody:
      "Поточна публічна екосистема поєднує мобільний сервіс автоключів, освітню академію, сайт і активні соціальні канали. Ця чернетка показує ширший контекст, не приписуючи PRODUP непідтверджені роботи чи бізнес-результати.",
    ecosystemLabel: "Публічна екосистема",
    ecosystemTitle: "Сервіс, навчання та медіа.",
    ecosystemIntro:
      "Категорії нижче зараз представлені на офіційному сайті Key Man Chicago. Вони описують бізнес, а не підтверджений обсяг робіт PRODUP.",
    ecosystem: [
      ["Мобільний автосервіс", "Виїзна допомога з автомобільними ключами в Чикаго та Buffalo Grove."],
      ["Ключі та пульти", "Дублювання, smart-ключі, пульти й OEM-обладнання."],
      ["Відкриття та заміна", "Екстрене відкриття автомобілів і заміна втрачених ключів."],
      ["Key Man Academy", "Публічна програма навчання навичкам автомобільного locksmith-сервісу."],
      ["Контент-канали", "YouTube та Instagram розвивають освітні теми й демонстрації."],
    ],
    themesLabel: "Спостережувані теми",
    themesTitle: "Що повідомляють публічні канали.",
    themes: [
      ["Автомобільна експертиза", "Практичні теми про автоключі та спеціалізовані знання."],
      ["Освітній контент", "Відео й дописи з поясненнями, демонстраціями та відповідями на часті запитання."],
      ["Локальна присутність", "Упізнавана ідентичність регіону Чикаго в публічних точках контакту."],
    ],
    channelsLabel: "Публічна присутність",
    channelsTitle: "Сайт і два публічні канали.",
    channelsIntro:
      "Цифри нижче — датований знімок зі скриншотів, а не показники зростання чи постійні твердження.",
    websiteCard: "Офіційний сайт об’єднує послуги, навчання, публічний контент і контакти.",
    instagramCard: "Публічний профіль про автоключі, віддалену експертизу та програмування.",
    youtubeCard: "Публічна відеотека про автомобільні ключі, програмування та практичні демонстрації.",
    snapshotLabel: "Знімок / 31 липня 2026",
    snapshotTitle: "Видимі показники публічних каналів.",
    metrics: [
      ["5 355", "Підписників Instagram на знімку"],
      ["972", "Підписники YouTube на знімку"],
      ["23", "Відео YouTube на знімку"],
      ["2 352", "Перегляди показаного відео"],
    ],
    snapshotNote:
      "Джерело: скриншоти, надані користувачем 31 липня 2026 року. Ці значення не є показниками зростання або результатами роботи PRODUP.",
    galleryLabel: "Референсні матеріали",
    galleryTitle: "Бренд у реальному контексті.",
    galleryNote:
      "Для макета тимчасово використано збільшені кропи з референсу. Перед публікацією їх потрібно замінити схваленими оригіналами.",
    galleryAlt: [
      "Референсне зображення брендованого автомобіля Key Man Chicago",
      "Референсне зображення автомобільних ключів",
      "Референсне зображення брендованого автомобіля вночі",
    ],
    approvalLabel: "До публікації",
    approvalTitle: "Що ще потрібно підтвердити.",
    approvals: [
      "Точний обсяг робіт, виконаних PRODUP",
      "Дозвіл на використання портретів, логотипа та фотографій автомобіля",
      "Період проєкту та схвалені оригінальні матеріали",
      "Будь-які результати, відгук або показники ефективності",
    ],
    ctaEyebrow: "Маєте проєкт?",
    ctaHeading: "Сформулюймо його історію чітко.",
    ctaBody: "Створюємо сфокусовані контент-системи без зайвого шуму й непідтверджених обіцянок.",
    ctaButton: "Почати проєкт",
  },
} satisfies Record<Locale, {
  metadataTitle: string;
  metadataDescription: string;
  label: string;
  draft: string;
  summary: string;
  facts: [string, string][];
  sources: string;
  website: string;
  instagram: string;
  youtube: string;
  contextLabel: string;
  contextTitle: string;
  contextBody: string;
  ecosystemLabel: string;
  ecosystemTitle: string;
  ecosystemIntro: string;
  ecosystem: [string, string][];
  themesLabel: string;
  themesTitle: string;
  themes: [string, string][];
  channelsLabel: string;
  channelsTitle: string;
  channelsIntro: string;
  websiteCard: string;
  instagramCard: string;
  youtubeCard: string;
  snapshotLabel: string;
  snapshotTitle: string;
  metrics: [string, string][];
  snapshotNote: string;
  galleryLabel: string;
  galleryTitle: string;
  galleryNote: string;
  galleryAlt: string[];
  approvalLabel: string;
  approvalTitle: string;
  approvals: string[];
  ctaEyebrow: string;
  ctaHeading: string;
  ctaBody: string;
  ctaButton: string;
}>;

export type Category =
  | "all"
  | "commercial"
  | "youtube"
  | "social"
  | "ai"
  | "web"
  | "branding";

export const categories: { value: Category; label: string }[] = [
  { value: "all", label: "All" },
  { value: "commercial", label: "Commercial" },
  { value: "youtube", label: "YouTube" },
  { value: "social", label: "Social Media" },
  { value: "ai", label: "AI" },
  { value: "web", label: "Web" },
  { value: "branding", label: "Branding" },
];

export type Project = {
  slug: string;
  title: string;
  services: string;
  image?: string;
  visual?: "keyman";
  categories: Category[];
  shape: "wide" | "portrait" | "standard";
  featured?: boolean;
  published?: boolean;
};

export const projects: Project[] = [
  {
    slug: "samal-construction",
    title: "Samal Construction",
    services: "Brand Video · Website",
    image: "/media/samal-house.jpg",
    categories: ["commercial", "web", "branding"],
    shape: "wide",
    featured: true,
    published: true,
  },
  {
    slug: "keyman-chicago",
    title: "KeyMan Chicago",
    services: "YouTube · Content",
    image: "/media/keyman/keyman-banner.png",
    categories: ["youtube", "commercial"],
    shape: "standard",
    published: true,
  },
  {
    slug: "joeking-drives",
    title: "Joeking Drives",
    services: "YouTube · Editing",
    image: "/media/car.jpg",
    categories: ["youtube", "commercial"],
    shape: "standard",
  },
  {
    slug: "worshiphill-church",
    title: "Worshiphill Church",
    services: "Event Video",
    image: "/media/event.jpg",
    categories: ["commercial", "social"],
    shape: "wide",
  },
  {
    slug: "ecommerce-brand",
    title: "E-Commerce Brand",
    services: "Product Video · Ads",
    image: "/media/product.jpg",
    categories: ["commercial", "social"],
    shape: "portrait",
  },
  {
    slug: "ai-commercial",
    title: "AI Commercial",
    services: "AI Video",
    image: "/media/ai.jpg",
    categories: ["ai", "commercial"],
    shape: "portrait",
  },
  {
    slug: "design-painting",
    title: "Design Painting",
    services: "Social Media",
    image: "/media/painting.jpg",
    categories: ["social", "branding"],
    shape: "portrait",
  },
  {
    slug: "luxury-real-estate",
    title: "Luxury Real Estate",
    services: "Video · Drone",
    image: "/media/real-estate.jpg",
    categories: ["commercial", "web"],
    shape: "wide",
  },
  {
    slug: "podcast-series",
    title: "Podcast Series",
    services: "Editing · Motion",
    image: "/media/podcast.jpg",
    categories: ["youtube", "social"],
    shape: "standard",
  },
];

export const services = [
  { number: "01", slug: "ai", image: "/media/service-ai.jpg" },
  { number: "02", slug: "content", image: "/media/service-content.jpg" },
  { number: "03", slug: "web", image: "/media/service-web.jpg" },
  { number: "04", slug: "marketing", image: "/media/service-marketing.jpg" },
  { number: "05", slug: "branding", image: "/media/service-branding.jpg" },
  { number: "06", slug: "youtube", image: "/media/service-youtube.jpg" },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];

type ServiceContent = {
  name: string;
  description: string;
  items: readonly string[];
};

export const serviceContent: Record<Locale, Record<ServiceSlug, ServiceContent>> = {
  en: {
    ai: {
      name: "AI Solutions",
      description: "Intelligent visuals, automation and next-generation content.",
      items: ["AI Commercials", "AI UGC", "AI Avatars", "AI Videos", "AI Automation"],
    },
    content: {
      name: "Content Production",
      description: "Production and storytelling that connects brands with people.",
      items: ["Video Production", "Video Editing", "Photography", "Drone", "Podcasts", "Motion Graphics"],
    },
    web: {
      name: "Web Development",
      description: "Fast, functional and beautifully directed web experiences.",
      items: ["Business Websites", "Landing Pages", "E-Commerce", "UI/UX Design", "SEO"],
    },
    marketing: {
      name: "Digital Marketing",
      description: "Data-informed strategies and campaigns that drive real growth.",
      items: ["Social Media", "Content Strategy", "Paid Advertising", "Analytics", "Content Planning"],
    },
    branding: {
      name: "Branding & Design",
      description: "Visual identity and design that leaves a lasting impression.",
      items: ["Logo Design", "Brand Identity", "Graphic Design", "Presentations"],
    },
    youtube: {
      name: "YouTube",
      description: "Create, optimize and grow your channel.",
      items: ["Channel Strategy", "Video Editing", "Thumbnail Design", "SEO & Optimization", "Publishing", "Analytics"],
    },
  },
  ru: {
    ai: {
      name: "AI-решения",
      description: "Интеллектуальные визуалы, автоматизация и контент нового поколения.",
      items: ["AI-реклама", "AI UGC", "AI-аватары", "AI-видео", "AI-автоматизация"],
    },
    content: {
      name: "Контент-продакшн",
      description: "Продакшн и сторителлинг, которые связывают бренды с людьми.",
      items: ["Видеопродакшн", "Видеомонтаж", "Фотография", "Дрон-съёмка", "Подкасты", "Моушн-дизайн"],
    },
    web: {
      name: "Веб-разработка",
      description: "Быстрые, функциональные и визуально выверенные цифровые продукты.",
      items: ["Бизнес-сайты", "Лендинги", "Интернет-магазины", "UI/UX-дизайн", "SEO"],
    },
    marketing: {
      name: "Цифровой маркетинг",
      description: "Стратегии и кампании на основе данных, которые приводят к росту.",
      items: ["Социальные сети", "Контент-стратегия", "Платная реклама", "Аналитика", "Контент-планирование"],
    },
    branding: {
      name: "Брендинг и дизайн",
      description: "Визуальная идентичность и дизайн, которые делают бренд узнаваемым.",
      items: ["Дизайн логотипа", "Айдентика", "Графический дизайн", "Презентации"],
    },
    youtube: {
      name: "YouTube",
      description: "Создание, оптимизация и развитие вашего канала.",
      items: ["Стратегия канала", "Видеомонтаж", "Дизайн обложек", "SEO и оптимизация", "Публикация", "Аналитика"],
    },
  },
  uk: {
    ai: {
      name: "AI-рішення",
      description: "Інтелектуальні візуали, автоматизація та контент нового покоління.",
      items: ["AI-реклама", "AI UGC", "AI-аватари", "AI-відео", "AI-автоматизація"],
    },
    content: {
      name: "Контент-продакшн",
      description: "Продакшн і сторітелінг, що поєднують бренди з людьми.",
      items: ["Відеопродакшн", "Відеомонтаж", "Фотографія", "Зйомка з дрона", "Подкасти", "Моушн-дизайн"],
    },
    web: {
      name: "Веброзробка",
      description: "Швидкі, функціональні та візуально вивірені цифрові продукти.",
      items: ["Бізнес-сайти", "Лендинги", "Інтернет-магазини", "UI/UX-дизайн", "SEO"],
    },
    marketing: {
      name: "Цифровий маркетинг",
      description: "Стратегії та кампанії на основі даних, що забезпечують реальне зростання.",
      items: ["Соціальні мережі", "Контент-стратегія", "Платна реклама", "Аналітика", "Контент-планування"],
    },
    branding: {
      name: "Брендинг і дизайн",
      description: "Візуальна ідентичність і дизайн, що роблять бренд упізнаваним.",
      items: ["Дизайн логотипа", "Айдентика", "Графічний дизайн", "Презентації"],
    },
    youtube: {
      name: "YouTube",
      description: "Створення, оптимізація та розвиток вашого каналу.",
      items: ["Стратегія каналу", "Відеомонтаж", "Дизайн обкладинок", "SEO та оптимізація", "Публікація", "Аналітика"],
    },
  },
};

export const homeProjectServices: Record<Locale, Record<"samal-construction" | "keyman-chicago" | "joeking-drives", string>> = {
  en: {
    "samal-construction": "Brand Video · Website",
    "keyman-chicago": "YouTube · Content",
    "joeking-drives": "YouTube · Editing",
  },
  ru: {
    "samal-construction": "Бренд-видео · Сайт",
    "keyman-chicago": "YouTube · Контент",
    "joeking-drives": "YouTube · Монтаж",
  },
  uk: {
    "samal-construction": "Бренд-відео · Сайт",
    "keyman-chicago": "YouTube · Контент",
    "joeking-drives": "YouTube · Відеомонтаж",
  },
};
