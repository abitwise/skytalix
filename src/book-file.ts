/**
 * `ABC-095` — the opening book's bytes, for the probe's injected `read` (`ADR-0037` § Addendum —
 * 2026-10-12, R1). The composition root binds this function and nothing else calls it.
 *
 * A CAPABILITY HOLDER (`ADR-0036` limb 1, § S1): any edit to this file routes to `In Security/NFR`.
 * The contract is the whole file: one import, one export with no parameter, one read of one fixed
 * path resolved from this module's own URL. No argument, option or environment value reaches the
 * path. Nothing runs at import (`N-LOAD`): the read happens when the probe first asks. A failure is
 * left to throw, because a throwing `read` is the probe's documented input (`ABC-094`), and the probe
 * turns it into its one warning.
 */

import { readFileSync } from "node:fs";

export function readBookFile(): Uint8Array {
  return readFileSync(new URL("../data/opening-book/book.json", import.meta.url));
}
