---
id: 20261111T074941Z-software-engineer-observation-ca282d42
kind: observation
by: software-engineer
at: 2026-11-11T07:49:41Z
verified_by: 
confidence: high: every gate was run after the last source edit, alone under the host lock
refs:
  - se-ABC-318
  - ABC-318
  - C3
  - C4
  - C5
  - grugops/ABC-318
  - db41eb4c
  - src/levels.test.ts
  - tools/rating/pair-check.ts
  - README.md
  - se-ABC-318/20261111T074937Z-software-engineer-observation-7917f458
  - orch-2026-10-30a/20261111T073837Z-orchestrator-decision-f1dce7dd
supersedes: 
seal: sha256:80bf986a62b1dfb5ea1fdd1036459fe4cd9d2f19c50748fb5bc2549273244991
---

# se-ABC-318 gates on db41eb4c: lint, typecheck, unit 2740/2740, build, pair-check 52/52, L6 deep row 1/1 — each alone under the host lock

Each command ran as `flock <scratch>/host-test.lock <cmd>`, one at a time, after the last source edit.

| Gate | Command | Result |
|---|---|---|
| lint | `npm run lint` | exit 0, 150 files, no fixes |
| typecheck | `npm run typecheck` | exit 0 |
| unit | `VITEST_MAX_WORKERS=1 npm test` | exit 0, 72 files, 2740 / 2740 passed, 0 skipped |
| build | `npm run build` | exit 0 |
| harness | `node --test --test-concurrency=1 tools/rating/pair-check.ts` | exit 0, 52 / 52, 0 skipped (run before and after the commit) |
| levels deep lane, L6 row | `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose -t "level 6:"` | exit 0, 1 passed, 57 skipped by the filter; 30 / 30 moves 10 000–10 002 ms, ceiling 12 000, max depth 15, 300 017 ms; load 1.57 |
| art | `sed -n '2,/^```$/p' README.md \| sed '$d' \| cmp - assets/readme-art.txt` | exit 0 |
| README outside Levels | lines 1–60 and from `## Strength` on, cmp against main | identical |

**rpair argv unchanged:** `rating.ts rpair 902680b7 902680b7 <out> --dry-run` (tool paths set as pair-check sets them) printed 872 lines before the edit and after it; `cmp` exit 0, same sha256. Every one of the 20 blocks keeps `st=4` and `option.Skill Level=6`.

**Not run (UNKNOWN - verify):** the rest of the levels deep lane (A5 at 4 s, L7 at 30 s, the puzzle row and the A3 rows) — with L6 now 5 min and L7 5 min it is over the 10 min bound, and none of those rows reads L6. The UCI session deep lane has no L6 row (its A9 deep row is L7 only) and runs over 10 min.

Not checked: the L6 strength projection itself (no games, per the cut note); rendered Markdown. Stale, pre-existing and left as is: `src/levels.ts` still says "at least 2 s under it" (L5 has 1 s since ABC-228) and "`HARD_CEILING_MS` is the largest of them" (it is 60 000 since ABC-221).
