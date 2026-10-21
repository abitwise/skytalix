---
id: ABC-187
title: "The `AGENTS.md` byte guard still allows 24,576 B, so the 8,970 B `ABC-164` cut can grow back with no test going red"
status: ready
column: Ready
size: XS
priority: P2
epic: —
feature: —
---

# ABC-187: lower `AGENTS_MD_BUDGET_BYTES` in `src/cli.test.ts` from 24,576 to 18,432 (owner decision), and fix the stale closer count in the same file. 0 production lines

> **Cut 2026-10-21 by BA/PM** (subtask `bapm-cut-guard-18432`, at `main` `bf6fc623`). Source: the owner's
> decision (Olger Oeselg, 2026-10-21, verbatim "1. byte limit to 18,432"), recorded in `…cba9c8eb`
> (`.grugops/context/qe-ABC-164/notes/`). Readings and the cut are in `.grugops/context/bapm-cut-guard-18432/notes/`.

## Problem

*User:* every role session. Each one reads `AGENTS.md` first. It is also the Scribe who adds lines to that file.

*Pain:*
- `ABC-164` (merged `1ce736af`) cut `AGENTS.md` from 24,575 B to **15,606 B**.
- The guard that is meant to hold it there, `ABC-109` `A5` (`src/cli.test.ts:2484`), still allows **24,576 B**.
- So `AGENTS.md` can grow back by 8,970 B (7.74 edits at 1,159 B/edit) with every gate green. The read cost
  `ABC-164` removed from every session can come back without anyone deciding it should.

*Value:* the guard goes red at 18,433 B, the owner's chosen ceiling. That leaves 2,826 B (2.44 edits) of room.
After that, any further growth needs a deliberate decision to raise the number again.

## Scope

All in `src/cli.test.ts`. At `bf6fc623` these are every place that states or derives this guard's number.

1. **`:2484`, the constant.** `const AGENTS_MD_BUDGET_BYTES = 24_576;` becomes `= 18_432;`.
2. **`:2483`, the JSDoc above it.** Today it says "`ABC-109` `A1`'s target: a quarter under the inherited
   32,768 B reader cap". That derives 24,576 (32,768 × ¾), so it is false once the number is 18,432. Rewrite the
   line so it names where 18,432 comes from: this ticket and the owner decision `…cba9c8eb`. Keep it one line.
   The wording is up to the Software Engineer, inside `A1`.
3. **`:2242`, the stale closer count (QE-164-h).** It is folded in: it is in the same file and costs one line.
   The comment says `AGENTS.md` "carries 13 further closers after this slot's own". At `bf6fc623` the count is
   **8** (script in `A5`). Change the number, or drop it if the sentence reads true without one. No assertion
   reads this comment.

**Checked and left as they are:**
- `:2491`, the assertion message, interpolates `${AGENTS_MD_BUDGET_BYTES}`, so it follows the constant by itself.
  At head it reads "against its 18432 B budget (ABC-109)" (measured).
- `:2482` (describe title) and `:2486` (test name) state no number.
- No test name, comment or message anywhere in `src/cli.test.ts` says "24 KiB" or "24,576" (measured).
- No other `src/` file, and no `.ts`/`.js`/`.json`/`.sh` file outside `node_modules` and `.grugops/`, holds the
  number.

## Out of scope

- **`AGENTS.md:7`**, "**Byte budget: this file targets ≤ 24,576 B.**" This becomes a stale present-tense number
  when this ticket merges. It is a Scribe line, and `AGENTS.md` is outside this ticket's fence. The fix is
  byte-neutral: `24,576` → `18,432`, 6 characters for 6, so `wc -c` stays 15,606. **Owed to the AGENTS.md Scribe.**
  The Orchestrator decides whether that edit is a Scribe hop on this ticket's branch after the SE's commit (see
  `A6`) or a Scribe hop of its own after merge. Until it lands, a Scribe reading line 7 thinks it has 8,970 B of
  room when it has 2,826 B. The guard still catches the overrun, but only at the gate.
- `memory-bank/90-agents-md-command-log.md`: every 24,576 there is a dated history entry and stays true as
  history. The latest entry (`:885`) already gives the 18,432 figure. The QE-164-a amend is `scribe-amend-90`.
- The ABC-109 page, the trace rows that quote 24,576, and the board's old `_Updated:` lines. They are history.
- What `A5` measures (bytes, `.length`), its describe/test names, and the `(ABC-109)` label in its message.
- Any change to `AGENTS.md` content itself.

## Acceptance (Given/When/Then)

"Base" is `main` at pull time (`bf6fc623` at cut). "Head" is the branch head merged with the latest `main`.

- **`A1` (the number, and only the number).** **Given** head, **when**
  `grep -cE "24_576|24,576|24576|24 KiB|a quarter under" src/cli.test.ts` runs, **then** it prints `0`. At base
  it prints `2` (`:2483`, `:2484`). Also, `grep -c "const AGENTS_MD_BUDGET_BYTES = 18_432;" src/cli.test.ts`
  prints `1` (base `0`), and the JSDoc line directly above the constant contains `ABC-187`.
- **`A2` (red at base, green at head, at the boundary).** **Given** a scratch export of the tree
  (`git archive <sha> | tar -x -C <scratch>`, with `node_modules` symlinked in) whose `AGENTS.md` is padded with
  trailing spaces to exactly **18,433 B**, **when**
  `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "ABC-109"` runs in it, **then**:
  - at base it gives `1 passed`;
  - at head it gives `1 failed`, with the message `AGENTS.md bytes against its 18432 B budget (ABC-109): expected 18433 to be less than or equal to 18432`.

  The same export at head, padded or cut to exactly **18,432 B**, gives `1 passed`. *(Measured at cut: base
  passes at 18,433 B. A scratch copy with only the constant changed fails at 18,433 B with that exact message and
  passes at 18,432 B.)*
- **`A3` (the real file is green; no test added or lost).** **Given** head, **when** `npm test` runs, **then** it
  exits 0 with **59 files / 1987 tests**, all passed. Those are base's counts: `src/` is byte-equal from QE-164's
  reading at `e82a3798` to `bf6fc623`. Also, `.test-results/last-run.json` reads `success: true`. And
  `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` prints "No findings."
  `wc -c AGENTS.md` at the merged tip is ≤ 18,432 (15,606 at cut).
- **`A4` (zero production lines).** `git diff --name-only main...HEAD -- src/ ':!src/**/*.test.ts' ':!src/__snapshots__'`
  prints nothing, so the AGENTS.md waiver measurement is empty.
- **`A5` (the closer count tells the truth, QE-164-h).** **Given** head, **when**
  `node -e 'const a=require("fs").readFileSync("AGENTS.md","utf8");const s=a.indexOf("- Dev / run:");const e=a.indexOf("-->",s);console.log(a.slice(e+3).split("-->").length-1)'`
  runs, **then** the comment that was `:2242` states that number (`8` at cut), or states no number.
  `grep -c "carries 13 further closers" src/cli.test.ts` prints `0` (base `1`).
- **`A6` (fences).** In `git diff --name-only main...HEAD`, ignoring `.grugops/` and the hop's own records in
  `plans/`, the only file listed is `src/cli.test.ts`. `git diff -U0` on that file changes only the three lines
  named in Scope (`:2242`, `:2483`, `:2484` at base), with 0 lines added or removed net.
  - **Only if the Orchestrator folds in the `AGENTS.md:7` Scribe line:** `AGENTS.md` is also listed, with one
    changed line, `24,576` → `18,432`. `wc -c AGENTS.md` is unchanged, and
    `grep -c "targets ≤ 18,432 B" AGENTS.md` prints `1`.

## Dependencies

- **None blocking.** `ABC-164` is merged (`1ce736af`).
- **No overlap with the hops in flight.** `ticket-to-pr-ABC-185` edits `plans/traceability.md` and
  `scribe-amend-90` edits `memory-bank/90-…`. Neither touches `src/` or `AGENTS.md`.
- **ABC-185's short freeze.** If this ticket's trace row comes due during ABC-185's short append freeze (the time
  between its final `A1`–`A7` run and its merge commit), the row waits in the done record and is appended after
  ABC-185 merges (`ABC-185`'s page, Dependencies).
- **Re-measure at the merged tip.** If any merge into `main` before this one grows `AGENTS.md` past 18,432 B,
  `A3` reds. That is the guard working: stop and hand back. Do not raise the number.

## Security / NFR triggers

- **`NFR-008` (`npm test` time, `ADR-0046`): not triggered.** 0 test files added, 0 tests added, 0 spawns added.
  The target is that test counts equal base (59 / 1987, `A3`).
- **Security: not triggered.** One numeric literal and two comments in a test file. 0 production lines (`A4`).

## Test notes

1. **Watch it go red before you trust it** (`ABC-109`'s rule). Run `A2` on a scratch export, never by padding the
   real `AGENTS.md` in the worktree. Always use the `-t "ABC-109"` filter: padding may disturb the other
   `AGENTS.md` blocks, which are not this ticket's to judge.
2. Pad with `0x20` bytes at the end, e.g.
   `node -e 'const fs=require("fs");const b=fs.readFileSync("AGENTS.md");fs.writeFileSync("AGENTS.md",Buffer.concat([b,Buffer.alloc(18433-b.length,0x20)]))'`.
3. **Gates:** lint (autofix on), typecheck, build, `npm test`, and skip-count 0.
4. **QE hop owed.** UAT waiver expected: 0 production lines (`A4`). A waiver is not a signature.

## Size and priority

**`XS`:** one file, three lines, every one named by line number. Every criterion except the JSDoc's wording is
script-checked. The red/green shape was measured at cut.

**`P2`:** the same priority as `ABC-164`, whose 8,970 B cut this ticket protects. The owner wants it now. The
Orchestrator can pull it at once (Ready 1/8, In Development 1/3). It is not `P1`: nothing user-facing is broken,
and the 24,576 B guard still stops the silent 32,768 B truncation.

## Definition of Ready

BA/PM, 2026-10-21 at `bf6fc623`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** guard 24,576 vs file 15,606: 8,970 B can regrow unflagged; owner set 18,432 (`…cba9c8eb`) |
| 2 | scope and out-of-scope clear | **✅** three lines of `src/cli.test.ts` named; `:2491`/`:2482`/`:2486` checked and kept; `AGENTS.md:7` named as an owed Scribe line, outside the fence |
| 3 | INVEST-shaped | **✅** independent; valuable alone; `XS`; testable at the byte boundary |
| 4 | acceptance testable and measurable | **✅** `0`/`1`/`1` greps; 18,433 B passes base and reds head, 18,432 B passes head (measured); 59 / 1987; 0 production files; closer count = script (`8`) |
| 5 | dependencies known | **✅** none blocking; no file overlap with the two hops in flight; ABC-185 freeze rule |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` not triggered: 0 files, 0 tests, 0 spawns added, counts equal base |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2` |
| 10 | no major unresolved blocker | **✅** none; the `AGENTS.md:7` routing is the Orchestrator's choice, not a blocker |

Column moves are the Orchestrator's. Owner: **the Orchestrator** (routes the build to the Software Engineer), then
QE.
