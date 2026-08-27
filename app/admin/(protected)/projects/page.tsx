"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminJson } from "../../_lib/client";

type ProjectListItem = {
  id: number;
  slug: string;
  shape: string;
  featured: boolean;
  published: boolean;
  categories: string[];
  locales: Record<string, { title?: string }>;
  coverUrl: string | null;
  updatedAt: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminJson<{ projects: ProjectListItem[] }>("/api/admin/projects");
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="admin-h1">Проекты</h1>
          <p className="admin-sub">Кейсы, показываемые в разделе Work на сайте.</p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn">+ Новый проект</Link>
      </div>

      {error && <div className="admin-alert error">{error}</div>}

      {loading ? (
        <p className="admin-sub">Загрузка…</p>
      ) : projects.length === 0 ? (
        <p className="admin-sub">Проектов пока нет.</p>
      ) : (
        <div className="admin-project-grid">
          {projects.map((p) => {
            const title = p.locales?.en?.title || p.locales?.ru?.title || p.slug;
            return (
              <Link href={`/admin/projects/${p.id}`} key={p.id} className="admin-project-card">
                <div
                  className="admin-project-thumb"
                  style={p.coverUrl ? { backgroundImage: `url(${p.coverUrl})` } : undefined}
                />
                <div className="admin-project-body">
                  <h3>{title}</h3>
                  <p>{p.slug} · {p.categories.join(", ") || "без категорий"}</p>
                  <span className={`admin-badge ${p.published ? "done" : "new"}`}>
                    {p.published ? "опубликован" : "черновик"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
