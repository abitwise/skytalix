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

## Result

**2026-11-01, Architect/Design. Done, records and reading only.** Branch `grugops/arch-speed-path-spike` (worktree `.claude/worktrees/arch-speed-path-spike`, from `main` `3e35b667`). ADR commit `38e150a7`, notes commit `d9cf8715`. Nothing run, built, installed or timed (`qe-ABC-223` holds the host); the only process run was the seal script. Not pushed, not merged. Only the new ADR, own context and this brief edited.

- **ADR-0055 PROPOSED** (`memory-bank/50-decisions/ADR-0055-the-speed-path-is-chosen-on-a-measured-prototype-between-in-typescript-cuts-an-assemblyscript-core-a-rust-wasm-core-and-the-status-quo.md`). It decides nothing; acceptance is the owner's.
- **O1, in-TS cuts:** 1.08–1.35×, or 1.25–1.85× with O1-d (lazy legality, `ADR-0003` (c2)). 4–6 tickets, value-identical, S2, 0 games, low risk. BigInt (O1-a) is only 1.01–1.05×: zobrist + TT are 1.8–3.4 % of node time.
- **O2, AssemblyScript core:** 1.0–2.2× over today, 0.9–1.6× over O1, low confidence. About 10–13 tickets, high risk (pre-1.0, no catch, no closures or unions, two move generators, coverage blind on WASM, `G8` headroom 0.6–0.9 s).
- **O3, Rust→WASM:** 1.2–2.6× over today, 1.1–1.9× over O1. About 11–14 tickets, a toolchain outside npm, higher risk.
- **O4, status quo:** 1.0×.
- **Area 1 against area 2:** they multiply, but collide on `orderMoves`, `evaluate` and `legal.ts`. A port freezes area 2 into a second language. Speed is graded on node rate, because the batch resolves only ±77.9 Elo.
- **Prototype (D3):** step 0, a fresh profile; arms A0 TS-current, A1 TS-flat, A2 AS, A3 Rust (optional); W1 perft with a key checksum, W2 `evaluate` over a 285 074-position corpus; equality or void; ALONE, interleaved, QE pre-registered; 3 sessions plus about 45 min of host time.
- **Bars:**
  - A1/A0 ≥ 1.25 → O1-b goes.
  - A2/A1 ≥ 1.5 on both workloads and projected S ≥ 2.0 → O2 goes to the owner.
  - A2/A1 of 1.2–1.5 → HOLD.
  - A2/A1 < 1.2 → O2 closed.
- **Order:** prototype → O1 → milestone 2 alongside → a port only on GO plus the owner's word, at a freeze → O4 by default.
- **Owner's calls:**
  - Q-SP-1: run the prototype, including the scratch AS and rustup installs.
  - Q-SP-2: the bars.
  - Q-SP-3: amending `ADR-0003`.
  - Q-SP-4: the language change, `ADR-0044` alternative 18, `AGENTS.md` § Stack, and "TypeScript-based".
  - Q-SP-5: coverage for a WASM core.
  - No NFR moves.
- **For the Orchestrator:** take Q-SP-1 to Q-SP-5 to the owner with the ADR. Nothing else is owed.
- **Notes** (task `arch-speed-path-spike`, contextRoot = worktree; 3/3 sealed, read back): decision `20261101T113157Z-architect-design-decision-32000740`, observation `…observation-e5566e01` (records, code and docs), observation `…observation-658bd8fa` (artifacts).

### Trace row (10 cells, header order)

| arch-speed-path-spike (records) | owner 2026-11-01: look into AssemblyScript; area 1 speed, area 2 algorithms (EPIC-010) | EPIC-010 (area 2; area 1 unplaced until the owner answers) | ADR-0055 PROPOSED (O1–O4, prototype D3, order D4, owner calls Q-SP-1..5) | NFR-001/005/008/009 unchanged; G7/G8 effects named | grugops/arch-speed-path-spike @ 38e150a7: memory-bank/50-decisions/ADR-0055-… (records only) | none run (records and web reading) | n/a | — | owner's call pending; no board move |
