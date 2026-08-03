---
task: ticket-to-pr-ABC-011
subtask: engineer-abc011-fix-purity
role: software-engineer
claimed_at: 2026-08-03T14:10:00Z
claimed_by: software-engineer
method: MANUAL-BY-HAND
---

Claimed BY HAND. This install has no `scripts/` directory at all — no `scripts/claim.js`, so
Workflow 17 step 2's atomic `mkdirSync` claim primitive could not be executed and nothing here
provides exclusivity. Queue width is 1 and no contention is possible, so the claim is degenerate.
Recorded rather than glossed, exactly as the queued subtask instructed and as all six prior subtasks
on this project recorded.

Workflow 16's sanctioned writer (`scripts/context-io.ts` / `mcp__grugops__propose_note`) is likewise
absent, so this role's context notes are hand-written into
`.grugops/context/ticket-to-pr-ABC-011/notes/` in the schema's exact shape. **No `finding` is
written — none is admissible without a §14 gate to issue a `§14-gate#<id>` stamp, and
`context.human_admission` is `off` so no `human:<name>` stamp is available either. Nothing is
self-stamped.** The kinds used are `decision`, `observation`, `claim` and `artifact-ref`.

The `ref:` context folder was read BEFORE any code was written: all twenty-three prior notes under
`.grugops/context/ticket-to-pr-ABC-011/notes/`, including this role's OWN four notes of 2026-08-03
from the FIRST dev pass, which were re-read rather than remembered, because that pass's trajectory is
gone. The ticket's two dated `### ANSWERED` blocks are the contract; the 2026-08-03 one is this
pass's and the 2026-08-02 one is still binding.

This is the SECOND dev pass on `ABC-011`. It fixes the MEDIUM purity defect the project owner
declined to merge with. No branch was created and nothing was merged — the work sits on the existing
`grugops/ticket-to-pr-ABC-011`.

---
completed_at: 2026-08-03T15:20:00Z
outcome: FIXED — the two guards of the SECOND `### ANSWERED` block built exactly as ruled, and EACH
  PROVEN LOAD-BEARING BY DELETING IT AND RUNNING THE SUITE rather than by argument: guard (a) deleted
  -> exactly 4 named tests fail (both pure-divergence FENs, at the predicate AND the key level);
  guard (b) deleted -> exactly 7 (the three empty-target corruptions at both levels, plus the
  every-input purity sweep); BOTH deleted -> 13 fail and 193 pass, exactly the pre-fix baseline. THE
  TWO FAILURE SETS ARE DISJOINT — neither guard subsumes the other and neither can be removed with
  the suite green. One honesty note: QE-3 (`4k3/8/8/8/3p4/4P3/8/4K3 b - e3 0 1`) is closed by EITHER
  guard alone, so it kills neither single-guard mutant; named rather than counted.
  ALL SIX KNOWN REPRODUCTIONS CLOSED, each re-derived independently against the shipped tree BEFORE
  any code was written. Production diff `src/legal.ts` +32/-6 (only FOUR executable lines) and
  `src/zobrist.ts` +5/-1 DOC COMMENT ONLY; `zobristKey`'s condition and signature, `src/apply.ts`,
  `src/moves.ts`, `src/gameend.ts`, `src/position.ts`, `src/fen.ts` byte-untouched; no dependency
  added. Both owed doc-comment corrections landed, plus the `memory-bank/30-architecture.md`
  `Hashing` cell three prior roles declined.
  TDD red-first and MEASURED red: all 13 new tests failed against the shipped tree before the guards
  existed, with all 33 pre-existing tests in the two files green throughout. Purity asserted over the
  FULL position state (128 board bytes + all five scalars), never `toFen`, and for EVERY ep-square
  value — 665 inputs across five boards — not merely reachable ones.
  GATES: `npm test` 206 passed / 9 files / 0 failed, skip count 0 (was 193); `npm run lint` exit 0
  (2 pre-existing biome config-schema infos); `npm run typecheck` exit 0; `npm run build` exit 0.
  NO EXISTING TEST MODIFIED — ZERO changed pre-existing lines in either test file, not even a widened
  import, which is stricter than the first pass managed.
  COST re-derived by me, not inherited (Apple M3 Mac15,13 / Node v24.12.0 / darwin-arm64,
  `UNKNOWN - verify` elsewhere; 9 alternating rounds, medians, with the two structurally-zero NFR-005
  anchors kept as a NULL CONTROL that landed at +0.06 and +0.20 ns): isolated predicate -0.3 to
  +2.6 ns per call on ep-set nodes = <= +0.41 ns amortized per node, 0.13% of a ~313 ns key — inside
  the design hop's published +0.9…+3.0 ns band without exceeding its ceiling; 20-25x CHEAPER on the
  invalid class, reproducing its 20-27x; NFR-005 MET at both anchors (startpos 291.3 ns vs ~450,
  kiwipete 313.6 ns vs 432-459); no-ep sub-bar ZERO structurally. My FIRST benchmark protocol was
  wrong and is recorded as such — its null control read 1.26x on a delta that cannot exist.
  EXHAUSTIVE WALK re-derived on my own script, a fifth independent time and to the number: 518,474
  nodes / 81,397 ep-set (15.70%) / 0 answers changed / 0 keys changed / 0 firings of either guard /
  0 impure nodes either tree.
  Board: In Development 1/3 -> 0/3, In Review 0/3 -> 1/3; no limit approached, no override taken.
  NO PR — this repo has no git remote, so no link exists and none was invented. ABC-009, ABC-010 and
  the `generateMoves` own-piece-capture defect CARRIED, not fixed (the last re-verified as still
  reproducing and still routed to BA/PM). Nothing merged, nothing deployed — a human holds both.
moved: pending/ -> claimed/ticket-to-pr-ABC-011-dev2/ -> done/ticket-to-pr-ABC-011-dev2/ — ALL BY
  HAND (no scripts/claim.js in this install).
