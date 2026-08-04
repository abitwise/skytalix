---
id: 20260804T140500Z-software-engineer-observation-f82d9b50
kind: observation
by: software-engineer
at: 2026-08-04T14:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - ADR-0002
  - NFR-002
  - NFR-003
  - EPIC-002
  - EPIC-004
  - src/history.ts
  - src/history.test.ts
  - plans/nfr-catalog.md
  - memory-bank/30-architecture.md
  - 20260730T143500Z-architect-design-decision-d7a42f7a
  - 20260730T143800Z-architect-design-decision-38b772b6
supersedes: 
---

# The measurements: seven mutants, one measured DAG, five NFR bars, and one instrument that failed its own control

Every number below was produced by this role on this machine during this subtask. Nothing is
transcribed from the seam notes; where a figure reproduces one of theirs, that is stated as a
reproduction and not as a citation.

## 1. The suite kills what it is supposed to kill — seven mutants, all killed

Written after the tests were green, because a green suite proves nothing about a suite. Each mutant
was applied to the shipped `src/history.ts`, the file was restored byte-identically afterwards
(verified by `diff`), and the failing test titles were read off vitest's JSON reporter rather than
eyeballed.

| # | Mutant of the shipped module | Tests it kills |
|---|---|---:|
| M1 | `repetitionCounts` folds `keyHistory().slice(0, -1)` — counts the past, drops the CURRENT position | 2 |
| M2 | `keyHistory` starts from `[]` instead of `[zobristKey(initial)]` | 5 |
| M3 | `takeBack` truncates the list but never replays the board | 2 |
| M4 | `takeBack`'s `Math.max(0, …)` clamp removed | 1 |
| M5 | `playMove` applies the move but does not append it | 6 |
| M6 | `playMove` appends the move but does not apply it | 6 |
| M7 | `keyHistory` records the key BEFORE the move (off-by-one) | 1 |

**Two of these are thin and are named as such rather than counted as coverage.** M4 and M7 are each
killed by exactly one assertion, and M3 is killed by the criterion-5 and criterion-7 tests but
**NOT** by criterion 2's own test — see the claim note.

## 2. The deep-equal instrument was controlled, not trusted

Criterion 2 turns on `repetitionCounts(history)` being deep-equal to a fresh replay's. If
`toEqual` on a `Map<bigint, number>` were permissive, that assertion would pass on anything. Probed
directly in a throwaway test (written, run, deleted; it is not in the repository): the instrument
**accepts** a reordered equal map and **rejects** a differing count, a missing entry, and an empty
map. It discriminates.

## 3. The module graph, rebuilt from `src/*.ts` rather than asserted

| Fact | Measured |
|---|---|
| production modules | **10** (was 9) |
| cycles | **0** |
| max depth | **6 → 7** |
| `history.ts` level | **7**, alone above `gameend.ts` (6) |
| `history.ts` edges | `fen`, `apply`, `zobrist`, `gameend`, `moves` (type only), `position` (type only) — **all downward** |
| `legal.ts` / `san.ts` imported | **no** and **no** |
| modules importing `history.ts` | **NONE** |

The zero-importer result is the load-bearing one: it is what keeps the rules core ignorant of the
session, exactly as `ADR-0002`'s Consequences require. `memory-bank/30-architecture.md` was updated
to match, including the bullet that read *"who owns game history is an open decision, not a recorded
one"* — this ticket falsifies that sentence, so leaving it would have been the more invasive choice.

## 4. The five NFR bars — MEASURED AND ALL MET

**Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64. `UNKNOWN - verify` on any other
hardware** — the standing convention in `plans/nfr-catalog.md`.

Protocol, following the cautions that file has recorded four times: the harness lives **outside the
repository** and writes nothing into it; its own process, doing nothing else; a **discarded warm-up
round**; **11 rounds** with the **cell order rotated every round**; per-round means, **median** of
the rounds; **two full independent samples**. **No wall-clock assertion was added to the suite** —
that is this project's standing rule, because such a test passes or fails on the machine that runs
it.

**Population, stated because this file has learned that lesson too:** one deterministic LCG game
from the start position — the same game `src/history.test.ts` plays — so a ply count means the same
thing in both places.

| Bar (120 plies unless noted) | Sample 1 | Sample 2 | Bar | Ratio | Verdict |
|---|---:|---:|---:|---:|:--|
| `takeBack(history, 2)` (upper bound) | 2.45 µs | 2.45 µs | ≤ 5 µs | 0.49x | **MET** |
| `keyHistory(history)` | 40.66 µs | 40.51 µs | ≤ 60 µs | 0.68x | **MET** |
| `repetitionCounts(history)` | 45.72 µs | 45.78 µs | ≤ 75 µs | 0.61x | **MET** |
| `gameStatusOf(history)` | 49.33 µs | 48.99 µs | ≤ 75 µs | 0.66x | **MET** |
| `playMove(history, move)` | 12.4 ns | 12.7 ns | ≤ 100 ns | 0.13x | **MET** |
| `repetitionCounts` @ **300 plies** | 99.62 µs | 99.07 µs | ≤ 150 µs | 0.66x | **MET** |
| `repetitionCounts` @ **40 plies** (shape only, no bar) | 18.06 µs | 17.99 µs | — | — | — |

**Three honesty notes on those numbers.**

- **The `takeBack` figure is an UPPER BOUND, not a point estimate.** The two restoring `playMove`
  calls that put the history back to 120 plies sit inside the timed region. They are measured
  separately at 12.4–12.7 ns each, so they contribute about **0.025 µs** of the 2.45 µs. The bar is
  met with room either way, and it is met by a figure that can only be too high.
- **`gameStatusOf` minus `repetitionCounts` is 3.2–3.6 µs**, which is the one `legalMoves` call
  inside `gameStatus`. That difference is **position-dependent** in a way the two derives are not —
  `plans/nfr-catalog.md` records `legalMoves` at 2.1 µs at startpos and 3.2 µs in a middlegame — so
  it is the one row here whose value would move on a different game, not only on a different
  machine.
- **Every figure reproduces SEAM 1's wave-1 measurements** (2.40 µs / 39–41 µs / 46–50 µs / ~10 ns /
  97–102 µs / 18 µs). That is a **check**, not a coincidence and not a citation: those figures were
  taken from a harness prototype, and this is the first time the module being measured exists.

**Growth is linear with a constant offset** — 18.06 / 45.72 / 99.62 µs at 40 / 120 / 300 plies. At
300 plies it is still **10x under** `ADR-0002`'s own stated threshold (~1 ms of replay) for
re-opening clause 2, so SEAM 2's no-memoization decision is not under pressure from anything
measured here.

## 5. Acceptance criterion 9, and the instrument that failed its own null control

**"No existing test is modified" holds at BYTE level, which is stronger than the line level the
criterion asks for.** Every tracked file under `src/` is **md5-identical** to merged `main`
`39e260d`, and `git diff --numstat 39e260d -- src/` is **empty**. `src/history.ts` and
`src/history.test.ts` are the only additions.

**The first instrument reached for was unsound, and it is recorded rather than buried.** A
`grep -vxF -f <file>` line-presence check against the `39e260d` blob reported **13 to 81 "absent"
lines per test file**, which looked like a serious finding. It fails its own **null control by
identity**: run against `src/fen.test.ts` compared with **ITSELF**, it reports **13 absent lines**.
It is unsound on this input class, **no number is claimed from it**, and the md5 / `git diff` result
above is the record. This is the fifth instrument-limit correction this project has had to make, and
the reason it was caught in minutes rather than shipped is the caution `plans/nfr-catalog.md`
already carries: *carry a null control and check the reading on a cell where the delta is
structurally zero before believing the reading on the cell you care about.*

## 6. Gates, as they ran

- `npm test` — **221 passed / 10 files / 0 failed** (baseline 214 / 9).
- Skip count, captured with the `AGENTS.md` command
  (`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`) — **0**.
- `npm run lint` — **exit 0** (the same 2 pre-existing biome config-schema infos, unrelated to this
  change).
- `npm run typecheck` — **exit 0**. `npm run build` — **exit 0**.
- Coverage of `src/history.ts` — **100%** statements, branches, functions and lines, against a
  `coverage_threshold` of 0.8.
