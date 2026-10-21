---
id: 20261021T093000Z-qe-e2e-observation-5e2bf05e
kind: observation
by: qe-e2e
at: 2026-10-21T09:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-163
  - AR-095-L1UNIT
  - F-095-1
  - ADR-0036
  - grugops/ABC-163
  - dc4d4f15
  - 87d3897d
  - d8c073e2
  - ccccc6bb
  - 341da4c1
  - grugops/qe-ABC-163
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - plans/tickets/ABC-163-the-clause-b-instrument-fires-nothing-when-a-limb-1-holder-changes-what-it-reads.md
  - A1
  - A2
  - A3
  - A4
  - A5
  - 0974102f
  - 2307fc11
  - 3ea3e352
  - 98ea0a84
  - f00038ef
  - 1671f24f
  - src/book-file.ts
  - 20261021T090519Z-software-engineer-observation-b896aae8
supersedes: 
seal: sha256:3c12527a159bc6e7d4c26ebf4d335ba1b629cd185fb0e6f06cdaad5126e49946
---

# ABC-163 QE readings, A1–A5, OLD (`341da4c1`) vs NEW (`87d3897d`) instrument: all five MET on QE's own plants and pairs

**Method.** Both instruments were copied out of git into the session scratchpad (`qe163/instr/`), outside the
repository, with `node_modules` symlinked. OLD = `git show 341da4c1:<instrument>` (sha-256 `433d0c50…`, the same bytes
as at `ccccc6bb`). NEW = `git show 87d3897d:<instrument>` (sha-256 `ad47a564…`, the same bytes as at the tip
`dc4d4f15`). Plants: two scratch repositories, each `git init` plus `git archive` of one commit as a single base
commit, one plant commit per branch. Tree A = `git archive dc4d4f15` (the tip). Tree B = `git archive 1671f24f`
(the page's problem reading). Real pairs were read from git objects in the QE worktree (the instrument reads
`git show`/`ls-tree`/`diff` only). The SE's readings (`…b896aae8`) were opened only after every reading here was taken.

## Plants (`L1` = `node <instrument> base <plant> 1`)
| plant | edit | tree | OLD limb 1 | NEW limb 1 | NEW Ruling 2 line |
|---|---|---|---|---|---|
| P2b | `book-file.ts:16` → `return readFileSync("/etc/passwd");` | A, B | does not fire | **FIRES** | `src/book-file.ts  (fired by Ruling 2: 1 + line; holds limb 1 at <base> and <head>)` |
| P2c | `readBookFile(path: string)` + `readFileSync(path)`; `cli.ts:179` `read: () => readBookFile(\`data/opening-book/${colour}.json\`)` | A, B | does not fire | **FIRES** | `src/book-file.ts  (… 2 + lines …)`; `cli.ts` is not a holder, not named |
| comment | `book-file.ts:3` docblock wording only | A, B | does not fire | **FIRES** | `src/book-file.ts  (… 1 + line …)` |

On both trees, limbs 2 and 3 read "does not fire" under OLD and NEW and are byte-identical (P2b, P2c, comment:
6 + 6 limb runs). At `1671f24f` OLD reads "does not fire" on all three limbs for P2b, which is the page's problem
statement reproduced.

## Grades
| criterion | grade | reading |
|---|---|---|
| `A1` | **MET** | P2b and P2c: limb 1 FIRES under NEW, the (b1) Ruling 2 line names `src/book-file.ts`, 2 of 2, on both trees. OLD: does not fire |
| `A2` | **MET** | comment-only plant: limb 1 FIRES under NEW (OLD: does not fire) |
| `A3` | **MET** | QE's own pair `f00038ef^1..f00038ef` (`ABC-083` merge; `src/evaluate.ts` +137, `src/puzzle-corpus.ts` +3): NEW prints `no limb-1 holder at <base> or <head>; adds nothing`; verdict "does not fire" = OLD. Also true on `02dfa044^1..02dfa044` (`ABC-094`), `8a2d41a8^1..8a2d41a8`, `b696d8e8^1..b696d8e8`, `fec51def^1..fec51def`, the span `49edb4f7..0974102f` (37 production files changed) and the SE's `dbaf972f^..dbaf972f`. A `git` shim on `PATH` logged OLD and NEW on `f00038ef^1..f00038ef`: **79 calls each, identical lists**; the one `diff` is `diff -U0 --no-renames f00038ef^1 f00038ef -- src`; no `--name-only`, no holder pathspec (same on `3ea3e352..98ea0a84`, 84 = 84). For contrast, the by-hand trap: `git diff --name-only --no-renames f00038ef^1 f00038ef --` lists 162 paths |
| `A4` | **MET** | `0974102f..2307fc11`: L1 FIRES, (b1) `src/book-file.ts:13  import { readFileSync } from "node:fs";`, (b2) `src/cli.ts -> src/book-file.ts  (holds it)`; Ruling 2 adds `src/book-file.ts` (17 + lines, holds at `<head>`); L2 FIRES (b1) `src/cli.ts:177`; L3 does not fire; holder union **4** (L1 `book-file.ts`; L2 `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`; L3 none). `3ea3e352..98ea0a84`: all three limbs do not fire; holders **4**; Ruling 2 `holders 1 at <base>, 1 at <head>; holder files with + lines: 0`. Both equal the record |
| `A5` | **MET** | `ADR-0036` § S1 ends with `#### Ruling 2 folded — 2026-10-21 (ABC-163)`, naming `87d3897d`, the in-place edit, the `341da4c1` reproduction pointer, and the by-hand step retired. `git diff --numstat ccccc6bb dc4d4f15 -- src/` is empty (0 lines) |

**Agreement with the SE (read afterwards).** Every verdict above that the SE also read (`A1`, `A2`, `A3` on
`dbaf972f`, `A4` both pairs) agrees. The SE's comment plant edited line 9, this one line 3; both fire.
