---
id: 20260809T124839Z-orchestrator-decision-ffe8bb73
kind: decision
by: orchestrator
at: 2026-08-09T12:48:39Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - NFR-001
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/board.md
  - plans/traceability.md
  - agent-factory/workflows/04-ticket-to-pr.md
supersedes: 
---

# QE's pass-with-risks accepted. Security/NFR next, serial. One trace defect flagged, not fixed.

QE ran **62 mutants, 47 killed, 15 survived**, and reported that **five survive the entire net
`A1`–`A10` including the deep lane**. Verdict `PASS WITH RISKS` → `In Security/NFR`. I accept it, and
the acceptance rests on checks I ran rather than on the hand-back.

## The two sharpest claims, re-derived on my own mutants

QE's central assertion is that the *criteria* were incomplete while the *code* is correct. Both halves
verified independently, by building QE's two named mutants myself and running the two test files
separately — which is the check that distinguishes "QE found a real gap" from "QE wrote tests around
its own mutants":

**`G-2` (`continue → break` on the rook guard).** Applied to a scratch copy:

```
engineer's src/moves.castling.test.ts (33 tests)   → 33 passed   ← the gap was real
QE's src/moves.castling.hardening.test.ts (19)     → 3 FAILED    ← the gap is now closed
```

**`G-1` (read the king's home square as "the mover's KING or QUEEN").** Same treatment:

```
engineer's 33 tests                → 33 passed   ← the gap was real
QE's 19 hardening tests            → 4 FAILED    ← the gap is now closed
live harm on the mutant tree, 4k3/8/8/8/8/8/8/K3Q2R w K - 0 1:
  one legalMoves() call → 4k3/8/8/8/8/8/8/K3K2R w K - 0 1   the QUEEN IS DESTROYED, king written over
  the DELIVERED code on the same FEN → byte-identical (pure)
```

So `G-1` is not a theoretical hole: a plausible mis-implementation destroys a queen silently, and
nothing in the twelve criteria or the engineer's 33 tests would have said a word. QE's claim that its
rows pin **behaviour and not implementation shape** is corroborated by the other direction too — it
reports the nine behaviour-equivalent mutants still surviving after its rows were added, which is the
right result and the one a test written around a mutant would not produce.

**The code is correct and QE changed none of it**, verified: `git diff 8f540cf -- src/moves.ts` is
empty. It closed the gaps in **tests only**, and it respected its own boundary — `## Acceptance` in the
ticket is **byte-identical** across QE's commit (`f1365acff747ef1482672aea4f4be06d` before and after),
so the criteria text was routed to BA/PM rather than self-edited. That is the correct seam and it was
honoured rather than asserted.

**Gates re-run by me:** `npm test` **356 passed (356) on 16 files**, skip count **0**. `main` still
`aad6d48`. Board: `In Review` 1/3 → 0/3, `In Security/NFR` 0/2 → 1/2. Queue clean, `pending/` and
`claimed/` empty. Nothing merged, nothing deployed.

QE's own self-correction is worth recording: its first probe poked bytes directly and produced boards
with no white king, which `parseFen` rejects, so those divergences were **out of scope** under
`## Scope`'s "every position it accepts". It reported that against itself instead of counting the
divergences.

## The `A7` finding is the one I want carried forward loudest

**`A7` killed nothing across all 62 mutants.** It is the perft-table purity guard — the criterion the
original ticket called *"the guard that would have caught the defect originally"*. Measured, it is
inert against every mutation of this fix, and the four legal-castle control rows are what actually
carry the load. That is not an argument to delete it; it is an argument that this project has now twice
shipped a criterion whose protective value was assumed rather than measured (the 100%-coverage number
on `src/legal.ts` was the first). It goes to BA/PM as criteria text.

## Scheduling: serial, and the reason is specific

Security/NFR and the BA/PM criteria-text hop are genuinely independent in subject — one reviews the
change, the other edits `## Acceptance` — so `queue.wip_limit` 3 would permit them side by side. **I am
running them serially anyway, at width 1.** Both must update the **same row** of
`plans/traceability.md` (`ABC-009`), and a same-row concurrent edit is a real conflict, not a
theoretical one. Speed is not worth a corrupted audit row on the ticket whose whole subject is a
silently-wrong answer.

Order: **Security/NFR first**, because it owns the `In Security/NFR` exit the ticket is now sitting in
and it is the gate that decides whether the ticket advances at all. BA/PM's criteria-text hop follows,
before the ticket leaves for UAT/release, so the acceptance set does not ship known-incomplete.

Enqueued: `ticket-to-pr-ABC-009-sec` → Security/NFR. Substrate ruling unchanged: hand claim,
hand-written notes, **`finding` inadmissible**, nothing self-stamped, no `index.*` faked. QE recorded
those two hand-done deviations honestly again; they are the standing ruling, not new drift.

## A trace defect I am flagging and NOT fixing

QE flagged it and it is confirmed at the source. Rows **`ABC-011`** and **`ABC-015`** of
`plans/traceability.md` carry **11 cells against the header's 10**; every other row including `ABC-009`
carries 10. Cause, which QE did not name and I checked: an **unescaped literal `|`** inside prose — the
skip-count command is quoted as `... --reporter=json | jq '.numPendingTests + .numTodoTests'` and that
pipe splits the markdown cell. Consequence: on those two rows every column after `Tests` is shifted, so
`UAT`, `Release` and `Status` render one cell to the right of their headers.

**Not fixed here, deliberately.** Those are two other tickets' audit rows, both already `Done`/`Ready
for UAT`, and rewriting them mid-flight on `ABC-009`'s branch is exactly the unrelated edit the coding
rules forbid (rule 9, preserve adjacent; rule 12, flag rather than delete). It is also not
`ABC-009`'s scope. It needs its own small item — the fix is escaping the pipe as `\|` or wrapping the
command in backticks that the renderer respects — and the same defect will recur every time a role
quotes that command into a table cell, so the durable fix is a note in `AGENTS.md`'s test-integrity
entry rather than two row edits.

## What this note does NOT establish

- **No `NFR-001` measurement of mine.** I have still run no benchmark on this ticket. QE deliberately
  did not re-measure either. The only figures on record are the engineer's, with its own ±1% per-cell
  floor caveat; Security/NFR re-derives on its own tooling.
- **That the net is complete now.** QE closed five survivors and left nine equivalent ones standing on
  purpose. Whether `G-1`/`G-2` deserve criteria text is BA/PM's ruling, not mine, and QE explicitly did
  not make it.
- **That the deep lane passes on my tree.** I did not run `PERFT_DEEP=1`. 32/32 in 38.35 s is QE's
  figure and 32/32 in 36.93 s is the engineer's; two independent runs agree, and neither is mine.
- **Anything about the nine equivalent mutants beyond QE's differential result.** I re-derived two of
  the fifteen survivors, not all fifteen.
