---
id: 20261010T103155Z-agents-md-scribe-observation-abc127-puzzle-deep-line-landed-widened-to-quiet-readings-c82bebe0
kind: observation
by: agents-md-scribe
at: 2026-10-10T10:31:55Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-084
  - ABC-109
  - AGENTS.md
  - .grugops/context/ticket-to-pr-ABC-127/notes/20261010T085351Z-software-engineer-claim-abc127-agents-md-line-and-owed-6341cc47.md
  - .grugops/context/secnfr-ABC-127/notes/20261010T102840Z-security-nfr-observation-abc127-a7-quiet-20-24s-n8lane-225ms-net-budget-edge-4pct-red-6a3b6274.md
supersedes:
---

# `AGENTS.md` `PUZZLE_DEEP` comment — `ABC-127` `A9` landed, with the wall ranges widened to the quiet readings

Hand-authored per `agent-factory/contracts/context-note.md`: no sanctioned writer on this install and
`human_admission` is `off`. Branch `grugops/ABC-127-harder-puzzles`, on top of `4c09b5c`. Not merged,
not pushed.

## What changed (`AGENTS.md` only, +4 / -2 lines, the first two lines of the `PUZZLE_DEEP` comment)

Old:
```
  <!-- RUN 2026-10-09: exit 0, 12 passed (9 default), 17.3 s at load1 ~11 (~13 s quiet). Baseline
  `src/puzzle-suite.baseline.json` (40/40, budget 25, step 1). TRIGGER (owner, option B,
```

New (from `TRIGGER` on, unchanged — the option-B text is byte-identical):
```
  <!-- RUN 2026-10-10: exit 0, 17 passed (12 default), 32-36 s (gating run 20-24 s) at load1 4-8;
  ABC-127 A7 reads <= 90 / 45 s, never asserted, 300 s hang guards. Baseline
  `src/puzzle-suite.baseline.json` (58/62, budget 25, step 1; the 4 unsolved rows named, a run
  prints NEWLY-MISSED / NEWLY-SOLVED per row that differs). TRIGGER (owner, option B,
```

## One deviation from the Engineer's draft (claim `…6341cc47`), and why

The draft read "32-34 s (gating run 20-21 s) at load1 4-8". It came from the Engineer's three
processes (lane 32.1 / 32.2 / 33.5 s, gating 20.3 / 20.4 / 20.8 s, load1 4.2–7.6). Security/NFR's
conforming readings (observation `…6a3b6274`, load1 3.8–5.4) are lane 32.9 / 34.5 / 36.2 s and
gating 20.4 / 21.4 / 24.3 s. Their decision says the draft "agrees", but 34.5 / 36.2 s and 21.4 / 24.3 s
fall outside the draft's ranges. The line now reads **32-36 s (gating run 20-24 s)**, which covers
every conforming reading from both hops (32.1–36.2 s; 20.3–24.3 s) and is the same length as the draft.
Load1 "4-8" covers both (3.8 rounds to 4). Nothing else in the draft was changed.

## Checked against the quiet readings

- 17 passed (12 default): matches the Engineer's gate and Security/NFR's runs (17 passed each).
- 58/62, budget 25, step 1, 4 unsolved named: matches `src/puzzle-suite.baseline.json` at the tip.
- "reads <= 90 / 45 s, never asserted, 300 s hang guards": Security/NFR ruling 1 — MET as readings, no
  wall assertion, four `300_000` guards. The caps hold at load1 <= 8 (loaded readings above them are not breaches).
- TRIGGER text, "red = QE FAIL", the baseline rule, and `PUZZLE_DEEP=weakened`: untouched.
- Not added, on purpose (outside `A9`; Security/NFR's `R1` / `AR-PUZZLE-EDGE` is routed by the
  Orchestrator, and the budget-edge reading is not a `PUZZLE_DEEP` command fact): the 4 %-fewer-readings red.

## Receipts: cited, not re-run

The 17-passed / wall readings in the line are the Engineer's and Security/NFR's, cited from their notes.
I did not run `PUZZLE_DEEP=1`: the machine was at load1 ~25 with two QE hops on wall-clock engine
budgets in sibling worktrees, and a 35 s extra lane would only add load. No other receipt was refreshed
(`Test (all)` and the other lane lines are as they were).

## Gates (this worktree, after the edit; load1 ~25)

- `npm run lint`: exit 0, 97 files, no fixes.
- `npm run typecheck`: exit 0.
- `npm test`: exit 0, 50 files / 1543 passed (the `AGENTS.md` guards in `src/cli.test.ts` included).

## Size

`AGENTS.md`: 23 464 B -> 23 633 B on the branch (+169). Merged-with-wave size and merge-tree result are
in the trace row and the hand-off.
