---
id: 20261101T113157Z-architect-design-observation-658bd8fa
kind: observation
by: architect-design
at: 2026-11-01T11:31:57Z
verified_by: 
confidence: high: the files listed are committed on grugops/arch-speed-path-spike; an observation, not an artifact-ref, since no gate ran
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
seal: sha256:76edfb9a827e63f33d51fe59e970ebf61a0ea34ecb21e9add31223d75012a811
---

# Architect/Design, arch-speed-path-spike: artifacts

- `memory-bank/50-decisions/ADR-0055-the-speed-path-is-chosen-on-a-measured-prototype-between-in-typescript-cuts-an-assemblyscript-core-a-rust-wasm-core-and-the-status-quo.md`: new, PROPOSED, 32 391 bytes, branch `grugops/arch-speed-path-spike` commit `38e150a7`.
- `.grugops/context/arch-speed-path-spike/raw/`: these note bodies, `seal-spec.json` and `seal.mjs` (copied from `arch-qehop-threshold`, logic unchanged).
- Nothing else is edited: no `src/`, `tools/`, `data/`, `plans/`, board, `AGENTS.md` or `package.json`.
- Nothing was run except the seal script; no gate run, so this is an observation and not an `artifact-ref`.
- **Open `UNKNOWN - verify` items, carried by ADR-0055 § Consequences:**
  - today's profile shares;
  - the perft node rate on `oeselg-dev`;
  - the language factors L_AS and L_Rust on this engine;
  - this engine's Elo per doubling;
  - AS coverage tooling, and whether V8 coverage sees WASM;
  - whether `arrayBuffers` counts WASM memory (`G7`);
  - AS compile time (`G8`, mutation lanes);
  - the year of v0.28.20;
  - how many tests build `Move` objects for core calls;
  - the share of hot-core lines that port unchanged.
