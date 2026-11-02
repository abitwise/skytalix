---
id: ABC-257
title: "T1 + T3: the transposition table is kept across the moves of one game together with ABC-238's deeper-entry cutoffs, its size unchanged, read on a pre-registered held-out bar; PAUSED until the owner answers C2' or allows a longer read"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-011
adr: "ADR-0025 decision 4 amendment of 2026-10-26: ACCEPTED by the owner (…2ae5fc12 item 1), NOT in force on main (ABC-209 closed unmerged); the Architect re-reads it on the combined T1+T3 base; ADR-0058 (PROPOSED; recommended accepted, not in force) is the combined attempt's base, decision 7 and its doors"
---

# ABC-257: keep the TT across moves, re-tried (T3)

> **RE-SCOPED AND PAUSED 2026-11-02 by BA/PM** (task `bapm-phase1-pause`, records only, at `main` `e8495fc5`; nothing
> run). Source: the ruling `arch-phase1-replan` `…64e95bfa`, item 3, and the variants `…c0e9f5a0`.
> - **New scope: the combined T1 + T3 attempt.** This ticket carries `ABC-238`'s rule and doors (`ADR-0058` d1, d3,
>   d4; code reference `grugops/ABC-238` `3abaefdd`, closed unmerged on F4) together with the table kept across the
>   moves of one game (`ABC-209`'s Scope). **T2 (`ABC-237`) is out:** it adds nothing on a lightly loaded table.
> - **Why combined:** at fixed depth 8 with the table kept, T1 + T3 read **0.904×** over searches 2–9 pooled, against
>   T1 alone 0.976× and T3 alone 0.973× (dev set: kiwipete, position-6, startpos). That synergy is the premise.
> - **PAUSED until the trigger.** At depth 6, about what 100 ms reaches, T1 adds nothing over T3 (0.960× vs 0.944×
>   geometric mean), so a 100 ms read of this ticket would re-read `ABC-209`'s NEUTRAL. **It resumes only if the owner
>   answers yes to the C2′ question** (a mechanism that cannot fire at the read's control is read on the NEUTRAL bar
>   plus its own mechanism rows) **or allows a longer-control read.** Without one, it stays paused in Backlog.
> - **A8 is replaced by the pre-registered bar** (below). **The dependency "`ABC-237` merged or closed" is dropped.**
>   **The premise "a kept entry … never cuts" is struck:** measured, kept entries supply 17–23 % of exact-depth cuts
>   (`…5ea73b5c`).
> - **Size S → M** (T1's rule, doors and re-pins travel with it). Priority stays P3. DoR stays 8/10.
> - Struck text below keeps its history; dated marks carry the changes.

> **Cut 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`; nothing run). Source:
> `ADR-0056` D2 row T3 ("TT kept across moves, re-tried **after T1** ~~(its NEUTRAL was read under exact-depth cutoffs,
> where a kept entry almost never cuts)~~"; +10–30 after T1, estimate) *(2026-11-02: the parenthesis is false, kept
> entries supply 17–23 % of exact cuts, `…5ea73b5c`; its correction in `ADR-0056` is a later Architect hop's)* and D4 ("Tried and dropped, worth a re-try because
> a precondition changed"). The owner re-opened `EPIC-010`'s fenced re-tries by choosing a new epic (Q-3K-5,
> `…022fb66f`). ~~`EPIC-011` Phase 1, after `ABC-238` and `ABC-237`.~~ *(2026-11-02: Phase 1, paused; T1 + T3 combined.)*
>
> **This is the re-try of `ABC-209`, under a new id.** `ABC-209` stays dropped (D NEUTRAL +8.7 ± 18.3, 800 games,
> `bapm-s1-ABC-209`); its code `grugops/ABC-209` `bb6cf451` is the reference, and its acceptance rows `A1`–`A5`, `A7`
> are carried here by reference rather than restated. ~~**What changed since:** with exact-depth cutoffs only
> (`entryDepth(slot) !== depth`), an entry stored at depth d by the previous move is probed at depth d − 2 and never
> cuts; after `ABC-238` it may.~~ *(2026-11-02: struck. Kept entries do cut under exact depth, 17–23 % of exact cuts,
> `…5ea73b5c`. What changes is the combination: T1 + T3 0.904× against 0.973× for T3 alone, `…c0e9f5a0`.)*

## Problem

- **User:** the owner at level 5 and in `uci-clock-mode` at 40/15.
- **Pain:** the table is cleared at every `chooseMove`, so each move re-searches what the previous move just proved.
  At 40/15 (≈ 22 s a move) that is the most work thrown away of any control.
- **Value:** hash moves and, after T1, cutoffs from the previous move's search. *(2026-11-02: T1 travels with this
  ticket, the combined attempt.)*

## Scope

1. `ABC-209`'s Scope, re-implemented on the post-1b, ~~post-T1/T2~~ base (the old branch is a reference, not a rebase):
   kept across the moves of one game; cleared on a new game (`ucinewgame`, a non-continuing `position`, the CLI's new
   game); the clear door (`ADR-0026` d10) reproduces today.
2. ~~Whatever the depth-preferred rule of `ABC-237` needs for entries from an older search (an age or generation field,
   if its ADR names one).~~ *(2026-11-02: moot, T2 is out.)*
3. *(2026-11-02, `bapm-phase1-pause`.)* **`ABC-238`'s rule and doors, carried:** `tableCutoff` accepts a stored depth
   ≥ the requested depth with the bound rules unchanged, behind `ADR-0058`'s test-only off-door pair (d3, d4); code
   reference `grugops/ABC-238` `3abaefdd`, re-implemented on this ticket's base.

## Out of scope

- Table size (`ABC-258`). Buckets. A UCI `Hash` option. Any eval or search change. *(2026-11-02:)* Depth-preferred
  replacement (`ABC-237`, parked with `ABC-258`).

## Acceptance criteria

- **A1–A5, A7:** as `ABC-209`'s page (fresh game node-equal to base; cleared when it must be; ≥ 1 kept entry probed on
  the next move; `NFR-009` size and growth, including `heapUsed` ≤ 1 MiB over a 40-move game; `G1`, `G4` with the clear
  door, `G5`, `G6`, `G8`, `G9`; the ADR records that it was reported to the owner), re-read at refinement against the
  base this ticket is written on.
- **A6 (the reading, replacing `ABC-209`'s S1).** *(2026-11-01, the owner's rule, `bapm-100-400-rule`; replaces the smoke pair and the SPRT this row named.)* One 100-game read at 100 ms a move before the merge (`EPIC-011` § The per-change rule): the candidate head rebased on `main` against its merge-base, self-play, openings 1–50 with both colours, one game at a time, through `ABC-255`. 100 of 100 games complete, the candidate makes 0 faults and loses 0 games on time at the 50 ms margin, and the score meets `ADR-0056` C2′ (merged `94f1504c`): ≥ 50.0 of 100 for a GAIN, ≥ 43.0 for a NEUTRAL, the intent declared at design. A miss is NOT MET and is not re-played. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error. A miss of the pass line closes the ticket; it is not re-tuned without the owner's word. *(2026-11-01, `bapm-owner-answers`, the owner's answer 3.)* **And the Stockfish smoke beside it:** 10 games, the candidate at 0.5 s a move against Stockfish 19 `UCI_LimitStrength`, one game at a time, through `ABC-255` (`EPIC-011` § The per-change rule): 10 of 10 complete, 0 faults, 0 losses on time, and S-4 at E 1 650: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of 20 (`ADR-0056` S′; `skytalix` `timemargin` 50 ms; `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`) *(was the fold's bar, `UNKNOWN - verify`; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. *(2026-11-01, `bapm-reconcile-adr0056`, `ADR-0056` R-TC part 2: the owner's "works on different difficulty settings".)* **And the Levels deep lane on the candidate head:** `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE, host alone, beside the 100-game read (≈ 9 min): exit 0 with every test passed (~~41 at `ADR-0056`'s count~~ *57 at `EPIC-010`'s close read, 577 s, `qe-EPIC-010-close` `…388b3044`*; QE counts its own run). A failure is a defect, back to the Software Engineer.
- ~~**A8 (it pays where it should).** On a 10-move sequence of one game at a fixed depth (QE fixes both before the first
  build; a 40/15 move is not a lane row), the summed nodes of moves 2–10 are ≤ 0.90 × the clear door's.~~
  *(2026-11-02: replaced by A8′; on the dev set T1 + T3 read 0.874× / 0.931× / 0.922× per game, `…c0e9f5a0`.)*
- **A8′ (the pre-registered mechanism bar, on held-out lines; `…64e95bfa` item 3).** **Given** three 16-ply lines from
  `position-3`, `position-4` and `position-5`, each played by `main`'s `chooseMove` at `maxDepth` 6, **when** the
  engine side (plies 0, 2, …, 16) is searched at fixed depth 8, the head with T1 on and the table kept across the
  game's searches, the door `main` (cleared per search, exact depth), **then** the summed nodes of searches 2–9, pooled
  over the three games, are **≤ 0.93 ×** the door's, **and no game is above 1.00 ×**. A line that ends early counts the
  searches it has. Not loosened and not re-played; a miss closes the ticket and ends the strand. (P(pass | true
  0.905×) ≈ 0.7, estimate.)
- **A9 (value safety, carried; 2026-11-02).** The analogues of `ADR-0058` F1–F3 and F6 on the combined head: the door
  node-equal (F6); the drift and mate-sign rows of `ABC-238` A3 (F1, F2); no repetition row red on the shipped path that
  no recorded re-pin explains, and the probe not moved above a repetition check (F3). Each a defect, back to the
  Software Engineer.

## NFR triggers

- **`NFR-009`:** A4 (unchanged 4 MiB; growth over a game ≤ 1 MiB). **`NFR-005`:** `G6`. **Security:** none.

## Test notes

1. The clear paths are lane rows on the virtual clock; A8 is a fixed-depth row under `ENGINE_DEEP=1`.
2. UAT is owed (production lines). The QE verdict signs it.

## Size and priority

- **Size: ~~S~~ M** (`ADR-0056`: "S (code exists)"; *2026-11-02: M, because `ABC-238`'s rule, its two doors and the
  re-pointed rows (`ADR-0058` d5) now travel with it; both codes exist as references, `bb6cf451` and `3abaefdd`*).
  **Priority: P3.**

## Dependencies

- ~~`ABC-238` and `ABC-237` merged or closed (same file, `src/transposition.ts`; the precondition this re-try rests on).~~
  *(2026-11-02: `ABC-238` closed unmerged, its rule now travels here; the `ABC-237` dependency is dropped.)*
- *(2026-11-02, `bapm-phase1-pause`.)* **The trigger (owner):** yes to the C2′ NEUTRAL-bar question, or a longer-control
  read allowed. On a yes to C2′ the intent is NEUTRAL (≥ 43.0 of 100) plus A8′; on a longer read its control and bar
  are his word. Neither is assumed here.
- **Architect:** re-read the accepted `ADR-0025` d4 amendment on the new base and give it its in-force line at merge.
  *(2026-11-01, `bapm-phase1-wording`, carried from `arch-epic011-phase1` `…1dcdd8c7`; named, not decided.)* **This
  ticket's design owes three re-checks:**
  1. `ADR-0058` d7's pre-root repetition argument holds **within one search only**; the prior keys grow between
     searches, so a kept entry must be re-argued (or shown harmless) across moves.
  2. The 2026-10-26 `ADR-0025` d4 amendment's line "an entry cuts only at its exact stored depth … never wrong, only
     possibly useless" is **false once `ABC-238` lands**; the re-read restates it.
  3. ~~Depth-preferred replacement with no age (`ADR-0025` T2 amendment) lets deep entries from earlier moves hold their
     slots for the rest of the game: **an age rule, or a measured statement that none is needed.**~~ *(2026-11-02:
     moot without T2, `…64e95bfa`.)* An age field could
     only take bits from the 13-bit depth field, a layout question for `ADR-0057` (Scope 2).
- **Owner:** none new (the amendment is his, accepted 2026-10-26). Q-3K-2 only shapes A6. *(2026-11-01: answered, no SPRT; A6 is the 100-game read.)*

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0056` T3; `ABC-209`'s record |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ ~~S~~ M |
| 4 | testable, measurable acceptance | ✅ carried rows plus ~~A8's 0.90 ×~~ *2026-11-02: A8′'s pre-registered ≤ 0.93 ×, no game > 1.00 ×, and A9* *2026-11-01 (`bapm-reconcile-adr0056`): plus the 0.5 s smoke (S′, E 1 650, S-4) and the Levels deep lane (exit 0, every test passed) in the reading row. Score unchanged.* |
| 5 | dependencies known | ✅ *2026-11-02: the owner's trigger; `ADR-0058` as base* |
| 6 | NFR triggers with targets | ✅ `NFR-009` growth ≤ 1 MiB |
| 7 | test notes | ✅ |
| 8 | size | ✅ ~~S~~ M *(2026-11-02)* |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ ~~`ABC-238`, `ABC-237`~~; ~~`EPIC-011` not started~~ *(started 2026-11-01)*; ~~the three re-checks above~~ *2026-11-02: PAUSED on the owner's trigger (C2′ yes, or a longer read); re-checks 1–2 (re-check 3 moot)* |

**DoR 8/10** (row 4's carried rows are re-read at refinement). ~~**Backlog.**~~ **Backlog, PAUSED** *(2026-11-02, `bapm-phase1-pause`)*.
