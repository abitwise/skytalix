---
id: 20261022T190834Z-security-nfr-observation-911ecf9d
kind: observation
by: security-nfr
at: 2026-10-22T19:08:34Z
verified_by: 
confidence: high
refs:
  - ABC-199
  - N8-LANE
  - NFR-008
  - NFR-003
  - NFR-006
  - ADR-0035
  - ADR-0014
  - QE-198-a
  - 08d42d01
  - 3d6856db
  - 8c0c5c81
  - 8bd75e46
  - 20261022T190056Z-software-engineer-observation-c662ec3c
  - 20261022T190056Z-software-engineer-observation-925c7566
  - 20261022T190056Z-software-engineer-decision-71bb85ca
  - 20261022T185854Z-ba-pm-decision-623c0fed
  - 20261021T082900Z-security-nfr-decision-06c147db
supersedes: 
seal: sha256:5397625c24e31361a90939411eae35a25542015d2039b4f0fb548b6d48df595f
---

# ABC-199 A8 readings: diff scope, why the change cannot add CPU, and the two catalog cells. Records only, no vitest, no timing

Security/NFR, task `security-nfr-ABC-199`, 2026-10-22. Worktree `../wt-security-nfr-ABC-199`, branch `grugops/security-nfr-ABC-199` from `main` `8bd75e46`. The ABC-199 branch tip is `8c0c5c81` and its code commit is `3d6856db`. The base is `08d42d01`, an ancestor of `main`. `ABC-178` is not merged into `main` yet.

## Diff scope (read with git, not inherited from the SE)
- `git diff --name-only 08d42d01 3d6856db` lists `src/engine.test.ts` and `src/uci-session.test.ts` and nothing else, with numstat 8/1 each. `08d42d01..8c0c5c81` adds only the three SE notes under `.grugops/context/ticket-to-pr-ABC-199/notes/`.
- `src/` outside `*.test.ts`: 0 files. `package.json` and `package-lock.json`: 0. `vitest.config.ts`, `tsconfig*`, `biome.json` and every other config: 0. `tools/` and `AGENTS.md`: 0.
- `+` lines matching `timeout`, any case: 0. The comments say "timed out", which does not match.
- There are two hunks. `src/engine.test.ts` @1266 is inside `describe("ABC-170 A2 …")`: `MAX_NODES` goes 20_000 → 6_000, plus a comment. `src/uci-session.test.ts` @360 is inside `describe("ABC-167 A7 …")`, row 1: the unlimited `go`'s `talk(…, 50)` becomes `talk(…, 100)`, plus a comment. No `it`, `describe`, import, spawn, file or fixture is added. The capped `go depth 3` keeps step 50.

## Why the work can only go down: by construction, then sized by the census
- **`ABC-170 A2`.** `maxNodes` is an abort ceiling. Lowering it can only abort earlier. Row 2's reference searches follow the reported depth d, which goes 3 → 2, so they get shallower. No production line changed, so the cost per node is the same code.
- **`ABC-167 A7` row 1.** `dialogue()` wires `now: virtualClock(stepMs)`, and the engine reads the clock once every `NODES_PER_CLOCK_CHECK` (1024) nodes. Doubling the step uses up the same budget in half as many reads, so the unlimited `go` is capped at about half the nodes.
- **Sized by the SE's census (`…c662ec3c`, nodes only, QE's re-read is still owed under A7):** row 2: 35 759 → 11 221 (31.4 %); `ABC-170 A2` row 1: 20 058 → 6 746; `ABC-167 A7` row 1: 55 972 → 26 276 (46.9 %). The collection-phase calls (214 and 84 lines) are byte-identical at base and tip. Test counts per file are equal (47 and 126; 1 995 in total).
- I take the direction from the diff, not from the census. If QE's re-read moves the magnitudes, the direction does not change.

## The two catalog cells (BA/PM `…623c0fed`)
- **`NFR-003`'s "no prompt exists" is stale.** `src/line-input.ts` exports `PROMPT = "> "` (`ABC-037`), and `src/cli.ts` wires it with `createLineInputSeam`. Production `src/` has no `setRawMode` (grep, 2026-10-22). No input-latency reading exists anywhere, so the I/O half really is `UNKNOWN - verify`.
- **`NFR-006`'s "not built yet" is stale.** `data/opening-book/book.json` is 356 526 B by `wc -c` at `8bd75e46`, sha256 `3802f52f…4bb41d`, and its last commit is `5332f501` (`ABC-093`). The instrument is `tools/opening-book/book.test.ts:227` "A5 — NFR-006" (`NFR_006_BYTES = 1_048_576`). The trace row `ABC-093 (QE)` records "`NFR-006` MET: 356,526 B (34.0%)". The cell's "size check at build" never existed: `npm run build` is `tsc -p tsconfig.build.json`.
- **Ownership.** The catalog states that MET/MISS is Security/NFR's. Security/NFR has edited `NFR-003`, `NFR-005` and `NFR-008` cells before (2026-10-10, 2026-10-20). BA/PM's note names both cells as Security/NFR's. So the edit is mine to make, and I made it.

## Security
Not triggered. The change is test-only, with no input surface, no secret, no data path, no dependency and no config. No ASVS L1 item applies. `NFR-010` (heap caps) is untouched.
