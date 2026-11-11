---
id: 20261111T074315Z-security-nfr-decision-5333bd5c
kind: decision
by: security-nfr
at: 2026-11-11T07:43:15Z
verified_by: 
confidence: high; the ceiling is the row's owner-accepted budget + 2 s rule applied to the owner's 10 s; nothing run
refs:
  - secnfr-ABC-318
  - ABC-318
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - NFR-011
  - NFR-012
  - AR-NFR004-A
  - AR-UCI-BUSY
  - SEC-212-a
  - SEC-318-a
  - ADR-0045
  - ABC-212
  - ABC-228
  - src/levels.ts
  - src/levels.test.ts
  - plans/nfr-catalog.md
  - orch-2026-10-30a/20261111T073837Z-orchestrator-decision-f1dce7dd
  - 902680b7
supersedes: 
seal: sha256:38372d5f402d42d017a5654eec6485ae3b9e940de757f22ca8d53c1c3070a512
---

`ABC-318` C2 is placed. `plans/nfr-catalog.md` `NFR-004` gets a dated amendment on the owner's word, verbatim "go with 10 s for level 6" (`orch-2026-10-30a` `…f1dce7dd`).

- **`Target`:** "7 s at level 6" now reads "~~7 s~~ 12 s at level 6". A dated amendment sits before the mechanism line. It says level 6's budget goes 5 000 → 10 000 ms, so by the row's own "budget + 2 s" rule its ceiling goes 7 s → 12 s. The owner's word names the budget, and 12 s is that rule applied, not a new bound. Levels 1–5 (5 s) and level 7 (32 s) are unchanged, as are clause A (≤ 4 s at level 5), the 22 s and 60 s mode clauses, and `HARD_CEILING_MS` 60 000. 12 000 is under the clamp, so the one-clamp shape holds. The amendment binds from `ABC-318`'s merge.
- **`Verified by`:** one dated line. Level 6's figures on record were read at 5 000 ms and become history at the merge. The 12 s ceiling is held by design, with a 2 000 ms margin. On the real clock it is `UNKNOWN - verify` until QE runs the `ABC-212` `A4` level-6 row (levels deep lane) at 10 000 / 12 000.
- **The rest of the file:** one `_Updated` line and one closing section. The other 11 rows are byte-identical (sha256 `a8caad10…59ed26` before and after). Older sections keep "7 s" as dated history. No byte of `src/`, an ADR, the README or the board changed.
- **Result: PASS_WITH_RISKS, with no required fix and no rating change.** `SEC-212-a`'s exposure at level 6 grows from about 7 s to about 12 s, and it stays LOW (Architect/Design). SEC-318-a (LOW) belongs to the SE in C3: the `A4` level-6 row's timeout, 300 000 ms, equals 30 × 10 000 ms, so the row cannot pass until the timeout is raised. QE re-reads both.
