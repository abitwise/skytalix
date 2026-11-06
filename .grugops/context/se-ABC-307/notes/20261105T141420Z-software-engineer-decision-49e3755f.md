---
id: 20261105T141420Z-software-engineer-decision-49e3755f
kind: decision
by: software-engineer
at: 2026-11-05T14:14:20Z
verified_by: 
confidence: high: the diff against the regenerated sketch, as run
refs:
  - se-ABC-307
  - ABC-307
  - EPIC-011
  - ABC-154
  - AR-154-TWO-POINT-CONTROL
  - ADR-0046
  - NFR-008
  - T-QEHOP-GROWTH
  - R-307-a
  - R-307-b
  - R-307-c
  - arch-ABC-307-reads/20261105T134134Z-architect-design-decision-727e0d0c
  - arch-ABC-307/20261105T125815Z-architect-design-decision-838ecf31
  - orch-2026-10-30a/20261105T134300Z-orchestrator-decision-db111535
  - orch-2026-10-30a/20261105T135350Z-orchestrator-decision-ad217a34
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/book.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - grugops/ABC-307
  - e01d39b1
  - 77e05d52
  - 47556083
supersedes: 
seal: sha256:0fdf58a7092fbce60773356b314e7862991f775c56947a185afb8b7a62efaeee
---

# se-ABC-307 decision: the build is `raw/tip.py` with `B1_K=7`, plus `F1` and four small edits; no remnant varied, no STOP

Software Engineer, task `se-ABC-307`, on `grugops/ABC-307` from `main` `e01d39b1`. The four test files had not moved since `8d66a706`, so the Architect's sketch applied clean and all his anchors held.

## What was built
- **Nine rows, all form S,** by running `arch-ABC-307-reads`' `raw/tip.py` on the four files: Q1, Q2, Q3 and B1 by option (ii) under `const RUN_DEEP`; L1, L2, L3, C1 and C2 in `src/uci-session.test.ts`'s `ENGINE_DEEP`, after R8's block.
- **`F1`** in `tools/grugops/qe-hop-integrity.test.ts`, under `if (RUN_DEEP)`, in a describe of its own titled "AR-154-TWO-POINT-CONTROL F1 — the whole-tree read drops no note [deep, ENGINE_DEEP=1]". It compares `allNotes().length` with a listing count by `readdirSync` and `lstatSync`, and it opens no note. The trio's `-t` lines do not match it.

## Where the tip differs from the sketch, and why
Measured by regenerating the sketch and diffing it against the tip. `src/cli.test.ts` and `src/book.test.ts` show 0 lines of difference.
1. **Two `biome-ignore format` lines,** on L1's and Q3's deep `it`. At the deeper indent Biome rewraps one line of each, which would break A2. This is `ABC-281`'s and `ABC-302`'s precedent. Each cites only `ABC-307`.
2. **Q1's remnant:** its `expect(trap.some(…))` is rewrapped by the formatter. Whitespace only.
3. **`NAMED`'s doc comment** now cites `ADR-0046`. The sketch's cited four ticket ids, which A2's comment rule does not allow.
4. **`F1`, and its two `node:fs` bindings,** under the ruling's A2 exception (`…db111535` 2; `…ad217a34` 1).

No remnant's logic changed, so build line 8's re-read on a mutant does not apply. The trio's plants were read on the tip anyway, in the observation.

## Not done, by the brief
No graded timing, no `A7` freeze and no `src` or `data` mutant: those are QE's. The skip probe did not run: the page does not call for it here, as A6 is the Architect's line, read at Ready. No production `src`, ticket, ADR, EPIC or board edit.
