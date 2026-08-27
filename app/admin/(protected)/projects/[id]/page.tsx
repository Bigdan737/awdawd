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
  locales: Record<string, { title?: string; services?: string; challenge?: string; approach?: string }>;
  coverMediaId: number | null;
  media: Media[];
};

const LOCALES = ["en", "ru", "uk"] as const;
const SHAPES = ["standard", "wide", "portrait"];

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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminJson<{ project: ProjectDetail }>(`/api/admin/projects/${id}`);
      setProject(data.project);
      setCategoriesInput(data.project.categories.join(", "));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function updateLocaleField(field: string, value: string) {
    if (!project) return;
    setProject({
      ...project,
      locales: {
        ...project.locales,
        [locale]: { ...project.locales[locale], [field]: value },
      },
    });
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
        const data = await res.json();
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
          <input className="admin-input" value={loc.title ?? ""} onChange={(e) => updateLocaleField("title", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Услуги</label>
          <input className="admin-input" value={loc.services ?? ""} onChange={(e) => updateLocaleField("services", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Задача / вызов</label>
          <textarea className="admin-textarea" value={loc.challenge ?? ""} onChange={(e) => updateLocaleField("challenge", e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Подход</label>
          <textarea className="admin-textarea" value={loc.approach ?? ""} onChange={(e) => updateLocaleField("approach", e.target.value)} />
        </div>
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
