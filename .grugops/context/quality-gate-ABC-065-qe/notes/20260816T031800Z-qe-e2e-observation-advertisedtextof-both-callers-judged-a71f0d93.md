---
id: 20260816T031800Z-qe-e2e-observation-advertisedtextof-both-callers-judged-a71f0d93
kind: observation
by: qe-e2e
at: 2026-08-16T03:18:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - ABC-066
  - src/cli.test.ts
  - .grugops/context/quality-gate-ABC-066-qe/notes/20260816T001800Z-qe-e2e-observation-gaps-found-at-qe-for-abc066-d73cfa8f.md
  - .grugops/context/ticket-to-pr-ABC-065-guard/notes/20260816T023200Z-software-engineer-observation-the-fenced-rows-by-hash-and-which-helpers-fought-me-c6d40a75.md
supersedes: 
---

# `advertisedTextOf` now has two callers. Is each one safe? **Yes — and for a reason that will not survive a third.**

`Q2` was written at the `ABC-066` QE hop to warn this exact guard hop. The engineer reports it fought
exactly as predicted. **My own prior reasoning is context, not authority, so I re-checked the helper
against the delivered source rather than against my own note — and one thing in `Q2` was WRONG.**

## First, the correction, because a note that is wrong in its quotation must be corrected where the correction is visible

`Q2`'s prose says the helper computes `usageLine.slice(usageLine.indexOf(SEPARATOR_FORM) + 17)`. **The
source reads `+ SEPARATOR_FORM.length`** (`src/cli.test.ts:194`). There is no magic number in the
delivered code and there never was — `17` was my transcription, not the file's. The guard hop caught
this ("Trap 3") and it is right. **The behavioural claim `Q2` makes is unaffected and remains exactly
correct** (`17` *is* `"npm run chess -- ".length`), but a note that misquotes source is a note that
can mislead a reader who does not open the file. **Corrected here rather than by editing the
`ABC-066` note, which is append-only.**

## The helper, as delivered

```ts
/** What the usage line offers: everything after the separator the criterion names. */
const advertisedTextOf = (usageLine: string): string =>
  usageLine.slice(usageLine.indexOf(SEPARATOR_FORM) + SEPARATOR_FORM.length);
```

`indexOf` returns **`-1`** when the separator is absent, so the expression degrades to `slice(16)` —
**a silent slice from a meaningless offset, never a throw.** Its sibling `usageLineOf` throws on bad
input and says so in its own comment. **Two of the four shared helpers have opposite contracts and
the doc comments still do not say so.**

## Caller 1 — `ABC-066`'s block, `src/cli.test.ts:867`. **SAFE.**

```ts
const usageLines = refused.map((child) => usageLineOf(child.stderr));
for (const line of usageLines) expect(line).toContain(SEPARATOR_FORM);   // :862
expect(new Set(usageLines).size).toBe(1);                                 // :864
const advertised = advertisedTextOf(usageLines[0] as string);             // :867
```

The precondition at `:862` runs over **all six** lines, and `:864` asserts all six are the **same**
string, before `:867` calls the helper on `usageLines[0]`. **The assertion covers exactly the value
passed** — this is the strongest of the two, because the guarded set and the used value are proved
identical. Verdict: **SAFE, and safe by construction rather than by coincidence.**

## Caller 2 — `ABC-065`'s `A1` row, `src/cli.test.ts:923`. **SAFE.**

```ts
expect(slot, "the separator form in the `Dev / run` slot").toContain(SEPARATOR_FORM);  // :918
const fenced = advertisedTextOf(slot).split("`")[0] as string;                          // :923
```

The precondition at `:918` is on the **same local `slot`** that `:923` passes, three lines above it,
with nothing between them that could rebind it (`slot` is `const`). **Verdict: SAFE**, and mutant `V`
proves the assertion is load-bearing rather than decorative: strip the separator and this row is the
one that reds, first, with `expected '- Dev / run: \`npm run chess\` <!-- ver…' to contain 'npm run
chess -- '`.

**Two differences from caller 1, both examined and both fine:**

1. **Caller 2 passes a MULTI-LINE slot, caller 1 passes a single line.** `indexOf` therefore takes the
   **first** separator form in a nine-line span. Today there is exactly one. If a later Scribe adds a
   second example earlier in the comment, this row silently reads the earlier one — **and that is
   correct behaviour, not a bug**: whichever invocation a reader meets first must resolve, and the
   `A3` row still checks the whole slot's vocabulary. Recorded so it is not "discovered" later.
2. **Caller 2 strips a markdown fence (`.split("\`")[0]`), caller 1 does not.** `Q2`'s consequence 2,
   implemented. The engineer did **not** copy `ABC-066`'s outside-group row verbatim, which is what
   would have produced the false RED I warned about. **This was the right call**, and mutant `N15`
   shows the cost of the coupling it creates — see `Q9`.

## The judgment that matters: **both callers are safe, and both are safe by the same unwritten convention**

Each caller independently remembers to assert `includes(SEPARATOR_FORM)` first. **Nothing in
`advertisedTextOf`'s own doc comment says that precondition exists.** It reads *"What the usage line
offers: everything after the separator the criterion names"* — which sounds **total**, and is not.

Two callers remembering the same unwritten rule is not a convention; it is two people who both happened
to read the same warning note. **A third caller that trusts the doc comment gets a silent wrong
answer, and by then the pattern will look like a convention rather than a requirement.** This is the
guard hop's `G11` and I second it at **MEDIUM**, unchanged.

**The repair is one line of prose in the helper's doc comment — "the caller MUST assert
`includes(SEPARATOR_FORM)` first; this function returns garbage, not a throw, when it does not" — and
it is explicitly NOT a behaviour change.** Making the helper throw would change `ABC-066`'s merged
semantics, which is out of bounds for `ABC-065` and would be out of bounds here too. **Not done at
this hop: my hard limits are read-only on `src/`, and the `G4`-class lesson (do not harden a helper
under a hop that is mid-flight) applies to a merged block under review just as much.**

## `usageLineOf` — declined, and the decline was correct

The guard hop did **not** call it. My own `ABC-066` Ruling 2 said `ABC-065` *"almost certainly should
not call it at all"* because it returns the **last non-empty line** of its input, which on a markdown
file's contents is meaningless. **The engineer declined it on purpose and said so.** I confirm: had it
been called on `AGENTS.md`'s contents it would have returned the file's last non-empty line — today
*"Stop. Write the open question or the assumption. Do not guess silently."* — and any assertion built
on that would have been nonsense. **Ruling honoured, not re-litigated.**

## `invocationsAdvertisedBy` — the mismatch is real and the engineer's `G10` is right

The expander expands a bracketed **grammar**; the slot carries one concrete invocation plus a prose
list whose `|` sits **outside** any group. That is my own measured input **E5**, which returns the
degenerate **`[[]]`**, which `resolveOptions` accepts as `ok: true`. **Feeding the slot to the
expander would have manufactured precisely the vacuous green this hop existed to prevent.** The
engineer reported it rather than forcing it, made no fork, and left the expander used by `ABC-066`'s
row alone. **That is the correct handling and I want it recorded as a good call, not just as a gap in
the instruction.**
