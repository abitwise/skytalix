---
subtask: arch-qe242a-ruling
role: architect-design
ticket: ABC-242 (closed) / ADR-0046
ref: .grugops/context/arch-qe242a-ruling/
branch: new grugops/arch-qe242a-ruling from main (worktree .claude/worktrees/arch-qe242a-ruling)
width: records only; run nothing heavier than reading. No vitest, no timing.
---
# Architect (records): QE-242-a ruling + two owed ADR text items
## Read
qe-ABC-242's notes (findings …b9f3cd67, census …51079df4) and se-ABC-242's census note, all on main under .grugops/context/;
ADR-0046 § Addendum 2026-10-30 R1–R4 and ABC-244's condition 2; ADR-0052 near line 320 (D7, "If the owner rejects it");
ABC-244's ticket page (BA/PM's word).
## Do
1. **QE-242-a (MEDIUM).** Rule whether ABC-244 condition 2 reads a blunder per level call (which admits step 10 as built) or per child search (only step 1 qualifies, ≈ +2.5 s of lane wall, so it breaches G8).
   - Facts: kill sets are equal at every step; at step 10 four of five children run the unabortable depth 1.
   - Write the ruling as a dated addendum line to ADR-0046. If the ruling requires changing any merged row, name a ticket for BA/PM to cut; do not cut it.
   - If the ruling changes an owner-accepted decision, mark it PROPOSED for the owner.
2. **ADR-0052 D7:** the "If the owner rejects it" wording is stale, because the owner accepted ADR-0052 on 2026-10-30. Fix it to read as accepted, by a dated line.
3. **ADR-0046 status line:** note that BA/PM's word was given on ABC-244's page.
## Fences
Records only: memory-bank/50-decisions/ADR-0046*, ADR-0052*. No src/, tools/, data/, board or ticket edits. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-qe242a-ruling`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.

## Result
- **`QE-242-a`, ruled.** `ABC-244` condition 2 reads a blunder **per level call**: one budget, one shared deadline,
  ⌈budget ÷ step⌉ intervals. Level 1's 100 ms at step 10 is 10 intervals, so **`ABC-242`'s step 10 is admitted as
  built.**
  - **Why:** BA/PM counted it this way at `ABC-177` U8, a level-1 row whose first go is a blunder. It is also the only
    reading that agrees with R4's +0.05..+0.15 s plan, since per child admits only step 1 (≈ +2.5 s, a `G8` breach).
    The check under test sits at the root and reads no clock. Kill sets are equal at every step.
  - **The limit:** a row that asserts a child's depth, or whose property under test is computed inside a child search
    without a reference run at the same step, reads per child search.
  - **R1 for a sliced call:** the census line gives reads per level call. A per-child figure is the budget actually
    handed, never the nominal slice.
  - **The gap, stated:** at step 10 the children are handed 10, −10, −30, −50 and −70 ms and search depth 1. The call
    takes 210 of its 100 virtual ms.
  - Recorded in `ADR-0046` § Ruling 2026-10-31.
- **Ticket owed:** none. No merged row changes.
- **Owner:** nothing. No owner-accepted decision changes, so the ruling is not PROPOSED.
- **`ADR-0046` § Status:** a dated line says BA/PM's word was given on `ABC-244`'s page (`de02f8c2`) and that tranche 1
  is `ABC-244` (`24b22339`).
- **`ADR-0052` D7:** "If the owner rejects it…" is struck. A dated line says the whole-second reading is accepted.
  - That sentence was about the whole-second reading, which was added after the owner accepted the ADR.
  - He confirmed the reading on its own on 2026-10-30, at `…f4673b9f`, and the line cites that.
- **Commits:** ADRs at `1b142ea0`; notes and this Result in the next commit.
- **Notes (sealed):** decision `…ede2dfcb`, observation `…e79e474f`, in `.grugops/context/arch-qe242a-ruling/`.
- **Not touched:** `src/`, `tools/`, `data/`, the board and tickets. Nothing was run, timed, pushed or merged.
