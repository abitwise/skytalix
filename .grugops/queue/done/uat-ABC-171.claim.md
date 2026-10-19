---
subtask: uat-ABC-171
role: qe-e2e
claimed_by: qe-e2e (claude-opus-5-5, subagent of orchestrator)
claimed_at: 2026-10-19T13:32:59Z (claimed/uat-ABC-171/ taken by the Orchestrator before dispatch, at e4150359)
started_at: 2026-10-19T13:35:49Z
done_at: 2026-10-19T15:00:15Z
branch: grugops/uat-ABC-171 (from grugops/ABC-171 @ 5dee231c)
worktree: /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-uat-ABC-171 (kept)
base: 5dee231c
commit: cc49bf0e
result: >-
  UAT conducted — PASS_WITH_GAPS on the observable half; NOT accepted, owner's word owed.
  S0–S9 + X1 11/11 PASS (4061/4061 checks) at 5dee231c, twice and byte-identical.
  S10 (ABC-167's 13 UAT scenarios) 13/13 (2876/2876), output identical to ABC-167's recorded run except the uci lines.
  Virtual clocks only (no timing reading; N8-LANE OWED, R-171-1).
  0 defects; INFO UAT-171-a..d; RUN-0's 5 FAILs were my two errors, disclosed.
  Controls C1–C12 caught, C13 equivalent.
  Gates green: 1962/1962, last-run.json success true, skip 0 No findings, merge-tree clean vs e4150359 and d5c033d5.
  qe-hop-integrity --ticket ABC-171 covered.
  Not merged, not pushed, no board move.
---

QE/E2E, subtask `uat-ABC-171`, by the owner's delegation (`…2b7f4c88`). **The owner's word signs. This result
does not.** The full report, the scenario → criterion table, the gates, the checklist and the trace row are in
`done/uat-ABC-171.md`. The pack and the notes are on `grugops/uat-ABC-171` @ `cc49bf0e`, under
`.grugops/context/uat-ABC-171/`.

Owner's one-word checklist:
1. Do S1–S10 describe what a UCI GUI should get?
2. Do you accept the ruled readings (f1–f4)?
3. Do you accept that ABC-168 proves the binary, the book file, a GUI, real time, varied openings and the warning
   binding, and that ABC-174 proves the re-cut levels and `default 5`?
4. Do you accept 4061/4061 + 2876/2876, with N8-LANE OWED?
5. **Accept or reject ABC-171?**

Trace row:
| ABC-171 (UAT) | `OwnBook` + `Skill Level` over UCI. QE-conducted UAT by the owner's delegation (`…2b7f4c88`), subtask `uat-ABC-171`, at tip `5dee231c`. S0–S9 + X1 11/11 PASS, 4061/4061 checks, through `createUciSession`/`handleLine` on virtual clocks, with the real `createBookProbe` (counted `read`/`warn`) and a counted `random`, a harness in the GUI's seat (option lines; setoption good/bad/case-blind; book on/read-once/off/9 bad books; levels 1–5 budgets, D11 seed oracle 64/64 per blunder level, dropped limits; infinite on a book hit; no reseed; a level-1 and a level-3 game vs a scripted opponent). S10: ABC-167's 13 UAT scenarios 2876/2876, output identical to its recorded run except the `uci` lines. Two runs byte-identical each. Controls C1–C12 caught, C13 equivalent | EPIC-007 / ADR-0044 D3, D10, D11 | — | NFR-004 PASS (virtual, engine path); NFR-008 N8-LANE OWED (R-171-1); no timing reading | unchanged: `src/uci-session.ts` (production, +97/−15) | Harness under `.grugops/context/uat-ABC-171/probe/` (not a lane row). Lane 59 files / 1962 green; skip 0; integrity "No findings."; merge-tree clean vs main `e4150359` and `d5c033d5` | **UAT conducted — owner's word owed** (notes `…f340102a`, `…e7b71b15`, `…f59a723d`, `…3cd487f4`, `…be4d3860`, `…b2794b17`) | — | Branch `grugops/uat-ABC-171` @ `cc49bf0e`; not merged, not pushed; no board move. Binary/book file/GUI/real time/varied openings/warn → `info string` are ABC-168's; re-cut levels + `default 5` are ABC-174's. INFO `UAT-171-a` (blunder-path virtual time = clock reads), `-b` (mated position draws 1 seed), `-c` (`default 3` literal, pin with DEFAULT_LEVEL at ABC-174), `-d` (warn stays in `warn`, QE-171-e); RUN-0 errors disclosed |
