---
id: 20261024T123712Z-ba-pm-decision-7df0e4af
kind: decision
by: ba-pm
at: 2026-10-24T12:37:12Z
verified_by: 
confidence: high (records only; each fold line is worded from ADR-0045 A3/A4 and § Consequences; no requirement, scope or bound moves)
refs:
  - bapm-fold-ABC-212
  - ABC-212
  - ABC-204
  - EPIC-004
  - EPIC-008
  - ADR-0044
  - ADR-0045
  - NFR-004
  - arch-design-ABC-212/…d2c68ace
  - qe-ABC-212/…e58d4635
  - owner-word-2026-10-23/…2c6fa3b1
  - grugops/qe-ABC-212
  - 052ae3ad
supersedes: 
seal: sha256:cd4e86de37522b7c4518f952d089555e211ac1dfcb2428d60dd77737b9128cf5
---

# ABC-212 merge folds written: ADR-0044 D4.1, D4.4, D5 and D11 fold lines, and the ABC-204 erratum; no STOP

BA/PM, task `bapm-fold-ABC-212`. These are the folds owed by Architect `…d2c68ace` and QE `…e58d4635`, on `grugops/bapm-fold-ABC-212`, cut from `052ae3ad`.

## Written
`memory-bank/50-decisions/ADR-0044-…md`, in its 2026-10-19 fold style: a Status block, plus inline italic dated lines, with the old text kept.
- **Status:** a new block, "Amended 2026-10-24 by `ADR-0045` § AMENDMENT 2026-10-24". It lists the four folds and the four restating lines, says it is effective at `ABC-212`'s merge, leaves the history sections as written, and moves no other decision.
- **D4.1:** with no time token, `G` is `HARD_CEILING_MS`, now 32 000, and D4.2 caps it to the level's budget. A bare `go` searches the level's budget at levels 1–7. The code is unchanged.
- **D4.4:** one absolute clamp at 32 000. Each level's `NFR-004` ceiling is held by its budget, at least 2 000 ms under it (5 s at 1–5, 7 s at 6, 32 s at 7). Clause B is now per level, and Security/NFR places it in the catalog.
- **D5:** `isready` and `stop` are answered at most one budget late: about 5 s at 1–5, 7 s at 6 and 32 s at 7. Accepted, no worker. The first worker trigger is marked as fired and ruled (OQ-212-3). The worker stays pre-designed, built for pondering or for a GUI the owner uses that is shown to stall at 6–7.
- **D11:** `max 7`, read from `HARDEST_LEVEL`, and the default stays 5. Rate 0 is levels 5–7, and rate above 0 is levels 1–4. The rate-0 path's level list carries the same mark.
- **Restating lines, with the same dated mark:**
  - D3 `uci` row: `max 7`.
  - D3 `setoption` row: 1 to 7.
  - § Consequences: analysis is capped by the level's budget, up to 30 s at level 7.
  - § Consequences: the rate-0 levels are 5–7.

`plans/tickets/ABC-204-…md`:
- **Header erratum:** Q1's derivation line reads "level 5's ceiling (5 000)", not "`HARD_CEILING_MS` (5 000)". No number, margin or rule changes.
- **Inline at Q1:** the same erratum, citing `NFR-004` clause B instead of `src/engine.ts:129`. The general rule `timemargin` = 5 000 − budget reads as ceiling(level) − budget, which is unchanged at `Skill Level` 5.

## Bounds
- No requirement, scope or bound moves. Every fold restates what the owner accepted (`…2c6fa3b1`) and the Architect ruled (`ADR-0045` A3/A4, § Consequences).
- The four restating lines go beyond the four named decisions. They follow the 2026-10-19 precedent, where BA/PM folded D3's option line and a § Consequences line alongside D11.
- Not touched: `src/`, the tests, `plans/nfr-catalog.md`, `memory-bank/70-runbook.md`, `ADR-0045`, the `ABC-212` page, the board and the trace.
