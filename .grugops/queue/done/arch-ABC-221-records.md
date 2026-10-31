---
subtask: arch-ABC-221-records
role: architect-design
ticket: ABC-221 (closed) / ADR-0052, ADR-0054
ref: .grugops/context/arch-ABC-221-records/
branch: new grugops/arch-ABC-221-records from main (worktree .claude/worktrees/arch-ABC-221-records)
width: records only; no vitest, no timing, no long-running scripts. Leave no process running.
---
# Architect (records): ADR-0052 D4/D8 lines; ADR-0054 probe value
## Read
se-ABC-221 (SE-221-a, SE-221-b), qe-ABC-221 (SE-221-a arithmetic, QE-221-b), secnfr-ABC-221 (SEC-221-b) notes on main; qe-ABC-242's SE-242-a reading; ADR-0052 D4 and D8; ADR-0054.
## Do
1. **ADR-0052 D4:** add a dated line correcting the "≥ 117 s" figure (17 205 ms as A6 is worded; 117 735 ms in the +900 000 shape).
2. **ADR-0052 D8 (SEC-221-b):** rule on the deep-lane spawnSync in src/uci-session.test.ts (the --expose-gc NFR-009 instrument, deep lane only), and add a dated line either way.
3. **ADR-0054:** add a dated line saying the probe's base value has read −1020, not −1013, since the ABC-228 merge (e42b637b), per qe-ABC-242.
4. **QE-221-b:** src/levels.ts's comment that HARD_CEILING_MS is the largest level ceiling is false at 60 000. Say which ticket or ADR line carries it; do not edit src/.
- Anything that changes an owner-accepted decision is marked PROPOSED for the owner.
## Fences
Records only: ADR-0052* and ADR-0054* (ADR-0045/0044 folds are BA/PM's, running beside you). No src/, tools/, data/, ticket or board edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-ABC-221-records`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.

## Result
- **D8 ruling (`SE-221-b`, `SEC-221-b`):** `ABC-221` `A10`'s `ENGINE_DEEP` `spawnSync` **stays** in
  `src/uci-session.test.ts`.
  - **Why:** what D8 guards still holds. There is no new file and no delivery file, and the delivered entry point is
    still spawned only by `runDialogue` in `src/uci.real-engine.test.ts`. The child is the `ABC-081` `A7` / `NFR-009`
    instrument, and it imports `src/` modules, never `src/uci.ts`. The default lane spawns 0. A repeatable row is
    better than a one-off hand reading, and Security/NFR found no risk and prefers the row.
  - **The rule from here:** a spawn in this file is admitted only if it is not the delivered entry point, is defined
    only under an opt-in deep lane, and is synchronous with an argument array and no shell (`ABC-173` `C2`).
  - "Has no spawn site" is dated: true until `ABC-221`'s merge.
- **`ADR-0052` D4 (`SE-221-a`):** "80 moves leave ≥ 117 s" → **17 205 ms** after move 80 on the shape as worded.
  117 735 ms is the 40/15 shape with +900 000 after move 40. The bound (≥ 1 000 ms) does not move. § Alternatives A9
  gets the same pointer.
- **`ADR-0052` § Status:** `uci-clock-mode` and D6's clamp are in force since `af32f82c` / `9395d8dc`.
- **`ADR-0054`:** the probe's base value for `d8e8` has read **−1020, not −1013**, since `ABC-228`'s merge (`e42b637b`),
  per `qe-ABC-242` `…b9f3cd67`. `d8e8` is still the strict second-best, so nothing changes. The amendment's § Status
  also says it has been in force since `ABC-242`'s merge (`af5b2b49`).
- **`QE-221-b`:** carried by a dated line in `ADR-0052` D8. The vehicle is the next ticket whose diff touches
  `src/levels.ts`, and BA/PM names that line on the ticket's page. There is no ticket of its own: a comment-only `src/`
  edit does not pay for a gate pass. The same line adds two header words stale since `ABC-228`: `:42` "3 s" (now 4 s)
  and `:49–50` "at least 2 s under" (1 s at level 5).
- **Owner:** nothing. No owner-accepted decision changes, so nothing is PROPOSED.
- **Commits:** ADRs at `db8fea11`; notes and this Result in the next commit.
- **Notes (sealed):** decision `…068f36ba`, observation `…45bb1652`, in `.grugops/context/arch-ABC-221-records/`.
- **Not touched:** `src/`, `tools/`, `data/`, tickets, the board, `ADR-0044` and `ADR-0045`. Nothing was run, timed,
  pushed or merged, and no process is left running.
