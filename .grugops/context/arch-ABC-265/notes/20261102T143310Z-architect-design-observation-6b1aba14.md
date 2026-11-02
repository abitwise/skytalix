---
id: 20261102T143310Z-architect-design-observation-6b1aba14
kind: observation
by: architect-design
at: 2026-11-02T14:33:10Z
verified_by: 
confidence: high for the counts (deterministic, scratch prototype, not A3); cited profile shares are se-ABC-253's informal figures
refs:
  - ABC-265
  - arch-ABC-265
  - EPIC-011
  - ADR-0025
  - ADR-0057
  - grugops/arch-ABC-265
  - 2a61bd3f
  - src/transposition.ts
  - ABC-081
  - ABC-122
  - ABC-208
  - se-ABC-253
  - NFR-009
  - NFR-005
supersedes: 
seal: sha256:baec73b4ed1cb3a7d50db3833238c14aae66ca46c4f0efe9a56dc11824780941
---

# ABC-265 design probe on scratch (records hop; deterministic counts only, no clock read)

All runs held `flock host-test.lock`, each under 5 min. Scratch copies of `main` `2a61bd3f` outside the repository
(`git archive`), never `src/`; deleted after this hop. Node v26.12.1, TypeScript 5.9.3, vitest 4.1.12.

- **Builds.** base = `main`. head = `src/transposition.ts` rewritten to `ADR-0057` D2.3: one `Uint32Array` over a 4 MiB `SharedArrayBuffer`, words `keyLo^data`, `keyHi^score`, `data`, `score>>>0`; key split inside `probeTable`/`storeEntry` (`bigint` signatures kept); store order 2,3,0,1; hit = `w2 !== 0` and both unsigned XOR equations; a hit's data and score words kept as a module-private verified copy that `tableCutoff` reads; `entryMove` reads word 2 live. headB = head plus the hash move taken from a copy captured right after the probe (both recursions). count = base plus a counter: probe hits that did not cut whose slot no longer verifies for the key when `entryMove` runs.
- **Identity, 90 rows a build** (`search()` d1-7 and `chooseMove` fixed depth 1-8 via `maxDepth`, `now: () => 0`, six perft roots; move, score, nodes): base == head == headB == count, **90/90**, 7 698 099 nodes a build. Examples: kiwipete `chooseMove` d8 1 575 537; position-6 `chooseMove` d8 476 244; kiwipete `search()` d7 592 689; position-6 `search()` d7 607 764.
- **Stale slot at `entryMove`:** 0 in 40 455 probe hits that did not cut (count build, same 90 rows). So headB's copy-the-move variant is indistinguishable at these depths; the live read is kept because it equals today's read by construction at any depth.
- **Unedited rows:** `src/transposition.test.ts`, `src/engine.capacity.test.ts`, `src/search.capacity.test.ts`, `src/search.null-move.test.ts`, `src/search.pvs-lmr.test.ts` on head: 5 files, **85/85 passed**, as on base (85/85). Default lane only; deep rows not run.
- **Typecheck:** head first failed `tsc --noEmit` (TS2322: `Uint32Array<SharedArrayBuffer>` not assignable to the inferred `Uint32Array<ArrayBuffer>`); with the view declared `Uint32Array<ArrayBufferLike>` it passed (rc 0).
- **Memory instrument:** under `--expose-gc`, allocating a 4 MiB `SharedArrayBuffer` raised `process.memoryUsage().arrayBuffers` by exactly 4 194 304 B; head's `tableByteLength()` read 4 194 304.
- **Cited, not re-run:** `se-ABC-253` base profile (`raw/analysis-base.txt`): `probeTable`+`storeEntry` 1.07 % / 0.95 % of samples on kiwipete, 1.44 % / 1.32 % on position-6 (`chooseMove` 4 s); its informal nps A/B spread 1.8-5.9 % a board, halves path 1.004x / 0.992x / 1.015x (`raw/ab-summary.txt`, observation `…ba045718`).
- **Files edited (records only):** `memory-bank/50-decisions/ADR-0025-…` (top dated line; the 2026-11-02 TH-1 amendment, PROPOSED); `memory-bank/50-decisions/ADR-0057-…` (one dated pointer line in § Status). No `src/`, test, plans or board edit.
