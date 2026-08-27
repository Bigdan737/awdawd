"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { adminJson, adminFetch } from "../../../../_lib/client";

/* ---------------------------------------------------------------------- */
/* Types                                                                   */
/* ---------------------------------------------------------------------- */

type Media = {
  id: number;
  type: "photo" | "video";
  url: string;
  alt: string;
  sortOrder: number;
  contentType: string;
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
type Locale = (typeof LOCALES)[number];
const LOCALE_LABEL: Record<Locale, string> = { en: "EN", ru: "RU", uk: "UK" };

/* ---------------------------------------------------------------------- */
/* Small data helpers (mirror the public case-study page)                 */
/* ---------------------------------------------------------------------- */

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}
function strList(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}
function pairs(v: unknown): [string, string][] {
  if (!Array.isArray(v)) return [];
  return v.filter(
    (p): p is [string, string] => Array.isArray(p) && p.length === 2 && typeof p[0] === "string" && typeof p[1] === "string"
  );
}

/* ---------------------------------------------------------------------- */
/* Inline styles for the editor-only chrome (kept out of the site's CSS)  */
/* ---------------------------------------------------------------------- */

const EDITOR_CSS = `
.pv-toolbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:14px;flex-wrap:wrap;
  padding:10px 18px;background:#14151a;border-bottom:1px solid #2a2b32;color:#fff;font-family:Inter,sans-serif;font-size:13px}
.pv-toolbar a{color:#cfcfd6;text-decoration:none}
.pv-toolbar a:hover{color:#fff}
.pv-locales{display:flex;gap:4px;background:#1f2027;border-radius:8px;padding:3px}
.pv-locale-btn{padding:4px 10px;border-radius:6px;border:none;background:transparent;color:#9a9aa4;cursor:pointer;font-size:12px;font-weight:600}
.pv-locale-btn.is-active{background:#F5A51C;color:#14151a}
.pv-spacer{flex:1}
.pv-status{font-size:12px;color:#9a9aa4}
.pv-status.saving{color:#F5A51C}
.pv-status.err{color:#ff6b6b}
.pv-toggle{display:flex;align-items:center;gap:6px;cursor:pointer;font-size:12px}
.pv-btn{background:#2a2b32;color:#fff;border:1px solid #3a3b44;padding:6px 12px;border-radius:7px;cursor:pointer;font-size:12px}
.pv-btn:hover{background:#3a3b44}
.pv-hint{padding:10px 18px;background:#fff8ea;color:#7a5a10;font-size:13px;font-family:Inter,sans-serif;border-bottom:1px solid #f0ddb0}

.editable-field{outline:2px dashed transparent;outline-offset:3px;border-radius:4px;cursor:text;transition:outline-color .15s}
.editable-field:hover{outline-color:rgba(245,165,28,.55)}
.editable-field.is-editing{outline:2px solid #F5A51C;outline-offset:3px;background:rgba(245,165,28,.06)}
.editable-field.is-empty::before{content:attr(data-placeholder);opacity:.4}

.editable-photo-wrap{position:relative}
.editable-photo-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;
  background:rgba(10,10,14,0);opacity:0;transition:opacity .15s,background .15s;z-index:5}
.editable-photo-wrap:hover .editable-photo-overlay{opacity:1;background:rgba(10,10,14,.45)}
.editable-photo-btn{background:#F5A51C;color:#14151a;border:none;padding:7px 13px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}
.editable-photo-btn.secondary{background:rgba(255,255,255,.9);color:#14151a}
.editable-photo-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  background:#1f2027;color:#8b8c96;font-size:12px;font-family:Inter,sans-serif;border-radius:inherit}

.pv-list-chip{display:inline-flex;align-items:center;gap:6px}
.pv-x{cursor:pointer;opacity:.5;font-size:12px}
.pv-x:hover{opacity:1;color:#ff6b6b}
.pv-add{display:inline-block;margin:4px;padding:5px 10px;border:1px dashed rgba(255,255,255,.4);border-radius:6px;
  font-size:12px;cursor:pointer;color:inherit;opacity:.7;font-family:Inter,sans-serif}
.pv-add:hover{opacity:1}
`;

/* ---------------------------------------------------------------------- */
/* Editable text (click-in-place contentEditable)                         */
/* ---------------------------------------------------------------------- */

function EditableText({
  value,
  onSave,
  as = "span",
  className = "",
  placeholder = "Нажмите, чтобы добавить текст",
  multiline = false,
}: {
  value: string;
  onSave: (v: string) => void;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const Tag = as as unknown as React.ElementType;
  const ref = useRef<HTMLElement>(null);

  function handleBlur(e: React.FocusEvent<HTMLElement>) {
    e.currentTarget.classList.remove("is-editing");
    const text = (e.currentTarget.innerText || "").replace(/\n+$/, "");
    if (text !== value) onSave(text);
  }

  return (
    <Tag
      ref={ref}
      className={`${className} editable-field${!value ? " is-empty" : ""}`.trim()}
      data-placeholder={placeholder}
      contentEditable
      suppressContentEditableWarning
      onFocus={(e: React.FocusEvent<HTMLElement>) => e.currentTarget.classList.add("is-editing")}
      onBlur={handleBlur}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
        if (e.key === "Escape") {
          e.currentTarget.innerText = value;
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {value}
    </Tag>
  );
}

/* ---------------------------------------------------------------------- */
/* Editable image (hover overlay -> replace/add, keeps the same slot)     */
/* ---------------------------------------------------------------------- */

function EditableImage({
  projectId,
  media,
  alt,
  sizes,
  onBusyChange,
  onReload,
}: {
  projectId: number;
  media: Media | undefined;
  alt: string;
  sizes: string;
  onBusyChange: (busy: boolean) => void;
  onReload: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    onBusyChange(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await adminFetch(`/api/admin/projects/${projectId}/media`, { method: "POST", body: form });
      const data = (await res.json()) as { media?: Media; error?: string };
      if (!res.ok || !data.media) throw new Error(data.error || "Не удалось загрузить фото.");

      // Keep this new file in the same visual slot as the one it replaces.
      if (media) {
        await adminJson(`/api/admin/projects/${projectId}/media/${data.media.id}`, {
          method: "PATCH",
          body: JSON.stringify({ sortOrder: media.sortOrder }),
        });
        await adminJson(`/api/admin/projects/${projectId}/media/${media.id}`, { method: "DELETE" });
      }
      await onReload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Не удалось загрузить фото.");
    } finally {
      setBusy(false);
      onBusyChange(false);
      e.target.value = "";
    }
  }

  return (
    <div className="editable-photo-wrap" style={{ position: "relative", width: "100%", height: "100%" }}>
      {media ? (
        <Image src={media.url} alt={alt} fill unoptimized sizes={sizes} style={{ objectFit: "cover" }} />
      ) : (
        <div className="editable-photo-empty">Нет фото</div>
      )}
      <div className="editable-photo-overlay">
        <button type="button" className="editable-photo-btn" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? "Загрузка…" : media ? "Заменить фото" : "Добавить фото"}
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFile} />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Page                                                                    */
/* ---------------------------------------------------------------------- */

export default function ProjectLiveEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projectId = Number(id);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>("en");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [busyCount, setBusyCount] = useState(0);

  const load = useCallback(async () => {
    const data = await adminJson<{ project: ProjectDetail }>(`/api/admin/projects/${projectId}`);
    setProject(data.project);
  }, [projectId]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  async function saveLocales(nextLocales: Record<string, Record<string, unknown>>) {
    setProject((p) => (p ? { ...p, locales: nextLocales } : p));
    setStatus("saving");
    try {
      const data = await adminJson<{ project: ProjectDetail }>(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify({ locales: nextLocales }),
      });
      setProject(data.project);
      setStatus("saved");
      setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 1500);
    } catch {
      setStatus("error");
    }
  }

  function saveField(field: string, value: unknown) {
    if (!project) return;
    const nextLocales = {
      ...project.locales,
      [locale]: { ...project.locales[locale], [field]: value },
    };
    saveLocales(nextLocales);
  }

  async function setPublished(published: boolean) {
    if (!project) return;
    setProject({ ...project, published });
    await adminJson(`/api/admin/projects/${projectId}`, { method: "PATCH", body: JSON.stringify({ published }) });
  }

  if (loading || !project) {
    return (
      <div style={{ padding: 40, fontFamily: "Inter,sans-serif" }}>
        <style>{EDITOR_CSS}</style>
        Загрузка…
      </div>
    );
  }

  const d = project.locales[locale] ?? {};
  const title = str(d.title) || project.slug;
  const chips = strList(d.chips);
  const stages = strList(d.stages);
  const cards = pairs(d.cards);
  const metrics = pairs(d.metrics);

  const photos = project.media.filter((m) => m.type === "photo").sort((a, b) => a.sortOrder - b.sortOrder);
  const videos = project.media.filter((m) => m.type === "video");

  const hero = photos[0];
  const beforeImg = photos[1];
  const cardImages = photos.slice(2, 2 + cards.length);
  const overviewImg = photos[2 + cards.length];
  const ctaImg = photos[photos.length - 1];

  const busy = busyCount > 0;

  return (
    <div>
      <style>{EDITOR_CSS}</style>

      <div className="pv-toolbar">
        <Link href="/admin/projects">← Проекты</Link>
        <strong>{title}</strong>
        <div className="pv-locales">
          {LOCALES.map((l) => (
            <button
              key={l}
              className={`pv-locale-btn${l === locale ? " is-active" : ""}`}
              onClick={() => setLocale(l)}
            >
              {LOCALE_LABEL[l]}
            </button>
          ))}
        </div>
        <label className="pv-toggle">
          <input type="checkbox" checked={project.published} onChange={(e) => setPublished(e.target.checked)} />
          Опубликован
        </label>
        <div className="pv-spacer" />
        <span className={`pv-status${status === "saving" ? " saving" : ""}${status === "error" ? " err" : ""}`}>
          {status === "saving" && "Сохранение…"}
          {status === "saved" && "Сохранено ✓"}
          {status === "error" && "Ошибка сохранения"}
          {status === "idle" && (busy ? "Загрузка файла…" : "")}
        </span>
        <a href={`/${locale}/work/${project.slug}`} target="_blank" rel="noreferrer" className="pv-btn">
          Открыть на сайте ↗
        </a>
        <Link href={`/admin/projects/${projectId}`} className="pv-btn">
          Классическая форма
        </Link>
      </div>

      <div className="pv-hint">
        Кликните на любой текст, чтобы отредактировать его. Наведите на фото, чтобы заменить. Изменения сохраняются
        автоматически.
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Visual replica of the public case-study page                  */}
      {/* ------------------------------------------------------------ */}
      <main className="case-page keyman-page">
        <section className="keyman-hero">
          <div style={{ position: "absolute", inset: 0 }}>
            <EditableImage projectId={projectId} media={hero} alt={title} sizes="100vw" onBusyChange={(b) => setBusyCount((c) => c + (b ? 1 : -1))} onReload={load} />
          </div>
          <div className="keyman-hero__copy">
            <EditableText as="p" className="keyman-kicker" value={str(d.breadcrumb)} onSave={(v) => saveField("breadcrumb", v)} placeholder="Хлебные крошки" />
            <h1>
              <span>
                <EditableText value={str(d.heroLine1) || title} onSave={(v) => saveField("heroLine1", v)} placeholder="Заголовок, строка 1" />
              </span>
              <span>
                <EditableText value={str(d.heroLine2)} onSave={(v) => saveField("heroLine2", v)} placeholder="Строка 2" />{" "}
                <em>
                  <EditableText value={str(d.heroAccent2)} onSave={(v) => saveField("heroAccent2", v)} placeholder="акцент" />
                </em>
              </span>
              <em>
                <EditableText value={str(d.heroAccent3)} onSave={(v) => saveField("heroAccent3", v)} placeholder="акцент 2" />
              </em>
            </h1>
            <EditableText as="p" className="keyman-hero__summary" value={str(d.summary)} onSave={(v) => saveField("summary", v)} multiline placeholder="Краткое описание проекта" />
            <div className="keyman-hero__tags">
              {chips.map((chip, i) => (
                <span key={i} className="pv-list-chip">
                  <EditableText
                    value={chip}
                    onSave={(v) => {
                      const next = [...chips];
                      if (v) next[i] = v; else next.splice(i, 1);
                      saveField("chips", next);
                    }}
                  />
                  <span className="pv-x" onClick={() => saveField("chips", chips.filter((_, idx) => idx !== i))}>✕</span>
                </span>
              ))}
              <span className="pv-add" onClick={() => saveField("chips", [...chips, "Новый тег"])}>+ тег</span>
            </div>
            <div className="keyman-hero__actions">
              <EditableText as="a" className="button" value={str(d.websiteUrl) || "Ссылка на сайт клиента"} onSave={(v) => saveField("websiteUrl", v)} placeholder="URL сайта" />
            </div>
          </div>
        </section>

        <section className="keyman-story keyman-container">
          <article className="keyman-story__challenge">
            <EditableText as="p" className="keyman-kicker" value={str(d.challengeLabel)} onSave={(v) => saveField("challengeLabel", v)} placeholder="Метка блока" />
            <EditableText as="h2" value={str(d.challengeTitle)} onSave={(v) => saveField("challengeTitle", v)} multiline placeholder="Заголовок: задача" />
            <EditableText as="p" value={str(d.challengeBody)} onSave={(v) => saveField("challengeBody", v)} multiline placeholder="Текст: задача" />
            <figure style={{ position: "relative" }}>
              <EditableImage projectId={projectId} media={beforeImg} alt={title} sizes="(max-width: 760px) 100vw, 260px" onBusyChange={(b) => setBusyCount((c) => c + (b ? 1 : -1))} onReload={load} />
            </figure>
          </article>
          <article className="keyman-story__approach">
            <EditableText as="p" className="keyman-kicker" value={str(d.approachLabel)} onSave={(v) => saveField("approachLabel", v)} placeholder="Метка блока" />
            <EditableText as="h3" value={str(d.approachTitle)} onSave={(v) => saveField("approachTitle", v)} multiline placeholder="Заголовок: подход" />
            <EditableText as="p" className="keyman-story__approach-copy" value={str(d.approachBody)} onSave={(v) => saveField("approachBody", v)} multiline placeholder="Текст: подход" />
            <ol className="keyman-story__timeline">
              {stages.map((stage, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong className="pv-list-chip">
                    <EditableText
                      value={stage}
                      onSave={(v) => {
                        const next = [...stages];
                        if (v) next[i] = v; else next.splice(i, 1);
                        saveField("stages", next);
                      }}
                    />
                    <span className="pv-x" onClick={() => saveField("stages", stages.filter((_, idx) => idx !== i))}>✕</span>
                  </strong>
                </li>
              ))}
            </ol>
            <span className="pv-add" onClick={() => saveField("stages", [...stages, "Новый этап"])}>+ этап</span>
          </article>
        </section>

        <section className="keyman-work keyman-container">
          <EditableText as="p" className="keyman-kicker" value={str(d.whatLabel)} onSave={(v) => saveField("whatLabel", v)} placeholder="Метка блока" />
          <div className="keyman-work__grid">
            {cards.map(([cardTitle, desc], i) => (
              <article className="keyman-work-card" key={i} style={{ position: "relative" }}>
                <figure style={{ position: "relative" }}>
                  <EditableImage projectId={projectId} media={cardImages[i]} alt="" sizes="(max-width: 760px) 100vw, 17vw" onBusyChange={(b) => setBusyCount((c) => c + (b ? 1 : -1))} onReload={load} />
                </figure>
                <div>
                  <h3>
                    <EditableText
                      value={cardTitle}
                      onSave={(v) => {
                        const next = cards.map((c) => [...c]) as [string, string][];
                        next[i][0] = v;
                        saveField("cards", next);
                      }}
                      placeholder="Название карточки"
                    />
                  </h3>
                  <p>
                    <EditableText
                      value={desc}
                      multiline
                      onSave={(v) => {
                        const next = cards.map((c) => [...c]) as [string, string][];
                        next[i][1] = v;
                        saveField("cards", next);
                      }}
                      placeholder="Описание"
                    />
                  </p>
                  <span
                    className="pv-x"
                    style={{ position: "absolute", top: 6, right: 6 }}
                    onClick={() => saveField("cards", cards.filter((_, idx) => idx !== i))}
                  >
                    ✕ удалить карточку
                  </span>
                </div>
              </article>
            ))}
          </div>
          <span className="pv-add" onClick={() => saveField("cards", [...cards, ["Новая карточка", "Описание"]])}>+ карточка</span>
        </section>

        <section className="keyman-reach keyman-container">
          <div className="keyman-reach__intro">
            <EditableText as="p" className="keyman-kicker" value={str(d.reachLabel)} onSave={(v) => saveField("reachLabel", v)} placeholder="Метка блока" />
            <EditableText as="h2" value={str(d.reachTitle)} onSave={(v) => saveField("reachTitle", v)} multiline placeholder="Заголовок: результаты" />
          </div>
          <div className="keyman-reach__stats">
            {metrics.map(([value, label], i) => (
              <div key={i} style={{ position: "relative" }}>
                <strong>
                  <EditableText
                    value={value}
                    onSave={(v) => {
                      const next = metrics.map((m) => [...m]) as [string, string][];
                      next[i][0] = v;
                      saveField("metrics", next);
                    }}
                    placeholder="123"
                  />
                </strong>
                <span>
                  <EditableText
                    value={label}
                    onSave={(v) => {
                      const next = metrics.map((m) => [...m]) as [string, string][];
                      next[i][1] = v;
                      saveField("metrics", next);
                    }}
                    placeholder="подпись"
                  />
                </span>
                <span className="pv-x" style={{ marginLeft: 6 }} onClick={() => saveField("metrics", metrics.filter((_, idx) => idx !== i))}>✕</span>
              </div>
            ))}
          </div>
          <span className="pv-add" onClick={() => saveField("metrics", [...metrics, ["0", "Новый показатель"]])}>+ показатель</span>
        </section>

        {(overviewImg || str(d.overviewTitle)) && (
          <div className="keyman-closing keyman-container">
            <article className="keyman-statement">
              <EditableText as="p" className="keyman-kicker" value={str(d.overviewLabel)} onSave={(v) => saveField("overviewLabel", v)} placeholder="Метка блока" />
              <div className="keyman-statement__content">
                <figure style={{ position: "relative" }}>
                  <EditableImage projectId={projectId} media={overviewImg} alt={title} sizes="120px" onBusyChange={(b) => setBusyCount((c) => c + (b ? 1 : -1))} onReload={load} />
                </figure>
                <div>
                  <EditableText as="h2" value={str(d.overviewTitle)} onSave={(v) => saveField("overviewTitle", v)} multiline placeholder="Заголовок: итог" />
                  <EditableText as="p" value={str(d.overviewBody)} onSave={(v) => saveField("overviewBody", v)} multiline placeholder="Текст: итог" />
                </div>
              </div>
            </article>
            <article className="keyman-final-cta">
              <div className="keyman-final-cta__copy">
                <EditableText as="h2" value={str(d.ctaTitle) || title} onSave={(v) => saveField("ctaTitle", v)} multiline placeholder="Заголовок CTA" />
                <EditableText as="p" value={str(d.ctaBody)} onSave={(v) => saveField("ctaBody", v)} multiline placeholder="Текст CTA" />
                <span className="button">
                  <EditableText value={str(d.ctaButton) || "Кнопка"} onSave={(v) => saveField("ctaButton", v)} placeholder="Текст кнопки" />
                </span>
              </div>
              <figure style={{ position: "relative" }}>
                <EditableImage projectId={projectId} media={ctaImg} alt={title} sizes="(max-width: 760px) 100vw, 38vw" onBusyChange={(b) => setBusyCount((c) => c + (b ? 1 : -1))} onReload={load} />
              </figure>
            </article>
          </div>
        )}

        {/* --------------------------------------------------------- */}
        {/* Full photo & video list — add / remove / reorder          */}
        {/* --------------------------------------------------------- */}
        <section className="keyman-container" style={{ padding: "40px 0", fontFamily: "Inter,sans-serif" }}>
          <p className="keyman-kicker">Все фото проекта (по порядку показа на сайте)</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
            {photos.map((m, i) => (
              <div key={m.id} style={{ width: 130 }}>
                <div style={{ position: "relative", width: 130, height: 90, borderRadius: 8, overflow: "hidden", background: "#1f2027" }}>
                  <Image src={m.url} alt={m.alt} fill unoptimized sizes="130px" style={{ objectFit: "cover" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4, color: "#666" }}>
                  <span>#{i + 1}</span>
                  <span style={{ display: "flex", gap: 6 }}>
                    <button
                      className="pv-x"
                      style={{ background: "none", border: "none" }}
                      disabled={i === 0}
                      onClick={async () => {
                        const other = photos[i - 1];
                        await adminJson(`/api/admin/projects/${projectId}/media/${m.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: other.sortOrder }) });
                        await adminJson(`/api/admin/projects/${projectId}/media/${other.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: m.sortOrder }) });
                        await load();
                      }}
                    >
                      ↑
                    </button>
                    <button
                      className="pv-x"
                      style={{ background: "none", border: "none" }}
                      disabled={i === photos.length - 1}
                      onClick={async () => {
                        const other = photos[i + 1];
                        await adminJson(`/api/admin/projects/${projectId}/media/${m.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: other.sortOrder }) });
                        await adminJson(`/api/admin/projects/${projectId}/media/${other.id}`, { method: "PATCH", body: JSON.stringify({ sortOrder: m.sortOrder }) });
                        await load();
                      }}
                    >
                      ↓
                    </button>
                    <button
                      className="pv-x"
                      style={{ background: "none", border: "none" }}
                      onClick={async () => {
                        if (!confirm("Удалить это фото?")) return;
                        await adminJson(`/api/admin/projects/${projectId}/media/${m.id}`, { method: "DELETE" });
                        await load();
                      }}
                    >
                      ✕
                    </button>
                  </span>
                </div>
              </div>
            ))}
            <label
              style={{
                width: 130, height: 90, borderRadius: 8, border: "1px dashed #999",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, cursor: "pointer", color: "#666",
              }}
            >
              + Добавить
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBusyCount((c) => c + 1);
                  try {
                    const form = new FormData();
                    form.append("file", file);
                    await adminFetch(`/api/admin/projects/${projectId}/media`, { method: "POST", body: form });
                    await load();
                  } finally {
                    setBusyCount((c) => c - 1);
                    e.target.value = "";
                  }
                }}
              />
            </label>
          </div>

          {videos.length > 0 && (
            <>
              <p className="keyman-kicker" style={{ marginTop: 24 }}>Видео</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                {videos.map((v) => (
                  <div key={v.id} style={{ width: 200 }}>
                    <video src={v.url} controls style={{ width: "100%", borderRadius: 8 }} />
                    <button
                      className="pv-x"
                      style={{ background: "none", border: "none", fontSize: 11 }}
                      onClick={async () => {
                        if (!confirm("Удалить это видео?")) return;
                        await adminJson(`/api/admin/projects/${projectId}/media/${v.id}`, { method: "DELETE" });
                        await load();
                      }}
                    >
                      ✕ удалить
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
