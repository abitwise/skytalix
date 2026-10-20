---
id: 20261020T180000Z-ba-pm-decision-abc177-cut-step-1000-ruled-for-h-and-l-not-h-prime-e7b3c210
kind: decision
by: ba-pm
task: bapm-cut-ABC-177
at: 2026-10-20T18:00:00Z
verified_by:
confidence: high (scope, criteria, the ruling); estimate (every saving); UNKNOWN - verify (whether NFR-008 readings need AC power: owner's, OQ-177-1)
sealed: false
refs:
  - ABC-177
  - ADR-0046
  - NFR-008
  - N8-LANE
  - R-174-1
  - SEC-174-2
  - EPIC-007
  - ABC-167
  - ABC-171
  - 20261020T142000Z-orchestrator-decision-9fc95cac
  - 20261020T140000Z-architect-design-decision-adr0046-proposed-uci-rows-coarser-steps-abc177-58fa35f0
  - 20261018T204242Z-ba-pm-decision-abc167-clock-step-ruling-5c7a1e30
  - plans/tickets/ABC-177-npm-test-back-under-nfr-008s-10-s-adr-0046.md
supersedes:
---

# `ADR-0046` ACCEPTED (status line set); `ABC-177` cut, S / P1 / EPIC-007, DoR 10/10; step 1 000 joins the set for classes H and L, not H′

Hand-authored and unsealed: the sanctioned writer (`scripts/context-io.js`) is absent from this repo and the kit.
No stamp. The ticket page is authoritative and this note indexes it. Records only: no lane, no timing, no commit.

## What was done
- `ADR-0046` § Status: one dated ACCEPTED paragraph added above the proposed text, citing the owner's verbatim
  "accept" (`…9fc95cac`). No other byte of the ADR changed.
- `ABC-177` cut: one file (`src/uci-session.test.ts`), 15 rows in 8 change units U1–U8 (each unit is one call site;
  loops move together). Criteria A1–A12 cover the fold, the steps, 126 rows with identical names, a
  step-literal-only diff, a one-file diff, the frozen-list kill-set parity, the node census, `N8-LANE` ≤ 650 ms CPU on
  the ONE-FILE set, a four-arm full-lane twin with its own `npm ci` per arm in a quiet window with power recorded per
  run, `NFR-008` ≤ 10 s, the ≤ 9.2 s target, and both miss routes (> 9.2 s → O3 under a new ticket; > 10 s → owner).
- Epic `EPIC-007`: every changed row is an `ABC-167` / `ABC-171` row. The epic page is not edited (fence).

## Ruling: the step set {1, 10, 100, 1 000} for `ABC-177`'s H / H′ / L units, under three conditions
1. Kill-set parity picks the step (the `…5c7a1e30` rule plus one decade). Never finer than today.
2. Step 1 000 is admitted only where no search that runs ≥ 2 clock-check intervals at today's step drops below 2 at
   1 000. U1–U7 (3 000 ms capped ceiling: 30 → 3) pass. **U8 (H′, level 1's 100 ms budget: 10 → 1) fails** and keeps
   {10, 100}, the owner-accepted set; this word does not reach it.
3. The mutant list is frozen before any head run.

**Why.** On H and L the bounds cannot see the step: H reads no `time`, and L's `time ≥ 3 000` holds for the correct
build at any step. So parity is the only guard, as at `…5c7a1e30`. What a coarse step loses is search. A one-check
search ends after 1 024 nodes whatever its budget, so the row stops exercising its time-limited loop. A wrong build
outside the named list could pass it unseen, and parity, which counts named mutants only, cannot see that loss.
Condition 2 can. The set closes at 1 000: 10 000 exceeds every governing budget in the file (≤ 3 000 ms; 5 000 ms
ceiling). The cost is the ADR's H′ estimate (0 to −0.35 s in-thread), and U8 can still take 100.

## Owner question (open, not decided here)
- **OQ-177-1:** must `NFR-008` readings be taken on AC power (`SEC-174-2`)? The word "accept" answered `ADR-0046`
  only. It is needed before QE's `A9` twin, not before the build. That is why DoR counts it as a dependency of the
  `A9` hop, not a `Ready` blocker.
