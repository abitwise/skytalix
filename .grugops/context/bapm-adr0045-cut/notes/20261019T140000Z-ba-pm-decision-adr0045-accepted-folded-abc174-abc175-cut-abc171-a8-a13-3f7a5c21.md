---
id: 20261019T140000Z-ba-pm-decision-adr0045-accepted-folded-abc174-abc175-cut-abc171-a8-a13-3f7a5c21
kind: decision
by: ba-pm
task: bapm-adr0045-cut
at: 2026-10-19T14:00:00Z
verified_by:
confidence: high
refs:
  - ADR-0045
  - ADR-0044
  - ABC-174
  - ABC-175
  - ABC-171
  - ABC-087
  - ABC-101
  - ABC-085
  - ABC-173
  - QE-171-a
  - QE-171-b
  - QE-171-c
  - QE-171-d
  - QE-171-f
  - EPIC-004
  - .grugops/context/wave-2026-09-25/notes/20261019T130500Z-orchestrator-decision-owner-word-adr0045-accepted-q1-q3-abc171-rows-1a9c7f42.md
  - .grugops/context/wave-2026-09-25/notes/20261019T111500Z-orchestrator-decision-owner-word-abc087-recut-levels-b2e6d4a9.md
  - .grugops/queue/done/arch-levels-recut.md
  - .grugops/context/qe-ABC-171/notes/20261019T121000Z-qe-e2e-decision-abc171-verdict-pass-with-gaps-9d61b7e3.md
  - .grugops/context/qe-ABC-171/notes/20261019T120500Z-qe-e2e-observation-abc171-mutants-c48a1f60.md
---

# ADR-0045 recorded ACCEPTED and folded; ABC-174 (S, P1) and ABC-175 (XS, P1) cut at DoR 10/10; ABC-171 A8 reworded and A13a–d added

This note is hand-authored and unsealed, because `scripts/context-io.ts` is absent on this install. The pages are
authoritative. Their `## Scope`, § Pins that move, § Pre-registration and § Order with `ABC-173` sections govern. This
note records only the choices and the reasons for them.

- **ADR-0045 → accepted** 2026-10-19, citing `…1a9c7f42`. There is one id-correction fold line: the ADR's `ABC-173`
  reads `ABC-174`, because that id was already the vitest cap ticket. The re-take is `ABC-175`.
- **Folds:** `ABC-087` `A1` (default = 5); `ABC-101` ruling 2 (struck, overturned), `A2` (the maximum, not the
  middle) and `A8′` (DEFAULT_LEVEL 5, plays as today); `ADR-0044` D3, D6, D11 and Consequences (`default 5`, the rate-0
  path is level 5 only); `ABC-085` (the 2026-10-19 verdict goes STALE on `ABC-174`'s merge).
- **Routed, not edited:** `AGENTS.md` line 59 → the Scribe; the `plans/nfr-catalog.md` `NFR-004` lines (`AR-NFR004-A`
  "level 3", `:1364`) → Security/NFR.
- **ABC-174:** the Architect's shape, plus `A7` (the time budget from data; no wall-clock figure) and `A8` (fences and
  the pin table). BA/PM's read added the `ABC-061` whole-object rows (`src/cli.test.ts:1319..1386`, `difficulty: 3`),
  `levelTime`'s `level <= 2` path selector, and the `A2` read-back at `:719`. It also showed that the
  `ABC-167` A5 default-budget rows keep 3 000 ms; only their labels move.
- **ABC-175:** the ABC-166 template, pre-registered as one shot. The sequence is QE → `A0` re-take → run → UAT →
  merge. The run tree is a dedicated `../wt-ABC-175` at ABC-174's QE-passed commit (assumption stated). `A5` is a
  tree check at merge.
- **ABC-173 order:** BEFORE the run (`ABC-171` → `ABC-173` → `ABC-174`). `A0` needs one re-take after `ABC-173`. The
  fallback holds `ABC-173`'s merge until `ABC-174` merges.
- **ABC-171:** `A8` is reworded so that a book hit draws 0 seeds at any level, and a blunder-level search draws
  exactly 1. `A13a`–`d` specify the four rows, each with the mutant it must red. `QE-171-f` f1–f4 are all ACCEPTED,
  with no row added. `A3` gains "a `go` with no bad token". DoR 10/10, unchanged.
