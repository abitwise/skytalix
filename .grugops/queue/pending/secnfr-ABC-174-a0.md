---
subtask: secnfr-ABC-174-a0
role: security-nfr
tickets: [ABC-175, ABC-174]
branch: grugops/ABC-174 @ f6b63c1c (QE-passed src at be6a5599; f6b63c1c adds AGENTS.md only); worktree ../wt-ABC-174
ref: .grugops/context/secnfr-ABC-174-a0/
width: 1 (nothing else in flight; Orchestrator holds width 1 until this ends)
---

# A0 re-take on the ABC-175 run tree (width 1)

Owner word 2026-10-20: "start A0 re-run".

## Read first
- `plans/tickets/ABC-175-*.md` (A1, § Order with ABC-173, Dependencies).
- The A0 reading in force: `.grugops/queue/done/secnfr-ABC-146-a0.md` and its decision `…f1558f02` (§ Staleness inputs; workload `…70684a78`; pre-registration `…107ff1bf`).
- ADR-0038 (route V / N), ADR-0045 D6.5, ADR-0008 addendum (ABC-173 cap, now on the tree).

## Do
0. **Pre-step (owed before merge, not timing):** one default-lane `npm test` run on `f6b63c1c`, exactly as `AGENTS.md` spells it, to check the AGENTS.md guard rows (ABC-065/109/059) after the Scribe edit. Report count and `last-run.json` success. Red → stop and report; do not fix.
1. **Re-take A0 on the run tree** at `f6b63c1c`, the same way as `…f1558f02`: pre-register before the first graded run; same workload and pairing (5 interleaved pairs, vitest arm = the tree's `vitest.config.ts` unedited, now carrying ABC-173's heap cap); node counts equal across arms; ratios, median F, F_hi; route V (F_hi ≤ 1.30) or N.
2. Record the new staleness inputs at `f6b63c1c`: `vitest.config.ts` and `src/ladder.test.ts` md5, `node --version`, `npx vitest --version`, and the commit that A1's stale-list diff will compare against.
3. Run A1's own stale-list command against your new A0 commit and show it prints nothing.

## Window
Graded pairs only in a foreground-verified quiet window: 180 s with no foreign vitest, no `oeselg-labs/platform` process, nothing else of ours. Record load1, `ps -u $(id -u) | wc -l`, power source (AC/battery), thermal state. If no window opens in a reasonable time, stop with A0 **OWED**; never estimate.

## Fences
- Work in `../wt-ABC-174`, or a scratch detached worktree `../wt-a0-ABC-174` at `f6b63c1c` (remove at the end). Commit the A0 records (notes/probe/raw only) on a scratch branch or leave them under `ref:` on main uncommitted — **no `src/`, no `tools/`, no AGENTS.md lines**, and do not move `grugops/ABC-174`'s tip unless records-only and you say so.
- Do not start the ABC-175 verdict run (the Orchestrator's, overnight, owner's slot).
- Do not touch `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, or any process you did not start. Keep forks low. Never push or merge.

## Publish
Notes under `ref:` (pre-registration + `kind: decision` by `security-nfr`); sanctioned writer if available, else hand-authored and say so.
`.grugops/queue/done/secnfr-ABC-174-a0.md` (brief + `## Result`) and `.claim.md`, uncommitted: pre-step result, route, F/F_hi, node counts, window data, new staleness inputs, the A0 commit for A1, trace row.
