---
subtask: arch-rule-ABC-205-g6
role: architect-design
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/arch-rule-ABC-205-g6/
branch: new grugops/arch-rule-ABC-205-g6 from grugops/qe-ABC-205 (ffa0a5e8), worktree ../wt-arch-rule-ABC-205-g6
width: 1 of 3 (records only — no timing, no G6, no harness games)
---

# Rule ABC-205's G6 STOP (QE-205-a)

## Do
- Read QE `qe-ABC-205/…234d9814` (verdict), `…35de132c` (G6 readings and frozen-clock variant counts), `…a44d9079`, and Orchestrator `qe-ABC-205/…4561be39`; the page § A5 / G6 reading rule; ADR-0031 (decision 4 and the addendum).
- Rule the STOP: lay out the options with cost, evidence and who decides — at least (1) ship a changed build (e.g. scale-only, or a cheaper taper), what it needs (new G6 + D on that build), and the frozen-clock node cost of each variant; (2) close ABC-205 unmerged (what EPIC-008 loses); (3) any reading of NFR-005's "≥ base" (owner bound — name it as such, do not move it). Recommend one.
- Frozen-clock node counts and static reasoning only. No real-clock timing, no G6 re-read, no games.

## Fences
- Only your worktree and `<scratchpad>/arch205g6/`. No `src/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task arch-rule-ABC-205-g6). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Architect/Design, 2026-10-25, branch `grugops/arch-rule-ABC-205-g6` @ `0daeed42` (= `ffa0a5e8` + records; not pushed,
not merged). Records only: frozen-clock node counts and relation values on scratch trees in `<scratchpad>/arch205g6/`.
No real-clock timing, no G6, no games, no `src/` edit.

- **Ruling: QE-205-a stands, and the forms are not defective.** Head needs +4.89 % nodes to complete depth 8 on
  position-6 and searches 1.84 % fewer nodes in 3 s. Base sits within ±0.5 % of its own depth-8 edge.
- **The gate carries the growth, not the blend:** every gate-on variant is +3.2 to +5.0 % to depth 8 on position-6.
  Gate-off: `s3` −0.08 %, `s3-B` −0.51 %. Scale 2 alone is +5.00 %, so the tree size does not track the constant.
- **No variant is predicted to clear "≥ base"** while base's median is 8. Gate-off variants need a throughput cost
  below 0.57 % / 0.15 %. Head's is 1.84 %. The variants' own costs are `UNKNOWN - verify`.
- **QE-205-b closed as substituted** (no reading owed). **QE-205-c** goes to the owner as a forward question.
- **Options:**
  1. **A changed build** (`s3`, `s3-B` or `s2-BG`). It needs the owner (new runs beyond `…4c3f7639`; `ADR-0031`
     addendum text) and BA/PM (scope). It costs G6 plus D (6–12 h) and is predicted to FAIL. Not recommended.
  2. **Close ABC-205 unmerged under S1. RECOMMENDED.** BA/PM closes it, and the Orchestrator makes the delivery call.
     0 cost; D is not owed. It loses proposal 1 (721 of 1 428 cp in game 1). It unblocks `ABC-207` and `ABC-215`
     (their Ready trigger).
  3. **A reading of "≥ base" (the owner's):** 3a as written FAIL; 3b catalog bound only MET; 3c straddle tolerance MET;
     3d frozen-clock depth instrument FAIL at d8 and MET at d7. Not recommended for ABC-205: chosen after the result.
- **Forward question (owner):** does "≥ base" stay graded for later EPIC-008 tickets, or does it become reported, with
  D as the judge? Default: it stays graded. A procedure step that needs no owner word goes to BA/PM: a frozen-clock
  depth-7/8 pre-check before any later reading.
- **Notes** (`.grugops/context/arch-rule-ABC-205-g6/notes/`): decision `…912bcb0d`, observation `…00c6a18d`.
- **Merge hazard:** this branch carries `b5d5cea5`'s `src/` diff (7 files) against `main`. Do not merge it as
  records. Take the records commit `0daeed42` alone.

**Trace row** (for the Orchestrator):

| ABC-205 (arch-rule-ABC-205-g6) | G6 STOP ruled: QE-205-a stands; no variant of the forms predicted to clear ≥ base on position-6; recommend option 2 (close unmerged under S1); option 1 and 3 are the owner's; forward question on ≥ base for later EPIC-008 tickets | EPIC-008 | king safety: queen scale ×3, tapered gated king square (not shipped) | NFR-005 G6 ≥ base: no bound moved; depth-8 nodes on position-6 head +4.89 %, gate-on variants +3.2–5.0 %, s3 −0.08 %, s3-B −0.51 %; throughput head −1.84 % (QE) | grugops/arch-rule-ABC-205-g6 @ 0daeed42 (ffa0a5e8 + records)<br>.grugops/context/arch-rule-ABC-205-g6/notes/ (2) | frozen-clock nodes d6–d8 on 13 scratch trees (identity tree = base); relation values A1–A3b; quiescence cell; no timing | UAT not signed (QE FAIL stands) | BA/PM closes ABC-205 under S1 (option 2); Orchestrator tells the owner, brings the forward question, rules D not owed | Blocked → BA/PM close (Orchestrator's move) |
