import { eq, and, asc, desc } from "drizzle-orm";
import { getDb } from "../db";
import { projects as projectsTable, projectMedia } from "../db/schema";
import { mediaPublicUrl } from "./admin/media-storage";
import { projects as staticProjects, type Project, type Locale, type Category } from "../app/content";

function safeParseArray(json: string): string[] {
  try {
    const value = JSON.parse(json);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function safeParseObject(json: string): Record<string, { title?: string; services?: string }> {
  try {
    const value = JSON.parse(json);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

/**
 * Every published project created in the admin panel, converted to the
 * same `Project` shape the static `content.ts` array uses, localized for
 * the given `locale`, so it can be dropped straight into the existing
 * Work grid / homepage components.
 */
export async function getAdminProjects(locale: Locale): Promise<Project[]> {
  let db;
  try {
    db = getDb();
  } catch (err) {
    // DB not reachable (e.g. misconfigured storage path) — fail soft so the
    // static site keeps working even if the admin panel's DB is down.
    console.error("[site-projects] Failed to open DB:", err);
    return [];
  }

  const rows = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.published, true))
    .orderBy(desc(projectsTable.sortOrder), desc(projectsTable.updatedAt));

  const result: Project[] = [];
  for (const row of rows) {
    const localeData = safeParseObject(row.localesJson)[locale] ?? {};
    const categories = safeParseArray(row.categoriesJson) as Category[];

    let image: string | undefined;
    if (row.coverMediaId) {
      const cover = await db
        .select()
        .from(projectMedia)
        .where(and(eq(projectMedia.id, row.coverMediaId), eq(projectMedia.projectId, row.id)))
        .limit(1);
      if (cover[0]) image = mediaPublicUrl(cover[0].storageKey);
    }
    if (!image) {
      // No explicit cover set — fall back to the first photo uploaded.
      const firstPhoto = await db
        .select()
        .from(projectMedia)
        .where(and(eq(projectMedia.projectId, row.id), eq(projectMedia.type, "photo")))
        .orderBy(asc(projectMedia.sortOrder), asc(projectMedia.id))
        .limit(1);
      if (firstPhoto[0]) image = mediaPublicUrl(firstPhoto[0].storageKey);
    }

    result.push({
      slug: row.slug,
      title: localeData.title || row.slug,
      services: localeData.services || "",
      image,
      categories,
      shape: (row.shape as Project["shape"]) || "standard",
      featured: row.featured,
      published: true,
    });
  }

  return result;
}

export type AdminProjectDetail = {
  slug: string;
  title: string;
  services: string;
  challenge: string;
  approach: string;
  categories: Category[];
  media: { type: "photo" | "video"; url: string; alt: string }[];
};

/** A single published admin-panel project with its full media gallery, for the case-study page. */
export async function getAdminProjectDetail(slug: string, locale: Locale): Promise<AdminProjectDetail | null> {
  let db;
  try {
    db = getDb();
  } catch (err) {
    console.error("[site-projects] Failed to open DB:", err);
    return null;
  }

  const rows = await db
    .select()
    .from(projectsTable)
    .where(and(eq(projectsTable.slug, slug), eq(projectsTable.published, true)))
    .limit(1);
  const row = rows[0];
  if (!row) return null;

  const localeData = safeParseObject(row.localesJson)[locale] ?? {};
  const categories = safeParseArray(row.categoriesJson) as Category[];

  const mediaRows = await db
    .select()
    .from(projectMedia)
    .where(eq(projectMedia.projectId, row.id))
    .orderBy(asc(projectMedia.sortOrder), asc(projectMedia.id));

  return {
    slug: row.slug,
    title: localeData.title || row.slug,
    services: localeData.services || "",
    challenge: (localeData as { challenge?: string }).challenge || "",
    approach: (localeData as { approach?: string }).approach || "",
    categories,
    media: mediaRows.map((m) => ({
      type: m.type as "photo" | "video",
      url: mediaPublicUrl(m.storageKey),
      alt: m.alt,
    })),
  };
}

/** Static (content.ts) projects + published admin-panel projects, for the Work grid. */
export async function getAllProjects(locale: Locale): Promise<Project[]> {
  const dbProjects = await getAdminProjects(locale);
  // Admin-created projects are shown first (most recently updated first);
  // the hand-built static case studies follow.
  return [...dbProjects, ...staticProjects];
}
