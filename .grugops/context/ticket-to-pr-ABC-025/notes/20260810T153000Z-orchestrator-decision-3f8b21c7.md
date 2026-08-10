---
id: 20260810T153000Z-orchestrator-decision-3f8b21c7
kind: decision
by: orchestrator
at: 2026-08-10T15:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-013
  - RISK-ABC013-04
  - src/san.ts
  - plans/board.md
supersedes: 
---

# Definition-of-Ready gate: `ABC-025` PASSES 10/10 — pulled `Ready` → `In Development`. My own prescription was wrong and BA/PM measured it wrong

## The gate, run rather than accepted

BA/PM reported 10 of 10. I re-ran the checklist against the file, and I sampled the material rather
than the summary — the standing lesson on this board is *believing an instrument without checking the
instrument*, and BA/PM's instrument here is a scratchpad harness nobody else has seen.

**16 of `ABC-025`'s 63 expected strings, re-typed by me from each FEN's geometry BEFORE running
anything**, then rendered by the merged `src/san.ts`:

```
rows checked            16   (25% of the table; every piece type, both colours,
                              quiet + capture, all three rungs, castle/ep/promo/check/mate/stalemate)
mismatches               0
call-form differences    0   (toSan(pos, m, legal) === toSan(pos, m))
purity failures          0   (toFen byte-identical across every call)
```

Sampled by hand: `N3d4` / `Nb5d4` / `Nfd4` (the knight ladder in one FEN), `R1d4` / `Rad4`,
`Be3d4`, `Qh4e1`, `N6xd5`, `Raxd5`, black `O-O`, `Rf8` (the a8 rook blocked by its own king — the
row that makes the position work), `exd3` e.p., `exd1=Q+`, `Ra1#`, and the stalemate pair
`Qg3` / `Qg2+`. Harness held in `/tmp`, importing `src/` by absolute path; **nothing in the
repository was written**.

**Two errors on this check were mine**, both caught by the harness failing loudly rather than by my
reading it: I guessed the square encoding (the board is 0x88, `rank*16+file`) and my promotion
selector matched four moves where the ticket's own rule — select by the `(from, to, promotion)`
triple — matches one. Recorded because a gate that only reports the errors it finds in others is not
a gate.

## Checklist, line by line

| check | verdict |
|---|---|
| problem clear (user, pain, value) | PASS — the user is `EPIC-003`'s `parseSan` hop and `ABC-016`/`ABC-017`, not a hypothetical |
| scope and out-of-scope clear | PASS — three observable requirements, eight fences each with an owner |
| INVEST-shaped | PASS — independent (every working column empty, no ticket touches `src/san.ts`) |
| acceptance testable and measurable | PASS — six criteria, each naming the mutants that must die AND the controls that must live |
| dependencies known | PASS — none open, plus the one-way staleness rule |
| security/NFR triggers with measurable targets | PASS — `N5` a ratio (≤5% of the default lane), security firing at +900 lines or any non-test file |
| test notes present | PASS — nine, four of them lessons this board already paid for |
| size assigned | PASS — `M` (3). **Not XL: no `SPLIT_REQUIRED`** |
| priority assigned | PASS — `P2`, two triggers, both checked at source, both not fired |
| no major unresolved blocker | PASS |

The two caveats BA/PM carried in the open — `A2` cannot be witnessed by a wrong build, and `A5` is
corroboration rather than a mutant-killer — are **why this passes rather than a deduction from it**.
A criterion that says what it cannot prove is worth more than one that quietly overstates.

## The correction that matters: my prescription was wrong, and it was wrong in the dangerous direction

`ABC-013`'s close, written by me, said `ABC-025` should *"close the five criteria gaps with the
minimality property, which closes all five plus three more."*

**Measured, that is false.** Over the corpus `src/san.test.ts` already has, the minimality property
kills **three** of six, not five: `Q34` (bishops) and `Q38` (black on the rank rung) survive it,
because that corpus fills **5 of the 44 reachable cells** and a two-ply expansion of the same FENs
buys four more and nothing else. And of the "three more", the property does not touch `Q13` at all —
a castle-side bug is not a qualifier bug.

A ticket written to my prescription **would have shipped, read as closing five, and closed three.**
That is the exact failure shape this board polices: a green net that is believed to cover more than
it does. It was caught because BA/PM re-derived instead of inheriting, which is the instruction the
opening note gave and the reason the cut hop exists at all.

BA/PM also found a **sixth** wrong build (`x` dropped for a black piece capture) that passes the
suite, injectivity **and** the property on both corpora. Five was a floor, not a count — the honest
prior after `ABC-023` (QE found fourteen where the ticket predicted two) is that more exist.

Two further corrections to me, both accepted: Security/NFR is **not** trigger-free on this ticket (it
carries `N5`, its own cost to the 1.44 s default lane), and `RISK-ABC013-04`'s trigger is one
refinement pass away rather than distant, since `ABC-016`/`ABC-017` became fully unblocked when
`ABC-013` merged today.

## Board move and WIP

`Ready` → `In Development`. `In Analysis` and `In Design` are **skipped, with the reason recorded**:
the ticket is test-only over a merged module, its flows are the SAN grammar `ADR-0004` already fixed,
and it proposes no structure — the same route `ABC-023` and `ABC-024` took. Skipping a column is a
decision, not an omission, and it is written down here so it can be disagreed with.

```
Ready              1/8 → 0/8
In Development     0/3 → 1/3
```

No WIP limit is approached. Width stays **1** — the chain is sequential and the QE and Security/NFR
hops have no inputs until the rows exist.

## Scoping instruction for the dev hop, stated as a limit on ME

**No file-count bar, no row-count bar, no line-count bar.** `ABC-013`'s five gaps are open because I
capped that ticket's QE diff at three files. The engineer writes what `A1`–`A6` require; where the
rows live is their call, subject only to `## Test notes` note 1, which is a criteria-conflict rule
(widening `POSITIONS` silently redefines `ABC-013`'s `A18`/`A19`) and not a preference of mine.

`A6` is the one hard bar and it is the ticket's own: `src/san.ts` must still hash
`cbcc3be37c21414d16e8e6b4d0c68959`, additions only, no existing test row modified. **If a row proves
the delivered code wrong, `A6` fails by design — say so out loud and cut the defect as its own
ticket. Do not fold a production fix into a hardening ticket.**
