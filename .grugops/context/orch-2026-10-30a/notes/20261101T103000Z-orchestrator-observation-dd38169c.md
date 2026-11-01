---
id: 20261101T103000Z-orchestrator-observation-dd38169c
kind: observation
by: orchestrator
at: 2026-11-01T10:30:00Z
verified_by: 
confidence: high
refs:
  - plans/nfr-catalog.md
  - .grugops/context/qe-EPIC-010-m1-batch-2/raw/batch/machine.txt
  - .grugops/context/qe-ABC-240/
supersedes: 
seal: sha256:a64dd7ea4bebdbca704513a1a75bd897c84009421ef9d9aadfe659d132a71282
---

# Owner context 2026-11-01: hosts and run width

Owner, verbatim: "previous machine was Macbook Air M3 (15 inch) and this machine is Ryzen AI 9 HX 370, we might have used 1-2 cores during the runs, initially maybe more."

- Matches the catalog (secnfr-catalog-rebase 2026-10-30: reference = oeselg-dev, AMD Ryzen AI 9 HX 370; Apple M3 lines are history) and the batch machine.txt (qe-EPIC-010-m1-batch-2: chip AMD Ryzen AI 9 HX 370).
- Run width: skytalix is single-threaded and Stockfish runs Threads=1, so each game uses ~2 busy cores at most (one engine thinking at a time, plus the idle opponent). The milestone-1 batch ran at --concurrency 1; ABC-225's width-2 runs tripped 85 °C, hence width 1. Earlier M3-era rating runs may have run more games in parallel (owner: "initially maybe more"; exact widths UNKNOWN - verify per run's cmd.txt).
- Consequence (no action): results across hosts or across concurrency widths are not compared; the 4 000 ms trend reference (72.00 % ± 6.11, 51902be5) is a oeselg-dev, width-1 figure. The last skytalix nps reading on this host is qe-ABC-240 (2026-10-30, "Linux, 24 cores"): ~634 k start, ~876 k kiwipete, ~897 k position-6 at 3 000 ms; not re-read since ABC-228.
