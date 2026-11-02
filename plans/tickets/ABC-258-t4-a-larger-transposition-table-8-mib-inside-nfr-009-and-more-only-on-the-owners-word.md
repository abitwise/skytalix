---
id: ABC-258
title: "T4: a larger transposition table, 2^19 entries (8 MiB) inside NFR-009's 16 MiB, and more only on the owner's word (Q-3K-6)"
status: backlog
column: Backlog
size: S
priority: P3
epic: EPIC-011
---

# ABC-258: a larger TT (T4)

> **STATUS 2026-11-02, by BA/PM: PAUSED BY THE OWNER'S ORDER (P); THE T2 AMENDMENT PARKED WITH IT (B)** (task
> `bapm-threads-cut`, records only, at `main` `48f3fc01`; nothing run). His words (`orch-2026-10-30a` `…81ae2db4`,
> verbatim): *"… P yes, A accept, B park, C yes; …"*.
> - **P, paused.** The Phase 1 TT strand is paused by his order, and pruning goes first. Lifting it is the
>   Orchestrator's call within P.
> - **B, parked with this ticket.** The `ADR-0025` T2 amendment (`ABC-237`, folded in here as Scope 3 and A5) is
>   **PARKED with `ABC-258`**. It is neither accepted nor declined, and nothing is built for it (`ADR-0025` § Status).
> - **When this comes back:** after the threads worker pool (`ABC-266`), on the shared table (`ABC-265`). That is where
>   several workers raise the table pressure T2 and T4 need (`ADR-0057` D6's dated line; `ADR-0056` D6's 2026-11-02
>   line, item 4). It may also come back earlier on its own trigger. The re-ask brings fresh figures, because the
>   2026-11-02 figures are single-threaded on 2^18 slots and do not carry over. If `ABC-265` has merged, this ticket is
>   written on the shared layout.
> - **C, the intent line, is owed at re-ask, not now.** T4 is "invisible at 100 ms by construction" (`ADR-0056` C2′'s
>   2026-11-02 line, its example). So at re-ask its page may name NEUTRAL (≥ 43.0 of 100) before the read, together
>   with its own pre-registered measured bar. BA/PM writes that line from the design note at or before Ready.
> - **Q-3K-6 is still open.** `ADR-0057` OQ-4 (a) does not move `NFR-009`'s level, so nothing above 8 MiB is allowed.
> - Row 10 now reads P and B. DoR stays 9/10.

> **PREMISE RESTATED, T2 FOLDED IN, PAUSED, 2026-11-02 by BA/PM** (task `bapm-phase1-pause`, records only, at `main`
> `e8495fc5`; nothing run). Source: the ruling `arch-phase1-replan` `…64e95bfa` and the pressure note `…5ea73b5c`.
> - **The premise, restated with the store fraction.** Only **3–5 % of nodes store** (quiescence nodes never store,
>   `ADR-0025` decision 5). So at 40/15 (≈ 14–20 M nodes a move) a search makes about **0.4–1.0 M stores**, 1.6–3.8 a
>   slot on 262 144 slots, not 14–20 M. At 4 s about 0.08–0.14 M stores, 14–22 % of which land on an occupied slot; at
>   100 ms about 2 k, no pressure. Pressure is real only at long controls, and smaller than the Problem below said.
> - **T2 folded in as the alternative remedy, measured alongside** (Scope 3, A5). Under pressure (`TT_BITS` 14, about 3
>   stores a slot) T2 alone read **0.77×** pooled at depth 8; at 2^18 it reads 1.00×. A bigger table and depth-preferred
>   replacement answer one question. `ABC-237` is parked to be re-read here.
> - **PAUSED with the Phase 1 TT strand.** The 100 ms read cannot see either remedy. Its effect at 40/15 is `UNKNOWN -
>   verify`; no read in the per-change rule sees it.
> - Struck text below keeps its history; dated marks carry the changes. DoR stays 9/10.

> **Cut 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`; nothing run). Source:
> `ADR-0056` D2 row T4 ("larger TT (16–64 MiB) … +5–15 at 4 s … `NFR-009` (16 MiB now; owner pre-offered 128 MiB,
> 2026-09-25) … none — new ticket") and D7 Q-3K-6. `EPIC-011` Phase 1, last.

## Problem

- **User:** the owner in `uci-clock-mode` at 40/15, and the claim reading.
- **Pain:** the table has 2^18 = 262 144 entries, 4 MiB (`src/transposition.ts` `TABLE_BITS = 18`). At 40/15 a move
  searches ≈ 14–20 M nodes at today's 0.63–0.90 M nodes/s (`ADR-0056` D1; arithmetic, not a reading), ~~so most entries
  are overwritten many times within one move~~ *(2026-11-02: only 3–5 % of nodes store, so ≈ 0.4–1.0 M stores a search,
  1.6–3.8 a slot, `…5ea73b5c`)*. At 4 s the gain is small (+5–15, estimate); at 22 s it is larger
  (`UNKNOWN - verify`).
- **Value:** more of the search's own work survives, most at the claim control.

## Scope

1. `TABLE_BITS` 18 → 19: 2^19 entries × 16 B = **8 MiB**. `NFR-009` already names 2^19 as fitting ("2^19 entries fits;
   2^20 is a re-level, the owner's", `EPIC-010` § NFR triggers).
2. **Only on the owner's yes to Q-3K-6:** a larger size up to the level he sets (2^20 = 16 MiB alone fills today's
   bound; 2^22 = 64 MiB is `ADR-0056`'s upper figure), with Security/NFR re-levelling `NFR-009` on his word first.
3. *(2026-11-02, `bapm-phase1-pause`.)* **The alternative remedy, measured alongside:** `ABC-237`'s depth-preferred
   replacement (the `ADR-0025` T2 amendment's rule (a)–(c), PROPOSED, recommended parked here). Whether the size,
   T2, or both ship is the design's call on A5's readings.

## Out of scope

- A UCI `Hash` option (today `setoption name Hash` writes nothing, `ABC-243`). Buckets. ~~Replacement (`ABC-237`),~~
  *(2026-11-02: folded in, Scope 3)* retention (`ABC-257`), cutoffs (`ABC-238`).

## Acceptance criteria

- **A1 (size).** `tableByteLength()` reads 8 MiB (or the owner's level); search-held memory in total ≤ 16 MiB (or the
  re-levelled bound) by `NFR-009`'s instrument; growth ≤ 1 MiB between a 1 s search and one at `DEFAULT_BUDGET_MS`.
- **A2 (start-up).** Allocation stays outside the clock: `G5` per-move ceilings hold and the first `go` after
  `ucinewgame` is ≤ base + 5 ms in a lane row on the virtual clock (zero-fill cost is named at design).
- **A3 (gates).** `G1`, `G4` (a size door reproduces base node for node on the `ABC-078` `A3` corpus), `G6`, `G7`,
  `G8`, `G9`.
- **A4 (the reading).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the SPRT and the design-named control this row named.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error. **Note for QE:** this read guards against breakage and cannot show a size gain: at 100 ms a search visits ≈ 47 k nodes (467 k nodes/s median × 0.1 s, `qe-tc-depth-probe` `…1889e3b0`; arithmetic), fewer than today's 262 144 entries. A read at a longer control is an other run, asked of the owner first if it is estimated over 1 h. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at ~~E 1 650~~ *E 1 810 (2026-11-02, `bapm-records-1102c`; `ADR-0056` S′ amendment)*: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; ~~`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`~~ `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (41 at `ADR-0056`'s count; QE counts its own run). A failure is a defect, back to the Software Engineer.

- **A5 (the two remedies, side by side; 2026-11-02).** **Given** the `…5ea73b5c` game set (three 16-ply lines from
  kiwipete, position-6 and startpos, searched at fixed depth 8), **then** nodes against the door are reported, pooled
  and as a geometric mean, at two settings: today's 2^18 (the door 2^18, always-replace; the remedies 2^19, T2 at 2^18,
  and both), and the pressure stand-in 2^14 (the door 2^14; the remedies 2^15, T2 at 2^14, and both). **A remedy
  ships only if it reads ≤ 0.97 × its door at the 2^14 setting;** the 2^18 readings are reported, not barred. *(The
  0.97 × is `ABC-237` A3's bar, carried; 2^14 stands in for pressure and is not the 40/15 shape, `…5ea73b5c` Risks.)*

## NFR triggers

- **`NFR-009`:** A1, the point of the ticket. **`NFR-004`:** A2. **`NFR-005`:** `G6`. **Security:** none.

## Test notes

1. A1 and A2 are lane rows; the memory row runs under `--expose-gc` as `ABC-209`'s did.
2. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: S** (`ADR-0056`: XS; S here for the door and the memory rows). **Priority: P3.**

## Dependencies

- `ABC-257` merged or closed (same file; retention changes what a bigger table holds). *(2026-11-02: `ABC-257` is
  paused; this ticket pauses with it, `…64e95bfa`.)*
- **Owner:** Q-3K-6 only for scope item 2. Item 1 needs nothing from him.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ S |
| 4 | testable, measurable acceptance | ✅ 8 MiB; ≤ 16 MiB; growth ≤ 1 MiB; ≤ base + 5 ms *2026-11-01 (`bapm-reconcile-adr0056`): plus the 0.5 s smoke (S′, ~~E 1 650~~ E 1 810 (2026-11-02, `bapm-records-1102c`), S-4) and the Levels deep lane (exit 0, every test passed) in the reading row. Score unchanged.* |
| 5 | dependencies known | ✅ *(2026-11-01)* A4's control is the owner's 100 ms; a longer read is asked first |
| 6 | NFR triggers with targets | ✅ |
| 7 | test notes | ✅ |
| 8 | size | ✅ S |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ `ABC-257`; ~~`EPIC-011` not started~~ *2026-11-02: PAUSED with the Phase 1 TT strand (`…64e95bfa`); `ABC-237` re-read here* *2026-11-02 (`bapm-threads-cut`): **paused by the owner's order (P)**; T2 amendment **parked** with this ticket (B); re-asked after `ABC-266`, on the shared table* |

**DoR 9/10 (re-scored 2026-11-01: row 5). ~~Backlog.~~ Backlog, PAUSED** *(2026-11-02, `bapm-phase1-pause`: premise restated, T2 folded in as Scope 3 and A5)*.
