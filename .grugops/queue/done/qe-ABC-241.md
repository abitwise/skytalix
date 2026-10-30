---
subtask: qe-ABC-241
role: qe-e2e
ticket: ABC-241
ref: .grugops/context/qe-ABC-241/
branch: grugops/ABC-241 @ d1a2d5cd (code 33540592; base main e42b637b — current main is src/tools/data-identical, verify); QE commits on new grugops/qe-ABC-241 from d1a2d5cd (worktree .claude/worktrees/qe-ABC-241)
width: ALONE (timing + games) (host clear 12:34Z)
---
# QE ABC-241: Q-SET freeze-review, gates, G8, SE-241-b cost, A10 smoke pair
## Read
The ticket (A1–A10, FOLDED blocks, line ~123 on (ii)), ADR-0020 § AMENDMENT 2026-10-30, se-ABC-241 notes (`…2148e9cf`,
`…887921ba`, `…2136c82c`), EPIC-010 § The merge rule + smoke ledger (R rows at 4 000 ms recorded, not pooled until the
milestone-1 batch), how qe-ABC-230 and qe-ABC-228-ii ran.
## Do
- PREREG first, sealed and committed before any timed read or game.
- Q-SET: review the SE's rows against A1–A9; add rows where class coverage is thin; reproduce 2–3 mutants.
- Gates via `npm run …`; npm test + skip integrity; deep lanes one file at a time (local vitest entry, heap 400).
- G8 base vs head in this session. SE-241-b: time NFR-002's per-ply derive cost (base vs head), report.
- A10 ALONE at `--concurrency 1`: `d d1a2d5cd e42b637b <out> --budget-ms 1500 --rounds 5 --concurrency 1` and
  `r d1a2d5cd <out> --elo 1910 --rounds 5 --concurrency 1` (R reads level 5 = 4 000 ms). S-1..S-4; W/L/D; ledger
  state; repetition-ended game count candidate vs base. Wait-clear (no cutechess, no foreign vitest). Thermal stop:
  median > 85 °C → STOP.
## Fences
No src/, tools/, data/ edits. Never push, force, amend, rebase, merge into main. No board edits. Never bare `npx`/`npm exec`.
No host paths in commits. Scratch in scratchpad `qe-241/`. Tool env file recreated outside the repo, mode 600, pins verified.
## Publish
Sealed notes (task `qe-ABC-241`), commit on the branch, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-30, QE/E2E. Verdict: PASS_WITH_GAPS, with no blocking gap. A1–A10 are met. S-1..S-4 are MET (D 6.0 / 10, R 6.5 / 10 at 4 000 ms). Under Test note 3 and the 2026-10-22 ruling, this verdict signs UAT. The merge is a human's.**

- **Branch:** `grugops/qe-ABC-241`, from `d1a2d5cd`. PREREG `8d78cbe9`, records `87558570`, and this brief in the next commit. QE merged nothing, pushed nothing, and made no `src`, `tools` or `data` edit. `main` `f22e31b3` is src/data/tools-identical to the base `e42b637b`, re-checked before each smoke.
- **Notes:**
  - PREREG `20261030T124213Z-qe-e2e-decision-09a71388`, sealed and committed before any timed read, value read or game.
  - Checks `20261030T143112Z-qe-e2e-observation-939168a8`, timing `…-55e40fb7`, smokes `…-5d70bb7c`, findings `…-e6523bfb`, verdict `…-decision-2368b03f`, artifacts `…-observation-07d8d39a`.
  - `readContext` reads back 7.
- **QE rows** (QE's own fixtures, plain node): v2 0 FAIL.
  - A1: 26 rows (edge files, Black to move, a pin captured along, a check answered or not by ep, two pinned capturers, a knight). F8 walk: 31 965 positions, 0 mismatches, 0 collisions.
  - A2: base hash = head hash.
  - A3: Black-push mirror, an ep-carrying FEN, `claimShortfall` and the ticket line through `runTurnLoop`.
  - A4 / A7: White's push and an ep-carrying FEN, at exactly 0 on CLI and UCI at depths 1–5, with node counts equal across the surfaces.
  - A5: 22 games. A6: 6/6 bare and 10/10 ep-free windows node-equal to base. A8: fences hold.
  - v1 had 2 FAIL rows, both QE's own base predicates (QE-241-d). They are kept.
- **Mutants:**
  - QM1 (SE M7) 1 red. QM2 (SE M3) 1 red, which confirms SE-241-a.
  - **QM3 (UCI FEN key raw): `npm test` stays green, 2 245 / 2 245**. It is caught only by QE rows (QE-241-a).
  - QM4 (pseudo-legal capturer test): 2 red in `npm test`, 8 QE rows red.
- **Gates:**
  - lint, typecheck and build exit 0. `npm test`: 63 files, 2 245 / 2 245, skips 0, `No findings.`
  - All 15 deep lanes are green: G1 54/58, G5 level 5 max 4 002 ms, `ABC-078 A3` sweep green.
  - G4, G9 and G10 MET. **G8 MET:** head 9.63 s, base 9.44 s (+0.19 s).
- **SE-241-b CLOSED:** the per-ply derive is 43.11 / 43.54 / 42.01 µs against base's 42.98 / 42.87 / 41.66 µs (+0.13 / +0.67 / +0.35 µs, 0.3–1.6 %). `NFR-002` MET.
- **A10, ALONE at width 1:**
  - D (`d d1a2d5cd e42b637b --budget-ms 1500`): **4/2/4 = 6.0 / 10**, Tctl median 74.38 / max 83.6 °C, 42 min.
  - R (`r d1a2d5cd --elo 1910`, `st=4`): **6/3/1 = 6.5 / 10**, Tctl 74.63 / 85.5 °C, 33 min.
  - 0 faults, 0 time losses, frequency fall ≤ 0.10 %, no thermal stop. A foreign vitest was seen in 31 of D's samples and 13 of R's (recorded; readings stand).
- **Repetition endings, candidate vs base:**
  - D: 1 (the repeating move by the candidate) vs base's 1 / 10.
  - R: 1 (by Stockfish) vs base's 0 / 10.
  - Replaying all 40 games shows **neither ending was touched by ABC-241's rule**: no ep-normalised position recurs.
- **Ledger:** the R row at 4 000 ms is recorded, not pooled. There is no 4 000 ms reference until milestone 1's batch, so the flag is not evaluable.
- **Gaps** (all non-blocking):
  - **QE-241-a LOW:** no src row covers a UCI `position fen` that carries ep. Follow-up: move QE-A4e into `uci-session.test.ts`.
  - SE-241-a LOW, confirmed.
  - QE-241-b INFO: the F8 walks miss a pseudo-legal test; the fixed pin rows catch it.
  - QE-241-c INFO: the page's "base: 7.Ng1 / 11.Ng1" is the 1.e4 board's own count. In play, base claims at ply 10 and ends at ply 18, against head's 9 and 17: the fix moves the line by one ply.
  - QE-241-d INFO: QE v1 predicates.
  - QE-241-e INFO: the smokes cannot see the change.
  - QE-241-f INFO: host load.
  - SE-241-c INFO: unchanged.
- **Queue:** QE worked only in its worktree. This tracked `done/` copy of the brief and its claim.md is on the QE branch. The main checkout's `claimed/qe-ABC-241.*` was not touched.
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-241 (qe-ABC-241) | QE PASS_WITH_GAPS at d1a2d5cd: A1–A9 met on SE rows + 26 QE helper rows, F8 walk 31 965 positions 0 collisions; A4 exactly 0 on CLI and UCI (QE White push + ep-in-FEN), base never 0; A10 D 4/2/4 6.0/10, R 6/3/1 6.5/10 at 4 000 ms (not pooled), S-1..S-4 MET; repetition endings D 1 (candidate) / R 1 (Stockfish) vs base 1 / 0, none touched by the rule; QE-241-a LOW UCI FEN-with-ep row missing (QM3 survives npm test) | EPIC-010 | repetition key ignores an uncapturable ep square, ADR-0020 § AMENDMENT 2026-10-30 C1–C4 | NFR-002 per-ply derive +0.13–0.67 µs (0.3–1.6 %), SE-241-b closed; NFR-008 G8 9.63 s (+0.19 s); NFR-005 identity node-equal (A6); G1 54/58; G5 level 5 max 4 002 ms; heat: D Tctl 74.38 / 83.6 °C, R 74.63 / 85.5 °C (width 1) | grugops/qe-ABC-241 @ 87558570 (+ this brief; on grugops/ABC-241 d1a2d5cd; code 33540592) | npm test 63 files 2 245/2 245, skips 0; 15 deep lanes green; 4 mutants (QM1–QM4); .grugops/context/qe-ABC-241/notes/ (7) + raw/ | signed by the QE verdict (PASS_WITH_GAPS) | — | In Review → toward the merge (human); smokes go stale if another value-changing merge moves main first |
