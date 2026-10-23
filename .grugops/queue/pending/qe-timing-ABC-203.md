---
subtask: qe-timing-ABC-203
role: qe-e2e
ticket: plans/tickets/ABC-203-at-game-end-npm-run-chess-writes-the-game-as-a-standard-pgn-file-under-games.md
ref: .grugops/context/qe-timing-ABC-203/
branch: H = main (ABC-203 code landed early, …4707909a); B = 55a8f4ef
width: 1 — ALONE. Dispatch only when no other agent hop runs (owner: readings run whenever the board is idle, …e44d2903)
---

# N8-LANE reading for ABC-203 (owed before merge)

## Do
- Exactly as Security/NFR `…eaaa1133` § 6 states (arms, file set, bound, F for the set). Preconditions every scored window: AC, load1 ≤ 8, no foreign vitest, thermal kept and flagged; else UNRESOLVED with readings.
- Own worktree `../wt-qe-timing-ABC-203` on `grugops/qe-timing-ABC-203` from current `main` (H; report the sha). B = `git archive 55a8f4ef`. Own `npm ci`.
- If N8-LANE reads NOT MET / UNRESOLVED, or the charge exceeds the published NFR-008 headroom (1.065 s), say so: the full-lane NFR-008 reading becomes owed.

## Fences
- Only your worktree and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe203t/`. Notes + a dated addendum to the ABC-203 page's `## QE` section. No `src/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-timing-ABC-203`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
