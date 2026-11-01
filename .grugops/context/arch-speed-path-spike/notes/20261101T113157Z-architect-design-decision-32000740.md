---
id: 20261101T113157Z-architect-design-decision-32000740
kind: decision
by: architect-design
at: 2026-11-01T11:31:57Z
verified_by: 
confidence: high that nothing is decided and on which calls are the owner's; low on every language estimate (L_AS 0.9-1.6x, L_Rust 1.1-1.9x); medium on O1-d; medium-high on O1-a's ceiling
refs:
  - arch-speed-path-spike
  - ADR-0055
  - EPIC-010
  - ADR-0003
  - ADR-0044
  - ADR-0001
  - ADR-0025
  - ADR-0054
  - NFR-001
  - NFR-005
  - NFR-008
  - NFR-009
  - G4
  - G6
  - G7
  - G8
  - G9
  - ABC-227
  - ABC-235
  - ABC-240
  - orch-2026-10-30a/20261101T104500Z-orchestrator-decision-f8b18ece
  - orch-2026-10-30a/20261101T103000Z-orchestrator-observation-dd38169c
  - se-ABC-227/20261029T203901Z-software-engineer-observation-7175ebdf
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - qe-ABC-240/20261030T032110Z-qe-e2e-decision-19068f9d
  - qe-ABC-235/20261030T001117Z-qe-e2e-decision-c575d703
  - https://github.com/AssemblyScript/assemblyscript
  - 3e35b667
  - 38e150a7
  - grugops/arch-speed-path-spike
supersedes: 
seal: sha256:b0f057aeffefd3b000dcc0e1a0909e2ae27439a57217dedc7f55e25c1ed3e4c5
---

# Architect/Design, arch-speed-path-spike: ADR-0055 PROPOSED. Measure first, then the in-TS cuts, then a port only on a GO reading. Nothing decided

Records and reading only, at `main` `3e35b667`. Nothing run, built, installed or timed (`qe-ABC-223` holds the host ALONE). ADR: `memory-bank/50-decisions/ADR-0055-the-speed-path-is-chosen-on-a-measured-prototype-between-in-typescript-cuts-an-assemblyscript-core-a-rust-wasm-core-and-the-status-quo.md` (commit `38e150a7`). Status PROPOSED; acceptance is the owner's (language and architecture, 2026-10-22 delegation carve-out).

## The options (estimates on the search's node rate against `main` today; ranges, not readings)
- **O1, in-TS value-identical cuts:** O1-a BigInt off the hot path 1.01–1.05× (ceiling set by the zobrist + TT share, 1.8–3.4 %); O1-b packed int32 moves in per-ply typed arrays 1.05–1.25×; O1-c monomorphic helpers ≤ 1.04×; O1-d lazy legality (`ADR-0003` menu item c2) 1.15–1.40×; O1-e incremental PST 1.02–1.05× (not now). Combined 1.08–1.35× without O1-d, 1.25–1.85× with it. 4–6 tickets, S2-graded, 0 games. Low risk (O1-d medium).
- **O2, AssemblyScript core behind one per-`chooseMove` boundary:** 1.0–2.2× over today, 0.9–1.6× over a finished O1 (the language factor alone). Low confidence. About 10–13 tickets plus every later EPIC-010 value-changing ticket written in AS (or twice). High risk: the compiler is pre-1.0; no catch (the abort must become a flag); no closures or unions; two move generators; Vitest coverage blind on WASM; `G8` headroom 0.6–0.9 s means a committed `.wasm` plus a freshness check, never a compile inside `npm test`.
- **O3, Rust→WASM:** 1.2–2.6× over today, 1.1–1.9× over O1. About 11–14 tickets plus a toolchain outside npm. Higher risk, and against the owner's 2026-10-29 "let it be for now".
- **O4, status quo:** 1.0×, 0 tickets.

## The proposal (D3–D6)
- **Prototype first.** Step 0: a fresh profile (se-ABC-227's method). Arms A0 TS-current, A1 TS-flat, A2 AssemblyScript, A3 Rust (optional). Workloads: W1 perft with a leaf-key checksum, W2 `evaluate()` over the 285 074-position walk. Search gain projected by Amdahl's rule from step 0's shares.
  - Validity: counts, checksums and scores equal, else the reading is void.
  - Host: ALONE, interleaved 5 runs, median; QE reads it on a sealed pre-registration.
  - Time box: 3 agent sessions plus about 45 min ALONE; the overrun is itself recorded.
- **Bars.**
  - A1/A0 ≥ 1.25 → O1-b goes.
  - A2/A1 ≥ 1.5 on W1 and W2, and projected S ≥ 2.0 → O2 goes to the owner as a GO candidate.
  - A2/A1 of 1.2–1.5 → HOLD.
  - A2/A1 < 1.2 → O2 closed.
  - O3: A3/A1 ≥ 1.8 and ≥ 1.3 × A2/A1.
  - First-call overhead ≤ 50 ms.
- **Order.** Prototype → O1 (O1-d if `ADR-0003` is amended, then O1-b/c, then O1-a) → EPIC-010 milestone 2 alongside → O2 or O3 only on GO plus the owner's word, at a freeze point after milestone 2 → O4 if nothing is said.
- **Area 1 against area 2.**
  - They multiply, and speed is what makes richer evaluation affordable (`ABC-205` died on `G6`).
  - They collide on `orderMoves`, `evaluate` and `legal.ts`.
  - A port freezes area 2 into a second language.
  - Speed is graded on node rate (S2), because the 200 + 200 batch resolves ±77.9 Elo and a 1.5× speed-up (≈ 29–58 Elo, informal) sits inside that.
- **Owner's calls.**
  - Q-SP-1: run the prototype, including a scratch AS install and, for A3, rustup.
  - Q-SP-2: the bars.
  - Q-SP-3: amending `ADR-0003` for O1-d.
  - Q-SP-4: the language change itself. It reverses `ADR-0044` rejected alternative 18, changes `AGENTS.md` § Stack, and raises whether an AS core is still "TypeScript-based" under his product goal.
  - Q-SP-5: a coverage rule for a core Vitest cannot see.
  - No NFR level moves.
- **BA/PM on a yes.** One spike ticket (records plus scratch). Then O1 tickets as EPIC-010 milestone 1b or a small epic. A port epic only after a GO row and Q-SP-4.
