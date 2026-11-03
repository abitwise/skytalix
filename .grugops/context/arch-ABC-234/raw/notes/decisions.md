# arch-ABC-234 decisions: `ADR-0065` is written PROPOSED, **premise not met on `main`** (F4: S1m `chooseMove` 0.9864 / 0.9548 > 0.95). A0 is ruled: `ADR-0024` d4 fences Q1 (SEE pruning in quiescence), not O3s. Recommendation: **park `ABC-234`**. The SEE lever on this engine is Q1 (diagnostic +0.88 ply of reach), which is the Orchestrator's to weigh. Lines are owed to `ADR-0056`, `EPIC-011` and the ticket page (listed below; not edited here)

Architect/Design, task `arch-ABC-234`, by PREREG `…9ac61a7a` and the results note of this task.

## 1. Verdict (pre-registered rule)
- Every form passes the safety gate and misses the pay gate. So `ADR-0065` records the design (S1m: losing = `see < −50`, after the killers, ordering only, quiescence unchanged, `orderMoves(…, position)`, a `src/see.ts` module, switch `seeOrdering`, doors `searchWithoutSeeOrdering` / `chooseMoveWithoutSeeOrdering`), its measurement and its falsifiers. Its status is **PROPOSED, premise not met; the build does not start.**
- S1m is named as the design of record because it is the nearest pre-registered form. A re-open re-measures it under its own PREREG.
- **Intent:** the rule gives NEUTRAL (+0.068 < +0.10). But C2′ does not admit NEUTRAL for O3s, which fires at 100 ms (at d6, S1m re-orders 310 945 null-window nodes, against 545 452 full-width nodes in all), so a re-open is **GAIN**. No C2′ read is owed. "Accept ADR-0065" is not put to the owner.

## 2. A0 (the fence)
- **The reading:** `G1` is 54 / 58, and the four misses are mate-in-3 headroom rows. All 24 `do-not-hang` (defended-square capture) rows are solved on `main` and under every form. So d4's re-open condition is **not met** on its own words.
- **The ruling:** d4 fences SEE as quiescence **pruning** (the SEE-lite column; "should have pruned"). Ordering only prunes nothing. So A0 does not decide `ABC-234`; the measured premise does, and it is not met.

## 3. Recommendation: park
- `ABC-234` stays in Backlog. Its DoR goes to 9 / 10: item 2 is answered by the ruling, and item 10 reads "`ADR-0065`: premise not met on `main`" (the `ABC-233` pattern).
- **Re-open premises:**
  1. Q1 built first, carrying `see` and its `A1` fixture, with O3s re-measured over it. The one diagnostic reading over Q1 still misses in `chooseMove` (0.961 / 1.095).
  2. Staged move generation (V3).
  3. A time-per-move instrument, by the owner's ruling.
- **Effort if re-opened:** M, about 1–1.5 Engineer days. That covers `see.ts` (~120 lines), the ≥ 20-row fixture, the `orderKey` tier, the switch and doors in both recursions, re-points and rows. QE's read is about 1 h: C2′ ~25 min, the S′ smoke and Levels deep ~9 min.

## 4. Evidence for the Orchestrator (not a ruling here)
- A diagnostic Q1 reads **+0.884 ply** of reach at 47 000 nodes, and d8 nodes 0.22–0.68×. It holds mate floor 0, zugzwang 7 / 7 and `G1` 54 / 58, with drift max 69 cp (≤ 75).
- On this engine, that is the largest single lever any EPIC-011 probe has read: P1 +0.38, O1h +0.09, O3s +0.07.
- Q1 is fenced by `ADR-0024` d4 and by `EPIC-010` § Out of scope. It needs its own PREREG, an ADR, and d4 opened by evidence or by the owner's word. `ADR-0056` row Q1's "S after O3s" dependency no longer holds: Q1 can carry `see` itself.
- **Suggested:** put "open `ADR-0024` d4 for Q1 (SEE pruning in quiescence)?" to the owner, and consider ranking Q1 ahead of S1 (`ABC-236`) by D6's evidence rule. Both are the Orchestrator's call. This hop does not change the order.

## 5. Lines owed (not edited here; fenced)
- **`ADR-0056`:**
  - (a) Row O3s (D2): "`ABC-234` (fenced, A0)" → "`ABC-234`: `ADR-0065` PROPOSED, premise not met on `main` (2026-11-03; S1m `chooseMove` d8 0.986 / 0.955); A0 ruled: d4 fences Q1, not O3s".
  - (b) The survey row "SEE for ordering | no | — (`ABC-234` Backlog, fenced)" → add "`ADR-0065`: premise not met".
  - (c) The `ABC-234` row in the `EPIC-010` map ("`ADR-0024` d4 re-open evidence (A0), ADR") → "`ADR-0065`: premise not met; parked".
  - (d) Row Q1:
    - size "S after O3s" → "S–M, carrying `see` (`ADR-0065` decision 2)";
    - dependency "O3s; `ADR-0024` d4" → "`ADR-0024` d4";
    - add the diagnostic: "+0.88 ply reach, d8 0.22–0.68× (`arch-ABC-234`, not pre-registered)".
  - (e) A dated line under the 2026-11-02 ranking: O3s parked (`ADR-0065`); Q1 measured as the SEE lever (diagnostic). That line is Architect-owned and goes in at the next ADR-0056 fold.
- **`EPIC-011`:**
  - Phase 3, the `ABC-234` row → "parked: `ADR-0065` premise not met on `main`".
  - The Q1 stub: "needs `ABC-234`" → "carries `see` itself; needs `ADR-0024` d4 opened (evidence or owner's word); diagnostic +0.88 ply".
- **The `ABC-234` page:**
  - A dated block: A0 answered by `ADR-0065` decision 1 (not met as worded; d4 governs Q1); design `ADR-0065` PROPOSED, premise not met.
  - DoR item 2 ⚠ → ✅ (A0 ruled). Item 10 → "`ADR-0065`: premise not met on `main`". DoR 8 / 10 → 9 / 10. It stays in Backlog.
  - **On re-open only:** `A3` is re-pinned to d8, both recursions, four readings; the intent is GAIN; `A1`'s fixture starts from `ADR-0065` decision 8's rows (row 4 = 0).
