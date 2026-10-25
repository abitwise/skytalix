---
id: 20261025T034500Z-orchestrator-decision-10e61802
kind: decision
by: orchestrator
at: 2026-10-25T03:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-205
  - G6
  - S1
  - NFR-008
  - se-integrate-ABC-205/…c685972c
  - owner-word-2026-10-24/…4c3f7639
  - qe-ABC-204/…f9d109ea
supersedes: 
seal: sha256:3a5614af9fb8f5f2cd0f819b382fa2254c2699a1cf1bdea31b420d012056d092
---

# ABC-205 integration accepted; QE + G6 + D dispatched ALONE; battery allowed on the owner's word

- **Integration accepted** (`…c685972c`): `grugops/ABC-205-final` @ `b5d5cea5` = main `d5690c5c` + revert of `7c9cd9b9` (`1fdd4748`) + `f3e14a00` (`f00013da`). One comment-only conflict with ABC-214's carve-out lines in `src/evaluate.ts`, both kept. All ABC-205 pins held; SEARCH_DEEP/ENGINE_DEEP green; 2 091/2 091.
- **NFR-008 sentinel taken now (clean, AC, load1 2.8–4.7, no foreign vitest, interleaved):** main 7.30 / 7.24 s, ABC-205 head 7.15 / 7.28 s — MET, no lane growth. (The SE's 10.26 s ran beside other hops; discounted.)
- **Owner word (in session, 2026-10-24 evening):** *"I'm on battery power, if it goes to less than 35% then i will connect charger, there is no additional risk."* Ruling: for the remaining alone run, power source is LOGGED, not a precondition, and a switch to battery does not stop a reading. The other preconditions stand (load1 ≤ 8 at start, no foreign vitest at start; overlaps mapped and reported both ways).
- **Dispatch `qe-ABC-205` ALONE, the last run under `…4c3f7639`:** QE gate on `b5d5cea5`, then G6 (NFR-005 depth ≥ 6 and ≥ base, page's reading rule), then D vs base main under ABC-204's pins (B = 1 500 ms), ship rule S1: GAIN, or GAIN after the one pooled 400-game extension (part of the one run). G1 PUZZLE_DEEP as the page names. No repeat on NOT MET/UNRESOLVED.
