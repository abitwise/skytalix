---
id: 20261011T111107Z-software-engineer-decision-abc147-a4-rule-applied-r-lower-edge-29-7-pct-p1-lever-arm-d689c50d
kind: decision
by: software-engineer
at: 2026-10-11T11:11:07Z
verified_by:
confidence: medium
refs:
  - ABC-147
  - ABC-144
  - ABC-085
  - ADR-0040
  - NFR-008
  - plans/tickets/ABC-147-how-much-of-npm-tests-cpu-is-vitests-per-node-engine-overhead.md
  - .grugops/context/ticket-to-pr-ABC-147/probe/METHOD.md
  - .grugops/context/ticket-to-pr-ABC-147/probe/raw/a3-estimate.txt
supersedes:
---

# `ABC-147` `A4`: the pre-registered rule picks the **≥ 15 % arm**. R's lower band edge is **29.7 %** of lane CPU

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). These
are one hop's readings, on a machine shared with two QE hops. QE re-reads `A1`–`A3` from its own runs
(Test note 4).

- **R (estimate)** = lane CPU × share(i-w) × (1 − 1 ÷ ratio):
  - **34.2 % of lane CPU, 9.61 s** of the 28.10 s unprofiled median;
  - **band 29.71 %–35.75 %** (8.35–10.04 s; 7.99–11.00 s when the lane CPU's own min and max are taken).
- **Arm, by the lower edge 29.71 % ≥ 15 %:** BA/PM cuts a lever ticket at **`P1`**, routed to
  Architect/Design for the setting. **This hop cuts no ticket.**
- **The declared share and the letter agree.**
  - `METHOD.md` (committed `d152298f`, before the first graded run) declared share = (i-w): production
    CPU inside vitest worker threads.
  - On the letter, share = all of (i). That gives R 34.45 %, band 30.04 %–35.97 %. **Same arm.**
- **Robust to the one soft spot.** The declared ratio is the warm median, 4.93–5.38. On the cold first
  call alone the ratios are lower, 3.31–4.15. Even then, (i-w)'s lower edge is **26.0 %**. That figure is
  a sensitivity only and is not declared. **Same arm.**
- **Break-even was ~21 % share.** The reading is ~43 %, about twice that.
- **What R is.** R is the CPU that production code spends above its plain-`node` cost while it runs
  inside vitest workers. It is a ceiling on what a setting that removes the factor could buy. It is
  **not** a measured cut. The cause of the factor is still `UNKNOWN - verify`: no A/B on the cause was
  run.
- **Answers the `ADR-0040` addendum's open question** (`…7974985e`): yes, the factor is large next to
  `ABC-144`'s lever. It is a separate lever that the worker cap cannot reach, and it does not change
  `ABC-144`'s ruling.
