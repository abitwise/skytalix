---
id: 20260809T220314Z-software-engineer-observation-c13c9bb9
kind: observation
by: software-engineer
at: 2026-08-09T22:03:14Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/moves.enpassant.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# `A9` at a third hop: the file-level instrument is still GREEN for this file, and the line-level one has zero exceptions

`A9` is *"no existing test is modified — verified at line level"*. This hop's file is the one file on
the branch where **both** instruments can be run, and they agree.

## File level — and here it is the stronger statement, not the weaker one

```
git diff --name-only --diff-filter=M main -- 'src/*.test.ts'   ->  src/legal.test.ts
git diff --name-only --diff-filter=A main -- 'src/*.test.ts'   ->  src/moves.enpassant.test.ts
```

`src/moves.enpassant.test.ts` is still an **ADDITION** relative to `main`, so at file level it
modifies no existing test at all — it did not exist before this branch. The `--diff-filter=M`
non-emptiness is `src/legal.test.ts` from the hop above, which is the collision `A11` predicted and
already adjudicated as not a breach. **This hop adds nothing to that collision.**

## Line level, against the pre-hop file

Every `+`/`-` line of `git diff HEAD -- src/moves.enpassant.test.ts`, diff headers excluded, marker
stripped, tested against `^[[:space:]]*(//|\*|/\*\*|\*/)` — the doc-comment form this file uses:

```
37 changed lines   (+23 / -14)
 0 changed lines that are not comment lines
```

## Stronger than the filter: the executable content is byte-identical

The filter proves no changed line is executable. This proves no executable line changed, which is a
different statement — strip every comment line from both versions and `cmp`:

```
non-comment lines   pre-hop 138   post-hop 138   cmp: IDENTICAL
```

Token counts on the whole file, pre-hop against post-hop: `it(` 2/2, `it.each` 6/6, `describe(` 6/6,
`expect(` 14/14, `toBe(` 13/13, `4k3/` 16/16, ` w - ` 9/9, ` b - ` 8/8. **No FEN, no table entry and
no expected number moved.** The file alone is `58 passed (58)` after the edit, as it was before.

## Line citations, this hop's drift

`A11`'s `src/legal.ts` and `src/legal.test.ts` citations do **not** move — that pair was not touched,
and the map published at `21:38:47Z` still stands for them. Inside `src/moves.enpassant.test.ts`
everything from old line 34 down is **+9**:

```
site 7, half (a)                            4-9      ->  4-10
site 7, half (b) (same sentence, uncited)  10-13     ->  11-14
the added "CHECKS both now" paragraph        —       ->  16-21
"Both halves reach both colours"            15       ->  23
site 7, the self-mask sentence              25-28    ->  33-37
the A1 table comment                        78-84    ->  87-93   (its corrected line 82-83 -> 91-92)
the A3 table comment                        92-98    -> 101-107  (95-96 -> 104-105, 97 -> 106)
FENCED  A5's "Already 0 today"             108-119   -> 117-128  (the sentence itself 109 -> 118)
the A6 controls comment                    127       -> 136
```

**`A11` was NOT re-pinned to any of this**, as ordered: re-pinning would be stale the moment it
landed. Match `A11` on its quoted sentences — a quote does not go stale when a paragraph above it
grows — and use this map only if a line number is unavoidable. **The citations are the fragile part
of the criterion; the quoted text is not.**
