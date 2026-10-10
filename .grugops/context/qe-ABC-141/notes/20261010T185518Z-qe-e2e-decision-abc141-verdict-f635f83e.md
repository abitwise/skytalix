---
id: 20261010T185518Z-qe-e2e-decision-abc141-verdict-f635f83e
kind: decision
by: qe-e2e
at: 2026-10-10T18:55:18Z
verified_by:
confidence: high
refs:
  - ABC-141
  - QE-010-b
  - QE-010-c
  - ADR-0011
  - src/move-input.ts
  - src/move-input.test.ts
  - src/history-pane.ts
  - 20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17
  - 20261010T185518Z-qe-e2e-observation-abc141-readings-exit-gates-529ceebb
  - 20261010T185518Z-qe-e2e-observation-abc141-gap-register-baafc88b
  - 20261010T185518Z-qe-e2e-artifact-ref-abc141-probe-aef1ebbe
supersedes:
---

# QE `ABC-141`: PASS. `A1`–`A4` are MET, both owner-Q4 measures hold on all 3 files, and the reported flake did not reproduce in 8 runs

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.

| item | value |
|---|---|
| subtask | `qe-ABC-141` |
| worktree | `.claude/worktrees/qe-ABC-141` |
| branch | `grugops/ABC-141-stale-comments` |
| base | `957a85c3` |
| code | `f92868f6` |
| SE tip reviewed | `4bfc7b3e` (no `src/` change after `f92868f6`) |

Every reading below is QE's own, taken with QE's own probes (`…aef1ebbe`). The SE's notes (`…7739f7b7`,
`…8d96eef4`) were used as pointers only.

## Verdict

**PASS.** `A1`–`A4` are MET. The gaps are 1 LOW and 3 INFO, and none of them blocks (`…baafc88b`). QE added no
test and made no fix: the ticket is comment-only and has no behaviour to break.

## Judging each new sentence against the code

1. **"one for the prompt plus one per checking candidate": TRUE, and shown to be the rule, not just a total.**
   QE's counter logs the position of every `legalMoves` call. At the tip: 1 call on the start position and 6
   on 6 distinct other positions, with all 6 candidates `#`. As a control, the pre-`ABC-010` fixture
   (`75dcc0f5`) gives 6 = 1 + 5: `Q8xd4` gives no check and costs no derive.
2. **"six queens on `d4` (six candidates, all `#`) cost seven: 1 + 6": TRUE** at `957a85c3` and `f92868f6`.
3. **"`parseFen` imposes no upper bound (it accepts fullmove 10000)": TRUE.** It gives 10000, and
   `100000000000000000000` is accepted too.
4. **"no ticket delivers one": TRUE.** Of the 10 tickets that mention fullmove, 9 are `done` and `ABC-141` is
   in development. None of them scopes a fullmove upper bound.

## Exit (owner Q4, `…5c8e2a17`)

Both measures hold on all 3 files. The measures and controls are in `…529ceebb`. **On QE's reading, the UAT
waiver applies (WAIVED, not accepted).** The Orchestrator applies it at `Done`.

## Next

- The Orchestrator moves the ticket out of `In Review`. No Security/NFR trigger.
- QE has not merged and has not pushed.
