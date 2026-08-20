---
id: 20260821T005500Z-software-engineer-artifact-ref-what-this-hop-built-and-the-board-move-it-refused-a5c8d217
kind: artifact-ref
by: software-engineer
at: 2026-08-21T00:55:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - src/cli.ts
  - src/cli.test.ts
  - plans/board.md
  - plans/traceability.md
supersedes:
---

# WHAT THIS HOP BUILT, WHAT IT MEASURED, AND THE BOARD MOVE IT DELIBERATELY DID NOT MAKE

**Branch `grugops/abc115-piped-session-exits-clean`, off `grugops/abc115-amend` @ `badf6c3`, NOT
`main` — five branches are now stacked unmerged because merging is the human's.** Worked in a
`git worktree`. Not merged, not deployed, not self-signed.

## THE DIFF — `A6`'s fence, checked from git rather than asserted

```
git diff --name-only main -- src/                                            -> src/cli.test.ts, src/cli.ts
git diff --numstat main -- 'src/' ':!src/cli.ts' ':!src/*.test.ts'           -> (empty)
git diff --numstat main -- src/cli.ts                                        -> 13  0  src/cli.ts
```

**13 added production lines, 0 deleted, against `A6`'s <= 15.** Five of the thirteen are code.
`frame.ts`, `turn-loop.ts`, `line-input.ts`, `AGENTS.md`, `ADR-0016`, `plans/nfr-catalog.md` and
every other ticket are byte-unchanged. 0 new test files, 0 new production modules, 0 new
dependencies.

## THE GATES — numbers measured at this hop, none quoted

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0** — `biome check .`, checked 73 files, no fixes applied |
| typecheck | `npm run typecheck` | **exit 0**, `tsc --noEmit`, no output |
| build | `npm run build` | **exit 0** (the same `tsc --noEmit`, honestly named on `AGENTS.md`) |
| unit | `npx vitest run --dir src` | **40 files / 1212 tests / 0 skipped, GREEN**, 4.22 s wall / 16.45 s CPU |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0**; skip count from `--reporter=json` is **0** |

`A7`'s base was `1207` tests; **`1212` = 1207 + the five rows this ticket adds** (`A1`, `A2`, `A3`,
`A4`, `A9`). `self_fix_attempts` was not exhausted — three reds were found and fixed inside the loop
(the `process` census pin, the row-count literal collision, the blank-line miscount), all recorded.

## CRITERIA — how each is answered, and by what

- **`A1`, `A2`** — `CHILDREN.asciiClosedAt2`. Zero `write EPIPE`, zero `Unhandled 'error' event`,
  zero stack frames, **zero occurrences of the checkout path** (the security line), zero
  `internal error:`; stderr measured **empty**. Status `0`, not `1`, not `70`, wrapper `signal` null
  and product status `< 128`. **NO BYTE COUNT IS ASSERTED ANYWHERE.** For the record only, and
  re-measured in this tree: the unfixed stderr is **1282 bytes at a 150-character checkout path**,
  which is the page's `982 + 2 x path` formula **hitting exactly** — the model is confirmed, and it
  is still not a thing a test may pin.
- **`A3`** — five children: 2-line and 23-line close on `--ascii`, the same two on the default glyph
  mode, and the 24-line control. **The boundary is DERIVED, not copied**: `frameHeight`'s own
  arithmetic on the merged constants gives the frame, +1 for the loop's end-of-input notice, and the
  derivation is cross-checked against `CHILDREN.white`'s real stream inside the row. Re-measured
  here: total **24** lines on both modes, `head -N` reds for **N <= 23** and greens for **N >= 24** —
  the page's sweep reproduces. `grep -q` is not used.
- **`A4`** — zero new children; re-reads `inputSeamThrows` (70 + the line + non-empty stderr),
  `badColour` (1 + the usage line) and `truncated` (0 + the notice). No global
  `uncaughtException`, no blanket `exitCode = 0`, no muted stderr — and the `ABC-042` `A9` census row
  is what would SEE a blanket `exitCode` arrive, as a fourth `process.exitCode`.
- **`A5`** — both watched-RED rounds run in-suite, verbatim, in the sibling `observation` note.
- **`A6`** — the git output above.
- **`A7`** — the lane table above; the spawn pin moved **17 -> 23** with the derivation beside it.
- **`A8`** — **first branch**: nothing edited, both documents still true verbatim, and `A4` measures
  that rather than asserting it.
- **`A9`** — `CHILDREN.heldOpen`; the two UNKNOWNs it carried are answered in the sibling note.

## THE ONE PIN THAT MOVED FOR A REASON WORTH READING

`ABC-042` `A9`'s `process` census moves **8 -> 9** and gains a second `process.stdin`. That is the
whole fix: `process.stdin.destroy()` is HOW the session ends. It is deliberately **not** a fourth
`process.exitCode` — the destroy drives the delivered end-of-input transition and the status flows
through the one existing assignment, so the forbidden blanket-`exitCode` shape stays visible on that
row.

The spawn pin is written **`17 + 6`, not `23`** — `ABC-043` `A6`'s `ADR-0009` clause 9a row bars any
literal equal to the frame height from this file's executable code, and the frame is 23 rows while
the budget is now 23 children. **Two unrelated numbers that happen to be equal.** Spelling the pin as
its derivation keeps both guards armed; a hop that "tidies" it to a literal reds `A6`.

## THE BOARD — one move transcribed, one move REFUSED

- **TRANSCRIBED, not decided here**: `Ready for Dev` -> `In Development`, attributed to the
  Orchestrator at task `ticket-to-pr-ABC-115-2026-08-20`, `In Development` 0/3 -> 1/3.
- **REFUSED: `In Development` -> `In Review` is NOT made.** The build is green on every gate and
  every criterion, **and it BREACHES a pre-registered cost fence** — `N8-SPAWN`'s `<= 0.5 s CPU`
  clause, measured at **+1.02 s**. The ticket's own words are *"has breached this ticket and says so
  rather than shipping"*. The two ways out — dropping a criterion child, or re-deriving the clause —
  are both **BA/PM's pen**, and the page already records the first as priced and rejected. **So the
  ticket stays in `In Development` and the fence goes back to BA/PM with the arithmetic.** Moving it
  to `In Review` under a breached fence would be exactly the quiet absorption the fence exists to
  prevent.

## SIX THINGS THIS HOP REFUSED

1. **The bare swallow** — `ADR-0016` forbidden shape 4. Reproduced, watched passing eight criteria,
   and killed by `A9`.
2. **`process.exit(0)`** — `ADR-0016`'s fallback, admissible only on a measurement that the primary
   fails. The primary was measured working, so it was not taken.
3. **Weakening `A9` to fit the harness.** `T_bound` moved to 4 s against vitest's 5 s default, which
   makes the bound TIGHTER than the page's example. The settle stayed at the required `>= 0.5 s`.
4. **Dropping an `A3` child to meet the CPU clause.** Not the engineer's trade.
5. **Re-litigating the exit code.** `ADR-0016` settled it; `141` was not re-argued.
6. **Re-running either recorded failed attempt.** Both were read; neither was repeated. A THIRD one
   was found and is recorded for the next hop.

## AND ONE SENTENCE WAS AMENDED RATHER THAN LEFT FALSE

`src/cli.test.ts`'s header claimed *"no spawn argument built by string concatenation"*. `ABC-115`'s
six children compose a `/bin/sh -c` script, so that sentence stopped being true the moment they
landed. **It is amended in the same commit, with the narrower claim that IS true** (every shell word
comes from `process.execPath`, `ENTRY_POINT` or this file's own literals; no test datum reaches a
shell word; both paths quoted). Leaving it standing would have been the `ABC-114` defect committed
while fixing a ticket that cites `ABC-114`.
