---
id: 20261011T083621Z-architect-design-decision-abc084-base-is-49-files-1530-tests-adr0035-51-is-stale-a727a0fb
kind: decision
by: architect-design
at: 2026-10-11T08:36:21Z
verified_by:
confidence: high
refs:
  - ABC-084
  - ADR-0035
  - NFR-008
  - .grugops/context/secnfr-ABC-084/notes/raw-out-lane-run1-summary.txt
  - .grugops/context/secnfr-ABC-084/notes/raw-out-lane-run3-summary.txt
  - 20261009T223620Z-security-nfr-observation-abc084-n8lane-met-85-210ms-net-a6-oracle-195ms-a5-false-red-under-load-7f3b2d61
  - 20261010T105455Z-architect-design-observation-floors-from-the-record-full-lane-r-0p45-3p12s-one-file-0p13-0p17s-lane-24p9-26p0s-45cf4e0d
  - 20261010T183612Z-security-nfr-decision-catalog-r1-provisional-retired-node26-risk003-measured-ar133-recorded-d1e00b44
  - 20261010T190811Z-ba-pm-decision-backlog-rescored-r1-two-drop-four-ready-one-held-abc142-cut-d8990fbb
supersedes:
---

# Item 3: the `ABC-084` count is 49 files and 1 530 tests. `ADR-0035`'s "51 files and 1 541 tests" is the stale one

This note is hand-authored and unsealed. It was read from committed raw files and `git ls-tree`. Nothing was
run or timed.

## Reconciled
- **The figures** 24.86 s / 6.52 s and 26.04 s / 7.16 s are Security/NFR's `ABC-084` runs 1 and 3, base arm
  B, `7b54dae`.
  - `secnfr-ABC-084/notes/raw-out-lane-run1-summary.txt`: `B: n=10 files/tests=49/1530 medianCPU=24.855 …
    medianWALL=6.520`.
  - `raw-out-lane-run3-summary.txt`: `B: n=8 files/tests=49/1530 medianCPU=26.040 … medianWALL=7.160`.
  - The harness asserts counts on every run, and every B run reads 49 / 1530.
- **`git ls-tree -r 7b54dae`:** 49 `*.test.ts` outside `.grugops/`, or 51 counting two committed probes that
  the lane excludes (`fold-abc084-gate-b/…`, `ruling-abc079-oracle/…`).
- **Where the 51 came from.** 51 is the lane at `ADR-0035`'s own base, `2320269b` (git count 51). The
  1 541 matches no harness-asserted arm in the `ABC-084` files, so its source is `UNKNOWN - verify`.

## Ruling
- **The stale one is `ADR-0035` § Context**, the sentence after the `ABC-084` readings. It is marked inline
  as an erratum, with the correction in `§ Pointers 2026-10-11` P2.
- **These are right:** the proposal's evidence note `…45cf4e0d` (49 / 1530) and the catalog's 2026-10-10
  section ("49 files").
- **No verdict moves.** Decision 5's projection reads about 18.3 s at 49 files (14.94 + 9 × 0.37), still
  over 15 s. That verdict has been history since R-1. The Alternatives line "40 → 51 files" describes the
  lane at `2320269b`, and it stands.

## Follow-ups
- **Security/NFR, at the next catalog hop:** retire the catalog's *"File-count note, flagged rather than
  resolved"* with a pointer to `ADR-0035` § Pointers P2.
- **BA/PM:** none. Nothing downstream reads the number, as `…d8990fbb` item 2 found.
