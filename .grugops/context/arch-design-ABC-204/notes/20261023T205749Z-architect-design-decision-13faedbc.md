---
id: 20261023T205749Z-architect-design-decision-13faedbc
kind: decision
by: architect-design
at: 2026-10-23T20:57:49Z
verified_by: 
confidence: high
refs:
  - ABC-204
  - EPIC-008
  - ABC-202
  - NFR-004
  - NFR-008
  - NFR-012
  - AR-NFR004-A
  - ADR-0044
  - ADR-0023
  - ADR-0037
  - ADR-0036
  - plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
  - 20261023T203657Z-ba-pm-observation-81e021ac
  - 20261023T203717Z-ba-pm-decision-8c3b2f47
  - 20261023T195538Z-orchestrator-decision-3898cd9a
  - grugops/arch-design-ABC-204
  - 20261023T205749Z-architect-design-observation-3e30889d
supersedes: 
seal: sha256:d25198fb934e9fb01b8e344e70328e9af9273f492b7b191ad91f8167f566b579
---

# Architect/Design: ABC-204's five questions are ruled; no ADR, and the STOP did not fire

**Branch.** `grugops/arch-design-ABC-204` (worktree `../wt-arch-design-ABC-204`, from `main` `36a4902e`). Records only: a dated `## Design ruling` on the ABC-204 page (commit `f69f94fd`) and these notes. The page holds the full reasoning, and this note is its index.

1. **Q1, `skytalix`'s clock.**
   - The pin: `st=3 timemargin=2000`. `go movetime 3000` reaches `uci-session.ts:213-214`, so the budget is exactly 3 000 ms.
   - The margin is 5 000 − budget, so a forfeit means a move over `HARD_CEILING_MS`, that is an `NFR-004` clause B breach. With margin 0, 90 of 99 probe moves would forfeit (max 3 028 ms).
   - A `tc` form was rejected: more state for the same budget.
2. **Q2, Stockfish.**
   - The pins: `st=0.5 timemargin=2000 restart=on`, `Threads 1`, `Hash 16`, `UCI_LimitStrength true`, start E 1650. Ponder stays off, and the other options keep their defaults.
   - Why 0.5 s: under a skill limit, SF19 fixes its move at depth 1 + int(level), which is 3 at 1650 (4 ms). Extra time only costs wall time.
   - Guard: each Stockfish move's PGN depth must be ≥ 1 + int(level(E)), or the reading is UNRESOLVED.
   - The calibration is resolved: 120s+1.0s, anchored ±100 to CCRL Blitz (`a08b8d4e`). The reading stays on SF19's scale at the harness's time control on this host.
   - `A4`'s single move of E is read as E′ = E + X, rounded to 10 and clamped to 1320–3190. If X is infinite, E′ = E ± 400. These pins are frozen at `A4`.
3. **Q3, adjudication.**
   - No `-resign`, `-draw`, `-tb` or `trust`; `-maxmoves 200` only; no `-recover`.
   - Why: score adjudication would read `skytalix`'s own evaluation, which is what the epic changes. Stockfish's limited-strength scores do not describe the move it plays.
4. **Q4, concurrency.**
   - R is pinned at 2. Only `skytalix`'s strength depends on speed, so R keeps headroom on the 4 performance cores. The estimate is about 4.7 h for 200 games.
   - D is pinned at 3. Speed noise is symmetric there.
   - D at 3 000 ms is expected not to fit 8 h. B is pre-ruled: QE runs `A5` at 3 000 ms and concurrency 3, and B is the largest value in {3000, 2500, 2000, 1500, 1000} with 400/3 × median × B/3000 ≤ 8 h. `timemargin` = 5000 − B. If none fits, that is a STOP to BA/PM.
5. **Q5, openings.**
   - The five TSVs at `a6189a30`, sha-checked. Positions at plies 4–8 are keyed by four-field EPD, terminal positions are dropped, and each position belongs to its lowest ply.
   - Per ply, take the top 20 by sha256(`"ABC-204/openings/v1\n"` + EPD), giving 100 positions.
   - The file is `tools/rating/openings.epd`, sha256 `0d7f7a72…2666` (probe). The SE's generator `tools/rating/openings.ts` must reproduce it.
   - Play is `-repeat -games 2`, with R 100 rounds, A5 50 and D 200.
6. **Build shape.**
   - TypeScript `tools/rating/rating.ts`, `openings.ts` and `openings.epd`. `restart=on`. `skytalix` gets no `setoption`. `-debug all`.
   - **`A3` clarification:** one `tools/rating/**/*.ts` line in `tsconfig.json` **and** in `biome.json`. Otherwise `npm run lint` does not read the harness.
   - Recommended for `A7`: commit `.out.gz` (about 6 MB per R) and the PGN. That is QE's and the Orchestrator's call.
7. **NFR.**
   - No bound moves. `NFR-008` is untouched, and `NFR-012` is untouched.
   - Observation for Security/NFR: tool gaps include pipe latency, and the probe reached 3 028 ms against `AR-NFR004-A`'s 31 ms. A gap over 3 031 ms is likely somewhere in about 20 000 moves. It is reported, not graded.
8. **ADR.** None is needed. The instrument's pins live on the ABC-204 page, which `EPIC-008` points to. No accepted ADR is changed. `ADR-0044` D4, `ADR-0023` and `ADR-0037` D1(g) are followed as written. The STOP (`…5aaf7cec` item 3, `…3898cd9a`) did not fire.
9. **Next move.**
   - `In Design` → `Ready for Dev`, then `In Development` with the SE, then QE for `A4`–`A6` at width 1.
   - The `A3` `biome.json` line and the E-step rule are flagged as cheap-to-reverse delivery calls.
   - Merging is the Orchestrator's.

**Not touched:** `src/`, `tools/`, `package*.json`, `tsconfig.json`, `biome.json`, the board, the trace, `plans/nfr-catalog.md`, and ABC-203's files. Nothing was pushed or merged.
