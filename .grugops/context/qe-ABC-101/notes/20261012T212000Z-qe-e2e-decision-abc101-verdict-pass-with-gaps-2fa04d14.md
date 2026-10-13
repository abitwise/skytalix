---
id: 20261012T212000Z-qe-e2e-decision-abc101-verdict-pass-with-gaps-2fa04d14
kind: decision
by: qe-e2e
task: qe-ABC-101
at: 2026-10-12T21:20:00Z
verified_by:
confidence: high
refs:
  - ABC-101
  - plans/tickets/ABC-101-difficulty-selection.md
  - ABC-086
  - ABC-065
  - N8-LANE
  - QE-101-a
  - QE-101-b
  - QE-101-c
  - QE-101-d
  - QE-101-e
  - 20261012T211700Z-qe-e2e-observation-abc101-criteria-children-cli-deep-8ca2ab34
  - 20261012T211800Z-qe-e2e-observation-abc101-plants-and-abc065-a3-value-check-9b0ef449
  - 20261012T211900Z-qe-e2e-observation-abc101-n8-lane-three-sets-met-bdcdfb6b
  - 20261012T212100Z-qe-e2e-artifact-ref-abc101-branch-probe-commands-1e580a88
  - 20261012T204500Z-ba-pm-decision-six-rulings-a5i-repinned-a9-widened-dor-10-of-10-f4a8b6ee
supersedes:
---

# QE verdict, `ABC-101` (`3ea3e352..98ea0a84`, code `ac8deab1`): **PASS_WITH_GAPS**. Every live criterion MET, `N8-LANE` MET on all three sets, gaps LOW and INFO only. Next: `In Security/NFR`; the owner's UAT word is owed

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). It is an agent
`decision`, not a stamp. The readings are in the three observation notes it cites and are not restated.

**Criteria (re-read independently, `…8ca2ab34`):** `A1`, `A2`, `A3` (+ extended), `A5`, `A6`, `A7` (both halves),
`A8′` (all four parts), `A9` (as widened, `-U0` read), `A10`: **MET**. `A4` struck. `ABC-086` `A5` (i′) 1–4, (ii),
(iii): **MET**. `CLI_DEEP` 10/10 with 0 copies before and after. The 10 children doubled at `./book-engine.ts` reach
their doubles; `src/cli.test.ts` ×10 green, the `mate` rows green every time.

**Plants (`…9b0ef449`):** 19 planted, 15 caught. Every plant the brief named is caught: the seam ignoring the level, `in`, a `Number()` range check, a fixed level at the root, `now` at the root, `LEVELS[DEFAULT_LEVEL]`
changed (budget or rate), the book inside the level seam, a constant seed (at the root and inside the adapter).
**One product regression is caught by nothing: a level rebuilt on every move (`QE-101-a`).**

**`N8-LANE` (`…bdcdfb6b`):** S1 `src/cli.test.ts` +0.105 s (−0.010..+0.240), S2 `src/cli.real-engine.test.ts`
default lane +0.005 s (−0.010..+0.030), S3 `src/engine.test.ts` −0.015 s (−0.040..+0.000): **MET, MET, MET**, each
in a clean pre-registered window (pre-registration `bd846627`, committed before any run). The ticket line (arithmetic,
not a reading): medians +0.095 s, x(7) +0.270 s, so the costs sit under the bar.

**UAT waiver reading:** `git diff --name-only 3ea3e352...98ea0a84 | grep -v '\.test\.ts$' | grep '^src/'` →
`src/cli-options.ts`, `src/cli.ts`, `src/level-seam.ts`. **Non-empty: the waiver does not apply, and the owner's UAT
word is owed.**

## Gaps

| id | sev | gap | owner |
|---|---|---|---|
| `QE-101-a` | LOW | **`A8′`'s equivalence row does not discriminate a level rebuilt on every move.** At seed 7 the first two draws decide the same for levels 1 and 2, so a seam that restarts the generator each call (P11) is green on all 1789 rows; shipped, level 1 or 2 would blunder on every move or on none for a whole game. The delivered seam is correct. Measured fix: a third call reds P11 and stays green on the delivered seam | Software Engineer (the row) |
| `QE-101-b` | LOW | **`ABC-065` `A3`'s value check is load-bearing for `4` only** (BA/PM ruling 6, graded as asked, not fixed). `1`, `2`, `3`, `5` and `9` already occur elsewhere in the slot; `1\|2\|3\|4`, `1\|2\|3\|4\|9` and `1\|3\|4\|5` stay green, `1\|2\|3\|5` reds. The option-equality half holds, and `USAGE`'s five words are read independently by `A5` | BA/PM (`ABC-065`), at the next `AGENTS.md`-touching ticket |
| `QE-101-c` | INFO | (i′) assertion 1 (raw-source `toContain`) is satisfied by its literal kept in a comment (P5b, P8b). Covered by composition: `ABC-043` `A1` (code-only) reds both, `ABC-042` `A8` reds P8b | BA/PM (read; no action owed) |
| `QE-101-d` | INFO | A repeated `--difficulty` takes the last value (as `--colour` does). The page neither specifies nor tests it; ruling 3 ("fixed for the session") is about mid-game change and is not contradicted | BA/PM |
| `QE-101-e` | INFO | `N8-LANE`: S2's w1 was clean but inadmissible (twin −2.174 %), read once more as allowed. New 4.1 twin readings to fold: S1 R 0.120 s (its third; the median-of-three would set `F` 0.120 s CPU / 0.180 s wall), S2 0.020 s, S3 0.030 s (first). No state moves under any | Architect/Design |

**No gap blocks.** Nothing here asks for a production-code change.

## Owed elsewhere (not QE gaps, recorded so nothing is lost)

- **`In Security/NFR`:** the `ABC-087` forward note (`Object.hasOwn`) now binds and is met (`src/level-seam.ts:14`;
  P2 reds). `AR-NFR004-A` is owed its re-read, because a played move now goes through a level. That is Security/NFR's.
- **The owner's UAT word** (3 production files).
- **The Orchestrator:** the board move (`In Review` → `In Security/NFR`) and the stale front matter (`status: backlog`,
  `P2`). QE did not touch `plans/board.md`.
- **The Scribe, post-merge:** the `CLI_DEEP` row count (7 → 10) and the `Test (all)` receipt (`…3c7e1a90` items 3–4).
  `AGENTS.md` is at exactly 24,576 B.
