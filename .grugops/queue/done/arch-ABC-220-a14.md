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

## Result

*Architect/Design, 2026-10-30, task `arch-ABC-220-a14`. Records only, at `main` `f22e31b3`, on branch `grugops/arch-ABC-220-a14`. Nothing was built, run or timed (`qe-ABC-241` holds the host ALONE).*

- **F1 ruling: both routes, inside D7's intent. No requirement moved, so there is no owner item.**
  - **A14a, the lane row** (`UCI_DEEP`, `src/uci.real-engine.test.ts`): one `readyok` per `isready`. The busy one is the line straight after the only `bestmove`, and the last line. No line is lost, the `bestmove` is legal, spawn to exit is ≥ 2 000 ms, M4 holds, exit 0. `68ba364c` already asserts this.
  - **A14b, a QE hand reading** of the ≤ 100 ms bound. An async probe under `.grugops/context/qe-ABC-220/probe/` runs with plain `node`, never vitest (the `ABC-168` `A6` precedent). It writes `isready` 100 ms after `go movetime 2000`. R1: `bestmove` → `readyok` ≤ 100 ms. R2: the `isready` was busy. R3: one `readyok` per `isready`. One counted run. Any miss makes A14 NOT MET. The probe spec is ticket test note 5.
  - Rejected: opening `C2` (route (1) at `ABC-168`), and dropping the bound (that would move the requirement).
- **Confirmed:** the refusal text `info string TimeMode takes level or simple-tournament, got <v>; kept <old>` (D1's rule for the values offered at this build, from the same tuple). A14a's file is `src/uci.real-engine.test.ts` (D8: no new file and no new spawn site).
- **D5 bound reading (F2), for Security/NFR's entry beside `NFR-011`:** one budget (≤ 22 000) + `AR-NFR004-A` (≤ ~31) + the drain (≤ 100) ≈ 22 131 ms worst case. "≤ 22 s" is read to the whole second as a delay < 22 500 ms, not as ≤ 22 000 exactly. The entry text, with the reading added, is in `ADR-0052` D7.
- **Written:** `ADR-0052` (a § Status bullet and dated lines in D1, D7, D8, D9). `ABC-220` (a header block, A14 → A14a/A14b with the old text struck, A10 confirmed, Scope 6, test note 2, new test note 5, an NFR-triggers line).
- **Notes:** drafted in `.grugops/context/arch-ABC-220-a14/raw/` (`note-decision.md`, `note-observation.md`), with `seal.mjs` and `seal-spec.json`. **Sealing is pending** because no node process may run while the QE read holds the host. After it ends, run this from the worktree: `node .grugops/context/arch-ABC-220-a14/raw/seal.mjs .grugops/context arch-ABC-220-a14 .grugops/context/arch-ABC-220-a14/raw/seal-spec.json`, then commit the notes.
- **No SE hop is owed.** QE writes and runs A14b.
- **Checks:** `git diff --check` is clean, and the host-path scan found 0 hits. `reference-check` was not run (it is a node script).
- **Not touched:** `src/`, `tools/`, `data/`, the board. Nothing was pushed or merged. The main checkout's `claimed/` copies are untouched; the tracked done/ copies are on this branch.

### Trace row (10 cells, header order)

| ABC-220 (A14 ruling) | A14 → A14a (lane: order, count, nothing lost) + A14b (QE async probe outside vitest: bestmove → readyok ≤ 100 ms, isready 100 ms after go); refusal text and A14a's file confirmed; D5 bound read to the whole second (< 22 500 ms) | EPIC-009 | — | NFR-011 (accepted-risk entry text with the reading), NFR-004, AR-NFR004-A; ADR-0052 D1/D7/D8/D9 dated lines; ABC-173 C2, ABC-168 A6 precedent | grugops/arch-ABC-220-a14 (records only): ADR-0052, ABC-220, .grugops/context/arch-ABC-220-a14/raw/ (drafts; seal pending) | none run (records only) | — (UAT owed; QE verdict signs) | — | ABC-220 In Review (no board move) |
