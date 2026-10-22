---
id: 20261022T145007Z-ba-pm-observation-8c7b8b8c
kind: observation
by: ba-pm
at: 2026-10-22T14:50:07Z
verified_by: 
confidence: high for the readings (read only: QE's scratch outputs, QE's worktree harness, ADR-0036, plans/); no run, no timing
refs:
  - ABC-196
  - QE-196-a
  - QE-196-b
  - QE-196-c
  - QE-195-a
  - QE-194-a
  - AR-193-HUNKHDR
  - ADR-0036 S1
  - 99d07d32
  - 3d26dff8
  - 36f19186
  - 0492a007
  - 35a2d708
  - 7c312c42
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - plans/tickets/ABC-196-a-drifted-anchor-or-a-dropped-capability-line-turns-a-twin-row-of-r2-mutants-into-a-silent-control.md
  - 20261022T144447Z-qe-e2e-decision-df052eb2
  - 20261022T142926Z-qe-e2e-decision-fd211043
  - 20261022T142926Z-qe-e2e-observation-7e6804d4
  - 20261022T144447Z-qe-e2e-observation-c6b997d0
  - 20261021T205709Z-ba-pm-decision-f0144de0
  - 20261021T205709Z-ba-pm-observation-466ee18d
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
supersedes: 
seal: sha256:6689594d4ddf3e650255de0cdd56a394a0d3ac2bfddaaa0198e6b2aaef56660c
---

# BA/PM readings for the `QE-196-a` ruling, at `main` `7c312c42`: QE's R3 outputs read as QE's register states, and no open ticket is a fold target. No harness run was taken

Cites QE `…decision-df052eb2`, `…observation-7e6804d4` and `…observation-c6b997d0` as authoritative. These are read-only readings. I cut no ticket, so I took no measurement. I ran no harness, no vitest and no timing (`qe-ABC-178` may be taking timing on this host).

**QE's R3 outputs** (read only, `…/scratchpad/qe196/out/`):
- `fix-R3.out` (at `3d26dff8`) and `m-fix-R3.out` (R3' at `36f19186`): last line `r2-mutants: 25 of 25 limb-1 rows as expected; …` (rc 0 per QE). The PP-EDIT row reads `L2 … identical (limb 2: FIRES)`.
- `fix-R3-pre195.out` and `m-fix-R3-pre195.out`: the `DIFFER` line and the not-as-expected line each name 8 limbs: `PP-TPL:limb2 PP-TPL:limb3 PP-REDIR:limb2 PP-REDIR:limb3 RA-PLUS:limb2 RA-PLUS:limb3 SP-N5:limb2 SP-N5:limb3`. `PP-EDIT:limb2` is absent, against 9 at base (`ABC-196` `A5`). `limb 1 MISMATCH: RA-PLUS SP-N5` stays.
- So the pre-`ABC-195` reading that `ABC-196` `A5` specifies detects R3. That is the reading the acceptance rule in the decision note makes standing.

**The harness at `0492a007`** (QE's worktree, read only):
- the `ABC-196` header paragraph says the guard "checks the verdict word only, not which line fires";
- `pe` anchors its template on the first `\nfunction `, `\nexport function ` or `\nasync function ` in `src/cli.ts`, and edits `resolveOptions(process.argv.slice(2))` in place;
- `pp` anchors above `import { isSquareAttackedBy }` and appends leak() at end of file.

**`ADR-0036`** `ABC-195` block (v): `AR-193-HUNKHDR` closed on QE's read of the four `++` rows at `ABC-195`. (i) names PP-EDIT as "an in-place edit of a `process` read in a limb-2 holder". The block makes no claim about later drift.

**Fold targets:**
- No open ticket under `plans/tickets/` names `clause-b.mjs` or `r2-mutants.sh`, apart from `ABC-196` (In Review) and `ABC-095`.
- `ABC-095`'s frontmatter still reads `backlog`, but the board recorded it Done on 2026-10-12 (merged `ed7cb332`). Its mention is historical.
- So there is nothing to fold into, and the ruling is accept, not fold.

**Context:**
- `src/cli.ts`'s last three commits on `main`: `be6a5599` (ABC-174), `a48da51c` (ABC-096), `ac8deab1` (ABC-101). It is still the edit-heavy composition root.
- Main's `git status --porcelain` was empty at start, at `7c312c42`.
