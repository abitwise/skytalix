---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-08T08:53:42Z
subtask: arch-ABC-292-probe
role: architect-design
ref: .grugops/context/arch-ABC-292-probe/
branch: new grugops/arch-ABC-292-probe from main (1faefe3f) — worktree .claude/worktrees/arch-ABC-292-probe
width: ADR-0076 d10 step 4, d13's premise probe, in two stages. Scratch instruments only; no src/ commit, no build, no games.
---
# ABC-292: the premise probe (d13)
d10 step 3 is met: QE's freeze …277b648a, freeze commit e88e91f9, merged at 1faefe3f (`git merge-base --is-ancestor e88e91f9 main` passes). fixtures.json sha256 6dc902c6…ffbfe4, pre-ticket.json ed6a6fda…146ff36. Your PREREG commit must descend from e88e91f9; PR3 reads fixtures.json.
**Stage A, now:** seal the PREREG decision note exactly as d13's Sealed form says, committed before any measured run. Name a batch order with PR8 and PR10's lane read last. The load-only smoke may come first. Then run PR1–PR7, P0, PR9, PR10's untimed parts and PR11, under the host lock, one core, one run at a time. Then STOP and report. Apply rules 1, 2 and 4 as sealed: a NOT MET there ends the probe and nothing timed runs.
**Stage B, only on a later brief line from me citing the owner's held-host word:** PR8 (rule 3) and PR10's lane read. Do not run any timed row in stage A, and do not take a held window on your own reading of host load.
Also owed in this hop, records only: a dated pointer in ADR-0024 (§ Status fifth block and d4: "in force at ABC-289's merge" will not come; d4 stands as written, …89b7220c).
Lock: every run as `flock <scratch>/<home>/<repo>/host-test.lock <cmd>`. Scratch copies via `git archive`, outside the repository. Scripts and outputs go to raw/ with placeholders. No bar moves after a reading; a miss is not re-played. Fences: ADRs, your task records, scratch. No src/, ticket, EPIC or board edit. No push, force, amend, rebase or merge into main.
Publish: sealed notes (contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); commit after each stage; at stage A's stop, a ## Stage A block in this brief (keep it in claimed/). Before each commit, run `node tools/grugops/records-path-check.js --base main`.

## Stage A
*Architect/Design (claude-opus-5-5, arch-ABC-292-probe), 2026-11-08, on `grugops/arch-ABC-292-probe` from `main` `3cbf5374` (`src/` tree `bba42fb7`).*

**Result: the premise is NOT MET, by rule 2. The probe has ended. Stage B is not asked for, and nothing timed ran.**
- **PREREG** `20261108T092441Z-architect-design-decision-e158a4a0`, sealed and committed at `e9e23d8f` before any measured run. `e9e23d8f` descends from the freeze commit `e88e91f9`. Batch order: S, then A, B, C, E, F, G (stage A), then D (PR8) and H (PR10's lane read), last. Every script, stage B's included, is sealed by sha256. Only batch S's type-check and d13's load-only smoke (start position 0) ran before it.
- **Readings** (`…d277788e`):
  - PR1 exact on all 7 rows; P0 read.
  - PR2, PR3 and PR4: 0 mismatches. PR3 covered QE's 84 frozen rows and the labeller over `G3`, the frozen positions and 27 896 game positions, `hot` 0. PR4 covered the memo, on-then-off, OFF against `main`, K1 (b)'s 116, and `cut` against `cand`.
  - PR5: 0 violations at 4 → 5 and at 5 → 5. PR6: 7 / 7.
  - **PR7: ON 53 / 58, OFF 54 / 58. One NEWLY-MISSED line, "win material, seed 1700".** Row 1632 is solved on both forms, used 16 838 (OFF) and 16 844 (ON) of 20 534.
- **Rule 2's defect check** (addendum `…9e29be9d`, its form sealed at `7f109cd2` before it ran): no defect. The runner is the suite's, the miss reproduces in a fresh process (ON g6d6, OFF g6g7, both depth 6), the source is d5's, and the seam is exact on 19 145 positions of the puzzle's tree. **The miss is real.**
- **Decision** (`…22e36b63`): NOT MET. `ABC-292` is not built and goes back to BA/PM. No value moved, no subset, no re-play.
  - PR9, PR10, PR11 and stage B did not run, by the PREREG's sealed line.
  - It is a miss in d14 (c)'s list, so by the owner's ruling (`…23d30c72`) it is the stop for the hand-valued path: E3b, E6, and outposts on hand values (`…e63ff24f`). **The owner is to be told.**
  - Owed by Architect/Design after your ruling: `ADR-0076`'s dated line (F5, "accepted, not in force").
- **Rules fired:** rule 2 (NOT MET). Rules 1 and 4 did not fire. Rule 4 was not read: PR9 did not run.
- **Lock:** about 32 s logged in `raw/out/holds.txt` (S 4 s, A 16 s, B 2 s, C 10 s, K under 1 s), plus four unlogged parse and type checks of a few seconds each. Under 1 min in all. Every run was under the lock, alone, on one core.
- **Also done (records only):** `ADR-0024`'s dated pointer, in § Status after the fifth block and at d4. `ABC-289`'s merge will not come, so d4 stands as written (`…89b7220c`).
- **Fences held:** no `src/`, ticket, EPIC or board edit. No push, force, amend, rebase or merge. No timed row, and no held window taken.
