---
id: 20260722T091141Z-software-engineer-decision-4e2fb0af
kind: decision
by: software-engineer
at: 2026-07-22T09:11:41Z
verified_by: 
confidence: medium
refs:
  - ABC-008
  - EPIC-004
  - RISK-002
  - NFR-004
  - NFR-005
supersedes: 
---

**RISK-002 verdict: GO WITH CONSTRAINT.**

The spike asked whether TypeScript on Node can deliver the throughput a ~1400-1700 Elo engine needs. Measured 2.64M nodes/sec search-shaped on an Apple M3 — roughly 5x the NFR-005 target of 500k. Both product decisions stand: **the stack stays TypeScript/Node and the strength target stays ~1400-1700.** Neither needs to be reversed, so nothing escalates back to the requester.

This is `GO WITH CONSTRAINT` rather than a clean `GO`, and the constraint is named so EPIC-004 inherits it rather than rediscovering it:

**Constraint — the per-move budget must be time-based, not depth-based.** The headroom measured here is on fast hardware. Compounding the plausible penalties (roughly 3x for real legality filtering and special moves, roughly 3x for slower hardware) puts a worst-case machine near ~300k nodes/sec, which is *below* NFR-005. A fixed search depth would therefore blow NFR-004's 3-second budget on exactly the machines least able to absorb it. Iterative deepening against a wall-clock budget — already in EPIC-004's scope — is what makes this safe, and this measurement is the reason it is non-negotiable rather than a nice-to-have.

**What this does not prove.** Throughput is necessary for the strength target, not sufficient. Elo comes from evaluation quality and move ordering at least as much as from nodes/sec, and none of that is measured here. RISK-003 (strength is hard to verify without a reference opponent) is untouched by this spike and remains open.

**Confidence is `medium`, deliberately.** The number is a proxy from throwaway code with bias in both directions, measured on one machine. It is strong enough to justify continuing on the current stack, and not strong enough to be quoted as the engine's performance.

**Spike closed within its timebox.** The benchmark stays quarantined at `spike/perft-bench.ts` with a do-not-build-on-this header; nothing in `src/` may import it. The project scaffold it produced (package.json, tsconfig, Biome, Vitest, and the now-verified AGENTS.md command slots) is the part that survives, and ABC-001 builds on that.
