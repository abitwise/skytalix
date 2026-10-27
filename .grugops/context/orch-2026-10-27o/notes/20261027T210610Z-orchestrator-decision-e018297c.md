---
id: 20261027T210610Z-orchestrator-decision-e018297c
kind: decision
by: orchestrator
at: 2026-10-27T21:06:10Z
verified_by: 
confidence: high
refs:
  - EPIC-008
  - ABC-204
  - tools/rating/rating.ts
  - orch-2026-10-27n/…8132b7a9
  - qe-epic008-close
supersedes: 
seal: sha256:52c18a980757b87dec106115c2baaa4e0e5f0f475fa06475861b02054a1b8259
---

# The owner is moving the coding agents to a new, faster Linux host. What that does to EPIC-008

The owner said in session that the agents move to another, more powerful machine (Linux x86-class, replacing the current arm64 laptop). No host name or path is recorded here (ADR-0049 d4).

**Impact (facts at 50e3d338):**
1. **M1 is host-bound.** EPIC-008 defines R "on Stockfish 19's UCI_Elo scale at the harness's time control on this host". The baseline 2 061.3 ± 50.3 was read on the current host. A closing R on a faster host would measure the host, not the engine: skytalix searches deeper per 3 s. A cross-host M1 is not comparable.
2. **The harness pins are host-bound.** `tools/rating/rating.ts` hard-codes absolute tool paths and the sha256 of the current host's `cutechess-cli` (1.5.1 + 5 commits) and Stockfish 19 binaries. Linux binaries hash differently, so every pin reads "DIFFERS".
3. **D readings (candidate vs base on one host) stay valid** on any host once the harness is re-pinned there. Wall-clock NFR rows were calibrated here; a faster host passes them more easily. No bound moves.

**Delivery calls:**
- `qe-epic008-close` stays queued; the spawn stays held.
- Options for the owner (an M1 protocol question, so it is his):
  - (A, my lean) run the closing R on the current host before the move, on AC, ~4.4 h;
  - (B) re-read both the baseline sha `3497aad2` and the close sha on the new host under the same protocol (~9 h, and E may sit off-band there);
  - (C) close M1 as not measured.
- After the move, a small tools ticket is owed: rating.ts tool paths from the environment, and re-pinned hashes on the new host (ABC-204's pins are a recorded protocol, so the re-pin is dated, not silent).

**State to carry:** 50 commits on main not on origin; 8 kept unmerged branches local only (`grugops/ABC-207`, `qe-ABC-207`, `ABC-209`, `qe-ABC-209`, `ABC-210`, `qe-ABC-210`, `qe-ABC-208`, `qe-gate-ABC-208`). Pushing is the owner's.
