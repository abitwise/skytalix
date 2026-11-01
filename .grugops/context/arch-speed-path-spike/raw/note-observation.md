# Architect/Design, arch-speed-path-spike: what the records and the code say about where speed is, and what AssemblyScript's own docs say

## From the records (quoted, not re-measured)
- **Profile** (`se-ABC-227` `…7175ebdf`, at `193447bc`, before `ABC-235`/`ABC-240`), kiwipete / position-6 / start:
  - generation + legality 47.4 / 44.9 / 50.5 %, of which make/test/unmake inside the filters is 27.7 / 29.4 / 28.4 % (`arch-ABC-235` `…7fc1b90c`);
  - evaluation 31.5 / 32.8 / 27.0 %; ordering 5.5–6.6 %; make/unmake 4.0–4.2 %; TT 1.1–2.0 %; zobrist 0.7–1.4 %; GC 1.6–1.9 %;
  - allocation 2.7–4.0 KB per node, 76–78 % of it in generation.
  - **BigInt is a small share.** The time is in legality and evaluation, which are algorithmic and port unchanged to any language.
- **Node rate on `oeselg-dev`** (`qe-ABC-240` `…19068f9d`, 3 000 ms): start 633 651, kiwipete 876 154, position-6 896 886. Not re-read since `ABC-228` (Orchestrator `…dd38169c`).
- **Cuts already read:** `ABC-235` 1.20–1.28×, `ABC-240` 1.09–1.12×. `ABC-240`'s allocation cut read 4–15× its self-time bound, so the profiler under-charges allocation.
- **`ADR-0003` menu:** (c2) lazy legality measured 3.2–4.4× per `legalMoves` call in open positions and 0.97–1.2× in check. Authorized by nobody yet; clauses 1 and 3 are owner-ratified.
- **`ADR-0044` rejected alternative 18:** "A bundler, or a WASM build inside this repo".
- **`EPIC-010`:** § Product goal ("be the best vibe-engineered or TypeScript-based chess-engine", aspirational) and § Out of scope ("A Rust rewrite", Q2 2026-10-29).
- **`G8` headroom:** `ABC-248` H 9.09 s, B 9.37 s against the 10 s bar.

## From the code at `3e35b667`
- Every move is a heap object, and so is every undo record.
- Keys are `bigint`; the TT is `BigUint64Array` + `Uint32Array` + `Int32Array`, 2^18 slots, 4 MiB.
- There are two recursions (`search.ts`: `search` + 11 doors; `engine.ts`: `chooseMove` + 5 doors).
- The clock is injected and read every 1 024 nodes. The abort is a `throw`, caught by the deepening loop.
- About 25 non-test modules import `Move` or a core module; 56 of 61 test files import a hot-core module.
- The blunder levels call `chooseMove` once per child.

## From AssemblyScript's docs (read 2026-11-01)
- It compiles a TS variant to WASM through Binaryen.
- FAQ: "pre-existing TypeScript code doesn't magically become faster".
- Status page: no capture of locals in closures; "Throwing currently aborts the program"; no union types except nullable classes; no `any`; rudimentary interfaces; `i64` instead of BigInt.
- Runtimes: `incremental`, `minimal`, `stub`; `@unmanaged` structs.
- Releases: 0.28.x, v0.28.20 latest (year not shown).
- Coverage: `as-covers` last pushed August 2023.

## Outside data (informal, low confidence)
- WASM against native: 1.45–1.55× slower (Jangda, ATC 2019).
- Stockfish WASM ≈ 0.78× of its SSE4.1 build (one dev-build page).
- An AS microbenchmark ≈ 1.2× over JS.
- Elo per doubling ≈ 50–100 at blitz-to-rapid times (TalkChess, Kaufman: ~90 at 6 s a move, ~65 at 15 s).
