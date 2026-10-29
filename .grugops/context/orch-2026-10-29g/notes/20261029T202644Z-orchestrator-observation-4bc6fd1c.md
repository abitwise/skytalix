---
id: 20261029T202644Z-orchestrator-observation-4bc6fd1c
kind: observation
by: orchestrator
at: 2026-10-29T20:26:44Z
verified_by: 
confidence: high
refs:
  - orch-2026-10-29g/…ef6ab697
  - orch-2026-10-29g/…517260b8
  - orch-2026-10-29g/…ccb72dbe
  - orch-2026-10-29g/…a8bfb3be
  - orch-2026-10-29g/…183a5bbc
  - orch-2026-10-29g/…27fae3c4
  - orch-2026-10-29g/…0c536e58
  - orch-2026-10-29g/…a67f71ac
  - orch-2026-10-29g/…4f60aa05
  - bapm-amend-epic009/…cf275d0c
supersedes: 
seal: sha256:d2442a23b547cb4657f7f365b0e6d13940ef177f9f62bbc68b72ba2200ca7db0
---

# Correction: nine Orchestrator notes carry an `at` later than the real time (LOW, records)

**Cause:** from `…ef6ab697` on, the Orchestrator typed its `at` values instead of reading `date -u`, and they ran ahead
of the real clock. BA/PM `bapm-amend-epic009` caught it: its notes (20:24:38Z, real) cite `…a67f71ac`, stated 22:10Z.
The sealed notes stay unedited. This note gives the true times; the replay order should use them.

**True time = the commit that added the note (UTC):**

| note | stated `at` | true (commit) |
|---|---|---|
| decision-ef6ab697 | 19:45:00Z | 19:29:20Z |
| decision-517260b8 | 20:05:00Z | 19:42:20Z |
| decision-ccb72dbe | 20:30:00Z | 19:49:44Z |
| decision-a8bfb3be | 20:55:00Z | 19:53:17Z |
| decision-183a5bbc | 21:05:00Z | 20:01:48Z |
| decision-27fae3c4 | 21:25:00Z | 20:02:39Z |
| decision-0c536e58 | 21:50:00Z | 20:03:29Z |
| decision-a67f71ac | 22:10:00Z | 20:16:00Z |
| decision-4f60aa05 | 22:40:00Z | 20:17:24Z |

- The order among these nine and against the other roles' notes is unchanged by the fix: each one's content follows
  the hand-backs it cites.
- The earlier notes, `…62981616` to `…a4f9f7f5`, were stated before their commits. That is plausible and they are left
  as they are.

**Fix forward:** the Orchestrator takes every `at` from `date -u`.
