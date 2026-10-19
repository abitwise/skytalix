---
subtask: qe-ABC-174
role: qe-e2e
ticket: ABC-174
branch: grugops/ABC-174 @ be6a5599 (from bd480c99)
ref: .grugops/context/qe-ABC-174/
---

# QE pass on ABC-174: level table re-cut per ADR-0045 (lean)

## What you are checking
The delivery at `be6a5599`. Break it and report the gaps.

## Read first
The ticket page `plans/tickets/ABC-174-*.md`, ADR-0045 (ACCEPTED, `…1a9c7f42`), the SE's done file
`.grugops/queue/done/ticket-to-pr-ABC-174.md`, `AGENTS.md` (lanes, heap caps, NFR-008 / NFR-010 rules).

## Check
1. **Gates first (resume check).** The host rebooted after the pause. Re-run the brief's gates on `be6a5599`, exactly as `AGENTS.md` spells each lane, one at a time, each with its `NODE_OPTIONS` prefix: lint, typecheck, build, `npm test` (`last-run.json` success true, full count), skip-integrity with skip count 0, `CLI_DEEP`, `PERFT_DEEP`.
2. **A6 deep lanes (yours).** `ENGINE_DEEP=1 … src/levels.test.ts` (ABC-087 A2–A5 incl. A5 ≤ 5 s on 30/30 at level 5 = 3000/0) and `LADDER_DEEP=1 … src/ladder.test.ts` short mode, ABC-085 A3/A4/A5 only (no A2 claim, D6.8). Record figures as your readings.
3. **Criteria and pins.** A1–A5, A7, A8 must each hold and fail on a wrong build. Mutants on scratch copies (e.g. a table entry, `DEFAULT_LEVEL`, `DEFAULT_DIFFICULTY`, the `uci-session.ts` option template, a blunder rate at 3/4). Check each re-pinned row in the SE's § Pins is equal or stronger strength, none loosened.
4. **Open ruling: A3 step 1000** (budget/3) instead of the brief's "10 or 100". Grade it: does the A3 equality row still discriminate at step 1000 (a mutant that changes move/depth/nodes at level 5 must still red)? Recommend keep or tighten.
5. **NFR-008 / N8-LANE.** The SE listed rows whose cost moved (new A3 row: 90 searches). Take the reading **only** in a foreground-verified quiet window (180 s, no foreign vitest, no `oeselg-labs/platform` process, no other hop). The host hit its per-user process limit (~2670 vs `ulimit -u` 2666) at ~21:40 +0300 before the reboot; record `ps -u $(id -u) | wc -l` and load1 at each run. If no window opens, mark **OWED**. Never estimate.
6. **Waiver.** Production lines are non-empty (4 src files) → UAT applies. Confirm.

## Fences
- Scratch detached worktree `../wt-qe-ABC-174`; remove it at the end. Keep forks low (no wide shell loops).
- Do not touch: `src/` on any branch, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-174`, any process you did not start.
- Do not fix anything. Never push, merge or self-sign.

## Publish
- Notes under `ref:` (include a `kind: decision` note by `qe-e2e`). Use the sanctioned writer if available; otherwise hand-authored, unsealed, and say so.
- `.grugops/queue/done/qe-ABC-174.md` (this brief + `## Result`) and `.claim.md`, uncommitted: verdict, per-criterion grades, A6 figures, mutants, lanes, A3-step ruling, NFR-008 reading or OWED, gaps `QE-174-*`, waiver, trace row.
