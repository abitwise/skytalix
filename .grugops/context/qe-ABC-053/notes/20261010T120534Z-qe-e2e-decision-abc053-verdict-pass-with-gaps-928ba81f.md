---
id: 20261010T120534Z-qe-e2e-decision-abc053-verdict-pass-with-gaps-928ba81f
kind: decision
by: qe-e2e
at: 2026-10-10T12:05:34Z
verified_by:
confidence: high
refs:
  - ABC-053
  - ABC-054
  - ADR-0029
  - ADR-0030
  - ADR-0011
  - NFR-002
  - N8-LANE
  - src/history-pane.nfr.test.ts
  - src/render-seam.test.ts
  - 20261010T120534Z-qe-e2e-observation-abc053-ledger-rebuilt-and-qe-mutants-594c5d57
  - 20261010T120534Z-qe-e2e-observation-abc053-gap-register-a4b293d2
  - 20261010T120534Z-qe-e2e-observation-abc053-clause-d-for-security-nfr-7f43accf
  - 20261010T115422Z-software-engineer-decision-abc053-one-root-per-frame-phase-composer-tripwire-9594aafe
  - 20261010T115422Z-software-engineer-observation-abc053-gates-ledger-controls-cost-3a8f5aa3
  - .grugops/context/qe-ABC-053/probe/gates-tip.txt
supersedes:
---

# `ABC-053` QE verdict: **PASS_WITH_GAPS** at `57251578`. `A2`–`A5` MET; six LOW/INFO gaps, none blocks

This note is hand-authored and unsealed. It is a `decision`, not a `finding`: no `§14-gate` verdict
exists on this install (`AGENTS.md`).
- Under review: `e15eb31d..57251578` on `grugops/ABC-053-frame-path-per-frame`. The code commit is
  `c9509031`.
- QE ran the gates in the Engineer's worktree. Every build ran on QE's own harness
  (`../probe/plant.py`, `../probe/ledger.sh`), with QE's own spellings, in fresh `git archive 57251578`
  copies in QE's scratchpad. No byte of the worktree was planted.
- The criteria were judged against the ticket and `ADR-0029`, not against the Engineer's readings.

| | reading (QE's own) | result |
|---|---|---|
| `A1` | Discharged by `ADR-0029` (accepted 2026-10-10). Nothing to verify | DISCHARGED |
| `A2` | `grep -c FRAME_PRODUCERS src/history-pane.nfr.test.ts` = **0**. The docblock names both phases (AT LOAD, PER FRAME), `render-seam.ts` as the one declared root with a derived closure, and lists four uncovered cases. **Each of the four was planted and is TRUE:** a 50 ms timer and 4- or 5-deep `setImmediate` are green (case 1); a ply-41 edge is green (case 2); a repetition rebuild without `history.ts` is green on the probe (case 3); a row-writer that never imports `assembleFrame` is green (case 4). **The list is not exhaustive** (QE-053-a, -b) | **MET** (gaps QE-053-a/b/c) |
| `A3` | **`ADR-0029`'s ten builds plus BASE, rebuilt with QE spellings:** 9 of 9 RED, BASE green, `WGLYPH-DYN` green. Digit-free seam spellings make every per-frame kill the single `PER FRAME` assertion; none shares a kill with `A3`'s `/\d/` row. `WDYNIMP`: AT LOAD. `INLINE-TYPE`: AT LOAD plus the licence. `WINDIRECT`: the licence only. `SECOND-COMPOSER`: the tripwire. The same eleven reproduce on **Node v24.12.0** | **MET** |
| `A3b` | (i) `CTRL` builds from the Engineer are accepted as recorded, and QE adds a dead-recorder build: deaf after load + `X5b` → RED on `the probe is ARMED`. (ii) the boundary is exact: an edge at `>= 40` plies is RED, at `>= 41` green, at `>= 17` RED. (iii) the arming runs last on the same recorder: with arming moved first and the recorder deaf after it, `X5b` is GREEN. So the order is load-bearing, and it is held by structure, not by an assertion (QE-053-e) | **MET** |
| `A4` | `glyph-mode.ts` is not a root (`COMPOSITION_ROOT` is a single string). The docblock states the membership rule ("IF AND ONLY IF … in the root's load closure or is loaded by a frame call"). The probe rooted at `render-seam.ts` gives an 11-module closure with no `history.ts` and 23 rows per frame. Rooted at `turn-loop.ts`, it reports `history.ts` at load, so the probe is armed (test note 2) | **MET** |
| `A5` | `git diff --name-status e15eb31d..57251578 -- src/` = `M src/history-pane.nfr.test.ts`, `M src/render-seam.test.ts`. 0 non-`.test.ts` paths, 0 added `src/` files, 0 `package*.json`. `spawnSync(` 1 → 1. `A9` asserts `^const COMPOSITION_ROOT = "render-seam\.ts";$`. The `LICENSED_DRIVERS` assertion (`:327`) is byte-identical. The other two lines that name it are prose and a test title. Stale production lines (by filename, not by text): `src/render-seam.ts:35`, `src/result-screen.ts:14`, `src/cli.ts:8`. These match the Engineer's list exactly | **MET** |

**Gate at `57251578`** (`../probe/gates-tip.txt`). Node v26.11.0. load1 was 5.89 for the first four
steps and 7.98 for the last three.
- `npm run lint`: exit 0, 98 files.
- `npm run typecheck` and `npm run build`: exit 0.
- `npm test`: exit 0, **51 files / 1582 passed**.
- Skip count: **0**, measured.
- `test-skip-integrity.js … --skip-count 0`: `No findings.`
- `lane-inventory.js`: 51/51, no findings.
- Not triggered: `PUZZLE_DEEP` (no engine file touched) and `CLI_DEEP` (no `src/cli.ts` or
  `src/engine.ts` change).

**Why PASS_WITH_GAPS and not PASS.** Every criterion is met as written. The gaps are about what the
guard and its docblock claim **beyond** the criteria:
- The tripwire does not fail closed on a re-export hop or a dynamic import (QE-053-a).
- The per-frame phase draws one glyph mode, one orientation, `thinking = false` and no messages. The
  docblock names only unreached **game** states (QE-053-b).
- The others are wording or INFO.

**Why not FAIL.** No `ADR-0029` ledger build is missed. No criterion reading depends on the Engineer's
numbers. No gap is a defect in the delivered guard against its ruling.

**Next.** The board move `In Review` → `In Security/NFR` is the Orchestrator's. Security/NFR rules
clause (d), and also reads (c) (`…7f43accf`). The `XS` docblock follow-up stays owed at merge (BA/PM).
QE-053-a is offered to `ABC-054` (BA/PM decides, see the gap register). Not merged, not pushed.
