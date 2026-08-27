import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { projectMedia } from "../../../../db/schema";
import { readMediaObject } from "../../../../lib/admin/media-storage";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  const { key: keyParts } = await context.params;
  const key = keyParts.map((part) => decodeURIComponent(part)).join("/");

  // Only ever serve objects that live under the projects/ prefix this app
  // itself writes to — never an arbitrary disk path.
  if (!key.startsWith("projects/") || key.includes("..")) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const db = getDb();
  const rows = await db.select().from(projectMedia).where(eq(projectMedia.storageKey, key)).limit(1);
  const media = rows[0];
  if (!media) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let buffer: Buffer;
  try {
    buffer = await readMediaObject(key);
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": media.contentType,
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
