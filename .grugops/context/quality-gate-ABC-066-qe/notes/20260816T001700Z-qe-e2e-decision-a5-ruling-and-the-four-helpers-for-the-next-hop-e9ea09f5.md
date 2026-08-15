---
id: 20260816T001700Z-qe-e2e-decision-a5-ruling-and-the-four-helpers-for-the-next-hop-e9ea09f5
kind: decision
by: qe-e2e
at: 2026-08-16T00:17:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-065
  - ABC-062
  - src/cli.test.ts
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
supersedes: 
---

# Two rulings on the record: `A5`, and whether the next hop may lean on `usageLineOf`

Both were asked for by name. Both are ruled here rather than left to the next reader to re-derive.

## Ruling 1 — `A5`: `SEPARATOR_FORM` is **the one permitted spelling, NOT the forbidden second one**. `A5` is **MET**

`A5` forbids *"a second spelling of any accepted argument"* and *"a copy of the usage text"*, and
gives its own reason: *"a guard that hardcodes the sentence passes on the sentence and not on the
property."* Ruled against that reason, on four measurements:

| test | measured | bearing |
|---|---|---|
| is `npm run chess -- ` an **accepted argument**? | **No.** `ACCEPTED_ARGUMENTS` is `--ascii, --unicode, --colour, white, black, random`. The separator contains **none** of them; a bare `--` is the package runner's separator and is not a token this program accepts (`A3` pins that). | there is no *first* spelling for it to be a *second* of |
| is it **the criterion's own literal**? | **Yes.** `A1` is worded *"the usage line … contains the literal `npm run chess -- `"*. The criterion names the string; it cannot be tested without the string being written once. | writing it is the criterion, not a transcription of the implementation |
| how many times is it spelled in the file? | **Exactly 1** — `src/cli.test.ts:177`, `const SEPARATOR_FORM`. `grep -c` over the whole file returns **1**. | one spelling is the minimum possible, not a duplicate |
| is any **accepted argument** spelled in the added **code**? | **0.** Of the 92 added lines, the only accepted-token hits are `--colour/white/black/random` on **two doc-comment lines** explaining the grammar rule. Added **code** lines spelling an accepted argument: **0**. The word `usage:` appears in **0** added lines. | no copy of the usage sentence entered the file |

**The decisive evidence is behavioural, not textual: mutant M11 rewrote the entire usage sentence to
`DO WHAT I SAY: npm run chess -- […]` and the suite STAYED GREEN.** A guard that had transcribed the
sentence would have redded. It did not — it tests the property. That is precisely what `A5` exists
to require.

**The two doc-comment occurrences are examined and cleared, not waved.** They are prose explaining
why `[--colour white|black|random]` means an alternation over the group's last token. They
participate in **no** assertion, cannot make any test pass or fail, and deleting them would change
no result. `A5` constrains what the guard's *expectation* is derived from; a comment is not an
expectation. **Ruling: `A5` MET. The literal stays as written and nobody should "fix" it.**

## Ruling 2 — `usageLineOf` is **safe for `ABC-065` TODAY, but it is POSITIONAL and it fails in the false-RED direction**. Lean on it — with one condition

`usageLineOf` takes **the last non-empty line** of stderr, after `trimEnd()`ing each line. That is a
**positional** rule, not a content one: it never checks that the line it returns is a usage line.

### What it returns when a warning follows the usage line — measured, both orders

| stderr | returns |
|---|---|
| `unrecognised…` / `usage: …` / **`npm warn something`** | **`"npm warn something"` — the WRONG line, silently** |
| **`npm warn …`** / `unrecognised…` / `usage: …` *(npm's real order)* | `"usage: npm run chess -- [--ascii]"` — **correct** |
| `""` (empty) | **throws** `the refused child wrote nothing to stderr` |
| whitespace only | **throws** — `trimEnd` + non-empty filter makes it honest |
| `usage: …` then a spaces-only line | correct — the blank-ish trailing line is filtered |

### Why it is safe today — measured, not assumed

I ran the real thing, both routes:

```
$ npm run chess --colour black                     # stderr, in order:
npm warn "black" is being parsed as a normal command line argument.
npm warn Unknown cli config "--colour". …
unrecognised argument: black
usage: npm run chess -- [--colour white|black|random] [--ascii | --unicode]   <- LAST. correct.

$ node src/cli.ts --colour purple                  # how the nine refusal children are actually spawned
--colour needs one of white|black|random: purple
usage: npm run chess -- [--colour white|black|random] [--ascii | --unicode]   <- LAST. correct.
```

**npm emits its warnings BEFORE the child's output, never after**, and `src/cli.ts` writes `USAGE`
as the final thing in its one `process.stderr.write`. So the usage line is last on **both** routes.
Nine of the ten captured children are spawned as `node src/cli.ts …` with no npm in the loop at all.

### The failure direction, proven with mutant M12

I appended one hint line after `USAGE` in production. The usage line was still **perfectly correct
and still carried the separator** — only its position moved — and the suite went **RED** with
`expected 'see the README for more.' to contain 'npm run chess -- '`. **That is a FALSE RED.**

**This is the right direction for a guard to fail** (it cannot go green by looking at the wrong
line — a wrong line will not contain the separator), and it fails **loudly with a message that names
the line it actually read**, which is diagnosable in seconds. But it means **any future hop that adds
a second line to a refusal breaks this guard for a reason that is not a defect.**

### The ruling for `ABC-065`

**Yes — reuse `usageLineOf`, do not write a second copy.** It is correct on both measured routes and
it fails safe and loudly. **Condition: `ABC-065` reads its option list out of `AGENTS.md`, not off
stderr, so it almost certainly should not call `usageLineOf` at all** — the artifact-ref note already
says as much. **If it does call it, it must be on a captured child's stderr and on nothing else.**
Calling it on a file's contents would return that file's last non-empty line, which is meaningless.

### The condition that DOES bind `ABC-065`, and it is not `usageLineOf`

`advertisedTextOf` is the helper with the sharp edge, and `ABC-065` will certainly call it. See the
gaps note, `Q2` — it **silently returns a wrong substring** when the separator is absent, and on a
repaired `AGENTS.md` line it returns a **trailing backtick** that will red the outside-group
assertion if that row is copied verbatim. Both are measured there with the exact strings.
