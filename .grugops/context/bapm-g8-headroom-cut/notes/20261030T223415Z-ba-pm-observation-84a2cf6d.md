---
id: 20261030T223415Z-ba-pm-observation-84a2cf6d
kind: observation
by: ba-pm
at: 2026-10-30T22:34:15Z
verified_by: 
confidence: high for line numbers and row contents read with grep/sed at main 161e940d; per-row ms are the Architect's shape-only figures from QE's G8 run-6 report, not admissible; census-candidate classes UNKNOWN - verify
refs:
  - bapm-g8-headroom-cut
  - ABC-244
  - ABC-242
  - ABC-221
  - ABC-243
  - ABC-230
  - ABC-241
  - ABC-177
  - ABC-229
  - EPIC-010
  - EPIC-009
  - NFR-008
  - QE-229-a
  - SEC-REBASE-b
  - ADR-0046
  - ADR-0035
  - ADR-0027
  - G8
  - N8-LANE
  - R1
  - R2
  - R3
  - R4
  - arch-g8-headroom
  - grugops/arch-g8-headroom 5fd3eee7
  - qe-ABC-229/20261030T202320Z-qe-e2e-observation-0b7fd4f6
  - qe-ABC-230/20261030T053038Z-qe-e2e-observation-af1628d2
  - qe-ABC-241/20261030T143112Z-qe-e2e-observation-939168a8
  - bapm-cut-ABC-177
  - main 161e940d
  - main 4debc07d
supersedes: 
seal: sha256:b24fc2a5d4d7406195f4adec8c3589e23a820f1f7f0ab62dd218ae5f715ae279
---

# BA/PM observation, bapm-g8-headroom-cut: what the four tranche-1 blocks hold at `main` `161e940d`. Eight of their 18 rows read a `STEP_MS` (four constants, all 100). The other ten are fixed-depth or do not search

Read with `grep`/`sed` at `161e940d`; nothing was run. Per-row costs are the Architect's (`arch-g8-headroom`
`raw/probe/rows.out`, from QE's `G8` run 6 report; shape only, not admissible).

## The four `STEP_MS` constants (all `= 100`)
| file:line | block | rows that read it | in-thread ms (run 6) |
|---|---|---|---:|
| `src/cli.test.ts:4555` | `ABC-230 A1, A3` (`:4546`) | A1 (586), "read once" (39), A3 (86) | 710 (block) |
| `src/cli.test.ts:4626` | `ABC-241 A4, A7` (`:4621`) | A4 (210), A4 twin (59), A7 (66); the import pin (0) reads none | 335 (block) |
| `src/uci-session.test.ts:1286` | `ABC-230 A2, A3, A5` (`:1277`) | A2 "byte-equal to the CLI level seam's move on the same game and clock" (271) only | 294 (block) |
| `src/uci-session.test.ts:1413` | `ABC-241 A4, A5` (`:1408`) | A5 "the CLI level seam's injected list equals UCI's" (84) only | 90 (block) |

- **Every search under these constants runs the default level's 4 000 ms.** That is `createLevelSeam(DEFAULT_LEVEL, …)`,
  `chooseMove` with `LEVELS[DEFAULT_LEVEL].budgetMs`, or UCI `go` with no limit. So each makes 40 clock reads at step
  100 and 4 at step 1 000. `ABC-177`'s condition 2 (≥ 2 intervals) holds at 1 000.
- **None of their assertions reads time.** They read a move label, `score` 0 / not 0, `cp 0`, a key list, a call
  count, or `gameStatusOf`'s claim.
- **The UCI comment at `:1285`** reads "The CLI's step in `src/cli.test.ts`'s `ABC-230` rows: one clock pattern on
  both surfaces". The pairing R3 asks for is already stated in the file.

## The other ten block rows
- **UCI `ABC-230`:** A2 `go depth 4` (×2 rows), A3 `go depth 1` (×2 rows), A5 `go depth 1` (×2 rows).
- **UCI `ABC-241`:** A4 `go depth 4` plus `chooseMove` at `budgetMs: 1e9, maxDepth: 4`; A5 list `go depth 1`; the A8
  import pin.
- **CLI `ABC-241`:** the import pin.
- These rows are bound by depth or do not search, so no step move saves anything on them. They stay byte-identical
  under `ABC-244`.

## Census candidates (rows added after `ABC-177`'s merge `4debc07d` that set a step)
- **Read with `git diff -U0 4debc07d 161e940d`.** The candidates are in `src/uci-session.test.ts`: `:298` (`talk(…,
  1_000)`), `:392` and `:452` (`talk(…, 100)`), `:1033` (`rig({ stepMs: step })`), `:1051` (`rig({ stepMs: 1_000 })`),
  the `session220` default `stepMs = 1_000` (`:1543`), `:1748` (1 000), `:1804` (10, a 1 ms budget), `:1910` (100,
  `go depth 3` at level 1), and `:1989` (`virtualClock(500)`). `src/cli.test.ts` has no other one.
- None of them is in the Architect's ranked cost list, and several already sit at 1 000 or are bound by depth. Their
  classes and savings are `UNKNOWN - verify` until `ABC-244`'s A1 census reads them.

## The three Ready tickets that share the files (read at `161e940d`)
- **`ABC-242`:** `src/levels.ts`, `src/levels.test.ts`, plus `src/cli.test.ts` and `src/uci-session.test.ts` (`A4`).
  QE's probe set-up is rate 1, 2 000 ms, `virtualClock(1)`.
- **`ABC-221`:** `src/uci-session.ts`, `src/engine.ts` (clamp), `src/uci-session.test.ts`, `src/uci.real-engine.test.ts`.
- **`ABC-243`:** `src/uci-session.test.ts`, `src/transposition.test.ts`.
- **In flight:** `ABC-225` (In Review) changes `tools/rating/` only (`git diff --name-only main...grugops/ABC-225`).
  `ABC-235` and `ABC-240` are Done.
