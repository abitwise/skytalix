---
id: 20260815T191700Z-qe-e2e-decision-s1-routing-and-what-the-integration-produced-b688b667
kind: decision
by: qe-e2e
at: 2026-08-15T19:17:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - S1
  - S2
  - S3
  - Q5
  - Q6
  - B4
  - G6
  - R5
  - A12
  - BAR-1b
  - ADR-0011
  - src/history-pane.nfr.test.ts
  - AGENTS.md
supersedes: 
---

# `S1`'s routing — I would have written the row — and the three things the INTEGRATION produced

## `S1` — the routing was PRUDENT, and I judge the row **was writable**. Both halves said plainly

The `B1` hop routed `S1` rather than take it, on the ground that the only instrument that does not red a
correct file is one over **comment-stripped** text, and that choosing "comment-stripped" *is* `Q5`'s open
clause — so writing the row would settle an open criterion question by implementation.

**I think the row was writable, and here is the argument rather than the preference.**

1. **The bar already decides it.** `BAR 1b` does not merely supply two regexes; it supplies them under
   an explicit, bolded disambiguation: *"**call sites, NEVER occurrences**"*, with its reason attached
   (*"the file MUST contain `process.execPath`"*). A comment occurrence is not a call site. Over
   comment-stripped text the regexes return `0 / 0 / 0`; over raw text they return `1 / 1 / 1`, all three
   inside the file's own docblock. **Only one of those two readings satisfies both halves of the bar as
   written.** Choosing it is implementing the bar, not re-wording it.
2. **The convention already exists in the very file, five times over.** `src/cli.test.ts` defines
   `executableCodeOf` and uses it for `A2`, `A6`(i)'s literal scan, `A8`'s call-site count, `A8`'s number
   transcription and `A9`. A sixth use for `BAR 1b` introduces no new idea and no new judgement.
3. **I measured the row rather than only asserting it could be written.** Comment-stripped:
   `/\bexec\s*\(/` = 0, `/\bexecSync\s*\(/` = 0, `shell:` = 0, `process.execPath` = 1, `spawnSync(` = 1
   call site, and the `spawnSync` argument text is `command, [...args],` — an array literal with no
   concatenation. **The row is green today and its numbers are known.**

**And now the other half, because "writable" is not "should have been written by that hop."** The
engineer's caution is the right *kind* of caution for this project: an implementer who resolves an
ambiguous criterion by writing its instrument leaves a reviewer unable to tell implementation from
quiet re-wording, and this ticket has **deleted two criteria** rather than let that happen. The cost of
routing is one hop on a ticket already held at merge; the cost of guessing wrong is a criterion silently
redefined. **I would not have blocked either way, and I record my disagreement as a judgement, not a
defect.** `B4` states the residual accurately: the property is MET by two independent measurements and
the only mechanical guard on the one file licensed to spawn is prose in a docblock. **LOW.**

## `S2` and `S3` — taken, and I re-watched both rather than reading the report

- **`S3`** (backtick alternation in the only-argv-literal scan). Re-measured for false-RED risk: the
  current resolver's executable code contains **zero** backticks, so the alternation matches **13
  literals before and 13 after**. It adds no new literal to check and cannot false-RED today. Confirmed.
- **`S2`** (bar 3 locates the echoed token by whitespace instead of assuming line 0). Confirmed
  behaviourally at my own hand: the escape child echoes `[2Jpurple` on stderr, **zero non-newline C0
  characters anywhere in the union**, zero frame rows on either channel, exit 1. The instrument now
  asserts over the **token**, which is what the bar's clause (ii) literally says — it moved toward the
  criterion, not away from it.

## `Q6` — the spawn pin. **CLOSED**, and I proved it with two mutants the record did not have

The pin used to be self-referential (`spawned` counts only children made through `childOf`). The tip
closes it at the source. I attacked the closure:

| # | mutant | verdict |
|---|---|---|
| **`MS1`** | an **eleventh child** spawned by a direct `spawnSync`, bypassing `childOf` entirely | **KILLED** by the `N8-LANE` row |
| **`MS2`** | `node:child_process` reached through a **namespace import** (`import * as cp`) instead of the named one | **KILLED** by the `N8-LANE` row |

`MS2` is the interesting one: the row asserts the **named-import list equals `["spawnSync"]`**, so a
namespace import, a default import or a dynamic `import()` all produce an empty list and red. **The
instrument the owner's `G1` decision rests on is now tamper-evident.** `Q6` closed.

---

# What the INTEGRATION produced — three things, none of which either hop could see alone

The Orchestrator asked for exactly this and it is the one part of the job that could not have been done
on either branch.

## 1. The `ADR-0011` amendment and `src/history-pane.nfr.test.ts` now **disagree on the tree**

The Architect/Design hop **struck** clause 3's licence-admission sentence in
`memory-bank/50-decisions/ADR-0011-…md`. `src/history-pane.nfr.test.ts` **restates that struck sentence
verbatim** in its licence docblock. On the integrated tree, the ADR says a rule is struck and a merged
test file still asserts it in prose.

**The Architect named this, routed it (`R5` plus a docblock row, both to a new ticket) and explained why
it could not be fixed here — `A12` bounds that file to one array element plus its citation.** I verified
the citations they gave, because a routed inconsistency is only honest if its coordinates are right:

```
LICENSED_DRIVERS          src/history-pane.nfr.test.ts:219   ["turn-loop.ts", "cli.ts"]   — as cited
the unwitnessed toEqual   src/history-pane.nfr.test.ts:335                                — as cited
the drift tripwire        src/history-pane.nfr.test.ts:441                                — as cited
the struck sentence       src/history-pane.nfr.test.ts:196-199                            — as cited
```

**All four are exact.** **No test in this repository reads any ADR file** — I checked — so the amendment
cannot mechanically affect the suite in either direction. `Q11` below carries the inconsistency; **it is
stated, owned and NOT a new defect**, and I record it because "stated on one branch" and "true on the
merged tree" are different facts.

*(The ticket page cites `LICENSED_DRIVERS` at `:213`. It is at `:219` after the citation edit. The
ticket page is not mine and this is not worth a repair on its own — noted so nobody re-measures it.)*

## 2. `A12`'s "and nothing else" reads differently against the branch than against the build commit

`A12`: *"`git diff --name-only` shows exactly: the entry point, the resolver, their test file(s),
`package.json`, `AGENTS.md` and `src/history-pane.nfr.test.ts` — and nothing else."*

| scope | non-`.grugops` paths |
|---|---|
| the build commit `e140355~1..e140355` | **exactly `A12`'s six.** MET |
| the branch, `7df25b9...HEAD` | `A12`'s six **plus** `memory-bank/50-decisions/ADR-0011-…md` **plus** `plans/tickets/ABC-042-…md` |

**My ruling: `A12` is MET, on the build-commit reading, which is the reading every prior hop used and the
only one the criterion can bear.** The two extras are not the build: the ticket page is BA/PM's criterion
repair (`E1`), and the ADR is Architect/Design's `G6` — a *separate subtask on a separate branch* that
the Orchestrator chose to co-merge. Under a literal branch reading, `A12` would also be breached by every
`.grugops/context/` note any hop has ever written, which is plainly not what it means.

**But the page does not say which reading it means, and the human turning the merge key will run the
branch diff, not the build-commit diff.** That is `Q12` — LOW, and the owner is the **Orchestrator**,
because the ambiguity was created by the co-merge decision, not by the criterion.

## 3. `AGENTS.md` now contradicts itself, in a section this ticket edited

`AGENTS.md` § Commands line 62 reads `` - Dev / run: `npm run chess` `` — correct, and `A1` asserts it.
`AGENTS.md` § Deployment posture (line ~184) still reads:

> *"There is also **no CLI entry point yet**, which is why `Dev / run` above is `UNKNOWN - verify` and
> stays that way."*

**Both clauses are now false**, on the same file, in the same commit's tree. `A1`'s row does not see it:
it asserts `not.toContain("- Dev / run: \`UNKNOWN - verify\`")`, and the stale sentence is different text.
I checked every prior `ABC-042` note and **nobody has raised this** — it is new. That is `Q13`: LOW, one
clause, and `AGENTS.md` is **inside `A12`'s licensed six**, so it is fixable on this ticket by whoever
owns the prose. **I did not fix it** — `AGENTS.md` is not mine to edit at a gate, and consuming `A12`'s
budget would force a reviewer to re-verify the file.

**This is not a posture change and must not be read as one.** `ADR-0007` and the deploy fence are
untouched; the sentence is factually stale about the *entry point*, not about *deployment*.
