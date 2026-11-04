---
id: 20261104T023519Z-architect-design-decision-bbc0a213
kind: decision
by: architect-design
at: 2026-11-04T02:35:19Z
verified_by: 
confidence: high on the readings and the choice by the PREREG's rows E4-E7; medium on taking choice rule 1 after E3's pre-registered miss (a flagged judgment, fallback named); estimates (+10-30 Elo, the second pull keeping e1f1) are UNKNOWN - verify
refs:
  - arch-ABC-271
  - arch-ABC-271/20261104T021559Z-architect-design-decision-eeb25cc6
  - arch-ABC-271/20261104T022829Z-architect-design-decision-3a9eba86
  - ABC-271
  - ABC-239
  - EPIC-011
  - E4a
  - E2
  - ADR-0070
  - ADR-0064
  - ADR-0067
  - ADR-0068
  - ADR-0056
  - ADR-0050
  - ADR-0028
  - G1
  - G2
  - NFR-001
  - NFR-005
  - NFR-009
  - 26d06118
  - 8adb0a18
  - ac55ddf6
  - ADR-0069
  - orch-2026-10-30a
  - arch-ABC-239-f3f4/20261104T020015Z-architect-design-decision-69f22167
  - arch-ABC-239-f3f4/20261104T020001Z-architect-design-observation-4eae0fd3
  - memory-bank/50-decisions/ADR-0070-e4a-passed-pawns-read-the-kings-and-the-path-king-distance-free-path-and-the-unstoppable-passer-ship-as-rule-values-judged-on-play-behind-a-test-only-off-door-pair-before-the-second-tuning-pull.md
supersedes: 
seal: sha256:c1cb3c7760f423e8c7d02328856c6368208c727111f75feeb11252b564fc0e5c
---

# arch-ABC-271 decision: ADR-0070 PROPOSED. E4a ships rule values judged on play (GAIN), before the second pull. One judgment is flagged

Architect/Design, task `arch-ABC-271`, on `grugops/arch-ABC-271` from `main` `ac55ddf6`.
- **Evidence:** this task's observation (A, B, D, G, F, C, E) under the PREREG `…eeb25cc6` and the addendum `…3a9eba86`.
- **Records written:**
  - `ADR-0070` (new, PROPOSED). ADR-0070 was the next free id after `ADR-0069`; no other record used it;
  - dated lines in `ADR-0056` (D2 rows E2 and E4; D6 item 5), `ADR-0067` (§ Consequences item 5 and a log row) and
    `ADR-0064` (d10).
- No bar moved.

## 1. The verdict, by the PREREG's choice rule
- **H holds every play-safety and cost row:**
  - the mirror 0 / 226;
  - phase 24 0 / 333;
  - the mate floor 0 / 163 and 0 / 190;
  - zugzwang 7 / 7;
  - `G1` 54 / 58, none newly missed;
  - `G2` R = 1.0269.
- **I1 is exact.**
- **E3 missed as pre-registered:** (c) 44 / 404 and (d) 312 / 2 123 twin pairs. That stands.
- **The addendum's diagnostic:**
  - (c): every failure is the other terms (king exposure, 35 cp on rim twins).
  - (d): 196 failures are exposure and 101 are the king leaving the passer's path. 15 are the blend's trunc on a 1 cp
    rank-2 king step at phase 4.
  - That last class is R, so by the addendum: STOP, and the ADR restates the rule.
- **The restatement moves no value:**
  - the resolution clause in decision 1 (strict in the eg half; trunc may drop a sub-cp blended step above phase 0);
  - the relation domains in decision 5 (P1 (c): twins share exposure; P1 (d): phase 0, both kings off the path, the
    same exposure).
- **So: choice rule 1.** `ABC-271` ships H's values, judged on play. The firing figure is 29.75 % ≥ 5 %, so the
  intent is **GAIN** and NEUTRAL is not open.

## 2. The judgment the Orchestrator may overrule
- The PREREG did not say what follows a rule restatement that moves no value. Taking rule 1 after E3's
  pre-registered miss is this hop's judgment. It is not a re-grade: E3 stays NOT MET on record.
- **Why it is taken:**
  - every E3 failure is explained exactly, by the other terms or by trunc;
  - E4a's own part meets (c) on every pair, and meets (d) on every off-path pair at phase 0;
  - the rows the choice rule exists for (mate floor, zugzwang, `G1`, `G2`) all hold.
- **The fallback, if he rules otherwise:** choice rule 4, structure only at 0, `ADR-0068`'s form (ADR-0070
  § Alternatives, first bullet). No new probe is needed for it.

## 3. The order: values → second pull. It wins more for less host time
- **Values route:** `ABC-271` costs about 0.9 h of host time (C2′ about 0.4 h, S′ about 10 min, Levels about 9 min,
  `G2`, `G6` and the audit about 0.2 h).
  - It reads E4a on its own: P(pass | +20) = 0.79. The slice's +10–30 is BA/PM's estimate.
  - It widens `zugzwang.001`'s depth-9 margin from 29 to 191 cp: the very row the first pull broke.
  - On `26d06118` it turns e1e5 back to e1f1 (+150; hand terms on a fit, not a fit).
- **Structure route:** about 0.2 h, and no games. But E4a's value then arrives only through a second pull passing F6.
  - That pull needs the owner's word on the margin-aware bound form, plus B-T7 (about 0.7 h) and B-T8 (about 5 h).
  - The first pull of that design missed.
- **The difference is about 0.7 h of host up front.** If P8 misses, it falls back to the structure route at that
  price (ADR-0070 F6).
- **The second pull then frees** the eg halves of `PASSED_KING_ENEMY`, `PASSED_KING_OWN` and `PASSED_FREE` (eg ≥ 0,
  mg 0), and holds `PASSED_UNSTOPPABLE` as a rule.

## 4. Owed lines (not edited here; BA/PM is closing `ABC-239` in parallel)
- **The `ABC-271` page:**
  - `adr:` → `ADR-0070` (PROPOSED). DoR row 10 waits on acceptance alone (reading (b): the build may start).
  - Intent: **GAIN**, firing 29.75 % at ≥ 10 cp.
  - **P0's exact counts** (ADR-0070 d5).
  - **P1 (c) / (d) / (e) restated with the fixture conditions** (d5). (e) reads through `passerTermsForTest`.
  - Scope 1: "the queening square" stands, and the brief's "stop square" is declined (d1).
  - Scope 4: the memo is 576 KiB (`NFR-009` +128 KiB).
  - The migration list (d6: 23 rows by class).
  - Dependencies: E4a before the second pull (`ADR-0067` item 5's dated line).
  - The second pull's d6 free-set line is owed in `ADR-0067` on acceptance.
- **`EPIC-011`:** row E2's status (first pull NOT MET); row E4's E4a → `ADR-0070`; the Phase 4 order (E4a → second
  pull).
- **`plans/board.md`:** the Orchestrator's.

## 5. Owner question
- *"Accept ADR-0070?"* It is a new ADR, so its acceptance is his.
- The recommendation is yes: the rule values ship behind a door, are read on their own C2′, and then the second pull
  fits king distance and free path.
- Nothing else here needs him. The E3 judgment (§ 2) is the Orchestrator's to confirm or overrule.
