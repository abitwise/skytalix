---
id: 20261111T074315Z-security-nfr-observation-819047c6
kind: observation
by: security-nfr
at: 2026-11-11T07:43:15Z
verified_by: 
confidence: high on the file reads and the timeout arithmetic; the no-change rating is Security/NFR's judgement; nothing run
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
seal: sha256:f380b84622ec3945d7b65f9413f4273e8a3b9d17080e3d9b5ebce6dff43423d2
---

`ABC-318` C2, records only. Security/NFR, ASVS L1. Nothing was run, built or timed.

**NFR ids reviewed:** `NFR-004` (amended), `NFR-005`, `NFR-008`, `NFR-009`, `NFR-011`, `NFR-012` (read, not moved). **Result: PASS_WITH_RISKS.** There is no required fix. No risk rating changes.

**What I read (file reads, nothing run):**
- `src/levels.ts` at `902680b7`: `LEVELS[6]` = `{ 5_000, 0 }`. `HARD_CEILING_MS` is imported from `src/engine.ts` (60 000, pinned in `src/levels.test.ts`).
- `src/levels.test.ts`: `CEILING_MS[6]` = 7 000. The clause B row checks a margin of at least 2 000 ms at every level except 5. The `ABC-212` `A4` level-6 row is `[6, 30, 300_000]`: 30 moves, each asserted ≥ `budgetMs` and ≤ `CEILING_MS[6]`, with a timeout of 300 000 ms. It runs under `ENGINE_DEEP=1` only (`RUN_DEEP`).
- `src/uci-session.test.ts`: the level-6 rows are virtual-clock rows (`rig({ stepMs: G ÷ 30 })`, or a stub at 1 000 ms a step).

**Residuals and lanes pinned to level 6's 7 s or its 5 000 ms budget:**
1. `NFR-004` `Verified by`, level 6: max 5 005 ms (`qe-ABC-212` `A4`) and 5 001 ms (`qe-ABC-228-ii` `G5`), both read at 5 000 ms. At 10 000 ms the real-clock reading is `UNKNOWN - verify` until QE's levels deep lane reads it.
2. **`A4` level-6 row timeout (SEC-318-a, LOW, owner the SE in C3, checked by QE).** At 10 000 ms, 30 moves take at least 300 000 ms, which is the row's own timeout. The row cannot pass as written. The fix is to raise the timeout; reducing the count or relaxing an assertion would weaken the row. The comment "About 2.5 min" becomes about 5 min.
3. The clause B row: `CEILING_MS[6]` goes 7 000 → 12 000. The margin stays 2 000, so the check holds. This is SE work (C3).
4. `SEC-212-a` (LOW, Architect/Design) and its sibling line in `AR-UCI-BUSY`. A busy `isready` or `stop` at `Skill Level` 6 now answers about 10 s late instead of about 5 s (the catalog text says ≈ 7 s, the ceiling), and the ceiling bounds it at 12 s. Exposure grows; the rating does not. It stays under level 7's accepted ≈ 32 s, and the "stay at level 5 or below" advice still covers it. Neither entry was edited.
5. `AR-NFR004-A`: the ≤ 31 ms bound is unchanged. At level 6 the margin is 2 000 ms, about 65× the bound. Its "max +1 ms at levels 6 and 7" was read at 5 000 ms for level 6.

**Checked and not pinned:** `NFR-008`: no default-lane row reads level 6 on the real clock, and its virtual rows step at G ÷ 30. No measurement was taken, so this is `UNKNOWN - verify`. `NFR-005` is level 5. `NFR-009`, `NFR-011` and `NFR-012` do not name level 6's time. The `KEY_ARRAY_CAPACITY` tripwire (100) is far from level 6's depth 13 at 5 s.
