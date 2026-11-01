---
subtask: arch-speed-path-spike
role: architect-design
ref: .grugops/context/arch-speed-path-spike/
branch: new grugops/arch-speed-path-spike from main (worktree .claude/worktrees/arch-speed-path-spike)
width: records + reading only. qe-ABC-223 is playing timed games STRICTLY ALONE: run no vitest, build, benchmark, engine or install (no npm install of assemblyscript). Web reading is fine.
---
# Architect: speed path options — AssemblyScript vs in-TypeScript fixes vs other WASM (PROPOSED ADR; owner decides)
## Owner word (2026-11-01, Orchestrator note to follow)
"re-writing everything to C++ or Rust is expensive, but we could look into AssemblyScript (https://github.com/AssemblyScript/assemblyscript), the syntax is similar to TypeScript. Not sure about speed estimates. So as I understand, improvement areas are 1) improve speed to calculate positions ; 2) improve algorithms that we use currently."
## Read
- src/ hot path: search.ts, engine.ts, zobrist.ts, moves/position/eval files, perft-bench.ts; where BigInt is used (zobrist keys, repetition keys, TT).
- se-ABC-227's profile (time and allocation shares), qe-ABC-235 / qe-ABC-240 (nps on this host: ~634 k start, ~876 k kiwipete, ~897 k position-6 at 3 000 ms), NFR-001/005/008/009 in plans/nfr-catalog.md, the ADRs governing search, TT, book (ADR-0037), test lanes (ADR-0046) and coverage rules in AGENTS.md.
- AssemblyScript docs (types i32/i64/u64, builtins popcnt/ctz/clz, SIMD, runtimes/GC, interop and boundary cost, Node loading, test tooling).
## Do (write a PROPOSED ADR; decide nothing)
1. Options, each with estimated nps gain (a range, with its basis and confidence), cost (size in tickets), risk, and what it does to tests/coverage/mutation lanes/G8 and to the UCI/CLI shell:
   - O1 in-TypeScript speed: BigInt off the hot path (32-bit pairs / typed arrays), allocation-free hot loops, monomorphic code;
   - O2 AssemblyScript port of the hot core (movegen, make/unmake, eval, search, TT) behind one boundary called per search, not per node; TS shell, book, UCI and tests stay;
   - O3 Rust (or C) → WASM for the same core;
   - O4 status quo.
2. Separate area 1 (speed) from area 2 (algorithms: EPIC-010) and say how they interact (Elo per speed doubling, order of work, which one first and why).
3. Propose a measured, time-boxed prototype that would turn the estimates into readings on oeselg-dev (e.g. perft and/or a fixed-depth search in AS vs current TS, same positions, value-identical outputs), with its acceptance bars, host rule (ALONE) and what result would make each option go/no-go. Do not build it.
4. Name what is the owner's call (language/architecture change) and what BA/PM would cut if he says go.
## Fences
- Write only memory-bank/50-decisions/ADR-<next>-*.md (status PROPOSED) and your notes. No src/, tools/, data/, plans/, board, AGENTS.md, package.json. No push, force, amend, rebase, or merge into main.
## Publish
Sealed notes (task `arch-speed-path-spike`, contextRoot = worktree), commit, `## Result` + trace row here, brief + claim to done/.
