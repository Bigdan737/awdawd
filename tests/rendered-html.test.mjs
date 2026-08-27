import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import next from "next";
import test, { after, before } from "node:test";

const projectDir = fileURLToPath(new URL("..", import.meta.url));
const app = next({ dev: false, dir: projectDir });
const server = createServer((request, response) =>
  app.getRequestHandler()(request, response),
);
let origin;

before(async () => {
  await app.prepare();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  assert.ok(address && typeof address === "object");
  origin = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  await app.close();
});

async function render(pathname) {
  return fetch(`${origin}${pathname}`, {
    headers: { accept: "text/html" },
  });
}

test("server-renders the PRODUP home without starter or prototype labels", async () => {
  const response = await render("/en");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Content that grows business/);
  assert.match(html, /BUSINESS\./);
  assert.match(html, /PRODUP\./);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Prototype v1/i);
});

test("server-renders the approved multi-page routes", async () => {
  const checks = [
    ["/en/work", /Our Work/],
    ["/en/services", /Services/],
    ["/en/work/samal-construction", /Samal Construction/],
    ["/ru/work/keyman-chicago", /KeyMan Chicago/],
    ["/ru/services", /Услуги/],
    ["/uk/work", /Наші роботи/],
  ];

  for (const [pathname, expected] of checks) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(await response.text(), expected, pathname);
  }
});

test("project data contains only the nine approved projects", async () => {
  const source = await readFile(
    new URL("../app/content.ts", import.meta.url),
    "utf8",
  );
  const approved = [
    "Samal Construction",
    "KeyMan Chicago",
    "Joeking Drives",
    "Worshiphill Church",
    "E-Commerce Brand",
    "AI Commercial",
    "Design Painting",
    "Luxury Real Estate",
    "Podcast Series",
  ];
  const removed = [
    "Future Retail",
    "Quiet Objects",
    "After Dark",
    "New Habitat",
    "Signal Studio",
    "Synthetic Summer",
  ];

  for (const project of approved) assert.match(source, new RegExp(project));
  for (const project of removed) assert.doesNotMatch(source, new RegExp(project));
});
