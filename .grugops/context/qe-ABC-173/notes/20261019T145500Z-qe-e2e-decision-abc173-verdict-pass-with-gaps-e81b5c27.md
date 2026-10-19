---
id: 20261019T145500Z-qe-e2e-decision-abc173-verdict-pass-with-gaps-e81b5c27
kind: decision
by: qe-e2e
task: qe-ABC-173
at: 2026-10-19T14:55:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - plans/tickets/ABC-173-cap-vitest-at-two-cores-and-a-two-gb-heap-ceiling-that-every-lane-applies.md
  - ADR-0008
  - ADR-0035
  - NFR-008
  - ABC-170
  - ABC-167
  - ABC-171
  - QE-173-a
  - QE-173-b
  - QE-173-c
  - QE-173-d
  - QE-173-e
  - QE-173-f
  - QE-173-g
  - 20261019T143000Z-qe-e2e-observation-abc173-mutants-3d7a91c4
  - 20261019T144500Z-qe-e2e-observation-abc173-criteria-lanes-gates-6b0e2f58
  - 20261019T145000Z-qe-e2e-observation-abc173-a9-and-n8-lane-owed-c9e4a7d1
---

# QE on `ABC-173` at `840ebbf7`: **PASS_WITH_GAPS**; `A9` and `N8-LANE` OWED

Hand-authored and unsealed. A `decision`, not a `finding`: no `§14-gate#` or `human:` stamp exists on this install.
Nothing was committed to `grugops/ABC-173`, pushed or merged; nothing was fixed or self-signed. I did not touch `src/`,
`plans/board.md`, `plans/traceability.md`, `../wt-ABC-173`, `../wt-ABC-171`, `../wt-uat-ABC-171` or any process I did
not start.

## Why PASS (with gaps)
- **The delivered build behaves as the addendum rules.** Every correct command is admitted and every wrong command
  battery is refused; the armed reds on the default lane, `CLI_DEEP` and `INPUT_DEEP` reproduce; `A4`/`A6` read in
  the worker and the children (`…6b0e2f58`).
- **Every `AGENTS.md` lane is green as spelled at the cap, both coverage lines on their first run**, 1920/1920,
  `success: true`, skips 0, `No findings.`; no OOM.
- **The lightened rows keep their discrimination:** M15 reds all six `ABC-170 A3` rows at step 5; the `ABC-167 A5`
  "movetime 100" kill set is {MT1, MT2, MT3} at step 1 and at step 10.
- **Mutants:** 54 run, 44 killed, 10 survived (`…3d7a91c4`). `A3`'s static row killed 14 of 14.
- **Waiver:** 0 production files under `src/` (measured both ways). The UAT waiver applies.

## Per criterion
| criterion | grade |
|---|---|
| C1 | PASS: both blocks byte-identical to `6cfc1be9`, green; wrong builds red them |
| C2 | PASS, with `QE-173-c` (INFO) |
| A1 | PASS: (b) none, re-read |
| A2 | PASS: 2016 / 1984 <= 2048, every row a number |
| A3 | PASS: 17 commands, 14/14 mutants killed, 3 armed lane reds reproduced |
| A4 | PASS: wrong builds (no `globalSetup`; guard off + unprefixed; flag in `execArgv`) all red |
| A5 | **PASS_WITH_GAP `QE-173-a`**: correct on every battery; its row values and shape choice are unpinned |
| A6 | PASS, with `QE-173-b` (LOW) and `QE-173-e` (INFO) |
| A7 | PASS at this hop: every lane green, no OOM (census and peaks are the SE's) |
| A8 | PASS: every pin named and re-pinned with its reason; receipts verbatim; 24,343 B |
| A9 | **OWED** (no quiet window; `…c9e4a7d1`) |

## Gaps
| gap | severity | what | route |
|---|---|---|---|
| `QE-173-a` | **MEDIUM** | No automated row pins `heap-guard.js`'s `ROWS_MIB` or its shape choice. G03 (always ONE-FILE), G06 (<= 2 files ONE-FILE), G09 (compares flag, not limit), G10 / G11 (a row raised) pass the default lane and every lane as spelled; only an armed command (two files at 400, one at 450) reds them. G03/G06/G11 admit a SUITE run at 9 x 496 = 4464 MiB. The page's test note "raise one row above the table -> `A4` red" does not hold for a raised `ROWS_MIB`. G08 (wrong provided row) survives everything | SE, test-only, before merge recommended: e.g. pin `ROWS_MIB` to the addendum's table and its sums, and exercise the shape choice and the comparison (a pure exported helper, or one child running `setup` with a stub project). The Orchestrator / BA-PM decide; the owner may accept instead |
| `QE-173-b` | LOW | `A6 (static)` misses an argv heap flag spelled `--max_old_space_size=` (Node accepts it; argv beats `NODE_OPTIONS`) and an `env` key passed through a spread. Both lint-clean | SE, with `QE-173-a`, or accept |
| `QE-173-c` | INFO | `C2`'s self-test plants `spawn`/`execFile`/`fork`, not `exec`; P04, P06, P07 survive (equivalent on today's tree). The dynamic-`import()` bound is stated in the row | accept |
| `QE-173-d` | LOW | The SE's named gap: on a guard refusal `last-run.json` reads `success` false, `exitCode` 1, `numTotalTests` 0, no error; the query prints only `run    exited exitCode=1`. The file still cannot read green; the console names the guard; `numTotalTests` 0 separates it from the exit-code-only row | accept, or a later `result-file-reporter.js` ticket; not a merge blocker |
| `QE-173-e` | INFO | T03 (a literal 400 token for `CLI_DEEP` children) survives every lane as spelled; it reds only in a SUITE-shape `CLI_DEEP` run, which no `AGENTS.md` line spells. T05 (whole `NODE_OPTIONS` passed at the call site) survives: `ABC-119`'s pin reads the constant, not the call (pre-existing bound) | accept |
| `QE-173-f` | INFO | `AGENTS.md`'s `Test (all)` comment still quotes the unprefixed wrapper command | next `AGENTS.md` touch |
| `QE-173-g` | INFO (risk) | `ABC-171`'s +533 test lines have never run under the cap; merge-tree is clean both ways, but whichever of the two merges second must re-run every lane on the combined tree | Orchestrator, at merge |

## Timing
`A9` and `N8-LANE`: **OWED**. Two foreground 180 s windows (14:41:49Z, 14:45:40Z) each had foreign processes in 181 of
181 polls: the two `oeselg-labs/platform` workers and the `uat-ABC-171` hop. Host MacBook-Air.local, load1 2.41–3.50.
Nothing was timed or estimated. The arms and harness are recorded in `…c9e4a7d1`.

## Next column
- **Recommended:** `QE-173-a` back to the SE as a test-only row (or the owner accepts it), then `In Security/NFR` for the
  `A9` + `N8-LANE` readings that the addendum requires before merge, and the proposed `NFR-010` catalog row.
- UAT: **waived** (0 production lines). The waiver is not a signature.
- The Orchestrator decides.
