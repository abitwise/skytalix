---
id: ABC-225
title: "One command reads an interleaved R pair: base and candidate against the same Stockfish, in alternating blocks, with the opening-paired error and a host log"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-010
---

# ABC-225: an interleaved R pair in the rating harness

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 2,
> after the Architect's `arch-epic008-rd` (`…0c5d62f4`, `…9d172446`). **Waits in Backlog on the owner's Q4:** it is
> built only if he picks (b) or (c). Under (a) or (d) it is closed unbuilt.

## Problem

- **User:** QE/E2E, who reads every value-changing ticket under Q4 (b)/(c), and the owner, who reads the result.
- **Pain:** `tools/rating/rating.ts` has two modes, `r` (one build against Stockfish) and `d` (candidate against
  base). Two `r` runs back to back carry the fixed-order and drift confound that `EPIC-008`'s close carried
  (`EPIC-008` § close block, "Fixed order"). The tool reports cutechess's unpaired Y only; the opening-paired error
  read −82.9 ± 64.3 against the tool's ± 73.8 (`…9d172446` § 4). Host speed is not gauged by the opponent's nps.
- **Value:** one command, one pin set, the two builds read in the same window against the same opponent, with the
  confounds that `arch-epic008-rd` had to dig out of raw files reported up front.

## Scope

1. A third mode in `tools/rating/rating.ts`: `rpair <base> <candidate>`. Each build is read exactly as `r` reads it
   (Stockfish 19 at the frozen E = 1 910, `skytalix` at 3 000 ms, the pinned openings, both colours).
2. **Interleaving:** the 100 openings are split into blocks of 10 (20 games per build per block); blocks alternate
   base-first and candidate-first.
3. **Output:** per build, cutechess's `Elo difference: X +/- Y`; the pair's X₂ − X₁ ± √(Y₁² + Y₂²); and the
   opening-paired (pentanomial) difference and its 95 % half-width, labelled information.
4. **Host log:** Stockfish's median nps per block from the `-debug all` log, and a Tctl and busy-core frequency sample
   every 10 s (the `qe-epic008-q4c` sampler shape).
5. The tool's `summarise` checks (0 faults, games equal to pinned, raw files present) apply per build.

## Out of scope

- Moving any pin: E, openings, budgets, cutechess and Stockfish versions. A `tc=` clock mode (`EPIC-009`).
- `src/` and `data/`. `npm test` (`NFR-008`).

## Acceptance criteria

- **A1 (same pins as `r`).** **Given** `rpair` and `r` on the same build, **then** the cutechess argument vectors for
  that build differ only in `-openings` start/count and output paths (a dry-run print compares them byte for byte).
- **A2 (interleaving).** **Given** a dry run, **then** the printed schedule has 10 blocks per build, alternates order
  per block, and covers openings 1–100 exactly once per build with both colours.
- **A3 (the arithmetic).** **Given** two fixed cutechess outputs and PGNs from the records (`qe-epic008-close` r1
  and r2), **then** the pair difference reads −82.9 ± 73.8 and the pentanomial reads −82.9 ± 64.3 (± 0.1), as
  `…9d172446` § 4 computed.
- **A4 (faults).** **Given** one block with a fault (illegal move, disconnect, stall, time forfeit), **then** that
  build's reading is UNRESOLVED by `EPIC-008`'s states, and the pair is UNRESOLVED.
- **A5 (host log).** **Given** a real 2-block smoke run (40 games, ALONE), **then** the log has one nps value per
  block per build and ≥ 1 thermal sample per 10 s, and no absolute host path or username appears in any output file.
- **A6 (cost).** The smoke run's wall is reported, and the full pair's wall is projected from it (target ≤ 10 h at
  width 2, the R rate 44–46 games/h).

## NFR triggers

- **`NFR-008`:** no new file under `src/`; any tool test runs outside the default lane, as `ABC-204`'s did.
- **Security (ASVS L1):** two sha arguments, validated as `[0-9a-f]{7,40}` before any `git` call; no shell string
  concatenation. No host paths in outputs (`ADR-0049` d4).
- **Heat:** the smoke run is ALONE, on AC, with the thermal log.

## Test notes

1. A2 and A1 by dry run, no engines started. A3 offline from committed records. A5 is the only real run (≈ 1 h).
2. `tools/` only, no production line: no UAT. QE reads A5.

## Size and priority

- **Size: M.** One mode, a scheduler, a pentanomial computation, a sampler; `ABC-204` was M for the whole harness.
- **Priority: P2.** Under (b)/(c) every value-changing reading waits on it.

## Dependencies

- **Owner:** Q4 = (b) or (c).
- `ABC-204`'s host pins (re-pinned on this host). No ADR: `tools/rating/rating.ts` cites none, and this adds no
  engine behaviour. Architect/Design reviews the pentanomial formula at design.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `arch-epic008-rd`'s confounds |
| 2 | scope and out-of-scope | ✅ 5 items; no pin moves |
| 3 | INVEST | ✅ independent of every engine ticket; M; testable offline |
| 4 | testable, measurable acceptance | ✅ A1–A6, A3 against recorded numbers |
| 5 | dependencies known | ✅ Q4; `ABC-204` pins |
| 6 | NFR triggers with targets | ✅ `NFR-008` 0 lane files; input validation; heat |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ Q4 unanswered |

**DoR 9/10. Backlog**, until the owner answers Q4 with (b) or (c). Then Ready.
