# arch-post-269: records changed and lines owed. `ADR-0064` (IN FORCE status, four log rows, the `QE-269-g` wording line), `ADR-0067` (d8's A5 PREREG line, an F8 pointer, a log row) and `ADR-0056` (status fold with the S′ pool, D6's R1–R3 ruling, a D5 pointer) were edited. Owed: BA/PM (the `ABC-273` page and a new `tools/` ticket, `EPIC-011`'s S′ pool row, R1 / G2, and `ABC-274`'s A5 fold) and the Orchestrator (placing the harness ticket and R1 before the next strength merge). Owner items stay pending, and none is added

Architect/Design, task `arch-post-269`, records only, on `grugops/arch-post-269`. No `src/`, `tools/` or `plans/` file was edited (fence: `memory-bank/50-decisions` plus this task's records).

## Files edited
- `memory-bank/50-decisions/ADR-0064-…md`: the § Status IN FORCE block (old block kept), four decision-log rows, and a dated `QE-269-g` line under the F3 block.
- `memory-bank/50-decisions/ADR-0067-…md`: a dated line in decision 8 (A5's PREREG content, `QE-269-f` / `-g`), a dated pointer in F8's row, and a decision-log row.
- `memory-bank/50-decisions/ADR-0056-…md`: a § Status "Folded 2026-11-03 (`arch-post-269`)" block (E1 in force; the S′ pool; R1 pointer), D5's "`r` at 100 ms … cut with A0" given a dated "pulled forward" line, and D6's dated R1–R3 ruling.
- No NFR file or catalog line changed. `NFR-001` (`G2`) and `NFR-005` (`G6`) are cited only.

## Owed: BA/PM (`bapm-269-done`, or the next records hop)
1. **`ABC-273`:**
   - DoR row 10 → ✅, citing `ADR-0056` D6's dated line of 2026-11-03.
   - Scope 2's "exact command `UNKNOWN - verify`" → the command in that line.
   - Dependencies: add the new `tools/` ticket.
   - R1-A2: the command line as run must show both environment variables set (paths redacted).
   - The page stays Backlog until the tools ticket merges, then the Orchestrator places it.
2. **A new ticket (S, P3, `tools/` only):** `r` accepts `--budget-ms 100` (Stockfish `st=0.1`, `timemargin=2000`; skytalix `st=0.1`, `timemargin=50`). At 100, `--elo` above 2 600 is refused. Every other argv and dry-run stays byte-equal. Acceptance: one dry-run row and 0 lines under `src/`. It is `ABC-255` item 2 narrowed to `r`.
3. **`EPIC-011`:**
   - § Close-out, the S′ pool row: "E 1 810: `qe-ABC-269` 7/3/0, merged `54dee3f2`. 7.0 / 10 = 70.0 %, below 30 games, no step."
   - § The owner's answers, "Still open … R1–R3": ruled (survive, 100 ms).
   - § Phases: the R1 row gets the harness ticket; R2 and R3 rows read "C4's 100 ms reading".
   - G2: the milestone readings are R1–R3 at 100 ms, so G2 is no longer waiting on a ruling. *[proposed]* stays the owner's.
   - Row E1: DONE, with `ADR-0064` in force.
4. **`ABC-274`:** A5's line cites `ADR-0067` d8's dated line of 2026-11-03 (the spread stated ahead of the reading, the round order in words, and the bar unchanged).

## Owed: the Orchestrator
- Place the harness ticket and R1 before the next strength merge (`ABC-239`, `ABC-270`, `ABC-271` or `ABC-272`). `ABC-274` is value-identical and does not stale R1. If one merges first, R1 reads that `main` and names it (`ABC-273` scope 1).
- `QE-269-j`: a line in the QE brief template or the runbook naming `CUTECHESS_CLI` and `STOCKFISH`. It is not in this task's fence. The R1 command in `ADR-0056` now spells both.
- Make sure A5's PREREG is sealed by QE before any timing of `ABC-274`. The `se-ABC-274` brief already says "NO timing reading".

## Owner items: unchanged, all pending
- `ADR-0067` acceptance, Q-3K-6, Q-3K-7 (a) / (b) / (c), Q-3K-8, Q-3K-9 and B-T8.
- This task adds none. R1 is under 1 h by estimate. The two conditional asks (QE's estimate over 1 h, or a band-rule step) are written in `ADR-0056` D6.
