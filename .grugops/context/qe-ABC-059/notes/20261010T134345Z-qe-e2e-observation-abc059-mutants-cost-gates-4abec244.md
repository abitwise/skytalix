---
id: 20261010T134345Z-qe-e2e-observation-abc059-mutants-cost-gates-4abec244
kind: observation
by: qe-e2e
at: 2026-10-10T13:43:45Z
verified_by:
confidence: high
refs:
  - ABC-059
  - ABC-042
  - ABC-065
  - ABC-087
  - ABC-109
  - Q13
  - N8-LANE
  - N8-SPAWN
  - ADR-0035
  - src/cli.test.ts
  - 20261010T132830Z-software-engineer-decision-abc059-span-rule-command-read-floors-not-counts-084a3e0b
  - 20261010T132830Z-software-engineer-observation-abc059-gates-mutants-a1-a6-cost-abc087-53346fff
supersedes:
---

# `ABC-059` QE readings: 31 mutants on head, 15 on base; the engineer's six reproduce; `N8-LANE` reads MET twice on `ADR-0035`'s (proposed) protocol at load1 3.6 / 4.1; gates green

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- Under review: `0b6e1c25..4230d3ab` on `grugops/ABC-059-runnability-guard`. The code commit is
  `14c940ff`.
- The harness is QE's own (`../probe/mutate.mjs`, `../probe/mutants.sh`). It uses one
  `git archive` tree per commit, and `AGENTS.md` and `package.json` are reset from pristine
  before every mutant. No worktree byte was mutated.
- The engineer's probe outputs were read as pointers only. Every number below was re-run.
- Machine: Apple M3, Darwin 25.5.0. Load1 is beside every reading.

## Mutants (`npx vitest run src/cli.test.ts`; raw `../probe/mutants-{head,base}.out.tsv`)

Insertions marked "§DP" go first in § Deployment posture. Every mutated file is ≤ 24,546 B, which
is under `ABC-109`'s 24,576 B budget, so no row reds for size.

| mutant | base `0b6e1c25` | head `4230d3ab` |
|---|---|---|
| control | 66/66 green | 67/67 green |
| `q13-head` / `-tail` / `-posture` / `-oneline` (the engineer's) | green ×4 | **RED 1/67**, `ABC-059` only, ×4 |
| `prose-wrong-cmd` (§DP `npm run chess` → `perft`, the engineer's) | green | **RED 1/67** |
| `q13-crlf` (Q13 with `\r\n` as its break) | green | **RED 1/67** |
| `q13-in-list` (as a list item before `- Perft harness`) | green | **RED 1/67** |
| `q13-in-comment` (inside § E2E's HTML comment) | green | **RED 1/67** |
| `q13-midsentence` (inside "This project … deploys nowhere;") | green | **RED 1/67** |
| `q13-the-list-form` (the slot becomes `- Dev / run: \`UNKNOWN - verify\``) | n/a | **RED 2/67**: `ABC-042` `A1` row and `ABC-059` |
| `edge-bang-wrong` §DP "`Dev / run` is `npm run perft`! Really." | green | **RED 1/67** |
| `edge-question-wrong` §DP "Is `Dev / run` `npm run perft`? Yes." | green | **RED 1/67** |
| `edge-two-npm-wrong` §DP "… `npm run chess` or `npm run perft`." | green | **RED 1/67** |
| `edge-two-npm-correct` §DP "… `npm run chess`, not `npm run perft`." | — | **RED 1/67**, a correct sentence (gap `QE-059-c`) |
| `edge-slot-comment-short` (slot comment → `<!-- the game -->`) | — | **RED 3/67**: `ABC-059` (the span runs into `- Perft harness … npm run perft`) and `ABC-065` A1 and A3 (`QE-059-c`) |
| `edge-abbrev-unknown` §DP "`Dev / run` is, e.g. on a fresh clone, `UNKNOWN - verify`." | — | **green 67/67** (`QE-059-a`) |
| `edge-question-unknown` §DP "What is `Dev / run`? `UNKNOWN - verify`, for now." | — | **green** (`QE-059-a`) |
| `edge-next-sentence` §DP "See `Dev / run` above. It is `UNKNOWN - verify` …" | — | **green** (`QE-059-a`) |
| `edge-token-nospace` (`Dev/run`) / `edge-token-case` (`dev / run`) | — | **green** ×2 (`QE-059-b`) |
| `edge-unknown-lower` (`unknown - verify`) / `edge-unknown-endash` (`UNKNOWN – verify`) | — | **green** ×2 (`QE-059-b`) |
| `edge-node-direct-wrong` (`node src/perft-bench.ts`) / `edge-run-script-wrong` (`npm run-script perft`) / `edge-npm-start` | — | **green** ×3 (`QE-059-b`) |
| `pkg-rename-runner` (`package.json` `chess` → `play`, docs unchanged) | — | 7 red; with `-t ABC-059`, **RED on the floor**: `spans naming npm run play: expected 0 to be ≥ 1` |
| `pkg-rename-both` (script and every `npm run chess` in `AGENTS.md` → `play`) | — | 7 red (`ABC-042` pins `chess`); with `-t ABC-059`, **green**. The command is read, not transcribed (`A4`) |
| `pkg-second-runner` (+`"chess:watch": "node --watch src/cli.ts"`) | — | **RED 2/67**: `ABC-042` A10 and `ABC-059` `runners` length 2. It fails loud on an ambiguous entry |
| `file-prerepair` (`bf685784~1:AGENTS.md`, the file `Q13` shipped in) | 1/66 red (`ABC-065` only). **The old row stays green: the historical blindness reproduced** | **RED 2/67**: `ABC-059` prints `"Dev / run\` above is \`UNKNOWN - verify\` and stays that way."` |
| `file-abc087` (`8330651d:AGENTS.md`) | 66/66 green | **67/67 green** |

Load1 was 4.1–6.1 across both runs. The failure messages are in `../probe/mutants-head-reasons.out.txt`.

## Counts (`../probe/spans-qe.out.txt`, `spans-prerepair.out.txt`)

| file | occurrences | `UNKNOWN - verify` spans | spans naming `npm run`, all `npm run chess` | `UNKNOWN - verify` in file | bytes |
|---|---|---|---|---|---|
| head `AGENTS.md` (= base; the branch does not touch it) | 3 | 0 | 2, yes | 8 | 24,433 |
| `ABC-087` `8330651d` | 3 | 0 | 2, yes | 8 | 24,162 |
| pre-repair `bf685784~1` | 2 | **1** | 1, yes | 9 | — |

The pre-repair file reads exactly test note 2's "1/2 disagreeing on the pre-repair text".

## `A5` / `A6`

- `git diff --name-only 14c940ff~1 14c940ff` = `src/cli.test.ts`, and `14c940ff~1` = `0b6e1c25`.
- numstat `76 0`, one hunk `@@ -2137,0 +2138,76 @@`.
- No production path under `src/` differs `0b6e1c25..4230d3ab`.
- Added lines: 0 `child_process`/`spawn`/`exec`. `it(` goes 66 → 67. One `describe("ABC-059 …")`.
- `ABC-042`'s `A1` row: 670 B / 11 lines, sha256/16 `a3054e05ecb305b1` at base and head.
  `ABC-065`'s `describe`: 11,004 B / 184 lines, `4c2d5f84a0dc8dd9` at both.
- `chess` and `src/cli.ts` do not appear in the added code. `src/cli.ts` appears once, inside the
  docblock (`:2154`).

## Cost: `ADR-0035` (`proposed`) narrow set `src/cli.test.ts`, base `0b6e1c25` / head `14c940ff` / twin

The SE's `timing.sh` was run with only the path lines changed and `diff -r -x node_modules` for the
twin check. The twin was identical to base both times. The setup was n = 8 (9 rounds, round 0
discarded), k = 2, counts 66/67/66 asserted on every run, and `score.mjs` unchanged.

| set | load1 median (range) | base CPU | twin − base | twin R | head − base, interval | state vs 650 ms |
|---|---|---|---|---|---|---|
| 1 | 3.56 (3.38–4.03) | 5.907 s | −0.001 s (**−0.02 %**), sign 4/8 | 0.086 s | **+0.047 s** (+0.80 %), −0.092..+0.087 | admissible, resolves, **MET** |
| 2 | 4.08 (3.39–4.44) | 5.957 s | −0.044 s (**−0.74 %**), sign 4/8 | 0.129 s | **−0.063 s** (−1.06 %), −0.286..+0.110 | admissible, resolves, **MET** |

- Both sets pass the catalog's standing admissibility clause (≤ 1.5 %, sign at chance). Both also
  pass `ADR-0035` decision 1's added clause (R ≤ b).
- The state is "MET" **on `ADR-0035`'s protocol, which is `proposed`, not accepted**. The ADR's own
  status governs whether that becomes the catalog's line.
- The engineer's two INADMISSIBLE sets (load1 19.7 / 34.4) are not contradicted. They were noisier
  instruments; these are 5x quieter.
- The count side: 0 files, 0 children, `N8_SPAWN` 27 (the pin row is green in every non-package
  mutant).

## Gates (`../probe/gates.out.txt`; QE's worktree at `4230d3ab`; load1 3.56 → 7.49)

- `npm run lint`: exit 0, 98 files. `npm run typecheck` and `npm run build`: exit 0.
- `npm test`: exit 0, **51 files / 1584 passed**.
- Skip count: **0**, measured with `AGENTS.md`'s capture command.
- `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- `lane-inventory.js`: "The lane collects 51 test files; git tracks 51. No findings.", exit 0.
