/**
 * `ABC-315` — the version line, `skytalix 1.0.0`, for `--version` on both entry points. The version
 * is written in one place, `package.json` (`VERSIONING.md`), and read from there when asked: no copy
 * of it exists in the code.
 *
 * A CAPABILITY HOLDER in `src/book-file.ts`'s shape (`ADR-0036` limb 1): one import, one export with
 * no parameter, one read of one fixed path resolved from this module's own URL. `../package.json` is
 * the repository root from `src/` and from the built `dist/` alike. Nothing runs at import.
 */

import { readFileSync } from "node:fs";

export function readVersionLine(): string {
  const { name, version } = JSON.parse(
    readFileSync(new URL("../package.json", import.meta.url), "utf8"),
  ) as { readonly name: string; readonly version: string };
  return `${name} ${version}`;
}
