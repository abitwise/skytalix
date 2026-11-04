---
id: 20261104T221826Z-ba-pm-observation-feb6866c
kind: observation
by: ba-pm
at: 2026-11-04T22:18:26Z
verified_by: 
confidence: high for what git, grep and the line compare show at main 3ad21218; items 1 to 4 UNKNOWN - verify
refs:
  - bapm-bundle-1-cut
  - grugops/bapm-bundle-1-cut
  - ABC-303
  - ABC-286
  - ABC-288
  - ABC-289
  - ABC-284
  - ABC-282
  - ABC-301
  - EPIC-011
  - ADR-0056
  - ADR-0060
  - ADR-0072
  - ADR-0073
  - ADR-0074
  - R-BUNDLE-1
  - R-283-LMR
  - OQ-0072-1
  - OQ-0073-1
  - OQ-0074-1
  - NFR-005
  - NFR-008
  - NFR-009
  - 3ad21218
  - orch-2026-10-30a/20261104T215525Z-orchestrator-decision-3e73f9f9
  - arch-owner-answers-1104b/20261104T220607Z-architect-design-decision-88ca95bd
  - arch-owner-answers-1104b/20261104T220311Z-architect-design-decision-d776c0f0
  - arch-bundle-1/20261104T205538Z-architect-design-decision-37b7fb23
  - arch-bundle-1/20261104T201203Z-architect-design-decision-aa5c4dc1
supersedes: 
seal: sha256:a446ffa7d4efd05f683e10c6ff84331b319b4b1f6b1d58502a5e47115fcbe315
---

# bapm-bundle-1-cut observation: every row of tables 1–3 copied byte for byte; four points the records do not settle, and what the slot does to the base

BA/PM, task `bapm-bundle-1-cut`, records only. Read with git, grep, sed and a line compare at `main` `3ad21218`.

**Checked.**
- **The copy:** the 68 lines of `ADR-0056` D5's dated block that `ABC-303` carries, from "The doors." to the end of "A red, by row.", less the rows-ruled list, appear unchanged on the page by machine line compare; 0 differ. 22 table rows: 7, 8, 7.
- **The figures against `arch-bundle-1` `…ed82b408`:** S1, S3, S7, P3, P4, R1–R4, R6 and R7 agree. R6's ratios equal R7's counts over S1's. +0.148 is 7.016 − 6.868.
- **The derived bars, by `…aa5c4dc1`'s rules:** 0.89 from 0.8363; +0.10 from +0.116; 25 cp from 9 cp.
- **The id:** `ABC-303` appears nowhere in `.grugops/`, `plans/` or `memory-bank/` at `3ad21218`, and in no ticket file name on the 22 unmerged local branches.
- **The base:** `git diff 0cc9afd1 3ad21218 -- src tools` names eight files, all `*.test.ts`. So production `src/` still equals the probe's base at this cut.

**Rows that copied, with a wrinkle. No row was re-ruled.**
- **Row ids collide with part names.** Table row P4 is the reach bar, S1 is all-off identity, P1 is a door row. The page says so, and keeps the ids so QE copies by number.
- **S7's two clauses are one.** "None beyond 25 cp" makes "≥ 95 % within 25 cp" always true. `ADR-0073` d10 derives it that way, so it is copied as written.

**Not settled by the records. For the Architect.**
1. **A candidate fault in the one read.** The block says "A fault, a loss on time or a Levels red: a defect", beside "Never re-played". `…d776c0f0` § 6 lists MET, below 50.0, a base fault and a harness error for C2′, and no candidate fault. C2′ itself makes a fault a failed condition. Whether a fixed candidate plays a new C2′, and whether a played C2′ stands after a fix for an S′ fault or a Levels red, is `UNKNOWN - verify`.
2. **S′'s E.** The block reads E 1 810; `…d776c0f0` § 6 leaves a blank for a re-pinned value and says the block governs a difference. `ABC-303` copies 1 810. A re-pin before the read would need a dated line.

**Not settled by the records. For the Orchestrator.**
3. **The slot's consequence for the branch** is BA/PM's reading (decision J8).
4. **The slot moves the base under two of the block's reasons.** Reason 1 is that reading first keeps P4 on the tree it was measured on, and reason 2 that R1 and R2 stay comparable with what the owner was shown. If `ABC-301` merges first, its fit moves the evaluation under both, and if `ABC-282` merges, production `src/` moves too. So the moved-base line is the expected path, not an edge. Rows P3 and P4 are then read on an unprobed tree, with reach at +0.116 against +0.10, and a red is a STOP. Whether either reason still stands is the Architect's to say; whether a far figure goes back to the owner is the Orchestrator's, by the block. The effect on any row is `UNKNOWN - verify`.

**Owed elsewhere. None was edited.**
- **Orchestrator:** the board (a card for `ABC-303`; `ABC-286`, `ABC-288`, and `ABC-289`'s card still reading PROPOSED and "held for OQ-0074-1"). Whether the two stale titles and `ABC-286`'s F1 row are wanted at the next hop (decision J5).
- **Architect, at QE's verdict:** B5's line naming `ABC-303` and the read, or B6's return to PROPOSED.
- **BA/PM, next hop:** `ABC-301`'s P1 banner and test note 4 as ruled (`…e9fb646f`); at W1's merge, `ABC-078` A3's text and `ABC-221` A10.
