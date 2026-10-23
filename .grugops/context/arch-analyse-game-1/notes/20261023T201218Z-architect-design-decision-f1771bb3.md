---
id: 20261023T201218Z-architect-design-decision-f1771bb3
kind: decision
by: architect-design
at: 2026-10-23T20:12:18Z
verified_by: 
confidence: high
refs:
  - arch-analyse-game-1
  - plans/uat/EPIC-006-game-1.pgn
  - plans/uat/EPIC-006-game-1.annotated.pgn
  - memory-bank/analysis/2026-10-23-game-1.md
  - f4eec73d
  - c5e14e12
  - EPIC-006
  - ABC-101
  - ABC-087
  - ABC-083
  - ABC-078
  - ADR-0031
  - ADR-0025
  - ADR-0026
  - ADR-0044
  - ADR-0045
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - 20261023T201218Z-architect-design-observation-c3fb9929
supersedes: 
seal: sha256:aae7c5c09f7806d9ddfeeac447949996c3f2aa10ef3684543c1a73300c8dab57
---

# Architect/Design: game 1 analysis published. skytalix lost to king safety its evaluation does not weigh, then to depth; eight ranked proposals for the owner, nothing cut

**What was published.** Branch `grugops/arch-analyse-game-1` at `c5e14e12`, one commit on `main` `f4eec73d`. Records only.
- **The report:** `memory-bank/analysis/2026-10-23-game-1.md`, owner-readable first. A new folder: the memory bank had no analysis folder, and the brief named this path.
- **The annotated PGN:** `plans/uat/EPIC-006-game-1.annotated.pgn`. It carries `[%eval]` comments, the `?!`, `?` and `??` NAGs, and Stockfish's line at each error. Its main line was checked token-equal to the source game (71/71). No movetext line starts with `[`.

**Findings.** The evidence is in the observation note sealed with this one.
1. **The decisive blunder, 13.d4??, is an evaluation scale error, not a depth error.** It is preferred at every depth 1-10. Stockfish's refutation lands about 20 plies out. The king-exposure term moves 35 cp where Stockfish moves about 360 (`src/evaluate.ts:189-191`, `:263-277`). The term has no queen or phase dependence (`src/evaluate.ts:187`).
2. **8.e5? and 10.Ne4? are depth-limited.** Depth 7 needs 1.3× and depth 8 1.9× the 3 s budget (`src/engine.ts:224-229`, `:497-521`). They are made worse by a mobility-heavy evaluation and a king table that charges nothing for a centre king (`src/evaluate.ts:121-130`, `:199-200`).
3. **17.Kc1? follows the king table.** The table rewards c1 and b1 as castled squares (`src/evaluate.ts:128-129`).
4. **4.Qa4?! comes from mobility weighting.** No term covers development or an early queen (`src/evaluate.ts:199`, `:355-356`, `:369`).
5. **29.Bd2 is a horizon miss in a lost position.** It allows mate in 8.
6. **Not causes:** the blunder draw (rate 0), the transposition table, move ordering and the book (minor only).

**Strength.** Hedged, about 1400-1900, centre about 1650, error at least ±300. One game is not a rating. Apple Chess played at ACPL 8, level unrecorded, so no claim is made for it.

**Ranked proposals.** These are proposals only. No ticket was cut and no ADR was opened.
1. **King safety scaled while queens are on, and a tapered king table.**
   - **Gain.** In this game, the probe fixed 721 of 1,428 cp.
   - **Cost:** S-M.
   - **Risk.** An `ADR-0031` addendum. The `A5` 1,100 ns eval bar and `NFR-005` need re-reading. The `A1`, `A2` and `A3` relations hold. `PUZZLE_DEEP=1` is the gate.
2. **A rating harness:** UCI against Stockfish with `UCI_LimitStrength`, outside `npm test` (`NFR-008`).
   - **Gain.** Measurability, about ±70 Elo at 100 games.
   - **Cost:** M, because no match runner is installed.
3. **A value-identical speed-up.**
   - **Where.** A double `legalMoves` at every leaf (`src/engine.ts:245` → `src/gameend.ts:137`, then `src/quiescence.ts:108`), all-moves generation in quiescence (`:107-110`), and the LMR gives-check make/unmake (`src/search.ts:262-264`).
   - **Gain:** +0.5 to 1 ply, `UNKNOWN - verify`.
   - **Risk.** `ABC-078` `A3` identity and `NFR-004` abort granularity must be kept.
4. **Mobility re-weighting per piece, plus a development or early-queen term.**
   - **Cost:** S.
   - **Risk.** The `A4` ±100 cap.
5. **Null-move pruning.**
   - **Status.** "None requested" (`src/engine.ts:69-71`).
   - **Risk.** An `ADR-0026` off door, an oracle, a new ADR and a zugzwang guard.
6. **The transposition table kept across moves.**
   - **Risk.** An `ADR-0025` decision 4 amendment and an `NFR-009` growth re-read.
7. **Check extension, or checks in quiescence.**
   - **Gain.** The probe showed none on this game.
   - **Risk.** It reverses `src/quiescence.ts:21-24`.
8. **A deeper English book.**
   - **Risk.** `NFR-006` (356,526 B against 1 MB).

**Follow-ups (INFO, nothing blocked).**
- **Orchestrator or BA/PM:** if the owner wants any proposal, cut it as a ticket. Proposal 2 is the enabler for tuning 1, 4 and 5 beyond one game.
- **UAT Planner:** record Apple Chess's level in the play-test log for later games.
- **Scribe:** `memory-bank/00-index.md` does not list the new `memory-bank/analysis/` folder.

**Not touched.** `src/`, tests, `package*.json`, the board, the traceability file, ADRs and NFR rows. No column moved. Nothing was pushed or merged.
