---
id: 20261020T135900Z-architect-design-observation-lane-cost-uci-session-61pct-throughput-bound-534e376f
kind: observation
by: architect-design
task: arch-lane-under-10s
at: 2026-10-20T13:59:00Z
verified_by:
confidence: high (the report's figures as recorded); UNKNOWN - verify (load, power and window of the run; not an admissible reading)
sealed: false
refs:
  - R-174-1
  - NFR-008
  - NFR-010
  - ADR-0035
  - ADR-0040
  - ADR-0008
  - ADR-0046
  - ABC-167
  - ABC-171
  - ABC-173
  - 20261019T202000Z-qe-e2e-observation-abc174-n8-lane-met-nfr008-total-not-met-5d9a0f63
  - 20261019T190000Z-software-engineer-decision-abc173-lightened-rows-and-steps-a7c3d910
  - .grugops/context/arch-lane-under-10s/probe/last-run-8522609d-20261020T134502Z.json
  - .grugops/context/arch-lane-under-10s/probe/rank.out
  - .grugops/context/arch-lane-under-10s/probe/timeline.out
  - .grugops/context/arch-lane-under-10s/probe/uci-blocks.out
  - .grugops/context/arch-lane-under-10s/probe/uci-rows.out
supersedes:
---

# Where `npm test`'s ~10 s goes: `src/uci-session.test.ts` is 60.7 % of test time, and the lane is throughput-bound on its 2 slots

Hand-authored and unsealed: the sanctioned writer (`scripts/context-io.js`) is absent from this repo and from the kit.
This is an `observation`, not a `finding`: it has no gate or human stamp. **Nothing was run or timed at this hop.**

## Source
- `.test-results/last-run.json`, written by the lane at 2026-10-20T13:45:02Z.
  - That falls between `8522609d` (`ABC-174` merge, 16:44:54 +0300) and `ffa1f4ce`.
  - `git diff 8522609d b6f2a48a -- src tools package.json vitest.config.ts` is empty, so the code is main's.
- It was copied to `probe/` before the parallel hop could overwrite it. sha256 `164676cb…11e6`.
- 59 files, 1 987 tests, exit 0.
- **Load, power and window: `UNKNOWN - verify`.** The run is not an admissible reading, so it is used for shape and
  ranking only. Its in-vitest span is 9.78 s, consistent with QE's 10.01 s median (`…5d9a0f63`).
- What a per-file "span" measures: test bodies and hooks (Σ span 10.34 s ≈ Σ test durations 10.32 s). Module-scope
  collect, imports and worker start appear only as gaps between files. Those gaps are an **inference**.
- No per-file CPU exists anywhere on disk. **How the 27.73 s of CPU splits by file is `UNKNOWN - verify`.** QE's TSVs
  hold only per-run totals.

## Ranking (`probe/rank.out`, `probe/timeline.out`)

| rank | where | seconds | how read |
|---:|---|---:|---|
| 1 | `src/uci-session.test.ts` (126 rows) | 6.27 | span; 60.7 % of test time |
| 2 | `src/cli.test.ts` module-scope collect: `CHILDREN`, 28 × `spawnSync`, serial | ~3.87 | the gap before its first row; its rows add 0.26 s |
| 3 | per-file worker overhead × ~57 | ~5.2 | residual, ~0.07–0.16 s between files |
| 4 | `src/engine.test.ts` | 0.79 | span |
| 5 | `tools/grugops/qe-hop-integrity.test.ts` | 0.67 | span; reads 2 981 notes and grows with the board |
| — | the other 54 files | 2.35 | none above 0.21 s |

- **The lane is throughput-bound.** Both slots are busy end to end and finish together at 9.78 s.
  - Slot A runs `uci-session` from 0.15 to 6.42 s.
  - Slot B runs `engine`, then `qe-hop-integrity`, then `cli` collect and rows, ending at 6.15 s.
- **The model:** wall ≈ 0.35 s + Σ slot-seconds ÷ 2, with Σ ≈ 19.5. A slot-second saved is about 0.5 s of wall.
  Reordering files gains nothing.

## Inside `src/uci-session.test.ts` (`probe/uci-blocks.out`, `probe/uci-rows.out`)
- The ABC-167 A7 / A6 / A5 blocks hold 2.14 / 1.77 / 0.94 s, which is 77.5 % of the file.
- **The cost is search, not waiting.**
  - Every row runs on `virtualClock(step)`, so nodes ≈ (budget ÷ step) × 1 024.
  - A level-5 ceiling search, 3 000 ms at step 100, is about 150 ms.
  - `…a7c3d910` counts the A6 until-stop and until-ponderhit rows at 76 863 nodes each. That is 3 dialogues, and
    the first two are exact prefixes of the third.
- The rows sorted by what their assertions read:

| class | what the assertions read | rows | ms |
|---|---|---|---:|
| H | no `time` | A6 stop, A6 ponderhit, e1, e4, e5, j1; A7-i5, i6 | 1 814 |
| H′ | no `time` (determinism) | ABC-171 A7 "two sessions…", step 10 | 385 |
| L | `time ≥ 3 000` only | A7's six dropped-token rows | 889 |
| P | the step is the pin (`G ≤ time ≤ G + 2s`) | A5 all; A6-d1; A7-f1/f2/f3/h1/i2/i3 | ~1 400 |
| C | the step is a precondition | A7 `go depth 3`, A7 `searchmoves` | 501 |
