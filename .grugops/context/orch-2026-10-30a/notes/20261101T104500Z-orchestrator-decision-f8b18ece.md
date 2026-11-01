---
id: 20261101T104500Z-orchestrator-decision-f8b18ece
kind: decision
by: orchestrator
at: 2026-11-01T10:45:00Z
verified_by: 
confidence: high
refs:
  - https://github.com/AssemblyScript/assemblyscript
  - .grugops/queue/claimed/arch-speed-path-spike.md
  - plans/epics/EPIC-010
supersedes: 
seal: sha256:a8f0ff9cd46de8b7e874ee34430a3e131d2f7fb403f54f0797c613d8a46a74cd
---

# Owner direction 2026-11-01: look into AssemblyScript for speed; two improvement areas

Owner, verbatim: "I found something useful, I thin re-writing everything to C++ or Rust is expensive, but we could look into AssemblyScript ( https://github.com/AssemblyScript/assemblyscript ), the syntax is similar to TypeScript. Not sure about speed estimates. So as I understand, improvement areas are 1) improve speed to calculate positions ; 2) improve algorithms that we use currently."

Orchestrator routing (delivery; no architecture decided):
- Area 2 (algorithms) is EPIC-010's existing scope; unchanged.
- Area 1 (speed): `arch-speed-path-spike` (Architect, records + reading only, beside qe-ABC-223's games) writes a PROPOSED ADR comparing O1 in-TS fixes (BigInt off the hot path, allocation-free, monomorphic), O2 AssemblyScript hot-core port, O3 Rust/C→WASM, O4 status quo, with estimated nps ranges, costs, test/coverage impact, and a measured time-boxed prototype plan. No build, install or benchmark until the host is free and the owner has read the proposal.
- The language/architecture choice is the owner's call (owner delegation 2026-10-22 keeps big architecture calls with him).
