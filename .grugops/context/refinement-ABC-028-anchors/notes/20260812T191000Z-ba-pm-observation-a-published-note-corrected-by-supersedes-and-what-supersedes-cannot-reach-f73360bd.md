---
id: 20260812T191000Z-ba-pm-observation-a-published-note-corrected-by-supersedes-and-what-supersedes-cannot-reach-f73360bd
kind: observation
by: ba-pm
at: 2026-08-12T19:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A1
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - .grugops/context/ticket-to-pr-ABC-028-a5/notes/20260812T134500Z-software-engineer-observation-red-before-green-the-kill-matrix-either-side-of-a5-5531ce74.md
  - agent-factory/contracts/context-note.md
  - agent-factory/workflows/16-context-read-write.md
supersedes: 20260812T134500Z-software-engineer-observation-red-before-green-the-kill-matrix-either-side-of-a5-5531ce74
---

# The false claim in a published note, corrected by `supersedes:` — and the honest statement of what `supersedes:` cannot reach

## The sentence

`.grugops/context/ticket-to-pr-ABC-028-a5/notes/…-red-before-green-the-kill-matrix-either-side-of-a5-…md`,
last paragraph:

> *"A cache keyed on the last **three** identities still has no owned guard, and rebuilding the nfr
> fixtures per test would still lose nothing for it, because it was never caught there either."*

**The first clause is TRUE and I confirm it** — `src/history-pane.test.ts` alone passes `26 / 26` on
that build. **The rest is FALSE, measured twice, by two roles, on two independent harnesses:**

```
WCACHE-LAST3, full suite, nfr fixtures SHARED      2 failed / 752   <- the A11 toSan counts, and nothing else
WCACHE-LAST3, nfr fixtures REBUILT PER TEST        752 PASSED       <- the guard is GONE
```

**It WAS caught there, by exactly the mechanism the whole ticket is about.** The `A11` count assertions
do not care how deep a cache's key is: they re-render the module-scope `AT_*` singletons unchanged, so
*any* memoising pane HITs, calls `toSan` zero times, and reads `0` where `16` is expected. **Depth of
key is irrelevant to a repeat render of the identical object** — which is why the sharing catches every
rung of the axis and the owned guards catch three.

## The ruling on `supersedes:` — I used it, and here is exactly what it does and does not buy

**USED.** This note's `supersedes:` names that note's id. The note contract (`SCTX-01`) makes this the
sanctioned mechanism: *"Correcting or replacing an earlier note is done by writing a new note whose
`supersedes` field names the earlier note's id — the earlier file stays in `notes/` as part of the
permanent audit trail."* **The earlier note is not edited, not annotated and not deleted.** That is the
whole reason the field exists and the reason a `finding`-free correction can still be load-bearing.

**AND THE LIMIT, STATED RATHER THAN LEFT FOR A READER TO DISCOVER.** The contract's storage model is
**per-task** — *"Notes live under a per-task folder `.grugops/context/<task>/`"* — and replay folds out
*"any note named in a **later note's** `supersedes`"* within what was read. **The false note is in
`ticket-to-pr-ABC-028-a5/`; this note is in `refinement-ABC-028-anchors/`.** A reader who renders only
the `a5` hop's folder — which is exactly the reader the Orchestrator is worried about — **will not see
this note and will not see the fold.** Whether any renderer crosses task folders is
**`UNKNOWN - verify`: `scripts/context-io.ts` does not exist in this repository, so no behaviour can be
observed, only the contract read.**

**So `supersedes:` alone would have been false comfort, and the correction is placed where a reader
actually lands as well:**

1. **the ticket page** — `RISK-ABC028-02`'s closure ledger and `A5`'s discharge block, both carrying
   the measurement;
2. **the file comment itself** at `src/history-pane.nfr.test.ts:113-123`, which already says *"THE
   SHARING HERE IS STILL LOAD-BEARING"* — the durable artifact, in the file the hazard lives in;
3. **the `ABC-028` traceability row**;
4. this note.

**A supersession that only a renderer can see is not a correction; it is a bet on a tool.**

## What I carried forward, because a fold that discards true work is a worse outcome than the error

If a renderer ever does honour this supersession, folding that note out would remove **three correct
tables** with the one wrong aside. **Its author's own verdict was right: one aside is wrong, the hop's
work is not.** So the true content is restated here and is re-measured, not copied:

```
config (a) — src/history-pane.test.ts ALONE, nfr NOT loaded
build          BEFORE A5        AFTER A5              re-measured here
WCACHE-LEN     1 failed / 24    3 failed / 26         3 failed / 26   A1, A5 r1, A5 r2
WCACHE-LAST    24 passed        2 failed / 26         2 failed / 26   A5 r1, A5 r2
WCACHE-LAST2   24 passed        1 failed / 26         1 failed / 26   A5 r2 ONLY

full suite, 26 files, AFTER A5
delivered 752 passed · WCACHE-LEN 5 failed/752 · WCACHE-LAST 4 failed/752 · WCACHE-LAST2 3 failed/752
```

**Every cell reproduces.** `A5`'s lane clause is met as written, `A1` still kills `WCACHE-LEN` and was
not disturbed, and the delivered pane is green on both rows. **The only thing that changes is the last
paragraph.**

## Why this is worth a note rather than a shrug

It is the **fifth** occurrence of `## Test notes` 1's pattern on this family and the **first inside an
Engineer's own context note** — the shared context is this factory's memory, so a future reader hitting
that note first is misled about the one fact the ticket exists to protect. **It was found by the next
hop rather than by the gate, and it was found by re-running the cell instead of reading it.** The
counting matters: the sixth occurrence is now the one to watch for, and `RISK-ABC028-02`'s ledger names
the sentence shapes it will arrive in.

**I did not edit, annotate or delete the other hop's note**, and its author's conclusion for that hop —
`A5`'s table closes `WCACHE-LEN`, `WCACHE-LAST` and `WCACHE-LAST2`, and the row is the unit of
extension — **is unaffected and was independently re-measured green here.**
