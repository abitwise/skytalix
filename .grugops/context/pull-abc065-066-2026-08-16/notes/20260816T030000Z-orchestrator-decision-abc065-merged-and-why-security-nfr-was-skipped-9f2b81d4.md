---
id: 20260816T030000Z-orchestrator-decision-abc065-merged-and-why-security-nfr-was-skipped-9f2b81d4
kind: decision
by: orchestrator
at: 2026-08-16T03:00:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - .grugops/context/quality-gate-ABC-065-qe/notes/
  - AGENTS.md
supersedes: 
---

# `ABC-065` merged, Security/NFR deliberately NOT run, and the gap `Q8` I am not burying

## Why Security/NFR was skipped — stated so it can be challenged, not buried

`mode` is `lean`, where the kit lets `In Security/NFR` stay empty unless a trigger fires. **The
difference from `ABC-066` is the reason, and it is specific rather than convenient:**

| | `ABC-066` | `ABC-065` |
|---|---|---|
| production files touched | **1** (`src/cli.ts`) | **0** — measured, `git diff --name-only main...<branch> -- src/` returns only the test file |
| the ticket's own § Security | argues clause (b) quiet, then says **"disputed either way, it fires and the gate resolves it"** | "not triggered", four clauses answered, **no fail-safe sentence** |
| capability added | none, but the module HAS capability | **none, and the file is a `.test.ts`** — `ABC-041` clause (b)'s subject is non-`.test.ts` files under `src/` |
| new work at runtime | one string | one `readFileSync` of the repo's own markdown, which the neighbouring row already makes |

**`ABC-066` was gated because its own page asked to be.** `ABC-065` does not, and nothing in the
trigger list (`AGENTS.md` § the Security/NFR role's triggers: auth, payments, personal data, public
API, file upload, admin action, migration, queue, external integration, perf-sensitive flow) fires on
a documentation line plus a read-only test. **If the owner disagrees, this is the paragraph to
argue with** — I would rather be told I skipped a gate than have the skip be invisible.

Note the honest asymmetry: Security/NFR's own `S1` established that clause (b) is a **state**
predicate, not a delta — but its subject is *non-`.test.ts` files under `src/`*, and this ticket
touches none.

## Merge, gated both ends

- **Tip `901c670` BEFORE:** lint 0 · typecheck 0 · **859/859 on 30 files** · build 0 · skip 0.
- **Merged `--no-ff` at `460b9f5`.**
- **`main` AFTER:** lint 0 · typecheck 0 · **859/859 on 30 files** · build 0 · skip 0 ·
  test-integrity `No findings.` · and `npm run chess -- ` now occurs **1** time in `AGENTS.md`,
  which is `A1` measured on `main` rather than on a branch.

**Two conflicts again, both pure queue substrate**, both the same class I predicted after the first
merge — and one new twist worth recording: git suggested my newly-enqueued `pending/` file *"should
perhaps be moved to `claimed/ticket-to-pr-ABC-065-guard/"* because the branch had renamed that
directory. **A rename-detection guess, not a fact.** Resolved drained-state-wins, with the QE
subtask's content rescued from its own branch first rather than accepting git's placement.

**Consequence I caused and then fixed:** resolving the conflict emptied `.grugops/queue/pending/`,
and **git does not track empty directories**, so the directory vanished from `main` — the next hop's
`mv` into it would have failed. Added a `.gitkeep` explaining exactly that. Small, and it would have
been a confusing failure three hops later.

## What QE found that the build hop did not

Eighteen mutants, 14 red. **`N14` completes the matrix**: `--depth` accepted *and* `--bogus`
documented, holding the count at 4 v 4, reds on **set equality alone** — so floor and equality are
each independently live, in both directions. And **`A4`'s long-term direction is proved**: an
accepted argument nobody documents reds with `expected 3 to be greater than or equal to 4`. That is
the failure that arrives the day `EPIC-006` adds an option, and it is now guarded.

QE also **corrected its own earlier note in public**: its `ABC-066` `Q2` quoted the code as
`slice(… + 17)`; the source reads `+ SEPARATOR_FORM.length`. The build hop caught it, QE confirmed
the build hop was right and its own quotation wrong. **The behavioural claim stood; the transcription
did not.**

## `Q8` MEDIUM — the gap I am NOT closing quietly

**An unterminated HTML comment in `AGENTS.md` silently EXTENDS the slot and ships green.** Measured:
the slot grew 9 → 16 lines, swallowing two Perft bullets, the Spike bullet, the `### Test` heading
and `- Test (all)`. It passed **by luck** — had the window reached `npx vitest run --coverage`, it
would have redded on `--coverage`. And the block's own comment claims a protection it does not have:
`end = indexOf("-->", start)` returns `-1` only if no `-->` exists later in the file, and
`AGENTS.md` has ten, so **the `end < 0` branch is dead in practice**.

**Ruling: `Q8` is a real defect in a guard that is one day old, and it gets a ticket rather than a
quiet patch.** It is not blocking — the delivered `AGENTS.md` is well-formed — and `ABC-065`'s
criteria are all MET, so it does not hold the merge. **It goes to BA/PM with `Q7`, `Q9`, `Q10`/`G8`,
`G9`+`G11`, `G12`, `S1`, `S2`, `Q3`, `Q4`.**

That is now **ten wording-and-follow-up items** routed to BA/PM across four hops. **A refinement pass
is the next thing this factory should do, and it is not mine to write.**

## The three carry-forwards QE ranked, in its order

1. `Q8` — worth a hop.
2. `Q10`/`G8` — BA/PM's pen, once.
3. `G11` + `Q6`'s miscount — to whoever next *legitimately* holds `ABC-066`'s block.
