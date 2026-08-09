---
id: 20260809T161049Z-orchestrator-decision-2114e4a2
kind: decision
by: orchestrator
at: 2026-08-09T16:10:49Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# `A13` discharged. One verification hop left — and it cuts the follow-up ticket. Then close.

QE's third hop: **8 rows, 10 new tests, zero production lines**, 24 mutants, 7 killed, 17 survived, 0
verdict mismatches, 0 broken builds, 0 harness errors. `A13` is discharged in tests.

## Verified at the source, with the lesson applied

I printed the guard I actually installed on each mutant rather than only its pass/fail — the fix for my
four errors this task. All four verdicts match QE's table exactly:

```
enemy KNIGHT on king's square   2 failed / 379 passed   KILLED   as reported
enemy PAWN   on king's square   2 failed / 379 passed   KILLED   as reported
enemy KNIGHT on rook's square   2 failed / 379 passed   KILLED   as reported
enemy QUEEN  on king's square   381 passed (381)        SURVIVED as reported — correctly, it is equivalent
```

Structural: `src/moves.ts` md5 `0e247853ab2c05887c76105ff83d8621` — **unchanged across six hops**;
`git diff 8f540cf -- src/moves.ts` empty; **14 pre-existing test files checked individually, 0 modified**;
suite **381/381 on 16 files**, skip count **0**.

**0 of 8 row counts disagreed with BA/PM** — a second independent derivation of `14`, `17`, `19` and the
rook-square doubling, and QE says plainly that since no discrepancy arose, none was raised and nothing was
adjusted. It also re-measured the 13-byte domain on **all six** home squares where BA/PM did three, and —
this is the part worth keeping — **designed the 11-vs-13 trap out** rather than avoiding it by care: its
probe varies the king parking per attempt and prints the FEN for the two `KING` bytes. That trap caught
BA/PM and then caught me; QE made it structurally impossible instead of remembering not to fall in.

Its rows are falsified rather than trusted, with three deliberate corruptions each going red **naming the
input**: a `KNIGHT` label carrying a bishop at coinciding count 13, an `ENEMY` label carrying the mover's
own knight at coinciding count 16 (only the colour half sees it), and a row made inert by an own bishop on
f1.

## The residual, and why it does not reopen anything

A **side**-conditional single-type admission survives (enemy `KNIGHT` only queenside, enemy `PAWN` only
kingside), because at `A11`'s established doubling each type's two configurations vary **colour**, not
**side**. QE did the one thing that settles whether this is new: it tested `A11`'s own rows for the same
class and found **own `ROOK`-only-queenside and own `BISHOP`-only-queenside both survive 381/381**. So the
residual is **inherited from the doubling standard, not introduced by this hop** — both criteria satisfy
their own clauses, and closing it widens both tables.

**It goes to the follow-up ticket, not another `ABC-009` hop.** That is the stopping rule operating as
written rather than being argued about, which is what it was written down for.

## Ruling on `A13`'s marker: one verification hop, and it is not a hardening pass

QE left `A13`'s `⚠️ NOT YET SATISFIED` marker byte-identical and put the call to me. Its reasoning is the
same one I accepted for `A11` and it is still right: `## Acceptance` is BA/PM's, and the failure these hops
repair is *a role certifying its own rows*. Closing with the marker live would ship a contradiction.

**Ruling: one BA/PM verification hop.** The stopping rule said the QE hop was the last **hardening** pass;
a verification-and-bookkeeping hop is not a hardening pass, so this does not breach it. The `A11`
precedent also argues for it on evidence rather than symmetry — that verification is exactly what found the
fourth class, and it cost one hop to avoid shipping a false green.

**And the rule binds the hop:** if that verification finds anything new, it is **named and routed to the
follow-up ticket**, not fixed inside `ABC-009`. No sixth hardening pass, whatever it finds.

That hop also **cuts the follow-up hardening ticket**, which has now accumulated three measured items and
should exist before this ticket closes rather than living only in notes:

1. **The joint 13×13 occupant-byte pair space** — inert for the delivered code, because
   `src/moves.ts:326-327` are two independent byte compares.
2. **The constants no criterion varies** — the four `CastleOption` rows (`kingFrom`, `rookFrom`, `kingTo`,
   `empty`, `kingPath`).
3. **The side-conditional doubling gap** — the residual above, affecting both `A11`'s and `A13`'s tables,
   measured present on `A11`'s own rows.

## What happens after it, and nothing before

1. **UAT ruling** — deferred → `EPIC-006`, **explicitly NOT passed**, the phrasing `ABC-015` and `ABC-018`
   both used. Grounds re-checked at the source: no CLI entry point, so no surface a human can exercise.
2. **Merge** under the owner's standing directive of 2026-08-06 (quoted verbatim in
   `memory-bank/60-progress.md`) — fast-forward, gates on the branch tip **before** and on `main`
   **after**, both recorded. Its three limits hold: deploy not included, the gate still binds, the
   authority stays the owner's.
3. **Close to `Done`, including the ticket frontmatter.** `ABC-018`'s close moved the board and the trace
   but left its ticket reading `status: ready-for-uat`, and BA/PM's trigger for that defect fires on
   **this** close. I will not be the second close to miss it.

## What this note does NOT establish

- **That `A13` is met.** I verified four of QE's 24 mutants and the structural claims. The independent
  verdict is BA/PM's next hop, which is the whole point of routing it there.
- **That the criteria set is complete.** Two regions are reserved for the follow-up ticket and one
  residual is measured and routed. QE's own progression note stands.
- **Any `NFR-001`, perft or deep-lane figure of mine.** None, across the entire task. 32/32 has now been
  read independently by the engineer, QE twice, and Security/NFR — and by me zero times.
