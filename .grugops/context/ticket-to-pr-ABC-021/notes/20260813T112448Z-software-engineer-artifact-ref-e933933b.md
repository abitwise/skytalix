---
id: 20260813T112448Z-software-engineer-artifact-ref-e933933b
kind: artifact-ref
by: software-engineer
at: 2026-08-13T11:24:48Z
verified_by:
confidence: high
refs:
  - ABC-021
  - EPIC-002
  - N8-LANE
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - plans/traceability.md
supersedes:
---

# The diff, the tests, and where the work is

> **Hand-authored**, per the sibling `decision` notes. Not a `finding`.

## Branch and worktree

`grugops/ticket-to-pr-ABC-021`, in the worktree `../cli-chess-abc021`, branched from `main` at
`06c5427`. **NOT merged, not pushed** (this repo has no remote — see `AGENTS.md` § Branching model's
config trap). Baseline verified before work: `main` at `06c5427`, clean.

## Files changed — TWO under `src/`, and a third under `plans/`

| File | Δ | What |
| --- | --- | --- |
| `src/turn-loop.ts` | +88 / −10 | the seventh `PromptOutcome` arm, transition 16, `claimShortfall`, two restated thresholds, and the amended cadence paragraph |
| `src/turn-loop.test.ts` | +206 / −0 | `describe("ABC-021 acceptance")` — seven rows — plus four fixtures and the two-line `claim` token in the existing stub seam |
| `plans/traceability.md` | 1 row, 3 cells (+ one `_Updated:` line) | `ABC-021` only: `Code (PR/files)`, `Tests`, `Status` |

**ZERO new test FILES**, which is the count `N8-LANE` binds and which a concurrent lane (`ABC-026`)
is measuring at `06c5427`: 28 test files before, 28 after. The rows live beside `ABC-019`'s in the
file that already mocks `gameend.ts`, `history.ts` and `frame.ts`.

**`src/gameend.ts` is untouched**, and so is every other file under `src/` — including the four
`*.nfr.test.ts` files `ABC-030` is scheduled to rewrite, and `src/turn-loop.nfr.test.ts`, which
still passes unedited.

## The one production change, in nine lines

```ts
| { readonly kind: "claim" }                       // PromptOutcome, seventh arm
...
const claimable = status.claimable;                // the ply's own evaluation, never a re-derive
if (claimable === undefined) {
  messages = claimShortfall(history);              // rejected's path: no ply, no re-evaluation
  continue;
}
return { result: "draw", reason: claimable.draws[0] as ClaimableDraw, exitCode: 0 };
```

## Acceptance coverage — seven rows against the ticket's eight criteria

| Ticket criterion | Row | How it is proved |
| --- | --- | --- |
| claim at `ABC-020` A1 → claimed threefold, final frame, exit 0 | `A1` | `{draw, threefold-repetition, 0}`; 9 frames; last frame's board equals an independent `replay()`; reason asserted NOT in `EVERY_END_REASON` |
| `Re8` instead → `white-wins`/`checkmate`, no draw anywhere in the run | `A2` | every status in the run asserted non-draw, and the claim asserted available at ply 8 so the pair is not vacuous |
| nothing claimable → no ply, byte-identical FEN, no re-evaluation, teaching message, prompt re-issued | `A3` | `toFen` equality, `gameStatus` spy at 1, `events` sequence, both items present, no `(+N more)` marker, and the 2-of-3 → 3-of-3 boundary |
| engine has the move with a claim available → plays, never claims, by spy | `A4` | 5 engine calls of exactly ONE argument each, every answer a played `Move`, ply advanced past the claimable position, no claimed reason |
| fifth occurrence, nobody claims → automatic fivefold, exit 0 | `A5` | 16 plies through the loop; `{draw, fivefold-repetition, 0}` |
| availability present and read off the SINGLE `gameStatusOf` that ply | `A6` | the claim cell asserted in the FRAME's text (shape `B`); `gameStatus` and `gameStatusOf` spied at 9 for 8 plies; `repetitionCounts` at 0 |
| terminal-reason type admits both claimed reasons + `resignation` + the automatic ones, `gameend.ts` unchanged | `A7` | both claimed reasons REACHED through the loop; `EVERY_TERMINAL_REASON` (`A14`) still pins the type at ten; `gameend.ts` untouched in the diff |
| `ABC-019`'s per-ply overhead bar still holds | — | `src/turn-loop.nfr.test.ts` unedited and green at 40 / 120 / 300 plies; the claim path adds zero derives per ply |

## Fixtures added — all four ep-free, per `ABC-011`'s standing instruction

`SHUFFLE_FEN` (`ABC-020` A1's `6k1/5ppp/8/b7/8/8/5PPP/4R1K1 w - - 0 1`), `SHUFFLE_CYCLE`
(`Kh1 Bb6 Kg1 Ba5` — king and bishop only, so no en-passant square is ever set), `AT_100_FEN` and
`AT_92_FEN`. The `## Test notes` citation `src/gameend.test.ts:26-50` was checked at the source: the
`knightCycles` shape is honoured by using king/bishop rather than pawn motion; the existing
`CYCLE`/`cycles` helpers were left alone.

## Commands run

`npm run lint` · `npm run typecheck` · `npm run build` · `npm test` ·
`npx vitest run --reporter=json | jq` (skip count) · `npx vitest run src/turn-loop.test.ts` ·
`npx biome check --write src/turn-loop.test.ts src/turn-loop.ts` (one autofix pass).
Results are in the sibling `observation` note.
