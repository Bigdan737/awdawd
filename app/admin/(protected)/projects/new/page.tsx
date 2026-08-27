"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminJson } from "../../../_lib/client";

const SHAPES = ["standard", "wide", "portrait"];

export default function NewProjectPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [shape, setShape] = useState("standard");
  const [categories, setCategories] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const data = await adminJson<{ project: { id: number } }>("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify({
          slug,
          shape,
          categories: categories.split(",").map((c) => c.trim()).filter(Boolean),
          locales: { en: { title }, ru: { title } },
        }),
      });
      router.push(`/admin/projects/${data.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать проект.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="admin-h1">Новый проект</h1>
      <p className="admin-sub">После создания вы сможете добавить фото, видео и полные тексты по языкам.</p>

      {error && <div className="admin-alert error">{error}</div>}

      <div className="admin-card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Slug (латиница, дефисы)</label>
            <input className="admin-input" required value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-project" />
          </div>
          <div className="admin-field">
            <label>Название (черновое, можно изменить позже)</label>
            <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="admin-row">
            <div className="admin-field">
              <label>Форма карточки</label>
              <select className="admin-select" value={shape} onChange={(e) => setShape(e.target.value)}>
                {SHAPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label>Категории (через запятую)</label>
              <input className="admin-input" value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="youtube, commercial" />
            </div>
          </div>
          <button className="admin-btn" type="submit" disabled={busy}>
            {busy ? "Создаём…" : "Создать проект"}
          </button>
        </form>
      </div>
    </div>
  );
}
