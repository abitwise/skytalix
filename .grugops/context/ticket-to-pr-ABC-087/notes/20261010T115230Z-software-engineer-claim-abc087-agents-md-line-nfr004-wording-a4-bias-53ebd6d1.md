---
id: 20261010T115230Z-software-engineer-claim-abc087-agents-md-line-nfr004-wording-a4-bias-53ebd6d1
kind: claim
by: software-engineer
at: 2026-10-10T11:52:30Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-087
  - ABC-085
  - ADR-0032
  - ADR-0035
  - NFR-004
  - N8-LANE
  - AGENTS.md
  - plans/nfr-catalog.md
  - src/levels.ts
  - src/levels.test.ts
  - 20261010T115230Z-software-engineer-observation-abc087-gates-a1-a10-readings-n8-lane-not-met-25962b19
  - 20261010T112902Z-software-engineer-decision-abc087-levels-module-shape-table-values-two-corpora-4e5f0323
supersedes:
---

# `ABC-087` owed elsewhere: an `AGENTS.md` lane line (Scribe), `NFR-004`'s level-layer wording (Security/NFR), `N8-LANE` NOT MET (routing), the `A4` frequency bias (BA/PM / Architect/Design), and the `ABC-085` 3/4/5 risk

These are drafts and routing only. None of them is written into a fenced file. The readings behind
them are in observation `…25962b19`.

## 1. `AGENTS.md` — one lane line (the Scribe's; `ABC-109` byte budget applies)

I suggest placing it after the `Engine deep lane` bullet:

```
- Levels deep lane (ABC-087, `src/levels.test.ts`): `ENGINE_DEEP=1 npx vitest run src/levels.test.ts`
  <!-- RUN 2026-10-10: exit 0, 25 passed (20 default), 199 s at load1 5.8 -> 4.0; A5 is 135 s of it
  (30 real moves at 4.5 s). A4 on perft + puzzles, A2 on a virtual clock, A3 (35 vs 58 of 62). Run
  after any src/levels.ts, src/engine.ts or src/virtual-clock.ts change. -->
```

That is about 330 B. `AGENTS.md` is not edited here.

## 2. `NFR-004` — catalog wording for the level layer (Security/NFR's, `ADR-0032` § Consequences)

The draft sentence to append to the row's target or its verification cell:

> "The 5 s ceiling binds **per move played**, not per engine call. A level that runs several
> `chooseMove` calls for one move (`ABC-087`'s blunder path: one per legal root move) clamps its own
> total to `HARD_CEILING_MS` under one shared deadline. The engine's per-call clamp alone does not
> bound a sum. Verified by `ABC-087` `A2` (the blunder path's total on a virtual clock: 101.3 / 100)
> and `A5` (the hardest level, 30/30 ≤ 5 s on the real clock, max 4,527 ms)."

This hop measured that the hardest level's rate is 0. A blunder on a level near the ceiling is
therefore not exercised on the real clock. If a future table gives the hardest level a rate above 0,
`A5`'s blunder clause activates. The clamp and the 4,500 ms budget are what it would rest on.

## 3. `N8-LANE` — NOT MET, +0.825 s CPU against 650 ms. Routing: Security/NFR reads it at the gate, BA/PM owns the cut

- The reading is admissible and resolves `b`. Its lower end, 0.78 s, is above the bar. The criteria
  the ticket places in the default lane (`A1`, `A4`, `A7`, `A8`, and `A9`/`A10` "measured against the
  bar") cost about 170 blunder moves. Each blunder is N `chooseMove` calls by `ADR-0032`'s
  construction. The page's "A4 … fast and machine-independent" predates the ruled construction.
- **The options, for the owner of the cut. The Engineer did not take any of them:**
  - (a) Move the default-lane `A4` run to `ENGINE_DEEP=1`, where `A4` already runs on the stronger
    corpus. Measured +0.54 s (0.47-0.57), **but on an inadmissible twin (−1.92 %)**. `UNKNOWN - verify`;
    it likely lands under 650 ms.
  - (b) Lower `A4`'s default-lane count, which is a criterion change.
  - (c) Accept the overrun as recorded, as with `NFR-008`'s standing breach under `ADR-0035` d5.
- Lowering the level table's easiest rate or swapping the construction to cut cost is **not** an
  option. That would be tuning the mechanism to the meter.

## 4. `A4`'s folded frequency is biased low when no-candidate positions are common (BA/PM, Architect/Design)

- **The definition.** It reads "blunders played ÷ moves, no-candidate moves left out of the
  denominator". The construction only learns that a position has no candidate when the draw has
  ALREADY called for a blunder. So only *drawn* no-candidate moves leave the denominator. Undrawn moves
  in no-candidate positions stay in it.
- **The consequence.** With rate p and a no-candidate share q, the expected reading is
  **p(1 − q) / (1 − pq)**, not p.
- **Measured** at p = 0.40:

  | corpus | q | reading |
  |---|---:|---:|
  | blocked-pawn and lone-knight endgames | 1.00 | — |
  | four pawn endings, two plies | ~0.4 | **25.8 %** (expected 28.6 %) |
  | the first-draft `ENDGAMES` | ~0.13 | **36.2 %** |
  | shipped `ENDGAMES` | ~0.02 | **39.4 %** |
  | perft + puzzles | 0 | **39.4 %** |

- **The ruling and the shipped readings are unaffected.** On the positions a game reaches, q ≈ 0
  (`ADR-0032` measured 1/184 and 0/40). Both shipped readings are 39.4 %.
- **`ABC-085` and any endgame-heavy corpus will read low.** Unbiased alternatives are not mine to pick:
  - "draws fired ÷ moves" measures the draw, not the play;
  - "blunders ÷ moves whose position has a candidate" needs every position scored.

  `UNKNOWN - verify` whether this matters to anyone. It is raised so it is not rediscovered.

## 5. `ABC-085` `A2` risk (adjacent levels > 50 %), restated from the decision note

Levels 3 → 4 → 5 differ only in budget: 3 → 4 → 4.5 s, well under a ply, and none of them blunders.
`ABC-085` `A2` may fail on 3/4 and 4/5. If it does, that is `ABC-087`'s finding to route: re-cut the
table, or reopen `n` as a level datum (`ADR-0032` Alternatives). It is not a number to tune here.
