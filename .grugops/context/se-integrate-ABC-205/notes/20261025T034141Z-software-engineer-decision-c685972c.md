---
id: 20261025T034141Z-software-engineer-decision-c685972c
kind: decision
by: software-engineer
at: 2026-10-25T03:41:41Z
verified_by: 
confidence: high (git-checked diffs)
refs:
  - ABC-205
  - EPIC-008
  - ABC-206
  - ABC-212
  - ABC-214
  - ABC-217
  - ADR-0031
  - ADR-0026
  - OD-205-1
  - OD-205-2
  - 7c9cd9b9
  - f3e14a00
  - 18a0570e
  - 4f650a45
  - f47b3429
  - d5690c5c
  - 1fdd4748
  - f00013da
  - grugops/ABC-205
  - grugops/ABC-205-final
  - arch-rule-ABC-205-stop/20261023T231000Z-orchestrator-failed-attempt-c3d204a5
  - se-ABC-205-owner-words/20261024T080705Z-software-engineer-observation-12af0d93
  - plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
supersedes: 
seal: sha256:bb4de9a04d78c5058d50a46e92e4434039e49cadf558181907cbd4d225c47dd7
---

# Software Engineer: ABC-205 integrated onto main. Revert 1fdd4748 re-applies the build, merge f00013da brings the owner-word edits. One header conflict, resolved by intent

Branch `grugops/ABC-205-final`, worktree `../wt-ABC-205-final`, from `main` `d5690c5c`. The brief named `a5cafba3`, but main had since gained ABC-217 (`gameend.ts` plus three test files, none of them ABC-205 files). The brief says "from current main". Not pushed, not merged into main. `main` was never merged into `grugops/ABC-205`.

## Commits
- `1fdd4748` `revert(ABC-205)`: reverts the restore `7c9cd9b9`. That brings back the build `613f4548`, `51997b7e` and `68be197f`, which are already ancestors of main (`…c3d204a5`).
- `f00013da` `merge(ABC-205)`: `--no-ff` of `grugops/ABC-205` `f3e14a00` (`18a0570e` S1, OD-205-2 and OD-205-1 edits, plus their sealed notes). No conflicts.

## Conflict (1, in the revert)
- `src/evaluate.ts` header, one hunk, against **ABC-214** `a5dfb0dc` (not ABC-206 or ABC-212).
  - ABC-214 added two carve-out lines after "all code are ours.": "These values are not licensed under the Apache License … See NOTICE."
  - ABC-205 appended "The king endgame table is this project's own." to that same line.
- **Resolution: both kept.** ABC-205's sentence goes on its own line after the carve-out, so "These values" still names only the Michniewski values.
  - NOTICE lists the seven CC BY-SA tables by name. `KING_ENDGAME_TABLE` is not one of them, so ABC-205's sentence agrees with ABC-214's intent.
  - Comment-only; the code body is byte-identical to `grugops/ABC-205`.
- `src/engine.test.ts` auto-merged against ABC-212 in disjoint hunks, as the build note predicted (`…3050b787`).

## Equivalence proof (`-U0` diffs, `@@` and `index` lines stripped)
1. `diff(1fdd4748, f00013da) -- src` is **byte-identical** to `diff(4f650a45, grugops/ABC-205) -- src`: 3 files, +26/−25.
2. `diff(main, tip) -- src` equals `diff(f47b3429, f3e14a00) -- src` (ABC-205 from its own base) except for one hunk, the evaluate.ts header line above. Stat: 7 files, +351/−75, against +351/−76.
3. `diff(f3e14a00, tip) -- src` equals `diff(f47b3429, main) -- src` (main's own changes carried over) except for that same header hunk.
- `src/evaluate.ts` against `grugops/ABC-205`: one hunk, lines 20–23 of the header comment only.
- ABC-206 touched none of ABC-205's seven src files.
- Non-src diff against main: only the two `se-ABC-205-owner-words` notes.
