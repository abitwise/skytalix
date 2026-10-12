---
task: wave-2026-09-25
subtask: bapm-amend-ABC-095
role: ba-pm
status: done
branch: grugops/bapm-amend-ABC-095
tip: 56682ec9
base: main @ 85e9d5cc
finished_at: 2026-10-12T13:45:05Z
---

BA/PM amended ABC-095 to ADR-0037 § Addendum R1–R3 and ADR-0036 § S1/S3:
- Scope gains book-file.ts, 10 re-targets, 2 pins, ABC-119's lane move and the clause (d) file list.
- A2's Given is cold, and A7 binds read and warn.
- The NFR-004 miss bar is warm, and NFR-008 gains two UNKNOWN costs on N8-LANE.
- The Security prediction is struck and replaced, with AR-095-READ and AR-095-L1UNIT named.
- Test note 4 gains the copy's rules. Size S -> M (3). DoR 10/10; the wiring hop may proceed.

Done pages, dated and delivered by ABC-095's diff:
- ABC-119: the A1/A3/A4 Givens and the default-lane row move to a real, byte-verified, book-absent mkdtemp
  copy, removed by exact-path rmSync. A3(iv) asserts the warning is present.
- ABC-043: an A1 pointer, a ruling note and 3 (N) rows.
- ABC-044/045/046: (N) confirmed, including ABC-044 A6, which the Architect's list did not name.
- ABC-042 is not edited.

Gates at 689ec437: lint, typecheck, build, npm test 57/1775 success:true, skip 0. No timing read.
Notes: .grugops/context/bapm-amend-ABC-095/notes/ (…b4ee59f2 decision, …809044ec observation,
…540b2956 artifact-ref). One trace row appended. Not merged, not pushed.
Owed to the Orchestrator: the board row's size S -> M; ABC-095's stale status/column front matter; the
brief's queue-name typo (see the .claim.md).
