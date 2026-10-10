---
id: 20261010T103353Z-qe-e2e-decision-abc130-verdict-pass-with-gaps-d6d904ec
kind: decision
by: qe-e2e
at: 2026-10-10T10:33:53Z
verified_by:
confidence: high
refs:
  - ABC-130
  - ABC-118
  - ABC-118-G4
  - ABC-118-G5
  - ABC-119-A2
  - tools/grugops/lane-inventory.js
  - commit:1ae58c32
  - 20261010T103353Z-qe-e2e-observation-abc130-mutants-ticket-qe-tool-5d3e0173
  - 20261010T103353Z-qe-e2e-observation-abc130-gap-register-119f2ba4
  - 20261010T101420Z-software-engineer-decision-abc130-literal-pathspec-and-message-branch-3e1a7c50
  - 20261010T101420Z-software-engineer-observation-abc130-red-first-and-mutants-8d4b2e91
  - .grugops/context/qe-ABC-130/notes/raw-out-qe-gates-tip.txt
supersedes:
---

# `ABC-130` QE verdict: **PASS_WITH_GAPS** at `1ae58c3`. No gap blocks it

Hand-authored, no seal. This is a `decision`, not a `finding`, because this install has no
`§14-gate` verdict. The diff under review is `b62d1b6...1ae58c3` on
`grugops/ABC-130-lane-inventory-probes`. QE re-ran every criterion itself. The gates ran in the
Engineer's worktree. Every mutant ran in a fresh clone of a `git archive` copy in QE's scratchpad,
using QE's own harness (`raw-qe-harness.sh.txt`, `raw-qe-tool-mutants.sh.txt`). Neither the worktree
nor any `vitest.config.ts` in the repository was edited.

| | reading (QE's own runs) | result |
|---|---|---|
| `A1` | Worktree tip: `The lane collects 50 test files; git tracks 50.` / `No findings.`, exit 0. `git ls-files -- '*.test.ts' ':!.grugops/' \| wc -l` = 50. 0 `.grugops/` lines. Base `b62d1b6`: 50 / 53, 3 findings, exit 1 (red first, reproduced) | **MET** |
| `A2` | `".grugops/**"` removed in a copy (glob count 0): 54 / 50, exit 1, and all four named (3 `.ts` + `ticket-to-pr-ABC-081/probe/depth-vitest.test.mjs`) on the `Collected by the lane from .grugops/ …` line. `.grugops/` lines carrying `NOT tracked by git`: **0**. Restored: 50 / 50, exit 0. Base: 54 / 53, only the `.mjs` was named, and its line carried the false text | **MET** |
| `A3` | M1 `"src/perft.test.ts"` added: 49 / 50, the file named, exit 1. M2 `.claud/**` replacement config + `src` planted under `.claude/worktrees/probe/`: 100 / 50, 51 output lines (50 paths named), exit 1; config restored with the plant still present: exit 0. M3 untracked `src/zz.test.ts`: named, exit 1; after `git add`: 51 / 51, exit 0 | **MET** |
| `A4` | Committed `.grugops/context/zz/probe/new.test.ts`: 50 / 50, exit 0. Base: 50 / 54, 4 findings, exit 1 | **MET** |
| `A5` | `git diff --numstat grugops/wave-2026-09-25...HEAD -- src/ tools/ vitest.config.ts package.json AGENTS.md plans/nfr-catalog.md` = `26 4 tools/grugops/lane-inventory.js`, the only line. `-- '.grugops/context/*/probe/'`: empty. The four probe blobs are identical at `b62d1b6` and `1ae58c3` | **MET** |
| `A6` | `npm run lint` exit 0 (97 files), `typecheck` exit 0, `build` exit 0, `npm test` exit 0: **50 files / 1540 passed / 0 skipped**. `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0. `lane-inventory.js`: exit 0 | **MET** |

**The literal pathspec, confirmed two ways.**
- *Source.* The tool imports only `spawnSync`, `existsSync` and `join`. There is no `readFile*`,
  `process.env` or `process.argv` anywhere in it. `vitest.config.ts` appears only inside two message
  strings. `OMITTED_DIR = ".grugops/"` and ``OMITTED_FROM_TRACKED = `:!${OMITTED_DIR}` `` are
  constants. Every `spawnSync` call takes a fixed argv array, with no `shell` option.
- *Behaviour.* The tracked count stays **50** whether the glob is present or removed (A2: 54 / 50).
  It does not move with extra argv (`':!src/' --exclude src`), with env (`OMITTED_DIR=src/`), or with
  cwd `src/`. All three gave 50 / 50, exit 0.
- *Mutant.* `T5`, which reads the pathspec from the config, gives 54 / **53** under A2. That makes the
  count pin the check that kills it (gap QE-130-a).

**Why `_WITH_GAPS`:** QE added mutants, and some of them survive the ticket's criteria as written,
though the shipped tool kills every one. Two classes stay red on a correct tree, but both are fenced
out of this ticket by name. The register is note `…119f2ba4`: QE-130-a LOW, and QE-130-b, -c, -d
and -e INFO. None is a criterion miss and none blocks leaving `In Review`.

**Exit facts.** `git diff --numstat <wave>...HEAD -- src/` is empty, so **0 production lines**, and
the UAT waiver applies if the merge keeps it so. QE is not UAT. `N8-LANE`: 0 files added under
`src/`, and the lane is 50 files at base and tip. `N8-SPAWN`: 0. ASVS L1 holds: a literal pathspec,
fixed argv, no shell, paths and counts only. `git merge-tree --write-tree` of `1ae58c3` onto the
moved wave tip `6a034c1` is clean (exit 0). The board move is the Orchestrator's. Not merged, not
pushed.
