---
id: 20261027T195433Z-architect-design-decision-74d50337
kind: decision
by: architect-design
at: 2026-10-27T19:54:33Z
verified_by: 
confidence: high: records only; every count measured read-only at main c383f8f0 by a calibrated parse; ruling rests on ADR-0011 clause 1 and its pinned instrument
refs:
  - EPIC-008
  - ABC-207
  - ABC-208
  - ABC-209
  - ABC-210
  - ADR-0011
  - ADR-0024
  - ADR-0025
  - ADR-0027
  - ADR-0029
  - ADR-0050
  - ADR-0051
  - NFR-002
  - NFR-008
  - memory-bank/30-architecture.md
  - orch-2026-10-27m/20261027T194139Z-orchestrator-decision-64925a53
  - bapm-s1-ABC-210/20261027T194008Z-ba-pm-decision-ff16a93d
  - arch-records-arch-snapshot/20261026T042539Z-architect-design-observation-cdc1fb61
  - grugops/arch-repass-30-architecture
  - c383f8f0
  - 4ab6f2f9
  - 9236f4e7
  - b5c67ab7
supersedes: 
seal: sha256:b147e99e1a2d9e44d9b71067a98bcd7929b6c316fbcef51be3fc4ae3ce7c6794
---

# Architect/Design: `30-architecture` re-passed as-built at `main` `c383f8f0`. 46 production modules; `virtual-clock.ts` is one of them and no entry loads it (42 of 46 are loaded by an entry). Dated corrections are folded in, with one dated change line per edit

Task `arch-repass-30-architecture` (`EPIC-008` close step 2; Orchestrator `orch-2026-10-27m/…64925a53`, BA/PM
`bapm-s1-ABC-210/…ff16a93d`, close item `arch-records-arch-snapshot/…cdc1fb61`). Branch
`grugops/arch-repass-30-architecture`, cut from `main` `c383f8f0`; records commit `4ab6f2f9`. Records only.

## Ruling: the open count (`…cdc1fb61`, "42 or 43 of 46")
- **`virtual-clock.ts` IS a production module.** `ADR-0011` clause 1 says "every `.ts` under `src/` that is not a
  `.test.ts`", with no exclusions. The instrument `productionModulesIn` is pinned whole in
  `src/history-pane.nfr.test.ts`. `ADR-0027` decision 4 also calls the clock "one small production module".
- **No entry loads it.** No other module imports it. Its one import (`Clock` from `engine.ts`) is `import type`,
  erased at run time. Its importers are six test files.
- **So the count is 46 production modules, and 42 of them are loaded by an entry** (chess 38, uci 18, perft 7).
  The four not loaded: the three TEST-ONLY corpora and `virtual-clock.ts`. "42 or 43" asked two questions
  at once. Neither answer is 43.

## Written (`memory-bank/30-architecture.md`, +232/−144)
- Header: the snapshot notice is retired and the page is as-built at `c383f8f0`. Older `_Updated_` lines are
  condensed into one "Previously" line.
- § System context: three programs, two data paths outside `src/`, three entries (`ADR-0011` clause 4), no barrel.
- § Key components: the count ruling above. The table is rebuilt to 46 rows with Level, Loaded by and Fan-in
  columns; every cell matches the measurement. The `apply.ts` and `zobrist.ts` dated corrections are folded in.
  `zobrist.ts`'s `UNKNOWN - verify` depth is now measured (level 4). Test files: 61.
- § System patterns: the graph is re-measured (see the observation note). Lines that were false at `c383f8f0`
  are corrected: `render.ts`'s run-time importer, `history.ts`'s two, "nothing imports a renderer", and "no clone
  function exists". New bullets cover the capability boundary and the search heuristics on `main`:
  `ADR-0024` d4 stands, `ADR-0025` d4 stands as written, `ADR-0050` is in force, `ADR-0051` is accepted but not
  in force, and `ABC-207` is not merged.
- § Data flow: new, one path per entry, read from `cli.ts` and `uci.ts`.
- § Tech context and § Deployment posture: the dated corrections are folded in. Every posture bullet was
  re-verified at `c383f8f0`. `NFR-008`'s figures are replaced by a pointer to its catalog row.
- § Change log: 17 dated lines, one per edit.

## Not moved
- No ADR, NFR row, bound, level, board, ticket or epic page. No `src/`, `tools/` or `package.json`.
  `git diff --stat main...HEAD -- src tools package.json` is empty.
- No npm, vitest, build or timing. `node tools/grugops/reference-check.js` reports No findings. Class scan of
  the page: 0 hits.
