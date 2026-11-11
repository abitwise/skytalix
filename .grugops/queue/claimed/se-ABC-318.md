---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-11T07:38:37Z
subtask: se-ABC-318
role: software-engineer
ref: .grugops/context/se-ABC-318/
branch: new grugops/ABC-318 from main
width: src/ (levels and the tests that pin L6), tools/rating comment if it states a current fact, README.md, CHANGELOG.md, AGENTS.md lines stating L6 time, plus your notes. No ADR, catalog or board.
---
# ABC-318 C3 and C4: level 6 to 10 s, the docs, and the README gaps
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261111T073837Z-orchestrator-decision-f1dce7dd.md`, of which C3, C4 and C5 are yours. Read `memory-bank/60-progress.md` § Next action (2026-11-11) and QE's gap list …6298d7f0 in `.grugops/context/qe-ABC-317/notes/`.
1. **Code:** `src/levels.ts` L6 `budgetMs` becomes 10 000. Then grep src/ (`5_000`, `5000`, `7_000`, `7000`, "level 6") and update every test and snapshot that pins L6's budget or ceiling. Weaken nothing, and leave every other level unchanged. If a snapshot changes, list each changed .snap hunk in your Result.
2. **The `rating.ts` header:** fix the ABC-247 paragraph's statement of L6's 5 000 ms only as text, noting that `rpair` still searches 4 000 ms. Its argv must stay unchanged; prove that with pair-check.
3. **README Levels:**
   - L6 time 10 s; L6 strength `~2310–2410, projected`;
   - L7 `~2380–2540, projected`;
   - state the blunder cost (about 10–14 Elo per percentage point) behind "2144 to 2164";
   - reword the per-doubling comparison as "about +73 to +79 per doubling between the Strength section's 1902.5 at 0.1 s and level 4 at 1 s";
   - any UCI line stating L6's time matches. The rest of the README is unchanged and the art cmp passes.
4. **CHANGELOG:** under Unreleased, add a `### Changed` line for level 6 (10 s a move, was 5 s) and update the README line.
5. **AGENTS.md:** lines that state L6's time or ceiling, if any.
6. **Gates:** lint, typecheck, `VITEST_MAX_WORKERS=1 npm test`, build, `node --test --test-concurrency=1 tools/rating/pair-check.ts`, and any deep lane AGENTS.md lists for levels or the UCI ceiling (name it, and run it if it is opt-in and under 10 min; else record UNKNOWN - verify).
Every test or build runs as `flock <scratch>/host-test.lock <cmd>` (the real path is in your dispatch prompt only), one at a time, with one vitest worker. Never kill foreign processes. Publish sealed typed notes (`at` from `date -u` run just before each). Add a `## Result` block to this brief. Run `node tools/grugops/records-path-check.js --base main` before committing. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
