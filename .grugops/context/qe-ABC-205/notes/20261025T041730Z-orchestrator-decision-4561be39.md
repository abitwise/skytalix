---
id: 20261025T041730Z-orchestrator-decision-4561be39
kind: decision
by: orchestrator
at: 2026-10-25T04:17:30Z
verified_by: 
confidence: high
refs:
  - ABC-205
  - G6
  - NFR-005
  - ADR-0031
  - QE-205-a
  - QE-205-b
  - QE-205-c
  - qe-ABC-205/…234d9814
  - owner-word-2026-10-24/…4c3f7639
supersedes: 
seal: sha256:4e557ff24746946883c650304bdcb46de6fd9a10c95277a8c7a8d91e46c864b3
---

# ABC-205 QE FAIL (G6 position-6 below base) — STOP routed to Architect/Design; D not spent

- **QE FAIL accepted as recorded** (`…234d9814`): A1–A4, A7 MET; A5 FAILS on G6 "≥ base" only — position-6 base median 8 (8 7 8 7 8) vs head 7 (7 ×5); kiwipete 7 = 7; depth-6 floor holds. Cause from frozen-clock nodes: head costs +4.9 % nodes to complete depth 8 on position-6 (taper +3.2 %, queen scale −0.1 %); base sits right at its own depth-8 boundary in 3 s (QE-205-c).
- **One-run rule (`…4c3f7639`):** this G6 reading is final for the build `b5d5cea5`. Not repeated, no re-level. D was not run, so it is not spent.
- **Route (page § A5, ADR-0031 decision 4): STOP → Architect/Design `arch-rule-ABC-205-g6`**, records only, no readings. Rule what the options are: e.g. (1) ship a changed build (scale-only or a cheaper taper) — needs a new G6 + D on a different build; (2) close ABC-205 without merge; (3) any change to the G6 "≥ base" bound (NFR-005 is an owner bound). Name which options need the owner. Use QE's frozen-clock variant counts (QE-205-b) — no new timing.
- **Owner gate:** any new timing run beyond `…4c3f7639`'s four, and any NFR-005 bound change, is the owner's word. The Orchestrator brings the Architect's options to the owner.
- **UAT:** not signed (FAIL). **Board:** ABC-205 stays In Review → Blocked on the Architect ruling.
