---
task: ticket-to-pr-ABC-022
subtask: engineer-abc022-a11-apply
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-022/
enqueued_by: orchestrator
enqueued_at: 2026-08-09T21:22:43Z
branch: grugops/ticket-to-pr-ABC-022
---

# Subtask: apply the widened `A11` — comment-only, five sites, zero executable change

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.**
Twenty-two notes. This is the **second engineer hop** on `ABC-022`; your first one implemented the
fix and is already `In Review`. BA/PM's five notes from the `A11` sweep carry the sites, the
measurements and the reasoning — read the amended `A11` in the ticket as it now stands.

`ABC-022` is in `In Review` (1/3) and **stays there** — this hop takes **no board move**.

## What this hop is

Your last hop flagged `src/legal.ts:69-70` rather than fixing it, which was the right call. BA/PM then
swept and found it was **not alone**: five sites in total, all resting on **one** premise — *the
generator is unsound outside the domain* — which your fix removed. `A11` has been widened to cover
them. Apply it.

**This is a comment-only hop. Not one executable line changes, in any file.** `src/moves.ts` must
still hash `6335b452fc21ffe2d0f902ecab930840` when you are done.

## Three things BA/PM settled that you must not re-litigate

1. **The guards stay.** `hasLegalEnPassant`'s guard (a) is load-bearing and `ADR-0005` is not
   reopened. Nothing about the predicate's behaviour changes.
2. **The corrected text must not swing to the opposite error.** BA/PM measured this across 131,072
   exhaustive states and the conclusion **inverted** the expected one: guard (a) went from being a
   *source* of disagreement with the oracle to being the *reason* the two now agree. So the comment
   must delete the false premise and keep "SPECIFIED rather than derived" — its reason is now that
   the predicate never consults the generator at all. **Do not write "the oracle is sound now, so we
   agree with it."** The agreement is bought by guard (a), not inherited.
3. **Four nearby statements are still TRUE and are fenced against rewrite** — BA/PM names them
   explicitly, including the `src/legal.ts` 104-105 trap your first hop already navigated correctly,
   and rows carrying *enemy* occupants that the ordinary-capture branch still consumes. **Read the
   fence list before you touch anything.**

## The `A9` instrument changes shape, and this is the one thing to get right

Three of the five sites are in `src/legal.test.ts` — an **existing** test file. `A9` requires that no
existing test is modified, *"verified at line level, not by inspection"*, and your first hop verified
it with a **file-level** filter (`git diff --name-only --diff-filter=M`). That filter will now go
non-empty, and **that is a collision with the instrument, not a breach of the criterion.**

Replace it with the **line-level comment filter** — the same shape you already used on
`src/legal.ts` — and demonstrate it: every changed line in `src/legal.test.ts` begins with a comment
marker, and the file is **31/31 green unmodified** before and after. If any changed line is
executable, you have exceeded this hop.

## Boundaries

- **Comment text only**, in `src/legal.ts` and `src/legal.test.ts`. No other file under `src/`.
- **Do not touch `src/moves.ts` or `src/moves.enpassant.test.ts`** — both are settled from hop one.
- **Do not edit `## Acceptance`.** `A11` is BA/PM's and it is already written. You implement it; you
  do not adjust it. If you believe it specifies something wrong or impossible, **say so and stop**.
- **`A1`–`A10` are settled.** Do not re-derive them and do not re-measure `NFR-001` — a comment-only
  change cannot move throughput, and saying so structurally is the correct move.
- **Do not edit `ADR-0005`, `ABC-011`, `ABC-023`, `plans/nfr-catalog.md`** or anything BA/PM fenced
  and named as another role's. `ABC-023`'s stale `A4` hash is deferred by design — leave it.
- **No board move**, and **do not enqueue QE.** The Orchestrator routes QE after this.

## Gate before you hand back

Full suite green with **skip count 0** (`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`),
lint / typecheck / build exit 0. Current branch tip baseline: **439/439 on 17 files, skip 0**.
`PERFT_DEEP=1` is **not** required of a comment-only hop — say that structurally rather than burning
36 s to restate hop one's result, and do not report a perft number you did not measure.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible** — no §14 gate here, `context.human_admission` is `off`. Nothing
self-stamped, no `index.*` faked.

Claim by hand: `scripts/claim.js` does not exist in this install — re-check at the source. Take your
own `at` from `date -u`; **this machine is UTC+3**. Update your own row in `plans/traceability.md`.
Commit on the branch above; **never commit directly on `main`**. Never merge, never deploy.
