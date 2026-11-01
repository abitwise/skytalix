---
subtask: arch-adr-folds-nov1
role: architect-design
ref: .grugops/context/arch-adr-folds-nov1/
branch: new grugops/arch-adr-folds-nov1 from main (worktree .claude/worktrees/arch-adr-folds-nov1)
width: records only (no vitest, no engine, no games). qe-qehop-growth holds the host for timing.
---
# Architect: three LOW ADR folds (records only)
## Do
1. ADR-0046 § Addendum 2026-10-31 condition 4: co-edit the `-t "<moved describe>"` spelling to match the BA/PM dated line of 2026-11-01 (escaped brackets; check the passed count). Source: bapm-ABC-248-close notes …82916ae5, …305c1830; qe-ABC-248 QE-248-a.
2. ADR-0046 § Status: a dated line — tranche 2 delivered (ABC-248 merged ef4cd095; G8 H 9.09 s / B 9.37 s); W1 stays in force.
3. ADR-0053 d10: a dated line closing its `UNKNOWN - verify` wall — the milestone-1 batch read 22.22 h at 18.0 games/h, run via rpair Skill Level 6 (ABC-247). Source: qe-EPIC-010-m1-batch-2 notes …428e3797, …1a53a7f9.
Insertions or dated lines only; no ruling changes.
## Fences
- memory-bank/50-decisions/ADR-0046*, ADR-0053* only (plus your notes). No board, trace, plans/, src/, tools/, data/, AGENTS.md. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-adr-folds-nov1`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-11-01, Architect/Design. Done, records only. Branch `grugops/arch-adr-folds-nov1` (worktree `.claude/worktrees/arch-adr-folds-nov1`, from `main` `f88873d4`). ADR commit `ead08533` (16 insertions, 0 deletions); notes commit `4c91fceb`. Nothing run, built or timed (`qe-qehop-growth` holds the host). Not pushed, not merged. Only ADR-0046, ADR-0053 and own notes edited.**

- **1. ADR-0046 condition 4.** A dated sub-line "Spelling 2026-11-01" under condition 4 gives the escaped `-t` form, byte-equal to BA/PM's dated line of 2026-11-01 (`… \[deep, ENGINE_DEEP=1\]`). The check is "4 passed", not exit 0 (QE-248-a). The condition's text is kept.
- **2. ADR-0046 § Status.** A dated line "Tranche 2 delivered 2026-11-01": `ABC-248` merged `ef4cd095`, `G8` H 9.09 s / B 9.37 s, `NFR-008` MET, W1 not triggered, no tranche 3, W1 stays in force. It wins over "tranche 2 is OPEN".
- **3. ADR-0053 decision 10.** A dated sub-line "Wall read 2026-11-01" closes "the batch's wall time grows by `UNKNOWN - verify`": 22.22 h at 18.0 games/h (400 games, 0 pauses), inside 21.7–24.1 h, via `rpair` at `Skill Level` 6 (`ABC-247`).
- **No ruling changes.** No NFR level, cap, pin, W, step set or lane command moves. No owner word is owed.
- **Still owed (not now):** condition 2's unit, only if the SE-248-b floor trips.
- **Notes** (task `arch-adr-folds-nov1`, contextRoot = worktree; 2/2 sealed, read back): decision `…ff1e419d`, observation `…8195ad63` (artifacts; no `gate_run`, so not an `artifact-ref`).

### Trace row (10 cells, header order)

| ABC-248 / ABC-247 (records) | ADR-0046 cond 4 `-t` escaped ("4 passed", QE-248-a); ADR-0046 Status: tranche 2 delivered, W1 stays; ADR-0053 d10 batch wall 22.22 h at 18.0 games/h (rpair Skill Level 6) | EPIC-010 | ADR-0046 § Status + § Addendum 2026-10-31 cond 4 (dated 2026-11-01); ADR-0053 d10 (dated 2026-11-01) | NFR-008 MET at qe-ABC-248 (G8 H 9.09 s); no NFR moves | grugops/arch-adr-folds-nov1 @ ead08533: memory-bank/50-decisions/ADR-0046-…, ADR-0053-… (records only) | none run (records only) | n/a | — | folds done; no board move |
