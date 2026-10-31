# BA/PM rulings on tranche 2: T2-R ACCEPTED with five amendments and cut as `ABC-248` (S, P1, `EPIC-010`, test-only, DoR 10/10, after `ABC-246`); W1 given its word with four clarifications; `T-QEHOP-GROWTH` owes a QE re-read hop, not a ticket. No owner word owed

Records only, at `main` `209f4c5f`; nothing run, built or timed (QE holds the host ALONE). Records commit `60f08f49`.
The dated record is `ADR-0046` § BA/PM ruling 2026-10-31 (end of file) plus a § Status line. The ticket page carries
the conditions in full.

## T2-R (T2c + T2a narrow + T2d): ACCEPTED, cut as `ABC-248`
- **Why accept:** it is the only set sized to the noise reading (about −0.3 s against a lane centred near 9.5 s) with
  no default-lane coverage lost by construction, and each lever reverts alone. One ticket, not three: three ALONE gates
  for one −0.3 s remedy, and each part alone is below what one n = 3 `G8` resolves.
- **No owner word for moving rows out of the default lane:** D1 bound `ABC-177`'s remedy. The owner-accepted text names
  tranche 2 as O3 "for a BA/PM ruling" (D4; § Alternatives "O3 is tranche 2 if D4 misses"). T2a narrow is a strict
  subset of O3: six named rows, the existing `ENGINE_DEEP` branch, no new `AGENTS.md` line, parity first.
- **T2b not chosen:** about 0.1 s more for two `ADR-0050` guards with no other default-lane row. That trade is the
  owner's (framing (b)).
- **Amendments:** (1) the six T2a rows are named by title (movetime 100, white reads wtime, black reads btime,
  G = 3 500, a bare go, A5-b3), and titles stay byte-identical under an "[deep, ENGINE_DEEP=1]" describe; (2) the
  frozen mutant list names `WRONGSIDE` (level mode hands white `btime`, black `wtime`), the census's
  `UNKNOWN - verify`; (3) retitle word: `QE-208-a` states its sampled readings, `QE-208-b` names its new root, nothing
  else retitles; (4) T2d's census capped at two rows beyond A4-a2; (5) saving graded on nodes (strictly fewer per
  changed T2c/T2d row), `N8-LANE` ≤ 650 ms CPU on the two-file set, `G8` ≤ 10 s, design target 9.4 s not a fail bar.
- **`ABC-248`:** S, P1, `EPIC-010`, Backlog with DoR 10/10, recommended Ready. Pull order **after `ABC-246`** (same
  file). A1–A11; no smoke; UAT waived if zero production lines at delivery.

## W1: BA/PM's word given, with four clarifications (no level moves)
- **Why:** `ABC-245` head median 9.82 s against six runs pooled 9.51 s, and a head spread of 0.75 s. The 9.7 s line is
  inside one window's noise. W1 filters only the route to the owner; 10 s and D6 are unfiltered.
- **Clarifications:** (1) same tree, byte-identical; (2) median of six = mean of the 3rd and 4th sorted head walls,
  > 9.7 s routes, = 9.7 s does not; (3) second window held to the first's PREREG rules, re-run once if inadmissible,
  then the first reading routes alone (fail toward the owner); (4) not a merge gate: same QE hop if the window allows,
  else the next ALONE slot; an unconfirmed crossing is recorded with both medians.

## `T-QEHOP-GROWTH` (`ADR-0035` B3): a QE re-read hop is owed, no ticket
- B3 already defines the action: QE re-reads the set's `N8-LANE` at `main`'s tip on `qe-ABC-154`'s method. MET:
  Architect/Design writes it and sets the next threshold. NOT MET: owner.
- Nothing is built, so nothing is cut. ALONE, LOW, blocks no ticket, not folded into `ABC-248`'s gate (B3: "a changing
  ticket's own reading resets nothing"). Dispatch is the Orchestrator's. `main` holds 4 209 notes at `209f4c5f`.
