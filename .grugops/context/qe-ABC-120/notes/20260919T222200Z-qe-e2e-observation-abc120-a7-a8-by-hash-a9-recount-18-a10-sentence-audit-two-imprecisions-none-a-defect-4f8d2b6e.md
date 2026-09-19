---
id: 20260919T222200Z-qe-e2e-observation-abc120-a7-a8-by-hash-a9-recount-18-a10-sentence-audit-two-imprecisions-none-a-defect-4f8d2b6e
kind: observation
by: qe-e2e
at: 2026-09-19T22:22:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ADR-0021
  - ABC-019
  - ABC-021
  - ABC-114
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# `ABC-120` — `A7`/`A8` by sha256 of the named blocks at base `20ad7cb` and tip; `A9` recounted at 18 (10 new + 8 re-indented); `A10` sentence audit: two imprecisions, none a defect, neither corrected by QE

**Not a finding.** Numbers from `raw-a7a8a9-harness.mjs.txt` → `raw-a7a8a9-summary.json.txt`; the
harness reads git objects only and writes nothing to the tree.

## `A7` — the unchanged types, by hash

| block | base (`20ad7cb`) | tip | identical |
| --- | --- | --- | --- |
| `export type TerminalReason = … "engine-threw";` | `:78-83` sha256 `8a2d06042d83cfdd` | `:78-83` `8a2d06042d83cfdd` | **yes** |
| `export interface LoopOutcome { … }`, comment lines stripped | `:155-173` `a21798674b6be0ff` | `:167-186` `a21798674b6be0ff` | **yes** (raw block differs only in the two re-worded doc comments the ticket ordered) |
| `readonly exitCode: 0;` | present | present, unchanged | yes |
| `export const INPUT_ENDED_NOTICE = "input ended";` | present | present, unchanged | yes |
| `PromptOutcome` `\|` members | 7 | **9** | as ruled |
| `EVERY_TERMINAL_REASON` size | 10 | 10 (the `A7` row asserts it at runtime; my line-regex on the spread literal is not a count and is not quoted) | yes |

## `A8` — the rows and files that must not move, by hash

| block | base | tip | identical |
| --- | --- | --- | --- |
| `const TABLE: readonly Row[] = [ … ];` | `:753-883` `d65ce53bf9183148` | `:762-892` `d65ce53bf9183148` | **yes** |
| rows 14 / 17 / 18 (from the "Row 14 is not a `TABLE` row" comment to row 18's closing `});`) | `:895-941` `b25bce1a8b4a4f2a` | `:904-950` `b25bce1a8b4a4f2a` | **yes** |
| `A3b` body (title line excluded) | `:998-1032` `955f3c2aa8a213c2` | `:1007-1041` `955f3c2aa8a213c2` | **yes**; title `non-advancing` → `non-mutating`, one word |
| `src/turn-loop.nfr.test.ts` git blob | `ab9bbdd17c554a7a3edfbe4c3216c4f70e53e750` | same | **byte-identical** |
| `git diff --name-only 20ad7cb..HEAD -- src/` | — | `src/turn-loop.test.ts`, `src/turn-loop.ts` | exactly two |
| test-file hunks (`git diff -U0`) | — | `-80` import, `-121` dynamic import, `-256`/`-266` seam, `-997` `A3b` title, `-1860` appended block | none inside `TABLE` or rows 14/17/18 |

Also byte-identical at the tip (`git diff --stat` empty): `src/cli.ts`, `src/command-input.*`,
`src/line-input.*`, `src/history.ts`, `src/gameend.ts`, `src/result-screen.ts`.

## `A9` — QE's own recount

Method: every `+` line of `git diff -U0 20ad7cb..HEAD -- src/turn-loop.ts` (86 `+`, 40 `-`), minus
lines that are blank or whose trimmed text begins with `*`, `/**`, `*/` or `//`. **18** survive. Of
those, **8** are re-indented copies of a `-` line (trimmed text equal): the `!== "move"` `if`, its
`continue`, two closing braces, the `wasGenerated` guard, its `throw`, and `playMove` — the move path
moved inside the `else`. **10** are genuinely new:

```
  | { readonly kind: "quit" }
  | { readonly kind: "take-back"; readonly plies: number; readonly messages: readonly string[] }
export const QUIT_NOTICE = "quit";
      if (outcome.kind === "quit") {
        sink.write(`${QUIT_NOTICE}\n`);
        return { result: null, reason: null, exitCode: 0 };
      if (outcome.kind === "take-back") {
        takeBack(history, outcome.plies);
      } else {
          messages = outcome.messages;
```

(The last line is the 7/8/9 `messages =` at its new depth. The `take-back` branch's own `messages =
outcome.messages;` is NOT a `+` line at all — it sits at the old line's exact indentation, so git
pairs it with the old 7/8/9 line as context; the re-indented 7/8/9 copy is therefore an unpaired `+`
and my moved-filter calls it new. Attribute that one line either way and the total is 18.) The
Engineer's 18 is reproduced by an independent filter.
**18 ≤ 30: `ADR-0021`'s size falsifier is not tripped. Not re-opened.**

## `A10` — the greps, then the three docblocks and the transition-14 comment read against the code

`grep -c "sixteen transitions"` **0**; `grep -c "only on end-of-input"` **0**; `grep -ci
"non-mutating"` **3** (`:273`, `:282` in the `runTurnLoop` docblock; `:433` at transition 14); "the
sixteenth" **1** at `:268` (allowed — it names `ABC-021`'s edge truthfully).

Sentences checked true of the code (each by a mutant or a row, not by reading alone):

| sentence | where | evidence |
| --- | --- | --- |
| "SEVEN of these do not advance a ply — [seven named] — and FIVE of the seven emit a frame (`eof` and `quit` … emit a notice instead)" | `:105-107` | true of each named arm; `Ma` (a frame on `quit`) reds `A1`; see the ruling below for the convention |
| "`take-back` is the one non-advancing outcome that MUTATES the game … re-evaluates through the same single derive a ply uses" | `:117-120` | `M1` (no derive) and `Mg` (two derives) both red |
| "`null` when the loop stopped without a chess outcome: stdin ended, the player quit, or the engine seam failed" | `:172-174` | `engine-threw` / `engine-failure` both return `result: null` (`:420`, `:427`); `Mj` reds a non-null result on quit |
| "`null` on end-of-input and on quit. An engine failure has a reason but no result." | `:177` | as above |
| "Eight states and eighteen transitions; the sixteenth … seventeenth and eighteenth … All three are built below" | `:268-271` | `:340-350`, `:354-376`, `:377-385` |
| cadence "`1 + plies + take-backs + RE-EMITTING non-mutating outcomes`" | `:273` | `A1` 1+0+0+1 = 2; `A3` 1+8+1+0 = 10; `A4` 1+4+1+0 = 6; `A5` 1+0+1+0 = 2 |
| "END-OF-INPUT AND QUIT RE-EMIT NOTHING" | `:276-277` | `Ma` red; `A8` (EOF) unchanged |
| "A NON-MUTATING OUTCOME IS NOT RE-EVALUATED — transitions 7, 8, 9 and the refused claim" | `:282` | `A3b` (unchanged body, 63/63) |
| "One derive per ply, ONE per take-back, and none at all on a non-mutating outcome" | `:432-433` | `M1`, `Mg`, `A3b` |

### Imprecision 1 — the census convention (`G1-INFO` in the `decision`)

A plain-predicate count of arms that do not advance a ply is **eight** of nine (`game-over` returns
before any ply); the docblock says seven and names them. It is an enumeration, true of each member,
and its number is the one `A10` pins and `ADR-0021` clause 5 states; the convention that `game-over`
is not a "non-advancing outcome" is `ABC-019`'s (FOUR) and `ABC-021`'s (FIVE) before it was this
ticket's. **Right under the criterion; not a false sentence by the `ABC-114` standard** (nothing a
build could falsify). Named, not corrected.

### Imprecision 2 — "the only edge into `evaluating-terminal` that does not come from `applying`" (`G2-INFO`)

`src/turn-loop.ts:285`, and word for word `ADR-0021` clause 4. `ABC-019` `## Scope`'s table row 1 is
`initialising` → `evaluating-terminal` — the `let status = gameStatusOf(history)` at `:298`, commented
"Transition 1 → 2". So transition 18 is the only edge **from a prompt** (or: the only in-loop edge)
into `evaluating-terminal` that does not come from `applying`; it is not the only such edge in the
machine. No assertion rests on the sentence, it is not one of `A10`'s named clauses, and the ADR
carries it — so it is an imprecision the record already had, not one this build introduced. **Named
per `ABC-114`; not corrected by QE** (the pen and the verdict stay separate). Whoever next amends
`ADR-0021` clause 4 should take the docblock with it; a one-clause fix.

Neither imprecision moves the verdict.
