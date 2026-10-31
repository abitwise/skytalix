---
id: 20261031T070529Z-architect-design-decision-28d7bc3b
kind: decision
by: architect-design
at: 2026-10-31T07:05:29Z
verified_by: 
confidence: high on the reading (QE sealed notes); the savings are estimates from one inadmissible lane JSON, UNKNOWN - verify until the ticket's census and G8
refs:
  - arch-g8-tranche2
  - ADR-0046
  - ADR-0035
  - ADR-0050
  - ADR-0040
  - NFR-008
  - EPIC-010
  - ABC-244
  - ABC-245
  - ABC-246
  - ABC-221
  - ABC-242
  - ABC-243
  - ABC-167
  - ABC-171
  - ABC-174
  - ABC-197
  - ABC-212
  - ABC-220
  - ABC-241
  - ABC-208
  - QE-245-b
  - QE-221-c
  - QE-208-a
  - QE-208-b
  - T2a
  - T2b
  - T2c
  - T2d
  - T2-R
  - W1
  - R1
  - R2
  - T-QEHOP-GROWTH
  - qe-ABC-245/20261031T064950Z-qe-e2e-observation-af467c7b
  - qe-ABC-245/20261031T064950Z-qe-e2e-observation-cf53b0ed
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-3c2ac5a2
  - qe-ABC-243/20261031T040755Z-qe-e2e-observation-99b6b89f
  - qe-ABC-242/20261031T051332Z-qe-e2e-observation-24035110
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-b348899a
  - se-ABC-244/20261030T224640Z-software-engineer-observation-ee17f704
  - se-ABC-244/20261030T224640Z-software-engineer-observation-1b63ff56
  - 38d02496
  - 4cd261c1
  - c48a6f83
  - 9c008db4
supersedes: 
seal: sha256:e1597acaf04288faa55521e3a76101237898d5abeee0736ac121e6fca0258488
---

# Tranche 2 is OPEN and not waived. Recommend one S test-only ticket, T2c + T2a (narrow) + T2d: est. −0.15..−0.45 s wall, no coverage lost by construction. W1 (PROPOSED) confirms the 9.7 s owner line before it routes. No owner word owed now

Records only, recorded in `ADR-0046` § Addendum 2026-10-31 (`38d02496`). Nothing was run or timed.

- **Tranche 2 is OPEN.** `qe-ABC-245`'s `G8` head median of 9.82 s (`…af467c7b`) is above § Addendum 2026-10-30's
  9.6 s line, and the Orchestrator recorded the opening at `4cd261c1`. The trigger is not waived, and no amendment
  moves it.
- **The noise reading (`QE-245-b`):**
  - The trigger fired as written: the text reads a raw, admissible head median.
  - The firing is not growth. The head added a 1.67 ms row, the delta sits in byte-identical files, and head run 3
    (10.19 s) was slow in every file, with CPU tracking wall.
  - The lane's central value is about **9.5 s**. `ABC-245`'s six runs pooled give a median of 9.51 s, and adding up
    from `ABC-242`'s 9.41 s gives the same. This is an estimate.
  - So the noise strengthens the case for tranche 2: one run already reached 10.19 s. It also sizes the remedy at
    about −0.3 s, not −0.6 s.
  - The saving is read on the narrow set and the gate's H − B. The 9.4 s design target is read on the head median.
  - The 9.6 s line is spent. No tranche 3 is defined. After the gate, the lines left are 9.7 s (owner) and 10 s
    (`NFR-008`, `ADR-0035` D6).
- **T2-R (PROPOSED, BA/PM's ruling): one test-only ticket, size S, P1, `EPIC-010`.** It touches
  `src/search.null-move.test.ts` and `src/uci-session.test.ts`.
  - **T2c:** sample `QE-208-a`'s readings more sparsely, and re-root `QE-208-b` on a cheaper position with ≥ 3
    non-pawn pieces each side. Both are under kill parity, with insideNull ≥ 3 and underNull > 0, and `ADR-0050`'s
    plants must still be killed. Est. −0.05..−0.25 s.
  - **T2a (narrow):** move `ABC-167` A5's six searched rows to the file's existing `ENGINE_DEEP` branch, only under
    **default-lane kill parity**. A row that is the only default-lane killer of a named mutant stays. Two rows are
    exact duplicates of other default-lane reads: the bare go (4 other rows) and G = 3 500 (`ABC-171` A6's
    level-5 row). Est. −0.06..−0.16 s.
  - **T2d:** apply R2 to `ABC-167` A4-a2 (100 → 1 000, 40 → 4 reads). Est. −0.035 s.
  - `ABC-244`'s conditions 1–3 carry over. A moved row runs green once in `ENGINE_DEEP` with `-t`. No `AGENTS.md`
    edit is owed (11 B spare).
  - Design target: `G8` head median ≤ 9.4 s at the gate.
- **The ticket BA/PM should cut (not cut here):** *"The default lane sheds ~0.3 s and loses no coverage:
  `QE-208-a` sampled more sparsely and `QE-208-b` on a cheaper root, `ABC-167` A5's duplicated searches moved to
  `ENGINE_DEEP`, and A4-a2 on R2 (test-only)."*
  - It shares `src/uci-session.test.ts` with `ABC-246`. The order is the Orchestrator's; `ABC-246` first is
    simplest.
- **The alternative, held: T2b alone, −0.39 s.** It moves `QE-208-a`, both `QE-208-b` rows and the pawn-only
  depth-6 row to `SEARCH_DEEP`. That takes away `ADR-0050`'s abort-restores-root and key-under-null guards, and the
  default lane has no other row for either. It stays the first lever the owner question would weigh.
- **W1 (PROPOSED, BA/PM's word, a reading rule; no level moves):**
  - **Where:** the 9.7 s owner line is read on the tranche-2 gate's head median and on every later admissible one.
  - **Confirmation:** a reading above 9.7 s gets a QE re-read, head only, n = 3, in a second window (≥ 30 min
    later, after wait-clear, Tctl ≤ 60 °C).
  - **Routing:** it goes to the owner if the median of the six head runs is above 9.7 s.
  - **Until BA/PM gives W1 its word,** the addendum's text reads alone.
  - **The 10 s line is untouched:** it is `NFR-008` NOT MET and goes to D6.
- **If the owner line is crossed,** `NFR-008` is still MET, but the agent-side headroom is gone. The owner's
  options:
  - (a) accept the band and watch;
  - (b) accept coverage-losing lane moves, T2b first;
  - (c) a reserved lever: W, `maxWorkers: 3`, or the heap flag.
- **No owner word is owed now.** No NFR level, cap, pin, W, step set or lane command moves.
