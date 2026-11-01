---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T18:09:43Z
subtask: arch-d3-under-load
role: architect-design
ref: .grugops/context/arch-d3-under-load/
branch: new grugops/arch-d3-under-load from main (worktree .claude/worktrees/arch-d3-under-load)
width: records only.
---
# Architect: rule how ADR-0055 D3's nps validity rule reads on a shared host (QE-254-a)
## Facts
Two ALONE-start A4 reads of ABC-254 voided under the 5 % spread rule (qe-ABC-254 …1c801504 / …09221f68 on branch grugops/qe-ABC-254; qe-ABC-254-a4 …ab3062eb / …d9649ce2 / …f704f071 on branch grugops/qe-ABC-254-a4 — read with git show). Foreign load arrives within ~1 min of start, much of it short-lived processes (< 4 s) the per-run snapshot cannot name — possibly including this session's own records/SE hops (git, node seal scripts), not only the owner's other repo.
## Do
- Rule a validity method for nps A/B reads on this host that is robust to bursty foreign load and keeps the bar's meaning — e.g. paired-ratio median over interleaved pairs, discard pairs whose per-run foreign-core reading exceeds a threshold, require ≥ N clear pairs per board, or a CPU-time (process user+sys) based nps instead of wall time. Name its false-pass risk vs today's rule.
- **The ruling is forward-only:** it applies to a FRESH pre-registered read; it must not re-grade the two existing reads (their data is already seen). State that.
- Say whether it amends ADR-0055 D3 (your call; no NFR moves → no owner ask unless you judge it a big call), and what the Orchestrator must do to make a window "alone" (e.g. no other hop of this session running at all).
## Fences
memory-bank/50-decisions/ADR-0055* and your notes only. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-d3-under-load, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-d3-under-load` from `main` `83b0ff2d`. Records only. Nothing was run, built, timed, pushed or merged. The QE raw files were read with `git show`, and host topology was read from sysfs.
- **The ruling, D3-V2:** recorded as the `ADR-0055` addendum (§ Addendum — 2026-11-01) with a dated status line.
  - **Unchanged:** the bars, the statistic (head median ÷ base median nps), 5 runs per build per board, the 5 % spread, and one board re-run then VOID.
  - **Changed:**
    1. A not-clear pair is discarded, never force-graded.
    2. Foreign cores ≤ 0.8 (was 1.0), with no foreign vitest or cutechess and Tctl < 85 °C.
    3. Admission is blind. The reading is the first 5 admitted pairs, and the order alternates by admitted count.
    4. At most 15 attempts per board per schedule, else VOID-LOAD (not a result, not a miss).
    5. Agreement guard: if the paired-ratio median and the graded ratio fall on different sides of a bar, the board takes the one re-run, then VOID.
- **Forward-only:** the ruling applies to a fresh read pre-registered after the addendum. `qe-ABC-254` and `qe-ABC-254-a4` stay UNRESOLVED and are not re-graded. Their runs are never pooled.
- **False-pass risk:**
  - Per graded board, it is about equal to today's rule: the same envelope and statistic, with build-blind and outcome-blind admission.
  - Residual sub-threshold contamination comes to ≈ 6 × 10⁻⁴ per board, assuming independence (`UNKNOWN - verify`).
  - More boards get graded, so false passes can rise with them in absolute terms, at about 10⁻³ per board.
  - Disclosed: the rule was calibrated on seen data. It binds only fresh runs and loosens no bar.
- **Evidence:**
  - Probe CPU time is flat (4.30–4.54 s) under load. The loss is per cycle, so CPU-time nps is rejected.
  - Slowdown tracks foreign cores: median −2.8 % at 1.0–1.5, −5.6 % at 1.5–2.5, −9.1 % above 2.5.
  - The host has 4 fast cores (CPUs 0–3, 5.16 GHz) and 8 slow cores (3.29 GHz).
- **ALONE window, the Orchestrator's duties:**
  - Dispatch the timed hop only when every hop of this session has returned, records hops included. The board's "Running:" list must name only the timed hop.
  - No background job may be alive. Dispatch nothing else, and run no command yourself until the hop returns.
  - Record the window's start and end UTC in the brief.
  - Foreign sessions are absorbed by the rule. On VOID-LOAD, ask the owner for a quiet window, or route back to the Architect for `taskset` pinning.
- **ADR-0055 amended:** yes, by addendum. The D3 prototype stays not accepted. **Owner ask:** none (no bar, NFR, requirement or scope moves).
- **Next (Orchestrator):** a fresh `qe-ABC-254` A4 read under D3-V2. QE's driver needs the discard path, the order rule and the cap, all in its new pre-registration.
- **Commits:** claim `fc704619`; ADR addendum `4a896e3f`; notes, this Result, the trace row and the move to done/ in the closing commit.
- **Notes** (sealed, contextRoot = this worktree's `.grugops/context`): decision `20261101T181555Z-architect-design-decision-6f646a39`, observation `20261101T181555Z-architect-design-observation-603a0ca9`.
- **Trace row** appended to `plans/traceability.md`. Refs on both notes: ADR-0055, ABC-254, QE-254-a/d, ABC-250/251/253, EPIC-010.
