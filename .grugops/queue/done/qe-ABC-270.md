---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T00:10:50Z
subtask: qe-ABC-270
role: qe-e2e
ref: .grugops/context/qe-ABC-270/
branch: grugops/ABC-270 (frozen code 795a6b61, src tree 0f393c18; tip f930e1ee) — worktree .claude/worktrees/se-ABC-270
width: wrap EVERY test/build/engine run, every vitest too, in `flock <scratch>/host-test.lock <cmd>`. One core. **K3 (G2) and K4 (G6) timing ALONE**: each timing session in one flock; record uptime/load and top CPU users at start and end; QE's own G6 harness with its 60 °C cool-down unchanged (if the host never cools, stop and report — do not relax it). qe-ABC-279 is running games; wait for the lock. Never touch foreign processes (e.g. abtop). No games. Host paths only as placeholders.
---
# QE ABC-270 (E3a structure only, ADR-0068 ACCEPTED) — value- and node-identical
Read plans/tickets/ABC-270*.md (K0–K4), ADR-0068, your own frozen rows (qe-ABC-270-freeze …fa82b3f3, pairs.json sha256 68769ea9…), se-ABC-270 notes (…007dc90a, …15cac083, …bd09c051, …77fd2bd9).
- Seal a PREREG before any timing (K3 G2 ≤ 1.05×, two sessions, ABC-274's form; K4 G6 ≥ base by the median, every run depth ≥ 6).
- Re-grade K0 (out-of-tree cross-build node identity), K1 (a)–(e) incl. K1 (c) per king via kingExposureForTest (QP2), K2 (zero re-pins; the A2 (b)/A3 (b) phase-24 replacements per ADR-0068 d5 — check no number moved and the FENs are literal strings, per the ABC-270 page), mutants. S2 nps reported only (Orchestrator ruling).
- Note for the Architect (gap, not a bar): whether kingExposureForTest is the wanted export form.
- The SE edited plans/board.md on the branch; the Orchestrator owns the board — record it as a process gap (LOW); don't revert.
- Verdict PASS / PASS_WITH_GAPS / FAIL; your verdict signs UAT.
## Fences
tests and your records on that branch; no production src edits. No push, force, amend, rebase, merge into main. Leave nothing running.
## Publish
Sealed notes (task qe-ABC-270, contextRoot = the worktree's .grugops/context, `at` from `date -u`); queue moves; commit; ## Result + trace row; brief + claim to done/. Run `node tools/grugops/records-path-check.js --base main` before your last commit; it must exit 0.

## Result

**DONE: PASS_WITH_GAPS. The QE verdict signs UAT for `ABC-270`** on `grugops/ABC-270` (code `795a6b61`, `src/` `0f393c18`) against `main` `4b9c5357` (`src/` `4cb84035`, the cut's tree; unmoved, so one K0 set). Finished 2026-11-04T01:02:48Z by qe-e2e (claude-opus-5-5). Not pushed, not merged; the merge is human.

- **PREREG** `20261104T001924Z-qe-e2e-decision-f8ab73a7`, sealed and committed (`fb920c14`) before any QE timing: `ABC-274`'s form (B / C / H, reverse order, a `main`-copy control, void band [0.970, 1.030]), and `G6` with `qe-ABC-268`'s scripts unchanged, Tctl 60.0 kept.
- **K0: MET.** 7 / 7 exact (1 296 788 / 2 733 330; 404 930 / 926 005 / 1 692 669; 839 514 / 1 533 901) plus 4 door counts; cross-build 0 / 9 120.
- **K1: MET.**
  - (a) mirror: 0 / 368 264 at non-zero queen-on values.
  - (b) 0 / 4 840 290 `Object.is` misses.
  - (c) QE's 7 frozen pairs exactly 3 × per king in mg and eg, through `kingExposureForTest` (QP2 graded per king, so `QE-270-a` is closed). The other king is equal and QC8 stays still. Nets equal the frozen values, and there are 0 misses over 184 132 positions against the stated rule (seam and hot path).
  - (d) green.
  - (e) both twins green on `main` and the build, red with the term zeroed, FENs literal 4 / 4.
  - The source row is green.
- **K2: MET.** 0 re-pins (the diff was read row by row). `npm test` 2 588 → 2 604 / 2 604. 14 deep lanes as expected (G1 54 / 58, mate floor 0 / 163 and 0 / 189). Typecheck and lint exit 0.
- **K3 `G2`: MET.** R = 0.9911 (r 0.9932 / 0.9889; c 0.9947 / 0.9926; spread 0.0044).
- **K4 `G6`: MET.** Medians 9 / 9 (kiwipete) and 10 / 10 (position-6); every run ≥ 9; 0 WARN.
- **Reports:** S2 nps H / B 1.0054–1.0194; N8-LANE 9.46 → 9.34 s.
- **Mutants:** 7 / 7 QE mutants killed, both by QE's rule-based read and by the build's own file.
- **Gaps** (none blocking):
  - QE-270-d LOW (process): the Engineer moved `plans/board.md`. It was not reverted.
  - QE-270-e LOW (forward, Architect / `ABC-239`): the two bite rows zero only the base pair, so they turn red once a matching queen-on mg is freed. The fix is test-only.
  - QE-270-f INFO (Architect): `kingExposureForTest`'s form is `UNKNOWN - verify`. It scans queens itself, so it cannot see walk-only bugs, but the build's evaluate-net rows can. QE's view: keep it.
  - QE-270-g INFO: reports not taken in full.
- **Notes:** `…f8ab73a7` (PREREG), `…e132156d` (K3 / S2), `…70b240ad` (K4), `…aa889eb8` (K0 / K1), `…92aacc6f` (K2 / gates / mutants), `…0a3d2cb9` (gaps), `…e4da95d0` (verdict). Trace row in `plans/traceability.md`. The board move (In Review → UAT signed) is the Orchestrator's.
