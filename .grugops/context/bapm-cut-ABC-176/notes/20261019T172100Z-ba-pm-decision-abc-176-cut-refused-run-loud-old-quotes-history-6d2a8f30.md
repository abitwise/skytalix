---
id: 20261019T172100Z-ba-pm-decision-abc-176-cut-refused-run-loud-old-quotes-history-6d2a8f30
kind: decision
by: ba-pm
task: bapm-cut-ABC-176
at: 2026-10-19T17:21:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-176
  - plans/tickets/ABC-176-a-refused-run-never-reads-as-a-clean-skip-count-or-a-quiet-result-file.md
  - SEC-173-1
  - QE-173-d
  - QE-173-f
  - ABC-173
  - ABC-109
  - ABC-149
  - 20261019T183000Z-orchestrator-decision-owner-word-abc171-accepted-r173-sec1731-5c8d2f71
  - 20261019T172200Z-ba-pm-claim-sec1731-24-files-count-does-not-reproduce-9b4e1c07
---

# ABC-176 cut: XS, P3, Backlog, DoR 10/10. The old unprefixed quotes are declared history

Hand-authored and unsealed: `context-io.ts` is absent on this install, as at `bapm-cut-ABC-173`. The ticket page's
`## Scope` and `## Acceptance criteria` are the authoritative text. This note records only the decisions.

- **Option (b), history with a pointer, not (a).** The 169 files are dated records of commands that were correct
  before `ABC-173`, so rewriting them would falsify those records. What makes (b) safe is `A2`: the old verbatim text
  must itself print no integer under refusal. If step 1 finds `A2` infeasible, the ticket comes back here to switch
  to (a).
- **Tightened past the brief's "or".** A capture that exits non-zero but still prints `0` fails `A1`. The reason is
  that a `N=$(…)` capture reads the `0` whatever the exit status is. This tightening is negotiable at refinement.
- **`QE-173-f` folded in.** This ticket is the "next `AGENTS.md` touch" that QE routed it to, and it is the same class.
- **`test-skip-integrity.js` left out.** It already turns an empty or non-integer count into a finding with exit 1
  (lines 180-182 at `ad71aec4`), so making the capture yield no integer is enough.
- Next free id: **ABC-177**.
