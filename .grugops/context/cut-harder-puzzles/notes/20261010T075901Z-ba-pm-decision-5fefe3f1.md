---
id: 20261010T075901Z-ba-pm-decision-5fefe3f1
kind: decision
by: ba-pm
at: 2026-10-10T07:59:01Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-084
  - ABC-126
  - ABC-083
  - ABC-087
  - EPIC-004
  - RISK-003
  - N8-LANE
  - ADR-0026
  - ADR-0027
  - ADR-0028
  - plans/tickets/ABC-127-harder-puzzles-catch-the-surviving-weakenings-and-leave-headroom.md
  - .grugops/context/wave-2026-09-25/notes/20261010T075200Z-orchestrator-decision-e47a1c08.md
  - .grugops/context/qe-ABC-084/notes/20261009T215422Z-qe-e2e-decision-abc084-verdict-pass-gate-coarse-927320d8.md
  - .grugops/context/qe-ABC-084/notes/20261009T215422Z-qe-e2e-observation-abc084-five-focus-readings-17-weakenings-80be6044.md
  - .grugops/context/secnfr-ABC-084/notes/20261009T223632Z-security-nfr-decision-abc084-pass-with-risks-n8lane-met-a6-stays-default-a5-timeout-false-red-fix-c3a91e57.md
  - .grugops/context/secnfr-ABC-084/notes/20261009T223620Z-security-nfr-observation-abc084-n8lane-met-85-210ms-net-a6-oracle-195ms-a5-false-red-under-load-7f3b2d61.md
supersedes:
---

# `ABC-127` cut: harder puzzle rows. `M`, `P1`, DoR 9/10 with 1 ⚠️ (item 3, owner Software Engineer). It stays in `Backlog` and is pullable today

Hand-authored and unsealed (no sanctioned writer on this install; `human_admission` is `off`). Subtask
`cut-harder-puzzles`, Workflow 03, at `de7d9c9`. The owner's word is *"accept ABC-084, cut the harder
puzzles ticket"* (`…e47a1c08`). The page is authoritative for scope and criteria, and this note does
not restate them.

## Id

**`ABC-127`.** The highest id on `plans/tickets/`, `plans/board.md`, `plans/traceability.md`,
`memory-bank/` and `.grugops/context/` is `ABC-126`. No local branch carries `ABC-127`
(`git grep` over every head).

## Where each source landed

| source | home |
|---|---|
| QE-084-a: 10 survivors | `A3`. All 10 are named. ≥ 6 must go red, including `W1`, `W1b`, `W4` and `W5`, plus ≥ 2 of `W2`/`W11`/`W13`/`W14`/`W16`. The 7 already red must stay red. Stop rule: the bar is not lowered at build |
| QE-084-b: ceiling | `A4`: ≥ 3 new rows unsolved, and a 4× run reads solved > baseline. `A5`: the re-record is its own commit and lists the unsolved rows |
| QE-084-c: win-material keys re-proven in no lane | `A2`: a `PUZZLE_DEEP=1` oracle row, the 6 existing rows included |
| QE-084-d: breadth | `A1`: ≥ 3 black-to-move win-material rows, and no new row is a colour mirror (checked by a row) |
| QE-084-e: two rows start in check | **Not here: `ABC-126`.** Fenced on the page |
| `N8-LANE` | `A8`: 0 new test files, ≤ 650 ms net. New oracle rows are deep-lane |
| `A5`'s wall under option B | `A7`, priced (below) |
| `F1`'s lesson | `A7`: readings only, no wall-clock assertion, 300 s hang guards kept |

## Why `W10` (PST off) is not required

A tactics row whose answer flips when the piece-square tables go away would be testing a positional
margin, which is what `ADR-0028` calls a fixture. Requiring it would push curation toward fixtures.
QE's default lane still catches it through pins.

## The price (`A7`), measured. Probe: `../probe/`

- **Plain node** (`depth-price.mts`, budget 25, load1 3.0–3.3, Node v26.11.0, M3), on five perft
  positions:

  | readings | depth: start / kiwipete / pos3 / pos4 / pos5 | time per move |
  |---|---|---|
  | 25 | d5 / **d3** / d7 / **d4** / d5 | 69–135 ms |
  | 100 | d7 / d5 / d9 / d6 / d6 | 303–503 ms |
  | 200 | d8 / d5 / d10 / d7 / d6 | 636–1 005 ms |

- **Vitest** (`vitest-price.test.ts`, the same positions, load1 3.3), which is **4.3–4.7× plain
  node**:
  - **25 readings:** 325–502 ms per move, 1.99 s for 5 moves;
  - **100 readings:** 1.59–2.26 s per move, 9.89 s for 5 moves.
- **Consequence.** At the suite's 25 readings, a tactical middlegame reaches only depth 3–4. A heavy
  row therefore cannot separate `W5` (depth cap 4) from the shipped engine there. Hard rows must be
  sparse or get more readings.
- **The cap.** Security/NFR measured the worst load inflation at **6.3×** (12.6 s → 79.4 s at load1
  49–54). The hang guard is 300 s, and 300 / 6.3 ≈ 47 s, so the quiet gating run is capped at
  **45 s**. The existing 40 rows take about 13 s, which leaves about 32 s: about 16 rows at 100
  readings, or about 80 at 25.
- **Whole lane ≤ 90 s.** The oracle row has its own 300 s guard, so the same derivation gives it its
  own 45 s.
- **Per engine ticket**, QE pays ≤ 1.5 min quiet, up to about 9.5 min at load1 ≈ 50. The ticket also
  carries a one-off cost: the 17-weakening table at build and at QE, about 17 × ≤ 45 s ≈ 13 min each.

## Readings stated so they are not guessed

1. **Is the re-record a "lowering"?** BA/PM reads `ABC-084` `A7` by the count: the solved count goes
   from 40 to ≥ 40, so it is **not a lowering**, and no owner's word is needed. The other reading is
   that the ratio falls from 100 %, which would make it a lowering. The owner asked for headroom in the
   same breath ("cut the harder puzzles ticket", with the brief's "baseline BELOW the ceiling"), so
   BA/PM does not route the question. **If the Orchestrator reads it the other way, the owner's word
   at UAT covers it.**
2. **The swap mask.** Below the ceiling, a change can lose one row and gain another with the count
   unchanged. **The gate stays the count.** A per-row red would penalise a legitimately different
   engine. `A5` makes the swap visible instead, with `NEWLY-MISSED` and `NEWLY-SOLVED` lines for QE
   to read.
3. **The sensitivity tags (`depth≥5`, `quiescence`)** are engine measurements that select rows, and
   they are never answers. Each row's answer is oracle-proven (`A2`), and that keeps `A6`'s
   discipline: selecting rows by engine behaviour is allowed, but taking answers from the engine is
   not.
4. **`src/puzzle-corpus.ts` is not on option B's trigger list**, so a corpus-only edit runs no deep
   oracle unless someone opts in. This is not widened here, because the list is the owner's verbatim.
   In practice every corpus edit comes by a ticket whose own QE runs the lane.

## Example mapping (bdd `lean`, all three voices self-run)

- **Rule:** a lost search feature is red.
  - Example: `W5` misses a `depth≥5` row, so solved falls below baseline and the run is red.
  - Example: `W1` misses a `quiescence` row, with the same result.
- **Rule:** a stronger engine can show it.
  - Example: 4× readings solves an unsolved row, so solved rises above baseline.
- **Rule:** answers are the rules'.
  - Example: a mate-in-3 row whose accepted set includes a mate-in-4 first move is red in the oracle
    row.
- **Question (open, routed to the stop rule):** can `W1`/`W1b` rows be found inside the 45 s price?
  This is the ⚠️.

## Priority and size

- **`P1`.** Promote to `P0` if an engine ticket (`ABC-083`, `ABC-087`) enters dev first.
- **`M` (3).** `L` was considered and rejected: no production code, every harness exists, and two
  stop rules bound the iteration.

- **Trace:** one row appended, `ABC-127 (cut)`.
- **Board:** the Backlog row is the Orchestrator's to place. Its text is in the report. Fence: zero lines in `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` and ADRs.
