---
id: 20261010T103353Z-qe-e2e-observation-abc130-mutants-ticket-qe-tool-5d3e0173
kind: observation
by: qe-e2e
at: 2026-10-10T10:33:53Z
verified_by:
confidence: high
refs:
  - ABC-130
  - ABC-118-G4
  - tools/grugops/lane-inventory.js
  - commit:1ae58c32
  - .grugops/context/qe-ABC-130/notes/raw-qe-harness.sh.txt
  - .grugops/context/qe-ABC-130/notes/raw-qe-tool-mutants.sh.txt
  - .grugops/context/qe-ABC-130/notes/raw-out-qe-tip.txt
  - .grugops/context/qe-ABC-130/notes/raw-out-qe-base.txt
  - .grugops/context/qe-ABC-130/notes/raw-out-qe-tool-mutants.txt
supersedes:
---

# `ABC-130`: 30 tree scenarios each on base and tip, plus 5 tool mutants against an unmutated control (`T0`). On the shipped tool every `.grugops/` line is true; the one false line is the fenced G4 (`Q2f`)

Method: `git archive <tree>` → a template, then `git init`, a commit (auto-gc off) and a symlinked
`node_modules`. Each scenario runs in a fresh `cp -R` of that template. Replacement configs are made
by `perl` substitution in the copy, and every substitution is counted before the run. The first
attempt raced git's detached auto-gc while copying, so it was discarded and re-run with
`gc.auto=0`. Base `b62d1b6`, tip `1ae58c3`. Output is `collected / tracked`.

**The ticket's mutants, re-run (QE's harness):**

| scenario | base | tip |
|---|---|---|
| S0 real tree | 50/53, exit 1 | 50/50, exit 0 |
| A2 glob removed | 54/53, 1 line (`.mjs`, false `NOT tracked`), exit 1 | 54/50, 4 lines, 0 false, exit 1 |
| A2 restored | exit 1 | exit 0 |
| M1 / M2 / M3 | exit 1 (masked by the 3 probe lines) | each red with its path named; M2 restored → 0; M3 after `git add` → 0 |
| A4 committed probe | 50/54, exit 1 | 50/50, exit 0 |

**QE's own tree mutants (tip):**

| id | plant | tip result | true? |
|---|---|---|---|
| Q1a | deep `.grugops/context/a/b/c/d/deep.test.ts` committed; glob mistyped `".grugops/*"` | 50/50, exit 0 | yes. vitest 3.2.7 prunes the whole directory on `.grugops/*`, so the lane did not change. Not a harmful edit (QE-130-e) |
| Q1b | the same deep probe; glob mistyped `".grugop/**"` | 55/50, exit 1, **all 5** named on the factory-state line, 0 false | yes. Base: only the `.mjs`, false text, and the deep tracked probe went **unreported** |
| Q1c | `src/.grugops/zz.test.ts` committed (a nested `.grugops`, not the root one) | 51/51, exit 0 | yes. Root-anchored glob and root-anchored pathspec agree: it is a lane file |
| Q1d | Q1c + glob over-broadened to `"**/.grugops/**"` | 50/51, exit 1, `Tracked by git but NOT collected: src/.grugops/zz.test.ts` | yes |
| Q1e | `src/.grugops/zz.test.ts` untracked | exit 1, `NOT tracked by git` | yes. It is untracked, and `startsWith(".grugops/")` correctly does not claim it |
| Q2a | `tools/zz.test.ts` committed | 51/51, exit 0 | yes |
| Q2b | `tools/zz.test.ts` untracked | exit 1, named | yes |
| Q2c | `plans/zz.test.ts` committed | 50/51, exit 1, `Tracked … NOT collected` | text true, red on a correct tree (QE-130-c, fenced) |
| Q2d | `.claude/skills/zz.test.ts` committed | 50/51, exit 1 | as Q2c; `.claude/` is not in the page's fenced list (QE-130-c) |
| Q2e | `.grugopsx/zz.test.ts` committed | 51/51, exit 0 | yes. The trailing `/` holds the boundary |
| Q2f | `src/zz.test.mjs` committed | 51/50, exit 1, `NOT tracked by git` | **false.** It is tracked. This is `ABC-118` G4, open for non-`.grugops/` paths as scoped (QE-130-d) |
| Q3a | `.grugops/context/my probe/sp ace "q" 's'.test.ts` committed | 50/50, exit 0; glob removed: 55/50, exit 1, the path printed verbatim, 0 false | yes |
| Q3b | `src/sp ace "q" 's'.test.ts` | untracked: exit 1, named verbatim; committed: 51/51, exit 0 | yes |
| Q3c | `src/ümlaut.test.ts` | untracked: exit 1, named; committed: 51/51, exit 0 | yes |
| Q4a–c | extra argv / env `OMITTED_DIR=src/` / cwd `src/` | 50/50, exit 0 each | yes. Argv, env and cwd do not reach the set |
| Q4d | `.grugops/` removed entirely | 50/50, exit 0 (an exclude-only match on nothing does not error) | yes |

**Tool mutants (tip copy, tool edited in the copy only).** Each was confirmed applied by diff line count.

| id | mutation | killed by the ticket's criteria? | killed by QE? |
|---|---|---|---|
| T1 | pathspec dropped from argv | **yes**: A1 (50/53), A4 | — |
| T2 | the `.grugops/` message branch removed | **yes**: A2 (4 false `NOT tracked` lines) | — |
| T3 | `OMITTED_DIR = ".grugops"` (no slash) | **no**: A1, A2 and A4 all as the tip | Q2e: `.grugopsx/zz.test.ts` reds, exit 1 |
| T4 | `OMITTED_DIR = ".grugops/context/"` | **no** | Q5: a committed `.grugops/queue/zz.test.ts` reds, 50/51 |
| T5 | pathspec read from `vitest.config.ts` | **no**: A2 still exits 1, names 4, 0 false | A2 tracked count 53 ≠ 50 (QE-130-a) |
