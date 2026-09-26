---
id: 20260925T200300Z-software-engineer-claim-abc121-what-this-build-did-not-verify-82816ae6
kind: claim
by: software-engineer
at: 2026-09-25T20:03:00Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-121
  - ADR-0026
  - NFR-005
  - N8-LANE
supersedes:
---

# What the ABC-121 build did not verify

Hand-authored, no `seal`. Each item below is a place a later hop can find this build wrong.

1. **The ~1 s of `N8-LANE` charge that no per-file run explains** (`…24e3648a`). It was measured
   at a load median of 13.6. It was not re-measured quiet.
2. **The G6 re-point is my reading of `ADR-0026` decision 4 over decision 7** (`…0da3f1a5`). If
   Architect/Design reads decision 7 as binding, it is the queue's first stop condition.
3. **The whole `SEARCH_DEEP` suite was not re-run end to end after the final amend** (`9823c27`).
   What ran instead:
   - the full `SEARCH_DEEP` run at `39ce7a2`, where 199 of 200 passed and the rook-ending row was
     red;
   - `transposition.test.ts` `SEARCH_DEEP` alone after the split: 40 / 40;
   - `ENGINE_DEEP` on `engine.test.ts` + `transposition.test.ts`: 59 / 59;
   - the default lane at `9823c27`: 48 files / 1 467.
   The amend added one default-lane row and changed nothing in `src/*.ts`, so no deep row moved,
   but that is argued, not run.
4. **`A2`'s wall-clock readings are one machine (Apple M3) under load 3.6–5.7.** `NFR-005`'s
   verdict is Security/NFR's. The depth-7 WARN level stays PROVISIONAL behind `ABC-074`.
5. **The vitest `A2` reading runs inside `search.pvs-lmr.test.ts`'s `transposition.ts`
   instrument**, which wraps `storeEntry` and `boundOf`, so it reads low in absolute terms. The
   build-vs-door comparison inside it is fair; the absolute depths are not comparable to
   `engine.test.ts`'s `NFR-005` row.
6. **The mate corpus is the review's derivation.** It holds rook and queen mates against a lone
   king only; no middlegame mate is in it (`…b58e2d14` item 4, unchanged).
7. **The `A4` fixture was chosen by the reference probe, then confirmed on the build.**
   `search()` and `chooseMove` both show the null-window re-search, and both mutants red on it.
   No other fixture was built.
8. **`ADR-0026`'s Consequences expect the mate floor to red PVS window bugs. In this build it
   does not**, because the reference door shares the PVS code (`…7f29f842`). `ABC-077` `A1` does.
   Not a row change; for Architect/Design.
9. **The queue claim is a bare `mkdir` in this worktree** and does not exclude a claimant in
   another checkout (same caveat as `…0f93c6b1` item 7).
