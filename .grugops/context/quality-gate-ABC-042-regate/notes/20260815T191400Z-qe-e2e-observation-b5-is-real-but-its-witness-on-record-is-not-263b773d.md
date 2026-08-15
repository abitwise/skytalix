---
id: 20260815T191400Z-qe-e2e-observation-b5-is-real-but-its-witness-on-record-is-not-263b773d
kind: observation
by: qe-e2e
at: 2026-08-15T19:14:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - B5
  - E1
  - A6
  - src/cli-options.ts
  - src/cli.test.ts
supersedes: 
---

# `B5`: the residual is REAL, ACCEPTABLE, and **stated with the wrong witness** — I built both

`B5` is the `B1` hop's own stated residual: *"a weakening that accepts only tokens at edit distance ≥ 2
from every accepted spelling still survives"*, with BA/PM's `token.replace("xx","") === COLOUR` given as
the shape. The subtask asks whether that residual is acceptable and stated accurately. **The answer is
yes to acceptable, and no to accurately — and the inaccuracy runs in the direction of pessimism, which
is the safe direction but is still worth correcting.**

## The witness on record does NOT survive

| # | mutant | verdict | killed by |
|---|---|---|---|
| **`MB5a`** | `token.replace("xx", "") === COLOUR` — **BA/PM's shape, verbatim, and the one the `B1` note repeats** | **KILLED** | **`A6(i) — the enumeration is the ONLY argv literal in the delivered resolver`** |

It dies because it writes two new string literals — `"xx"` and `""` — and the only-argv-literal row
scans **every** space-free literal in the resolver, not only dash-led ones. Neither `"xx"` nor `""` is
in `ACCEPTED_ARGUMENTS` or the transcribed `NOT_ARGV` list, so the row reds.

**This matters beyond pedantry.** Both BA/PM's ruling and the `B1` note present that mutant as a live
survivor. A reader checking the residual by building the named shape gets a RED and concludes the
residual is closed. It is not.

## A witness that DOES survive — built, run, and demonstrated end to end

The class that actually escapes must add **no new string literal** (the only-argv-literal row) and **no
new numeric literal** (`A8`'s number transcription pins `cli-options.ts` at exactly `["0","0.5","1"]`).
Both fences are why the obvious distance-2 shapes die. One that clears both, using only bindings the
module already has:

```ts
const OFFSET = COLOUR.length - RANDOM.length;          // === 2, written without a numeral
if (token.slice(OFFSET) === COLOUR.slice(OFFSET)) {    // accepts ANY two characters + "colour"
```

| # | mutant | verdict |
|---|---|---|
| **`MB5b`** | the above, on `--colour` | **SURVIVED — 856/856, the FULL suite** |
| **`MB5c`** | the same shape on the flag `--ascii` | **SURVIVED — 856/856** |

And the behaviour, run against the mutated build outside the suite:

```
node src/cli.ts xxcolour black   ->  exit 0, 23-row board on stdout
node src/cli.ts ZZcolour white   ->  exit 0, 23-row board on stdout
node src/cli.ts --colour white   ->  exit 0, 23-row board on stdout   (still correct)
npm test                         ->  856 passed (856)
```

**A full board on an argument the allowlist does not contain, with the whole suite green.** That is the
same sentence I wrote about `M7` at the last gate, and it is why I am not letting the residual sit on a
witness that dies.

## Is the residual ACCEPTABLE? Yes — and the reasoning is not "no instrument is perfect"

1. **It is out of reach of any finite family, by construction.** The family walks one edit at every
   position. A weakening invisible to it must, by definition, accept only tokens at distance ≥ 2. To
   close distance 2 you enumerate distance 2 — `O(n²·|Σ|²)` — and then the same argument reappears at
   distance 3. `E1` refused a fourth item on a list of three for exactly this reason; adding a distance-2
   pass would be the same refusal made two years later.
2. **The instrument set already prices it out of the plausible range.** `MB5a`, and every distance-2
   shape I could write that names a literal or a number, dies on rows that already exist. Constructing
   `MB5b` required deliberately routing around **two independent fences**. This is no longer a
   weakening an engineer writes by accident — it is one someone writes on purpose.
3. **BA/PM's ruling already declined the alternative that would close it**, and declined it on grounds I
   agree with after building the mutants: option **(C)**, asserting the *mechanism* textually, either
   binds the criterion to the resolver's local variable being named `token` (which `R1` proves is a
   legal rename) or degenerates into a denylist of method names — *"a short-list defect closed with a
   short list"*, in BA/PM's words. **I tried to find a form of (C) that avoids both and did not.**
4. **The delivered build is correct.** 0 of 138 accepted, 0 of 1000 complement tokens accepted, every
   documented spelling resolves. There is no live defect — only an instrument that cannot see one class
   of hypothetical future one.

**So: `B5` is accepted, at LOW severity, as `E1` and the `B1` hop both intended.** What I am changing is
its *record*: the residual needs a witness that survives, or the next census will "verify" it with
`MB5a`, watch it go red, and quietly close a gap that is open.

## What I did NOT do about it

I did not write a distance-2 row. It would be a criterion change (`A6`(i) names the family), it is
BA/PM's to write if anyone's, and `E1` priced and declined exactly that direction one hop ago. **Naming
the correct witness is the whole of my contribution here.**
