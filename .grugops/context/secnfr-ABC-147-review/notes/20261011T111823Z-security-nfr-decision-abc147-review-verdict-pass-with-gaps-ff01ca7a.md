---
id: 20261011T111823Z-security-nfr-decision-abc147-review-verdict-pass-with-gaps-ff01ca7a
kind: decision
by: security-nfr
at: 2026-10-11T11:18:23Z
verified_by:
confidence: high
refs:
  - ABC-147
  - NFR-008
  - RISK-ABC147-01
  - RISK-ABC147-02
  - plans/tickets/ABC-147-how-much-of-npm-tests-cpu-is-vitests-per-node-engine-overhead.md
  - .grugops/context/secnfr-ABC-147-review/notes/20261011T111823Z-security-nfr-observation-abc147-review-six-checks-recomputed-baccc2a7.md
  - .grugops/context/secnfr-ABC-147-review/notes/20261011T111823Z-security-nfr-observation-abc147-review-risks-and-gaps-with-owners-44c6cd6d.md
  - .grugops/context/ticket-to-pr-ABC-147/notes/20261011T111107Z-software-engineer-decision-abc147-a4-rule-applied-r-lower-edge-29-7-pct-p1-lever-arm-d689c50d.md
supersedes:
---

# `ABC-147` Security/NFR review (in place of QE, docs-only rule): **PASS_WITH_GAPS**. The ≥ 15 % arm stands under every reading the page allows

This note is hand-authored and unsealed. It is one review of method, admissibility and arithmetic, at
`4c634f09`. **Nothing was re-run.**

- **Verdict: PASS_WITH_GAPS.**
  - All six checks hold (`…baccc2a7`): method before graded runs; exclusions by the page's own rule
    (0 mismatches on 36 rows); `A1` sums and attribution; `A2` interleaving and 10/10 equal digests;
    `A3` band arithmetic including the cold edge 26.0 %; the arm under every allowed reading.
  - Every graded figure reproduces from the committed raw files to within 0.01.
- **`A4` arm confirmed: ≥ 15 % → BA/PM cuts a `P1` lever ticket, routed to Architect/Design.** The
  lowest allowed lower edge is 26.00 % (cold sensitivity). The declared edge is 29.71 % and the letter's
  is 30.04 %. To leave the arm, the factor would have to fall to ≤ 1.67x, or the share to ≤ 18.8 %.
- **Not a PASS**, because of four gaps, none blocking (`…44c6cd6d`):
  - G1: the unused-run count reads 24 but is 21 (owner: Software Engineer);
  - G2: the aggregator is not committed (owner: Software Engineer);
  - G3: the profiles were deleted (owner: QE/E2E);
  - G4: no independent re-measure (owner: BA/PM's lever ticket and QE/E2E).
- **Risks accepted, with owners** (`…44c6cd6d`):
  - `RISK-ABC147-01`, `--cpu-prof` hangs 5/18 profiled lane runs at 60 s (owner: QE/E2E);
  - `RISK-ABC147-02`, a ratio read on 2 files extrapolated to all of (i-w), so R is an estimated ceiling
    (owner: BA/PM in the lever ticket, whose acceptance should be a measured cut).
- **Fences (`A5`):** `git diff --name-only 63ac790f..4c634f09` lists 0 paths outside `plans/` and
  `.grugops/`, and `plans/board.md` is untouched. The probe files carry no secret. They do carry local
  scratch paths, which is acceptable for this local-only repo.
- **`NFR-008`:** reading only. No level moves, and 0 files, 0 tests and 0 spawns join the lane.
- Column moves are the Orchestrator's. This role does not move `plans/board.md`.
