---
id: 20260817T140600Z-software-engineer-decision-one-block-at-the-end-of-the-file-no-helper-and-two-line-refs-that-drifted-5e6f7a8b
kind: decision
by: software-engineer
at: 2026-08-17T14:06:00Z
verified_by:
confidence: high
refs:
  - ABC-062
  - src/cli.test.ts
  - src/cli-options.ts
  - .grugops/context/recut-ABC-062-criteria/notes/20260817T134700Z-ba-pm-decision-abc-062-recut-three-struck-one-added-xs-p1-dor-10-of-10-dfaa0325.md
supersedes:
---

# How the block is written, and the two things I chose against

One new `describe` with one `it`, appended at the **end** of `src/cli.test.ts` (`:1171-1212`). It
carries all three live assertion criteria — `A1`, `A2`, `A7` — because `A7` is an inequality
*between* the two resolutions and splitting them would force one of them to be resolved twice.

## Decisions

1. **A new `describe` at the end of the file, not an insertion.** The diff is **additive only** —
   `git diff --numstat` reads `42 0`, zero deletions — so every fenced anchor (`:315`, `:325`,
   `:410`, `:545`, `:750`, `:933`, and `ABC-066`'s block at `:949-984`) is byte-identical by
   construction rather than by inspection. No line was added inside any merged block.
2. **Not folded into any existing family**, per the fence and `## Test notes` 2.
3. **`.problem` matched on a distinguishing substring** (`white|black|random`, `unrecognised`), the
   delivered practice at `:388`. **I did not export `MISSING_VALUE` / `UNRECOGNISED`** — that is the
   production line this ticket does not have, and BA/PM's note records catching itself about to
   recommend it. `A7` is the assertion that pays for the loose matching.
4. **`.offending` by deep equality, never `toContain`.** This is the whole witness: under the
   `next as string` mutant `.offending` is `[undefined]`, which a containment check on the message
   would never see. There is a comment in the block saying so, so a later tidy cannot loosen it
   without reading why.
5. **No helper function, and no early `return` between the two resolutions.** Both resolutions are
   taken first, both `.ok` rows asserted, then one `if (missingValue.ok || unrecognised.ok) return;`
   purely for type narrowing. The obvious alternative — the delivered `if (resolution.ok) return;`
   shape repeated twice — would put an early return **between** `A1` and `A7` and could in principle
   skip `A7`; a `refusalOf()` helper would be an abstraction for two call sites (coding rule 6). The
   combined narrowing line is the smallest form with neither problem.
6. **Zero production lines, zero new files, zero new child processes.** `src/cli.ts` and
   `src/cli-options.ts` were read only. Nothing in the block reads a `CHILDREN` entry — two pure
   `resolveOptions` calls and seven assertions, in process.

## Two cosmetic drifts found, neither of which changed anything

Reported rather than worked around, per the work order. **Neither is a defect and neither moved a
decision** — I honoured both fences as written and touched neither block.

- **The `:410` label points at the wrong block.** The fence says "do not fold the two argvs into the
  near-miss family at `:410`", and the near-miss family — the one that is *complete over position and
  derived from the table* — is the `A6(i)` block at **`:554`**. Line `:410` sits inside the `A6(iii)`
  table of four unrecognised **end-to-end children** (`:407-421`). The two are different blocks with
  different owners. BA/PM verified `:410` as "the near-miss `cases` table", which is true of the
  identifier at `:408` and not of the description attached to it.
- **`:315`, `:325` and `:750` are mid-block anchors, not row starts** (`:315` and `:750` are comment
  lines, `:325` is a closing `});`). They are stable as anchors and are untouched; noted only so a
  later reader does not conclude the fence was misapplied.

## `N8-LANE`, stated honestly rather than re-measured

`N8-LANE`'s **scope** clause is "every file the branch adds under `src/`" (`plans/nfr-catalog.md:894`).
**This branch adds none**, so the ticket's lane charge is **zero by scope** and the recorded
`MET at 0.23x (152.5 ms of 650 ms)` is unmoved. I did **not** run the row's n ≥ 7 interleaved paired
harness with its identity null control: with zero files added there is nothing the harness could be
scoped to, and inventing a figure for it would be worse than naming the scope clause. The added
content is two pure resolver calls and seven in-process assertions; `src/cli.test.ts` measured
**13-17 ms of test time** across the runs above, against 15 ms unmodified. **Security/NFR owns the
final `N8-LANE` verdict at the gate; this is the engineer's input to it, not the verdict.**
