---
id: 20260816T001600Z-qe-e2e-observation-twelve-mutants-and-the-expander-attacked-14da36b1
kind: observation
by: qe-e2e
at: 2026-08-16T00:16:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
  - src/cli.ts
  - src/cli.test.ts
supersedes: 
---

# `ABC-066` — breaking the GUARD, not the fix: twelve mutants and thirteen expander inputs

The fix is one string and it is obviously right. **The claim worth breaking is `A2` — "what the
usage line advertises resolves" — because a wrong expander passes a wrong line.** This note is that
attack, with every input and every result, including the three that came back GREEN.

## How the expander was attacked without trusting a transcription

`SEPARATOR_FORM`, `usageLineOf`, `advertisedTextOf` and `invocationsAdvertisedBy` are module-scope
consts in `src/cli.test.ts` and are **not exported**. Rather than retype them — which would test my
copy, not the delivered code — a probe **sliced the 1942 delivered bytes out of `src/cli.test.ts` by
text position, appended one `export {}`, and imported the result**. Every expander figure below is
the shipped bytes executing. The probe lives outside the repository and adds no file to it.

## Part 1 — the expander, fed thirteen lines it has never seen

`invocationsAdvertisedBy(advertised)`:

| # | input | returned | throws? |
|---|---|---|---|
| E1 | `[--colour white\|black\|random] [--ascii \| --unicode]` *(control)* | `[[], [--colour white], [--colour black], [--colour random], [--ascii], [--unicode]]` — **6** | no |
| E2 | **nested brackets** `[[--colour white\|black\|random]] [--ascii \| --unicode]` | 6, but the stem is corrupted to the literal `"[--colour"` | **no — returns quietly** |
| E3 | **empty alternation** `[] [--ascii \| --unicode]` | `[[], [""], [--ascii], [--unicode]]` — an **empty-string argv member** | **no** |
| E4 | **empty alternative** `[--ascii\|]` | `…, [""]` — same empty-string member | **no** |
| E5 | **`\|` OUTSIDE brackets** `--colour white\|black\|random --ascii \| --unicode` | **`[[]]` — the degenerate single empty invocation** | **no** |
| E6 | no brackets at all, `--ascii` | **`[[]]`** | **no** |
| E7 | **empty advertised text** `""` | **`[[]]`** | **no** |
| E8 | an option advertised **twice** | 7 members, `[--ascii]` appearing **twice** | no |
| E9 | same option twice in one group `[--ascii\|--ascii]` | `[[], [--ascii], [--ascii]]` | no |
| E10 | **unclosed bracket** `[--colour white\|black\|random` | **`[[]]`** | **no** |
| E11 | mandatory arg outside a group `--depth 3 [--ascii \| --unicode]` | 3 — **the mandatory `--depth 3` is silently DROPPED** | **no** |
| E12 | 3-token alternative `[--colour deep white\|black\|random]` | `[--colour deep white]`, `[--colour deep black]`, `[--colour deep random]` — the multi-token stem is carried correctly | no |
| E13 | alternation over a flag `[--colour white\|--ascii]` | `[--colour white]`, `[--colour --ascii]` | no |

### The named vacuity check: **an expander that returns zero invocations is IMPOSSIBLE here**

The subtask asks for this case by name. **`invocationsAdvertisedBy` can never return `[]`**: it
seeds `invocations` with the empty invocation `[[]]` before the loop, so **`length >= 1` for every
input, including `""`.** The vacuity failure mode therefore takes a different shape than the subtask
anticipated, and the different shape is the dangerous one:

**The degenerate return is `[[]]` — one member, the empty argv — and `resolveOptions([])` is
`ok: true`.** So a guard that asserted only *"every advertised invocation resolves"* would be
**VACUOUSLY GREEN on `""`, on an unclosed bracket, and on a `|` written outside brackets** (E5, E7,
E10). The expander does not protect against this; **three separate rows in `ABC-066`'s block do**,
and all three are load-bearing:

1. `expect(advertised.replace(/\[[^\]]*\]/g, "").trim()).toBe("")` — nothing outside a group;
2. `expect(invocations.length).toBeGreaterThanOrEqual(6)` — the count floor;
3. `expect([...new Set(invocations.flat())].sort()).toEqual([...ACCEPTED_ARGUMENTS].sort())` — the
   both-ways vocabulary equality, which `[[]]` fails as `[]` vs 6 tokens.

**Verdict on the vacuity question: `A2` is NOT vacuously true, and it is not the expander that
saves it.** This is the single most important thing for the next hop to carry — see the handoff note.

## Part 2 — twelve mutants, each run against the real suite

Method: mutate only the `USAGE` literal in `src/cli.ts` (or, for M12, the stderr write site), run
`npx vitest run src/cli.test.ts`, `git checkout -- src/cli.ts`. **Every mutant was reverted and the
tree was verified pristine afterwards** (`git status --porcelain src/` empty; `git diff HEAD --
src/` = 0 lines). **No production change survives this hop.**

| # | mutant | result | which row redded |
|---|---|---|---|
| **M0** | the delivered branch string *(control)* | **GREEN 30/30** | — |
| **M1** | **`A4`'s own mutant — `main`'s delivered string, byte-for-byte** | **RED 1 failed / 29** | `A1`: `expected 'usage: npm run chess [--colour white\|…' to contain 'npm run chess -- '` |
| M2 | separator kept, `[--depth 3]` appended | **RED** | `A2`: `advertised argv ["--depth","3"]: expected false to be true` |
| M3 | **nested brackets** | **RED** | the outside-group row: `text outside every group: expected ']' to be ''` |
| M4 | **empty alternation `[]`** | **RED** | `A2`: `advertised argv [""]: expected false to be true` |
| M5 | **empty alternative `[--ascii\|]`** | **RED** | `A2`: `advertised argv [""]` |
| M6 | **`\|` outside brackets — the vacuity attack** | **RED** | the outside-group row |
| M7 | **an option advertised TWICE** | **GREEN 30/30** | **none — a gap, see `Q3`** |
| M8 | an accepted option **dropped** (`--unicode` gone) | **RED** | the count floor: `expected 5 to be greater than or equal to 6` |
| M9 | separator present, **advertises nothing** (`usage: npm run chess -- `) | **RED** | `A1` — `usageLineOf` `trimEnd()`s, so the line becomes `…chess --` and no longer contains the trailing-space form |
| M10 | **double space** after the separator | **GREEN 30/30** | **none — cosmetic, see `Q4`** |
| M11 | **the SENTENCE rewritten**, form kept: `DO WHAT I SAY: npm run chess -- […]` | **GREEN 30/30** | **none — and this is the CORRECT result, see below** |
| M12 | production: **a hint line written AFTER the usage line** on stderr | **RED** | `A1`: `expected 'see the README for more.' to contain 'npm run chess -- '` — **a FALSE red, see `Q1`** |

### `A4` is confirmed independently

**M1 is `A4` exactly as the criterion words it, and I watched it go RED myself.** The engineer's
claim is not an argument any more — the mutant has now been seen red by someone who did not write
the guard. **`A4` MET.**

### M11 is the positive control for `A5`, and it had to be green

I rewrote the entire sentence around the form and the suite **stayed green**. That is the proof that
this guard tests the **property**, not the spelling — the exact defect `ABC-059` carries and that
`## Test notes` 2 forbids reproducing one file over. **A guard that redded on M11 would be pinned to
a sentence.** It did not. Reported as a green that MATTERS, not as a hole.

### The guard reds on **six** distinct assertions

`A1`'s `toContain` (M1, M9, M12), the outside-group row (M3, M6), `A2`'s `resolveOptions` (M2, M4,
M5) and the count floor (M8). **No row is carrying another**, and the two rows the engineer never
exercised — the outside-group guard and the count floor — are both live and both caught mutants
nobody had aimed at them. The engineer built 2 mutants; this hop built 12 and **11 of the 12
non-control mutants behaved as a reader of the criteria would demand.**
