// Generalized fallback for this project's "moduleResolution": "bundler"
// (tsconfig.json) style relative imports, which omit file extensions
// (e.g. `from "./crypto"`). Next's bundler resolves those the TypeScript
// way; plain Node ESM requires an explicit extension. Only touches
// relative specifiers with no extension already — absolute/bare package
// specifiers are untouched and fall through to nextResolve as normal.
const EXTENSIONS = [".ts", ".tsx", ".mjs", ".js"];

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "next/server") {
    return nextResolve("next/server.js", context);
  }

  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(specifier);

  if (isRelative && !hasExtension) {
    for (const ext of EXTENSIONS) {
      try {
        return await nextResolve(specifier + ext, context);
      } catch {
        // try the next extension
      }
    }
    // Also try as a directory index, e.g. "../../db" -> "../../db/index.ts"
    for (const ext of EXTENSIONS) {
      try {
        return await nextResolve(`${specifier}/index${ext}`, context);
      } catch {
        // try the next extension
      }
    }
  }

  return nextResolve(specifier, context);
}
