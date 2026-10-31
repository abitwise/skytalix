---
id: 20261031T065701Z-software-engineer-observation-e9efa27d
kind: observation
by: software-engineer
at: 2026-10-31T06:57:01Z
verified_by: 
confidence: high: read in git at ca6e675c, 4cd261c1 and 72a65fb7; no engine started
refs:
  - ABC-247
  - EPIC-010
  - ADR-0053
  - tools/rating/rating.ts
  - tools/rating/pair-check.ts
  - grugops/ABC-247
  - 02f4f3d4
  - 4cd261c1
  - orch-2026-10-30a/20261031T065500Z-orchestrator-decision-fb0c8978
  - qe-EPIC-010-m1-batch
  - QE-M1B-a
  - ca6e675c
  - 72a65fb7
  - src/uci-session.ts
  - src/levels.ts
  - src/level-seam.ts
  - src/uci.ts
  - ADR-0052
  - ABC-228
supersedes: 
seal: sha256:c3e2cb764bf8d55cc66c369538224845821022dad38a461b8fdfd049842708d9
---

# SE observation, se-ABC-247: A3 — the skill reaches only the cap and the rate>0 blunder branch, at both SHAs

Read in git, not built. Base `ca6e675c`; head `4cd261c1` (this branch's base; `src/` unchanged by this ticket). The ticket's head `72a65fb7` reads the same line numbers as `4cd261c1` for every line below (`git diff 72a65fb7 4cd261c1 -- src/uci-session.ts src/levels.ts src/level-seam.ts` is empty). Raw: `raw/a3-grep.txt`.

## 1. `skill` in `go()` is read only as `LEVELS[skill]`, for the cap and the blunder branch — MET
| what | base ca6e675c | head 4cd261c1 |
|---|---|---|
| `let skill = DEFAULT_LEVEL` | uci-session.ts:258 | uci-session.ts:349 |
| `go()` starts | :281 | :376 |
| `const level = LEVELS[skill]` (the only skill read for search) | :286 | :382 |
| cap `min(request.budgetMs, level.budgetMs)` | :287 | :384 (under `leveled`, :383) |
| blunder branch `level.blunderRate > 0` | :295 | :392 (`&& leveled`) |
| `info skill level … ignores go …` (inside that branch only) | :298 | :395 |
| `createLevel({ budgetMs, blunderRate })` (inside that branch only) | :301-302 | :398 |
| rate-0 path `chooseMove(position, { budgetMs, now, … })` — no skill | :313-318 | :410-416 |
| setoption writes skill (`Object.hasOwn(LEVELS, value)`) | :342 | :440 |
| `option name Skill Level … default 5 min 1 max 7` | :359 | :462 |
`parseGo` takes no skill (base :284 `parseGo(tokens, blackToMove, info)`; head :379 adds `timeMode`, not skill).

## 2. LEVELS rows — MET
| row | base src/levels.ts | head src/levels.ts |
|---|---|---|
| 5 | :54 `{ budgetMs: 3_000, blunderRate: 0 }` | :59 `{ budgetMs: 4_000, blunderRate: 0 }` |
| 6 | :55 `{ budgetMs: 5_000, blunderRate: 0 }` | :60 `{ budgetMs: 5_000, blunderRate: 0 }` |
So under level 6 a `go movetime 4000` is capped at min(4 000, 5 000) = 4 000 and takes the rate-0 `chooseMove` path at both SHAs — the same call level 5 makes at the head.

## 3. Clock-mode gate at the head — MET
`TIME_MODES` = `["level", "simple-tournament", "uci-clock-mode"]` (uci-session.ts:99); `let timeMode = TIME_MODES[0]` = `level` (:351); `leveled = timeMode === "level"` (:383). `rpair` sends no `TimeMode` option, so the cap applies. The base has no `TimeMode` (the cap is unconditional, :287).

## 4. Nothing else reads `skill` on a `go movetime` path — MET
`git grep -i skill` over non-test `src/` at both SHAs returns only the lines above, the module doc comment (base :9; head :9, :19) and the setoption range message (base :345, head :443). Book (`book.bookMove`, base :291 / head :388), `OwnBook`, the `info depth … nps` line (base :322-324 / head :420-422), the TT and `Hash` take no skill. `src/level-seam.ts` (base :15, head :27 `LEVELS[level]`) is the CLI turn-loop seam, not on the UCI path; `src/uci.ts` calls `createUciSession({ write, now, random, book })` (head :76) with no skill.

**Verdict: A3 MET at both SHAs; route (A) stands. No STOP.**
