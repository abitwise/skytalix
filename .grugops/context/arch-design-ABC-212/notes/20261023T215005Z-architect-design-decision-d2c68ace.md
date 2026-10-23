---
id: 20261023T215005Z-architect-design-decision-d2c68ace
kind: decision
by: architect-design
at: 2026-10-23T21:50:05Z
verified_by: 
confidence: high on the rulings; level-7 depth gain, NFR-009 at 30 s and GUI behaviour beyond cutechess are UNKNOWN - verify
refs:
  - ABC-212
  - EPIC-004
  - EPIC-008
  - ABC-204
  - ABC-087
  - ABC-085
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - AR-NFR004-A
  - ADR-0045
  - ADR-0044
  - ADR-0038
  - ADR-0027
  - ADR-0025
  - 5717edec
  - owner-word-2026-10-23/20261023T215000Z-orchestrator-decision-2c6fa3b1
  - bapm-cut-levels-6-7/20261023T213402Z-ba-pm-decision-44bee405
  - bapm-cut-levels-6-7/20261023T213354Z-ba-pm-observation-78d4532b
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
  - memory-bank/50-decisions/ADR-0045-the-levels-are-re-cut-to-one-ply-and-a-halved-blunder-rate-per-step-and-the-default-moves-to-level-5-where-it-plays-as-today.md
supersedes: 
seal: sha256:c91d9798fefa64568380b5944d3d256c9e9c786b33fa496760663f0f473f9d0b
---

# ABC-212 design ruled; ADR-0045 amendment written to the owner's accepted points with no departure (STOP not fired, no new ADR)

Architect/Design, task `arch-design-ABC-212`, at `main` `5717edec`. The inputs were the owner's `…2c6fa3b1`, BA/PM's
`…44bee405` and `…78d4532b`, and this task's observation note. The texts are on the branch:
- `ADR-0045` § AMENDMENT 2026-10-24;
- the `ABC-212` page § Design ruling (2026-10-24).

## Rulings
1. **The `ADR-0045` amendment: accepted on the listed points (`…2c6fa3b1`), with no departure.**
   - A1: D1 gains 6 = 5 000/0 and 7 = 30 000/0. "More than time alone" is retired for 5v6 and 6v7.
   - A2: `HARDEST_LEVEL` 7 and default 5. "Default = hardest" is retired.
   - A3: the mechanism is unchanged, and `src/engine.ts` changes at the clamp's value only.
   - A4: `max 7`, rate 0 at 5–7, bare `go` = the level's budget, and the `ADR-0044` folds are named.
   - A5: the ladder is unchanged.
   - Consequences and Rollback are as listed.
2. **Clamp shape: (i).** One absolute clamp, `HARD_CEILING_MS` 5 000 → 32 000. Each level's `NFR-004` ceiling is held
   by its budget, with a margin of at least 2 000 ms (`A5` data row). `ceiling(L)` is a test-local table.
   - (ii) is rejected. It needs a third `Level` field (`ADR-0045` D3, `ABC-174` `A4`, `ADR-0038` d1) or an
     `EngineOptions` field (`ADR-0027` d3), and either one departs from the points.
   - Stated: clause B's "whatever a caller passes" now bounds a raw `chooseMove` call at 32 s. Every surface passes a
     level-derived budget.
3. **UCI bare `go`:** no code change at `src/uci-session.ts:211`. `G = HARD_CEILING_MS` capped by the level gives the
   level's budget at every level (probe). `max` is read from `HARDEST_LEVEL`, and the info text reads
   `EASIEST_LEVEL`–`HARDEST_LEVEL`.
4. **OQ-212-3 / `ADR-0044` D5:**
   - the latency is accepted at 6–7, up to ceiling(L);
   - the worker is not owed first, and the split is not taken. `A9` stays in `ABC-212`.
   - The worker is built on pondering, or when a GUI the owner uses is shown to stall at 6–7.
   - Cutechess: its 15 s `IdleTimeout` after a mid-search `stop` fits level 6 but not level 7. Such a `stop` comes
     only at a game end.
5. **Pins (`A13`):** the list stands, made exact:
   - `RF-1` `STEP_MS` → `HARD_CEILING_MS / 2`;
   - `:639` → 5 000;
   - `HANG_GUARD_MS` → 20 000.
   Four are added:
   - R1 `:405`–`:413` refixed to `2 * H` and step `H / 20`;
   - `levels.test.ts:601` → `ceiling(id)`;
   - `cli.real-engine.test.ts:408` → 5 000;
   - the comments with them.
   `ladder.test.ts` and `search.ts` are not edited.
6. **Interactions 1–11 ruled, and 12 is new** (the four unlisted ceiling readers). See the page's table.
7. **`NFR-004` text for Security/NFR to place** (OD-212-1 (a), verbatim): *"Engine returns a move in ≤ 3 s at default
   difficulty (level 5); hard ceiling per level: 5 s at levels 1–5, 7 s at level 6, 32 s at level 7 (a level above 5
   gets its budget + 2 s)."*
   - The dated line: amended 2026-10-24 on the owner's word `…e44d2903`, accepted `…2c6fa3b1`; levels 1–5 unchanged.
   - The mechanism line: one clamp, `HARD_CEILING_MS` 32 000, with each level's ceiling held by its budget; the
     "budget reaches `HARD_CEILING_MS`" bullet is retired.

## Next move
- The Orchestrator merges the records and reports the amendment to the owner (veto open).
- Then `In Design` → `Ready for Dev`, and the SE pulls.
- Then QE: `A4` in `ENGINE_DEEP` at width 1, never beside an `EPIC-008` reading.
- Then Security/NFR at the gate: the `NFR-004` catalog, `NFR-009` at 30 s, and `N8-LANE`.
- BA/PM at the merge: the `ADR-0044` fold lines and the `ABC-204` erratum.

## Not touched
`src/`, the tests, `plans/nfr-catalog.md`, the board, the trace, `ADR-0044`, and `ABC-205`/`ADR-0031`.
