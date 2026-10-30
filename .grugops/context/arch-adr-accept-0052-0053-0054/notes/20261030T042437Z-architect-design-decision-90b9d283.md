---
id: 20261030T042437Z-architect-design-decision-90b9d283
kind: decision
by: architect-design
at: 2026-10-30T04:24:37Z
verified_by: 
confidence: high: records only; transcribes the owner's verbatim word (…3dd61448); figures re-derived from ADR-0052's own arithmetic; reference-check No findings x7
refs:
  - ADR-0052
  - ADR-0053
  - ADR-0054
  - ADR-0002
  - ADR-0024
  - ADR-0044
  - ADR-0045
  - OQ-0052-1
  - OQ-228-1
  - AR-NFR004-A
  - NFR-004
  - EPIC-009
  - EPIC-010
  - ABC-220
  - ABC-221
  - ABC-228
  - ABC-229
  - ABC-230
supersedes: 
seal: sha256:d675bfd7a3b64d060cd173304ab02117418c51de0b4b87ea954633c9267e3c08
---

## Scope

Records only. This hop records the owner's word of 2026-10-30 (Orchestrator `orch-2026-10-29g/…3dd61448`, verbatim) in three ADRs and adds dated pointer lines to the four ADRs they amend. Branch `grugops/arch-adr-accept-0052-0053-0054`, cut from `main` `a046e839`, records commit `83ac150a`. No `src/`, `tools/`, `data/`, `plans/` or board edit.

## Decision

1. **ADR-0052: ACCEPTED 2026-10-30 with the owner's amendment.** His words: "accept, but change 22.5s to 22s for simplicity and compatibility, ceiling also at 22s, no need to implement fraction of a second ceiling or time per move if it is not supported by current solution".
   - `simple-tournament`: T = 22 000 ms, under a ceiling of 22 000 ms (was 22 500). `SIMPLE_TOURNAMENT_CEILING_MS` = 22 000, and `SIMPLE_TOURNAMENT_BUDGET_MS` = the ceiling. Both names are kept because `ABC-220` cites them.
   - Changed in place: the Status amends list, D3, D5's margin row, D6's parenthesis, D7 and its accepted-risk text, D9's `ENGINE_DEEP` row, the § Consequences `NFR-004` text, and § Owner questions.
   - Unchanged: D1, D2 (`C`, the ≥ 1 s safety), `min(T, C)`, D4 (59.5 s under 60 s), D6's clamp rule and D8.
   - **The arithmetic.** No period figure moved, because T was already 22 000. At 40/15, `C` starts at 22 375, so T binds on every move. 18 760 ms are left after move 40, 97.9 % of the period is used (83.2 % with 6 book moves), and the closest call is ≥ 1 069 ms at `tc=40/60`. What moved: the margin under the ceiling, 500 → 0 ms; the busy-latency bound, 22.5 → 22 s; the `NFR-004` text, 22.5 → 22 s.
   - **The overshoot is stated.** With no margin, a search at 22 000 returns up to ≤ ~31 ms past 22 s. This is the `AR-NFR004-A` class, as level 5's 3 000 ms budget is against its ≤ 3 s clause (the `src/engine.test.ts` RF-1 comment). Security/NFR re-reads it at 22 s at `ABC-220`'s gate, as was already owed. No sub-second margin is added.
   - `OQ-0052-1` closed. In force at `ABC-220`'s merge (`simple-tournament`) and `ABC-221`'s (`uci-clock-mode`).
2. **ADR-0053: ACCEPTED 2026-10-30 as written** ("ADR-0053: accept").
   - `OQ-228-1` is answered, in his words: "If engine requires more effort then increase 3s to 4s, build it fully." The owner typed the label as "QQ-228-1".
   - "build it fully": the full design, decisions 2–9 (`ABC-228`, `ABC-229`). Form (b) is not taken.
   - "increase 3s to 4s" applies only if decision 9's re-forecast still misses `G6`. The re-forecast runs first, on `main` with `ABC-235` (`baf99a7c`) and `ABC-240` (`5311f5bd`) merged.
   - **On a miss, the reading is PENDING THE OWNER:** `G6`'s measurement budget, or level 5's per-move time. Neither is chosen.
   - In force at `ABC-228`'s and `ABC-229`'s merges.
3. **ADR-0054: ACCEPTED 2026-10-30 as written** ("ADR-0054: accept"). In force at `ABC-230`'s merge. `ADR-0020` is untouched, because Q3 is open.
4. **Pointer lines (dated 2026-10-30; pointers only, no rewrites).**
   - `ADR-0002`: § Status, and one line after clause 3 (`ADR-0054`).
   - `ADR-0024`: § Status, and one line after decision 4 (`ADR-0053`).
   - `ADR-0044`: two § Status blockquotes (`ADR-0052` on D3/D4/D5/D11; `ADR-0054` on D2/D6), one line under D2's import list, and one cell note on D6's repetition row (`ADR-0054`).
   - `ADR-0045`: § Status (`ADR-0052` on A3's clamp, 32 000 → 60 000 at `ABC-221`).
   - `ADR-0052`'s in-place folds in `ADR-0044`/`ADR-0045` stay BA/PM's at each build merge, as `ADR-0052` § Status assigns them. The `NFR-004` text stays Security/NFR's.

## Risks

- **The owner's "3s to 4s" is ambiguous.** It is recorded and not read. It blocks only on a re-forecast miss.
- **The 22 s ceiling equals its budget.** The real-clock return passes 22 s by the abort granularity. This is accepted under `AR-NFR004-A` by precedent. Security/NFR confirms the bound at 22 s.
- **A parallel BA/PM hop (`bapm-owner-adr-fold`) is editing `ABC-220`.** It reads `SIMPLE_TOURNAMENT_BUDGET_MS = 22 500 − 500` and has a 22 500 ceiling. It must now read 22 000 for both. The constant names are unchanged.

## Checks

`node tools/grugops/reference-check.js` printed "No findings." (exit 0) on all seven ADRs. The scan of added lines for host paths and IPv4 addresses found 0 hits. The commit touches `memory-bank/50-decisions` only.
