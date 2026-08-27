import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../../../db";
import { projects, projectMedia } from "../../../../../../db/schema";
import { isAdminUser, requireAdminApi } from "../../../../../../lib/admin/auth";
import {
  buildStorageKey,
  classifyMediaType,
  maxBytesFor,
  putMediaObject,
} from "../../../../../../lib/admin/media-storage";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  const { id } = await context.params;
  const projectId = Number(id);

  const db = getDb();
  const rows = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  const project = rows[0];
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data with a `file` field." }, { status: 400 });
  }

  const file = form.get("file");
  const alt = String(form.get("alt") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const mediaType = classifyMediaType(file.type);
  if (!mediaType) {
    return NextResponse.json(
      { error: "Unsupported file type. Allowed: JPEG, PNG, WebP, GIF, AVIF, MP4, WebM, MOV." },
      { status: 400 }
    );
  }

  const maxBytes = maxBytesFor(mediaType);
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `File is too large. Max ${Math.round(maxBytes / (1024 * 1024))}MB for ${mediaType}s.` },
      { status: 400 }
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty." }, { status: 400 });
  }

  const storageKey = buildStorageKey(project.slug, file.name || `${mediaType}.bin`);
  const buffer = await file.arrayBuffer();

  try {
    await putMediaObject(storageKey, buffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const inserted = await db
    .insert(projectMedia)
    .values({
      projectId,
      type: mediaType,
      storageKey,
      contentType: file.type,
      sizeBytes: file.size,
      alt: alt.slice(0, 300),
      sortOrder: Date.now(),
    })
    .returning();

  return NextResponse.json({ media: inserted[0] }, { status: 201 });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi(req, { requireCsrf: false });
  if (!isAdminUser(admin)) return admin;

  const { id } = await context.params;
  const db = getDb();
  const rows = await db
    .select()
    .from(projectMedia)
    .where(eq(projectMedia.projectId, Number(id)));

  return NextResponse.json({ media: rows });
}
