---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T15:13:51Z
subtask: qe-ABC-283
role: qe-e2e
ref: .grugops/context/qe-ABC-283/
branch: new grugops/qe-ABC-283 from grugops/ABC-283 — worktree .claude/worktrees/qe-ABC-283
width: wrap EVERY test, build or engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. **Game reads ALONE: wrap each whole match (C2′ 100 games; S′ 10 games) in ONE flock so nothing else runs during it**; record uptime and load. Timing reads ALONE with twin arms (ADR-0035 D1). Total game time ≤ 1 h; if your estimate is over, STOP and report before running. Host paths only as placeholders.
---
# Verify ABC-283 (the O1h+O3s+S1 bundle with K3) — one 100-game read; the verdict signs UAT
Read:
- plans/tickets/ABC-283*.md (B1–B5);
- the rulings …4c4cb03d, …3851bf43, …19583086, …6c6fb0be and …c7609f51;
- ADR-0063 (with the K3 dated lines), ADR-0065, ADR-0066 and ADR-0064 d7;
- the se-ABC-283 notes (…d64042c4, …0d3e1e5b) and the se-ABC-283-k3 notes (…0ea55b6c, …d1c74042);
- arch-ABC-283-mate …05ef9fc9.
The qe-ABC-279 done brief is the precedent for the game-read form.
1. Seal a PREREG before any game:
   - C2′: 100 games at 100 ms, bundle vs main's merge-base (rating tool `d` per-change form, `--budget-ms 100 --rounds 50 --concurrency 1`), GAIN ≥ 50.0 / 100. A miss is final: no re-play, no margin, no form change.
   - S′: 10 games at 0.5 s vs Stockfish E1810, information only.
   - The Levels deep lane is a bar.
2. Offline bars, re-read independently:
   - P0 6/6;
   - the mate floor (search and chooseMove d5, 0 lost; the d6 report);
   - zugzwang 7/7;
   - G1, none newly missed;
   - drift ≤ 42 cp (information per …3851bf43, but report it);
   - typecheck, lint and build;
   - skip count 0;
   - R-281-a's four -t lines with their passed counts (a short count blocks);
   - every game-free deep lane.
   Review the three re-pins (the order row; ADR-0066's KRK row from iteration 5 to 6; the d8 information row), all accepted as pins in …c7609f51: confirm each is a pin, not a bar.
3. NFR-008: grade the default lane with interleaved twin arms against main's merge-base (SE read a 9.81 s median). Report against 10 s and against R-N8H-1's 9.5 s trigger. NFR-005 is reported.
4. Verdict: PASS, PASS_WITH_GAPS or FAIL, in a sealed note. Per the owner's delegation, it signs UAT. On a C2′ miss the verdict is FAIL (not shipped).
Fences: tests and your records on your branch; never edit src/ production files. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-283, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.
