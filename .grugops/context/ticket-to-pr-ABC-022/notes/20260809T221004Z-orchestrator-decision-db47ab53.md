---
id: 20260809T221004Z-orchestrator-decision-db47ab53
kind: decision
by: orchestrator
at: 2026-08-09T22:10:04Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ABC-023
  - ABC-009
  - src/moves.ts
  - src/legal.ts
  - src/legal.test.ts
  - src/moves.enpassant.test.ts
  - src/moves.castling.test.ts
supersedes: 
---

# `A11` discharged and accepted; two rulings recorded; QE routed

No board move — `ABC-022` stays in `In Review` (1/3) until QE takes that exit.

## Verified on my own instruments

```
lint 0 · typecheck 0 · build 0 · 439 passed (439) on 17 files · skip count 0
src/moves.ts  6335b452fc21ffe2d0f902ecab930840   unchanged across dev2 and dev3
```

**`A9` re-derived independently, and it holds on the stronger form.** Only one existing test file was
modified — `src/legal.test.ts` — and it carries **0 non-comment changed lines**. Better than the
filter: with comments and blank lines stripped, both edited files are **byte-identical to `main`** by
`cmp` (`src/legal.test.ts` 236 code lines, `src/legal.ts` 49). The two engineer hops changed comment
text and nothing else, mechanically demonstrated rather than asserted.

## Ruling 1 — the two sites beyond `A11`'s citation table are ACCEPTED

The `dev3` hop fixed `src/moves.enpassant.test.ts` **82-83** and **95-97** in addition to `A11`'s
tabled sites, and offered a revert if the table is read as exhaustive. **It is not, and the fixes
stand.** BA/PM wrote that table as a floor, `A11`'s binding clause is about statements this fix
falsified rather than about a list of line numbers, both sites are comment text in the file the hop
was already authorised to edit, and both said the same false thing in the same tense. Reverting them
would ship the exact sentence the site-7 ruling refused to ship, one file over. **QE may still
challenge this** — it is a judgement call and it is recorded as one, not buried.

## Ruling 2 — the castling present-tense sites are OUT of `ABC-022` and routed to `ABC-023`

`dev3` flagged `src/moves.castling.test.ts` **7-10** and **98-99** carrying the same false
present-tense shape about the **castling** branch (*"Today one `legalMoves` call DESTROYS the
occupant"*), measured false on the delivered tree. **`ABC-009` falsified those, not `ABC-022`** — a
different branch, a different ticket, and outside `A11` by construction. Flagged and not fixed was
correct.

They are **routed to `ABC-023`**, which is already the `ABC-009` follow-up and already scheduled for
a BA/PM promotion hop after `ABC-022` merges — so this costs no extra hop. It is recorded here
because a flag that lives only in a hand-back is a flag that gets lost.

The engineer's reading of the pattern is worth keeping: **a red-before-green header never re-tensed
at green**, now seen three times. That is a process observation, not a ticket, and `mode` is `lean`
so no Factory Coach is live to take it.

## `A11`'s line citations are stale and are deliberately NOT being re-pinned

Two hops of comment edits shifted every citation below them. Re-pinning after `dev2` would have been
stale after `dev3`; re-pinning now would be stale after any future comment edit. **`A11`'s quoted
sentences are the stable key and QE is instructed to match on those, not on the numbers.** The
engineer's citation map is in the ticket's `## Implementation`.

## What I have NOT established

I did not re-derive the mutation evidence — the 58/58, the 8-vs-23 disjoint split, the byte-equal
mutant hashes, or the 512-state `A5` result. Those are QE's to break, and re-running them here would
spend a hop to restate the engineer's own numbers. No perft or throughput figure at this hop is mine;
none was measured after `dev1`, and a comment-only change cannot move either.
