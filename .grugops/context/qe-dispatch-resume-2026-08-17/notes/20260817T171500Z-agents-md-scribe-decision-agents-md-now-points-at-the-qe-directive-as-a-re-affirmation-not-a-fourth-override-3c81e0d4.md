---
id: 20260817T171500Z-agents-md-scribe-decision-agents-md-now-points-at-the-qe-directive-as-a-re-affirmation-not-a-fourth-override-3c81e0d4
kind: decision
by: agents-md-scribe
at: 2026-08-17T17:15:00Z
verified_by:
confidence: high
refs:
  - AGENTS.md
  - memory-bank/60-progress.md
  - .grugops/context/qe-dispatch-resume-2026-08-17/notes/20260817T150244Z-orchestrator-decision-the-owner-answered-the-qe-stop-escalation-it-was-not-deliberate-1f4c9a02.md
  - .grugops/context/qe-dispatch-resume-2026-08-17/notes/20260817T162917Z-orchestrator-decision-no-retro-qe-on-the-five-the-owners-call-and-the-premise-i-corrected-first-7b3e5d19.md
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes:
---

# `AGENTS.md` now carries the QE directive — as a POINTER and a RE-AFFIRMATION, not as a fourth kit override.

One new section, **`## QE validation authority`**, 25 lines, inserted between `## Test and UAT
authority` and `## Deployment posture`. It is a pointer in the same shape as the pointers in
`## Test and UAT authority`: **`memory-bank/60-progress.md` § "Standing directive — EVERY ticket
passes through QE's validation. QE dispatch resumes. 2026-08-17." is the authority; `AGENTS.md`
only names the rule and its boundaries.** The directive's reasoning is deliberately NOT restated.

## The four things the section had to carry, and does

1. **The rule.** Every ticket gets a `qe-e2e` hop and QE's recorded verdict before it may leave
   `In Review`; none reaches `Done` without one. Owner's, 2026-08-17, standing, revocable.
2. **Forward-only.** The five gated without QE (`ABC-068`, `ABC-061`, `ABC-062`, `ABC-063`,
   `ABC-064`) stay closed — the owner declined the retro pass. The residual exposure is named and
   not glossed: **+435/−11 lines of assertions in `src/cli.test.ts` never reviewed by QE.**
3. **QE IS NOT UAT** — the misreading refused in advance, and the one that matters. The 2026-08-17
   zero-production-lines waiver waives UAT and nothing else and stands completely unamended; the
   2026-08-16 signature ruling stands unamended. The section says plainly that conflating the two
   is what let QE go missing for five consecutive tickets.
4. **Precedence.** NOT a kit override — `agent-factory/workflows/04-ticket-to-pr.md` step 5 already
   required the hop, so this re-affirms a binding rule. **The kit overrides remain THREE** (branching
   model, deployment posture, zero-production-lines UAT waiver); "a reader who counts four is wrong"
   is stated explicitly, because the file draws that same distinction carefully for the 2026-08-16
   ruling two sections above and blurring it here would undo that work.

## Verified against the files, not asserted

- `agent-factory/workflows/04-ticket-to-pr.md` line 29 reads *"QE/E2E breaks the feature and reports
  the result and gaps"* — step 5. The re-affirmation claim holds.
- `.grugops/factory.config.json` `quality.mandatory_gates` is `["lint", "typecheck", "unit",
  "build"]`, unchanged and untouched. QE's hop is described as a workflow step, not a gate command.
- The +435/−11 figure is carried forward from the Orchestrator's `7b3e5d19` note, not recomputed.
- `AGENTS.md` is 26 240 bytes after the edit — under the 32 KiB Codex cap.

## What was deliberately NOT done

No other section of `AGENTS.md` was touched, reformatted or "improved" (coding rules 9–12). No
config key, no `plans/board.md` change, no column move, no ticket cut, no gate added or softened, no
command or dial invented. `agent-factory/…` was read only. The detector the Orchestrator offered the
owner is **not** created and **not** assumed — it remains unruled-on and is not mentioned in
`AGENTS.md` as if it existed.

## Fidelity

Hand-authored `decision` note. `context.human_admission` is `off`, no `context-io` writer is present
on this install, and no `finding` is admissible here — this note carries no stamp and is not
load-bearing as verification.
