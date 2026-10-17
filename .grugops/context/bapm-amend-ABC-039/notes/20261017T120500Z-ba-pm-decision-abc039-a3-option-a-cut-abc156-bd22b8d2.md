---
id: 20261017T120500Z-ba-pm-decision-abc039-a3-option-a-cut-abc156-bd22b8d2
kind: decision
by: ba-pm
task: bapm-amend-ABC-039
at: 2026-10-17T12:05:00Z
verified_by:
confidence: high
refs:
  - ABC-039
  - ABC-156
  - A3
  - A4
  - A5
  - 20261017T110500Z-software-engineer-decision-stop-a3-183cc20d
  - 20261017T120000Z-ba-pm-observation-abc039-rederived-15-at-3215004c-1055cfc1
supersedes:
---

# ABC-039 A3: option (a). The chronology is the source count in a fixed commit window. ABC-156 repairs metrics.md.

**Ruling: (a).** `A3`'s link to metrics.md was a cross-check that assumed metrics.md was right. The cut page said so
("verified … the one record that got this right"), and that is now refuted. Keeping the 13 forces the register to drop
two real moves or block forever. Option (b) holds a `P2` record ticket behind a repair that none of its ordinals
(2, 3, 4, 5) depend on. That adds a dependency chain and fails INVEST *independent*.

**Window: commit `3215004c`, inclusive, in git commit order. Count: 15.** A record-date window ("through 08-12")
needs a judgment call on `ca6c4243` and gives 14. It also opens a third per-ticket mismatch (`ABC-028` 2 vs 3).
The commit window is the exact state metrics.md measured, so the comparison is like for like, and the gap is exactly
`ABC-017` +1 and `ABC-019` +1. A commit window cannot drift, so stating the number in `A3` is not pasting it.

**Follow-up owed: `ABC-156`** (`XS`, `P3`, DoR 10/10, `Backlog`, blocked by ABC-039 merging). It is owed because
`plans/metrics.md:28` is a live figure that the Factory Coach reads as evidence. Under ABC-039's own rule ("correct the
live clause, register the archived"), the live figure gets a repair. If it does not, the next measurer records this
defect again, which is the loop ABC-039 exists to stop.

**Amended on the page:** `A3` (window, count, exclusion, ancestry check, ordinal positions); `A4` (c); `A5` (the
`ABC-156` page allowed); the Out-of-scope metrics.md claim struck; current cites. **DoR 10/10.** No owner word needed:
the brief delegated (a) or (b), and nothing here changes scope, priority or a gate.

**Residual (named):** `ABC-156` was the next free id at `6c1257dd` (board `:878`, trace `:1069`). A parallel hop
cutting a ticket on another branch could choose the same id, and the Orchestrator resolves that at merge.
