---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-06T19:32:10Z
subtask: se-ABC-291
role: software-engineer
ref: .grugops/context/se-ABC-291/
branch: new grugops/ABC-291 from main — worktree .claude/worktrees/se-ABC-291
width: ABC-291's scope, to Result. No game, no C2′, no graded timing, no K4 or K5 read, no landing.
---
# Build ABC-291
Read ABC-291's page with its head banner, ADR-0075 (d1 to d12, its dated lines), the probe's reading, and the Orchestrator's notes …69ee96e7 and …40ef8351 (F7 there means ADR-0074's; in ADR-0075 G1 is F3). Base is main with bundle 1 and no delta door.
Do the page's scope on hand values: PAWN_BACKWARD = ISOLATED = 10; PAWN_CONNECTED R2 to R6 = 2, 5, 10, 17, 28; PAWN_PHALANX 1, 2, 5, 8, 14; memo stays 576 KiB, NFR-009 +0. Re-derive K0 (b), K0 (c) and K2 on this base as the page says. Report K3 on this P4 tree: G1 with row 1632 by name (nodes used of its budget), never re-pinned.
Run gates and the page's deep lanes, each read by count: "no tests" is a failure. Report the lane cost in rows against NFR-008. Deep re-points and door joins follow d4 and are named in your Result. Any deep value re-pin or lost fixture goes to the Architect first: STOP. Old-table values are pins, re-pinned old to new and listed; zugzwang, mate floor, G1, identity and relation rows are never re-pinned.
K4 and K5 are the build's reads and need an owner-held host: say what they will need, do not run them. STOP and report, with nothing tuned, on anything the page does not cover, any bar red, or a conflict you would settle by moving a value or a pin. A STOP is a tip marked do-not-merge. Check every output file is non-empty before reading it. /tmp has a 12.36 GB user quota.
Every test, build or engine run goes under the host lock named in your dispatch prompt, one at a time. Leave nothing running; check with ps, not pgrep -f.
Fences: ABC-291's code and tests, your records. No ticket, ADR, EPIC or board edits. No push, force, amend or rebase, and no merge into main.
Publish: sealed notes (task se-ABC-291, contextRoot = the worktree's .grugops/context, `at` from `date -u` run immediately before each note); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result

_by software-engineer (claude-opus-5-5, se-ABC-291), 2026-11-06T20:20:07Z, branch `grugops/ABC-291` from `main` `8e115110`. Nothing tuned, no game, no graded timing, no K4 or K5 read, nothing pushed or merged, nothing left running._

**STOP. THE TIP IS DO-NOT-MERGE.** The build is whole, and two points go to the Architect (`…a8daf408`).

- **STOP 1, a deep value re-pin:** `ABC-282` A0-3, six rows red in `ENGINE_DEEP` `src/uci-session.test.ts`, 264 / 270, all green on the base. The session has no door, so nothing can re-point. Only `cp` moves on five (D8 45 → 74, D7 43 → 88); `go depth 6` is a tree pin (cp 87 → 99, nodes 10 513 → 10 614, nps 618 412 → 624 353). `bestmove` holds. Left red, not re-pinned.
- **STOP 2, K1 (h) against d4:** `evaluateAtPhaseWithoutPawnShape` cannot be "called from test files only" while d4's doors call it. `pawnShapeForTest` holds. The row pins the three off branches and says it is not the letter.
- **Built:** d1 to d4 on d2's values, d5's cut, memo 576 KiB, `NFR-009` +0, the tool line 17 → 20 exports (`…d68ef14e`).
- **K0:** (a) 7 of 7. (b) 70 of 70, 35 doors. (c) re-derived, both sets in `…f0c9e801`; the cut changes no count.
- **K2:** 64 rows here against the probe's 58: re-points 25, door joins 21 (`…cb124720`).
- **K3 on this P4 tree:** mate floor 0 of 163 and 0 of 191; zugzwang 7 / 7; `G1` 54 / 58, no NEWLY-MISSED; **row 1632, 16 838 of 20 534, 82.0 %**, equal to the base, misses at 0.8× as `main` does.
- **Pins moved:** f1e1 441 → 443, f1g1 520 → 522, e4d3 1 070 → 1 075, `futilityNode.length` 7 → 8, exports 17 → 20, `QUIET_RULES`' source row. A2 (b) re-found under `ADR-0028` d2.
- **Deep re-points, figures unchanged:** `ABC-303` depth-8 counts, 2 rows; `ABC-282` A0-1, 6, and A0-2, 4. No deep door join was needed.
- **Gates at the tip:** typecheck, lint, build 0; 2 789 of 2 789; skip count 0. 24 of 25 deep lanes green by count (`…668c63b4`); K7 `TUNE_DEEP` 28 / 28.
- **Lane cost:** +55 rows, no new file, about 25 ms in-thread.
- **Open:** no QE freeze of K1's fixtures is on record, so `SEAM_ROWS` is mine. Drift at d5 reads 96.79 %, largest 89, against the probe's 100 %, 24: a report, no bar. `…a8daf408` counts the planted faults loosely: nine were tried, one survived, a fixture was added, all nine read red now. One test-only commit follows the tool line (`…d68ef14e` item 7).
- **K4, K5, the read:** `…c53fa102`.
