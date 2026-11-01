---
kind: adr
id: ADR-0055
---
# ADR-0055: The speed path is chosen on a measured prototype. The four options are in-TypeScript cuts, an AssemblyScript core, a Rust-to-WASM core and the status quo. The order proposed is: measure first, then the TypeScript cuts, then a port only if the reading clears its bar

## Status

**PROPOSED** 2026-11-01 by Architect/Design (task `arch-speed-path-spike`, records and reading only, at `main`
`3e35b667`). **Nothing is decided here.** Nothing was run, built, installed or timed: `qe-ABC-223` holds the host
STRICTLY ALONE. Every speed figure below is either quoted from a sealed reading (named) or is an **estimate** with
its basis and confidence. An estimate is not a reading.

- **Acceptance is the owner's.** The owner delegated delivery on 2026-10-22, but kept language and architecture
  calls (`memory-bank/45-standing-rulings.md`; Orchestrator `orch-2026-10-30a` `…f8b18ece`). O2 and O3 would reverse
  `ADR-0044` rejected alternative 18 ("A bundler, or a WASM build inside this repo"). They would also change
  `AGENTS.md` § Stack ("no bundler or transpile step in dev"). O1-d would amend the owner-ratified `ADR-0003` clauses 1
  and 3. No agent marks any part of this ADR accepted.
- **Source of the question.** The owner, 2026-11-01, verbatim (`orch-2026-10-30a` `…f8b18ece`): *"re-writing everything
  to C++ or Rust is expensive, but we could look into AssemblyScript (https://github.com/AssemblyScript/assemblyscript),
  the syntax is similar to TypeScript. Not sure about speed estimates. So as I understand, improvement areas are 1)
  improve speed to calculate positions ; 2) improve algorithms that we use currently."*
- **What this ADR amends if accepted:** nothing yet. Each option names the ADRs it would amend (§ Decision, D5).
  Accepting this ADR accepts only the prototype (D3) and the order (D4). Each later step brings its own ADR or
  ticket to the owner or the Orchestrator, as D5 says.

## Context

### The engine today (read from `src/` at `3e35b667`)

- **Board:** 0x88 `Uint8Array(128)` on a plain `Position` object (`src/position.ts`, `ADR-0001`; bitboards were rejected
  for complexity).
- **Moves:** one heap object per move, `{ from, to, piece, captured, flags, promotion }` (`src/moves.ts`). Each list is
  a fresh `Move[]`. `UndoRecord` is also an object per `makeMove` (`src/apply.ts`).
- **Legality:** make/test/unmake of every pseudo-legal move (`src/legal.ts`). `ADR-0003` clause 1 keeps this, and the
  owner ratified that clause.
- **Keys:** 64-bit Zobrist keys as `bigint` (`src/zobrist.ts`). The per-ply key array is a `BigUint64Array`. The TT is
  `BigUint64Array` keys + `Uint32Array` words + `Int32Array` scores, 2^18 slots, 4 MiB (`src/transposition.ts`,
  `ADR-0025`). The game's prior keys reach the search as `readonly bigint[]` (`ADR-0054`).
- **Search:** two recursions. `src/search.ts` (`search` + 11 test-only doors) and the abortable copy in
  `src/engine.ts` (`chooseMove` + 5 doors). An `ABC-078` identity sweep holds them together. The clock is injected
  (`EngineOptions.now`) and read every `NODES_PER_CLOCK_CHECK` = 1 024 nodes. An abort is a `throw` of a symbol,
  caught by the deepening loop.
- **Shell coupling:** about 25 non-test modules import `Move` or a core module (SAN, PGN, history, input, UCI, CLI,
  levels, book). 56 of the 61 test files import a hot-core module.

### Where a node's time goes (the only profile on record)

From `se-ABC-227` `…7175ebdf`, at `193447bc`, before `ABC-235` and `ABC-240`. Node v26.12.1, `oeselg-dev`, level 5's
3 000 ms then. Shares of in-window self time on kiwipete / position-6 / start:

| bucket | share | notes |
|---|---|---|
| move generation + legality (`moves.ts`, `legal.ts`) | 47.4 / 44.9 / 50.5 % | make/test/unmake inside the filters: 27.7 / 29.4 / 28.4 % (`arch-ABC-235` `…7fc1b90c` re-cut) |
| evaluation | 31.5 / 32.8 / 27.0 % | allocates 0 % |
| ordering | 5.5 / 6.6 / 6.5 % | since cut by `ABC-240` |
| make/unmake | 4.2 / 4.1 / 4.0 % | |
| TT | 1.1 / 1.3 / 2.0 % | |
| zobrist | 0.7–1.4 % | inside "other" |
| GC | 1.6–1.9 % | inside "other" |
| `isBlack` / `pieceType` not inlined | ~2.0 % | inside "other" |

- **Allocation:** 2 737 / 2 807 / 4 019 bytes per node, which is 1.6–1.9 GB/s. Move generation does 76–78 % of it.
- **What was cut since:** `ABC-235` (king-square hoist, captures-only generator, pawn cache) read 1.20–1.28×.
  `ABC-240` (allocation-free ordering) read 1.09–1.12× (`qe-ABC-235` `…c575d703`, `qe-ABC-240` `…19068f9d`).
- **Today's shares are `UNKNOWN - verify`.** The cuts moved them. A fresh profile is step 0 of the prototype (D3).
- **Fact the brief's framing needs:** BigInt is not where the time goes. Zobrist plus the TT is 1.8–3.4 % of self
  time. The time is in legality by make/test/unmake (~28 %), evaluation (~30 %) and generation itself. Those costs are
  algorithmic, and a port to another language ports them unchanged.

### Speed readings on this host

Source: `qe-ABC-240` `…19068f9d`, 2026-10-30, `oeselg-dev` (AMD Ryzen AI 9 HX 370), 3 000 ms, median of 5 interleaved
fresh processes. Node rate: start **633 651**, kiwipete **876 154**, position-6 **896 886** nodes/s. It has not been
re-read since `ABC-228` (Orchestrator `…dd38169c`). Depth at 4 000 ms: kiwipete 8, position-6 10 (`NFR-005` floor 6
met). The perft-only rate (`NFR-001`, ≥ 1 000 000/s) was 6.04–6.21 M on the M3; on this host it is `UNKNOWN - verify`.

### AssemblyScript, as its own documentation states it (read 2026-11-01)

- **What it is.** It "compiles a variant of TypeScript … to WebAssembly using Binaryen", ahead of time
  (assemblyscript.org/introduction).
- **Speed.** "Is AssemblyScript faster than JavaScript? Not always … pre-existing TypeScript code doesn't magically
  become faster just by compiling to WebAssembly." And: "Low-level code (just functions, numbers, math and hard work)
  is always the best choice" (FAQ).
- **Language gaps** (status page):
  - Closures: "Captures of local variables are not yet supported."
  - Exceptions: "Throwing currently aborts the program", so there is no catch.
  - Union types: "not supported yet, except for nullable class types".
  - No `any`. Interfaces are "rudimentary".
  - "Instead of BigInts, AssemblyScript has opted to utilize WebAssembly's 64-bit integers". JS BigInt integration at
    the boundary is listed as finished.
- **Runtimes:** `incremental` (default, TLSF + incremental GC, shadow stack), `minimal` and `stub` (bump allocator, never
  frees). `@unmanaged` classes are raw structs that are not garbage collected.
- **Compiler:** `-O3`, `--converge`, `--noAssert`, `--uncheckedBehavior`, `--enable simd`. `--bindings esm|raw` emit
  the Node loading glue.
- **Status:** releases are 0.28.x (v0.28.20 is the latest shown; the year is not displayed: `UNKNOWN - verify`). The
  project is pre-1.0.
- **Coverage:** the coverage tool `as-covers` was last pushed in August 2023, and `as-test` claims coverage. Their
  maturity is `UNKNOWN - verify`. Vitest's V8 coverage does not see inside a WASM module (`UNKNOWN - verify`, expected).

**What this means for the port:** "the syntax is similar" is true, and the port is still a rewrite in TypeScript
syntax, not a recompile. The engine's closures (`budget.visit`, sort comparators), its `throw`-based abort, its
`Move | null` and `number | null` returns and its object-literal records must all be rewritten. The share of hot-core
lines that would move unchanged is `UNKNOWN - verify`. The prototype counts it (D3).

### Outside evidence on WASM and JS speed (informal; low confidence)

- **WASM against native:** WASM ran 45–55 % slower than native on SPEC CPU, with a worst case of 2.5× (Jangda et al.,
  USENIX ATC 2019).
- **A chess engine as WASM:** one published local speedtest of a Stockfish development build reads WASM at about
  902 k nodes/s against 1 155 k for the SSE4.1 native build (about 0.78×). That is one source from a forum or dev-build
  page.
- **AssemblyScript against JS:** a microbenchmark (a prime loop) reads about 1.2×. No AssemblyScript chess engine
  with a published node rate was found.
- **No source measures this engine's shape.** That is why D3 exists.

### Elo per speed doubling (informal; low confidence)

- TalkChess threads (Kaufman, Komodo tests): about **90 Elo per doubling at ~6 s a move** and about **65 at 15 s**.
  One Komodo test against Houdini read +81 to +107 per doubling between 0.5 s and 4 s a move.
- The rule of thumb is **50–100 Elo per doubling** at blitz-to-rapid times, and it shrinks as the time grows.
- skytalix plays level 5 at 4 s a move, single-threaded. On those figures a 1.25× speed-up is ≈ 16–32 Elo, 1.5× ≈
  29–58 and 2× ≈ 50–100.
- This engine's own figure is `UNKNOWN - verify`, on a scale nobody has mapped (`EPIC-010` § Product goal).
- **The batch cannot see these gains.** `EPIC-010`'s 200 + 200 R batch resolves ±77.9 Elo (Y at milestone 1,
  `…1a53a7f9`). A 1.5× speed-up sits inside that noise, so speed changes stay graded on node rate (S2), as
  `ABC-235` and `ABC-240` were. They are not graded on games.

## Decision

**PROPOSED, decides nothing.** D1 and D2 set out the options and the estimates. D3 to D6 are the proposal the owner
may accept, change or refuse.

### D1. The four options, each with an estimate, its cost, its risk and its reach

**How to read the estimates.** An estimate is a multiplier on the search's node rate at a fixed algorithm, against
`main` today ("TS-current").
- Every range is built by Amdahl's rule from the `se-ABC-227` shares and the named basis.
- The shares predate `ABC-235` and `ABC-240`, so every bound is approximate.
- Confidence is high only where the estimate is a ceiling set by a measured share.

#### O1. In-TypeScript speed

Five value-identical cuts in the current toolchain. "Value-identical" is `arch-ABC-235`'s definition: the same lists,
the same order, the same scores and the same node counts.

| cut | what | estimate | basis | confidence | cost |
|---|---|---|---|---|---|
| O1-a | BigInt off the hot path: keys as two `u32` halves in the search, the TT and the repetition scan; `bigint` kept at the API (history, game end, `priorKeys` converted once per search) | **1.01–1.05×** | zobrist 0.7–1.4 % + TT 1.1–2.0 % + a part of GC; ceiling ≈ 1/(1 − 0.04) | medium-high on the ceiling | M, 1 ticket |
| O1-b | Allocation-free move lists: a move packed into one int32 (from, to, piece, captured, flags and promotion fit in 28 bits) in per-ply preallocated `Int32Array`s; undo state in per-ply typed arrays; the shell's `Move` rebuilt once at `chooseMove`'s return | **1.05–1.25×** | `generateMoves` + `addMove` + `addPawnMoves` self time 12–18 %, carrying 76–78 % of the bytes; `ABC-240`'s cut of 9–13 % of the bytes read 1.06–1.08×, 4–15× its self-time bound (`qe-ABC-240` `…19068f9d`), so the profiler under-charges allocation | low-medium | L, 2–3 tickets (every `Move` consumer in the core; tests through an adapter) |
| O1-c | Monomorphic, inlinable helpers and constant record shapes (`isBlack` and `pieceType` inlined by hand, no spread into `Budget`) | **1.00–1.04×** | helpers ~2 % self, engine bookkeeping 1.3–2.0 % | low | S, folded into O1-b |
| O1-d | Lazy legality (`ADR-0003` menu item (c2)): the full make/test/unmake is kept only for king moves, en passant, pinned pieces and positions in check; the rest skip it | **1.15–1.40×** | make/test/unmake in the filters 27.7–29.4 %; (c2) measured 3.2–4.4× per call in open positions and 0.97–1.2× in check (`ADR-0003`); 0.28 × (1 − 1/3.8) ≈ 0.21 ≈ 1.26× | medium | M, 1 ticket + an ADR amending `ADR-0003` (owner) |
| O1-e | Incremental material + PST | **1.02–1.05×** | 4.2–5.3 % of self time before its make/unmake cost; `arch-ABC-235` ruled it "low net, wide reach, collides with `ABC-231`" | medium | S; not proposed now |

**O1 combined: 1.08–1.35× without O1-d, and 1.25–1.85× with it.** Confidence is low-medium on the product, because
the cuts overlap. Central guess: about 1.2× without O1-d and about 1.5× with it.
- **Cost:** 4–6 tickets, each graded by S2 (node-rate ratio, `G4` identity, perft equal), 0 games.
- **Risk:** low for O1-a, O1-b and O1-c. Their guards are perft, the list-equality walk (285 074 nodes, `ABC-206` and
  `ABC-235`) and the `G4` identity sweeps. O1-d is medium: it is the largest correctness risk inside O1, behind the
  same guards plus `ADR-0003`'s fallback.
- **Reach:**
  - **Tests:** unchanged in kind. O1-b changes the core's internal move type, so tests that build `Move` objects for
    core functions go through an adapter or are re-written (count `UNKNOWN - verify`, bounded by the 56 files).
  - **Coverage:** unchanged denominators. Mutation lanes: QE plants mutants in the same TS source, as today.
  - **`G8`:** neutral to slightly better, because search-bound rows burn less CPU. Today's headroom is 0.6–0.9 s
    (`ABC-248` H 9.09 s, B 9.37 s).
  - **UCI / CLI:** unchanged. `chooseMove`'s signature and `EngineChoice` keep their shape.
  - **`NFR-009`:** per-ply typed arrays are bounded (128 plies × a few KiB), well inside 16 MiB.

#### O2. An AssemblyScript port of the hot core behind one boundary called per search

- **What is ported:** move generation, make/unmake, legality, zobrist (as `u64`), evaluation with its pawn cache,
  quiescence, ordering and killers, the TT, and the deepening loop with its doors as flags.
- **What stays in TS:** the shell, book, UCI, levels, game end, history, SAN and PGN, and every test.
- **The boundary:** one call per `chooseMove`. In: the 128 board bytes, five scalars, the prior keys (≤ 100 `u64`,
  copied into linear memory) and the budget and limits. Out: from, to, promotion, score, depth and nodes. The TS
  wrapper maps the result to the shell's `Move` by matching `legalMoves(position)`.
- **The clock:** `now()` is an imported JS function called every 1 024 nodes, so virtual clocks keep working. An abort
  becomes flag-unwinding, because AssemblyScript has no catch.

| | estimate | basis | confidence |
|---|---|---|---|
| over TS-current, same algorithm | **1.0–2.2×** | the O1-a/b/c data layout, which AssemblyScript forces (no cheap objects, native `i64`), times a language factor L_AS = **0.9–1.6×** | low |
| over a finished O1 | **0.9–1.6×** (L_AS alone) | V8 compiles both JS and WASM with an optimizing tier. Turbofan-compiled TS on small integers and typed arrays is close to WASM already. WASM removes tagging, type guards and deopts, and gives native `i64`, `popcnt` and `ctz`. AssemblyScript adds bounds checks unless `unchecked()`, and GC and shadow-stack costs on the `incremental` runtime. Outside data: microbenchmark ~1.2×; WASM is 1.3–1.55× slower than native (Stockfish dev build, Jangda) | low |
| O1-d inside AssemblyScript | the same 1.15–1.40× | it is algorithmic and language-free | medium |

- **Cost: an epic of about 10–13 tickets:**
  1. toolchain, build and loader seam;
  2. position, generation, legality and make/unmake, with perft;
  3. zobrist `u64` and the TT;
  4. evaluation and the pawn cache;
  5. quiescence, ordering and killers;
  6. search and the deepening loop with the 16 doors as flags, the clock import and the flag abort;
  7. the boundary wrapper and `priorKeys`;
  8. re-pointing the identity sweeps, oracles and doors across the boundary;
  9. a coverage and mutation ADR and its tooling;
  10. `G7` and `G8` re-reads;
  11. `ADR-0044` and `AGENTS.md` amendments;
  12. distribution (the `.wasm` beside `dist/uci.js`).
- **The recurring cost:** every later `EPIC-010` value-changing ticket (`ABC-231`–`ABC-239`) is written in
  AssemblyScript, or written twice if the TS core is kept as an oracle.
- **Risk: high.**
  - The compiler is pre-1.0.
  - Two move generators (the TS shell's and the AssemblyScript core's) can drift; a cross-implementation perft and
    list-equality test must guard them.
  - The abort changes control flow in a recursion whose node counts are pinned by the identity sweeps.
  - Coverage goes blind on the core (below).
  - `G8` headroom is 0.6–0.9 s.
  - Product identity: see D5.
- **Reach:**
  - **Tests:** the TS behaviour tests stay and run against the core through the wrapper. Tests that import internals
    need WASM exports or a kept TS reference: `orderMoves`, `KillerTable`, `lateMoveReduction`, `nullMoveReduction`,
    `mvvLvaKey`, `isPassedPawn`, `repeatsInPath`, `pawnCacheProbeForTest`, `tableByteLength`, the
    `*ByteLength` probes and others. A kept TS core works as a permanent oracle (node-for-node, TS against
    AssemblyScript), but it doubles every later change.
  - **Coverage:** Vitest's V8 coverage does not instrument WASM (`UNKNOWN - verify`), so the core leaves the 0.8
    threshold's view. `as-covers` (stale since 2023) or `as-test` would need adopting and a rule of its own.
  - **Mutation lanes:** a planted mutant in AssemblyScript source needs a rebuild per mutant (compile time
    `UNKNOWN - verify`, seconds expected). The lane-kills-mutant evidence must be re-earned.
  - **`G8`:** compiling inside `npm test` would very likely break the 10 s bar. The workable form is a committed
    `.wasm` plus a freshness check (a source hash embedded in the artifact), with compiling as a separate step.
    Instantiation per test file is expected to cost milliseconds (`UNKNOWN - verify`).
  - **UCI / CLI:** behaviour is unchanged above `chooseMove`. The book stays in TS ahead of the engine. At levels 1–4
    a blunder calls `chooseMove` once per child, about 30 boundary calls a move, which is still negligible. `npm run
    build` must ship the `.wasm`.
  - **`NFR-009`:** the TT moves into linear memory, which only grows. Whether `process.memoryUsage().arrayBuffers` counts
    it is `UNKNOWN - verify`, so `G7`'s instrument needs a re-read.

#### O3. Rust (or C) to WASM for the same core

| | estimate | basis | confidence |
|---|---|---|---|
| over TS-current | **1.2–2.6×** | data layout times L_Rust = **1.1–1.9×** (LLVM's inliner and loop optimizations go beyond Binaryen's; the WASM ceiling as above) | low |
| over a finished O1 | **1.1–1.9×** | L_Rust alone | low |

- **Cost:** about 11–14 tickets, the O2 list plus a toolchain outside npm (`rustup`, a WASM target, binding glue) and a
  second language that agents must maintain.
- **Risk:** higher than O2, for the same test and coverage problems. Coverage needs separate Rust tooling. It also
  contradicts the owner's 2026-10-29 word on a Rust rewrite, "let it be for now" (`EPIC-010` § Out of scope).
- **Native Rust** (a separate UCI binary or an N-API addon) would be faster again. The owner called it expensive, and
  it is out of this ADR's scope.

#### O4. Status quo

- **1.0×**, at 0 tickets and no technical risk.
- Speed then comes only from area 2's algorithm work and from what `EPIC-010` already holds.

### D2. Area 1 (speed) and area 2 (algorithms, `EPIC-010`): how they interact

- **They multiply.** Node rate (area 1) times nodes saved per decision (area 2: ordering, TT use, aspiration, pruning)
  gives the depth reached in a fixed 4 s. Each area's gain is worth about the same in Elo per doubling of effective
  speed. Evaluation changes (`ABC-231`, `ABC-232`, `ABC-239`) change what a node knows, not how many there are.
- **Speed is what makes algorithms affordable.** `ABC-205` died on `G6` depth cost, not on play. Richer evaluation in
  milestone 2 spends node rate, and area 1 buys it.
- **They collide on files.** `ABC-233` and `ABC-234` edit `orderMoves`. `ABC-231` and `ABC-232` edit `evaluate`. O1-d
  edits `legal.ts`. O1-b touches all of them. A port (O2 or O3) freezes the algorithm into a second language: every
  later area-2 ticket is written in it, or written twice.
- **They are graded differently.** Area 1 is value-identical and graded on node rate (S2), with 0 games. Area 2 is
  value-changing and graded on two 10-game smokes and the batch (`EPIC-010` § The merge rule).
- **The order this implies:**
  1. Cheap value-identical speed first. It lands without games and raises the base that every area-2 smoke reads.
  2. Area-2 milestone 2 next.
  3. A language port only if its measured gain clears the bar (D3). If a port goes, it is scheduled at a freeze point
     after milestone 2 lands, so no area-2 ticket is written twice.

### D3. The prototype: a measured, time-boxed spike (proposed, not built)

**Purpose.** Turn D1's guesses into readings on `oeselg-dev`. It separates the language's gain from the data layout's
gain, which is the question that decides O2 against O1.

**Step 0, a fresh profile** of `main`, by the `se-ABC-227` method. It re-bases every share after `ABC-235`, `ABC-240`
and `ABC-228`–`ABC-241`. Cost: about 15 min ALONE.

**The arms** run the same algorithm (0x88 board, make/test/unmake legality, the same generation order) on the same
Node binary:

| arm | what | measures |
|---|---|---|
| A0, TS-current | `src/perft.ts` and `src/evaluate.ts` from a `git archive` of `main`, unchanged | the base |
| A1, TS-flat | a scratch TS port: packed int32 moves in per-ply `Int32Array`s, keys as two `u32`s, no objects in the hot loop | O1-a/b/c's gain (A1 / A0) |
| A2, AssemblyScript | the A1 code in AssemblyScript: `u64` keys, static memory or `@unmanaged`, `unchecked()` in the inner loops, `--runtime stub` (or `minimal`), `-O3 --converge --noAssert`, `--bindings raw` | the language factor L_AS (A2 / A1) |
| A3, Rust to WASM (optional) | only if the owner keeps O3 alive | L_Rust (A3 / A1) |

**The workloads:**
- **(W1) Perft** on the six standard positions at `src/perft-bench.ts`'s depths, with an XOR checksum of every leaf's
  Zobrist key, so the incremental key path is exercised.
- **(W2) `evaluate()`** over a frozen corpus: the depth-3 walk from the perft roots, 285 074 positions, as used by
  `ABC-206` and `ABC-240`.
- Search is **not** ported in the spike. Its gain is projected:
  S = 1 / ((1 − f_m − f_e) × k + f_m / r_m + f_e / r_e)
  - f_m and f_e are step 0's shares for generation + legality + make/unmake and for evaluation;
  - r_m and r_e are the W1 and W2 ratios;
  - k = 1 is the pessimistic bound (the rest not sped up) and k = 1/r_m the optimistic one.

**Validity, which every reading must pass or it is void (void is not a result):**
- perft counts equal `src/perft.test.ts`'s expected counts in every arm;
- the leaf-key checksum is equal across arms;
- the `evaluate` score is equal at every corpus position (0 mismatches);
- the spread within one arm and position is ≤ 5 %, else one re-run, then void.

**Method:**
- one fresh process per run;
- 5 interleaved runs per arm per position;
- the median is the reading, and the first call (compile, instantiate, JIT warm-up) is reported apart from the steady
  state;
- one boundary call per perft root or per corpus pass.

**Host rule:**
- STRICTLY ALONE: `pgrep -x cutechess-cli` 0, no `[v]itest`, load1 and Tctl recorded per run;
- pause at ≥ 85 °C;
- the reading is QE's, on a pre-registration sealed before the first timed run, as `qe-ABC-235` and `qe-ABC-240` did.

**Fences:**
- all spike code lives in the task's `raw/` or a scratch directory, never `src/`;
- AssemblyScript is installed into a scratch prefix with its own pinned `package.json` and lockfile, so the repo's
  `package.json` and lockfile stay untouched;
- A3 needs `rustup` on the host. Both installs are a dependency or toolchain fetch that needs the owner's yes (D5).

**Time box:**
- A1 + A2 on W1: 2 agent sessions. W2: 1 more. Host time: about 45 min ALONE plus step 0.
- **Hard stop:** if A2 is not count-equal on W1 by the end of its box, the spike stops. The overrun is recorded as
  evidence about O2's cost (it is a reading too).
- The spike also records **port friction**: the share of A1's lines that compiled in AssemblyScript unchanged, the
  lines rewritten, the language gaps hit and the hours spent.

**Bars, proposed (the owner may reset them before the run).** Ratios are medians, per board, and must hold on at least
two of three boards:

| question | GO | HOLD | NO-GO |
|---|---|---|---|
| O1-b/c data layout: A1 / A0 on W1 | ≥ 1.25 → O1-b tickets | 1.10–1.25 → only the cheap parts (O1-a, O1-c) | < 1.10 → keep `Move` objects |
| O2 language: A2 / A1 on W1 **and** W2 | ≥ 1.5 on both, **and** projected S(A2 against A0, k = 1) ≥ 2.0 → O2 goes to the owner as a GO candidate | 1.2–1.5 → O1 first; re-read after `EPIC-010` milestone 2; the owner is informed | < 1.2 → O2 closed: the language does not pay for two toolchains |
| O3 (only if measured): A3 / A1 | ≥ 1.8 **and** ≥ 1.3 × (A2 / A1) → O3 goes to the owner | otherwise | — |
| boundary / start-up | first-call overhead ≤ 50 ms per process (it matters for `G8`'s per-file isolation and for UCI start) | — | > 50 ms is reported and weighs against O2 and O3 |

### D4. The order proposed

1. **The prototype** (D3), with step 0 first. It is cheap: 1 ticket of S or M size plus one QE reading of about 1 h
   ALONE. It measures O1-b's yield before any core ticket is spent.
2. **O1, ordered by the prototype's reading:**
   - O1-d first, if the owner amends `ADR-0003`: it is the largest single prize;
   - then O1-b with O1-c folded in, if A1 / A0 clears its bar;
   - then O1-a;
   - O1-e not now.
3. **`EPIC-010` milestone 2** continues alongside, as now. Its area-2 tickets land on the faster base.
4. **O2** only if D3's O2 row reads GO and the owner says yes, at a freeze point after milestone 2.
5. **O3** only if D3 measured it and its row reads GO.
6. **O4** is what happens if the owner says nothing. It costs nothing and keeps every option open.

### D5. What is the owner's call

- **Q-SP-1:** run the prototype at all. This includes a scratch install of `assemblyscript` (a pinned 0.28.x) and, for
  A3, `rustup`. Both are new tools on the host, and `AGENTS.md` § Safety says "Do not change dependencies without
  reason".
- **Q-SP-2:** the bars in D3, as written or reset.
- **Q-SP-3:** O1-d means amending the owner-ratified `ADR-0003` clauses 1 and 3. That needs a new ADR on his word.
- **Q-SP-4, if D3 reads GO for O2 or O3:** the language and architecture change itself. It reverses `ADR-0044`
  rejected alternative 18 and changes `AGENTS.md` § Stack. It also bears on his product goal, "be the best
  vibe-engineered or TypeScript-based chess-engine" (`EPIC-010` § Product goal): is a core written in AssemblyScript still
  "TypeScript-based"? That is his to say, not an inference.
- **Q-SP-5, if a port goes:** a coverage rule for a core that Vitest cannot instrument (`quality.coverage_threshold`
  0.8). Moving or carving out the threshold for the core is a quality-bar change.
- **Not asked:** no NFR level moves under any option. `NFR-001`, `NFR-005`, `NFR-008` and `NFR-009` stay as they are.
  The levels and budgets (`G9`) stay byte-identical.

### D6. What BA/PM would cut on a yes

- **On Q-SP-1 yes:** one spike ticket (records + scratch only, no `src/`, no `package.json`). Its acceptance is D3's
  validity rows and the port-friction record. QE owes the pre-registered reading. No smoke, no batch.
- **On O1 (after D3):** O1-d (M, behind its `ADR-0003` amendment), O1-b (L, split into generation, legality and
  make/unmake; search, quiescence, ordering and TT; the shell adapter), O1-a (M) and O1-c (folded in). Each is
  value-identical with S2 acceptance (node-rate ratio ≥ its bar, `G4` identity, perft equal, `G6` ≥ base) and 0 games.
  They go into `EPIC-010` as milestone 1b, or into a small speed epic; the placement is BA/PM's.
- **On O2 or O3 (after D3 and Q-SP-4):** an epic of about 10–13 tickets (D1), its own ADRs (toolchain and build, test
  and coverage, boundary), and a re-sequencing of `EPIC-010` milestones 2–3 around a freeze point. Out of that epic:
  native builds, threads, SIMD (an option to measure later, not built), and any change of value.

## Alternatives

- **Choose a language now, on the estimates alone.** Rejected. Every language estimate here has low confidence, and the
  prototype that turns it into a reading costs about one ticket and an hour of host time.
- **Port the whole search in the spike.** Rejected. The spike would cost as much as half of O2. Perft plus `evaluate`
  covers about 75–85 % of node time on the old profile (step 0 re-reads it), and the rest is projected by bounds.
- **Measure Elo per doubling on this engine with a time-odds R pair** (4 s against 8 s). Not proposed. At 200 + 200
  games it resolves only ±78 Elo, about one doubling's whole worth, for about 23 h ALONE. The literature range is used,
  and its confidence is stated as low.
- **Bitboards in TS** (`ADR-0001`'s rejected option). Not an option here. It is an algorithm and representation change
  of `ADR-0001`'s size, value-identical only with a perft-scale proof, and orthogonal to the language question. It can
  be named later if D3 shows generation still dominant after O1.
- **Native Rust or C++ (a separate UCI binary).** Out of scope by the owner's "expensive" (2026-11-01) and "let it be for
  now" (2026-10-29).
- **Worker threads or parallel search.** `EPIC-010` § Out of scope. Single-threaded stays.

## Consequences

- **If accepted as proposed:** one spike ticket. The `src/` tree is untouched until D3 reads. O1 tickets follow the
  reading. A port is reconsidered only on a GO row and the owner's word.
- **If O1 goes:** 4–6 value-identical tickets, an expected 1.08–1.35× (1.25–1.85× with O1-d) and 0 games. Every
  `EPIC-010` smoke after that runs on a faster base, which is fair to both sides of a pair, since base and head both
  carry it.
- **If O2 or O3 go:** two toolchains, a coverage hole to rule on, a `.wasm` artifact and its freshness check, a second
  move generator to keep equal by test, and every later area-2 ticket written in the core's language. The expected
  extra gain over O1 is 0.9–1.6× (O2) or 1.1–1.9× (O3), and the low end includes no gain at all.
- **If nothing is decided:** O4. The cost of waiting is the speed not taken, which is ≈ 16–58 Elo for 1.25–1.5×
  (informal), and invisible to the batch either way.
- **Open `UNKNOWN - verify` items:**
  - today's profile shares;
  - the perft node rate on this host;
  - L_AS and L_Rust on this engine;
  - this engine's Elo per doubling;
  - AssemblyScript coverage tooling maturity, and whether V8 coverage sees WASM;
  - whether `arrayBuffers` counts WASM memory;
  - AssemblyScript compile time (for `G8` and mutation lanes);
  - the year of v0.28.20;
  - the count of tests that build `Move` objects for core calls;
  - the share of hot-core lines that would port unchanged.

## Rollback

- **This ADR:** nothing to roll back. It changes no code and no level. Withdrawing it leaves O4.
- **The spike:** its code lives outside `src/` and `package.json`. Deleting its `raw/` directory and the scratch prefix
  undoes it.
- **O1 tickets:** each is value-identical and one revert away, with perft and `G4` as the proof that the revert is
  clean.
- **O2 or O3:** the TS core stays on `main` until the port passes cross-implementation identity. The switch is one import
  in `chooseMove`'s wrapper. Rolling back means pointing it back at the TS core while the TS core still exists. Once
  the TS core is retired, rollback costs a re-port. That is why D4 keeps it until a freeze point.

## Sources (web, read 2026-11-01)

- AssemblyScript: https://www.assemblyscript.org/introduction.html, /status.html, /frequently-asked-questions.html,
  /runtime.html, /compiler.html; releases https://github.com/AssemblyScript/assemblyscript/releases
- Jangda et al., "Not So Fast: Analyzing the Performance of WebAssembly vs. Native Code", USENIX ATC 2019:
  https://usenix.org/conference/atc19/presentation/jangda
- Stockfish WASM speedtest figure (single source, low confidence):
  https://nextchessmove.com/dev-builds/sf14/8e711c29fe7d5d9b317de46ec5f0cd848e56fbaf
- AssemblyScript microbenchmark (Danny Guo): https://dannyguo.com/blog/the-introductory-guide-to-assemblyscript
- Elo per doubling (TalkChess, informal): https://talkchess.com/viewtopic.php?p=496419,
  https://talkchess.com/viewtopic.php?p=458801
- AssemblyScript coverage: https://www.npmjs.com/package/as-covers
