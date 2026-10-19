---
id: 20261019T131900Z-security-nfr-observation-abc171-nfr004-level5-4500-02bc3a0c
kind: observation
by: security-nfr
task: secnfr-ABC-171
at: 2026-10-19T13:19:00Z
verified_by:
confidence: high
refs:
  - ABC-171
  - ABC-174
  - NFR-004
  - AR-NFR004-A
  - ADR-0044
  - ADR-0045
  - ABC-087
  - ABC-101
  - 20261019T085600Z-security-nfr-observation-abc167-nfr004-no-budget-above-3000-37084be2
  - 20261019T113000Z-qe-e2e-observation-abc171-criteria-gates-nfr004-5b2e9d17
  - plans/nfr-catalog.md
supersedes:
---

# ABC-171 `NFR-004` at `5dee231c`: MET on reading. Level 5 lets 4 500 ms leave the session, under the clamp

Hand-authored and unsealed. I measured nothing, on either clock. This ruling rests on the code and on QE's
virtual-clock probe P1, which is the readings already in the catalog.

## What changed since ABC-167
- At ABC-167 the cap was `LEVELS[DEFAULT_LEVEL]`, so no budget above 3 000 ms left the session.
- At this tip the budget is `Math.min(request.budgetMs, LEVELS[skill].budgetMs)` (`src/uci-session.ts:280-281`).
  - So **`Skill Level 5` lets a 4 500 ms budget leave the session**, and level 4 lets 4 000.
  - QE's maximum over 25 unbounded `go`s is **4 600 virtual ms**, the budget plus one step.
- **Unchanged in the pair:** `chooseMove`'s clamp at `HARD_CEILING_MS` 5 000 (`src/engine.ts`) and `createLevel`'s
  blunder clamp (`src/levels.ts:123`).
- The degenerate edges are as ABC-167 ruled. `Infinity` is capped by `min`. A `NaN` budget reaches the engine as depth
  1, not above 5 000. A negative budget is depth 1.

## Clause A (≤ 3 s at the default): holds. `AR-NFR004-A` stands as written
- The UCI default is `DEFAULT_LEVEL` 3 = `{ 3 000, 0 }` = `DEFAULT_BUDGET_MS`.
- At rate 0 the session calls `chooseMove` with budget 3 000, the call ABC-167 makes, and the call `createLevel` makes
  at rate 0.
- **Same call, so same number:** +12 ms max, 24/30 over, ≤ 31 ms bound. The owner is Security/NFR, and the discharge
  and scope are unchanged. Nothing new reaches clause A.

## Clause B (5 s at any difficulty): holds
- The highest budget the session hands down rises from 3 000 to **4 500**. That is still under 5 000, and the engine
  clamps above it in any case.
- **Levels 4 and 5 were already reachable by a player** through `level-seam.ts` (catalog `:1364`, the ABC-101
  re-read).
- **The real-clock readings on record are for the same call** (`chooseMove`, rate 0, budget 4 500): 30/30 ≤ 5 s, max
  4 526–4 590, plus the +90 ms first-call reading (ABC-087 `A5`). A UCI `go` at level 5 is now one more way to make
  that call. **No new mechanism reaches the ceiling.**
- No level's budget reaches `HARD_CEILING_MS`, so the ~3 ms ceiling residual that `AR-NFR004-A` covers stays out of
  every player's reach.
- **I took no real-clock UCI `go` reading at level 5, and none is required:** the call is identical to the one on
  record. **The `NFR-004` `Verified by` cell does not move.**
- **Catalog `:1364` still holds as written** between ABC-171's merge and ABC-174's. A UCI GUI user is a player, and
  levels 4 and 5 are now reachable from a GUI too. Nothing is owed to the catalog for ABC-171.

## What changes at ABC-174 (ADR-0045, accepted)
**The changes:**
- `DEFAULT_LEVEL` moves 3 → 5. `LEVELS[5]` becomes `{ 3 000, 0 }`, level 4 `{ 1 000, 0.05 }` and level 3
  `{ 330, 0.1 }`.
- The highest budget any level hands down falls 4 500 → **3 000**, and the session's maximum returns to ABC-167's 3 000.
- **Clause A** is the same `chooseMove` call at 3 000, reached as `LEVELS[5]` instead of `LEVELS[3]`. So
  `AR-NFR004-A` keeps its number.
- **Clause B:** ABC-087 `A5`, the hardest level, now reads at 3 000. The 4 500 ms readings and the +90 ms first call
  at 4 500 become reachable by no level.
- **Levels 3 and 4 move onto `createLevel`,** the blunder path:
  - D11 ignores `depth`, `nodes` and `mate` at 1–4;
  - the blunder total is clamped at `HARD_CEILING_MS`;
  - `THE LEVEL LAYER`'s re-read rule applies to them.
- The session's option line must read `default 5` from `DEFAULT_LEVEL`.

**The two catalog lines ADR-0045 routed to this role.** They were routed to "ABC-173's gate" in ADR-0045 §
Consequences, which ADR-0045's id-correction line reads as ABC-174.
1. **`AR-NFR004-A`'s "level 3 = `DEFAULT_BUDGET_MS`".** The wording sits at `plans/nfr-catalog.md:10` (the header),
   `:1340` (`LEVELS[3]` = `DEFAULT_BUDGET_MS`, in the transcribed block) and `:1362` (`LEVELS[3]`).
2. **`:1364`'s "Levels 4 and 5 (4 000 / 4 500 ms) are now reachable by a player".**

**The edit ABC-174's gate owes.** The catalog style is a new dated block, and transcribed blocks are not rewritten.
That block should be headed "`AR-NFR004-A` RE-READ AT `ABC-174`" and placed after `:1364`. It should say:
- **(i)** clause A's default is now `LEVELS[5]` = `{ 3 000, 0 }` = `DEFAULT_BUDGET_MS`. It is the same call, so the
  same number, re-accepted with it. From ABC-174's merge, `:1340`/`:1362`'s `LEVELS[3]` read as `LEVELS[5]`;
- **(ii)** `:1364` is superseded:
  - levels 4 and 5 are `1 000 / 0.05` and `3 000 / 0`, and no level's budget exceeds 3 000;
  - the hardest level of ABC-087 `A5` reads at 3 000 ms;
  - the 4 500 ms and +90 ms first-call readings are reachable by no level;
  - the ceiling residual is still unreachable;
- **(iii)** levels 3 and 4 now blunder, so `THE LEVEL LAYER`'s re-read rule applies to them;
- **(iv)** **this gate measured nothing**, unless ABC-174's gate does. The `Verified by` cell does not move.

**Owed by ABC-174's gate. It is not done here, and the catalog is not edited.**
