---
id: 20261010T154029Z-qe-e2e-artifact-ref-abc132-probe-ec024f29
kind: artifact-ref
by: qe-e2e
at: 2026-10-10T15:40:29Z
verified_by:
confidence: high
refs:
  - ABC-132
  - .grugops/context/qe-ABC-132/probe/
supersedes:
---

# QE `ABC-132`: probe scripts

This note is hand-authored and unsealed. All the scripts are read-only against the repo. Each reads
blobs with `git show` and puts temp files in `os.tmpdir()`.

| script | usage | what it does |
|---|---|---|
| `probe/exit132.mjs` | `<repo> <base> <tip> <file…>` | Owner Q4 measures (i) and (ii), plus (iii) token stream, per file, with the NEG and POS controls per file. Headers are recognised only outside a hunk (`QE-132-c`) |
| `probe/exit-7387c65a.txt` | — | Full output of `exit132.mjs` over `3159ab68..7387c65a` |
| `probe/blind.mjs` | `<repo>` | The `A4`-filter and (i) blind-spot controls of `QE-132-b`. Imports `exit132.mjs` |
| `probe/closure.mjs` | `<srcDir>` | Load closure of `render-seam.ts` and per-frame loads (4 mode × orientation variants), with a positive control on `result-screen.ts` |
| `probe/a3.mjs` | `<repo> <base> <tip>` | `A3`: normalized docblock words, and the kept-sentence identity check |
