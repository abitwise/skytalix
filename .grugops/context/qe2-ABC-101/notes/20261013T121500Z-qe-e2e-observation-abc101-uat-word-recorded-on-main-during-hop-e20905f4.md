---
id: 20261013T121500Z-qe-e2e-observation-abc101-uat-word-recorded-on-main-during-hop-e20905f4
kind: observation
by: qe-e2e
task: qe2-ABC-101
at: 2026-10-13T12:15:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - 20261013T120150Z-orchestrator-decision-owner-word-abc101-uat-accepted-4c410543
  - 20261013T121300Z-qe-e2e-decision-abc101-a11-recheck-verdict-pass-with-gaps-4da1976a
supersedes:
---

# The owner's UAT word on `ABC-101` was recorded on `main` during this hop. QE's "owed" lines read the state at `fe0d48c4`

This note is hand-authored and unsealed. While this hop ran, `main` gained `b52737d8` (12:01:50Z, the Orchestrator). Its decision note
`wave-2026-09-25` `…4c410543` transcribes the owner's word on ABC-101: "pass this, color looks correct now". It records the word as
discharging `A11g` and as the UAT exit, with the merge held until this hop reports and the gates pass on `main`.

QE's verdict `…4da1976a`, its observation `…b51fa1c4`, the ticket's `## QE` re-check section and the trace row were written against the
brief's base `fe0d48c4`, and they say "the owner's UAT word (now with `A11g`) is owed". **Read those lines as superseded by that
record.** QE did not hear the word and does not assess it. The UAT signature is the owner's and is transcribed by the Orchestrator
(`AGENTS.md` § Test and UAT authority). Nothing else in the verdict changes: `A11a`–`A11f`, `A9`, the plants, `N8-LANE`, the
gates and the gaps stand as read. The earlier notes are not edited, because notes are append-only.
