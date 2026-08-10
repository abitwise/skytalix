---
id: 20260810T203247Z-architect-design-artifact-ref-2b99c13f
kind: artifact-ref
by: architect-design
at: 2026-08-10T20:32:47Z
verified_by: 
confidence: high
refs:
  - ABC-026
  - NFR-008
  - ADR-0008
  - plans/nfr-catalog.md
  - plans/traceability.md
  - plans/tickets/ABC-026-default-lane-cumulative-budget.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md
supersedes: 
---

# Artifacts: what this hop wrote into the repository, and where the harness and the raw data live

## Written into the repository (5 files; **NONE under `src/`**)

| file | change |
|---|---|
| `plans/nfr-catalog.md` | **`NFR-008` row added** (10th table line; 7 pipe-separated fields, same as every other row) + the `NFR-008` section + the `NFR-002` two-flag ruling block + the header. **`NFR-001`–`NFR-007` byte-identical**, all 9 pre-existing table lines hashed before and after. 546 lines → 776. |
| `memory-bank/50-decisions/ADR-0008-default-test-lane-budget.md` | **new**, status `proposed`, authored from `ADR-template.md` (Status / Context / Decision / Alternatives / Consequences / Rollback). |
| `plans/tickets/ABC-026-default-lane-cumulative-budget.md` | front matter `size: UNKNOWN - verify` → `size: S`; the hop's block; DoR status; `## What remains`; `## Size`; a flag on the ticket's own promotion trigger. `status` and `column` **unchanged** (`backlog` / `Backlog`). |
| `plans/tickets/ABC-017-bounded-move-history-pane.md` | the stale `NFR-002` flag **struck in place with its evidence** (original left standing, that ticket's own correction convention); a new Security/NFR gate obligation; `N8-LANE` inherited. |
| `plans/traceability.md` | **one cell of one row** — `ABC-026`'s `NFRs`. 35 table lines before and after; **all 34 other lines byte-identical by md5**; 12 pipe-separated fields before and after; the added string pipe-free and newline-free. `Status` deliberately untouched (no column moved). Header paragraph prepended. |

**`plans/board.md` was NOT edited** — two agents are running and board moves are the Orchestrator's.
The row text I am asking for is at the end of the `decision` note beside this one.

## Byte-identity proofs, run rather than asserted

```
src/                 37 files, md5 sorted, BEFORE == AFTER          -> IDENTICAL
git status --short -- src/                                          -> empty
plans/nfr-catalog.md rows NFR-001..NFR-007 + header + separator     -> 9 of 9 md5 IDENTICAL
plans/traceability.md all table lines except the ABC-026 row        -> 34 of 34 md5 IDENTICAL
19 out-of-tree trees, every repository file cmp'd per file          -> 0 mismatches
```

## The harness (out-of-tree, session scratchpad — **not** in the repository, and not proposed for it)

`/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/dc7419de-6eca-496d-9673-f329cf7b7036/scratchpad/lab/`

| artifact | what it is |
|---|---|
| `build.sh` | builds the 19 trees; full-lane copies, `ABC-025`-removed copies, empty trees with `K` trivial files, content controls. `node_modules` symlinked; the repository is only ever read. |
| `harness.mjs` | interleaved runner, positional conditions. Rotates order per round, discards round 0, asserts file **and** test count per run. |
| `harness2.mjs` | same, with arbitrary `argv` per condition (used for `--pool`, `--no-isolate`, `--no-file-parallelism`, `npm test`). |
| `analyse.mjs` | absolute medians + **paired per-round deltas against a named base**, with the sign test. |
| `model.mjs` | the OLS floor model, the lane decomposition, the marginal per-file costs and the CPU/wall ratios. |
| `spec-{C,D,F,G,R}.json` | condition specs for the argv-driven suites. |
| `raw-{A1,A2,B1,C,D,D2,F,G,R,R2,W}.csv` | **612 recorded runs, one row each**: wall, user, sys, cpu, file count, test count, and vitest's own transform / setup / collect / tests / environment / prepare breakdown. |
| `src-hashes-{BEFORE,MID,AFTER}.txt`, `trace-hashes-{BEFORE,AFTER}.txt` | the byte-identity evidence above. |
| `threads-noiso.out` | the captured `--no-isolate` failure (`expected "hasLegalEnPassant" to be called 1 times, but got 0 times`). |

**It is a scratchpad and it is session-scoped: it will not survive.** It is listed so that the next
role who has to re-derive any of these numbers knows exactly what shape the instrument was, and so
that "re-derive, do not inherit" — this board's standing rule — stays cheap. **Nothing in this
directory is proposed for the repository**; a measurement harness in `src/` would itself cost the
per-file floor this hop just measured.

## Reading order for whoever picks this up

1. `plans/nfr-catalog.md` — the `NFR-008` row, then its section (the budget, `N8-LANE`, the floor
   curve, the isolation finding).
2. `memory-bank/50-decisions/ADR-0008-…` — **why**, and the six rejected alternatives.
3. The `observation` note beside this one — the numbers and the instrument.
4. The `claim` note beside this one — the one projection that is arithmetic rather than measurement,
   published separately so it can be attacked separately.
