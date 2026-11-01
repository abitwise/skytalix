---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T15:51:11Z
subtask: se-ABC-255
role: software-engineer
ticket: ABC-255
ref: .grugops/context/se-ABC-255/
branch: new grugops/ABC-255 from main (worktree .claude/worktrees/se-ABC-255)
width: parallel coding allowed (owner 2026-11-01); test/build/engine runs serialized — see Host rule. QE hops may hold the lock for timing windows.
---
# SE ABC-255
## Read
- plans/tickets/ABC-255-m0-a-self-play-sprt-lane-on-the-rating-harness-stops-h1-on-a-known-gain-and-h0-on-an-identical-pair.md in full (acceptance, scope, fences). ADR-0056 (D5 fixed-count rule, C3″, smoke, rule R-TC). EPIC-010 top blocks.
## Host rule (binding)
- **Wrap every vitest / npm test / npm run build|lint|typecheck / engine / cutechess run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <command>`** — no two hops run tests at once; never hold the lock while idle. Single-file vitest needs NODE_OPTIONS=--max-old-space-size=400. Worktree needs npm ci.
- Any timing or real game run you record: under the lock, with load1 and foreign processes logged. A foreign vitest from another repo recurs; never kill it.
- Any single run estimated over 60 min: STOP and report (owner rule).
## Do
- Implement the ticket to its acceptance; gates green, 0 skips; skip-integrity and lane inventory clean. A STOP if the page cannot be met as written.
## Fences
- Only the files the ticket's scope names (tools/ and its tests; 0 lines under src/ or data/). No push, force, amend, rebase, or merge into main. No board edits. Never bare npx or npm exec. Never `while pgrep -f`. Thermal stop: Tctl median > 85 °C. Leave no process running. Scratch `/tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/se-255/`.
## Publish
Sealed notes (task `se-ABC-255`, contextRoot = worktree; never the plugin cache), commit, `## Result` + 10-cell trace row here, brief + claim to done/.

## Result

**2026-11-01, Software Engineer. Done. Branch `grugops/ABC-255` (worktree `.claude/worktrees/se-ABC-255`, from main `8f2fc9b5`): claim `65e74767`, code `78cd2415`, notes `ba9e4a98`. Not merged; nothing pushed. No game, no engine, no cutechess run: A3, A4 and A5 are QE's (host ALONE).**

- **A1 MET (dry run).** `d … --budget-ms 100 --rounds 50 --concurrency 1 --dry-run` prints `st=0.1 timemargin=50` on both engines, `-games 2 -rounds 50 -concurrency 1`, `openings.epd` `order=sequential` `-repeat`; `--rounds 200` the same with `-rounds 200`. The default and 3 000 / 2 500 / 2 000 / 1 500 / 1 000 are byte-equal to base. Observation `…5333bc23`.
- **A2 MET (dry run).** `r … --budget-ms 500 --rounds 5 --concurrency 1 --dry-run`: skytalix `st=0.5 timemargin=50` with no `option.`; Stockfish `st=0.5 timemargin=2000 option.UCI_Elo=1650`; `-rounds 5 -games 2 -concurrency 1`. `r` without the flag (4 shapes) and `rpair` (3 shapes) are byte-equal to base, with `Skill Level=6` intact. `r --budget-ms` 4000 / 100 / 1000 exit 1 ("r takes only 500"). `d --budget-ms 500` and `rpair --budget-ms 500` exit 1, as in base.
- **A3, A4, A5:** owed by QE. **A8:** owed by QE (the reading).
- **A6 MET.** `git diff --name-only 8f2fc9b5 78cd2415 -- src/ data/` is empty. The skytalix engine group has the same keys in the A1 and A2 vectors as today (a pair-check row asserts this).
- **A7 MET.** Lint, typecheck and build exit 0 (the first lint was red on biome format in pair-check.ts; fixed with `--write`, format only). `npm test` ran 63 files / 2 362 passed / 0 skipped. Skip-integrity and lane-inventory both report "No findings.". 0 new lane rows. pair-check is 32/32 (+7), and four mutations each turn it red (3, 1, 1, 2). The diff touches `tools/rating/` only, plus the queue and context records. Observation `…8b930153`.
- **Design** (decision `…8953bec7`): `timemarginMs` is a fixed 50 ms at 100 and 500 and 5 000 − budget elsewhere. `r` takes `--budget-ms 500` only. `machine.txt` gets a `control:` line only for the short controls. Artifact pointer: observation `…e65b673f`. Notes are published with `admitAndAppend`, contextRoot = the worktree's `.grugops/context`, 4/4 sealed.
- **Host:** every dry run, gate and mutation ran under the host lock. load1 was 2.4 on the first gate run and 7.0–7.7 on the rerun (foreign hops; I took no timing read). No process is left running.
- STOP: none.

### Trace row (10 cells, header order)

| ABC-255 | the rating harness plays the owner's reads: d at 100 ms (100 / 400 games, C2′ / C3″) and r --budget-ms 500 (S′ smoke); every other print byte-equal | EPIC-011 | ADR-0056 C2′, C3″, S′, R-TC | NFR-008 (0 lane files, 0 lane rows); R-TC item 4 (0 lines under src/ data/) | grugops/ABC-255 @ 78cd2415 (+ notes ba9e4a98): tools/rating/rating.ts (timemarginMs, SHORT_MARGIN_MS, D_BUDGETS_MS + 100, r --budget-ms 500), tools/rating/pair-check.ts (+7 tests) | pair-check 32/32 (+7; 4 mutations red); dry runs byte-equal to base on 14 shapes; npm test 63 files / 2 362 pass, 0 skipped; A3–A5 pending QE | — (tools only, no UAT; QE verdict closes) | — | In Review (branch, not merged; A3–A5, A8 pending QE) |
