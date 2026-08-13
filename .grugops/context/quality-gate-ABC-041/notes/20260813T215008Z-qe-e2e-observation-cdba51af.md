---
id: 20260813T215008Z-qe-e2e-observation-cdba51af
kind: observation
by: qe-e2e
at: 2026-08-13T21:50:08Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.ts
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - .grugops/factory.config.json
supersedes: 
---

# Thirteen mutants on an md5-pinned tree. NINE killed, FOUR survived the delivered suite — and two of the four are behavioural.

Every mutant was applied to a tree pinned by `md5 -r`, run, reverted, and the md5 re-verified before
the next one. The tree is byte-restored; `git status` shows only this gate's own additions. The
Engineer's five mutants were **rebuilt, not read** — all five reproduce.

## Killed by the delivered suite

| # | mutant | killed by |
|---|---|---|
| `X1` | orientation hardcoded to `"white-bottom"` | `A4` **only** |
| `X4` | seam passes an **equal-but-not-identical** `GameStatus` (`{ ...status }`), calling no derive | `A2` **only**, at the `toBe` on line 177 |
| `X5` | **runtime** `history.ts` import + `gameStatusOf` re-derive | `A2`, `A6`/`A7` text, **and both merged probe guards** — 4 reds |
| `X6a` | `render-seam.ts` added to `LICENSED_DRIVERS` **as well** | `A9` **and** the merged licence equality |
| `X6b` | added to `LICENSED_DRIVERS` **instead of** `FRAME_PRODUCERS` | `A9`, both halves |
| `X6c` | the entry review's predicted wrong move: runtime import **plus** self-licence | `A9` + the closure probe — the licence red is silenced, the closure red is not |
| `X10` | `"unicode"` hardcoded at `assembleFrame` | `A5` **only** |

**`X4` is the one the ticket's `## Test notes` row 1 was written for and it lands exactly**: a
re-deriving seam that calls nothing still dies on reference identity. `A2` discriminates.

**Gap 1 from the entry review is closed MECHANICALLY — verified, not accepted.** `X6a`/`X6b`/`X6c`
all red on `A9`. The Engineer's claim holds and `X6c` confirms its reasoning: adding the module to
the licence silences the licence guard and leaves the closure guard standing, so the wrong move does
not even work.

## SURVIVED — four, on a full `npm test`

| # | mutant | result | what it means |
|---|---|---|---|
| `X3b` | a **second board implementation**, byte-identical, in its own module; `render.ts` left with type-erased specifiers only | **824/824 green**, `tsc` 0 | `A4`'s purpose clause is false, and `A8` is green with `renderBoard` at **zero** runtime consumers |
| `X11` | the seam **discards `messages`** (`messages: []` hardcoded) | **824/824 green**, `npm run lint` **exit 0** | the seam's 4th parameter reaches nothing that is asserted |
| `X12` | the seam **discards `thinking`** (`false` hardcoded) | **824/824 green**, lint exit 0 | `## Scope`'s "passed through verbatim" is asserted of `status` only |
| `X2` | the seam pads the board itself, inflating the frame width | red **only** on the whole-frame equality, never on the named `A4` line | the named `A4` repair is circular — see the decision note |

Plus three **textual-evasion** survivors, which are criterion-wording problems rather than build
defects:

| # | mutant | result |
|---|---|---|
| `X7` | a hardcoded 23-row clamp spelled **without a digit** (`"xxx…".length`) | **824/824 green** — `A3`'s "no numeric row-count literal" is enforced as "no digit character" |
| `X8` | an ambient env read that never spells `process.` (`globalThis["process"]`) | **8/8 green, lint clean** — `A6`'s substring grep is one keystroke wide |
| `X9` | a literal `HEIGHT = 23` **and** `process.env.…` moved into a sibling module one import away | **824/824 green** — `A3`/`A6` read `src/render-seam.ts`, and the criteria say **"over the diff"** |

`X9` answers the subtask's question directly: **yes, both criteria are satisfied by a build that
moves the offending text out of the file.** The criteria as written say *"asserted textually over the
diff"* and *"asserted over the diff, not by inspection"*; the delivered instruments assert over one
**file**. That is a mismatch between the criterion and its instrument, not a cheat by the Engineer —
the delivered module puts nothing in a sibling.

## `A7`'s probe measures LOAD time. `NFR-002` is about CALL time.

`X5b` — `void import("./history.ts").then((m) => m.gameStatusOf(history))` **inside the returned
closure**: **19/19 green** across `src/render-seam.test.ts` and `src/history-pane.nfr.test.ts`.

Three guards miss it at once, each for its own reason:

- the `A6`/`A7` text check greps `from "./history.ts"` — a dynamic `import()` has no `from`;
- the merged licence regex is anchored to statement-form `^(?:import|export)\s+…` — an
  `import()` expression is neither;
- **the closure probe imports the root module and never calls the seam**, so a per-frame edge never
  fires during the measurement.

`A2`'s spies miss it too, because they are synchronous and the derive is a microtask.
`NFR-002`'s premise is explicitly about the **per-frame** path. `ABC-041` is the first module where
"the frame path" is a *function call* rather than a module graph, and the merged probe's reach did
not move with it.

## `A8`'s instrument counts IMPORT STATEMENTS, not consumers

The regex `^(?:import|export)\s+(?!type\b)…"\./render\.ts";` excludes `import type { X } from …` but
**matches** `import { type X, type Y } from "./render.ts";` — every specifier type-only, zero use of
`renderBoard`. Verified against all three forms.

The ticket's own `## Problem` draws exactly this distinction — *"production importers: 2, BOTH
`import type { GlyphMode }` → renderBoard has 0 runtime consumers"* — and `EPIC-006`'s `P2 → P1` raise
rests on the **consumer** count. `X3b` makes `A8` green while `renderBoard` has **0** consumers: the
pathology the epic exists to end, reported as cured.

## One dial worth naming

`quality.lint.strict` is **`false`**, so `X11`'s only signal — a `noUnusedFunctionParameters`
**warning** on `messages` — does not fail `npm run lint` (exit 0). It is also marked `FIXABLE`, and
`quality.lint.autofix` is **`true`**, so the bounded self-fix loop would erase the one trace that
existed. Nothing here is misconfigured; it is recorded so no one later mistakes that warning for a
guard.
