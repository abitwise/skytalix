---
id: ABC-255
title: "M0: a self-play SPRT lane on the rating harness that stops H1 on a known gain and H0 on an identical pair (tools only)"
status: backlog
column: Backlog
size: M
priority: P1
epic: EPIC-011
---

# ABC-255: the SPRT lane (M0)

> **Cut 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`; nothing run, built or
> timed). Source: `ADR-0056` D2 row M0 ("SPRT self-play lane … none — new ticket"), D5 § Per-change measure, D8 ("On
> Q-3K-2/3: the M0 ticket (`tools/` only; acceptance: an SPRT run on a known +gain pair such as `ABC-208`'s … terminates
> H1, and on an identical pair terminates H0)"). `EPIC-011` Phase 0, pull 1. **Starts after `EPIC-006`, `EPIC-009` and
> `EPIC-010` close** (owner, 2026-11-01, `…022fb66f`).

## Problem

- **User:** the owner and every later `EPIC-011` ticket.
- **Pain:** the climb toward 3 000 is made of changes worth +5 to +40 Elo each, and no instrument on record sees them:
  the smoke pair sees ≈ 250 Elo collapses, a 200 + 200 R pair resolves ± 78, and `EPIC-008`'s 800-game D resolved
  ± 16–23 at ≈ 34 h (`ADR-0056` § The measurement problem). Two outside point estimates in a row were negative, and no
  reading could say which change caused them.
- **Value:** a sequential test that stops as soon as the evidence is enough: early on a clear gain or loss, later on a
  small one, so each change is kept or dropped on evidence and not on a guess.

## Scope

1. **An `sprt` mode in `tools/rating/`** (beside `r`, `d`, `rpair`): candidate against base, self-play, through
   `cutechess-cli` 1.5.1's own SPRT, with `elo0`, `elo1`, `alpha`, `beta` as flags. Defaults: `[0, 5]` for a gain and
   `[−5, 0]` for a simplification or speed change (`ADR-0056` D5), `alpha = beta = 0.05`. **No Elo or LLR maths in
   repo code** (`ABC-204` § Out of scope, kept). A games cap, after which the run reports INCONCLUSIVE.
2. **The routine control** selectable in `sprt` and also in `r` / `rpair` (so `ABC-256` and the milestone readings
   need no further `tools/` change): a fixed time a move (down to 0.5 s, the owner's floor), a clock (for example
   10 s + 0.1 s), or fixed nodes. The default is the one the Architect's fold of `ADR-0056` names
   (`arch-adr0056-owner-fold` item 3).
3. **An opening set large enough for thousands of games:** today's `tools/rating/openings.epd` holds 100 positions, and
   at fixed nodes a deterministic pair would replay the same 200 games. A larger set (size named at design, at least
   1 000 positions), drawn from the in-repo CC0 book source (`ADR-0023`) as `ABC-204` drew the first, committed with
   its sha256.
4. **The run's records:** PGN, the `cutechess-cli` log with its SPRT lines, the host log (load, Tctl, frequency) as
   `ABC-225` writes it, and `SHA256SUMS`, in a directory the caller names outside the working tree.

## Out of scope

- Any change to `src/`, `data/`, `vitest.config.ts`, or the existing `r`, `d`, `rpair` defaults (the owner's rule and
  every past reading keep their pins).
- Deciding whether SPRT grades merges: that is **Q-3K-2**, the owner's. Until he answers, this lane reports and grades
  nothing.
- Width above 1 by default: **Q-3K-3**. `--concurrency` exists (as in `r`/`d`) and defaults to 1.
- A second harness, `fastchess`, or any new binary. If the pinned `cutechess-cli` 1.5.1 lacks `-sprt`
  (`UNKNOWN - verify` at design), the Architect rules, and a new binary is a download question for the owner.

## Acceptance criteria

- **A1 (the mode).** `node tools/rating/rating.ts sprt <candidate-sha> <base-sha> <out> [--elo0 E0] [--elo1 E1]
  [--alpha A] [--beta B] [--control …] [--max-games N] [--concurrency C] [--dry-run]` (flag names fixed at design).
  `--dry-run` prints the `cutechess-cli` argument vector, and it carries `-sprt elo0=… elo1=… alpha=… beta=…`, the
  control, the opening file with both colours, and `-concurrency C`.
- **A2 (known gain → H1).** **Given** candidate `b5c67ab7` (`ABC-208`'s merge: null move, D GAIN +38.4 ± 23.3) and base
  its first parent, at the default control, `[0, 5]`, width 1, **then** the run stops with **H1 accepted** within the
  games cap. QE reports games to decision, the final LLR line and the score.
- **A3 (identical pair → H0).** **Given** candidate = base = `main` at the hop, the same bounds and control, **then**
  the run stops with **H0 accepted**. An H1 here is re-run once (alpha = 5 % allows one false H1 in twenty); a second H1
  is a defect.
- **A4 (throughput, the number `ADR-0056` lacks).** QE reports games per hour at the default control at width 1, and
  games to decision in A2 and A3, so a typical test's host hours are read, not guessed (`ADR-0056` D5: "≈ 10–30 h
  (estimate)").
- **A5 (both bound sets).** `--dry-run` with `--elo0 -5 --elo1 0` prints those bounds; a unit row pins both defaults.
- **A6 (openings).** The new opening file has ≥ 1 000 distinct positions (no two FENs equal), each legal and not over
  (a unit row reads them through the rules core), sha256 recorded; `r`, `d` and `rpair` still default to the 100-position
  file (their `--dry-run` output is byte-equal to base's).
- **A7 (gates).** `npm run lint`, `typecheck`, `test`, `build` green at every commit. New lane rows ≤ 0.1 s (`G8`
  ≤ 10 s). `git diff` touches `tools/rating/` and its tests only.
- **A8 (the reading).** A `## Reading` section on this page with A2, A3 and A4, and QE's sealed note.

## What happens on a miss

- **A2 stops H0 or INCONCLUSIVE:** the lane cannot see a known +38; QE records a `failed-attempt` note, and the
  Architect re-reads the control (a short control may flatten the gain). Not merged until A2 passes.
- **A3 stops H1 twice:** a defect in the pairing or the openings. Back to the Software Engineer.

## NFR triggers

- **`NFR-008`:** ≤ 0.1 s of new lane rows; the run itself never enters `npm test`.
- **Host:** each A2/A3 run is ALONE (heat log as `ABC-225`). **Security:** builds only the SHAs it is given, as
  `ABC-204` does; no new input path in the engine.

## Test notes

1. Unit rows: argument vector (`--dry-run`), bound defaults, opening-file validity.
2. A2 and A3 run in QE's scratch clone, ALONE; cost `UNKNOWN - verify` (that is A4's point).
3. No UAT: tools only (as `ABC-225`, `ABC-247`).

## Size and priority

- **Size: M.** One mode, one control flag on three modes, one opening file.
- **Priority: P1.** Every later ticket in `EPIC-011` is graded on it if the owner says yes to Q-3K-2, and the milestones
  need its control.

## Dependencies

- `ABC-204` (the harness) and `ABC-225` (the host log) Done. `EPIC-010` closed (the owner's order).
- **Architect:** the default control (fold of `ADR-0056`); confirms `-sprt` on the pinned binary at design.
- **Owner:** Q-3K-2 (its use as a gate), Q-3K-3 (width). Neither blocks the build.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `ADR-0056` § The measurement problem |
| 2 | scope and out-of-scope | ✅ |
| 3 | INVEST | ✅ M; independent of every engine ticket |
| 4 | testable, measurable acceptance | ✅ H1 on a known pair, H0 on an identical pair, distinct-FEN count, byte-equal dry runs |
| 5 | dependencies known | ⚠️ the default control is the Architect's fold (in flight); `-sprt` on 1.5.1 `UNKNOWN - verify` |
| 6 | NFR triggers with targets | ✅ ≤ 0.1 s lane |
| 7 | test notes | ✅ |
| 8 | size | ✅ M |
| 9 | priority | ✅ P1 |
| 10 | no major unresolved blocker | ❌ waits `EPIC-006`/`009`/`010` closing (owner's order) |

**DoR 8/10. Backlog.**
