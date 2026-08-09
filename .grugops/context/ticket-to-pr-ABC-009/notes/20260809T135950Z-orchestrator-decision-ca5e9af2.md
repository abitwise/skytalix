---
id: 20260809T135950Z-orchestrator-decision-ca5e9af2
kind: decision
by: orchestrator
at: 2026-08-09T13:59:50Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-018
  - plans/traceability.md
  - plans/board.md
  - src/moves.castling.hardening.test.ts
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# `A11` is real and unmet — `ABC-009` moves BACKWARD to `In Review`. And I was wrong about the trace.

## 1. My error first, because I asserted it and it was not true

I reported a defect in `plans/traceability.md`: rows `ABC-011` and `ABC-015` carrying **11 cells against
the header's 10**, cause given as *"an unescaped literal `|`"*. **BA/PM re-derived it and the defect does
not exist. I was wrong, and my stated cause was the exact opposite of the truth.**

Verified at the source now:

```
raw text in the ABC-011 row:  ... --reporter=json \| jq '.numPendingTests + ...
                                                    ^^ the pipe IS escaped
counting cells with escapes honoured:
  ABC-009: 10 cells (a raw split says 12)   <- two escaped pipes
  ABC-011: 10 cells (a raw split says 11)
  ABC-015: 10 cells (a raw split says 11)
  ABC-018: 10 cells (a raw split says 10)   <- no escaped pipe, hence no discrepancy
```

Every row has ten cells. My `awk -F'|'` splitter counted raw pipes and ignored `\|`. Worse, my earlier
"`ABC-009` verified at 10" was **luck of the splitter at that moment** — that row has since gained
escaped pipes and my own method would now mis-report it too. And the fix I proposed — "escape the pipe"
— was already done by the original author, who documented it on 2026-08-08 as *"TEN cells (12 raw
pipes, one escaped)"*. **Had anyone acted on my diagnosis by removing what looked like a stray
backslash, that is the one edit that would actually have corrupted those rows.**

I inherited this from QE's hand-back and passed it on without re-deriving it, which is precisely what
every subtask file on this task instructs the next role **not** to do. BA/PM calls it the third instance
on this ticket of a number believed rather than re-derived; it is the first one that is mine. **No
ticket is cut, no row is edited, and the flag I raised is withdrawn.**

The `ABC-018` frontmatter observation is **separate and still stands** — verified independently: the
board's `Done` column carries `ABC-018` as merged 2026-08-09 while
`plans/tickets/ABC-018-frame-output-and-redraw.md` still reads `status: ready-for-uat` /
`column: Ready for UAT`, against `ABC-015`'s correct `done` / `Done`. That one is a real state
disagreement, it is not `ABC-009`'s, and it needs its own item.

## 2. `A11` — verified, and the gap is a dimension, not an instance

BA/PM ruled `G-1` wider than it was routed and added `A11`, **not met**. I re-derived the blocking claim
on my own mutant before accepting a backward board move:

```
mutant: king's home square accepted as "own KING or own ROOK"
  engineer's src/moves.castling.test.ts        33/33 PASS
  QE's src/moves.castling.hardening.test.ts    19/19 PASS
  full suite                                   356/356 on 16 files PASS
  harm on 4k3/8/8/8/8/8/8/K3R2R w K - 0 1:
    one legalMoves() call → 4k3/8/8/8/8/8/8/K3K2R w K - 0 1
    THE ROOK IS DESTROYED and a king is written over it
```

So **QE's hardening rows closed the queen *instance* and not the *dimension***. My own earlier
verification of `G-1` is implicated in the same way: I built the queen mutant because QE named the
queen, watched it die to four hardening tests, and concluded the gap was closed. It was not — I tested
the example rather than the rule, which is the identical error the original ticket made when it wrote
`## Scope` over two preconditions and tested one. **Three roles have now made a version of this mistake
on this ticket, including me twice.**

BA/PM's rejection of the alternative is the right call and worth preserving: scoping `A11` down to the
piece types already covered *"performs this ticket's own defect on itself with three counter-examples in
hand"*.

The **code is correct** — BA/PM measured the delivered diff satisfying every row of `A11` over the full
space `parseFen` accepts, and `src/moves.ts` is byte-identical (`0e247853ab2c05887c76105ff83d8621` at
the engineer's first commit and at the branch tip, so no gate repaired the module to make its own
verdict green). What is owed is **~9 test rows and zero production lines**.

## 3. The board moves BACKWARD, and I am taking that move

`Ready for UAT` 1/4 → 0/4, `In Review` 0/3 → 1/3. **A ticket with an unmet acceptance criterion cannot
honestly sit in `Ready for UAT`.** `A11` is unmet, so the ticket returns to QE's column, which is where
test hardening is owned.

This is a backward move and it is neither of the two exits my role owns. I am taking it anyway because
the alternative is worse: leaving the ticket in `Ready for UAT` with a known-unmet criterion, or
closing it, would make the board assert something false. A visible backward move is the honest record.
It costs nothing but wall-clock — the code is done and correct.

`A12` (`G-2`, rights per side, with the ordering clause BA/PM added that the routed statement lacked) is
**already satisfied** by QE's existing rows, so it needs no work — only three of QE's six rows
discriminate anything, and BA/PM recorded which.

## 4. `A7`: kept, reclassified, and its stated justification retired as false

BA/PM refused both easy answers. It kept `A7` — the suite's only purity walk over legal positions, and
it was **absent rather than failing** before this ticket — and **deleted the claim** that it is *"the
guard that would have caught the defect originally."* That claim is false and always was, and the proof
was already on this board unread: the engineer's own red-before-green record shows those six rows
**green on the unfixed tree**. Inert by construction, not by accident — its population is legally
reachable positions, where the guards never fire.

That is the second criterion on this project whose protective value was assumed rather than measured;
the 100%-coverage number on `src/legal.ts` was the first, and it is named in the ticket's own
`## Problem`. The pattern is now explicit in the ticket text rather than rediscovered a third time.

Guard ordering correctly got **no criteria text and cannot have any** — permutation invariance means no
test could ever fail on a reorder, so a criterion would be unfalsifiable. Writing the 18x invalid-class
figure in as a bar was rejected. Both are right.

## 5. Scheduling

Enqueued: `ticket-to-pr-ABC-009-qe2` → QE/E2E, to close `A11` in tests. Serial at width 1, same
reason as before (one `plans/traceability.md` row). `pending/` and `claimed/` were empty at this
decision; no stale-claim sweep owed.

**Not merged and not closed, deliberately.** Merge pre-checks are green and stay green in the meantime —
fast-forward available (0 commits on `main` not on the branch, 0 merge commits, 8 ahead), full gate on
the branch tip `lint 0 / typecheck 0 / 356 of 356 / build 0 / skip 0`. The owner's standing merge
directive (`memory-bank/60-progress.md`, 2026-08-06, quoted verbatim) authorises the keystroke for work
that **passed**; `A11` unmet means this has not passed, and limit 2 of that directive — *"the gate still
binds"* — is exactly this case. UAT will be deferred to `EPIC-006` per the precedent on every ticket
this project has shipped, and that ruling is not taken here either.

BA/PM also disclosed an error against itself: its first harm probe ran four tree states in one process
and Node's module cache served pristine `moves.ts` to every round, producing a false *"the harms don't
reproduce."* The tell was identical output across trees. Recorded because the same trap will catch the
next role that measures several trees — **one process per tree.**

## What this note does NOT establish

- **That `A11` is the last gap.** BA/PM tested ten mutants of the delivered diff and found three
  survivors of one shape. Nobody has bounded the space.
- **That ~9 rows is the right number.** That is BA/PM's estimate; QE decides what the criterion needs.
- **Any measurement of mine on `NFR-001`, perft, or the deep lane.** Still none.
