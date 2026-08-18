---
id: 20260819T161000Z-ba-pm-observation-the-growth-measured-and-what-i-did-not-cut-7c1d0e5b
kind: observation
by: ba-pm
at: 2026-08-19T16:10:00Z
verified_by:
confidence: high
refs:
  - ABC-109
  - ABC-037
  - AGENTS.md
supersedes:
---

# The growth re-measured first-hand, the live structural coupling nobody had written down, and four
things I found and deliberately did NOT cut

## The growth, measured by me at this hop with `git cat-file -s`

```
39122ec  docs(agents-md): the -- separator in Dev / run, ABC-065       21,638
a8edb11  docs(uat): owner acceptance of ABC-065 and ABC-066            22,771   +1,133
b584803  docs(agents-md): the standing UAT waiver, named an override   24,522   +1,751
9998a54  docs(governance): every ticket passes through QE              26,240   +1,718
a00c2a3  feat(search): ABC-077 recursion core                          26,902     +662
91d852e  feat(engine): ABC-078 deepen against the clock                27,690     +788   <- main @ 14c34bd
grugops/quality-gate-ABC-037-qe-2026-08-19  (the INPUT_DEEP slot)      28,873   +1,183   UNMERGED
grugops/agents-md-input-deep                (the heapUsed amendment)   29,749     +876   UNMERGED
```

**Seven deltas, +8,111 bytes, mean +1,159, and not one of them shrank the file.** Headroom against
the inherited 32,768: **5,078 (15.5%, 4.4 edits) on `main` today**, **3,019 (9.2%, 2.6 edits) once
the two unmerged branches integrate**. **`main`'s 27,690 is not the number to plan against** —
+2,059 bytes of this file are already written and merely unmerged.

Two smaller measured facts, recorded because they are numbers on a page:

- **The Scribe's note reports its own edit as +704; measured tip-to-tip it is +876.** No conclusion
  changes. Not mine to resolve, and not worth a ticket.
- **Where the mass is:** `## Test and UAT authority` 4,678 (16.9%), `## Deployment posture` 3,228
  (11.7%), `### Test` 2,463 (8.9%), `## Branching model` 2,263 (8.2%), `## QE validation authority`
  1,717 (6.2%), `## Process rules` 1,700 (6.1%) — **58.0% in six sections, every one of them an
  owner directive or a kit-override precedence note.** Separately, **16 HTML comment blocks =
  4,657 bytes = 16.8%.**

## The cap itself is INHERITED and the ticket says so in its own section

**I did not re-derive the 32,768 value, nor the silence, nor the tail-first direction.** They come
from the Scribe's 2026-08-19 observation note and the Orchestrator's brief, and `ABC-109` carries a
`## What is measured here and what is inherited` section plus an `A8` criterion that forces the
provenance into `AGENTS.md` itself. **`UNKNOWN - verify` on any other reader.** The ticket stands
anyway because the direction is monotone: a cap 15% larger postpones the deadline by roughly four
edits, it does not remove it.

## The coupling nobody had written down, and it changes what the remedy may do

**`src/cli.test.ts` is a live consumer of `AGENTS.md`'s STRUCTURE, not just its prose.** It reads
the file from the repository root at `:278`, `:1050`, `:1127`, `:1157` and asserts:

- the label `- Dev / run:` occurs **exactly once** (`:1029`, `:1130`),
- that slot's HTML comment **closes before the next top-level list item** (`:1044`),
- the literal ``- Dev / run: `npm run chess` `` is present and is not `UNKNOWN - verify` (`:283`).

**A restructure that moves or re-labels that slot reds the suite** — the good case, since it fails
loudly. **The bad case is the cheap one: relaxing those tests to make the file fit**, which is why
`ABC-109` `A4` requires the four sites to be **unmodified in the diff**. I found this by reading the
tests, not by being told it; nothing in the Scribe's notes or the brief mentions it.

## Found and deliberately NOT cut — four items, routed rather than absorbed

The brief allowed one ticket. These are recorded for the Orchestrator to route or drop:

1. **`src/cli.test.ts:1041`'s comment is already stale.** It states `AGENTS.md` *"carries 13 further
   closers after this slot's own"*; measured today the file has **16 comment closers, 15 of them
   after that slot**. It is a comment, not an assertion — **nothing reds** — and `ABC-109` `## Test
   notes` 6 explicitly forbids repairing it inside that ticket. Cheapest fix is a comment-only line
   on whatever hop next opens that block; it does not deserve a ticket of its own.
2. **The `plans/traceability.md` entry the Scribe's amendment branch owes** — see the artifact-ref
   note; recorded, not fixed, integration is the Orchestrator's.
3. **The Scribe's +704 vs the measured +876** (above). Recorded, not routed.
4. **Nothing else in this repository is under a read cap that I could measure.** `CLAUDE.md` is
   three lines and the role adapters are short. **The exposure is one file**, which is why one
   ticket was the right count and not an under-cut.

## Gate — unchanged from `main`, as the brief required

No `src/` change was made, so nothing could move, and nothing did.

| step | result |
|---|---|
| `npm test` at `14c34bd` in this isolated worktree | **38 files / 1152 tests passed, 0 failed** (2.65 s), exit 0 |
| skip count | **0** (recorded from `main`; no test was added, removed or skipped at this hop) |
| files under `src/` touched | **0** |

`ls -a .claude/` in an isolated worktree shows no `worktrees/` directory, so the recorded command is
correct as written here — the same check the Scribe and QE made.
