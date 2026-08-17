---
id: 20260817T200331Z-ba-pm-observation-the-obvious-mapping-produces-a-false-pass-on-abc062-b7f30d14
kind: observation
by: ba-pm
at: 2026-08-17T20:03:31Z
verified_by:
confidence: high
refs:
  - ABC-105
  - ABC-062
  - ABC-066
  - ABC-031
  - ABC-076
  - plans/tickets/ABC-105-qe-hop-detector.md
  - .grugops/context/quality-gate-ABC-066-qe/notes/20260816T001900Z-qe-e2e-decision-qe-verdict-on-abc066-all-six-criteria-5750b5bb.md
supersedes:
---

# The obvious ticket→note mapping gives a **false pass on `ABC-062`** — one of the five.

The mapping was named as the hard part of this ticket and it is, but not for the reason expected.
The expected difficulty was that QE's folder is named for a different task than the ticket
(`quality-gate-ABC-031-qe-2026-08-17` vs `ticket-to-pr-ABC-031-2026-08-17`). The **actual**
difficulty is that the natural fix for that — stop using folder names, match on the note's `refs:`
field instead — is wrong in the dangerous direction.

Measured: with a refs-only rule, **`ABC-062` reads as QE-COVERED.** The covering notes are three
`qe-e2e` notes under `.grugops/context/quality-gate-ABC-066-qe/`, authored about **`ABC-066`**, which
cite `ABC-062` in `refs:` as a cross-reference. Refs record *what a note relates to*, not *what it is
a verdict on*, and nothing in the note schema distinguishes those two senses.

**A refs-only detector would therefore have reported one of the five skipped tickets as validated.**
A detector whose first false pass is on a member of the exact set that motivated it is worse than no
detector, because it would have been cited as evidence the rule was holding.

Supporting measurements behind the four-condition criterion in `ABC-105`:

- **1288** notes scanned, **0** without front matter — front matter is a reliable substrate.
- **223** notes carry `by: qe-e2e`; **223/223** also match the filename form `^\d{8}T\d{6}Z-qe-e2e-`.
  The two signals agree today, but the filename convention **changed mid-history** (older:
  `<ts>-qe-e2e-<kind>-<hash>.md`; today's: `<ts>-qe-e2e-<kind>-<slug>-<hash>.md`), so the ticket
  reads front matter and ignores filenames. **The brief's stated naming convention was checked
  against the real folders before a criterion was written on it, and it is only half the story.**
- **223/223** `qe-e2e` notes carry at least one `ABC-` id in `refs:` — so requiring a refs citation
  costs nothing against real QE work.
- The conjunction (folder names it **and** refs cite it **and** `kind: decision`) accepts `ABC-031`,
  `ABC-076`, `ABC-066` and rejects `ABC-062`. That is `A3` in the ticket, and it is deliberately
  written so that a refs-only implementation passes every other criterion and fails that one.

Also measured, and it becomes `A4`: the board's `Done` section yields **38** tickets by the
line-leading `- [ABC-xxx]` form and **42** by a naive `ABC-\d+` scan, because four ids appear inside
other rows' prose. An engineer who greps will be wrong by four and will not notice.
