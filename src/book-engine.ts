/**
 * `ABC-095` — the opening book in front of the engine's move choice. `ADR-0012` clause 2: a
 * decorator of `EngineSeam`, owned by neither `EPIC-004`'s search nor `EPIC-002`'s loop.
 *
 * On a book hit it returns the book move and NEVER calls the inner seam, so the search is not
 * entered at all. On a miss, or with no book (the probe switched itself off and warned once), it
 * returns the inner seam's move and nothing else happens: no line, no write, no state.
 *
 * The book move needs no guard here. The loop's `wasGenerated` check already applies to whatever an
 * `EngineSeam` returns (`ADR-0012` clause 3(a)), and the probe re-validates every entry against
 * `legalMoves` first. The randomness is the probe's, injected at the root (clause 3(b), `ADR-0037`
 * D3); this module reads none.
 */

import type { BookProbe } from "./book.ts";
import type { EngineSeam } from "./turn-loop.ts";

export function withBook(probe: BookProbe, inner: EngineSeam): EngineSeam {
  return async (history) => probe.bookMove(history.position) ?? inner(history);
}
