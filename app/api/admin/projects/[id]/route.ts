import { NextRequest, NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { projects, projectMedia } from "../../../../../db/schema";
import { isAdminUser, requireAdminApi } from "../../../../../lib/admin/auth";
import { deleteProjectFolder, mediaPublicUrl } from "../../../../../lib/admin/media-storage";

export const runtime = "nodejs";

const VALID_SHAPES = new Set(["wide", "portrait", "standard"]);

async function loadProject(id: number) {
  const db = await getDb();
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  const project = rows[0];
  if (!project) return null;
  const media = await db
    .select()
    .from(projectMedia)
    .where(eq(projectMedia.projectId, id))
    .orderBy(asc(projectMedia.sortOrder), asc(projectMedia.id));

  return {
    id: project.id,
    slug: project.slug,
    shape: project.shape,
    featured: project.featured,
    published: project.published,
    sortOrder: project.sortOrder,
    coverMediaId: project.coverMediaId,
    categories: safeParseArray(project.categoriesJson),
    locales: safeParseObject(project.localesJson),
    media: media.map((m) => ({
      id: m.id,
      type: m.type,
      url: mediaPublicUrl(m.storageKey),
      alt: m.alt,
      sortOrder: m.sortOrder,
      contentType: m.contentType,
    })),
  };
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi(req, { requireCsrf: false });
  if (!isAdminUser(admin)) return admin;

  const { id } = await context.params;
  const project = await loadProject(Number(id));
  if (!project) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  const { id } = await context.params;
  const projectId = Number(id);

  let body: {
    shape?: string;
    categories?: string[];
    locales?: Record<string, unknown>;
    featured?: boolean;
    published?: boolean;
    sortOrder?: number;
    coverMediaId?: number | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const db = await getDb();
  const existing = await db.select({ id: projects.id }).from(projects).where(eq(projects.id, projectId)).limit(1);
  if (existing.length === 0) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (body.shape !== undefined) {
    if (!VALID_SHAPES.has(body.shape)) {
      return NextResponse.json({ error: "Invalid shape." }, { status: 400 });
    }
    update.shape = body.shape;
  }
  if (body.categories !== undefined) {
    update.categoriesJson = JSON.stringify(
      Array.isArray(body.categories) ? body.categories.filter((c) => typeof c === "string").slice(0, 20) : []
    );
  }
  if (body.locales !== undefined) {
    update.localesJson = JSON.stringify(body.locales && typeof body.locales === "object" ? body.locales : {});
  }
  if (body.featured !== undefined) update.featured = Boolean(body.featured);
  if (body.published !== undefined) update.published = Boolean(body.published);
  if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder) || 0;
  if (body.coverMediaId !== undefined) update.coverMediaId = body.coverMediaId;

  await db.update(projects).set(update).where(eq(projects.id, projectId));

  const project = await loadProject(projectId);
  return NextResponse.json({ project });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  const { id } = await context.params;
  const projectId = Number(id);

  const db = await getDb();
  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await db.delete(projects).where(eq(projects.id, projectId)); // cascades to project_media rows

  try {
    await deleteProjectFolder(project.slug);
  } catch (err) {
    // Row is already gone from the DB; log and continue rather than leaving
    // the admin panel stuck if R2 briefly errors.
    console.error(`[admin/projects] failed to clean up R2 folder for ${project.slug}:`, err);
  }

  return NextResponse.json({ message: "Deleted." });
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
