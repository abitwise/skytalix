---
id: 20261010T152604Z-qe-e2e-decision-abc129-verdict-and-site-10-20af9428
kind: decision
by: qe-e2e
at: 2026-10-10T15:26:04Z
verified_by:
confidence: high
refs:
  - ABC-129
  - QE-051-c
  - QE-051-d
  - src/turn-loop.ts
  - src/line-input.ts
  - 20261010T150848Z-software-engineer-decision-abc129-cite-shape-and-site-10-0ec65506
  - 20261010T141247Z-orchestrator-decision-owner-word-uat-q4-5c8e2a17
  - 20261010T152604Z-qe-e2e-observation-abc129-readings-exit-gates-1d84da40
  - 20261010T152604Z-qe-e2e-observation-abc129-gap-register-83afd95b
supersedes:
---

# QE `ABC-129`: PASS_WITH_GAPS. Site #10 `InputSeam` is ACCEPTED. The Q4 exit measurement holds on all 6 production files

This note is hand-authored and unsealed. AGENTS.md says no `finding` is admissible on this install.
Subtask `qe-ABC-129`, worktree `.claude/worktrees/qe-ABC-129`, branch
`grugops/ABC-129-turn-loop-cites-by-symbol`, base `dc90f42d`, reviewed tip `0ee6424e` (code
`ed402c1e`). Every reading was taken by QE. The SE's notes were used as pointers only.

## Verdict

**PASS_WITH_GAPS.** `A1`–`A4` are MET. `A2` carries one deviation (#10), which is ruled below.
There are no blocking gaps: 1 LOW and 4 INFO (`…83afd95b`). **QE made no comment fix**, because no
cite was wrong. **QE added no test**, because the ticket is comment-only and has no behaviour to
break. The fence held: only cite tokens, the A3 count words and re-wrap carries changed.

## Site #10 ruling: ACCEPT `InputSeam`. Do not follow the table

- **The sentence quotes `InputSeam`.** It quotes `InputSeam = (history: GameHistory) => Promise<PromptOutcome>`
  and the comment "`EPIC-003` replaces it". That comment is `InputSeam`'s docblock
  (`src/turn-loop.ts:146`). `PromptOutcome`'s docblock (`:104-134`) does not carry it.
- **QE confirmed the write-time meaning independently.** At `69bb1e38`, the commit that wrote the
  cite (`git log -S'turn-loop.ts:135' -- src/line-input.ts`), `:135` of `src/turn-loop.ts` is
  `export type InputSeam = …`. The table's "`PromptOutcome` (`:135`, right today)" was a drift
  coincidence. **All 15 cites were stale, not 14.**
- **The ticket's contract supports the deviation.** `## Scope` says "the symbol or labelled anchor it
  means", and the Value line says "each cite lands on what it names". `A2`'s clause "the anchor names
  what the table's 'means' column names" is met in substance: the means column was mis-measured for
  this row. Writing `PromptOutcome` would ship the misdirection this ticket removes.
- **This is a table erratum, recorded in ticket § QE.** It is not a re-cut. `grep -cF 'InputSeam'
  src/turn-loop.ts` = 3 (≥ 1).

## Exit (owner Q4, `…5c8e2a17`)

QE took **both** of the Orchestrator's measurements, plus a stricter third, on each of the 6
production files the literal 2026-08-17 filter lists (`cli.ts`, `command-input.ts`, `engine.ts`,
`line-input.ts`, `move-input.ts`, `result-screen.ts`):
- **(i)** every changed line is a comment line, by the regex **and** by the TS AST comment ranges;
- **(ii)** the `transpileModule` (`removeComments: true`) emit is byte-identical at `dc90f42d` and
  `0ee6424e`;
- **(iii)** the comment-stripped TS print is identical.

**All three hold on all 6 files.** The negative controls go red as designed. **On QE's reading the
measurement holds, and the UAT waiver applies.** That waiver is the Orchestrator's to apply at
`Done`. Waived is not accepted.

**A caveat for future applications (`QE-129-b`, INFO).** Neither measure alone suffices. (ii) is
blind to type-only edits (control N3). The regex form of (i) is blind to a `//` line inside a
template literal (control N4). The Q4 conjunction catches both. Keep the conjunction; never apply
one measure alone.

## Next

The Orchestrator moves the ticket out of `In Review` and applies the Q4 waiver at `Done`. Merging
must resolve a `plans/traceability.md` append conflict against the wave tip by keeping both sides
(`QE-129-c`). The `src/` side merges clean. QE has not merged and has not pushed.
