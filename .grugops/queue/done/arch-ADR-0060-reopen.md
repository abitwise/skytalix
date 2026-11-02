---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:20:12Z
subtask: arch-ADR-0060-reopen
role: architect-design
ref: .grugops/context/arch-ADR-0060-reopen/
branch: new grugops/arch-ADR-0060-reopen from main (at dispatch) — worktree .claude/worktrees/arch-ADR-0060-reopen
width: records; probes ≤ 5 min each, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, node counts only, no timing.
---
# Re-open ADR-0060 (P1 LMR) on main under its UNCHANGED bars
## Read
ADR-0060 (PROPOSED, RE-OPENED: on main A4(a) chooseMove pos-6 0.8699 > 0.85; A3 search() max drift 63 cp > 27 cp at position-6/g5h6), arch-phase2-rebase notes (…d5870a7a, …f9f440c9, …e4680ed2) and raw/probe, arch-phase2-p1 raw/probe.
## Do
- Search forms on main that meet EVERY pre-registered bar (A4 a/b/c, A3 drift ≤ 27 cp + ≥ 95 %, mate floor, zugzwang 7/7, G1 ≥ 54): e.g. no reduction at PV nodes, cap 1 at PV / 2 elsewhere, divisor/offset changes, depth threshold, index threshold. Pre-register the candidate set and selection rule BEFORE reading results; pick by the rule.
- If a form meets all bars: write it into ADR-0060 (status PROPOSED, ready for owner acceptance) with main's door and head counts.
- If none does: say so plainly and state the owner question — whether the A3 27 cp cap (1.5× one base's max) may be re-derived on main — with your recommendation and what number it would become. Do not move the bar yourself.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board; don't touch ADR-0025. No push, force, amend, rebase, merge into main. Leave nothing running; delete scratch copies.
## Publish
Sealed notes (task arch-ADR-0060-reopen, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-ADR-0060-reopen` from `main` `cfff6993`. Records
  only. Probes ran on a scratch `git archive` of `main`'s `src/` (= `0b73f51d`), outside the repository. There were
  three batches, each under `flock <host-test.lock> timeout 300` with every job under `timeout 300`. They read
  deterministic node counts only, with no timing. The scratch copy is deleted. The patch, the driver, the forms, the
  runners and 63 outputs are under `.grugops/context/arch-ADR-0060-reopen/raw/probe/`.
- **Pre-registered first.** The set, the bars and the rule were sealed and committed before any run (decision
  `…0481036d`, commit `0df9b672`). The set has nine forms: R0 is decision 1, C1 has no PV reduction, C2 caps PV at 1
  with cap 2, C3 is PV flat 1 with cap 2, C4 caps PV at 1 with cap 3, C5 is PV flat 1 with cap 3, C6 caps PV at 1
  uncapped, C7 is C4 with index ≥ 2, and C8 is C4 with divisor 1.75. The rule: the eligible form (every read bar met)
  with the most reach at 47 000 nodes wins.
- **Instrument exact:** the door reads 1 116 785 / 1 602 457 / 1 575 537 / 476 244, and R0 reads 849 358 / 1 183 439 /
  1 155 460 / 414 286.
- **Result: NO FORM MEETS EVERY BAR ON `main`.** Nothing is written in as the rule, no bar moves, and the build does
  not start.
  - R0 misses the 27 cp cap (63) and A4 (a) on `chooseMove` position-6 (0.8699).
  - C4, C6 and C7 clear A3 (max 5 / 5 / 10 cp) and A4 (a). They miss A4 (b) (+0.168 / +0.174 / +0.189) and lose
    `zugzwang.004`; C7 also loses `.001`.
  - C5 and C8 miss the cap (30), A4 (b) and `.004`.
  - C1, C2 and C3 miss A4 (a) (position-6 0.87–1.28).
  - No form misses only the cap.
- **Owner question** (ADR-0060 § Status): may A3's 27 cp cap be re-derived on `main`?
  - It would become **94 cp** (⌊1.5 × 63⌋).
  - **A "yes" alone admits no form**: R0 still misses A4 (a).
  - **Recommendation: keep the cap and park P1.** Take P3 next (the Orchestrator's call). After P3 merges, re-measure
    decision 1 unchanged, by a dated line. That P3 restores the margin is a judgement, `UNKNOWN - verify`.
  - The default without an answer is the flat 1-ply LMR on `main`.
- **Records:** an ADR-0060 dated status block and a dated line in decision 9. ADR-0025 and ADR-0056 are untouched,
  and so are src/, tests, plans and the board.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` from the seal-time
  UTC clock; 3 of 3 read back):
  - decision `20261102T152416Z-architect-design-decision-0481036d` (the pre-registration);
  - observation `20261102T153114Z-architect-design-observation-79be958e` (results);
  - decision `20261102T153114Z-architect-design-decision-e17a23f4` (the ruling and the owner question).
- **Commits:** claim `51987d29`; pre-registration `0df9b672`; ADR + notes + raw `021d3efc`. This Result, the trace
  row and the move to done/ are in the closing commit. Not pushed, not merged.
- **Open:** the owner's answer on the cap; the Orchestrator's choice between P3 next and parking P1; ADR-0056 D2's P1
  row may want a dated line ("re-open probe: no form"). That line is not this hop's fence.

### Trace row (10 cells, header order)

| arch-ADR-0060-reopen | ADR-0060 re-open on main: 9 forms pre-registered (sealed + committed before any run), rule = most reach among forms meeting every bar; none eligible (R0 cap 63 + A4a 0.8699; C4/C6/C7 A3 + A4a met but A4b +0.17–0.19 and zugzwang.004 lost; C5/C8 cap + A4b + .004; C1–C3 A4a); no form misses only the cap; bars unchanged; owner question: re-derive 27 cp → 94 cp admits nothing alone; recommend keep, park P1, P3 next, re-measure after | EPIC-011 | ADR-0060 (PROPOSED, re-opened; re-open probe dated block) | NFR-005 (A4 bars unchanged), NFR-008; no NFR file | `grugops/arch-ADR-0060-reopen` (records only; claim `51987d29`, prereg `0df9b672`, ADR + notes `021d3efc`) | scratch measurements only (deleted; raw kept); door and R0 reproduce main's counts to the node | — (records) | — | Records done (Architect); awaits the owner (27 cp cap) and the Orchestrator (P3 next / P1 parked) |
