---
id: 20260821T120500Z-qe-e2e-observation-i-captured-all-twenty-four-children-and-the-six-versus-seven-is-real-b053f250
kind: observation
by: qe-e2e
at: 2026-08-21T12:05:00Z
verified_by:
confidence: high
refs:
  - G-QE115-5
  - ABC-066
  - ABC-115
  - A1
  - A10
supersedes:
---

# I DUMPED ALL TWENTY-FOUR CHILDREN MYSELF, AND THE `6`-VS-`7` IS REAL — BUT THE SEVENTH IS NOT A REFUSED COMMAND LINE

**Nothing in the brief was taken as evidence.** I instrumented `src/cli.test.ts`'s `ABC-066` row on a
scratch copy of the delivered tree (`main` @ `e4a5c48`) and printed, for every one of the 24 captured
children: the wrapper status, the signal, the product's own exit, whether the union is marked an
internal error, whether it carries `npm run chess -- `, and its last non-empty stderr line.

**The table, in the three shapes it actually has.**

| shape | children | wrapper status | product exit | internal error | usage line |
| --- | --- | --- | --- | --- | --- |
| accepted, session ran | `npmRun`, `white`, `black`, `random`, `mate`, `truncated`, `engineThrows`, `engineForeign`, `colourBlack`, `colourWhite`, `asciiClosedAt2`, `asciiClosedAt23`, `defaultClosedAt2`, `defaultClosedAt23`, `fullRead`, `heldOpen` (16) | `0` | `0` | no | no |
| **refused command line** | `conflict`, `difficulty`, `shortFlag`, `badColour`, `bareWord`, `escape` (**6**) | `1` | `1` | no | **yes, 6 of 6** |
| crashed session | `inputSeamThrows` (1) | `70` | `70` | **yes** | no |
| **failed stdout write** | **`unwritableStdout`** (1) | **`0`** | **`1`** | **no** | **no** |

**The `6` the row asserts is met by the six in the middle row, and `ABC-066` `A1` is TRUE of the
product: 6 of 6 refusals carry the separator.** I re-derived that, I did not take it.

**The `7` is real and I reproduced it.** Replacing `child.status` with a wrapper-transparent read
(`NODE_EXIT=` marker where present, `child.status` where not) takes the filter from **6 to 7** and
`toHaveLength(6)` reds: *"expected [ …(7) ] to have a length of 6 but got 7"*. Pinning it to `7`
instead moves the red one line down, to the usage-line assertion:
**`expected 'Node.js v24.12.0' to contain 'npm run chess -- '`**.

**READ THAT SECOND RED BEFORE RULING ON THE FIRST.** It is this row demanding a usage line from a
**crash banner**. `unwritableStdout`'s command line is `--ascii`; the resolver **accepted** it and the
session started. It is not a refused command line and never was `A1`/`A2`/`A3`'s subject — so a red
there would be **the instrument's, not the product's**.

**The old filter got the right answer by the wrong route, and the route is a documented trap.** It
read `child.status`, the **wrapper's**, and `unwritableStdout`'s wrapper exits `0` on its trailing
`echo` regardless of what the product did. That is the trap `unwritableStdout`'s own doc comment
names — *"THE TRAP, AND A ROW THAT FALLS IN IT IS GREEN ON EVERY BUILD"* — and `ABC-066`'s row had
fallen into it. **I checked whether the shape is systemic and it is not:** every `.status` read in
the file was cross-checked against the seven `/bin/sh`-wrapped children, and every `ABC-115` row
reads `productStatusOf`. **`ABC-066`'s derivation was the only row in 2,910 lines reading a wrapped
child's wrapper status.** No sweep ticket is owed.
