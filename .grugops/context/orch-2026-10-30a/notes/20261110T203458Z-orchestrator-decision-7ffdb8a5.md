---
id: 20261110T203458Z-orchestrator-decision-7ffdb8a5
kind: decision
by: orchestrator
at: 2026-11-10T20:34:58Z
verified_by: 
confidence: high
refs:
  - ABC-317
  - ABC-316
  - tools/rating/rating.ts
  - README.md
  - CHANGELOG.md
  - 20261110T190817Z-orchestrator-decision-88c7ab5b
  - 20261110T190716Z-qe-e2e-decision-a55b90ec
supersedes: 
seal: sha256:85b67e98955625ee5ae1e238592429267cdb4ab425d9c0114de007776b4dc818
---

Owner, 2026-11-10: "ok go forward with level 3 and level 4". This cuts option A's second slice as ABC-317. The harness already takes `--skill 3` and `--skill 4` (ABC-316 A1; QE read 0.33 s and 1 s from LEVELS), so there is no code hop. The owner's go is his word for runs over 1 h. Each graded run still needs W (his held host) at run time.

Acceptance:
- **B1, QE stage A (no graded games).**
  - Pins as in ABC-316, and the sha and trees to read.
  - A smoke of at most 2 games at `--skill 4`, ungraded, checking latency at 1 s and the control line.
  - A PREREG sealed before any graded game, as ABC-316's. E is fixed by rule from the ABC-316 projections: **L3 E 1890** (projected ~1850–1925) and **L4 E 2040** (projected ~2000–2075).
  - 200 games per level, with both sides at the level's `st` (0.33 s and 1 s).
  - Band rule: one step per level, only on the orchestrator's word. E is not hard-coded in a sealed script, so a step needs no script copy.
  - The same validity, FL and W gates.
  - A time estimate per level, from ABC-316's measured walls: L2 took 50–64 min at 0.18 s.
- **B2, stage B.** One run per level, on a brief line citing W. L3 and L4 may be separate windows.
- **B3, README and CHANGELOG.**
  - L3 and L4 become measured. L5–L7 projections are re-checked against the measured L4, which shares their time rule's region; they are re-projected only if the method requires it, with the method stated.
  - Also close ABC-316's five gaps (…a55b90ec):
    - restore "less at longer times";
    - state or remove the padding of the projected ranges;
    - L1 shows 1 499;
    - no space in thousands;
    - a `[Unreleased]` link definition.
- **B4, gates and the QE verdict,** as ABC-316 A5. A `src/` diff must stay empty.

Order: qe-ABC-317 stage A → W → L3 → W → L4 → README hop → QE check → merge.
