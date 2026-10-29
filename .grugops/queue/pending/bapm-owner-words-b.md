---
subtask: bapm-owner-words-b
role: ba-pm
ref: .grugops/context/bapm-owner-words-b/
branch: new grugops/bapm-owner-words-b from main, worktree ../wt-bapm-owner-words-b
---

# Fold the owner's EPIC-010 answers and ADR-0052 into the pages (records only)

## Read
- The owner's words: `orch-2026-10-29g/…278e149b` (they govern), including the Orchestrator's caveat on 10-game smokes.
- Your EPIC-010 notes (`bapm-epic010-improvements/…12cb550d`, `…5ada23af`, `…3461cdd9`, `…d8064488`).
- ADR-0052 (PROPOSED) and Architect `arch-epic009-settings/…fa9e821e`, `…04fdc439`, `…3b11f12e`.
- SA `sa-ABC-226/…cc53fc79`.

## Do
- **EPIC-010:**
  - Q4 = (e) extended: per value-changing ticket, a 10-game D smoke plus a 10-game R smoke (Stockfish, E = 1 910,
    3 000 ms), then batched major validation later. Write the merge rule exactly. State the caveat: 10 games catch
    crashes, time losses and collapses, not a loss of tens of Elo. Define how a trend across tickets plus the batched
    validation answers "did things get worse". Re-cost per ticket on this host, then re-cost milestone 1.
  - Q2 and Q5 answered and dated. The product goal ≥ 2 700 Elo is aspirational, with no ticket bound to it; name its
    scale as UNKNOWN - verify. A Rust rewrite is out of scope.
  - Q1 and Q3 stay open, with their defaults.
  - Re-check ABC-225's purpose (an interleaved R-pair command) under (e). Retire or re-scope it with a dated line;
    don't renumber.
  - Move the tickets whose only wait was Q4 to their next real wait. Re-score the DoR.
- **EPIC-004:** a dated amendment line. The "strength above ~1700" non-goal is removed on the owner's word, and the
  new product goal is stated (best vibe-engineered / TypeScript chess engine, ≥ 2 700 Elo aspirational, scale
  UNKNOWN - verify). Don't edit other non-goals: tablebases stay until Q1.
- **EPIC-009 / ABC-220..223:** reconcile to ADR-0052 as PROPOSED.
  - The `TimeMode` combo and the cutechess option lines.
  - simple-tournament budget `min(T, C)`, T = 22 000.
  - The uci-clock-mode rule and the 59.5 s budget.
  - The latency rows the ADR owes.
  - Their wait becomes "owner accepts ADR-0052 (OQ-0052-1)".
  - ABC-222/223 smoke size: keep 5 games, or align with the owner's 10? Owner's EPIC-009 word: "5 or 10". Pick one
    and say why.
- List the board lines you want in your decision note.

## Fences
- Records only: `plans/epics/EPIC-004…`, `EPIC-009…`, `EPIC-010…`, `plans/tickets/ABC-218..239`, your context. No
  ADR, `src/`, `tools/` or board edits. Never push, force, amend or rebase. Never merge into main. No host paths.

## Publish
- Seal notes (task `bapm-owner-words-b`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a
  10-cell trace row into this brief, then move it and its claim.md to done/.
