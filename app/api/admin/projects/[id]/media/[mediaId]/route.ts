import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "../../../../../../../db";
import { projectMedia } from "../../../../../../../db/schema";
import { isAdminUser, requireAdminApi } from "../../../../../../../lib/admin/auth";
import { deleteMediaObject } from "../../../../../../../lib/admin/media-storage";

export const runtime = "nodejs";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string; mediaId: string }> }
) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  const { id, mediaId } = await context.params;
  const projectId = Number(id);
  const mediaIdNum = Number(mediaId);

  let body: { alt?: string; sortOrder?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (body.alt !== undefined) update.alt = String(body.alt).slice(0, 300);
  if (body.sortOrder !== undefined) update.sortOrder = Number(body.sortOrder) || 0;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const db = await getDb();
  await db
    .update(projectMedia)
    .set(update)
    .where(and(eq(projectMedia.id, mediaIdNum), eq(projectMedia.projectId, projectId)));

  return NextResponse.json({ message: "Updated." });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string; mediaId: string }> }
) {
  const admin = await requireAdminApi(req);
  if (!isAdminUser(admin)) return admin;

  const { id, mediaId } = await context.params;
  const projectId = Number(id);
  const mediaIdNum = Number(mediaId);

  const db = await getDb();
  const rows = await db
    .select()
    .from(projectMedia)
    .where(and(eq(projectMedia.id, mediaIdNum), eq(projectMedia.projectId, projectId)))
    .limit(1);
  const media = rows[0];
  if (!media) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await db.delete(projectMedia).where(eq(projectMedia.id, mediaIdNum));

  try {
    await deleteMediaObject(media.storageKey);
  } catch (err) {
    console.error(`[admin/media] failed to delete R2 object ${media.storageKey}:`, err);
  }

  return NextResponse.json({ message: "Deleted." });
}
