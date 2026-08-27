import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";

// Point the module at a throwaway temp directory before importing it, since
// STORAGE_ROOT is read from MEDIA_STORAGE_DIR at module-load time.
const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "media-storage-test-"));
process.env.MEDIA_STORAGE_DIR = tmpRoot;

const {
  classifyMediaType,
  maxBytesFor,
  buildStorageKey,
  putMediaObject,
  readMediaObject,
  deleteMediaObject,
  mediaPublicUrl,
} = await import("../lib/admin/media-storage.ts");

test("classifyMediaType: recognizes allowed image/video types, rejects others", () => {
  assert.equal(classifyMediaType("image/jpeg"), "photo");
  assert.equal(classifyMediaType("image/png"), "photo");
  assert.equal(classifyMediaType("video/mp4"), "video");
  assert.equal(classifyMediaType("application/pdf"), null);
  assert.equal(classifyMediaType("text/html"), null);
});

test("maxBytesFor: photo and video have distinct, sane limits", () => {
  assert.equal(maxBytesFor("photo"), 15 * 1024 * 1024);
  assert.equal(maxBytesFor("video"), 250 * 1024 * 1024);
});

test("buildStorageKey: sanitizes slug and filename, always stays under projects/<slug>/", () => {
  const key = buildStorageKey("My Project!", "photo one.jpeg");
  assert.match(key, /^projects\/My-Project\/\d+-[a-z0-9]+-photo-one\.jpeg$/);
});

test("buildStorageKey: path-traversal attempts in slug/filename are neutralized", () => {
  const key = buildStorageKey("../../etc", "../../../etc/passwd");
  assert.equal(key.includes(".."), false);
  assert.match(key, /^projects\//);
});

test("buildStorageKey: two calls for the same inputs produce different keys (unique suffix)", () => {
  const a = buildStorageKey("proj", "file.png");
  const b = buildStorageKey("proj", "file.png");
  assert.notEqual(a, b);
});

test("putMediaObject/readMediaObject: round-trips file contents under STORAGE_ROOT", async () => {
  const key = buildStorageKey("roundtrip-project", "test.png");
  const data = Buffer.from("fake image bytes");
  await putMediaObject(key, data);

  const onDisk = path.join(tmpRoot, key);
  const stat = await fs.stat(onDisk);
  assert.equal(stat.isFile(), true);

  const readBack = await readMediaObject(key);
  assert.equal(readBack.toString(), data.toString());

  await deleteMediaObject(key);
  await assert.rejects(() => fs.stat(onDisk));
});

test("readMediaObject: rejects keys that try to escape STORAGE_ROOT via '..'", async () => {
  await assert.rejects(() => readMediaObject("../../etc/passwd"), /Invalid storage key/);
});

test("readMediaObject: an absolute-looking key is still contained under STORAGE_ROOT, not treated as a real absolute path", async () => {
  // path.join treats a leading "/" as just another path segment, so this
  // resolves to <STORAGE_ROOT>/etc/passwd (which doesn't exist), not the
  // real /etc/passwd. It should fail with "file not found", not succeed,
  // and it must NOT reach anything outside STORAGE_ROOT.
  await assert.rejects(() => readMediaObject("/etc/passwd"));
});

test("putMediaObject: cannot be used to write outside STORAGE_ROOT", async () => {
  await assert.rejects(
    () => putMediaObject("../outside.txt", Buffer.from("x")),
    /Invalid storage key/,
  );
  const escaped = path.join(tmpRoot, "..", "outside.txt");
  await assert.rejects(() => fs.stat(escaped));
});

test("mediaPublicUrl: URL-encodes each path segment", () => {
  const url = mediaPublicUrl("projects/my slug/file name.png");
  assert.equal(url, "/api/media/projects/my%20slug/file%20name.png");
});

test.after(async () => {
  await fs.rm(tmpRoot, { recursive: true, force: true });
});
