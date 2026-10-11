---
id: 20261010T185518Z-qe-e2e-artifact-ref-abc141-probe-aef1ebbe
kind: artifact-ref
by: qe-e2e
at: 2026-10-10T18:55:18Z
verified_by:
confidence: high
refs:
  - ABC-141
  - .grugops/context/qe-ABC-141/probe/
supersedes:
---

# QE `ABC-141`: probe scripts and outputs

This note is hand-authored and unsealed. The scripts never write into the checkout. The count probe modifies
only the `git archive` copy it is given.

| file | usage | what it is |
|---|---|---|
| `qe141-count.mjs` | `node qe141-count.mjs <archived-tree>` | Derive counter (rename-and-wrap of `legalMoves`, per-call position snapshot). It also parses fullmove 10000 |
| `qe141-q4.mjs` | `QE_TMP=<dir> node qe141-q4.mjs <repo> <base> <tip> <file...>` | Owner Q4: (i) AST comment ranges, (ii) the `removeComments` emit under the repo tsconfig and ESNext, plus 1 POS and 5 NEG controls |
| `qe141-enclosing.mjs` | `node qe141-enclosing.mjs <repo> <base> <tip> <file...>` | The enclosing call chain of each added line (`it` / `describe`) |
| `count.txt` | — | Counter output at `75dcc0f5`, `957a85c3` and `f92868f6` |
| `q4-957a85c3..f92868f6.txt` | — | Q4 output with controls |
| `enclosing.txt` | — | Enclosing-call output |
| `npm-test-x8.txt` | — | 8 JSON-reporter runs: totals, load1, log sha256, and per-file status/tests/duration per run |

The full JSON logs (5.1 MB) are not committed. They stay in the QE session scratchpad (`qe141/logs/run-N.json`),
and `npm-test-x8.txt` holds their hashes.
