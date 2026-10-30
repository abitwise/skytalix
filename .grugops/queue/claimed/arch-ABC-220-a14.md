---
subtask: arch-ABC-220-a14
role: architect-design
ticket: ABC-220
ref: .grugops/context/arch-ABC-220-a14/
branch: new grugops/arch-ABC-220-a14 from main (worktree .claude/worktrees/arch-ABC-220-a14)
width: records only, NO builds/tests/timing (a QE timing read runs ALONE on the host)
---
# Architect: ABC-220 A14 is unmeasurable as written (F1, MEDIUM) + two design confirmations
## Read
ABC-220 ticket (A13, A14, § Test notes), ADR-0052 (D1, D7, D8), ADR-0044 D5, ABC-173 C2 (synchronous child rule),
se-ABC-220 notes on branch grugops/ABC-220 (`…80ed6a2f`, `…a76bc514`) and its code 68ba364c (read with `git show`).
## Do
1. F1: A14's "readyok ≤ 100 ms after bestmove" cannot be timed in the synchronous-child lane, and the script reaches
   the child during the search, not 100 ms later. Rule: re-word A14 to what the lane can read, or name an out-of-vitest
   reading QE runs (scratch driver, async spawn), or both. Keep it inside ADR-0052 D7's intent; amend D7/D8 text dated
   if needed. Owner only if a requirement moves.
2. Confirm or correct: the refusal text built from the tuple ("TimeMode takes level or simple-tournament, got <v>; kept
   <old>") vs D1's wording; A14 living in src/uci.real-engine.test.ts rather than D8's named file.
3. F2: state the D5 bound reading ("22 s" to the whole second = 22 000 ms + overshoot) for Security/NFR's NFR-011 entry.
## Fences
Records only (ADR text, the ABC-220 ticket, your notes). No src/, tools/, data/. Never run builds, tests or timers. No board
edits. Never push/force/amend/rebase/merge into main. No host paths. Seal notes with contextRoot = your worktree.
## Publish
Sealed notes (task `arch-ABC-220-a14`), commit on the branch, `## Result` + trace row here, brief + claim to done/.
