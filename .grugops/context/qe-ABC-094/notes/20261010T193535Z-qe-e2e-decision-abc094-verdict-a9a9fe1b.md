---
id: 20261010T193535Z-qe-e2e-decision-abc094-verdict-a9a9fe1b
kind: decision
by: qe-e2e
at: 2026-10-10T19:35:35Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ABC-095
  - ADR-0035
  - ADR-0036
  - ADR-0037
  - QE-094-a
  - src/book.ts
  - src/book.test.ts
  - 20261010T193535Z-qe-e2e-observation-abc094-readings-mutants-clause-b-cost-gates-62a73713
  - 20261010T193535Z-qe-e2e-observation-abc094-gap-register-3058eacd
  - 20261010T193535Z-qe-e2e-artifact-ref-abc094-probe-19fb5b97
  - 20261010T191557Z-software-engineer-decision-abc094-injected-reader-and-warn-sink-probe-holds-no-limb-d14f72cb
  - 20261010T191557Z-software-engineer-observation-abc094-a1-a7-readings-clause-b-cost-gates-77180424
supersedes:
---

# QE `ABC-094`: PASS_WITH_GAPS. `A1`–`A7` are met by the delivered code, and `A5`'s stream half has no owner yet

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.

| item | value |
|---|---|
| subtask | `qe-ABC-094` |
| worktree | `.claude/worktrees/qe-ABC-094` |
| branch | `grugops/ABC-094-book-probe` |
| base | `97223dfe` |
| code | `8cf395fc` (`src/book.ts` +153/−0, production; `src/book.test.ts` +359/−0) |
| SE tip reviewed | `59358836` (no `src/` change after `8cf395fc`) |
| QE commit | `58726139` (test only: `src/book.test.ts` +99/−2, plus the probe) |

Every reading is QE's own, taken with QE's own harness, mutant runner and cost harness (`…19fb5b97`). The
SE's notes (`…d14f72cb`, `…77180424`) were used as pointers only.

## Verdict

**PASS_WITH_GAPS.**
- `A1`–`A4`, `A6` and `A7` are MET on `8cf395fc`.
- `A5` is MET for the count, the no-throw and the "never stdout" parts. Its "on stderr" part is the warn sink
  that the composition root binds. That binding is `ABC-095`'s. **`ABC-095`'s page does not carry it yet**:
  its `A5` counts one warning per process but names no stream. That is gap `QE-094-a` (MEDIUM, BA/PM).
- QE's harness bound the sink to stderr in a child process and read stdout 0 B and stderr 1 line. This shows
  the seam supports the binding. It is QE's binding, not delivered code.
- The delivered suite left 8 non-equivalent mutants green. QE closed all 8 with test-only additions, plus
  one more row that kills M30 (`QE-094-b`, CLOSED). The other gaps are INFO (`…3058eacd`).

## Next

- **On QE's reading, no Security/NFR hop fires here.** `ADR-0036` clause (b) reads 0 / 0 / 0 on QE's own
  run, so it fires on `ABC-095`. The Orchestrator decides.
- **UAT:** the diff carries production lines (`src/book.ts`), so the waiver does not apply. The owner's word
  is owed.
- **`PUZZLE_DEEP`:** not triggered, because no file on the trigger list is touched.
- **BA/PM:** fold `QE-094-a` into `ABC-095` `A5` before `ABC-095` is pulled.
- QE has not merged and has not pushed.
