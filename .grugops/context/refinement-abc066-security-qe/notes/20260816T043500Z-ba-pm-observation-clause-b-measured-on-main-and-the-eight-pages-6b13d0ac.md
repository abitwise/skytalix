---
id: 20260816T043500Z-ba-pm-observation-clause-b-measured-on-main-and-the-eight-pages-6b13d0ac
kind: observation
by: ba-pm
at: 2026-08-16T04:35:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-042
  - ABC-061
  - ABC-065
  - ABC-072
  - ABC-073
  - src/
supersedes: 
---

# Clause (b) re-measured on `main` @ `5cf86d3`, and the eight pages that restate it

Every number below was RUN by me on the shared checkout (clean `main` @ `5cf86d3`), **not inherited**
from Security/NFR's note. **No git command was run** — two sibling BA/PM hops share this working tree
and one index — so the measurements are file-system reads over a tree the board records as clean.

## The three limbs of clause (b), each with its own command

| limb | command | result |
|---|---|---|
| imports a Node builtin | `grep -rlE 'from "node:' src/ \| grep -v '\.test\.ts'` | **0 files** |
| **reads `process.`** | `grep -rl 'process\.' src/ \| grep -v '\.test\.ts'` | **7 files** — `cli.ts`, `frame.ts`, `glyph-mode.ts`, `perft-bench.ts`, `render.ts`, `status-panel.ts`, `turn-loop.ts` |
| calls `spawn`/`exec`/`fetch`/`eval`/`new Function` | `grep -rlE '\b(spawn\|exec\|fetch\|eval)\s*\(\|new Function' src/ \| grep -v '\.test\.ts'` | **0 files** |

Denominators: **20 production files, 50 `.ts` files** under `src/`. This reproduces Security/NFR's
figures exactly (7 readers, 20 production files) on a **different tree** — theirs was a linked
worktree off `grugops/ticket-to-pr-ABC-066`, this is `main` after both merges. **`S1` and `S2` are
independently confirmed, and neither is re-decided here** — re-deciding a Security/NFR verdict is a
stop condition of this subtask and it did not fire, because I agree with it.

**The word-hit trap Security/NFR flagged is real and my limb-3 command avoids it**: their `grep`
returned one hit at `src/cli-options.ts:7-8` for the *words* "spawning"/"spawn" in a doc comment, with
**0 call sites**. Requiring `\s*\(` drops it. Carried into `ABC-072` Test note 2.

## The falsified prediction, measured

Clause (b)'s parenthetical says *"`ABC-042` is the hop that ends it"*. `ABC-042` **merged 2026-08-15
@ `dbaf972`** (board row) and the `node:` grep is **still 0**. It ended nothing: it added `process.`
reads, which are the clause's **second** limb, and the instrument watches only the **first**. **The
instrument and the body have disagreed since that merge, and the prediction printed beside the
instrument is false.** This is `S2`, confirmed on my own run.

## The eight pages, and what each one actually says

`grep -rln 'non-\`.test.ts\` file under' plans/tickets/` → **9 pages** (`ABC-041` plus 8 restating
it). `grep -rln 'it fires and the gate resolves it' plans/tickets/` → **7 pages**. Cross-cut:

| page | (b) restated as | fail-safe | editable? |
|---|---|---|---|
| `ABC-053` | **faithful state wording**, under a **"not triggered"** header — self-contradictory | ✅ | Backlog |
| `ABC-054` | delta (*"gaining"*) | ✅ | Backlog |
| `ABC-055` | file-touch (*"touched at all"*) | ✅ | Backlog |
| `ABC-057` | file-touch | ✅ | Backlog |
| `ABC-058` | delta (*"gaining"*) | ✅ | Backlog |
| `ABC-059` | file-touch | ✅ | Backlog |
| **`ABC-061`** | file-touch | **❌** | Backlog — **`P1`, `DoR 10/10`, pullable now** |
| **`ABC-065`** | file-touch | **❌** | **merged — permanently not editable** |

**Not one live page applies the test the clause states.** Two pages carry no fail-safe. `ABC-056` and
`ABC-066` appear in the fail-safe grep **without** restating (b) — the two lists are not
interchangeable, and that trap is carried into `ABC-073` Test note 2.

**Three pages carry byte-identical (b) answers** (`ABC-055`, `ABC-057`, `ABC-059`: *"no
non-`.test.ts` file under `src/` touched at all"*), which is what a copied paragraph looks like from
the outside. `ABC-073` `A3` forbids the repair from producing the same thing again.

## What this does NOT show

- **No control was bypassed and nothing shipped broken.** `ABC-066`'s (b) fired and was cleared on the
  merits; `ABC-065` touched **0** production files whichever reading binds. **The defect is that the
  threshold cannot be read consistently, not that a bad change got through.**
- **It does not settle STATE vs DELTA.** The clause's own history line (*"the one-subject form it
  replaces … measured the repo rather than the change"*) is evidence the author wanted a delta; the
  text is a state predicate; `ABC-042`'s gated page applied the state reading. **Both readings are
  written into `ABC-072` § The evidence points both ways, and the ruling is Architect/Design's. Not
  resolved by inference here — that is this subtask's stop condition, respected.**
