---
id: 20261103T150331Z-software-engineer-decision-2b4795b8
kind: decision
by: software-engineer
at: 2026-11-03T15:03:31Z
verified_by: 
confidence: high
refs:
  - ABC-276
  - EPIC-011
  - ADR-0049
  - QE-275-a
  - QE-273-b
  - SEC-HP-1
  - sec-host-paths/20261103T144802Z-security-nfr-decision-72b4070b
  - sec-host-paths/20261103T144802Z-security-nfr-observation-45ef018a
  - grugops/ABC-276
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
supersedes: 
seal: sha256:020a843bdb67be511f215436b6369550733cd066f8afc4c350a9de635e6571a5
---

# SE decision, se-ABC-276: one sealing step (`sealRecords`) for r, d and rpair; the played argv untouched

- **Shape (test note 1).** rpair's redaction loop and `SHA256SUMS` write became one exported step, `sealRecords(out, listed)`: every file under `out` but `clone-*` dirs (`recordFiles`) goes through `redacted(text, out)` (the same `hostPaths(out)` + `hostWords()` rpair used), then `SHA256SUMS` is written last over `listed(out)` minus `SHA256SUMS`, sorted.
- **rpair** calls `sealRecords(out, recordFiles)`: the same loop, the same file list, so its records are unchanged (scope: rpair unchanged).
- **r / d** call `sealRecords(out, topFiles)`; `topFiles` (exported) is the old top-level `readdirSync` + `statSync().isFile()` list, so the summed file set is the same as before (A2).
- **Scope 1 / 4.** r / d write `machine.txt` and `cmd.txt` through `red = redacted(·, out)` and print `red(machine)` and `red(summary)`. `summary.txt` is written raw, then redacted by the sealing step before the sums.
- **A3.** `cutechessArgs`, `play(...)`, `argvText` and every dry-run print are untouched; only `cmd.txt`'s record text is redacted.
- **A5 (`QE-275-a`).** `usage()` line 1 `[--budget-ms 500|100]`, line 5 `R 500 or 100`; the other 5 lines byte-equal. The file header's r line was updated to match (doc only).
- **A4 row** builds a fresh `rating.ts` module instance (`import("./rating.ts?abc276")`) with `CUTECHESS_CLI` / `STOCKFISH` as symlinks in a temp dir, so the given path and realpath of each tool and of the out dir all differ and are all planted. No literal path is written.
- **Deviation from the page:** none.
