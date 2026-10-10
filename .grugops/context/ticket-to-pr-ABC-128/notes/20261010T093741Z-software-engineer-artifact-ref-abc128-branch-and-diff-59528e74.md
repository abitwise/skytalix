---
id: 20261010T093741Z-software-engineer-artifact-ref-abc128-branch-and-diff-59528e74
kind: artifact-ref
by: software-engineer
at: 2026-10-10T09:37:41Z
verified_by:
confidence: high
refs:
  - ABC-128
  - ABC-120
  - ABC-021
  - EPIC-002
  - branch:grugops/ABC-128-take-back-guard
  - commit:00187b8
  - src/turn-loop.test.ts
supersedes:
---

# `ABC-128` built: branch `grugops/ABC-128-take-back-guard`, code `00187b8`, test-only

Hand-authored, no seal. Base `fcbf06b` (`grugops/wave-2026-09-25`). Not merged, not pushed.

- `git diff --numstat fcbf06b...HEAD -- src`: `6 1 src/turn-loop.test.ts`, the only line. No
  production file, so the zero-production-lines UAT waiver applies if the merge keeps it so. The QE hop
  is still owed.
- Changed: three `expect(vi.mocked(keyHistory)).toHaveBeenCalledTimes(0)` lines in `ABC-120`
  `A3`/`A4`/`A5`, one 2-line comment in `A3`, and `ABC-021` `A8`'s `it` name.
- **Owed:** the QE hop, the `In Review` move (Orchestrator; `plans/board.md` is fenced from this hop)
  and the merge. `ABC-129` edits the same file at a different line. It rebases mechanically.
- **Not guarded, as the ticket scoped:** `keyHistory` on `quit`, `command`, `rejected`, `ambiguous`,
  `game-over` and `eof` (`UNKNOWN - verify`). The new `A8` title no longer claims them.
