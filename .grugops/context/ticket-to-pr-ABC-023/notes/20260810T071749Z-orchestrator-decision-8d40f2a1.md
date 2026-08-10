---
id: 20260810T071749Z-orchestrator-decision-8d40f2a1
kind: decision
by: orchestrator
at: 2026-08-10T07:17:49Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - ABC-009
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/board.md
supersedes: 
---

# Engineer's hop verified at the source; QE enqueued. `A5` asserted only by the role that wrote the rows is the one thing this gate exists to check.

## What I re-ran rather than accepted

The engineer's report is confirmed on every load-bearing number, re-derived here and not read out of
its note:

```
md5 -q src/moves.ts                     6335b452fc21ffe2d0f902ecab930840   IDENTICAL to main
git diff main --stat -- src/            1 file changed, 375 insertions(+)   one test file
git diff -U0 main -- src/ | removed     0 lines                             ADDITIONS ONLY
npm test                                578 passed / 578 on 18 files        (559 before)
skip count                              0
ticket frontmatter                      status: in-review / column: In Review
board                                   In Development 0/3, In Review 1/3
```

**`A4` holds on the delivered tree.** Zero production lines, `src/moves.ts` byte-identical to `main`,
no other file under `src/` touched, no test row removed or modified. That is the ticket's central
premise surviving contact with the implementation, and it is the reason no defect ticket is owed.

## The test-integrity exit `2` is a standing condition on this board, not a new problem

`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` exits **2** —
"the checker could not run", because `.grugops/test-skips.md` does not exist (`ls` confirms). Per
Workflow 05 that is an error distinct from a clean fail and **is not a pass**; it is **not** the
exit-`1` human-only short-circuit. The suite's skip count is **0**, so nothing is owed a
justification, and **no registry file was created** — an agent may not self-author a justification to
clear its own gate. `ABC-018` recorded this as the fifth ticket to hit it; this is at least the sixth.
The engineer handled it exactly right and I am not treating a repeat of a known, recorded condition as
a finding.

## I am correcting my own pull decision, because I wrote it ambiguously

The pull note said Security/NFR would be enqueued *"if the delivered diff touches `src/` at all"* and
in the next sentence that the trigger has not fired *"if it is additions-only to one test file"*.
**In this repo tests live under `src/`, so those two clauses contradict each other** and the delivered
diff satisfies both readings. That is a defect in my own written commitment, not a detail — a
condition that can be read either way is a condition that will be read the convenient way. Naming it
rather than quietly picking.

Resolved on substance, not on the sentence: **zero production lines** means no changed code path, no
allocation, no branch in any inner loop, and `src/moves.ts` byte-identical to `main`. Every bar in
`plans/nfr-catalog.md` is a production-code bar, and none of the trigger list (authentication,
payments, personal data, public API, file upload, admin action, DB migration, queue/event, external
integration, performance-sensitive flow) is touched.

**The decision is still deferred, not taken.** QE may add or change rows, and the Security/NFR call
belongs on the *final* delivered diff, not this one. If QE's hop leaves the production tree
byte-identical, the trigger genuinely has not fired and the board will record that with its reason
rather than an empty column.

## Why QE matters more than usual on this ticket

The engineer declared three limitations itself. Two are structural and one is the whole reason a
second pair of eyes exists:

1. **`A5` is asserted by the instrument of the role that wrote the rows.** That is precisely the shape
   `ABC-009`'s `A7` had before it was retired as false — a criterion whose evidence came only from the
   party it graded. The engineer says so plainly, which is the right call, and it makes QE's
   independent re-run the actual verification rather than a formality.
2. **A pair mutant conditional on both axes at once survives `A1`'s four rows.** Declared, and
   apparently within `A1`'s stated bound (the 169-combination enumeration is the named `L` trap). QE
   should confirm that reading rather than inherit it — "it is out of scope" and "the criterion is
   short" look identical from the inside.
3. **One of the nine `A3` rows was already dead pre-rows** — `rook's square admits own BISHOP only
   QUEENSIDE`, killed at 558/559 by an existing `ABC-009` row. So **8 of 9**, not 9 of 9, are proved
   individually necessary. Reported as measured rather than as hoped, which is the standard this
   board wants; QE decides whether that is a fine or a criterion shortfall.

The precedent is unambiguous and one-directional: on each of the last four tickets QE found builds
that passed **every** criterion and the **whole** suite. Every one was a gap in the criteria, never a
defect in the code. Expect that again, and the repair is to add rows — **never to amend a criterion so
a survivor stops counting**.

## Board and routing

No board move by this note; `ABC-023` sits in `In Review` (1/3) and QE owns that exit. One subtask
enqueued: `ticket-to-pr-ABC-023-qe` → QE/E2E. Width **1**, by dependency.
