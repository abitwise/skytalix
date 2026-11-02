---
id: 20261102T152416Z-architect-design-decision-0481036d
kind: decision
by: architect-design
at: 2026-11-02T15:24:16Z
verified_by: 
confidence: high (a pre-registration: the set, bars and rule are fixed before any candidate result; the bars are quoted from ADR-0060 d8/d9 unchanged)
refs:
  - arch-ADR-0060-reopen
  - grugops/arch-ADR-0060-reopen
  - EPIC-011
  - P1
  - ADR-0060
  - ADR-0050
  - ADR-0026
  - ABC-121
  - arch-phase2-rebase/20261102T151839Z-architect-design-decision-f9f440c9
  - arch-phase2-rebase/20261102T151839Z-architect-design-observation-d5870a7a
  - arch-phase2-p1/20261102T144713Z-architect-design-observation-35bd3967
supersedes: 
seal: sha256:ac8f0aa89ddf38015f2b5df5b4d7b4584e4e0cf684cfca6648642541f00630dd
---

# ADR-0060 re-open: the candidate set, the bars and the selection rule, fixed BEFORE any candidate is run on main

Brief `arch-ADR-0060-reopen`. Sealed before the first candidate run; nothing below was chosen after a result. The
re-open reads on `main` (src equal to `0b73f51d` / `5ffbae25`), with the same instrument as `arch-phase2-rebase`
(`arch-phase2-p1`'s `probe.ts` unchanged, `patch_main.py` plus one knob, `pvMaxR`, a cap applied at PV nodes only,
after every other term). The door is `main`'s flat `ABC-121` rule.

## The bars (ADR-0060 decisions 8 and 9, unchanged; none is moved by this hop)
- **A4 (a):** `search()` at depth 8 and `chooseMove` deepened to 8 (frozen clock), on kiwipete and position-6:
  head / door <= 0.85 on each of the four readings.
- **A4 (b):** `chooseMove`, `maxNodes` 47 000, frozen clock, on `ABC-121`'s 190: mean completed depth >= door + 0.25
  (head sum - door sum >= 47.5, so >= 48 position-plies).
- **A4 (c):** `G6` >= base. Timing: not read here (a build's gate). Reported as "not read".
- **A3 drift:** depth 5 on the 190, BOTH recursions, against the door: >= 95 % of non-mate scores within 25 cp, none
  beyond 27 cp, 0 mate scores change sign. Mate-status flips reported.
- **A3 mate floor:** every 287-corpus position the door scores as a mate at depth 4 is a same-sign mate in `search()`
  at depth 5: 0 violations (163 door mates on main).
- **A3 zugzwang:** `ADR-0050` d9's seven rows at depths 9, 8, 8, 8, 8, 11, 12 each play the recorded move: 7 / 7.
- **A5 G1:** >= 54 / 58 with no NEWLY-MISSED line.

## The candidate set (closed; base 1.0, divisor 2.0, killer term 0, child depth >= 1, eligibility unchanged, move
## index >= 3, unless a row says otherwise)
`T = floor(base + ln d * ln m / div)`; non-PV r = min(T, cap, d - 2); PV r = min(T - pvLess, cap, d - 2, pvCap).

| id | form | knobs |
|---|---|---|
| R0 | decision 1 as written (reference; known to miss on main; re-run as the instrument check) | pvLess 1, maxR 2 |
| C1 | no reduction at PV nodes; table cap 2 elsewhere | pvMaxR 0, maxR 2 |
| C2 | PV: table - 1, capped at 1 ply; non-PV cap 2 | pvLess 1, pvMaxR 1, maxR 2 |
| C3 | PV: today's flat 1 ply; the table only at non-PV nodes, cap 2 | pvLess 0, pvMaxR 1, maxR 2 |
| C4 | PV: table - 1, capped at 1; non-PV cap 3 | pvLess 1, pvMaxR 1, maxR 3 |
| C5 | PV: flat 1; non-PV cap 3 | pvLess 0, pvMaxR 1, maxR 3 |
| C6 | PV: table - 1, capped at 1; non-PV uncapped | pvLess 1, pvMaxR 1, maxR 99 |
| C7 | C4 with move index >= 2 (index threshold) | C4 + minIndex 2 |
| C8 | C4 with divisor 1.75 (divisor) | C4 + div 1.75 |

- **Why these.** `arch-phase2-rebase` measured that the 63 cp row comes from two-ply reductions at PV nodes (PV -2
  removes it), and that `chooseMove` position-6 saves more when non-PV nodes reduce deeper (uncapped 0.769, 1.0/1.75
  0.770, against 0.870 capped). So the set separates the PV term (none, table-1 capped at 1, flat 1) from the non-PV
  depth (cap 2, cap 3, uncapped), plus one index and one divisor change on the middle form. Each is a mechanism-level
  rule a textbook names, not a per-position tweak.
- **Not in the set, said before the read:** a depth threshold (raising d >= 3 removes today's flat ply at depth 3; a
  PV-only depth gate on two-ply reductions would hide them from the depth-5 drift instrument, which is fitting the
  instrument); offset changes (0.75 was read on main as textbook / no-adjust and both miss); a killer term (no
  measurable effect, `arch-phase2-p1`).
- **The set is closed.** No candidate is added after a result is read. If none passes, a new set is a new hop.

## Screening order (cost only; not a selection step)
- **Stage A, every form:** A4 (a) (four readings) and A3 drift (both recursions).
- **Stage B:** A4 (b) reach, mate floor, zugzwang 7 / 7 and G1 for every form that meets every stage-A bar, AND for
  every form whose only stage-A miss is the 27 cp cap (so the owner question, if it arises, has full data).
- Every run: `flock <host-test.lock> timeout 300`, deterministic node counts only, no timing. The door reproduces
  1 116 785 / 1 602 457 / 1 575 537 / 476 244 to the node, or no figure is read.

## The selection rule
1. **Eligible** = meets every bar above that is read here (A4 (a), A4 (b), A3 drift, mate floor, zugzwang, G1).
2. **Pick** the eligible form with the highest reach gain at 47 000 nodes (what LMR is for, read on the 190, not on the
   two A4 boards).
3. **Tie** (within one position-ply, 0.0053): fewer departures from decision 1; then the lower mean of the four A4 (a)
   ratios.
4. **If a form is picked:** it is written into ADR-0060 (PROPOSED, ready for the owner), with main's door and head
   counts. Its position-4 / position-5 / startpos depth-8 ratios and the 20 000-node reach are reported (not bars), as
   an out-of-sample look.
5. **If none is eligible:** nothing is written in as the rule. The owner question is put: may the 27 cp cap (decision
   8, ⌊1.5 × 18⌋ from one base) be re-derived on main by `ADR-0050` d8's method (⌊1.5 × measured maximum⌋)? The
   conditional form named with it is chosen by steps 2-3 among the forms meeting every read bar except the 27 cp cap,
   and the number the cap would become is ⌊1.5 × that form's larger drift maximum of the two recursions⌋. If no form
   meets every other bar either, that is said, and the owner question changes accordingly. The bar is not moved here.

## Scope
Records only. Scratch copy outside the repository, deleted after; raw outputs kept under this task's `raw/probe/`.

## Risks
- Every candidate is still screened on the two boards that define A4 (a); a finite pre-registered set and selection on
  the 190's reach limit, but do not remove, the selection effect.
- If the 27 cp cap stands, no form may pass (on main every measured form without the 63 cp row read a larger maximum of 28-30 cp).
