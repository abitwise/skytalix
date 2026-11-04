---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T21:36:44Z
subtask: arch-records-1104
role: architect-design
ref: .grugops/context/arch-records-1104/
branch: new grugops/arch-records-1104 from main — worktree .claude/worktrees/arch-records-1104
width: records only; nothing run.
---
# Owed Architect lines
Read the Orchestrator notes of 2026-11-04T21:20:01Z and 21:25:55Z; qe-ABC-301-s0's verdict …9fd32f43 and gaps …270757f7 (on branch grugops/qe-ABC-301-s0; read with git show); qe-ABC-302's verdict …051a910d; and arch-ABC-289 …62012bbe § 6.
1. BEFORE ANYTHING ELSE, because the fit waits on it: rule the two src/evaluate.passer.test.ts rows ("…every half 0", "at the shipped values (every half 0) every part is 0") under ruling …42c82347: re-pin or retire, with your dated line in ADR-0067. Commit this first and say so in a note.
2. Dated lines:
   - ADR-0070 d4 and ADR-0067's precondition: P1's own-phase form, using QE's replacement wording in …9fd32f43.
   - ADR-0067 d5: the tracer reads the seam through the frozen fixtures, on condition TUNE_DEEP is green at the fit commit.
   - ADR-0056 row Q2.
3. QE-302's LOW carry (moved breadth runs deep only; R3 kills none of 27; R9's full row outside AGENTS.md's engine line): a dated line in ADR-0046 saying what, if anything, should change.
ADR-0066 d5's line waits for W1's merge; do not write it yet.
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-records-1104, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-04T21:45:43Z. Records only; nothing was run, and nothing is left running. No `src/`, `tools/`, ticket, EPIC or board edit.
- **1. The two rows, ruled first** (`ADR-0067`, commit `a1e19981`; note `…c9056f1d`, commit `01040b65`).
  - "… by own rank in PASSED's shape, every half 0": **RE-PINNED**, on its eg line only. `mg`, the shape and U's `{ 0, 0 }` stay as written.
  - "at the shipped values (every half 0) every part is 0 on every fixture": **RETIRED** by name, with `ZERO`. B-T4's re-pin keeps the assertion's form, and one literal cannot hold 44 fixtures' outputs.
  - Both apply at scope 4, on an emission with a non-zero E4a eg half.
- **2. Dated lines** (commit `ca00e4a5`; note `…8c6e7ec0`).
  - `ADR-0070` d4 and `ADR-0067` precondition 1: P1's own-phase form in QE's wording.
  - `ADR-0067` d5: the tracer reads the seam through the frozen fixtures, on condition `TUNE_DEEP` is green at the fit commit.
  - `ADR-0056` row Q2 and its D2 line.
- **3. `ADR-0046`, QE-302's LOW carry.** The run rule's "four lines" reads thirteen. R3 should re-point to the taper doors at the file's next touch (`UNKNOWN - verify` until run). Deep-only breadth, R9's reach and the 27-mutant parity do not change.
- **Not written:** `ADR-0066` d5, which waits for W1's merge.
- **Owed by others:** BA/PM on `ABC-301` (P1 banner, test note 4) and R3's ticket; `se-ABC-301-fit` needs this branch on `main`.
