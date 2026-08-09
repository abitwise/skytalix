---
id: 20260809T213844Z-software-engineer-observation-60f2f871
kind: observation
by: software-engineer
at: 2026-08-09T21:38:44Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/legal.ts
  - src/legal.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# `A9` on the replacement instrument: the file-level filter went non-empty exactly as predicted, and the line-level one holds with zero exceptions

The instrument changed shape at this hop and that was the one thing the brief said to get right. Every
figure below was produced by a filter, not by reading a diff.

## The predicted collision, confirmed

```
git diff --name-only --diff-filter=M main -- 'src/*.test.ts'   ->  src/legal.test.ts
git diff --name-only --diff-filter=A main -- 'src/*.test.ts'   ->  src/moves.enpassant.test.ts
git diff --numstat main -- src/
      13  8  src/legal.test.ts
      15  6  src/legal.ts
     208  0  src/moves.enpassant.test.ts
      24 12  src/moves.ts
```

The `--diff-filter=M` filter hop one used is now non-empty. `A11` names this as a collision with the
instrument rather than a breach of `A9`, and `A9`'s own text — *"no existing test is modified,
verified at line level"* — is unchanged and was not re-litigated here.

## The replacement filter, and it has zero exceptions

Every `+`/`-` line of `git diff main -- <file>`, diff headers excluded, marker stripped, tested
against `^[[:space:]]*//` for the test file:

```
src/legal.test.ts   21 changed lines   0 that are not comment lines
src/legal.ts        21 changed lines   0 that are not comment lines   (whole branch: hop 1 + this hop)
```

`src/legal.ts`'s corrected paragraph is a JSDoc block, so its filter accepts ` * ` and `/**` as well
as `//`; the test file's is `//`-only, which is the form `A11` specifies.

## Stronger than the filter: the executable content is byte-identical to `main`

The filter proves no changed line is executable. This proves no executable line changed, which is not
the same statement — strip every comment line from both versions and `cmp`:

```
src/legal.test.ts   292 non-comment lines   cmp against main: IDENTICAL
src/legal.ts         64 non-comment lines   cmp against main: IDENTICAL
```

`A11`'s named tokens counted on both sides, `main` vs the tip: `it(` 21/21, `it.each` 2/2,
`describe(` 7/7, `expect(` 40/40, ` w - ` 28/28, ` b - ` 8/8. No FEN and no table entry moved.

## The file is green unmodified on both sides of the edit

`npx vitest run src/legal.test.ts` — **31 passed (31)** before the edit and **31 passed (31)** after.
The suite total is unchanged at **439**, which is `A11`'s other stated condition.

## The four fenced statements, checked mechanically rather than by eye

Each is present exactly once, its count identical on `main` and on the tip, and each appears in
**zero** of the 42 changed lines across both files: `src/legal.ts` *"Purity does NOT need it"*;
`src/legal.test.ts` *"reads an occupied ep"* (the ENEMY-occupant rows), *"Each one corrupts without
it, permanently"*, and the out-of-remit *"fails this on the second FEN (ABC-009)"* at line 202.
