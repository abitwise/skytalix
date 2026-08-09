---
id: 20260809T143916Z-orchestrator-decision-3634c6ad
kind: decision
by: orchestrator
at: 2026-08-09T14:39:16Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/board.md
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# `A11` is met on measurement. One stale marker left, and it is BA/PM's to clear — not mine.

QE's second hop closed `A11` as a **dimension**: 20 mutants, **11 killed, 9 survived, 0 verdict
mismatches, 0 broken builds**, suite 371/371 on 16 files, deep lane 32/32 in 36.04 s, **zero production
lines**. `In Review` 1/3 → 0/3, `Ready for UAT` 0/4 → 1/4. Accepted, on checks I ran.

## Verified at the source, including a third error of my own

The load-bearing claim is that the three mutants which previously passed the **entire** net now die.
Rebuilt each myself, one process per tree:

```
king's square admits own KING or own ROOK    hardening 2 failed / 32 passed   ← WAS OPEN, now dies
king's square admits own KING or own PAWN    hardening 2 failed / 32 passed   ← WAS OPEN, now dies
rook's square admits own ROOK or own PAWN    hardening 2 failed / 32 passed   ← WAS OPEN, now dies
control: colour-blind (behaviour-equivalent)  full suite 371/371 SURVIVES     ← correct, must not die
```

Structural claims all hold: `src/moves.ts` md5 `0e247853ab2c05887c76105ff83d8621`, unchanged since the
engineer's first commit; `git diff 8f540cf -- src/moves.ts` empty; **0 of 14** pre-existing test files
modified, each diffed individually rather than inspected; `main` still `aad6d48`; suite 371/371
re-run by me.

**My third error this task, caught before I reported it but recorded anyway.** My first attempt at the
colour-blind control used `pieceTypeOf`, which does not exist — the real export is `pieceType`. That
produced a module that does not compile and **147 failing tests**, which I very nearly read as "the
equivalent mutant dies, so QE's rows over-fit." It was a broken build, the exact failure class QE
reports **zero** of. Rebuilt with the real symbol, it survives 371/371 as QE said. The lesson is the one
this whole ticket keeps teaching: **a red result from an instrument you did not verify is not a
finding.** Three errors of mine now on this task — the queen-instance conclusion, the traceability
miscount, and this — and all three were the same shape: trusting a signal without checking the
instrument that produced it.

## What QE did beyond what was asked, and why it matters

Two things I did not specify and both are better than what I would have specified:

- **One test asserts the quantifier itself**, with the piece-type universe **derived by probing
  `parseFen`** rather than restated as a second hand-written list. Delete a row or add a seventh
  parseable type and it goes red. That is the structural answer to "a row set can repeat the sampling
  error one level up" — the criterion can no longer drift from the space it quantifies over.
- **Every row asserts its own experiment before its outcome** (`expectImpostorSetup`). This earned
  itself immediately: a row labelled `PAWN` whose FEN actually carried a `BISHOP` **at a coinciding
  move count of 19** — so every outcome assertion passed — went red on *"the impostor must stand on the
  square under test."* Without that guard the table would have silently claimed `PAWN` while testing
  `BISHOP` twice, which is the sampling error again, one level down. **A test table that does not
  verify its own fixtures is a table that can lie about what it covers.**

Each piece type appears in **at least two (colour, side) configurations**, and the doubling is proved
load-bearing rather than assumed: a black-only pawn admission dies to **exactly one row** — the
black-queenside one — and **survives** BA/PM's white-kingside row alone.

QE also disclosed that its own harness bug produced **nine `HARNESS-ERROR`s rather than nine false
survivors**, and said plainly that a refusal path is only worth building if you report when it fires.
That is the same discipline as the engineer refusing to shift its clock.

## The one thing left, and I am not doing it myself

`A11`'s `⚠️ NOT YET SATISFIED BY THE SUITE` marker (ticket lines 250 and 367) and the `## Acceptance`
preamble line are **stale**. QE left them **byte-identical on purpose** and routed them to BA/PM as its
risk 1, on this reasoning: *the failure this hop repairs is a role certifying its own sample as a
dimension, so the role that wrote the rows does not also stamp the criterion satisfied.* That is
correct, and it is the same seam QE and Security/NFR both honoured earlier by leaving `## Acceptance`
untouched.

**It is also not mine to clear**, and that limit is one I wrote myself into the first BA/PM subtask
file: *"You are the ONLY role that edits it."* I am not going to breach my own seam because the edit is
small — and I have three errors on this task arguing that my unchecked judgement is exactly what should
not be the last word on whether a criterion is satisfied. An independent verification before the marker
clears is worth more here than the two lines cost, on a ticket where three roles in a row mis-certified
a sample as a dimension.

Enqueued: `ticket-to-pr-ABC-009-bapm3` → BA/PM, tightly scoped: verify `A11` independently, then clear
the stale markers. Serial at width 1. `pending/` and `claimed/` empty at this decision; no stale-claim
sweep owed.

## After that, and not before

1. **UAT ruling** — deferred to `EPIC-006`, per the precedent recorded in `memory-bank/60-progress.md`
   and on every ticket this project has shipped: no CLI entry point, so no surface a human can
   exercise. Written as **deferred and explicitly NOT passed**, the phrasing `ABC-015` and `ABC-018`
   both used.
2. **Merge**, under the owner's standing directive of 2026-08-06 — gates on the branch tip before and
   on `main` after, both recorded, fast-forward only.
3. **Close to `Done`**, and update the ticket frontmatter — the step `ABC-018`'s close missed, which is
   why its board row says `Done` while its own frontmatter still says `ready-for-uat`. That defect is
   still open, still separate, and still needs its own item.

**Nothing merged, nothing deployed.** Merge pre-checks remain green: fast-forward available, 0 merge
commits, branch-tip gate `lint 0 / typecheck 0 / 371 of 371 / build 0 / skip 0`.

## What this note does NOT establish

- **That the criteria set is complete.** QE says expect a fourth class and gives the progression:
  engineer 5 mutants → QE 62 → BA/PM 10 → QE 20, each finding what its predecessor missed. It also
  notes the nine equivalence arguments were **not re-enumerated** — *"still survives my suite"* is
  weaker than *"is equivalent"*, and I did not strengthen it either. I re-derived **one** of the nine.
- **Any `NFR-001`, perft or deep-lane measurement of mine.** Still none, on any hop. 32/32 has now been
  read by three roles independently and by me zero times.
