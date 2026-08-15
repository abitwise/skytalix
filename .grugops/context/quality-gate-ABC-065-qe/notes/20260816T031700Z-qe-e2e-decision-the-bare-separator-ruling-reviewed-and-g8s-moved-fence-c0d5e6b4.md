---
id: 20260816T031700Z-qe-e2e-decision-the-bare-separator-ruling-reviewed-and-g8s-moved-fence-c0d5e6b4
kind: decision
by: qe-e2e
at: 2026-08-16T03:17:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - ABC-042
  - ABC-066
  - src/cli.test.ts
  - src/cli-options.ts
  - AGENTS.md
supersedes: 
---

# Three rulings asked for by name: the `--` exclusion both ways, `A5`, and `G8`'s moved fence

## Ruling 1 — the `--` exclusion is EXACT, nothing looser slipped in, and the inverse is a NON-CASE

### The exclusion, read from the delivered source

```ts
const documented = new Set(
  (slot.match(/(?<![\w-])--[A-Za-z0-9-]*/g) ?? []).filter((token) => token !== "--"),
);
```

**One filter, `!==`, exact string equality with `"--"`. There is no second filter, no length test, no
`startsWith`, no regex alternation that could drop a real option.** Confirmed by reading the whole
block, not by grepping for the shape I expected: the only other predicates in the block are
`token !== ""` (`A1`'s argv split) and `argument.startsWith("--")` (which *partitions*
`ACCEPTED_ARGUMENTS` into options and value words and drops nothing). **The guard hop's stated
intent and its delivered code agree.**

The character class is `[A-Za-z0-9-]*` with a `*`, not a `+`. That is deliberate and it is what puts
the bare `--` into the match set in the first place, so that it can be dropped **explicitly and
visibly** rather than never matched at all. **This is the better engineering choice and I want it on
the record as such**: `[A-Za-z0-9-]+` would have excluded the bare form silently, and a reader six
months from now would have had no way to tell an intentional exclusion from an accident of the
character class. `N5` (`--Difficulty`, mixed case) reds, which proves the class is not so narrow that
it misses a real token.

**Measured, not argued: `N6` documents the bare `--` as though it were an option of this program and
the suite stays GREEN 32/32.** That is the exclusion working. And `N5`/`N8`/`N14` red on real bogus
options, which is the exclusion **not** having been widened into a hole.

### The inverse — an option literally named `--`

Asked for by name: *"if someone documents an option literally named `--`, what happens?"* Two
readings, both measured:

- **Documented but not accepted (`N6`) → GREEN.** The slot already does this, at *"Pass an option
  AFTER `--`"*. It must stay green or `A1` and `A3` are unsatisfiable together, which is exactly the
  contradiction the Orchestrator's ruling resolves.
- **Accepted, i.e. `"--"` added to `ACCEPTED_ARGUMENTS` (`N7b`) → RED, 7 failures**, and the guard
  becomes *unfixable by documentation*: `documented` filters `--` out unconditionally, so no wording
  of the slot could ever restore set equality. On its face that is a trap.

**Ruling: it is a NON-CASE, not a real risk, and the reason is not the `ABC-065` guard's.** `N7b`
also reds **`ABC-042`'s merged `A6(i)` row** — *"the exported enumeration EQUALS the table, element
for element, both ways"* — with `['--','--ascii','--colour',…] ≠ ['--ascii','--colour',…]`. An option
named `--` cannot enter `ACCEPTED_ARGUMENTS` without first defeating a merged criterion one level up,
and it could not reach a user in any case: `--` is the package runner's own separator and npm consumes
it. **The `ABC-065` guard would be the second alarm, not the first.** No action, no ticket; recorded
so nobody discovers `N7b`'s red later and reads it as a defect.

**One honest caveat on the collector, since I am ruling on its exactness:** the negative lookbehind
`(?<![\w-])` means an option glued to a word character is **not** collected — `run--ascii` yields
nothing. That is a miss, not a hole, and it cannot make a wrong slot pass: a real option list is
whitespace- or backtick-delimited. Recorded and not raised.

## Ruling 2 — `A5` is **MET**, verified by reading all 85 added lines

`A5`: *"its expectation is read from `ACCEPTED_ARGUMENTS` at run time and **no second spelling of any
accepted argument is introduced into the test file**."* The guard hop claims **0**. I verified it.

| test | measured | bearing |
|---|---|---|
| any of the six accepted arguments spelled in the 85 added lines | `sed -n '887,971p' \| grep -E -- '--ascii\|--unicode\|--colour\|\bwhite\b\|\bblack\b\|\brandom\b'` → **NONE** | **0**, in code **and** in comments |
| `usage:` in the added lines | **0** | no copy of the usage sentence |
| `SEPARATOR_FORM` spellings in the whole file | `grep -c 'npm run chess -- '` → **1** (still `:177`, `ABC-066`'s) | the guard hop wrote **no** second spelling of the one permitted literal |
| both sides of the equality derived at run time | `acceptedOptions` / `acceptedValues` are `ACCEPTED_ARGUMENTS.filter(...)`; `A1`'s containment is `expect(ACCEPTED_ARGUMENTS).toContain(token)` | nothing transcribed |

**`A5` MET, and cleaner than `ABC-066`'s block, which had two accepted-argument mentions in doc
comments (examined and cleared under my own `ABC-066` ruling). This block has zero anywhere.** The
only literals it introduces are `"- Dev / run:"` and `"-->"` — a slot label and an HTML delimiter,
neither an accepted argument nor part of any sentence under test.

**Behavioural confirmation, not just textual:** `N12` rewrote the spacing of the documented
invocation and stayed GREEN; `N16` and `N15` red only on *token content*, never on surrounding prose.
The guard is not pinned to a sentence.

## Ruling 3 — `G8`, the moved fence. The guard hop is **CORRECT**, and I confirm it independently

`A2` fences *"`src/cli.test.ts:193-204` … byte-identical"* and glosses it as *"`ABC-042`'s `A1`
row"*. **Since `ABC-066` merged those are two different regions.** Verified by hash, computed by me
on this worktree, from four different commits:

| region | commit | `git hash-object` of the extracted range |
|---|---|---|
| `:193-204` at `dbaf972` — **`ABC-042`'s merge**, where the criterion's author read it | `dbaf972` | `6effd96e368d77460751c3cbcc35ec52558de747` |
| `:193-204` at `717e51d` — the last pre-`ABC-066` tip | `717e51d` | `6effd96e368d77460751c3cbcc35ec52558de747` |
| **`:249-260`** on `main` | `cb04b40` | **`6effd96e368d77460751c3cbcc35ec52558de747`** |
| **`:249-260`** at the branch tip | `901c670` | **`6effd96e368d77460751c3cbcc35ec52558de747`** |
| **`:193-204`** at the branch tip — *what the criterion's words now name* | `901c670` | `03f89ce3000563d4098d2d4fe365605e51bde255` — **`advertisedTextOf` and the expander's doc comment** |
| lines **1–886** of the delivered file | `901c670` | `11431bac60b03074c90bd18b43079aa9403515ef` = the **whole file's blob** at `9490740` — the append, proved arithmetically |

**Every figure the guard hop published reproduces exactly, and I read `:193-204`'s content with my own
eyes: it is `const advertisedTextOf = …` through the expander's `## Test notes` 5 comment.**

### The ruling

**`A2` is `MET` in substance and MISWORDED in form, and the two must not be conflated.**

- **In substance: MET.** `ABC-042`'s `A1` row is byte-identical across `ABC-066`'s merge *and* across
  `ABC-065`'s guard commit — `6effd96e…`, four times, from four commits. The substring
  ``- Dev / run: `npm run chess` `` is still present in `AGENTS.md` (`N2`/`N13` prove the guard notices
  if it is not, and `ABC-042`'s own row reds alongside). The suite is green. **All three of `A2`'s
  clauses hold.**
- **In form: the fence is wrong and would mislead the next scorer.** As written, `A2` protects
  `ABC-066`'s helpers — which also happen to be byte-identical, so a scorer following the letter
  would today get the right answer for the wrong reason. **The next insertion above line 193 ends
  that coincidence**, and the criterion would then be green while `ABC-042`'s row was unprotected.
- **No stop condition fired.** My subtask's stop condition is *"a merged `ABC-042` or `ABC-066` row
  would have to MOVE"*. Neither moved: `0` deleted lines, one hunk, `@@ -886,0 +887,85 @@`. What moved
  is a **line number in ticket prose**, and prose is BA/PM's pen. **I did not edit it and I am not
  routing this back as a blocker.**
- **Recommendation, seconding the guard hop:** fence by **content or by hash**, never by line range.
  This is the **second** time a position in this file went stale in one session. The concrete repair
  is one sentence in `A2`: *"the row asserting `AGENTS.md`'s `Dev / run` line — `git hash-object` of
  its extracted range is `6effd96e…` — is byte-identical."* That fence cannot decay. **Owner: BA/PM.**

**`G8` upheld at `MEDIUM`.** I would not raise it to `HIGH`: nothing is broken today and both regions
were verified. I would not lower it either — a fence that silently protects the wrong block is the
kind of instrument that is discovered by the failure it was supposed to prevent.
