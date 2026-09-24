---
id: 20260924T200800Z-software-engineer-artifact-ref-rehop-branch-commit-four-files-exactly-the-ruled-list-and-what-was-not-touched-7b0acc2f
kind: artifact-ref
by: software-engineer
at: 2026-09-24T20:08:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-037
  - ADR-0021
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/line-input.test.ts
  - plans/tickets/ABC-046-quit-and-new.md
  - plans/traceability.md
  - .grugops/queue/claimed/ticket-to-pr-ABC-046-rehop/claim.md
supersedes:
---

# `ABC-046` re-hop: the branch, the code commit and the four files, which are exactly the ruling's list

- **Branch:** `grugops/ABC-046-rehop`, created from `grugops/wave-2026-09-24` @ `5d0fdb0` in an
  isolated worktree. `5d0fdb0` carries `8905de5` (the QE and clause-6 ruling merges).
- **Code commit:** **`85b66c6`**. It is **unmerged and not deployed**. There is no remote, so there
  is no PR.
- **`git diff --numstat 5d0fdb0 85b66c6`:**

  | file | added | removed |
  | --- | --- | --- |
  | `src/command-input.ts` | 21 | 6 |
  | `src/line-input.ts` | 7 | 2 |
  | `src/command-input.test.ts` | 35 | 0 |
  | `src/line-input.test.ts` | 22 | 1 |

  `git diff --name-only` lists exactly these 4 files.
- **Non-comment production lines:** +12 / −3.
  - `command-input.ts` +8 / −2: the intersection type (3 lines), `const resolve = …` in place of
    `return (history, line) => {`, and the 5-line `Object.assign(resolve, { disarm })`.
  - `line-input.ts` +4 / −1: the over-cap branch becomes a block that calls `resolve.disarm()` and
    returns the same object.
  - The rest of the production diff is prose.

## The edits, against the ruling's list

1. **`src/command-input.ts`**
   - **D1:** now reads "one of six commands and, for five of them". `COMMAND_TABLE` has 6 rows.
   - **D2:** "and never consults the table" now reads: "without calling `resolvePromptLine` or
     reading the row's `outcome`, though it has still classified the line through `COMMAND_TABLE`
     by `classifyCommand`, as it does every line."
   - **The disarm:** `PromptLineResolver` gains `readonly disarm: () => void`.
     `createPromptLineResolver` returns `Object.assign(resolve, { disarm })`, and `disarm` only sets
     `quitArmed = false`. The resolve body is unchanged except for the binding line.
   - **The wrapper docblock** gains one paragraph. It says:
     - the wrapper does not see every line;
     - the over-cap line never reaches it, so the reader calls `disarm`;
     - `disarm` takes no line, returns nothing and calls no resolver.
2. **`src/line-input.ts`**
   - The over-cap branch calls `resolve.disarm()` and then returns the SAME `rejected` outcome.
   - The cap docblock gains one sentence: the over-cap line clears the `quit` confirmation through
     `disarm`, which takes no line, so the text still reaches no resolver.
3. **`src/command-input.test.ts`** gains two rows in the `ABC-046` `quit` `describe`:
   - `G1`;
   - the disarm unit row.
4. **`src/line-input.test.ts`**
   - It gains one row, the clause-6 reader row, inside the bar-2 `describe` next to the cap's
     "recovers" row.
   - The existing import gains `QUIT_CONFIRMATION_MESSAGES`.

## What was not touched

`git diff --stat 5d0fdb0 85b66c6` is **empty** over all of these:

- `src/turn-loop.ts`, `src/cli.test.ts` (the spawn pin stays `17 + 7 + 1 + 2`);
- `src/search.ts`, `src/quiescence.ts`, `src/engine.ts`, `src/zobrist.ts`;
- `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`.

No new file, no new child process and no dependency change.

## Queue and paper

- **The claim was taken out of order.** The bare `mkdir .grugops/queue/claimed/ticket-to-pr-ABC-046-rehop`
  succeeded, but only AFTER `85b66c6` was committed, not before as Workflow 17 asks. `claimed/` was
  empty, so nothing was duplicated. The claim record says this.
- On completion the subtask file moves to `done/`.
- One row is appended to `plans/traceability.md`: `ABC-046 (re-hop)`.
- One section is appended to the ticket: `## Delivery (re-hop) 2026-09-24`.

## Hand-offs, which are not this role's

- The delta re-QE, as the ruling describes it.
- The board move.
- The owner's word at `In UAT`. Production lines are > 0, so the waiver does not apply.
