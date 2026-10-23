---
id: 20261023T072556Z-security-nfr-decision-d0c770b5
kind: decision
by: security-nfr
at: 2026-10-23T07:25:56Z
verified_by: 
confidence: high (rulings on QE figures and the catalog rules; F choice UNKNOWN - verify, Architect/Design)
refs:
  - ABC-178
  - security-nfr-ABC-178
  - NFR-008
  - N8-LANE
  - 00f77f26
  - a93c1e72
  - d9308e4f
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
  - plans/nfr-catalog.md
  - R-177-1
  - R-178-1
  - ABC-197
  - ABC-199
  - ABC-200
  - ABC-201
  - ADR-0035
  - ADR-0046
  - 20261023T072556Z-security-nfr-observation-d4582dad
  - 20261023T071821Z-qe-e2e-observation-22b92995
  - 20261023T071821Z-qe-e2e-observation-03c392fc
  - 20261023T071821Z-qe-e2e-observation-25efab27
  - 20261023T071842Z-qe-e2e-decision-39e59d96
  - 20261021T072314Z-security-nfr-decision-b4d5793f
  - 20261022T155054Z-qe-e2e-decision-d72f02f0
  - 20261020T150000Z-orchestrator-decision-bfdc97e5
supersedes: 
seal: sha256:238930e17a137cc29623a9cdf2f85cf2e1a6fb2e4f4ddb95d990359de24f5d0b
---

# Security/NFR on `ABC-178` at merge `00f77f26`: **PASS_WITH_RISKS.** `NFR-008` **MET** at 9.010 s, with no flag. `N8-LANE` **MET** at +0.010 s CPU. The floor caveat does not change the state. `R-177-1` **CLOSES**. Published headroom: **0.990 s**

This is a `decision`, not a `finding`: no stamp exists on this install (`human_admission: off`). Evidence: `…d4582dad`. QE: `…22b92995`, `…03c392fc`, `…25efab27`, `…39e59d96`. Nothing was run or timed at this hop.

## 1. `NFR-008` (R-1): **MET, 9.010 s median wall on `00f77f26`**
- **Rule:** `ADR-0035` D1 + A1, on AC (`…bfdc97e5`). The H/H2 twin is admissible (CPU +0.070 s ≤ 0.385 s, p 0.727), R 0.100 s, and the median is ≤ 10 s.
- **Clean reading.** Thermal 0 in 8/8 rounds, 0 foreign polls, AC 36/36, load1 ≤ 8, all four arms, and pre-registered before any poll. It supersedes `ABC-177`'s 9.395 s (four flags) as the latest verdict.
- `main` itself (B, `a93c1e72`, vitest 4.1.12) reads 8.985 s: also under W.
- H is not > 10 s, so `ADR-0035` D6 does not fire and nothing goes to the owner.
- **When it takes effect:** at the merge, **if** `git diff --name-only 00f77f26 <merged main> -- src tools package.json package-lock.json vitest.config.ts tsconfig.json` is empty. That diff is empty at `main` `be4e1f73`. If a lane input lands first, this verdict does not carry to the merged tree.
- **`R-177-1` (LOW, owner Olger Oeselg): CLOSED.** Its closing condition, as written: "the next Security/NFR gate that reads the full lane under its own pre-registration". This is that gate, and the reading is thermal 0. `R-177-2` and `FIX-177-1` are not ruled here.
- **Stack, forward-only:** the live runner is vitest **4.1.12** (`ABC-198`'s lock, read from QE's arms and from `node_modules/vitest/package.json`). The catalog's 2026-10-19 stack line still names 4.1.11. The catalog insertion records this; the old line is kept.

## 2. `N8-LANE` charge for `ABC-178` (B7): **MET**
- H−B CPU +0.010 s [−0.010, +0.020] against 650 ms, R 0.030 s ≤ b, median ≤ b. The state is MET in the grading view (174a) and in the strict view (174).
- That is about 1.5 % of the bound, and it matches the page's "≈ +4 ms, reported, not resolved".

## 3. The floor caveat: **it does not matter for this state, and it does matter going forward**
- **Why it does not matter here.** The F rule is a cut-time rule: "a cut may not set a per-ticket timing bound below F". It keeps a bound out of the instrument's noise. Here, this window's own measured noise (R 0.030 s) is 22× under the bound. The charge's upper interval end is 0.630 s under it. The provisional F (0.654 s) is above the bound by 4 ms (0.6 %), and the state test (R ≤ b, median ≤ b) does not read F. No floor value can turn this reading into NOT MET or UNRESOLVED.
- **Why the provisional F is stale.** By the catalog's own rule, a set's admissible readings replace the 16 % placeholder. This set has two: `ABC-177` A8 (R 0.070 s) and `ABC-178` B7 (R 0.030 s). So F is 0.070 s or 0.030 s, depending on whether the 4.1.11 → 4.1.12 runner bump starts a new series (`UNKNOWN - verify`). Both values are far below 650 ms.
- **Where it bites.** `ABC-197` puts R2 (≈ 150 ms in-thread) into this same set, against the same 650 ms bound. Until F is re-read, a strict cut check prints `650 ms >= F: False` and would refuse that bound at the cut.
- **Accepted risk `R-178-1`, LOW** (a bookkeeping lag, not an ASVS item). The per-set F for `src/uci-session.test.ts` is still the provisional 0.654 s, although two admissible twins exist. **Owner: Architect/Design**, who owns the floor account and re-reads F. **Trigger:** re-read it before `ABC-197`'s timing hop is pre-registered. It does not block `ABC-178`.

## 4. Published headroom (for `ABC-199`, `ABC-200`, `ABC-197`, `ABC-201` and later)
- **To W on H (`00f77f26`): 0.990 s** (10.000 − 9.010), ≈ 9.9 × the H/H2 wall R.
- **To `ADR-0046` D4's 9.2 s on H: 0.190 s.**
- On `main` (B): 1.015 s to W, 0.215 s to 9.2 s.
- It holds under the lane-input condition in § 1. Each later lane-input merge spends it on an estimate until a full-lane reading is taken. The margin is shared, and the merge order (`ABC-178`, then `ABC-199`, then `ABC-200`) spends it first.
- **Moved: nothing.** W, the 650 ms, the 5 %, every F, `N8-SPAWN`, the heap caps, `R-173-1` and `R-173-2` are untouched. F re-reads, including the full-lane pre-cap F, are Architect/Design's.

## 5. Security surface
- The change is test-only: `src/uci-session.test.ts` +9, 0 removed lines. No production byte, no import, no I/O and no secret. No ASVS L1 requirement is in reach. Security is not triggered.
- QE's accepted LOW gaps (`QE-178-a`, `QE-178-f`) are test-coverage gaps, not NFR items. They stay as accepted.

## Result
- **PASS_WITH_RISKS.**
- **Required fixes:** none.
- **Accepted risks:** `R-178-1` (LOW, owner Architect/Design).
- **Closed:** `R-177-1`.
- **Catalog:** one dated insertion in the `NFR-008` row's `Target` cell, on branch `grugops/security-nfr-ABC-178`. No bar moved, and every other row is byte-identical.
- **Recommended column:** `In Security/NFR` → `Ready for UAT`. The UAT waiver applies (0 production lines, `…d72f02f0`). The Orchestrator decides and holds the merge.
