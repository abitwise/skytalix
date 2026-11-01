---
id: 20261101T181555Z-architect-design-decision-6f646a39
kind: decision
by: architect-design
at: 2026-11-01T18:15:55Z
verified_by: 
confidence: high on the rule as written and its forward-only scope; the false-pass probability is an estimate under an independence assumption (UNKNOWN - verify)
refs:
  - arch-d3-under-load
  - ADR-0055
  - ABC-254
  - QE-254-a
  - QE-254-d
  - ABC-250
  - ABC-251
  - ABC-253
  - EPIC-010
  - grugops/arch-d3-under-load
  - 4a896e3f
  - 83b0ff2d
  - grugops/qe-ABC-254
  - grugops/qe-ABC-254-a4
  - qe-ABC-254/20261101T172756Z-qe-e2e-decision-1c801504
  - qe-ABC-254/20261101T172756Z-qe-e2e-observation-09221f68
  - qe-ABC-254-a4/20261101T180821Z-qe-e2e-decision-ab3062eb
  - qe-ABC-254-a4/20261101T180821Z-qe-e2e-observation-d9649ce2
  - qe-ABC-254-a4/20261101T180821Z-qe-e2e-observation-f704f071
supersedes: 
seal: sha256:4597a51e0c5844227ac74938423d73e4126e427e8c9dda865b1e386667b34f65
---

# Architect ruling D3-V2: ADR-0055 D3's nps validity rule, read for a shared host. Discard dirty pairs and never force-grade them; foreign cores ≤ 0.8; 5 admitted pairs per board in ≤ 15 attempts; an agreement guard. Forward-only. No owner ask

Architect/Design, task `arch-d3-under-load`, records only, at `main` `83b0ff2d`. Recorded as the ADR-0055 addendum (§ Addendum — 2026-11-01), commit `4a896e3f` on `grugops/arch-d3-under-load`. Input: QE-254-a, the voids in `qe-ABC-254` (`…1c801504`, `…09221f68`) and `qe-ABC-254-a4` (`…ab3062eb`, `…d9649ce2`, `…f704f071`). Evidence for this ruling: the observation note of this task.

## Scope
This ruling governs D3's validity rule wherever a ticket cites it for a node-rate A/B criterion: `ABC-254` A4 and the speed rows of `ABC-250`, `ABC-251`, `ABC-253` and later O1 tickets. The D3 prototype itself stays not accepted.

## The ruling
- **Unchanged:**
  - the bars;
  - the statistic: head median nps ÷ base median nps, per board;
  - 5 graded runs per build per board, one fresh process per run, paired and interleaved;
  - (v1) values;
  - the 5 % spread bar, as (max − min) / median per build and board;
  - one board re-run, then VOID;
  - (v3) thermal, the start precondition, the gate waits, the lock and SHARED.
- **1. Discard, never force.** A pair is admitted only when, after it, all of these hold:
  - no foreign vitest or `cutechess-cli` is present;
  - both runs read foreign cores ≤ 0.8 (was 1.0);
  - both runs' after-run Tctl is below 85 °C.

  A pair that is not admitted is discarded. It is logged and never graded. "The second attempt is graded whatever it reads" is struck.
- **2. Blind admission, fixed count.**
  - Admission reads host counters and the probe's CPU time only, never nodes, nps, depth or a ratio.
  - A board's reading is its first 5 admitted pairs.
  - The next attempt runs base first when the board's admitted count is even. A retry keeps the discarded attempt's order.
- **3. Cap.**
  - A board gets at most 15 attempts per schedule.
  - A board with fewer than 5 admitted pairs at its cap is VOID-LOAD: not a result and not a miss. The miss rule does not fire.
- **4. Agreement guard.** If the median of the 5 admitted paired ratios and the graded ratio fall on different sides of any bar the board is read against (1.10, 1.00, or 0.97 for the guard), the board takes the one re-run, then VOID.
- **5. Forward-only.**
  - It applies only to a fresh read whose pre-registration is sealed after this addendum.
  - It does not re-grade `qe-ABC-254` or `qe-ABC-254-a4`. Both stay UNRESOLVED as graded.
  - Their runs are never pooled into a fresh read.
  - `ABC-235` and `ABC-240` stand as read.

## False-pass risk against today's rule
- **No bias in expectation:** admission is blind to build and outcome, and order alternates.
- **Residual sub-threshold contamination:** at most about −4 % on one run. In the seen runs, 5 of 130 runs at ≤ 0.8 were below −3 %.
  - A false pass needs base hit and head spared in ≥ 3 of 5 pairs, so ≈ 10 × 0.04³ ≈ 6 × 10⁻⁴ per board, assuming independence (`UNKNOWN - verify`).
  - Even then, only a true ratio of about 1.06 or more can cross 1.10.
  - The agreement guard cuts the cases near a bar further.
- **Per graded board:** about equal to today's (same envelope, same statistic).
- **In total:** the rule grades more boards, so absolute false passes can rise with them, at about 10⁻³ per board.
- **Disclosed:** the threshold and the cap were set after seeing `ABC-254`'s numbers. They bind only fresh runs and loosen no bar.

## Rejected
- CPU-time nps: the loss is per cycle, not lost time slices.
- Paired-ratio median as the graded statistic: its spread would need a new bar.
- A 10 % spread bar.
- More runs with a trimmed range.
- `taskset` pinning. It is the next step if a fresh read returns VOID-LOAD.

## What an ALONE window needs (the Orchestrator)
- **Before dispatch:** every hop of this session has returned, records hops included (`git` and `node` seal scripts). The board's "Running:" list names only the timed hop (today it shows `qe-ABC-255` and `se-ABC-260`). No background job of this session is alive.
- **During the window:** nothing else is dispatched. The Orchestrator runs no command and waits on the completion notification. The host lock does not make a window ALONE.
- **The QE brief records** the window's start and end UTC, and that no other hop ran.
- **Foreign sessions** (the owner's `grugops` vitest, other repos) are absorbed by the start precondition and item 1. On VOID-LOAD, the Orchestrator either asks the owner for a named quiet window (a host ask) or routes back to the Architect for pinning.

## Amends ADR-0055? Owner?
- **ADR-0055:** yes, a dated addendum and status line. D3's prototype stays not accepted.
- **Owner:** not owed. No bar, NFR bound, requirement or scope moves. One threshold tightens and forced grading becomes discard.

## Risks
- **Yield:** the admission rate in the seen reads was about 55 % (53 of 97 attempts). That gives ≈ 0.99 for 5 of 15 per board at that rate, falling to ≈ 0.78 at 40 %. Under heavier foreign load, VOID-LOAD is likely, which is why the ALONE duties matter.
- **Mechanism:** which mechanism causes the per-cycle loss is `UNKNOWN - verify` (slow-core move, SMT sibling, or boost).
- **QE's driver needs three edits** to implement the rule: the discard path, the order rule and the cap. They belong in the fresh pre-registration, and are not this hop's.
