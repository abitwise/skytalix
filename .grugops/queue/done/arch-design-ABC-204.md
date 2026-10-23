---
subtask: arch-design-ABC-204
role: architect-design
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/arch-design-ABC-204/
width: 2 (beside qe-ABC-203; records + light probes)
---

# Design ruling for ABC-204 (rating harness) before the build

## Do
- Answer the page's five Architect questions and write a dated `## Design ruling` section on the ABC-204 page. Short probes allowed (a handful of cutechess games, Stockfish `UCI_Elo` range check) — no long readings; the baseline R and A/A D are the build's.
- **STOP rule:** if your ruling needs a NEW ADR, or changes/reverses an accepted one, write it as **proposed** (never accepted) and report it — a new ADR is always the owner's (delegation `…5aaf7cec` item 3; `…3898cd9a`). Any NFR bound move is the owner's too.
- Recommend the next move.

## Fences
- Work on `grugops/arch-design-ABC-204` (worktree `../wt-arch-design-ABC-204` from `main`). Only the ABC-204 page, a proposed ADR if needed, and your notes. No `src/`, `tools/`, `package*.json`, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design204/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-design-ABC-204`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: the five questions are ruled on the ABC-204 page (`## Design ruling`, 2026-10-23). No ADR is needed, and none was written. The STOP did not fire, and no NFR bound moves** (Architect/Design, 2026-10-23).

- **Branch:** `grugops/arch-design-ABC-204` @ `0a40fdab`, two commits on `main` `36a4902e`: `f69f94fd` (the ruling) and `0a40fdab` (the notes). Records only.
- **Probes:** light, in `design204/`, on a host that was not quiet. None is a reading.

- **Q1, clock.** `skytalix` runs at `st=3 timemargin=2000`. It is sent `go movetime 3000`, so its budget is exactly 3 000 ms.
  - The margin is 5 000 − budget, so a forfeit means a move over 5 s, which is an `NFR-004` clause B breach.
  - The probe's gaps were median 3 004 ms and max 3 028 ms, with 90 of 99 over 3 000 ms. A margin of 0 would forfeit almost every move.
- **Q2, Stockfish.** Pins: `st=0.5 timemargin=2000 restart=on`, `Threads 1`, `Hash 16`, `UCI_LimitStrength true`, start E 1650.
  - Why 0.5 s: under a skill limit, SF19 fixes its move at depth 1 + int(level), which is 3 at E 1650 and takes 4 ms (`sf_19` source). Extra time adds only wall time. A PGN depth guard is set for QE.
  - The calibration `UNKNOWN` is resolved: 120s+1.0s, anchored ±100 to CCRL Blitz (`a08b8d4e`).
  - `A4`'s single E move is ruled as E + X, rounded to 10 and clamped, or ±400 if X is infinite.
- **Q3, adjudication.** No score-based adjudication: no `-resign`, `-draw`, `-tb` or `trust`. Only `-maxmoves 200`, and no `-recover`.
  - `skytalix`'s evaluation is what the epic changes.
  - SF's limited-strength scores do not describe the move it plays (probe PGN).
- **Q4, concurrency.** R runs at 2, about 4.7 h for 200 games (estimate). D runs at 3.
  - D at 3 000 ms is expected not to fit 8 h.
  - The D budget B is pre-ruled. B is the largest value in {3000, 2500, 2000, 1500, 1000} for which `A5`'s median game wall gives 400/3 × median × B/3000 ≤ 8 h. If none fits, the ticket STOPs to BA/PM.
- **Q5, openings.** Source: the five TSVs at `a6189a30`, sha-checked.
  - Positions at plies 4–8 are keyed by four-field EPD. Terminal positions are dropped, and each position counts at its lowest ply.
  - The top 20 per ply by sha256(`"ABC-204/openings/v1\n"` + EPD) give 100 positions.
  - The probe file's sha256 is `0d7f7a72678cbf54c2c309dc5d664e7aac5de2c15bc54fe4247a437f51e82666`, the same on 2 runs. The SE's generator must reproduce it.
  - Play: `-repeat -games 2`.
- **Build shape.**
  - TypeScript: `tools/rating/rating.ts`, `openings.ts` and `openings.epd`. Engines use `restart=on`. Output keeps `-debug all`.
  - **`A3` clarification:** one `tools/rating/**/*.ts` line in **both** `tsconfig.json` and `biome.json`. Without the `biome.json` line, lint never reads the harness.
  - Recommended for `A7`: commit `.out.gz` (about 6 MB per R).
- **NFR observation for Security/NFR (no bound moves).** The tool-measured gap includes pipe latency and reached 3 028 ms, against `AR-NFR004-A`'s 31 ms. Over about 20 000 moves per reading, a gap above 3 031 ms is likely. It is reported, not graded.
- **Next move.**
  - `In Design` → `Ready for Dev`, then `In Development` with the SE, then QE for `A4`–`A6` at width 1.
  - The `A3` `biome.json` line and the E-step rule are flagged as cheap-to-reverse delivery calls (BA/PM or the Orchestrator).
  - Merging is the Orchestrator's.
- **Notes** (in `.grugops/context/arch-design-ABC-204/notes/` on the branch; sealed by grugops 2.1.0 `admitAndAppend` with an explicit worktree context root; read back as 2 notes, index rendered):
  - `20261023T205749Z-architect-design-observation-3e30889d`;
  - `20261023T205749Z-architect-design-decision-13faedbc`.
- **Not touched:** `src/`, `tools/`, `package*.json`, `tsconfig.json`, `biome.json`, the board, the trace, `plans/nfr-catalog.md`, and ABC-203's files. No column moved. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-204 (arch-design) | Architect/Design ruling: skytalix st=3 timemargin=2000 (forfeit only past the 5 s ceiling); Stockfish st=0.5, Threads 1, Hash 16, LimitStrength, start E 1650, E-step E+X; no score adjudication, -maxmoves 200; concurrency R 2 / D 3 with a pre-ruled D budget B; 100 EPDs by stratified sha256-ranked pick (0d7f7a72…); TypeScript under tools/rating/, A3 clarified (+1 biome.json line); no ADR, STOP not fired | EPIC-008 | R, D (M1, M2) | NFR-004 / AR-NFR004-A (tool gap 3 028 ms, reported); NFR-008 untouched; NFR-012 untouched; ADR-0044 D4, ADR-0023, ADR-0037 D1(g) followed | `grugops/arch-design-ABC-204` @ `0a40fdab` (records only)<br>`.grugops/context/arch-design-ABC-204/notes/` (…3e30889d, …13faedbc) | records only; scratchpad probes: SF19 options and depth, sf_19 source, 2 cutechess games at the R pins, opening-draw sha twice | — | — | In Design → recommend Ready for Dev; merge is the Orchestrator's |
