import { register } from "node:module";

// Node 22's module-customization-hooks API doesn't auto-wire a resolve/load
// hook just because its file was loaded via --import — it must be
// explicitly registered via node:module's register(). This file is the one
// passed to --import; it registers the hook implementation
// (next-resolve-hook-impl.mjs), which redirects the bare "next/server"
// specifier to "next/server.js" only for this test run. Production code
// always uses the bare specifier, resolved normally by Next's own bundler
// (webpack/turbopack), which isn't affected by this at all.
register("./next-resolve-hook-impl.mjs", import.meta.url);
