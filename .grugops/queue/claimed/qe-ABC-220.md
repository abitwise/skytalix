---
subtask: qe-ABC-220
role: qe-e2e
ticket: ABC-220
ref: .grugops/context/qe-ABC-220/
branch: grugops/ABC-220 @ fbab54ff (code 68ba364c + main a649fbc4 merged in 9ac8b365); QE commits on new grugops/qe-ABC-220 from fbab54ff (worktree .claude/worktrees/qe-ABC-220)
width: ALONE (A11 ~2 min, A12 wall, A14b probe) (host clear)
---
# QE ABC-220: Q-SET review, gates, A11 / A12 / A14a / A14b ALONE, UAT
## Read
The ticket (A1–A14 as amended by arch-ABC-220-a14: A14a lane row, A14b probe R1–R3, Test notes 2 and 5), ADR-0052
(D1–D9 + § Status 2026-10-30), se-ABC-220 notes (`…80ed6a2f`, `…e8314efb`, `…a76bc514`), se-ABC-220-main notes
(`…e8a008f6`, `…837206e7`), arch-ABC-220-a14 notes (`…5ecf3a59`, `…ca075632`), the ABC-168 A6 probe
(`.grugops/context/qe-ABC-168/probe/a6-probe.mjs`) as A14b's starting point.
## Do
- PREREG first, sealed and committed before any timed read.
- Q-SET: review the SE's rows against A1–A10, A13; add rows where thin; reproduce 2–3 of the SE's 13 mutants.
- A8: `git diff a649fbc4..fbab54ff -- src/engine.ts src/levels.ts` empty; levels 1–7 identity holds.
- Gates via `npm run …`; npm test + skip integrity + lane-inventory; deep lanes one file at a time (local vitest entry, heap 400).
- ALONE, each separately, wait-clear before each: **A12** npm test wall ≤ 10 s at load1 ≤ 8 (NFR-008; note headroom);
  **A11** `ENGINE_DEEP` lane in src/uci-session.test.ts — each of 5 positions < 22 500 ms; record max and excess over
  22 000 vs AR-NFR004-A (≤ ~31 ms); **A14a** `UCI_DEEP` lane src/uci.real-engine.test.ts; **A14b** the async probe in
  plain node under `.grugops/context/qe-ABC-220/probe/`, one counted run, R1–R3, record host/Node/load1/sha.
- G8 base (a649fbc4) vs head in this session.
- No smoke (ABC-222 is the real-clock games ticket). UAT owed: the QE verdict signs it.
## Fences
No src/, tools/, data/ edits. Never push, force, amend, rebase, merge into main. No board edits. Never bare `npx`/`npm exec`.
No host paths in commits. Scratch `qe-220/`. Thermal: median Tctl > 85 °C during A11 → STOP.
## Publish
Sealed notes (task `qe-ABC-220`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
