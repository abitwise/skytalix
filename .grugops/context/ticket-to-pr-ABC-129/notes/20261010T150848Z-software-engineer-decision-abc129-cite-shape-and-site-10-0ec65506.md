---
id: 20261010T150848Z-software-engineer-decision-abc129-cite-shape-and-site-10-0ec65506
kind: decision
by: software-engineer
at: 2026-10-10T15:08:48Z
verified_by:
confidence: high
refs:
  - ABC-129
  - QE-051-c
  - src/turn-loop.ts
  - src/line-input.ts
supersedes:
---

# `ABC-129`: how the cites are written, and why site #10 names `InputSeam`

This note is hand-authored and unsealed (AGENTS.md: no sanctioned writer on this install).
Branch `grugops/ABC-129-turn-loop-cites-by-symbol` from `dc90f42d`; code `ed402c1e`.

## 1. One shape for every cite (test note 2)

- **Exported or top-level symbol:** `` (`src/turn-loop.ts` `<symbol>`) ``. The cite token keeps the
  file path the site already used, so `` `turn-loop.ts` `` stays as written in `src/cli.ts` and
  `src/turn-loop.test.ts`.
- **Label inside `runTurnLoop`:** `` (`src/turn-loop.ts`, `runTurnLoop`'s <label>) ``, where the label
  is `` `A9b` arm ``, `"TRANSITION 16" branch` or `"Transition 1 → 2"`. This follows test note 3.
- **Docblock paragraph:** `` (…, `<symbol>`'s docblock, "<exact phrase>") ``.
- **Redundancy is kept.** Where a sentence already names the symbol (#4/#12/#14
  `INPUT_ENDED_NOTICE`, #1 `wasGenerated`, #8 `claimShortfall`, #13 `PromptOutcome`), the cite still
  repeats it. Test note 2 gives exactly that example, and a uniform shape makes `A2` mechanical.
- **Site #9 had no parentheses** ("The `EngineSeam` `src/turn-loop.ts:138` has been waiting on"). It
  became "The `src/turn-loop.ts` `EngineSeam` has been waiting on", which is the same shape without
  adding a word.

## 2. Re-flow

- `biome.json` sets `lineWidth` 100. An overflowing edited line carried its tail onto the next line
  of the same comment paragraph, and the carry cascaded only while a line still overflowed.
- **Five breaks were then made by hand** so that a quoted anchor, a code-span pair or a quoted comment
  never splits across lines. They are "The render cadence", "Transition 1 → 2",
  "OWNS ONLY THAT THE TRANSITION EXISTS", `` `src/turn-loop.ts` `PromptOutcome` `` and
  "`EPIC-003` replaces it".
- **The largest cascade is `src/cli.ts`** (numstat 12/11), because its header paragraph is long. No word
  changed.
- **`src/command-input.ts:91`** was 100 characters before and is 99 after (`Three` → `Four`). It was
  not re-flowed.

## 3. Site #10 — DEVIATION FROM THE TABLE, for QE / BA/PM to rule

- **The table says #10 (`src/line-input.ts:5`, cite `:135`) means `PromptOutcome`, "right today".**
  The sentence says: "`InputSeam = (history: GameHistory) => Promise<PromptOutcome>` is published in
  merged code (`src/turn-loop.ts:135`) with the comment "`EPIC-003` replaces it"". That comment sits
  on `InputSeam` (`src/turn-loop.ts:146-147`), not on `PromptOutcome`.
- **`git show 69bb1e38:src/turn-loop.ts`** (the commit that wrote the cite, "grug write the real
  InputSeam") reads `:135` = `export type InputSeam = …`. So the cite meant `InputSeam`. The
  `PromptOutcome` hit at `:135` today is a coincidence of drift. **All 15 cites were stale, not 14.**
- **Written: `` (`src/turn-loop.ts` `InputSeam`) ``.** `grep -cF 'InputSeam' src/turn-loop.ts` = 3.
- **Why not the table's anchor:** the ticket's own instruction is "the symbol or labelled anchor it
  means". The Value line is "each cite lands on what it names". Writing `PromptOutcome` would ship the
  exact misdirection this ticket removes.
- **Cost if overruled:** one token, comment-only. The exit measurement is unchanged either way.
- **The other 14 rows were checked the same way.** Each cite was traced to the commit that introduced
  it (`git log -S`). Every one agrees with the table's "means", with one nuance. #4 and #14 (`:312` at
  `db389618`) pointed at transition 10's write of the notice, not the constant's declaration. Both
  sentences name `INPUT_ENDED_NOTICE`, and the constant appears on that write line (`:348` today),
  so the table's anchor stands.
