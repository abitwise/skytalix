/**
 * `ABC-041` — the render seam: `renderBoard` + `renderStatusPanel` + `renderHistory` →
 * `assembleFrame` → a frame's rows. `ADR-0009` clause 9b puts frame composition ENTIRELY behind one
 * render seam, and this module is that seam and nothing else.
 *
 * IT IS `ABC-019`'s PUBLISHED `RenderSeam`, NOT A SHAPE THAT RESEMBLES IT. The returned function's
 * type is IMPORTED from `src/turn-loop.ts` rather than re-spelled here, so `EPIC-006`'s
 * `runTurnLoop({ render })` needs no adapter and no cast, and a drift on either side is a typecheck
 * failure AT THIS FILE rather than a surprise at an entry point that does not exist yet — the only
 * place that drift can currently be caught, since this seam has no production consumer until
 * `ABC-042`. The import is TYPE-ONLY and load-bearing as such; see the last paragraph.
 *
 * THE GLYPH MODE AND THE ORIENTATION ARE BOUND ONCE, AT CONSTRUCTION, AS VALUES (`ABC-019` `[D30]`).
 * Neither is a parameter of a frame, neither is derived, and no ambient signal is read for either.
 * `ABC-042` owns argv, resolving `random`, and which colour the human is; the orientation arrives
 * here already resolved. BA/PM's ruling (`ABC-041`) is that the board is drawn from the human's
 * side — `--colour black` is `black-bottom` — which is a decision about what the CALLER passes and
 * costs this module no branch at all.
 *
 * IT DERIVES NOTHING, AND THAT IS `NFR-002`'s STRUCTURAL PREMISE RATHER THAN AN OPTIMISATION.
 * `status` and `thinking` are the loop's own, evaluated once per ply before the frame, and `status`
 * reaches `renderStatusPanel` as the SAME OBJECT the caller passed — never an equal one. The
 * repetition derive is an `O(plies)` replay that belongs to the loop's `gameStatusOf` and nowhere
 * else; a renderer that re-derived a status in order to draw it would move that replay onto the
 * per-frame path while every content assertion in this suite stayed green.
 *
 * IT NAMES NO ROW COUNT — `ADR-0009` clause 9. The height is the panels' and `assembleFrame`'s; this
 * file holds no numeric literal at all, so there is no count here that can drift from
 * `frameHeight`'s.
 *
 * `src/history.ts` IS NOT IMPORTED, NOT EVEN AS A TYPE. The `GameHistory` this seam reads
 * `.position` off arrives through `RenderSeam`'s own parameter types, so the house's type-only
 * import is not needed and the strongest form of `A7` is the one that costs nothing. This module IS
 * the declared `COMPOSITION_ROOT` in `src/history-pane.nfr.test.ts`, and the frame path is DERIVED
 * from it (`ADR-0029`: the root's load closure plus every module a frame call loads). The one
 * runtime edge that could breach the premise is the seam type's own module — `turn-loop.ts`
 * imports `history.ts` at runtime — so the `import type` below must STAY `import type`. The
 * probe rooted here is what holds that, on every run, and it is armed.
 */

import { assembleFrame } from "./frame.ts";
import { renderHistory } from "./history-pane.ts";
import { type GlyphMode, type Orientation, renderBoard } from "./render.ts";
import { renderStatusPanel } from "./status-panel.ts";
import type { RenderSeam } from "./turn-loop.ts";

/**
 * Build the seam for a session. Every frame it returns is the merged four composed in the one order
 * `ADR-0009` clause 9b fixes; the panels are CALLED, never re-implemented.
 */
export function makeRenderSeam(mode: GlyphMode, orientation: Orientation): RenderSeam {
  return (history, status, thinking, messages) =>
    assembleFrame(
      {
        board: renderBoard(history.position, mode, orientation),
        status: renderStatusPanel(history, status, thinking),
        history: renderHistory(history),
        messages,
      },
      mode,
    );
}
