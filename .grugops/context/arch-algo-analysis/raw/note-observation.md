# Architect/Design, arch-algo-analysis: what `src/` holds at `bae25131` (search and evaluation inventory), what the records say was tried, and the outside facts the 3 000 answer rests on

Read from `src/` and the records at `main` `bae25131`; web read 2026-11-01. Full tables with file:line in ADR-0056 § Context.

## Search (`src/search.ts`, `src/engine.ts` — two recursions, one algorithm, held by the `ABC-078` identity sweep)
- Fail-soft negamax alpha-beta; iterative deepening (depth 1 unabortable, clock every 1 024 nodes, aborted iteration discarded; `engine.ts:170`, `:698-760`); PVS (`search.ts:570-648`).
- LMR: 1 ply flat, index ≥ 3, depth ≥ 3, quiet, not in/giving check (`search.ts:307-336`). Null move: R = 3 fixed, off at root/after null/depth < 2/in check/< 3 non-pawn pieces, no verification (`:338-374`).
- No aspiration (`engine.ts:96-98`), no futility/RFP/razoring/LMP, no check extension (`ADR-0051` not in force), no singular extension, no IID/IIR.
- Quiescence: MVV-LVA captures, all evasions in check (none = mate), quiet queen promotions, stand pat, cap 8, no TT; no delta pruning, no SEE, no quiet checks (`quiescence.ts:40-44`, `:132`, `:169-221`).
- Ordering: hash move > MVV-LVA captures/promotions > 2 killers > generation order (`search.ts:163-243`). No history, countermove or SEE.
- TT: 2^18 × 16 B = 4 MiB, cleared every `chooseMove`, always replace, **cutoff only at exactly the stored depth** (`transposition.ts:17-33`, `:79-87`, `:163`), mate scores ply-adjusted.
- Repetition in-tree and two-before-root (`ADR-0054`); 75-move and dead position at the leaf (`gameend.ts:206-211`).
- Time: fixed per-move budget or a clock share; no soft/hard limit, no doomed-iteration test, no partial-iteration use (`uci-session.ts:216-217`, `:295-320`).
- Board: 0x88, object moves, make/test/unmake legality (`legal.ts:69-83`); 0.63–0.90 M nodes/s (`qe-ABC-240` `…19068f9d`).

## Evaluation (`src/evaluate.ts`) — nothing tapered, nothing tuned
- Material P100 N325 B325 R500 Q900 (`:46-54`); one rule-derived PST per piece (`:66-148`; rook +20 on the 7th only; king table prefers b1/g1 in every phase).
- Doubled −15, isolated −10 (pawn-mask memo), passed by rank only 0/5/10/20/35/60/100 (`:188-214`, `:333-436`).
- King safety = pawn shelter / half-open / open file only (`:222-224`, `:282-313`). Mobility 4 cp a square, all pieces alike, clamped ±100 (`:232-233`, `:527`).
- Absent: bishop pair, rook files, outposts, threats, tempo, backward/connected pawns, passer king distance, endgame scaling, king-zone attacks, incremental eval.

## Tried (records)
- `ABC-205` dropped on `G6` "≥ base" (position-6 depth 7 vs 8), D never run. `ABC-207` dropped, D LOSS −18.3 ± 16.5. `ABC-209` dropped, D NEUTRAL +8.7 ± 18.3, **read under exact-depth TT cutoffs**, code on `bb6cf451`. `ABC-210` dropped, D NEUTRAL −4.8 ± 16.2 (horizon form only). `ABC-208` Done, D GAIN +38.4 ± 23.3. `ABC-215` Done, D NEUTRAL +15.6 ± 23.8. EPIC-008 close R −82.9 ± 73.8; EPIC-010 milestone 1 batch −58.3 ± 77.9 (NOT LOSS).
- EPIC-010 Backlog `ABC-231`…`ABC-239`: all standing, DoR 8–9/10, none started; waits as on their pages (ADRs, `ADR-0024` d4 evidence for `ABC-234`, `ADR-0048` data + method ADR for `ABC-239`). The SA's verification (`sa-ideas-verify` `…306a4012`) agrees with this reading of the code.

## Outside facts (web, informal; sources in ADR-0056 § Sources)
- tomitankChess 4.0 (pure JS, before its NN in 5.0): 2 820 ± 27 CCRL 40/15 (2020-05-02). Author: "In C language … would be over 2900".
- Blunder (Go HCE) changelog: v5 2 038 CCRL → ≈ 2 700 by v8.5.5; self-play gains per version, e.g. 7.1 LMR + futility + SEE +115.6 ± 25.1, 6.0 RFP + history +80–100, 7.5 LMP ≈ +30, 7.6 +82.6 ± 20.8.
- Texel's tuning (CPW): +99.6 in seven steps, 32 000 games each at 1 s + 0.08 s, on ≈ 8.8 M positions from its own games.
- Stockfish 11 (last HCE) ≈ 3 430 CCRL 40/15 1 CPU; Fruit 2.1 ≈ 2 695 (list snapshots; exact post `UNKNOWN - verify`).
- Lichess database exports: "released under the Creative Commons CC0 license".
- Stockfish 19 `UCI_Elo` 1 320–3 190, "calibrated at … 120s+1.0s and anchored to +- 100 Elo to CCRL Blitz"; limited play picks at depth 1 + level (quoted from `ABC-204`, read at `sf_19`).
