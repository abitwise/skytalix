---
id: 20261010T193535Z-qe-e2e-artifact-ref-abc094-probe-19fb5b97
kind: artifact-ref
by: qe-e2e
at: 2026-10-10T19:35:35Z
verified_by:
confidence: high
refs:
  - ABC-094
  - src/book.test.ts
  - .grugops/context/qe-ABC-094/probe/
supersedes:
---

# QE `ABC-094`: the probe directory and the test commit

This note is hand-authored and unsealed. It points at a committed probe, not a UAT spec. So it carries no
`sha`, `gate_run` or `content_hash`: no `§14-gate` verdict exists on this install.

QE's test commit on `grugops/ABC-094-book-probe` is `58726139`. It changes `src/book.test.ts` only: 9 tests in
one new `describe` block and two widened imports. It touches no production line.

Everything below is under `.grugops/context/qe-ABC-094/probe/`. Every script runs with `node` or `bash`.
None of them writes to the repository.

| file | what |
|---|---|
| `qe-harness.ts` | QE's independent harness. Modes: `all` runs the checks (A1–A7 plus EXTRA); `pick` and `stream` are the child-process modes; `timing` measures outside the suite. Usage: `node qe-harness.ts <tree root> [mode]` |
| `harness-RUN.txt` | The `all` run on the final tree: 119 checks, 0 fails |
| `mutants.tsv`, `mutants.sh` | 34 perl-substitution mutants of `src/book.ts`, and the out-of-tree runner. It runs the suite file and the harness for each mutant |
| `mutants-RUN-1-delivered-suite.tsv` | The mutants against the SE's 26-test suite |
| `mutants-RUN-2-final-suite.tsv` | The mutants against the final 35-test suite. 32 of 34 are red; M11 and M17 are equivalent |
| `cost.sh`, `cost-read.mjs` | The `ADR-0035` narrow-set harness (4 arms) and its reader (n = 8, k = 2) |
| `cost-runs-1.tsv`, `cost-RUN-1.txt` | Run 1, admissible, MET |
| `cost-runs-2.tsv`, `cost-RUN-2.txt` | Run 2, inadmissible |
| `timing-RUN.txt` | `N-LOAD` and the hit timings: 5 runs, with load1 |
