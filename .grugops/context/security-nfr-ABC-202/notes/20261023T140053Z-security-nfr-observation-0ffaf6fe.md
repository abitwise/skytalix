---
id: 20261023T140053Z-security-nfr-observation-0ffaf6fe
kind: observation
by: security-nfr
at: 2026-10-23T14:00:53Z
verified_by: 
confidence: high (direct reads of raw files on main a2d7dda7; SHA256SUMS 23/23; nothing run)
refs:
  - ABC-202
  - security-nfr-ABC-202
  - EPIC-007
  - M1
  - M8
  - ADR-0044
  - ADR-0045
  - NFR-012
  - RISK-EPIC007-01
  - QE-202-a
  - QE-202-b
  - e5c5c2a5
  - a2d7dda7
  - plans/nfr-catalog.md
  - plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md
  - .grugops/context/qe-read-ABC-202/raw/run.sh
  - 20261023T135324Z-qe-e2e-observation-8a2be50b
  - 20261023T135324Z-qe-e2e-observation-202e80c8
  - 20261023T135324Z-qe-e2e-observation-81066c23
  - 20261023T135324Z-qe-e2e-decision-632c11f1
  - AR-NFR004-A
  - NFR-004
supersedes: 
seal: sha256:2066e1d845bcb7e13aa600292270320e8d747b7a28b464c8dc9ed07982a656ff
---

# Security/NFR on `ABC-202`: QE's raw files re-read and its counts reproduced (records only, nothing run)

Read on `main` `a2d7dda7` from `.grugops/context/qe-read-ABC-202/raw/`. No game, no build, no vitest and no timing were run at this hop. Two small read-only scripts parsed the logs in the scratch folder.

## Integrity
- `SHA256SUMS`: **23/23 OK**.
- `attempt1-run.sh` → `run.sh` (`6562e145c5e02361…`): the diff is exactly the two `-debug` → `-debug all` tokens plus a three-line comment. No `tc`, option, opening, round count or path changed.

## QE's counts, re-counted from `m1.out` / `m8a.out`
- `Finished game`: 6 in M1 and 2 in M8(a), all pass texts by `ABC-202` `A3`'s allow-list (3 × `White mates`, 3 × `Draw by 3-fold repetition`; `White mates`, `Black mates`).
- M1: 493 `go` lines to the engines, **0** without `wtime … btime … winc 1000 binc 1000`.
- M8(a): 151 `go` lines, **0** other than exactly `go depth 4`.
- `setoption`: 0 in both runs. `illegal|stall|disconnect|loses on time|timeout|error|crash`: 0 in both. `ignores go depth`: 0.
- `isready` sent while a `go` was unanswered: **0 in both runs**. So the tool never pinged during a search.
- All four `stderr` files: 0 bytes (`e3b0c442…`).

## `go` → `bestmove` gap, as the tool timestamps it (reported, not graded)
- M1: n 493, median 1 955 ms, **max 3 010 ms**. 69 moves are over 3 000 ms, and none is over 5 000 ms. The over-3 000 moves are spread over every game (16 / 12 / 11 / 9 / 9 / 12 in games 1–6, max 3 003–3 010 ms each). So the quiet games 5–6 look the same as the loaded games 1–4.
- M8(a): n 151, median 15 ms, max 294 ms.
- The ≤ 10 ms overshoot of the 3 000 ms level-5 budget lies within `AR-NFR004-A` (≤ 31 ms, by the abort granularity). This tool-side gap includes pipe and scheduling time, and it is not `NFR-004`'s instrument. `NFR-004` is not re-read here.

## Host log (`raw/host.log`, AC throughout)
- Before M1: load1 4.73, thermal 0, foreign vitest 2.
- M1 games 1–4 (13:34–13:44Z): thermal 1 at most samples, 2 once (13:41:24Z); load1 max 7.85 (13:37:08Z); foreign vitest at most samples.
- Games 5–6 (13:44–13:51Z) and M8(a): thermal 0, no foreign vitest, load1 2.84–4.31.
- So QE's account of the host is exact. The host was not quiet for games 1–4 under `ABC-202`'s thresholds (thermal ≥ 1, a foreign vitest). Load1 never crossed 8.

## Catalog and page, before and after
- `plans/nfr-catalog.md`: one inserted line (`NFR-012`). Every `NFR-001`–`NFR-011` line hashes the same before and after. Removing the new line gives back the old file byte for byte (`cmp`).
- The `ABC-202` page: one 7-line dated erratum block after the pinned block. The block itself and every other line are unchanged.
