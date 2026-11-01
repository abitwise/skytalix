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
