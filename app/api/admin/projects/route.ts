import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { projects, projectMedia } from "../../../../db/schema";
import { isAdminUser, requireAdminApi } from "../../../../lib/admin/auth";
import { mediaPublicUrl } from "../../../../lib/admin/media-storage";

export const runtime = "nodejs";

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const VALID_SHAPES = new Set(["wide", "portrait", "standard"]);

export async function GET(req: NextRequest) {
  const admin = await requireAdminApi(req, { requireCsrf: false });
  if (!isAdminUser(admin)) return admin;

  const db = getDb();
  const rows = await db.select().from(projects).orderBy(desc(projects.sortOrder), desc(projects.updatedAt));

  const result = await Promise.all(
    rows.map(async (project) => {
      const cover = project.coverMediaId
        ? await db.select().from(projectMedia).where(eq(projectMedia.id, project.coverMediaId)).limit(1)
        : [];
      return {
        id: project.id,
        slug: project.slug,
        shape: project.shape,
        featured: project.featured,
        published: project.published,
        sortOrder: project.sortOrder,
        categories: safeParseArray(project.categoriesJson),
        locales: safeParseObject(project.localesJson),
        coverUrl: cover[0] ? mediaPublicUrl(cover[0].storageKey) : null,
        updatedAt: project.updatedAt,
      };
    })
  );

  return NextResponse.json({ projects: result });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  let body: {
    slug?: string;
    shape?: string;
    categories?: string[];
    locales?: Record<string, unknown>;
    featured?: boolean;
    published?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const slug = (body.slug ?? "").trim().toLowerCase();
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase letters, numbers and single hyphens (e.g. my-project)." },
      { status: 400 }
    );
  }

  const shape = VALID_SHAPES.has(body.shape ?? "") ? (body.shape as string) : "standard";
  const categories = Array.isArray(body.categories) ? body.categories.filter((c) => typeof c === "string").slice(0, 20) : [];
  const locales = body.locales && typeof body.locales === "object" ? body.locales : {};

  const db = getDb();
  const existing = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, slug)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "A project with this slug already exists." }, { status: 409 });
  }

  const inserted = await db
    .insert(projects)
    .values({
      slug,
      shape,
      categoriesJson: JSON.stringify(categories),
      localesJson: JSON.stringify(locales),
      featured: Boolean(body.featured),
      published: Boolean(body.published),
      sortOrder: 0,
    })
    .returning();

  return NextResponse.json({ project: inserted[0] }, { status: 201 });
}

function safeParseArray(json: string): string[] {
  try {
    const value = JSON.parse(json);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function safeParseObject(json: string): Record<string, unknown> {
  try {
    const value = JSON.parse(json);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}
