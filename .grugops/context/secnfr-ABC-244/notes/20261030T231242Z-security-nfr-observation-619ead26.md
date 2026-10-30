---
id: 20261030T231242Z-security-nfr-observation-619ead26
kind: observation
by: security-nfr
at: 2026-10-30T23:12:42Z
verified_by: 
confidence: high: catalog edits hashed per row; observations carried from QE as stated
refs:
  - secnfr-ABC-244
  - ABC-244
  - NFR-008
  - N8-LANE
  - NFR-010
  - ADR-0046
  - ADR-0035
  - SEC-REBASE-b
  - QE-244-a
  - QE-244-c
  - QE-244-d
  - EPIC-010
  - qe-ABC-244/20261030T230742Z-qe-e2e-decision-4fe9bfe1
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-3c2ac5a2
  - qe-ABC-244/20261030T230742Z-qe-e2e-observation-98d5d2e4
  - arch-g8-headroom/20261030T223415Z-architect-design-decision-e15a97a2
  - grugops/qe-ABC-244
  - a66d20ab
  - 25282ad4
  - d59e3194
  - plans/nfr-catalog.md
supersedes: 
seal: sha256:a055bdf273c6f885b225e8122fa26d2309f48abebb03ed280f80ec5b0f3af5ad
---

# `ABC-244` Security/NFR records: catalog lines placed, and three carried observations (none a `finding`; no §14 stamp on this branch)

## Placed in `plans/nfr-catalog.md`
- `_Updated` line (newest first) for `secnfr-ABC-244`.
- `NFR-008` row: the M3 "function of CORE COUNT" clause annotated as true of its date; the 2026-10-30 re-base sentence
  struck and kept; one dated note with the per-thread-speed reading, `SEC-REBASE-b` ruled, and the `ABC-244` `G8` reading.
- § "Floors `F`" per-set list: the two-file set `src/cli.test.ts` + `src/uci-session.test.ts`, `F` = 0.250 s CPU /
  0.100 s wall (A8 twin, n = 8, k = 2, T−B −0.145 s CPU, sign +1/−7).
- § `ABC-244` at the end of the file.
- `NFR-001`–`NFR-007` and `NFR-009`–`NFR-012` byte-identical (sha256 per row before and after). Only `NFR-008` changed.

## Observations
- **`QE-244-a` (LOW, carry).** At step 1 000 the `ABC-241` U2 rows lose mutants (CLI A4: F230, QSEAMRAW; CLI A7: F230,
  QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1). They keep 100, so nothing is lost at the tip. Any ticket that moves a step,
  cuts `LEVELS[5].budgetMs` down, or raises `NODES_PER_CLOCK_CHECK` re-runs A6 on those rows with those five mutants.
  Owners: BA/PM (R4 DoR line), Architect/Design (tranche 2).
- **`QE-244-d` (INFO).** 0.15 s under 9.4 s is inside the +0.17 s window drift seen at `ABC-229`. The 9.6 s trigger guards.
  Owner: the Orchestrator's watch.
- **`QE-244-c` (INFO).** 9 of 24 mutants survive at base and head alike (not a regression). Other-file coverage
  `UNKNOWN - verify`. Owner: QE, at the next search-row ticket.
