---
subtask: qe-ABC-241
role: qe-e2e
ticket: ABC-241
ref: .grugops/context/qe-ABC-241/
branch: grugops/ABC-241 @ d1a2d5cd (code 33540592; base main e42b637b — current main is src/tools/data-identical, verify); QE commits on new grugops/qe-ABC-241 from d1a2d5cd (worktree .claude/worktrees/qe-ABC-241)
width: ALONE (timing + games) — HELD until se-ABC-220 finishes
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
