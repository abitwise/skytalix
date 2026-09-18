---
id: 20260919T104000Z-architect-design-decision-adr-0022-option-4-the-overflow-is-a-documented-bound-65cfac16
kind: decision
by: architect-design
at: 2026-09-19T10:40:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ABC-033
  - ABC-034
  - EPIC-002
  - EPIC-003
  - ADR-0009
  - ADR-0010
  - ADR-0022
  - NFR-002
  - NFR-008
  - memory-bank/50-decisions/ADR-0022-message-region-overflow-is-a-documented-bound.md
  - plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
supersedes:
---

# `ADR-0022` — option 4: the message region's overflow is a documented, tested bound; the owner's "best guess" is built as one test file and zero production lines

**NOT A STAMP.** Hand-authored `decision` under the owner's delegation, quoted verbatim on the ADR:
*"6. implement best guess for now"* (Olger Oeselg, 2026-09-19). The choice of option is this role's;
its evidence is the sibling `observation` (`…-4574be51`).

## The ruling

**Option 4.** At `W` = 21 and `MESSAGE_ROWS` = 2 the region shows every candidate of a list of up to
**6**; **7 shows 5 and marks 2 hidden, 8 shows 5 and marks 3 hidden**; the `(+N more)` marker stays
the honest signal; nothing pages, re-prompts or renders narrower. The bound is pinned by `ABC-107`
`A5` (hidden **0 / 2 / 3** on the 6/7/8-knight fixtures through the real pipeline — `0` is the
requirement, `2`/`3` the tripwire, the `ADR-0009` clause-5 split) and by `A1'` (every candidate
resolves as `move` from its full-origin SAN and from its coordinate form).

## Why — the two measured facts

1. **Every candidate is reachable without the list**: full-origin SAN 8/8 and coordinate 8/8 on
   every fixture, and the board above the region shows every origin. The list is a hint.
2. **Seven of one piece needs five promotions** (caps per square: N 8, Q 8, R 4, B 4; a standard army
   holds 2/1/2/2). The case-folded mixed union caps at 5.

## The other three, priced

- **1 paged region — `M`**: loop state + an input arm in the `Done`, mutation-tested `turn-loop.ts`;
  paging makes the two-candidate case worse (`A3`). Rejected.
- **2 second prompt — `M`+**: input-side dependency, and a numbered menu is LONGER than the list it
  replaces, so it does not solve the display it is offered for. Rejected.
- **3 narrower rendering (the Orchestrator's prior) — `S`**: measured, it FITS — `Nb3` holds 10,
  `b3d4` holds 8. Rejected because the price lands in the common case: `Nb1 Nf3` is not retypeable
  (not SAN; `parseSan` reads `Nb1` as a move TO b1) and `b1d2 f3d2` is not SAN (`EPIC-003`), and it
  must be built in `src/move-input.ts`'s `ambiguous()` — the frame knows no chess — against `A4`.
  A conditional narrowing needs a new width-aware seam across `ADR-0010`. **Named as the fallback
  shape if F2 fires.**

## Pushback recorded (coding rule 3)

The Orchestrator's prior read option 3 as "cheapest and pure" and as consistent with `A1`–`A5`. It
is not consistent with `A4` (0 changed lines in `src/move-input.ts`) — the ticket's own sentence
"written to hold under options 1-3" was wrong for option 3, and the ADR says so. Option 4 is cheaper
by every measure taken and its risk is bounded by a test that reds.

## Falsifiers (on the ADR, `## Consequences`)

F1 a 7+ list from fewer than five promotions (a new producer routing lists through the region);
F2 the tripwire reds toward the player (6 stops fitting) → supersede by conditional option 3;
F3 the owner's word after a real session; F4 the tripwire reds the other way → re-baseline, not flip.

## What this hop changed, and what it did not

Changed: `ADR-0022` (new, `accepted`); `ABC-107`'s page (`M` → `XS`, `A1` → `A1'`, DoR 8/10 → 10/10,
pullable, recommendation "pull now, not behind `ABC-034`"); one `plans/traceability.md` row appended;
one `_Updated` line each on `plans/traceability.md` and `plans/nfr-catalog.md`; this task's notes;
the queue record. **Not changed:** anything under `src/`, `AGENTS.md`, `plans/board.md`,
`MESSAGE_ROWS`, the frame's row count, `ABC-033`'s page (its `A4` stays "NOT met" — this ADR
re-scopes the promise, it does not make the old sentence true). Board move is the Orchestrator's.

**One temptation resisted, written down as the fence asks:** the marker could say *how* to
disambiguate (`(+3 more — type the full origin, e.g. Nb3d4)`) in one line of `src/frame.ts`. Not
done: it is wording (`ABC-034`'s) and it would widen `markerFor`, moving the bound `A5` pins. Raised
as an observation for `ABC-034`, nothing more.

**Open, not mine to fix here:** `memory-bank/00-index.md` still says "sixteen ADRs, next free id
`ADR-0017`" while `ADR-0017` exists and `ADR-0018`–`ADR-0021` are being written by sibling hops of
this same task; the line is a merge-conflict magnet and is left for the Orchestrator to correct once,
after the six hops land, by listing `50-decisions/`.
