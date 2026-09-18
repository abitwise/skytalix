---
id: 20260919T100000Z-orchestrator-decision-six-owner-rulings-verbatim-3c9e1f42
kind: decision
by: orchestrator
at: 2026-09-19T10:00:00Z
verified_by:
confidence: high
refs:
  - ABC-100
  - ABC-092
  - ABC-110
  - ABC-108
  - ABC-111
  - ABC-075
  - ABC-081
  - ABC-046
  - ABC-102
  - ABC-112
  - ABC-045
  - ABC-107
  - ADR-0005
  - ADR-0007
  - ADR-0014
  - NFR-008
  - RISK-004
supersedes:
---

# SIX OWNER RULINGS, TAKEN IN SESSION 2026-09-19 — THE WORD, VERBATIM, AND WHAT EACH ONE DOES AND DOES NOT DECIDE

**NOT A STAMP.** `context.human_admission` is `off`. This is an agent's hand-authored transcription
of the project owner's word, in git. It is the authority the six hops below cite; it is not evidence
that anything was built or measured.

## The word, verbatim and attributed

The Orchestrator put six open decisions to the owner, numbered 1–6, in this order: (1) `ABC-100`
distribution channel; (2) `ABC-092` opening-book source; (3) `ABC-110` NFR-008 CPU breach;
(4) `ABC-075` Zobrist en-passant component; (5) `ABC-046`/`ABC-102` quit/new/undo loop arm;
(6) `ABC-107` 7+ candidate ambiguity overflow. The owner answered:

> "1. git clone + npm start works for now ; 2. i don't have preferred source, we can research that ;
> 3. raise to 15s for now ; relax to "ep swuare set" ; 5. b, resign should be separate ; 6. implement
> best guess for now"
> — Olger Oeselg, project owner, in session, 2026-09-19

The unnumbered clause `relax to "ep swuare set"` sits between 3 and 5 and answers item 4 — the
Orchestrator's question offered exactly the phrase *"ep square set"* as one of two options. `swuare`
is a typo for `square`. Read as: **the en-passant hash component keys on the ep square being SET,
not on a legal ep capture existing.**

## What each ruling decides, and its bound

1. **`ABC-100` — channel is `git clone` + `npm start`, "for now".** Supersedes `ADR-0007` clause 5
   only. "For now" means revisitable — the superseding ADR carries a revisit trigger, not a
   permanence claim. `production_requires_human_confirmation` is NOT named and does NOT move.
   `EPIC-006`'s four `npx` sentences are repaired against this answer (`ABC-100` `A7`).
   Nothing is built (`A6`).
2. **`ABC-092` — research proceeds; the owner has no preferred source.** This is authorisation to
   RESEARCH, not a ratification. The resulting ADR is `status: proposed` until the owner names the
   source; `RISK-004` does not move until he does. Zero bytes of book data are copied (`A6`).
3. **`ABC-110` — `NFR-008`'s CPU level moves 13 s → 15 s, "for now".** This is lever (ii), the
   owner's alone. The wall clause (3 s) is NOT named and does NOT move. Lever (i) — moving files
   behind an opt-in lane — is NOT taken; no test file changes lane. `ABC-110` `A5` is satisfied by
   this note. The warm/cold protocol (`ABC-111`) is still unsettled and still gates the WALL reading.
4. **`ABC-075` — the ep component is "ep square set".** Supersedes `ADR-0005`'s "only when a legal
   ep capture exists" clause. Architect/Design still owes the THREADING decision (per-ply key array
   vs. mutable position) — the owner did not rule that and it is not the owner's.
5. **`ABC-046` — shape (b): the loop gains a `quit` arm. `resign` stays a separate command.**
   `quit` ≠ resign (shape (c) stays rejected). `ABC-045` (`resign`) stays its own ticket. The same
   arm is the home `ABC-102` (`undo`) and `ABC-112` (`help` advertises `quit`) were waiting on.
   Re-opening the `Done`, mutation-tested `turn-loop.ts` state machine is thereby authorised —
   under a ticket, gated, not by this note.
6. **`ABC-107` — Architect/Design picks the best of options 1–4 and implements it, "for now".**
   The owner delegated the shape choice; the ADR must say which option, why, and what would flip
   it. Silent truncation and widening the frame stay ruled out.

## What this note does NOT do

Moves no ticket on the board. Cuts no ticket. Merges nothing. Changes no config key. Each ruling
becomes real only when the hop that carries it lands a superseding ADR and (where the ruling
touches code) a gated branch.
