"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { adminJson, adminFetch } from "../../../_lib/client";

type Media = {
  id: number;
  type: "photo" | "video";
  url: string;
  alt: string;
  sortOrder: number;
};

type ProjectDetail = {
  id: number;
  slug: string;
  shape: string;
  featured: boolean;
  published: boolean;
  categories: string[];
  locales: Record<string, Record<string, unknown>>;
  coverMediaId: number | null;
  media: Media[];
};

const LOCALES = ["en", "ru", "uk"] as const;
const SHAPES = ["standard", "wide", "portrait"];

function listToText(v: unknown): string {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string").join(", ") : "";
}
function parseList(text: string): string[] {
  return text.split(",").map((s) => s.trim()).filter(Boolean);
}
function pairsToText(v: unknown): string {
  if (!Array.isArray(v)) return "";
  return v
    .filter((p): p is [string, string] => Array.isArray(p) && p.length === 2)
    .map(([a, b]) => `${a} | ${b}`)
    .join("\n");
}
function parsePairsText(text: string): [string, string][] {
  return text
    .split("\n")
    .map((line) => line.split("|").map((s) => s.trim()))
    .filter((p): p is [string, string] => p.length === 2 && p[0] !== "");
}

export default function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("en");
  const [categoriesInput, setCategoriesInput] = useState("");
  const [showPremium, setShowPremium] = useState(false);
  const [premiumText, setPremiumText] = useState<Record<string, Record<string, string>>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminJson<{ project: ProjectDetail }>(`/api/admin/projects/${id}`);
      setProject(data.project);
      setCategoriesInput(data.project.categories.join(", "));
      const pt: Record<string, Record<string, string>> = {};
      for (const loc of LOCALES) {
        const entry = data.project.locales[loc] ?? {};
        pt[loc] = {
          chips: listToText(entry.chips),
          stages: listToText(entry.stages),
          cards: pairsToText(entry.cards),
          metrics: pairsToText(entry.metrics),
        };
      }
      setPremiumText(pt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function updateLocaleField(field: string, value: unknown) {
    if (!project) return;
    setProject({
      ...project,
      locales: {
        ...project.locales,
        [locale]: { ...project.locales[locale], [field]: value },
      },
    });
  }

  function updatePremiumList(field: "chips" | "stages", text: string) {
    setPremiumText((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: text } }));
    updateLocaleField(field, parseList(text));
  }

  function updatePremiumPairs(field: "cards" | "metrics", text: string) {
    setPremiumText((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: text } }));
    updateLocaleField(field, parsePairsText(text));
  }

  async function handleSave() {
    if (!project) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await adminJson<{ project: ProjectDetail }>(`/api/admin/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          shape: project.shape,
          featured: project.featured,
          published: project.published,
          categories: categoriesInput.split(",").map((c) => c.trim()).filter(Boolean),
          locales: project.locales,
        }),
      });
      setProject(data.project);
      setSuccess("Сохранено.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await adminFetch(`/api/admin/projects/${id}/media`, { method: "POST", body: form });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(data.error || "Ошибка загрузки.");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить файл.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDeleteMedia(mediaId: number) {
    if (!confirm("Удалить этот файл?")) return;
    try {
      await adminJson(`/api/admin/projects/${id}/media/${mediaId}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить.");
    }
  }

  async function handleSetCover(mediaId: number) {
    if (!project) return;
    try {
      const data = await adminJson<{ project: ProjectDetail }>(`/api/admin/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ coverMediaId: mediaId }),
      });
      setProject(data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось установить обложку.");
    }
  }

  async function handleDeleteProject() {
    if (!confirm("Удалить проект и все его медиафайлы без возможности восстановления?")) return;
    try {
      await adminJson(`/api/admin/projects/${id}`, { method: "DELETE" });
      router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить проект.");
    }
  }

  if (loading) return <p className="admin-sub">Загрузка…</p>;
  if (!project) return <div className="admin-alert error">{error || "Проект не найден."}</div>;

  const loc = project.locales[locale] ?? {};
  const locStr = (field: string): string => {
    const v = loc[field];
    return typeof v === "string" ? v : "";
  };
  const pt = premiumText[locale] ?? { chips: "", stages: "", cards: "", metrics: "" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="admin-h1">{project.slug}</h1>
          <p className="admin-sub">Редактирование проекта</p>
        </div>
        <button className="admin-btn danger" onClick={handleDeleteProject}>Удалить проект</button>
      </div>

      {error && <div className="admin-alert error">{error}</div>}
      {success && <div className="admin-alert success">{success}</div>}

      <div className="admin-card">
        <h2>Основное</h2>
        <div className="admin-row">
          <div className="admin-field">
            <label>Форма карточки</label>
            <select className="admin-select" value={project.shape} onChange={(e) => setProject({ ...project, shape: e.target.value })}>
              {SHAPES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Категории (через запятую)</label>
            <input className="admin-input" value={categoriesInput} onChange={(e) => setCategoriesInput(e.target.value)} />
          </div>
        </div>
        <div className="admin-checkbox-row">
          <input type="checkbox" id="published" checked={project.published} onChange={(e) => setProject({ ...project, published: e.target.checked })} />
          <label htmlFor="published" style={{ margin: 0 }}>Опубликован на сайте</label>
        </div>
        <div className="admin-checkbox-row">
          <input type="checkbox" id="featured" checked={project.featured} onChange={(e) => setProject({ ...project, featured: e.target.checked })} />
          <label htmlFor="featured" style={{ margin: 0 }}>Featured (на главной)</label>
        </div>
      </div>

      <div className="admin-card">
        <h2>Тексты</h2>
        <p className="admin-card-desc">Отдельно по каждому языку сайта.</p>
        <div className="admin-tabs">
          {LOCALES.map((l) => (
            <button key={l} className={`admin-tab${locale === l ? " is-active" : ""}`} onClick={() => setLocale(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="admin-field">
          <label>Название</label>
          <input className="admin-input" value={locStr("title")} onChange={(e) => updateLocaleField("title", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Услуги</label>
          <input className="admin-input" value={locStr("services")} onChange={(e) => updateLocaleField("services", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Задача / вызов (короткий текст)</label>
          <textarea className="admin-textarea" value={locStr("challenge")} onChange={(e) => updateLocaleField("challenge", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Подход (короткий текст)</label>
          <textarea className="admin-textarea" value={locStr("approach")} onChange={(e) => updateLocaleField("approach", e.target.value)} />
        </div>

        <button type="button" className="admin-btn secondary" onClick={() => setShowPremium((v) => !v)} style={{ marginTop: 4 }}>
          {showPremium ? "Скрыть премиальный шаблон ▲" : "Премиальный шаблон (как у KeyMan) ▼"}
        </button>

        {showPremium && (
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--a-border)" }}>
            <p className="admin-card-desc">
              Заполните любые из этих полей — на странице кейса покажется только то, что заполнено. Так выглядит
              страница KeyMan, шаблон полностью переиспользуется.
            </p>

            <div className="admin-field">
              <label>Хлебная крошка (например «Work / Название проекта»)</label>
              <input className="admin-input" value={locStr("breadcrumb")} onChange={(e) => updateLocaleField("breadcrumb", e.target.value)} />
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label>Заголовок, строка 1</label>
                <input className="admin-input" value={locStr("heroLine1")} onChange={(e) => updateLocaleField("heroLine1", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Заголовок, строка 2</label>
                <input className="admin-input" value={locStr("heroLine2")} onChange={(e) => updateLocaleField("heroLine2", e.target.value)} />
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label>Акцент (например «FROM»)</label>
                <input className="admin-input" value={locStr("heroAccent2")} onChange={(e) => updateLocaleField("heroAccent2", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Акцент 2 (например «THE GROUND UP.»)</label>
                <input className="admin-input" value={locStr("heroAccent3")} onChange={(e) => updateLocaleField("heroAccent3", e.target.value)} />
              </div>
            </div>

            <div className="admin-field">
              <label>Краткое summary под заголовком</label>
              <textarea className="admin-textarea" value={locStr("summary")} onChange={(e) => updateLocaleField("summary", e.target.value)} />
            </div>

            <div className="admin-field">
              <label>Теги услуг (через запятую)</label>
              <input className="admin-input" value={pt.chips} onChange={(e) => updatePremiumList("chips", e.target.value)} placeholder="Branding, Website, YouTube" />
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label>Ссылка на сайт</label>
                <input className="admin-input" value={locStr("websiteUrl")} onChange={(e) => updateLocaleField("websiteUrl", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Instagram</label>
                <input className="admin-input" value={locStr("instagramUrl")} onChange={(e) => updateLocaleField("instagramUrl", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>YouTube</label>
                <input className="admin-input" value={locStr("youtubeUrl")} onChange={(e) => updateLocaleField("youtubeUrl", e.target.value)} />
              </div>
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label>Лейбл секции «Задача»</label>
                <input className="admin-input" value={locStr("challengeLabel")} onChange={(e) => updateLocaleField("challengeLabel", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Заголовок секции «Задача»</label>
                <input className="admin-input" value={locStr("challengeTitle")} onChange={(e) => updateLocaleField("challengeTitle", e.target.value)} />
              </div>
            </div>
            <div className="admin-field">
              <label>Текст секции «Задача»</label>
              <textarea className="admin-textarea" value={locStr("challengeBody")} onChange={(e) => updateLocaleField("challengeBody", e.target.value)} />
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label>Лейбл секции «Подход»</label>
                <input className="admin-input" value={locStr("approachLabel")} onChange={(e) => updateLocaleField("approachLabel", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Заголовок секции «Подход»</label>
                <input className="admin-input" value={locStr("approachTitle")} onChange={(e) => updateLocaleField("approachTitle", e.target.value)} />
              </div>
            </div>
            <div className="admin-field">
              <label>Текст секции «Подход»</label>
              <textarea className="admin-textarea" value={locStr("approachBody")} onChange={(e) => updateLocaleField("approachBody", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Этапы процесса (через запятую)</label>
              <input className="admin-input" value={pt.stages} onChange={(e) => updatePremiumList("stages", e.target.value)} placeholder="Discovery, Positioning, Identity, Website, Growth" />
            </div>

            <div className="admin-field">
              <label>Лейбл секции «Что сделали»</label>
              <input className="admin-input" value={locStr("whatLabel")} onChange={(e) => updateLocaleField("whatLabel", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Карточки работ — по одной на строке, формат «Заголовок | Описание»</label>
              <textarea
                className="admin-textarea"
                style={{ minHeight: 130, fontFamily: "monospace", fontSize: 13 }}
                value={pt.cards}
                onChange={(e) => updatePremiumPairs("cards", e.target.value)}
                placeholder={"Branding | A recognizable visual language...\nWebsite | A central digital destination..."}
              />
              <p className="admin-hint">Картинки для карточек берутся из загруженных фото по порядку (3-е, 4-е, 5-е фото и т.д.)</p>
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label>Лейбл секции «Охват»</label>
                <input className="admin-input" value={locStr("reachLabel")} onChange={(e) => updateLocaleField("reachLabel", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Заголовок секции «Охват»</label>
                <input className="admin-input" value={locStr("reachTitle")} onChange={(e) => updateLocaleField("reachTitle", e.target.value)} />
              </div>
            </div>
            <div className="admin-field">
              <label>Метрики — по одной на строке, формат «Значение | Подпись»</label>
              <textarea
                className="admin-textarea"
                style={{ minHeight: 110, fontFamily: "monospace", fontSize: 13 }}
                value={pt.metrics}
                onChange={(e) => updatePremiumPairs("metrics", e.target.value)}
                placeholder={"5,355 | Instagram followers\n972 | YouTube subscribers"}
              />
            </div>

            <div className="admin-row">
              <div className="admin-field">
                <label>Лейбл «Обзор проекта»</label>
                <input className="admin-input" value={locStr("overviewLabel")} onChange={(e) => updateLocaleField("overviewLabel", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Заголовок «Обзор проекта»</label>
                <input className="admin-input" value={locStr("overviewTitle")} onChange={(e) => updateLocaleField("overviewTitle", e.target.value)} />
              </div>
            </div>
            <div className="admin-field">
              <label>Текст «Обзор проекта»</label>
              <textarea className="admin-textarea" value={locStr("overviewBody")} onChange={(e) => updateLocaleField("overviewBody", e.target.value)} />
            </div>

            <div className="admin-field">
              <label>Заголовок финального CTA</label>
              <input className="admin-input" value={locStr("ctaTitle")} onChange={(e) => updateLocaleField("ctaTitle", e.target.value)} />
            </div>
            <div className="admin-row">
              <div className="admin-field">
                <label>Текст CTA</label>
                <input className="admin-input" value={locStr("ctaBody")} onChange={(e) => updateLocaleField("ctaBody", e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Текст кнопки CTA</label>
                <input className="admin-input" value={locStr("ctaButton")} onChange={(e) => updateLocaleField("ctaButton", e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      <button className="admin-btn" onClick={handleSave} disabled={saving} style={{ marginBottom: 20 }}>
        {saving ? "Сохраняем…" : "Сохранить изменения"}
      </button>

      <div className="admin-card">
        <h2>Фото и видео</h2>
        <p className="admin-card-desc">JPEG/PNG/WebP/GIF/AVIF до 15MB, MP4/WebM/MOV до 250MB. Каждый проект хранится в своей папке.</p>

        <label className="admin-btn secondary" style={{ display: "inline-block", cursor: "pointer" }}>
          {uploading ? "Загружаем…" : "+ Загрузить файлы"}
          <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
        </label>

        {project.media.length > 0 && (
          <div className="admin-media-grid">
            {project.media.map((m) => (
              <div className="admin-media-item" key={m.id}>
                {m.type === "photo" ? (
                  <img src={m.url} alt={m.alt} />
                ) : (
                  <video src={m.url} muted />
                )}
                <button className="rm" onClick={() => handleDeleteMedia(m.id)}>✕</button>
                {project.coverMediaId !== m.id && m.type === "photo" && (
                  <button
                    className="rm"
                    style={{ left: 4, right: "auto" }}
                    onClick={() => handleSetCover(m.id)}
                  >
                    ★ обложка
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
