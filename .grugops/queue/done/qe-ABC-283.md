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

## Result

**2026-11-04, QE/E2E. Verdict PASS_WITH_GAPS, with no blocking gap. Every ABC-283 bar (B1–B4) is MET on `ab0a37b6` (`src/` `d051784f`), so this verdict signs UAT (owner delegation) and B5's pass branch applies. The PREREG (`…f774e6d9`) was sealed and committed at `840a343d` before any game or QE run. C2′ and S′ were each played once. Nothing was pushed or merged, and nothing is left running.**

- **B4, the one read (note `…2a7a5be0`):**
  - **C2′:** `rating.ts d ab0a37b6 09694a4e --budget-ms 100 --rounds 50 --concurrency 1`, the whole match in one lock. 100 / 100 complete, **W/L/D 59 / 27 / 14 = 66.0 ≥ 50.0, MET**. Elo +115.2 ± 67.0, 0 faults, 0 losses on time, max latency 105 ms.
  - **S′ at E 1 810 (information):** 10 / 10 complete, 6 / 4 / 0 = 6.0, rating 1 880.4 ± 268.9, 0 faults.
  - **Levels deep lane (a bar):** exit 0, **58 / 58**.
  - Game time was 27 min.
- **Offline, re-read with QE's own driver on out-of-tree arms (note `…3f370426`):**
  - **P0:** 6 / 6 byte-equal against base, which QE computed fresh.
  - **Mate floor:** `search()` d5 0 / 190 and `chooseMove` d5 0 / 188, against the all-off doors AND against base `main`. The older rows read 0. The d6 report is 2 / 209.
  - **Break probe:** a fresh KRK/KQK corpus reads d5 0 / 16 and 0 / 16, and d6 1 / 30.
  - **Zugzwang** 7 / 7. **G1** 54 / 58, none newly missed.
  - **Drift** max 28 / 27 cp (information).
  - **R-281-a:** 4 / 1 / 1 / 1.
  - **Lanes and gates:** 27 deep lanes plus Levels, every one exit 0. `npm test` 2 665 / 2 665. Typecheck, lint and build 0. Skip count 0.
  - **The three re-pins** are pins, not bars.
- **NFR (note `…d15c2a10`):**
  - **NFR-008, graded with twin arms, ALONE (n = 8, admissible):** H median **9.60 s** [9.52, 9.71] ≤ 10 s, MET. Against R-N8H-1's 9.5 s trigger it **fires**, so R-N8H-1 returns to MEDIUM. Q-N8H-1's 9.6 s trigger fires too. Base is 9.45 s.
  - **NFR-005 / G6:** medians 9 / 9 and 12 / 12, with no run below depth 9.
- **Gaps (note `…f8f8c2cc`):** 0 blocking, 0 high.
  - Medium: QE-283-a, NFR-008 headroom 0.40 s. R-N8H-1 returns to MEDIUM, and a Security/NFR hop follows the merge.
  - Low: QE-283-b, R-283-LMR carried (Architect). QE-283-c, no committed row has a mate found at iteration 5 exactly.
  - Information: QE-283-d, QE's driver formatter fix (zugzwang and G1 re-read, engine output identical); e, the harness tree; f, G6 nps 0.95–0.98×; g, the ticket page is on `main` only, with stale front matter; h, the Engineer's 9.81 s did not reproduce.
- **Verdict:** `…de1dc511`.
- **Owed by the Orchestrator:**
  - the UAT `decision` naming `…de1dc511`;
  - the merge on green (`main`'s `src/` is still `4fb3da04`, so no re-base is owed);
  - the bundle acceptance of `ADR-0063`, `ADR-0065` and `ADR-0066` (B5; the Architect writes the status lines);
  - the Security/NFR hop for R-N8H-1;
  - the ticket front matter (QE-283-g);
  - unholding `ABC-282` and `ABC-288`.
