---
id: 20261104T182554Z-software-engineer-decision-3e6f1b76
kind: decision
by: software-engineer
at: 2026-11-04T18:25:54Z
verified_by: 
confidence: high: placement read from the diff; lint, typecheck and the scripted body check (raw/a2check.py) confirm it
refs:
  - se-ABC-302
  - ABC-302
  - EPIC-011
  - ADR-0046
  - NFR-008
  - R-N8H-1
  - R-302-a
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - arch-ABC-302/20261104T175227Z-architect-design-decision-23abb6c5
  - src/search.null-move.test.ts
  - src/uci-session.test.ts
  - src/search.futility.test.ts
  - src/zobrist.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/engine.capacity.test.ts
  - ABC-281
  - QE-244-a
supersedes: 
seal: sha256:3e879c7aa17208a96271fce82cd7dffce0737ac0ad9905458a5cd7edf4ddbc20
---

# se-ABC-302 decision: the nine rows built as arch-ABC-302's lines place them (six S, three W), with one deviation from the sketch for R5

Software Engineer, task `se-ABC-302`. Built from the Architect's SE build lines 1–10 (`…bcadd41d`), with `raw/tip.py` as the working sketch.

- **S, remnant in the row's place, full row deep:**
  - R1 (null-move A2): remnant on the in-check root and position-5; full row in a nested `if (RUN_DEEP)` describe, so `IN_CHECK_ROOT` and `deepenTo` stay one copy. One `biome-ignore format` line before the deep `it` (A2 allows it).
  - R2 (uci-session A5): remnant at a 500 ms step (seam and UCI `go`); full row in a describe after `RUN_ENGINE_DEEP`, with its fixtures repeated.
  - R4 (zobrist ep property): remnant at 1 ply with the three non-vacuity asserts; full row in a describe after `RUN_DEEP`'s declaration.
  - R5 (engine ABC-170 A5): remnant on a 10 000 ms counting clock, asserting more than 2 consultations; full row nested.
  - R8 (cli ABC-241 A4): remnant at 500 ms in `src/cli.test.ts` (seam, direct call and hash-list call, plus `depth >= 5`); full row to `src/uci-session.test.ts`'s `ENGINE_DEEP` block, with its fixtures repeated. The cli describe's A7 row stays at 100.
  - R9 (engine.capacity): option (ii). The file gains `const RUN_DEEP = process.env.ENGINE_DEEP === "1"`. The remnant spends the clock after `2 * ITERATIONS` root passes; the full row is in a describe at the end of the file.
- **W, no remnant:** R3 (futility "the rule changes the work") in a nested deep describe; R6 (levels A7) and R7 (levels ABC-174 A3) each move whole under `if (RUN_DEEP)`, titled plus " [deep]".
- **Deviation from the sketch, made to follow build line 3:** the sketch put R5's deep describe at file scope as a sibling, with a second copy of `countingClock`. Build line 3 says R5 nests inside the original describe so that `countingClock` stays one copy. I nested it. The `-t` line still matches and prints "1 passed".
- **A2 cleanup:** R2's original describe no longer uses `STEP_MS`, so the constant and its `ABC-244` comment line moved with the row into the deep describe, as A2 directs. `seamOf` and `scoreWith` stay in the cli describe because A4's twin row and A7 still use them.
- **Formatting:** biome reflowed the R2 and R8 remnants (new code). The moved bodies are byte-identical to base once the nesting indent is removed, for all nine rows and for R7's whole describe (`raw/a2check.py`).
- **No runtime import added.** `scoreWith`'s game is typed `ReturnType<typeof gameOf>`. No src production line, no new test file, no new environment variable, no new lane line.
