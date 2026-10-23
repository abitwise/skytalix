/**
 * `ABC-203` — writes one finished game's PGN text under `games/` (`ADR-0047` D2-D5). The composition
 * root binds this function and nothing else calls it.
 *
 * A CAPABILITY HOLDER (`ADR-0036` limb 1): any edit to this file routes to `In Security/NFR`. The
 * contract is the whole file: one `node:fs` import, one export, no `process.` reference, nothing
 * written to stdout or stderr.
 *
 * ONLY A `Date` REACHES THE PATH (D2). The directory is the literal `games`, relative to the process
 * working directory (D3), and the name is derived here from `pgnStamp(startedAt).stem`. `text`
 * reaches the file's bytes, never its path.
 *
 * NEVER OVERWRITE (D4). `games/` is created if absent; each candidate — the stem, then `-2` to
 * `-99` — is opened with `"wx"` (`O_CREAT | O_EXCL`), which neither overwrites nor follows a symbolic
 * link at the last component. `EEXIST` moves on; after `-99` the result is `EEXIST`. The bytes go to
 * the open descriptor; if the write or the close fails, the one path this call created is removed.
 *
 * A FAILURE IS AN ERRNO CODE AND NOTHING ELSE (D5). An error whose `code` matches `^E[A-Z0-9]+$`
 * becomes `{ ok: false, code }`. Any other throw is a defect and is rethrown, to the entry point's one
 * session `catch` (exit `70`). No message text and no stack leaves this module.
 */

import { closeSync, mkdirSync, openSync, unlinkSync, writeFileSync } from "node:fs";
import { pgnStamp } from "./pgn.ts";

/** The last suffix tried: the stem, then `-2` … `-99`. */
const LAST_SUFFIX = 99;

/** The error's errno code, or the error itself rethrown as a defect. */
function errnoOf(error: unknown): string {
  const code = (error as { code?: unknown } | null)?.code;
  if (typeof code === "string" && /^E[A-Z0-9]+$/.test(code)) return code;
  throw error;
}

export function writePgnFile(
  startedAt: Date,
  text: string,
): { readonly ok: true; readonly path: string } | { readonly ok: false; readonly code: string } {
  const { stem } = pgnStamp(startedAt);
  try {
    mkdirSync("games", { recursive: true });
  } catch (error) {
    return { ok: false, code: errnoOf(error) };
  }

  for (let suffix = 1; suffix <= LAST_SUFFIX; suffix++) {
    const path = `games/${stem}${suffix === 1 ? "" : `-${suffix}`}.pgn`;
    let descriptor: number;
    try {
      descriptor = openSync(path, "wx");
    } catch (error) {
      const code = errnoOf(error);
      if (code === "EEXIST") continue;
      return { ok: false, code };
    }

    let failure: unknown;
    try {
      writeFileSync(descriptor, text);
    } catch (error) {
      failure = error;
    }
    try {
      closeSync(descriptor);
    } catch (error) {
      failure ??= error;
    }
    if (failure === undefined) return { ok: true, path };
    unlinkSync(path);
    return { ok: false, code: errnoOf(failure) };
  }
  return { ok: false, code: "EEXIST" };
}
