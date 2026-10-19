---
id: 20261019T202500Z-qe-e2e-decision-abc174-verdict-pass-with-gaps-e7b3c218
kind: decision
by: qe-e2e
task: qe-ABC-174
at: 2026-10-19T20:25:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-174
  - ADR-0045
  - ABC-175
  - NFR-004
  - NFR-008
  - N8-LANE
  - R-173-1
  - QE-174-a
  - QE-174-b
  - QE-174-c
  - QE-174-d
  - QE-174-e
  - QE-174-f
  - plans/tickets/ABC-174-re-cut-the-level-table-per-adr-0045-the-default-moves-to-level-5-and-plays-as-today.md
  - 20261019T194000Z-qe-e2e-observation-abc174-gates-lanes-a6-criteria-3f8c1d27
  - 20261019T195000Z-qe-e2e-observation-abc174-mutants-and-pins-8a2e5b90
  - 20261019T195500Z-qe-e2e-observation-abc174-a3-step-ruling-c41d7e2a
  - 20261019T202000Z-qe-e2e-observation-abc174-n8-lane-met-nfr008-total-not-met-5d9a0f63
supersedes:
---

# QE on `ABC-174` at `be6a5599`: **PASS_WITH_GAPS**. The criteria hold. The `NFR-008` total reads NOT MET at 10.01 s, and that goes to Security/NFR

Hand-authored and unsealed. This is a `decision`, not a `finding`: no `§14-gate#` or `human:` stamp exists on this
install. Nothing was committed, pushed or merged. Nothing was fixed or self-signed. I did not touch `src/` on any
branch, `plans/board.md`, `plans/traceability.md`, `../wt-ABC-174`, or any process I did not start. The scratch
worktree `../wt-qe-ABC-174` was removed.

## Why PASS (with gaps)
- **Gates green on resume.** lint, typecheck and build passed. `npm test` gave 1987/1987, `success: true`. Skips 0,
  `No findings.` `CLI_DEEP` 11/11 and `PERFT_DEEP` 32/32 (`…3f8c1d27`).
- **A6 green.** `ENGINE_DEEP` levels 35/35, including `ABC-087` A5 30/30 at max 3007 ms on the real clock. `LADDER_DEEP`
  short mode 18/18, with no A1/A2 claim.
- **Every criterion holds and reds on a wrong build.** 22 mutants were run and all 22 killed, including the page's three
  armed reds (`…8a2e5b90`).
- **Every re-pinned row is equal or stronger.** None was loosened.
- **`N8-LANE` is MET:** +0.115 s CPU, R 0.160 s (`…5d9a0f63`).

## Per criterion
| criterion | grade |
|---|---|
| A1 | PASS. Thin spot `QE-174-c` (INFO) |
| A2 | PASS: M10–M14 red it |
| A3 | PASS. The step-1000 ruling is **keep**, with `QE-174-a` (LOW) |
| A4 | PASS: the numstat is empty; the hunks are table, default and comment only; the mechanism bodies are untouched |
| A5 | PASS: M03, M04 and M15–M17 red it |
| A6 | PASS (QE's readings above) |
| A7 | PASS from the data. ABC-087 A5 read max 3007 ms. `QE-174-e` (INFO) |
| A8 | PASS: 7 files; `src/cli.ts` is comment only; pins equal or stronger |
| NFR-008 / N8-LANE | `N8-LANE` **MET**. The total is **NOT MET** (`QE-174-b`) |

## Gaps
| gap | severity | what | route |
|---|---|---|---|
| `QE-174-a` | LOW | The A3 row derives its step from the level under test. It is blind to raises of level 5's budget from 3001 up to 4499 ms (M08 passes it), and to a cut of under one step in `createLevel` (M20 passes it). The data rows and the QE-087-a spy kill all of these. A second literal `virtualClock(1_000)` would close the band for about 85 ms | SE test-only, optional; or accept |
| `QE-174-b` | **MEDIUM** | The `NFR-008` total at the tip: `npm test` median wall **10.01 s** against 10 s, R 0.28 s, admissible, load1 3.10–6.01, CPU 27.73 s. An earlier attempt read 9.95 s but was not applicable (load1 > 8). This ticket's narrow-set charge is only +0.115 s CPU / +0.030 s wall. This is the first capped full-lane figure (`R-173-1`) | Security/NFR at this gate rules the state. Architect/Design owns the row and the `F` replacement. QE does not move the bar |
| `QE-174-c` | INFO | The rate column has one guard, the D1 deep-equal. Two adjacent levels sharing a rate (M21, M22) pass the ordering row | accept |
| `QE-174-d` | INFO | The ladder short step (120) is above `LEVELS[1].budgetMs` (100) and near `LEVELS[2]` (180). Short-mode games among levels 1–3 now see 1–3 clock readings, so their scores (2v3 1.5/4) say nothing about ordering. Short mode claims no ordering, so no criterion moves | `ABC-175` / Architect: note it, accept |
| `QE-174-e` | INFO | A7's admission row hard-codes step `4` rather than reading `ladder.test.ts`'s private `VERDICT_STEP`. Both files pin 4, so a drift reds the ladder's own row | accept |
| `QE-174-f` | INFO | The SE published no typed notes for `ticket-to-pr-ABC-174` (disclosed in its done file). The done file carries the content | Orchestrator: accept or ask |

**Owed by others, not QE gaps:** `AGENTS.md:59` (Scribe), the `NFR-004` catalog lines (Security/NFR), and `ABC-175`'s
verdict before UAT (owner Q3).

## Waiver
`git diff --name-only bd480c99...be6a5599 | grep -v '\.test\.ts$' | grep '^src/'` prints `src/cli-options.ts`,
`src/cli.ts`, `src/levels.ts` and `src/uci-session.ts`. The `AGENTS.md` per-commit form prints the same four.
**Production lines are non-empty, so UAT applies.** The owner's word comes with `ABC-175`'s score (Q3).

## Next column
`In Review` → **`In Security/NFR`**. That gate rules on `QE-174-b`, the `NFR-004` catalog lines and the `N8-LANE`
reading. `QE-174-a` is optional for the SE. Then `ABC-175`, then UAT. The Orchestrator decides.
