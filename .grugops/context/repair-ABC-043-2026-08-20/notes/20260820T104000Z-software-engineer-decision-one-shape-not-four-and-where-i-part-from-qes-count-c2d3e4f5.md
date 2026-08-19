---
id: 20260820T104000Z-software-engineer-decision-one-shape-not-four-and-where-i-part-from-qes-count-c2d3e4f5
kind: decision
by: software-engineer
at: 2026-08-20T10:40:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - src/cli.test.ts
supersedes:
---

# QE is RIGHT: it is one shape, not four bugs. I tested that before patching it, and I part from the count in one place — **three of the four share a mechanism; the fourth shares the rule and not the mechanism.**

## The shape, stated so it can be applied to a guard nobody has written yet

> **A guard here does not assert over the evidence. It asserts over a VIEW it DERIVES from the
> evidence — a blanked source, a sliced window, three regexes over a spelling, a relation between
> two exit codes — and every one of those derivations can silently DROP the evidence. When it does,
> the guard is green by construction and nothing says so.**

The four QE found, each read as a derivation and what it drops:

| gap | the derived view | what the derivation drops |
|---|---|---|
| `G-02` | source with string literals blanked | `${…}` is **executable code** and was blanked with the text it sat in |
| `G-04` | `entry.slice(indexOf("runTurnLoop("), indexOf("sink,")+5)` | returns **`""`** when the anchors are the wrong way round |
| `G-03` | three regexes naming known-bad **spellings** | a seam reached through a spelling none of them names (`options.input`) |
| `G-05` | `status !== 0`, `status !== other.status` | the **values**; a relation survives a swap |

## The rule, and it is written into the file exactly once

> **A DERIVATION MUST PROVE IT PRESERVED THE EVIDENCE, OR THE GUARD MUST ASSERT OVER THE EVIDENCE
> ITSELF.**

That sentence, and the enforcement under it, is the repair. Everything below is that rule applied.

## Where I part from QE's count, and it is worth writing down

QE said *"four of those five are guards that pass by being unable to look — one shape recurring."*
**Measured at this hop: `G-02`, `G-03` and `G-04` are one shape AND one mechanism. `G-05` is the
same shape and a different mechanism.**

The load-bearing measurement is that **`G-03` and `G-04` are the SAME MUTANT.** Both are built by
hoisting `src/cli.ts`'s options object out of the `runTurnLoop(` call — `G-04` adds an `as` cast to
it, `G-03` adds `void options.input(…)` to it. The hoist is what inverts `A1`'s window, and the hoist
is what gives the orphaning call a name to go through. So **one repair to the window closes both**,
and that is not a claim: `windowOf` was written once and **both** mutants went red, on `A1` and on
`G6`, with no assertion written for `G-03` beyond the clause that reuses the same window.

`G-05` does not join them. Its guard is not blinded by a derivation losing a region — it is a guard
that was **never written**: no row anywhere pinned the usage code to `1`. It is the same rule
("assert the evidence, not a derivation of it") and it needed its own two lines. I am not going to
call that a fourth patch dressed as a shape, and I am not going to call it the same mechanism to
make the count come out at one. **One rule; two mechanisms; three call sites plus two assertions.**

## The repair, in the order it closes things

1. **`withoutStringText` replaces the blanker.** It keeps every `${…}` and blanks only what a human
   wrote as text; a string nested inside an interpolation is text again. `A8`'s `numbersIn` is its
   only customer and its expected transcription is **unchanged** — `["0","0x20","0x7f","1","2","70"]`
   for `cli.ts` — which is the evidence the fix widened nothing.
2. **`windowOf` replaces the slice.** It **throws** on a window it could not open, could not close,
   or that is **inverted**, instead of returning `""`. `A1` uses it; `G6` uses it for its missing
   clause; both mutants red.
3. **`G6` gains the clause that states its property instead of proxying it.** Its three existing
   clauses stay (they are real and they catch other shapes) and a fourth says the options bag **is
   the call's own argument** — so there is no name reaching the seam at all, which is what *"built
   once, called nowhere"* actually means. The name-binding clause was a style check standing in for
   a behaviour; it is now backed by one that is not.
4. **`A3` pins the two exit codes by VALUE.** `70` for a crashed session, `1` for a refused command
   line, alongside the existing relations rather than instead of them.
5. **`the instruments themselves are not blind`** — one new row, and it is the actual fix. Both
   derivations are fed the hostile input **in process**: no spawn, no mutation of a delivered
   module, no `N8-SPAWN` cost, and no dependence on anyone remembering to run a mutation pass. **A
   new derived view on this page goes under that row first.**

## Why the self-test row exists at all, since it asserts on this file's own helpers

Because without it the repair is four patches wearing a hat. The four gaps were not four mistakes of
judgement — every one of the blinded guards was written by someone who believed it looked, and
**none of them had ever been watched going red on the input that blinds it.** `AGENTS.md` already
carries that lesson from `ABC-037` in one line — *"never ship a memory guard you have not watched go
RED"* — and this row is that line made a standing fixture instead of a hop's discipline. It costs
about 20 ms and no child process.

**The honest limit of it:** it proves the two derivations this page has today are not blind to the
inputs QE found. It cannot prove they are not blind to an input nobody has thought of, and it is not
a substitute for QE's mutation pass. It shortens the loop; it does not close it.
