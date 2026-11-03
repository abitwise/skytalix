# bapm-ABC-239-rulings: the `ABC-239` and `ABC-270` page lines after `arch-ABC-239-rulings`. No bar moved; DoR 10/10 on both

BA/PM, task `bapm-ABC-239-rulings`, records only, on `grugops/bapm-ABC-239-rulings` from `main` `4230d409`. Nothing run.
Sources: the Architect's rulings `arch-ABC-239-rulings/20261103T223637Z-architect-design-decision-2b428ce8` (§ 7, the next SE hop) and owed lines `…observation-c54dda72`; `ADR-0067`'s dated block of that task (below the bars table); the Orchestrator's rulings `orch-2026-10-30a/…decision-42c82347` (B-T4 pins) and `…decision-912ba57d` (B1 (e) retires whole).

## `ABC-239` (`plans/tickets/ABC-239-…`)
- **Top block** (newest first) and a front-matter `adr` pointer: `da3f8599` is not the fit of record; the fit is taken on a `main` with `ABC-270` (`ADR-0068` d7, with its decline/miss fallback).
- **A1:** the own-games set is six player names (`skytalix`, `base`, `skytalix-a`, `skytalix-b`, `sky-a`, `sky-b`), listed in the header; the 58 probe games enter. The six are BA/PM's reading of ruling (d) ("the prototype's `skytalix` / `base`" plus the four probe names = "those six names").
- **A4:** F3's bound (the red relation row as one linear inequality, margin ½ ‖a‖₁ + trunc + strict, so the integer set holds it by construction), the solve (projected Newton, active rows as equalities; no penalty, no freeze), and the one-refit procedure: box-only fit to scratch → relation rows of `src/evaluate*.test.ts` → red rows are bounds → refit once → candidate; a relation red on the candidate is NOT MET. The header lists each bound row (file, row, a, right side, μ).
- **A5:** `zugzwang.001` graded as written, e1f1 at depth 9, Given/When/Then; e1e5 is a safety failure (Stockfish 19 d26: −633 against mate in 10); no accept set, no re-pin, no depth change; read at step 6 and under B-T5.
- **§ What happens on a miss:** F3 (relation red on the candidate) and F4 (`zugzwang.001` not e1f1 at d9, after a defect check) are NOT MET, STOP to Architect/Design, both read at step 6 before any re-pin.
- **Test notes 6–8:** (6) pins and bars per `…42c82347` (pins re-pinned old → new in one PR table; zugzwang, mate floor, `G1`, identity gate and relations never; quiescence deep pins and `ORACLE_AT_DEPTH_3` only by re-running the oracle; lost fixture properties re-found under `ADR-0028` d2). (7) exactly two retired rows: the `differ` assertion of "only the king's square and the passers differ" (shape assertions kept, row renamed) and `ABC-269` B1 (e) whole; B1 (d) kept, its `mainCentreMinusCorner` literal a pin. (8) three `tools/tune` rows and the FEN source row; the tracer's queen-on features and K1 (c) count row.
- **§ Dependencies:** one wait, `ABC-270`'s merge; the tool commits `9eeb0314`, `03fcaaa0`; the next SE hop's steps 0–9 (from § 7); `EPIC-011` unchanged (no new phase or order, per `…c54dda72`).
- **DoR: 10/10, unchanged.** Rows 4, 5, 7 gain dated lines. Row 10 stays ✅: every ruling the first attempt needed is made and no owner question is open; the `ABC-270` wait is an ordered dependency with a written fallback. Blocked is the Orchestrator's column; `plans/board.md` not edited.

## `ABC-270` (`plans/tickets/ABC-270-…`)
- **Top block**, **K1 (e)** line (Given the test file, when read as text, then each phase-24 twin's FEN is one full string literal) and **test note 7** (why: `tools/tune` pins a bound row by a source row that finds its FEN literally). DoR row 7 gains the note. **DoR 10/10, unchanged.** No bar moved.

## Not done here
- `EPIC-011`: no line owed (`…c54dda72`: no new phase or order).
