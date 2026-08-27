import fs from "node:fs/promises";
import path from "node:path";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB
export const MAX_VIDEO_BYTES = 250 * 1024 * 1024; // 250MB

/**
 * Root folder on disk where uploaded project photos/videos live. Each
 * project gets its own subfolder: <STORAGE_ROOT>/projects/<slug>/<file>.
 * Override with MEDIA_STORAGE_DIR (e.g. to point at a mounted volume).
 * Deliberately kept outside `public/` so nothing is served without going
 * through the validated /api/media/[...key] route.
 */
const STORAGE_ROOT = process.env.MEDIA_STORAGE_DIR || path.join(process.cwd(), "storage", "media");

export function classifyMediaType(contentType: string): "photo" | "video" | null {
  if (ALLOWED_IMAGE_TYPES.has(contentType)) return "photo";
  if (ALLOWED_VIDEO_TYPES.has(contentType)) return "video";
  return null;
}

export function maxBytesFor(type: "photo" | "video"): number {
  return type === "photo" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
}

function safeFileSegment(input: string): string {
  return (
    input
      .normalize("NFKD")
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80)
      .replace(/^-+|-+$/g, "") || "file"
  );
}

/** Every project gets its own folder on disk. */
export function buildStorageKey(projectSlug: string, originalFilename: string): string {
  const slug = safeFileSegment(projectSlug);
  const name = safeFileSegment(originalFilename);
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `projects/${slug}/${unique}-${name}`;
}

function resolveOnDisk(key: string): string {
  const resolved = path.normalize(path.join(STORAGE_ROOT, key));
  // Defense in depth: refuse anything that would escape STORAGE_ROOT, even
  // though buildStorageKey() already sanitizes every path segment.
  if (!resolved.startsWith(path.normalize(STORAGE_ROOT + path.sep))) {
    throw new Error("Invalid storage key.");
  }
  return resolved;
}

export async function putMediaObject(key: string, data: ArrayBuffer | Buffer): Promise<void> {
  const filePath = resolveOnDisk(key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.isBuffer(data) ? data : Buffer.from(data));
}

export async function readMediaObject(key: string): Promise<Buffer> {
  const filePath = resolveOnDisk(key);
  return fs.readFile(filePath);
}

export async function deleteMediaObject(key: string): Promise<void> {
  const filePath = resolveOnDisk(key);
  await fs.rm(filePath, { force: true });
}

/** Deletes a project's entire folder — used when a project is deleted. */
export async function deleteProjectFolder(projectSlug: string): Promise<void> {
  const dirPath = resolveOnDisk(`projects/${safeFileSegment(projectSlug)}`);
  await fs.rm(dirPath, { recursive: true, force: true });
}

/** Public URL the site/admin panel uses to display an uploaded file. */
export function mediaPublicUrl(key: string): string {
  return `/api/media/${key.split("/").map(encodeURIComponent).join("/")}`;
}
