---
subtask: se-ABC-221
role: software-engineer
ticket: ABC-221
ref: .grugops/context/se-ABC-221/
branch: new grugops/ABC-221 from main (worktree .claude/worktrees/se-ABC-221)
width: shared with two records-only hops (Architect, BA/PM); take timing reads only with no vitest from other hops running
---
# SE ABC-221 (M, P3, milestone 2): uci-clock-mode over UCI TimeMode
## Read
The ticket page (every dated block; A1–A12; NFR triggers; Test notes 1–5), ADR-0052 (ACCEPTED; D3–D7), ADR-0045 § AMENDMENT A3,
ADR-0044 D3/D4/D5, ADR-0046 § Addendum R1–R4, ABC-220's build and QE notes (.grugops/context/se-ABC-220*/, qe-ABC-220/), QE-244-a carry
(do not make the ABC-230/241 rows shallower).
## Do
- Build A1–A12 as the ticket and ADR-0052 word them. HARD_CEILING_MS moves to 60 000 at this build, per the owner's Q5. That is the one clamp move; no other bound moves.
- Fix the SEC-220-b comment only (Test note 5).
- Period rows A2–A4 stay on the stubbed chooseMove. One R1 census line per real-engine row; time-blind real-engine rows take their R2 step, read per search.
- Gates via `npm run …`; report the test count. Take an informal G8 wall with the host clear: G8 now reads 9.41 s, so +0.2 s crosses 9.6 s and fires tranche 2. Report it; don't fix it. Above 10 s, STOP and hand back.
- Run ENGINE_DEEP A10 and UCI_DEEP A11 row 2 once each, with no other vitest running.
## Fences
- Only src/ files the ticket names, plus their tests. No records edits; the ADR folds are BA/PM's at merge.
- No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. No host paths.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Scratch `se-221/`.
- STOP if the ADR cannot be met as worded.
## Publish
Sealed notes (task `se-ABC-221`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-10-31, Software Engineer. Done. Branch `grugops/ABC-221`, from `main` `d58f2d77`. Code `c48a6f83`; the notes, brief and claim are in the next commit. Not merged, nothing pushed.**

- **Build:** in `src/uci-session.ts`, `TIME_MODES` gains `uci-clock-mode`. `CLOCK_MODE_CEILING_MS` is 60 000 and `CLOCK_MODE_MAX_BUDGET_MS` is 59 500. D4's rule shares one `cap` with D3: `movetime x` → `min(x, 59 500)`, a clock → `min(59 500, C)`, no token → T. In `src/engine.ts`, `HARD_CEILING_MS` goes 32 000 → 60 000, with its comments' numbers; that is the only clamp move. The `SEC-220-b` change is a comment only. Decision `…ac6abd6a`.
- **Rows:** A1–A9, A11 row 1 and A12 are in the default lane. The period rows are stubbed. The 3 real-engine rows all read time (class P), so no R2 step is owed. A10 is in `ENGINE_DEEP` (a `--expose-gc` child) and A11 row 2 in `UCI_DEEP`. Re-pins cover the three-value line and the 60 000 clamp, including `src/levels.test.ts` clause B (SE-221-c). One `ABC-220` row was removed ("not offered"). Census `…563fc63b`.
- **Gates:** lint, typecheck and build exit 0. `npm test`: 63 files, **2 363 passed**, skips 0 (base 2 333). Skip-integrity and lane-inventory: no findings. All 9 SE plants were killed.
- **Informal `G8`** (b h h b b h, host clear): base median 9.01 s, head median 9.17 s (+0.16 s), projecting to 9.57 s on QE's 9.41 s. That is under 9.6 s and under 10 s, but `UNKNOWN - verify`; the new rows cost 39 ms in-thread. Readings `…af63269c`.
- **Deep:** `ENGINE_DEEP` A10 PASS. Max wall 59 501.1 ms ≤ 60 000; max depth 13, so the tripwire is not reached; heap growth ≤ +0.12 MiB; arrayBuffers 4.51 MiB, flat. Run 2 failed on my own extra wall ≥ 59 500 bound (`Date.now` granularity). I fixed it to the engine's `time` before the commit, and run 3 passed. `UCI_DEEP` A11 row 2: 4/4 passed; the whole lane 13/13.
- **Findings** `…7896971d`: SE-221-a LOW. A6's "≥ 117 s" belongs to a different shape: as worded, 17 205 ms are left after move 80. The bound is met either way, and both shapes are pinned. BA/PM to correct at the fold. SE-221-b..g are INFO. UAT is owed; the QE verdict signs it.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-221 | Under a UCI clock, TimeMode uci-clock-mode spends the clock through C with a 59.5 s cap under a 60 s ceiling and a hard stop; the engine clamp moves to 60 000 | EPIC-009 | ADR-0052 D1, D2, D4, D6–D8 (accepted); ADR-0045 § AMENDMENT A3 (fold owed); ADR-0044 D3/D4/D5 folds owed; ADR-0046 § Addendum R1–R4 | NFR-004 60 s (A10 max wall 59 501.1 ms); NFR-009 flat at 59.5 s (heap +0.12 MiB, arrayBuffers 4.51 MiB); NFR-008 informal head 9.17 s (base 9.01 s), G8 owed; R1 census 3 class-P rows (12, 6, 1 reads) | grugops/ABC-221 @ c48a6f83: src/uci-session.ts, src/engine.ts, src/uci-session.test.ts, src/uci.real-engine.test.ts, src/engine.test.ts, src/levels.test.ts | npm test 63 files / 2 363 pass, skips 0; 9 SE plants killed; ENGINE_DEEP A10 pass; UCI_DEEP 13/13 | UAT owed (prod lines in src/uci-session.ts, src/engine.ts); QE verdict signs | — | In Review (branch, not merged; QE, A14b probe and G8 owed) |
