# PRODUP Recovery Report

**Recovered project:** `produp-recovered`
**Recovery date:** 2026-08-13

## Canonical source and evidence

`produp-recovered` is the canonical project. It combines the original Git
history from `new-chat-2-keyman-rebuilt 4/new-chat-2-keyman-rebuilt` with the
complete working tree from `new-chat-2-content-fixed`.

Evidence:

- The Git repository contains two commits: `62b29c1` and `02c7d5b`.
- The `content-fixed` tree contains every one of the 88 files tracked by the
  latest Git commit.
- 84 of those tracked files are byte-identical to the latest commit.
- The four changed tracked files are the content-service route, its CSS, and
  two Next.js-generated TypeScript configuration updates.
- `content-fixed` additionally contains the content-service component and hero
  image.
- The functional patch files are byte-identical to the corresponding files in
  `content-fixed`; the patch README is only an application note.

Both supplied source folders were left in place and were not edited.

## Recovered and corrected

- Preserved the original Git history in the new canonical copy.
- Recovered all English, Russian, and Ukrainian routes, portfolio data, media,
  services, tests, Drizzle scaffolding, and worker examples.
- Integrated the full localized content-production service page and its hero
  asset.
- Replaced the stale vinext starter README with documentation for the actual
  Next.js project.
- Removed the build-time Google Fonts dependency so production builds do not
  require access to `fonts.googleapis.com`.
- Updated rendered-route tests to exercise the real Next.js production server
  instead of the absent legacy `dist/server/index.js` vinext output.
- Corrected narrow-screen header and large-heading rules found during browser
  QA.

## Deliberately not used

- `__MACOSX` folders and `.DS_Store` files: archive metadata, not project code.
- `.next` and `tsconfig.tsbuildinfo`: generated build artifacts.
- `content-service-patch 3`: retained in the supplied archive, but not copied
  because its functional files already exist in the canonical tree.
- Patch instructions that propose committing or pushing: no commit, push, or
  deployment was performed.

## Validation

- `npm ls --depth=0`: passed; all locked top-level dependencies are present.
- Targeted ESLint over `app`, `db`, `examples`, `tests`, `worker`, and project
  config files: passed with no findings.
- `npm test`: passed. This includes a production `next build`, generation of 21
  pages, and 3/3 rendered-route/content tests.
- Static media audit: 31 referenced `/media/*` paths checked; 0 missing.
- Exact Playwright viewport QA: 320, 375, 430, 768, 1024, and 1440 pixels.
  Home, content-service, and work routes returned HTTP 200; measured horizontal
  overflow was false and captured console/page errors were empty.

## Remaining limitations and next steps

- No deployment, external backend activation, database migration, or live
  production test was performed.
- Drizzle/D1 files are scaffolding only; `.openai/hosting.json` declares no
  active D1 or R2 binding.
- Global metadata is basic and does not yet include complete canonical,
  Open Graph, Twitter, or hreflang configuration.
- The project intentionally contains unpublished/coming-soon services and
  portfolio states; these were preserved rather than replaced with invented
  content.
- Review business copy, public metrics, outbound links, and ownership before
  publishing. Create a recovery commit only after that review.
