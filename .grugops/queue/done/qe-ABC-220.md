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

## Result

**2026-10-30, QE/E2E. Verdict: PASS_WITH_GAPS, with no blocking gap. A1–A14 are met (A14 = A14a + A14b). The gates, A11, A12 and G8 are met. Under test note 3 and the 2026-10-22 ruling, this verdict signs UAT. The merge is a human's.**

- **Branch:** `grugops/qe-ABC-220`, from `fbab54ff`. PREREG `4b2ad26e`, records `0ab9ddab`, and this brief in the next commit. QE merged nothing, pushed nothing, and made no `src`, `tools` or `data` edit.
- **Notes:**
  - PREREG `20261030T144810Z-qe-e2e-decision-8ad475ba`, sealed and committed before any timed read.
  - Checks `20261030T152147Z-qe-e2e-observation-9c6cd0b0`, timing `…-58af5b6a`, gaps `…-c6bdd364`, artifacts `…-449799a6`, verdict `…-decision-7a09c5e1`.
  - `readContext` reads back 6. `qe-hop-integrity --ticket ABC-220`: covered.
- **A8:** `git diff a649fbc4..fbab54ff -- src/engine.ts src/levels.ts` is empty. QE-A8 replays the real base code: 4 200 rows (TimeMode unset and `level`, levels 1–7), 0 differences.
- **QE rows** (QE's own oracle and fixtures, plain node, with a `registerHooks` budget recorder): **19 / 19 PASS.**
  - A6a: 3 000 random `go` lines all match D2/D3, and none goes over 22 000.
  - A3a covers the side to move for both colours.
  - A10a refuses 8 hostile values, including `__proto__`.
  - A13a–c: queued `isready`/`stop` are answered in order.
- **Mutants:**
  - The SE's QM1 (increment halved), QM2 (C not capped by T) and QM3 (case-insensitive value) are reproduced, red 1, 5 and 2 in `npm test`.
  - **The new QM4 (the mode reads `winc` for either side) stays green in `npm test`, 2 297 / 2 297.** Only QE-A3a and QE-A6a catch it (QE-220-a).
- **Gates:**
  - lint, typecheck and build exit 0. `npm test`: 63 files, 2 297 / 2 297, skips 0. Skip integrity and lane inventory print `No findings.`
  - All 14 deep lanes are green, 604 / 604, run one file at a time. A11 and A14a are below.
- **A12** (ALONE): `npm test` wall **9.69 s** at load1 0.41, headroom 0.31 s. The default lane gains 0 real-clock rows.
- **A11** (ALONE, `ENGINE_DEEP`, 206 / 206):
  - Walls: 22 000.5, 22 001.0, 22 000.5, 21 999.4 and 22 000.1 ms, each < 22 500 ms.
  - **Max 22 001.0 ms, excess 1.0 ms** against `AR-NFR004-A`'s ≤ ~31 ms.
  - Tctl median 73.4 °C, max 75.3 °C, no thermal stop.
- **A14a** (ALONE, `UCI_DEEP`): 9 / 9 green, including the 4 A14 rows. Spawn to exit 2 070 ms.
- **A14b** (ALONE, one counted run, `probe/a14b-probe.mjs`): **R1 0.38 ms met, R2 met** (`isready` written at +100.43 ms, `bestmove` at +2 002.02 ms), **R3 met** (2 `readyok`, 1 `bestmove`, the busy `readyok` the next line). Exit 0. Recorded: AMD Ryzen AI 9 HX 370, Linux 7.0.0-42, Node v26.12.1, load1 1.03, tip `4b2ad26e` (src tree = `fbab54ff`'s).
- **G8:** head **9.73 s**, base 9.64 s (+0.09 s), interleaved b h h b b h. MET.
- **Gaps** (all non-blocking):
  - **QE-220-a LOW:** no src row pins the side-to-move increment in the mode branch (QM4 survives). Follow-up: move QE-A3a's four asymmetric rows into `uci-session.test.ts`.
  - QE-220-b INFO: the 21 999.4 ms wall is `Date.now` granularity.
  - QE-220-c INFO: `NFR-008` headroom is 0.27–0.31 s.
  - QE-220-d INFO: degenerate numbers (−5, 0, NaN, 400 digits) give no budget over 22 000. Pre-existing parsing.
  - QE-220-e INFO: a clock for the other side only gives T.
  - QE-220-f INFO: a spaced `Time Mode` name is ignored as unknown.
- **For Security/NFR:**
  - `NFR-004` 22 s: A6 is exact, and A11's overshoot is 1.0 ms.
  - The busy-latency entry: measured worst case ≈ 22 001.4 ms (budget + overshoot + drain 0.38 ms), under < 22 500 ms. One `readyok` per `isready`, in order.
  - ASVS L1: an exact frozen tuple and a printable echo, with no new input class.
  - `NFR-008` headroom (QE-220-c).
  - The host is the Linux reference (SEC-228-a).
- **Queue:** QE worked only in its worktree. This tracked `done/` copy of the brief and its claim.md is on the QE branch. The main checkout's `claimed/qe-ABC-220.*` was not touched.
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-220 (qe-ABC-220) | QE PASS_WITH_GAPS at fbab54ff: A1–A14 met on SE rows + 19 QE rows (3 000-line D2/D3 oracle, 0 over 22 000; base identity 4 200 rows 0 diffs); A11 max 22 001.0 ms (excess 1.0 ms); A14a 9/9; A14b R1 0.38 ms, R2 busy, R3 met; QE-220-a LOW side-to-move increment unpinned in src (QM4 survives npm test) | EPIC-009 | TimeMode simple-tournament over UCI, ADR-0052 D1–D3, D7–D9 (amended 2026-10-30) | NFR-004 22 s: A6 exact, A11 overshoot 1.0 ms vs AR-NFR004-A ~31 ms; NFR-008 A12 9.69 s, G8 9.73 s (+0.09 s), headroom 0.27–0.31 s; D5 busy latency ≈ 22 001.4 ms < 22 500 ms; Tctl A11 73.4 / 75.3 °C | grugops/qe-ABC-220 @ 0ab9ddab (+ this brief; on grugops/ABC-220 fbab54ff; code 68ba364c) | npm test 63 files 2 297/2 297, skips 0; 14 deep lanes 604/604 + A11 206/206 + A14a 9/9; 4 mutants (QM1–QM4); .grugops/context/qe-ABC-220/notes/ (6) + probe/ + raw/ | signed by the QE verdict (PASS_WITH_GAPS) | — | In Review → In Security/NFR (NFR-004 text, NFR-011 accepted-risk entry, AR-NFR004-A at 22 s) → merge (human) |
