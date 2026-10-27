---
id: 20261027T194139Z-orchestrator-decision-64925a53
kind: decision
by: orchestrator
at: 2026-10-27T19:41:39Z
verified_by: 
confidence: high
refs:
  - ABC-210
  - EPIC-008
  - bapm-s1-ABC-210/…ff16a93d
  - arch-adr0051-not-in-force/…c32c79d0
  - arch-records-arch-snapshot/…cdc1fb61
  - orch-2026-10-27k/…85e9c9b2
supersedes: 
seal: sha256:eccc782a8ba16d65e2a3486190174577cf0bfb8a994c6dc0dd2a7ac29716182a
---

# ABC-210 closed unmerged (Done, dropped); EPIC-008 close path step 2 routed

**Merged:** `bapm-s1-ABC-210` (…ff16a93d) and earlier `arch-adr0051-not-in-force` (…c32c79d0). ABC-210 Backlog → Done (dropped, NOT DELIVERED; owner veto open). Re-tune not taken (no owner question) — I agree: the design probe already exhausted the knobs. main's src/data/tools unchanged since a17d5945; no revert owed.

**EPIC-008 close path (BA/PM's five steps) adopted as written, with one delivery ruling:**
- Step 3's G6 "≥ base" compares against the M1 baseline sha `3497aad2` (BA/PM's reading of "nothing regressed"). Accepted as a delivery reading: no bound moves; the floor 6 and rule A stand.
- Step 2 must finish before step 3 so the R reading runs ALONE. Before step 3 I check host power (AC or > 30 %).
- A veto on 207/209/210 arriving before step 3 starts holds step 3 until that round's QE verdict.

**LOW carried to step 4:** stale front-matter on four Done pages (ABC-204, ABC-206 `in-review`; ABC-215, ABC-217 `ready`).

**Routed (width 1/3, records only):** `arch-repass-30-architecture` — the full as-built re-pass of `memory-bank/30-architecture.md` (close item …cdc1fb61, incl. the virtual-clock production-module count).
