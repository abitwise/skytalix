---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:20:12Z
subtask: arch-phase2-p3
role: architect-design
ref: .grugops/context/arch-phase2-p3/
branch: new grugops/arch-phase2-p3 from main (at dispatch) — worktree .claude/worktrees/arch-phase2-p3
width: records; probes ≤ 5 min each, wrapped in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`, node counts only, no timing.
---
# Measure the other Phase 2 items on main; design the best as a fallback
## Read
EPIC-011 Phase 2 rows (P3, P4, P5, P6), ADR-0056 D2 (order now P1 → P4 → P3 → P5 → P6), ADR-0059 (dropped: the depth-1 cut under a piece's value likely skipped forks — heed it), arch-phase2-p1 probe (P3 0.88–0.91×, P5 0.83–0.99× on the old ABC-264 base).
## Do
- On main, measure P4 (late-move/move-count pruning), P3 (futility near leaves), P5 (null move R by depth), P6 (razoring) alone: nodes at depth 8 (both recursions), reach at 47 000 nodes, depth-5 drift, mate floor, zugzwang. Treat ABC-264's lesson as a design constraint (margins vs threats; the drift check cannot see forks — propose a cheap tactical check that can).
- Pick the best Elo-per-cost item that stands independent of P1 and write its ADR (PROPOSED) with pre-registered bars and falsifiers, intent named. Another hop is re-opening ADR-0060 in parallel — use the next free ADR number after checking memory-bank/50-decisions at commit time; don't edit ADR-0060.
## Fences
memory-bank/50-decisions and your records only; no src/tests/plans/board; don't touch ADR-0025/0060. No push, force, amend, rebase, merge into main. Leave nothing running; delete scratch copies.
## Publish
Sealed notes (task arch-phase2-p3, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), on branch `grugops/arch-phase2-p3` from `main` `cfff6993`. Records only.
  - **Base:** the probes ran on a scratch `git archive` of the branch's `src/`, tree `f2388e40`. That tree is the same
    as `main`'s at dispatch and at commit.
  - **How:** every run went through `flock <host-test.lock> timeout 300`, with deterministic counts only and no
    timing.
  - **The shared lock:** two batches waited behind another agent's lock holder (q265). That run was left alone.
  - **Clean-up:** the scratch copy is deleted. The patch, driver, scripts and outputs are under
    `.grugops/context/arch-phase2-p3/raw/probe/`.
- **Instrument check:** the door reproduces `main`'s counts to the node: 1 116 785 / 1 602 457 / 1 575 537 /
  476 244, and reach 5.558. A rebuilt reverse-futility knob reproduces `4d1c0616`'s head counts to the node.
- **Measured on `main`, each item alone.** Each figure is depth 8 (`search()` kiwi / pos-6 | `chooseMove` kiwi /
  pos-6), then reach at 47 000 nodes.
  - **P3, futility 150 / 350 / 550 cp, d ≤ 3:** 0.796 / 0.788 | 0.830 / 0.822, and +0.279 ply (+0.416 at 20 000).
    - Drift 100 % (max 10 cp / 0); mate 0 / 189; zugzwang 7 / 7; `G1` 54 / 58.
    - Cut audit: 0 flips in 2 943 samples.
  - **P4, move-count pruning:** 0.64–0.97×, and +0.34 to +0.50 ply. But:
    - drift is 87.7–89.3 % within 25 cp, under the 95 % bar;
    - the audit shows 11.5–11.9 % flips, with 8–15 errors of 200 cp or more;
    - the depth-1 form costs nodes on position-6 (1.03× / 1.10×).
  - **P5, R = 3 + ⌊d / 4⌋:** 0.88–0.95×, and +0.058 ply. Clean but depth-gated.
  - **P6, razoring 250 / 450 / 650:** 0.79–0.83×, and +0.305 ply. But it loses `zugzwang.004`, drifts up to 345 cp,
    and shows 1.98 % audit flips, one of them a missed mate.
- **The tactical check (ABC-264's lesson): a cut audit.**
  - **How it works:** nodes where the rule fires are sampled from `search()` at depth 6 over the 196 rows. Each is
    searched fresh with the rule on, the rule off, and the rule off at a full window. A "flip" is a wrong-side verdict,
    and its error is measured in cp.
  - **Why:** it sees interior-node errors that drift cannot.
  - **Calibrated on ABC-264's rule:** 24 flips in 28 486 cuts (0.08 %), one at 201 cp, none at 300 cp or more.
  - **Sensitive:** 0.25 % at 40 cp a ply (a 386 cp threat caught), 0.42 % at a zero margin.
  - **So the "skipped forks" judgement is not supported.** The −42 is noise (P(≤ 44 | 0) = 0.095) or an unmeasured
    cost outside the cut verdicts. The ADR-0059 dated line records this, and the retry ruling is unchanged.
- **Chosen: P3, ADR-0061 (PROPOSED), intent GAIN.**
  - **Why:** best Elo per cost with every safety row clean. It is independent of P1 (it reads no move number or
    reduction), and it is an S.
  - **Margins as the lesson's rule:** depth 1 covers a quiet move's own eval change. From depth 2 up, each margin is
    above the piece a threat most often wins (350 > 325, 550 > 500). The linear 100 / 200 form flips at depth 2.
  - **Bars:**
    - `A3`: drift, every non-mate within 25 cp, both recursions; mate floor at depth 5, 0; zugzwang 7 / 7.
    - `A3` (d): cut audit ≤ 0.5 % flips, and 0 flips of 200 cp or more.
    - `A4` (a): ≤ 0.88× on each of four (measured 0.7958 / 0.7876 / 0.8295 / 0.8220).
    - `A4` (b): ≥ +0.20 ply at 47 000 nodes (measured +0.279).
    - `A4` (c): `G6` ≥ base.
    - `A5`: `G1` ≥ 54 / 58.
    - `A6`: C2′ GAIN ≥ 50.0 / 100, plus S′ and the Levels deep lane.
  - **Instrument check:** 888 786 / 1 262 046 / 1 306 981 / 391 451.
  - **Falsifiers:** F1–F8.
- **Dated lines:** in `ADR-0056` D2, rows P3–P6 and the suggested order: P3 now → P1 if re-opened green → P5
  (NEUTRAL) → P4 after O1h → P6 not before E1 / E2. In `ADR-0059` § Status, item 4 is measured. ADR-0025 and
  ADR-0060 are untouched.
- **Open:**
  - **Owner:** "accept / decline ADR-0061". Under reading (b) the build may start from `main` now.
  - **Orchestrator:** P3 ahead of the re-opened P1 (recommended: it does not wait on the 27 cp answer).
  - **BA/PM:** cut the P3 page.
  - **Later:** the depth-4 row (750 cp, measured clean, +0.321) as a dated amendment.
- **Commits:** claim `ec50aaa5`; ADR + notes + raw `08e40472`. This Result, the trace row and the move to done/ are in
  the closing commit. Not pushed, not merged.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`; `at` 2026-11-02T17:14:13Z
  from the seal-time UTC clock; 3 of 3 read back, index rendered):
  - observation `20261102T171413Z-architect-design-observation-55f7725e` (the probe);
  - decision `20261102T171413Z-architect-design-decision-004b35ed` (P3, ADR-0061, bars, the audit);
  - observation `20261102T171413Z-architect-design-observation-e8bec702` (artifacts, BA/PM inputs, open questions).

### Trace row (10 cells, header order)

| arch-phase2-p3 | P3–P6 measured on main alone: P3 futility 150/350/550 d≤3 0.79–0.83× d8, +0.279 ply at 47k, drift 100 % max 10, mate 0/189, zugzwang 7/7, G1 54/58, audit 0/2 943; P4 drift 87.7 %, audit 11.5 %; P5 +0.058 ply (depth-gated); P6 zugzwang.004 lost, drift 345 cp, audit 1.98 %; cut audit on ABC-264's rule 0.08 % (one 201 cp), forks hypothesis not supported; ADR-0061 PROPOSED, GAIN, bars pre-registered | EPIC-011 | ADR-0061 (PROPOSED); ADR-0056 D2 dated line; ADR-0059 Status dated line | NFR-005 (A4/G6), NFR-008 (deep rows); no NFR file | `grugops/arch-phase2-p3` (records only; claim `ec50aaa5`, ADR + notes `08e40472`) | scratch measurements only (deleted; raw kept); door and RF knob reproduce recorded counts to the node | — (records) | — | Records done (Architect); awaits the owner (accept ADR-0061), the Orchestrator (P3 vs P1 order), BA/PM (P3 page) |
