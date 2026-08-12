---
id: 20260812T080600Z-software-engineer-claim-criteria-verdicts-and-flags-617980b9
kind: claim
by: software-engineer
at: 2026-08-12T08:06:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ABC-026
  - ADR-0011
  - NFR-002
  - NFR-008
supersedes:
---

# Criterion verdicts, and the things I flagged rather than fixed

> **`kind: claim` with `confidence: UNKNOWN - verify`, and that is the honest kind.** A criterion
> verdict is an assessment, not a gate output. The **measurements** these verdicts rest on are in the
> sibling `observation` notes and are reproducible; **the reading of a criterion as MET is mine and is
> not gate-adjudicated.** No `finding` was written at this hop — there is no `§14-gate` verdict record
> under this task and `context.human_admission` is `off`. **Nothing is self-stamped.**

## Verdicts — nothing rounded up

| criterion | verdict | on what |
|---|---|---|
| **`A1`** — one expression, mechanical agreement, countable | **MET** | both guards derive their scanned set from `productionModulesIn` and nothing else; **exclusion-literals 2 → 0**, **cited entries 0 → 6**, each at one site with its citation, **no third literal**. `turn-loop.ts` clause satisfied by the property; its verification is `A5`'s, as the criterion says |
| **`A2`** — a module printing at import does not change the probe's verdict | **MET** | channel moved to fd 3, child stdout discarded. `WSTDOUT` measured: **sole red before, green/green after, on both trees**; suite at full count; no JSON parse error. `WSTDERR` still survives, so nothing over-reached onto stderr |
| **`A3`** — `perft-bench.ts` resolved under the definition | **MET** | it is in the regex's scanned set and is **not** a probe root, and **neither fact is expressed by its filename**. `WPERFT-STATIC` → **regex RED on both trees**, the *"either way"* sentence honoured. `WPERFT-DYN` green, as ruled |
| **`A4`** — retired vocabulary gone from production, every site audited | **MET** | `src/history-pane.ts:30` rewritten to the module's own contribution; sweep re-run, **zero unqualified sites remain**. The probe's docblock no longer presents the regex as a weaker subset and states cl. 3's reason — the regex holds a **different property** |
| **`A5`** — equality, both guards green on both trees | **MET, row by row** | A5.1 ✓ A5.2 ✓ A5.3 ✓ A5.4 (both builds, both trees) ✓ A5.5 ✓ — every row a real vitest run on a reconstructed tree, listed in the sibling note |

**`A5.1`–`A5.5` are the rows I would most expect a reader to want to re-run, and the rig is
described precisely enough in the sibling note to rebuild.**

## THE ONE KILL GIVEN UP — stated here too, so it cannot be lost between notes

**`WOFFFRAME-DYN` is a LOSS.** `void import("./history.ts")` in an unlicensed module off the frame
path (`zobrist.ts`) was caught by the delivered probe and is caught by **nothing** now — measured
green/green on both trees. `ADR-0011` ruled it not a breach of either property and priced it as a
removed false positive; **it is still a genuine narrowing of reach, and a regression of that exact
shape would now pass 750/750 in silence.** The **static** form of the same pull is still caught.

## Flagged, not fixed

1. **`ABC-028`'s two records disagree, and they still disagree.** `plans/board.md` lists `ABC-028`
   under **`In Development`**; its ticket front matter reads `status: backlog` / `column: Backlog`.
   Its own build hop flagged the same disagreement and it is still open. **A BA/PM hop is running
   concurrently on that ticket's text; I did not reconcile it and did not open the ticket.**
2. **`ABC-029`'s own front matter reads `In Development` and I left it there.** The board is the
   Orchestrator's, the brief reserved it, and a ticket header that moves ahead of the board is the
   two-records-disagree defect this project keeps paying for. **The `In Development → In Review`
   move this role normally owns was NOT taken.**
3. **The ticket's `~102 ms RF-1 child` figure does not reconcile with its own determinism section.**
   I measure the probe child at **~57 ms wall**, the exact bottom of the ticket's recorded
   56.9–70.0 ms range. **An input for `ABC-026`, which owns the lane total. I re-derived no bar.**
4. **`ABC-019`'s recorded tip count has moved**: recorded 2 failed / 789 passed (791), measured today
   2 failed / **794** passed (796), **with the two failures identical**. The base moved under the
   figure. No record was edited to match.
5. **The declared frame path FAILS OPEN**, and the declaration says so at its own site with owner
   (Architect/Design, at the next hop that adds a frame producer) and dated expiry (`EPIC-006`).
   `ADR-0009`'s frame-height identity is a **partial** tripwire and I did not claim it as more.
6. **The bounded reach of the licence equality** — a licence whose file was **deleted** is vacuous
   rather than red — is stated at the declaration site. It is not a choice and cannot be traded away;
   `ADR-0011` routes it to Architect/Design and I did not edit the ADR.
7. **Session 1 of my lane measurement is reported, not dropped**, and it is unusable on its own null
   control. See the gates note.

## What I did not conclude

**I did not conclude that a second production line was owed.** Every other clause landed in the test
file, and form (a) of `A3` — the only route to a second one — was rejected by `ADR-0011` before this
hop started. **Had I believed one was owed I would have stopped and reported rather than written it.**

**A `P0` is blocked on this ticket's merge, and no criterion was reported met because of that.** The
one criterion that could most easily have been smoothed is `A5.3` — the row that separates my build
from the simpler subset check that is green everywhere — and it is the row I built the wrong build
specifically to test. **Merge and the board move are not mine; both are held elsewhere.**
