---
id: 20261030T152301Z-architect-design-observation-f3b8d750
kind: observation
by: architect-design
at: 2026-10-30T15:23:01Z
verified_by: 
confidence: high for the read facts (line refs at ee7da249); UNKNOWN - verify for the probe entries 1-4 after the change and for the parent-root count's effect
refs:
  - arch-ABC-242-reading
  - ABC-242
  - EPIC-010
  - ADR-0054
  - ADR-0032
  - ADR-0020
  - QE-230-a
  - qe-ABC-230/20261030T064100Z-qe-e2e-decision-ba5a249a
  - ABC-230
  - ABC-241
  - 1f6abec4
  - ee7da249
  - NFR-004
  - NFR-009
  - src/levels.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:d28bfadc589cf959460b616b34eb9f100d6f9d38c7994bc4ea9950720c412625
---

# Architect/Design observation, arch-ABC-242-reading: facts read at `main` `ee7da249` for the ABC-242 design

Every fact here was read from the source or from recorded notes. Nothing was run.

- **The gap is real and by design.** `src/levels.ts:143-146` hands each child `[...priorKeys, repetitionKey(root)]`.
  `src/engine.ts:330-342` `repeatsBeforeRoot` is reached from `negamax` at ply ≥ 1 only (`:366-372`), so a child
  root is never scanned. QE's probe (`qe-ABC-230/raw/spot/blunder-probe.txt`) gives the identical list with and
  without keys: `[d8e8 −1013, d8c8 −1030, d8d7 −1020, d8e7 −1010, d8c7 −1031]`, with `d8e8` played.
- **The equivalence the check rests on.** At ply 1 the engine's walk starts at `min(1−4, 1−2) = −3` in the root's
  list. At ply 0 it starts at `min(−4, −2) = −4` in the child's list, which is the root's list plus one key: the same
  position. The lower bounds are `−min(c, min(L,100)+1)` and `−min(c, min(L+1,100))`. They are equal unless
  `L ≥ 100`.
- **The pins the design avoids:**
  - the engine export pin (`src/engine.test.ts:504`, the `ABC-078` `A4` list, 10 names);
  - the level import pin (`src/levels.test.ts` § A8: `zobristKey` and `repetitionKey` are already imported);
  - `ADR-0032` d1's "`src/engine.ts` and `src/search.ts` do not change".
- **The existing level rows stay green.** The `ABC-230` and `ABC-241` rows in `src/levels.test.ts` hand in synthetic
  keys (`11n 12n 13n`, `21n 22n`) that never match a real child key. So every child is still searched, and their
  `engineCalls` length equals `legalMoves`. No existing row pins the old blunder score of a third occurrence. The
  `ABC-230` rows in `src/cli.test.ts` and `src/uci-session.test.ts` run at the default level.
- **The smoke reading.** `tools/rating/rating.ts:377-387` passes no `option.*` to skytalix, so every D, R and batch
  move runs at level 5 (rate 0), on the engine path.
- **The ladder lane.** `src/ladder.test.ts:179` calls `choose(h.position)` with no prior keys, so the check never
  fires there. `ABC-242` `A8`'s claim that the ladder lane is the one playing check on the changed levels is not
  accurate.
- **UCI.** `src/uci-session.ts:318-333` builds a fresh level per `go` with the session's `priorKeys` and writes only
  `info depth … nodes … time … pv`, not the scored list. `A4` is therefore read through determinism (move, nodes and
  depth against a direct `createLevel` call).
- **`UNKNOWN - verify`:**
  - the probe's entries 1–4 after the change (they inherit `d8e8`'s slice);
  - the parent-root count's effect on any score;
  - the check's time on this host (`G5` reads it, and it is at most 49 comparisons and one key per root move).
