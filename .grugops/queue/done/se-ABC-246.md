---
subtask: se-ABC-246
role: software-engineer
ticket: ABC-246
ref: .grugops/context/se-ABC-246/
branch: new grugops/ABC-246 from main (worktree .claude/worktrees/se-ABC-246)
width: one records-only BA/PM hop beside you (no vitest). Record load1 with any timing. Leave no process running.
---
# SE ABC-246 (XS, P3, test-only, UAT waived): two uci-clock-mode rows (hard stop 1 900; movetime over a clock 5 000) + SE-221-g comment
## Read
- The ticket page plans/tickets/ABC-246-*.md (A1–A5, Scope, Out of scope).
- qe-ABC-221 notes …8ad25906 (QE-221-a) and …c6f37a35 (plants HSCM, CLOCKWINSCM); se-ABC-221 …7896971d (SE-221-g).
- src/uci-session.ts parseGo; src/uci-session.test.ts ABC-221 block; src/engine.test.ts ABC-170 A2 block.
## Do
- A1/A2 rows in the ABC-221 describe block, stubbed chooseMove, as A5/A7's budget rows do.
- A3: apply HSCM and CLOCKWINSCM out of tree, each alone; record red/green; restore. Never commit a plant.
- A4: comment-only diff on src/engine.test.ts (figure derived at HARD_CEILING_MS 60 000, or drop the count).
- A5: gates via `npm run …`; `npm test` green, 0 skips; net rows +2. One G8 read is enough (not the QE gate); record load1.
## Fences
- Only src/uci-session.test.ts and the one comment in src/engine.test.ts. No production line (QE-221-b stays out). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. No host paths in committed files.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Scratch `se-246/`.
## Publish
Sealed notes (task `se-ABC-246`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. Done. Branch `grugops/ABC-246` (worktree `.claude/worktrees/se-ABC-246`, from main `832ff246`): code `3c5e05fd`, notes `f1bcbed6`. Not merged and nothing pushed. Test files only, no production line, UAT waiver holds.**

- **A1/A2:** two rows in a nested `ABC-246 (QE-221-a)` block, last inside `ABC-221`'s describe. Both use A7's stubbed form. `go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1` → `[1_900]`. `go wtime 900000 btime 900000 movestogo 40 movetime 5000` → `[5_000]`. Decision `…2f43204c`.
- **A3:** QE's plant strings, verbatim, each applied alone to an out-of-tree scratch copy and run on `src/uci-session.test.ts`. `none` passed 234/234. HSCM gave 1 red, A1 only (`[2400]` vs `[1900]`). CLOCKWINSCM gave 1 red, A2 only (`[22375]` vs `[5000]`). The file was restored and `cmp`-equal afterwards; nothing was committed. Observation `…8de958b6`.
- **A4:** `src/engine.test.ts` loses 1 comment line and gains 4, all inside one JSDoc. The comment now reads about 60 000 readings at `HARD_CEILING_MS` 60 000 on a 1 ms step, and says the node budget ends the search after about 10. I measured 9 readings.
- **A5:** `npm run lint` / `typecheck` / `build` exit 0. `npm test` ran 63 files, 2 366 passed, 0 failed, 0 skipped, in 8.62 s at load1 0.39 (0.96 after). That is one informal read, not `G8`. Skip integrity and lane inventory (63 = 63) both report "No findings.". Net rows +2: `uci-session.test.ts` went 232 → 234, so the lane went 2 364 → 2 366. The `uci-session.test.ts` diff removes 0 lines. Observation `…851629b3`.
- **SE-246-a (INFO, not edited):** the next `ABC-170` A2 comment says "6 746 nodes". The same call reads 6 893 at depth 2 today, and the row's bounds hold. Left for the next ticket that edits that block. Artifacts and handoff are in `…0d04bf8a`.
- **Publishing:** `propose_note` was not surfaced, so I used its handler (`handleProposeNote` → `admitAndAppend`) with trusted root = worktree. 4/4 were admitted, and read back gives 4.
- **QE owes:** a whole-lane A3 re-read and `G8` on a clear host. The head median feeds `ABC-248`'s base.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-246 | uci-clock-mode: rows pin the hard stop (1 900) and movetime over a clock (5 000); SE-221-g comment corrected (test-only) | EPIC-009 | — | NFR-008 (2 stubbed rows, 0 real-engine); ADR-0052 D2/D4; no production line | grugops/ABC-246 @ 3c5e05fd (+ notes f1bcbed6): src/uci-session.test.ts (+2 rows, ABC-246 block in ABC-221), src/engine.test.ts (ABC-170 A2 comment only) | A1/A2 green; HSCM reds A1, CLOCKWINSCM reds A2 (out of tree); npm test 63 files / 2 366 pass, 0 skipped (+2), 8.62 s at load1 0.39; G8 pending QE | waived (zero production lines) | — | In Review (branch, not merged; QE A3 re-read and G8 pending) |
