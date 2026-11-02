---
id: 20261102T200244Z-architect-design-decision-afd95f39
kind: decision
by: architect-design
at: 2026-11-02T20:02:44Z
verified_by: 
confidence: high on the folds (the owner's verbatim words); the three defaults are defaults by non-answer, recorded as such
refs:
  - arch-owner-answers-1102b
  - grugops/arch-owner-answers-1102b
  - b47adfbb
  - orch-2026-10-30a/20261102T191000Z-orchestrator-decision-773be7de
  - EPIC-011
  - ADR-0025
  - ADR-0061
  - ADR-0062
  - ADR-0057
  - ADR-0044
  - ADR-0060
  - ADR-0058
  - ADR-0026
  - ABC-265
  - ABC-268
  - ABC-266
  - ABC-257
  - 605874b8
  - qe-ABC-265/20261102T170102Z-qe-e2e-decision-d9879b9c
  - arch-ABC-266-repropose/20261102T174241Z-architect-design-decision-b6305641
supersedes: 
seal: sha256:f55b996051f2344f2bd8cf2cebd49815d21d70a6859065f0b950208596ee398c
---

# The owner's "61 yes, 25 yes, park threads" folded into ADR-0025, ADR-0061, ADR-0062, ADR-0057, ADR-0044 and ADR-0060 (records only)

Architect/Design, task `arch-owner-answers-1102b`, on `grugops/arch-owner-answers-1102b` from `main` `b47adfbb`. Source: Orchestrator `orch-2026-10-30a` `…773be7de`, verbatim *"61 yes, 25 yes, park threads"*. Nothing was run, built or timed.

- **ADR-0025 TH-1 shared-table amendment -> ACCEPTED, IN FORCE on `main`.** `ABC-265` merged at `605874b8` (QE PASS_WITH_GAPS `…d9879b9c`, QE-265-a closed, G6 head = base so D2.3's fallback did not fire). Decision 2 first bullet and decision 4 last bullet read as amended; decisions 1, 3, 5-7, d2's size and always-replace bullets, d4's other bullets stand. The 2026-10-26 d4 amendment (accepted, not in force), T2 (parked) and `ADR-0058` (accepted, not in force) unchanged. One writer only: the pool is parked.
- **ADR-0061 -> ACCEPTED, NOT IN FORCE until `ABC-268` merges.** Releases `ABC-268` part 2 from `grugops/ABC-268-fix`: QE re-check of QE-268-a/b/c; A6 100 games at 100 ms vs base, GAIN >= 50.0; S' 10 games at 0.5 s vs E 1 650; Levels deep lane. In force only at the merge, which needs A6 to pass. A miss gets the "accepted, not in force on `main`" line (`ADR-0026` d9 form); `main` then keeps no futility pruning.
- **ADR-0062 -> "PROPOSED, PARKED; NOT IN FORCE".** Neither accepted nor declined; design of record kept. D1's max (12/8) and D6's played result are not answered. `ABC-266` parked, `Threads` stays 1. The ~30 min S+D+P re-probe at `Threads 12` is not funded. Re-opens only on a new premise with its own pre-registered probe and the owner's word (ADR-0058 in force via ABC-257; a search change that breaks the lockstep; the owner asking for that probe).
- **ADR-0057 -> still ACCEPTED; threads strand PARKED** on ADR-0062 D12's MISS and the re-proposal's NO WIN; re-open only on a new premise. D6's threads row now reads `parked` (dated line); TH-1 is built and in force. OQ-7 and OQ-8 unanswered, so the defaults stand: OQ-7 no, OQ-8 later (D8.8 dated bullet).
- **ADR-0044 -> pointer:** the D5 reversal is not exercised; D3, D5 and D6's `Threads` row stay in force on `main`. The reversal stays accepted in principle (ADR-0057 OQ-1).
- **ADR-0060 -> the A3 27 cp cap is kept by default** (the owner question was not answered; "keep the cap" is its named default). P1 stays parked; flat 1-ply LMR stays on `main`; still PROPOSED, RE-OPENED. Next step unchanged: re-measure decision 1 on the `main` that `ABC-268` merges into, if it merges.
- The three defaults (27 cp cap, OQ-7 no, OQ-8 later) are recorded as defaults by non-answer, not as new owner words.

## Scope
Records only: six ADR files under `memory-bank/50-decisions/`. No `src/`, tests, tools, plans, board or NFR edits.

## Risks
LOW. If `ABC-268` misses A6, ADR-0061 needs its "accepted, not in force" line, and ADR-0060's suggested re-measure loses its premise.
