---
id: 20261011T161509Z-ba-pm-decision-cut-abc151-k2-abc152-vitest41-b7e2a9c4
kind: decision
by: ba-pm
at: 2026-10-11T16:15:09Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-152
  - ABC-144
  - ABC-147
  - ABC-149
  - ABC-150
  - ABC-143
  - ABC-146
  - ABC-056
  - ADR-0040
  - ADR-0041
  - ADR-0008
  - ADR-0035
  - NFR-008
  - RISK-ABC143-01
  - RISK-ABC144-HEAT
  - plans/tickets/ABC-151-heat-the-owner-picks-two-test-workers-lower-the-cap-3-to-2-re-pin-it-and-read-wall-and-heat.md
  - plans/tickets/ABC-152-upgrade-vitest-to-4-1-and-run-src-without-the-module-runner-with-every-mock-and-spy-guard-still-armed.md
  - .grugops/context/wave-2026-09-25/notes/20261011T161037Z-orchestrator-decision-owner-word-uat-abc083-adr0041-k2-vitest41-adr0034-addendum-fbbdde16.md
  - .grugops/context/design-ABC-150/notes/20261011T115111Z-architect-design-observation-abc150-c4-admissibility-screen-blinds-mocks-f80e9eba.md
  - .grugops/context/design-ABC-150/notes/20261011T115111Z-architect-design-observation-abc150-handoff-questions-and-artifacts-7dc3b488.md
  - .grugops/context/qe-ABC-143/notes/20261011T105337Z-qe-e2e-observation-abc143-vitest-coupling-4f652dad.md
supersedes:
---

# BA/PM: `ABC-151` (k = 2, `S`, `P1`, DoR 10/10) and `ABC-152` (vitest 4.1, `L`, `P1`, DoR 10/10) cut on the owner's word `…fbbdde16`

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Branch:** `grugops/bapm-cut-k2-vitest41`, from the wave tip `619abc14`. Not merged, not pushed.
- **Nothing was measured.** Counts marked "grep" are text searches of the tree at `619abc14`.
- **Not edited:** `plans/board.md` (by instruction, the Orchestrator places the rows), `src/`, `AGENTS.md`,
  ADRs, and the pages of Done tickets.
- **`ABC-151` and `ABC-152` were free** on all 4 local branches' `plans/tickets/` and in `.grugops/queue/`.

## Decisions

| # | decision | why |
|---|---|---|
| 1 | **`ABC-151` = the k = 2 build, `S`, `P1`; Architect addendum first** | Owner: "Heat 2 workers is fine". `ADR-0040`'s Rollback already prescribes the literals, so the addendum is a record with no readings. The pin's comment cites it, so it lands first |
| 2 | **`ABC-151`'s CPU has no 15 % bar.** The interval must lie below 0, or the ticket goes to the owner | He chose k for heat. Arithmetic from Window A: K2 vs K3 ≈ −7.5 % CPU |
| 3 | **`ABC-151` `A5` reads heat in two separable head-only sequences, k = 2 then k = 3, 27 runs each, each started from level 0** | Window B could not separate k = 3's heat from the uncapped arms. No bar: the level is system-wide |
| 4 | **The cooled state at k = 2 is read only if warm + R > 9.0 s** | Warm bound at k = 3 (cooled ÷ warm 0.939). `ABC-111` found that the factor moves with parallelism. Window A expects ~8.2 s |
| 5 | **`ABC-152` = bump + runner off in one ticket, `L`, with a pre-registered split (`D4`)** | The bump alone buys no CPU. If the runner-off arm cannot keep the guards armed, the choice of bump-only vs stay on 3.2.7 goes to the owner. No agent picks |
| 6 | **The owner's "yes" is read as covering `ADR-0041` route (a)'s spy-form rewrites only** (`V5`) | `ABC-150`'s question 2 (`…7dc3b488`) bundled the R-3 call with route (a). Deleting, skipping or moving a test stays his |
| 7 | **"The 47" is C4's red set on 3.2.7, used as a proxy, not as what 4.1 breaks** | C4 is `deps.external`, not `viteModuleRunner: false`. `D3`'s two-arm screen reads the real set |
| 8 | **`V4`: one plant per sensitive file turns a guard red at head; a green run is not evidence** | `ADR-0041` d3: a blind guard can read 0 where 0 is expected |
| 9 | **`V9`: ≤ −15 % measured CPU merges; (−15 %, 0) with the interval below 0 goes to the owner; otherwise it does not merge** | `ABC-150` `L1`'s form, with the owner's band made explicit because he asked for the upgrade |
| 10 | **Order: `ABC-149` and `ABC-151` merge before `ABC-152`'s build; `ABC-152`'s ADR may run now** | `RISK-ABC143-01` (`ADR-0041` d4a), and both tickets edit `vitest.config.ts` and the `A7` pin |
| 11 | **`ABC-146`, `ABC-095` and `ABC-096` rows: no change** | `ABC-146` runs under plain `node`; one file is on one worker under any cap. `ABC-152` § Dependencies names the straddle for `ABC-146` `A1`'s vitest-side check. The book tickets do not touch the runner |
| 12 | **Owner question 3 (the `deps.external` pin) is not cut** | Unanswered (`…fbbdde16` item 6) |

## Board rows (for the Orchestrator; Ready is 6/8 now)

- `ABC-151` → `Ready`, then `In Design` (the Architect's `ADR-0040` addendum).
- `ABC-152` → `Ready`, then `In Design` (the Architect's ADR, `D1`–`D4`).
- In Design WIP is 0/2, so both fit there, and Ready stays at 6/8 after they pass through.
