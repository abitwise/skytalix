---
subtask: arch-adr0047-d4-ABC-213
role: architect-design
ref: .grugops/context/arch-adr0047-d4-ABC-213/
branch: new records branch grugops/arch-adr0047-d4-ABC-213 CUT FROM main 2c3be9ca, worktree ../wt-arch-adr0047-d4-ABC-213
width: 3 of 3
---

# ADR-0047 D4: the dated ABC-213 clarification line

## Do
- Write the dated D4 line your ABC-213 design ruling promised (clarification only; no decision moves — if writing it would move one, STOP and report).
- Records only: `git diff --stat 2c3be9ca..HEAD -- src tools package.json` must print nothing; paste it.

## Fences
- Only your worktree. No board edits. Never push, force, amend or rebase; never merge into main.

## Publish
- Seal notes (task arch-adr0047-d4-ABC-213). ## Result into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done: the line is written, and it is a clarification. No decision moved, so the STOP did not fire.** The branch is
`grugops/arch-adr0047-d4-ABC-213` in `../wt-arch-adr0047-d4-ABC-213`. It was cut from `main` `2c3be9ca`, as briefed;
`main` has since moved to `50cbb679` with records only. **Head `ecdd63b1`**, one commit. Not pushed and not merged.
No board or traceability edit.

- **Records only.** `git diff --stat 2c3be9ca..HEAD -- src tools package.json` printed nothing (exit 0). The whole
  diff is 4 files and +65 lines: the ADR-0047 D4 line (+6) and this task's sealed note plus its index renders.
- **The line**, the last bullet of D4 in `memory-bank/50-decisions/ADR-0047-…md`:
  > **2026-10-24, `ABC-213` (`arch-adr0047-d4-ABC-213`).** A reading, not a change. On a double fault (the write or
  > the close fails, then the cleanup unlink fails with an errno code), removal is best-effort. The result is the
  > **first** failure's code (D5), and the partial file may remain. A codeless unlink throw is a defect and is
  > rethrown (D5). `ABC-213`'s `A1`–`A3` pin this, and `A2` pins the removal on a single fault. They run in-process
  > against a call-through `node:fs` double that re-roots relative paths (the `ABC-213` design ruling). `ABC-203`'s
  > `A8`–`A10` stay in the writer child.
- **The drafted text** from the design ruling (`…d7ce173f`), with two edits for precision only. The row ids carry
  their ticket, and `A2` is named as the single-fault pin.
- **Why it is below the owner's bar** (`…5aaf7cec` item 3):
  - D4 is silent on a removal that itself fails, and D5 decides that case.
  - The partial file remaining is forced by the failed unlink. It also remained before the fix (QE A5 base).
  - No § Rollback falsifier moves, and neither does D7 nor "one child runs them all".
- **Verified against the build.** A read-only `git show` of `grugops/ABC-213:src/pgn-file.ts` at `e46db08e` matches
  the line. So does QE A5 at head: 1 file, and `PGN not saved: EFBIG`.
- **Note:** `.grugops/context/arch-adr0047-d4-ABC-213/notes/20261024T084624Z-architect-design-decision-f7e47ba4.md`
  (decision, sealed through `admitAndAppend`, reads back sealed).
- **Not here:** QE-213-d, the `pgn-file.ts` header wording. It is the SE's, in `se-ABC-213-probe-rows`.
- **Next (Orchestrator):** merge this records branch with ABC-213's other owed items. ABC-213's "D4 dated line"
  item is closed.
