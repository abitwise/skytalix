---
subtask: se-ABC-220
role: software-engineer
ticket: ABC-220
ref: .grugops/context/se-ABC-220/
branch: new grugops/ABC-220 from main 8e1cdda5 (worktree .claude/worktrees/se-ABC-220)
width: shared — NO timed reads (another SE runs beside you)
---
# SE ABC-220: simple-tournament over UCI (TimeMode), T 22 s, min(T, C), 22 s ceiling (ADR-0052 ACCEPTED)
## Read
The ticket (all FOLDED blocks, A1–A14, § NFR triggers, § Test notes), ADR-0052 (ACCEPTED, D1–D7), ADR-0044, ADR-0027,
src/uci-session.test.ts's virtual-clock pattern, how se-ABC-230 built.
## Do
- Build A1–A10, A12's structure (0 new real-clock rows in the default lane) and A13 on the virtual clock.
- Write the A11 (ENGINE_DEEP) and A14 (opt-in real child) rows but **do not run them**, and do not time A12's
  wall: they need the host ALONE and QE runs them. Say in your notes that they are unrun.
- Owed at merge, your part: D5's latency sentence in src/uci-session.ts's header (Test notes 4).
- Gates via `npm run …` (lint, typecheck, unit, build); npm test count.
- se-ABC-241 builds in parallel and may also touch src/uci-session.ts; whoever merges second rebases. Do not coordinate
  by editing its branch.
## Fences
Only the files the ticket/ADR name. Never push, force, amend, rebase, merge into main. No board edits. Never bare
`npx`/`npm exec`. No host paths in commits. Scratch in scratchpad `se-220/`.
## Publish
Sealed notes (task `se-ABC-220`, `at` from `date -u`), commit on the branch, `## Result` + 10-cell trace row here,
brief + claim to done/ (tracked copy on your branch if the guard refuses).

## Result

**2026-10-30, Software Engineer. Done to the brief's limits. Branch `grugops/ABC-220` from main `8e1cdda5`. The code is in `68ba364c`; the notes, raw files and this brief follow in the next `docs(se-ABC-220)` commit. Not merged, nothing pushed. No timed reads: A11, A14 and A12's wall are written or structured, but UNRUN (QE's, run ALONE).**

- **Build** (decision `…80ed6a2f`): `src/uci-session.ts` only.
  - The `TimeMode` combo: `level | simple-tournament`, a frozen tuple, an exact value match, one `info string` on a refusal, kept across `ucinewgame`.
  - `safeClockShare` = D2's C (1 000 / 100, floor 1).
  - D3's rule: `movetime x` → `min(x, T)`, a clock → `min(T, C)`, no time token → T = 22 000 = its ceiling.
  - In a mode, `Skill Level` is not read: no cap and no blunder draw. `TimeMode level` is base.
  - D5's latency sentence is in the header.
  - No new file. `engine.ts` and `levels.ts` are untouched.
- **Rows:** A1–A10 and A13 are built and green, on the virtual clock. A12 is structural: the default lane gains 0 real-clock rows. A11 (`ENGINE_DEEP`, `src/uci-session.test.ts`) and A14 (`UCI_DEEP`, `src/uci.real-engine.test.ts`) are written and UNRUN.
  - Figures: A3 leaves 18 760 ms (97.9 % used). A4 uses 83.2 %. A5 leaves 166 517 ms after move 40. A7 leaves 1 069 ms (also at `tc=40/60`). A6 gives 22 000 on every shape.
  - 13 mutants were planted, and each turned a row red; one of them only after a hard-stop row was added.
  - A8 out of tree: base = head = head with `level` (`7d319f711ff6e2a5`, 1 839 lines). The non-vacuity check is on a cut run.
- **Gates** (observation `…e8314efb`): lint, typecheck and build exit 0. `npm test` 63 files, **2 271 passed** (base 2 219, so +52), 0 failed, 0 skipped. Skip integrity and lane inventory: `No findings.`
- **Findings** (observation `…a76bc514`):
  - **F1 (medium):** A14's "≤ 100 ms after bestmove" cannot be read in a `spawnSync` lane (`ABC-173` C2). The rows read order and no-loss only.
  - **F2 (low):** D5's bound is 22 s read to the whole second.
  - **F3 (low):** AGENTS.md needs the A11 lane command (Scribe).
  - **F4 (info):** the file is shared with `se-ABC-241`.
- **Re-pins:** `ABC-167 A1` and `ABC-171 A1` (the `uci` reply gains the `TimeMode` line).
- **Publishing:** 4 notes admitted through the plugin's `context-io` `admitAndAppend`. The artifact record is an observation (`…e778609b`) because no §14 gate has run. No bare `npx`.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-220 | `simple-tournament` over UCI (`TimeMode` combo): T = 22 000 ms = its ceiling; `min(x, T)`, `min(T, C)`, T; Skill Level not read in a mode; levels 1–7 unchanged | EPIC-009 | ADR-0052 (D1–D3, D7, D8; amended 2026-10-30) | NFR-004 22 s (A6 exact, A11 unrun); ADR-0044 D5 ≤ 22 s accepted, A13 green, A14 unrun; NFR-008 A12 structural, wall unread | grugops/ABC-220 @ 68ba364c: src/uci-session.ts | src/uci-session.test.ts (+52, A11 deep unrun), src/uci.real-engine.test.ts (A14 deep unrun); npm test 63 files / 2 271 pass, skips 0 | — (UAT owed; QE verdict signs) | — | In Review (branch, not merged; A11/A14/A12 wall pending QE) |
